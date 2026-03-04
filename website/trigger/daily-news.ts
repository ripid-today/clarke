import { schedules } from "@trigger.dev/sdk/v3";
import { adminDb } from "@/lib/firebase/admin";
import { Timestamp, FieldValue } from "firebase-admin/firestore";
import Anthropic from "@anthropic-ai/sdk";
import Parser from "rss-parser";
import * as fs from "fs";
import * as path from "path";

// ─── Types ────────────────────────────────────────────────────────────────────

interface NewsSource {
  id: string;
  name: string;
  rssUrl: string;
  category: "vietnam" | "world";
}

interface ArticlePayload {
  title: string;
  slug: string;
  content: string;
  description: string;
  category: "vietnam" | "world";
  sourceUrl: string;
  sourceName: string;
  publishedAt: number; // Unix seconds
}

// ─── Clients ──────────────────────────────────────────────────────────────────

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const rssParser = new Parser({
  customFields: {
    item: [["content:encoded", "contentEncoded"]],
  },
  headers: {
    "User-Agent":
      "Mozilla/5.0 (compatible; Clarke-NewsBot/1.0; +https://clarkes-library.vercel.app)",
  },
  timeout: 15000,
});

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getYesterdayRangeGMT7(): { start: Date; end: Date } {
  const now = new Date();
  const gmt7Offset = 7 * 60 * 60 * 1000;
  const nowGMT7 = new Date(now.getTime() + gmt7Offset);

  const yesterdayStartGMT7 = new Date(nowGMT7);
  yesterdayStartGMT7.setUTCHours(0, 0, 0, 0);
  yesterdayStartGMT7.setUTCDate(yesterdayStartGMT7.getUTCDate() - 1);

  const yesterdayEndGMT7 = new Date(yesterdayStartGMT7);
  yesterdayEndGMT7.setUTCHours(23, 59, 59, 999);

  return {
    start: new Date(yesterdayStartGMT7.getTime() - gmt7Offset),
    end: new Date(yesterdayEndGMT7.getTime() - gmt7Offset),
  };
}

function toSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .substring(0, 80);
}

function toDateString(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

async function summarizeArticle(
  title: string,
  content: string,
  sourceName: string,
  sourceUrl: string,
  publishedAt: Date,
  category: "vietnam" | "world"
): Promise<string> {
  const excerpt = content.substring(0, 3000);
  const prompt = `You are a financial analyst. Summarize this ${
    category === "vietnam" ? "Vietnam" : "global"
  } news article for a Vietnam-based investor interested in gold, silver, and Vietnamese stocks.

Source: ${sourceName} | Published: ${publishedAt.toISOString()}
Title: ${title}

${excerpt}

Write in English, 3-5 paragraphs using this structure:
## Summary
[What happened in 1-2 sentences]

## Investment Implications
[Impact on Vietnam gold/silver/stocks/macro - be specific]

## Key Data Points
[Bullet list of numbers, rates, percentages if present; write "None reported" if no data]

Source: [${sourceName}](${sourceUrl})`;

  const response = await anthropic.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 800,
    messages: [{ role: "user", content: prompt }],
  });

  const block = response.content[0];
  return block.type === "text" ? block.text : "";
}

async function processSource(
  source: NewsSource,
  yesterdayRange: { start: Date; end: Date }
): Promise<ArticlePayload[]> {
  const feed = await rssParser.parseURL(source.rssUrl);
  const articles: ArticlePayload[] = [];

  for (const item of feed.items || []) {
    const pubDate = item.pubDate ? new Date(item.pubDate) : null;
    if (!pubDate || pubDate < yesterdayRange.start || pubDate > yesterdayRange.end) continue;

    const title = item.title || "Untitled";
    const link = item.link || "";
    const rawContent =
      (item as { contentEncoded?: string }).contentEncoded ||
      item.content ||
      item.summary ||
      "";

    let summary = "";
    try {
      summary = await summarizeArticle(
        title,
        rawContent || title,
        source.name,
        link,
        pubDate,
        source.category
      );
    } catch (err) {
      console.error(
        `  Claude error for "${title}":`,
        err instanceof Error ? err.message : err
      );
      summary = `## Summary\n${item.summary || title}\n\n## Investment Implications\nSee original article for details.\n\n## Key Data Points\nNone reported.\n\nSource: [${source.name}](${link})`;
    }

    const dateStr = toDateString(pubDate);
    const slug = `${source.id}-${toSlug(title)}-${dateStr}`;
    const rawDescription = (item.summary || rawContent || title)
      .replace(/<[^>]+>/g, "")
      .trim();
    const description = rawDescription.substring(0, 200);

    articles.push({
      title,
      slug,
      content: summary,
      description,
      category: source.category,
      sourceUrl: link,
      sourceName: source.name,
      publishedAt: Math.floor(pubDate.getTime() / 1000),
    });
  }

  return articles;
}

// ─── Firestore write ──────────────────────────────────────────────────────────

async function ingestArticles(
  folderId: string,
  folderPath: string[],
  articles: ArticlePayload[]
): Promise<{ created: number; updated: number; errors: string[] }> {
  let created = 0;
  let updated = 0;
  const errors: string[] = [];

  for (const article of articles) {
    try {
      if (
        !article.title ||
        !article.slug ||
        !article.content ||
        !article.category ||
        !article.sourceUrl ||
        !article.sourceName
      ) {
        errors.push(`Article "${article.slug}": missing required fields`);
        continue;
      }

      const publishedAtTimestamp = Timestamp.fromMillis(
        (article.publishedAt || Date.now() / 1000) * 1000
      );
      const description = (article.description || article.content.replace(/[#*`\[\]]/g, ""))
        .trim()
        .substring(0, 200);
      const wordCount = article.content.split(/\s+/).length;
      const readingTime = Math.ceil(wordCount / 200);

      const existing = await adminDb
        .collection("articles")
        .where("folderId", "==", folderId)
        .where("slug", "==", article.slug)
        .limit(1)
        .get();

      if (!existing.empty) {
        await existing.docs[0].ref.update({
          title: article.title,
          content: article.content,
          description,
          sourceUrl: article.sourceUrl,
          sourceName: article.sourceName,
          isUpdated: true,
          updatedAt: Timestamp.now(),
          "metadata.wordCount": wordCount,
          "metadata.readingTime": readingTime,
          "metadata.lastModifiedBy": "news-ingest",
        });
        updated++;
      } else {
        const articleRef = adminDb.collection("articles").doc();
        await articleRef.set({
          id: articleRef.id,
          title: article.title,
          slug: article.slug,
          folderId,
          folderPath,
          content: article.content,
          description,
          order: 0,
          status: "published",
          priority: "medium",
          category: article.category,
          sourceUrl: article.sourceUrl,
          sourceName: article.sourceName,
          publishedAt: publishedAtTimestamp,
          isUpdated: false,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
          metadata: {
            wordCount,
            readingTime,
            lastModifiedBy: "news-ingest",
            version: 1,
          },
        });

        await adminDb.collection("folders").doc(folderId).update({
          articleCount: FieldValue.increment(1),
        });

        created++;
      }
    } catch (err) {
      errors.push(
        `Article "${article.slug}": ${err instanceof Error ? err.message : String(err)}`
      );
    }
  }

  return { created, updated, errors };
}

// ─── Scheduled task ───────────────────────────────────────────────────────────

export const dailyNewsTask = schedules.task({
  id: "daily-news",
  cron: {
    pattern: "0 2 * * *",
    timezone: "Asia/Bangkok", // UTC+7, same as Vietnam (Asia/Ho_Chi_Minh not in Trigger.dev allowlist)
  },
  retry: {
    maxAttempts: 3,
  },
  run: async () => {
    const folderId = process.env.DAILY_NEWS_FOLDER_ID;
    if (!folderId) throw new Error("DAILY_NEWS_FOLDER_ID is not set");
    if (!process.env.ANTHROPIC_API_KEY) throw new Error("ANTHROPIC_API_KEY is not set");

    // Load sources relative to this file at build time
    const sourcesPath = path.resolve(__dirname, "../config/news-sources.json");
    const sources: NewsSource[] = JSON.parse(fs.readFileSync(sourcesPath, "utf8"));

    const yesterdayRange = getYesterdayRangeGMT7();
    console.log(
      `Fetching news for: ${yesterdayRange.start.toISOString()} → ${yesterdayRange.end.toISOString()}`
    );
    console.log(`Sources: ${sources.length}`);

    // Fetch folder path for new article docs
    const folderDoc = await adminDb.collection("folders").doc(folderId).get();
    if (!folderDoc.exists) throw new Error(`Folder not found: ${folderId}`);
    const folderPath: string[] = folderDoc.data()!.path || [];

    // Collect articles from all sources
    const allArticles: ArticlePayload[] = [];
    const sourceErrors: string[] = [];

    for (const source of sources) {
      console.log(`  [${source.category.toUpperCase()}] ${source.name}...`);
      try {
        const articles = await processSource(source, yesterdayRange);
        console.log(`    → ${articles.length} article(s)`);
        allArticles.push(...articles);
      } catch (err) {
        const msg = `${source.name}: ${err instanceof Error ? err.message : String(err)}`;
        console.error(`    ERROR: ${msg}`);
        sourceErrors.push(msg);
      }
    }

    console.log(`\nTotal articles to ingest: ${allArticles.length}`);

    if (allArticles.length === 0) {
      console.log("No articles found for yesterday.");
      if (sourceErrors.length > 0) {
        console.error("Source errors:", sourceErrors);
      }
      return { created: 0, updated: 0, errors: sourceErrors };
    }

    // Write to Firestore
    const { created, updated, errors } = await ingestArticles(folderId, folderPath, allArticles);

    console.log(`Result: created=${created}, updated=${updated}`);
    if (errors.length) console.error("Article errors:", errors);
    if (sourceErrors.length) console.warn("Source warnings (non-fatal):", sourceErrors);
    console.log("Done!");

    return { created, updated, errors: [...errors, ...sourceErrors] };
  },
});

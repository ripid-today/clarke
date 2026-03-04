import Parser from "rss-parser";
import Anthropic from "@anthropic-ai/sdk";
import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const parser = new Parser({
  customFields: {
    item: [["content:encoded", "contentEncoded"]],
  },
  headers: {
    "User-Agent":
      "Mozilla/5.0 (compatible; Clarke-NewsBot/1.0; +https://clarkes-library.vercel.app)",
  },
  timeout: 15000,
});

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const INGEST_URL =
  process.env.DAILY_NEWS_INGEST_URL || "http://localhost:3000/api/news/ingest";
const API_KEY = process.env.LIBRARY_API_KEY || "";
const FOLDER_ID = process.env.DAILY_NEWS_FOLDER_ID || "";
const BYPASS_SECRET = process.env.VERCEL_AUTOMATION_BYPASS_SECRET || "";

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
  publishedAt: number;
}

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
  const feed = await parser.parseURL(source.rssUrl);
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

async function main() {
  if (!FOLDER_ID) {
    console.error("ERROR: DAILY_NEWS_FOLDER_ID is not set");
    process.exit(1);
  }
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error("ERROR: ANTHROPIC_API_KEY is not set");
    process.exit(1);
  }

  const sourcesPath = path.resolve(process.cwd(), "config/news-sources.json");
  const sources: NewsSource[] = JSON.parse(fs.readFileSync(sourcesPath, "utf8"));
  const yesterdayRange = getYesterdayRangeGMT7();

  console.log(
    `Fetching news for: ${yesterdayRange.start.toISOString()} → ${yesterdayRange.end.toISOString()}`
  );
  console.log(`Sources: ${sources.length}`);

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
    console.log("No articles found for yesterday. Exiting.");
    if (sourceErrors.length > 0) {
      console.error("Source errors:", sourceErrors);
      process.exit(1);
    }
    process.exit(0);
  }

  console.log(`Posting to ${INGEST_URL}...`);
  const response = await fetch(INGEST_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
      ...(BYPASS_SECRET && { "x-vercel-protection-bypass": BYPASS_SECRET }),
    },
    body: JSON.stringify({ folderId: FOLDER_ID, articles: allArticles }),
  });

  if (!response.ok) {
    const text = await response.text();
    console.error(`Ingest endpoint error ${response.status}:`, text);
    process.exit(1);
  }

  const result = (await response.json()) as {
    created: number;
    updated: number;
    errors: string[];
  };
  console.log(`Result: created=${result.created}, updated=${result.updated}`);

  if (result.errors?.length) {
    console.error("Article errors:", result.errors);
  }
  if (sourceErrors.length) {
    console.warn("Source warnings (non-fatal):", sourceErrors);
  }

  console.log("Done!");
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});

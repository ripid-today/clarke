import { schedules } from "@trigger.dev/sdk/v3";
import { adminDb } from "@/lib/firebase/admin";
import { Timestamp, FieldValue } from "firebase-admin/firestore";
import Anthropic from "@anthropic-ai/sdk";
import Parser from "rss-parser";
import newsSourcesData from "../config/news-sources.json";
import { getYesterdayRangeGMT7 } from "@/lib/utils/dateGMT7";

// ─── Types ────────────────────────────────────────────────────────────────────

interface NewsSource {
  id: string;
  name: string;
  rssUrl: string;
  category: "vietnam" | "world";
}

interface RawNewsItem {
  index: number;
  title: string;
  link: string;
  summary: string;
  sourceName: string;
  sourceId: string;
  category: "vietnam" | "world";
  publishedAt: Date;
}

interface TopicGroup {
  topicTitle: string;
  topicId: string;
  indices: number[];
}

interface AggregatedArticle {
  title: string;
  slug: string;
  content: string;
  description: string;
  topicGroup: string;
  sourceCount: number;
  sourceUrls: string[];
  sourceNames: string[];
  publishedAt: Date;
}

// ─── Clients ──────────────────────────────────────────────────────────────────

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const rssParser = new Parser({
  customFields: { item: [["content:encoded", "contentEncoded"]] },
  headers: {
    "User-Agent":
      "Mozilla/5.0 (compatible; Clarke-NewsBot/2.0; +https://clarkes-library.vercel.app)",
  },
  timeout: 15000,
});

// ─── Helpers ──────────────────────────────────────────────────────────────────


function toSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .substring(0, 80);
}

// ─── Phase 1: Fetch all RSS sources ──────────────────────────────────────────

async function fetchAllSources(
  sources: NewsSource[],
  range: { start: Date; end: Date }
): Promise<RawNewsItem[]> {
  const items: RawNewsItem[] = [];
  let index = 0;

  for (const source of sources) {
    try {
      const feed = await rssParser.parseURL(source.rssUrl);
      let count = 0;
      for (const item of feed.items || []) {
        const pubDate = item.pubDate ? new Date(item.pubDate) : null;
        if (!pubDate || pubDate < range.start || pubDate > range.end) continue;

        const rawContent =
          (item as { contentEncoded?: string }).contentEncoded ||
          item.content ||
          item.summary ||
          "";
        const summary = (rawContent || item.summary || item.title || "")
          .replace(/<[^>]+>/g, "")
          .trim()
          .substring(0, 1000);

        items.push({
          index,
          title: item.title || "Untitled",
          link: item.link || "",
          summary,
          sourceName: source.name,
          sourceId: source.id,
          category: source.category,
          publishedAt: pubDate,
        });
        index++;
        count++;
      }
      console.log(`  [${source.category.toUpperCase()}] ${source.name}: ${count} items`);
    } catch (err) {
      console.error(`  SKIP ${source.name}: ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  return items;
}

// ─── Phase 2: Topic grouping (Pass 1 — single Haiku call) ────────────────────

async function aggregateTopics(items: RawNewsItem[]): Promise<TopicGroup[]> {
  const compactItems = items.map(item => ({
    i: item.index,
    t: item.title,
    s: item.summary.substring(0, 200),
    src: item.sourceName,
  }));

  const prompt = `You are a news editor. Given these news items from yesterday, identify distinct news events/topics.
Group related items together (same underlying event = same group).
Return ONLY valid JSON with this exact shape: {"topics":[{"topicTitle":"...","topicId":"kebab-case-id","indices":[0,1,2]}]}
Aim for 5–15 distinct groups. Merge items about the same underlying event.
Items not fitting any meaningful group can be omitted.
NEWS ITEMS:
${JSON.stringify(compactItems)}`;

  const response = await anthropic.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 4096,
    messages: [{ role: "user", content: prompt }],
  });

  const text = response.content[0].type === "text" ? response.content[0].text : "";
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("No JSON in topic grouping response");
  const parsed = JSON.parse(jsonMatch[0]) as { topics: TopicGroup[] };
  return parsed.topics;
}

// ─── Phase 3: Article writing (Pass 2 — one Haiku call per topic) ────────────

async function writeArticle(
  group: TopicGroup,
  items: RawNewsItem[],
  dateStr: string
): Promise<AggregatedArticle> {
  const groupItems = group.indices.filter(i => i < items.length).map(i => items[i]);

  const sourceItems = groupItems.map(item => ({
    title: item.title,
    source: item.sourceName,
    url: item.link,
    summary: item.summary.substring(0, 300),
  }));

  const prompt = `Write a 100-150 word investment brief for Vietnam-based investors about this news topic.

FORMAT (no section headers):
- Paragraph 1 (2-3 sentences): What happened + key number/figure + immediate impact
- Paragraph 2 (2-3 sentences): Why it matters for Vietnam investors — gold/silver, VN-Index, USD/VND, FDI, rates
- "**Key Numbers**" bullet list: 2-5 metrics with values

RULES:
- Start with the specific number, event, or person — not context or scene-setting
- Include at least one specific figure (price, %, bps, USD amount)
- Hard cap: 150 words total. Choose the most impactful facts; do not exceed this limit
- Write in English for a sophisticated investor audience
- First line must be: TITLE: [a compelling, investment-focused headline]

TOPIC: ${group.topicTitle}
SOURCE ITEMS: ${JSON.stringify(sourceItems)}`;

  const response = await anthropic.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 600,
    messages: [{ role: "user", content: prompt }],
  });

  const content = response.content[0].type === "text" ? response.content[0].text : "";

  const titleMatch = content.match(/^TITLE:\s*(.+?)(?:\n|$)/);
  const parsedTitle = titleMatch ? titleMatch[1].trim() : group.topicTitle;
  const contentBody = content.replace(/^TITLE:\s*.+?\n\n?/, "").trim();
  const description = contentBody.replace(/[#*`\[\]]/g, "").trim().substring(0, 200);

  const slug = `${toSlug(group.topicTitle)}-${dateStr}`;
  const sourceUrls = groupItems.map(i => i.link).filter(Boolean);
  const sourceNames = [...new Set(groupItems.map(i => i.sourceName))];

  return {
    title: parsedTitle,
    slug,
    content: contentBody,
    description,
    topicGroup: group.topicId,
    sourceCount: groupItems.length,
    sourceUrls,
    sourceNames,
    publishedAt: groupItems[0]?.publishedAt || new Date(),
  };
}

// ─── Phase 4: Dedup check ─────────────────────────────────────────────────────

async function getRecentArticleTitles(
  rootFolderId: string,
  days = 7
): Promise<{ id: string; title: string; topicGroup: string; newsDate: string }[]> {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);

  const snapshot = await adminDb
    .collection("articles")
    .where("folderId", "==", rootFolderId)
    .where("publishedAt", ">=", Timestamp.fromDate(cutoff))
    .get();

  return snapshot.docs.map(doc => ({
    id: doc.id,
    title: doc.data().title || "",
    topicGroup: doc.data().metadata?.topicGroup || "",
    newsDate: doc.data().metadata?.newsDate || "",
  }));
}

async function checkDuplicates(
  newArticles: { title: string; topicGroup: string }[],
  existingArticles: { id: string; title: string; topicGroup: string; newsDate: string }[]
): Promise<Map<string, string | null>> {
  if (existingArticles.length === 0) {
    return new Map(newArticles.map(a => [a.title, null]));
  }

  const prompt = `You are a news deduplication assistant.
For each new article, determine if it covers the same real-world event as any existing article.
Use SEMANTIC matching — same event even if wording differs. Do NOT match same recurring topic
(e.g. daily gold price) across different dates — newsDate is a strong signal.

Return ONLY valid JSON: {"matches":[{"newTitle":"...","matchedId":"existing-doc-id or null"}]}

NEW ARTICLES:
${JSON.stringify(newArticles.map(a => ({ title: a.title, topicGroup: a.topicGroup })))}

EXISTING ARTICLES (last 7 days):
${JSON.stringify(existingArticles.map(a => ({
  id: a.id, title: a.title, topicGroup: a.topicGroup, newsDate: a.newsDate
})))}`;

  const response = await anthropic.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 1024,
    messages: [{ role: "user", content: prompt }],
  });

  const text = response.content[0].type === "text" ? response.content[0].text : "";
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("No JSON in dedup response");
  const parsed = JSON.parse(jsonMatch[0]) as {
    matches: { newTitle: string; matchedId: string | "null" | null }[];
  };

  const result = new Map<string, string | null>();
  for (const match of parsed.matches) {
    const id = match.matchedId === "null" || !match.matchedId ? null : match.matchedId;
    result.set(match.newTitle, id);
  }
  // Default unmapped articles to null (new)
  for (const a of newArticles) {
    if (!result.has(a.title)) result.set(a.title, null);
  }
  return result;
}

// ─── Phase 5: Ingest ──────────────────────────────────────────────────────────

async function ingestArticle(
  article: AggregatedArticle,
  rootFolderId: string,
  rootFolderPath: string[],
  dateStr: string,
  duplicateId: string | null
): Promise<"created" | "updated"> {
  const wordCount = article.content.split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / 200);
  const now = Timestamp.now();

  if (duplicateId) {
    await adminDb.collection("articles").doc(duplicateId).update({
      description: article.description,
      updatedAt: now,
      isUpdated: true,
      "metadata.wordCount": wordCount,
      "metadata.readingTime": readingTime,
      "metadata.lastModifiedBy": "brief-daily-news-v2",
      "metadata.version": FieldValue.increment(1),
      "metadata.sourceCount": article.sourceCount,
      "metadata.sourceUrls": article.sourceUrls,
      "metadata.sourceNames": article.sourceNames,
      "metadata.lastDuplicateCheck": new Date().toISOString(),
    });
    return "updated";
  }

  // Store directly under rootFolderId so the folderId == rootFolderId query finds them.
  // Date organisation is tracked via metadata.newsDate.
  const articleRef = adminDb.collection("articles").doc();
  await articleRef.set({
    id: articleRef.id,
    title: article.title,
    slug: article.slug,
    folderId: rootFolderId,
    folderPath: rootFolderPath,
    content: article.content,
    description: article.description,
    order: 0,
    status: "published",
    priority: "medium",
    publishedAt: Timestamp.fromDate(article.publishedAt),
    createdAt: now,
    updatedAt: now,
    metadata: {
      wordCount,
      readingTime,
      lastModifiedBy: "brief-daily-news-v2",
      version: 1,
      newsDate: dateStr,
      topicGroup: article.topicGroup,
      sourceCount: article.sourceCount,
      sourceUrls: article.sourceUrls,
      sourceNames: article.sourceNames,
      isAggregated: true,
      lastDuplicateCheck: new Date().toISOString(),
    },
  });

  await adminDb.collection("folders").doc(rootFolderId).update({
    articleCount: FieldValue.increment(1),
  });

  return "created";
}

// ─── Scheduled task ───────────────────────────────────────────────────────────

export const dailyNewsTask = schedules.task({
  id: "daily-news",
  cron: {
    pattern: "0 9 * * *",
    timezone: "Asia/Bangkok", // UTC+7, same as Vietnam
  },
  retry: {
    maxAttempts: 3,
  },
  run: async () => {
    const rootFolderId = process.env.DAILY_NEWS_FOLDER_ID;
    if (!rootFolderId) throw new Error("DAILY_NEWS_FOLDER_ID is not set");
    if (!process.env.ANTHROPIC_API_KEY) throw new Error("ANTHROPIC_API_KEY is not set");

    const sources: NewsSource[] = newsSourcesData as NewsSource[];
    const { start, end, dateStr } = getYesterdayRangeGMT7();

    console.log(`\n=== Brief Daily News v2 — ${dateStr} ===`);
    console.log(`Range: ${start.toISOString()} → ${end.toISOString()}`);
    console.log(`Sources: ${sources.length}`);

    // Get root folder path for new articles' folderPath array
    const rootDoc = await adminDb.collection("folders").doc(rootFolderId).get();
    if (!rootDoc.exists) throw new Error(`Root folder not found: ${rootFolderId}`);
    const rootPath: string[] = rootDoc.data()!.path || [];

    // Phase 1: Fetch
    console.log(`\n[Phase 1] Fetching ${sources.length} RSS sources...`);
    const rawItems = await fetchAllSources(sources, { start, end });
    console.log(`Total raw items: ${rawItems.length}`);

    if (rawItems.length === 0) {
      console.log("No items found for yesterday. Exiting.");
      return { created: 0, updated: 0, skipped: 0, topicCount: 0, errors: [] };
    }

    // Phase 2: Topic grouping
    console.log(`\n[Phase 2] Grouping ${rawItems.length} items into topics...`);
    let topicGroups: TopicGroup[] = [];
    try {
      topicGroups = await aggregateTopics(rawItems);
      console.log(`  → ${topicGroups.length} topic groups`);
    } catch (err) {
      const msg = `Topic grouping failed: ${err instanceof Error ? err.message : String(err)}`;
      console.error(msg);
      return { created: 0, updated: 0, skipped: 0, topicCount: 0, errors: [msg] };
    }

    // Phase 3: Write articles
    console.log(`\n[Phase 3] Writing ${topicGroups.length} articles...`);
    const aggregatedArticles: AggregatedArticle[] = [];
    const writeErrors: string[] = [];

    for (const group of topicGroups) {
      try {
        console.log(`  Writing: "${group.topicTitle}" (${group.indices.length} items)`);
        const article = await writeArticle(group, rawItems, dateStr);
        console.log(`    → ${article.content.split(/\s+/).length} words`);
        aggregatedArticles.push(article);
      } catch (err) {
        const msg = `"${group.topicTitle}": ${err instanceof Error ? err.message : String(err)}`;
        console.error(`  ERROR: ${msg}`);
        writeErrors.push(msg);
      }
    }

    // Phase 4: Dedup check (single batch call)
    console.log(`\n[Phase 4] Checking for duplicates against last 7 days...`);
    const existingTitles = await getRecentArticleTitles(rootFolderId, 7);
    console.log(`  ${existingTitles.length} existing articles found`);

    let duplicateMap: Map<string, string | null>;
    try {
      duplicateMap = await checkDuplicates(
        aggregatedArticles.map(a => ({ title: a.title, topicGroup: a.topicGroup })),
        existingTitles
      );
      for (const [title, dupId] of duplicateMap) {
        if (dupId) console.log(`  DUPLICATE: "${title}" → update ${dupId}`);
      }
    } catch (err) {
      console.error(`  Dedup batch call failed:`, err);
      duplicateMap = new Map(aggregatedArticles.map(a => [a.title, null]));
    }

    // Phase 5: Ingest
    console.log(`\n[Phase 5] Ingesting ${aggregatedArticles.length} articles...`);
    let created = 0;
    let updated = 0;
    let skipped = 0;
    const ingestErrors: string[] = [];

    for (const article of aggregatedArticles) {
      try {
        const dupId = duplicateMap.get(article.title) ?? null;
        const result = await ingestArticle(
          article,
          rootFolderId,
          rootPath,
          dateStr,
          dupId
        );
        if (result === "created") created++;
        else updated++;
        console.log(`  ${result.toUpperCase()}: "${article.title}"`);
      } catch (err) {
        const msg = `"${article.slug}": ${err instanceof Error ? err.message : String(err)}`;
        console.error(`  ERROR: ${msg}`);
        ingestErrors.push(msg);
        skipped++;
      }
    }

    const allErrors = [...writeErrors, ...ingestErrors];
    console.log(`\n=== Done ===`);
    console.log(`Created: ${created}, Updated: ${updated}, Skipped: ${skipped}, Topics: ${topicGroups.length}`);
    if (allErrors.length > 0) console.error("Errors:", allErrors);

    return { created, updated, skipped, topicCount: topicGroups.length, errors: allErrors };
  },
});

# AI Pipeline Patterns — TII Backend Reference

## The TII Daily Brief Pipeline Architecture

```
[Trigger.dev cron: 9 AM GMT+7]
         │
         ▼
Phase 1: RSS Fetch
  config/news-sources.json
    → rss-parser for each source
    → filter: publishedAt in yesterday's GMT+7 date range
    → output: RawNewsItem[] (title, link, summary, sourceName, category, publishedAt)
         │
         ▼
Phase 2: Topic Grouping (1 × Claude Haiku call)
  input: all RawNewsItem[] compressed to {i, t, s, src}
  output: TopicGroup[] [{topicTitle, topicId, indices}]
  target: 5-15 topic groups per pipeline run
         │
         ▼
Phase 3: Article Writing (N × Claude Haiku calls, one per topic)
  input: TopicGroup + source RawNewsItems for that group
  output: AggregatedArticle {title, slug, content, description, topicGroup, publishedAt}
  target: 100-150 words per article
         │
         ▼
Phase 4: Dedup Check (1 × Claude Haiku call)
  input: new article titles/topicGroups + last 7 days existing articles from Firestore
  output: Map<title, existingDocId | null>
  logic: semantic matching — same event ≠ same recurring topic
         │
         ▼
Phase 5: Firestore Ingest
  if duplicateId: update existing doc (description, metadata, isUpdated=true)
  if new: create doc, FieldValue.increment articleCount on folder
  output: { created, updated, skipped }
```

---

## AI SDK Usage

TII uses the Anthropic SDK directly (not Vercel AI SDK):

```ts
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
```

### Model Selection
TII uses `claude-haiku-4-5-20251001` for all pipeline calls — the fastest and cheapest Haiku model available. Do not upgrade to Sonnet/Opus for pipeline tasks without explicit budget approval; the cost scales linearly with volume.

### Message Format
```ts
const response = await anthropic.messages.create({
  model: "claude-haiku-4-5-20251001",
  max_tokens: 600,            // Per-call token limit (see token budgets below)
  messages: [
    { role: "user", content: prompt }
  ],
});

// Extract text from response
const text = response.content[0].type === "text" ? response.content[0].text : "";
```

### Token Budgets by Phase

| Phase | max_tokens | Rationale |
|-------|-----------|-----------|
| Phase 2: Topic grouping | 4096 | Needs to output full JSON array of all topic groups |
| Phase 3: Article writing (per call) | 600 | 100-150 words ≈ 200-250 tokens; 600 leaves room for TITLE line and formatting |
| Phase 4: Dedup check | 1024 | Needs to output JSON matching array for all articles |

**Never set `max_tokens` higher than needed** — unused tokens don't cost more, but excessively high limits can cause runaway outputs if prompt engineering fails.

---

## Brief Generation Format

### Prompt Structure for Phase 3
```
Write a 100-150 word investment brief for Vietnam-based investors about this news topic.

FORMAT (no section headers):
- Paragraph 1 (2-3 sentences): What happened + key number/figure + immediate impact
- Paragraph 2 (2-3 sentences): Why it matters for Vietnam investors — gold/silver, VN-Index, USD/VND, FDI, rates
- "**Key Numbers**" bullet list: 2-5 metrics with values

RULES:
- Start with the specific number, event, or person — not context or scene-setting
- Include at least one specific figure (price, %, bps, USD amount)
- Hard cap: 150 words total
- Write in English for a sophisticated investor audience
- First line must be: TITLE: [a compelling, investment-focused headline]
- DO NOT include a Sources, References, or Citations section

TOPIC: {topic.topicTitle}
SOURCE ITEMS: {JSON.stringify(sourceItems)}
```

### Parsing the AI Output

The model outputs:
```
TITLE: Gold Hits Record as Fed Signals Rate Hold

Global gold prices surged past $2,400/oz Thursday after the Federal Reserve...
Why it matters for Vietnam investors...

**Key Numbers**
- Gold: $2,401/oz (+1.2% daily)
- VN-Index: likely to benefit from safe-haven inflow
```

Parsing code:
```ts
// Extract title from first line
const titleMatch = content.match(/^TITLE:\s*(.+?)(?:\n|$)/);
const parsedTitle = titleMatch ? titleMatch[1].trim() : group.topicTitle;

// Remove the title line to get content body
const contentBody = content.replace(/^TITLE:\s*.+?\n\n?/, "").trim();

// Generate description (strip markdown, truncate to 200 chars)
const description = contentBody.replace(/[#*`\[\]]/g, "").trim().substring(0, 200);
```

---

## Dedup Algorithm

### Why Semantic Dedup (Not Hash-Based)
The same news event is reported with different wording by different RSS sources. A hash or exact-match approach would let duplicates through. TII uses Claude Haiku to semantically compare new article titles against existing articles from the past 7 days.

### Dedup Prompt Structure (Phase 4)
```
You are a news deduplication assistant.
For each new article, determine if it covers the same real-world event as any existing article.
Use SEMANTIC matching — same event even if wording differs. Do NOT match same recurring topic
(e.g. daily gold price) across different dates — newsDate is a strong signal.

Return ONLY valid JSON: {"matches":[{"newTitle":"...","matchedId":"existing-doc-id or null"}]}

NEW ARTICLES:
[{title, topicGroup}]

EXISTING ARTICLES (last 7 days):
[{id, title, topicGroup, newsDate}]
```

### Dedup Decision Logic
```ts
// After getting the Map<title, existingDocId | null>:
if (duplicateId) {
  // Update existing doc — refresh description and metadata
  await adminDb.collection("articles").doc(duplicateId).update({
    description: article.description,
    updatedAt: now,
    isUpdated: true,
    "metadata.lastDuplicateCheck": new Date().toISOString(),
    "metadata.version": FieldValue.increment(1),
  });
  // Do NOT increment articleCount — article already exists
} else {
  // Create new doc
  await articleRef.set({ ...fullArticleData });
  await folderRef.update({ articleCount: FieldValue.increment(1) });
}
```

### Dedup Failure Handling
If the dedup API call fails:
```ts
try {
  duplicateMap = await checkDuplicates(...);
} catch (err) {
  console.error("Dedup batch call failed:", err);
  // Fallback: treat all articles as new (no dedup)
  // This risks duplicate articles but is preferable to losing all articles for the day
  duplicateMap = new Map(aggregatedArticles.map(a => [a.title, null]));
}
```

---

## Error Handling in the Pipeline

### Phase-Level Error Handling
Each phase has its own try/catch. A failure in one phase should NOT stop the entire pipeline:

```ts
// Phase 3: article writing — continue on individual article failures
const writeErrors: string[] = [];
for (const group of topicGroups) {
  try {
    const article = await writeArticle(group, rawItems, dateStr);
    aggregatedArticles.push(article);
  } catch (err) {
    writeErrors.push(`"${group.topicTitle}": ${err instanceof Error ? err.message : String(err)}`);
    // Continue to next group
  }
}
```

```ts
// Phase 2: topic grouping — this is a full-stop failure (no groups = nothing to write)
try {
  topicGroups = await aggregateTopics(rawItems);
} catch (err) {
  console.error(`Topic grouping failed: ${err.message}`);
  return { created: 0, updated: 0, skipped: 0, topicCount: 0, errors: [err.message] };
  // Return early — cannot continue without topic groups
}
```

### RSS Source Error Handling
```ts
for (const source of sources) {
  try {
    const feed = await rssParser.parseURL(source.rssUrl);
    // ...process items
  } catch (err) {
    // Log and skip this source — do not throw
    console.error(`SKIP ${source.name}: ${err instanceof Error ? err.message : String(err)}`);
  }
}
```

Sources that fail are skipped silently. The pipeline continues with items from successful sources.

### Ingest Error Handling
```ts
for (const article of aggregatedArticles) {
  try {
    await ingestArticle(article, ...);
  } catch (err) {
    ingestErrors.push(`"${article.slug}": ${err.message}`);
    skipped++;
    // Continue to next article
  }
}
```

### What to Log
Log at each phase transition for observability:
```ts
console.log(`\n=== Brief Daily News v2 — ${dateStr} ===`);
console.log(`[Phase 1] Fetching ${sources.length} RSS sources...`);
console.log(`  [VIETNAM] VnExpress: 12 items`);
console.log(`Total raw items: 47`);
console.log(`\n[Phase 2] Grouping 47 items into topics...`);
console.log(`  → 10 topic groups`);
// etc.
```

Error logs include context:
```ts
console.error(`ERROR writing "${group.topicTitle}": ${err.message}`);
console.error(`SKIP ${source.name}: ${err.message}`);
```

Final summary is always logged:
```ts
console.log(`\n=== Done ===`);
console.log(`Created: ${created}, Updated: ${updated}, Skipped: ${skipped}`);
if (errors.length > 0) console.error("Errors:", errors);
```

---

## RSS Feed Handling

### Parser Configuration
```ts
import Parser from "rss-parser";

const rssParser = new Parser({
  customFields: { item: [["content:encoded", "contentEncoded"]] },
  headers: {
    "User-Agent": "Mozilla/5.0 (compatible; Clarke-NewsBot/2.0; ...)",
  },
  timeout: 15000, // 15 second timeout per feed
});
```

### Content Extraction Priority
RSS items may have content in different fields depending on the feed:
```ts
const rawContent =
  (item as { contentEncoded?: string }).contentEncoded ||
  item.content ||
  item.summary ||
  "";
```

Strip HTML tags before use:
```ts
const summary = rawContent.replace(/<[^>]+>/g, "").trim().substring(0, 1000);
```

### Date Filtering (GMT+7 Yesterday)
```ts
import { getYesterdayRangeGMT7 } from "@/lib/utils/dateGMT7";

const { start, end, dateStr } = getYesterdayRangeGMT7();
// start: yesterday 00:00:00 GMT+7 as UTC Date
// end: today 00:00:00 GMT+7 as UTC Date
// dateStr: "YYYY-MM-DD" of yesterday in GMT+7

// Filter items
if (!pubDate || pubDate < range.start || pubDate > range.end) continue;
```

---

## Adding a New RSS Source

1. Open `config/news-sources.json`
2. Add entry:
```json
{
  "id": "source-kebab-id",
  "name": "Source Display Name",
  "rssUrl": "https://example.com/rss.xml",
  "category": "vietnam"   // or "world"
}
```
3. No code changes needed — the pipeline reads sources from JSON at runtime.
4. Test by running the pipeline locally (`npx trigger.dev@latest dev`) and watching Phase 1 logs for the new source's item count.

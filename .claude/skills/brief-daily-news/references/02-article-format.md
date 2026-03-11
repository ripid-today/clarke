# Article Format, Prompts & Metadata Schema

## 1000-Word Article Template

```markdown
# [Headline: Concise, investment-focused title]

**Date:** YYYY-MM-DD | **Sources:** N RSS feeds | **Topic:** topicGroup

---

## Lead
[150 words: What happened — the single most important development and immediate market impact]

## Background
[200 words: Why this matters — historical context, prior developments, relevant macro conditions]

## Key Developments
[350 words: Detailed breakdown — what was announced, by whom, with specific data and numbers]

## Investment Implications for Vietnam
[200 words: Specific impact for Vietnam-based investors tracking gold, silver, VN-Index, USD/VND, FDI, interest rates]

## Key Data Points
- [Metric]: [Value] (vs [prior period] if available)
- [Metric]: [Value]
- ...

## Sources
- [Source Name]: [Article title] — [URL]
- ...
```

---

## Pass 1 Prompt — Topic Grouping

```
You are a news editor. Given these news items from yesterday, identify distinct news events/topics.
Group related items together (same underlying event = same group).
Return ONLY valid JSON with this exact shape:
{"topics":[{"topicTitle":"...","topicId":"kebab-case-id","indices":[0,1,2]}]}

Aim for 5–15 distinct groups. Merge items about the same underlying event.
Items NOT in any group should be omitted.

NEWS ITEMS:
[compact JSON array: { i: index, t: title, s: summary_200chars, src: sourceName }]
```

**Model:** `claude-haiku-4-5-20251001`
**Max tokens:** 4096
**Expected output:** JSON array of 5–15 `TopicGroup` objects

---

## Pass 2 Prompt — Article Writing

```
Write a 1000+ word English investment briefing article about this news topic for Vietnam-based investors tracking gold, silver, VN stocks, USD/VND, and macro trends.

TOPIC: [topicTitle]

Use this exact structure (include all headers):

## Lead
[150 words: What happened — the most important development and immediate market impact]

## Background
[200 words: Why this matters — historical context, prior developments, relevant macro conditions]

## Key Developments
[350 words: Detailed breakdown — what was announced, by whom, with specific data and numbers]

## Investment Implications for Vietnam
[200 words: Specific impact analysis for Vietnam-based investors — gold/silver prices, VN-Index, USD/VND, FDI, interest rates]

## Key Data Points
- [Metric]: [Value] (vs [prior period] if available)

## Sources
- [Source Name]: [Article title] — [URL]

SOURCE ITEMS:
[JSON array: { title, source, url, content, publishedAt }]
```

**Model:** `claude-haiku-4-5-20251001`
**Max tokens:** 2000
**Target word count:** 1000+ words

---

## Dedup Check Prompt

```
Is the new article about the same event as any existing article?
Reply with ONLY the matching article document ID if it's a duplicate, or "null" if it's a genuinely new event.
Do not explain. Reply with one word only.

New article: "[title]"

Existing articles (id: title):
[list of "docId: Article Title" lines]
```

**Model:** `claude-haiku-4-5-20251001`
**Max tokens:** 100
**Expected output:** A Firestore document ID string, or literal "null"

---

## Article Metadata Schema

```typescript
metadata: {
  wordCount: number,          // Counted from content.split(/\s+/).length
  readingTime: number,        // Math.ceil(wordCount / 200) in minutes
  lastModifiedBy: "brief-daily-news-v2",
  version: number,            // 1 on create, incremented on update
  newsDate: string,           // "YYYY-MM-DD" — the date being covered
  topicGroup: string,         // kebab-case topic identifier from Pass 1
  sourceCount: number,        // Number of RSS items that contributed
  sourceUrls: string[],       // Array of contributing article URLs
  sourceNames: string[],      // Unique list of contributing source names
  isAggregated: true,         // Distinguishes v2 aggregated from v1 individual articles
  lastDuplicateCheck: string, // ISO timestamp of last dedup check
}
```

---

## Firestore Storage Structure

```
folders/
  DAILY_NEWS_FOLDER_ID (root folder)
    └── YYYY-MM-DD subfolder (auto-created daily)
        ├── article: topic-one-YYYY-MM-DD
        ├── article: topic-two-YYYY-MM-DD
        └── article: topic-three-YYYY-MM-DD
```

- Articles: `folderId = DATE_SUBFOLDER_ID`, `folderPath = [DAILY_NEWS_FOLDER_ID, DATE_SUBFOLDER_ID]`
- Query for flat feed: `articles WHERE folderPath array-contains DAILY_NEWS_FOLDER_ID ORDER BY publishedAt DESC`

# Article Format, Prompts & Metadata Schema

## Article Template (200-300 Words)

```markdown
# [Headline — investment-focused, concise]
**Date:** YYYY-MM-DD | **Sources:** N | **Category:** vietnam/world

[Paragraph 1: 2-3 sentences — what happened, most important development, key numbers.
Start with the number or the named event. Be specific.]

[Paragraph 2: 2-3 sentences — why this matters for Vietnam-based investors.
Impact on gold/silver, VN-Index, USD/VND, FDI, interest rates as applicable.]

**Key Numbers**
- [Metric]: [Value] (vs [prior period] if available)
- [Metric]: [Value]

**Sources:** [Source 1], [Source 2], ...
```

**Writing guidelines (enforced in prompt):**
- Lead with the specific number, person, or event — no scene-setting filler
- Every word earns its place; cut vague transitions and filler phrases
- Always include at least one figure/percentage/price
- Always close with Vietnam investment relevance
- **Hard cap: 300 words** — if choosing between facts, pick the most impactful

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

## Pass 2 Prompt — Brief Writing

```
Write a 200-300 word investment brief for Vietnam-based investors about this news topic.

FORMAT (no section headers):
- Paragraph 1 (2-3 sentences): What happened + key number/figure + immediate impact
- Paragraph 2 (2-3 sentences): Why it matters for Vietnam investors — gold/silver, VN-Index, USD/VND, FDI, rates
- "**Key Numbers**" bullet list: 2-5 metrics with values
- "**Sources:**" inline comma-separated list

RULES:
- Start with the specific number, event, or person — not context or scene-setting
- Include at least one specific figure (price, %, bps, USD amount)
- Hard cap: 300 words total. Choose the most impactful facts; do not exceed this limit
- Write in English for a sophisticated investor audience

TOPIC: [topicTitle]
SOURCE ITEMS: [JSON array: { title, source, url, summary }]
```

**Model:** `claude-haiku-4-5-20251001`
**Max tokens:** 600
**Target word count:** 200-300 words

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
  isAggregated: true,         // Distinguishes aggregated from individual articles
  lastDuplicateCheck: string, // ISO timestamp of last dedup check
}
```

Top-level field on update:
```typescript
isUpdated: true  // Set when an existing article is refreshed with new content
```

---

## Firestore Storage Structure

```
folders/
  DAILY_NEWS_FOLDER_ID (root folder)
    └── YYYY-MM-DD subfolder (auto-created daily, organisational only)

articles/
  All daily news articles stored with folderId = DAILY_NEWS_FOLDER_ID
  Date tracked via metadata.newsDate
```

- Articles: `folderId = DAILY_NEWS_FOLDER_ID`, `folderPath = [DAILY_NEWS_FOLDER_ID]`
- Query for flat feed: `articles WHERE folderId == DAILY_NEWS_FOLDER_ID ORDER BY publishedAt DESC`

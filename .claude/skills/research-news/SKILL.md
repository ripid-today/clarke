---
name: research-news
description: Fetch yesterday's RSS news and summarize into concise 200-300 word investment briefs per topic. Phase 1 of the economic-journalist pipeline.
user-invokable: false
version: 1.0.0
---

# research-news Skill

Fetch all 39 RSS feeds for yesterday (GMT+7), group items by topic, and write one concise 200-300 word investment brief per topic. Output is passed directly to the `brief-daily-news` skill.

## Workflow (4 Steps)

### Step 1 — Determine Date Range

Calculate yesterday's date in GMT+7 (Asia/Bangkok):
- Start: `YYYY-MM-DD 00:00:00 +0700` → convert to UTC
- End: `YYYY-MM-DD 23:59:59 +0700` → convert to UTC
- Date label: `YYYY-MM-DD` (used for article slugs)

### Step 2 — Fetch All RSS Sources

Parse all 39 RSS feeds from `brief-daily-news/references/01-news-sources.md`.
- Per-feed timeout: 15 seconds (skip on failure, log error)
- Filter: only items with `pubDate` within yesterday's GMT+7 range
- Collect each item as `RawNewsItem`: `{ index, title, link, summary, sourceName, sourceId, category, publishedAt }`
- Log: item count per source, total collected

### Step 3 — Pass 1: Topic Grouping (Single Haiku Call)

Send ALL collected items (title + summary only) to `claude-haiku-4-5-20251001` in one call.

**Prompt:**
```
You are a news editor. Given these news items from yesterday, identify distinct news events/topics.
Group related items together (same underlying event = same group).
Return ONLY valid JSON with this exact shape: {"topics":[{"topicTitle":"...","topicId":"kebab-case-id","indices":[0,1,2]}]}
Aim for 5–15 distinct groups. Merge items about the same underlying event.
Items not fitting any meaningful group can be omitted.
NEWS ITEMS:
[compact JSON array: { i: index, t: title, s: summary_200chars, src: sourceName }]
```

**Model:** `claude-haiku-4-5-20251001` | **Max tokens:** 4096

### Step 4 — Pass 2: Brief Writing (One Haiku Call Per Topic)

For each topic group, send the full content of grouped items to Haiku.

**Prompt:**
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

**Model:** `claude-haiku-4-5-20251001` | **Max tokens:** 600

## Output

Returns `SummarizedNewsItem[]` passed to `brief-daily-news` skill:

```typescript
interface SummarizedNewsItem {
  title: string;        // Parsed from TITLE: prefix in LLM output
  slug: string;         // toSlug(topicId)-YYYY-MM-DD
  content: string;      // 200-300 word brief body
  description: string;  // First ~190 chars of content (stripped markdown)
  topicGroup: string;   // kebab-case topic ID from Pass 1
  sourceCount: number;
  sourceUrls: string[];
  sourceNames: string[];
  publishedAt: Date;
  dateStr: string;      // "YYYY-MM-DD"
}
```

## Implementation Reference

Cron job (runs 9 AM GMT+7 daily): `website/trigger/daily-news.ts`

## References

- [01-news-sources.md](../brief-daily-news/references/01-news-sources.md) — All 39 RSS sources

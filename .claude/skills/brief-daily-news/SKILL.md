---
name: brief-daily-news
description: Aggregate yesterday's RSS news into 5-15 distinct 1000+ word English investment briefing articles stored in date-based Firestore subfolders
user-invokable: true
triggers:
  - "brief daily news"
  - "run brief daily news"
  - "generate daily briefing"
  - "aggregate daily news"
  - "news briefing"
version: 2.0.0
---

# brief-daily-news Skill

Aggregate yesterday's RSS news feeds into a small set of distinct, 1000+ word English investment briefing articles per topic, stored in date-based Firestore subfolders.

## Trigger Phrases

- "brief daily news"
- "run brief daily news"
- "generate daily briefing"
- "aggregate daily news"
- "news briefing"

## Workflow (7 Steps)

### Step 1 — Determine Date Range

Calculate yesterday's date in GMT+7 (Asia/Bangkok):
- Start: `YYYY-MM-DD 00:00:00 +0700` → convert to UTC
- End: `YYYY-MM-DD 23:59:59 +0700` → convert to UTC
- Date label: `YYYY-MM-DD` (used for subfolder name and article slugs)

### Step 2 — Fetch All RSS Sources

Parse all 39 RSS feeds from `references/01-news-sources.md`.
- Per-feed timeout: 15 seconds (skip on failure, log error)
- Filter: only items with `pubDate` within yesterday's GMT+7 range
- Collect each item as `RawNewsItem`: `{ index, title, link, summary, sourceName, sourceId, category, publishedAt }`
- Log: item count per source, total collected

### Step 3 — Pass 1: Topic Grouping (Single Haiku Call)

Send ALL collected items (title + summary only) to `claude-haiku-4-5-20251001` in one call.

**Prompt:** See `references/02-article-format.md` → "Pass 1 Prompt"

Target: 5–15 distinct topic groups. Haiku merges items about the same underlying event.

Output format:
```json
{
  "topics": [
    { "topicTitle": "...", "topicId": "kebab-case-id", "indices": [0, 3, 7] }
  ]
}
```

### Step 4 — Pass 2: Article Writing (One Haiku Call Per Group)

For each topic group, send the full content of grouped items to Haiku.

**Prompt:** See `references/02-article-format.md` → "Pass 2 Prompt"

Output: 1000+ word English investment briefing article with sections:
- Lead (150 words)
- Background (200 words)
- Key Developments (350 words)
- Investment Implications for Vietnam (200 words)
- Key Data Points (bullets)
- Sources

### Step 5 — Dedup Check (One Haiku Call Per Article)

Fetch last 30 days of article titles from Firestore:
```
articles WHERE folderPath array-contains DAILY_NEWS_FOLDER_ID AND publishedAt >= 30 days ago
```

**Prompt:** See `references/02-article-format.md` → "Dedup Prompt"

Output: `"null"` (new article) | existing article document ID (update existing instead of create)

### Step 6 — Date Subfolder Creation

Check Firestore `folders` collection for slug `YYYY-MM-DD` under `DAILY_NEWS_FOLDER_ID`:
- If not exists: create with `{ name: "YYYY-MM-DD", slug: "YYYY-MM-DD", parentId: DAILY_NEWS_FOLDER_ID, path: [...], articleCount: 0, featured: false }`
- Return subfolder ID

### Step 7 — Ingest to Firestore

For each article:
- **New:** Create in date subfolder with full metadata; increment `articleCount` on date subfolder and root folder
- **Duplicate:** Update `content`, `metadata`, `updatedAt` on existing article

**Metadata schema:** See `references/02-article-format.md` → "Article Metadata"

## Implementation Reference

Full TypeScript implementation: `scripts/brief-daily-news.ts`

Cron job (runs 9 AM GMT+7 daily): `website/trigger/daily-news.ts`

## References

- [01-news-sources.md](references/01-news-sources.md) — All 39 RSS sources with URLs
- [02-article-format.md](references/02-article-format.md) — Article template, prompts, metadata schema

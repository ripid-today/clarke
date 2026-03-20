---
name: brief-daily-news
description: Receive summarized news briefs from research-news, match against existing Firestore articles (semantic dedup), and create or update articles in Firestore. Phase 2 of the economic-journalist pipeline.
user-invokable: false
triggers:
  - "brief daily news"
  - "run brief daily news"
  - "generate daily briefing"
  - "aggregate daily news"
  - "news briefing"
version: 3.0.0
---

# brief-daily-news Skill

Receive `SummarizedNewsItem[]` from `research-news`, compare against the last 30 days of articles in Firestore, and create or update articles accordingly.

**Scope:** DB comparison and publish only. Fetching and summarizing is handled by `research-news`.

## Workflow (4 Steps)

### Step 1 — Receive Input

Accept `SummarizedNewsItem[]` from the `research-news` skill. Each item has:
- `title`, `slug`, `content` (200-300 words), `description`, `topicGroup`
- `sourceCount`, `sourceUrls`, `sourceNames`, `publishedAt`, `dateStr`

### Step 2 — Load Recent Titles

Fetch last 30 days of article titles from Firestore:
```
articles WHERE folderId == DAILY_NEWS_FOLDER_ID AND publishedAt >= 30 days ago
```
Returns `{ id: string; title: string }[]`

### Step 3 — Semantic Match (One Haiku Call Per Article)

For each `SummarizedNewsItem`, run the dedup check:

**Prompt:** See `references/02-article-format.md` → "Dedup Check Prompt"

- **Match found** → UPDATE: `content`, `description`, `updatedAt`, `isUpdated: true`, `metadata.version` (FieldValue.increment(1)), `metadata.wordCount`, `metadata.readingTime`, `metadata.sourceCount`, `metadata.sourceUrls`, `metadata.sourceNames`, `metadata.lastDuplicateCheck`, `metadata.lastModifiedBy`
- **No match** → CREATE new article under `rootFolderId` with full metadata

### Step 4 — Report

Return: `{ created: number, updated: number, skipped: number, errors: string[] }`

## Article Metadata Schema

See `references/02-article-format.md` → "Article Metadata Schema"

## Implementation Reference

Full implementation: `website/trigger/daily-news.ts`

## References

- [01-news-sources.md](references/01-news-sources.md) — All 39 RSS sources with URLs
- [02-article-format.md](references/02-article-format.md) — Article template, prompts, metadata schema

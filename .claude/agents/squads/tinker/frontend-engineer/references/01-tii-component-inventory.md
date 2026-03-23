# TII Component Inventory

Last updated: 2026-03-22. Read from `projects/the-intelligent-investor/` directory.

## App Directory (`app/`)

### `app/layout.tsx` — Root Layout (Server Component)
Single root layout wrapping all pages. Responsibilities:
- Loads Inter font via `next/font/google` with `latin` + `vietnamese` subsets and weights 400/500/600/700
- Assigns `--font-inter` CSS variable and `font-sans` class to `<body>`
- Applies `bg-cloud-dancer` background to `<body>`
- Sets `<html lang="en">`
- Exports `metadata` with title and description

**Critical rule:** Inter is loaded ONCE here. Never import it again in any other file.

### `app/page.tsx` — Homepage (Server Component, force-dynamic)
The sole page in the app. Responsibilities:
- Reads `searchParams.cursor` (awaited — Next.js 15 async request API)
- Calls `getDailyNewsArticles(folderId, cursor, 20)` for paginated article fetch
- Renders `<NewsArticleFeed articles={articles} />` and `<PaginationControls .../>` when articles exist
- Renders empty state (two variants: `queryError` and "no articles yet") when `articles.length === 0`
- Uses `export const dynamic = "force-dynamic"` to bypass Next.js caching (always serves latest articles)
- Reads `DAILY_NEWS_FOLDER_ID` from `process.env`

**Layout structure:** `<div className="py-8 px-6 max-w-4xl mx-auto">` → header → article feed or empty state

### `app/globals.css` — Global Styles
- Tailwind base/components/utilities directives
- CSS custom properties: `--background: #F0EEE9`, `--foreground: #000000`
- Focus-visible rule: `outline: 2px solid #C15F3C; outline-offset: 2px; border-radius: 4px`
- Focus removal for mouse users: `*:focus:not(:focus-visible) { outline: none; }`

**Note:** TII uses Tailwind v3 via `tailwind.config.ts` (not Tailwind v4). Custom tokens are in `tailwind.config.ts`, not `@theme` in CSS.

---

## Components Directory (`components/`)

### `components/ClarkeLogo.tsx`
Clarke brand logo component. Used for branding display; not currently in the homepage.

### `components/library/news/NewsArticleFeed.tsx` — Article List (Server Component)
Props: `{ articles: Article[] }`
Renders a vertical stack (`flex flex-col gap-12`) of article cards.

Each article card structure:
- Wrapper: `<article className="relative bg-white border border-claude-secondary/40 rounded-xl p-6 md:p-8">`
- "Updated" badge: `absolute top-4 right-4`, orange-100/orange-700 pill (only shown when `article.isUpdated`)
- Title: `<h2 className="text-xl font-semibold text-black leading-snug mb-1">`
- Date label: `<p className="text-[13px] text-claude-secondary mb-4">` — shows "updated at: DD/MM/YYYY" or "created at: DD/MM/YYYY"
- Content: `<div className="prose prose-lg ...">` with `<ReactMarkdown remarkPlugins={[remarkGfm]}>` rendering `article.content`

Date formatting: custom `formatDDMMYYYY()` — applies GMT+7 offset to Firestore timestamp (seconds * 1000 + 7h offset), then formats as DD/MM/YYYY.

Prose config classes applied: `prose-headings:font-semibold prose-headings:text-black prose-h2:text-xl prose-p:text-[17px] prose-p:leading-relaxed prose-a:text-claude-primary prose-hr:border-claude-secondary/30`

### `components/library/news/PaginationControls.tsx` — Pagination (Server Component)
Props: `{ hasMore: boolean; nextCursor?: string; activeCategory?: "vietnam" | "world"; hasPrev: boolean }`
Renders two `<Link>` buttons: "← Newer" and "Older →".
Returns `null` when `!hasMore && !hasPrev`.
Button style: `px-4 py-2 text-[15px] font-medium text-claude-primary border border-claude-primary rounded-lg hover:bg-claude-primary hover:text-white transition-colors duration-150`

Note: `buildUrl()` function constructs `/?cursor=...` URL — the homepage route, not `/library/daily-news`.

### `components/library/news/NewsArticleList.tsx`
Alternative article list component (legacy). Kept in codebase but not used on the main homepage.

### `components/library/news/NewsReadTracker.tsx`
Client component for tracking which articles a user has read. Not currently mounted on the homepage.

---

## Library Directory (`lib/`)

### `lib/firebase/admin.ts` — Firebase Admin SDK
Lazy-initialized singleton pattern. Exports `adminDb` as a Proxy around `getFirestore()`.
Key behavior: `normalizePrivateKey()` handles PEM formatting issues from env var storage.
Settings: `preferRest: true` (avoids gRPC issues in serverless).
**Never import in client code or components.**

### `lib/firebase/firestore.ts` — Firestore Query Functions
Exports:
- `getFolders(parentId?)` — cached 300s, tag "folders"
- `getFoldersWithRealCounts()` — cached 60s, recounts articles in memory
- `getArticles(folderId)` — no cache, ordered by `order` field
- `getArticleById(articleId)` — single doc fetch
- `getArticleBySlug(slug, folderId?)` — query by slug
- `searchArticles(searchQuery, folderId?)` — full scan of `search_index` collection
- `getFeaturedFolders()` — cached 300s, filters `featured == true`
- `getDailyNewsArticles(rootFolderId, cursor?, limit=20)` — paginated by `publishedAt DESC`, cursor is base64-encoded seconds
- `getRecentArticleTitles(rootFolderId, days=30)` — for dedup checks
- `getFolderArticleCount(folderId)` — counts direct + sub-folder articles

`serializeDoc<T>()` utility: converts Firestore Timestamp objects to plain `{ seconds, nanoseconds }` for safe Server→Client prop passing.

### `lib/firebase/config.ts`
Firebase client SDK config (for browser-side usage if needed). Not currently used in TII homepage flow.

### `lib/utils/`
Utility functions directory. Contains `dateGMT7.ts` with `getYesterdayRangeGMT7()` used by the pipeline.

---

## Types Directory (`types/`)

### `types/library.ts`
Defines: `Folder`, `Article`, `SearchResult` interfaces (plus internal `FirestoreTimestamp` type).

Key Article fields:
- `description: string` — max 200 chars (renamed from `excerpt` in v1.2.0)
- `publishedAt?: FirestoreTimestamp` — optional, daily-news articles only
- `isUpdated?: boolean` — true when dedup logic updated an existing article
- `metadata.newsDate?` — string (YYYY-MM-DD) for the day the article covers
- `metadata.topicGroup?` — the topic cluster ID from AI grouping

---

## Trigger Directory (`trigger/`)

### `trigger/daily-news.ts`
The TII daily pipeline task. Registered with `schedules.task({ id: "daily-news", ... })`.
Cron: `0 9 * * *` in `Asia/Bangkok` timezone (UTC+7, same as Vietnam).
Five phases: RSS fetch → topic grouping (Haiku) → article writing (Haiku) → dedup check (Haiku) → Firestore ingest.

---

## Config Directory (`config/`)

### `config/news-sources.json`
Array of `{ id, name, rssUrl, category }` objects. Category is "vietnam" or "world".
The pipeline reads this file directly to know which RSS feeds to fetch.

---

## Design Tokens in Use (from `tailwind.config.ts`)

| Token | Value | Tailwind Classes |
|-------|-------|-----------------|
| `claude-primary` | `#C15F3C` | `text-claude-primary`, `bg-claude-primary`, `border-claude-primary` |
| `claude-secondary` | `#655C54` | `text-claude-secondary` (note: darker than design-system.md `#B1ADA1`) |
| `cloud-dancer` | `#F0EEE9` | `bg-cloud-dancer` |

**Important:** The actual `claude-secondary` in `tailwind.config.ts` is `#655C54` (dark brown), not `#B1ADA1` as listed in the global design-system rule. Use the value from `tailwind.config.ts` as the ground truth.

Font family configured: `var(--font-inter)` as first sans-serif option.

Typography plugin (`@tailwindcss/typography`) enabled for `.prose` classes used in article content rendering.

---

## Common Tailwind Patterns Used in TII

```
# Page container
"py-8 px-6 max-w-4xl mx-auto"

# Article card
"relative bg-white border border-claude-secondary/40 rounded-xl p-6 md:p-8"

# H1 (homepage heading)
"text-3xl md:text-4xl font-semibold leading-snug mb-2"

# Body text / description
"text-[17px] leading-relaxed text-claude-secondary"

# Small metadata text
"text-[13px] text-claude-secondary"

# Primary button / link
"px-4 py-2 text-[15px] font-medium text-claude-primary border border-claude-primary rounded-lg hover:bg-claude-primary hover:text-white transition-colors duration-150"

# Empty state container
"text-center py-16 text-claude-secondary"
```

---

## What Does Not Exist Yet

The following patterns from the design-system rule are defined but not yet implemented in TII:
- No modal component
- No toast notification component
- No slide navigation (no month/page navigation with animation)
- No loading skeleton components
- No `<nav>` element (no site navigation)
- Dark mode is explicitly not used in TII

When adding any of these, follow the animation-and-interaction reference before implementing.

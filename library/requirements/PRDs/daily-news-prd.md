# Daily News Feature — Product Requirements Document

**Version:** 1.0
**Date:** 2026-03-01
**Status:** Approved for Development
**Author:** business-analyst

---

## Section 1: Business Context

### Problem Statement

A single owner-user living in Vietnam, investing in gold, silver, and Vietnamese stocks, must manually browse 30+ news sources daily (mostly in Vietnamese, with no investment lens applied) to stay current on macroeconomic and market developments. This takes significant time and lacks analytical synthesis.

### Business Value

| Dimension | Impact |
|-----------|--------|
| **User Impact** | Replace manual 30-source browsing with one curated, English-language investment briefing delivered each morning |
| **Business Impact** | Increases daily return visits; transforms Clarke's Library from periodic reference to daily habit |
| **Strategic Alignment** | Extends the platform from static knowledge base to living intelligence tool |

### Scope Boundaries

**IN SCOPE:**
- RSS-based article ingestion from 38 curated sources (20 Vietnam, 18 World)
- AI summarization using Claude Haiku with investment-focused structure
- Firestore storage using Article schema extension (5 optional backward-compatible fields)
- `/library/daily-news` UI: filter tabs (All/Vietnam/World), pagination (20/page), Updated badge
- Read tracking via `localStorage` (no server-side user state needed)
- Article detail view via existing catch-all route

**OUT OF SCOPE (V1):**
- Social sharing, comments, push/email notifications
- Multi-user auth or personalization
- Web scraping (RSS only)
- Article retention/cleanup job (Firestore stores indefinitely in V1)
- User-configurable source list

### Success Criteria

| Type | Criterion |
|------|-----------|
| Functional | ≥1 article ingested per category per daily run |
| Functional | Filter tabs correctly scope results; pagination works for >20 articles |
| Quality | AI summaries include investment implications section |
| Quality | Updated badge appears when job re-ingests same slug |
| Timeline | End-to-end pipeline working (manual trigger → article visible in UI) within 1 sprint |

---

## Section 2: Requirements

### Functional Requirements

**R1 — Automated Daily Ingest (P0-Critical)**
GitHub Actions cron job runs at 09:00 GMT+7 (`0 2 * * *` UTC), fetching yesterday's articles (GMT+7 00:00–23:59) from 38 RSS sources. Manual `workflow_dispatch` trigger also supported.

*Acceptance Criteria:* GitHub Actions log shows ≥1 article from each category per run; job completes within 30 minutes.

**R2 — AI Summarization (P0-Critical)**
Each article is summarized in English by Claude Haiku using a structured 3-section format: Summary, Investment Implications, Key Data Points. Content is investment-lens filtered for Vietnam gold/silver/stocks/macro relevance.

*Acceptance Criteria:* Every ingested article's `content` field begins with `## Summary` and includes `## Investment Implications`.

**R3 — Firestore Storage (P0-Critical)**
Articles stored as Firestore documents in the "daily-news" folder. Article schema extended with 5 optional backward-compatible fields (no migration needed for existing articles):

| Field | Type | Purpose |
|-------|------|---------|
| `publishedAt` | Firestore Timestamp | For `orderBy` |
| `category` | `"vietnam" \| "world"` | For `where()` filter |
| `sourceUrl` | string | Link to original |
| `sourceName` | string | e.g., "VnExpress" |
| `isUpdated` | boolean | true when re-ingested |

*Acceptance Criteria:* All 5 fields present on ingested articles; existing articles load without error.

**R8 — Slug Deduplication (P0-Critical)**
Slug format: `{sourceId}-{title-kebab}-{YYYY-MM-DD}`. Re-ingesting the same slug updates the existing document and sets `isUpdated: true`. No duplicate documents created.

*Acceptance Criteria:* Running the ingest job twice produces 0 new duplicates; `isUpdated` flag set to `true` on second run.

**R4 — Daily News Page (P1-High)**
`/library/daily-news` renders filter tabs (All/Vietnam/World) using URL params `?category=`. Articles sorted by `publishedAt` descending, paginated 20 per page using cursor-based pagination (`?cursor=` base64-encoded `publishedAt.seconds`).

*Acceptance Criteria:* Vietnam tab shows only VN articles sorted by date; paginating to page 2 shows next 20 older articles.

**R5 — Updated Badge (P1-High)**
Orange "Updated" badge shown on article cards where `isUpdated === true && !localStorage["news:read"].includes(articleId)`.

*Acceptance Criteria:* Re-running ingest with same slugs → orange "Updated" badge visible on affected cards within 50ms of React hydration.

**R6 — Read Tracking (P1-High)**
Clicking an Updated article stores its ID in `localStorage` key `news:read` (JSON array). Badge hidden on return to list. Persists across page refreshes.

*Acceptance Criteria:* Click Updated article → back to list → badge gone; refresh page → badge still gone.

**R7 — Article Detail (P1-High)**
Article detail rendered by existing catch-all route `/library/[...slug]/page.tsx`. Displays: AI summary (markdown), source name with link to original, published date. `NewsReadTracker` component fires localStorage write on mount for Updated articles.

*Acceptance Criteria:* Navigating to `/library/daily-news/{article-slug}` renders markdown content with source attribution and date.

**R9 — Graceful Failure (P1-High)**
If any individual RSS feed fails to fetch, the job skips that source, logs the error, and continues. Job exits non-zero only if all sources fail or a critical error occurs.

*Acceptance Criteria:* Breaking one RSS URL in config → job still completes and logs the skipped source name.

### Non-Functional Requirements

| Category | Requirement |
|----------|-------------|
| Performance | Ingest job target runtime < 20 minutes for 38 sources |
| Cost | Claude Haiku: ~$0.01–0.05/day for 50–200 articles |
| Accessibility | Filter tabs keyboard-navigable; article cards meet WCAG AA contrast (4.5:1) |
| Security | Ingest endpoint (`POST /api/news/ingest`) protected by `LIBRARY_API_KEY` Bearer token |

---

## Section 3: Constraints & Dependencies

**Technical Constraints:**
- Firebase Admin SDK (server-side only; not importable in client components)
- Composite Firestore indexes required for `orderBy("publishedAt")` queries; indexes must be deployed before first query runs
- `DAILY_NEWS_FOLDER_ID` env var required in both Vercel (production) and GitHub Actions secrets

**External Dependencies:**
- 38 RSS feed URLs must be valid and publicly accessible
- Claude API (Haiku model) availability
- GitHub Actions runner availability (free tier: 2,000 min/month)

**Blocking Deployment Step:**
Firestore indexes take 1–5 minutes to build after first deployment. Do not run the ingest job until indexes are active.

---

## Section 4: Risks & Assumptions

### Top Risks

| Risk | Severity | Mitigation |
|------|----------|------------|
| RSS feeds return 0 articles (date format issues, publish delays) | HIGH | Log clearly per source; monitor first week manually |
| Paywalled sources (Bloomberg, FT, WSJ) return only excerpts | MEDIUM | Summarize headline + excerpt; acceptable quality for V1 |
| Firestore composite index not deployed before first run | MEDIUM | Deploy `firestore.indexes.json`; run setup script before job |
| Claude Haiku rate limits at high article volume | LOW | Sequential processing per source; Haiku has high rate limits |
| RSS feed URLs go offline or change | LOW | Graceful skip per source; periodic manual URL validation |

### Key Assumptions

- All 38 RSS URLs are valid and publicly accessible (validated during development)
- Article retention: indefinite in V1; cleanup job added in V2
- Single owner-user; no multi-user auth or role-based access needed
- `LIBRARY_API_KEY` already exists in Vercel environment (used by other API endpoints)

---

## Section 5: Developer Handoff

### Implementation Sequence

1. **Foundation** — Extend Article type (5 optional fields); create Firestore indexes
2. **Data Layer** — Add `getDailyNewsArticles()` to `firestore.ts` with cursor pagination
3. **API** — Create `POST /api/news/ingest` with batch upsert + `FieldValue.increment`
4. **Config + Deps** — Create `news-sources.json` (38 sources); add `rss-parser` + `@anthropic-ai/sdk`
5. **Script** — Create `ingest-daily-news.ts` (RSS → Claude Haiku → POST ingest)
6. **Automation** — Create `.github/workflows/daily-news.yml` (cron + workflow_dispatch)
7. **Folder Setup** — Run `setup-daily-news-folder.ts` once; capture `DAILY_NEWS_FOLDER_ID`
8. **Secrets** — Add 4 GitHub Actions secrets + `DAILY_NEWS_FOLDER_ID` to Vercel env
9. **Frontend** — `/library/daily-news/page.tsx` + 4 components in `components/library/news/`
10. **Integration** — Wire `NewsReadTracker` into catch-all article page
11. **Deploy + Verify** — Deploy; trigger manual `workflow_dispatch`; verify end-to-end

### Key Files

| File | Action | Priority |
|------|--------|----------|
| `website/types/library.ts` | Add 5 optional Article fields | Done |
| `firestore.indexes.json` | 2 composite indexes | Done |
| `website/lib/firebase/firestore.ts` | Add `getDailyNewsArticles()` | Done |
| `website/app/api/news/ingest/route.ts` | Create batch upsert endpoint | Done |
| `website/config/news-sources.json` | 38 RSS sources | Done |
| `website/scripts/ingest-daily-news.ts` | RSS → Claude → POST | Done |
| `website/scripts/setup-daily-news-folder.ts` | One-time folder setup | Done |
| `.github/workflows/daily-news.yml` | Cron + manual trigger | Done |
| `website/app/library/daily-news/page.tsx` | Server component UI | Done |
| `website/components/library/news/` (4 files) | UI components | Done |
| `website/app/library/[...slug]/page.tsx` | Add NewsReadTracker | Done |

### GitHub Actions Secrets Required

| Secret | Value |
|--------|-------|
| `ANTHROPIC_API_KEY` | Claude API key |
| `LIBRARY_API_KEY` | Same key used by other API endpoints |
| `DAILY_NEWS_INGEST_URL` | `https://<app>.vercel.app/api/news/ingest` |
| `DAILY_NEWS_FOLDER_ID` | Firestore document ID from setup script |

### Validation Checklist

- [ ] Run `setup-daily-news-folder.ts` → folder ID output
- [ ] Deploy to Vercel; confirm `DAILY_NEWS_FOLDER_ID` env var set
- [ ] Add 4 GitHub Actions secrets
- [ ] Trigger `workflow_dispatch` → inspect logs → ≥1 article created
- [ ] Visit `/library/daily-news` → articles render with source + date
- [ ] Switch Vietnam tab → only VN articles shown
- [ ] Re-run job → "Updated" badge appears
- [ ] Click Updated article → back → badge gone

### Definition of Done

- All 11 files created/modified as listed above
- `npm run build` completes with 0 TypeScript errors
- Manual GitHub Actions trigger produces ≥1 article in Firestore
- `/library/daily-news` renders and filters work in production
- Updated badge and read tracking work end-to-end

---

*Technical Guidelines Reference: `backend-guideline.md` (API conventions, Firestore patterns), `frontend-guideline.md` (component patterns, design tokens)*

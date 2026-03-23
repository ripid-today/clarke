# Integration Testing Patterns — TII Quality Engineer Reference

## Scope 3 (Extended): Pipeline End-to-End Testing

Verify the TII daily pipeline runs correctly from RSS fetch through Firestore write.

---

## Pipeline End-to-End Verification

The daily pipeline runs via Trigger.dev cron at 9 AM GMT+7. To verify a pipeline run completed correctly, check these in sequence:

### Step 1: Trigger.dev Run Status
1. Open Trigger.dev dashboard → project `proj_eqmdhwislaqdiphplort`
2. Navigate to "Runs" tab
3. Find the most recent `daily-news` run
4. Check run status:
   - **COMPLETED** (green) — run finished without unhandled exception
   - **FAILED** (red) — run threw an uncaught error; expand logs to see cause
   - **EXECUTING** (blue) — still running (normal for up to 30 minutes)
   - **TIMED_OUT** — ran longer than `maxDuration: 1800` (30 minutes) — investigate

### Step 2: Return Value Check
A successful run return value looks like:
```json
{
  "created": 8,
  "updated": 2,
  "skipped": 0,
  "topicCount": 10,
  "errors": []
}
```

| Field | Pass condition | Warning | Fail |
|-------|---------------|---------|------|
| `created` | 5-15 | <3 (few articles) | 0 (no articles written at all) |
| `updated` | 0-5 | >10 (many updates = many duplicates) | — |
| `skipped` | 0 | 1-3 | >3 (many ingest failures) |
| `topicCount` | 5-15 | <3 | 0 (topic grouping failed) |
| `errors` | empty `[]` | — | Non-empty (any error logged) |

### Step 3: Log Inspection
Expand the Trigger.dev run to view console output. Check each phase:

```
=== Brief Daily News v2 — 2026-03-21 ===
Range: 2026-03-20T17:00:00.000Z → 2026-03-21T17:00:00.000Z
Sources: 8

[Phase 1] Fetching 8 RSS sources...
  [VIETNAM] VnExpress: 12 items
  [VIETNAM] CafeF: 8 items
  [WORLD] Reuters: 15 items
  ...
Total raw items: 67         ← should be >10 on a normal day

[Phase 2] Grouping 67 items into topics...
  → 12 topic groups          ← should be 5-15

[Phase 3] Writing 12 articles...
  Writing: "..." (3 items)
    → 132 words              ← should be 80-180

[Phase 4] Checking for duplicates...
  37 existing articles found
  DUPLICATE: "..." → update abc123

[Phase 5] Ingesting 12 articles...
  CREATED: "..."
  UPDATED: "..."

=== Done ===
Created: 9, Updated: 3, Skipped: 0, Topics: 12
```

**Red flags in logs:**
- `SKIP [source]` lines — RSS source failed; acceptable for 1-2 sources, investigate if >3
- `ERROR:` lines in Phase 3 — article writing failed for some topics
- `Dedup batch call failed` — dedup fell back to "treat all as new"; check AI API availability
- `ERROR:` lines in Phase 5 — article ingest failed; check Firestore permissions

### Step 4: Firestore Write Verification
Query Firestore to confirm articles were written:

```typescript
// Articles created in last 24 hours
const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000);
const snapshot = await adminDb.collection("articles")
  .where("folderId", "==", DAILY_NEWS_FOLDER_ID)
  .where("createdAt", ">=", Timestamp.fromDate(cutoff))
  .get();

console.log(`Articles created in last 24h: ${snapshot.docs.length}`);
// Expected: 5-15 articles

// Check metadata fields
for (const doc of snapshot.docs) {
  const data = doc.data();
  console.log({
    title: data.title,
    wordCount: data.metadata?.wordCount,
    newsDate: data.metadata?.newsDate,
    status: data.status,
  });
}
```

---

## Dedup Verification

To verify the dedup system works correctly, run the pipeline twice against the same date range data:

### Manual Dedup Test
1. Record the current article count: `count1`
2. Manually trigger the `daily-news` task in Trigger.dev for today
3. Wait for it to complete
4. Record new article count: `count2`
5. Trigger the task again immediately (same date range)
6. Wait for completion
7. Record final count: `count3`

**Expected results:**
- `count2 - count1` = number of new articles (e.g., 10)
- `count3 - count2` = 0 (all second-run articles are duplicates, none created)
- Second run's `updated` count ≈ `count2 - count1` (all existing articles updated)
- Second run's `created` = 0

### Checking Dedup Logic
The dedup uses semantic AI matching — same event, different wording = duplicate. Verify:
1. After pipeline run, find two articles that cover similar topics
2. Confirm they have different `metadata.topicGroup` values
3. If they are genuinely different events but have similar titles, the dedup should NOT merge them

---

## Error Injection Testing

### When RSS Feed is Unavailable
1. Temporarily modify `config/news-sources.json` to add an invalid URL:
   ```json
   {"id": "test-fail", "name": "Test Fail", "rssUrl": "https://invalid.example.com/rss", "category": "world"}
   ```
2. Trigger the pipeline manually
3. Verify in logs: `SKIP Test Fail: [error message]`
4. Verify the pipeline continues with remaining sources (not a full failure)
5. Restore `news-sources.json`

### When AI API Fails
This cannot be easily injected without mocking. Instead, verify the error handling code:
- Phase 2 failure (topic grouping): pipeline should return early with `{ topicCount: 0, created: 0 }`
- Phase 3 failure (one article): should log error, continue with remaining topics
- Phase 4 failure (dedup): should fall back to treating all articles as new

### When Firestore Write Fails
This requires temporarily revoking Firebase Admin permissions — not recommended in production. Instead, verify the code path:
- In `trigger/daily-news.ts`, each `ingestArticle()` call is wrapped in try/catch
- Failed ingest increments `skipped` counter and continues
- Final return value shows non-zero `skipped` and `errors` array is populated

---

## Pipeline Observability

### What to Monitor After Each Pipeline Run

| Metric | Where to Find | Normal Range | Alert If |
|--------|-------------|-------------|---------|
| Run status | Trigger.dev dashboard | COMPLETED | FAILED or TIMED_OUT |
| Total raw items | Phase 1 log | >20 | <5 (feeds down) |
| Topic count | Phase 2 log | 5-15 | 0 (AI call failed) |
| Articles created | Return value `created` | 5-15 | 0 for 2+ days |
| Articles with errors | Return value `errors` | empty | Any error present |
| RSS sources skipped | Phase 1 `SKIP` lines | 0-2 | >4 sources skipped |

### Trigger.dev Logs Access
All `console.log()` and `console.error()` from `trigger/daily-news.ts` appear in Trigger.dev's run logs. Logs are retained for 30 days on the free tier.

For structured log searching, look for:
- `[Phase N]` — phase markers (easy navigation)
- `SKIP` — skipped RSS sources
- `DUPLICATE:` — dedup matches found
- `ERROR:` — article write errors
- `=== Done ===` — final summary

---

## Verifying cron Schedule

The cron runs at `0 9 * * *` in `Asia/Bangkok` timezone (9:00 AM GMT+7 = 2:00 AM UTC).

To verify the schedule:
1. Trigger.dev dashboard → "Schedules" tab
2. Find the `daily-news` schedule
3. Confirm next scheduled run shows correct GMT+7 time

To test outside the scheduled time, use the manual trigger in Trigger.dev dashboard:
1. Runs → "Trigger Run" button
2. Select `daily-news` task
3. Leave payload empty (scheduled task uses no payload)
4. Trigger and monitor

---

## Frontend Integration: Pipeline → Homepage

After a pipeline run, verify the TII homepage reflects the new articles:

1. Wait for pipeline run to complete in Trigger.dev
2. Open `https://clarke.ripid.vn` in a browser (or `http://localhost:3000` in dev)
3. Hard refresh (Ctrl+Shift+R) to bypass any browser cache
4. Verify: new articles from today's pipeline appear at the top of the feed
5. Verify: `publishedAt` date on cards matches yesterday's date (news from yesterday, published today)
6. Verify: no raw markdown in any new article's content

**Why homepage refreshes immediately:** `app/page.tsx` uses `export const dynamic = "force-dynamic"` — no caching. Every request goes to Firestore. New articles appear immediately after pipeline write completes.

---

## Integration Test Checklist

After a pipeline run or pipeline code change:

- [ ] Trigger.dev run status: COMPLETED
- [ ] Return value: `created` >= 5, `errors` is empty, `skipped` is 0
- [ ] Phase 1 log shows all expected RSS sources with >0 items each
- [ ] Phase 2 log shows 5-15 topic groups
- [ ] Phase 3 word counts are 80-180 words each
- [ ] Phase 4 dedup found and processed expected articles
- [ ] Phase 5 no ERROR lines
- [ ] Firestore: new articles have all required fields
- [ ] Firestore: `metadata.newsDate` = yesterday's date (YYYY-MM-DD)
- [ ] Homepage: new articles visible immediately after hard refresh
- [ ] Homepage: no raw markdown in new article content
- [ ] Dedup test: second pipeline run produces `created: 0`

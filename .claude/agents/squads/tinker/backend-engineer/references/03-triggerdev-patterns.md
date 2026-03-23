# Trigger.dev v3 Patterns — TII Backend Reference

## TII Configuration (`trigger.config.ts`)

```ts
import { defineConfig } from "@trigger.dev/sdk/v3";

export default defineConfig({
  project: "proj_eqmdhwislaqdiphplort",
  dirs: ["./trigger"],   // Trigger.dev scans this directory for task files
  maxDuration: 1800,     // 30 minutes max task run time (matches daily pipeline needs)
});
```

**Key constraint:** `maxDuration: 1800` (30 minutes). The daily pipeline typically completes in under 10 minutes, but this provides headroom for slow RSS feeds and AI API latency.

---

## Task Definition (Scheduled Task)

TII's daily pipeline uses `schedules.task()` — a cron-triggered task:

```ts
import { schedules } from "@trigger.dev/sdk/v3";

export const dailyNewsTask = schedules.task({
  id: "daily-news",          // Must be unique across the project; cannot change after first deploy
  cron: {
    pattern: "0 9 * * *",   // 9 AM daily
    timezone: "Asia/Bangkok", // UTC+7, same as Vietnam (GMT+7)
  },
  retry: {
    maxAttempts: 3,          // Retry up to 3 times on failure
  },
  run: async () => {
    // Task body
    return { created: 0, updated: 0, skipped: 0, errors: [] };
  },
});
```

### Cron Pattern for GMT+7

Trigger.dev supports timezone-aware cron via the `cron.timezone` property. Use `"Asia/Bangkok"` for Vietnam/UTC+7:

```ts
cron: {
  pattern: "0 9 * * *",      // 9:00 AM
  timezone: "Asia/Bangkok",   // Asia/Bangkok = UTC+7, no DST changes
}
```

Common patterns for TII:
| Pattern | Time (GMT+7) | Use case |
|---------|-------------|---------|
| `"0 9 * * *"` | 9:00 AM daily | Daily news pipeline |
| `"0 8 * * 1-5"` | 8:00 AM weekdays | Weekday-only tasks |
| `"0 */6 * * *"` | Every 6 hours | Frequent refresh |
| `"0 9 * * 1"` | 9:00 AM Mondays | Weekly summary |

### General Task (Non-Scheduled)

For tasks triggered programmatically (not on a schedule):

```ts
import { task } from "@trigger.dev/sdk/v3";

export const articleProcessingTask = task({
  id: "process-article",
  retry: {
    maxAttempts: 3,
    minTimeoutInMs: 1000,
    backoffCoefficient: 2,   // 1s → 2s → 4s between retries
  },
  run: async (payload: { articleId: string }) => {
    // Task body using payload
    return { processed: true };
  },
});
```

---

## Retry Configuration

```ts
retry: {
  maxAttempts: 3,          // Total attempts including the first (so 2 retries)
  minTimeoutInMs: 1000,    // Wait at least 1 second before first retry
  backoffCoefficient: 2,   // Multiply timeout by 2 on each attempt: 1s, 2s, 4s
  maxTimeoutInMs: 30000,   // Cap retry delay at 30 seconds
}
```

TII current setting: `maxAttempts: 3` only (uses Trigger.dev defaults for timeout). The daily pipeline is designed to be idempotent — re-running it produces the same result (dedup prevents duplicate articles).

---

## Calling Subtasks

To call another Trigger.dev task from within a task:

```ts
import { articleProcessingTask } from "./article-processing";

// Within a parent task's run function:
const handle = await articleProcessingTask.trigger({ articleId: "abc123" });

// Or call and wait for the result:
const result = await articleProcessingTask.triggerAndWait({ articleId: "abc123" });
console.log(result.output); // the return value of articleProcessingTask.run()
```

**TII pattern:** The daily pipeline is a single monolithic task (all phases in one `run()` function). No subtask invocation currently. If the pipeline grows significantly, split phases into subtasks.

---

## Environment Variables in Trigger.dev

Trigger.dev tasks run in Trigger.dev's cloud environment (not Vercel). Environment variables must be configured separately in the Trigger.dev dashboard.

**Required env vars for the daily-news task:**
```
ANTHROPIC_API_KEY          # Claude API key for article generation
FIREBASE_ADMIN_PROJECT_ID  # Firebase project ID
FIREBASE_ADMIN_CLIENT_EMAIL # Firebase service account email
FIREBASE_ADMIN_PRIVATE_KEY  # Firebase service account private key (PEM)
DAILY_NEWS_FOLDER_ID        # Firestore folder ID for daily news articles
```

**How to access in task code:**
```ts
const apiKey = process.env.ANTHROPIC_API_KEY;
if (!apiKey) throw new Error("ANTHROPIC_API_KEY is not set");
```

Throw early if required env vars are missing — fail fast with a clear error rather than a cryptic downstream failure.

---

## TII Actual Task Structure

The `trigger/daily-news.ts` file implements the pipeline in 5 phases within a single `schedules.task()`:

```
Phase 1: fetchAllSources()
  → Fetches all RSS sources from config/news-sources.json
  → Filters items published yesterday (GMT+7 date range)
  → Returns: RawNewsItem[]

Phase 2: aggregateTopics()
  → Single Claude Haiku call
  → Groups raw items into 5-15 topic clusters
  → Returns: TopicGroup[] with indices pointing to raw items

Phase 3: writeArticle() — one per topic
  → One Haiku call per topic group
  → Generates 100-150 word investment brief
  → Returns: AggregatedArticle[]

Phase 4: checkDuplicates()
  → Queries Firestore for articles from last 7 days
  → Single Haiku call: semantic match new articles vs existing
  → Returns: Map<title, duplicateId | null>

Phase 5: ingestArticle() — one per article
  → If duplicate: updates existing doc (description, metadata)
  → If new: creates new doc, increments folder.articleCount
  → Returns: "created" | "updated"
```

The task returns `{ created, updated, skipped, topicCount, errors }` — all counters plus any error messages accumulated during the run.

---

## File Location and Registration

**File location:** `projects/the-intelligent-investor/trigger/`
All `.ts` files in this directory are automatically registered by Trigger.dev (per `dirs: ["./trigger"]` in `trigger.config.ts`).

**Registration:** Export the task as a named export from the task file. Trigger.dev discovers it automatically.

```ts
// trigger/my-new-task.ts
import { schedules } from "@trigger.dev/sdk/v3";

export const myNewTask = schedules.task({
  id: "my-new-task",  // must be unique
  // ...
});
```

**No manual registration** is needed in `trigger.config.ts` — the `dirs` config handles discovery.

---

## Adding a New Task

1. Create `trigger/[task-name].ts`
2. Import the appropriate Trigger.dev primitive (`schedules.task` for cron, `task` for programmatic)
3. Set a unique `id` (kebab-case, descriptive)
4. Configure retry and maxDuration as appropriate
5. Add required env vars to Trigger.dev dashboard
6. Deploy: `npx trigger.dev@latest deploy` or push to Vercel (Trigger.dev picks up changes)

**Testing locally:**
```bash
# In projects/the-intelligent-investor/
npx trigger.dev@latest dev
```

This starts a local Trigger.dev dev runner. Trigger tasks manually from the Trigger.dev dashboard to test.

---

## Verifying a Task Ran Successfully

1. Open Trigger.dev dashboard → select project
2. Navigate to "Runs" tab
3. Find the run by task ID and timestamp
4. Check the run status: `COMPLETED` (green), `FAILED` (red), `EXECUTING` (blue)
5. Expand the run to see logs and the return value

**Log inspection:** All `console.log()` and `console.error()` calls from the task appear in the run's log view. TII logs each phase with `[Phase N]` prefix for easy navigation.

**Return value:** The task returns a summary object. A successful run shows:
```json
{ "created": 8, "updated": 2, "skipped": 0, "topicCount": 10, "errors": [] }
```

Zero `errors` and zero `skipped` = clean run. Non-empty `errors` means some articles failed to write — check the specific error messages.

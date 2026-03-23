# Data Validation Patterns — TII Quality Engineer Reference

## Scope 2: Data Integrity Testing

Validate that Firestore article data meets TII quality standards after pipeline runs.

---

## Required Fields Check

Every article created by the daily pipeline must have these fields:

```typescript
// Required fields — absence = data integrity failure
const REQUIRED_ARTICLE_FIELDS = [
  "id",
  "title",
  "slug",
  "folderId",
  "folderPath",
  "content",
  "description",
  "order",
  "status",
  "priority",
  "publishedAt",
  "createdAt",
  "updatedAt",
];

// Check via Firestore Admin SDK query:
const snapshot = await adminDb.collection("articles")
  .where("folderId", "==", DAILY_NEWS_FOLDER_ID)
  .orderBy("createdAt", "desc")
  .limit(30) // check last 30 articles
  .get();

for (const doc of snapshot.docs) {
  const data = doc.data();
  for (const field of REQUIRED_ARTICLE_FIELDS) {
    if (!(field in data) || data[field] === null || data[field] === undefined) {
      console.error(`Article ${doc.id} missing required field: ${field}`);
    }
  }
}
```

---

## Word Count Validation

TII articles target 100-150 words (hard cap of 150 per prompt). The QA threshold is:

| Status | Word Count | Action |
|--------|-----------|--------|
| Pass | 80-180 words | Acceptable (±30 word tolerance for AI variance) |
| Warning | 50-79 or 181-220 words | Flag but do not block |
| Fail | <50 or >220 words | Bug report — pipeline prompt adherence failure |

```typescript
// Word count algorithm: strip markdown, split on whitespace
function countWords(content: string): number {
  return content
    .replace(/[#*`\[\]]/g, "")   // strip markdown symbols
    .replace(/\s+/g, " ")         // normalize whitespace
    .trim()
    .split(" ")
    .filter(w => w.length > 0)
    .length;
}

// Validate articles from latest pipeline run
const yesterday = new Date();
yesterday.setDate(yesterday.getDate() - 1);
yesterday.setHours(0, 0, 0, 0);
// Adjust for GMT+7: subtract 7 hours from local UTC
const cutoffUTC = new Date(yesterday.getTime() - 7 * 60 * 60 * 1000);

const snapshot = await adminDb.collection("articles")
  .where("folderId", "==", DAILY_NEWS_FOLDER_ID)
  .where("createdAt", ">=", Timestamp.fromDate(cutoffUTC))
  .get();

for (const doc of snapshot.docs) {
  const content = doc.data().content || "";
  const wordCount = countWords(content);
  if (wordCount < 80 || wordCount > 180) {
    console.warn(`Article "${doc.data().title}" word count out of range: ${wordCount}`);
  }
}
```

---

## Orphan Check

An orphaned article has a `folderId` that doesn't match any document in the `folders` collection.

```typescript
// Get all article folderIds
const articlesSnap = await adminDb.collection("articles").select("folderId").get();
const articleFolderIds = new Set(articlesSnap.docs.map(d => d.data().folderId as string));

// Get all folder IDs
const foldersSnap = await adminDb.collection("folders").select("id").get();
const folderIds = new Set(foldersSnap.docs.map(d => d.id));

// Find orphans
const orphanFolderIds = [...articleFolderIds].filter(id => !folderIds.has(id));
if (orphanFolderIds.length > 0) {
  console.error(`Orphaned folderId(s) found: ${orphanFolderIds.join(", ")}`);
  // This is a blocker bug — articles unreachable on the frontend
}
```

A non-zero orphan count means the `DAILY_NEWS_FOLDER_ID` env var changed, or the folder was deleted. This is a blocker bug.

---

## Duplicate Detection

After a pipeline run, check that no two articles with the same date have near-identical titles:

```typescript
// Get all articles from today's pipeline run
const snapshot = await adminDb.collection("articles")
  .where("folderId", "==", DAILY_NEWS_FOLDER_ID)
  .where("metadata.newsDate", "==", dateStr) // "YYYY-MM-DD" format
  .get();

const titlesInRun: string[] = snapshot.docs.map(d => d.data().title as string);
const uniqueTitles = new Set(titlesInRun);

if (uniqueTitles.size < titlesInRun.length) {
  console.error(`Duplicate titles in same pipeline run: ${titlesInRun.length - uniqueTitles.size} duplicates`);
}
```

**Pipeline re-run dedup test:** Run the daily pipeline twice with the same date range data. After the second run:
- `created` count should be 0 (all articles already exist as duplicates)
- `updated` count should equal the article count from the first run
- Total articles in Firestore for that date should remain the same

---

## articleCount Validation

The `folders` document caches an `articleCount` field. Validate it matches the actual count:

```typescript
// Get cached count from folder
const folderDoc = await adminDb.collection("folders").doc(DAILY_NEWS_FOLDER_ID).get();
const cachedCount = folderDoc.data()?.articleCount || 0;

// Get actual count
const actualCount = await adminDb.collection("articles")
  .where("folderId", "==", DAILY_NEWS_FOLDER_ID)
  .count()
  .get();

const realCount = actualCount.data().count;

if (Math.abs(cachedCount - realCount) > 2) {
  // Allow ±2 tolerance for in-flight writes during counting
  console.error(`articleCount mismatch: cached=${cachedCount}, actual=${realCount}`);
}
```

A large discrepancy (>5) indicates the `FieldValue.increment(1)` call is failing during article creation, or documents were deleted without decrementing the counter.

---

## Schema Field Validation

Validate field values match expected types and enums:

```typescript
const validStatuses = ["draft", "published", "archived"];
const validPriorities = ["low", "medium", "high"];

for (const doc of snapshot.docs) {
  const data = doc.data();

  // Status enum check
  if (!validStatuses.includes(data.status)) {
    console.error(`Article ${doc.id} has invalid status: "${data.status}"`);
  }

  // Priority enum check
  if (!validPriorities.includes(data.priority)) {
    console.error(`Article ${doc.id} has invalid priority: "${data.priority}"`);
  }

  // Description length (max 200 chars)
  if (data.description && data.description.length > 200) {
    console.warn(`Article ${doc.id} description exceeds 200 chars: ${data.description.length}`);
  }

  // Slug format check
  if (data.slug && !/^[a-z0-9-]+$/.test(data.slug)) {
    console.error(`Article ${doc.id} has invalid slug: "${data.slug}"`);
  }

  // metadata.newsDate format check
  if (data.metadata?.newsDate && !/^\d{4}-\d{2}-\d{2}$/.test(data.metadata.newsDate)) {
    console.error(`Article ${doc.id} has invalid newsDate format: "${data.metadata.newsDate}"`);
  }
}
```

---

## Correct Folder Assignment

For TII daily-news articles, all articles must have `folderId == DAILY_NEWS_FOLDER_ID`:

```typescript
const wrongFolder = snapshot.docs.filter(
  doc => doc.data().folderId !== DAILY_NEWS_FOLDER_ID
);
if (wrongFolder.length > 0) {
  console.error(`${wrongFolder.length} article(s) written to wrong folder`);
}
```

---

## Data Validation Checklist (Post-Pipeline Run)

After each pipeline run, verify:

- [ ] Required fields present on all new articles (id, title, slug, folderId, content, description, status, priority, publishedAt, createdAt, updatedAt)
- [ ] Word count in range: 80-180 words (warn outside range, fail if <50 or >220)
- [ ] Zero orphaned articles (all article.folderId values map to existing folder documents)
- [ ] No exact duplicate titles within the same pipeline run's newsDate
- [ ] `articleCount` in the daily-news folder matches actual article count (±2 tolerance)
- [ ] All new articles have `status: "published"` and `priority: "medium"`
- [ ] All new articles have `metadata.newsDate` set to yesterday's date (YYYY-MM-DD)
- [ ] Slug format matches `/^[a-z0-9-]+$/` for all new articles

---

## How to Run Data Validation

Data validation queries require Firebase Admin SDK access. Options:

1. **Via Trigger.dev task:** Create a one-off validation task and trigger it manually from the Trigger.dev dashboard
2. **Via local script:** Run `ts-node scripts/validate-articles.ts` from the project root (requires local .env.local)
3. **Via Next.js API route:** Create a temporary `app/api/validate/route.ts` (authenticated endpoint) that runs the checks and returns results — delete after use

For routine QA, the Trigger.dev approach is preferred (logs visible in dashboard, no local setup needed).

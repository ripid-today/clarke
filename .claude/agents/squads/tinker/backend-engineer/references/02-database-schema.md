# Database Schema — TII Backend Reference

## Collections Overview

TII uses three Firestore collections:
- `folders` — content hierarchy (the daily-news folder)
- `articles` — the daily AI briefings
- `search_index` — denormalized search data

---

## Folder Collection (`folders`)

```typescript
interface Folder {
  id: string;                    // Auto-generated Firestore document ID
  name: string;                  // Display name (max 100 chars)
  slug: string;                  // URL-safe identifier, pattern: /^[a-z0-9-]+$/
  parentId: string | null;       // Parent folder ID or null for root-level
  description: string;           // Max 300 characters
  path: string[];                // Ancestry path for breadcrumbs
  order: number;                 // Display order (lower = shown first)
  featured: boolean;             // Show on homepage featured section
  articleCount: number;          // Cached count (updated on article create; FieldValue.increment)
  createdAt: Timestamp;
  updatedAt: Timestamp;
  metadata?: {
    icon?: string;               // Icon identifier (e.g., "book", "folder")
    color?: string;              // Hex color (e.g., "#C15F3C")
    status?: "building" | "review" | "complete";
  };
}
```

**Validation:**
- `name`: required, 1-100 chars
- `slug`: required, pattern `/^[a-z0-9-]+$/`
- `description`: required, max 300 chars
- `order`: number, default 0
- `featured`: boolean, default false
- `articleCount`: number, default 0 (maintained via `FieldValue.increment`)

**TII daily-news folder:** One root folder document with `parentId: null`, `featured: true`. Its ID is stored in `DAILY_NEWS_FOLDER_ID` env var. All daily-news articles have `folderId` pointing to this document.

---

## Article Collection (`articles`)

```typescript
interface Article {
  id: string;                    // Auto-generated Firestore document ID (also stored in doc)
  title: string;                 // Max 200 chars
  slug: string;                  // Pattern: /^[a-z0-9-]+$/ — generated from topic title + date
  folderId: string;              // Must reference existing folder
  folderPath: string[];          // Cached folder path for breadcrumbs
  content: string;               // Markdown content — 100-150 word target for TII
  description: string;           // Max 200 characters (auto-generated excerpt from content)
  order: number;                 // Display order within folder (always 0 for daily-news)
  status: string;                // "published" for all pipeline-generated articles
  priority: string;              // "medium" for all pipeline-generated articles
  publishedAt: Timestamp;        // Timestamp of the underlying news event (from RSS pubDate)
  createdAt: Timestamp;          // When the Firestore document was created
  updatedAt: Timestamp;          // When the document was last modified
  isUpdated?: boolean;           // true when dedup updated an existing article
  category?: "vietnam" | "world"; // Currently unused in TII pipeline v2
  metadata?: {
    wordCount?: number;          // Word count of content field
    readingTime?: number;        // Minutes (ceil(wordCount / 200))
    lastModifiedBy?: string;     // "brief-daily-news-v2" for pipeline-generated
    version?: number;            // Increments on each update
    // v2 aggregated article fields
    newsDate?: string;           // "YYYY-MM-DD" format — the date the news covers
    topicGroup?: string;         // kebab-case topic cluster ID from AI grouping
    isAggregated?: boolean;      // true for v2 aggregated articles
    lastDuplicateCheck?: string; // ISO date string of last dedup check
  };
}
```

**Required fields on creation:**
`id`, `title`, `slug`, `folderId`, `folderPath`, `content`, `description`, `order`, `status`, `priority`, `publishedAt`, `createdAt`, `updatedAt`

**Optional fields (set by pipeline, not always present):**
`isUpdated`, `category`, `metadata.*`

**Validation (at ingest time):**
- `title`: required, 1-200 chars
- `slug`: required, lowercase pattern — format: `{topic-slug}-{YYYY-MM-DD}`
- `folderId`: required, must reference existing folder
- `description`: max 200 chars (auto-truncated in pipeline)
- `status`: "draft" | "published" | "archived" — pipeline always sets "published"
- `priority`: "low" | "medium" | "high" — pipeline always sets "medium"

---

## Search Index Collection (`search_index`)

```typescript
interface SearchResult {
  articleId: string;             // Reference to articles collection
  title: string;                 // Lowercase for case-insensitive search
  description: string;           // Lowercase (max 200 chars)
  folderPath: string[];          // Folder hierarchy for filtering
  score?: number;                // Not stored; computed at query time
}
```

**Purpose:** Denormalized, optimized for search. Not currently maintained by the TII daily pipeline — only updated by manual library operations.

**Search implementation:** Full scan of `search_index` collection (no Firestore full-text search). Filters by substring match on `title` and `description` fields. Capped at 20 results.

---

## Schema Change History

### v1.0.0 — Initial Schema
- `Article.excerpt`: short description field (max 200 chars)
- `Article.tags`: array of string tags

### v1.2.0 — Field Renames and Removals
- **`excerpt` renamed to `description`**: Reflects content role more accurately. Both old and new code read `description`; migration script updated all existing docs.
- **`tags` field removed**: Unused feature. Field was dropped from TypeScript interface and all new documents omit it.
- **`search_index.excerpt` renamed to `description`**: Matching the article change.

**BREAKING CHANGE:** Any query filtering on `excerpt` or `tags` will return no results. All current code uses `description`.

### v2.0.0 — Aggregated Articles (brief-daily-news-v2)
- Added `metadata.newsDate` — tracks which day the article covers
- Added `metadata.topicGroup` — tracks the AI-generated topic cluster
- Added `metadata.isAggregated` — flag for v2 articles
- Added `metadata.lastDuplicateCheck` — timestamp of last dedup run
- Added `isUpdated` — true when a duplicate was updated rather than created new
- Changed dedup logic from title-hash to semantic AI comparison

No schema migration needed (all new fields are optional and backward-compatible with v1 reader code).

---

## Adding a New Field

When a PRD requires a new field on an existing collection, follow this process:

### Step 1: Make Field Optional in TypeScript
```typescript
// types/library.ts
interface Article {
  // existing fields...
  newField?: string; // optional — both old and new docs work
}
```

### Step 2: Deploy Code Reading Both Old and New Values
```typescript
// If replacing an existing field:
const value = doc.data().newField ?? doc.data().oldField ?? defaultValue;
```

### Step 3: Run Migration Script (if needed)
For schema changes that add required fields to existing documents, write a migration script:
```typescript
// scripts/migrate-add-new-field.ts
import { adminDb } from "@/lib/firebase/admin";
import { FieldValue } from "firebase-admin/firestore";

async function migrate() {
  const snapshot = await adminDb.collection("articles").get();
  let batch = adminDb.batch();
  let opCount = 0;

  for (const doc of snapshot.docs) {
    if (!doc.data().newField) {
      batch.update(doc.ref, { newField: "defaultValue" });
      opCount++;

      if (opCount >= 499) {
        await batch.commit();
        batch = adminDb.batch();
        opCount = 0;
      }
    }
  }

  if (opCount > 0) await batch.commit();
  console.log("Migration complete");
}

migrate().catch(console.error);
```

### Step 4: Validate Migration
Query for documents where the old field exists or new field is missing:
```typescript
// Verify no docs are missing the new field
const missing = await adminDb.collection("articles")
  .where("newField", "==", null)
  .count()
  .get();
console.log(`Docs missing newField: ${missing.data().count}`);
```

### Step 5: Mark Field as Required in TypeScript
After confirming migration is complete:
```typescript
interface Article {
  newField: string; // now required — remove `?`
}
```

---

## Breaking Change Classification

Mark a schema change as **BREAKING** in the PRD when:
- A field is **removed** (old code reading it will get `undefined`)
- A field is **renamed** (readers using old name get `undefined`)
- A field's **type changes** (e.g., `string` → `string[]`)
- A field that was **optional** becomes **required** (validation rejects old documents)

For all BREAKING schema changes, the migration must complete before old-field-reading code is removed from the codebase.

---

## Composite Index Requirements

Queries that combine `where()` on one field with `orderBy()` on a different field require a composite index.

**Existing TII indexes (required for current queries):**
| Collection | Fields | Order |
|------------|--------|-------|
| `articles` | `folderId` ASC, `publishedAt` DESC | compound |
| `articles` | `folderId` ASC, `publishedAt` ASC | compound (for dedup cutoff query) |
| `folders` | `parentId` ASC, `order` ASC | compound |
| `folders` | `featured` ASC, `order` ASC | compound |

If you add a new query that combines `where()` and `orderBy()` on different fields, you will need to create a new composite index in the Firebase console.

**How to detect a missing index:** The Firestore error message for a missing index includes a link to create it in the Firebase console. Check server logs for `FAILED_PRECONDITION` errors.

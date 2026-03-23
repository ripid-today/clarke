# Firestore Patterns — TII Backend Reference

## Firebase Admin SDK Initialization Pattern

TII uses a lazy-initialized singleton in `lib/firebase/admin.ts`. Key design decisions:

**Lazy initialization:** `_adminDb` is `null` until first use. Avoids initializing during Next.js build when env vars are absent.

**Proxy pattern:** `adminDb` is exported as a `Proxy` that calls `getAdminDb()` on every property access. This means:
- Any code that does `adminDb.collection(...)` works correctly even before init
- No need to call an init function anywhere — it happens transparently on first use

**Private key normalization:** `normalizePrivateKey()` handles PEM formatting issues common when storing private keys in environment variables (escaped `\n`, CRLF, quotes).

**Settings:** `preferRest: true` — avoids gRPC issues in serverless/edge environments.

```ts
// How to use adminDb in any server-side file:
import { adminDb } from "@/lib/firebase/admin";

const snapshot = await adminDb.collection("articles").get();
```

Never call `initializeApp()` directly in any other file — that is `admin.ts`'s responsibility.

---

## Basic CRUD Operations

### Read a Single Document
```ts
const doc = await adminDb.collection("articles").doc(articleId).get();

if (!doc.exists) {
  return null; // document not found
}

const data = doc.data(); // typed as FirebaseFirestore.DocumentData
const article = { id: doc.id, ...data } as Article;
```

### Read Multiple Documents (Query)
```ts
const snapshot = await adminDb
  .collection("articles")
  .where("folderId", "==", folderId)
  .orderBy("publishedAt", "desc")
  .limit(20)
  .get();

const articles = snapshot.docs.map(doc => ({
  id: doc.id,
  ...doc.data(),
})) as Article[];
```

### Create a Document (auto-generated ID)
```ts
const now = Timestamp.now();
const ref = adminDb.collection("articles").doc(); // generates new ID

await ref.set({
  id: ref.id, // store the auto-generated ID in the document
  title: "Article Title",
  content: "...",
  folderId: "folder-id",
  createdAt: now,
  updatedAt: now,
  status: "published",
  priority: "medium",
});
```

### Create a Document (specified ID)
```ts
await adminDb.collection("articles").doc("specific-id").set({
  // full document data
});
```

### Update Specific Fields
```ts
import { FieldValue } from "firebase-admin/firestore";

await adminDb.collection("articles").doc(articleId).update({
  description: "new description",
  updatedAt: Timestamp.now(),
  "metadata.wordCount": 150,           // dot notation for nested fields
  articleCount: FieldValue.increment(1), // atomic increment
});
```

### Delete a Document
```ts
await adminDb.collection("articles").doc(articleId).delete();
```

---

## Firestore Query Patterns

### Filtering with `where()`
```ts
// Equality
.where("folderId", "==", folderId)
.where("status", "==", "published")

// Range (requires composite index if combined with orderBy on different field)
.where("publishedAt", ">=", Timestamp.fromDate(cutoff))
.where("publishedAt", "<=", Timestamp.fromDate(end))

// Boolean
.where("featured", "==", true)
```

### Ordering with `orderBy()`
```ts
.orderBy("publishedAt", "desc")  // newest first
.orderBy("order", "asc")         // ascending order field (default)
```

**Composite index requirement:** If you `where()` on field A and `orderBy()` on field B (different fields), Firestore requires a composite index. Create it in Firebase console or `firestore.indexes.json`. The TII article query uses a pre-existing composite index on `folderId + publishedAt`.

### Pagination with Cursors
TII uses cursor-based pagination (not page numbers). The cursor is the `publishedAt` timestamp of the last document on the current page, encoded in base64:

```ts
// Encoding (when sending to client)
const seconds = lastDoc.data().publishedAt._seconds;
const nextCursor = Buffer.from(String(seconds)).toString("base64");

// Decoding (when reading from client)
const cursorSeconds = parseInt(Buffer.from(cursor, "base64").toString("utf8"), 10);
const cursorTimestamp = new Timestamp(cursorSeconds, 0);
query = query.startAfter(cursorTimestamp);
```

General cursor pattern:
```ts
let query = adminDb.collection("articles")
  .where("folderId", "==", folderId)
  .orderBy("publishedAt", "desc");

if (cursor) {
  query = query.startAfter(cursor); // cursor is a DocumentSnapshot or value
}

const snapshot = await query.limit(limit + 1).get(); // fetch limit+1 to detect hasMore
const hasMore = snapshot.docs.length > limit;
const pageDocs = hasMore ? snapshot.docs.slice(0, limit) : snapshot.docs;
```

### Count Query (Firestore count() — cheaper than fetching docs)
```ts
const countResult = await adminDb
  .collection("articles")
  .where("folderId", "==", folderId)
  .count()
  .get();

const total = countResult.data().count;
```

Use `count()` instead of fetching all docs when you only need the number.

### Select (Partial Documents — cheaper reads)
```ts
// Only fetch folderId field — cheaper than full document
const snapshot = await adminDb
  .collection("articles")
  .select("folderId")
  .get();
```

Use `.select()` for projection when reading many documents but only needing a subset of fields.

---

## Batch Writes (Max 500 Operations Per Batch)

Use batch writes when writing or deleting multiple documents atomically:

```ts
import { WriteBatch } from "firebase-admin/firestore";

const batch = adminDb.batch();
let opCount = 0;

for (const item of items) {
  const ref = adminDb.collection("articles").doc();
  batch.set(ref, { id: ref.id, ...item });
  opCount++;

  // CRITICAL: commit and start new batch before hitting 500-op limit
  if (opCount >= 499) {
    await batch.commit();
    batch = adminDb.batch(); // Note: batch needs to be `let` not `const`
    opCount = 0;
  }
}

// Commit remaining operations
if (opCount > 0) {
  await batch.commit();
}
```

**Why 499 not 500?** A single batch can include `set`, `update`, and `delete` as operations. Each document write counts as 1. Stay at 499 to leave room for edge cases.

### Batch vs Transaction

| Use batch when | Use transaction when |
|---------------|---------------------|
| Writing multiple documents unconditionally | Reading data AND conditionally writing based on that read |
| Deleting multiple documents | Atomic increment with read-verify |
| No read needed before write | Need to read-then-write with atomicity guarantee |

```ts
// Transaction example: read articleCount then conditionally update
const result = await adminDb.runTransaction(async (transaction) => {
  const folderRef = adminDb.collection("folders").doc(folderId);
  const folder = await transaction.get(folderRef);

  if (!folder.exists) throw new Error("Folder not found");

  const currentCount = folder.data()!.articleCount || 0;
  transaction.update(folderRef, { articleCount: currentCount + 1 });

  return currentCount + 1;
});
```

For TII's `articleCount` increment, `FieldValue.increment(1)` is sufficient (atomic, no transaction needed). Transactions are needed only when you must read a value and branch logic based on it within the same atomic operation.

---

## Serializing Timestamps for Client Components

Firestore Admin SDK returns `Timestamp` objects. These cannot be passed directly from Server Components to Client Components (they contain methods — not serializable).

TII's `serializeDoc<T>()` in `firestore.ts` handles this:
```ts
function serializeDoc<T>(doc: FirebaseFirestore.DocumentSnapshot): T {
  const data = doc.data() || {};
  const serialized: Record<string, unknown> = { id: doc.id };

  for (const [key, value] of Object.entries(data)) {
    // Convert Timestamp objects to plain { seconds, nanoseconds }
    if (value && typeof value === "object" && "_seconds" in value && "_nanoseconds" in value) {
      const ts = value as { _seconds: number; _nanoseconds: number };
      serialized[key] = { seconds: ts._seconds, nanoseconds: ts._nanoseconds };
    } else {
      serialized[key] = value;
    }
  }
  return serialized as T;
}
```

Always use `serializeDoc<T>()` when returning documents that will be passed as props to components.

---

## Error Handling for Firestore Operations

### Common Firestore Errors and HTTP Status Mappings

| Firestore error code | Meaning | HTTP response |
|---------------------|---------|---------------|
| `NOT_FOUND` / `5` | Document doesn't exist | 404 |
| `PERMISSION_DENIED` / `7` | Admin SDK bypasses rules, but can still fail on quota | 403 |
| `RESOURCE_EXHAUSTED` / `8` | Firestore quota exceeded | 503 (retry later) |
| `UNAVAILABLE` / `14` | Firestore temporarily unavailable | 503 |
| `DEADLINE_EXCEEDED` / `4` | Query timeout (complex query, missing index) | 504 |

```ts
// Error handling in a Route Handler
try {
  const snapshot = await adminDb.collection("articles").doc(id).get();
  if (!snapshot.exists) {
    return NextResponse.json({ error: "Article not found" }, { status: 404 });
  }
  return NextResponse.json({ data: serializeDoc(snapshot) });
} catch (error) {
  console.error("Failed to fetch article", {
    articleId: id,
    error: error instanceof Error ? error.message : String(error),
  });
  return NextResponse.json({ error: "Internal server error" }, { status: 500 });
}
```

---

## TII Real Query Patterns

### Get Daily News Articles (paginated)
From `lib/firebase/firestore.ts` — the homepage query:
```ts
let query = adminDb
  .collection("articles")
  .where("folderId", "==", rootFolderId)
  .orderBy("publishedAt", "desc");

if (cursor) {
  const cursorTimestamp = new Timestamp(cursorSeconds, 0);
  query = query.startAfter(cursorTimestamp);
}

const snapshot = await query.limit(limit + 1).get();
```

### Get Recent Article Titles for Dedup
From `trigger/daily-news.ts` — dedup check:
```ts
const snapshot = await adminDb
  .collection("articles")
  .where("folderId", "==", rootFolderId)
  .where("publishedAt", ">=", Timestamp.fromDate(cutoff))
  .get();
```

### Increment articleCount After Creating Article
From `trigger/daily-news.ts` — ingest step:
```ts
await adminDb.collection("folders").doc(rootFolderId).update({
  articleCount: FieldValue.increment(1),
});
```

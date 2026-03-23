# Coding Standards — TII Backend

## TypeScript

### Strict Mode
TII's `tsconfig.json` enables strict mode:
- No implicit `any` — all variables and parameters must have explicit types
- `strictNullChecks` — `null` and `undefined` not assignable without explicit union
- No implicit return — all code paths must return a value when a return type is declared

### Interfaces for Data Models
All Firestore document shapes must be typed with interfaces in `types/library.ts`:
```ts
// types/library.ts — the single source of truth for data shapes
export interface Article {
  id: string;
  title: string;
  // ...
}
```

Import with `import type` when type-only:
```ts
import type { Article, Folder } from "@/types/library";
```

### No `any` Types
```ts
// WRONG
const data: any = doc.data();

// CORRECT — use specific type or unknown with narrowing
const data = doc.data() as Article; // type assertion with specific interface
const raw: unknown = await response.json();
```

When Firebase Admin SDK forces `any` (e.g., `cert(config as any)`), add a comment explaining why.

### Naming Conventions
- **Field names in Firestore data:** camelCase (`folderId`, `articleCount`, `createdAt`)
- **TypeScript interfaces:** PascalCase (`Article`, `Folder`, `SearchResult`)
- **Function names:** camelCase (`getArticles`, `ingestArticle`, `checkDuplicates`)
- **Constants:** SCREAMING_SNAKE_CASE (`DAILY_NEWS_FOLDER_ID`, `MAX_BATCH_SIZE`)
- **Firestore collection names:** camelCase lowercase (`articles`, `folders`, `search_index`)

---

## File Organization

### TII Backend File Structure
```
projects/the-intelligent-investor/
  lib/
    firebase/
      admin.ts          # Firebase Admin SDK init — import here only
      config.ts         # Firebase client SDK config (browser-side)
      firestore.ts      # Firestore query functions — server components call these
    utils/
      dateGMT7.ts       # GMT+7 date helpers
      [other-utils].ts  # Add utilities here
  app/
    api/
      [route-name]/
        route.ts        # Route Handler — thin; delegate to lib/ functions
  trigger/
    daily-news.ts       # The Trigger.dev scheduled task
    [new-task].ts       # Add new tasks here
  types/
    library.ts          # TypeScript interfaces for Firestore documents
  config/
    news-sources.json   # RSS feed configuration
```

### Route Handlers Must Stay Thin
Route Handlers (`app/api/**/route.ts`) should:
- Parse and validate the request
- Call service functions from `lib/`
- Return the response

They should NOT contain complex business logic, Firestore queries, or AI calls. Those belong in `lib/`:

```ts
// CORRECT — thin route handler
export async function GET(request: NextRequest) {
  const folderId = new URL(request.url).searchParams.get("folderId");
  if (!folderId) return NextResponse.json({ error: "folderId required" }, { status: 400 });

  const articles = await getDailyNewsArticles(folderId); // delegated to lib/
  return NextResponse.json({ data: { articles } });
}

// WRONG — business logic inside route handler
export async function GET(request: NextRequest) {
  const snapshot = await adminDb.collection("articles")
    .where("folderId", "==", folderId)
    .orderBy("publishedAt", "desc")
    .get();
  // 50 more lines of Firestore processing...
}
```

### Max 200 Lines Per File
When a file grows beyond 200 lines:
- Extract query functions to a new utility in `lib/utils/`
- Split a large task into phase functions (as done in `trigger/daily-news.ts`)
- Extract shared types to `types/`

---

## Error Handling

### API Boundary Validation
Validate ALL user input before any database operation:

| Validation type | Code pattern |
|----------------|-------------|
| Type check | `typeof body.title !== "string"` |
| Required field | `!body.folderId` |
| Length limit | `body.title.length > 200` |
| Format/pattern | `!body.slug.match(/^[a-z0-9-]+$/)` |
| Enum value | `!["draft", "published"].includes(body.status)` |
| Whitelist unknown fields | `Object.keys(body).filter(k => !allowedFields.includes(k))` |

### Error Response Rules
- **400:** User-facing, descriptive. Minimal server logging.
- **500:** Generic to client (`"Internal server error"`). Full error + stack in server logs.

```ts
// 400 — describe the specific problem
return NextResponse.json(
  { error: "title must be 200 characters or less" },
  { status: 400 }
);

// 500 — log full details server-side, generic to client
console.error("Failed to fetch articles", {
  context: "getDailyNewsArticles",
  folderId,
  cursor,
  error: error instanceof Error ? error.message : String(error),
  stack: error instanceof Error ? error.stack : undefined,
});
return NextResponse.json({ error: "Internal server error" }, { status: 500 });
```

### Never Expose Internal Errors
```ts
// WRONG
return NextResponse.json({ error: error.message }, { status: 500 });
// error.message might expose: "PERMISSION_DENIED: Firebase quota exceeded"

// CORRECT
return NextResponse.json({ error: "Internal server error" }, { status: 500 });
```

---

## Async / Await Patterns

### Always Handle Promise Rejections
```ts
// CORRECT
try {
  const result = await someAsyncOperation();
} catch (err) {
  // handle or rethrow
}

// WRONG — unhandled promise rejection can crash the task
someAsyncOperation(); // floating promise — no await
```

### Parallel vs Sequential Fetches
```ts
// CORRECT — parallel fetches (independent operations)
const [foldersSnap, articlesSnap] = await Promise.all([
  adminDb.collection("folders").orderBy("order").get(),
  adminDb.collection("articles").select("folderId").get(),
]);

// Use sequential when operations depend on each other:
const folder = await adminDb.collection("folders").doc(folderId).get();
if (!folder.exists) throw new Error("Folder not found");
const articles = await adminDb.collection("articles")
  .where("folderId", "==", folder.id)
  .get();
```

### Avoid Waterfall Fetches in Loops
```ts
// WRONG — sequential N fetches (slow)
for (const folderId of folderIds) {
  const count = await adminDb.collection("articles")
    .where("folderId", "==", folderId).count().get();
}

// CORRECT — parallel N fetches
const counts = await Promise.all(
  folderIds.map(folderId =>
    adminDb.collection("articles")
      .where("folderId", "==", folderId).count().get()
  )
);
```

Exception: Trigger.dev task phases use sequential calls intentionally to control API rate and log progress clearly.

---

## Firestore Collection Naming Conventions

| Collection | Name | Notes |
|-----------|------|-------|
| Daily news articles | `articles` | Flat — all articles regardless of folder level |
| Content folders | `folders` | Hierarchy tracked via `parentId` field |
| Search index | `search_index` | Denormalized for search queries |

Collection names are lowercase snake_case. Do not use camelCase for collection names (`searchIndex`) — Firestore collection IDs are case-sensitive strings.

---

## TypeScript Interface Placement

All Firestore document interfaces belong in `types/library.ts`. Do not define Firestore document types in `lib/` files or `trigger/` files — always import from `types/library.ts`.

Local types (pipeline-internal, not Firestore documents) may be defined at the top of the file using them:
```ts
// trigger/daily-news.ts — local pipeline types (not Firestore documents)
interface RawNewsItem {
  index: number;
  title: string;
  link: string;
  // ...
}
```

These stay in the task file because they are implementation details of the pipeline, not canonical data shapes.

---

## Import Alias

Use `@/` for all cross-directory imports:
```ts
import { adminDb } from "@/lib/firebase/admin";
import type { Article } from "@/types/library";
import { getYesterdayRangeGMT7 } from "@/lib/utils/dateGMT7";
```

The `@/` alias maps to `projects/the-intelligent-investor/` (root of the Next.js app), configured in `tsconfig.json`.

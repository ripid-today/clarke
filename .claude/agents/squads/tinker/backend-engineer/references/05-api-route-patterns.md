# API Route Patterns — TII Backend Reference

## HTTP Methods

| Method | Usage | Example |
|--------|-------|---------|
| **GET** | Read data (idempotent, cacheable) | `GET /api/articles?folderId=123` |
| **POST** | Create or update data | `POST /api/articles` with body |
| **PUT** | Full resource replacement (rare) | `PUT /api/articles/123` |
| **DELETE** | Delete resource | `DELETE /api/articles/123` |

**TII Convention:** Primarily GET (read) and POST (create/update). Avoid PUT/DELETE unless explicit CRUD operations needed.

## Response Format

**Success (data response):**
```typescript
return NextResponse.json(
  { data: { articles: [...] } },
  { status: 200 }
);
```

**Success (created):**
```typescript
return NextResponse.json(
  { data: { id: newArticleId } },
  { status: 201 }
);
```

**Error (client fault):**
```typescript
return NextResponse.json(
  { error: "Description must be 200 characters or less" },
  { status: 400 }
);
```

**Error (server fault):**
```typescript
return NextResponse.json(
  { error: "Internal server error" },
  { status: 500 }
);
```

## HTTP Status Codes

| Code | Meaning | When to Use |
|------|---------|-------------|
| 200 | OK | Successful GET or POST that read data |
| 201 | Created | Successful POST that created a resource |
| 400 | Bad Request | Validation failure, missing required field, invalid format |
| 404 | Not Found | Resource doesn't exist |
| 405 | Method Not Allowed | HTTP method not handled in this route |
| 500 | Internal Server Error | Database failure, unexpected exception |
| 503 | Service Unavailable | Firestore quota exceeded, upstream unavailable |

## Route Handler File Structure

All Route Handlers live in `app/api/[route]/route.ts`:

```
projects/the-intelligent-investor/
  app/
    api/
      articles/
        route.ts          → GET /api/articles, POST /api/articles
      articles/[id]/
        route.ts          → GET /api/articles/[id]
      folders/
        route.ts          → GET /api/folders
```

## GET Handler Pattern

```typescript
// app/api/articles/route.ts
import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const folderId = searchParams.get("folderId");

  // Validate required params
  if (!folderId) {
    return NextResponse.json(
      { error: "folderId is required" },
      { status: 400 }
    );
  }

  try {
    const snapshot = await adminDb
      .collection("articles")
      .where("folderId", "==", folderId)
      .orderBy("publishedAt", "desc")
      .get();

    const articles = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json({ data: { articles } }, { status: 200 });
  } catch (error) {
    console.error("GET /api/articles failed", {
      folderId,
      error: error instanceof Error ? error.message : String(error),
    });
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
```

## POST Handler Pattern

```typescript
// app/api/articles/route.ts
export async function POST(request: NextRequest) {
  let body: unknown;

  // Parse body — handle malformed JSON
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  // Type guard
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Body must be an object" }, { status: 400 });
  }

  const data = body as Record<string, unknown>;

  // Whitelist allowed fields — reject unexpected fields
  const allowedFields = ["title", "description", "content", "folderId", "status"];
  const unexpectedFields = Object.keys(data).filter(k => !allowedFields.includes(k));
  if (unexpectedFields.length > 0) {
    return NextResponse.json(
      { error: `Unexpected fields: ${unexpectedFields.join(", ")}` },
      { status: 400 }
    );
  }

  // Validate required fields
  if (typeof data.title !== "string" || data.title.trim().length === 0) {
    return NextResponse.json({ error: "title is required and must be a string" }, { status: 400 });
  }
  if (data.title.length > 200) {
    return NextResponse.json({ error: "title must be 200 characters or less" }, { status: 400 });
  }
  if (typeof data.folderId !== "string") {
    return NextResponse.json({ error: "folderId is required" }, { status: 400 });
  }

  // Validate enum fields
  const validStatuses = ["draft", "published", "archived"];
  if (data.status !== undefined && !validStatuses.includes(data.status as string)) {
    return NextResponse.json(
      { error: `status must be one of: ${validStatuses.join(", ")}` },
      { status: 400 }
    );
  }

  try {
    const ref = adminDb.collection("articles").doc();
    await ref.set({
      id: ref.id,
      title: data.title,
      // ... other fields
    });

    return NextResponse.json({ data: { id: ref.id } }, { status: 201 });
  } catch (error) {
    console.error("POST /api/articles failed", {
      error: error instanceof Error ? error.message : String(error),
    });
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
```

## Dynamic Route Handler

```typescript
// app/api/articles/[id]/route.ts
interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  const { id } = await params; // Must await in Next.js 15

  if (!id || typeof id !== "string") {
    return NextResponse.json({ error: "Invalid article ID" }, { status: 400 });
  }

  const doc = await adminDb.collection("articles").doc(id).get();

  if (!doc.exists) {
    return NextResponse.json({ error: "Article not found" }, { status: 404 });
  }

  return NextResponse.json({ data: { id: doc.id, ...doc.data() } }, { status: 200 });
}
```

## Input Validation — Required Patterns

**Always validate before database operations:**

```typescript
// Type validation
if (typeof body.description !== "string") {
  return NextResponse.json({ error: "description must be a string" }, { status: 400 });
}

// Length validation
if (body.description.length > 200) {
  return NextResponse.json({ error: "description must be 200 characters or less" }, { status: 400 });
}

// Format validation (slug)
if (body.slug && !body.slug.match(/^[a-z0-9-]+$/)) {
  return NextResponse.json({ error: "Invalid slug format" }, { status: 400 });
}

// Required field check
if (!body.folderId) {
  return NextResponse.json({ error: "folderId is required" }, { status: 400 });
}
```

## Naming Conventions

- Field names in requests/responses: camelCase (`folderId`, `articleCount`, `createdAt`)
- URL paths: kebab-case (`/api/daily-news`, `/api/featured-folders`)
- Route segment directories: lowercase (`articles/`, `folders/`)

## Error Logging Convention

```typescript
// For 500 errors — log full context server-side, generic message to client
console.error("Error description", {
  context: "What operation was being performed",
  input: "Relevant input data (sanitized — no private keys)",
  error: error instanceof Error ? error.message : String(error),
  stack: error instanceof Error ? error.stack : undefined,
});

// For 400 errors — minimal logging (user input errors, expected)
// No console.error needed; the response itself is the record
```

## Existing TII API Routes

As of March 2026, TII has no Route Handlers in `app/api/`. All data access is through Server Components calling Firestore directly (via `lib/firebase/firestore.ts`).

When the first Route Handler is needed:
1. Create `app/api/[route-name]/route.ts`
2. Import `{ NextRequest, NextResponse }` from `"next/server"`
3. Import `adminDb` from `"@/lib/firebase/admin"` (server-only)
4. Follow GET/POST patterns above
5. Add to the TII component inventory in `frontend-engineer/references/01-tii-component-inventory.md`

## Testing a Route Handler Locally

```bash
# GET request with query params
curl "http://localhost:3000/api/articles?folderId=abc123"

# POST request with JSON body
curl -X POST "http://localhost:3000/api/articles" \
  -H "Content-Type: application/json" \
  -d '{"title": "Test Article", "folderId": "abc123", "status": "draft"}'

# Test validation error (missing required field)
curl -X POST "http://localhost:3000/api/articles" \
  -H "Content-Type: application/json" \
  -d '{"title": "Test"}'
# Expected: 400 {"error": "folderId is required"}

# Test not found
curl "http://localhost:3000/api/articles/nonexistent-id"
# Expected: 404 {"error": "Article not found"}
```

## Security Rules for Route Handlers

1. **Never expose secrets:** Do not return `process.env.FIREBASE_ADMIN_PRIVATE_KEY` or any admin credential in the response body
2. **Sanitize error messages:** Return generic "Internal server error" to clients; log full error server-side
3. **Validate all input:** Type + length + format + whitelist on every POST field
4. **Firestore Admin bypasses security rules:** Any server-side code using `adminDb` has full read/write access — validate inputs carefully
5. **No auth currently in TII:** Routes are publicly accessible. If adding auth, verify on every request before Firestore access.

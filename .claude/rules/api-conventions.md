---
path_scope: "website/app/api/**/*.ts"
description: "API route conventions for Clarke's Library - HTTP methods, response format, validation, security"
---

# API Conventions

## HTTP Methods

| Method | Usage | Example |
|--------|-------|---------|
| **GET** | Read data (idempotent, cacheable) | `GET /api/library/articles?folderId=123` |
| **POST** | Create or update data | `POST /api/library/articles` with body |
| **PUT** | Full resource replacement (rare) | `PUT /api/library/articles/123` |
| **DELETE** | Delete resource | `DELETE /api/library/articles/123` |

**Clarke Convention:** Primarily use GET (read) and POST (create/update). Avoid PUT/DELETE unless explicit CRUD operations needed.

## Response Format

**Success:**
```typescript
return NextResponse.json(
  { data: { articles: [...] } },
  { status: 200 }
);
```

**Error:**
```typescript
return NextResponse.json(
  { error: "Description must be 200 characters or less" },
  { status: 400 }
);
```

## Status Codes

| Code | Meaning | When to Use |
|------|---------|-------------|
| 200 | OK | Successful GET |
| 201 | Created | Successful POST that created resource |
| 400 | Bad Request | Validation failure, missing required field |
| 404 | Not Found | Resource doesn't exist |
| 500 | Internal Server Error | Database failure, unexpected exception |

## Naming Conventions

- Field names: camelCase (`folderId`, `articleCount`, `createdAt`)
- URL paths: kebab-case (`/api/library/featured-folders`)

## Input Validation (CRITICAL)

Validate ALL user input at API boundary before database operations:

```typescript
// Type validation
if (typeof body.description !== 'string') {
  return NextResponse.json({ error: 'description must be a string' }, { status: 400 });
}

// Length validation
if (body.description.length > 200) {
  return NextResponse.json({ error: 'Description must be 200 characters or less' }, { status: 400 });
}

// Format validation
if (body.slug && !body.slug.match(/^[a-z0-9-]+$/)) {
  return NextResponse.json({ error: 'Invalid slug format' }, { status: 400 });
}

// Whitelist approach - reject unexpected fields
const allowedFields = ['title', 'description', 'content', 'folderId', 'slug'];
const unexpectedFields = Object.keys(body).filter(key => !allowedFields.includes(key));
if (unexpectedFields.length > 0) {
  return NextResponse.json(
    { error: `Unexpected fields: ${unexpectedFields.join(', ')}` },
    { status: 400 }
  );
}
```

## Error Handling

- **400 errors:** User-facing, descriptive message. Minimal logging.
- **500 errors:** Generic message to client. Log full error with stack trace server-side.
- Never expose internal errors to clients.

```typescript
console.error('Error description:', {
  context: 'What operation was being performed',
  input: 'Relevant input data (sanitized)',
  error: error instanceof Error ? error.message : String(error),
  stack: error instanceof Error ? error.stack : undefined
});
```

## Security

- Store secrets in environment variables (`.env.local` locally, Vercel for production)
- `NEXT_PUBLIC_*` prefix ONLY for safe client-side variables (Firebase client config)
- Server-only vars: `FIREBASE_ADMIN_PRIVATE_KEY`, `FIREBASE_ADMIN_CLIENT_EMAIL`
- Initialize Firebase Admin ONLY in `lib/firebase/admin.ts` (server-side)
- Never import `lib/firebase/admin.ts` in client components
- Sanitize markdown with rehype-sanitize before rendering

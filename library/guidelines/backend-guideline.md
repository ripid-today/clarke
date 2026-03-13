# Backend Development Guideline

**Version:** 1.0.0
**Last Updated:** 2026-02-16
**Purpose:** Enable consistent API development, database operations, and server-side logic for Clarke's Library

---

## 1. Architecture Overview

### Tech Stack

- **Runtime:** Next.js 15 App Router (React 19, server-side rendering)
- **Database:** Firebase Firestore (NoSQL document database)
- **Language:** TypeScript 5.x
- **Deployment:** Vercel (automatic deployment via GitHub Actions)
- **Authentication:** Firebase Admin SDK (server-side only)

### File Structure

```
clarke/library/
├── app/
│   ├── api/                    # API routes (Next.js convention)
│   │   └── library/
│   │       ├── articles/
│   │       │   └── route.ts    # GET /api/library/articles
│   │       ├── folders/
│   │       │   └── route.ts    # GET /api/library/folders
│   │       └── search/
│   │           └── route.ts    # GET /api/library/search
│   └── library/                # Page routes (SSR)
│       └── [...slug]/
│           └── page.tsx        # Dynamic folder/article pages
├── lib/
│   ├── firebase/
│   │   ├── admin.ts            # Firebase Admin SDK initialization
│   │   └── firestore.ts        # Database helper functions
│   └── utils/
│       └── truncate.ts         # Utility functions
└── types/
    └── library.ts              # Shared TypeScript interfaces
```

### Data Flow

```
User Request
    ↓
Next.js Page Component (app/library/[...slug]/page.tsx)
    ↓
Server-Side Data Fetching (getFolder, getArticles from lib/firestore.ts)
    ↓
Firebase Admin SDK (lib/firebase/admin.ts)
    ↓
Firestore Database
    ↓
Response Data
    ↓
React Component Rendering (SSR)
    ↓
HTML Response to User
```

**Why This Structure:**
- **API routes in app/api/:** Next.js convention, automatic routing
- **Server components:** Next.js 15 App Router prefers server-side rendering, no client-side data fetching needed
- **Centralized Firebase logic:** All Firestore operations in `lib/firebase/`, prevents scattered database calls

---

## 2. API Conventions

### HTTP Methods

| Method | Usage | Example |
|--------|-------|---------|
| **GET** | Read data (idempotent, cacheable) | `GET /api/library/articles?folderId=123` |
| **POST** | Create or update data | `POST /api/library/articles` with body `{ title, content, folderId }` |
| **PUT** | Full resource replacement (rare) | `PUT /api/library/articles/123` with complete article data |
| **DELETE** | Delete resource | `DELETE /api/library/articles/123` |

**Clarke Convention:** Primarily use GET (read) and POST (create/update). Avoid PUT/DELETE unless explicit CRUD operations needed.

### Response Format

**Success Response:**
```typescript
// Standard success format
return NextResponse.json(
  { data: { articles: [...] } },
  { status: 200 }
);
```

**Error Response:**
```typescript
// Standard error format
return NextResponse.json(
  { error: "Description must be 200 characters or less" },
  { status: 400 }
);
```

### Status Codes

| Code | Meaning | When to Use |
|------|---------|-------------|
| **200** | OK | Successful GET request |
| **201** | Created | Successful POST that created new resource |
| **400** | Bad Request | Client error (validation failure, missing required field) |
| **404** | Not Found | Resource doesn't exist (article ID not found) |
| **500** | Internal Server Error | Server error (database connection failure, unexpected exception) |

### Naming Conventions

- **Field names:** camelCase (`folderId`, `articleCount`, `createdAt`)
- **URL paths:** kebab-case (`/api/library/featured-folders`)
- **File names:** kebab-case for routes (`route.ts`), PascalCase for components

### Example API Route Template

```typescript
// app/api/library/articles/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase/admin';

export async function GET(request: NextRequest) {
  try {
    // 1. Parse query parameters
    const { searchParams } = new URL(request.url);
    const folderId = searchParams.get('folderId');

    // 2. Validate input (client error → 400)
    if (!folderId) {
      return NextResponse.json(
        { error: 'folderId is required' },
        { status: 400 }
      );
    }

    // 3. Query Firestore
    const articlesRef = db.collection('articles');
    const snapshot = await articlesRef
      .where('folderId', '==', folderId)
      .orderBy('order', 'asc')
      .get();

    // 4. Transform data
    const articles = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    // 5. Return success response
    return NextResponse.json(
      { data: { articles } },
      { status: 200 }
    );

  } catch (error) {
    // 6. Log and return generic error (server error → 500)
    console.error('Error fetching articles:', error);
    return NextResponse.json(
      { error: 'An error occurred fetching articles' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // 1. Parse request body
    const body = await request.json();

    // 2. Validate required fields
    if (!body.title || !body.folderId) {
      return NextResponse.json(
        { error: 'title and folderId are required' },
        { status: 400 }
      );
    }

    // 3. Validate field constraints
    if (body.description && body.description.length > 200) {
      return NextResponse.json(
        { error: 'Description must be 200 characters or less' },
        { status: 400 }
      );
    }

    // 4. Create document in Firestore
    const articlesRef = db.collection('articles');
    const newArticle = {
      title: body.title,
      slug: body.slug || generateSlug(body.title),
      folderId: body.folderId,
      description: body.description || '',
      content: body.content || '',
      order: body.order || 0,
      status: 'draft',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const docRef = await articlesRef.add(newArticle);

    // 5. Return created resource
    return NextResponse.json(
      { data: { article: { id: docRef.id, ...newArticle } } },
      { status: 201 }
    );

  } catch (error) {
    console.error('Error creating article:', error);
    return NextResponse.json(
      { error: 'An error occurred creating the article' },
      { status: 500 }
    );
  }
}
```

**Why This Pattern:**
- **Consistent error handling:** All 400s are user-facing, all 500s are generic
- **Input validation at boundary:** Validate before database operation, prevent bad data
- **Type safety:** TypeScript interfaces enforce correct data structure
- **Separation of concerns:** API route handles HTTP, `lib/firestore.ts` handles database logic

---

## 3. Database Schemas

### Folder Collection (`folders`)

```typescript
interface Folder {
  id: string;                    // Auto-generated Firestore document ID
  name: string;                  // Display name (e.g., "Business Analysis Masterclass")
  slug: string;                  // URL-safe identifier (e.g., "business-analysis-masterclass")
  parentId: string | null;       // Parent folder ID or null for root-level
  description: string;           // Description text (max 300 characters)
  path: string[];                // Ancestry path for breadcrumbs (e.g., ["root", "parent-id", "current-id"])
  order: number;                 // Display order (lower = shown first)
  featured: boolean;             // Show on homepage featured section?
  articleCount: number;          // Cached count of articles (updated on article create/delete)
  createdAt: Timestamp;          // Firestore Timestamp
  updatedAt: Timestamp;          // Firestore Timestamp
  metadata?: {                   // Optional metadata
    icon?: string;               // Icon identifier (e.g., "book", "folder")
    color?: string;              // Hex color for theming (e.g., "#C15F3C")
    status?: "building" | "review" | "complete";
  };
}
```

**Validation Rules:**
- `name`: Required, min 1 char, max 100 chars
- `slug`: Required, must match `/^[a-z0-9-]+$/` pattern (lowercase, numbers, hyphens only)
- `description`: Required, max 300 characters
- `order`: Number, defaults to 0
- `featured`: Boolean, defaults to false
- `articleCount`: Number, defaults to 0 (updated via triggers or manual updates)

**Example Firestore Document:**
```json
{
  "id": "business-analysis-masterclass",
  "name": "Business Analysis Masterclass",
  "slug": "business-analysis-masterclass",
  "parentId": null,
  "description": "Comprehensive training materials for business analysts covering requirements gathering, stakeholder management, and documentation best practices.",
  "path": ["business-analysis-masterclass"],
  "order": 1,
  "featured": true,
  "articleCount": 12,
  "createdAt": "2026-01-15T08:00:00.000Z",
  "updatedAt": "2026-02-16T10:30:00.000Z",
  "metadata": {
    "icon": "briefcase",
    "color": "#C15F3C",
    "status": "complete"
  }
}
```

### Article Collection (`articles`)

```typescript
interface Article {
  id: string;                    // Auto-generated Firestore document ID
  title: string;                 // Article title (e.g., "Writing Effective User Stories")
  slug: string;                  // URL-safe identifier (e.g., "writing-effective-user-stories")
  folderId: string;              // Parent folder reference (must exist in folders collection)
  folderPath: string[];          // Cached folder path for breadcrumbs
  content: string;               // Markdown content (unlimited length)
  description: string;           // Short description for listings (max 200 characters)
  order: number;                 // Display order within folder
  status: string;                // "draft" | "published" | "archived"
  priority: string;              // "low" | "medium" | "high"
  createdAt: Timestamp;          // Firestore Timestamp
  updatedAt: Timestamp;          // Firestore Timestamp
  metadata?: {                   // Optional metadata
    wordCount?: number;          // Calculated word count
    readingTime?: number;        // Estimated reading time in minutes
    lastModifiedBy?: string;     // User ID or email
    version?: number;            // Document version number
  };
}
```

**Validation Rules:**
- `title`: Required, min 1 char, max 200 chars
- `slug`: Required, must match `/^[a-z0-9-]+$/` pattern
- `folderId`: Required, must reference existing folder document
- `description`: Required, max 200 characters (displays in article listings)
- `content`: String, no max length (markdown format)
- `status`: Enum, defaults to "draft"
- `priority`: Enum, defaults to "medium"

**Example Firestore Document:**
```json
{
  "id": "writing-effective-user-stories",
  "title": "Writing Effective User Stories",
  "slug": "writing-effective-user-stories",
  "folderId": "business-analysis-masterclass",
  "folderPath": ["business-analysis-masterclass"],
  "content": "# Writing Effective User Stories\n\nUser stories are...",
  "description": "Learn the INVEST criteria and best practices for writing user stories that deliver value and guide development teams effectively.",
  "order": 3,
  "status": "published",
  "priority": "high",
  "createdAt": "2026-01-20T09:00:00.000Z",
  "updatedAt": "2026-02-10T14:30:00.000Z",
  "metadata": {
    "wordCount": 1247,
    "readingTime": 5,
    "version": 2
  }
}
```

**BREAKING CHANGE HISTORY:**
- **v1.2.0 (2026-02-16):** Renamed `excerpt` → `description`, removed `tags` field
- **Migration required:** All existing articles must have `description` field, `excerpt` and `tags` removed

### ⚠️ Counter Accuracy Warning

**Denormalized counters (e.g., `articleCount` on folder documents) silently drift out of sync** when documents are deleted or modified outside the application's standard create path (e.g., manual Firestore Console deletes, bulk scripts, or admin tools that bypass the app).

**Rules:**
- Do NOT use a denormalized counter for UI display unless you also have a Firestore trigger (or equivalent) that decrements it on every delete path, including manual deletes.
- **Preferred pattern for display:** Use a real-time count query with a short cache (60 s) rather than a stale cached counter. Example:

```typescript
// ✅ Accurate: count derived from actual documents, cached 60 s
export const getFoldersWithRealCounts = unstable_cache(
  async (): Promise<Folder[]> => {
    const [foldersSnap, articlesSnap] = await Promise.all([
      adminDb.collection("folders").orderBy("order").get(),
      adminDb.collection("articles").select("folderId").get(),
    ]);
    const counts: Record<string, number> = {};
    for (const doc of articlesSnap.docs) {
      const fid = doc.data().folderId as string;
      if (fid) counts[fid] = (counts[fid] || 0) + 1;
    }
    return foldersSnap.docs.map(doc => {
      const folder = serializeDoc<Folder>(doc);
      folder.articleCount = counts[folder.id] || 0;
      return folder;
    });
  },
  ["get-folders-with-real-counts"],
  { revalidate: 60, tags: ["folders"] }
);

// ❌ Stale: counter only incremented on create, never decremented on manual delete
const folder = await adminDb.collection("folders").doc(folderId).get();
displayCount(folder.data().articleCount); // may be hundreds off
```

- If a denormalized counter is kept for performance (e.g., in a high-read hot path), it **must** be decremented in every delete path — add a Firestore `onDelete` trigger to enforce this at the database layer.

### Search Index Collection (`search_index`)

```typescript
interface SearchIndex {
  articleId: string;             // Reference to articles collection
  title: string;                 // Lowercase title for case-insensitive search
  description: string;           // Lowercase description (replaces "excerpt")
  folderPath: string[];          // Folder hierarchy for filtering
}
```

**Purpose:** Optimized for search queries. Denormalized data with lowercase fields for case-insensitive matching.

**Validation Rules:**
- `articleId`: Required, must match existing article ID
- `title`: Lowercase version of article title
- `description`: Lowercase version of article description (max 200 chars)

**Example Firestore Document:**
```json
{
  "articleId": "writing-effective-user-stories",
  "title": "writing effective user stories",
  "description": "learn the invest criteria and best practices for writing user stories that deliver value and guide development teams effectively.",
  "folderPath": ["business-analysis-masterclass"]
}
```

---

## 4. Error Handling

### Decision Tree

```
Is error caused by user input (bad data, missing field, invalid format)?
├─ YES → Return 400 Bad Request with user-facing error message
│         Example: "Description must be 200 characters or less"
│         Log: Minimal (not an error, just validation)
│
└─ NO → Is error recoverable (temporary network issue, rate limit)?
        ├─ YES → Return 500 Internal Server Error with generic message
        │         Example: "An error occurred. Please try again."
        │         Log: Full error with stack trace
        │
        └─ NO → Return 500 Internal Server Error with generic message
                  Example: "Database connection failed"
                  Log: Full error with stack trace, alert monitoring
```

### Error Response Pattern

**User Input Error (400):**
```typescript
// Validation failed - user can fix this
if (!body.description || body.description.length > 200) {
  return NextResponse.json(
    { error: "Description must be between 1 and 200 characters" },
    { status: 400 }
  );
}

if (!body.slug.match(/^[a-z0-9-]+$/)) {
  return NextResponse.json(
    { error: "Slug must contain only lowercase letters, numbers, and hyphens" },
    { status: 400 }
  );
}
```

**Server Error (500):**
```typescript
// Unexpected error - log details, show generic message
try {
  const result = await db.collection('articles').doc(id).get();
} catch (error) {
  console.error('Firestore read error:', {
    collection: 'articles',
    docId: id,
    error: error instanceof Error ? error.message : String(error),
    stack: error instanceof Error ? error.stack : undefined
  });

  return NextResponse.json(
    { error: "An error occurred fetching the article" },
    { status: 500 }
  );
}
```

### Logging Standards

**What to Log:**
- ✅ All 500 errors (with stack trace)
- ✅ Database operation failures
- ✅ External API call failures
- ✅ Unexpected null/undefined values in critical paths
- ❌ 400 errors (these are expected user input errors)
- ❌ Successful operations (clutters logs, use monitoring instead)

**Log Format:**
```typescript
console.error('Error description:', {
  context: 'What operation was being performed',
  input: 'Relevant input data (sanitized, no sensitive info)',
  error: error instanceof Error ? error.message : String(error),
  stack: error instanceof Error ? error.stack : undefined,
  timestamp: new Date().toISOString()
});
```

**Security Note:** Never log sensitive data (passwords, API keys, PII). Sanitize user input before logging.

---

## 5. Migration Patterns

### Zero-Downtime Schema Change Pattern

**Scenario:** Rename field `excerpt` → `description` in articles collection

**7-Step Procedure:**

```markdown
1. Make field optional in TypeScript interface (both old and new field)
2. Deploy code that reads from BOTH fields (prefers new, falls back to old)
3. Run Firestore migration script in batches of 500 (Firestore limit)
4. Verify all documents migrated successfully
5. Make new field required, old field deprecated in interface
6. Deploy code that only uses new field
7. Run cleanup script to remove old field from all documents
```

### Batch Migration Template

```typescript
// scripts/migrate-excerpt-to-description.ts
import { db } from '../lib/firebase/admin';
import { FieldValue } from 'firebase-admin/firestore';

async function migrateCollection(
  collectionName: string,
  migrateDoc: (data: any) => any
) {
  const ref = db.collection(collectionName);
  const snapshot = await ref.get();

  console.log(`Starting migration: ${snapshot.size} documents in ${collectionName}`);

  let batch = db.batch();
  let count = 0;
  let updated = 0;

  for (const doc of snapshot.docs) {
    const data = doc.data();
    const updates = migrateDoc(data);

    // Only update if changes needed
    if (Object.keys(updates).length > 0) {
      batch.update(doc.ref, updates);
      updated++;
    }

    count++;

    // Commit every 500 operations (Firestore batch write limit)
    if (count % 500 === 0) {
      await batch.commit();
      batch = db.batch();
      console.log(`Migrated ${count}/${snapshot.size} documents (${updated} updated)...`);
    }
  }

  // Commit remaining operations
  if (count % 500 !== 0) {
    await batch.commit();
  }

  console.log(`Migration complete: ${count} documents processed, ${updated} updated`);
  return { total: count, updated };
}

// Example: Rename excerpt → description, remove tags field
async function migrateArticles() {
  await migrateCollection('articles', (data) => {
    const updates: any = {};

    // Copy excerpt → description if description doesn't exist
    if (data.excerpt && !data.description) {
      updates.description = data.excerpt.substring(0, 200); // Enforce 200 char limit
    }

    // Remove old excerpt field
    if (data.excerpt !== undefined) {
      updates.excerpt = FieldValue.delete();
    }

    // Remove tags field (breaking change)
    if (data.tags !== undefined) {
      updates.tags = FieldValue.delete();
    }

    return updates;
  });
}

// Run migration
migrateArticles()
  .then(() => {
    console.log('✅ Migration successful');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  });
```

### Pre-Migration Validation

**CRITICAL:** Always validate assumptions before running migration

```typescript
// scripts/validate-pre-migration.ts
async function validateDescriptionLengths() {
  const articlesRef = db.collection('articles');
  const snapshot = await articlesRef.get();

  const longExcerpts = snapshot.docs.filter(doc => {
    const excerpt = doc.data().excerpt;
    return excerpt && excerpt.length > 200;
  });

  console.log(`Articles with excerpt > 200 chars: ${longExcerpts.length}`);

  if (longExcerpts.length > 0) {
    console.warn('⚠️ WARNING: These articles will be truncated:');
    longExcerpts.forEach(doc => {
      const data = doc.data();
      console.log(`  - ${doc.id}: "${data.title}" (${data.excerpt.length} chars)`);
    });
    console.log('\nManual review recommended before migration.');
    return false;
  }

  console.log('✅ All excerpts ≤200 chars, safe to migrate');
  return true;
}
```

### Rollback Procedure

**Git Rollback (Code Changes):**
```bash
# 1. Identify commit to revert
git log --oneline -5

# 2. Revert specific commit (creates new commit that undoes changes)
git revert <commit-hash>

# 3. Push to trigger auto-redeploy
git push origin main
```

**Firestore Rollback (Data Changes):**

**Option 1: Point-in-Time Restore (if <7 days, Firebase Blaze plan)**
1. Go to Firebase Console → Firestore → Backups
2. Select backup timestamp BEFORE migration
3. Contact Firebase Support for point-in-time restore
4. Wait for restore (can take hours for large databases)

**Option 2: Manual Revert (if <100 documents affected)**
1. Use Firestore Console to manually edit documents
2. Restore field values from pre-migration backup
3. Verify all documents reverted

**Option 3: Reverse Migration Script**
```typescript
async function rollbackArticles() {
  await migrateCollection('articles', (data) => {
    const updates: any = {};

    // Restore excerpt from description
    if (data.description && !data.excerpt) {
      updates.excerpt = data.description;
    }

    // Remove description field
    if (data.description !== undefined) {
      updates.description = FieldValue.delete();
    }

    return updates;
  });
}
```

**CRITICAL:** Always verify Firestore backup exists BEFORE running migration:
```typescript
// Check backup exists
async function verifyBackupExists() {
  console.log('⚠️ MANUAL STEP: Verify Firestore backup exists');
  console.log('1. Go to Firebase Console → Firestore → Backups');
  console.log('2. Confirm backup exists from today or yesterday');
  console.log('3. Note backup timestamp for potential restore');
  console.log('\nPress Ctrl+C to abort if no backup exists');

  // Wait 10 seconds for manual verification
  await new Promise(resolve => setTimeout(resolve, 10000));
}
```

---

## 6. Security Practices

### Security Checklist

**Input Validation (CRITICAL):**
- [ ] Validate ALL user input at API boundary (type, length, format)
- [ ] Reject unexpected fields in POST requests (prevent data injection)
- [ ] Use TypeScript to enforce type safety
- [ ] Sanitize markdown content before rendering (use rehype-sanitize)
- [ ] Never trust user input for database queries

**API Key Protection:**
- [ ] Never expose Firebase Admin private key in client code
- [ ] Store all secrets in environment variables (`.env.local` for local, Vercel for production)
- [ ] Use `NEXT_PUBLIC_*` prefix ONLY for safe client-side variables (Firebase client config)
- [ ] Verify API keys on server-side before processing requests

**Firebase Admin SDK:**
- [ ] Initialize Firebase Admin ONLY on server-side (`lib/firebase/admin.ts`)
- [ ] Never import `lib/firebase/admin.ts` in client components
- [ ] Use Firebase Client SDK for client-side operations (if auth added)

### Input Validation Examples

**GOOD - Validate before database operation:**
```typescript
export async function POST(request: NextRequest) {
  const body = await request.json();

  // Type validation
  if (typeof body.description !== 'string') {
    return NextResponse.json({ error: 'description must be a string' }, { status: 400 });
  }

  // Length validation
  if (body.description.length > 200) {
    return NextResponse.json({ error: 'Description must be 200 characters or less' }, { status: 400 });
  }

  // Format validation (slug must be lowercase alphanumeric with hyphens)
  if (body.slug && !body.slug.match(/^[a-z0-9-]+$/)) {
    return NextResponse.json({ error: 'Invalid slug format' }, { status: 400 });
  }

  // Reject unexpected fields (whitelist approach)
  const allowedFields = ['title', 'description', 'content', 'folderId', 'slug'];
  const unexpectedFields = Object.keys(body).filter(key => !allowedFields.includes(key));

  if (unexpectedFields.length > 0) {
    return NextResponse.json(
      { error: `Unexpected fields: ${unexpectedFields.join(', ')}` },
      { status: 400 }
    );
  }

  // Now safe to use body data
  await db.collection('articles').add({
    title: body.title,
    description: body.description,
    content: body.content,
    folderId: body.folderId,
    slug: body.slug,
    createdAt: new Date()
  });
}
```

**BAD - Trust user input:**
```typescript
// ❌ VULNERABLE: No validation, attacker can inject arbitrary fields
export async function POST(request: NextRequest) {
  const body = await request.json();

  // Attacker could send: { title: "Hello", __admin: true, deleteAllArticles: true }
  // This would write arbitrary fields to Firestore
  await db.collection('articles').add(body);
}
```

### Markdown Sanitization

**GOOD - Sanitize before rendering:**
```typescript
// Install: npm install rehype-sanitize
import rehypeSanitize from 'rehype-sanitize';
import { remark } from 'remark';
import html from 'remark-html';

async function renderMarkdown(content: string): Promise<string> {
  const result = await remark()
    .use(html)
    .use(rehypeSanitize) // Removes dangerous HTML like <script>, <iframe>
    .process(content);

  return result.toString();
}
```

**BAD - Render raw markdown:**
```typescript
// ❌ VULNERABLE: XSS attack if user submits malicious markdown
<div dangerouslySetInnerHTML={{ __html: article.content }} />
```

### Environment Variable Naming

**Server-Side Only (Private):**
```bash
# .env.local
FIREBASE_ADMIN_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----...
FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk@project.iam.gserviceaccount.com
LIBRARY_API_KEY=secret-key-123
```

**Client-Side Safe (Public):**
```bash
# .env.local
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXX
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=project-id
```

**Usage:**
```typescript
// lib/firebase/admin.ts (server-side only)
import { initializeApp, cert } from 'firebase-admin/app';

const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n');

const app = initializeApp({
  credential: cert({
    projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
    clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
    privateKey: privateKey
  })
});

// lib/firebase/client.ts (client-side safe)
import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
};

const app = initializeApp(firebaseConfig);
```

---

## Summary

This Backend Guideline ensures:
- ✅ **Consistent API patterns** (same response format, error handling across all routes)
- ✅ **Type safety** (TypeScript interfaces prevent data model drift)
- ✅ **Safe migrations** (zero-downtime pattern, pre-validation, rollback procedures)
- ✅ **Security** (input validation, secret management, markdown sanitization)
- ✅ **Developer efficiency** (copy-paste templates, clear examples from Clarke codebase)

**When to Reference:**
- Building new API route → Section 2 (API Conventions)
- Modifying database schema → Section 3 (Database Schemas)
- Running data migration → Section 5 (Migration Patterns)
- Handling errors → Section 4 (Error Handling)
- Security review → Section 6 (Security Practices)

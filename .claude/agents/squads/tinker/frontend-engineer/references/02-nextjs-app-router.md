# Next.js 15 App Router Patterns for TII

## 1. Server Components vs Client Components

### Default: Server Component
Every file under `app/` and every file in `components/` is a **Server Component by default**. Server Components:
- Run exclusively on the server — zero JavaScript sent to the browser
- Can `async/await` directly (no useEffect needed for data fetching)
- Can import Firebase Admin SDK, read env vars, access Node.js APIs
- Cannot use: `useState`, `useEffect`, `onClick`, `useRef`, browser APIs (`window`, `localStorage`)
- Automatically deduplicates fetch calls across components in the same render tree

**Performance implication:** Every Client Component you add increases the JavaScript bundle sent to the browser. Default to Server Components; add `'use client'` only when forced.

### When to Add 'use client'
Add `'use client'` at the top of a file ONLY when the component needs:
- `useState` or `useReducer` for local state
- `useEffect` or lifecycle hooks
- Browser event handlers: `onClick`, `onChange`, `onSubmit`
- Browser APIs: `window`, `localStorage`, `sessionStorage`, `navigator`
- Third-party client-only libraries (e.g., chart libraries, drag-and-drop)
- Real-time subscriptions (WebSocket, Firebase `onSnapshot`)

### Push the Boundary Deep
The `'use client'` boundary should be as deep in the component tree as possible. Only the leaf node that needs interactivity needs the directive — the parent wrapper can remain a Server Component.

**Anti-pattern: making the entire page client-side for one interactive button**
```tsx
// WRONG — entire page is now client-side
'use client';
export default function HomePage() {
  const [count, setCount] = useState(0);
  // fetch data in useEffect — this pattern is wrong in App Router
}
```

**Correct pattern: extract only the interactive part**
```tsx
// app/page.tsx — Server Component, no 'use client'
export default async function HomePage() {
  const articles = await getDailyNewsArticles(folderId); // direct server fetch
  return (
    <>
      <NewsArticleFeed articles={articles} /> // Server Component
      <LikeButton /> // This one needs 'use client'
    </>
  );
}

// components/LikeButton.tsx
'use client';
export function LikeButton() {
  const [liked, setLiked] = useState(false);
  return <button onClick={() => setLiked(true)}>{liked ? '❤️' : '🤍'}</button>;
}
```

### TII Current State
All TII components are currently Server Components. `NewsReadTracker.tsx` has a `'use client'` directive but is not mounted on the active homepage. Before adding any Client Component, confirm with the checklist above.

---

## 2. Data Fetching Patterns in App Router

### Server Component Direct Fetch (TII Primary Pattern)
```tsx
// app/page.tsx
export default async function HomePage({ searchParams }: PageProps) {
  const { cursor } = await searchParams; // Next.js 15: searchParams is a Promise
  const result = await getDailyNewsArticles(DAILY_NEWS_FOLDER_ID, cursor, 20);
  return <NewsArticleFeed articles={result.articles} />;
}
```

This is the TII pattern. Data is fetched server-side, serialized, passed as props. No loading state needed — Next.js handles streaming.

### Route Handler (for Mutations / External Callers)
Use `app/api/[route]/route.ts` when:
- Client-triggered mutations (form submit, button click that writes data)
- Webhooks from external services
- External API calls that need a server-side proxy

```ts
// app/api/example/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  // ...
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  // ...
}
```

### Server Actions (for Form Mutations from Client Components)
Use `'use server'` for mutations called directly from Client Components. Currently not used in TII (no forms). Pattern:

```ts
// lib/actions/articles.ts
'use server';
import { revalidatePath } from 'next/cache';

export async function updateArticle(id: string, data: Partial<Article>) {
  await adminDb.collection('articles').doc(id).update(data);
  revalidatePath('/'); // invalidate homepage cache
}
```

### Anti-Pattern: useEffect Fetching in Client Components
Never do this in TII:
```tsx
'use client';
// WRONG — this pattern defeats the purpose of App Router
export function ArticleList() {
  const [articles, setArticles] = useState([]);
  useEffect(() => {
    fetch('/api/articles').then(r => r.json()).then(setArticles);
  }, []);
}
```

---

## 3. Async Request APIs (Next.js 15 — Breaking Change from v14)

Next.js 15 made several request APIs **async** (they were synchronous in Next.js 14). Accessing them synchronously causes a build error or runtime warning.

### searchParams (Dynamic Route Params)
```tsx
// CORRECT — Next.js 15
interface PageProps {
  searchParams: Promise<{ cursor?: string; category?: string }>;
}

export default async function Page({ searchParams }: PageProps) {
  const { cursor } = await searchParams; // must await
}
```

```tsx
// WRONG — Next.js 14 pattern, breaks in Next.js 15
export default async function Page({ searchParams }: { searchParams: { cursor?: string } }) {
  const cursor = searchParams.cursor; // synchronous access — causes warning/error
}
```

### params (Dynamic Segments)
```tsx
// CORRECT — Next.js 15
interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params; // must await
}
```

### cookies() and headers()
```tsx
import { cookies, headers } from 'next/headers';

// CORRECT — Next.js 15
const cookieStore = await cookies();
const headersList = await headers();

// WRONG — synchronous, breaks in Next.js 15
const cookieStore = cookies(); // Error: cookies() should be awaited
```

### When Adding New Pages or Route Handlers
Always use the async pattern for `searchParams` and `params`. The TypeScript types enforce this — the compiler will flag synchronous access.

---

## 4. Caching and Revalidation

### force-dynamic (TII Homepage Pattern)
```tsx
export const dynamic = "force-dynamic";
```
Applied to `app/page.tsx`. This tells Next.js to skip all caching for this route — every request fetches fresh data. Used on the TII homepage because articles update daily and stale content would confuse users.

### unstable_cache (Firestore Query Cache)
Used in `lib/firebase/firestore.ts` for folder lookups:
```ts
export const getFolders = unstable_cache(
  async (parentId?: string) => { /* Firestore query */ },
  ["get-folders"],           // cache key
  { revalidate: 300, tags: ["folders"] }  // 5-minute TTL, "folders" tag
);
```

### revalidatePath / revalidateTag (After Mutations)
When a Server Action or Route Handler writes data, invalidate relevant caches:
```ts
import { revalidatePath, revalidateTag } from 'next/cache';

// After writing new articles:
revalidatePath('/');           // invalidate homepage
revalidateTag('folders');      // invalidate all queries tagged "folders"
```

### TII Caching Strategy
- Homepage articles: `force-dynamic` — always fresh (no cache)
- Folder queries: `unstable_cache` with 300s TTL
- Daily pipeline output: written to Firestore; next request serves latest automatically

---

## 5. TII-Specific Patterns

### Font: Inter (Load Once in layout.tsx)
```tsx
// app/layout.tsx — THE ONLY PLACE to load Inter
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin", "vietnamese"],  // vietnamese for diacritic support
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

// Applied to body:
<body className={`${inter.variable} font-sans bg-cloud-dancer`}>
```

Never import or instantiate Inter in any other file. The `--font-inter` CSS variable is available everywhere via `font-sans` Tailwind class.

### Background: cloud-dancer at Body Level
`bg-cloud-dancer` is applied at `<body>` in layout.tsx. Pages and components do NOT need to re-apply it. Only override when a specific section needs a different background (e.g., a white card uses `bg-white`).

### Article Data Flow
```
Trigger.dev cron (9 AM GMT+7)
  → fetchAllSources() — RSS parsing
  → aggregateTopics() — Claude Haiku topic grouping
  → writeArticle() — Claude Haiku article generation
  → checkDuplicates() — semantic dedup vs last 7 days
  → ingestArticle() — Firestore write to articles collection
       ↓
Next.js Server Component (on user request)
  → getDailyNewsArticles() — Firestore query, ordered by publishedAt DESC
  → <NewsArticleFeed> — renders article cards with ReactMarkdown
```

### Pagination Pattern (URL-based State)
TII uses URL query parameters for pagination — not `useState`. This means:
- Pagination state persists across page navigation and browser refresh
- Server Components can read cursor from `searchParams` without client-side JavaScript
- The "← Newer" and "Older →" buttons are `<Link>` components (not onClick handlers)

```tsx
// PaginationControls produces links like:
// /?cursor=MTcwMDAwMDAwMA==
// /?cursor=MTcwMDAwMDAwMA==&category=vietnam  (if category filter added)
```

### TypeScript: Props Always Typed with Interfaces
```tsx
// CORRECT
interface NewsArticleFeedProps {
  articles: Article[];
}

export function NewsArticleFeed({ articles }: NewsArticleFeedProps) {}

// WRONG — anonymous object type in function signature
export function NewsArticleFeed({ articles }: { articles: Article[] }) {}
```

Exception: small inline types are acceptable for simple utilities, but all public component props use interfaces.

### File Naming Convention
- Pages: `page.tsx`, `layout.tsx` (lowercase, Next.js required)
- Components: `PascalCase.tsx` (e.g., `NewsArticleFeed.tsx`)
- Utilities: `camelCase.ts` (e.g., `dateGMT7.ts`, `firestore.ts`)
- Route handlers: `route.ts` (lowercase, Next.js required)

### Import Alias
TII uses `@/` as the path alias mapping to `projects/the-intelligent-investor/` (configured in `tsconfig.json`). Always use `@/lib/...`, `@/components/...`, `@/types/...` rather than relative imports when crossing directory boundaries.

---

## 6. Adding a New Page

Checklist for adding a new page to TII:

1. Create `app/[route]/page.tsx` as a Server Component (no `'use client'`)
2. Define `PageProps` interface with `params: Promise<...>` and/or `searchParams: Promise<...>`
3. `await params` and `await searchParams` before using values
4. Fetch data directly in the async Server Component function
5. Apply consistent layout: `<div className="py-8 px-6 max-w-4xl mx-auto">`
6. Add `<h1>` with heading classes matching design system
7. Handle empty state and error state explicitly
8. Do NOT add a new font import (Inter is already in layout.tsx)
9. Do NOT add `bg-cloud-dancer` to the page (it's in `<body>`)

---

## 7. Common Next.js 15 Mistakes in TII Context

| Mistake | Why Wrong | Correct |
|---------|-----------|---------|
| `const { cursor } = searchParams` (sync) | searchParams is a Promise in Next.js 15 | `const { cursor } = await searchParams` |
| `useEffect(() => fetch(...), [])` in a page component | Defeats App Router; causes hydration mismatch | Fetch directly in async Server Component |
| `import admin from '@/lib/firebase/admin'` in a component | admin.ts is server-only; causes build error if bundled | Only use in Server Components and Route Handlers |
| `'use client'` on a parent that wraps a Server Component child | The child is now also client-side | Extract only the interactive leaf node as a Client Component |
| `cookies()` without `await` | Breaks in Next.js 15 | `const c = await cookies()` |

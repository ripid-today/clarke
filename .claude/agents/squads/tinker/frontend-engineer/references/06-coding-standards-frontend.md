# Coding Standards — TII Frontend

## TypeScript

### Strict Mode
TII's `tsconfig.json` enables strict mode. This means:
- No implicit `any` types — all variables and parameters must be typed
- `strictNullChecks`: `null` and `undefined` are not assignable to typed values without explicit union
- `noImplicitReturns`: all code paths must return a value if the function declares a return type

### Interfaces for All Props
Every React component must have a TypeScript interface for its props, defined before the component function:

```tsx
// CORRECT
interface NewsArticleFeedProps {
  articles: Article[];
}

export function NewsArticleFeed({ articles }: NewsArticleFeedProps) {
  // ...
}
```

```tsx
// WRONG — inline type in function signature
export function NewsArticleFeed({ articles }: { articles: Article[] }) {}

// WRONG — no type annotation
export function NewsArticleFeed({ articles }) {}
```

Exception: internal sub-components (defined inside the same file, not exported) may use inline types if simple.

### Import Types Explicitly
Use `import type` for type-only imports to avoid bundling issues:
```ts
import type { Article, Folder } from "@/types/library";
import type { NextRequest } from "next/server";
```

### No `any` Types
If you need to bypass the type system, use `unknown` + type guard instead of `any`:
```ts
// WRONG
const data: any = await response.json();

// CORRECT
const data: unknown = await response.json();
if (typeof data === 'object' && data !== null && 'articles' in data) {
  // narrowed to safe type
}
```

If a third-party library forces `any` (e.g., firebase-admin as seen in `admin.ts`), add an inline comment: `// eslint-disable-next-line @typescript-eslint/no-explicit-any`

---

## React / Next.js Component Conventions

### Server Components by Default
All components are Server Components unless they need client-side interactivity. See `references/02-nextjs-app-router.md` for the full decision guide.

### Conditional Rendering
```tsx
// Short-circuit for single elements
{isError && <ErrorMessage />}

// Ternary for two alternatives
{articles.length > 0 ? <ArticleList /> : <EmptyState />}

// Avoid nested ternaries — extract to a variable or component
const content = isError
  ? <ErrorMessage />
  : articles.length > 0
    ? <ArticleList />   // HARD TO READ — extract instead
    : <EmptyState />;
```

For complex branching, extract to a named variable:
```tsx
function renderContent() {
  if (queryError) return <p className="text-red-600">Failed to load articles.</p>;
  if (articles.length === 0) return <EmptyState />;
  return <NewsArticleFeed articles={articles} />;
}

// In JSX:
{renderContent()}
```

### Default Values via Destructuring
```tsx
// CORRECT — defaults in destructuring
function PaginationControls({
  hasMore,
  nextCursor,
  hasPrev,
  activeCategory = undefined,
}: PaginationControlsProps) {}

// AVOID — defaultProps (deprecated in React 19)
```

### One Component Per File
Each component should be in its own file. Exception: small, tightly-coupled sub-components (under 20 lines) may be co-located if they are never used elsewhere and are not independently testable.

### Component Name Matches File Name
- `NewsArticleFeed.tsx` → `export function NewsArticleFeed`
- `PaginationControls.tsx` → `export function PaginationControls`

Use named exports, not default exports for components (makes imports predictable and refactoring easier).

---

## TII-Specific Naming Conventions

### Component Naming
- News-domain components: `News*` prefix (e.g., `NewsArticleFeed`, `NewsArticleList`)
- Reusable UI primitives: descriptive noun (e.g., `PaginationControls`, `ClarkeLogo`)
- Page-level components: match the route name (e.g., `HomePage` → `app/page.tsx` default export)

### File Naming
| File type | Convention | Example |
|-----------|------------|---------|
| Pages | `page.tsx` (lowercase) | `app/page.tsx` |
| Layouts | `layout.tsx` (lowercase) | `app/layout.tsx` |
| Route handlers | `route.ts` (lowercase) | `app/api/articles/route.ts` |
| Components | PascalCase | `NewsArticleFeed.tsx` |
| Utilities | camelCase | `dateGMT7.ts`, `firestore.ts` |
| Types | camelCase | `library.ts` |
| Config | camelCase | `news-sources.json` (kebab for JSON configs) |

### Import Order Convention
Organize imports in this order, separated by blank lines:
```ts
// 1. Node built-ins (if any)
import { readFileSync } from "fs";

// 2. External packages
import { Inter } from "next/font/google";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// 3. Internal aliases (@/)
import { getDailyNewsArticles } from "@/lib/firebase/firestore";
import { NewsArticleFeed } from "@/components/library/news/NewsArticleFeed";

// 4. Type imports (import type)
import type { Article } from "@/types/library";
```

---

## File Size Limits

**Max 200 lines per file.** When a file exceeds this:
- Extract a sub-component if rendering logic is complex
- Extract a utility function to `lib/utils/` if it's a reusable calculation
- Split a large route handler into service + handler

### When to Create a New Component

| Scenario | Create? | Location |
|----------|---------|----------|
| Used in 3+ places | Yes | `components/ui/` (primitive) or `components/library/` (domain) |
| Complex logic >50 lines | Yes | `components/library/[domain]/` |
| Single-use, simple <20 lines | No | Inline in parent |
| Slight variation of existing | No | Add variant prop to existing component |
| Reusable UI primitive | Yes | `components/ui/` |
| TII domain component | Yes | `components/library/news/` |

---

## Styling Rules

### Always Use Tailwind Classes
```tsx
// CORRECT
<div className="bg-white rounded-xl p-6 shadow-md">

// WRONG — inline style
<div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px' }}>

// WRONG — raw hex in class
<div className="bg-[#FFFFFF]">  // Use bg-white instead
```

Exception: dynamic values that cannot be expressed as Tailwind classes may use inline styles, but this is rare.

### Mobile-First Responsive
```tsx
// CORRECT — mobile default, md+ overrides
<div className="text-3xl md:text-4xl">  // 30px mobile, 36px tablet+
<div className="p-6 md:p-8">           // 24px mobile, 32px tablet+

// WRONG — starting from desktop
<div className="text-4xl sm:text-3xl">  // Don't downscale
```

### No Dark Mode
TII is light mode only. Do not add `dark:` prefixes. The `bg-cloud-dancer` background is applied at the body level in `layout.tsx` and should not be overridden.

### Use Semantic HTML
Refer to the semantic HTML table in `references/03-design-system.md`. Key rules for TII:
- News article cards: `<article>` wrapper
- Site navigation: `<nav>` wrapper
- Page content: `<main>` wrapper
- Avoid `<div>` chains when semantic elements exist

---

## Error Handling in Components

### Server Components — Handle Errors Gracefully
```tsx
export default async function HomePage() {
  let articles: Article[] = [];
  let queryError = false;

  try {
    const result = await getDailyNewsArticles(folderId);
    articles = result.articles;
  } catch (err) {
    console.error("HomePage: failed to fetch articles", err);
    queryError = true;
  }

  // Always render something — never let unhandled error reach user
  if (queryError) {
    return <p className="text-red-600">Failed to load. Please try again.</p>;
  }
  // ...
}
```

### Client Components — Error Boundaries
For Client Components that can fail, wrap with React's `<ErrorBoundary>` (not currently used in TII but relevant for future client additions).

### Never Expose Internal Errors
```tsx
// WRONG — exposes stack trace to UI
<p>{error.message}</p>

// CORRECT — generic user-facing message
<p className="text-red-600">Failed to load articles. Please try again later.</p>
// Log the full error server-side: console.error("...", err)
```

---

## Import Alias

TII uses `@/` mapped to the project root (`projects/the-intelligent-investor/`) in `tsconfig.json`. Always use `@/` for cross-directory imports:

```ts
// CORRECT
import { adminDb } from "@/lib/firebase/admin";
import type { Article } from "@/types/library";

// WRONG — relative path across directories
import { adminDb } from "../../lib/firebase/admin";
```

Relative imports are acceptable within the same directory:
```ts
import { formatDate } from "./dateUtils"; // same directory — fine
```

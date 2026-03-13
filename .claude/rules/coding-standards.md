---
path_scope: "website/**/*.{ts,tsx,js,jsx}"
description: "TypeScript, React/Next.js, and file organization standards for Clarke's Library"
---

# Coding Standards

## TypeScript

- **Strict mode enabled** - no `any` types
- Use TypeScript interfaces for all props, API responses, and data models
- Field names: camelCase (`folderId`, `articleCount`, `createdAt`)
- File names: kebab-case for routes (`route.ts`), PascalCase for components (`ArticleViewer.tsx`)
- Utility files: camelCase (`truncateText.ts`, `formatDate.ts`)

## React / Next.js 15 App Router

- **Server Components by default** - only add `'use client'` when interactivity is needed
- Server components fetch data directly (no loading state needed, automatic caching)
- Client components only for: useState, onClick handlers, browser APIs
- Use URL params for state that persists across navigation (search, filters, pagination)
- Use local useState only for ephemeral UI state (modal open/closed, form inputs)

### Component Conventions

- TypeScript interface for all props
- Default values via destructuring defaults
- Conditional rendering with `&&` or ternary
- Semantic HTML elements (h1-h6, nav, main, article, section)
- One component per file (exception: small, tightly-coupled sub-components)
- Component name matches file name

### When to Create New Component

| Scenario | Create? | Rationale |
|----------|---------|-----------|
| Used in 3+ places | Yes | DRY principle |
| Complex logic (>50 lines) | Yes | Single responsibility |
| Single-use, simple (<20 lines) | No | Inline in parent |
| Slight variation of existing | No | Add variant prop |
| Reusable UI primitive | Yes | Put in `components/ui/` |
| Business logic component | Yes | Put in `components/library/` |

## File Organization

- Max 200 lines per file
- Keep route handlers thin - delegate to service layer

```
website/app/
  components/
    library/          # Library-specific components
    ui/               # Reusable UI primitives
  lib/
    firebase/         # Firebase Admin SDK, Firestore helpers
    utils/            # Utility functions
  types/              # Shared TypeScript interfaces
  api/                # API routes
  library/            # Page routes
```

## Error Handling

- Validate ALL user input at API boundary (type, length, format)
- 400 for user input errors with descriptive message
- 500 for server errors with generic message (log full error server-side)
- Never expose internal errors to clients
- Never trust user input for database queries
- Use whitelist approach for allowed fields in POST requests

## Styling Rules

- ALWAYS use Tailwind utility classes, no inline styles
- Use design tokens (`claude-primary`, `cloud-dancer`) not raw hex values
- Mobile-first responsive: default = mobile, `md:` for tablet, `lg:` for desktop
- Class ordering: layout > spacing > typography > colors > effects > interactions
- Custom CSS only when Tailwind utilities are insufficient

## Security

- Never expose Firebase Admin private key in client code
- Store secrets in environment variables
- Use `NEXT_PUBLIC_*` prefix ONLY for safe client-side variables
- Initialize Firebase Admin ONLY on server-side (`lib/firebase/admin.ts`)
- Sanitize markdown content before rendering (use rehype-sanitize)

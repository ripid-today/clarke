# Frontend Development Guideline

**Version:** 1.0.0
**Last Updated:** 2026-02-16
**Purpose:** Enable consistent UI development, design system implementation, and component architecture for Clarke's Library

---

## 1. Design System

### Color Palette

| Token | Hex | RGB | Usage | Tailwind Class |
|-------|-----|-----|-------|----------------|
| **Primary** | #C15F3C | 193, 95, 60 | CTAs, links, accents, focus states | `text-claude-primary` `bg-claude-primary` `border-claude-primary` |
| **Secondary** | #B1ADA1 | 177, 173, 161 | Supporting text, borders, muted backgrounds | `text-claude-secondary` `bg-claude-secondary` `border-claude-secondary` |
| **Background** | #F0EEE9 | 240, 238, 233 | Page backgrounds, card surfaces (Cloud Dancer) | `bg-cloud-dancer` |
| **White** | #FFFFFF | 255, 255, 255 | Cards, containers, text on dark | `bg-white` `text-white` |
| **Black** | #000000 | 0, 0, 0 | Primary text, headings | `text-black` |

**Accessibility - WCAG AA Compliance (4.5:1 contrast ratio):**
- ✅ Primary (#C15F3C) on Cloud Dancer (#F0EEE9): 4.6:1 (PASS)
- ✅ Black (#000000) on White (#FFFFFF): 21:1 (PASS)
- ✅ Black (#000000) on Cloud Dancer (#F0EEE9): 19:1 (PASS)
- ⚠️ Secondary (#B1ADA1) on Cloud Dancer (#F0EEE9): 3.2:1 (FAIL - use for non-text elements only)

**Tailwind Configuration:**
```typescript
// tailwind.config.ts
export default {
  theme: {
    extend: {
      colors: {
        'claude-primary': '#C15F3C',
        'claude-secondary': '#B1ADA1',
        'cloud-dancer': '#F0EEE9',
      }
    }
  }
}
```

**Usage Guidelines:**
- **Primary color:** Use for interactive elements (buttons, links), important accents
- **Secondary color:** Use for borders, subtle backgrounds, non-text decorative elements
- **Cloud Dancer:** Use for page backgrounds to create warm, professional feel
- **Never use raw hex values** in components - always use Tailwind classes

### Typography Scale

**Font Change (v2.1.0 - 2026-02-16):** Changed from Tiempos Text to **San Francisco** (Apple's system font) per Product Owner decision. San Francisco provides professional typography without requiring font file licensing.

| Element | Font Family | Size (Desktop) | Size (Mobile) | Weight | Line Height | Tailwind Class |
|---------|-------------|----------------|---------------|--------|-------------|----------------|
| **H1** | San Francisco (system) | 48px (3rem) | 34px (2.125rem) | 700 (Bold) | 1.2 | `text-5xl md:text-6xl font-bold leading-tight` |
| **H2** | San Francisco (system) | 36px (2.25rem) | 28px (1.75rem) | 600 (Semibold) | 1.3 | `text-3xl md:text-4xl font-semibold leading-snug` |
| **H3** | San Francisco (system) | 24px (1.5rem) | 22px (1.375rem) | 600 (Semibold) | 1.4 | `text-xl md:text-2xl font-semibold leading-normal` |
| **H4** | San Francisco (system) | 20px (1.25rem) | 20px (1.25rem) | 600 (Semibold) | 1.4 | `text-lg md:text-xl font-semibold leading-normal` |
| **Body** | San Francisco (system) | 17px (1.0625rem) | 17px (1.0625rem) | 400 (Regular) | 1.6 | `text-[17px] leading-relaxed` |
| **Small** | San Francisco (system) | 15px (0.9375rem) | 15px (0.9375rem) | 400 (Regular) | 1.5 | `text-[15px] leading-normal` |
| **Code** | SF Mono (system monospace) | 14px (0.875rem) | 14px (0.875rem) | 400 (Regular) | 1.6 | `font-mono text-sm leading-relaxed` |

**Apple HIG Typography Mapping:**
- H1 = Large Title (34pt mobile) / Custom 48px desktop
- H2 = Title 1 (28pt)
- H3 = Title 2 (22pt)
- H4 = Title 3 (20pt)
- Body = Body (17pt - Apple standard)
- Small = Subhead (15pt)

**Font Loading (System Font Stack - No Font Files Needed):**
```typescript
// app/layout.tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-sans">{children}</body>
    </html>
  );
}
```

**Tailwind Configuration (San Francisco System Font):**
```typescript
// tailwind.config.ts
export default {
  theme: {
    extend: {
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          'Helvetica',
          'Arial',
          'sans-serif'
        ],
        mono: [
          'ui-monospace',
          'SFMono-Regular',
          '"SF Mono"',
          'Menlo',
          'Monaco',
          'Consolas',
          '"Liberation Mono"',
          '"Courier New"',
          'monospace'
        ]
      }
    }
  }
}
```

**Benefits of System Font Stack:**
- ✅ **Zero font loading time** - Uses fonts already installed on user's device
- ✅ **No licensing costs** - System fonts are free to use
- ✅ **Native look and feel** - San Francisco on Apple, Segoe UI on Windows, Roboto on Android
- ✅ **Automatic font-display:swap** - No FOIT (Flash of Invisible Text) by default
- ✅ **Graceful fallbacks** - Falls back through stack if font unavailable

**Font Weights Available:**
- Regular: 400 (default body text)
- Medium: 500 (subtle emphasis)
- Semibold: 600 (headings, buttons)
- Bold: 700 (strong emphasis, titles)

### Spacing System (4px Base Unit)

| Size | Value | Tailwind | Usage Example |
|------|-------|----------|---------------|
| **xs** | 4px | `1` | Icon gaps, tight spacing between related items |
| **sm** | 8px | `2` | Small padding, gap between badges |
| **md** | 16px | `4` | Component padding, default gap between elements |
| **lg** | 24px | `6` | Section spacing, card padding |
| **xl** | 32px | `8` | Major section breaks, container padding |
| **2xl** | 48px | `12` | Page section dividers |
| **3xl** | 64px | `16` | Large page margins |

**Usage Guidelines:**
- Use multiples of 4px for consistency (4, 8, 12, 16, 24, 32, 48, 64)
- **Padding:** `p-4` (16px) for cards, `p-6` (24px) for containers, `p-8` (32px) for page sections
- **Gap:** `gap-4` (16px) default between elements, `gap-6` (24px) for related groups
- **Margin:** `mt-8` (32px) between major sections, `mb-4` (16px) between paragraphs

### Border Radius

| Size | Value | Tailwind | Usage |
|------|-------|----------|-------|
| **Default** | 4px | `rounded` | Small elements (badges, tags) |
| **Medium** | 8px | `rounded-lg` | Cards, buttons, inputs (PRIMARY - use for most components) |
| **Large** | 12px | `rounded-xl` | Large containers, modals |
| **Full** | 9999px | `rounded-full` | Pills, avatars, circular icons |

**Usage Guidelines:**
- **Default for most components:** `rounded-lg` (8px)
- **Buttons:** `rounded-lg`
- **Cards:** `rounded-lg`
- **Inputs:** `rounded-lg`
- **Badges/pills:** `rounded-full`

### Shadows & Elevation

| Type | CSS Value | Tailwind | Usage |
|------|-----------|----------|-------|
| **Card** | `0 2px 8px rgba(0,0,0,0.08)` | `shadow-md` | Default card elevation, subtle depth |
| **Elevated** | `0 4px 16px rgba(0,0,0,0.12)` | `shadow-lg` | Modals, dropdowns, popovers |
| **Hover** | `0 6px 20px rgba(0,0,0,0.15)` | `shadow-xl` | Card hover states, interactive elevation |
| **None** | `none` | `shadow-none` | Flat surfaces, no elevation |

**Usage Pattern:**
```tsx
// Card with hover effect
<div className="shadow-md hover:shadow-xl transition-shadow duration-300">
  {/* Card content */}
</div>
```

---

## 2. Component Patterns

### File Organization

```
website/app/
├── components/
│   ├── library/              # Library-specific components
│   │   ├── ArticleViewer.tsx # Article content display
│   │   ├── Breadcrumbs.tsx   # Navigation breadcrumbs
│   │   ├── FeaturedFolders.tsx # Homepage featured sections
│   │   ├── FolderTree.tsx    # Hierarchical folder navigation
│   │   ├── SearchBar.tsx     # Search input and results
│   │   └── Sidebar.tsx       # Navigation sidebar
│   └── ui/                   # Reusable UI primitives (future)
│       ├── Button.tsx        # Generic button component
│       ├── Card.tsx          # Generic card component
│       └── Input.tsx         # Generic input component
```

**Naming Conventions:**
- **Component files:** PascalCase (e.g., `ArticleViewer.tsx`)
- **Utility files:** camelCase (e.g., `truncateText.ts`, `formatDate.ts`)
- **One component per file** (exception: small, tightly-coupled sub-components)
- **Component name matches file name** (ArticleViewer component in ArticleViewer.tsx)

### Component Template

```typescript
// components/library/ExampleComponent.tsx
import React from 'react';

interface ExampleComponentProps {
  title: string;                    // Required prop
  description?: string;              // Optional prop
  variant?: 'default' | 'compact';   // Enum prop with default
  onAction?: () => void;             // Optional callback
}

export function ExampleComponent({
  title,
  description,
  variant = 'default',  // Default value
  onAction
}: ExampleComponentProps) {
  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h3 className="font-headline text-xl font-semibold text-black">
        {title}
      </h3>

      {description && (
        <p className="mt-2 text-sm text-claude-secondary leading-normal">
          {description}
        </p>
      )}

      {onAction && (
        <button
          onClick={onAction}
          className="mt-4 px-4 py-2 bg-claude-primary text-white rounded-lg hover:opacity-90 transition-opacity duration-150"
        >
          Action
        </button>
      )}
    </div>
  );
}
```

**Component Checklist:**
- [ ] TypeScript interface for props
- [ ] Default values for optional props (use destructuring defaults)
- [ ] Conditional rendering with `&&` or ternary
- [ ] Tailwind classes for styling (no inline styles)
- [ ] Semantic HTML elements (h1-h6, nav, main, article, section)
- [ ] Accessibility attributes (aria-label, role if needed)

### Decision Matrix: When to Create New Component

| Scenario | Create New Component? | Rationale |
|----------|----------------------|-----------|
| Used in 3+ places | ✅ Yes | DRY principle, maintainability |
| Complex logic (>50 lines) | ✅ Yes | Single responsibility, easier testing |
| Single-use, simple (<20 lines) | ❌ No | Inline in parent component, avoid over-abstraction |
| Slight variation of existing | ❌ No | Add props to existing component (e.g., `variant` prop) |
| Reusable UI primitive (button, input) | ✅ Yes | Put in `components/ui/` for shared use |
| Business logic component | ✅ Yes | Put in `components/library/` for domain-specific use |

**Example - When NOT to create component:**
```tsx
// ❌ BAD - Unnecessary abstraction
// components/library/ArticleTitle.tsx
export function ArticleTitle({ title }: { title: string }) {
  return <h1 className="font-headline text-4xl font-bold">{title}</h1>;
}

// ✅ GOOD - Inline simple markup
// app/library/[...slug]/page.tsx
export default function ArticlePage({ article }) {
  return (
    <article>
      <h1 className="font-headline text-4xl font-bold">{article.title}</h1>
      {/* Rest of article */}
    </article>
  );
}
```

---

## 3. Styling Conventions

### Tailwind Usage Rules

1. **ALWAYS prefer Tailwind utility classes** over custom CSS
2. **Use design tokens** (claude-primary, cloud-dancer) not raw hex values
3. **Mobile-first responsive design** (default = mobile, use `md:`/`lg:` for desktop)
4. **Group related classes** for readability: layout → spacing → typography → colors → effects

**Class Ordering Pattern:**
```tsx
<div className="
  flex flex-col              {/* Layout */}
  gap-4 p-6                  {/* Spacing */}
  text-base leading-relaxed  {/* Typography */}
  bg-white text-black        {/* Colors */}
  rounded-lg shadow-md       {/* Effects */}
  hover:shadow-xl transition-shadow {/* Interactions */}
">
```

### Responsive Design Breakpoints

| Breakpoint | Width | Tailwind Prefix | Usage |
|------------|-------|-----------------|-------|
| **Mobile** | 320px - 767px | (no prefix) | Default styles, mobile-first approach |
| **Tablet** | 768px - 1023px | `md:` | Medium screens, tablets |
| **Desktop** | 1024px+ | `lg:` | Large screens, desktops |

**Responsive Pattern:**
```tsx
<div className="
  text-2xl           {/* Mobile: 24px */}
  md:text-3xl        {/* Tablet: 30px */}
  lg:text-4xl        {/* Desktop: 36px */}

  p-4                {/* Mobile: 16px padding */}
  md:p-6             {/* Tablet: 24px padding */}
  lg:p-8             {/* Desktop: 32px padding */}
">
```

### Custom CSS (When Necessary)

**Use custom CSS ONLY when:**
- Complex animations not possible with Tailwind
- CSS Grid with named grid areas
- Complex pseudo-selectors (`:nth-child(3n)`)
- Global styles (body, html reset)

**Checklist Before Adding Custom CSS:**
- [ ] Checked Tailwind docs for utility class
- [ ] Tried `@apply` directive in component
- [ ] Confirmed functionality impossible with utilities
- [ ] Documented why custom CSS needed

**Example - Justified custom CSS:**
```css
/* app/globals.css - Complex animation not in Tailwind */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fadeInUp {
  animation: fadeInUp 0.5s ease-out;
}
```

```tsx
// Usage
<div className="animate-fadeInUp">
  {/* Content */}
</div>
```

---

## 4. Animation Standards

### Transition Timing

| Speed | Duration | Timing Function | Usage | Tailwind Class |
|-------|----------|-----------------|-------|----------------|
| **Fast** | 150ms | ease-out | UI feedback (hover, focus), instant response | `duration-150 ease-out` |
| **Medium** | 300ms | ease-in-out | Component state changes, smooth transitions | `duration-300 ease-in-out` |
| **Slow** | 500ms | ease-in-out | Page transitions, complex animations | `duration-500 ease-in-out` |

### Standard Hover States

**Button Hover:**
```tsx
<button className="
  px-4 py-2
  bg-claude-primary text-white
  rounded-lg
  hover:opacity-90              {/* Subtle opacity change */}
  transition-opacity duration-150
">
  Click Me
</button>
```

**Card Hover (Elevation + Scale):**
```tsx
<div className="
  p-6 bg-white rounded-lg
  shadow-md
  hover:shadow-xl               {/* Increase shadow */}
  hover:scale-105               {/* Slight scale up */}
  transition-all duration-300   {/* Smooth transition */}
  cursor-pointer
">
  {/* Card content */}
</div>
```

**Link Hover (Color Change):**
```tsx
<a className="
  text-black
  hover:text-claude-primary     {/* Color transition */}
  transition-colors duration-150
  underline-offset-2
">
  Learn More
</a>
```

### Loading States

**Skeleton Loader:**
```tsx
// Loading placeholder for text
<div className="animate-pulse space-y-4">
  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
</div>
```

**Spinner (using Lucide icons):**
```tsx
import { Loader2 } from 'lucide-react';

<Loader2 className="animate-spin h-6 w-6 text-claude-primary" />
```

**Full Page Loading:**
```tsx
export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Loader2 className="animate-spin h-12 w-12 text-claude-primary" />
    </div>
  );
}
```

---

## 5. Accessibility

### Accessibility Checklist

**Visual:**
- [ ] All text has ≥4.5:1 contrast ratio (WCAG AA)
- [ ] Color is not the only indicator (use icons, labels too)
- [ ] Focus states visible (`focus:ring-2 focus:ring-claude-primary`)
- [ ] Font size ≥16px for body text (readability)

**Interactive:**
- [ ] All buttons/links have min 44×44px touch target (mobile)
- [ ] Keyboard navigation works (Tab, Enter, Escape)
- [ ] Focus order is logical (follows DOM order)
- [ ] Skip to content link for keyboard users

**Semantic:**
- [ ] Semantic HTML used (nav, main, article, section, not all divs)
- [ ] Headings follow hierarchy (h1 → h2 → h3, no skipping)
- [ ] Images have alt text (or empty alt="" for decorative)
- [ ] Forms have associated labels (htmlFor + id)

### Focus States (CRITICAL)

```tsx
// All focusable elements MUST have visible focus
<button className="
  px-4 py-2 bg-claude-primary text-white rounded-lg
  focus:outline-none
  focus:ring-2
  focus:ring-claude-primary
  focus:ring-offset-2
">
  Button
</button>

<a className="
  text-claude-primary underline
  focus:outline-none
  focus:ring-2
  focus:ring-claude-primary
  focus:ring-offset-2
  rounded
">
  Link
</a>
```

### ARIA Patterns

**Button that looks like a link:**
```tsx
<button
  type="button"
  className="text-claude-primary underline"
  onClick={handleClick}
>
  <span className="sr-only">Open menu</span>
  <MenuIcon aria-hidden="true" className="h-5 w-5" />
</button>
```

**Loading state:**
```tsx
<div
  aria-live="polite"
  aria-busy={isLoading}
>
  {isLoading ? (
    <Loader2 className="animate-spin" />
  ) : (
    <>{content}</>
  )}
</div>
```

**Screen reader only text:**
```tsx
<span className="sr-only">
  Search the library
</span>
```

```css
/* tailwind.config.ts already includes .sr-only utility */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
```

---

## 6. State Management

### Decision Tree

```
Does state need to persist across page navigations?
├─ YES → Use URL params (search queries, filters, pagination)
│         Example: /library/search?q=business+analysis
│
└─ NO → Is state shared across components?
        ├─ YES → Is it global app state?
        │   ├─ YES → Use React Context (theme, user preferences)
        │   └─ NO → Lift state up to nearest common parent
        │
        └─ NO → Use local useState in component
```

### Server vs Client State

**Server State (fetch from API, cache with Next.js):**
- Articles, folders, search results
- Any data that comes from Firestore
- User data (if authentication added)

**Client State (React state):**
- UI state (modal open/closed, sidebar expanded/collapsed)
- Form inputs (before submission)
- Temporary filters (before applying to URL)

### Server-Side Rendering Pattern (Next.js 15 App Router)

**Recommended Approach - Server Component (no useState):**
```tsx
// app/library/[...slug]/page.tsx
import { getFolder, getArticles } from '@/lib/firebase/firestore';

export default async function FolderPage({
  params
}: {
  params: { slug: string[] }
}) {
  // Fetch data server-side (no loading state needed, automatic caching)
  const slug = params.slug.join('/');
  const folder = await getFolder(slug);
  const articles = await getArticles(folder.id);

  return (
    <div>
      <h1>{folder.name}</h1>
      <p>{folder.description}</p>

      <div className="grid gap-4">
        {articles.map(article => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
    </div>
  );
}
```

**Client Component (when interactivity needed):**
```tsx
'use client'; // Mark as client component

import { useState } from 'react';

export function SearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = async () => {
    const response = await fetch(`/api/library/search?q=${query}`);
    const data = await response.json();
    setResults(data.data.results);
  };

  return (
    <div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="px-4 py-2 border border-claude-secondary rounded-lg"
      />
      <button onClick={handleSearch}>Search</button>

      {results.map(result => (
        <div key={result.id}>{result.title}</div>
      ))}
    </div>
  );
}
```

### URL State Pattern (Recommended for Filters/Search)

```tsx
// app/library/search/page.tsx
import { Suspense } from 'react';
import { SearchResults } from '@/components/library/SearchResults';

export default function SearchPage({
  searchParams
}: {
  searchParams: { q?: string; filter?: string }
}) {
  return (
    <div>
      <h1>Search Results</h1>
      <Suspense fallback={<div>Loading...</div>}>
        <SearchResults
          query={searchParams.q || ''}
          filter={searchParams.filter}
        />
      </Suspense>
    </div>
  );
}
```

**Benefits:**
- State persists on page refresh
- Shareable URLs (/library/search?q=business)
- Browser back/forward works automatically
- No client-side state management needed

---

## Summary

This Frontend Guideline ensures:
- ✅ **Consistent design system** (Claude colors, Tiempos Text typography, 4px spacing)
- ✅ **Component reusability** (clear patterns for when to create vs inline)
- ✅ **Tailwind-first approach** (minimal custom CSS, design token usage)
- ✅ **Smooth animations** (150ms hover, 300ms transitions, loading states)
- ✅ **WCAG AA accessibility** (4.5:1 contrast, focus states, semantic HTML)
- ✅ **Server-first architecture** (Next.js 15 server components, URL state)

**When to Reference:**
- Styling component → Section 1 (Design System) for color/typography/spacing values
- Creating component → Section 2 (Component Patterns) for template and decision matrix
- Adding animations → Section 4 (Animation Standards) for timing and patterns
- Accessibility review → Section 5 (Accessibility) for checklist and ARIA patterns
- Managing state → Section 6 (State Management) for server vs client decision tree

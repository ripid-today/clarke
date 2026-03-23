# Tailwind CSS Patterns for TII

## TII Uses Tailwind v3 (Not v4)

TII's Tailwind configuration is in `tailwind.config.ts` — this is Tailwind v3 with `plugin` and `theme.extend` patterns. The `.claude/rules/design-system.md` references `@theme` blocks (Tailwind v4 syntax). **Do not use `@theme` in TII.** Custom tokens are defined in `tailwind.config.ts`.

This distinction matters when:
- Adding new design tokens → edit `tailwind.config.ts`, not `globals.css`
- Adding custom animations → use `tailwind.config.ts` keyframes or plain CSS classes in `globals.css`
- Reading documentation → look at Tailwind v3 docs, not v4

---

## Current TII Custom Tokens (from `tailwind.config.ts`)

### Colors
```ts
colors: {
  "claude-primary":   "#C15F3C",  // Warm terracotta — CTAs, links, accents
  "claude-secondary": "#655C54",  // Dark warm brown — metadata, muted text
  "cloud-dancer":     "#F0EEE9",  // Off-white warm — page background
},
```

Usage in Tailwind classes:
```
text-claude-primary      bg-claude-primary      border-claude-primary
text-claude-secondary    bg-claude-secondary    border-claude-secondary
text-cloud-dancer        bg-cloud-dancer
```

All opacity modifiers work: `border-claude-secondary/40` = 40% opacity border.

### Font Family
```ts
fontFamily: {
  sans: ["var(--font-inter)", "-apple-system", "BlinkMacSystemFont", ...],
  mono: ["ui-monospace", "SFMono-Regular", ...],
},
```

Usage: `font-sans` (default for body), `font-mono` (code blocks).
The `var(--font-inter)` variable is set by Next.js's `next/font/google` in `layout.tsx`.

### Typography Plugin
```ts
plugins: [require("@tailwindcss/typography")],
```

Enables `.prose` classes for markdown-rendered content. Used in `NewsArticleFeed.tsx`:
```tsx
<div className="prose prose-lg max-w-none
  prose-headings:font-semibold prose-headings:text-black
  prose-h2:text-xl prose-h2:mt-6 prose-h2:mb-3
  prose-p:text-[17px] prose-p:leading-relaxed prose-p:text-black
  prose-li:text-[17px] prose-li:leading-relaxed
  prose-a:text-claude-primary prose-a:no-underline hover:prose-a:underline
  prose-strong:font-semibold prose-strong:text-black
  prose-hr:border-claude-secondary/30">
```

---

## Common TII Patterns with Actual Classes

### Page Container
```tsx
<div className="py-8 px-6 max-w-4xl mx-auto">
```
- `py-8`: 32px vertical padding (top and bottom)
- `px-6`: 24px horizontal padding (handles mobile edge spacing)
- `max-w-4xl`: 896px max width (comfortable reading width)
- `mx-auto`: centered on large screens

### Article Card
```tsx
<article className="relative bg-white border border-claude-secondary/40 rounded-xl p-6 md:p-8">
```
- `relative`: enables absolute-positioned badge inside
- `bg-white`: card surface distinct from page `bg-cloud-dancer`
- `border-claude-secondary/40`: subtle 40% opacity warm border
- `rounded-xl`: 12px border radius (large, soft)
- `p-6 md:p-8`: 24px mobile, 32px desktop padding

### Primary Button / Link
```tsx
className="px-4 py-2 text-[15px] font-medium text-claude-primary border border-claude-primary rounded-lg hover:bg-claude-primary hover:text-white transition-colors duration-150"
```
- Outlined style by default (text + border in claude-primary)
- Fills on hover (background becomes claude-primary, text becomes white)
- 150ms transition matches Fast timing token

### Secondary / Ghost Button
```tsx
className="px-4 py-2 text-[15px] font-medium text-claude-secondary hover:text-black border border-claude-secondary/30 rounded-lg transition-colors duration-150"
```

### Inline Link
```tsx
className="text-claude-primary hover:opacity-80 transition-opacity duration-150"
```

### Badge / Pill
```tsx
// "Updated" badge — orange variant
className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-orange-100 text-orange-700"

// Status badge — using design tokens
className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-claude-primary/10 text-claude-primary"
```

### Heading Hierarchy
```tsx
// Page heading (homepage)
<h1 className="text-3xl md:text-4xl font-semibold leading-snug mb-2">

// Article card heading
<h2 className="text-xl font-semibold text-black leading-snug mb-1">

// Section heading
<h3 className="text-lg font-semibold text-black mb-4">
```

### Body Text Sizes
```tsx
// Primary body text
<p className="text-[17px] leading-relaxed">

// Secondary/subtitle text
<p className="text-[17px] leading-relaxed text-claude-secondary">

// Small metadata text
<p className="text-[13px] text-claude-secondary">

// Caption / label
<span className="text-[15px] text-claude-secondary">
```

### Loading / Disabled State
```tsx
// Navigation loading (dim content, no spinner)
className={`transition-opacity duration-150 ${isLoading ? "opacity-60 pointer-events-none" : ""}`}

// Disabled button
className="opacity-50 cursor-not-allowed"
```

### Empty State
```tsx
<div className="text-center py-16 text-claude-secondary">
  <p className="text-[17px]">No briefings available yet.</p>
  <p className="text-[15px] mt-2">Check back after 9 AM GMT+7.</p>
</div>
```

### Error State (inline, not modal)
```tsx
<p className="text-[17px] text-red-600">
  Failed to load articles. Please try again later.
</p>
```

---

## How to Add a New Custom Token

### Adding a Color Token
**Step 1:** Open `tailwind.config.ts` and add to `theme.extend.colors`:
```ts
colors: {
  "claude-primary": "#C15F3C",
  "claude-secondary": "#655C54",
  "cloud-dancer": "#F0EEE9",
  "accent-warm": "#E8A87C",  // new token
},
```

**Step 2:** Use Tailwind utility classes (auto-generated from the name):
```tsx
<div className="text-accent-warm bg-accent-warm border-accent-warm">
```

**Step 3:** Verify the token renders in browser. Run `npm run dev` and confirm the class applies the correct color.

**Step 4:** Verify WCAG contrast (see references/03-design-system.md for checker URL) for any text usage.

### Adding a Custom Animation
**Option A: globals.css (simpler, one-off)**
```css
/* In globals.css, after @tailwind utilities */
@keyframes my-custom-animation {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}

.animate-my-custom {
  animation: my-custom-animation 220ms ease-out;
}
```

Then use: `className="animate-my-custom"`

**Option B: tailwind.config.ts (preferred for reuse)**
```ts
theme: {
  extend: {
    keyframes: {
      "fade-up": {
        from: { opacity: "0", transform: "translateY(8px)" },
        to:   { opacity: "1", transform: "translateY(0)" },
      },
    },
    animation: {
      "fade-up": "fade-up 220ms ease-out",
    },
  },
},
```

Then use: `className="animate-fade-up"`

### Adding a Font Size Token
Tailwind v3 uses arbitrary values with `text-[Npx]` for non-standard sizes. This is already used throughout TII:
- `text-[17px]` — body text
- `text-[15px]` — small text
- `text-[13px]` — metadata text
- `text-[11px]` — badges

No need to add to `tailwind.config.ts` for arbitrary pixel sizes — just use the bracket syntax directly.

---

## Class Ordering Convention

Apply Tailwind classes in this order (matches code review expectations):

1. **Layout / Display**: `flex`, `grid`, `block`, `relative`, `absolute`, `fixed`
2. **Spacing**: `p-*`, `px-*`, `py-*`, `m-*`, `gap-*`
3. **Sizing**: `w-*`, `h-*`, `max-w-*`, `min-h-*`
4. **Typography**: `text-*`, `font-*`, `leading-*`, `tracking-*`
5. **Colors**: `text-*` (color), `bg-*`, `border-*`
6. **Effects**: `shadow-*`, `opacity-*`, `rounded-*`
7. **Interactions**: `hover:*`, `focus:*`, `transition-*`, `duration-*`, `cursor-*`
8. **Responsive prefixes**: same order within `md:` and `lg:` prefixes

Example (correctly ordered):
```tsx
className="flex flex-col gap-4 p-6 max-w-4xl text-[17px] font-medium text-black bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-150"
```

---

## Tailwind Content Configuration (Purge Safety)

From `tailwind.config.ts`:
```ts
content: [
  "./pages/**/*.{js,ts,jsx,tsx,mdx}",
  "./components/**/*.{js,ts,jsx,tsx,mdx}",
  "./app/**/*.{js,ts,jsx,tsx,mdx}",
],
```

This means Tailwind scans `pages/`, `components/`, and `app/` for class names. Classes constructed dynamically (string interpolation) will NOT be detected and will be purged in production.

**WRONG (class will be purged):**
```tsx
const color = "primary";
className={`text-claude-${color}`}  // Tailwind can't detect this
```

**CORRECT (class is statically detectable):**
```tsx
className={isActive ? "text-claude-primary" : "text-claude-secondary"}
```

If you must use dynamic classes, add them to the `safelist` array in `tailwind.config.ts`:
```ts
safelist: [
  "text-claude-primary",
  "text-claude-secondary",
  // etc.
],
```

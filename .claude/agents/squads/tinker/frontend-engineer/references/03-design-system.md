# Design System — TII Frontend Reference

## Color Palette

| Token | Hex | Usage | Tailwind Class |
|-------|-----|-------|----------------|
| **Primary** | #C15F3C | CTAs, links, accents, focus states | `text-claude-primary` `bg-claude-primary` `border-claude-primary` |
| **Secondary** | #655C54 | Supporting text, borders, muted content | `text-claude-secondary` `bg-claude-secondary` `border-claude-secondary` |
| **Background** | #F0EEE9 | Page backgrounds, card surfaces (Cloud Dancer) | `bg-cloud-dancer` |
| **White** | #FFFFFF | Cards, containers, text on dark | `bg-white` `text-white` |
| **Black** | #000000 | Primary text, headings | `text-black` |

**IMPORTANT — TII vs. global design-system discrepancy:** The global design-system rule documents `claude-secondary` as `#B1ADA1`. The actual value in `tailwind.config.ts` is `#655C54` (darker warm brown). The `tailwind.config.ts` is the ground truth. Do not use `#B1ADA1`.

**RULE: Never use raw hex values in components.** Always use the Tailwind token classes above. If a hex appears in a PR, reject it.

## WCAG Accessibility Compliance

Target: WCAG AA (4.5:1 contrast ratio for text, 3:1 for UI components).

| Combination | Ratio | Status | Notes |
|-------------|-------|--------|-------|
| Black (#000) on Cloud Dancer (#F0EEE9) | 19:1 | PASS | Body text, headings |
| Black (#000) on White (#FFF) | 21:1 | PASS | Card content |
| Primary (#C15F3C) on Cloud Dancer (#F0EEE9) | ~4.6:1 | PASS | Links, CTAs on page bg |
| Primary (#C15F3C) on White (#FFF) | ~4.5:1 | PASS | Links, CTAs on card bg |
| Secondary (#655C54) on Cloud Dancer (#F0EEE9) | ~6.5:1 | PASS | Metadata text |
| White (#FFF) on Primary (#C15F3C) | ~4.5:1 | PASS | Text on primary buttons |

### WCAG 2.2 Criteria Relevant to TII

**1.4.3 Contrast (Minimum) — AA:** Text must have 4.5:1 ratio (3:1 for large text 18pt/14pt bold). All text pairs above pass.

**1.4.11 Non-text Contrast — AA:** UI components (buttons, focus indicators, form borders) need 3:1. The `border-claude-primary` on white background passes.

**2.4.7 Focus Visible — AA:** Focus indicator must be visible. TII implements this via `globals.css`: `*:focus-visible { outline: 2px solid #C15F3C; outline-offset: 2px; }` on all interactive elements.

**2.5.5 Target Size — AA (2.2):** Interactive targets should be at least 24×24px CSS (AA minimum), ideally 44×44px for touch. TII pagination buttons use `px-4 py-2` which comfortably exceeds 44px touch target at 17px base font.

### How to Verify a New Color Is WCAG AA Compliant
When adding a new color combination, verify the contrast ratio before shipping:
1. Use the WebAIM Contrast Checker: https://webaim.org/resources/contrastchecker/
2. Enter the foreground hex and background hex
3. Confirm ratio is 4.5:1 or higher for text (or 3:1 for large text 18px+ regular, 14px+ bold)
4. Never use `claude-secondary` (#655C54) on `cloud-dancer` (#F0EEE9) for decorative non-text elements only — at ~6.5:1 it actually passes, but validate the specific use case

## Typography

**Font: Inter** — loaded in `layout.tsx` via `next/font/google` with `latin` + `vietnamese` subsets. Supports full Vietnamese diacritic characters required for TII content.

| Element | Desktop | Mobile | Weight | Tailwind |
|---------|---------|--------|--------|----------|
| **H1** | 48px (3rem) | 34px (2.125rem) | 700 Bold | `text-5xl md:text-6xl font-bold leading-tight` |
| **H2** | 36px (2.25rem) | 28px (1.75rem) | 600 Semibold | `text-3xl md:text-4xl font-semibold leading-snug` |
| **H3** | 24px (1.5rem) | 22px (1.375rem) | 600 Semibold | `text-xl md:text-2xl font-semibold leading-normal` |
| **H4** | 20px (1.25rem) | 20px (1.25rem) | 600 Semibold | `text-lg md:text-xl font-semibold leading-normal` |
| **Body** | 17px | 17px | 400 Regular | `text-[17px] leading-relaxed` |
| **Small** | 15px | 15px | 400 Regular | `text-[15px] leading-normal` |
| **Code** | 14px | 14px | 400 Regular | `font-mono text-sm leading-relaxed` |
| **Metadata** | 13px | 13px | 400 Regular | `text-[13px]` |

**TII in use:** The homepage H1 is `text-3xl md:text-4xl font-semibold` (H2 size) — a deliberate design choice for the app header. Article card titles use `text-xl font-semibold` (H3 size).

**Font weights available:** 400 (Regular), 500 (Medium), 600 (Semibold), 700 (Bold). Only these weights are loaded — do not use 300 (Light) or 800 (ExtraBold).

**Font Stack:**
```
sans: ['var(--font-inter)', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'Helvetica', 'Arial', 'sans-serif']
mono: ['ui-monospace', 'SFMono-Regular', '"SF Mono"', 'Menlo', 'Monaco', 'Consolas', '"Liberation Mono"', '"Courier New"', 'monospace']
```

## Spacing (4px Base Unit)

| Size | Value | Tailwind | Usage |
|------|-------|----------|-------|
| xs | 4px | `1` | Icon gaps, tight spacing |
| sm | 8px | `2` | Small padding, badge gaps |
| md | 16px | `4` | Component padding, default gap |
| lg | 24px | `6` | Section spacing, card padding |
| xl | 32px | `8` | Major section breaks |
| 2xl | 48px | `12` | Page section dividers |
| 3xl | 64px | `16` | Large page margins |

**TII in use:**
- Page container: `py-8 px-6` (32px vertical, 24px horizontal)
- Article card: `p-6 md:p-8` (24px mobile, 32px desktop)
- Article stack gap: `gap-12` (48px between cards)
- Section heading margin: `mb-8` below the header section

## Border Radius

| Size | Value | Tailwind | Usage |
|------|-------|----------|-------|
| Default | 4px | `rounded` | Small elements (badges, pills) |
| Medium | 8px | `rounded-lg` | Buttons, inputs (PRIMARY default) |
| Large | 12px | `rounded-xl` | Cards (TII article cards use this) |
| Full | 9999px | `rounded-full` | Pill badges |

**TII in use:** Article cards use `rounded-xl`. Buttons (pagination) use `rounded-lg`. "Updated" badge uses `rounded-full`.

## Shadows & Elevation

| Type | Tailwind | Usage |
|------|----------|-------|
| Card | `shadow-md` | Default card elevation |
| Elevated | `shadow-lg` | Modals, dropdowns |
| Hover | `shadow-xl` | Card hover states |
| None | `shadow-none` | Flat surfaces |

**TII in use:** Article cards use a `border border-claude-secondary/40` approach instead of `shadow-md` — providing subtle definition without elevation. If adding hover effects, pair with `hover:shadow-md transition-shadow duration-150`.

## Standard Hover Patterns

```tsx
// Button hover (primary fill on hover)
"text-claude-primary border border-claude-primary hover:bg-claude-primary hover:text-white transition-colors duration-150"

// Card hover (elevation increase)
"hover:shadow-xl hover:scale-105 transition-all duration-300"

// Link hover (color change)
"text-claude-primary hover:opacity-80 transition-opacity duration-150"

// Generic hover (opacity drop)
"hover:opacity-90 transition-opacity duration-150"
```

## Focus States (Critical — All Focusable Elements)

TII implements focus states globally via `globals.css`:
```css
*:focus-visible {
  outline: 2px solid #C15F3C;
  outline-offset: 2px;
  border-radius: 4px;
}
*:focus:not(:focus-visible) {
  outline: none; /* Remove outline for mouse users */
}
```

This global rule covers all focusable elements automatically. When adding custom components that need Tailwind-controlled focus (e.g., in a design where the global rule would conflict), use:
```
focus:outline-none focus:ring-2 focus:ring-claude-primary focus:ring-offset-2
```

## Responsive Breakpoints

| Breakpoint | Width | Tailwind Prefix |
|------------|-------|-----------------|
| Mobile (default) | 320–767px | (no prefix) |
| Tablet | 768–1023px | `md:` |
| Desktop | 1024px+ | `lg:` |

**Mobile-first:** default styles apply to mobile; `md:` overrides for tablet+; `lg:` overrides for desktop+.

**TII in use:**
- Container: `max-w-4xl` (capped width) with `px-6` padding on all screens
- Card padding: `p-6 md:p-8`
- Heading: `text-3xl md:text-4xl`

## TII-Specific Component Examples

### Article Card
```tsx
<article className="relative bg-white border border-claude-secondary/40 rounded-xl p-6 md:p-8">
  {/* Optional "Updated" badge */}
  <span className="absolute top-4 right-4 text-[11px] font-medium px-2 py-0.5 rounded-full bg-orange-100 text-orange-700">
    Updated
  </span>

  <h2 className="text-xl font-semibold text-black leading-snug mb-1">
    Article Title
  </h2>
  <p className="text-[13px] text-claude-secondary mb-4">
    created at: 22/03/2026
  </p>

  {/* Prose content */}
  <div className="prose prose-lg max-w-none prose-p:text-[17px] prose-a:text-claude-primary">
    {/* ReactMarkdown content */}
  </div>
</article>
```

### Pagination Button
```tsx
<Link
  href="/?cursor=abc123"
  className="px-4 py-2 text-[15px] font-medium text-claude-primary border border-claude-primary rounded-lg hover:bg-claude-primary hover:text-white transition-colors duration-150"
>
  Older →
</Link>
```

### Empty State
```tsx
<div className="text-center py-16 text-claude-secondary">
  <p className="text-[17px]">No briefings available yet.</p>
  <p className="text-[15px] mt-2">Check back after 9 AM GMT+7.</p>
</div>
```

### Page Container
```tsx
<div className="py-8 px-6 max-w-4xl mx-auto">
  {/* Page content */}
</div>
```

## Semantic HTML Requirements

Use semantic HTML elements — not `<div>` for everything:

| Element | Use for |
|---------|---------|
| `<main>` | Primary content area of each page |
| `<article>` | Each news article card |
| `<section>` | Groups of related content |
| `<nav>` | Navigation menus |
| `<h1>`–`<h6>` | Headings (no skipping levels) |
| `<p>` | Body text paragraphs |
| `<ul>`/`<ol>`/`<li>` | Lists |
| `<time>` | Date/time values (with `dateTime` attribute) |

**TII current state:** Article cards use `<article>`. No `<main>` wrapper yet on the homepage. If adding navigation, use `<nav>`.

---
path_scope: "website/**/*.{tsx,css,scss}"
description: "Clarke's Library design system - colors, typography, spacing, animations, and accessibility"
---

# Design System

## Color Palette

| Token | Hex | Usage | Tailwind Class |
|-------|-----|-------|----------------|
| **Primary** | #C15F3C | CTAs, links, accents, focus states | `text-claude-primary` `bg-claude-primary` `border-claude-primary` |
| **Secondary** | #B1ADA1 | Supporting text, borders, muted backgrounds | `text-claude-secondary` `bg-claude-secondary` `border-claude-secondary` |
| **Background** | #F0EEE9 | Page backgrounds, card surfaces (Cloud Dancer) | `bg-cloud-dancer` |
| **White** | #FFFFFF | Cards, containers, text on dark | `bg-white` `text-white` |
| **Black** | #000000 | Primary text, headings | `text-black` |

**WCAG AA Compliance (4.5:1 contrast ratio):**
- Primary (#C15F3C) on Cloud Dancer (#F0EEE9): 4.6:1 (PASS)
- Black on White: 21:1 (PASS)
- Black on Cloud Dancer: 19:1 (PASS)
- Secondary (#B1ADA1) on Cloud Dancer: 3.2:1 (FAIL - use for non-text elements only)

**Never use raw hex values** in components - always use Tailwind custom classes.

## Typography

**Font: San Francisco (system font stack) - no font files needed.**

| Element | Desktop | Mobile | Weight | Tailwind |
|---------|---------|--------|--------|----------|
| **H1** | 48px (3rem) | 34px (2.125rem) | 700 Bold | `text-5xl md:text-6xl font-bold leading-tight` |
| **H2** | 36px (2.25rem) | 28px (1.75rem) | 600 Semibold | `text-3xl md:text-4xl font-semibold leading-snug` |
| **H3** | 24px (1.5rem) | 22px (1.375rem) | 600 Semibold | `text-xl md:text-2xl font-semibold leading-normal` |
| **H4** | 20px (1.25rem) | 20px (1.25rem) | 600 Semibold | `text-lg md:text-xl font-semibold leading-normal` |
| **Body** | 17px | 17px | 400 Regular | `text-[17px] leading-relaxed` |
| **Small** | 15px | 15px | 400 Regular | `text-[15px] leading-normal` |
| **Code** | 14px | 14px | 400 Regular | `font-mono text-sm leading-relaxed` |

**Font Weights:** Regular (400), Medium (500), Semibold (600), Bold (700)

**System Font Stack:**
```
sans: ['-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'Helvetica', 'Arial', 'sans-serif']
mono: ['ui-monospace', 'SFMono-Regular', '"SF Mono"', 'Menlo', 'Monaco', 'Consolas', 'monospace']
```

## Spacing (4px Base Unit)

| Size | Value | Tailwind | Usage |
|------|-------|----------|-------|
| xs | 4px | `1` | Icon gaps, tight spacing |
| sm | 8px | `2` | Small padding, badge gaps |
| md | 16px | `4` | Component padding, default gap |
| lg | 24px | `6` | Section spacing, card padding |
| xl | 32px | `8` | Major section breaks, container padding |
| 2xl | 48px | `12` | Page section dividers |
| 3xl | 64px | `16` | Large page margins |

- Padding: `p-4` (cards), `p-6` (containers), `p-8` (page sections)
- Gap: `gap-4` default, `gap-6` for related groups
- Margin: `mt-8` between major sections, `mb-4` between paragraphs

## Border Radius

| Size | Value | Tailwind | Usage |
|------|-------|----------|-------|
| Default | 4px | `rounded` | Small elements (badges) |
| Medium | 8px | `rounded-lg` | Cards, buttons, inputs (PRIMARY) |
| Large | 12px | `rounded-xl` | Large containers, modals |
| Full | 9999px | `rounded-full` | Pills, avatars, circular icons |

## Shadows & Elevation

| Type | Tailwind | Usage |
|------|----------|-------|
| Card | `shadow-md` | Default card elevation |
| Elevated | `shadow-lg` | Modals, dropdowns, popovers |
| Hover | `shadow-xl` | Card hover states |
| None | `shadow-none` | Flat surfaces |

## Animation Standards

| Speed | Duration | Timing | Usage | Tailwind |
|-------|----------|--------|-------|----------|
| Fast | 150ms | ease-out | Hover, focus (instant feedback) | `duration-150 ease-out` |
| Medium | 220ms | ease-out | Slide navigation, state changes | `animate-slide-from-left/right` |
| Slow | 300ms | ease-in-out | Page transitions, complex animations | `duration-300 ease-in-out` |

**Standard Hover Patterns:**
- Button: `hover:opacity-90 transition-opacity duration-150`
- Card: `hover:shadow-xl hover:scale-105 transition-all duration-300`
- Link: `hover:text-claude-primary transition-colors duration-150`

## Component-Level Patterns

| Component | Enter | Exit | Duration |
|-----------|-------|------|----------|
| Modal | scale(0.95)→scale(1) + opacity 0→1 | instant unmount | 150ms ease-out |
| Toast | translateY(-8px)→0 + opacity 0→1 | fade out | 200ms / 150ms |
| Slide nav | translateX(±24px)→0 + opacity 0→1 | key-driven remount | 220ms ease-out |
| Tab toggle | color/bg transition | — | 150ms |
| Loading (nav) | opacity 0.6 on container (no full spinner) | opacity 1 on data ready | instant |

**Rule: Never show a full loading spinner for a navigation fetch** — the user triggered the action; they need immediate visual feedback (slide animation), not a blank screen.

**Slide navigation mechanism:**
- `key={offset}` on wrapper div forces DOM remount → restarts CSS animation
- Pair with `animate-slide-from-left` (← = back/past) or `animate-slide-from-right` (→ = forward/future)
- Tokens defined in `globals.css` via Tailwind v4 `@theme`

## Accessibility

**Visual:**
- All text must have 4.5:1+ contrast ratio (WCAG AA)
- Color is not the only indicator (use icons/labels too)
- Font size 16px+ for body text

**Focus States (CRITICAL - all focusable elements):**
```
focus:outline-none focus:ring-2 focus:ring-claude-primary focus:ring-offset-2
```

**Interactive:**
- Min 44x44px touch target on mobile
- Keyboard navigation: Tab, Enter, Escape
- Logical focus order following DOM order

**Semantic HTML:**
- Use nav, main, article, section (not all divs)
- Headings follow hierarchy (h1 > h2 > h3, no skipping)
- Images have alt text (empty alt="" for decorative)
- Forms have associated labels (htmlFor + id)

**Responsive Breakpoints:**
- Mobile: 320-767px (no prefix, default)
- Tablet: 768-1023px (`md:`)
- Desktop: 1024px+ (`lg:`)

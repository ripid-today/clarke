# Animation and Interaction Patterns

## Timing Tokens

| Speed | Duration | Timing | Use case |
|-------|----------|--------|----------|
| Fast | 150ms | ease-out | Hover, focus ring — instant feedback |
| Medium | 220ms | ease-out | Slide navigation, state changes |
| Slow | 300ms | ease-in-out | Modal enter, complex motion |

**Rule of thumb:** If the user triggered the action (click, hover), use Fast (150ms). If the system is transitioning between states (navigation, page entry), use Medium (220ms). Reserve Slow for modals and deliberate animations.

---

## Component Animation Patterns

### Hover States — All Interactive Elements
Every focusable/clickable element needs a `transition-colors duration-150` or equivalent:

```tsx
// Color-changing button (TII pagination pattern)
className="transition-colors duration-150 hover:bg-claude-primary hover:text-white"

// Opacity-based hover (links, subtle interactions)
className="transition-opacity duration-150 hover:opacity-80"

// Card hover (elevation + scale)
className="transition-all duration-300 hover:shadow-xl hover:scale-105"
```

### Focus Ring — All Focusable Elements
TII implements focus rings globally via `globals.css` (applies to all elements automatically):
```css
*:focus-visible {
  outline: 2px solid #C15F3C;  /* claude-primary */
  outline-offset: 2px;
  border-radius: 4px;
}
```

For custom components where you need Tailwind focus control:
```tsx
className="focus:outline-none focus:ring-2 focus:ring-claude-primary focus:ring-offset-2"
```

### Modal (Enter/Exit)
When implementing a modal in TII:
- **Enter:** fade backdrop + scale-in panel
- **Backdrop:** `opacity-0 → opacity-100`, 150ms ease-out, `bg-black/50`
- **Panel:** `opacity-0 scale-95 → opacity-100 scale-100`, 150ms ease-out
- **Exit:** React unmounts instantly (no CSS exit animation) — acceptable for lightweight modals
- **Constraints:** `max-h-[90vh] overflow-y-auto` on modal body; fixed header inside modal

```tsx
// Modal panel example
<div className="fixed inset-0 z-50 flex items-center justify-center">
  {/* Backdrop */}
  <div className="absolute inset-0 bg-black/50 animate-fade-in" />
  {/* Panel */}
  <div className="relative bg-white rounded-xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto animate-scale-in">
    {/* Fixed header */}
    <div className="sticky top-0 bg-white pb-4 mb-4 border-b border-claude-secondary/20">
      <h2 className="text-xl font-semibold">Modal Title</h2>
    </div>
    {/* Scrollable body */}
    <div>{/* content */}</div>
  </div>
</div>
```

### Slide Navigation (Month/Page Navigation with Direction Awareness)
When implementing left/right navigation between content pages:

```tsx
// Direction-aware: ← = older (from left), → = newer (from right)
// The key on the wrapper div forces React to remount the component → restarts CSS animation

<div key={currentPage} className={isGoingBack ? "animate-slide-from-left" : "animate-slide-from-right"}>
  {/* content */}
</div>
```

Required CSS (add to `globals.css`):
```css
@keyframes slide-in-from-left {
  from { transform: translateX(-24px); opacity: 0; }
  to   { transform: translateX(0);     opacity: 1; }
}
@keyframes slide-in-from-right {
  from { transform: translateX(24px);  opacity: 0; }
  to   { transform: translateX(0);     opacity: 1; }
}

/* Tailwind v3 pattern — add to globals.css after @tailwind utilities */
.animate-slide-from-left  { animation: slide-in-from-left  220ms ease-out; }
.animate-slide-from-right { animation: slide-in-from-right 220ms ease-out; }
```

Note: TII uses Tailwind v3 (not v4). In v3, add custom animation classes directly in `globals.css` as shown above, not in an `@theme` block.

### Tab / Toggle Switch
- Instant content swap is correct for tabs — no slide animation between panels
- The tab button itself gets a 150ms color transition: `transition-colors duration-150`
- Active tab: `bg-claude-primary text-white`; inactive: `text-claude-secondary hover:text-black`

```tsx
// Tab button pattern
<button
  className={`px-4 py-2 rounded-lg text-[15px] font-medium transition-colors duration-150 ${
    isActive
      ? "bg-claude-primary text-white"
      : "text-claude-secondary hover:text-black"
  }`}
  onClick={() => setActiveTab(tab)}
>
  {tab.label}
</button>
```

### Toast Notifications
- Position: `fixed top-4 left-1/2 -translate-x-1/2 z-50` (top-center)
- Enter: slide down + fade in from top (`translateY(-8px) → translateY(0)`, opacity 0→1, 200ms ease-out)
- Exit: fade out (opacity 1→0, 150ms ease-out) via auto-dismiss timeout

```tsx
// Toast component structure
<div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 animate-toast-enter">
  <div className="bg-white border border-claude-secondary/40 rounded-lg shadow-lg px-4 py-3 text-[15px]">
    {message}
  </div>
</div>
```

Required CSS:
```css
@keyframes toast-enter {
  from { transform: translateY(-8px); opacity: 0; }
  to   { transform: translateY(0);    opacity: 1; }
}
.animate-toast-enter { animation: toast-enter 200ms ease-out; }
```

### Data Cells / Row Updates
- No animation on cell value changes (React DOM diff is instant; animation would be distracting)
- Exception: newly added row can flash amber once: `animate-pulse` for 500ms, then remove class

### Loading States — The Critical Rule

**NEVER show a full loading spinner for a navigation fetch.**

The user triggered the navigation action. They need immediate visual feedback — not a blank/spinning screen.

| Scenario | Correct Pattern | Wrong Pattern |
|----------|----------------|---------------|
| Initial page load | `setLoading(true)` → full skeleton/spinner | — |
| User clicks "Older →" pagination | Content stays visible, dims to `opacity-60` | Full spinner, blank screen |
| User changes a filter | Content stays, dims to `opacity-60` | Spinner overlay |
| Background data refresh | No indicator needed | Spinner |

```tsx
// Navigation loading pattern (Client Component)
'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useTransition } from 'react';

export function FilterButton({ category }: { category: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <button
      className={`transition-opacity duration-150 ${isPending ? 'opacity-60 pointer-events-none' : ''}`}
      onClick={() => startTransition(() => router.push(`/?category=${category}`))}
    >
      {category}
    </button>
  );
}
```

For TII's current Server Component pagination (no client state), the page reload itself provides feedback — no special loading state needed.

---

## CSS Setup for Custom Animations (Tailwind v3 / TII Pattern)

TII uses Tailwind v3 with `tailwind.config.ts`. To add custom animations:

**Step 1: Define keyframes in `globals.css`**
```css
/* After @tailwind utilities */
@keyframes my-animation {
  from { transform: translateX(-24px); opacity: 0; }
  to   { transform: translateX(0);     opacity: 1; }
}

.animate-my-animation {
  animation: my-animation 220ms ease-out;
}
```

**Step 2: Use in component**
```tsx
<div className="animate-my-animation">content</div>
```

**Alternative: Extend Tailwind config** (for complex animations that need theme access)
```ts
// tailwind.config.ts
theme: {
  extend: {
    keyframes: {
      'slide-from-left': {
        from: { transform: 'translateX(-24px)', opacity: '0' },
        to:   { transform: 'translateX(0)',      opacity: '1' },
      },
    },
    animation: {
      'slide-from-left': 'slide-from-left 220ms ease-out',
    },
  },
},
```
Then use: `className="animate-slide-from-left"`

Note: The config approach is preferred when the animation needs to be available globally across many components. The `globals.css` approach is simpler for one-off animations.

---

## Troubleshooting Common Animation Issues in TII

### Issue: Slide animation doesn't restart on navigation
**Symptom:** Changing the page offset doesn't trigger the slide animation — content just appears.
**Root cause:** React is reusing the same DOM element instead of remounting it.
**Fix:** Add `key={currentPage}` to the wrapper div. When the key changes, React unmounts and remounts the element, restarting the CSS animation.

```tsx
// Before: animation never runs because DOM element is reused
<div className="animate-slide-from-right">{content}</div>

// After: key change forces remount → animation restarts
<div key={offset} className="animate-slide-from-right">{content}</div>
```

### Issue: Focus ring appears on mouse click but not keyboard
**Symptom:** The orange outline appears when clicking buttons with the mouse.
**Root cause:** `*:focus-visible` is correct (keyboard only), but some browsers show `:focus-visible` on mouse click for certain element types.
**Fix:** The TII `globals.css` already handles this with `*:focus:not(:focus-visible) { outline: none; }`. If custom buttons still show outline on mouse click, add `focus:outline-none` and rely on `focus-visible:ring-2 focus-visible:ring-claude-primary`.

### Issue: Loading opacity applied before data arrives causes flash
**Symptom:** Content briefly dims to `opacity-60` then immediately goes back to full opacity, creating a flicker.
**Root cause:** The transition applied too eagerly — before the navigation even started.
**Fix:** Use React's `useTransition` hook. The `isPending` state from `useTransition` is only true during the actual navigation transition, not before it starts.

### Issue: Custom animation class has no effect
**Symptom:** Added `.animate-custom` class but nothing animates.
**Root causes to check:**
1. Is the keyframe name in `@keyframes` matching the animation shorthand name?
2. Is the CSS class defined after `@tailwind utilities` (not before)?
3. Is Tailwind's purge/content matching deleting the class? Add to `safelist` in `tailwind.config.ts` if needed.
4. Is the element being reused without a key change? Add `key` to force remount.

---

## Interaction Checklist (Before Shipping Any Interactive Component)

- [ ] All hover states: `transition-colors duration-150` or `transition-opacity duration-150`
- [ ] All focus rings: covered by `globals.css` global rule, or explicit `focus:ring-2 focus:ring-claude-primary` for custom cases
- [ ] State-change transitions (tab, toggle, modal): duration from timing table above
- [ ] Navigation components with direction: `key={offset}` + appropriate slide class
- [ ] Toast: `fixed top-4 left-1/2 -translate-x-1/2`, slide-in enter, auto-dismiss
- [ ] Loading states: opacity dimming only for navigation fetches (no full spinner)
- [ ] Modal: `max-h-[90vh]`, scrollable body with `overflow-y-auto`, sticky header
- [ ] Select inputs: `appearance-none` + absolute SVG caret for cross-browser consistency
- [ ] Minimum touch targets: 44×44px on mobile (check `px-` and `py-` values at 17px base font)

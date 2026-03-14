# Animation Standards

## Timing Tokens (from design-system.md)

| Speed  | Duration | Timing      | Use case                     |
|--------|----------|-------------|------------------------------|
| Fast   | 150ms    | ease-out    | Hover, focus ring            |
| Medium | 220ms    | ease-out    | State changes, slide-in      |
| Slow   | 300ms    | ease-in-out | Modal enter, complex motion  |

## Component Animation Patterns

### Modal (enter/exit)
- Enter: fade backdrop + scale-in panel (opacity 0→1, scale 0.95→1, 150ms ease-out)
- No CSS exit (React unmounts instantly) — acceptable for lightweight modals

### Slide Navigation (table/chart month navigation)
- Direction: ← = slide-from-left (new content enters from left = older/past)
- Direction: → = slide-from-right (new content enters from right = newer/future)
- Mechanism: `key={windowOffset}` on wrapper div + `animate-slide-from-*` class
- Duration: 220ms ease-out
- No stale loading overlay during navigation fetches

### Tab / Toggle switch
- No slide between tab panels — instant content swap is correct (300ms+ feels sluggish)
- Tab button: `transition-colors duration-150` on the button itself (bg/text color change)

### Toast (enter)
- Enter: slide down + fade in from top (`translateY(-8px)→0`, opacity 0→1, 200ms ease-out)
- Position: top-center (`fixed top-4 left-1/2 -translate-x-1/2`)
- Exit: fade out (opacity 1→0, 150ms ease-out) — via auto-dismiss timeout

### Data cells / row updates
- No animation on cell value changes (React DOM diff is instant; animation would be distracting)
- Exception: newly added row can flash amber for 500ms (`animate-pulse` once)

## CSS Setup (globals.css — Tailwind v4)

```css
@keyframes slide-in-from-left {
  from { transform: translateX(-24px); opacity: 0; }
  to   { transform: translateX(0);     opacity: 1; }
}
@keyframes slide-in-from-right {
  from { transform: translateX(24px);  opacity: 0; }
  to   { transform: translateX(0);     opacity: 1; }
}

@theme {
  --animate-slide-from-left:  slide-in-from-left  220ms ease-out;
  --animate-slide-from-right: slide-in-from-right 220ms ease-out;
}
```

Usage: `className="animate-slide-from-left"` / `className="animate-slide-from-right"`

## Navigation Loading Rule

**Never show a full loading spinner for a navigation fetch.** The user triggered the action; they need immediate visual feedback (slide animation), not a blank screen.

- Initial page load: `setLoading(true)` — show full loading state
- Navigation fetch (offset/filter change): `setNavLoading(true)` — dim content with `opacity-60`, no spinner
- Distinguish using a `useRef` flag: `hasFetchedOnce.current`

## Interaction Checklist

Before shipping any interactive component, verify:
- [ ] All hover states: `transition-colors duration-150`
- [ ] All focus rings: `focus:ring-2 focus:ring-claude-primary focus:ring-offset-2`
- [ ] State-change transitions (tab, toggle, modal): defined duration from table above
- [ ] Navigation components: direction-aware slide animation (`key` + `animate-slide-from-*`)
- [ ] Toast: top-center position, auto-dismiss
- [ ] No full loading-state flash for background data refreshes (use opacity dimming)
- [ ] Modal: constrained `max-h-[90vh]`, scrollable body (`overflow-y-auto`), fixed header
- [ ] Select inputs: custom caret (`appearance-none` + absolute SVG) for cross-browser consistency

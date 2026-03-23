# UI Testing Patterns — TII Quality Engineer Reference

## Scope 1: UI / Browser Testing

Verify the TII frontend renders correctly and matches design requirements across viewports.

### Viewport Sizes to Test

| Viewport | Width | Label | Purpose |
|----------|-------|-------|---------|
| Mobile | 375px | iPhone SE / standard mobile | Primary mobile view |
| Tablet | 768px | iPad portrait | `md:` breakpoint behavior |
| Desktop | 1280px | Standard laptop | Primary desktop view |

Testing at 320px (minimum mobile) is optional but catches horizontal overflow on very small screens.

### TII Homepage Checklist (Every QA Cycle)

**Layout:**
- [ ] Page background is cloud-dancer (`#F0EEE9`) off-white — not pure white, not grey
- [ ] Content is centered with `max-w-4xl` constraint — does not span full width at 1280px
- [ ] Page container has visible horizontal padding at all viewports (no content flush to edge)
- [ ] Page heading "Intelligent Investor" renders as H1 with correct size (`text-3xl` mobile, `text-4xl` desktop)
- [ ] Subtitle text is rendered in `claude-secondary` muted color, not black

**Article Cards:**
- [ ] Cards have white background distinct from cloud-dancer page background
- [ ] Cards have `rounded-xl` (12px radius) soft corners
- [ ] Cards have subtle warm border (`border-claude-secondary/40`)
- [ ] Article card titles render in black, font-semibold, not clickable links
- [ ] Date label renders below title in muted small text (`text-[13px]`)
- [ ] "Updated" badge appears only on articles with `isUpdated: true`
- [ ] Cards do NOT have horizontal overflow on mobile (content wraps correctly)
- [ ] `gap-12` (48px) spacing between cards is visible — cards are clearly separated

**Content Rendering:**
- [ ] Article body text renders at 17px with `leading-relaxed` (not dense, not huge)
- [ ] **No raw markdown symbols visible:** asterisks (`**bold**`), hashes (`## heading`), hyphens as bullets (`- item`)
- [ ] Bold text (`**text**`) renders as visually bold, not as `**text**` literal
- [ ] Bullet lists render as proper `<ul>/<li>` elements with visible list markers
- [ ] `**Key Numbers**` section renders as a bold heading, not as `**Key Numbers**` text
- [ ] Article links (if any) render in claude-primary color, not default browser blue

**Pagination:**
- [ ] "← Newer" button appears when on a non-first page (hasPrev is true)
- [ ] "Older →" button appears when more articles exist (hasMore is true)
- [ ] Both buttons have correct styling: outlined with claude-primary color
- [ ] Clicking a pagination button navigates correctly (URL changes, content updates)
- [ ] Only the applicable button renders (not both when only one is needed)

**Empty State:**
- [ ] When no articles: "No briefings available yet." message renders
- [ ] "Check back after 9 AM GMT+7." renders below in smaller text
- [ ] Error state: "Failed to load articles. Please try again later." appears in red when fetch fails

### Focus Ring / Accessibility

Verify keyboard navigation works:
1. Load the TII homepage in browser
2. Press Tab to move focus through the page
3. Check each focusable element:
   - [ ] Focus ring appears as orange outline (`#C15F3C`) with 2px offset
   - [ ] Focus ring has no layout shift (uses outline, not border)
   - [ ] Pagination links show focus ring when tabbed to
   - [ ] Focus order follows visual left-to-right, top-to-bottom order

Test that mouse click does NOT show the focus ring (only keyboard navigation):
1. Click any pagination button
2. Verify no orange ring appears
3. Then press Tab
4. Verify ring appears on the focused element

### Touch Target Size (Mobile)

For mobile at 375px:
- [ ] Pagination buttons are at least 44px tall (verify with browser DevTools computed style)
- [ ] Any other interactive elements (links in content) are readable with comfortable touch margin

### Checking for Raw Markdown

When reviewing article content:
1. Open the TII homepage
2. For each article card, look for:
   - `**` characters (double asterisks) — indicates bold failed to render
   - `##` at start of a line — indicates heading failed to render
   - `- ` at start of lines without bullet styling — indicates list failed to render
   - `[text](url)` format — indicates link failed to render
3. If raw markdown is visible, the `ReactMarkdown` component or its imports are broken

**How to reproduce a markdown rendering bug:**
Navigate to homepage, count articles with raw markdown. Screenshot each instance. Note the article title.

### Testing Empty Firestore State

To test the empty state without clearing production data:
1. Temporarily modify `page.tsx` to pass `articles={[]}` to `<NewsArticleFeed>`
2. Verify empty state renders correctly
3. Revert the change

Do not modify production Firestore data for QA testing.

### Using Playwright for Browser Testing

TII project supports Playwright via `qa-toolkit` skill. Basic pattern:

```python
# Start dev server, then:
page.goto("http://localhost:3000")
page.set_viewport_size({"width": 375, "height": 812})

# Check for raw markdown
content = page.inner_text("body")
assert "**" not in content, "Raw markdown asterisks found in rendered output"
assert "## " not in content, "Raw markdown hashes found in rendered output"

# Check cloud-dancer background
body_bg = page.evaluate("() => getComputedStyle(document.body).backgroundColor")
# cloud-dancer #F0EEE9 = rgb(240, 238, 233)
assert "240, 238, 233" in body_bg, f"Expected cloud-dancer bg, got {body_bg}"

# Check card renders
cards = page.query_selector_all("article")
assert len(cards) > 0, "No article cards found"

# Check pagination
page.screenshot(path="homepage-mobile.png")
```

### What to Flag as a Bug vs Known Limitation

**Flag as Bug (block deployment):**
- Raw markdown visible to users
- Wrong background color (white instead of cloud-dancer, or pure black)
- Articles not loading when Firestore has content
- Pagination link goes to 404 or wrong content
- Horizontal overflow at any viewport causing scrollbar

**Flag as Known Limitation (document, don't block):**
- "Updated" badge is small and low contrast (orange on white ~2.9:1 — below 4.5:1 for text)
- No loading feedback during pagination navigation (Server Component page reload is instant enough)
- No keyboard shortcut for pagination (not in PRD)

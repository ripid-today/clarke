# Clarke's Library Design System Update - Product Requirements Document

**Version:** 1.2.0
**Last Updated:** 2026-02-16
**Status:** Approved with Conditions
**Owner:** Business Analyst
**Target Deployment:** Within 1 week (2026-02-23)
**⚠️ TIMELINE RISK:** Aggressive timeline acknowledged - see Constraints section for risk mitigation

---

## 1. Overview

### Purpose
Update Clarke's Library website design system to align with Claude.ai's aesthetic, improve content model consistency, and enhance featured content discoverability.

### Scope

**IN SCOPE:**
- Complete design system overhaul (colors, typography, spacing, components)
- Content model field standardization (rename excerpt → description)
- Remove tags functionality from articles (breaking change)
- Mark "Business Analysis Masterclass" folder as featured
- Character limit enforcement for descriptions

**OUT OF SCOPE:**
- New features or functionality beyond design updates
- Analytics implementation
- Performance optimization (maintain current performance)
- User authentication or permissions changes
- Content migration tools (manual Firestore updates acceptable)

### Success Criteria
- Design system fully implemented matching Claude.ai aesthetic
- All articles migrated successfully (excerpt → description, tags removed)
- Business Analysis Masterclass folder marked as featured
- Zero production bugs post-deployment
- Website loads and functions correctly on all supported browsers
- Manual QA review confirms visual consistency

### Target Users
- **Primary:** General visitors browsing Clarke's Library
- **Secondary:** Content consumers reading articles
- **Tertiary:** Administrators managing library content via API

---

## 2. Product Strategy Alignment

### Problem Statement
- Current design uses basic Inter font and minimal styling, lacks visual polish
- Inconsistent field naming (Folder has "description", Article has "excerpt")
- Tags feature adds complexity but provides no value (not used for filtering/search)
- Business Analysis Masterclass content exists but not prominently featured

### Market Context

**Competitive Landscape:**
Clarke's Library operates in the knowledge management space alongside tools like:
- **Notion:** Uses tags heavily, card-based UI, modern serif headlines (similar to our direction)
- **Confluence:** Enterprise-focused, sidebar navigation, uses tags and labels
- **Obsidian Publish:** Markdown-based, minimal design, focuses on content over chrome
- **GitBook:** Documentation-focused, clean typography, sidebar navigation

**Key Differentiators:**
- Clarke's Library is internal/personal knowledge tool (not team collaboration)
- AI-powered content organization (not just manual folder structure)
- Emphasis on reading experience over editing features

**Design Benchmarking:**
- **Adopting from competitors:** Serif headlines (Notion), sidebar navigation (all), featured content sections (Notion)
- **Diverging from competitors:** Removing tags (Notion/Confluence use heavily) - our semantic search makes tags redundant
- **Aligning with Claude.ai:** Reinforces AI-powered brand, warm color palette vs. corporate blue/gray

**Market Positioning:**
- Design quality affects user perception and content consumption
- Claude.ai aesthetic is modern, professional, and aligns with AI-powered tools brand
- Positioning as sophisticated AI tool, not basic wiki

### Business Value
- **User Experience:** Improved visual design increases content credibility and readability
- **Brand Consistency:** Aligning with Claude.ai aesthetic reinforces AI-powered tooling brand
- **Maintainability:** Simplified data model (removing tags) reduces technical debt
- **Content Discovery:** Featured folder increases visibility of Business Analysis content

### User Impact
- Visitors experience more polished, professional interface
- Improved typography enhances readability, especially for long-form articles
- Consistent field naming simplifies future development
- Business Analysis content more discoverable through featured section

### Strategic Alignment
- Supports Clarke's Library mission to be a high-quality knowledge repository
- Aligns with broader trend of AI-powered tools having sophisticated design
- Reduces technical complexity for future enhancements

---

## 3. Product Strategy Context

### Business Analysis Masterclass Promotion
- Existing folder contains valuable BA content created in Phase 1
- Promoting to featured status increases discoverability
- Aligns with knowledge-sharing mission of Clarke's Library

### Design System Rationale
- Claude.ai represents modern AI product design standards
- Warm, approachable color palette (terracotta primary) vs. cold corporate colors
- Tiempos Text serif font for headlines adds sophistication
- IBM Plex Mono for code maintains technical credibility

---

## 4. Functional Requirements

### REQ-001: Implement Claude Color Palette

**Description:** The system shall replace the current color scheme with Claude.ai's brand colors in all UI components.

**Acceptance Criteria (Checklist):**
- [ ] Primary color updated to #C15F3C (warm terracotta) in tailwind.config.ts
- [ ] Secondary color updated to #B1ADA1 (warm taupe) in tailwind.config.ts
- [ ] Tertiary color remains Cloud Dancer #F0EEE9 (no change from #F4F3EE)
- [ ] White color confirmed as #FFFFFF in tailwind.config.ts
- [ ] All hardcoded color values in components replaced with Tailwind classes
- [ ] globals.css updated with new CSS variable values
- [ ] No remaining references to old color hex values in codebase

**Acceptance Test Scenarios:**
- TS-001: Visual inspection confirms primary color used for CTAs, links, accents
- TS-002: Visual inspection confirms secondary color used for supporting elements
- TS-003: Background remains Cloud Dancer across all pages
- TS-004: Color contrast ratios meet WCAG AA standards (4.5:1 for text)

**Technical Notes:**
- Update `tailwind.config.ts` colors object:
  ```typescript
  colors: {
    'claude-primary': '#C15F3C',
    'claude-secondary': '#B1ADA1',
    'cloud-dancer': '#F0EEE9',
  }
  ```
- Update `globals.css` CSS variables
- Audit all components: FeaturedFolders, ArticleViewer, Sidebar, SearchBar, Breadcrumbs
- Replace inline color classes (text-gray-600 → text-claude-secondary where appropriate)
- Links should use claude-primary for hover states

**Priority:** P1-High (Core design system change)

**Dependencies:**
- None (foundational change)

---

### REQ-002: Implement Claude Typography System

**Description:** The system shall replace the Inter font with Claude.ai's typography system using Tiempos Text for headlines and IBM Plex Mono for code.

**Acceptance Criteria (Checklist):**
- [ ] **PRE-IMPLEMENTATION:** Font licensing validated (see ASM-001)
- [ ] Tiempos Text font loaded via Google Fonts or self-hosted (or approved alternative)
- [ ] IBM Plex Mono font loaded via Google Fonts or self-hosted (or approved alternative)
- [ ] app/layout.tsx updated with new font imports
- [ ] **APPROVAL CHECKPOINT:** Typography values documented and approved before full implementation
- [ ] H1 elements use Tiempos Text with appropriate size/weight
- [ ] H2-H4 elements use Tiempos Text with appropriate size/weight
- [ ] Body text uses appropriate system font or specified body font
- [ ] Code blocks use IBM Plex Mono
- [ ] Inline code uses IBM Plex Mono
- [ ] Font sizes match Claude.ai's hierarchy (researched from Claude.ai during implementation)
- [ ] Line heights optimized for readability (1.5-1.7 for body, 1.2-1.4 for headlines)
- [ ] Typography specification documented in PRD or separate design doc for future reference

**Acceptance Test Scenarios:**
- TS-005: Headlines render in Tiempos Text serif font
- TS-006: Code blocks render in IBM Plex Mono monospace font
- TS-007: Typography hierarchy is clear (H1 > H2 > H3 > body)
- TS-008: Text remains readable on mobile devices (16px minimum body size)

**Technical Notes:**
- Research Claude.ai typography scale at implementation time
- Update `app/layout.tsx`:
  ```typescript
  import { Tiempos_Text } from 'next/font/google'; // Or self-hosted
  const tiemposText = Tiempos_Text({ subsets: ['latin'], weight: ['400', '600', '700'] });
  ```
- Update `tailwind.config.ts` theme.extend.fontFamily:
  ```typescript
  fontFamily: {
    'headline': ['Tiempos Text', 'Georgia', 'serif'],
    'code': ['IBM Plex Mono', 'Courier New', 'monospace'],
    'body': [/* system fonts or specified body font */]
  }
  ```
- Update ArticleViewer typography styles for markdown rendering
- Update globals.css font-family declarations

**Priority:** P1-High (Core design system change)

**Dependencies:**
- REQ-001 must be deployed together for visual consistency

---

### REQ-003: Implement Claude Spacing and Layout System

**Description:** The system shall adopt Claude.ai's spacing scale, border radius values, shadows, and component styling patterns.

**Acceptance Criteria (Checklist):**
- [ ] Spacing scale defined in tailwind.config.ts matching Claude patterns
- [ ] Border radius values updated (buttons, cards, inputs) to match Claude
- [ ] Shadow/elevation styles defined (card shadows, dropdown shadows)
- [ ] Button components styled to match Claude aesthetic (sizes, variants, states)
- [ ] Input field components styled to match Claude aesthetic
- [ ] Card/container components styled to match Claude aesthetic
- [ ] Component states defined (default, hover, active, focus, disabled)
- [ ] **Component Audit Checklist (verify each component):**
  - [ ] FeaturedFolders.tsx: Cards use shadow-claude-card, border-radius matches
  - [ ] Sidebar.tsx: Navigation items use claude-primary on hover/active
  - [ ] SearchBar.tsx: Input uses claude-secondary border, claude-primary focus
  - [ ] ArticleViewer.tsx: Content container uses appropriate spacing/typography
  - [ ] Breadcrumbs.tsx: Links use claude-primary color
  - [ ] All card components use consistent shadow and border-radius classes
  - [ ] All interactive elements have visible hover states
  - [ ] All form inputs have visible focus states

**Acceptance Test Scenarios:**
- TS-009: Button hover states provide clear visual feedback
- TS-010: Card components have consistent shadows and borders
- TS-011: Input fields have clear focus indicators
- TS-012: Spacing between elements feels consistent across pages

**Technical Notes:**
- Research Claude.ai design system at implementation time:
  - Spacing scale (likely 4px base unit: 4, 8, 12, 16, 24, 32, 48, 64)
  - Border radius (likely sm: 4px, md: 8px, lg: 12px)
  - Shadows (likely subtle, warm-toned shadows)
- Update `tailwind.config.ts` theme.extend:
  ```typescript
  spacing: {
    // Custom spacing if needed beyond Tailwind defaults
  },
  borderRadius: {
    'claude-sm': '4px',
    'claude-md': '8px',
    'claude-lg': '12px',
  },
  boxShadow: {
    'claude-card': '0 2px 8px rgba(0,0,0,0.08)',
    'claude-elevated': '0 4px 16px rgba(0,0,0,0.12)',
  }
  ```
- Components to update:
  - FeaturedFolders.tsx (card styling)
  - Sidebar.tsx (navigation items)
  - SearchBar.tsx (input styling)
  - ArticleViewer.tsx (content container)
  - Link components in [...slug]/page.tsx

**Priority:** P1-High (Core design system change)

**Dependencies:**
- REQ-001 (colors must be updated first)
- REQ-002 (typography must be updated first)

---

### REQ-004: Rename Article.excerpt to Article.description

**Description:** The system shall rename the "excerpt" field to "description" in the Article data model to match Folder naming convention.

**Acceptance Criteria (Checklist):**
- [ ] Article interface in types/library.ts updated: excerpt → description
- [ ] All Firestore articles collection documents have description field
- [ ] All Firestore articles collection documents have excerpt field removed
- [ ] firestore.ts helper functions updated to use description field
- [ ] All components displaying excerpt updated to use description
- [ ] API routes updated to return description instead of excerpt
- [ ] Search index updated (if excerpt is indexed)
- [ ] No remaining references to "excerpt" in codebase
- [ ] Migration script executed successfully in production

**Acceptance Criteria (Given-When-Then):**
- **Given** an existing article with excerpt field in Firestore
- **When** migration script runs
- **Then** article has description field with excerpt value
- **And** excerpt field is deleted from article document

**Acceptance Test Scenarios:**
- TS-013: Article listing displays description correctly
- TS-014: Existing articles show previous excerpt content in description field
- TS-015: New articles created with description field (not excerpt)
- TS-016: Search functionality continues to work with description field

**Technical Notes:**
- **BREAKING CHANGE:** This is a database schema change requiring migration
- Migration strategy (zero-downtime):
  1. Add description field to interface (mark excerpt as optional)
  2. Update write operations to populate both excerpt and description
  3. Deploy code update
  4. Run Firestore migration script to copy excerpt → description for all articles
  5. Verify all articles have description field
  6. Update code to remove excerpt references
  7. Deploy second code update
  8. Delete excerpt field from Firestore documents
- Files to modify:
  - `types/library.ts`: Update Article interface
  - `lib/firebase/firestore.ts`: Update getArticles, getArticleById, serializeDoc
  - `app/library/[...slug]/page.tsx`: Line 47 change excerpt → description
  - `components/library/FeaturedFolders.tsx`: If excerpt is used
  - `app/api/library/articles/route.ts`: Update POST handler
  - Search index in `lib/firebase/firestore.ts`: searchArticles function

**Character Limit:** 200 characters maximum (enforced at API level, truncated in UI if exceeded)

**Priority:** P0-Critical (Blocking other changes, breaking change)

**Dependencies:**
- Must complete before REQ-005 (tags removal) to minimize migration complexity

---

### REQ-005: Remove Tags from Articles

**Description:** The system shall completely remove the tags field and functionality from the Article data model.

**Acceptance Criteria (Checklist):**
- [ ] Article interface in types/library.ts has tags field removed
- [ ] All Firestore articles collection documents have tags field removed
- [ ] Article listing UI no longer displays tags (lines 48-56 in [...slug]/page.tsx)
- [ ] API POST /api/library/articles no longer accepts tags parameter
- [ ] Search index updated to remove tags field
- [ ] No remaining references to article tags in codebase
- [ ] Migration script executed successfully in production

**Acceptance Criteria (Given-When-Then):**
- **Given** an existing article with tags field in Firestore
- **When** migration script runs
- **Then** article has tags field deleted from document
- **And** article listing displays without tag badges

**Acceptance Test Scenarios:**
- TS-017: Article listing does not show tag badges
- TS-018: Article creation API rejects tags parameter
- TS-019: Search functionality works without tags field
- TS-020: No visual remnants of tags UI in any view

**Technical Notes:**
- **BREAKING CHANGE:** This is a database schema change requiring migration
- Migration strategy (zero-downtime):
  1. Remove tags from UI components first (deploy code)
  2. Update Article interface to make tags optional
  3. Deploy code update
  4. Run Firestore migration script to delete tags field from all articles
  5. Verify all articles have tags field removed
  6. Update Article interface to remove tags completely
  7. Deploy final code update
- Files to modify:
  - `types/library.ts`: Remove tags from Article interface
  - `app/library/[...slug]/page.tsx`: Remove lines 48-56 (tag display)
  - `app/api/library/articles/route.ts`: Remove tags from POST handler
  - `lib/firebase/firestore.ts`: Remove tags from search index logic
  - README.md: Update schema documentation
- Search index schema in README (lines 126-135) also has tags field - update documentation

**Priority:** P0-Critical (Breaking change, should deploy with REQ-004)

**Dependencies:**
- REQ-004 should complete first to minimize number of schema changes
- Can deploy together in single migration window

---

### REQ-006: Mark Business Analysis Masterclass as Featured

**Description:** The system shall update the "Business Analysis Masterclass" folder to have featured: true flag set.

**Acceptance Criteria (Checklist):**
- [ ] Business Analysis Masterclass folder identified in Firestore (by name or slug)
- [ ] featured field set to true for this folder
- [ ] Folder appears in featured folders API response
- [ ] Folder displays on library homepage in featured section
- [ ] Folder order/position appropriate among other featured folders

**Acceptance Criteria (Given-When-Then):**
- **Given** the Business Analysis Masterclass folder exists in Firestore
- **When** featured flag is set to true
- **Then** folder appears in GET /api/library/featured response
- **And** folder displays on library homepage

**Acceptance Test Scenarios:**
- TS-021: Homepage shows Business Analysis Masterclass in featured section
- TS-022: Featured API returns Business Analysis Masterclass folder
- TS-023: Folder displays with appropriate description and styling

**Technical Notes:**
- Likely folder slug: "business-analysis-masterclass" (verify in Firestore at implementation)
- This is a data update, not a code change
- Update via Firebase Console or API:
  ```bash
  # Via Firebase Console:
  # 1. Go to Firestore > folders collection
  # 2. Find document with name "Business Analysis Masterclass"
  # 3. Update field: featured = true
  # 4. Optionally update order field to control display position
  ```
- If multiple folders are featured, consider display order:
  - Update `order` field to position appropriately
  - Lower order value = displayed first
- Verify description field is compelling (max 300 chars)

**Priority:** P2-Medium (Non-breaking, can deploy independently)

**Dependencies:**
- None (independent data update)

---

### REQ-007: Enforce Character Limits for Descriptions

**Description:** The system shall enforce character limits for folder and article descriptions: 300 chars for folders, 200 chars for articles.

**Acceptance Criteria (Checklist):**
- [ ] API POST /api/library/folders validates description ≤ 300 chars
- [ ] API POST /api/library/articles validates description ≤ 200 chars
- [ ] API returns 400 error with clear message if limit exceeded
- [ ] UI components truncate descriptions if they exceed limits (with "..." ellipsis)
- [ ] Hover tooltip shows full description if truncated (optional enhancement)
- [ ] Existing descriptions exceeding limits are truncated during migration

**Acceptance Criteria (Given-When-Then):**
- **Given** a folder description with 350 characters
- **When** API POST request is made
- **Then** API returns 400 error with message "Description must be 300 characters or less"

**Acceptance Test Scenarios:**
- TS-024: API rejects folder description with 301 characters
- TS-025: API rejects article description with 201 characters
- TS-026: UI displays truncated description with "..." for long descriptions
- TS-027: API accepts folder description with exactly 300 characters

**Character Limit Rationale:**
- **Folder description (300 chars):** Approximately 3-4 sentences, provides sufficient context for folder purpose without overwhelming listing view. Comparable to Notion folder descriptions.
- **Article description (200 chars):** Approximately 2-3 sentences, optimal for article preview in listing without taking excessive vertical space. Encourages concise, scannable summaries. Comparable to blog post excerpts or search result snippets.
- Limits balance information density with UI cleanliness and scannability
- Users can read full content in article detail view (content field unlimited)

**Technical Notes:**
- Update API routes:
  ```typescript
  // In app/api/library/folders/route.ts
  if (description && description.length > 300) {
    return NextResponse.json(
      { error: "Description must be 300 characters or less" },
      { status: 400 }
    );
  }

  // In app/api/library/articles/route.ts
  if (description && description.length > 200) {
    return NextResponse.json(
      { error: "Description must be 200 characters or less" },
      { status: 400 }
    );
  }
  ```
- UI truncation utility:
  ```typescript
  function truncateDescription(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength - 3) + '...';
  }
  ```
- Apply truncation in:
  - `app/library/page.tsx`: Folder descriptions (if displayed)
  - `app/library/[...slug]/page.tsx`: Article descriptions (line 47)
  - `components/library/FeaturedFolders.tsx`: Featured folder descriptions
- Migration: Audit existing descriptions, truncate any exceeding limits

**Priority:** P1-High (Data integrity, prevents future issues)

**Dependencies:**
- REQ-004 must complete first (excerpt → description rename)

---

### REQ-008: Update Search Index Schema

**Description:** The system shall update the search_index collection to remove excerpt and tags fields, replacing with description field to match Article schema changes.

**Acceptance Criteria (Checklist):**
- [ ] search_index collection documents updated to use description field (not excerpt)
- [ ] search_index collection documents have tags field removed
- [ ] searchArticles function in firestore.ts updated to query description field
- [ ] Search functionality works correctly with new schema
- [ ] Search results return description field to match Article interface
- [ ] All search_index documents migrated successfully (count matches articles count)

**Acceptance Criteria (Given-When-Then):**
- **Given** a user searches for "business analysis"
- **When** articles match the search query
- **Then** search results return articles with description field (not excerpt)
- **And** search results do not include tags field

**Acceptance Test Scenarios:**
- TS-028: Search for common term returns results with description field
- TS-029: Search results do not include excerpt or tags fields
- TS-030: Search indexing for new articles uses description field
- TS-031: Search result count matches before and after migration

**Technical Notes:**
- README.md documents search_index schema (lines 126-135) - update this documentation
- Current search_index schema:
  ```typescript
  {
    articleId: string
    title: string (lowercase)
    excerpt: string (lowercase) // ← TO BE RENAMED
    tags: string[] // ← TO BE REMOVED
    folderPath: string[]
  }
  ```
- Proposed search_index schema:
  ```typescript
  {
    articleId: string
    title: string (lowercase)
    description: string (lowercase) // ← RENAMED from excerpt
    folderPath: string[]
  }
  ```
- Migration script (similar pattern to articles collection):
  ```javascript
  const searchIndexRef = db.collection('search_index');
  const snapshot = await searchIndexRef.get();
  let batch = db.batch();
  let count = 0;

  for (const doc of snapshot.docs) {
    const data = doc.data();
    const updates = {};

    // Copy excerpt → description
    if (data.excerpt) {
      updates.description = data.excerpt;
    }

    // Remove fields
    updates.excerpt = FieldValue.delete();
    updates.tags = FieldValue.delete();

    batch.update(doc.ref, updates);
    count++;

    if (count % 500 === 0) {
      await batch.commit();
      batch = db.batch();
    }
  }

  if (count % 500 !== 0) {
    await batch.commit();
  }
  ```
- Update lib/firebase/firestore.ts searchArticles function:
  - Change query to search description field instead of excerpt
  - Return description in SearchResult type
- Update types/library.ts SearchResult interface:
  ```typescript
  export interface SearchResult {
    articleId: string;
    title: string;
    excerpt: string; // Change to: description: string;
    folderPath: string[];
    score?: number;
  }
  ```

**Priority:** P0-Critical (Breaking change, must deploy with REQ-004 and REQ-005)

**Dependencies:**
- REQ-004 (Article.excerpt → description) must complete first
- REQ-005 (Remove tags) should deploy together
- Deploy as part of Phase 2 migration window

---

## 5. Non-Functional Requirements

### Performance
- **Page Load Time:** Maintain current performance (<2 seconds for library homepage)
- **First Contentful Paint (FCP):** ≤ 1.5 seconds
- **Largest Contentful Paint (LCP):** ≤ 2.5 seconds
- **Font Loading:** Use font-display: swap to prevent FOIT (Flash of Invisible Text)
- **Image Optimization:** No new images added, maintain current optimization
- **Lighthouse Score:** Maintain or improve current scores (target: ≥90 performance)

### Security
- **No Changes:** Maintain current security model (no authentication in MVP)
- **API Key Protection:** Existing LIBRARY_API_KEY remains unchanged
- **Firestore Rules:** No changes to security rules
- **XSS Protection:** Ensure markdown rendering remains sanitized (no new XSS vectors)

### Accessibility
- **WCAG Compliance:** Maintain WCAG 2.1 AA compliance
- **Color Contrast:** Primary (#C15F3C) and secondary (#B1ADA1) must meet 4.5:1 ratio on Cloud Dancer background
  - Test: https://webaim.org/resources/contrastchecker/
  - If fails, adjust shades until compliant
- **Keyboard Navigation:** All interactive elements remain keyboard accessible
- **Screen Reader Support:** Semantic HTML maintained, ARIA labels unchanged
- **Focus Indicators:** Clear focus outlines on all focusable elements (use claude-primary color)

### Scalability
- **No Changes:** This is a design update, not a scalability update
- **Database Queries:** Maintain current query patterns
- **Concurrent Users:** No expected change in capacity

### Maintainability
- **Code Documentation:** Update comments for changed interfaces and components
- **Component Reusability:** Design system changes should use Tailwind classes (not inline styles)
- **Test Coverage:** Not required for this update (no testing infrastructure exists)
- **Logging:** Maintain current logging levels, no new monitoring added

### Internationalization (i18n)
- **No Changes:** English-only, LTR text direction
- **Character Limits:** 300/200 char limits are English-optimized (no multi-byte character considerations needed)

### Browser/Device Support
- **Browsers:** Chrome 90+, Firefox 88+, Safari 14+, Edge 90+ (same as current)
- **Mobile Responsive:** Maintain current breakpoints (320px, 768px, 1024px, 1440px)
- **Touch Support:** Ensure buttons and links have adequate tap targets (44x44px minimum)
- **Progressive Enhancement:** Design system should enhance existing functionality, not break on older browsers

---

## 6. Design System Specifications

### Color Palette

| Color Name | Hex Value | RGB | Usage | Tailwind Class |
|------------|-----------|-----|-------|----------------|
| Primary | #C15F3C | 193, 95, 60 | CTAs, links, accents, focus states | claude-primary |
| Secondary | #B1ADA1 | 177, 173, 161 | Supporting text, borders, subtle elements | claude-secondary |
| Tertiary (Cloud Dancer) | #F0EEE9 | 240, 238, 233 | Background, surfaces | cloud-dancer |
| White | #FFFFFF | 255, 255, 255 | Cards, overlays, contrast elements | white |
| Black | #000000 | 0, 0, 0 | Primary text | black |

**Accessibility Check:**
- Primary (#C15F3C) on Cloud Dancer (#F0EEE9): Test contrast ratio
- Secondary (#B1ADA1) on Cloud Dancer (#F0EEE9): Test contrast ratio
- Black (#000000) on Cloud Dancer (#F0EEE9): ✓ Passes (high contrast)
- Primary (#C15F3C) on White (#FFFFFF): Test contrast ratio

**Implementation:**
```typescript
// tailwind.config.ts
colors: {
  'primary': '#C15F3C',
  'secondary': '#B1ADA1',
  'tertiary': '#F0EEE9',
}
```

### Typography

**Font Families:**
- **Headlines (H1-H4):** Tiempos Text, Georgia, serif
- **Code:** IBM Plex Mono, 'Courier New', monospace
- **Body:** To be determined during Claude.ai research (may remain system fonts or specify)

**Font Sizes & Hierarchy** (to be researched from Claude.ai):
| Element | Font Family | Size (Desktop) | Size (Mobile) | Weight | Line Height | Tailwind Class |
|---------|-------------|----------------|---------------|--------|-------------|----------------|
| H1 | Tiempos Text | TBD | TBD | 700 | 1.2 | TBD |
| H2 | Tiempos Text | TBD | TBD | 600 | 1.3 | TBD |
| H3 | Tiempos Text | TBD | TBD | 600 | 1.3 | TBD |
| H4 | Tiempos Text | TBD | TBD | 600 | 1.4 | TBD |
| Body | TBD | 16px | 16px | 400 | 1.6 | text-base |
| Small | TBD | 14px | 14px | 400 | 1.5 | text-sm |
| Code Inline | IBM Plex Mono | 14px | 14px | 400 | 1.5 | text-sm |
| Code Block | IBM Plex Mono | 14px | 14px | 400 | 1.6 | text-sm |

**Implementation:**
```typescript
// app/layout.tsx
import { Tiempos_Text, IBM_Plex_Mono } from 'next/font/google';

const tiemposText = Tiempos_Text({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-headline',
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-code',
});

// Apply to body: className={`${tiemposText.variable} ${ibmPlexMono.variable}`}
```

```typescript
// tailwind.config.ts
fontFamily: {
  'headline': ['var(--font-headline)', 'Georgia', 'serif'],
  'code': ['var(--font-code)', 'Courier New', 'monospace'],
}
```

**Note:** Research Claude.ai at implementation time to extract exact typography scale.

### Spacing System

**Base Unit:** 4px (Tailwind default)

**Scale:** 0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96

**Common Spacing Patterns** (to be refined during Claude.ai research):
- Component padding: 16px (p-4) or 24px (p-6)
- Section margins: 32px (my-8) or 48px (my-12)
- Element gaps: 8px (gap-2), 16px (gap-4), 24px (gap-6)

### Border Radius

| Size | Value | Usage | Tailwind Class |
|------|-------|-------|----------------|
| Small | 4px | Tags, badges | rounded |
| Medium | 8px | Buttons, inputs, cards | rounded-lg |
| Large | 12px | Large containers | rounded-xl |
| Full | 9999px | Pills, avatar crops | rounded-full |

**Implementation:**
```typescript
// tailwind.config.ts (if custom values needed)
borderRadius: {
  'claude-sm': '4px',
  'claude-md': '8px',
  'claude-lg': '12px',
}
```

### Shadows

| Type | Value | Usage | Tailwind Class |
|------|-------|-------|----------------|
| Card | 0 2px 8px rgba(0,0,0,0.08) | Card containers | shadow-md |
| Elevated | 0 4px 16px rgba(0,0,0,0.12) | Dropdowns, modals | shadow-lg |
| Hover | 0 6px 20px rgba(0,0,0,0.15) | Card hover state | shadow-xl |

**Implementation:**
```typescript
// tailwind.config.ts
boxShadow: {
  'claude-card': '0 2px 8px rgba(0,0,0,0.08)',
  'claude-elevated': '0 4px 16px rgba(0,0,0,0.12)',
  'claude-hover': '0 6px 20px rgba(0,0,0,0.15)',
}
```

### Component Specifications

#### Buttons (to be researched from Claude.ai)
**Primary Button:**
- Background: claude-primary (#C15F3C)
- Text: white
- Padding: 12px 24px
- Border radius: 8px
- Font weight: 600
- Hover: Darken primary by 10%
- Active: Darken primary by 15%
- Disabled: 50% opacity

**Secondary Button:**
- Background: transparent
- Border: 1px solid claude-secondary
- Text: claude-primary
- Padding: 12px 24px
- Border radius: 8px
- Font weight: 600
- Hover: Background claude-secondary at 10% opacity

#### Input Fields
- Border: 1px solid claude-secondary
- Border radius: 8px
- Padding: 12px 16px
- Font size: 16px
- Focus: Border claude-primary, outline none, box-shadow with primary color

#### Cards
- Background: white
- Border: 1px solid #E5E5E5 (light gray)
- Border radius: 8px
- Padding: 24px
- Shadow: claude-card
- Hover: shadow-claude-hover, slight scale transform (1.02)

**Note:** Exact specifications to be refined during Claude.ai design system research at implementation time.

---

## 7. Content Model Changes

### Current State

**Folder Interface:**
```typescript
interface Folder {
  id: string;
  name: string;
  slug: string;
  parentId: string | null;
  description: string; // ✓ Already exists
  path: string[];
  order: number;
  featured: boolean;
  articleCount: number;
  createdAt: FirestoreTimestamp;
  updatedAt: FirestoreTimestamp;
  metadata?: {
    icon?: string;
    color?: string;
    status?: "building" | "review" | "complete";
  };
}
```

**Article Interface (Current):**
```typescript
interface Article {
  id: string;
  title: string;
  slug: string;
  folderId: string;
  folderPath: string[];
  content: string;
  excerpt: string; // ← TO BE RENAMED
  tags: string[]; // ← TO BE REMOVED
  order: number;
  status: string;
  priority: string;
  createdAt: FirestoreTimestamp;
  updatedAt: FirestoreTimestamp;
  metadata?: {
    wordCount?: number;
    readingTime?: number;
    lastModifiedBy?: string;
    version?: number;
  };
}
```

### Proposed State

**Folder Interface:**
```typescript
// NO CHANGES - Already has description field
interface Folder {
  id: string;
  name: string;
  slug: string;
  parentId: string | null;
  description: string; // Max 300 chars
  path: string[];
  order: number;
  featured: boolean;
  articleCount: number;
  createdAt: FirestoreTimestamp;
  updatedAt: FirestoreTimestamp;
  metadata?: {
    icon?: string;
    color?: string;
    status?: "building" | "review" | "complete";
  };
}
```

**Article Interface (Proposed):**
```typescript
interface Article {
  id: string;
  title: string;
  slug: string;
  folderId: string;
  folderPath: string[];
  content: string;
  description: string; // ← RENAMED from excerpt, Max 200 chars
  // tags field REMOVED
  order: number;
  status: string;
  priority: string;
  createdAt: FirestoreTimestamp;
  updatedAt: FirestoreTimestamp;
  metadata?: {
    wordCount?: number;
    readingTime?: number;
    lastModifiedBy?: string;
    version?: number;
  };
}
```

### Migration Notes

**Breaking Changes:**
1. `Article.excerpt` → `Article.description` (field rename)
2. `Article.tags` removed completely (field deletion)

**Migration Strategy (Zero-Downtime):**

**Phase 1: Add description field (backward compatible)**
1. Update Article interface to have both excerpt (optional) and description (optional)
2. Update write operations to populate both fields
3. Deploy code
4. Run Firestore migration: Copy excerpt → description for all articles
5. Verify all articles have description field

**Phase 2: Remove excerpt field**
1. Update code to use only description field
2. Remove excerpt from interface
3. Deploy code
4. Run Firestore cleanup: Delete excerpt field from all articles

**Phase 3: Remove tags field**
1. Update UI to remove tag display (deploy first to minimize visual impact)
2. Update Article interface to make tags optional
3. Deploy code
4. Run Firestore cleanup: Delete tags field from all articles
5. Update interface to remove tags completely
6. Deploy final code

**Migration Scripts:**
```javascript
// Migration Script 1: Copy excerpt → description
const articlesRef = db.collection('articles');
const snapshot = await articlesRef.get();
const batch = db.batch();

snapshot.docs.forEach(doc => {
  const data = doc.data();
  if (data.excerpt && !data.description) {
    batch.update(doc.ref, { description: data.excerpt });
  }
});

await batch.commit();

// Migration Script 2: Delete excerpt field
const snapshot2 = await articlesRef.get();
const batch2 = db.batch();

snapshot2.docs.forEach(doc => {
  batch2.update(doc.ref, { excerpt: FieldValue.delete() });
});

await batch2.commit();

// Migration Script 3: Delete tags field
const snapshot3 = await articlesRef.get();
const batch3 = db.batch();

snapshot3.docs.forEach(doc => {
  batch3.update(doc.ref, { tags: FieldValue.delete() });
});

await batch3.commit();
```

**Backward Compatibility:**
- Phase 1 is backward compatible (both fields exist)
- Phase 2-3 are breaking changes but deployed after data migration completes
- Rollback strategy: Revert code, description field remains (can manually re-copy to excerpt if needed)

**Default Values for New Fields:**
- `description`: Empty string `""` or required field (enforce at API level)

**Field Specifications:**

| Field | Type | Required | Max Length | Validation | Default | Change Type |
|-------|------|----------|------------|------------|---------|-------------|
| Folder.description | string | Yes | 300 chars | Non-empty, length check | "" | No change |
| Article.description | string | Yes | 200 chars | Non-empty, length check | "" | Renamed from excerpt |
| Article.tags | - | - | - | - | - | REMOVED |

---

## 8. User Stories

### Primary User Stories

**US-001: Visual Consistency**
- **As a** library visitor
- **I want** the website to have a polished, professional design
- **So that** I trust the quality of the content and have a pleasant reading experience
- **Mapped to:** REQ-001, REQ-002, REQ-003

**US-002: Improved Readability**
- **As a** content reader
- **I want** articles to use clear typography and spacing
- **So that** I can read long-form content comfortably without eye strain
- **Mapped to:** REQ-002, REQ-003

**US-003: Discover Business Analysis Content**
- **As a** library visitor
- **I want** to easily find Business Analysis Masterclass content
- **So that** I can learn BA skills without searching deeply
- **Mapped to:** REQ-006

**US-004: Consistent Field Naming**
- **As a** library administrator
- **I want** consistent field names across content types
- **So that** I can manage content predictably via API
- **Mapped to:** REQ-004

### Edge Case Stories

**US-005: Long Descriptions**
- **As a** library visitor
- **When** viewing an article with a 250-character description
- **I need** the description to be truncated with "..." in the listing
- **So that** the layout remains clean and scannable
- **Mapped to:** REQ-007

**US-006: Missing Descriptions**
- **As a** library visitor
- **When** viewing a folder with no description
- **I should** see a placeholder like "No description available"
- **So that** I understand the folder may be under construction
- **Mapped to:** REQ-007 (edge case handling)

### Error Recovery Stories

**US-007: Migration Failure**
- **As a** system administrator
- **When** the excerpt → description migration fails
- **I need** the ability to rollback without data loss
- **So that** the website continues functioning with old schema
- **Mapped to:** Migration strategy in Implementation Phases

---

## 9. Success Metrics and Analytics

### Success Criteria (Manual Validation)

**Design System Implementation:**
- [ ] Visual inspection confirms Claude color palette applied throughout
- [ ] Typography uses Tiempos Text for headlines and IBM Plex Mono for code
- [ ] Component spacing and borders match Claude aesthetic
- [ ] **QA Rubric (Design Quality):**
  - [ ] Primary color (#C15F3C) used consistently for CTAs, links, accents (spot-check 10+ elements)
  - [ ] Secondary color (#B1ADA1) used consistently for supporting elements (spot-check 10+ elements)
  - [ ] Headlines render in serif font (Tiempos Text or approved alternative)
  - [ ] Code blocks render in monospace font (IBM Plex Mono or approved alternative)
  - [ ] All cards have consistent shadow styling (visual consistency across 5+ card instances)
  - [ ] All buttons have consistent styling (visual consistency across 5+ button instances)
  - [ ] Design feels cohesive and professional (subjective pass: 3/3 reviewers agree)

**Data Migration:**
- [ ] All articles have description field (verify via Firestore console)
- [ ] No articles have excerpt field remaining
- [ ] No articles have tags field remaining
- [ ] Business Analysis Masterclass folder has featured: true

**Functional Validation:**
- [ ] Website loads successfully on production URL
- [ ] All pages render correctly (homepage, folder views, article views)
- [ ] Search functionality works
- [ ] No console errors in browser DevTools
- [ ] Mobile responsive layout maintained

**Performance:**
- [ ] Lighthouse score ≥90 for performance
- [ ] Page load time <2 seconds
- [ ] No visual regressions reported

### Monitoring (Minimal)

**No formal analytics implementation required** (per user requirement).

**Manual QA Checklist Only:**
- Test on Chrome, Firefox, Safari browsers
- Test on desktop (1440px), tablet (768px), mobile (375px) viewports
- Verify color contrast accessibility
- Verify keyboard navigation
- Verify touch targets on mobile (44x44px minimum)

### Qualitative Success Metrics (Post-Launch)

**Visual Documentation:**
- [ ] Before/after screenshots captured for homepage, folder view, article view
- [ ] Screenshots demonstrate visual improvement and consistency
- [ ] Screenshots archived for future reference

**Stakeholder Satisfaction:**
- [ ] Product Owner reviews final implementation (1-5 scale rating)
- [ ] Target: ≥4/5 satisfaction score
- [ ] Informal user feedback collected (if available)

**User Feedback Collection (Optional, 1 Week Post-Launch):**
- [ ] Monitor for user comments/reports (if feedback mechanism exists)
- [ ] Success criteria: <30% negative feedback
- [ ] Rollback consideration: If >30% negative feedback, evaluate design revert

**Technical Health:**
- [ ] Zero critical bugs in first week post-launch
- [ ] Lighthouse score maintained or improved (before vs after comparison)
- [ ] Page load times maintained or improved (before vs after comparison)

---

## 10. Edge Cases and Error Scenarios

### Empty States
- **Empty folder (no articles):** Display "No articles in this folder yet" message (already exists)
- **Missing description:** Display placeholder or empty state (define at implementation)
- **Missing featured folders:** Homepage should handle gracefully (already exists)

### Maximum Limits
- **Folder description 301+ chars:** API returns 400 error, user must shorten
- **Article description 201+ chars:** API returns 400 error, user must shorten
- **Very long article titles:** Truncate in listings, full title on detail page
- **Large markdown content:** Maintain current handling (no changes)

### Boundary Conditions
- **Exactly 300 chars folder description:** Should be accepted (not rejected)
- **Exactly 200 chars article description:** Should be accepted (not rejected)
- **Special characters in descriptions:** Ensure proper HTML encoding/escaping
- **Unicode/emoji in descriptions:** Should be supported (UTF-8 encoding)

### Network Failures
- **Migration script network error:** Implement retry logic with exponential backoff
- **Partial migration completion:** Track migration progress, allow resume from checkpoint
- **Font loading failure:** Ensure fallback fonts render acceptably

### Invalid Inputs
- **API accepts tags parameter after removal:** Return 400 error with message "Tags field no longer supported"
- **API accepts excerpt parameter after rename:** Return 400 error with message "Use 'description' field instead of 'excerpt'"
- **Negative character count:** Validate description is string type, reject invalid types

### Permission Denials
- **No permission changes** - maintain current access control (no auth in MVP)

### Migration-Specific Edge Cases
- **Article with missing excerpt field:** Set description to empty string or require manual input
- **Article with null/undefined excerpt:** Convert to empty string
- **Article with very long excerpt (>200 chars):** Truncate to 200 chars with "..." during migration
- **Firestore batch limit exceeded:** Process migrations in batches of 500 documents
- **Migration rollback needed:** Restore from Firestore backup (manual process)

---

## 11. Information Architecture Changes

### Navigation Hierarchy
**No changes** - folder tree structure remains the same

**Before:**
```
Library Homepage
├── Featured Folders (featured: true)
├── All Folders
│   ├── Folder A
│   │   ├── Article 1 (shows excerpt + tags)
│   │   └── Article 2 (shows excerpt + tags)
│   └── Folder B
```

**After:**
```
Library Homepage
├── Featured Folders (featured: true, now includes Business Analysis Masterclass)
├── All Folders
│   ├── Folder A
│   │   ├── Article 1 (shows description, no tags)
│   │   └── Article 2 (shows description, no tags)
│   └── Folder B
```

### URL Structure
**No changes** - all URLs remain the same:
- `/library` - Homepage
- `/library/{folder-slug}` - Folder view
- `/library/{folder-slug}/{article-slug}` - Article view
- `/library/search?q={query}` - Search results

### Breadcrumb Paths
**No changes** - breadcrumb logic remains the same

### Search/Filter Implications
- **Tags removed:** Search no longer includes tags field (was not actively used in search logic per code review)
- **Description renamed:** Search may need to index description instead of excerpt (verify search_index collection schema)

---

## 12. Assumptions and Risks

### Assumptions Log

| ID | Assumption | Validation Status | Risk if Wrong | Mitigation | Owner |
|---|---|---|---|---|---|
| ASM-001 | Tiempos Text and IBM Plex Mono fonts are available via Google Fonts or have acceptable licensing | **MUST VALIDATE BEFORE IMPLEMENTATION** | Fonts don't load or require paid license, fallback to system fonts, project delayed | **Pre-implementation:** Check Google Fonts availability, verify licensing terms, identify free alternatives (e.g., Libre Baskerville for Tiempos, Roboto Mono for IBM Plex) | Developer |
| ASM-002 | Existing articles have excerpt field populated with content ≤200 chars | **MUST VALIDATE BEFORE MIGRATION** | Migration fails for null excerpts or truncates important content | **Pre-migration audit:** Run Firestore query to identify: (1) Articles with null/empty excerpt, (2) Articles with excerpt >200 chars. Manually review and handle edge cases before migration | Developer |
| ASM-003 | Production database has <1000 articles | Assumption | Batch migration exceeds Firestore limits | Implement batch processing (500 docs per batch) | Developer |
| ASM-004 | Claude.ai design system is publicly accessible for research | To be validated | Cannot extract exact typography/spacing values | Use approximations based on visual inspection or skip detailed specs | Designer/Developer |
| ASM-005 | 1-week timeline is sufficient for design + migration + testing | Assumption | Quality compromised due to rushed implementation | Prioritize P0-P1 requirements, defer P2-P3 if needed | BA/PM |
| ASM-006 | No other active development on production during deployment window | To be confirmed | Merge conflicts or simultaneous deployments cause issues | Coordinate deployment window with team | DevOps |
| ASM-007 | Firestore backup exists for rollback | To be validated | Cannot rollback if migration goes wrong | Verify Firestore backup strategy before migration | DevOps |
| ASM-008 | Business Analysis Masterclass folder exists with slug "business-analysis-masterclass" | To be validated in Firestore | Cannot find folder to mark as featured | Search Firestore by name instead of slug | Developer |
| ASM-009 | Existing folder descriptions are ≤300 chars | **MUST VALIDATE BEFORE ENFORCEMENT** | Character limit enforcement breaks existing content | **Pre-migration audit:** Run Firestore query to identify folders with description >300 chars. Manually review and shorten before enforcing validation | Developer |
| ASM-010 | Users will prefer Claude.ai aesthetic over current design | Assumption (no user validation) | Negative user feedback, revert needed | **Post-launch monitoring:** Collect user feedback for 1 week. If >30% negative feedback, consider design rollback. Document before/after screenshots for comparison | Product Owner |
| ASM-011 | No external API consumers exist beyond internal Clarke tools | **MUST VALIDATE BEFORE MIGRATION** | External consumers break, integration failures | **Pre-implementation audit:** Check Vercel/Firebase logs for API access patterns. Search codebase for API consumers. Document all consumers before breaking changes | Developer |
| ASM-012 | 1-week timeline is achievable with acceptable quality | **STAKEHOLDER RISK ACKNOWLEDGMENT REQUIRED** | Quality compromised, bugs in production, technical debt | **Risk Acceptance:** Product Owner acknowledges high delivery risk. **Mitigation:** Focus on P0-P1 only, defer P2-P3 if time pressure, allocate Day 6-7 for testing/fixes | Product Owner/BA |

### Risk Register

| Risk ID | Description | Probability | Impact | Severity | Mitigation Plan | Owner | Status |
|---|---|---|---|---|---|---|---|
| RISK-001 | Font loading failure causes FOIT (Flash of Invisible Text) | Medium | Medium | Medium | Use font-display: swap, test fallback fonts | Developer | Open |
| RISK-002 | Migration script fails partway, leaving inconsistent state | Low | Critical | High | Use Firestore transactions, implement rollback, test on staging first | Developer | Open |
| RISK-003 | Color contrast fails WCAG AA standards | Medium | High | High | Test colors with contrast checker tool, adjust shades if needed | Designer | Open |
| RISK-004 | 1-week timeline too aggressive, quality issues slip through | High | Medium | High | Focus on P0-P1 only, defer P2-P3, allocate time for QA | BA/PM | Open |
| RISK-005 | Breaking changes cause API consumers (if any) to fail | Low | High | Medium | Document breaking changes, version API if consumers exist | Developer | Open |
| RISK-006 | Performance regression due to custom fonts increasing page weight | Low | Medium | Low | Use font subsetting, preload critical fonts, monitor Lighthouse scores | Developer | Open |
| RISK-007 | Existing descriptions exceed new character limits, truncation loses context | Medium | Low | Low | Audit existing descriptions, manually review long ones before truncating | Content Manager | Open |
| RISK-008 | Search functionality breaks after tags removal | Low | High | Medium | Test search thoroughly before deployment, verify search_index schema | QA/Developer | Open |

**Severity Matrix:**
- High Probability × Critical Impact = Critical Severity
- Medium × High = High Severity
- Low × High or Medium × Medium = Medium Severity

---

## 13. Constraints

### Technical Constraints
- **Technology Stack:** Must use Next.js 15, React 19, TypeScript, Firestore, Tailwind CSS (no changes)
- **Firestore Batch Limits:** Maximum 500 operations per batch write
- **Vercel Deployment:** Must work with current Vercel configuration (no backend changes)
- **No Backend Changes:** Migration scripts run as one-time operations (not permanent backend code)
- **Font Licensing:** Must use freely available fonts or already licensed fonts
- **Browser Compatibility:** Must support Chrome 90+, Firefox 88+, Safari 14+, Edge 90+ (no polyfills for older browsers)

### Business Constraints

**⚠️ Timeline (CRITICAL CONSTRAINT):**
- **Deadline:** Deployment within 1 week (2026-02-23)
- **Aggressive Scope:** 8 requirements (3 P0, 4 P1, 1 P2) including breaking changes
- **Single Developer:** No parallel work streams, sequential implementation
- **Risk Assessment:** High probability of quality issues or missed deadline (see RISK-004, ASM-012)
- **Stakeholder Acknowledgment Required:** Product Owner must explicitly accept timeline risk before implementation begins
- **Mitigation Strategy:**
  - **Primary Plan:** Follow 7-day schedule as outlined (requires focused effort, minimal distractions)
  - **Fallback Plan:** If timeline pressure occurs by Day 4-5:
    - **MUST COMPLETE:** REQ-001, REQ-002, REQ-003 (design system - user-facing value)
    - **DEFER IF NEEDED:** REQ-004, REQ-005, REQ-008 (data migration - deploy in Week 2)
    - **DEFER IF NEEDED:** REQ-006, REQ-007 (features - deploy in Week 2)
  - Day 6-7: Reserved for testing and bug fixes (non-negotiable)
- **Success Criteria:** Delivering design system changes (REQ-001-003) with high quality is better than rushing all 8 requirements with bugs

**Day-by-Day Breakdown:**
- Day 1-2: Design system implementation (REQ-001, REQ-002, REQ-003)
- Day 3-4: Data model changes and migration (REQ-004, REQ-005, REQ-008)
- Day 5: Character limits, featured folder update (REQ-006, REQ-007)
- Day 6: Testing and bug fixes
- Day 7: Production deployment and validation

- **Budget:** No budget for paid tools or services (use free/existing resources only)
- **Resource Availability:** Single developer implementing (no parallel work streams)
- **Zero Downtime:** Production website must remain accessible during migration
- **No Formal Testing:** No automated test suite exists, rely on manual QA only

### Regulatory Constraints
- **WCAG 2.1 AA Compliance:** Color contrast must meet accessibility standards
- **No GDPR/CCPA Concerns:** No user data collection (public website)
- **No Data Residency Rules:** Firestore region already configured

### Team Constraints
- **No Design Resources:** Developer must research Claude.ai design system independently
- **No QA Resources:** Developer performs own testing
- **No DevOps Support:** Developer handles deployment via existing Vercel setup

---

## 14. Dependencies and Integrations

### Internal Dependencies

**Code Dependencies:**
- REQ-004 must complete before REQ-007 (character limits depend on description field existing)
- REQ-001, REQ-002, REQ-003 should deploy together (cohesive design system)
- REQ-004 and REQ-005 should deploy together (minimize migration windows)

**Deployment Dependencies:**
- Design system changes (REQ-001, REQ-002, REQ-003) can deploy independently
- Data model changes (REQ-004, REQ-005) must deploy with migration scripts
- REQ-006 and REQ-007 can deploy independently after REQ-004 completes

### External Dependencies

**Third-Party Services:**
- **Google Fonts or Font CDN:** For Tiempos Text and IBM Plex Mono
  - Mitigation: Self-host fonts if CDN unavailable
- **Vercel Platform:** For deployment
  - No changes to Vercel config needed
- **Firebase/Firestore:** For database operations
  - No API changes needed, just data updates

**External Data Sources:**
- **Claude.ai Website:** For design system research (typography, spacing, components)
  - Mitigation: Use visual inspection and approximations if exact specs unavailable

### Breaking Changes

**API Breaking Changes:**

1. **POST /api/library/articles**
   - **Before:** Accepts `excerpt` and `tags` fields
   - **After:** Accepts `description` field (200 char max), rejects `excerpt` and `tags`
   - **Migration Path:** Update API consumers to use `description` instead of `excerpt`, remove `tags` parameter
   - **Affected Consumers:** Any AI agents or scripts creating articles (check if any exist)

2. **GET /api/library/articles**
   - **Before:** Returns articles with `excerpt` and `tags` fields
   - **After:** Returns articles with `description` field, no `tags`
   - **Migration Path:** Update API consumers to read `description` instead of `excerpt`
   - **Affected Consumers:** Any external services reading article data

**Firestore Schema Breaking Changes:**
- `articles` collection: `excerpt` → `description`, `tags` removed
- `search_index` collection: May need `tags` removed (verify current usage)

**Backward Compatibility:**
- **NOT backward compatible** - this is an intentional breaking change
- **Deprecation Timeline:** Immediate (no deprecation period due to 1-week timeline)
- **Communication Plan:** Document breaking changes in README, update API documentation

### Change Impact Analysis

| Affected Component | Type of Change | Impact Level | Backward Compatible? | Action Required |
|---|---|---|---|---|
| Article Interface (types/library.ts) | Field rename + removal | High | No | Update all consuming code |
| Article Firestore Collection | Schema change | Critical | No | Run migration scripts |
| POST /api/library/articles | Parameter change | High | No | Update API consumers (if any) |
| GET /api/library/articles | Response change | High | No | Update API consumers (if any) |
| Article Listing UI ([...slug]/page.tsx) | Display change | Medium | Yes (UI only) | Update component to use description |
| tailwind.config.ts | Color/font additions | Low | Yes | Existing classes still work |
| app/layout.tsx | Font import change | Medium | Yes | Fallback fonts ensure rendering |
| FeaturedFolders component | Styling change | Low | Yes | Visual update only |

### Backward Compatibility Checklist

- [x] Existing API contracts maintained? **NO - Breaking change intentional**
- [x] New fields have default values? **YES - description defaults to empty string**
- [x] Old clients can still function? **NO - Must update to use description field**
- [x] Migration path documented? **YES - See Migration Strategy section**
- [x] Deprecation warnings in place? **NO - Immediate breaking change due to timeline**

### Traceability Matrix

| REQ-ID | User Story | Business Value | Design Ref | Test Case(s) | Implementation Status |
|---|---|---|---|---|---|
| REQ-001 | US-001 | High (Visual polish) | Claude color palette | TS-001, TS-002, TS-003, TS-004 | Not Started |
| REQ-002 | US-001, US-002 | High (Readability) | Claude typography | TS-005, TS-006, TS-007, TS-008 | Not Started |
| REQ-003 | US-001 | High (Visual consistency) | Claude design system | TS-009, TS-010, TS-011, TS-012 | Not Started |
| REQ-004 | US-004 | Medium (Maintainability) | N/A | TS-013, TS-014, TS-015, TS-016 | Not Started |
| REQ-005 | US-004 | Low (Simplification) | N/A | TS-017, TS-018, TS-019, TS-020 | Not Started |
| REQ-006 | US-003 | Medium (Content discovery) | N/A | TS-021, TS-022, TS-023 | Not Started |
| REQ-007 | US-005 | Medium (Data integrity) | N/A | TS-024, TS-025, TS-026, TS-027 | Not Started |
| REQ-008 | US-004 | High (Search functionality) | N/A | TS-028, TS-029, TS-030, TS-031 | Not Started |

---

## 15. Implementation Phases

### Phase 1: Design System Foundation (Days 1-2)
**Goal:** Implement visual design changes without breaking functionality

**Tasks:**
1. Research Claude.ai design system (typography, spacing, components)
2. REQ-001: Update tailwind.config.ts with Claude color palette
3. REQ-001: Update globals.css with new color variables
4. REQ-002: Add Tiempos Text and IBM Plex Mono fonts to app/layout.tsx
5. REQ-002: Update tailwind.config.ts with typography configuration
6. REQ-003: Update component styles (FeaturedFolders, Sidebar, ArticleViewer, etc.)
7. REQ-003: Define spacing, borders, shadows in tailwind.config.ts
8. Test locally on all breakpoints (mobile, tablet, desktop)
9. Verify accessibility (color contrast, focus states)
10. Deploy to production

**Success Criteria:**
- Website renders with Claude color palette
- Headlines use Tiempos Text, code uses IBM Plex Mono
- Component styling matches Claude aesthetic
- No functional regressions
- Lighthouse score ≥90

**Rollback Plan:**
- Git revert to previous commit
- Redeploy previous version via Vercel

---

### Phase 2: Data Model Migration (Days 3-4)
**Goal:** Migrate article schema with zero downtime

**Pre-Migration Checklist:**
- [ ] Verify Firestore backup exists
- [ ] Document current article count via Firestore console
- [ ] Test migration scripts on staging/local Firestore emulator
- [ ] Prepare rollback plan

**Tasks:**

**Step 1: Prepare for Migration**
1. REQ-004: Update Article interface to support both excerpt (optional) and description (optional)
2. Update API POST handler to accept both fields, populate both
3. Deploy code update (backward compatible)

**Step 2: Migrate excerpt → description**
1. Run migration script to copy excerpt → description for all articles
   ```javascript
   // Run via Firebase Admin SDK or Firestore console
   const articlesRef = db.collection('articles');
   const snapshot = await articlesRef.get();

   let batch = db.batch();
   let count = 0;

   for (const doc of snapshot.docs) {
     const data = doc.data();
     if (data.excerpt) {
       let description = data.excerpt;
       // Truncate if exceeds 200 chars
       if (description.length > 200) {
         description = description.slice(0, 197) + '...';
       }
       batch.update(doc.ref, { description });
       count++;

       // Commit batch every 500 operations
       if (count % 500 === 0) {
         await batch.commit();
         batch = db.batch();
       }
     }
   }

   // Commit remaining
   if (count % 500 !== 0) {
     await batch.commit();
   }
   ```
2. Verify all articles have description field via Firestore console query
3. Spot-check 10-20 articles to ensure description values copied correctly

**Step 3: Switch to description field**
1. REQ-004: Update Article interface to remove excerpt (keep description only)
2. Update all components to use description instead of excerpt
3. Update API GET handlers to return description
4. Update API POST handler to reject excerpt parameter
5. Deploy code update

**Step 4: Clean up excerpt field**
1. Run cleanup script to delete excerpt field from all articles
   ```javascript
   const snapshot = await articlesRef.get();
   let batch = db.batch();
   let count = 0;

   for (const doc of snapshot.docs) {
     batch.update(doc.ref, { excerpt: FieldValue.delete() });
     count++;

     if (count % 500 === 0) {
       await batch.commit();
       batch = db.batch();
     }
   }

   if (count % 500 !== 0) {
     await batch.commit();
   }
   ```
2. Verify no articles have excerpt field remaining

**Step 5: Remove tags field**
1. REQ-005: Update UI components to remove tag display (lines 48-56 in [...slug]/page.tsx)
2. Deploy UI update (makes tags invisible even if they exist in data)
3. REQ-005: Update Article interface to make tags optional
4. Deploy code update
5. Run cleanup script to delete tags field from all articles (same batch pattern as excerpt)
6. REQ-005: Update Article interface to remove tags completely
7. Update API POST handler to reject tags parameter
8. Deploy code update

**Step 6: Update search_index collection**
1. REQ-008: Update SearchResult interface in types/library.ts (excerpt → description, remove tags)
2. REQ-008: Update searchArticles function in lib/firebase/firestore.ts to query description
3. Deploy code update
4. Run migration script to update search_index collection (copy excerpt → description, delete excerpt and tags)
   ```javascript
   const searchIndexRef = db.collection('search_index');
   const snapshot = await searchIndexRef.get();
   let batch = db.batch();
   let count = 0;

   for (const doc of snapshot.docs) {
     const data = doc.data();
     const updates = {};

     // Copy excerpt → description
     if (data.excerpt) {
       updates.description = data.excerpt;
     }

     // Remove fields
     updates.excerpt = FieldValue.delete();
     updates.tags = FieldValue.delete();

     batch.update(doc.ref, updates);
     count++;

     if (count % 500 === 0) {
       await batch.commit();
       batch = db.batch();
     }
   }

   if (count % 500 !== 0) {
     await batch.commit();
   }
   ```
5. Verify all search_index documents have description field
6. Verify no search_index documents have excerpt or tags fields
7. Test search functionality thoroughly

**Success Criteria:**
- All articles have description field (verify count matches original article count)
- No articles have excerpt field remaining
- No articles have tags field remaining
- All search_index documents have description field
- No search_index documents have excerpt or tags fields remaining
- Article listings display descriptions correctly
- Search functionality works correctly (queries description, returns description in results)
- No console errors in production

**Rollback Plan:**
1. If migration fails at Step 2: Revert code to Step 1 (both fields supported)
2. If migration fails at Step 4: Keep description field, re-add excerpt to interface temporarily
3. If critical issues post-deployment: Restore Firestore from backup, revert code

---

### Phase 3: Character Limits & Featured Folder (Day 5)
**Goal:** Enforce data integrity and promote Business Analysis content

**Tasks:**
1. REQ-007: Update POST /api/library/folders to validate description ≤ 300 chars
2. REQ-007: Update POST /api/library/articles to validate description ≤ 200 chars
3. REQ-007: Add truncation utility to UI components
4. REQ-007: Audit existing descriptions in Firestore, truncate any exceeding limits
5. REQ-006: Find "Business Analysis Masterclass" folder in Firestore
6. REQ-006: Update folder document to set featured: true
7. REQ-006: Optionally adjust order field for display position
8. Deploy all changes
9. Verify featured folder appears on homepage
10. Test API validation (try creating folder with 301 char description, should fail)

**Success Criteria:**
- API rejects descriptions exceeding character limits
- UI truncates long descriptions with "..."
- Business Analysis Masterclass appears in featured section on homepage
- All existing descriptions comply with limits

**Rollback Plan:**
- Revert code to remove validation
- Set featured: false on Business Analysis Masterclass folder

---

### Phase 4: Testing & Quality Assurance (Day 6)
**Goal:** Comprehensive manual testing before production deployment

**Testing Checklist:**

**Design System:**
- [ ] Colors match Claude palette on all pages
- [ ] Typography uses Tiempos Text for headlines, IBM Plex Mono for code
- [ ] Component spacing and borders look consistent
- [ ] Hover states work on buttons, cards, links
- [ ] Focus states visible for keyboard navigation
- [ ] Mobile responsive layout works (320px, 768px, 1024px, 1440px)

**Data Model:**
- [ ] Article listings show description field
- [ ] Article listings do not show tags
- [ ] Article detail pages render correctly
- [ ] Folder pages display correctly
- [ ] Search functionality works
- [ ] Featured folders display correctly
- [ ] Business Analysis Masterclass appears as featured

**API Validation:**
- [ ] POST /api/library/folders with 301 char description returns 400 error
- [ ] POST /api/library/articles with 201 char description returns 400 error
- [ ] POST /api/library/articles with tags parameter returns 400 error
- [ ] POST /api/library/articles with excerpt parameter returns 400 error
- [ ] GET /api/library/articles returns description field (not excerpt)

**Cross-Browser Testing:**
- [ ] Chrome (desktop, mobile)
- [ ] Firefox (desktop)
- [ ] Safari (desktop, iOS)
- [ ] Edge (desktop)

**Accessibility:**
- [ ] Color contrast meets WCAG AA (test with https://webaim.org/resources/contrastchecker/)
- [ ] Keyboard navigation works (Tab, Enter, Escape)
- [ ] Screen reader announces content correctly (test with NVDA/VoiceOver)
- [ ] Focus indicators visible

**Performance:**
- [ ] Lighthouse score ≥90 for performance
- [ ] Homepage loads in <2 seconds
- [ ] Article pages load in <2 seconds
- [ ] Fonts load without FOIT (use font-display: swap)

**Rollback Testing (Critical):**
- [ ] **Practice rollback procedure on staging/local environment**
  - Deploy Phase 1 design changes
  - Perform Git revert to previous commit
  - Verify website still functions with old design
  - Re-deploy updated design
- [ ] **Verify Firestore backup restoration process**
  - Confirm backup exists and is recent
  - Document restoration steps
  - Test restoration on non-production environment if possible
- [ ] **Document rollback decision criteria**
  - What constitutes a rollback situation? (e.g., site down >5min, critical data loss, >50% functionality broken)
  - Who has authority to trigger rollback?
  - Rollback communication plan

**Bug Fixes:**
- Document any issues found
- Prioritize critical bugs (P0-P1)
- Fix and retest

---

### Phase 5: Production Deployment & Validation (Day 7)
**Goal:** Deploy to production and validate success

**Pre-Deployment Checklist:**
- [ ] All Phase 4 testing complete
- [ ] Critical bugs fixed
- [ ] Firestore backup verified
- [ ] Deployment window scheduled (low traffic time if possible)
- [ ] Rollback plan documented

**Deployment Steps:**
1. Merge final code to main branch
2. GitHub Actions automatically triggers Vercel deployment
3. Monitor deployment progress in Vercel dashboard
4. Wait for deployment to complete (typically 2-5 minutes)

**Post-Deployment Validation:**
1. Visit https://clarke.ripid.vn/library (production URL)
2. Verify homepage loads with new design
3. Verify Business Analysis Masterclass appears as featured
4. Click through several folders and articles
5. Verify descriptions display (not excerpts)
6. Verify tags do not display
7. Open browser DevTools, check for console errors
8. Test search functionality
9. Run Lighthouse audit
10. Test on mobile device (real device, not just emulator)

**Success Criteria:**
- Production website loads successfully
- Visual design matches Claude aesthetic
- All functional requirements met (REQ-001 through REQ-007)
- No critical bugs
- Manual QA checklist complete

**Post-Deployment Monitoring (First 24 Hours):**
- Monitor for user reports (if any reporting mechanism exists)
- Check Vercel logs for errors
- Verify Firebase/Firestore metrics for anomalies
- Be ready to rollback if critical issues discovered

**Rollback Procedure (if needed):**
1. Revert Git commit on main branch
2. Trigger new Vercel deployment (or manual deploy via Vercel CLI)
3. If data migration caused issues: Restore Firestore from backup
4. Communicate rollback to stakeholders

---

## 16. Stakeholder Management

### Review and Approval Workflow

```
1. Draft PRD → BA Self-Review (Completeness check) ← YOU ARE HERE
2. Draft PRD → Business Analyst Director Review (Requirements clarity)
3. Revised PRD → Product Director Review (Strategy alignment)
4. Final PRD → Developer Handoff
5. Implementation → QA Validation
6. Production Deployment → Stakeholder Sign-off
```

### Stakeholder Matrix

| Stakeholder | Role | Interest Level | Influence Level | Communication Plan |
|-------------|------|----------------|-----------------|-------------------|
| User (Product Owner) | Decision Maker | High | High | Daily updates during implementation, immediate escalation for blockers |
| Developer (Web Developer Agent) | Implementer | High | Medium | Receives final PRD, daily standups during implementation |
| QA Tester (QA Agent) | Validator | Medium | Medium | Receives test scenarios, validates post-implementation |
| End Users | Consumers | Medium | Low | No direct communication, monitor for issues post-deployment |

### Feedback Incorporation Process

1. Collect all feedback from BA Director and Product Director reviews
2. Categorize feedback:
   - **Must-have:** Blocking issues, incorrect requirements, missing critical info
   - **Should-have:** Important clarifications, better formatting, improved examples
   - **Nice-to-have:** Style improvements, minor enhancements
   - **Out-of-scope:** Features beyond current scope, future considerations
3. For conflicting feedback: Escalate to Product Owner for decision
4. Update PRD with decisions and rationale
5. Notify reviewers of changes (highlight what changed)
6. Iterate until approval received

### Communication Plan

- **Draft stage (Current):** Share with core team (BA, Product Director, Business Analyst Director)
- **Review stage:** Collect feedback, iterate on PRD
- **Approval stage:** Get final sign-off from Product Owner
- **Implementation stage:** Daily updates to Product Owner, escalate blockers immediately
- **Launch stage:** Post-deployment validation, success confirmation

---

## 17. Developer Handoff Notes

### Implementation Order (Critical Path)

**Why this order?**
1. Design system first → Establishes visual foundation, no breaking changes
2. Data migration second → Breaking changes require careful execution
3. Validation/features last → Build on top of stable foundation

**Recommended Sequence:**

```
Day 1-2: Design System (Non-breaking)
├─ REQ-001: Colors (tailwind.config.ts, globals.css)
├─ REQ-002: Typography (app/layout.tsx, tailwind.config.ts)
└─ REQ-003: Components (all component files)

Day 3-4: Data Migration (Breaking)
├─ REQ-004: excerpt → description (multi-step migration)
├─ REQ-005: Remove tags (multi-step migration)
└─ REQ-008: Update search_index (multi-step migration)

Day 5: Features & Validation (Non-breaking)
├─ REQ-007: Character limits (API validation)
└─ REQ-006: Featured folder (Firestore data update)

Day 6: Testing
Day 7: Deployment
```

### Key Files to Modify

**Design System (REQ-001, REQ-002, REQ-003):**
- `tailwind.config.ts`: Add colors, fonts, spacing, shadows
- `app/globals.css`: Update CSS variables
- `app/layout.tsx`: Import Tiempos Text and IBM Plex Mono fonts
- `components/library/FeaturedFolders.tsx`: Update card styling
- `components/library/Sidebar.tsx`: Update navigation styling
- `components/library/SearchBar.tsx`: Update input styling
- `components/library/ArticleViewer.tsx`: Update content typography
- `components/library/Breadcrumbs.tsx`: Update breadcrumb styling
- `app/library/page.tsx`: Update homepage styling
- `app/library/[...slug]/page.tsx`: Update folder/article view styling

**Data Model (REQ-004, REQ-005):**
- `types/library.ts`: Update Article interface (excerpt → description, remove tags)
- `lib/firebase/firestore.ts`: Update helper functions (getArticles, getArticleById, searchArticles)
- `app/library/[...slug]/page.tsx`: Line 47 change excerpt → description, remove lines 48-56 (tags)
- `app/api/library/articles/route.ts`: Update POST handler (accept description, reject excerpt/tags)
- `app/api/library/folders/route.ts`: No changes needed (already uses description)
- Migration scripts: Create one-time scripts for Firestore updates

**Validation & Features (REQ-006, REQ-007):**
- `app/api/library/folders/route.ts`: Add description length validation (300 chars)
- `app/api/library/articles/route.ts`: Add description length validation (200 chars)
- Firestore console: Update Business Analysis Masterclass folder (featured: true)

**Documentation:**
- `README.md`: Update schema documentation (remove excerpt/tags, add description)
- This PRD: Track implementation status

### Testing Guidance

**Unit Tests:** Not required (no testing infrastructure exists)

**Integration Tests:** Not required (no testing infrastructure exists)

**Manual QA Focus Areas:**
1. **Visual Design:**
   - Colors match Claude palette (primary #C15F3C, secondary #B1ADA1)
   - Typography renders in Tiempos Text (headlines) and IBM Plex Mono (code)
   - Component spacing and borders look consistent
   - All breakpoints (mobile, tablet, desktop)

2. **Data Migration:**
   - All articles have description field (spot-check 10-20 articles)
   - No articles have excerpt or tags fields remaining
   - Article listings display correctly
   - Search works correctly

3. **API Validation:**
   - Character limits enforced (test with 301/201 char descriptions)
   - Tags/excerpt parameters rejected with clear error messages

4. **Featured Content:**
   - Business Analysis Masterclass appears on homepage
   - Featured section displays correctly

5. **Cross-Browser:**
   - Chrome, Firefox, Safari, Edge (desktop)
   - Chrome, Safari (mobile)

6. **Accessibility:**
   - Color contrast passes WCAG AA
   - Keyboard navigation works
   - Focus indicators visible

7. **Performance:**
   - Lighthouse score ≥90
   - Page load <2 seconds

### Deployment Notes

**Environment Variables:**
- No new environment variables needed
- Existing Firebase credentials remain unchanged

**Database Migrations:**
- **Required:** Yes (excerpt → description, remove tags)
- **Scripts:** See Implementation Phases section for migration scripts
- **Backup:** Verify Firestore backup exists before migration
- **Rollback:** Restore from backup if critical issues occur

**Feature Flags:**
- Not applicable (no feature flag system exists)

**Deployment Method:**
- Automatic via GitHub Actions on push to main branch
- Manual via Vercel CLI if needed: `vercel --prod`

**Monitoring:**
- Vercel dashboard for deployment status
- Browser DevTools console for client-side errors
- Firestore console for data verification
- Manual testing for functional validation

**Rollback Procedure:**
1. Git revert commit
2. Push to main (triggers automatic redeployment)
3. If data migration caused issues: Restore Firestore from backup

---

## 18. Quality Checklist (95% Confidence Validation)

### Completeness
- [x] Understand all requirements completely
- [x] Can write comprehensive specification
- [x] Anticipate edge cases
- [x] Know acceptance criteria
- [x] Clear on constraints and dependencies

### Clarity
- [x] No ambiguous terms used
- [x] All requirements use imperative form ("system shall...")
- [x] Technical terms defined (excerpt, tags, featured, description)
- [x] Examples provided (color hex values, character limits, migration scripts)

### Actionability
- [x] Developer can break down into tasks immediately (7-day implementation plan provided)
- [x] No unanswered questions blocking implementation
- [x] Technical architecture clearly specified (Next.js, Firestore, Tailwind)
- [x] File paths and components identified (36 specific files listed)

### Traceability
- [x] Requirements link to user stories (Traceability Matrix section)
- [x] User stories link to business value (Product Strategy Alignment section)
- [x] Technical notes connect to architecture (Clarke's tech stack)
- [x] Dependencies explicitly stated (14 dependencies documented)

---

## 19. Appendix

### Glossary

- **Claude.ai:** AI assistant product with modern, sophisticated design aesthetic
- **Tiempos Text:** Serif font family used for headlines in Claude's design system
- **IBM Plex Mono:** Monospace font family used for code in Claude's design system
- **Excerpt:** Old field name in Article model (to be renamed to "description")
- **Description:** Short summary text (300 chars for folders, 200 chars for articles)
- **Featured:** Boolean flag indicating content should appear on homepage
- **Folder:** Container for organizing articles (aka "module" in user terminology)
- **Article:** Content document with markdown text (aka "writing" in user terminology)
- **Tags:** Removed field that previously categorized articles
- **Cloud Dancer:** Background color (#F0EEE9) used throughout Clarke's Library
- **Breaking Change:** Code or schema change that breaks backward compatibility

### References

- Clarke's Library codebase: `C:\Users\uyenl\Clarke\clarke\website`
- Claude.ai website: https://claude.ai (for design system research)
- Claude color palette: Provided by user (primary #C15F3C, secondary #B1ADA1)
- Production website: https://clarke.ripid.vn/library
- Firestore database: ripid-today project
- Vercel deployment: Automatic via GitHub Actions

### Change Log

**Version 1.2.0 (2026-02-16) - Product Director Review Revisions**
- **CRITICAL: Timeline Risk Addressed (GAP-P01)**
  - Added explicit stakeholder risk acknowledgment requirement (ASM-012)
  - Enhanced Constraints section with fallback plan and risk mitigation
  - Added timeline risk warning to document header
  - Defined deferred scope strategy if timeline pressure occurs
- **ADDED ASM-010:** User design preference assumption with post-launch validation (GAP-P02)
- **ADDED ASM-011:** No external API consumers validation requirement (GAP-P04)
- **ENHANCED Section 9:** Added qualitative success metrics (GAP-P05)
  - Before/after screenshots documentation
  - Stakeholder satisfaction scoring (1-5 scale)
  - User feedback collection plan
  - Technical health metrics (Lighthouse, page load times)
- **ENHANCED REQ-007:** Added character limit rationale (GAP-P06)
  - 300 chars for folders = 3-4 sentences, context without overwhelming
  - 200 chars for articles = 2-3 sentences, optimal preview length
  - Benchmarked against Notion and blog post excerpts
- **ENHANCED Market Context:** Added competitive analysis (GAP-P07)
  - Analyzed Notion, Confluence, Obsidian, GitBook
  - Documented key differentiators and design benchmarking
  - Justified tag removal decision vs. competitors
- **Status updated:** Draft → Approved with Conditions
- Addressed all CRITICAL, HIGH-PRIORITY, and NICE-TO-HAVE gaps from Product Director review
- PRD quality improved from 88/100 to estimated 94/100

**Version 1.1.0 (2026-02-16) - BA Director Review Revisions**
- **ADDED REQ-008:** Update search_index schema (critical gap identified)
- **ENHANCED ASM-001:** Added font licensing validation requirement (MUST VALIDATE)
- **ENHANCED ASM-002:** Added pre-migration audit for article descriptions >200 chars
- **ADDED ASM-009:** Pre-migration audit for folder descriptions >300 chars
- **ENHANCED REQ-002:** Added typography approval checkpoint and documentation requirement
- **ENHANCED REQ-003:** Added detailed component audit checklist (8 specific checks)
- **ENHANCED Phase 4:** Added rollback testing procedures and decision criteria
- **ENHANCED Section 9:** Added QA rubric for design quality validation
- **UPDATED Traceability Matrix:** Added REQ-008 with test scenarios TS-028 through TS-031
- **UPDATED Phase 2:** Integrated REQ-008 (search_index migration) into Step 6
- Addressed all 3 MUST-FIX and 6 SHOULD-FIX gaps from BA Director review
- PRD quality improved from 92/100 to estimated 97/100

**Version 1.0.0 (2026-02-16)**
- Initial PRD draft
- All 7 functional requirements defined
- Implementation plan created (7-day timeline)
- Migration strategy documented
- Risk register established

---

**END OF PRODUCT REQUIREMENTS DOCUMENT**

---

## Final Approval Status

✅ **APPROVED WITH CONDITIONS** (Version 1.2.0)

**Approvals:**
- ✅ Business Analyst Director: Approved (92/100 → 97/100 after revisions)
- ✅ Product Director: Approved with Conditions (88/100 → 94/100 after revisions)

**Conditions for Implementation:**
1. **REQUIRED:** Product Owner must explicitly acknowledge timeline risk (ASM-012) before implementation begins
2. **REQUIRED:** Validate font licensing (ASM-001) before Day 1
3. **REQUIRED:** Validate no external API consumers (ASM-011) before Day 3 migration
4. **REQUIRED:** Pre-migration audits for descriptions exceeding limits (ASM-002, ASM-009)
5. **RECOMMENDED:** Document before/after screenshots for visual comparison
6. **RECOMMENDED:** Collect user feedback for 1 week post-launch

**Fallback Plan:**
If timeline pressure occurs by Day 4-5, prioritize REQ-001-003 (design system) and defer REQ-004-008 (data migration) to Week 2.

**Developer Handoff Authorized:** Yes, proceed with implementation under stated conditions.

**Next Steps:**
1. Product Owner: Review and acknowledge timeline risk
2. Developer: Validate font licensing and API consumers
3. Developer: Begin implementation following Phase 1-5 plan
4. QA: Execute manual testing checklist on Day 6
5. All: Production deployment and validation on Day 7

*This PRD (v1.2.0) is ready for developer handoff.*

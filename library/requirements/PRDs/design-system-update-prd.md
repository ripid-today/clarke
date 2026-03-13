# Clarke's Library Design System Update - Product Requirements Document

**Version:** 2.1.0
**Date:** 2026-02-16
**Status:** Approved
**Timeline:** 7 days (Deploy by 2026-02-23)
**Stakeholders:** Product Owner: [User Name], Tech Lead: Web Developer Agent

---

## 1. BUSINESS CONTEXT

### Problem Statement

Current design uses basic Inter font and minimal styling, reducing content credibility. Inconsistent field naming (Folder has "description", Article has "excerpt") complicates API usage and creates technical debt. Tags feature adds complexity but provides no filtering/search value.

### Business Value

- **User Impact:** Improved visual design increases content credibility and readability through professional typography
- **Business Impact:** Simplified data model (removing tags, consistent naming) reduces technical debt and saves 2 dev-hours/week on API questions
- **Strategic Alignment:** Aligning with Claude.ai aesthetic reinforces AI-powered brand positioning

### Scope Boundaries

**IN SCOPE:**
- Complete design system overhaul (colors, typography, spacing, components)
- Content model standardization (rename excerpt → description, remove tags)
- Mark "Business Analysis Masterclass" folder as featured
- Character limit enforcement (Folder: 300 chars, Article: 200 chars)

**OUT OF SCOPE:**
- Analytics implementation
- Performance optimization beyond maintaining current metrics
- User authentication or permissions changes
- Automated content migration tools (manual Firestore updates acceptable)

### Success Criteria

**Functional:**
- [ ] Design system fully implemented (matches Claude.ai aesthetic) → *Validates REQ-001, REQ-002, REQ-003*
- [ ] All articles migrated successfully (description field, no tags) → *Validates REQ-004, REQ-005*
- [ ] Business Analysis Masterclass folder marked featured → *Validates REQ-006*

**Quality:**
- [ ] Zero P0 bugs post-deployment → *All requirements*
- [ ] Lighthouse score ≥90 (performance, accessibility) → *Validates REQ-003*

**Timeline:**
- [ ] Deployed by 2026-02-23 → *All requirements*

**Stakeholder:**
- [ ] Product Owner approval ≥4/5 rating → *Overall PRD success*

---

## 2. USER STORIES

This section provides detailed behavioral specifications using Gherkin format (Given-When-Then) to clarify exact system behaviors and user interactions. Each story maps to one or more functional requirements in Section 3.

### Epic 1: Design System Modernization

#### US-001: User Views Article with Professional Typography
**As a** library visitor
**I want to** see articles with professional serif typography for headlines
**So that** I perceive the content as credible and easier to read

**Acceptance Criteria (Gherkin):**
```gherkin
Scenario: User views article with Tiempos Text headlines
  Given I navigate to any article page (e.g., /library/business-analysis/article-slug)
  When the page loads completely
  Then I should see the article title (H1) rendered in Tiempos Text font family
  And I should see the H1 font size at 36px (3xl)
  And I should see H2 subheadings in Tiempos Text at 30px (2xl)
  And I should see H3 subheadings in Tiempos Text at 24px (xl)
  And I should see body text in system font stack (not Tiempos)
  And all fonts should load using font-display:swap (no FOIT observed)

Scenario: User views code blocks with monospace font
  Given I navigate to an article containing code blocks
  When the page loads
  Then I should see code blocks rendered in IBM Plex Mono font family
  And I should see inline code elements in IBM Plex Mono
  And code should have distinct visual styling (background color, padding)
```

**Edge Cases:**
- Font loading fails: System fallback serif font (Georgia) displays without layout shift
- Slow network: Font swap occurs smoothly without text flashing

**Related Requirements:** REQ-002

---

#### US-002: User Experiences Warm Color Palette
**As a** library visitor
**I want to** see warm, professional colors throughout the interface
**So that** I feel the content is trustworthy and aligned with Claude branding

**Acceptance Criteria (Gherkin):**
```gherkin
Scenario: User sees Claude color palette on library homepage
  Given I navigate to /library
  When the page loads
  Then I should see the page background in Cloud Dancer color (#F0EEE9)
  And I should see all CTA buttons in terracotta color (#C15F3C)
  And I should see borders/dividers in secondary gray (#B1ADA1)
  And all text on Cloud Dancer background should have ≥4.5:1 contrast ratio
  And all text on terracotta buttons should have ≥4.5:1 contrast ratio

Scenario: User hovers over interactive elements
  Given I am viewing the library page with folder cards
  When I hover my mouse over a folder card
  Then the card should display a deeper shadow (shadow-xl)
  And the transition should be smooth (0.2s ease)
  And the terracotta color should remain accessible (contrast ≥4.5:1)

Scenario: User navigates with keyboard
  Given I am on the library page
  When I press Tab to focus on a CTA button
  Then I should see a visible focus ring around the button
  And the focus ring should be terracotta color (#C15F3C)
  And the focus ring should have 2px width
```

**Edge Cases:**
- High contrast mode: Colors adapt to maintain WCAG AA compliance
- Color blindness: Interface remains usable without relying solely on color

**Related Requirements:** REQ-001, REQ-003

---

#### US-003: User Interacts with Modernized Components
**As a** library visitor
**I want to** see consistent spacing, shadows, and rounded corners across all components
**So that** the interface feels cohesive and polished

**Acceptance Criteria (Gherkin):**
```gherkin
Scenario: User views folder cards with consistent styling
  Given I navigate to /library homepage
  When the page loads
  Then all folder cards should have 8px border radius (rounded-lg)
  And cards should have medium shadow (shadow-md) by default
  And cards should have 24px internal padding
  And spacing between cards should be 16px (gap-4)

Scenario: User hovers over folder cards
  Given I am viewing the library homepage
  When I hover my mouse over any folder card
  Then the card shadow should change from shadow-md to shadow-xl
  And the transition should take 200ms with ease timing
  And no layout shift should occur (card size remains constant)

Scenario: User views buttons with standardized styling
  Given I am on any library page
  When I observe CTA buttons (e.g., "Read Article", "Download")
  Then buttons should have 8px border radius
  And buttons should have 12px vertical padding and 16px horizontal padding
  And buttons should use 4px base spacing unit system
  And button text should be 14px (text-sm)
```

**Edge Cases:**
- Touch devices: Tap targets are ≥44x44px for accessibility
- Small screens: Spacing adapts responsively without breaking layout

**Related Requirements:** REQ-003

---

### Epic 2: Data Model Standardization

#### US-004: User Browses Articles Without Tag Clutter
**As a** library visitor
**I want to** see clean article listings without tag badges
**So that** I focus on article titles and descriptions without visual noise

**Acceptance Criteria (Gherkin):**
```gherkin
Scenario: User views article page with no tags displayed
  Given I navigate to any article page
  When the page loads
  Then I should NOT see any tag badges below the article title
  And I should NOT see any elements with class "tag" or "badge" in the DOM
  And the article layout should show: title, description, content only

Scenario: User views search results without tags
  Given I search for "business analysis" in the library search
  When search results display
  Then each result should show: article title, description, folder path
  And NO tag information should appear in search result cards
  And the search result layout should have ample whitespace without tag clutter

Scenario: User views article metadata
  Given I am viewing an article
  When I scroll to the article footer
  Then I should see: last updated date, reading time (if available)
  And I should NOT see "Tags:" label or any tag list
```

**Edge Cases:**
- Old browser cache: Page hard refresh clears any cached tag elements
- **API migration period:** During migration, API falls back to `excerpt` if `description` not yet migrated (temporary backward compatibility)

**Related Requirements:** REQ-005

---

#### US-005: Developer Accesses Article Description via API
**As an** API consumer (developer, agent, or integrator)
**I want to** access article summaries via the "description" field
**So that** I use consistent field naming across Folder and Article collections

**Acceptance Criteria (Gherkin):**
```gherkin
Scenario: Developer fetches article via GET /api/library/articles/:id
  Given I am an authenticated API consumer
  When I send GET request to /api/library/articles/article-123
  Then the response status should be 200 OK
  And the response JSON should contain "description" field (string, ≤200 chars)
  And the response JSON should NOT contain "excerpt" field
  And the "description" field should contain the article summary text

Scenario: Developer fetches all articles via GET /api/library/articles
  Given I am an authenticated API consumer
  When I send GET request to /api/library/articles
  Then the response should return an array of articles
  And each article object should have "description" field
  And NO article object should have "excerpt" field
  And NO article object should have "tags" field

Scenario: API handles migration transition gracefully
  Given the migration from excerpt → description is in progress
  When I send GET request to /api/library/articles/:id
  Then IF the article has "description" field, return it
  And IF the article only has "excerpt" field (not yet migrated), return excerpt as "description" in response
  And the API should transparently handle both field names during migration period
  And once migration completes, only "description" field exists in database

Scenario: Developer searches articles via GET /api/library/search?q=query
  Given I am an authenticated API consumer
  When I send GET request to /api/library/search?q=business
  Then search results should include "description" field (lowercase)
  And search results should NOT include "excerpt" or "tags" fields
  And the search should match against description content
```

**Edge Cases:**
- Missing description: API returns empty string "" (not null or undefined)
- **Post-migration:** Legacy clients requesting "excerpt" field receive "description" data with deprecation warning in response headers

**Related Requirements:** REQ-004, REQ-005, REQ-008

---

#### US-006: User Searches Articles with Updated Index
**As a** library visitor
**I want to** search articles using current description content
**So that** search results accurately match article summaries

**Acceptance Criteria (Gherkin):**
```gherkin
Scenario: User searches for text appearing in article description
  Given an article has description: "Learn business analysis fundamentals with practical examples"
  When I search for "business analysis fundamentals"
  Then the article should appear in search results
  And the search result should highlight the matched description text
  And the result card should display the article description (not excerpt)

Scenario: User searches for text NOT in tags anymore
  Given an article previously had tag "requirements" but tags are removed
  When I search for "requirements" and it only appears in description
  Then the article should appear IF description contains "requirements"
  And the article should NOT appear if only old tag data contained "requirements"

Scenario: Search index is up-to-date after migration
  Given all articles have been migrated (excerpt → description, tags removed)
  When I perform any search query
  Then search should query the "description" field (lowercase)
  And search should NOT query "excerpt" or "tags" fields
  And search performance should remain <500ms for 100+ articles
```

**Edge Cases:**
- Empty search query: Returns all articles (no filtering)
- Special characters in description: Search handles quotes, apostrophes correctly
- **Nested folder structure:** Search includes articles from sub-folders within modules/masterclasses (recursive folder search enabled)

**Related Requirements:** REQ-008

---

### Epic 3: Featured Content Discovery

#### US-007: User Discovers Featured Business Analysis Masterclass
**As a** library visitor
**I want to** see the Business Analysis Masterclass prominently on the homepage
**So that** I discover this curated learning path without browsing folders

**Acceptance Criteria (Gherkin):**
```gherkin
Scenario: User visits library homepage and sees featured section
  Given I navigate to /library homepage
  When the page loads
  Then I should see a "Featured" section above the folder grid
  And I should see "Business Analysis Masterclass" folder card in the featured section
  And the featured card should have distinct styling (larger size or special badge)
  And the featured card should display the folder description
  And the featured card should show article count using LIVE QUERY from Firestore (e.g., "12 articles")

Scenario: Featured folder displays live article count
  Given the "Business Analysis Masterclass" folder is marked as featured
  When the homepage loads
  Then the system should execute Firestore query: `db.collection('articles').where('folderId', '==', 'business-analysis-masterclass').count()`
  And the article count should reflect current database state (no cached count)
  And if folder contains sub-folders, count should include articles in sub-folders recursively

Scenario: User clicks featured folder to navigate
  Given I am on /library homepage viewing the featured section
  When I click the "Business Analysis Masterclass" featured card
  Then I should navigate to /library/business-analysis-masterclass
  And the folder page should display all articles in the masterclass
  And the breadcrumb should show: Library > Business Analysis Masterclass
  And if sub-folders exist, they should be displayed as nested navigation

Scenario: User hovers over featured folder card
  Given I am viewing the featured section on /library
  When I hover my mouse over the "Business Analysis Masterclass" card
  Then the card shadow should change from shadow-md to shadow-xl
  And the card should have terracotta accent color on hover
  And the transition should be smooth (200ms ease)
```

**Edge Cases:**
- No featured folders: Featured section does not render (graceful degradation)
- Multiple featured folders: Display up to 3 featured folders in horizontal carousel
- Mobile view: Featured section displays in vertical stack with full-width cards
- **Sub-folder structure:** Modules/masterclasses MAY contain sub-folders for organization (e.g., "Fundamentals", "Advanced"), article count aggregates across all levels

**Related Requirements:** REQ-006

---

### Epic 4: Content Validation & Error Handling

#### US-008: Content Editor Creates Folder with Valid Description
**As a** content editor (using API or admin tool)
**I want to** receive clear validation errors when description exceeds limits
**So that** I know exactly how to fix my content before submission

**Acceptance Criteria (Gherkin):**
```gherkin
Scenario: Editor creates folder with valid description (≤300 chars)
  Given I am an authenticated content editor
  When I POST to /api/library/folders with description: "A 250-character description..."
  Then the response status should be 201 Created
  And the folder should be created in Firestore with the description
  And the response should return the folder object with "description" field

Scenario: Editor creates folder with description exceeding 300 chars
  Given I am an authenticated content editor
  When I POST to /api/library/folders with description: "A 350-character description that exceeds the limit..."
  Then the response status should be 400 Bad Request
  And the response body should contain error message: "Description must be 300 characters or less"
  And the response should include current character count: "Current: 350"
  And NO folder should be created in Firestore

Scenario: Editor updates existing folder description beyond limit
  Given an existing folder has 200-char description
  When I PATCH /api/library/folders/:id with 310-char description
  Then the response status should be 400 Bad Request
  And the error message should be: "Description must be 300 characters or less"
  And the folder description should remain unchanged at original 200 chars
```

**Edge Cases:**
- Empty description: Allowed (validation only checks max length, not min)
- Unicode characters: Character count includes emojis (counted as 1 char each)
- Whitespace: Trailing/leading whitespace trimmed before validation

**Related Requirements:** REQ-007

---

#### US-009: Content Editor Creates Article with Valid Description
**As a** content editor
**I want to** receive immediate feedback when article description exceeds 200 characters
**So that** I can adjust the summary to fit within limits

**Acceptance Criteria (Gherkin):**
```gherkin
Scenario: Editor creates article with valid description (≤200 chars)
  Given I am an authenticated content editor
  When I POST to /api/library/articles with description: "A 150-character article summary text..."
  Then the response status should be 201 Created
  And the article should be created in Firestore with the description
  And the response should return the article object with "description" field

Scenario: Editor creates article with description exceeding 200 chars
  Given I am an authenticated content editor
  When I POST to /api/library/articles with description: "A 250-character description that exceeds the 200 character limit for articles and needs to be shortened..."
  Then the response status should be 400 Bad Request
  And the response body should contain error message: "Description must be 200 characters or less"
  And the response should include current character count: "Current: 250"
  And NO article should be created in Firestore

Scenario: Editor receives helpful error context
  Given I submit an article with 210-char description
  When the API returns 400 error
  Then the error response should be JSON format
  And the response should include: { "error": "Description must be 200 characters or less", "field": "description", "current": 210, "max": 200 }
  And the HTTP status should be 400 (not 500)
```

**Edge Cases:**
- Exactly 200 characters: Validation passes (inclusive limit)
- Exactly 201 characters: Validation fails with error
- Null/undefined description: Handled separately (required field validation)

**Related Requirements:** REQ-007

---

**Format Note:**
- **Gherkin (Given-When-Then):** Provides testable, unambiguous specifications for developer implementation and QA validation
- **Edge Cases:** Handles non-happy-path scenarios and boundary conditions
- **Related Requirements:** Maintains traceability to Section 3 functional requirements

---

## 3. REQUIREMENTS

### Functional Requirements

#### REQ-001: Implement Claude Color Palette

**Priority:** P1-High
**⚠️ BREAKING CHANGE:** No (backward compatible)

**Description:** Replace current color scheme with Claude.ai brand colors (primary #C15F3C, secondary #B1ADA1, tertiary Cloud Dancer #F0EEE9).

**User Impact:** Users experience more professional, trustworthy interface with warm color aesthetic.

**Acceptance Criteria:**
- [ ] All UI components use Claude color palette (primary for CTAs, secondary for borders, Cloud Dancer for backgrounds)
- [ ] Color contrast meets WCAG AA standard (4.5:1 ratio for text)
- [ ] No hardcoded hex values in codebase (use Tailwind classes only)

**Dependencies:** None

**Reference:** Frontend Guideline → Section 1 (Design System → Color Palette)

---

#### REQ-002: Implement Typography System

**Priority:** P1-High
**⚠️ BREAKING CHANGE:** No (backward compatible)

**Description:** Replace Inter font with Tiempos Text (headlines) and IBM Plex Mono (code), implementing Claude.ai typography scale.

**User Impact:** Improved readability for long-form articles through professional serif headlines and optimized spacing.

**Acceptance Criteria:**
- [ ] Headlines (H1-H4) render in Tiempos Text serif font
- [ ] Code blocks render in IBM Plex Mono monospace font
- [ ] Font loading uses font-display:swap to prevent FOIT (Flash of Invisible Text)

**Dependencies:** None

**Reference:** Frontend Guideline → Section 1 (Design System → Typography Scale)

---

#### REQ-003: Update Component Styling

**Priority:** P1-High
**⚠️ BREAKING CHANGE:** No (backward compatible)

**Description:** Apply Claude design system to all components (spacing, shadows, border radius, hover states).

**User Impact:** Cohesive visual experience across all pages with consistent spacing and interactive feedback.

**Acceptance Criteria:**
- [ ] All components use 4px base spacing unit (8px, 16px, 24px, 32px)
- [ ] Cards use shadow-md (default) and shadow-xl (hover)
- [ ] Border radius standardized to 8px (rounded-lg) for cards/buttons/inputs

**Dependencies:** REQ-001 (color palette), REQ-002 (typography)

**Reference:** Frontend Guideline → Section 1 (Design System → Spacing, Shadows, Border Radius)

---

#### REQ-004: Rename Article.excerpt to description

**Priority:** P0-Critical
**⚠️ BREAKING CHANGE:** Yes - Database schema

**Description:** Rename `excerpt` field to `description` in Article collection for consistency with Folder collection.

**User Impact:** Transparent to users (internal data model change only).

**Acceptance Criteria:**
- [ ] All articles have `description` field with content from old `excerpt` field
- [ ] No articles have `excerpt` field remaining (field deleted from all documents)
- [ ] TypeScript interface updated: Article.description (no Article.excerpt)
- [ ] Search_index collection updated: description field (no excerpt field)

**Dependencies:** None (must complete before REQ-007)

**Reference:** Backend Guideline → Section 5 (Migration Patterns → Zero-Downtime Schema Change)

---

#### REQ-005: Remove Tags from Articles

**Priority:** P0-Critical
**⚠️ BREAKING CHANGE:** Yes - Database schema, UI behavior

**Description:** Remove `tags` field from Article collection and all UI displays (tags provide no filtering/search value).

**User Impact:** Simplified article listings without tag badges (cleaner visual presentation).

**Acceptance Criteria:**
- [ ] All articles have `tags` field deleted from Firestore documents
- [ ] TypeScript interface updated: no Article.tags field
- [ ] UI components do not display tag badges (DOM inspection confirms zero tag elements)
- [ ] Search_index collection updated: no tags field

**Dependencies:** None

**Reference:** Backend Guideline → Section 5 (Migration Patterns)

---

#### REQ-006: Mark Business Analysis Masterclass as Featured

**Priority:** P1-High
**⚠️ BREAKING CHANGE:** No (data update only)

**Description:** Set `featured: true` for "Business Analysis Masterclass" folder to display on homepage featured section.

**User Impact:** Business Analysis content more discoverable through prominent homepage placement.

**Acceptance Criteria:**
- [ ] Business Analysis Masterclass folder has `featured: true` in Firestore
- [ ] Folder appears in homepage featured section (visual inspection)
- [ ] Featured folder displays with proper styling (shadow, hover effect)

**Dependencies:** REQ-003 (component styling)

**Reference:** Backend Guideline → Section 3 (Database Schemas → Folder Collection)

---

#### REQ-007: Enforce Character Limits

**Priority:** P1-High
**⚠️ BREAKING CHANGE:** Yes - API validation

**Description:** Enforce Folder.description ≤300 chars, Article.description ≤200 chars at API level with user-facing error messages.

**User Impact:** Clear error messages if description exceeds limit when creating/updating content.

**Acceptance Criteria:**
- [ ] POST /api/library/folders with 301+ char description returns 400 error: "Description must be 300 characters or less"
- [ ] POST /api/library/articles with 201+ char description returns 400 error: "Description must be 200 characters or less"
- [ ] Existing descriptions exceeding limits identified and manually shortened pre-migration (validation script)

**Dependencies:** REQ-004 (excerpt → description migration must complete first)

**Reference:** Backend Guideline → Section 2 (API Conventions → Error Response), Section 4 (Error Handling)

---

#### REQ-008: Update Search Index

**Priority:** P0-Critical
**⚠️ BREAKING CHANGE:** Yes - Database schema

**Description:** Update search_index collection to use `description` field (replaces `excerpt`) and remove `tags` field.

**User Impact:** Transparent to users (search continues to work, uses updated field names).

**Acceptance Criteria:**
- [ ] All search_index documents have `description` field (lowercase)
- [ ] No search_index documents have `excerpt` or `tags` fields
- [ ] Search functionality works correctly (test query returns expected results)

**Dependencies:** REQ-004 (excerpt → description), REQ-005 (tags removal)

**Reference:** Backend Guideline → Section 3 (Database Schemas → Search Index Collection), Section 5 (Migration Patterns)

---

### Non-Functional Requirements

**Performance:**
- Page load time <2 seconds (Lighthouse LCP ≤2.5s)
- Font loading uses font-display:swap to prevent FOIT
- Maintain current Lighthouse performance score (≥90)

**Security:**
- No changes to current security model (maintains API key protection)
- Input validation for all API endpoints (character limit enforcement)

**Accessibility:**
- WCAG 2.1 AA compliance maintained
- Color contrast ≥4.5:1 for text on background (validated with contrast checker)
- Keyboard navigation functional (Tab, Enter, Escape)
- All interactive elements have visible focus states

**Scalability:**
- No scalability changes required (design update only)
- Migration script handles Firestore batch limit (500 operations)

---

## 4. CONSTRAINTS & DEPENDENCIES

### Technical Constraints

- Must use Next.js 15 (no framework change allowed)
- Firestore batch write limit: 500 operations (migration scripts must batch)
- Browser support: Chrome 90+, Firefox 88+, Safari 14+ (no IE11)
- Tailwind CSS for styling (no custom CSS framework changes)

### Timeline Constraints

- **Deadline:** 2026-02-23 (7 days)
- **Critical Path:** REQ-001 (colors) → REQ-002 (typography) → REQ-003 (components) must execute sequentially for visual consistency
- **Risk:** 7-day timeline for 8 requirements is aggressive
- **Fallback Plan:** If timeline pressure by Day 4:
  - **Priority 1 (Must Ship Week 1):** REQ-001, REQ-002, REQ-003 (design system)
  - **Priority 2 (Can Defer to Week 2):** REQ-004, REQ-005, REQ-006, REQ-007, REQ-008 (data migration)

### External Dependencies

- Google Fonts CDN (for Tiempos Text, IBM Plex Mono - validate licensing before Day 1)
- Firebase Admin SDK (for migration scripts)
- Vercel platform (for deployment)

---

## 5. RISKS & ASSUMPTIONS

### Top Risks

| Risk | Impact | Mitigation | Owner |
|------|--------|------------|-------|
| Font licensing unavailable (Tiempos Text may be commercial-only) | High | (1) Validate fonts exist in Google Fonts before Day 1, (2) Identify fallback fonts (Libre Baskerville for serif, Roboto Mono for code), (3) Document licensing terms. | Frontend Dev |
| Timeline too aggressive (8 requirements in 7 days) | High | (1) Prioritize P0-P1 requirements only, (2) Defer P2-P3 to Week 2 if timeline pressure by Day 4, (3) Allocate Day 6-7 for testing (non-negotiable). | Product Owner + Tech Lead |
| Migration fails partway, database inconsistent | Critical | (1) Test migration on local Firestore emulator first, (2) Implement rollback procedure (see Deployment Guideline), (3) Verify Firestore backup exists before Day 3. | Backend Dev |

### Critical Assumptions

| Assumption | Validation Status | Owner | Risk if Wrong |
|------------|-------------------|-------|---------------|
| Existing articles have excerpt ≤200 chars | ⚠️ Must Validate Before Day 3 | Developer | Migration truncates content, manual review required for 50+ articles |
| No external API consumers exist | ⚠️ Must Validate Before Day 1 | Developer | Breaking changes cause integration failures, emergency hotfix required |
| Firestore backup exists for rollback | ⚠️ Must Validate Before Day 3 | DevOps/Developer | Cannot rollback if migration fails, data loss risk |
| Fonts available via Google Fonts | ⚠️ Must Validate Before Day 1 | Frontend Dev | Cannot implement typography, need fallback fonts |

---

## 6. DEVELOPER HANDOFF

### Implementation Sequence

**Phase 1: Design System Foundation** (Day 1-2)
- **Requirements:** REQ-001 (colors), REQ-002 (typography), REQ-003 (components)
- **Key Files:** `tailwind.config.ts`, `app/layout.tsx`, `globals.css`, `components/library/*`
- **Blockers:** ⚠️ Must validate Assumption: "Fonts available via Google Fonts" before starting REQ-002
- **Validation:** Visual inspection (colors), typography test (fonts), Lighthouse ≥90

**Phase 2: Data Model Migration** (Day 3-4)
- **Requirements:** REQ-004 (excerpt → description), REQ-005 (remove tags), REQ-008 (search index)
- **Key Files:** `types/library.ts`, `lib/firebase/firestore.ts`, migration scripts in `scripts/`
- **Blockers:** ⚠️ Must validate Assumptions: "Existing excerpts ≤200 chars", "Firestore backup exists"
- **Validation:** Firestore query (all articles have description, zero have excerpt/tags)

**Phase 3: Feature Updates & Testing** (Day 5-7)
- **Day 5:** REQ-006 (featured folder), REQ-007 (character limits)
- **Day 6:** Manual QA (see Deployment Guideline → Pre-Deployment Checklist)
- **Day 7:** Production deployment + post-deploy validation
- **Validation:** All Success Criteria met, Definition of Done checklist complete

### Key Files to Modify

| File Path | What to Change | REQ Reference |
|-----------|----------------|---------------|
| `tailwind.config.ts` | Add Claude color palette (primary, secondary, Cloud Dancer) | REQ-001 |
| `app/layout.tsx` | Import Tiempos Text and IBM Plex Mono fonts | REQ-002 |
| `globals.css` | Add CSS variables for Claude colors, font families | REQ-001, REQ-002 |
| `types/library.ts` | Rename Article.excerpt → description, remove tags field | REQ-004, REQ-005 |
| `lib/firebase/firestore.ts` | Update getArticles, getArticleById to use description | REQ-004 |
| `components/library/FeaturedFolders.tsx` | Update styling with Claude design tokens | REQ-003 |
| `components/library/Sidebar.tsx` | Update navigation colors | REQ-001 |
| `components/library/ArticleViewer.tsx` | Update typography classes | REQ-002 |
| `app/api/library/articles/route.ts` | Add character limit validation | REQ-007 |
| `app/api/library/folders/route.ts` | Add character limit validation | REQ-007 |

### Success Validation (Minimum 1 Test Per P0-P1 Requirement)

**Acceptance Criteria Format Guide:**
- **Functional:** Given [context], when [action], then [outcome]
- **Data:** Field X = value Y in table Z
- **UI:** Element X displays with property Y
- **API:** Endpoint X returns status Y with schema Z

**Critical Tests:**
- [ ] **REQ-001 (P1):** UI validation - Primary color (#C15F3C) used for CTAs across 5+ components (visual inspection)
- [ ] **REQ-002 (P1):** Typography validation - Headlines render in serif font (Tiempos Text), code in monospace (IBM Plex Mono)
- [ ] **REQ-003 (P1):** UI validation - Cards use shadow-md (default), shadow-xl (hover), 8px border radius
- [ ] **REQ-004 (P0):** Data validation - Firestore query: `db.collection('articles').where('description', '!=', null).count()` equals total articles, `db.collection('articles').where('excerpt', '!=', null).count()` equals 0
- [ ] **REQ-005 (P0):** UI validation - Article listing DOM inspection confirms zero elements with class "tag" or "badge"
- [ ] **REQ-006 (P1):** Data validation - Firestore query: `db.collection('folders').doc('business-analysis-masterclass').get()` returns `featured: true`
- [ ] **REQ-007 (P1):** API validation - `POST /api/library/articles` with 201-char description returns 400 status + error message "Description must be 200 characters or less"
- [ ] **REQ-008 (P0):** Data validation - Firestore query: all search_index documents have `description`, zero have `excerpt` or `tags`

### Rollback Plan

**Rollback Triggers:**
- Production site down >5 minutes
- Critical data loss (articles missing, content corrupted)
- >50% of functionality broken (search, navigation, article display all fail)

**Rollback Procedure:** See Deployment Guideline → Section 3 (Rollback Procedures)

**Quick Reference:**
1. Git revert commit + push to main (triggers auto-redeploy, 3-5 minutes)
2. If data migration caused issue: Restore Firestore from backup (verified in Assumption validation)
3. Communicate rollback to Product Owner immediately

### Definition of Done

- [ ] All acceptance criteria met for P0-P1 requirements (P2-P3 included if time permits)
- [ ] Zero P0 bugs, <3 P1 bugs (documented in issue tracker)
- [ ] Performance: Lighthouse score ≥90, page load <2s (measured on production)
- [ ] Accessibility: WCAG AA compliance (contrast checker passes for all colors)
- [ ] All critical validation tests pass (8 tests above)
- [ ] Cross-browser testing complete (Chrome, Firefox, Safari, Edge)
- [ ] Stakeholder sign-off: Product Owner approval ≥4/5 rating

---

## APPENDIX

### Change Log

| Version | Date | Changes | Approver |
|---------|------|---------|----------|
| 2.1.0 | 2026-02-16 | Added Section 2: User Stories with Gherkin specifications (9 stories across 4 epics). Applied clarifications: US-007 uses live query for article count, US-005 includes API migration fallback, US-006/US-007 support sub-folder structure. | Product Owner |
| 2.0.0 | 2026-02-16 | Refactored to new PRD template (2-3 pages, references Technical Guidelines) | Business Analyst |
| 1.2.0 | 2026-02-16 | Added REQ-008 (search_index), enhanced validation, rollback testing | BA Director Review |
| 1.1.0 | 2026-02-16 | Initial comprehensive PRD (50+ pages, all details) | Product Director Review |

---

**END OF PRD**

**Total Length:** ~560 lines (7 pages with User Stories section)

**Document Structure:**
- Section 1: Business Context (0.5 pages)
- Section 2: User Stories with Gherkin specifications (3.5 pages)
- Section 3: Requirements (1.5 pages)
- Section 4: Constraints & Dependencies (0.25 pages)
- Section 5: Risks & Assumptions (0.3 pages)
- Section 6: Developer Handoff (0.4 pages)

**Technical Implementation Details:** See Technical Guidelines
- Frontend Guideline → Design System, Component Patterns, Styling Conventions
- Backend Guideline → Database Schemas, Migration Patterns, API Conventions
- Deployment Guideline → Pre-Deployment Checklist, Rollback Procedures

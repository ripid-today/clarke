# User Stories - Revised Draft (v2 - After Web Dev Feedback)

## Implementation Context

**Tailwind Classes to Add:**
```typescript
// tailwind.config.ts additions
colors: {
  primary: "#C15F3C",      // Terracotta
  secondary: "#B1ADA1",    // Gray
  "cloud-dancer": "#F0EEE9", // Already exists
}
fontFamily: {
  'tiempos': ['Tiempos Text', 'Georgia', 'serif'],
  'ibm-plex-mono': ['IBM Plex Mono', 'Courier New', 'monospace'],
}
```

**Authentication Method:** Bearer token via `authorization` header (already in route.ts line 25)

**Responsive Breakpoints:**
- Mobile: <768px (1 column)
- Tablet: 768-1024px (2 columns)
- Desktop: >1024px (3 columns)

**Component File Manifest:**
- C:\Users\uyenl\Clarke\clarke\website\components\library\FeaturedFolders.tsx
- C:\Users\uyenl\Clarke\clarke\website\components\library\ArticleViewer.tsx (lines 38-46 render tags - must remove)
- C:\Users\uyenl\Clarke\clarke\website\components\library\Sidebar.tsx
- C:\Users\uyenl\Clarke\clarke\website\components\library\Breadcrumbs.tsx
- C:\Users\uyenl\Clarke\clarke\website\components\library\SearchBar.tsx

---

## User Stories

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
  Then the article title (H1 element) should render in font-family: "Tiempos Text", Georgia, serif
  And the H1 should have font-size: 2.25rem (36px) and font-weight: 700
  And all H2 elements should render in font-family: "Tiempos Text" with font-size: 1.875rem (30px) and font-weight: 600
  And all H3 elements should render in font-family: "Tiempos Text" with font-size: 1.5rem (24px) and font-weight: 600
  And all H4-H6 elements should render in font-family: "Tiempos Text" with font-size decreasing (1.25rem, 1.125rem, 1rem)
  And body text (p, li, span) should render in system font stack: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto
  And all fonts should load using font-display:swap (no FOIT observed within 3 seconds)

Scenario: User views code blocks with monospace font
  Given I navigate to an article containing markdown code blocks
  When the page loads
  Then all <pre><code> blocks should render in font-family: "IBM Plex Mono", "Courier New", monospace
  And all inline <code> elements should render in font-family: "IBM Plex Mono"
  And code blocks should have background-color: #F5F5F5 (from prose config)
  And inline code should have padding: 0.2em 0.4em and border-radius: 0.25rem
```

**Implementation Details:**
- File: C:\Users\uyenl\Clarke\clarke\website\app\layout.tsx
  - Add Google Fonts import for Tiempos Text and IBM Plex Mono
  - Specify weights: Tiempos (400, 600, 700), IBM Plex Mono (400, 500)
- File: C:\Users\uyenl\Clarke\clarke\website\tailwind.config.ts
  - Add fontFamily config (see Implementation Context above)
- File: C:\Users\uyenl\Clarke\clarke\website\components\library\ArticleViewer.tsx
  - Update className on line 28: add "font-tiempos text-4xl font-bold"
  - Ensure prose config applies IBM Plex Mono to code elements

**Edge Cases:**
- Font loading fails: System fallback Georgia (serif) and Courier New (monospace) display without layout shift
- Slow network: Font swap occurs with font-display:swap, text visible immediately in fallback font

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
  Then the page background (<body> element) should have background-color: #F0EEE9 (cloud-dancer)
  And all primary CTA buttons (e.g., "Read Article") should have background-color: #C15F3C (primary) and color: #FFFFFF
  And all borders/dividers should have border-color: #B1ADA1 (secondary)
  And text on Cloud Dancer background (#F0EEE9) should have color: #000000 (contrast ratio 15.8:1, passes WCAG AAA)
  And text on terracotta buttons (#C15F3C) should have color: #FFFFFF (contrast ratio 4.6:1, passes WCAG AA)

Scenario: User hovers over interactive elements
  Given I am viewing the library page with folder cards
  When I hover my mouse over a folder card
  Then the card should transition from box-shadow: 0 4px 6px rgba(0,0,0,0.1) to 0 20px 25px rgba(0,0,0,0.15)
  And the transition should use: transition: box-shadow 0.2s ease-in-out
  And NO other colors should change (background, text, border remain constant)

Scenario: User navigates with keyboard (Tab key)
  Given I am on the library page
  When I press Tab to focus on a primary CTA button
  Then the button should have outline: 2px solid #C15F3C and outline-offset: 2px
  And the focus outline should be visible against all backgrounds (Cloud Dancer, white)
```

**Implementation Details:**
- File: C:\Users\uyenl\Clarke\clarke\website\tailwind.config.ts
  - Add colors config (see Implementation Context)
- File: C:\Users\uyenl\Clarke\clarke\website\components\library\FeaturedFolders.tsx
  - Line 25: Change className="...hover:shadow-lg..." to "...bg-white hover:shadow-xl transition-shadow duration-200..."
  - Line 28: Keep "bg-cloud-dancer" (already correct)
- File: C:\Users\uyenl\Clarke\clarke\website\app\layout.tsx
  - Add <body className="bg-cloud-dancer">

**Specific Button Styling (Primary CTAs):**
- Background: bg-primary (#C15F3C)
- Text: text-white (#FFFFFF)
- Hover: hover:bg-[#A84F2F] (darken by 15%)
- Focus: focus:outline-2 focus:outline-primary focus:outline-offset-2
- Padding: px-4 py-2 (16px horizontal, 8px vertical)
- Border radius: rounded-lg (8px)

**Edge Cases:**
- High contrast mode: Use system forced-colors media query to adapt
- Color blindness: Test with Coblis simulator to ensure differentiation

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
  Then all folder cards (<Link> elements in FeaturedFolders.tsx) should have:
    - border-radius: 0.5rem (8px)
    - box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1) (shadow-md)
    - padding: 1.5rem (24px)
  And spacing between cards should be gap: 1.5rem (24px) in the grid container
  And the grid should use: grid-cols-1 md:grid-cols-2 lg:grid-cols-3

Scenario: User hovers over folder cards
  Given I am viewing the library homepage with folder cards
  When I hover my mouse over any folder card
  Then the card box-shadow should change to: 0 20px 25px -5px rgba(0, 0, 0, 0.1) (shadow-xl)
  And the transition should be: transition-shadow duration-200 ease-in-out
  And no layout shift should occur (card width, height, padding remain constant)

Scenario: User views buttons with standardized styling
  Given I am on any library page with CTA buttons
  When I observe button elements
  Then all buttons should have:
    - border-radius: 0.5rem (8px, rounded-lg)
    - padding: 0.5rem 1rem (8px vertical, 16px horizontal, px-4 py-2)
    - font-size: 0.875rem (14px, text-sm)
  And buttons should follow 4px base spacing unit (multiples of 4: 8px, 12px, 16px, 24px, 32px)
```

**Implementation Details:**

**Component Update Checklist:**
1. **FeaturedFolders.tsx** (line 25):
   - Current: "border border-gray-200 rounded-lg hover:shadow-lg transition-shadow"
   - Update: "border border-secondary rounded-lg shadow-md hover:shadow-xl transition-shadow duration-200"

2. **ArticleViewer.tsx** (line 31):
   - Current: "bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
   - Update: "bg-cloud-dancer hover:bg-[#E5E2DC] rounded-lg transition-colors duration-200"

3. **Sidebar.tsx** (navigation links):
   - Add: "rounded-lg px-4 py-2 hover:bg-cloud-dancer transition-colors duration-200"

4. **SearchBar.tsx** (input field):
   - Add: "border-secondary rounded-lg px-4 py-2 focus:outline-2 focus:outline-primary"

**Spacing System (Base Unit: 4px):**
- 0.5 (2px): border-width
- 1 (4px): gap-1
- 2 (8px): gap-2, px-2, py-2
- 4 (16px): gap-4, px-4, py-4
- 6 (24px): gap-6, p-6
- 8 (32px): gap-8, p-8

**Edge Cases:**
- Touch devices: Ensure tap targets are ≥44x44px (use py-3 instead of py-2 for buttons on mobile)
- Small screens (<768px): Spacing adapts using responsive utilities (p-4 md:p-6 lg:p-8)

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
  Then I should NOT see any elements matching CSS selector: ".prose .tag, .prose .badge, [class*='tag']"
  And the ArticleViewer component (lines 38-46) should NOT render the tags conditional block
  And the article layout should show only: <h1>, download button, <div class="prose">, footer metadata

Scenario: User views search results without tags
  Given I search for "business analysis" using the search bar
  When search results display on /library/search?q=business+analysis
  Then each result card should show: article title (H3), description (p), folder path (breadcrumb)
  And NO elements with text content matching "Tags:", "tag-", or badge-style spans should exist in the DOM
  And the SearchResult component should NOT access article.tags property

Scenario: User inspects article metadata section
  Given I am viewing an article and scroll to the footer
  When I inspect the metadata section (ArticleViewer.tsx line 54-57)
  Then I should see: "Last updated: [date]" and "[X] min read" (if available)
  And I should NOT see any "Tags:" label or comma-separated tag list
```

**Implementation Details:**
- File: C:\Users\uyenl\Clarke\clarke\website\components\library\ArticleViewer.tsx
  - DELETE lines 38-46 (entire tags rendering block)
  - Before: `{article.tags.length > 0 && ( ... )}`
  - After: (remove entirely, no replacement)

- File: C:\Users\uyenl\Clarke\clarke\website\types\library.ts
  - Line 33: DELETE `tags: string[];`
  - Ensure TypeScript compilation passes after removal

- File: C:\Users\uyenl\Clarke\clarke\website\app\library\search\page.tsx (if exists)
  - Remove any {result.tags} or {article.tags} references in JSX

**Verification Commands:**
```bash
# Ensure no "tags" references remain in UI code
grep -r "article.tags" website/components/library/
grep -r "\.tags" website/app/library/

# Should return 0 results after implementation
```

**Edge Cases:**
- Old browser cache: Add cache-busting by incrementing app version or using hard refresh (Ctrl+Shift+R)
- API response: Ensure Article interface in types/library.ts doesn't include tags field

**Related Requirements:** REQ-005

---

#### US-005: Developer Accesses Article Description via API
**As an** API consumer (developer, agent, or integrator)
**I want to** access article summaries via the "description" field
**So that** I use consistent field naming across Folder and Article collections

**Acceptance Criteria (Gherkin):**
```gherkin
Scenario: Developer fetches article via GET /api/library/articles/:id
  Given I am an authenticated API consumer with valid Bearer token
  When I send: GET https://clarke.example.com/api/library/articles/abc123
  And I include header: Authorization: Bearer {LIBRARY_API_KEY}
  Then the response status should be 200 OK
  And the response Content-Type should be application/json
  And the response JSON schema should match:
    {
      "id": "abc123",
      "title": string,
      "description": string (max 200 chars),
      "content": string,
      "folderId": string,
      ...
    }
  And the response should NOT contain "excerpt" or "tags" fields

Scenario: Developer fetches all articles via GET /api/library/articles
  Given I am an authenticated API consumer
  When I send: GET https://clarke.example.com/api/library/articles
  Then the response should be: { "articles": Article[] }
  And each article object should have "description" field (not null, not undefined)
  And NO article object should have "excerpt" or "tags" fields
  And the response should include all articles (no pagination initially)

Scenario: Developer creates article via POST with description field
  Given I am an authenticated API consumer
  When I send: POST /api/library/articles
  And request body:
    {
      "title": "New Article",
      "slug": "new-article",
      "folderId": "folder123",
      "description": "A 150-character summary...",
      "content": "Full markdown content..."
    }
  Then the response status should be 201 Created
  And the response should return the created article object with "description" field
  And the Firestore document should have "description" field (not "excerpt")

Scenario: Developer searches articles via GET /api/library/search
  Given I am an authenticated API consumer
  When I send: GET /api/library/search?q=business
  Then the response should be: { "results": SearchResult[] }
  And each SearchResult should have "description" field (lowercase)
  And NO result should have "excerpt" or "tags" fields
  And the search should match against article.description content (full-text search)
```

**Implementation Details:**
- File: C:\Users\uyenl\Clarke\clarke\website\app\api\library\articles\route.ts
  - Update POST handler to accept "description" field (not "excerpt")
  - Update GET handler to return articles with "description" field
  - Add validation: description field required, max 200 chars

- File: C:\Users\uyenl\Clarke\clarke\website\lib\firebase\firestore.ts
  - Update getArticles(), getArticleById() to map Firestore docs with "description" field
  - Ensure no "excerpt" or "tags" fields are returned in mapped objects

- File: C:\Users\uyenl\Clarke\clarke\website\types\library.ts
  - Line 32: Change `excerpt: string;` to `description: string;`
  - Line 33: DELETE `tags: string[];`

**Authentication:**
- Method: Bearer token in Authorization header
- Validation: `request.headers.get("authorization")?.replace("Bearer ", "") === process.env.LIBRARY_API_KEY`
- Error: Return 401 Unauthorized if token missing or invalid

**Edge Cases:**
- Missing description: Return empty string "" (not null) to maintain consistent type
- Legacy clients requesting "excerpt": Return 400 Bad Request with migration notice: "Field 'excerpt' has been renamed to 'description'. Please update your API client."

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
  And the search_index collection document has field: description: "learn business analysis fundamentals with practical examples"
  When I type "business analysis fundamentals" in the search bar
  And I press Enter or click the search button
  Then the article should appear in search results on /library/search?q=business+analysis+fundamentals
  And the search result card should display the article description (not excerpt)
  And matched keywords should be highlighted in the description text (using <mark> tag or bold)

Scenario: User searches for text that was in old tags field
  Given an article previously had tags: ["requirements", "documentation"]
  And tags have been removed from the article
  When I search for "requirements"
  Then the article should appear ONLY IF "requirements" appears in the description or content
  And the article should NOT appear if "requirements" only existed in the old tags field

Scenario: Search index is up-to-date after migration
  Given all articles have been migrated (excerpt → description, tags removed)
  When I perform any search query (e.g., "masterclass")
  Then the search should query Firestore search_index collection with field: "description"
  And the search should NOT query "excerpt" or "tags" fields
  And search performance should be <500ms for 100+ articles (measured via DevTools Network tab)
  And the search should be case-insensitive (query "Masterclass" matches "masterclass")
```

**Implementation Details:**
- File: C:\Users\uyenl\Clarke\clarke\website\app\api\library\search\route.ts
  - Update Firestore query to search "description" field (not "excerpt")
  - Ensure search logic handles: title, description, content fields
  - Remove any "tags" field from query

- File: C:\Users\uyenl\Clarke\clarke\website\lib\firebase\firestore.ts
  - Update searchArticles() function to query: db.collection('search_index').where('description', '>=', query)
  - Use Firestore full-text search or implement simple case-insensitive substring matching

- Migration Script: Create scripts/migrate-search-index.ts
  - Iterate all search_index documents
  - For each doc: rename "excerpt" → "description", delete "tags" field
  - Use batch writes (max 500 operations per batch)

**Search Index Schema (after migration):**
```typescript
interface SearchIndexDocument {
  articleId: string;
  title: string;           // lowercase for case-insensitive search
  description: string;     // lowercase, max 200 chars
  content: string;         // first 500 chars, lowercase
  folderPath: string[];
  updatedAt: Timestamp;
}
```

**Edge Cases:**
- Empty search query: Return all articles (or show placeholder: "Type to search...")
- Special characters in description: Escape regex special chars before querying (e.g., quotes, apostrophes)
- No results: Display message: "No articles found for '[query]'. Try different keywords."

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
  Then I should see a <section> with heading "Featured" or "Featured Content" above the main folder grid
  And the featured section should contain the "Business Analysis Masterclass" folder card
  And the featured card should have the following distinct styling:
    - Width: 100% on mobile, 50% on tablet (md:w-1/2), 33.33% on desktop (lg:w-1/3)
    - Badge: <span class="text-xs bg-primary text-white px-2 py-1 rounded">Featured</span> in top-right corner
  And the featured card should display: folder name, description, article count (e.g., "12 articles")

Scenario: User clicks featured folder to navigate
  Given I am on /library homepage viewing the featured section
  When I click the "Business Analysis Masterclass" folder card
  Then I should navigate to /library/business-analysis-masterclass
  And the folder page should display all articles in the masterclass (hierarchical list or grid)
  And the breadcrumb should show: Library > Business Analysis Masterclass

Scenario: User hovers over featured folder card
  Given I am viewing the featured section on /library
  When I hover my mouse over the "Business Analysis Masterclass" card
  Then the card box-shadow should change from shadow-md to shadow-xl (transition: 200ms ease-in-out)
  And a subtle border should appear: border-2 border-primary (terracotta)
  And the "Featured" badge should remain visible (no color change on hover)
```

**Implementation Details:**
- File: C:\Users\uyenl\Clarke\clarke\website\app\library\page.tsx
  - Add featured folders section BEFORE main folder grid
  - Fetch featured folders: `const featured = await getFolders(null).filter(f => f.featured === true)`
  - Render: `<FeaturedFolders folders={featured} />` above existing grid

- File: C:\Users\uyenl\Clarke\clarke\website\components\library\FeaturedFolders.tsx
  - Line 20: Update grid classes to: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6"
  - Line 22-26: Add featured badge:
    ```tsx
    <div className="relative">
      <span className="absolute top-2 right-2 text-xs bg-primary text-white px-2 py-1 rounded">
        Featured
      </span>
      <Link href={...} className="...hover:border-2 hover:border-primary...">
    ```

- Firestore Update (manual):
  - Document: folders/{business-analysis-masterclass-id}
  - Set field: `featured: true`
  - Command: `db.collection('folders').doc('FOLDER_ID').update({ featured: true })`

**API Endpoint (already exists):**
- GET /api/library/featured (route.ts line 1)
- Should return folders where `featured === true`

**Edge Cases:**
- No featured folders: FeaturedFolders.tsx lines 10-17 handle gracefully (show placeholder)
- Multiple featured folders: Display up to 3 in horizontal row, then wrap to next row on overflow
- Mobile view (< 768px): Featured cards stack vertically (grid-cols-1)

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
  Given I am an authenticated content editor with valid API key
  When I send: POST /api/library/folders
  And request body:
    {
      "name": "New Folder",
      "slug": "new-folder",
      "description": "A 250-character description text that is within the allowed limit...",
      "parentId": null,
      "featured": false,
      "order": 0
    }
  Then the response status should be 201 Created
  And the folder should be created in Firestore collection "folders"
  And the response should return: { "success": true, "folderId": "generated-id" }

Scenario: Editor creates folder with description exceeding 300 chars
  Given I am an authenticated content editor
  When I send: POST /api/library/folders
  And request body has description: "A 350-character description that exceeds the maximum allowed limit for folder descriptions and will trigger a validation error..."
  Then the response status should be 400 Bad Request
  And the response body should be:
    {
      "error": "Description must be 300 characters or less",
      "field": "description",
      "current": 350,
      "max": 300
    }
  And NO folder should be created in Firestore (query folders collection to verify)

Scenario: Editor updates existing folder description beyond limit
  Given an existing folder has description with 200 characters
  When I send: PATCH /api/library/folders/{folderId}
  And request body: { "description": "A 310-character description..." }
  Then the response status should be 400 Bad Request
  And the error message should be: "Description must be 300 characters or less"
  And the folder description should remain unchanged at original 200 characters
  And Firestore updatedAt timestamp should NOT be modified
```

**Implementation Details:**
- File: C:\Users\uyenl\Clarke\clarke\website\app\api\library\folders\route.ts
  - Add validation BEFORE line 43 (before creating document):
    ```typescript
    // Validation
    if (!description || description.trim().length === 0) {
      return NextResponse.json(
        { error: "Description is required", field: "description" },
        { status: 400 }
      );
    }
    if (description.length > 300) {
      return NextResponse.json(
        {
          error: "Description must be 300 characters or less",
          field: "description",
          current: description.length,
          max: 300
        },
        { status: 400 }
      );
    }
    ```

- Add PATCH endpoint to folders/route.ts for updates (currently missing):
  ```typescript
  export async function PATCH(request: NextRequest) {
    // Similar validation logic for updates
  }
  ```

**Error Response Schema:**
```typescript
interface ValidationError {
  error: string;           // Human-readable message
  field: string;           // Field name that failed validation
  current?: number;        // Current value (for length validation)
  max?: number;            // Maximum allowed value
}
```

**Edge Cases:**
- Empty description: Should fail with error: "Description is required" (field is mandatory)
- Whitespace only: Trim before validation, treat as empty
- Unicode characters: Use `description.length` which counts emojis as 1 character each (correct behavior)
- Exactly 300 characters: Should pass validation (inclusive limit)
- Exactly 301 characters: Should fail with error

**Related Requirements:** REQ-007

---

#### US-009: Content Editor Creates Article with Valid Description
**As a** content editor
**I want to** receive immediate feedback when article description exceeds 200 characters
**So that** I can adjust the summary to fit within limits

**Acceptance Criteria (Gherkin):**
```gherkin
Scenario: Editor creates article with valid description (≤200 chars)
  Given I am an authenticated content editor with valid API key
  When I send: POST /api/library/articles
  And request body:
    {
      "title": "New Article",
      "slug": "new-article",
      "folderId": "folder123",
      "description": "A 150-character article summary text...",
      "content": "Full markdown content...",
      "status": "published",
      "order": 0
    }
  Then the response status should be 201 Created
  And the article should be created in Firestore collection "articles"
  And the response should return the article object with "description" field

Scenario: Editor creates article with description exceeding 200 chars
  Given I am an authenticated content editor
  When I send: POST /api/library/articles
  And request body has description: "A 250-character description that exceeds the 200 character maximum limit for article descriptions and will be rejected by the API validation logic..."
  Then the response status should be 400 Bad Request
  And the response body should be:
    {
      "error": "Description must be 200 characters or less",
      "field": "description",
      "current": 250,
      "max": 200
    }
  And NO article should be created in Firestore

Scenario: Editor receives helpful error context for UI display
  Given I submit an article with 210-char description
  When the API returns 400 error
  Then the error response Content-Type should be application/json
  And the response should include structured error data (field, current, max)
  And the HTTP status should be 400 (not 500 server error)
  And the UI can display: "Description is too long (210/200 characters)"
```

**Implementation Details:**
- File: C:\Users\uyenl\Clarke\clarke\website\app\api\library\articles\route.ts
  - Add validation in POST handler (similar to folders):
    ```typescript
    const { title, slug, folderId, description, content, status, order = 0 } = await request.json();

    // Validation
    if (!description || description.trim().length === 0) {
      return NextResponse.json(
        { error: "Description is required", field: "description" },
        { status: 400 }
      );
    }
    if (description.length > 200) {
      return NextResponse.json(
        {
          error: "Description must be 200 characters or less",
          field: "description",
          current: description.length,
          max: 200
        },
        { status: 400 }
      );
    }

    // Create article document...
    ```

- Create validation utility: lib/validation/library.ts
  ```typescript
  export function validateFolderDescription(desc: string): ValidationResult {
    if (!desc || desc.trim().length === 0) {
      return { valid: false, error: "Description is required", field: "description" };
    }
    if (desc.length > 300) {
      return {
        valid: false,
        error: "Description must be 300 characters or less",
        field: "description",
        current: desc.length,
        max: 300
      };
    }
    return { valid: true };
  }

  export function validateArticleDescription(desc: string): ValidationResult {
    // Similar logic with max: 200
  }
  ```

**Frontend Integration (Optional but Recommended):**
- File: components/library/ArticleForm.tsx (if exists)
  - Add client-side validation before API call:
    ```typescript
    const [charCount, setCharCount] = useState(0);
    const maxChars = 200;

    <textarea
      value={description}
      onChange={(e) => {
        setDescription(e.target.value);
        setCharCount(e.target.value.length);
      }}
      maxLength={200}  // Prevent typing beyond limit
    />
    <p className={charCount > 200 ? "text-red-500" : "text-gray-500"}>
      {charCount}/{maxChars} characters
    </p>
    ```

**Edge Cases:**
- Exactly 200 characters: Should pass validation
- Exactly 201 characters: Should fail with error
- Null/undefined description: Return 400 with "Description is required"
- Empty string after trim: Return 400 with "Description is required"

**Related Requirements:** REQ-007

---

### Epic 5: Migration & Data Integrity

#### US-010: Developer Executes Safe Data Migration
**As a** developer executing the migration
**I want to** migrate excerpt → description and remove tags without data loss
**So that** all articles are updated consistently and safely

**Acceptance Criteria (Gherkin):**
```gherkin
Scenario: Developer runs migration script on local Firestore emulator
  Given I have Firestore emulator running on localhost:8080
  And the emulator has test data with 50 articles
  And each article has fields: excerpt, tags, content, title
  When I execute: npm run migrate:excerpt-to-description
  Then the script should connect to Firestore emulator (not production)
  And the script should update all 50 articles
  And each article document should have field: description (value copied from old excerpt)
  And each article document should NOT have fields: excerpt, tags
  And the script should output: "Successfully migrated 50 articles"
  And the script should log any articles with excerpt >200 chars (requiring manual review)

Scenario: Migration handles batch write limits
  Given Firestore production has 600 articles (exceeds 500 batch limit)
  When I execute the migration script in production
  Then the script should process articles in batches of 500 documents
  And the script should execute Batch 1: articles 1-500
  And the script should execute Batch 2: articles 501-600
  And all 600 articles should be updated successfully
  And the script should log progress: "Batch 1/2 complete (500 articles)", "Batch 2/2 complete (100 articles)"
  And the script should have error handling: if batch 1 fails, do not proceed to batch 2

Scenario: Migration validates data before execution
  Given 5 articles have excerpt field with >200 characters
  When I execute: npm run migrate:excerpt-to-description -- --validate
  Then the script should scan all articles WITHOUT modifying any data
  And the script should output: "Validation: Found 5 articles with excerpt >200 chars"
  And the script should list article IDs: ["article-abc", "article-def", ...]
  And the script should exit with code 1 (error) and message: "Please manually review articles before migration"
  And NO Firestore writes should occur during validation
```

**Implementation Details:**

**Create Migration Script: scripts/migrate-excerpt-to-description.ts**
```typescript
import { adminDb } from '../lib/firebase/admin';

async function migrateArticles(dryRun: boolean = false) {
  console.log('Starting migration: excerpt → description, remove tags');
  console.log(`Mode: ${dryRun ? 'DRY RUN (no writes)' : 'LIVE (writes enabled)'}`);

  const articlesRef = adminDb.collection('articles');
  const snapshot = await articlesRef.get();

  console.log(`Found ${snapshot.size} articles to migrate`);

  // Validation: Check for excerpts >200 chars
  const longExcerpts: string[] = [];
  snapshot.forEach(doc => {
    const data = doc.data();
    if (data.excerpt && data.excerpt.length > 200) {
      longExcerpts.push(`${doc.id} (${data.excerpt.length} chars)`);
    }
  });

  if (longExcerpts.length > 0) {
    console.error(`❌ Validation failed: ${longExcerpts.length} articles have excerpt >200 chars`);
    console.error('Articles requiring manual review:');
    longExcerpts.forEach(id => console.error(`  - ${id}`));
    process.exit(1);
  }

  if (dryRun) {
    console.log('✅ Validation passed. Run without --validate flag to execute migration.');
    return;
  }

  // Execute migration in batches of 500
  const batchSize = 500;
  const totalBatches = Math.ceil(snapshot.size / batchSize);
  let articles = snapshot.docs;

  for (let i = 0; i < totalBatches; i++) {
    const batch = adminDb.batch();
    const start = i * batchSize;
    const end = Math.min((i + 1) * batchSize, articles.length);

    console.log(`Processing batch ${i + 1}/${totalBatches} (articles ${start + 1}-${end})`);

    for (let j = start; j < end; j++) {
      const doc = articles[j];
      const data = doc.data();

      batch.update(doc.ref, {
        description: data.excerpt || '',  // Copy excerpt to description
        excerpt: adminDb.FieldValue.delete(),  // Remove excerpt field
        tags: adminDb.FieldValue.delete(),     // Remove tags field
        updatedAt: adminDb.FieldValue.serverTimestamp()
      });
    }

    await batch.commit();
    console.log(`✅ Batch ${i + 1}/${totalBatches} complete`);
  }

  console.log(`🎉 Successfully migrated ${snapshot.size} articles`);
}

// Run migration
const isValidation = process.argv.includes('--validate');
migrateArticles(isValidation).catch(error => {
  console.error('❌ Migration failed:', error);
  process.exit(1);
});
```

**Add to package.json:**
```json
{
  "scripts": {
    "migrate:excerpt-to-description": "ts-node scripts/migrate-excerpt-to-description.ts",
    "migrate:validate": "ts-node scripts/migrate-excerpt-to-description.ts --validate"
  }
}
```

**Rollback Procedure (if migration fails):**
1. Restore Firestore from backup (verify backup exists BEFORE migration)
2. Command: Use Firebase Console → Firestore → Backups → Restore to timestamp
3. Alternative: If recent backup unavailable, use git revert + redeploy to rollback code changes

**Edge Cases:**
- Migration fails partway (e.g., network error at batch 2/3): Script logs completed batches, safe to re-run (idempotent - checks if description already exists)
- Duplicate fields: If article already has "description" field, prefer existing value (don't overwrite)
- Empty excerpt: Migrate empty string "" to description field (maintain data type consistency)
- Search index migration: Create separate script `migrate-search-index.ts` with same batch logic

**Related Requirements:** REQ-004, REQ-005, REQ-008

---

### Epic 6: Accessibility & Responsive Design

#### US-011: User Navigates Library with Keyboard
**As a** keyboard-only user
**I want to** navigate the library using Tab, Enter, and Escape keys
**So that** I can access content without using a mouse

**Acceptance Criteria (Gherkin):**
```gherkin
Scenario: User tabs through interactive elements in correct order
  Given I am on /library homepage
  When I press Tab key repeatedly
  Then focus should move in order:
    1. Search input field
    2. First featured folder card (if featured section exists)
    3. Second featured folder card (if exists)
    4. First main folder card
    5. Second main folder card
    ... (continue for all cards)
    N. Pagination buttons (if exists)
  And each focused element should have visible focus outline:
    - outline: 2px solid #C15F3C (primary)
    - outline-offset: 2px
  And focus order should follow visual layout (left-to-right, top-to-bottom on desktop; top-to-bottom on mobile)

Scenario: User activates folder card with Enter key
  Given I have tabbed to focus on a folder card
  And the focused card has href="/library/business-analysis"
  When I press Enter key
  Then the browser should navigate to /library/business-analysis
  And the page should load the folder detail view
  And keyboard focus should move to the main content area (skip to main content)

Scenario: User closes search suggestions with Escape key
  Given the search bar has focus and I have typed "business"
  And a dropdown of search suggestions is displayed below the input
  When I press Escape key
  Then the suggestions dropdown should close (display: none)
  And keyboard focus should remain in the search input field
  And the search input value should remain "business" (not cleared)
```

**Implementation Details:**

**Focus Ring Styling (Global):**
- File: C:\Users\uyenl\Clarke\clarke\website\globals.css
  ```css
  /* Override default browser focus outline */
  *:focus-visible {
    outline: 2px solid #C15F3C;  /* primary color */
    outline-offset: 2px;
    border-radius: 4px;
  }

  /* Remove outline for mouse users (preserve for keyboard) */
  *:focus:not(:focus-visible) {
    outline: none;
  }
  ```

**Focus Order (Tab Index):**
- Do NOT use tabindex values >0 (breaks natural DOM order)
- Use semantic HTML: <a>, <button> are focusable by default
- For non-focusable interactive elements, add: tabindex="0"

**Keyboard Event Handlers:**
- File: C:\Users\uyenl\Clarke\clarke\website\components\library\SearchBar.tsx
  ```tsx
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape' && showSuggestions) {
      setShowSuggestions(false);
      // Keep focus on input (no blur)
    }
    if (e.key === 'Enter') {
      // Submit search
      router.push(`/library/search?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <input
      type="search"
      onKeyDown={handleKeyDown}
      onFocus={() => setShowSuggestions(true)}
      className="..."
    />
  );
  ```

**Skip to Main Content Link:**
- File: C:\Users\uyenl\Clarke\clarke\website\app\library\layout.tsx
  ```tsx
  <a
    href="#main-content"
    className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 focus:z-50 focus:bg-primary focus:text-white focus:px-4 focus:py-2"
  >
    Skip to main content
  </a>
  <main id="main-content">
    {children}
  </main>
  ```

**Edge Cases:**
- Focus trap in modals: Implement focus trap utility (trap Tab within modal bounds)
- Focus restoration: When closing modal, return focus to trigger button
- Screen reader announcements: Use aria-live regions for dynamic content updates

**Related Requirements:** REQ-003 (Non-Functional: Accessibility)

---

#### US-012: User Views Library on Mobile Device
**As a** mobile library visitor
**I want to** see responsive layouts optimized for small screens
**So that** I can read articles comfortably on my phone

**Acceptance Criteria (Gherkin):**
```gherkin
Scenario: User views library homepage on mobile (375px width)
  Given I am viewing /library on iPhone SE simulator (375px viewport width)
  When the page loads
  Then folder cards should stack vertically in a single column (grid-cols-1)
  And each card should have width: calc(100% - 32px) (16px margin on each side)
  And font sizes should scale responsively:
    - H1: 1.75rem (28px) instead of 2.25rem (36px)
    - H2: 1.5rem (24px) instead of 1.875rem (30px)
    - Body: 1rem (16px) remains same
  And touch targets (buttons, links) should be ≥44x44px (WCAG 2.1 Level AAA)
  And horizontal scrolling should NOT occur (no element wider than viewport)

Scenario: User reads article on mobile device
  Given I am viewing an article on mobile (375px viewport width)
  When the article content loads in the .prose container
  Then the article should have padding: 1rem (16px) on left and right
  And code blocks should have horizontal scroll if content exceeds 343px width (375 - 32)
  And images should scale to fit: max-width: 100%, height: auto
  And line length should be ≤75 characters for optimal readability (prose max-width handles this)
  And the download button should be full-width on mobile: w-full md:w-auto

Scenario: User interacts with featured section on tablet (768px)
  Given I am viewing /library on iPad simulator (768px viewport width)
  When the featured section loads
  Then featured folders should display in 2-column grid (md:grid-cols-2)
  And cards should have gap: 1.5rem (24px) between them
  And hover effects should work with touch: tap triggers hover state, second tap navigates
  And the layout should have 16px padding on left and right: px-4 md:px-6
```

**Implementation Details:**

**Responsive Utilities (Tailwind):**
- Mobile-first approach: Base styles = mobile, then add md: and lg: prefixes
- Breakpoints:
  - sm: 640px (small tablets)
  - md: 768px (tablets)
  - lg: 1024px (desktops)
  - xl: 1280px (large desktops)

**File: FeaturedFolders.tsx (line 20)**
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 p-4 md:p-6">
```

**File: ArticleViewer.tsx (line 26)**
```tsx
<article className="max-w-3xl mx-auto px-4 md:px-6 py-6 md:py-8">
  <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
    <h1 className="text-2xl md:text-4xl font-tiempos font-bold">{article.title}</h1>
    <button className="w-full md:w-auto flex items-center justify-center gap-2 px-4 py-3 md:py-2 bg-cloud-dancer hover:bg-[#E5E2DC] rounded-lg">
      <Download size={18} />
      <span className="text-sm">Download</span>
    </button>
  </div>
```

**Touch Target Sizing:**
- Minimum: 44x44px (WCAG 2.1 Level AAA)
- Buttons: py-3 (12px * 2 + text height = ~48px)
- Links: min-h-[44px] flex items-center

**Horizontal Scroll Prevention:**
- File: globals.css
  ```css
  html, body {
    overflow-x: hidden;
    max-width: 100vw;
  }

  /* Ensure code blocks scroll horizontally within container */
  .prose pre {
    overflow-x: auto;
    max-width: 100%;
  }
  ```

**Edge Cases:**
- Landscape orientation (e.g., 667x375): Use height-based media queries if needed: @media (max-height: 400px)
- Very small screens (320px): Test on iPhone SE (1st gen), ensure no horizontal scroll
- Foldable devices: Use standard responsive breakpoints (treat as mobile when folded)

**Testing Checklist:**
- [ ] Test on Chrome DevTools device emulator (iPhone SE, iPad, Pixel 5)
- [ ] Test on real devices if available
- [ ] Test with Chrome Lighthouse (mobile): Performance ≥90, Accessibility ≥95

**Related Requirements:** REQ-003 (Non-Functional: Responsive Design)

---

## Additional Specifications

### CSS Class Reference

**Colors:**
- Primary (Terracotta): `bg-primary`, `text-primary`, `border-primary` (#C15F3C)
- Secondary (Gray): `bg-secondary`, `text-secondary`, `border-secondary` (#B1ADA1)
- Tertiary (Cloud Dancer): `bg-cloud-dancer`, `text-cloud-dancer` (#F0EEE9)
- White: `bg-white`, `text-white` (#FFFFFF)
- Black: `bg-black`, `text-black` (#000000)

**Typography:**
- Font families: `font-tiempos`, `font-ibm-plex-mono`
- Font sizes: `text-sm` (14px), `text-base` (16px), `text-lg` (18px), `text-xl` (20px), `text-2xl` (24px), `text-3xl` (30px), `text-4xl` (36px)
- Font weights: `font-normal` (400), `font-semibold` (600), `font-bold` (700)

**Spacing:**
- Padding: `p-2` (8px), `p-4` (16px), `p-6` (24px), `p-8` (32px)
- Margin: `m-2` (8px), `m-4` (16px), `m-6` (24px), `m-8` (32px)
- Gap: `gap-2` (8px), `gap-4` (16px), `gap-6` (24px), `gap-8` (32px)

**Shadows:**
- Small: `shadow-sm` (0 1px 2px rgba(0,0,0,0.05))
- Medium: `shadow-md` (0 4px 6px rgba(0,0,0,0.1))
- Large: `shadow-lg` (0 10px 15px rgba(0,0,0,0.1))
- Extra Large: `shadow-xl` (0 20px 25px rgba(0,0,0,0.15))

**Border Radius:**
- Small: `rounded` (4px)
- Medium: `rounded-lg` (8px)
- Large: `rounded-xl` (12px)
- Full: `rounded-full` (9999px)

---

## Coverage Checklist

- [x] Design System Changes (REQ-001, REQ-002, REQ-003): US-001, US-002, US-003
- [x] Data Model Changes (REQ-004, REQ-005, REQ-008): US-004, US-005, US-006, US-010
- [x] Featured Content (REQ-006): US-007
- [x] Character Limits (REQ-007): US-008, US-009
- [x] Accessibility (Non-Functional): US-011
- [x] Responsive Design (Non-Functional): US-012
- [x] API Consumer Perspective: US-005, US-010
- [x] Edge Cases: Included in each user story
- [x] Implementation Details: File paths, line numbers, code snippets provided
- [x] Testable Criteria: All "Then" statements can be validated

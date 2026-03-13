# Article Search Filtering by Folder — Product Requirements Document

**Version:** 1.0.0
**Date:** 2026-03-10
**Status:** Draft
**Timeline:** TBD
**Stakeholders:** Product Owner: Clarke, Tech Lead: Developer

---

## Section 1: Business Context

### Problem Statement

Users searching Clarke's Library currently receive results from all folders simultaneously, with no way to scope results to a specific module or topic area. When a user knows they want an article about "requirements" specifically within the BA Masterclass — not in Daily News or other folders — they must scan all results manually. This creates unnecessary friction for a library with hundreds of articles across distinct content areas.

### Business Value

| Dimension | Impact |
|-----------|--------|
| **User Impact** | Users narrow search scope to the folder they are working in, reducing time-to-result for targeted queries |
| **Business Impact** | Increases search utility as article count grows, preventing the search experience from degrading at scale |
| **Strategic Alignment** | Completes the search feature spec from `product-requirements.md` v1.0.0 ("Filter by category, tags, date" listed under Core Search) |

### Scope Boundaries

**IN SCOPE:**
- Folder filter dropdown on the search page (`/library/search`)
- URL-param persistence of the selected folder filter (`?folder=<folderId>`)
- Server-side filtering of search results by selected folder
- "All folders" default state (no filter applied)

**OUT OF SCOPE:**
- Multi-folder selection (select more than one folder at a time)
- Filtering by sub-folder independently from its parent
- Tag-based or date-based filtering (removed from data model per design-system-update-prd.md)
- Search-as-you-type / live filtering (existing keyword search is form-submit; folder filter follows same model)
- Any changes to the search index schema or scoring algorithm

### Success Criteria

| Type | Criterion |
|------|-----------|
| Functional | Selecting a folder and submitting a search returns only results whose `folderPath` includes that folder ID |
| Functional | Selecting "All Folders" returns unfiltered results (current behavior preserved) |
| Functional | The selected folder persists across page refresh (URL param) |
| Quality | No regressions: keyword-only search without a folder selected behaves identically to current behavior |
| Quality | Folder dropdown renders with accessible labels and keyboard navigation |

---

## Section 2: Requirements

### Functional Requirements

**REQ-001 — Folder Filter Dropdown on Search Page (P1-High)**

**⚠️ BREAKING CHANGE:** No — adds a new UI element; existing keyword-only search behavior unchanged.

**Description:** The search page (`/library/search`) displays a folder filter dropdown alongside the search input. The dropdown lists all folders retrieved from Firestore, with "All Folders" (empty string value) as the default first option.

**User Impact:** Readers can scope search to the module they are actively studying, eliminating cross-topic noise as the library grows.

**Acceptance Criteria:**
- Given I navigate to `/library/search`, when the page loads, then a `<select>` folder filter element is rendered in the search form (above or below the search input on mobile; inline on `md:` breakpoint).
- Given the folders collection has N folders, when the dropdown renders, then it contains N + 1 options (N folders + "All Folders").
- Given no folder has been selected, when the page loads, then "All Folders" is the selected option.

**Dependencies:** None — `getFolders()` already exists and is cached.

**Reference:** Frontend Guideline → URL State Pattern; Design System → Form Components

**REQ-002 — URL Param Persistence for Folder Filter (P1-High)**

**⚠️ BREAKING CHANGE:** No — adds an optional `?folder=` param; existing URLs without it are unchanged.

**Description:** The selected folder is encoded in the URL as `?folder=<folderId>`. When the user submits a search with a folder selected, the URL becomes `/library/search?q=<query>&folder=<folderId>`. The server reads both params and passes `folderId` to `searchArticles()`.

**User Impact:** Readers can share a filtered search URL directly; back-navigation and page refresh preserve the selected folder.

**Acceptance Criteria:**
- Given I select "BA Masterclass" from the dropdown and search for "requirements", when the page loads, then the URL contains both `?q=requirements` and `&folder=<ba-masterclass-folder-id>`.
- Given I share the URL `/library/search?q=requirements&folder=<id>` with another user, when they open it, then the same folder is pre-selected and results are pre-filtered.
- Given I select "All Folders" and search, when the page loads, then the URL contains only `?q=<query>` (no `folder` param).

**Dependencies:** REQ-001 (folder dropdown must exist to generate the param).

**Reference:** Frontend Guideline → URL State Pattern

**REQ-003 — Server-Side Result Filtering (P0-Critical)**

**⚠️ BREAKING CHANGE:** No — backend already supports `folderId`; no API contract change.

**Description:** The `searchArticles()` function already accepts an optional `folderId` parameter and the API route already reads `?folder=`. The search page must pass the `folder` URL param from `searchParams` to `searchArticles()`. No backend changes required.

**User Impact:** Search results contain only articles relevant to the selected folder — cross-topic noise is eliminated.

**Acceptance Criteria:**
- Given `?q=requirements&folder=<id>` is in the URL, when `searchArticles()` is called, then only results whose `folderPath` array includes `<id>` are returned, and `GET /api/library/search?q=requirements&folder=<id>` returns HTTP 200 with those scoped results.
- Given `?q=requirements` with no folder param, when `searchArticles()` is called with `folderId = undefined`, then all keyword-matching results are returned and the count equals the current (unfiltered) behavior.
- Given `GET /api/library/search?q=requirements&folder=<nonexistent-id>`, when the handler processes the request, then it returns HTTP 200 with an empty results array (not an error).

**Dependencies:** None — backend already implemented.

**Reference:** Backend Guideline → API Conventions; `lib/firebase/firestore.ts` searchArticles()

**REQ-004 — Folder Filter Pre-Selection on Page Load (P1-High)**

**⚠️ BREAKING CHANGE:** No — additive behavior on page load; no existing state altered.

**Description:** When the search page loads with a `?folder=<id>` param already in the URL (shared link or back-navigation), the dropdown pre-selects the matching folder.

**User Impact:** Shared links and back-navigation restore the reader's filter context without requiring re-selection.

**Acceptance Criteria:**
- Given the URL is `/library/search?q=test&folder=<id>`, when the page loads, then the dropdown displays the folder name matching `<id>` as the selected value and results are scoped to that folder.
- Given the URL contains `?folder=<unknown-id>` (folder no longer exists), when the page loads, then the dropdown renders with "All Folders" selected and results are returned unfiltered (no error state shown).

**Dependencies:** REQ-001 (dropdown must exist), REQ-002 (URL param must be written by form submit).

**Reference:** Frontend Guideline → URL State Pattern

**REQ-005 — Empty State When No Results in Selected Folder (P2-Medium)**

**⚠️ BREAKING CHANGE:** No — modifies empty state copy for filtered searches only; unfiltered empty state unchanged.

**Description:** When a search query returns zero results within the selected folder, the empty state message names the folder and offers a clear action (broaden to All Folders or change the keyword).

**User Impact:** Readers understand why no results appear and have an immediate next action — preventing confusion or abandonment.

**Acceptance Criteria:**
- Given I search for "xyz123" in folder "BA Masterclass" and there are no matches, when results render, then the empty state reads: "No results found in [folder name]. Try a different keyword or select All Folders."
- Given I search for "xyz123" with "All Folders" selected and there are no matches, when results render, then the existing unmodified empty state message is displayed.

**Dependencies:** REQ-001 (folder must be selected), REQ-003 (filter must be applied server-side).

**Reference:** Frontend Guideline → Empty State Patterns

### Non-Functional Requirements

| Category | Requirement |
|----------|-------------|
| Performance | Folder list fetch adds ≤100ms latency to search page server render (folders are cached via `unstable_cache` with 300s TTL, already implemented in `getFolders()`) |
| Accessibility | Dropdown uses `<select>` with `<label>` association; keyboard-navigable per WCAG 2.1 AA |
| Responsiveness | Dropdown stacks below search input on mobile (default), sits inline on `md:` breakpoint |
| No regressions | `npm run build` passes with zero TypeScript errors after changes |

---

## Section 3: Constraints & Dependencies

**Technical Constraints:**
- `SearchResult` type does not include a `folderId` field — filtering must use `folderPath: string[]` which contains ancestor folder IDs. A folder ID is a match if `folderPath.includes(folderId)`. This means filtering by a parent folder also returns articles in its sub-folders (correct behavior).
- `SearchBar` is a `'use client'` component; the folder dropdown must either be co-located in the same client component or implemented as a separate client component within the server-rendered search page.
- `getFolders()` returns all folders ordered by `order` field. For the dropdown, all folders are valid options — no special exclusions needed for MVP.
- The `folder` URL param must use the Firestore document ID (not slug), because `searchArticles()` checks `result.folderPath.includes(folderId)` and `folderPath` contains IDs.

**Dependencies:**
- `getFolders()` from `lib/firebase/firestore.ts` — already implemented, used by homepage
- `searchArticles(query, folderId?)` from `lib/firebase/firestore.ts` — already accepts `folderId`, no changes needed
- `GET /api/library/search?q=&folder=` — already reads `?folder=` param, no changes needed
- `SearchBar` component — requires extension or replacement to support folder selection

---

## Section 4: Risks & Assumptions

### Top Risks

| Risk | Severity | Mitigation |
|------|----------|------------|
| Folder list grows large (50+ folders across all modules), making dropdown unwieldy | MEDIUM | Group by parent folder using `<optgroup>` elements in `<select>`. If needed, limit dropdown to root-level folders only in V1 and defer sub-folder granularity. ⚠️ Must Validate: confirm acceptable UX with current folder count |
| `folderPath` filtering returns unexpected results if `folderPath` is not consistently populated for all articles | MEDIUM | Confirm via spot-check that all existing articles have non-empty `folderPath` before declaring REQ-003 done. Backend already relies on this field for breadcrumbs. |
| URL param `?folder=` exposes internal Firestore document IDs in URLs | LOW | IDs are already exposed in article URLs; no additional security surface. Acceptable for public read-only library. |

### Key Assumptions

| Assumption | Validation Status | Risk if Wrong |
|------------|-------------------|---------------|
| Backend is already complete: `searchArticles()` accepts `folderId`, API route reads `?folder=` | Confirmed by reading code — no assumption needed | N/A |
| Folder IDs in `folderPath` array match the Firestore document IDs returned by `getFolders()` | ⚠️ Must Validate — spot-check 3-5 articles to confirm `folderPath` contains `doc.id` values | Filter returns 0 results even when matches exist |
| The "All Folders" default (no filter) is sufficient for V1; hierarchical / multi-select filtering is deferred | ⚠️ Must Validate — acceptable UX assumption based on single-user context | User cannot filter by broad topic area (e.g., "all BA modules") |
| Folder count is manageable in a flat `<select>` (under ~30 options) | ⚠️ Must Validate — run `getFolders()` and count | Dropdown too long without grouping |

---

## Section 5: Developer Handoff

### Implementation Sequence

**Phase 1: Search Page — Wire Folder Filter (server side)**
1. In `app/library/search/page.tsx`, extend `searchParams` type to include `folder?: string`
2. Pass `folder` param to `searchArticles(query, folder)` on the server
3. Fetch folders via `getFolders()` server-side and pass the list as a prop to the client component

**Phase 2: Search UI — Add Folder Dropdown (client side)**
4. Extend `SearchBar` (or create `SearchFilterBar`) to accept `folders: Folder[]` and `currentFolderId?: string` props
5. Render a `<select>` dropdown with "All Folders" as the first `<option>` followed by one `<option>` per folder
6. On form submit, encode selected folder ID as `?folder=<id>` in the URL (empty string = omit param)
7. Pre-select the dropdown option that matches `currentFolderId` on initial render

**Phase 3: Empty State Copy**
8. Update the empty state in `search/page.tsx` to show folder-aware message when `folder` param is set

### Key Files to Modify

| File | Change | REQ |
|------|--------|-----|
| `website/app/library/search/page.tsx` | Add `folder?` to searchParams type; pass to `searchArticles()`; fetch folders; pass to SearchBar | REQ-001, REQ-003, REQ-004, REQ-005 |
| `website/components/library/SearchBar.tsx` | Add folder dropdown: accept `folders` + `currentFolderId` props; include `<select>` in form; encode folder in URL on submit | REQ-001, REQ-002, REQ-004 |

No changes required to:
- `website/app/api/library/search/route.ts` (already reads `?folder=`)
- `website/lib/firebase/firestore.ts` (already filters by `folderId`)
- `website/types/library.ts` (no schema changes)

### Success Validation

- [ ] **REQ-001:** UI — Given `/library/search` loads, then a `<select>` element with "All Folders" + all folder names is present in the DOM.
- [ ] **REQ-002:** URL — Given folder "X" selected and "requirements" searched, then URL is `/library/search?q=requirements&folder=<X-id>`; page refresh retains selection.
- [ ] **REQ-003:** API — `GET /api/library/search?q=requirements&folder=<ba-masterclass-id>` returns 200 with results where every result's `folderPath` includes the given ID.
- [ ] **REQ-004:** Pre-selection — Given URL contains `?folder=<id>`, when page loads, then the matching folder name is displayed as the selected dropdown option.
- [ ] **REQ-005:** Empty state — Given `?q=nomatch&folder=<id>` returns zero results, then empty state copy includes the folder name and suggests selecting "All Folders."
- [ ] **No regression** — `GET /api/library/search?q=requirements` (no folder param) returns same results as before this change.

### Rollback Plan

**Triggers:**
- Folder filter causes regression in unfiltered keyword search
- `getFolders()` call introduces performance regression (page load >2s)
- TypeScript build fails after changes

**Procedure:** See Deployment Guideline → Rollback Procedures. Git revert search page and SearchBar component changes + push to trigger redeploy. No data migration involved — rollback is non-destructive.

---

### Definition of Done

- All acceptance criteria above pass
- `npm run build` completes with zero TypeScript errors
- Folder dropdown renders on mobile (stacked) and desktop (inline) per design system breakpoints
- Keyboard navigation: Tab to dropdown, arrow keys to select folder, Enter to confirm, form submit works
- WCAG AA: `<label>` associated with `<select>` via `htmlFor`/`id`

---

*Technical Guidelines Reference: `backend-guideline.md` Section 2 (API Conventions), `frontend-guideline.md` Section 6 (URL State Pattern), `frontend-guideline.md` Section 5 (Accessibility), `design-system.md` (component tokens)*

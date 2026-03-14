# Business Requirements Document
# tracker.ripid.vn — Personal & Shared Financial Tracker (v2.1)

**Status:** Draft v2.1
**Date:** 2026-03-14
**Author:** Clarke / Business Analysis
**Stakeholders:** Product Owner (Clarke team)

---

## Section 1: Business Context

### Problem Statement

The current 4-tab app (Dashboard, Earnings, Expenses, Funds) fragments the financial overview, forcing users to mentally stitch together information across tabs. There is no multi-month comparison view, no way to track money owed to the user (receivables), and the expense model does not distinguish between personal spending and fund transfers. The result is a tool that is less useful than a spreadsheet for financial planning.

### Goal

Replace the multi-tab layout with a single-page, income-statement-style tracker. The top section is a rolling 12-month table (earnings rows → expense rows), and the bottom section is a companion bar-chart dashboard. Users get a canonical income statement view with planned vs. actual tracking, multi-month comparison, and a new receivables concept — all on one page.

### Scope Boundaries

**IN SCOPE (v2.0 — deployed baseline)**
- Single-page layout: Income Statement Table + Bar Chart Dashboard
- Receivables as a distinct entry type within earnings (money owed to the user)
- Sender/receiver expense model (personal spending vs. fund transfers vs. inter-fund transfers)
- Rolling 12-month column range (previous 6 → current → next 5)
- Cell-level edit popup with quick planned/actual toggle
- Settings page (gear icon in header) for fund management
- Four chart design tokens: earnings, receivables, external expenses, fund contributions
- Hard-block enforcement for expenses where sender = myself

**v2.1 additions: see Section 8**

**OUT OF SCOPE (v2.0)**
- Fund deletion
- Fund-level hard-block enforcement (fund spending has no balance cap in MVP)
- Multi-currency support
- Push or email notifications
- Data export (CSV, PDF)
- Mobile native app (iOS/Android)

### Success Criteria

| Metric | Target |
|--------|--------|
| Income Statement table renders | < 2 seconds for rolling 12-month range |
| Entry save (write + read-back) | < 1 second |
| Hard-block enforcement accuracy | 100% — no entry violates earnings ceiling |
| Fund management accessible from Settings | Gear icon in header, no nav tab |
| Mobile horizontal scroll | Table and chart scrollable at 375px |

---

## Section 2: Use Case Map

### Domain 1 — Identity & Access (UC1.x)

| ID | Use Case | Actor | Trigger |
|----|----------|-------|---------|
| UC1.1 | Register | Visitor | Clicks "Sign Up" |
| UC1.2 | Verify email address | Visitor | Receives Supabase verification email |
| UC1.3 | Log in | Registered user | Clicks "Log In" |
| UC1.4 | Log out | Authenticated user | Clicks "Log Out" (header) |

### Domain 2 — Entry Management (UC2.x)

| ID | Use Case | Actor | Trigger |
|----|----------|-------|---------|
| UC2.1 | Add earning (regular or receivable) | User | Opens Add modal → Earning tab |
| UC2.2 | Add expense (personal, contribution, fund expense, inter-fund transfer) | User | Opens Add modal → Expense tab |
| UC2.3 | Quick toggle planned ↔ actual | User | Clicks toggle in cell popup |
| UC2.4 | Edit full entry | User | Clicks "Edit" in cell popup |
| UC2.5 | Delete entry | User | Deletes from edit form |

### Domain 3 — Income Statement Table (UC3.x)

| ID | Use Case | Actor | Trigger |
|----|----------|-------|---------|
| UC3.1 | View Income Statement (Actual mode) | User | Loads page; default view |
| UC3.2 | Switch to Planned view | User | Clicks view toggle |
| UC3.3 | Open cell popup | User | Clicks any non-empty cell |
| UC3.4 | Navigate implicit month range | System | Rolling 12 months always shown |

### Domain 4 — Bar Chart Dashboard (UC4.x)

| ID | Use Case | Actor | Trigger |
|----|----------|-------|---------|
| UC4.1 | View personal bar chart | User | Loads page; default filter = Myself |
| UC4.2 | Filter chart by fund | User | Selects fund from dropdown |

### Domain 5 — Fund Management / Settings (UC5.x)

| ID | Use Case | Actor | Trigger |
|----|----------|-------|---------|
| UC5.1 | Open Settings | User | Clicks gear icon in header |
| UC5.2 | Create a fund | User | "Create Fund" in Settings |
| UC5.3 | Add member by email | Fund creator | Enters existing user's email in Settings |
| UC5.4 | View fund member list | Fund member | Opens fund in Settings |

---

## Section 3: Functional Requirements

### R1 — Single-Page Layout

**Priority:** P0

| Req ID | Description | Acceptance Criteria |
|--------|-------------|---------------------|
| R1.1 | Remove ripid.vn brand text from header | Given the app loads, then the header contains no "ripid.vn" brand text |
| R1.2 | Remove navigation tabs | Given the app loads, then there are no Dashboard / Earnings / Expenses / Funds nav tabs |
| R1.3 | Header contains Sign Out button and Settings gear icon | Given an authenticated user, when they view the header, then Sign Out and a gear icon (→ Settings) are present |
| R1.4 | Page layout: Income Statement Table (top) + Bar Chart (bottom) | Given the page loads, then both sections are present and stacked vertically |

### R2 — Income Statement Table

**Priority:** P0

| Req ID | Description | Acceptance Criteria |
|--------|-------------|---------------------|
| R2.1 | Table displays 12 columns: previous 6 months, current month, next 5 months | Given today is any date, when the table renders, then exactly 12 month columns appear in chronological order |
| R2.2 | Earnings rows (regular) appear in the top section, sorted A–Z by name | Given a user has earnings with names "Salary" and "Freelance", then two rows appear in alphabetical order in the top section |
| R2.3 | Receivable rows appear in the top section (after regular earnings), sorted A–Z | Given a user has a receivable "Loan from Kim", then it appears in the earnings section labelled as receivable |
| R2.4 | Expense rows appear in the bottom section, sorted A–Z by name | Given a user has expenses "Rent" and "Groceries", then two rows appear in alphabetical order in the bottom section |
| R2.5 | Each cell = sum of all entries matching that name × month | Given two "Salary" entries in 2026-03 totalling 20,000,000 VND, then the cell for "Salary" / "2026-03" displays 20,000,000 |
| R2.6 | Empty cells display as "—" | Given no entries for a name × month combination, then the cell displays "—" |
| R2.7 | Actual view (default): cells show actual amounts only | Given Actual view is active, then cells display only actual-status entry totals; planned entries are hidden |
| R2.8 | Planned view: cells show both actual and planned; planned amounts styled in light yellow | Given Planned view is active, then cells show actual total + planned total with planned styled in light yellow background |
| R2.9 | Clicking a cell opens a popup anchored to that cell | Given a non-empty cell is clicked, then a popup appears near the cell listing all matching entries |
| R2.10 | Multi-entry popup lists each entry separately with edit + toggle | Given 2 "Rent" entries in the same month, when the cell is clicked, then the popup shows both entries with individual Edit and Toggle buttons |
| R2.11 | Table horizontally scrollable on mobile | Given a 375px viewport, then the table scrolls horizontally to reveal all 12 columns |

### R3 — Add Entry (Single FAB/Button)

**Priority:** P0

| Req ID | Description | Acceptance Criteria |
|--------|-------------|---------------------|
| R3.1 | One primary action button opens a modal with Earning and Expense tabs | Given the user clicks the Add button, then a modal opens with two tabs |
| R3.2 | Earning tab fields: Receiver (myself / any fund), Amount (VND integer), Name, Type (Regular / Receivable), Status (Planned / Actual), Month (editable, defaults to current) | Given the Earning tab is open, then all 6 fields are present and functional |
| R3.3 | Expense tab fields: Sender (myself / any fund), Receiver (any fund / none), Amount (VND integer), Name, Status (Planned / Actual), Month (editable, defaults to current) | Given the Expense tab is open, then all 6 fields are present and functional |
| R3.4 | Expense sender/receiver business rules are enforced: sender=myself + receiver=none → personal external expense; sender=myself + receiver=Fund X → contribution to Fund X; sender=Fund X + receiver=none → Fund X external expense; sender=Fund X + receiver=Fund Y → inter-fund transfer | Given each sender/receiver combination, then the entry is classified and stored correctly |
| R3.5 | Hard-block applies when sender=myself: planned expenses ≤ planned earnings; actual expenses ≤ actual earnings for that month | Given planned earnings = 10,000,000 VND and planned expenses = 9,900,000 VND, when saving a 200,000 VND planned expense, then the system rejects with an error |

### R4 — Bar Chart Dashboard

**Priority:** P1

| Req ID | Description | Acceptance Criteria |
|--------|-------------|---------------------|
| R4.1 | Bar chart located below the Income Statement Table on the same page | Given the page loads, then the chart is visible below the table |
| R4.2 | Filter dropdown: Myself / [each fund name] | Given a user with 2 funds, then the dropdown shows "Myself", "Fund A", "Fund B" |
| R4.3 | Each month: 2 bar columns (Planned, Actual); each bar has 4 stacked sections | Given Myself is selected, then each month shows a Planned bar and an Actual bar, each with up to 4 colour sections |
| R4.4 | 4 sections use design tokens: Earnings (`chart-earnings`), Receivables (`chart-receivables`), External expenses (`chart-expenses-ext`), Fund contributions (`chart-expenses-fund`) | Given entries of each type exist, then each section renders with its correct design token colour |
| R4.5 | When filter = Fund X: bars represent Fund X transactions (contributions received, external expenses, inter-fund transfers); receivables section hidden | Given Fund X is selected, then the receivables colour section is absent |
| R4.6 | Legend footnote below chart using the same 4 token colours | Given the chart renders, then a legend footnote with 4 labelled colour swatches is visible |
| R4.7 | Chart horizontally scrollable on mobile | Given a 375px viewport, then the chart scrolls horizontally |

### R5 — Settings (Fund Management)

**Priority:** P1

| Req ID | Description | Acceptance Criteria |
|--------|-------------|---------------------|
| R5.1 | Settings accessible via gear icon in header (not a nav tab) | Given the user clicks the gear icon, then they navigate to the Settings page |
| R5.2 | Create fund with a name | Given a user submits a fund name, then the fund is created with the user as creator and first member |
| R5.3 | Add fund member by email | Given a fund creator enters an existing registered user's email, then that user is added to the fund |
| R5.4 | View fund member list (display name + email) | Given a fund member opens a fund in Settings, then all members are listed |
| R5.5 | Fund deletion not available (out of scope) | Given the Settings page renders, then there is no delete fund option |

### R6 — Data Model Extensions

**Priority:** P0 (required before UI changes)

| Req ID | Description | Acceptance Criteria |
|--------|-------------|---------------------|
| R6.1 | `earnings` table gains a `type` column: 'regular' \| 'receivable', default 'regular' | Given the migration runs, then all existing earnings have type = 'regular'; new entries can be set to 'receivable' |
| R6.2 | `expenses` table: replace `fund_id` (nullable FK) with `sender_type`, `sender_id`, `receiver_type`, `receiver_id` columns | Given the migration runs, then existing expenses with fund_id IS NULL become sender_type='user', receiver_type='none'; existing fund expenses become sender_type='user', receiver_type='fund', receiver_id=fund_id |
| R6.3 | Migration is reversible and tested in staging before production | Given the migration runs, then all pre-migration expense data is preserved and readable |

### R7 — Hard-Block Enforcement (updated)

**Priority:** P0

| Req ID | Description | Acceptance Criteria |
|--------|-------------|---------------------|
| R7.1 | Hard-block applies only when sender=myself (personal external expenses + contributions to funds) | Given sender=Fund X, then no hard-block is applied |
| R7.2 | Planned expenses (sender=myself) ≤ planned earnings for the month | Given planned earnings = X, when a planned expense would make total planned personal expenses > X, then the system rejects with an error |
| R7.3 | Actual expenses (sender=myself) ≤ actual earnings for the month | Given actual earnings = Y, when an actual expense would make total actual personal expenses > Y, then the system rejects with an error |
| R7.4 | Quick toggle (planned ↔ actual) re-evaluates hard-block for the new status | Given an expense is toggled from planned to actual, then the actual hard-block is re-evaluated before saving |

---

## Section 4: Non-Functional Requirements

### Performance
- Income Statement Table renders within 2 seconds for the rolling 12-month range
- Entry save (write + read-back): < 1 second

### Security
- Supabase Row Level Security (RLS): unchanged — users can only read/write their own earnings and expenses
- Fund data visible only to fund members (enforced via RLS policy on `fund_members`)
- No personal financial data accessible without a valid authenticated session

### Accessibility
- WCAG AA: 4.5:1 minimum contrast ratio for all text
- Table keyboard-navigable (Tab, Enter, Escape); popup accessible via keyboard
- All 4 chart colour tokens must individually meet WCAG AA against the chart background
- Minimum 44×44px touch targets on mobile

### Responsive
- Income Statement Table: horizontally scrollable on mobile (≥ 375px)
- Bar Chart Dashboard: horizontally scrollable on mobile

---

## Section 5: Constraints & Dependencies

| Constraint | Detail |
|-----------|--------|
| Currency | VND only; all amounts stored as integers (no decimals) |
| Auth | Supabase Auth + RLS — unchanged |
| Breaking schema change | `expenses` table migration must run before any UI changes are deployed |
| Design tokens | 4 new chart tokens must be added to Tailwind config before chart implementation |
| Month format | Stored as TEXT `YYYY-MM`; unchanged |

---

## Section 6: Risks & Assumptions

| Severity | Risk / Assumption | Mitigation / Owner |
|----------|-------------------|--------------------|
| CRITICAL | Schema migration for expenses (sender/receiver) touches all existing expense rows — data loss possible if rollback is not planned | Write reversible migration; test in staging with production data copy before deploying |
| HIGH | Rolling 12-month table with many named rows (>50 unique names) may be slow on initial load | Lazy-load rows or paginate if row count exceeds 50; measure render time in dev before launch |
| HIGH | Four chart colour tokens must meet WCAG AA against chart background | Validate contrast ratios for all tokens before implementing chart |
| ASSUMPTION | Month picker in Add form defaults to current month; user can change to any month | — |
| ASSUMPTION | When filter=Fund X in the bar chart, the receivables section is hidden (funds don't have receivables in MVP) | — |
| ASSUMPTION | Hard-block applies only to expenses where sender=myself; fund spending has no balance cap in MVP | — |

---

## Section 7: Developer Handoff

### Implementation Sequence

| Phase | Scope | Goal |
|-------|-------|------|
| Phase 1 | Schema migration (R6) | Extend earnings with `type`; restructure expenses with sender/receiver fields; migrate existing data |
| Phase 2 | API updates | Update POST/PATCH endpoints for new fields; update hard-block query to use sender_type='user' filter |
| Phase 3 | Income Statement Table component | New component: rolling 12 months, grouped rows, Planned/Actual view toggle |
| Phase 4 | Cell Edit Popup component | Popup anchored to cell; multi-entry list; Edit + Quick Toggle per entry |
| Phase 5 | Add Entry modal (2-tab form) | Replace existing EntryForm; Earning tab + Expense tab with sender/receiver fields |
| Phase 6 | Bar Chart Dashboard component | 4 colour sections, filter dropdown, legend footnote, 12-month range |
| Phase 7 | Settings page | Fund management at `/settings`; not in nav tabs |
| Phase 8 | Header update | Remove ripid.vn brand text; add gear icon linking to `/settings`; remove nav tabs |

### Critical Files to Modify

1. `financial-tracker/app/dashboard/page.tsx` — replace with single-page layout (table + chart)
2. `financial-tracker/app/earnings/page.tsx` — remove (consolidated into single page)
3. `financial-tracker/app/expenses/page.tsx` — remove (consolidated into single page)
4. `financial-tracker/app/funds/page.tsx` — repurpose as `/settings`
5. `financial-tracker/components/tracker/EntryForm.tsx` — rewrite as 2-tab modal
6. `financial-tracker/components/tracker/SummaryCard.tsx` — replace with IncomeStatementTable
7. `financial-tracker/components/ui/Nav.tsx` — remove nav tabs; add gear icon
8. `financial-tracker/types/index.ts` — update Earning (add `type`) + Expense (add sender/receiver fields)
9. `financial-tracker/tailwind.config.ts` — add `chart-earnings`, `chart-receivables`, `chart-expenses-ext`, `chart-expenses-fund` tokens
10. All API routes under `financial-tracker/app/api/` — update for new schema fields and hard-block query

### Updated Data Model

```
earnings
  id             UUID PK
  user_id        UUID FK → users.id
  month          TEXT NOT NULL          -- Format: "YYYY-MM"
  amount_vnd     INTEGER NOT NULL
  status         TEXT NOT NULL          -- "planned" | "actual"
  name           TEXT NOT NULL
  type           TEXT NOT NULL          -- "regular" | "receivable" (NEW)
  receiver_type  TEXT NOT NULL          -- "user" | "fund"
  receiver_id    UUID                   -- user_id or fund_id
  created_at     TIMESTAMPTZ
  updated_at     TIMESTAMPTZ

expenses
  id             UUID PK
  user_id        UUID FK → users.id     -- Who logged this expense
  month          TEXT NOT NULL          -- Format: "YYYY-MM"
  amount_vnd     INTEGER NOT NULL
  status         TEXT NOT NULL          -- "planned" | "actual"
  name           TEXT NOT NULL
  sender_type    TEXT NOT NULL          -- "user" | "fund" (REPLACES fund_id)
  sender_id      UUID NOT NULL          -- user_id or fund_id
  receiver_type  TEXT NOT NULL          -- "fund" | "none"
  receiver_id    UUID                   -- fund_id or NULL
  created_at     TIMESTAMPTZ
  updated_at     TIMESTAMPTZ

funds            -- unchanged
fund_members     -- unchanged
users            -- unchanged
```

### Success Validation

| Req | Test |
|-----|------|
| R2.5 | Given a user with "Salary" entries in 3 months, when viewing the Income Statement table, then 1 row "Salary" appears with correct amounts in each month column |
| R2.8 | Given a planned "Rent" entry and an actual "Rent" entry in the same month, when in Planned view, then the cell shows both with planned amount in light yellow; in Actual view only the actual amount appears |
| R3.5 | Given sender=myself and total planned expenses = planned earnings for the month, when saving one more planned expense, then the system returns a hard-block error |
| R4.4 | Given entries of all 4 types exist, when the chart renders, then each section uses its correct design token colour |
| R6.2 | Given the migration has run, when querying the expenses table, then no `fund_id` column exists and all rows have valid sender_type + sender_id values |

### Definition of Done

- [ ] Schema migrated; all existing data preserved and readable
- [ ] Single-page layout live: Income Statement Table + Bar Chart Dashboard on one page
- [ ] No nav tabs; gear icon in header opens Settings
- [ ] Add button opens 2-tab modal (Earning / Expense) with all fields per R3.2–R3.3
- [ ] Fund management functional from Settings (`/settings`)
- [ ] All 4 chart colour tokens render correctly; legend footnote present
- [ ] Hard-block enforces for sender=myself only; fund expenses have no cap
- [ ] Table and chart horizontally scrollable at 375px
- [ ] TypeScript compiles (`tsc --noEmit` passes)
- [ ] `npm test` passes with no regressions

---

## Section 8: v2.1 Changelog & Additions

**Baseline:** v2.0 deployed (income statement table, bar chart, receivables, sender/receiver expense model).

**v2.1 scope:** 10 post-deployment feedback items addressing navigation, chart redesign, income statement restructuring, bug fixes, and a DB migration.

### v2.1 Scope Boundaries

**IN SCOPE (v2.1)**
- "Tracker" brand text in nav (routes to `/dashboard`); Claude Code favicon
- Remove Settings gear icon; redirect `/settings` → `/dashboard`
- "Your Funds" section inline on dashboard (below chart)
- Rolling month navigation (← →) with `windowOffset` state; frozen first column
- Income statement split expenses into External Expenses + Fund Contributions + 3 Remaining rows
- Chart redesign: proportional stacking, single Actual/Planned toggle, new color scheme
- Entry form: responsive modal height, rename 'regular' → 'income'
- Edit entry from cell popup (edit icon → EntryForm in edit mode → PATCH)
- Toast notification system for all data mutations (add, edit, toggle, create fund)
- Bug fix: chart and table refresh after add entry without page reload

**OUT OF SCOPE (v2.1)**
- Fund deletion (deferred)
- Multi-currency (deferred)
- Push/email notifications (deferred)

### R-v2.1.1 — Navigation & Branding

| Req ID | Priority | Description | Acceptance Criteria |
|--------|----------|-------------|---------------------|
| RN1.1 | P1 | Add "Tracker" brand text in nav | Given any page, clicking "Tracker" routes to `/dashboard` |
| RN1.2 | P1 | Add Claude Code favicon | Browser tab and bookmarks show Claude Code icon |
| RN1.3 | P1 | Remove Settings gear icon from nav | Settings gear icon no longer visible in nav |
| RN1.4 | P1 | Redirect `/settings` to `/dashboard` | Direct navigation to `/settings` redirects immediately |

### R-v2.1.2 — Your Funds Inline

| Req ID | Priority | Description | Acceptance Criteria |
|--------|----------|-------------|---------------------|
| RN2.1 | P1 | Your Funds section on dashboard below chart | Fund cards visible on main page; no separate settings page |
| RN2.2 | P1 | Inline Create Fund button | Clicking "+ Create Fund" opens modal; works without page change |
| RN2.3 | P1 | Fund cards show name + contribution total | Each card shows fund name and actual contribution total from current window |

### R-v2.1.3 — Rolling Month Navigation

| Req ID | Priority | Description | Acceptance Criteria |
|--------|----------|-------------|---------------------|
| RN3.1 | P1 | Left/right arrows control `windowOffset` ± 1 | Clicking ← shifts columns 1 month into past |
| RN3.2 | P1 | Right arrow disabled at current month | → disabled when `windowOffset >= 0`; cannot navigate beyond current month |
| RN3.3 | P1 | Both table and chart synchronized to same months | Chart x-axis matches income statement columns at all times |
| RN3.4 | P1 | First column in income statement sticky during scroll | Name column stays fixed during horizontal scroll |

### R-v2.1.4 — Income Statement Remaining Rows

| Req ID | Priority | Description | Acceptance Criteria |
|--------|----------|-------------|---------------------|
| RN4.1 | P0 | Split expenses into External Expenses and Fund Contributions sections | `receiver_type='none'` → External Expenses; `receiver_type='fund'` → Fund Contributions |
| RN4.2 | P0 | Add Remaining row after Receivables | `Remaining = SUM(earnings) + SUM(receivables)` |
| RN4.3 | P0 | Add Remaining row after External Expenses | `Remaining = prev_remaining - SUM(external_expenses)` |
| RN4.4 | P0 | Add Remaining row after Fund Contributions (Net Income) | `Remaining = prev_remaining - SUM(fund_contributions)` |
| RN4.5 | P0 | Remaining rows highlighted with amber background and bold font | `bg-amber-50 font-semibold` visually distinct from standard rows |

### R-v2.1.5 — Chart Redesign

| Req ID | Priority | Description | Acceptance Criteria |
|--------|----------|-------------|---------------------|
| RN5.1 | P1 | Section title renamed to "Dashboard" | Chart section header reads "Dashboard" |
| RN5.2 | P1 | Single toggle: Actual \| Planned | Chart renders only selected dataset; no paired bars |
| RN5.3 | P1 | Proportional stacking: bar height = total income | Bar ceiling = earnings + receivables; expenses fill from bottom; remaining fills rest |
| RN5.4 | P1 | New color scheme: ext expenses #E8724A, fund #B84A20, remaining #4A9B8E | Each segment renders with correct color |
| RN5.5 | P1 | Overflow label when expenses > income | "+XM" label appears above bar; bar does not exceed income ceiling |

### R-v2.1.6 — Entry Form Improvements

| Req ID | Priority | Description | Acceptance Criteria |
|--------|----------|-------------|---------------------|
| RN6.1 | P2 | Modal scrollable on small screens | `max-h-[90vh] overflow-y-auto`; fits within 375px height device |
| RN6.2 | P2 | Earning type renamed 'regular' → 'income' in UI | Type toggle reads "Income" not "Regular" |
| RN6.3 | P2 | ⚠️ Breaking: DB migration `type='regular'` → `type='income'` | All existing earnings with type='regular' updated to 'income'; API validates 'income' or 'receivable' |

### R-v2.1.7 — Edit Entry from Cell Popup

| Req ID | Priority | Description | Acceptance Criteria |
|--------|----------|-------------|---------------------|
| RN7.1 | P1 | Edit icon (✎) on each entry in cell popup | Each entry has a visible edit icon |
| RN7.2 | P1 | Clicking ✎ opens EntryForm pre-filled in edit mode | Name, amount, status, month pre-filled from existing entry |
| RN7.3 | P1 | Edit form saves via PATCH endpoint | `PATCH /api/earnings/{id}` or `PATCH /api/expenses/{id}` |
| RN7.4 | P1 | Table and chart refresh after save; toast shown | Green toast on success; no full page reload |

### R-v2.1.8 — Toast Notifications

| Req ID | Priority | Description | Acceptance Criteria |
|--------|----------|-------------|---------------------|
| RN8.1 | P1 | Green toast on successful mutation (auto-dismiss 3s) | Add/edit/toggle/create fund success shows green toast |
| RN8.2 | P1 | Red toast on error (auto-dismiss 5s) | API errors show red toast with error message |
| RN8.3 | P1 | Toasts do not block interaction; stack if multiple | Toast stack visible in bottom-right; page remains interactive |

### R-v2.1.9 — Bug Fix: Chart Refresh After Add

| Req ID | Priority | Description | Acceptance Criteria |
|--------|----------|-------------|---------------------|
| RN9.1 | P0 | Month window computation moved into useMemo (derived from windowOffset) | `months` array is reactive to windowOffset changes |
| RN9.2 | P0 | `useEffect` deps include `[startMonth, endMonth]` | Changing windowOffset triggers data re-fetch |
| RN9.3 | P0 | Both income statement and chart update immediately after add | Given adding an entry for a visible month, chart AND table reflect new value without page reload |

### v2.1 Success Validation

| Req | Test |
|-----|------|
| RN3.1 | Click ← → verify columns shift; click → at current month → button disabled |
| RN4.2–4.4 | Add test entries; verify 3 Remaining rows show correct cumulative values |
| RN5.3 | Add expenses > earnings for a month → bar capped at income; "+XM" label appears |
| RN7.3 | Click ✎ in popup → EntryForm opens pre-filled → save → data updates without reload |
| RN9.3 | Add entry for visible month → verify chart AND table update immediately |

### v2.1 Breaking Changes

| Change | Impact | Migration |
|--------|--------|-----------|
| `earning.type = 'regular'` → `'income'` | UI, API validation, TypeScript types | Run `scripts/migrate-earning-type.ts` once after deploy |

---

_End of BRD v2.1_

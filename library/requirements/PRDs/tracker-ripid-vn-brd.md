# Business Requirements Document
# tracker.ripid.vn — Personal & Shared Financial Tracker

**Status:** Draft v1.0
**Date:** 2026-03-14
**Author:** Clarke / Business Analysis
**Stakeholders:** Product Owner (Clarke team)

---

## Section 1: Business Context

### Problem Statement

Young professionals in Vietnam manage personal finances in isolation — spreadsheets are powerful but have no social layer, and expense-splitting apps (Splitwise) handle settlement only, not forward planning. There is no lightweight tool that lets individuals track their own planned vs. actual income/expenses **and** participate in shared group expense pools with friends or a partner — all in one place, denominated in VND.

### Current State → Future State

| | Current State | Future State |
|---|---|---|
| Personal budget | Excel or mental accounting | Planned/actual dashboard per month |
| Shared expenses | Splitwise or WhatsApp group | Fund view with each member's contributions + group total |
| Constraint enforcement | None (overspend silently) | Hard block: expenses cannot exceed earnings for the month |
| Currency | Manual VND conversion | Native VND integer amounts |

### Target Users

- **Primary:** Vietnamese adults (20s–30s) managing personal monthly income and expenses
- **Secondary:** Small groups (couples, housemates, friend circles) with shared recurring costs (rent, utilities, groceries)

### Success Metrics

| Metric | Target |
|--------|--------|
| User can register and log first entry | < 3 minutes |
| Dashboard load time | < 2 seconds |
| Entry save time | < 1 second |
| Constraint enforcement accuracy | 100% — no entry violates earnings ceiling |
| Fund expense visible to all members | Immediate on save |

### Scope Boundaries

**IN SCOPE (MVP)**
- Email + password registration with display name
- Personal earnings (planned and actual) per month
- Personal expenses (planned and actual) per month with hard-block enforcement
- Shared funds: create fund, add members by email, log fund expenses, view group total
- Monthly navigator (any past or future month)
- Dashboard: planned totals, actual totals, net balance (earnings − expenses)
- VND only

**OUT OF SCOPE (MVP)**
- Push or email notifications
- Budget categories / tagging
- Data export (CSV, PDF)
- Mobile native app (iOS/Android)
- Fund creator removing members or deleting a fund
- Multi-currency support
- Analytics or insights beyond monthly summary

---

## Section 2: MECE Use Case Map

### Domain 1 — Identity & Access (UC1.x)

| ID | Use Case | Actor | Trigger |
|----|----------|-------|---------|
| UC1.1 | Register | Visitor | Clicks "Sign Up" |
| UC1.2 | Verify email address | Visitor | Receives Supabase verification email |
| UC1.3 | Log in | Registered user | Clicks "Log In" |
| UC1.4 | Log out | Authenticated user | Clicks "Log Out" |

### Domain 2 — Earning Management (UC2.x)

| ID | Use Case | Actor | Trigger |
|----|----------|-------|---------|
| UC2.1 | Create planned earning | User | Clicks "Add Earning" with status = planned |
| UC2.2 | Create actual earning | User | Clicks "Add Earning" with status = actual |
| UC2.3 | Toggle earning status | User | Clicks toggle on existing earning |
| UC2.4 | Edit earning | User | Edits description or amount |
| UC2.5 | Delete earning | User | Deletes own earning entry |

### Domain 3 — Personal Expense Management (UC3.x)

| ID | Use Case | Actor | Trigger |
|----|----------|-------|---------|
| UC3.1 | Create planned personal expense | User | Clicks "Add Expense" with status = planned |
| UC3.2 | Create actual personal expense | User | Clicks "Add Expense" with status = actual |
| UC3.3 | Toggle expense status | User | Clicks toggle on existing expense |
| UC3.4 | Edit personal expense | User | Edits description or amount |
| UC3.5 | Delete personal expense | User | Deletes own expense entry |
| UC3.6 | Hard-block enforcement | System | Triggered on every create/edit/toggle |

### Domain 4 — Fund Management (UC4.x)

| ID | Use Case | Actor | Trigger |
|----|----------|-------|---------|
| UC4.1 | Create a fund | User | Clicks "Create Fund" |
| UC4.2 | Add member by email | Fund creator | Enters existing user's email |
| UC4.3 | Add planned/actual fund expense | Fund member | Logs expense within a fund |
| UC4.4 | Toggle fund expense status | Fund member | Clicks toggle on own fund expense |
| UC4.5 | Edit / delete own fund expense | Fund member | Edits or deletes own fund expense |
| UC4.6 | View fund member list | Fund member | Opens fund detail |

### Domain 5 — Dashboard & Reporting (UC5.x)

| ID | Use Case | Actor | Trigger |
|----|----------|-------|---------|
| UC5.1 | View monthly summary | User | Loads dashboard |
| UC5.2 | Navigate months | User | Clicks previous/next month arrows |
| UC5.3 | Filter dashboard to one fund | User | Selects a fund from fund filter |

_MECE verification: Each use case belongs to exactly one domain. All described functionality is covered with no overlap._

---

## Section 3: Functional Requirements

### Domain 1 — Identity & Access

| Req ID | Priority | Description | Acceptance Criteria | Dependency |
|--------|----------|-------------|---------------------|------------|
| R1.1 | P0 | User registers with email, password, and display name | Given a visitor submits a unique email + password (8+ chars) + display name, when they submit, then a Supabase account is created and a verification email is sent | Supabase Auth |
| R1.2 | P0 | User must verify email before accessing app | Given a registered user with unverified email, when they attempt to log in, then they are redirected to a "check your email" page | R1.1 |
| R1.3 | P0 | User logs in with email and password | Given a verified user, when they submit correct credentials, then they are redirected to the current-month dashboard | R1.2 |
| R1.4 | P1 | User logs out | Given an authenticated user, when they click Log Out, then their session is cleared and they are redirected to the login page | R1.3 |

### Domain 2 — Earning Management

| Req ID | Priority | Description | Acceptance Criteria | Dependency |
|--------|----------|-------------|---------------------|------------|
| R2.1 | P0 | Create earning entry | Given an authenticated user on any month view, when they add an earning with amount (VND integer), status, and description, then the entry is saved and the monthly planned or actual earnings total updates immediately | R1.3 |
| R2.2 | P1 | Toggle earning status (planned ↔ actual) | Given an existing earning, when user toggles its status, then status changes and the amount stays the same | R2.1 |
| R2.3 | P1 | Edit earning | Given an existing earning owned by the user, when they update amount or description, then changes persist and monthly totals recalculate | R2.1 |
| R2.4 | P1 | Delete earning | Given an existing earning owned by the user, when they delete it, then the entry is removed and monthly totals recalculate | R2.1 |

### Domain 3 — Personal Expense Management

| Req ID | Priority | Description | Acceptance Criteria | Dependency |
|--------|----------|-------------|---------------------|------------|
| R3.1 | P0 | Create personal expense | Given an authenticated user, when they add a personal expense, then it is saved and monthly expense total updates | R2.1 |
| R3.2 | P0 | Hard-block: planned expenses ≤ planned earnings | Given a user with planned earnings = X, when they attempt to add/edit/toggle a planned expense that would make total planned expenses > X, then the system rejects the action with an error message | R3.1 |
| R3.3 | P0 | Hard-block: actual expenses ≤ actual earnings | Given a user with actual earnings = Y, when they attempt to add/edit/toggle an actual expense that would make total actual expenses > Y, then the system rejects the action with an error message | R3.1 |
| R3.4 | P1 | Toggle expense status (planned ↔ actual) | Given an existing personal expense, when user toggles its status, then status changes, amount stays the same, and hard-block is re-evaluated for the new status type | R3.2, R3.3 |
| R3.5 | P1 | Edit personal expense | Given an existing personal expense owned by the user, when they update amount or description, then changes persist, hard-block is re-evaluated | R3.2, R3.3 |
| R3.6 | P1 | Delete personal expense | Given an existing personal expense, when deleted, then entry is removed and monthly totals recalculate | R3.1 |

### Domain 4 — Fund Management

| Req ID | Priority | Description | Acceptance Criteria | Dependency |
|--------|----------|-------------|---------------------|------------|
| R4.1 | P1 | Create a fund | Given an authenticated user, when they create a fund with a name, then the fund is created with the user as its creator and first member | R1.3 |
| R4.2 | P1 | Add member to fund by email | Given a fund creator, when they add a member by entering an existing registered user's email, then that user is added to the fund and can see the fund on their next login | R4.1 |
| R4.3 | P1 | Log fund expense | Given a fund member, when they add a planned or actual expense to a fund for a given month, then the expense is saved, visible to all members in the fund view, and counted toward the member's personal monthly expense total (hard-block applies) | R3.2, R3.3, R4.1 |
| R4.4 | P2 | Toggle fund expense status | Given a fund expense owned by the user, when they toggle its status, then status changes, amount stays the same, hard-block is re-evaluated | R4.3 |
| R4.5 | P2 | Edit / delete own fund expense | Given a fund expense owned by the user, when they edit or delete it, then the change persists and fund group totals recalculate | R4.3 |
| R4.6 | P2 | View fund member list | Given any fund member, when they open the fund detail, then they can see all current members (display name + email) | R4.1 |

### Domain 5 — Dashboard & Reporting

| Req ID | Priority | Description | Acceptance Criteria | Dependency |
|--------|----------|-------------|---------------------|------------|
| R5.1 | P0 | Monthly summary dashboard | Given an authenticated user, when the dashboard loads, then it shows: planned earnings total, actual earnings total, planned expenses total, actual expenses total, planned net balance, actual net balance — all for the selected month | R2.1, R3.1 |
| R5.2 | P1 | Month navigator | Given any dashboard view, when user clicks previous or next month, then the dashboard reloads data for that month; default is the current calendar month | R5.1 |
| R5.3 | P2 | Fund filter view | Given a user who is a member of one or more funds, when they select a fund from the filter, then the dashboard shows: (a) the user's own contributions to that fund and (b) the group total for that fund — both for the selected month, side by side | R4.3, R5.2 |

---

## Section 4: Business Rules

| ID | Rule | Enforcement Point |
|----|------|-------------------|
| BR1 | Planned total expenses (personal + fund) ≤ planned total earnings per user per month | API layer + database constraint |
| BR2 | Actual total expenses (personal + fund) ≤ actual total earnings per user per month | API layer + database constraint |
| BR3 | "Total expenses" for a user = sum of personal expenses + sum of that user's fund expenses for the month | Query logic |
| BR4 | A fund member can only add, edit, or delete their own fund expense entries | Supabase RLS policy |
| BR5 | Adding a member to a fund requires their email to match an existing registered user | Validated at API boundary before insert |
| BR6 | All monetary amounts are stored in VND as integers (whole numbers only; no decimals) | Database: INTEGER type; frontend: integer validation |
| BR7 | If no earnings are entered for a month, the earnings total = 0; any expense entry for that month triggers the hard block | Derived from BR1/BR2 |
| BR8 | Toggling expense status does not change the amount — only the status field | Application logic |

---

## Section 5: Non-Functional Requirements

### Performance
- Dashboard load (server-rendered): < 2 seconds on standard 4G connection
- Entry save (write + read-back): < 1 second

### Security
- Supabase Row Level Security (RLS): users can only read/write their own earnings and expenses
- Fund data (expenses, member list) visible only to fund members (enforced via RLS policy on `fund_members`)
- No personal financial data accessible without a valid authenticated session
- Passwords managed entirely by Supabase Auth (never stored in application layer)

### Accessibility
- Mobile-first responsive layout (320px minimum viewport)
- WCAG AA target (4.5:1 contrast ratio for all text)
- All interactive elements keyboard-navigable (Tab, Enter, Escape)
- Minimum 44×44px touch targets on mobile

### Scalability
- MVP targets ≤ 100 users; Supabase free tier handles this comfortably
- Data model supports horizontal scaling with no schema changes for growth to 10,000 users

### Data Isolation
- Each user's earnings, personal expenses, and display name are private and inaccessible to other users
- Fund expense amounts are visible to all members of that fund only

---

## Section 6: High-Level Data Model

```
users
  id             UUID PK
  email          TEXT UNIQUE NOT NULL
  display_name   TEXT NOT NULL
  created_at     TIMESTAMPTZ

earnings
  id             UUID PK
  user_id        UUID FK → users.id
  month          TEXT NOT NULL          -- Format: "YYYY-MM"
  amount_vnd     INTEGER NOT NULL       -- VND whole number
  status         TEXT NOT NULL          -- "planned" | "actual"
  description    TEXT
  created_at     TIMESTAMPTZ
  updated_at     TIMESTAMPTZ

expenses
  id             UUID PK
  user_id        UUID FK → users.id     -- Who logged this expense
  fund_id        UUID FK → funds.id     -- NULL = personal expense
  month          TEXT NOT NULL          -- Format: "YYYY-MM"
  amount_vnd     INTEGER NOT NULL
  status         TEXT NOT NULL          -- "planned" | "actual"
  description    TEXT
  created_at     TIMESTAMPTZ
  updated_at     TIMESTAMPTZ

funds
  id             UUID PK
  name           TEXT NOT NULL
  created_by     UUID FK → users.id
  created_at     TIMESTAMPTZ

fund_members
  fund_id        UUID FK → funds.id
  user_id        UUID FK → users.id
  added_at       TIMESTAMPTZ
  PRIMARY KEY (fund_id, user_id)
```

**Design rationale:**
- `expenses` table unifies personal and fund expenses — `fund_id IS NULL` means personal. Simplifies the hard-block enforcement query (one sum across both types) and reduces query complexity on the dashboard.
- `month` stored as TEXT (`YYYY-MM`) for simple string-equality filtering and human-readable queries.
- All foreign keys enforced at the database level; RLS policies layer on top for row-level access control.

---

## Section 7: Lean Canvas Summary

| Dimension | Detail |
|-----------|--------|
| **Desirability** | Social budgeting gap: Splitwise = settlement only (no planning); Excel = powerful but no social layer; no Vietnamese-first tool with planned vs. actual tracking in a shared context |
| **Viability** | Zero infrastructure cost for MVP (Supabase free tier + Vercel free tier). Premium path via analytics, export, and category features post-MVP. Network effects within friend groups increase retention. |
| **Feasibility** | Standard web stack (Next.js 15 + Supabase) with well-documented patterns. 2–3 week MVP realistic for a single developer. No novel technical problems. |

---

## Section 8: Developer Handoff

### Implementation Sequence

| Phase | Scope | Goal |
|-------|-------|------|
| Phase 1 | Auth (UC1.1–1.4) | Users can register, verify, log in, log out |
| Phase 2 | Earnings (UC2.1–2.5) | Users can log planned/actual earnings per month |
| Phase 3 | Personal expenses + hard block (UC3.1–3.6) | Users can log expenses; hard-block prevents overspend |
| Phase 4 | Funds (UC4.1–4.6) | Users can create funds, invite members, log fund expenses |
| Phase 5 | Dashboard + navigation (UC5.1–5.3) | Monthly summary, month navigator, fund filter view |

### Critical Acceptance Tests

| Req | Test |
|-----|------|
| R1.1 | Register with fresh email → account created, verification email received |
| R3.2 | With planned earnings = 5,000,000 VND and planned expenses = 4,900,000 VND, attempt to add a 200,000 VND planned expense → rejected with error |
| R3.3 | Same as above for actual amounts |
| R4.3 | Log 1,000,000 VND fund expense → (a) visible to all fund members in fund view, (b) counted in user's personal total for hard-block |
| R5.1 | Dashboard shows correct planned/actual earnings, expenses, and net balance after adding 3 entries of each type |

### Key Files to Create (New Project)

1. `supabase/migrations/001_initial_schema.sql` — tables + RLS policies
2. `app/(auth)/register/page.tsx` — registration form
3. `app/(auth)/login/page.tsx` — login form
4. `app/dashboard/page.tsx` — monthly summary dashboard
5. `app/api/earnings/route.ts` — CRUD for earnings
6. `app/api/expenses/route.ts` — CRUD for expenses (personal + fund) + hard-block
7. `app/api/funds/route.ts` — fund create, member add
8. `lib/supabase/client.ts` — Supabase client singleton
9. `lib/supabase/server.ts` — Supabase server-side client (for API routes)
10. `types/index.ts` — shared TypeScript interfaces

### Definition of Done

- [ ] All P0 requirements pass their acceptance tests
- [ ] All P1 requirements pass their acceptance tests
- [ ] Hard-block enforcement tested with boundary values (exact limit, +1 VND over limit)
- [ ] RLS policies verified: user A cannot read or write user B's data
- [ ] Dashboard loads in < 2 seconds on simulated 4G
- [ ] Mobile-first layout verified at 375px and 768px breakpoints
- [ ] No TypeScript errors (`tsc --noEmit` passes)
- [ ] Supabase RLS enabled on all tables (not just created — **enabled**)

### Stated Assumptions (for stakeholder review)

1. If a user has zero earnings for a month, the hard block prevents any expense entry until at least one earning is logged
2. Users can edit or delete their own entries (personal expenses, earnings, fund expenses)
3. Fund creator cannot remove members or delete a fund in MVP
4. Password reset is handled via Supabase's built-in email reset flow — no custom implementation needed
5. Fund expenses appear in the fund view filtered by month (same month navigator applies to all views)
6. There is no notification when a user is added to a fund — they discover it in-app on next login

---

_End of BRD v1.0_

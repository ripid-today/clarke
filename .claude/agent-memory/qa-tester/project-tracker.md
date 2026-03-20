---
name: tracker-app-context
description: Financial Tracker app testing context — auth constraints, stack, test setup
type: project
---

Tracker app is at `financial-tracker/` under the monorepo. It runs on port 3000 (`bun run dev`).

**Why:** App requires Supabase email/password authentication. No test credentials are stored in the codebase or .env.local. Dashboard tests require a live authenticated session.

**How to apply:** For dashboard acceptance tests, set TEST_EMAIL and TEST_PASSWORD env vars before running Playwright. The test file `tests/tracker-v22.spec.ts` uses these and skips cleanly when absent. All dashboard tests fall back to static code validation with file:line references when credentials are absent.

**Build:** `npm run build` passes cleanly (zero TypeScript errors, zero ESLint errors). One pre-existing build warning: deprecated `middleware` file convention (not a v2.2 regression).

**Test file:** `financial-tracker/tests/tracker-v22.spec.ts`
**Playwright config:** `financial-tracker/playwright.config.ts`

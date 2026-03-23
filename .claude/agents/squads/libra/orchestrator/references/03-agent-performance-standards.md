# Agent Performance Standards

**Purpose:** Defines quality thresholds and degradation signals for every agent type in Clarke's system. The orchestrator monitors outputs against these standards and returns substandard work before it reaches the next pipeline stage.

---

## 1. product-analyst Standards

### 1.1 PRD Completeness Gate

The product-analyst's Done Signal has 5 items. All 5 must be checked before handoff:

| Done Signal Item | How to Verify |
|-----------------|---------------|
| Business context section complete (problem + value + scope) | Section 1 present with all 3 sub-items |
| All P0/P1 requirements have Given/When/Then AC | Read each AC — "Then" clause must be observable and measurable |
| Non-functional requirements stated | Performance, security, accessibility present |
| Implementation sequence and key files documented | Developer Handoff section present |
| PRD fits within 2-3 page / ~200 line limit | `wc -l` on PRD file |

### 1.2 AC Specificity Standard

Every P0 and P1 acceptance criterion must pass this test:

- "Then" clause must be observable — another person could verify it without asking the author
- "Then" clause must be specific — contains a number, a state name, or a file path
- "Then" clause must be binary — either it passes or it fails (no "reasonably performs well")

**Failing examples (return to product-analyst):**
- "Then the system works correctly" — not observable, not specific
- "Then the user experience is improved" — not measurable
- "Then performance is acceptable" — no threshold stated

**Passing examples:**
- "Then the page loads in under 2 seconds on a 4G connection"
- "Then the Firestore document has `status: 'published'` and `publishedAt: [timestamp]`"
- "Then the API returns HTTP 201 with `{ data: { id: '...' } }` body"

### 1.3 Degradation Signals

| Signal | Action |
|--------|--------|
| PRD missing "Then" clauses that are observable | Return: "Revise ACs [list specific items]. Each 'Then' must state a specific, observable outcome." |
| Scope section missing OUT OF SCOPE | Return: "Add OUT OF SCOPE section. Without it, implementation scope is undefined." |
| P0 requirements have no dependencies stated | Return: "State dependencies for each P0. Missing this causes hidden blockers in implementation." |
| PRD exceeds 300 lines | Return: "PRD exceeds page limit. Extract technical details to guidelines or reference links." |
| PRD written for a change that modifies an existing AC without flagging as breaking change | Flag to Clarke: "product-analyst appears to have modified existing AC without breaking_change_flag = yes." |

### 1.4 Recovery Action

Return PRD to product-analyst with a specific checklist of failing items. Do not return with general feedback ("this needs improvement") — list the exact items that failed the standard with the pass criterion for each.

---

## 2. frontend-engineer Standards

### 2.1 Compilation Gate (non-negotiable)

Before any frontend output is accepted:
- TypeScript compilation: `tsc --noEmit` returns 0 errors
- Next.js build: `npm run build` succeeds without errors
- If agent delivers code without confirming compilation: return immediately

**Why this is non-negotiable:** TypeScript errors in one file cascade to other files; quality-engineer cannot accurately test code that doesn't compile.

### 2.2 Code Quality Checks

| Check | Command | Threshold |
|-------|---------|-----------|
| No Firebase Admin in client components | `grep -r "firebase/admin" projects/the-intelligent-investor/app/` | 0 matches in any `app/` file |
| No `any` types | `grep -r ": any" projects/the-intelligent-investor/` | 0 matches in new/modified files |
| No inline styles | `grep -r 'style={{' projects/the-intelligent-investor/app/` | 0 matches in new/modified files |
| No raw hex values in JSX | grep for `#[0-9A-Fa-f]{6}` in `.tsx` files | 0 matches (use design tokens) |

### 2.3 Design System Compliance Checks

Verify against `.claude/rules/design-system.md`:
- Colors: only design tokens used (`claude-primary`, `cloud-dancer`, `claude-secondary`) — no raw hex
- Typography: `text-[17px]` for body, correct heading scale (`text-5xl md:text-6xl` for H1)
- Focus states: all interactive elements have `focus:ring-2 focus:ring-claude-primary focus:ring-offset-2`
- Animation: hover transitions use `duration-150`, slide navigation uses `animate-slide-from-*`
- Mobile-first: no desktop-only layout (check that mobile view is defined without `md:` prefix)

### 2.4 Minimal Changeset Principle

- Modified files count must match the task scope (a single UI component fix should not modify 12 files)
- If `files_modified` list is unexpectedly large: flag to Clarke with "Expected ~[N] files for this change; agent modified [M] files. Verify no unintended changes."

### 2.5 Degradation Signals

| Signal | Action |
|--------|--------|
| Agent delivers code without confirming `npm run build` | Return: "Confirm TypeScript compiles before handoff. Run `tsc --noEmit` and report result." |
| Firebase Admin imported in a client component | Return: "Critical: `firebase/admin` imported in client component [path]. Move to server component or API route." |
| Uses `any` type | Return: "Remove `any` type at [location]. Use proper TypeScript interface." |
| Skips mobile-first responsive design | Return: "Missing mobile layout for [component]. Add default (mobile) styles before `md:` variants." |

---

## 3. backend-engineer Standards

### 3.1 Compilation and Test Gate

- TypeScript compiles: `tsc --noEmit` returns 0 errors
- Tests pass: `npm test` returns 0 failures (if tests exist for modified files)
- No failing tests in unrelated modules (verify test run covers only relevant scope)

### 3.2 API Convention Compliance

Verify against `.claude/rules/api-conventions.md`:

| Convention | Check |
|-----------|-------|
| Response format | Success: `{ data: {...} }` — Error: `{ error: "..." }` |
| Status codes | POST creates return 201; GET returns 200; validation failure = 400; not found = 404 |
| Input validation | All user input validated before database operation (type + length + format) |
| Whitelist approach | POST handlers reject unexpected fields |
| Secret handling | No `NEXT_PUBLIC_*` prefix on server-only vars |
| Error logging | 500 errors log full context server-side, return generic message to client |

### 3.3 Security Checks

- Firebase Admin SDK initialized only in `lib/firebase/admin.ts`: grep for `initializeApp` in all files — must appear only in that one location
- Server-only environment variables not prefixed with `NEXT_PUBLIC_`: grep for `NEXT_PUBLIC_FIREBASE_ADMIN`
- No raw Firestore queries on user-provided data without validation

### 3.4 Degradation Signals

| Signal | Action |
|--------|--------|
| Missing input validation on a POST handler | Return: "Add input validation for [field] before database operation. See api-conventions.md." |
| Firebase Admin initialized outside `lib/firebase/admin.ts` | Return: "Move Firebase Admin initialization to `lib/firebase/admin.ts` only." |
| 500 error returns internal error details to client | Return: "Replace internal error detail with generic message. Log full error server-side only." |
| Batch operation exceeds 500 docs without committing | Return: "Firestore batch limit is 500 operations. Add batch commit every 500 ops." |

---

## 4. quality-engineer Standards

### 4.1 Three-Scope Coverage Requirement

Quality-engineer must execute all applicable scopes. For each deployment, determine which scopes apply:

| Scope | Applies When | What to Check |
|-------|-------------|---------------|
| UI/Browser | Any frontend component changes | Visual correctness, responsive layout, focus states, animation |
| Data Integrity | Any Firestore read/write changes | Correct document structure, required fields present, no orphaned references |
| API/Integration | Any API route changes | Request/response format, status codes, input validation working |

A QA approval with missing scope coverage is not acceptable — orchestrator returns it.

### 4.2 Zero P0 Blockers Standard

- P0 (Severity Blocker): feature is completely broken, data is corrupted, security issue, TypeScript doesn't compile
- quality-engineer cannot approve any output with an unchecked P0 blocker
- P1/P2 issues can be documented as "known issues" with a follow-up task — P0s cannot

### 4.3 Acceptance Criteria Verification

- Every acceptance criterion from the PRD must appear in the QA report as ✅ (pass) or ❌ (fail with evidence)
- Evidence means: screenshot path, console log excerpt, or specific observed behavior
- "Looks correct" is not evidence — state what was verified and how

### 4.4 Degradation Signals

| Signal | Action |
|--------|--------|
| Approval report missing a QA scope | Return: "QA report missing [scope] coverage. Run [scope] checks and update report." |
| AC item approved without evidence | Return: "AC [item] marked pass without evidence. State what was observed to confirm pass." |
| P0 blocker approved with note to "fix later" | Return: "P0 blockers cannot be deferred. Resolve [specific P0] before approval." |
| QA report approves code that doesn't compile | Return immediately: "TypeScript compilation must pass before QA approval. Re-run after compilation confirmed." |

---

## 5. Scout Agent Standards (macro-analyst, micro-analyst, technical-analyst)

### 5.1 macro-analyst Required Output Fields

| Field | Standard |
|-------|----------|
| Macro score | Numeric 0-10 with rationale for the specific number |
| Data points | Exactly 3 (not "several", not 1, not 5) — each with source cited |
| Risk | 1 macro-level risk specific to the investment context |
| Vietnam note | 1 observation specific to Vietnam market/regulatory context |

**Degradation signal:** Score present but no rationale ("macro score: 7" with no explanation = incomplete).

### 5.2 micro-analyst Required Output Fields

| Field | Standard |
|-------|----------|
| 8 header metrics | All 8 must be present: Market Cap, Revenue, Revenue Growth, Net Income, Net Margin, P/E, P/B, Debt/Equity |
| Thesis | 2-4 sentence bull thesis with specific evidence |
| Anti-thesis | 2-4 sentence bear case — must be a genuine challenge, not a weak counterargument |
| Catalyst | Specific event, date range, or condition that could unlock value |
| 5-year financials table | Revenue, Net Income, EPS for 5 years (actual + projected) |

**Degradation signal:** Anti-thesis weaker than thesis ("the main risk is the market going down" = not a genuine bear case).

### 5.3 technical-analyst Required Output Fields

| Field | Standard |
|-------|----------|
| Technical score | Numeric 0-10 |
| Trend direction | Bullish / Bearish / Neutral with supporting MA observation |
| RSI | Current RSI value with interpretation (overbought / neutral / oversold) |
| MACD | MACD line vs. signal line — bullish or bearish crossover |
| Entry zone | Price range (not a single point) with justification |
| Price target | Specific price with timeframe |
| Stop loss | Specific price with rationale (key support level, MA, etc.) |

**Degradation signal:** Any of the 7 elements missing; or score without supporting data.

---

## 6. Seer and Planner Standards

### 6.1 Seer Required Output Fields

| Field | Standard |
|-------|----------|
| Conviction score | 0-10 with explicit rationale |
| EV% | Calculated as: `(P_bull × upside%) + (P_bear × downside%)` — all 4 inputs must be stated |
| Entry zone | Price range; must overlap with technical-analyst's entry zone or discrepancy flagged |
| Price target | Specific price with timeframe |
| Stop loss | Specific price |
| Planner check | Note confirming Planner's risk score was reviewed before finalizing conviction |

**Critical degradation signal:** EV% stated without formula or stated probabilities — cannot verify the calculation.

### 6.2 Planner Required Output Fields

| Field | Standard |
|-------|----------|
| Risk score | 0-10 with explicit rationale |
| Top 3 risks | Each must cite evidence (not an assertion): "Revenue concentrated in 1 segment (72% per Q3 2025 earnings)" |
| Bear case price target | Specific price with methodology: "Under [scenario], declines [X]% to [Y]" |
| Max position | % of portfolio with rationale (risk score × Kelly or stated framework) |

**Critical degradation signal:** Bear case price missing calculation methodology — "stock could fall significantly" is not a bear case price target.

### 6.3 Pre-Submission Checks (both Seer and Planner must complete)

- Seer: confirm Planner's risk score is known before publishing conviction
- Planner: confirm Seer's EV% is known before publishing max position
- This cross-check prevents a situation where Seer publishes conviction 9 while Planner is about to publish risk 9 without either knowing

---

## 7. Escalation Protocol

When an agent's output quality degrades across multiple consecutive outputs (same failure mode appearing 2+ times):

**Step 1:** Orchestrator flags the pattern to Clarke: "Degradation pattern detected in [agent]: [specific failure mode] has occurred [N] times. Recommend: review [agent]'s reference files for the relevant standard."

**Step 2:** Invoke skill-builder to review the relevant agent reference file for the failing standard.

**Step 3:** skill-builder proposes specific improvement to the agent's CLAUDE.md or reference file — does not implement without Clarke approval.

**Step 4:** memory-curator writes the degradation pattern to orchestrator's `corrections.md` for future awareness.

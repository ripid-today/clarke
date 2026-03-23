# Acceptance Criteria Evaluation

Quality-engineer's guide to converting PRD acceptance criteria into executable test cases, and producing structured pass/fail reports for Commander.

---

## Given/When/Then → Test Case Mapping

Every AC in the PRD follows the format: **Given [context], When [action], Then [observable outcome]**.

### Mapping Protocol

| AC Component | Test Case Element | How to Verify |
|---|---|---|
| Given [context] | Precondition | Set up environment matching the context |
| When [action] | Test step | Execute the described action |
| Then [outcome] | Assertion | Check the observable outcome directly |

### Example Mappings

**AC:** Given a published article exists, when I navigate to `/article/[slug]`, then the article title renders as an H1 and the word count is between 200-300 words.

| Element | Test Case |
|---|---|
| Precondition | Article with `status: "published"` exists in Firestore |
| Step | Navigate to `/article/[slug]` in browser at 1280px viewport |
| Assertion 1 | `<h1>` element contains exact article title |
| Assertion 2 | Article body word count >= 200 AND <= 300 |

**AC:** Given a daily brief pipeline run, when a brief already exists for today's date, then the pipeline skips publishing and logs "DUPLICATE_SKIPPED".

| Element | Test Case |
|---|---|
| Precondition | Firestore contains a brief with `date: today` |
| Step | Trigger pipeline run (via Trigger.dev test or direct function call) |
| Assertion | No new document created; log contains "DUPLICATE_SKIPPED" |

---

## AC Types and Verification Methods

| AC Type | Format Signal | Verification Method |
|---|---|---|
| **UI/Render** | "displays", "renders", "shows" | Browser snapshot at 1280px + 375px |
| **Data/Schema** | "field X = value Y in collection Z" | Direct Firestore read via Admin SDK |
| **API** | "endpoint returns status Y with schema Z" | curl or fetch test with response assertion |
| **Pipeline/Integration** | "pipeline does X when Y" | End-to-end trigger + Firestore state check |
| **Negative/Guard** | "does NOT", "prevents", "blocks" | Attempt the blocked action, verify rejection |

---

## AC Verification Checklist

Before marking any AC as PASS, confirm:

- [ ] Precondition is reproducible (not dependent on live data that changes)
- [ ] Action was performed exactly as specified (no shortcuts)
- [ ] Observable outcome matches the AC literally (not approximately)
- [ ] Tested at both desktop (1280px) and mobile (375px) for UI ACs
- [ ] Negative cases verified: the "Then" fails when the "When" is wrong
- [ ] Data ACs verified in Firestore directly (not just UI display)

---

## Approval Report Format

When all P0/P1 ACs pass and no P0 bugs are open:

```
## QA Approval Report — [FEATURE NAME]

**Date:** YYYY-MM-DD
**PRD Reference:** [PRD filename or link]
**Tested By:** quality-engineer

### Scope Covered
- [ ] UI/browser (desktop 1280px + mobile 375px)
- [ ] Data integrity (Firestore field validation)
- [ ] API/integration (Route Handlers + pipeline)

### AC Results

| AC ID | Description | Result | Notes |
|-------|-------------|--------|-------|
| AC-01 | [description] | PASS | — |
| AC-02 | [description] | PASS | — |

### Open Issues
None — all P0/P1 ACs pass.

### Decision
**APPROVED FOR DEPLOYMENT**

Handoff: Ready for Tinker dispatcher → production deploy.
```

---

## Bug Report Format

When any P0 AC fails, or a P1 bug is discovered during scope execution:

```
## QA Bug Report — [FEATURE NAME] — [SEVERITY]

**Date:** YYYY-MM-DD
**PRD Reference:** [PRD filename]
**Reported By:** quality-engineer

### Bug #[N]: [Short title]

**Severity:** P0 / P1 / P2 / P3
**AC Violated:** AC-[N] — [AC text]
**Scope:** UI / Data / API / Integration

**Reproduction Steps:**
1. [exact step]
2. [exact step]
3. [exact step]

**Expected:** [what the AC says should happen]
**Actual:** [what actually happened]
**Evidence:** [screenshot path, console output, Firestore read result]

**Blocking:** YES (P0) / NO (P1-P3)

---

### Decision
**BLOCKED — cannot approve until Bug #[N] is resolved.**

Return to: [frontend-engineer / backend-engineer] for fix.
```

---

## Severity Guide

| Severity | Definition | Example |
|---|---|---|
| **P0** | System broken, data corrupted, or security violation | Article data lost, admin key exposed in client bundle, pipeline creates duplicates |
| **P1** | Feature does not work but system stable | Word count validation missing, brief missing required field |
| **P2** | Feature works but UX degraded | Wrong font size on mobile, animation timing off |
| **P3** | Minor cosmetic issue | Border radius inconsistency, spacing 4px off |

**P0 bugs block approval.** P1 bugs block approval unless the PRD explicitly accepts the degraded behavior. P2/P3 bugs are logged but do not block.

---

## Out-of-Scope Rule

Never validate behavior not described in the PRD's acceptance criteria. If you discover an unrelated regression, log it in `memory/known-issues.md` as a separate item and flag it to Tinker dispatcher — do NOT block the current approval on it unless it is a P0 safety issue.

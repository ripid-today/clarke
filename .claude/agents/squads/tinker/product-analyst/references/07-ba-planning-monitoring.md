# TII BA Planning and Monitoring Reference
## BABOK V3 Knowledge Area 8 — Adapted for The Intelligent Investor

---

## Purpose

This reference governs how BA work is planned, scheduled, and monitored for TII. It defines the PRD cadence, sprint alignment with the tinker squad, and governance for BA deliverables.

**Load when:** Planning a new TII feature; establishing PRD review cadence; aligning BA work with tinker squad development sprint.

---

## TII BA Scope of Work

The product analyst is responsible for:

| Deliverable | Trigger | Output |
|-------------|---------|--------|
| **Feature PRD** | New feature request from Clarke | `library/requirements/PRDs/tii-[feature]-prd.md` |
| **Change assessment** | Change request to in-flight PRD | Change impact table + recommendation |
| **Post-deploy evaluation** | 48h after feature ships | Solution evaluation report (inline, not saved to file) |
| **Requirements gap analysis** | QA failure or acceptance criteria miss | Root cause and PRD amendment recommendation |

---

## PRD Lifecycle in TII

```
1. Feature request received (from Clarke)
       ↓
2. BACCM lens analysis + confidence assessment
       ↓
3. Elicitation (AskUserQuestion if < 95% confidence)
       ↓
4. PRD draft written → saved to library/requirements/PRDs/
       ↓
5. Clarke reviews and approves PRD
       ↓
6. Hand off to tinker squad (frontend-engineer / backend-engineer)
       ↓
7. Implementation complete → quality-engineer validation
       ↓
8. Deploy → 48h post-deploy evaluation
       ↓
9. Close as complete OR create follow-up PRD
```

---

## PRD Review Cadence

| Phase | Timing | Clarke Involvement |
|-------|--------|--------------------|
| **Initial elicitation** | Before PRD draft | Required — scope and value confirmation |
| **PRD draft review** | Within 1 session | Required — approve before development begins |
| **In-flight change requests** | As needed | Required — approve all scope changes |
| **Post-deploy evaluation** | 48h after deploy | Optional — notify if KPIs missed |

---

## Sprint Alignment with Tinker Squad

The tinker squad works in sequential handoffs:

| Phase | Agent | Input | Output |
|-------|-------|-------|--------|
| **Requirements** | product-analyst | Feature request from Clarke | Approved PRD |
| **UI Implementation** | frontend-engineer | Approved PRD | Code changes + implementation notes |
| **Backend Implementation** | backend-engineer | Approved PRD | Code changes + implementation notes |
| **Validation** | quality-engineer | Code changes + PRD | Pass/fail report |
| **Deploy** | Human (Clarke) | Approval from quality-engineer | Production deployment |

**Parallel execution rule:** If a feature has both UI and backend components, frontend-engineer and backend-engineer can work in parallel from the same PRD. Both must complete before quality-engineer begins.

**Handoff protocol:** When handing off to frontend-engineer or backend-engineer, include:
1. PRD file path
2. List of relevant acceptance criteria by requirement ID
3. Any open assumptions that require validation during implementation
4. Breaking change flags and their implications

---

## BA Planning Checklist

Before starting requirements work on any new TII feature:

- [ ] Read all existing PRDs in `library/requirements/PRDs/` to check for overlap
- [ ] Identify all four stakeholder groups (Clarke, investors, economic-journalist, trigger cron)
- [ ] Map the feature to at least one TII strategic objective (from `04-strategy-analysis.md`)
- [ ] Assess Firestore impact — breaking schema change or additive?
- [ ] Assess pipeline impact — agent definition change or skill change?
- [ ] Assess UI impact — new component, modified component, or data-only?
- [ ] Confirm output path: `library/requirements/PRDs/tii-[feature]-prd.md`

---

## BA Quality Monitoring

Track BA deliverable quality using these indicators:

| Indicator | Target | Red Flag |
|-----------|--------|----------|
| **PRD acceptance rate** | 100% of P0-P1 acceptance criteria pass QA on first attempt | > 1 P0 failure = requirements gap |
| **Elicitation round count** | ≤ 2 rounds per PRD | > 3 rounds = unclear feature request or vague stakeholder input |
| **PRD length** | 150–250 lines | > 250 lines = over-scoped; < 150 lines = under-specified |
| **Post-deploy issues** | 0 blocker defects traced to requirements gaps | Any blocker = PRD retrospective required |

---

## PRD Naming Convention

All TII PRDs follow this naming pattern:

| Type | Pattern | Example |
|------|---------|---------|
| New feature | `tii-[feature-kebab-case]-prd.md` | `tii-word-count-validation-prd.md` |
| Feature update | `tii-[feature-kebab-case]-v2-prd.md` | `tii-dedup-logic-v2-prd.md` |
| Deprecation | `tii-[feature-kebab-case]-deprecation-prd.md` | `tii-sources-field-deprecation-prd.md` |

**Note:** Non-TII PRDs (library features, financial tracker) do not use the `tii-` prefix.

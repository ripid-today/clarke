# PRD Template Reference

Full section-by-section template for writing 2-3 page PRDs. Load during Step 2 of the write-prd skill.

---

## Document Header

```markdown
# [Feature/Product Name] - Product Requirements Document

**Version:** X.Y.Z
**Date:** YYYY-MM-DD
**Status:** [Draft | Approved | In Progress]
**Timeline:** [Target delivery date]
**Stakeholders:** Product Owner: [Name], Tech Lead: [Name]
```

---

## Section 1: Business Context (0.5 pages max)

### Problem Statement
[2-3 sentences: What problem are we solving? Who experiences this pain?]

**Example:**
> Current design uses basic Inter font and minimal styling, reducing content credibility. Inconsistent field naming (Folder has "description", Article has "excerpt") complicates API usage and creates technical debt.

### Business Value
- **User Impact:** [1 sentence - how users benefit]
- **Business Impact:** [1 sentence - revenue/cost/efficiency gain]
- **Strategic Alignment:** [1 sentence - how this fits company OKRs/strategy]

**Example:**
> - **User Impact:** Improved visual design increases content credibility and readability
> - **Business Impact:** Simplified data model reduces technical debt, saves 2 dev-hours/week
> - **Strategic Alignment:** Aligns with Claude.ai aesthetic, reinforces AI-powered brand

### Scope Boundaries

**IN SCOPE:**
- [Feature/change 1]
- [Feature/change 2]

**OUT OF SCOPE:**
- [Explicitly NOT included 1]
- [Explicitly NOT included 2]

### Success Criteria

**Functional:**
- [ ] [Feature X works as specified] → *Validates REQ-001, REQ-002*

**Quality:**
- [ ] Zero P0 bugs post-deployment → *All requirements*
- [ ] [Performance metric: Lighthouse ≥90] → *Validates REQ-003*

**Timeline:**
- [ ] Deployed by [specific date] → *All requirements*

**Stakeholder:**
- [ ] Product Owner approval ≥4/5 rating → *Overall PRD success*

---

## Section 2: Requirements (1-1.5 pages max)

**LIMIT:** Max 5-8 functional requirements per PRD. If more, split into multiple PRDs.

### Acceptance Criteria Format Guide

```
- Functional behavior: Given [context], when [action], then [outcome]
- Data validation: Field X = value Y in table/collection Z
- UI validation: Element X displays with property Y (e.g., color #C15F3C)
- API validation: Endpoint X returns status Y with response schema Z
```

### Functional Requirements Template

```markdown
#### REQ-001: [Clear, Action-Oriented Title]

**Priority:** [P0-Critical | P1-High | P2-Medium | P3-Low]

**⚠️ BREAKING CHANGE:** [Yes - API contract | Yes - Database schema | Yes - UI behavior | No]

**Description:** [1-2 sentences: WHAT the system must do, not HOW]

**User Impact:** [1 sentence: How this benefits users]

**Acceptance Criteria:**
- [ ] [Specific, testable criterion 1]
- [ ] [Specific, testable criterion 2]

**Dependencies:** [REQ-XXX (reason) | None | External: System Name]

**Reference:** [Technical Guideline → Section Name for implementation details]
```

### Priority Definitions

- **P0-Critical:** Blocking, must complete before anything else, system broken without it
- **P1-High:** Must-have for MVP, core functionality, high user value
- **P2-Medium:** Should-have, enhances UX but not blocking
- **P3-Low:** Nice-to-have, add when resources available

### Breaking Change Flag — Use when:

- API contract changes (parameter rename/removal, response format change)
- Database schema changes (field rename/removal, type change)
- UI behavior changes (user flow modifications, breaking existing patterns)

### Example Requirement

```markdown
#### REQ-001: Implement Claude Color Palette

**Priority:** P1-High

**⚠️ BREAKING CHANGE:** No (backward compatible)

**Description:** Replace current color scheme with Claude.ai brand colors
(primary #C15F3C, secondary #B1ADA1, tertiary Cloud Dancer #F0EEE9).

**User Impact:** Users experience more professional, trustworthy interface
with warm color aesthetic.

**Acceptance Criteria:**
- [ ] All UI components use Claude color palette (primary for CTAs, secondary for borders)
- [ ] Color contrast meets WCAG AA standard (4.5:1 ratio for text)
- [ ] No hardcoded hex values in codebase (use Tailwind classes only)

**Dependencies:** None

**Reference:** Frontend Guideline → Section 1 (Design System → Color Palette)
```

### Non-Functional Requirements

**Performance:**
- [Specific metric: e.g., Page load time <2 seconds (Lighthouse LCP ≤2.5s)]

**Security:**
- [Requirement OR "No changes to current security model"]

**Accessibility:**
- [WCAG 2.1 AA compliance maintained]
- [Color contrast ≥4.5:1 for text on background]

**Scalability:**
- [Requirement OR "No scalability changes required"]

---

## Section 3: Constraints & Dependencies (0.25 pages max)

### Technical Constraints
- [Constraint 1: e.g., Must use Next.js 15, no framework change]
- [Constraint 2: e.g., Firestore batch limit 500 operations]

### Timeline Constraints
- **Deadline:** [Date with rationale if aggressive]
- **Critical Path:** [Sequential dependency chain, e.g., REQ-001 → REQ-004 → REQ-007]
- **Risk:** [If timeline is aggressive, state fallback plan]

**Example:**
> **Deadline:** 2026-02-23 (7 days)
> **Critical Path:** REQ-001 (colors) → REQ-002 (typography) → REQ-003 (components)
> **Risk:** If timeline pressure by Day 4, deliver P0-P1 only, defer P2-P3 to Week 2

### External Dependencies
- [Dependency 1: e.g., Google Fonts CDN for typography]

---

## Section 4: Risks & Assumptions (0.3 pages max)

### Top Risks (3-5 HIGH/CRITICAL only)

| Risk | Impact | Mitigation | Owner |
|------|--------|------------|-------|
| [Risk 1: e.g., Font licensing unavailable] | High | (1) Validate fonts before Day 1, (2) Identify fallback fonts | Frontend Dev |
| [Risk 2] | Critical | [2-3 actionable mitigation steps] | [Owner] |

**Impact Levels:**
- **Critical:** Site down, data loss, security issue
- **High:** Major functionality broken (>30% affected)

### Critical Assumptions (3-5 max)

| Assumption | Validation Status | Owner | Risk if Wrong |
|------------|-------------------|-------|---------------|
| [Assumption 1: e.g., Existing articles have excerpt ≤200 chars] | ⚠️ Must Validate Before Day 3 | Developer | Migration truncates content |
| [Assumption 2] | ✅ Validated | [Owner] | [Impact] |

**Validation Status:**
- ✅ **Validated** — Confirmed true
- ⚠️ **Must Validate Before [Date/Phase]** — Blocker if not validated
- ❌ **Invalid** — Assumption proven false, mitigation needed

---

## Section 5: Developer Handoff (0.4 pages max)

### Implementation Sequence

**Phase 1: [Component Name]** (Day 1-2)
- **Requirements:** REQ-001, REQ-002, REQ-003
- **Key Files:** `file1.ts`, `file2.tsx`
- **Blockers:** [⚠️ Must validate Assumption X before starting | None]
- **Validation:** [How to confirm phase complete]

**Phase 2: [Component Name]** (Day 3-4)
- **Requirements:** REQ-004, REQ-005
- **Key Files:** `file3.ts`, `file4.tsx`
- **Blockers:** [⚠️ Must validate Assumptions Y, Z]

**Phase 3: Testing & Deployment** (Day 5-7)
- Day 5: [Final requirements]
- Day 6: Manual QA (see Deployment Guideline)
- Day 7: Production deployment + validation

### Key Files to Modify (5-10 files max)

| File Path | What to Change | REQ Reference |
|-----------|----------------|---------------|
| `path/to/file1.ts` | [Brief description: 5-10 words] | REQ-001, REQ-002 |
| `path/to/file2.tsx` | [Brief description] | REQ-003 |

**Note:** This is NOT exhaustive. See Technical Guidelines for full file lists.

### Success Validation (1 test per P0-P1 requirement)

**Critical Tests:**
- [ ] **REQ-001 (P1):** [Test type] — [Specific validation procedure]
- [ ] **REQ-004 (P0):** [Test type] — [Specific validation procedure]

### Rollback Plan

**Rollback Triggers:**
- Production site down >5 minutes
- Critical data loss (articles missing, content corrupted)
- >50% of functionality broken

**Rollback Procedure:** See Deployment Guideline → Section 3 (Rollback Procedures)

**Quick Reference:**
1. Git revert commit + push to main (triggers auto-redeploy)
2. If data migration caused issue, restore Firestore from backup
3. Communicate rollback to Product Owner immediately

### Definition of Done

- [ ] All acceptance criteria met for P0-P1 requirements
- [ ] Zero P0 bugs, <3 P1 bugs (documented in issue tracker)
- [ ] Performance: Lighthouse score ≥90, page load <2s (measured on production)
- [ ] Accessibility: WCAG AA compliance (contrast checker passes)
- [ ] All critical validation tests pass (minimum 1 per P0-P1 requirement)
- [ ] Cross-browser testing complete (Chrome, Firefox, Safari, Edge)
- [ ] Stakeholder sign-off: Product Owner approval ≥4/5 rating

---

## Appendix (optional)

**Include only if:**
- Multiple PRD versions exist (Change Log)
- Domain-specific terminology needs definition (Glossary)
- Complex requirement relationships need mapping (Traceability Matrix)

### Change Log

| Version | Date | Changes | Approver |
|---------|------|---------|----------|
| 1.0.0 | YYYY-MM-DD | Initial draft | N/A |

### Glossary (only if needed)
- **[Term]:** [Definition]

### Traceability Matrix (only if complex)

| REQ-ID | User Story | Success Criterion | Critical Test |
|--------|------------|-------------------|---------------|
| REQ-001 | US-001 | Functional: Feature X works | Test 1 |

---

## Writing Guidelines

**DO:**
- Keep PRD to 2-3 pages (~150-250 lines)
- Use tables for constraints, risks, assumptions (scannable format)
- Reference Technical Guidelines for implementation details
- Include Breaking Change flags (alerts developer to migration needs)
- Add User Impact field (connects technical work to user value)
- Write testable acceptance criteria (specific, measurable, format-guided)

**DON'T:**
- Include market analysis, competitive benchmarking (not developer-relevant)
- Duplicate Technical Guideline content (color hex codes, font sizes, API templates)
- List all 36 files to modify (just 5-10 critical ones, rest in Guidelines)
- Write 50+ test scenarios (just 1 critical test per P0-P1 requirement)
- Add lengthy edge case sections (document critical ones, defer rest to Guidelines)

---

## Success Checklist

Before finalizing PRD, verify:
- [ ] PRD is 2-3 pages (~150-250 lines)
- [ ] All requirements have Priority, Breaking Change flag, User Impact, Dependencies, Technical Guideline reference
- [ ] Success Criteria maps to requirements (traceability)
- [ ] Acceptance criteria are testable (not vague "system works correctly")
- [ ] Risks have mitigation steps and owners (not just "monitor closely")
- [ ] Assumptions have validation status and risk-if-wrong (urgency driver)
- [ ] Developer Handoff includes implementation sequence, key files, success validation, rollback plan, Definition of Done
- [ ] No market analysis, no competitive benchmarking, no lengthy technical details
- [ ] References to Technical Guidelines added (Frontend/Backend/Deployment)

---

## Example PRD

See: `library/requirements/PRDs/design-system-update-prd.md` for a complete example following this template.

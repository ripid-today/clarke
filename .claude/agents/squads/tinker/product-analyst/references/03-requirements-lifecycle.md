# TII Requirements Lifecycle Reference
## BABOK V3 Knowledge Area 6 — Adapted for The Intelligent Investor

---

## Purpose

This reference governs how requirements change over time in TII — specifically for RSS feed changes, AI prompt evolution, Firestore schema migrations, and feature deprecations. TII is a living pipeline; requirements evolve as content sources, AI models, and investor needs change.

**Load when:** Handling a change request to an existing TII feature; assessing the impact of an RSS feed source change, AI prompt update, or Firestore schema migration.

---

## TII Change Request Types

| Change Type | Trigger | Typical Impact | Breaking Change? |
|------------|---------|----------------|-----------------|
| **RSS feed change** | New source added, existing source deprecated, URL changed | `index.ts` feed config, potential dedup noise | Usually No |
| **AI prompt evolution** | Brief quality issue, token budget change, model upgrade | `economic-journalist` agent definition, brief quality | Usually No |
| **Firestore schema migration** | New field required, field renamed, type changed | All existing documents, read/write code, TypeScript types | Often Yes |
| **UI component change** | Design refresh, accessibility fix, new data display | `app/page.tsx`, component files | Usually No |
| **Trigger.dev schedule change** | Timezone change, frequency change | `trigger.config.ts` cron expression | No |
| **Dedup logic change** | Accuracy improvement, false positive reduction | `economic-journalist` agent, brief-daily-news skill | No |

---

## Impact Assessment Checklist

For any TII change request, assess impact across:

### 1. Firestore Data Impact
- [ ] Does this change require adding, removing, or renaming a field?
- [ ] Does this change affect documents already in the database?
- [ ] Is a migration script required before code deploys?
- [ ] Will existing articles continue to render correctly after the change?

### 2. Pipeline Impact
- [ ] Does this change affect `index.ts` (Trigger.dev task definitions)?
- [ ] Does this change affect the `economic-journalist` agent definition?
- [ ] Does this change affect the `brief-daily-news` skill?
- [ ] Will the change cause duplicates on the next pipeline run?

### 3. UI Impact
- [ ] Does this change add, remove, or modify displayed fields?
- [ ] Does this change affect loading states or error states?
- [ ] Does this change affect mobile layout or responsive behavior?
- [ ] Are there empty states to handle if the data is absent?

### 4. API Impact
- [ ] Does this change add, remove, or modify API endpoints?
- [ ] Does this change alter response shapes consumed by the frontend?
- [ ] Are breaking changes backward compatible (old clients still work)?

---

## TII Migration Pattern (Schema Changes)

When a Firestore schema change is required:

1. Make the new field **optional** in TypeScript interfaces
2. Deploy code that reads BOTH old and new field (prefer new, fallback old)
3. Run migration script in Firestore batches of 500 documents max
4. Verify all documents have the new field
5. Make the new field required; remove the fallback
6. Deploy code using only the new field
7. Run cleanup script to remove the old field

**Critical rule:** Never deploy code that requires a new field before the migration has run. This is a P0-Critical dependency and must appear in the PRD Developer Handoff section.

---

## Requirement Baseline and Versioning

| Term | TII Application |
|------|-----------------|
| **Baseline** | An approved PRD is the requirement baseline — changes require a new PRD or an amendment |
| **Amendment** | For minor scope changes (< 20% of PRD), note the change in the original PRD with date and rationale |
| **New PRD** | For major scope changes (> 20% of PRD), create a new `tii-[feature]-v2-prd.md` |
| **Deprecation** | When removing a feature, create a `tii-[feature]-deprecation-prd.md` to document removal rationale and migration path |

---

## Change Request Assessment Template

Use this structure when Clarke requests a change to an in-flight PRD:

```
Change Request: [short description]
Requested by: Clarke (PO)
Date: [date]

Current State: [what the PRD currently specifies]
Proposed Change: [what Clarke wants instead]

Impact:
  - Firestore: [impact or None]
  - Pipeline: [impact or None]
  - UI: [impact or None]
  - API: [impact or None]

Recommendation: [Accept | Reject | Defer to v2]
Rationale: [why]
```

---

## Traceability Matrix Template

For each TII PRD, maintain a traceability matrix to track requirements through implementation:

| Requirement | Acceptance Criterion | Implementation File | Test | Status |
|-------------|---------------------|---------------------|------|--------|
| REQ-01 | Given/When/Then | `projects/the-intelligent-investor/...` | Passed / Failed | Open / Closed |

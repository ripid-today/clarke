# TII Solution Evaluation Reference
## BABOK V3 Knowledge Area 7 — Adapted for The Intelligent Investor

---

## Purpose

This reference governs how the product analyst assesses whether TII solutions are working — measuring brief quality, pipeline reliability, UI performance, and overall system health. Use this reference when assessing an existing solution's performance or validating that a proposed solution will meet success criteria.

**Load when:** Assessing brief quality or pipeline performance; writing success criteria for a PRD; post-deploy evaluation of a new feature.

---

## TII Solution Metrics

### Pipeline Metrics

| Metric | Definition | Target | Measurement Method |
|--------|-----------|--------|--------------------|
| **Run success rate** | % of daily pipeline runs that complete without error | 100% | Trigger.dev job history |
| **Brief generation rate** | % of fetched articles that produce a valid brief | ≥ 90% | Firestore article count / RSS article count |
| **Word count compliance** | % of briefs with 200–300 word count | 100% | Firestore query: filter wordCount < 200 OR > 300 |
| **Dedup accuracy** | % of runs where no duplicate articles are written | ≥ 95% | Manual spot check; title similarity query |
| **Publish latency** | Time from cron trigger to last article written | < 30 min | Trigger.dev task duration logs |

### Content Quality Metrics

| Metric | Definition | Target |
|--------|-----------|--------|
| **Brief coherence** | Brief reads as a standalone summary (no dangling references) | Qualitative — review sample briefs weekly |
| **Title accuracy** | Brief title matches the topic of the content | Qualitative — review 5 random briefs per week |
| **Topic coverage** | Number of distinct investment topics per day | ≥ 5 topics |
| **Source freshness** | % of articles sourced from today's RSS items | ≥ 80% |

### UI Metrics

| Metric | Definition | Target | Measurement Method |
|--------|-----------|--------|--------------------|
| **Homepage load** | Time to first contentful paint | < 2s | Next.js dev build + browser DevTools |
| **Mobile usability** | No overflow, readable text at 320px | Pass | Playwright snapshot at 320px width |
| **Empty state handling** | Correct empty state shown when no articles | Pass | Query with empty Firestore; verify UI |
| **Article card rendering** | Card displays title, date, word count badge | Pass | Visual inspection + Playwright snapshot |

---

## Performance Gaps vs. Solution Defects

| Type | Description | Resolution Path |
|------|-------------|-----------------|
| **Performance gap** | Solution works but KPI target not met | Iterate on solution (adjust prompt, add source, tune dedup) → create new PRD |
| **Solution defect** | Solution fails to meet acceptance criteria | Return to backend-engineer or frontend-engineer for bug fix |
| **Requirements gap** | Acceptance criteria didn't capture the real need | Create amendment PRD; update acceptance criteria |
| **External dependency failure** | RSS source went offline, AI API degraded | No code change needed; document in incident log |

---

## Post-Deploy Evaluation Template

After a TII feature ships, evaluate within 48 hours:

```
Feature: [feature name]
Deploy Date: [date]
PRD Reference: library/requirements/PRDs/tii-[feature]-prd.md

Acceptance Criteria Results:
- REQ-01: [Pass | Fail — reason]
- REQ-02: [Pass | Fail — reason]

KPI Results:
- [Metric name]: [actual] vs [target] — [Pass | Fail]

Issues Found:
- [Issue 1: severity, description]

Recommendation: [Close as complete | Return for fix | Create follow-up PRD]
```

---

## Limit Analysis for TII

Known TII system limits that affect solution feasibility:

| Constraint | Limit | Source |
|-----------|-------|--------|
| Firestore batch write | 500 operations per batch | Firebase docs / `database-schema.md` |
| Firestore document size | 1 MiB per document | Firebase docs |
| Trigger.dev task duration | See `trigger.config.ts` for configured limits | `trigger.config.ts` |
| AI brief token budget | Configured in `economic-journalist` agent definition | Agent definition |
| Next.js page caching | Static pages cached at edge (ISR for dynamic) | `next.config.ts` |
| RSS fetch frequency | Typically ≤ once per day per source | Trigger.dev cron schedule |

---

## Solution Assessment Checklist

Before recommending a solution in a PRD:

- [ ] Does the solution stay within Firestore batch limits (500 ops)?
- [ ] Does the solution stay within Trigger.dev task duration limits?
- [ ] Does the solution produce briefs within 200–300 word range?
- [ ] Does the solution handle empty RSS feeds gracefully?
- [ ] Does the solution handle Firestore write failures without silent data loss?
- [ ] Does the UI solution render correctly at 320px width?
- [ ] Does the UI solution show empty state when no articles exist?

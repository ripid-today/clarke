# Requirements Life Cycle Management Reference
## BABOK V3 Knowledge Area 4

---

## Purpose

This reference governs how requirements are traced, prioritized, changed, and approved throughout the initiative lifecycle. Requirements are not static artifacts — they evolve as understanding matures.

**Load when:** Impact analysis of a change request; building traceability between requirements and tests; prioritizing a requirement backlog; handling conflicting requirements.

---

## Traceability

Traceability is the ability to identify the origin of each requirement and track it forward through design, implementation, and testing.

### Traceability Lineage
```
Business Requirement → Stakeholder Requirement → Solution Requirement → Test Case
```
Every solution requirement must trace back to a stakeholder requirement, which traces back to a business requirement. Orphan requirements (no traceability to business need) are candidates for removal.

### Traceability Matrix

| REQ-ID | Business Need | Stakeholder Need | Solution Req | Test Case | Status |
|--------|---------------|-----------------|--------------|-----------|--------|
| REQ-001 | Reduce search time 50% | Filter by folder | API accepts folderId param | TC-001 | In Progress |

**Columns to maintain:**
- REQ-ID (unique identifier)
- Business Requirement it traces to
- Stakeholder Requirement it satisfies
- Dependent requirements (blocking/enabled-by)
- Test case or acceptance criterion
- Implementation status

### Impact Analysis
When a proposed change affects an existing requirement:
1. Identify all requirements that trace to the same business need
2. Identify all requirements that depend on the changed requirement
3. Identify all test cases that validate the changed requirement
4. Estimate rework effort across all affected artifacts

---

## Prioritization

### MoSCoW Method
| Category | Definition | Clarke Usage |
|----------|------------|--------------|
| **Must Have** | P0-Critical: blocking, system broken without it | Non-negotiable for release |
| **Should Have** | P1-High: core functionality, high user value | Include in MVP if feasible |
| **Could Have** | P2-Medium: enhances UX, not blocking | Include if time permits |
| **Won't Have** | P3-Low or explicitly deferred | Document for future consideration |

### Business Value Scoring
When stakeholders disagree on priority, use a scoring model:
- Business Value (0–5): Impact on revenue, user satisfaction, or strategic goals
- Complexity (0–5): Estimated implementation effort (inverse — higher complexity = lower score)
- Risk (0–5): Probability × impact if not done (higher risk = higher priority)
- Score = Business Value × 2 + Risk − Complexity

### Dependency Mapping for Prioritization
Always prioritize blockers before the requirements they enable:
- If REQ-003 cannot be built until REQ-001 is complete, REQ-001 gets the same or higher priority
- Document enabling dependencies explicitly in the PRD's Developer Handoff section

### Kano Model (for UX-sensitive requirements)
| Category | Characteristic | Priority |
|----------|----------------|----------|
| **Basic (Must-be)** | Users expect it; absence causes dissatisfaction | P0-P1 |
| **Performance** | More = better; users actively value this | P1-P2 |
| **Delighter** | Unexpected; no dissatisfaction if absent, delight if present | P3 |

---

## Change Control

### Change Request Framework
When a change to a baselined requirement is proposed:

1. **Describe the change:** What specifically is being changed and why?
2. **Impact analysis:** Which requirements, designs, and test cases are affected?
3. **Effort estimate:** What additional work does this require?
4. **Risk assessment:** What risks does this introduce or mitigate?
5. **Recommendation:** Approve, defer, or reject with rationale

### Scope Management Signals
Watch for these as signals that scope is creeping:
- New requirements appear in Developer Handoff that weren't in Section 2
- "Small" additions accumulate to material scope expansion
- Acceptance criteria broaden after approval without formal change request
- Requirements evolve from "what" to "how" (prescribing implementation)

### Approving Requirements
**Formal approval required for:** All P0-P1 requirements before development begins
**Informal approval sufficient for:** P2-P3 requirements, minor clarifications

**Baselining:** Once requirements are formally approved, changes require a change request. Communicate this to stakeholders before baselining — it sets expectations for the change control process.

---

## Reuse and Version Control

- Reference existing PRDs rather than re-specifying shared requirements
- When a requirement from a prior PRD applies to the current initiative, link to it: "REQ-001 (this PRD) depends on REQ-003 from design-system-update-prd.md"
- Version PRDs when major changes occur: v1.0 (initial), v1.1 (clarification), v2.0 (scope change)
- Store all versions in `library/requirements/PRDs/` — never overwrite without version increment

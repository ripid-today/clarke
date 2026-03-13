# BA Planning and Monitoring Reference
## BABOK V3 Knowledge Area 2

---

## Purpose

This reference governs how the BA plans and monitors the business analysis approach, stakeholder engagement, governance, information management, and performance. Planning done before any other BA work produces the frameworks that guide all subsequent tasks.

**Load when:** Starting a new project or initiative; defining the BA approach; setting up governance and change control; establishing information management practices.

---

## BA Approach Selection

### Predictive vs. Adaptive Spectrum

| Approach | Characteristics | When to Use |
|----------|----------------|-------------|
| **Fully Predictive** | All requirements upfront; detailed specs before development | Well-understood domain; stable requirements; regulatory compliance |
| **Hybrid** | Core requirements upfront; details refined per iteration | Known framework with evolving details (Clarke's standard approach) |
| **Fully Adaptive** | Requirements emerge through iteration; minimal upfront | Novel domain; high uncertainty; rapid market feedback needed |

**Clarke's Default:** Hybrid — PRD defines the feature boundary and P0-P1 requirements upfront; P2-P3 details refined through developer feedback.

### Approach Decision Tree

```
Is the domain well-understood?
  Yes → Are requirements likely to change significantly?
    No → Predictive (full PRD upfront)
    Yes → Hybrid (PRD for P0-P1 now; P2-P3 iterative)
  No → Adaptive (minimal PRD; iteration-by-iteration elicitation)
```

---

## Governance

### Decision Authority
Define who can decide what before a conflict arises:

| Decision Type | Authority | Escalation Path |
|---------------|-----------|----------------|
| Requirement prioritization | Product Owner | None (final authority) |
| Scope change | Product Owner + BA | None (joint decision) |
| Technical approach | Developer | BA (if conflicting with requirements) |
| Release decision | Product Owner | None |

### Change Control Process
1. Change requested (stakeholder or developer)
2. BA performs impact analysis (RALF Method: Requirements, Architecture, Labor, Financial)
3. BA presents options with recommendation
4. Product Owner approves / rejects / defers
5. PRD updated with version increment if approved

### Escalation Path
When BA cannot resolve an issue:
- Level 1: Raise with Product Owner (scope, priority conflicts)
- Level 2: Document as open assumption with validation deadline
- Level 3: Flag as CRITICAL risk in PRD Section 4

---

## Information Management

### Artifact Types for Clarke
| Artifact | Location | Format | Owner |
|----------|----------|--------|-------|
| PRD | `library/requirements/PRDs/` | Markdown | BA |
| Technical Guidelines | `library/guidelines/` | Markdown | Developer |
| Agent memory | `.claude/agent-memory/` | Markdown | Agent |
| Agent definitions | `.claude/agents/` | Markdown | BA/Product Owner |

### Repository Structure
- PRDs are the canonical requirements source — not chat logs, not code comments
- Technical Guidelines are the canonical implementation source — not PRDs
- When a requirement changes, update the PRD first; update code comments to reference PRD
- Never duplicate content across PRDs — link instead

### Naming Conventions
| Artifact | Convention | Example |
|----------|------------|---------|
| PRD | `[feature-name-kebab-case]-prd.md` | `article-search-filtering-prd.md` |
| Technical guideline | `[area]-guideline.md` | `frontend-guideline.md` |
| Agent definition | `[agent-name]/CLAUDE.md` | `business-analyst/CLAUDE.md` |

### Metadata Requirements for PRDs
Every PRD header must include:
- Version (X.Y.Z)
- Date (YYYY-MM-DD)
- Status (Draft | Approved | In Progress)
- Timeline (target delivery)
- Stakeholders (Product Owner, Tech Lead)

---

## BA Performance Measurement

### Requirements Stability Rate
= (Total requirements − Changed requirements after baseline) / Total requirements × 100%

**Target:** ≥85% stability (fewer than 15% of requirements change after formal approval)
**If below target:** Elicitation was insufficient; apply more collaborative/experimental techniques earlier

### Defect Escape Rate
= Defects found in production that trace to requirements gaps / Total production defects × 100%

**Target:** <10% of production defects trace to requirements gaps
**If above target:** Requirements were ambiguous or incomplete; improve acceptance criteria specificity

---

## BA Plan Checklist

Before starting any significant initiative, confirm:

- [ ] BA approach selected (predictive / hybrid / adaptive)
- [ ] Stakeholder register populated (all RACI roles identified)
- [ ] Communication plan defined (who receives what, when, how)
- [ ] Governance structure clear (who approves requirements, change requests)
- [ ] Information management plan set (where artifacts live, naming conventions)
- [ ] Elicitation plan drafted (techniques, sources, schedule)
- [ ] Performance measures defined (how BA work quality will be assessed)

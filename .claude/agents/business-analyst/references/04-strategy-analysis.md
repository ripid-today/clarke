# Strategy Analysis Reference
## BABOK V3 Knowledge Area 5

---

## Purpose

This reference governs how the BA identifies strategic needs, analyzes current and future state, and defines the change strategy. Strategy analysis answers "are we solving the right problem?" before "are we solving the problem right?"

**Load when:** Writing a business case; analyzing current state to justify a change; performing gap analysis; strategic justification is needed for a feature request.

---

## Current State Analysis

### Enterprise Capability Assessment
Before proposing a change, understand what currently exists:
- **Technical capabilities:** What does the current system do well? What are its constraints?
- **Process capabilities:** How do users accomplish goals today? What manual workarounds exist?
- **Data capabilities:** What data is available? What is missing? What is unreliable?

### SWOT Analysis (for significant changes)
| | Helpful | Harmful |
|---|---|---|
| **Internal** | Strengths | Weaknesses |
| **External** | Opportunities | Threats |

**Clarke application:** Use SWOT when evaluating whether to build a feature internally vs. use a third-party solution, or when a feature request has significant architectural implications.

### PESTLE (for regulatory or market-driven changes)
- **Political:** Regulatory requirements, governance constraints
- **Economic:** Cost implications, ROI requirements
- **Social:** User adoption factors, cultural considerations
- **Technical:** Technology constraints, integration complexity
- **Legal:** Compliance requirements, data privacy
- **Environmental:** Infrastructure constraints, sustainability

**Clarke application:** Lightweight PESTLE sufficient — focus on Technical and Legal dimensions for most library features.

### Capability Gap Identification
Gap = Future State Capability − Current State Capability

| Capability Area | Current State | Future State | Gap |
|----------------|---------------|--------------|-----|
| Search | Keyword-only | Filtered by folder | No folderId index |
| Performance | No caching | ISR + Firestore cache | Cache layer missing |

---

## Future State Definition

### Goals and Objectives
- **Goal:** Broad directional statement ("Improve content discoverability")
- **Objective:** Specific, measurable target ("Reduce time-to-find by 50% in 90 days")

Every PRD should have at least one measurable objective that defines success.

### Success Metrics / KPIs
| Metric Type | Example | Measurement Method |
|-------------|---------|-------------------|
| **Outcome metric** | 50% reduction in search time | User session analytics |
| **Leading indicator** | Filter usage rate ≥30% | Firebase Analytics event |
| **Quality metric** | Zero P0 search errors | Error logging |

### Potential Value Assessment
Before committing to a change:
- **Quantified value:** Revenue impact, cost savings, time saved per user
- **Qualified value:** User satisfaction, brand perception, strategic positioning
- **Value at risk:** What happens if we don't make this change?

---

## Risk Assessment

### Risk Identification Methods
1. **Historical review:** What went wrong on similar past initiatives?
2. **Stakeholder brainstorm:** "What could prevent this from succeeding?"
3. **Assumption flip:** Every critical assumption, if wrong, is a risk
4. **Dependency analysis:** Every external dependency is a potential risk

### Risk Matrix
| Risk | Probability (1-5) | Impact (1-5) | Score | Response |
|------|------------------|--------------|-------|----------|
| [Risk] | [P] | [I] | P×I | Accept / Mitigate / Transfer / Avoid |

**Score thresholds:**
- 15–25: Critical — must mitigate before development begins
- 8–14: High — mitigation plan required
- 1–7: Low — monitor, accept

### Risk Tolerance
For Clarke's library: Zero tolerance for data loss (Firestore documents), performance regression (Lighthouse <90), and security vulnerabilities. Moderate tolerance for UX gaps that can be iteratively improved.

---

## Change Strategy

### Solution Scope
Define the boundary between what the solution will and will not address:
- What user problems are explicitly in scope?
- What related problems are explicitly out of scope?
- What adjacent systems will be affected?

### Business Case Components
| Component | Content |
|-----------|---------|
| Problem statement | 2-3 sentences on current state pain |
| Proposed solution | High-level approach (not implementation details) |
| Expected value | Quantified or qualified benefit |
| Cost estimate | High-level effort (T-shirt size sufficient for early stages) |
| Risk summary | Top 3 risks with mitigation |
| Recommendation | Go / No-Go with rationale |

### Transition Planning
When the change requires moving from current to future state:
- What data migration is needed?
- What user communication is required?
- What rollback conditions should trigger reversal?

---

## Strategy-to-Requirement Traceability

Every requirement in a PRD should trace to a strategic objective:

```
Strategic Goal → Business Objective → Business Requirement → Solution Requirement
"Improve discoverability" → "50% search time reduction" → "Filter by folder" → "API accepts folderId param"
```

Requirements with no strategic traceability are candidates for deferral.

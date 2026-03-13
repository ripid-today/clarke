# Stakeholder Engagement Reference
## Cross-Cutting Knowledge Area

---

## Purpose

This reference governs how the BA identifies, analyzes, communicates with, and manages stakeholders throughout an initiative. Stakeholder failure is the most common cause of requirements failure — requirements written without adequate stakeholder engagement are requirements that will change.

**Load when:** Identifying who to involve in a new initiative; planning communication; managing conflicting stakeholder perspectives; RACI assignment needed.

---

## Stakeholder Categories

BABOK V3 defines stakeholders as groups or individuals with a relationship to the change, solution, or need:

| Category | Definition | Clarke Equivalent |
|----------|------------|-------------------|
| **Sponsor** | Authorizes work, provides funding, champion of change | Product Owner |
| **Customer** | Receives value from solution | Library readers / learners |
| **End User** | Directly interacts with solution | Readers using search/navigation |
| **SME (Domain)** | Provides domain expertise | Content author (Clarke) |
| **SME (Implementation)** | Provides technical expertise | Web developer |
| **Support** | Resolves issues post-deployment | Developer (post-launch) |
| **Regulator** | Imposes compliance requirements | WCAG AA (accessibility) |
| **Tester / QA** | Validates solution meets requirements | QA tester agent |

---

## Stakeholder Register

For each key stakeholder, maintain:

| Field | Content |
|-------|---------|
| Name / Role | Specific person or role |
| Category | From categories above |
| Interests | What they care about most |
| Influence | High / Medium / Low |
| Impact | How significantly they are affected |
| Communication preference | Format, frequency, channel |
| Approval authority | What they can approve/veto |

---

## RACI Matrix

Assign one RACI role per deliverable per stakeholder:

| Role | Definition | Clarke Usage |
|------|------------|--------------|
| **Responsible** | Does the work | BA (requirements), Developer (code) |
| **Accountable** | Owns the outcome; approves the deliverable | Product Owner |
| **Consulted** | Provides input; two-way communication | SME, QA Tester |
| **Informed** | Receives output; one-way communication | End users (via release notes) |

**Common RACI Mistakes:**
- Multiple Accountable per deliverable (only one A per row)
- Responsible and Accountable same person on all rows (defeats oversight)
- No Consulted for complex technical requirements (misses implementation constraints)

**RACI for BA Deliverables:**

| Deliverable | BA | Product Owner | Developer | QA Tester |
|-------------|----|--------------|-----------|----|
| PRD | R | A | C | C |
| Acceptance Criteria | R | A | C | R |
| Change Request | R | A | I | I |
| Test Plan | C | A | I | R |

---

## Power/Interest Grid

Plot each stakeholder on a 2×2 grid to determine engagement strategy:

```
HIGH POWER  │  Manage Closely      │  Keep Satisfied
            │  (high interest)     │  (low interest)
────────────┼──────────────────────┼───────────────
LOW POWER   │  Keep Informed       │  Monitor
            │  (high interest)     │  (low interest)
            └──────────────────────┴───────────────
              HIGH INTEREST          LOW INTEREST
```

| Quadrant | Strategy | Communication Frequency |
|----------|----------|------------------------|
| Manage Closely (high power, high interest) | Involve in all decisions; validate requirements with them | Weekly |
| Keep Satisfied (high power, low interest) | Brief on major milestones; escalate blockers | Bi-weekly |
| Keep Informed (low power, high interest) | Share progress; elicit detailed feedback | As needed |
| Monitor (low power, low interest) | Minimal communication | Major milestones only |

---

## Communication Planning

### Audience Calibration
| Stakeholder Type | What They Need | What to Avoid |
|-----------------|----------------|---------------|
| Executive sponsor | Business value, risks, blockers | Technical details, implementation decisions |
| Product owner | Requirements decisions, scope changes | Every minor issue |
| Developer | Precise, testable, complete requirements | Ambiguous AC, "TBD" fields |
| QA tester | Acceptance criteria, test scenarios | Business strategy context |

### Channel Guide
| Channel | Best For |
|---------|---------|
| AskUserQuestion (in-session) | Real-time gap filling during BA work |
| PRD document | Formal, async communication of requirements |
| Code comments / inline AC | Developer-specific clarification |
| Status summary | Milestone communication to sponsor |

---

## Conflict Management

When stakeholders have conflicting requirements or priorities:

### Tier 1: Facilitation (try first)
- Surface the conflict explicitly: "I'm hearing two different perspectives — let me describe both."
- Ask both parties to explain the business value behind their position
- Identify whether the conflict is on the solution or the underlying need
- Often, conflicting solutions serve the same need — redirect to shared need

### Tier 2: Negotiation (when facilitation stalls)
- Present objective criteria: business value scores, effort estimates, risk data
- Ask: "Given these data points, which option better serves the business objective?"
- Propose a compromise that partially satisfies both
- Document the compromise and the rationale

### Tier 3: Escalation (when negotiation fails)
- Escalate to the Accountable stakeholder (Product Owner)
- Present the conflict, both positions, and your recommended resolution
- Do not leave conflicts unresolved in a PRD — every requirement needs a single, unambiguous specification

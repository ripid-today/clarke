# Stakeholder Analysis Reference
## Write PRD Skill — Reference 05

---

## Purpose

PRDs are written for stakeholders. Understanding who they are, what they need, and how to communicate with them ensures the PRD lands effectively and requirements get approved.

**Load when:** Identifying who to involve in requirements sign-off; planning communication for the PRD; writing the Stakeholders line in the PRD header.

---

## Stakeholder Identification

### Categories Relevant to Clarke

| Category | Definition | Typical Roles |
|----------|------------|---------------|
| **Sponsor / Product Owner** | Authorizes the work; approves the PRD | Clarke (product owner) |
| **End User** | Directly uses the feature | Library readers |
| **Developer** | Implements the requirements | Web developer agent |
| **QA / Tester** | Validates the implementation | QA tester agent |
| **Content Owner** | Creates or manages library content | Clarke (author) |

### Stakeholder Register Fields

For each stakeholder, record:
- **Role/Name:** Who they are
- **Interest:** What outcome they care about
- **Influence:** High / Medium / Low (ability to affect the project)
- **Impact:** High / Medium / Low (degree they are affected by the change)
- **Communication need:** What they need to know and when

---

## RACI Matrix — BA Deliverables

| Deliverable | Product Owner | BA | Developer | QA Tester |
|-------------|-------------|-----|-----------|-----------|
| PRD (initial draft) | A | R | C | C |
| Acceptance criteria | A | R | C | R |
| PRD approval | A | C | I | I |
| Change request | A | R | I | I |
| Test plan | A | C | I | R |

**Key:** R = Responsible, A = Accountable, C = Consulted, I = Informed
**Rule:** Exactly one A per row. Multiple Rs are acceptable.

---

## Power/Interest Grid

Plot each stakeholder to determine engagement depth:

```
HIGH POWER  │  Manage Closely   │  Keep Satisfied
            │  high interest    │  low interest
────────────┼───────────────────┼──────────────────
LOW POWER   │  Keep Informed    │  Monitor
            │  high interest    │  low interest
            └───────────────────┴──────────────────
              HIGH INTEREST       LOW INTEREST
```

**Clarke typical mapping:**
- Product Owner → Manage Closely (high power, high interest)
- Library readers → Keep Informed (low power, high interest)
- Developer → Manage Closely (high power during implementation, high interest)
- QA Tester → Keep Informed (low power, high interest in test phase)

---

## Communication Planning

### What Each Stakeholder Needs from the PRD

| Stakeholder | Primary Need | What to Emphasize in PRD |
|-------------|-------------|--------------------------|
| Product Owner | Business value, scope clarity, risks | Section 1 (Business Context), Section 4 (Risks) |
| Developer | Precise, testable, complete requirements | Section 2 (Requirements), Section 5 (Handoff) |
| QA Tester | Acceptance criteria, edge cases | Acceptance Criteria in Section 2 |
| End User (via Product Owner) | Outcome, not implementation | User Impact field in each requirement |

### Communication Frequency by Quadrant

| Quadrant | Frequency | Format |
|----------|-----------|--------|
| Manage Closely | At each milestone (PRD draft → approved → in progress → complete) | Detailed review session |
| Keep Satisfied | Start and end of initiative | Summary only |
| Keep Informed | At completion | Release note |
| Monitor | Major milestones only | Optional FYI |

---

## Conflict Resolution for PRDs

When two stakeholders provide conflicting requirements:

### Step 1: Name the conflict explicitly
"I've heard two different requirements for [feature]: [Stakeholder A] needs [X] because [reason]; [Stakeholder B] needs [Y] because [reason]."

### Step 2: Trace to shared business objective
Often, conflicting solutions serve the same business need. Ask both:
"What business outcome are you trying to achieve with this requirement?"

### Step 3: Present options with business value analysis
| Option | Addresses A's Need | Addresses B's Need | Estimated Effort |
|--------|-------------------|-------------------|-----------------|
| Option A | ✅ Fully | ❌ No | Medium |
| Option B | ❌ No | ✅ Fully | Low |
| Option C (compromise) | ✅ Partially | ✅ Partially | High |

### Step 4: Escalate to Product Owner with recommendation
Never leave a PRD with two contradictory requirements. Document the resolution decision in the PRD.

---

## Stakeholder Communication in the PRD

### PRD Header (required)
```
**Stakeholders:** Product Owner: [Name], Tech Lead: [Name]
```

### Business Value Section — Stakeholder framing
- **User Impact:** Written for end users — "readers can now..."
- **Business Impact:** Written for sponsor — "reduces developer time..."
- **Strategic Alignment:** Written for executive audience

### Acceptance Criteria — Developer framing
Write acceptance criteria as if you are briefing the developer directly:
- Use system/API language (HTTP status codes, field names, endpoint paths)
- Include exact values, not approximations
- Test scenarios are developer-executable without business context

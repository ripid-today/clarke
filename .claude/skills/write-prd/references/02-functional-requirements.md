# Functional Requirements Reference
## Write PRD Skill — Reference 02

---

## Purpose

This reference governs how to write high-quality functional requirements for PRDs. Functional requirements define what the system must do — observable behaviors with specific actors, actions, and measurable outcomes.

**Load when:** Writing Section 2 of a PRD; requirements feel vague or compound; need to identify which requirement type to use.

---

## BABOK Requirement Types

Classify every requirement before writing it. Classification determines who approves it.

| Type | Definition | Question It Answers | Example |
|------|------------|---------------------|---------|
| **Business Requirement** | Why the organization is undertaking this change | "What business problem does this solve?" | "Reduce time-to-find library articles by 50%" |
| **Stakeholder Requirement** | What a specific stakeholder needs from the solution | "Who needs what from this?" | "Readers need to filter search results by folder" |
| **Solution Requirement (Functional)** | What the system must do — observable behavior | "What must the system do to meet the stakeholder need?" | "Search API must accept optional folderId filter" |
| **Solution Requirement (Non-Functional)** | Quality attribute — performance, security, accessibility | "How well must the system perform?" | "Search API P95 ≤500ms" |
| **Transition Requirement** | What's needed to move from current to future state (temporary) | "What migration or training is needed?" | "Rebuild search index to include folderId field" |

**PRD Focus:** PRDs primarily contain Solution Requirements (Functional and Non-Functional). Business and Stakeholder Requirements appear in Section 1 (Business Context). Transition Requirements appear in Section 5 (Developer Handoff).

---

## SMART Criteria for Requirements

Every functional requirement must be SMART:

| Criterion | Definition | Test |
|-----------|------------|------|
| **Specific** | States exactly one behavior; clear actor and action | Could a developer implement this without asking clarifying questions? |
| **Measurable** | Has a testable, observable outcome | Can a test be written with a binary pass/fail result? |
| **Achievable** | Feasible within technical and timeline constraints | Does it conflict with Technical Guidelines? |
| **Relevant** | Traces to a stakeholder need and business objective | If removed, does the business objective still fail? |
| **Time-bound** | Has a clear scope boundary (not open-ended) | Does it include appropriate scope limiters? |

---

## INVEST Criteria for User Stories

When requirements are expressed as user stories, apply INVEST:

| Criterion | Definition |
|-----------|------------|
| **Independent** | Can be built and tested without another story |
| **Negotiable** | Details can be refined; not a locked contract |
| **Valuable** | Delivers value to a specific stakeholder |
| **Estimable** | Developer can estimate effort without ambiguity |
| **Small** | Can be completed in one iteration |
| **Testable** | Has acceptance criteria that can be verified |

**Clarke User Story Format:**
> "As a [specific role — not generic 'user'], I need [specific capability] so that [measurable business value]."

**Good:** "As a library reader, I need to filter search results by folder so that I can focus on content relevant to the module I'm studying."
**Bad:** "As a user, I need better search so that I can find things faster."

---

## 8 Requirement Anti-Patterns

Recognize and fix these before finalizing a PRD:

| Anti-Pattern | Example | Problem | Fix |
|--------------|---------|---------|-----|
| **Compound requirement** | "The system shall filter and sort articles" | Two behaviors = two test cases; one might be deprioritized | Split into REQ-001 (filter) and REQ-002 (sort) |
| **Vague qualifier** | "Search results shall load quickly" | "Quickly" means different things to different people | "Search API P95 response ≤500ms" |
| **Implementation prescription** | "Use Elasticsearch for search" | Prescribes HOW, not WHAT; constrains developer options unnecessarily | "Search shall support full-text queries with ≤500ms P95 response" |
| **Passive voice ambiguity** | "Articles shall be displayed" | Who displays them? Under what conditions? | "The search results page shall display articles matching the query..." |
| **Missing actor** | "Filter results by folder" | No actor = untestable scope | "When a reader selects a folder filter, search results shall show only articles in that folder" |
| **Gold plating** | "Support 15 different sort options" | Exceeds stated business need; scope risk | Only specify what has explicit stakeholder demand |
| **Buried assumption** | "As per the current search model..." | Assumption hidden in requirement body | Surface as explicit Critical Assumption in Section 4 |
| **Untestable absolute** | "The system shall never return incorrect results" | "Never" is untestable | "The system shall return 0 articles when no articles match the query criteria" |

---

## Requirement Structure Template

Every functional requirement in a PRD follows this structure:

```
#### REQ-00X: [Clear, Action-Oriented Title]

**Priority:** [P0-Critical | P1-High | P2-Medium | P3-Low]

**⚠️ BREAKING CHANGE:** [Yes - API contract | Yes - Database schema | Yes - UI behavior | No]

**Description:** [1-2 sentences: WHAT the system must do, not HOW. Actor + Action + Outcome.]

**User Impact:** [1 sentence: How this improves the user's experience or job]

**Acceptance Criteria:**
- [ ] Given [context], when [action], then [specific, observable outcome]
- [ ] [Additional criteria if needed — each is atomic]

**Dependencies:** [REQ-XXX (reason) | None | External: System Name]

**Reference:** [Technical Guideline → Section Name]
```

---

## Priority Definitions

| Priority | Definition | When to Use |
|----------|------------|-------------|
| **P0-Critical** | System broken without this; blocking for all other work | Core functionality failures, data loss risks |
| **P1-High** | MVP must-have; core user value | Primary feature functionality |
| **P2-Medium** | Should-have; enhances experience but not blocking | Secondary features, edge case handling |
| **P3-Low** | Nice-to-have; defer if timeline tight | Convenience features, aesthetic improvements |

**Rule:** Max 2-3 P0 requirements per PRD. If everything is P0, nothing is P0.

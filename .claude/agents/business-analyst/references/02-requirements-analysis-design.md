# Requirements Analysis and Design Definition Reference
## BABOK V3 Knowledge Area 6

---

## Purpose

This reference governs how the BA structures, specifies, models, verifies, and validates requirements. It is the core KA for producing the actual requirement specifications that developers build from.

**Load when:** Writing functional requirements; writing a PRD; need to verify requirement quality.

---

## BABOK Requirement Types

Every requirement must be classified. Classification determines who approves it and what level of detail is needed.

| Type | Definition | Example |
|------|------------|---------|
| **Business Requirement** | Why the organization is undertaking the change. Stakeholder-agnostic. | "Reduce time to find relevant library articles by 50%" |
| **Stakeholder Requirement** | What a stakeholder needs from the solution. Actor-specific. | "As a reader, I need to filter articles by folder so I can focus on relevant content" |
| **Solution Requirement — Functional** | What the system must do. Specific, observable behaviors. | "The search API must accept a folderId filter parameter and return only articles in that folder" |
| **Solution Requirement — Non-Functional** | Quality attributes: performance, security, accessibility, scalability | "Search API P95 response time ≤500ms under load" |
| **Transition Requirement** | What is needed to move from current state to future state. Temporary. | "Existing search index must be rebuilt to include folderId as a filterable field" |

---

## Quality Criteria — Every Requirement Must Be

| Criterion | Question to Ask | Red Flag |
|-----------|----------------|----------|
| **Atomic** | Does this state exactly one testable thing? | "and" appears in the requirement |
| **Complete** | Is everything needed to understand it present? | Missing actor, action, or outcome |
| **Consistent** | Does it conflict with any other requirement? | Contradicts existing PRD or Technical Guideline |
| **Unambiguous** | Could this be interpreted in more than one way? | Vague qualifiers: "fast", "easy", "appropriate" |
| **Testable** | Can a developer write a pass/fail test for it? | No observable, measurable outcome |
| **Feasible** | Can this be built within constraints? | Contradicts Technical Guideline limits |
| **Necessary** | What breaks if we remove this requirement? | Nothing — requirement may be gold plating |

---

## Specifying Requirements

### Text-Based Specification (preferred for Clarke PRDs)
Use structured natural language:
- **Actor:** Who or what performs the action (user, system, API)
- **Action:** The observable behavior (verb phrase)
- **Outcome:** The verifiable result (measurable condition)

**Template:** "[Actor] shall [action] so that [outcome]"
**Example:** "The search API shall accept an optional `folderId` query parameter so that results are scoped to a single folder."

### When to Use Models Instead
Use visual models when:
- Process has 4+ decision points (use flowchart)
- Multiple actors exchange data (use sequence diagram)
- Complex state transitions exist (use state diagram)
- Data relationships are intricate (use ERD)

For Clarke (small team, rapid iteration): prefer text-based with one supporting diagram if truly complex.

---

## Verifying Requirements — Internal Review Checklist

Before presenting requirements to stakeholders, verify internally:

- [ ] Every requirement has an actor, action, and observable outcome
- [ ] No two requirements contradict each other
- [ ] No requirement contains the word "and" (compound = needs splitting)
- [ ] No vague qualifiers remain: fast, easy, appropriate, sufficient, adequate
- [ ] Every P0-P1 requirement has a Given/When/Then acceptance criterion
- [ ] Non-functional requirements include specific numeric thresholds (not "fast")
- [ ] All requirements reference a Technical Guideline section if implementation details are needed

---

## Validating Requirements — Stakeholder Sign-off Protocol

After internal verification, confirm with stakeholders:

1. **Paraphrase test:** Read the requirement aloud; ask "Is this what you meant?"
2. **Scenario walkthrough:** Walk through the acceptance criterion as a test scenario
3. **Negative test:** "If the system did NOT do this, what would happen to you?"
4. **Priority confirmation:** "If we can only deliver one, which has higher business value?"

**Formal sign-off (P0-P1 requirements):** Explicit approval from Product Owner before development begins.

---

## Requirements Architecture

### Packaging
Group requirements into logical packages:
- **Feature package:** All requirements for a single user-facing feature
- **Integration package:** All requirements for a system interface
- **Data package:** All requirements affecting data model or migration

### Dependency Mapping
Before writing Developer Handoff:
1. Identify blocking dependencies (REQ-001 must complete before REQ-002)
2. Identify enabling dependencies (REQ-001 unlocks optional REQ-003)
3. Identify conflict pairs (REQ-002 and REQ-005 modify the same component)

### Functional Decomposition
Break complex requirements hierarchically:
- Level 1: Feature (business requirement)
- Level 2: Capability (stakeholder requirement)
- Level 3: Behavior (solution requirement)
- Level 4: Rule (acceptance criterion)

---

## Design Options — Evaluating Alternatives

When a requirement can be met multiple ways, document options before recommending:

| Option | Description | Cost-Benefit | Tradeoff |
|--------|-------------|--------------|----------|
| Option A | [Approach] | [Estimated effort vs. value] | [What you gain vs. lose] |
| Option B | [Approach] | [Estimated effort vs. value] | [What you gain vs. lose] |

**Recommendation format:** "Option A is recommended because [specific business reason], accepting the tradeoff of [specific downside]. Option B is deferred because [reason]."

Do not present options without a recommendation — the BA's job is to recommend, not just enumerate.

---

## Anti-Patterns to Avoid

| Anti-Pattern | Example | Fix |
|--------------|---------|-----|
| Compound requirement | "The system shall filter and sort articles" | Split: REQ-001 (filter), REQ-002 (sort) |
| Vague qualifier | "The search shall be fast" | "Search API P95 ≤500ms" |
| Implementation prescription | "Use a Redis cache for search" | "Search results shall load within 500ms P95" |
| Missing actor | "Articles shall be displayed" | "The search results page shall display articles..." |
| Gold plating | "Support 15 filter combinations" | Only specify what has a stated business need |
| Buried assumption | "As per the current database schema..." | Surface as explicit assumption with validation status |
| Untestable absolute | "The system shall never fail" | "The system shall return a 503 with user-friendly message when Firebase is unavailable" |

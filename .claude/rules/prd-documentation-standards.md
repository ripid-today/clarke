---
path_scope: "library/requirements/PRDs/*.md"
description: "PRD writing standards for Clarke's Library - template structure, content boundaries, quality criteria"
---

# PRD Documentation Standards

## Key Principle

**PRD = WHAT to build + WHY it matters.** Technical Guidelines = HOW to implement.

## Template Structure (2-3 Pages, ~200 Lines Max)

### Section 1: Business Context (0.5 pages)
- Problem Statement (2-3 sentences)
- Business Value: User Impact, Business Impact, Strategic Alignment
- Scope Boundaries: IN SCOPE / OUT OF SCOPE
- Success Criteria: Functional, Quality, Timeline, Stakeholder

### Section 2: Requirements (1-1.5 pages)
- Max 5-8 functional requirements per PRD (split if more needed)
- Each requirement includes: Priority, Breaking Change flag, Description, User Impact, Acceptance Criteria, Dependencies, Technical Guideline Reference
- Non-functional: Performance, Security, Accessibility, Scalability

### Section 3: Constraints & Dependencies (0.25 pages)
- Technical constraints, timeline constraints, external dependencies

### Section 4: Risks & Assumptions (0.3 pages)
- Top 3-5 HIGH/CRITICAL risks with mitigation steps and owners
- Critical assumptions with validation status

### Section 5: Developer Handoff (0.4 pages)
- Implementation sequence (phased)
- Key files to modify (5-10 max)
- Success validation (1 test per P0-P1 requirement)
- Rollback plan reference
- Definition of Done

## Priority Definitions

- **P0-Critical:** Blocking, system broken without it
- **P1-High:** Must-have for MVP, core functionality
- **P2-Medium:** Should-have, enhances UX but not blocking
- **P3-Low:** Nice-to-have, add when resources available

## 95% Confidence Criteria (All Must Be Met)

1. Understand all requirements completely
2. Can write spec that fits 2-3 page template
3. Anticipate edge cases
4. Know acceptance criteria (testable, specific)
5. Clear on constraints and dependencies
6. Know what belongs in PRD vs Technical Guidelines

## What Does NOT Belong in PRD

- Market analysis, competitive benchmarking
- Detailed technical specs (color hex codes, font sizes, API templates)
- Code snippets, migration scripts
- Exhaustive file lists (just 5-10 critical ones)
- 50+ test scenarios (just 1 critical test per P0-P1 requirement)

## Acceptance Criteria Format Guide

- **Functional:** Given [context], when [action], then [outcome]
- **Data:** Field X = value Y in collection Z
- **UI:** Element X displays with property Y
- **API:** Endpoint X returns status Y with schema Z

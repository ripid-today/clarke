---
name: write-prd
description: "Concise guide for writing 2-3 page Product Requirements Documents (PRDs) that communicate WHAT to build and WHY. Technical details (HOW) belong in Technical Guidelines. Use when documenting product features, design changes, or content model updates — trigger phrases include 'write a PRD', 'document requirements', and 'define what we're building'. Use even if the user calls it a spec, requirements doc, or feature brief."
user-invokable: false
---

# Write PRD Skill

Write clear, actionable 2-3 page PRDs that give developers what they need and nothing more. PRD = WHAT to build and WHY; Technical Guidelines = HOW to implement.

---

## Step 1: Clarify Scope

Confirm the problem, users, and boundaries before writing anything — a PRD written without this is a PRD that gets revised twice.

1. Identify the **primary objective**: what problem is being solved and for whom?
2. Confirm **in scope vs. out of scope** — what will NOT be built is as important as what will
3. Ask targeted questions if any of these are unclear:
   - What is the trigger for this change? (user complaint, metric drop, strategic initiative)
   - Who are the affected users?
   - What does "done" look like? (functional, quality, timeline criteria)
4. Achieve ≥95% confidence before proceeding to drafting

**Confidence Scoring:** Clarity, Context, Capability, Precedent, Completeness (20% each). If <95%, use AskUserQuestion (max 5 questions per round, ordered by highest-impact gap, each with discrete options + "Other"). Load `references/06-elicitation-questions.md` for a curated question bank. Iterate until ≥95%.

---

## Step 2: Draft Using Template

Load `references/01-prd-template.md` and fill each section. Write to the template — not around it.

1. **Section 1: Business Context** — Problem Statement (2-3 sentences), Business Value, Scope Boundaries, Success Criteria
2. **Section 2: Requirements** — Max 5–8 functional requirements. Each needs: Priority (P0–P3), Breaking Change flag, Description, User Impact, Acceptance Criteria, Dependencies, Technical Guideline Reference
3. **Section 3: Constraints & Dependencies** — Technical, timeline, external
4. **Section 4: Risks & Assumptions** — Top 3–5 risks with mitigation steps and owners
5. **Section 5: Developer Handoff** — Implementation sequence (phased), key files (5–10 max), success validation (1 test per P0-P1 req), rollback plan reference, Definition of Done

**Key Principle:** PRD = Business Contract. Technical Guidelines = Implementation Playbook. Never duplicate guideline content in the PRD.

---

## Step 3: Apply Writing Checklist

Before finalizing, verify the PRD meets quality criteria. Fast to check — costly to skip.

**DO:**
- Keep PRD to 2-3 pages (~150-250 lines)
- Use tables for constraints, risks, and assumptions (scannable format)
- Reference Technical Guidelines for implementation details (don't copy content)
- Include Breaking Change flags on every requirement that needs them
- Write testable acceptance criteria (specific, measurable, format-guided)

**DON'T:**
- Include market analysis or competitive benchmarking
- Duplicate content from Technical Guidelines (hex codes, font sizes, API templates)
- List all files to modify — just 5–10 critical ones; rest lives in Guidelines
- Write 50+ test scenarios — 1 critical test per P0-P1 requirement is enough
- Leave acceptance criteria vague ("system works correctly")

---

## Step 4: Confirm with Stakeholder

Share the draft before marking it complete — a 5-minute review here prevents a week of rework.

1. Share the PRD draft with the Product Owner or requesting stakeholder
2. Ask: "Does this accurately capture the problem and requirements? Any missing scope or constraints?"
3. Incorporate feedback and finalize
4. Mark status as **Approved** in the document header

---

## Output

A 2-3 page (~150–250 line) PRD markdown file saved to `library/requirements/PRDs/[feature-name]-prd.md`, containing all 5 sections with complete requirements, acceptance criteria, risks, and a developer handoff section.

---

## Reference Index

| File | Contents | Load When |
|---|---|---|
| `references/01-prd-template.md` | Full PRD template with section-by-section examples, writing guidelines, and success checklist | Step 2: Drafting |
| `references/02-functional-requirements.md` | BABOK requirement types, SMART/INVEST criteria, user story format, 8 anti-patterns with before/after examples | Section 2: Writing functional requirements |
| `references/03-non-functional-requirements.md` | Clarke-specific performance thresholds (Lighthouse, API P95), security rules, WCAG AA contrast table, Firestore limits, NFR template | Section 2: Writing NFRs |
| `references/04-acceptance-criteria.md` | Given/When/Then anatomy, 5 BDD scenario patterns, 6 testability criteria, edge case library, Clarke-specific AC templates | All acceptance criteria writing |
| `references/05-stakeholder-analysis.md` | Stakeholder categories, RACI for BA deliverables, power/interest grid, communication planning, conflict resolution | PRD header, Business Value section |
| `references/06-elicitation-questions.md` | 55-question bank across 5 categories: functional (15), NFR (10), constraints (8), validation (10), edge cases (12) | Step 1: Clarifying scope; gap filling before ≥95% confidence |

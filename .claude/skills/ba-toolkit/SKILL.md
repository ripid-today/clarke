---
name: ba-toolkit
description: "Business analysis toolkit providing requirements analysis, gap identification, question generation, and documentation writing. Use when performing any business analysis task — trigger phrases include 'analyze requirements for...', 'write a spec for...', 'what am I missing from...', and 'help me define the scope of...'. Use even if the user frames it as a conversation or question rather than a formal analysis request."
user-invokable: false
---

# BA Toolkit

Extract, analyze, and document requirements with precision. This toolkit turns vague requests into clear, testable specifications by systematically analyzing what's needed, finding gaps, asking the right questions, and writing documentation developers can act on.

---

## Step 1: Analyze Requirements

Extract and structure requirements from a user request before doing anything else.

### Process

1. Parse user request to identify requirement type
   (new feature, enhancement, bug fix)
2. Extract core requirements as discrete, testable statements
3. Compare with existing requirements documents
4. Identify conflicts or overlaps with current specifications
5. Assess completeness against standard checklist

### Output

- Parsed requirements (numbered list)
- Requirement type classification
- Conflicts/overlaps identified
- Completeness assessment (percentage)

---

## Step 2: Identify Gaps

Find missing information and ambiguities before asking questions — so every question you ask is targeted and high-impact.

### Gap Checklist

Check each item and report gaps:

- [ ] User stories clear and complete?
- [ ] Acceptance criteria defined for each requirement?
- [ ] Edge cases considered (empty states, max limits)?
- [ ] Constraints specified (performance, security)?
- [ ] Dependencies identified (APIs, services, data)?
- [ ] Success metrics defined (how to measure "done")?
- [ ] Error handling defined (what happens when things fail)?
- [ ] Access control specified (who can do what)?

### Output

- List of gaps/ambiguities found
- Current confidence score with justification
- Recommended clarifications (prioritized by impact on confidence)

---

## Step 3: Generate Questions

Create specific, actionable clarifying questions when confidence is below threshold.

### Process

1. Identify specific gaps in understanding (from Step 2)
2. For each gap, formulate a targeted question:
   - Specific and actionable (not open-ended)
   - Provides context for why you're asking
   - Offers discrete options (A/B/C/D + "Other") when applicable
3. Prioritize questions by impact on confidence
4. Format for AskUserQuestion tool (max 5 questions per round)

### Question Quality Criteria

- Each question should increase confidence by 5-15%
- Order from most impactful to least impactful
- Each option should lead to a meaningfully different execution path

---

## Step 4: Write Documentation

Write clear, comprehensive requirements documentation developers can act on without follow-up questions.

### Document Structure

1. **Overview** - scope and purpose
2. **Detailed Requirements** - numbered, testable statements
3. **Acceptance Criteria** - per requirement, measurable
4. **Edge Cases** - boundary conditions and error scenarios
5. **Constraints** - technical, business, and timeline limits
6. **Dependencies** - external systems, APIs, data requirements
7. **Developer Handoff Notes** - implementation hints, priority

### Writing Rules

- Use imperative form ("The system shall...")
- Each requirement must be independently testable
- Include examples where helpful
- Cross-reference related requirements
- No ambiguous terms ("fast", "easy") — quantify instead

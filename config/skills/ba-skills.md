# Business Analyst Skills

## requirements-analyzer

**Purpose:** Extract and analyze requirement changes from user requests.

**Input:**
- User requirement description
- Existing requirements documents

**Process:**
1. Parse user request
2. Identify requirement type (new feature, enhancement, bug fix)
3. Extract core requirements
4. Compare with existing requirements
5. Identify conflicts or overlaps
6. Assess completeness

**Output:**
- Parsed requirements
- Requirement type
- Conflicts/overlaps identified
- Completeness assessment

**Implementation:** `src/agents/business-analyst/skills/requirements-analyzer.ts`

---

## question-generator

**Purpose:** Create specific, actionable clarifying questions when confidence <95%.

**Input:**
- Current understanding level
- Knowledge gaps identified
- Requirement context

**Process:**
1. Identify specific gaps in understanding
2. For each gap, formulate targeted question:
   - Specific and actionable
   - Provides context for why asking
   - Offers options when applicable
3. Prioritize questions by importance
4. Format for AskUserQuestion tool

**Output:**
- Array of clarifying questions
- Each question with:
  - Question text
  - Context/reasoning
  - Options (if applicable)
  - Priority level

**Implementation:** `src/agents/business-analyst/skills/question-generator.ts`

---

## documentation-writer

**Purpose:** Write clear, comprehensive requirements documentation.

**Input:**
- Parsed requirements
- User answers to clarifying questions
- Existing documentation

**Process:**
1. Structure requirements document:
   - Overview
   - Detailed requirements
   - Acceptance criteria
   - Edge cases
   - Constraints
   - Dependencies
2. Write in clear, unambiguous language
3. Include examples where helpful
4. Cross-reference related requirements

**Output:**
- Updated requirements document
- Changelog entry
- Developer handoff notes

**Implementation:** `src/agents/business-analyst/skills/documentation-writer.ts`

---

## gap-identifier

**Purpose:** Find missing information and ambiguities in requirements.

**Input:**
- Current requirement understanding
- Standard requirement checklist

**Process:**
1. Check against requirement checklist:
   - User stories clear?
   - Acceptance criteria defined?
   - Edge cases considered?
   - Constraints specified?
   - Dependencies identified?
   - Success metrics defined?
2. Identify gaps and ambiguities
3. Assess confidence level (toward 95% threshold)

**Output:**
- List of gaps/ambiguities
- Confidence score
- Recommended clarifications

**Implementation:** `src/agents/business-analyst/skills/gap-identifier.ts`

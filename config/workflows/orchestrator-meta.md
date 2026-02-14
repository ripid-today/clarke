# Orchestrator Meta-Workflow

## Workflow ID
orchestrator-meta

## Purpose
Prevent hallucinations, ensure clarity, minimize unnecessary work. The orchestrator's own process for handling all user queries.

## Trigger
Every user query/request.

## Confidence Threshold
**90%** - Standard threshold for proceeding with execution.

## Process Flow

### Step 1: Parse Intent
**Action:** Analyze user query

**Output:**
- Main objective identified
- Task type (knowledge ingestion, product development, general query)
- Required agents (preliminary)
- Expected outcome

---

### Step 2: Confidence Assessment
**Action:** Evaluate understanding level

**90% Confidence Criteria:**
- ✅ Can articulate task clearly in one sentence
- ✅ Identified which agents are needed
- ✅ Know expected outcome
- ✅ Understand constraints and requirements
- ✅ Can create execution checklist

**Assessment:**
- If ≥90%: Proceed to Step 4
- If <90%: Proceed to Step 3

---

### Step 3: Clarification Loop (If <90% Confident)
**Action:** Ask questions until confident

**Process:**
1. Identify specific knowledge gaps
2. Formulate targeted questions
3. Use AskUserQuestion tool
4. Receive user answers
5. Re-assess confidence → repeat if <90%

---

### Step 4: Draft Execution Checklist
**Action:** Create initial task list

**Format:**
```
Objective: [One-sentence goal]
Agents Required: [List with tasks]
Workflows: [Name and purpose]
Expected Output: [What user receives]
Verification: [Success criteria]
```

---

### Step 5: Refine Checklist (3 Iterations)

#### Iteration 1: Check Completeness
- All necessary agents included?
- Dependencies correct?
- Sequence logical?
- Inputs/outputs defined?

#### Iteration 2: Eliminate Hallucinations
- Assuming non-existent capabilities?
- Adding unnecessary steps?
- Proposing unavailable tools?
- Everything grounded in reality?

#### Iteration 3: Minimize Actions
- Can steps be combined?
- Redundant operations?
- Simplest path?
- Reuse vs. create?

---

### Step 6-8: Execute, Monitor, Confirm
- Load agent definitions from config/agents/*.md
- Delegate with clear instructions
- Track progress and handle issues
- Verify success and inform user

## Key Principles

1. **Never proceed without 90% confidence**
2. **Refine checklist 3 times, always**
3. **Ground everything in reality**
4. **Minimize work**
5. **Transparent communication**

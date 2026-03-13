# Native Eval Guide (No Python Required)

How to test and evaluate a skill without running any scripts. Use this when you want to verify a skill works, or when the user says "just vibe with me" and doesn't need a full benchmark setup.

---

## When to Run Evals

**Run evals when:**
- Skill has objectively verifiable outputs (file transforms, structured data, fixed workflow steps)
- User wants confidence before deploying a skill
- You're iterating on an existing skill and want to compare old vs new

**Skip evals (or keep them qualitative) when:**
- Skill has purely subjective outputs (writing style, design taste)
- User says they don't need formal testing
- Skill is simple and self-evidently correct

---

## Native Eval: 3 Steps

No scripts, no benchmark.json, no Python. Just Claude running prompts and grading inline.

### Step 1: Write Test Prompts

Create 2-4 realistic test prompts — what a real user would actually type. Confirm with the user before running.

**Good test prompts:**
- Specific enough to have a verifiable output
- Representative of the skill's main use cases
- Include at least one edge case

**Examples for a `write-prd` skill:**
```
1. "Write a PRD for adding dark mode to Clarke's Library website"
2. "Write a PRD for a search feature with filters by folder and date"
3. "Write a PRD for exporting articles to PDF" [edge: unclear scope]
```

Share the prompts with the user: "Here are the test cases I'd like to try. Do these look right?"

### Step 2: Run Each Prompt as a Subagent

For each test prompt, spawn a subagent with the skill active. Give it this task:

```
Execute this task with the skill active:
- Skill path: <path-to-skill>
- Task: <test prompt>
- Save output to: <workspace>/iteration-1/eval-<N>/output.md (or appropriate extension)
```

Run all prompts in parallel (one subagent per prompt) so they finish together.

**Baseline comparison (optional but useful):**
Run a parallel set of subagents *without* the skill on the same prompts. Compare outputs side-by-side to verify the skill is actually helping.

### Step 3: Grade Inline

Once subagents finish, read their outputs and grade against assertions you define.

**Good assertions (objectively verifiable):**
- "Output contains a ## Requirements section"
- "Output is under 300 lines"
- "Output includes at least 3 acceptance criteria"
- "Output has a frontmatter block with name: field"

**Bad assertions (requires judgment call):**
- "Output is high quality"
- "Output sounds professional"

For each assertion, record:
- **Pass / Fail**
- **Evidence** (quote or line reference)

Present the grading summary to the user. For each failure, explain what went wrong.

---

## What to Do With Failures

A failed assertion is a signal, not an indictment. Ask:

1. Is the assertion wrong? (Too strict, wrong expectation)
2. Is the prompt wrong? (Ambiguous, unrealistic)
3. Is the skill wrong? (Missing instruction, wrong pattern)

**Common fixes:**

| Failure pattern | Fix |
|----------------|-----|
| Skill ignores a required section | Add explicit template with ALWAYS marker |
| Skill produces correct output but wrong format | Add output template with exact structure |
| Skill over-explains / bloats output | Add "Keep responses concise" + explain why |
| Skill misses edge cases | Add examples showing the edge case handled correctly |
| Skill triggers too broadly | Narrow description to specific contexts |
| Skill doesn't trigger when it should | Expand description, add more trigger phrases |

---

## Iterating Without Scripts

```
Draft SKILL.md
    ↓
Write 2-4 test prompts (confirm with user)
    ↓
Run subagents in parallel
    ↓
Grade outputs inline (assertions)
    ↓
Improve SKILL.md based on failures
    ↓
Re-run → grade → improve (repeat until satisfied)
```

**When to stop:**
- User says they're happy
- All assertions pass across all test prompts
- You're not making meaningful progress after 2-3 iterations

---

## Optional: Python-Based Evals

If the user wants formal benchmarking with variance analysis and a browser viewer, the scripts-based workflow is available. Read the main SKILL.md's "Running and evaluating test cases" section for the full process using `scripts/aggregate_benchmark.py` and `eval-viewer/generate_review.py`.

The native eval above is a fast alternative when you don't need that level of rigor.

---

## Description Optimization (Triggering)

After the skill content is solid, offer to optimize its description for better triggering accuracy.

**Native approach (no `run_loop.py`):**

1. Write 10-15 realistic queries — mix of should-trigger and should-not-trigger
2. For each query, mentally simulate: "Would this description cause Claude to pick this skill?"
3. Adjust description to cover misses and exclude false positives
4. Re-test the boundary cases

**Rules for good test queries:**
- Should-trigger: different phrasings of the same intent (formal, casual, abbreviated)
- Should-not-trigger: near-misses that share keywords but need a different skill
- Both: specific, realistic, with context (not abstract one-liners)

**If `run_loop.py` is available** (Claude Code with Python), use it for automated optimization — see the main SKILL.md's "Description Optimization" section.

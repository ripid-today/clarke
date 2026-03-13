---
name: skill-creator
description: Create new skills, modify and improve existing skills, and measure skill performance. Use when users want to create a skill from scratch, update or optimize an existing skill, run evals to test a skill, benchmark skill performance with variance analysis, or optimize a skill's description for better triggering accuracy. Also trigger when someone says they want to capture a workflow, automate a repeatable process, or make Claude better at a specific task.
argument-hint: [description] or update [path/to/SKILL.md]
---

# Skill Creator

Two modes: **CREATE** a new skill from a description, or **UPDATE** an existing skill at a given path.

---

## Step 1: Parse Arguments & Detect Mode

Read `$ARGUMENTS`. Determine which mode applies.

**Confidence scoring for mode detection — score these signals:**

| Signal | Confidence boost |
|--------|-----------------|
| Keyword "update / improve / fix / optimize" in `$ARGUMENTS` | +30% → UPDATE |
| File path provided (contains `/` or ends in `.md`) | +30% → UPDATE |
| Keyword "create / build / make / new" in `$ARGUMENTS` | +30% → CREATE |
| Skill description provided (no path, no update keyword) | +30% → CREATE |
| Completely ambiguous | 40% — ask |

**If confidence < 95%:** Ask exactly this:
> "Are you creating a new skill or improving an existing one? If improving, what's the path to the SKILL.md?"

Once mode is confirmed, proceed to the relevant path below.

---

## [CREATE PATH]

### Step 2: Intake Questionnaire

Gather the 5 required fields. Score each one — proceed only when all are ≥95% clear.

| Field | Confidence question |
|-------|-------------------|
| **Purpose** | What should this skill enable Claude to do? |
| **Trigger context** | When / what user phrases should activate it? |
| **Input** | What does the user provide as input? |
| **Output** | What is the deliverable or final output? |
| **Test verifiability** | Can outputs be checked objectively, or is quality subjective? |

Check `$ARGUMENTS` first — the user may have described the skill inline (e.g., `/skill-creator "a skill that summarizes Slack threads"`). Extract as many fields as possible before asking questions.

If the current conversation shows a workflow the user just performed (tools used, corrections made, output format), extract fields from the history and confirm rather than asking from scratch.

**If confidence < 95% on any field:** Ask only the question(s) for the unclear field(s). Max 3 questions per round. Re-score after answers. Continue until all 5 fields are ≥95%.

### Step 3: Pattern Selection

Score one point (20%) per "yes":

| Question | Yes → |
|----------|-------|
| Does it need large reference docs / domain knowledge? | Reference-based |
| Does it transform files or run repeatable operations? | Script-bundled |
| Does it require multiple specialized agent roles? | Agent-orchestrated |
| Is the task simple / single-purpose with no files? | Prompt-only |
| Multiple "yes" above? | Hybrid |

**If confidence < 95%** (any question unclear): ask the specific unclear question.
**If 2+ patterns tie:** Ask — "Should this skill bundle external files (reference docs, scripts), or operate purely from instructions?"

For pattern details and examples, read `references/01-skill-patterns.md`.

### Step 4: Generate Standardized SKILL.md

Write the skill using this exact template:

```
---
name: [skill-id in kebab-case]
description: "[What it does. When to use it — list specific user phrases. Use even if... clause for near-misses.]"
[argument-hint: [hint]  ← only if skill takes arguments]
[allowed-tools: ...     ← only if skill needs specific tools without approval prompts]
[disable-model-invocation: true  ← only for side-effect skills (/deploy, /commit, etc.)]
[user-invocable: false  ← only for pure background reference material]
---

# [Skill Title]

[2-sentence overview: what it does and who it helps.]

## Step 1: [First step — imperative verb, ~20 words]

[Instructions. Explain *why* each step matters, not just what to do.]

## Step 2: [Next step]

[...]

## Output

[Explicit template or examples of the expected deliverable.]

## Reference Index (if bundled resources exist)

- `references/[file].md` — [When to read it]
- `scripts/[file]` — [What it does, when to call it]
```

**Description writing rules** (most important field):
1. State the core capability (verb + object)
2. List specific trigger phrases
3. Add edge cases the skill covers
4. Add a "use even if..." clause for near-misses

See `references/02-writing-guide.md` for frontmatter field semantics, progressive disclosure patterns, and writing style guidance.

---

## [UPDATE PATH]

### Step 2: Read the Existing Skill

Read the SKILL.md at the path provided in `$ARGUMENTS`.

Audit it against the standard template:
- Does SKILL.md have a clear purpose in the first paragraph?
- Does the description include what + when + specific trigger phrases?
- Are steps imperative and explained with reasoning (not just "do X")?
- Is there an output template or example?
- Are bundled resources (references/, scripts/) referenced just-in-time, not upfront?
- Is SKILL.md under 300 lines? If 300-500, is it justified? If >500, needs splitting.

List gaps and thin areas explicitly.

### Step 3: Propose Targeted Improvements

For each gap, propose a specific fix. Show a diff or before/after for significant changes.

Confirm with the user before applying: "Here's what I'd change — want me to apply these?"

Apply only what was approved. Do not refactor beyond the approved changes.

---

## Step 5 (Optional): Eval & Test

After writing or updating the skill, offer to run test cases.

**Default:** Use the native eval workflow — no Python required.
1. Write 2-4 realistic test prompts, confirm with user
2. Run each as a subagent with the skill active (in parallel)
3. Grade outputs inline against objective assertions
4. Improve skill based on failures, repeat

Read `references/03-eval-guide.md` for the full native eval workflow.

**If user wants formal benchmarking** (benchmark.json, browser viewer, variance analysis), use the scripts-based workflow in the original "Running and evaluating test cases" section — those scripts remain available in `scripts/` and `eval-viewer/`.

---

## Step 6 (Optional): Description Optimization

After the skill content is solid, offer to optimize its description for better triggering accuracy.

**Native approach:** Write 10-15 realistic test queries (should-trigger + should-not-trigger), simulate Claude's decision for each, adjust description to cover misses.

**Automated approach** (Claude Code with Python available):
```bash
python -m scripts.run_loop \
  --eval-set <path-to-trigger-eval.json> \
  --skill-path <path-to-skill> \
  --model <model-id-from-system-prompt> \
  --max-iterations 5 \
  --verbose
```

Read `assets/eval_review.html` for the eval review UI (to present queries to user before running).

---

## Communication Style

Users range from non-technical to expert. Read cues:
- Use "evaluation" and "test" freely; explain "assertion" and "JSON" if unsure
- Casual language = casual explanations; technical language = technical precision
- Don't ask questions you can infer from context

---

## Reference Index

| File | Read when... |
|------|-------------|
| `references/01-skill-patterns.md` | Choosing between Prompt-only / Reference-based / Script-bundled / Agent-orchestrated / Hybrid |
| `references/02-writing-guide.md` | Writing frontmatter, description field, progressive disclosure, style |
| `references/03-eval-guide.md` | Running native evals without Python scripts |
| `references/04-resources-guide.md` | Complete docs: all frontmatter fields, triggering mechanisms, arguments, scope, dynamic content |
| `references/schemas.md` | JSON schemas for evals.json, grading.json, benchmark.json |
| `agents/grader.md` | Spawning a grader subagent for assertion evaluation |
| `agents/comparator.md` | Blind A/B comparison between two skill versions |
| `agents/analyzer.md` | Analyzing benchmark results and why one version beat another |

# Prompt Engineering Patterns

**Purpose:** Practical prompt engineering patterns for improving skill content and agent reference files. Use this when improving an existing skill's effectiveness, writing reference file content, or evaluating whether an agent's instructions are clear enough to execute reliably.

---

## 1. Chain-of-Thought Prompting

### 1.1 What It Is

Chain-of-thought (CoT) prompting structures the model's reasoning process by explicitly listing the steps it should follow. Instead of presenting an open-ended task, CoT breaks the task into a sequence where each step has a defined input and output.

**When to use:**
- Multi-step analytical tasks (investment analysis, requirements writing, code review)
- Tasks where the quality of intermediate reasoning affects the final output
- Tasks where the model tends to skip steps or jump to conclusions

### 1.2 Implementation in Reference Files

Write numbered step-by-step processes with specific actions at each step. The model follows the structure — it doesn't infer the process from a general description.

**Weak (no CoT):**
```
Analyze the company's financial performance and write a thesis.
```

**Strong (with CoT):**
```
Step 1: Read the 5-year financial statements. Extract: revenue, net income, EPS for each year.
Step 2: Calculate key ratios. Compute: revenue CAGR, net margin trend, EPS growth rate.
Step 3: Compare to sector benchmarks. State whether each metric is above/below sector median and by how much.
Step 4: Identify the business quality signal. Is the margin trend expanding (good) or contracting (bad)? Is revenue growth accelerating or decelerating?
Step 5: Write the thesis. 2-4 sentences: main value driver, why it's underappreciated, what makes this a compelling entry point.
Step 6: Write the anti-thesis. 2-4 sentences: strongest counterargument, what data would prove the bull case wrong.
```

### 1.3 CoT for Classification Tasks

For tasks where the model must classify or score something:

**Weak:** "Score the macro environment on a scale of 0-10."

**Strong:**
```
To arrive at the macro score:
1. Assess interest rate trajectory: rising rates = negative (−2 to 0), neutral = (0), falling rates = positive (0 to +2)
2. Assess GDP growth trend: contracting = (−2), stagnant = (0 to −1), growing = (+1 to +2)
3. Assess inflation level: hyperinflation = (−2), above target = (−1), at target = (0), below target = (+1)
4. Assess regulatory environment for the relevant sector: hostile = (−2), neutral = (0), favorable = (+2)
5. Sum the component scores and map to 0-10 scale: negative sum → 0-4, neutral → 5, positive sum → 6-10
6. State the score with the component breakdown so Commander can see the reasoning.
```

### 1.4 When NOT to Use CoT

- Simple, single-step tasks (format a date, extract a number from text)
- Tasks where the model performs well without explicit structure
- Short utility operations where CoT adds more length than value

---

## 2. Few-Shot Examples

### 2.1 What It Is

Few-shot prompting provides 2-5 examples of correct input-output pairs in the skill or reference file. The model infers the pattern from the examples rather than from explicit rules.

**When to use:**
- Output format must be exact (e.g., specific JSON schema, specific markdown table structure)
- The task is nuanced and hard to describe in rules alone
- The model consistently produces slightly wrong formats despite clear instructions

### 2.2 Optimal Example Count

| Situation | Examples |
|-----------|----------|
| Simple format with no edge cases | 1-2 |
| Moderate complexity, consistent pattern | 2-3 |
| Complex output with multiple fields | 3-4 |
| Highly variable input requiring edge case demonstration | 4-5 |

**Why not more?** Each example consumes tokens. Beyond 5 examples, the additional accuracy gain rarely justifies the context cost in Clarke's use cases.

### 2.3 Example Quality Rules

**Rule 1: Show the edge case, not just the happy path**

**Weak example set (happy path only):**
```
Input: VIC revenue grew 25% YoY
Output: Revenue growth: Strong (25% YoY)
```

**Strong example set (includes edge case):**
```
Input: VIC revenue grew 25% YoY
Output: Revenue growth: Strong (25% YoY)

Input: Revenue data unavailable for Q3 2025
Output: Revenue growth: Unavailable (Q3 2025 data missing — use TTM if available, else mark as N/A)
```

**Rule 2: Match the desired output format exactly**

The example output must be formatted exactly as the skill should produce. If the skill output is JSON, the example output must be valid JSON. If it's a markdown table, the example must use correct markdown table syntax.

**Rule 3: Include a negative example when false positives are a risk**

Show what the output should NOT look like when the input is ambiguous:

```
Input: "VIC looks interesting"
Correct response: [Ask for more context — this is not a research request]
Wrong response: [Generate full investment thesis from a vague comment]
```

### 2.4 Placement in Skill Files

- Happy path examples → `references/02-output-examples.md` (loaded on demand, not by default)
- Edge case examples → embedded in the step where the edge case occurs (in core SKILL.md or in the relevant reference file)
- Negative examples → in the reference file for the highest-risk false positive scenario

**Rationale for keeping examples in references:** Examples are verbose. A core SKILL.md with 5 examples can easily exceed 300 lines. Progressive disclosure keeps the core file lean.

---

## 3. Structured Output Patterns

### 3.1 When to Use Each Format

| Format | Use Case | Why |
|--------|----------|-----|
| XML tags | Agent-to-agent handoffs, machine parsing | More reliably parsed than prose; model respects tag boundaries |
| JSON | Data passed between agents with schema validation | Structured, type-checkable, easily deserialized |
| Markdown tables | Clarke-facing output (human-readable structured data) | Readable, renderable in Claude's interface |
| Numbered lists | Sequential processes, ranked items | Natural ordering, easy to reference by step number |
| Prose | Narrative analysis, rationale, explanations | Natural for human reading; not for data extraction |

### 3.2 XML Tags for Agent-to-Agent Handoffs

XML tags make outputs more reliably parseable by receiving agents. The receiving agent can extract specific sections without parsing ambiguous prose.

**Example: Seer output with XML structure**
```xml
<seer_output>
  <conviction>8</conviction>
  <ev_calculation>
    <p_bull>0.65</p_bull>
    <upside_pct>35</upside_pct>
    <p_bear>0.35</p_bear>
    <downside_pct>-18</downside_pct>
    <ev_pct>22.0</ev_pct>
  </ev_calculation>
  <entry_zone>
    <low>42000</low>
    <high>45000</high>
    <currency>VND</currency>
  </entry_zone>
  <price_target>58000</price_target>
  <timeframe>12 months</timeframe>
  <stop_loss>38000</stop_loss>
</seer_output>
```

**When to require XML:**
- Output has multiple named fields that an orchestrator or downstream agent must extract
- Output format must be consistent across many invocations (for synthesis)
- The receiving agent's reference file specifies an XML input contract

### 3.3 JSON for Data Handoffs

Use JSON when: the receiving agent will programmatically process the data, or when a schema validation step is expected.

**Schema definition pattern** (in the producing agent's output contract):
```json
{
  "ticker": "string (HOSE:VIC format)",
  "macro_score": "number 0-10",
  "data_points": ["array of 3 strings with source citations"],
  "risk": "string",
  "vietnam_note": "string"
}
```

Required fields must be listed with types. The receiving agent (orchestrator) validates that all required fields are present before routing.

### 3.4 Markdown Tables for Clarke-Facing Output

Use markdown tables when presenting structured comparison data to Clarke directly:

```markdown
| Metric | VIC | Sector Median | Assessment |
|--------|-----|--------------|------------|
| P/E | 12.3x | 15.8x | Below median — value signal |
| Revenue Growth | 22% | 8% | Well above median — growth leader |
| Net Margin | 18.2% | 12.5% | Above median — quality operations |
```

**Table guidelines:**
- Column headers: concise, no abbreviations without prior definition
- Alignment: numbers right-aligned, text left-aligned
- Max 6 columns before the table becomes hard to read in Claude's interface
- "Assessment" column (optional): brief qualitative interpretation of the number

---

## 4. Role Clarity Pattern

### 4.1 The Formula

Every agent CLAUDE.md Identity section should follow this formula:

```
You are [specific expert role].
Your task is [observable action that produces a specific output].
You are done when [measurable, binary criterion].
```

### 4.2 The Three Components

**"Specific expert" — narrow enough to constrain behavior:**

Bad: "You are an AI assistant that helps with investment analysis"
Problem: "AI assistant" implies general helpfulness, not specialized expertise. The model will try to help with everything.

Good: "You are the fundamental analyst for Clarke's investment research system."
Problem fixed: "Fundamental analyst" is a specific role with known scope — evaluates financials, not macros, not price action.

Better: "You are the fundamental analyst for Clarke's investment research system. You evaluate company financial statements, calculate valuation ratios, and produce investment theses. You do NOT analyze macroeconomic conditions (that's macro-analyst) or price charts (that's technical-analyst)."
Why better: Explicit scope boundary prevents scope creep.

**"Observable action" — produces a specific output:**

Bad: "Your task is to analyze the company."
Problem: "analyze" could mean anything from a 1-sentence summary to a 50-page report.

Good: "Your task is to produce an 8-metric fundamental scorecard plus a thesis and anti-thesis for the requested ticker."
Why: Specifies the output (8 metrics + thesis + anti-thesis) — the model knows what "done" looks like.

**"Measurable criterion" — binary, not vague:**

Bad: "You are done when the analysis feels complete."
Problem: "Feels complete" is subjective and will vary unpredictably.

Good: "You are done when: all 8 header metrics are populated, thesis is 2-4 sentences with evidence, anti-thesis is 2-4 sentences with a genuine challenge, and 5-year financials table is complete."
Why: Each criterion is checkable — either present or not.

### 4.3 Applying Role Clarity to Reference Files

Reference files for analysis tasks should also follow the role clarity pattern within each step:

**Without role clarity:**
```
Step 3: Look at the technical indicators.
```

**With role clarity:**
```
Step 3: As the technical analyst, read RSI, MACD, and 50/200-day MA crossover. Your task here is to state the trend direction (Bullish/Bearish/Neutral) with 2-3 supporting data points. You are done with this step when trend direction is stated and supported.
```

---

## 5. Model Selection Guidance

### 5.1 Which Model for Which Task

Clarke's agent system uses three model tiers. Model selection is set in the agent's CLAUDE.md `model:` field. Skill-builder must not change model selection without understanding the task characteristics.

| Model | Identifier | Strengths | Use For |
|-------|-----------|-----------|---------|
| Haiku | claude-haiku-4-5 | Fast, low cost, simple tasks | Dedup checks, word count validation, format extraction, simple classification |
| Sonnet | claude-sonnet-4-6 | Quality/speed balance | Investment analysis, code generation, requirements writing, most Clarke agents |
| Opus | claude-opus-4-6 | Deep reasoning, cross-reference synthesis | High-stakes multi-step reasoning, complex synthesis requiring cross-reference |

**Clarke agent default:** Sonnet. All agent CLAUDE.md files use `model: sonnet` unless there is a specific reason to use Haiku or Opus.

### 5.2 When to Recommend Haiku

Propose downgrading to Haiku when a skill:
- Performs a single classification (is this a duplicate? yes/no)
- Extracts a specific field from structured text (what is the article date?)
- Validates a format (does this match the required schema?)
- Runs a simple pipeline step that doesn't require reasoning

**Benefit:** Haiku is ~5x faster and ~4x cheaper than Sonnet. For high-frequency pipeline steps (e.g., dedup checking 50 articles per day), Haiku is the correct choice.

### 5.3 When to Recommend Opus

Propose upgrading to Opus when a task:
- Requires synthesizing information across 5+ sources and detecting subtle contradictions
- Involves high-stakes decisions where a reasoning error has significant consequences
- Requires generating novel frameworks rather than applying existing ones
- Is a one-time task (cost is not a repeated concern)

**Caution:** Opus is ~5x slower and ~15x more expensive than Sonnet. Only recommend for tasks where Sonnet's reasoning is demonstrably insufficient.

### 5.4 Model Selection in SKILL.md

Skills do not have a `model:` field — they inherit the model of the agent invoking them. However, skill-builder can recommend a model in the skill's workflow steps when a specific step benefits from a different model tier:

```markdown
Step 2: [Using Haiku] Classify each article into one of 5 predefined sectors.
For this step only, use a lightweight classification prompt — no deep analysis needed.
```

This is advisory, not enforceable — the agent decides. But the annotation helps future skill-builders understand the intent.

---

## 6. Anti-Patterns to Avoid

### 6.1 Instruction Inflation

Adding more instructions is not the same as better instructions. Longer reference files with more rules often produce worse results because:
- The model's attention dilutes across too many constraints
- Contradictory rules emerge as the file grows
- The model treats the file as background context, not active instructions

**Rule:** If adding a rule doesn't fix a specific observed failure, don't add it.

### 6.2 Vague Quantifiers

Avoid: "some", "several", "appropriate", "sufficient", "reasonable", "good"

Replace with specific quantities, states, or thresholds:
- "some data points" → "3 data points"
- "appropriate length" → "200-300 words"
- "good anti-thesis" → "anti-thesis that challenges a key assumption in the bull thesis with specific evidence"

### 6.3 Instruction Contradiction

When a file has both "always X" and "sometimes skip X", the model will behave unpredictably. Resolve contradictions by:
- Making the primary rule the default
- Making the exception explicit with its triggering condition: "Always X, except when [specific condition] — in that case, Y"

### 6.4 Implicit Scope

Never leave scope implicit. An agent without explicit "does NOT do X" instructions will interpret ambiguous requests broadly. Every skill and reference file should state what it does NOT handle.

### 6.5 Stacking Emphasis

Using bold, caps, and exclamation for multiple instructions dilutes the signal. Reserve strong emphasis for the 1-2 most critical rules:
- Bad: **ALWAYS** read the PRD. **NEVER** skip validation. **CRITICAL** to check the tests. **IMPORTANT**: log errors.
- Good: One or two things are actually critical — bold those. The rest are instructions, not warnings.

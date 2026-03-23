# Skill Quality Evaluation

**Purpose:** Defines the test methodology for measuring skill trigger precision and the improvement cycle for fixing skills that are over-triggered or under-triggered. Use this reference whenever evaluating whether a skill description is working correctly.

---

## 1. Trigger Precision Test Methodology

### 1.1 What Trigger Precision Measures

Trigger precision measures how accurately the `description` field selects the correct skill for a given Clarke prompt. Two failure modes exist:

- **False negative (under-triggered):** Clarke needs the skill, but the model doesn't invoke it
- **False positive (over-triggered):** Clarke doesn't need the skill, but the model invokes it anyway

**Target metrics:**
- Sensitivity (true positive rate): 100% — every should-trigger prompt must trigger the skill
- False positive rate: under 10% — less than 1 in 10 should-not-trigger prompts should trigger the skill

### 1.2 Test Set Construction

Create a test set of 10-15 prompts before evaluating any skill:

**Should-trigger prompts (5-8 total):**
- Cover the 3 trigger phrases in the description using their exact wording
- Cover 2-3 paraphrases Clarke might use (different words, same intent)
- Include 1-2 edge cases where the skill still applies (the "use even if" scenario)
- Include prompts of varying specificity (very explicit vs. somewhat vague)

**Should-not-trigger prompts (5-7 total):**
- Similar domain, different skill: "analyze VIC's fundamentals" should not trigger research-news
- Adjacent topic: "check the RSS feed status" should not trigger brief-daily-news
- Completely different domain: "fix the TypeScript error" should not trigger any analysis skill
- Ambiguous phrasing: prompts that could be confused with this skill but actually belong elsewhere

### 1.3 Example Test Set: `research-news` skill

**Should trigger:**
1. "Run the daily news pipeline"
2. "Fetch today's RSS feeds and generate briefs"
3. "Start the morning briefing process"
4. "Generate investment news summaries for today"
5. "Only VnExpress RSS is working — go ahead with what's available" ← edge case (use even if)
6. "Run news" ← minimal phrasing
7. "I need today's news briefs" ← paraphrase

**Should NOT trigger:**
1. "Publish the news briefs to Firestore" ← different skill: brief-daily-news
2. "Analyze VIC's earnings" ← different skill: micro-analyst
3. "What was in yesterday's news?" ← information question, not a pipeline trigger
4. "Check if the RSS feeds are configured correctly" ← debugging, not pipeline
5. "Remove duplicate news articles from Firestore" ← different task: dedup, not research-news

### 1.4 How to Run the Tests

**Method 1: Manual review**
Show each test prompt to Claude and ask: "Given this skill description, would you invoke this skill for this prompt?" Record: yes (triggers) or no (doesn't trigger).

**Method 2: Real invocation**
Test in an actual Clarke conversation. Present each prompt and observe whether the skill is offered or invoked.

**Method 3: Structured reasoning**
For each test prompt, check whether the description's trigger phrases and "use when" list match the prompt's intent. This is faster than real invocation but less definitive.

### 1.5 Recording Results

| Prompt | Expected | Actual | Pass/Fail |
|--------|----------|--------|-----------|
| "Run the daily news pipeline" | Trigger | Trigger | PASS |
| "Only VnExpress is working" | Trigger | No trigger | FAIL — false negative |
| "Publish to Firestore" | No trigger | No trigger | PASS |
| "Check RSS config" | No trigger | Trigger | FAIL — false positive |

**Calculate:**
- Sensitivity = (true positives) / (total should-trigger prompts)
- False positive rate = (false positives) / (total should-not-trigger prompts)

---

## 2. Common Anti-Patterns in Skill Descriptions

### 2.1 Over-Triggered (Description Too Broad)

**Example:** `"Use when working with data or analysis tasks"`

**Problem:** Virtually every Clarke prompt involves data or analysis. This description makes the skill a false positive magnet.

**Diagnosis:** The trigger phrases are category-level ("data", "analysis"), not domain-specific ("RSS feeds", "daily news", "investment briefs").

**Fix strategy:**
1. Replace category terms with domain-specific terms
2. Add scope boundary ("Does NOT apply to...")
3. Rewrite with verb+object output statement

**Fixed example:** `"Fetches RSS news sources and generates investment briefs. Use when: running the daily pipeline, generating news briefs, fetching RSS. Does NOT apply to stock analysis or Firestore publishing."`

### 2.2 Under-Triggered (Description Too Narrow)

**Example:** `"Use when user says exactly 'run research-news' or 'fetch RSS and generate briefs'"`

**Problem:** Too literal — Clarke rarely uses a skill's exact name when requesting it. Natural language varies significantly.

**Diagnosis:** The trigger phrases match exact wording but miss paraphrases and near-synonyms.

**Fix strategy:**
1. Add 3-5 paraphrase trigger phrases covering how Clarke naturally asks for this
2. Add "use even if" clause for edge cases
3. Remove any implication that exact wording is required

**Fixed example:** `"Use when: running the daily news pipeline, generating news briefs, fetching RSS feeds, starting the morning briefing, processing today's news. Use even if Clarke uses different wording like 'do the news thing' or 'morning routine.'"`

### 2.3 No Clear Output Format

**Problem:** The description doesn't state what the skill produces, so the model doesn't know what "done" looks like. This leads to incomplete executions and inconsistent outputs.

**Diagnosis:** Description says what the skill does (verb) but not what it produces (noun + format + location).

**Fix strategy:** Add "Produces:" clause specifying format and location.

**Bad:** `"Processes RSS feeds for investment analysis"`
**Fixed:** `"Processes RSS feeds and produces a daily brief array written to the Firestore daily-news collection; each brief is 200-300 words with sector tag and market_impact score."`

### 2.4 Missing "Use Even If" Clause

**Problem:** Edge cases that are within the skill's scope don't trigger it because they differ slightly from the standard trigger phrases.

**Diagnosis:** A should-trigger test prompt fails because it describes a slightly non-standard condition.

**Fix strategy:** Identify the most common near-miss condition from the false negatives in the test set. Add it as a "use even if" clause.

**Example false negative:** "Only 2 of 5 RSS sources are responding — should I continue?" → skill should trigger (partial data is an expected case), but "only 2 of 5 sources" doesn't match any trigger phrase.

**Fix:** Add to description: `"Use even if only some RSS sources are available — partial results are handled gracefully."`

### 2.5 Scope Overload (One Skill, Multiple Responsibilities)

**Problem:** A single skill's description covers 3-4 distinct actions, making it ambiguous and hard to trigger precisely.

**Diagnosis:** The description contains "and also", multiple verb clauses, or a list of disparate outputs.

**Fix strategy:** Split into focused skills, each with one clear output. The split point is where the output format changes — if a skill produces both a Firestore document AND a Slack notification AND a CSV export, those are three skills.

**Rule of thumb:** One skill = one output format + one destination. If the output can go to multiple places, it's multiple skills.

---

## 3. Improvement Cycle

### Step 1: Establish baseline

Run the 10-prompt test set against the current skill description. Record results in the table format from Section 1.5. Calculate sensitivity and false positive rate.

### Step 2: Identify the failing prompts

List the specific prompts that failed (false negatives and false positives). For each:
- False negative: what words did the prompt use that don't match the description?
- False positive: what did the prompt have in common with this skill's description that caused misfire?

### Step 3: Diagnose the anti-pattern

Match each failure to an anti-pattern from Section 2:
- Multiple false negatives from paraphrases → anti-pattern 2.2 (too narrow) → add trigger phrases
- Multiple false positives from adjacent domains → anti-pattern 2.1 (too broad) → add scope boundary
- False negatives from edge cases → anti-pattern 2.4 (missing "use even if") → add edge case clause

### Step 4: Rewrite the description

Apply the fix for the diagnosed anti-pattern. Do not rewrite the entire description if only one anti-pattern is responsible — minimal targeted edits only.

### Step 5: Re-run the same 10 prompts

Run the identical test set against the new description. Do not swap in different prompts — the same test set must pass.

**Required improvement:**
- All previously failing should-trigger prompts now pass
- No new false positives introduced

### Step 6: Document the change

Write a change rationale in this format:

```
Change to: [skill-name] description
Date: [YYYY-MM-DD]
Problem: [specific anti-pattern, e.g., "missing 'use even if' clause caused false negatives on partial RSS input"]
Prompts that failed before: [list]
Fix applied: [what was changed in the description]
Test results after: [N/10 sensitivity, N% false positive rate]
```

If a general lesson emerged (applicable to other skills): propose it to Clarke as a patterns.md entry for skill-builder memory.

---

## 4. Quality Thresholds by Skill Type

Different skill types have different tolerance for false positives, based on the cost of incorrect invocation.

### 4.1 Pipeline Skills (research-news, brief-daily-news, daily-pipeline)

**Tolerance for false positives:** Zero

**Reason:** A pipeline skill running incorrectly can write incorrect data to Firestore, overwrite existing content, or trigger external API calls with billing implications. A false positive here causes real damage.

**Implication for description writing:**
- Scope boundary is MANDATORY and must be specific
- "Use when" list must be narrow and precise
- False positive rate target: 0%
- Sensitivity target: 100%

**Testing requirement:** Run 15-prompt test set (8 should-trigger, 7 should-not-trigger) before any pipeline skill is deployed.

### 4.2 Analysis Skills (write-prd, ba-toolkit, research-vietnam-macro)

**Tolerance for false positives:** Moderate (10-20%)

**Reason:** Invoking an analysis skill unnecessarily is low-cost — the skill runs, produces output, Clarke reads it and decides it's not what she needed. No data is corrupted.

**Implication for description writing:**
- Broader trigger phrases are acceptable
- Better to invoke and produce something useful than miss a relevant analysis
- Sensitivity target: 100%; false positive rate target: under 20%

**Testing requirement:** 10-prompt test set minimum.

### 4.3 Utility Skills (qa-toolkit, dev-toolkit, memory audit)

**Tolerance for false positives:** Broad

**Reason:** Utility skills are used frequently across many contexts. The cost of not invoking them is higher than the cost of invoking unnecessarily.

**Implication for description writing:**
- Wide trigger phrase coverage is preferred
- False positive rate up to 25% is acceptable
- Sensitivity target: 100% (never miss when needed)

**Testing requirement:** 10-prompt test set; prioritize sensitivity over specificity.

---

## 5. Regression Testing After Changes

When a skill description is modified, run a regression test to confirm no previously working prompts now fail.

**Regression test process:**
1. Record all prompts that were confirmed working before the change (from prior test runs)
2. After the change, verify these prompts still trigger correctly
3. If any previously working prompt now fails: the change introduced a regression — revert or fix

**Regression test scope:** At minimum, the 5 most common Clarke prompts that trigger this skill. These are the highest-risk regressions since they affect Clarke's daily workflow.

**When to skip regression testing:**
- Never. Even a one-word change to the description can shift trigger behavior. Always re-test.

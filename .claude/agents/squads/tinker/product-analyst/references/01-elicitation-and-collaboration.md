# TII Elicitation and Collaboration Reference
## BABOK V3 Knowledge Area 3 — Adapted for The Intelligent Investor

---

## Purpose

This reference governs how the product analyst draws out, confirms, and communicates requirements for TII features. TII has an unusual stakeholder structure: the primary elicitation target is Clarke (PO), but the ultimate beneficiaries are Vietnam retail investors — an audience Clarke represents but who cannot be directly interviewed. A third stakeholder class — automated agents (economic-journalist, trigger cron) — has system-level requirements that must be inferred from architecture, not elicitation.

**Load when:** TII feature request is vague or incomplete; requirement gaps exist for pipeline behavior, content quality, or UI display.

---

## TII Stakeholder Elicitation Map

| Stakeholder | Type | How to Elicit | Key Questions |
|-------------|------|---------------|---------------|
| **Clarke (PO)** | Primary human — product owner | Direct AskUserQuestion | Content scope, quality bar, priority, timeline |
| **Vietnam retail investors** | End users — not directly accessible | Clarke as proxy; UX heuristics | What information do they need? What format is clearest? |
| **economic-journalist agent** | System stakeholder — AI pipeline | Code review of agent definition; skill review | What inputs does it receive? What outputs does it produce? |
| **Trigger.dev cron** | System stakeholder — scheduler | `trigger.config.ts` + `index.ts` review | What schedule? What failure modes? What retry policy? |

---

## Three Types of Elicitation for TII

| Type | Description | TII Application |
|------|-------------|-----------------|
| **Collaborative** | Direct interaction with Clarke | Feature scope, content quality bar, user story validation |
| **Research-based** | Reviewing code, PRDs, agent definitions | Current pipeline behavior, existing Firestore schema, existing UI patterns |
| **Experimental** | Testing pipeline outputs, reviewing AI briefs | Brief quality assessment, dedup accuracy measurement, UI rendering checks |

**Sequencing rule:** Research-based first (read codebase and existing PRDs), then collaborative (ask Clarke targeted questions), then experimental (validate understanding by reviewing actual pipeline output).

---

## Question Technique Hierarchy for TII

### 1. Clarifying Questions (start here)
- "When you say [brief quality], do you mean word count, accuracy, or readability?"
- "When you say [coverage], do you mean number of topics, number of articles, or geographic coverage?"
- "Can you show me an example of a brief that meets your quality bar?"

### 2. Probing Questions (dig deeper)
- "What happens today when the pipeline produces a brief outside 200–300 words?"
- "What would the impact be if Vietnam news is not covered for one day?"
- "Who else would be affected if we change the Firestore `articles` schema?"
- "What constraints does the Trigger.dev task limit impose on this feature?"

### 3. Confirming Questions (close the loop)
- "Let me paraphrase: the pipeline should reject any brief under 200 words, regenerate once, then skip. Is that correct?"
- "If I specified the acceptance criterion as 'Given a brief exists, when a user visits the homepage, then the brief title is visible within 3 seconds' — would that meet your need?"
- "Are there edge cases — e.g., no news available for a topic — that this requirement doesn't cover?"

---

## TII Elicitation Sequencing

1. **Document analysis** — Read existing PRDs in `library/requirements/PRDs/`, TII codebase (`projects/the-intelligent-investor/`), agent definitions (Research-based)
2. **BACCM lenses** — Apply six lenses with TII context; clarify Change, Need, Stakeholder, Value, Context (Collaborative)
3. **Targeted interview** — Use AskUserQuestion on priority gaps (Collaborative)
4. **Output review** — Review actual Firestore articles or pipeline logs to validate understanding (Experimental)

---

## Communication by TII Audience

| Audience | Style | Format | Avoid |
|----------|-------|--------|-------|
| **Clarke (PO)** | Outcome-focused, practical | User story + acceptance criteria + business value | Firestore field-level detail, TypeScript specifics |
| **frontend-engineer** | Technical, precise, testable | Given/When/Then, component names, design tokens | Business strategy, investment domain concepts |
| **backend-engineer** | Technical, data-model-focused | Schema snippets, API shapes, error codes | UI terminology, color tokens |
| **Vietnam retail investors** | Scenario-based (via Clarke proxy) | Plain language, example briefs | Agent architecture, cron syntax |

---

## Three Failure Modes in TII Elicitation

| Failure Mode | TII Example | Prevention |
|--------------|-------------|------------|
| **Leading questions** | "You'd want briefs to be exactly 250 words, right?" | Ask "What word count range is acceptable?" instead |
| **Skipping validation** | Documenting "daily pipeline runs at 9am GMT+7" without confirming | Confirm against `trigger.config.ts` cron expression |
| **Stopping too early** | Accepting "improve brief quality" without defining the metric | Ask "How will you know the quality improved?" |

---

## Elicitation Questions by TII Topic

### Pipeline Behavior
- What triggers the pipeline — time, event, or manual?
- What happens when an RSS feed is unavailable?
- What is the expected behavior when all articles are duplicates?

### Content Quality
- What is the minimum acceptable brief length?
- What topics must be covered every day without exception?
- What makes a brief "good enough" to publish?

### Firestore and Schema
- Does this change require adding or modifying fields in the `articles` or `folders` collection?
- Are there existing articles that would break if this change deploys without migration?
- What is the expected `folderId` for articles created by this feature?

### UI and Display
- Where on the homepage should this content appear?
- What should the empty state look like when no articles exist?
- What is the expected behavior on mobile (320px width)?

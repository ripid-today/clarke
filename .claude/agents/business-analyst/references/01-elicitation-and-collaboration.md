# Elicitation and Collaboration Reference
## BABOK V3 Knowledge Area 3

---

## Purpose

This reference governs how the BA draws out, confirms, and communicates requirements from stakeholders. Elicitation is not collecting pre-formed requirements — it is actively drawing out tacit knowledge that stakeholders cannot easily articulate without skilled guidance.

**Load when:** Feature request is vague or incomplete; stakeholder needs require clarification; confidence <95% due to unknown requirements.

---

## Three Types of Elicitation

| Type | Description | When to Use |
|------|-------------|-------------|
| **Collaborative** | Direct interaction — interviews, workshops, focus groups | Tacit knowledge, consensus building, conflict resolution |
| **Research-based** | Studying existing materials — document analysis, data mining, system review | Current state understanding, formulating targeted questions |
| **Experimental** | Controlled testing — prototypes, observations, proofs of concept | Novel technology, uncertain user behavior, uncharted processes |

**Sequencing rule:** Research-based first (build foundational understanding), then collaborative (explore perspectives), then experimental (validate emerging requirements). This order minimizes wasted stakeholder time.

---

## Question Technique Hierarchy

Use this hierarchy to guide every elicitation conversation:

### 1. Clarifying Questions (start here)
Purpose: Ensure you understand what was said.
- "When you say [term], do you mean [interpretation A] or [interpretation B]?"
- "Help me understand what you mean by [vague phrase]."
- "Can you give me a specific example of [situation]?"

### 2. Probing Questions (dig deeper)
Purpose: Uncover underlying needs, constraints, and assumptions.
- "What is the underlying business problem this solves?"
- "What happens today when [trigger situation] occurs?"
- "What would the impact be if we did NOT solve this?"
- "Who else is affected by this process?"
- "What constraints do we need to work within?"

### 3. Confirming Questions (close the loop)
Purpose: Validate your understanding before documenting.
- "Let me paraphrase what I heard: [restatement]. Is that accurate?"
- "If I specified it as [requirement statement], would that meet your need?"
- "Are there any exceptions or edge cases that wouldn't be covered by that?"

**Anti-pattern — Leading Questions:** Never ask "You'd want this to work like [X], right?" This confirms your assumption rather than drawing out the stakeholder's actual need.

---

## Active Listening Checklist

Before each elicitation session, commit to:
- [ ] Silence your internal monologue — focus on understanding, not formulating your response
- [ ] Pause 2–3 seconds after each answer before responding (allows stakeholder to add more)
- [ ] Note exact words used — stakeholder vocabulary often reveals domain concepts and constraints
- [ ] Capture non-verbal signals in face-to-face sessions (hesitation = ambiguity, contradiction = conflict)
- [ ] Paraphrase and confirm before moving to the next topic
- [ ] Never fill silences immediately — productive silence often precedes the most important information

---

## Elicitation Sequencing

Recommended sequence for a new feature request:

1. **Document analysis** — Review existing PRDs, Technical Guidelines, codebase patterns (Research-based)
2. **Contextual questions** — Apply BACCM lenses; clarify Change, Need, Stakeholder, Value, Context (Collaborative)
3. **Deep-dive interview** — Explore requirements depth-first on priority areas (Collaborative)
4. **Consensus workshop** — If multiple stakeholders have conflicting perspectives (Collaborative)
5. **Prototype validation** — Show a wireframe or data model; confirm or correct understanding (Experimental)

---

## Three Failure Modes

| Failure Mode | Description | Prevention |
|--------------|-------------|------------|
| **Leading questions** | Steering stakeholders toward your preconceived solution | Use open-ended questions; state interpretations as options, not facts |
| **Skipping validation** | Documenting requirements without confirming understanding | Always paraphrase-and-confirm before closing a topic |
| **Stopping too early** | Accepting the first answer without probing for underlying need | Apply the "5 Whys" — ask why at least twice before accepting a stated need |

---

## Confirming Elicitation Results

After each elicitation session (BABOK V3, Task 4.3 — Confirm Elicitation Results):

### Paraphrase-and-Confirm Protocol
1. Summarize what you heard in your own words
2. Present as a structured list, not a paragraph
3. Ask: "Did I capture this accurately? What did I miss or misinterpret?"
4. Document corrections immediately

### Conflict Detection
When two stakeholders provide contradictory information:
- Do not resolve silently — surface the conflict explicitly
- "I heard [Stakeholder A] describe [X]. I heard [Stakeholder B] describe [Y]. These seem contradictory — can we resolve them?"
- Document the conflict and escalate to sponsor if unresolved

---

## Communication by Audience Type

| Audience | Communication Style | Format | Avoid |
|----------|---------------------|--------|-------|
| **Executive / Sponsor** | Strategic, outcome-focused | Summary table, business value | Technical jargon, implementation details |
| **Domain Expert / SME** | Process-focused, precise | Detailed questions, process diagrams | Oversimplification |
| **Developer** | Technical, precise, testable | Given/When/Then, data models | Business strategy, political context |
| **End User** | Scenario-based, plain language | User stories, wireframes, demos | Technical architecture, data models |

---

## Elicitation Questions by Topic

### Trigger and Context
- What event or situation prompted this request?
- How long has this problem existed?
- What has been tried before, and why did it not work?

### Current State
- Walk me through what happens today, step by step.
- Where does the current process break down?
- What manual workarounds are people using?

### Future State
- What does success look like in 6 months?
- How will you measure whether this worked?
- What is the minimum viable version of this feature?

### Stakeholders and Users
- Who else is affected by this change?
- Who has authority to approve the requirements?
- Who would be impacted negatively?

### Constraints
- What technical constraints do we need to work within?
- Are there any regulatory or compliance requirements?
- What is the timeline pressure, and what drives it?

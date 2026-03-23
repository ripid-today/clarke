# TII Stakeholder Engagement Reference
## BABOK V3 Knowledge Area 2 — Adapted for The Intelligent Investor

---

## Purpose

This reference defines the TII stakeholder ecosystem, engagement model, and conflict resolution patterns. TII has an unusual stakeholder mix: a single human PO (Clarke), an indirect end-user population (Vietnam retail investors), and two system-level stakeholders (automated agents).

**Load when:** Stakeholder identification is needed; requirements conflict between two stakeholders; engagement plan required for a new TII feature.

---

## TII Stakeholder Map

### Clarke (Product Owner)

| Attribute | Detail |
|-----------|--------|
| **Role** | Product Owner — approves requirements, defines success criteria, provides strategic direction |
| **Authority** | Highest — can approve, reject, or defer any PRD |
| **Interests** | Content quality, pipeline reliability, timely delivery, low maintenance overhead |
| **Engagement method** | AskUserQuestion (synchronous); PRD review (async) |
| **Communication style** | Direct and outcome-focused; avoid excessive technical detail in PRDs |
| **Conflict resolution** | Clarke's decision is final; escalation path = ask Clarke directly |

### Vietnam Retail Investors (End Users)

| Attribute | Detail |
|-----------|--------|
| **Role** | Primary beneficiaries — consume daily investment briefs |
| **Authority** | None directly — represented by Clarke as proxy |
| **Interests** | Timely briefs, readable length (200–300 words), relevant Vietnam market content, mobile-friendly display |
| **Engagement method** | Indirect — Clarke proxies their needs; UX heuristics; content quality reviews |
| **Communication style** | N/A — not directly contacted |
| **Conflict resolution** | Clarke decides when investor needs conflict with technical constraints |

### economic-journalist Agent (System Stakeholder)

| Attribute | Detail |
|-----------|--------|
| **Role** | AI pipeline agent — fetches RSS, generates briefs, writes to Firestore |
| **Authority** | None — executes; cannot approve requirements |
| **Interests** | Clear input format, predictable Firestore schema, well-defined word count targets, stable AI prompts |
| **Engagement method** | Code review of agent definition; review `brief-daily-news` and `research-news` skills |
| **Requirements implication** | Any schema change or word count policy change must be reflected in agent definition |

### Trigger.dev Cron System (System Stakeholder)

| Attribute | Detail |
|-----------|--------|
| **Role** | Scheduler — triggers daily pipeline at 9am GMT+7 |
| **Authority** | None — executes; cannot approve requirements |
| **Interests** | Stable task signatures, reasonable task duration, correct cron expression |
| **Engagement method** | Review `trigger.config.ts` and `index.ts`; review Trigger.dev dashboard |
| **Requirements implication** | Schedule changes, task name changes, or timeout changes must be assessed for Trigger.dev constraints |

---

## Stakeholder Influence vs. Interest Grid

```
High Influence │ Clarke (PO)              │ [None currently]         │
               │ (Manage closely)         │                          │
───────────────┼──────────────────────────┼──────────────────────────┤
Low Influence  │ Vietnam retail investors │ economic-journalist agent│
               │ (Keep satisfied)         │ Trigger.dev cron         │
               │                          │ (Monitor; technical SMEs)│
               └──────────────────────────┴──────────────────────────┘
                        Low Interest               High Interest
```

---

## Stakeholder Conflict Patterns in TII

| Conflict Type | Example | Resolution |
|--------------|---------|-----------|
| **Clarke vs. agent feasibility** | Clarke wants 400-word briefs; agent is calibrated to 200–300 | Propose compromise; update agent definition if Clarke approves |
| **Content quality vs. token budget** | Higher quality briefs require more AI tokens | Present cost estimate to Clarke; Clarke decides |
| **Coverage vs. dedup accuracy** | More RSS sources = more potential duplicates | Tune dedup thresholds; present tradeoff to Clarke |
| **Timeliness vs. completeness** | More sources = longer pipeline run time | Prioritize existing sources; add new sources incrementally |
| **UI richness vs. mobile performance** | More data per card = longer load on mobile | Follow mobile-first design; defer non-essential fields |

---

## Engagement Plan Template

For any new TII feature, define the engagement plan before requirements writing:

```
Feature: [feature name]

Stakeholders affected:
- Clarke: [how affected — approve PRD, validate content quality bar]
- Vietnam investors: [how affected — new content, changed display]
- economic-journalist: [how affected — schema change, prompt change]
- Trigger.dev cron: [how affected — schedule change, task change]

Elicitation plan:
1. [Research-based step: read which files?]
2. [Collaborative step: ask Clarke which questions?]
3. [Experimental step: validate which outputs?]

Review checkpoints:
- PRD draft → Clarke review
- Implementation complete → quality-engineer validation
- Post-deploy 48h → solution evaluation
```

---

## Stakeholder Communication Templates

### Presenting a PRD to Clarke
```
Feature: [name]
Problem it solves: [1 sentence]
What the system will do: [2-3 bullets, no implementation detail]
Success criteria: [how you'll know it worked]
Risk: [top 1-2 risks]
Decision needed: [Approve | Request changes | Defer]
```

### Surfacing a Stakeholder Conflict
```
Conflict: [description]
Stakeholder A position: [what they need]
Stakeholder B position: [what they need]
Option 1: [approach] — Trade-off: [what you gain vs. lose]
Option 2: [approach] — Trade-off: [what you gain vs. lose]
Recommendation: [your recommendation with rationale]
Decision needed from: Clarke
```

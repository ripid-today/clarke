# PRD Documentation Standards

## Key Principle

**PRD = WHAT to build + WHY it matters.** Technical Guidelines = HOW to implement.

## Template Structure (2-3 Pages, ~200 Lines Max)

### Section 1: Business Context (0.5 pages)
- Problem Statement (2-3 sentences)
- Business Value: User Impact, Business Impact, Strategic Alignment
- Scope Boundaries: IN SCOPE / OUT OF SCOPE
- Success Criteria: Functional, Quality, Timeline, Stakeholder

### Section 2: Requirements (1-1.5 pages)
- Max 5-8 functional requirements per PRD (split if more needed)
- Each requirement includes: Priority, Breaking Change flag, Description, User Impact, Acceptance Criteria, Dependencies, Technical Guideline Reference
- Non-functional: Performance, Security, Accessibility, Scalability

### Section 3: Constraints & Dependencies (0.25 pages)
- Technical constraints, timeline constraints, external dependencies

### Section 4: Risks & Assumptions (0.3 pages)
- Top 3-5 HIGH/CRITICAL risks with mitigation steps and owners
- Critical assumptions with validation status

### Section 5: Developer Handoff (0.4 pages)
- Implementation sequence (phased)
- Key files to modify (5-10 max)
- Success validation (1 test per P0-P1 requirement)
- Rollback plan reference
- Definition of Done

## Priority Definitions

- **P0-Critical:** Blocking, system broken without it
- **P1-High:** Must-have for MVP, core functionality
- **P2-Medium:** Should-have, enhances UX but not blocking
- **P3-Low:** Nice-to-have, add when resources available

## 95% Confidence Criteria (All Must Be Met)

1. Understand all requirements completely
2. Can write spec that fits 2-3 page template
3. Anticipate edge cases
4. Know acceptance criteria (testable, specific)
5. Clear on constraints and dependencies
6. Know what belongs in PRD vs Technical Guidelines

## What Does NOT Belong in PRD

- Market analysis, competitive benchmarking
- Detailed technical specs (color hex codes, font sizes, API templates)
- Code snippets, migration scripts
- Exhaustive file lists (just 5-10 critical ones)
- 50+ test scenarios (just 1 critical test per P0-P1 requirement)

## Acceptance Criteria Format Guide

- **Functional:** Given [context], when [action], then [outcome]
- **Data:** Field X = value Y in collection Z
- **UI:** Element X displays with property Y
- **API:** Endpoint X returns status Y with schema Z

---

## Anti-Patterns — Common PRD Writing Mistakes

Avoid these pitfalls. Each one erodes the "PRD = WHAT + WHY" principle.

### 1. Writing HOW instead of WHAT

**Wrong:**
> "The system will use a WriteBatch with 500-op batches, committing after each chunk, then calling `revalidatePath('/api/articles')`."

**Right:**
> "The system must persist all generated articles to Firestore within 60 seconds of pipeline completion."

Code snippets, migration scripts, database indexes, and architecture diagrams belong in Technical Guidelines — not PRDs. If a requirement reads like implementation instructions, rewrite it as an observable outcome.

### 2. Requirements without observable acceptance criteria

**Wrong:**
> "The system should be good. Article quality must be high."

**Right:**
> "Given a daily-news pipeline run completes, when an article is written to Firestore, then it must contain between 100 and 150 words as measured by splitting on whitespace."

Every acceptance criterion must have a specific, observable "Then" clause that a tester can verify without guessing. "Should be good" is not testable. A word count range is.

### 3. Missing priority flags

Every functional requirement must carry a P0–P3 priority label. Unlabeled requirements will be implemented in random order or ignored during time pressure. Assign priority at the moment of writing — do not leave it blank to fill in later.

### 4. Conflating "Description" with "Acceptance Criteria"

- **Description** = what the system does (actor + action + outcome, 1-2 sentences)
- **Acceptance Criteria** = how to verify it does it (Given/When/Then format)

These are two separate fields in the requirement structure. A description that says "The pipeline writes articles to Firestore" is correct. An acceptance criterion that says "Articles are written to Firestore" is wrong — it's just the description restated. The AC must tell the tester exactly what to check and what the pass threshold is.

### 5. Including 50+ test scenarios instead of 1 critical test per P0-P1

The Developer Handoff section should contain exactly one success validation test per P0 or P1 requirement. That test should be the single scenario most likely to catch a regression. Exhaustive scenario lists belong in QA test plans (quality-engineer owns those), not PRDs. The PRD's job is to define what "done" means, not to enumerate every edge case.

---

## TII-Specific PRD Notes

### Breaking Change Classification

For TII, flag a requirement as **BREAKING CHANGE: Yes** when it:
- Removes or renames a Firestore field (e.g., `excerpt` → `description`)
- Changes an API route's response schema
- Alters a Trigger.dev task's ID, cron pattern, or output format
- Changes the article word count target (affects QA thresholds)

### Scope Boundaries Template for TII

Use this template when scoping a TII PRD:

```
IN SCOPE:
- [Specific TII component or pipeline phase]
- [Specific data fields or routes affected]

OUT OF SCOPE:
- Changes to unrelated pipeline phases
- Financial Tracker app
- Clarke library content (library/ directory)
```

### Key Files to Reference in Developer Handoff

Common TII files to reference by name in the Developer Handoff section:

| File | What it controls |
|------|-----------------|
| `trigger/daily-news.ts` | The daily pipeline — fetch, group, write, dedup, ingest |
| `lib/firebase/admin.ts` | Admin SDK initialization |
| `lib/firebase/firestore.ts` | Firestore query functions |
| `app/page.tsx` | Homepage layout and article feed |
| `components/library/news/NewsArticleFeed.tsx` | Article card rendering |
| `types/library.ts` | TypeScript interfaces for Article and Folder |
| `config/news-sources.json` | RSS feed source list |
| `tailwind.config.ts` | Design tokens (colors, fonts) |

Only list the files actually relevant to the requirement — do not dump the full list into every PRD.

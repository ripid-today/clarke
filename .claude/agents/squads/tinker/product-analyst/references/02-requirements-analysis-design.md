# TII Requirements Analysis and Design Reference
## BABOK V3 Knowledge Area 4 — Adapted for The Intelligent Investor

---

## Purpose

This reference governs how requirements are structured, analyzed, and specified for TII features. TII requirements fall into four categories: data pipeline requirements (RSS → AI → Firestore), UI display requirements (Next.js components), integration requirements (Trigger.dev, AI SDK), and content quality requirements (brief standards).

**Load when:** Writing functional requirements for any TII feature; structuring acceptance criteria; analyzing requirement interdependencies.

---

## TII Requirement Types

| Type | Description | TII Examples |
|------|-------------|-------------|
| **Business** | WHY this change exists | "TII must deliver daily investment briefs to Vietnam retail investors by 9am GMT+7" |
| **Stakeholder** | WHAT Clarke or end users need | "As a Vietnam investor, I want to read a brief under 300 words so I can consume it quickly" |
| **Solution Functional** | WHAT the system must do | "The pipeline must reject briefs outside 200–300 words and log the rejection" |
| **Solution Non-Functional** | Performance, reliability, security constraints | "Firestore write must complete within 5 seconds per article" |
| **Transition** | One-time migration or cutover needs | "Existing articles without wordCount must have the field backfilled before the new UI deploys" |

---

## TII Requirement Quality Criteria

Every requirement must be:

| Criterion | Test | TII Example |
|-----------|------|-------------|
| **Atomic** | One behavior per requirement | FAIL: "Fetch RSS and generate brief" — PASS: separate requirements |
| **Complete** | No missing conditions | Specify what happens when RSS feed is empty |
| **Consistent** | No conflicts with other requirements | Word count 200–300 must not conflict with AI prompt max tokens |
| **Unambiguous** | One interpretation only | "brief" = content field of articles collection; not vague "summary" |
| **Testable** | Can write a pass/fail test | "wordCount ≥ 200 AND ≤ 300" is testable; "good quality" is not |
| **Feasible** | Within TII tech stack capability | Trigger.dev free tier max runtime: confirm before requiring 10min tasks |
| **Necessary** | Traceable to a business need | Every requirement must trace to a stakeholder need |

---

## TII Functional Requirement Patterns

### Data Pipeline Pattern
```
Actor: [economic-journalist agent | trigger cron | Firestore Admin SDK]
Action: [fetch | generate | validate | write | skip]
Condition: [when feed available | when wordCount < 200 | when duplicate detected]
Outcome: [article created | rejection logged | dedup flag set]
```

**Example:**
> REQ-01: The economic-journalist agent must reject any generated brief with word count outside 200–300 words, log the rejection with article title and word count, and skip the Firestore write for that article.

### UI Display Pattern
```
Actor: [user | Next.js server component | Next.js client component]
Trigger: [page load | navigation | filter change]
Condition: [when articles exist | when no articles | when loading]
Outcome: [renders component X | shows empty state | dims with opacity-60]
```

**Example:**
> REQ-02: When a user visits the TII homepage, the page must render the 10 most recent daily brief articles ordered by `createdAt` descending, with each card displaying title, word count badge, and formatted date.

### Schema Change Pattern
```
Breaking Change: [Yes | No]
Collection: [articles | folders]
Field: [fieldName]
Change: [add | rename | remove | type change]
Migration: [backfill script | optional for existing | required before deploy]
```

**Example:**
> REQ-03 (BREAKING CHANGE: Yes): The articles collection must include a `wordCount` field (type: number) on all new articles. Existing articles must be backfilled via migration script before the new UI requirement (REQ-02) deploys.

---

## Acceptance Criteria Format for TII

Use Given/When/Then format with TII-specific actors and conditions:

```
Given [TII system state or precondition]
When  [actor action or trigger]
Then  [observable, measurable outcome]
  AND [additional outcome if needed]
```

**Examples:**
```
Given the RSS feed for "Vietnam Markets" returns 5 new articles
When the economic-journalist agent runs at 9am GMT+7
Then 5 articles exist in Firestore with status="published" and wordCount between 200 and 300
  AND no article title duplicates an article created in the last 7 days

Given a user visits the TII homepage on a mobile device (320px width)
When the page loads
Then all brief cards render without horizontal overflow
  AND each card title is truncated to 2 lines maximum
```

---

## Requirement Dependency Patterns in TII

| Dependency Type | Example |
|----------------|---------|
| **Schema before UI** | wordCount field (REQ-03) must deploy before word count badge in UI (REQ-02) |
| **Pipeline before display** | Articles must exist in Firestore before homepage can display them |
| **Dedup before write** | Dedup check must complete before Firestore write to prevent duplicates |
| **Migration before feature** | Any schema migration must run before code requiring the new field deploys |

Always document these in the PRD Dependencies column using: `REQ-XXX (reason)`.

---

## Non-Functional Requirements for TII

| Category | Examples | Default Target |
|----------|---------|----------------|
| **Performance** | Firestore write latency, page load time | Write < 5s; homepage FCP < 2s |
| **Reliability** | Pipeline run success rate | 100% daily runs succeed |
| **Data quality** | Brief word count compliance | 100% of briefs 200–300 words |
| **Security** | Secrets in env vars, Firebase Admin server-only | Always — no exceptions |
| **Accessibility** | Focus rings, min 44px touch targets, contrast | WCAG AA minimum |
| **Scalability** | Firestore batch limit | 500 ops per batch max |

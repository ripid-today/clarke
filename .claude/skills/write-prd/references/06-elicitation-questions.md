# Elicitation Questions Reference
## Write PRD Skill — Reference 06

---

## Purpose

A curated question bank organized by requirement type. Use these questions to fill confidence gaps before writing PRD requirements. Target: ≥95% confidence before drafting.

**Load when:** Confidence is <95%; specific gaps exist in functional, NFR, constraint, validation, or edge case understanding.

---

## How to Use This Reference

1. Identify which gap is causing low confidence (Clarity, Context, Capability, Precedent, Completeness)
2. Navigate to the relevant category below
3. Select the 3-5 highest-impact questions (prioritize questions that would change the most requirements if answered differently)
4. Use AskUserQuestion with discrete options + "Other" — never open-ended unless truly exploratory

---

## Category 1: Functional Questions (15 questions)

### Trigger and Entry
1. What event or user action initiates this feature? (a) User clicks a UI element b) API call from external system c) Scheduled/automatic d) User types in a search field e) Other)
2. Where does the user currently perform this task, if anywhere? (a) Nowhere — this is new b) External tool c) Different part of the app d) Manual process e) Other)
3. What is the primary happy-path flow? (a) User selects option → view results b) User types → real-time filter c) User submits form → confirmation d) Other — describe)

### Actor Clarity
4. Who is the primary actor? (a) Anonymous reader b) Authenticated reader c) Content admin/author d) System (automated) e) Other)
5. Are there secondary actors who can see or affect the same data? (a) No — single user b) Yes — concurrent users possible c) Yes — admin has override access d) Other)

### Data Requirements
6. What data does this feature need to read from the database? (a) Articles only b) Folders only c) Both articles and folders d) Search index e) Other)
7. What data does this feature need to write? (a) Read-only — no writes b) Creates new documents c) Updates existing documents d) Deletes documents e) Other)
8. Are there relationships between entities that must be maintained? (a) No — standalone data b) Yes — must maintain parent-child folder structure c) Yes — must maintain article count d) Yes — must maintain search index e) Other)

### Business Rules
9. Are there any business rules that determine when this feature is available? (a) Always available b) Feature flag controlled c) Role-based (admin only) d) Content-state dependent (published only) e) Other)
10. What is the maximum volume of data this feature might operate on? (a) <100 items b) 100-1000 items c) 1000-10000 items d) Unknown e) Other)

### Happy Path Details
11. What should happen immediately after the primary action completes? (a) Page refreshes with updated content b) In-place update without page reload c) Navigation to different page d) Success confirmation message e) Other)
12. Should the feature state persist across browser sessions? (a) No — resets on navigation/refresh b) Yes — stored in URL params c) Yes — stored in browser storage d) Yes — stored server-side per user e) Other)

### Edge Cases (Initial)
13. What should happen if the feature finds no data matching the input? (a) Show empty state message b) Show all data as default c) Hide the component entirely d) Show error message e) Other)
14. Should this feature be available on mobile? (a) Yes — full functionality b) Yes — simplified mobile view c) No — desktop only d) Not decided yet)
15. Is there a priority or sort order that results should respect? (a) No sort — display as stored b) Sort by relevance score c) Sort by article order field d) Sort by date e) Other)

---

## Category 2: Non-Functional Requirement Questions (10 questions)

### Performance
16. What is the acceptable maximum response time for this feature under normal load? (a) <200ms (instant feel) b) <500ms (fast) c) <2s (acceptable) d) No specific requirement e) Other)
17. Will this feature be used by many concurrent users at once? (a) No — single admin user b) Low — <10 concurrent c) Medium — 10-100 concurrent d) High — 100+ concurrent e) Unknown)

### Availability
18. What should happen when Firebase/Firestore is temporarily unavailable? (a) Show error page b) Show cached data if available c) Show user-friendly error message d) Retry automatically e) Other)

### Security
19. Does this feature expose any sensitive data? (a) No — public content only b) Yes — user data c) Yes — admin credentials d) Yes — business-sensitive content e) Other)
20. Are there any new user inputs that could be submitted to the database? (a) No new inputs b) Yes — text fields c) Yes — file uploads d) Yes — URL parameters e) Other)

### Accessibility
21. Does this feature include any new interactive UI elements? (a) No — display only b) Yes — buttons/links c) Yes — form inputs d) Yes — dynamic content (live regions) e) Other)

### Scalability
22. Does this feature require any database migration or index rebuild? (a) No — read-only b) Yes — new index required c) Yes — field addition/rename d) Yes — data transformation e) Other)

### Reliability
23. What error message should the user see if this feature fails? (a) Generic "Something went wrong. Try again." b) Feature-specific message explaining what failed c) Silent failure (don't show error) d) Redirect to error page e) Other)
24. Are there any data consistency requirements (e.g., counts that must stay in sync)? (a) No b) Yes — article counts in folders c) Yes — search index must stay in sync d) Yes — other: describe e) Other)
25. Should partial failures be handled gracefully? (a) Yes — show partial results b) Yes — show loading state for missing parts c) No — all-or-nothing d) Other)

---

## Category 3: Constraint Questions (8 questions)

### Technical Constraints
26. Must this feature work within the existing Next.js 15 App Router structure? (a) Yes — no framework changes b) Yes — but can add new routes c) No — can restructure if needed d) Not sure)
27. Must this feature use the existing Firestore data model, or can the schema be modified? (a) Read-only — no schema changes b) Can add new fields c) Can add new collections d) Can modify existing fields (breaking change) e) Other)

### Timeline Constraints
28. Is there a hard deadline for this feature? (a) No hard deadline b) Yes — [date] (describe reason) c) Soft deadline — prefer [date] but flexible d) Other)
29. What is the fallback plan if only P0-P1 requirements can be delivered? (a) Deliver P0-P1 only — P2-P3 in follow-up sprint b) Delay entire feature c) No fallback — full feature required d) Other)

### Budget / Scope Constraints
30. Should this feature be implemented as a minimal viable version first, then expanded? (a) Yes — MVP first b) No — full feature in one release c) Yes — but define what MVP includes d) Other)
31. Are there any third-party services or external APIs involved? (a) No — uses existing Firebase only b) Yes — [service name] c) Considering it but not decided d) Other)

### Regulatory / Policy Constraints
32. Are there any accessibility compliance requirements beyond WCAG AA? (a) No — WCAG AA sufficient b) Yes — WCAG AAA required c) Yes — specific regulations apply d) Not sure)
33. Are there data retention or privacy requirements? (a) No — public content, no privacy concern b) Yes — user data must be deleted on request c) Yes — data retention limits apply d) Other)

---

## Category 4: Validation Questions (10 questions)

### Paraphrase Validation
34. "I understand the goal as: [restatement]. Is that accurate?" → (a) Yes, correct b) Mostly — one clarification c) No — let me re-explain d) Other)
35. "I plan to specify [requirement] as: [exact requirement text]. Does that capture your intent?" → (a) Yes, exactly b) Close — minor adjustment c) No — that's not what I meant d) Other)

### Priority Confirmation
36. "If we can only deliver one requirement, which delivers the most business value?" (List requirements for ranking)
37. "Would you defer [specific P2 requirement] if it meant delivering [P0-P1 requirements] 2 weeks sooner?" (a) Yes — defer it b) No — must ship together c) Maybe — depends on scope d) Other)

### Success Definition
38. "How will you measure whether this feature is successful 30 days after launch?" (a) User adoption rate (what %) b) Error rate reduction (what %) c) Performance improvement (what metric) d) Stakeholder satisfaction e) Other)
39. "What does failure look like for this feature?" (a) Low adoption b) Performance regression c) Bug reports above threshold d) Specific user complaint e) Other)

### Negative Space (What Was Not Said)
40. "Should this feature affect [adjacent feature] behavior?" (a) No — isolated change b) Yes — intentionally c) Not sure — let's check d) Other)
41. "Are there any existing features that should NOT work differently after this change?" (a) No concerns b) Yes — [specific feature] must be preserved c) Not sure — need to check d) Other)

### Dependency Reveal
42. "Does this feature depend on any other feature that is not yet built?" (a) No dependencies b) Yes — [feature name] must be done first c) Soft dependency — preferred but not blocking d) Other)
43. "Are there any upcoming changes that might conflict with this feature?" (a) No known conflicts b) Yes — [change in progress] c) Maybe — need to check d) Other)

---

## Category 5: Edge Case Discovery Questions (12 questions)

### Empty States
44. What should appear when the feature loads but has no data to display yet? (a) Empty state illustration + message b) Prompt to create first item c) Hide the component d) Show placeholder/skeleton e) Other)
45. Should empty states differ based on why there is no data (no results vs. loading vs. error)? (a) No — same message for all b) Yes — distinguish loading/error/empty c) Other)

### Error States
46. What should happen if the database query fails? (a) Show generic error message b) Show feature-specific error c) Show cached data if available d) Show empty state e) Other)
47. What should happen if a referenced entity (folder, article) no longer exists? (a) Show 404 page b) Remove from display gracefully c) Show error indicator inline d) Other)

### Maximum Load
48. What is the expected maximum number of results this feature might return? (a) <20 b) 20-100 c) 100-500 d) Unlimited — must paginate e) Other)
49. Should results be paginated? (a) No — show all b) Yes — with how many per page? c) Infinite scroll d) Load more button e) Other)

### Concurrent Modification
50. What should happen if the data changes while the user is viewing it? (a) Show stale data — no real-time updates b) Refresh automatically c) Show update indicator d) No concern — unlikely scenario e) Other)

### Partial Completion
51. If a multi-step operation partially completes before an error, what should happen? (a) Roll back everything b) Keep completed steps c) Retry failed steps automatically d) Show partial result with error e) Other)

### Historical Data
52. Should this feature apply to data created before its implementation? (a) Yes — backfill required b) No — new data only c) Partial — define cutoff date d) Other)
53. Should this feature preserve existing URL patterns? (a) Yes — breaking URL changes not allowed b) No — URL structure can change c) Yes — with redirects for old URLs d) Other)

### Migration Edge Cases
54. How should the feature behave during a migration if some documents are in the old format and some in the new? (a) Support both formats during transition b) Require migration complete before feature launches c) Show only fully-migrated data d) Other)
55. What is the rollback plan if this feature causes a regression? (a) Git revert + redeploy b) Feature flag disable c) Database rollback required d) No rollback needed — non-destructive e) Other)

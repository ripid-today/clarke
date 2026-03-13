# Acceptance Criteria Reference
## Write PRD Skill — Reference 04

---

## Purpose

Acceptance criteria are the contract between the BA and the developer. A criterion is only good if a developer can write a pass/fail test for it without asking any follow-up questions.

**Load when:** Writing acceptance criteria for any requirement; criteria feel vague; need to verify testability.

---

## Given/When/Then Anatomy

Every acceptance criterion follows this structure:

```
Given [precondition — the system state before the action]
When [action — the specific event or input that triggers the behavior]
Then [expected outcome — specific, observable, measurable result]
```

### Rules for Each Clause

**Given (precondition):**
- Describe the state, not the history of how we got there
- Include all context a developer needs to set up the test
- Use specific data values, not vague descriptions

**When (action):**
- One action per criterion (if "and" appears in When, split the criterion)
- Be specific: "the user clicks the 'Filter by folder' dropdown" not "the user filters"
- Include specific input values where relevant

**Then (outcome):**
- Observable and measurable — developer can verify with code or manual check
- Include specific values, not vague descriptions ("displays 3 articles" not "displays relevant articles")
- If timing matters, include it ("within 500ms")
- If UI state matters, describe exact visual change

---

## 5 BDD Scenario Patterns

### Pattern 1: Happy Path
The primary success scenario — normal inputs, expected behavior.
```
Given the search index contains 15 articles across 3 folders
When the reader selects "Module 3" from the folder filter dropdown
Then the search results display exactly the articles in the Module 3 folder
And the folder filter chip shows "Module 3" as active
```

### Pattern 2: Validation Failure
Invalid or missing input — system rejects gracefully.
```
Given a POST request to /api/library/articles
When the request body contains a description field with 201 characters
Then the API returns HTTP 400
And the response body contains { "error": "Description must be 200 characters or less" }
```

### Pattern 3: Empty State
No data matches — system communicates clearly.
```
Given the search index contains 0 articles matching "quantum computing"
When the reader submits a search for "quantum computing"
Then the search results area displays the empty state message "No articles found for 'quantum computing'"
And the page does not display a blank content area
```

### Pattern 4: Permission / Access
User lacks authority — system denies gracefully.
```
Given an unauthenticated request to /api/admin/articles
When the request does not include a valid admin token
Then the API returns HTTP 401
And the response body contains { "error": "Authentication required" }
```

### Pattern 5: Error Recovery
System or service failure — degraded experience maintained.
```
Given the Firestore search index is unavailable
When the reader submits a search query
Then the page displays "Search is temporarily unavailable. Please try again."
And the page does not display an unhandled error or blank state
```

---

## 6 Testability Criteria

A criterion is testable if it passes all 6 checks:

| Criterion | Question | Fail Signal |
|-----------|----------|-------------|
| **Observable** | Can a developer see the outcome without instrumentation? | Outcome is internal state not visible via UI or API |
| **Specific** | Does it contain exact values, not ranges or approximations? | "several", "many", "appropriate" appear in Then |
| **Atomic** | Does it test exactly one behavior? | "and" appears in a single Then clause |
| **Context-complete** | Is the Given clause sufficient to reproduce the test? | Developer needs to ask "what state should the system be in?" |
| **Deterministic** | Will it produce the same result every time? | Random behavior, timing dependencies, external service dependency |
| **Developer-executable** | Can the developer run this without the BA present? | Requires business knowledge to interpret the outcome |

---

## Edge Case Pattern Library

### Boundary Values
Test at the limit, one under, and one over:
- Character limits: "200 characters" → test with 199, 200, 201
- Numeric ranges: test minimum, maximum, and out-of-range

### Null / Empty Inputs
- Empty string: `""` submitted as required field
- Null: field omitted from request body entirely
- Whitespace-only: `"   "` submitted as text field

### Encoding
- Special characters in text fields: `<script>alert('xss')</script>` (should be sanitized)
- Unicode characters in slugs (should be rejected by slug validation)
- Very long strings (test against max length validation)

### Concurrent Access
- Two requests for the same resource simultaneously
- Write during read (stale data concern)
- Duplicate submission (double-click prevention)

### Migration Edge Cases
- Documents with old field names (fallback behavior)
- Documents with missing optional fields
- Documents created during migration (hybrid state)

---

## Clarke-Specific AC Templates

### API Validation (POST endpoint)
```
Given a POST request to [endpoint]
When the request body [condition — missing field / invalid type / exceeded limit]
Then the API returns HTTP [400/404/500]
And the response body contains { "error": "[exact error message text]" }
```

### Firestore Read
```
Given [collection] contains [count] documents matching [criteria]
When [trigger — user action or API call]
Then the response contains exactly [count] documents
And each document includes [required fields]
```

### UI Rendering
```
Given [page context]
When [trigger — page load / user action]
Then [specific element] displays [exact content or state]
And [secondary UI element] [exact state change]
```

### Navigation / URL State
```
Given the reader is on [starting page]
When the reader [action that triggers navigation]
Then the URL changes to [exact URL pattern]
And the page displays [content matching the new URL state]
```

### Character Limit Enforcement (API)
```
Given a POST request to [endpoint]
When the [field] value contains [N+1] characters (where N = max limit)
Then the API returns HTTP 400
And the response body contains { "error": "[Field name] must be [N] characters or less" }
```

### Character Limit Enforcement (UI)
```
Given the reader is on [page with input field]
When the reader types more than [N] characters into [field]
Then the input field displays a character count showing "[current]/[max]"
And the field [prevents additional input / highlights in error state]
```

---

## Anti-Patterns in Acceptance Criteria

| Anti-Pattern | Example | Fix |
|--------------|---------|-----|
| Vague Then | "...then the search works correctly" | "...then the results display only articles in the selected folder" |
| Multiple behaviors per criterion | "...then filter applies and URL updates and count shows" | Split into 3 separate criteria |
| Missing Given | "When user clicks filter, then results update" | Add Given: "Given search results are displayed..." |
| Non-observable outcome | "...then the cache is invalidated" | "...then a subsequent request returns updated data within 1 second" |
| Business logic in criterion | "...then articles with higher priority appear first" | "...then articles with `order` values 1, 2, 3 appear in ascending order" |

---
name: qa-toolkit
description: "Quality assurance toolkit providing test planning, test execution, bug reporting, and requirements validation capabilities. Use when creating test plans, running tests, documenting bugs, or validating that code implementations match their specifications — trigger phrases include 'create test plan', 'run tests', 'validate implementation', 'report bug', and 'does this match requirements'. Use even if the user only says 'check if this works'."
user-invokable: false
---

# QA Toolkit

Validate implementations against requirements and catch issues before they reach production. Start with the deployment checklist — every other step builds on that foundation.

---

## Step 1: Run Pre-Deployment Checklist

**ALWAYS reference the Deployment Guideline before creating test plans.** It defines the mandatory categories that every release must pass.

### Deployment Guideline Location
- `library/guidelines/deployment-guideline.md`
- Section 2: Pre-Deployment Checklist
- Section 5: Monitoring & Validation

### Mandatory Test Categories
1. Code quality: TypeScript compiles, ESLint passes
2. Cross-browser: Chrome, Firefox, Safari
3. Mobile responsive: 320px, 768px, 1024px
4. Lighthouse audit: Performance ≥90, Accessibility ≥90
5. Database backup verified (if schema changes)

---

## Step 2: Plan Tests

Create a comprehensive test plan based on requirements and acceptance criteria — covering happy path, edge cases, and failure scenarios.

### Process

1. Analyze requirements document and acceptance criteria
2. Identify test scenarios for each requirement:
   - Happy path (expected normal usage)
   - Edge cases (boundary values, empty states, max limits)
   - Error conditions (invalid input, network failures, timeouts)
   - Integration points (API calls, database operations, third-party services)
3. Determine test types needed per scenario:
   - **Unit tests** for isolated functions and components
   - **Integration tests** for component interactions and API flows
   - **E2E tests** for critical user workflows
4. Prioritize: blockers first, then major paths, then minor paths

### Output

- Numbered test scenarios with expected results
- Test type assignment per scenario
- Priority order for execution
- Estimated coverage assessment

---

## Step 3: Execute Tests

Run unit, integration, and E2E tests in order and collect results with full failure context.

### Process

1. Identify the project's test framework and commands:
   - Check `package.json` scripts for test commands
   - Look for test config files (jest.config, vitest.config, playwright.config)
2. Execute tests in order:
   - Unit tests first (`npm test` or equivalent)
   - Integration tests second
   - E2E tests last (if applicable)
3. Capture output for each test run
4. Collect pass/fail status per test
5. For failures: capture error message, stack trace, and relevant context

### Execution Commands

Try in order until one works:
```
npm test
npm run test
npx jest
npx vitest
```

For E2E:
```
npx playwright test
npm run test:e2e
```

### Output

- Pass/fail status per test
- Failure details with error messages and stack traces
- Test coverage metrics (if available)
- Total execution summary

---

## Step 4: Report Bugs

Document issues with clear, actionable reproduction steps so developers can fix without follow-up questions.

### Report Template

For each issue found, produce:

```
### [BUG] [Severity] - [Clear descriptive title]

**Severity:** blocker | major | minor
**Related Requirement:** [requirement reference]

**Steps to Reproduce:**
1. [Specific step]
2. [Specific step]
3. [Specific step]

**Expected Behavior:**
[What should happen]

**Actual Behavior:**
[What actually happens]

**Error Output:**
[Relevant logs, error messages, or stack traces]

**Environment:**
[OS, Node version, browser if applicable]
```

### Severity Guidelines

- **Blocker**: Prevents core functionality, no workaround exists
- **Major**: Significant functionality broken, workaround may exist
- **Minor**: Cosmetic issues, edge cases, non-critical behavior

---

## Step 5: Validate Requirements

Verify that the implementation matches every requirement point by point — produce a validation matrix as evidence.

### Process

1. Read the requirements document and extract each numbered requirement
2. For each requirement:
   - Locate the implementing code
   - Test against each acceptance criterion
   - Verify edge cases are handled
   - Confirm constraints are met
3. Produce a validation matrix

### Validation Matrix Format

| Requirement | Acceptance Criteria | Status | Evidence |
|-------------|-------------------|--------|----------|
| REQ-001 | [criteria] | PASS/FAIL | [file:line or test name] |

### Output

- Validation matrix (above)
- List of unmet requirements
- List of requirements with partial coverage
- Overall approval recommendation (approve / reject with reasons)

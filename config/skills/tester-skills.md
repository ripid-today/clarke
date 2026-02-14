# QA Tester Skills

## test-planner

**Purpose:** Create comprehensive test plans based on requirements.

**Input:**
- Requirements document
- Acceptance criteria
- Code changes made

**Process:**
1. Analyze requirements and acceptance criteria
2. Identify test scenarios:
   - Happy path tests
   - Edge cases
   - Error conditions
   - Integration points
3. Determine test types needed:
   - Unit tests
   - Integration tests
   - E2E tests
4. Create test plan with prioritization

**Output:**
- Test plan document
- Test scenarios list
- Test type recommendations
- Priority order

**Implementation:** `src/agents/qa-tester/skills/test-planner.ts`

---

## test-executor

**Purpose:** Run unit, integration, and E2E tests.

**Input:**
- Test plan
- Code changes
- Test environment

**Process:**
1. Set up test environment
2. Execute tests:
   - Run unit tests
   - Run integration tests
   - Run E2E tests (if applicable)
3. Collect results
4. Capture failures with details
5. Generate test report

**Output:**
- Test execution results
- Pass/fail status for each test
- Failure details and logs
- Test coverage metrics

**Implementation:** `src/agents/qa-tester/skills/test-executor.ts`

---

## bug-reporter

**Purpose:** Document issues with clear reproduction steps.

**Input:**
- Test failures
- Expected behavior
- Actual behavior

**Process:**
1. For each issue, document:
   - Clear title
   - Description
   - Steps to reproduce
   - Expected behavior
   - Actual behavior
   - Environment/context
   - Severity level
2. Attach logs/screenshots if helpful
3. Link to related requirements

**Output:**
- Issue reports array
- Each issue with:
  - Title
  - Description
  - Reproduction steps
  - Expected vs actual
  - Severity (blocker, major, minor)
  - Related requirements

**Implementation:** `src/agents/qa-tester/skills/bug-reporter.ts`

---

## requirements-validator

**Purpose:** Verify implementation matches specifications.

**Input:**
- Requirements document
- Acceptance criteria
- Implemented features

**Process:**
1. For each requirement:
   - Verify implementation exists
   - Test against acceptance criteria
   - Check edge cases handled
   - Validate constraints met
2. Identify gaps or mismatches
3. Provide validation report

**Output:**
- Validation results per requirement
- Pass/fail for each criterion
- Gaps or mismatches identified
- Overall approval recommendation

**Implementation:** `src/agents/qa-tester/skills/requirements-validator.ts`

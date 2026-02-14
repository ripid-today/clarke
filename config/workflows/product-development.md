# Product Development Pipeline

## Workflow ID
product-development

## Purpose
Transform requirement changes into tested, deployed features for Clarke's Library website.

## Trigger
User requests feature changes or updates to product/website.

## Stages

### Stage 1: Requirements
**Agent:** Business Analyst

**Confidence Threshold:** 95%

**Skills Used:**
- requirements-analyzer
- question-generator
- documentation-writer

**Input:**
- `requirementChange`: Description of requested change/feature

**Process:**
1. Read existing product requirements
2. Assess understanding level
3. **If <95% confident:** Ask detailed questions, iterate until confident
4. **If ≥95% confident:** Write updated requirements

**Output:**
- `requirements`: Updated requirements document
- `confident`: Boolean indicating confidence achieved
- `acceptanceCriteria`: Clear success criteria
- `edgeCases`: Identified edge cases

**Dependencies:** None (first stage)

**Timeout:** 10 minutes (includes potential Q&A iterations)

---

### Stage 2: Development
**Agent:** Web Developer

**Skills Used:**
- code-analyzer
- minimal-change-detector
- frontend-dev
- backend-dev

**Input:**
- `requirements`: ${stages.requirements.output.requirements}
- `acceptanceCriteria`: ${stages.requirements.output.acceptanceCriteria}

**Process:**
1. Read existing FE/BE codebase
2. Read requirements (existing + updates)
3. Identify minimal, effective code changes
4. Implement changes
5. Self-review for requirements alignment

**Output:**
- `codeChanges`: Array of changes made
- `filesModified`: List of modified files
- `implementationNotes`: Developer notes

**Dependencies:** requirements (95% confidence achieved)

**Timeout:** 30 minutes

---

### Stage 3: Testing
**Agent:** QA Tester

**Skills Used:**
- test-planner
- test-executor
- requirements-validator
- bug-reporter

**Input:**
- `codeChanges`: ${stages.development.output.codeChanges}
- `requirements`: ${stages.requirements.output.requirements}
- `acceptanceCriteria`: ${stages.requirements.output.acceptanceCriteria}

**Process:**
1. Review requirements and acceptance criteria
2. Create test plan (unit, integration, E2E as needed)
3. Execute tests
4. Validate against requirements
5. Document issues OR approve

**Output:**
- `testResults`: Test execution results
- `approved`: Boolean indicating approval
- `issues`: Array of bugs/issues found (if any)

**Dependencies:** development

**Timeout:** 20 minutes

**Feedback Loop:** If issues found, return to development stage

---

### Stage 4: Deployment (Conditional)
**Agent:** Web Developer (MVP) or DevOps Engineer

**Trigger:** Testing approved = true

**Process:**
1. Deploy to staging/production
2. Monitor deployment
3. Rollback if issues

**Output:**
- `deploymentStatus`: Success/failure
- `deployedUrl`: Live URL
- `deploymentTime`: Timestamp

**Dependencies:** testing (approved = true)

**Timeout:** 10 minutes

---

## Success Criteria
- Requirements documented with 95% confidence
- Code changes are minimal and effective
- All tests pass
- Successfully deployed

## Error Handling
- Requirements stage: Loop questions until 95% confident
- Development stage: If fails, review requirements for gaps
- Testing stage: Return to development with issue details
- Deployment stage: Automatic rollback on failure

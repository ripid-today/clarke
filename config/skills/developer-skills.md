# Web Developer Skills

## code-analyzer

**Purpose:** Analyze existing codebase to understand patterns and architecture.

**Input:**
- Codebase directory
- File patterns to analyze

**Process:**
1. Scan codebase structure
2. Identify patterns:
   - Component organization
   - State management approach
   - API patterns
   - Styling system
   - Testing patterns
3. Extract conventions and standards
4. Identify reusable components/utilities

**Output:**
- Codebase structure map
- Patterns and conventions identified
- Reusable components list
- Architecture understanding

**Implementation:** `src/agents/web-developer/skills/code-analyzer.ts`

---

## minimal-change-detector

**Purpose:** Identify smallest effective changeset to meet requirements.

**Input:**
- Requirements
- Current codebase
- Acceptance criteria

**Process:**
1. Map requirements to affected code areas
2. Identify multiple implementation approaches
3. Evaluate each for:
   - Code changes required
   - Complexity
   - Risk
   - Alignment with existing patterns
4. Select minimal, effective approach
5. Generate changeset plan

**Output:**
- Recommended approach
- List of files to modify
- Estimated change scope
- Justification for approach

**Implementation:** `src/agents/web-developer/skills/minimal-change-detector.ts`

---

## frontend-dev

**Purpose:** Implement React/Next.js UI components and features.

**Input:**
- UI requirements
- Design specifications (if any)
- Existing component patterns

**Process:**
1. Create/modify React components
2. Implement styling (Tailwind CSS)
3. Add interactivity and state management
4. Ensure responsive design
5. Follow accessibility best practices
6. Match existing code patterns

**Output:**
- React component implementations
- Styling updates
- Component integration

**Implementation:** `src/agents/web-developer/skills/frontend-dev.ts`

---

## backend-dev

**Purpose:** Implement API endpoints and business logic.

**Input:**
- API requirements
- Data models
- Existing backend patterns

**Process:**
1. Create/modify API endpoints
2. Implement business logic
3. Add data validation
4. Integrate with database/services
5. Handle errors appropriately
6. Follow existing patterns

**Output:**
- API endpoint implementations
- Business logic updates
- Integration code

**Implementation:** `src/agents/web-developer/skills/backend-dev.ts`

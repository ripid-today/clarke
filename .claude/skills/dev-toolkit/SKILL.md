---
name: dev-toolkit
description: "Web development toolkit providing codebase analysis, minimal change detection, frontend development (React/Next.js), and backend development (API endpoints) capabilities. Use when analyzing code patterns, identifying minimal changesets, implementing UI components, or building API endpoints and business logic."
user-invokable: false
---

# Dev Toolkit

## Code Analyzer

Analyze existing codebase to understand patterns and architecture before making changes.

### Process

1. Scan project structure using Glob:
   - `**/*.{ts,tsx,js,jsx}` for source files
   - `**/package.json` for dependencies
   - `**/*.config.*` for configuration
2. Identify patterns:
   - **Component organization**: file/folder structure, naming conventions
   - **State management**: Context, Redux, Zustand, or other
   - **API patterns**: REST routes, tRPC, GraphQL
   - **Styling system**: Tailwind, CSS modules, styled-components
   - **Testing patterns**: Jest, Vitest, Playwright, testing-library
3. Extract conventions (naming, imports, exports, error handling)
4. Identify reusable components and utilities

### Output

- Project structure overview
- Key patterns and conventions
- Reusable components/utilities list
- Tech stack summary

## Minimal Change Detector

Identify the smallest effective changeset to meet requirements.

### Process

1. Map each requirement to affected code areas using Grep and Read
2. For each affected area, identify:
   - Exact files that need modification
   - Exact functions/components that need changes
   - Whether new files are needed (minimize this)
3. Evaluate approaches for:
   - Lines of code changed (fewer is better)
   - Number of files touched (fewer is better)
   - Risk of breaking existing functionality (lower is better)
   - Alignment with existing patterns (higher is better)
4. Select the approach with minimum changes that fully meets requirements

### Decision Framework

| If... | Then... |
|-------|---------|
| Existing utility handles 80%+ of the need | Extend it, don't create new |
| Change touches >5 files | Reconsider approach, look for a more targeted solution |
| New abstraction needed for one use case | Inline the logic instead |
| Two valid approaches exist | Pick the one matching existing patterns |

### Output

- Recommended approach with justification
- Ordered list of files to modify
- Estimated change scope (lines added/modified/removed)
- Risk assessment

## Frontend Dev

Implement React/Next.js UI components and features.

### Stack

- **Framework**: Next.js (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Components**: Follow existing component patterns in the project

### Process

1. Check existing components for reuse opportunities
2. Create/modify components following project conventions
3. Implement styling with Tailwind CSS utility classes
4. Add interactivity and state management matching existing patterns
5. Ensure responsive design (mobile-first)
6. Follow accessibility basics (semantic HTML, aria labels, keyboard navigation)

### Rules

- Match existing component file structure and naming
- Use existing UI primitives before creating new ones
- Keep components focused - single responsibility
- Co-locate styles, types, and tests with components when that's the project pattern
- No inline styles when Tailwind classes exist

## Backend Dev

Implement API endpoints and business logic.

### Stack

- **Framework**: Next.js API Routes (App Router)
- **Language**: TypeScript
- **Database**: Follow existing project patterns (Firebase, Prisma, etc.)

### Process

1. Check existing API routes for patterns and conventions
2. Create/modify API endpoints following existing structure
3. Implement business logic with proper input validation
4. Add error handling at API boundaries (user-facing errors)
5. Integrate with existing database/service layer
6. Follow existing authentication/authorization patterns

### Rules

- Validate all user input at API boundary
- Return consistent error response format matching existing patterns
- Use existing database utilities and service functions
- Never expose internal errors to clients
- Follow existing middleware patterns for auth, logging, etc.
- Keep route handlers thin - delegate to service layer

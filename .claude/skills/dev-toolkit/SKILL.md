---
name: dev-toolkit
description: "Web development toolkit providing codebase analysis, minimal change detection, frontend development (React/Next.js), and backend development (API endpoints) capabilities. Use when analyzing code patterns, identifying minimal changesets, implementing UI components, or building API endpoints — trigger phrases include 'implement...', 'build a component...', 'fix bug in...', and 'add API endpoint for...'. Use even if the user hasn't specified a framework yet."
user-invokable: false
---

# Dev Toolkit

Implement features and fixes in the Clarke codebase with minimal, targeted changes. Always check Technical Guidelines before touching code — they contain the patterns, so you don't have to invent them.

---

## Step 1: Look Up Technical Guidelines

**ALWAYS consult Technical Guidelines BEFORE analyzing the codebase.** Guidelines contain the canonical patterns; use them directly rather than re-deriving from code.

### Process

1. **Identify change type:**
   - Frontend changes (UI, design, components) → Read `library/guidelines/frontend-guideline.md`
   - Backend changes (API, database, Firestore) → Read `library/guidelines/backend-guideline.md`
   - Deployment/rollback concerns → Read `library/guidelines/deployment-guideline.md`

2. **Look for patterns in guidelines:**
   - Color values? → Frontend Guideline → Section 1 (Design System → Color Palette)
   - API format? → Backend Guideline → Section 2 (API Conventions)
   - Migration script? → Backend Guideline → Section 5 (Migration Patterns)
   - Deployment checklist? → Deployment Guideline → Section 2 (Pre-Deployment Checklist)

3. **Copy patterns from guidelines** (don't reinvent):
   - Use exact Tailwind classes from Frontend Guideline
   - Use API response format template from Backend Guideline
   - Use migration script template from Backend Guideline

4. **Only analyze codebase if pattern NOT in guidelines**

### Decision Tree

```
Need to implement feature?
├─ Is pattern documented in Technical Guidelines?
│  ├─ YES → Copy pattern from guideline, adapt to specific requirement
│  └─ NO → Continue to Step 2 below
└─ Continue with dev work
```

---

## Step 2: Analyze Existing Code

Understand existing patterns and architecture before writing a single line of new code.

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

---

## Step 3: Identify Minimal Changeset

Identify the smallest effective set of changes to meet requirements — then implement only that.

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

---

## Step 4: Implement (Frontend / Backend)

Write the code using patterns from Steps 1–3. Match existing conventions exactly.

### Frontend (React/Next.js)

**Stack:** Next.js App Router · TypeScript · Tailwind CSS

1. Check existing components for reuse opportunities
2. Create/modify components following project conventions
3. Implement styling with Tailwind CSS utility classes
4. Add interactivity and state management matching existing patterns
5. Ensure responsive design (mobile-first)
6. Follow accessibility basics (semantic HTML, aria labels, keyboard navigation)

**Rules:**
- Match existing component file structure and naming
- Use existing UI primitives before creating new ones
- Keep components focused — single responsibility
- No inline styles when Tailwind classes exist

### Backend (API Routes)

**Stack:** Next.js API Routes (App Router) · TypeScript · Firebase/Firestore

1. Check existing API routes for patterns and conventions
2. Create/modify API endpoints following existing structure
3. Implement business logic with proper input validation
4. Add error handling at API boundaries (user-facing errors)
5. Integrate with existing database/service layer
6. Follow existing authentication/authorization patterns

**Rules:**
- Validate all user input at API boundary
- Return consistent error response format matching existing patterns
- Use existing database utilities and service functions
- Never expose internal errors to clients
- Keep route handlers thin — delegate to service layer

### LLM Integration

When calling an LLM (Haiku, Sonnet, etc.) and the output must have **distinct structured fields** (e.g., title + body, label + content):

- **Always use machine-readable delimiters** — e.g., `TITLE: ...` on its own line, then a blank line, then the body.
- **Never rely on prose-style instructions** like "start with X" or "no markdown" to enforce structure. Small models (Haiku) routinely ignore style instructions and will prepend headings, bullets, or preamble regardless.
- **Parse programmatically** after the API call using a regex on the delimiter (e.g., `/^TITLE:\s*(.+?)(?:\n|$)/`), then strip the delimiter line from the body.
- If the delimiter is absent in the response, fall back to a safe default (e.g., the topic title) rather than crashing.

```typescript
// Prompt snippet (reliable)
`TITLE: [a compelling, specific headline]

[1000+ word article body. No headers, bullets, or markdown.]`

// Parse (reliable)
const titleMatch = content.match(/^TITLE:\s*(.+?)(?:\n|$)/);
const parsedTitle = titleMatch ? titleMatch[1].trim() : fallback;
const contentBody = content.replace(/^TITLE:\s*.+?\n\n?/, "").trim();
```

# Clarke's Library

Multi-agent knowledge library system using Claude Agent SDK.

## Overview

Clarke's Library is a knowledge management system powered by AI agents that research, organize, and maintain a structured knowledge base.

## Architecture

### Context Management System

**CLAUDE.md Orchestrator** - Root-level orchestrator that triages tasks (MINOR vs MAJOR), assesses confidence (90% threshold), and routes to specialized agents. Replaces the previous librarian agent.

**5 Specialized Agents** (slimmed to 33-45 lines each):
- **business-analyst** - Writes PRDs with 95% confidence threshold
- **researcher** - Synthesizes information from documents
- **knowledge-organizer** - Maintains library taxonomy and organization
- **web-developer** - Implements features with minimal changes
- **qa-tester** - Validates implementations against requirements

**Path-Scoped Rules** (`.claude/rules/`) - Auto-load based on file context:
- `coding-standards.md` - TypeScript/React conventions (website/**/*.{ts,tsx,js,jsx})
- `design-system.md` - Colors, typography, spacing (website/**/*.{tsx,css,scss})
- `api-conventions.md` - HTTP methods, response format (website/app/api/**/*.ts)
- `database-schema.md` - Firestore collections, validation (website/app/api/**/*.ts)
- `prd-documentation-standards.md` - PRD template (library/requirements/PRDs/*.md)

**Token Efficiency:** 39% reduction in context loaded for major tasks (1,296 → 791 lines)

**2 Main Workflows:**
- **Knowledge Ingestion:** Documents → Research → Organize → Library
- **Product Development:** Requirements → Dev → Test → Deploy

## Setup

```bash
# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your API keys

# Run development
npm run dev
```

## Configuration

**Agent System:**
- `.claude/agents/*.md` - 5 specialized agent definitions (33-45 lines each)
- `.claude/skills/*/SKILL.md` - Agent-specific toolkits (ba-toolkit, dev-toolkit, qa-toolkit, etc.)
- `.claude/rules/*.md` - Path-scoped standards (auto-load based on file context)
- `CLAUDE.md` - Root orchestrator with triage logic and agent routing

**Documentation:**
- `library/requirements/PRDs/` - Product requirements (WHAT to build, WHY)
- `library/guidelines/` - Technical guidelines (HOW to build):
  - `backend-guideline.md` - API patterns, database, migrations
  - `frontend-guideline.md` - Design system, React patterns, accessibility
  - `deployment-guideline.md` - Deployment process, checklist, rollback

## Library Structure

```
library/
├── categories/          # Knowledge organized by category
├── metadata/           # Taxonomy, index, tags
└── requirements/       # Product specifications
```

## Tech Stack

- TypeScript + Claude Agent SDK
- Pinecone (vector search)
- React/Next.js (website)
- Markdown (knowledge storage)

## Documentation

**Agent System:** See `.claude/agents/` for specialized agent definitions and `CLAUDE.md` for orchestration logic.

**Development Standards:** See `library/guidelines/` for comprehensive technical guidelines (backend, frontend, deployment).

**Product Requirements:** See `library/requirements/PRDs/` for feature specifications following the 2-3 page PRD template.

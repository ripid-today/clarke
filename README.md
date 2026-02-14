# Clarke's Library

Multi-agent knowledge library system using Claude Agent SDK.

## Overview

Clarke's Library is a knowledge management system powered by AI agents that research, organize, and maintain a structured knowledge base.

## Architecture

**5 Core Agents:**
- **Orchestrator:** Manages workflows, ensures 90% confidence before execution
- **Researcher:** Finds and synthesizes information from documents
- **Knowledge Organizer:** Maintains library taxonomy and organization
- **Business Analyst:** Manages product requirements with 95% confidence threshold
- **Web Developer:** Implements features with minimal, effective changes
- **QA Tester:** Validates implementation against requirements

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

Agent, workflow, and skill definitions are in `config/` as Markdown files:
- `config/agents/*.md` - Agent definitions
- `config/workflows/*.md` - Workflow stages
- `config/skills/*.md` - Skill capabilities

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

See `config/` directory for detailed agent and workflow definitions.

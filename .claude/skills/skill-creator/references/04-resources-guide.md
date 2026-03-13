# Claude Code Skills: Full Documentation Reference

Canonical knowledge base for skill structure, frontmatter fields, triggering mechanisms, dynamic content, arguments, scope, and design patterns. Read this when writing a new skill and needing precise field semantics or advanced features.

---

## Skill Directory Structure (Complete)

```
skill-name/
├── SKILL.md           # Required. YAML frontmatter + markdown instructions
├── reference.md       # Optional — detailed reference material
├── examples.md        # Optional — usage examples
├── template.md        # Optional — templates for Claude to fill
└── scripts/
    └── helper.sh      # Optional — executable scripts
```

Canonical layout for multi-file skills:

```
skill-name/
├── SKILL.md
├── references/        # Domain knowledge, loaded on demand
├── scripts/           # Executable helpers
├── agents/            # Subagent-specific instruction files
└── assets/            # Templates, icons, fonts used in output
```

---

## All Frontmatter Fields

```yaml
name: skill-id              # kebab-case, matches folder name, max 64 chars
description: "..."          # Triggering mechanism — include WHAT + WHEN + specific phrases
disable-model-invocation: true  # Only user can invoke (side-effect skills)
user-invocable: false       # Only Claude can invoke (background reference, not in / menu)
argument-hint: [hint]       # Shown in autocomplete when user types /skill-name
allowed-tools: Read, Grep   # Grant access without per-use approval when skill is active
context: fork               # Run in isolated subagent context
agent: Explore              # Which subagent type to use (requires context: fork)
model: claude-opus-4-6      # Model override for this skill
```

---

## Three Triggering Mechanisms

### 1. Auto (Claude decides)
Default behavior. Claude reads the `description` field and decides if the skill is relevant to the user's request. Make descriptions keyword-rich and "pushy" — Claude tends to undertrigger.

### 2. User Direct Invocation
User types `/skill-name` or `/skill-name argument` in the CLI. Always works regardless of description.

### 3. Background Reference
Set `user-invocable: false`. The skill never appears in the slash-command menu and cannot be directly invoked by users. Claude can reference it, but only when programmatically instructed to (e.g., another skill points to it).

---

## Dynamic Content (Live Data Injection)

Use the `!` backtick syntax to inject live data before Claude sees the prompt:

```markdown
!`git log --oneline -5`
```

This runs the command at skill load time and injects its output inline. Use for:
- PR diffs (`git diff HEAD~1`)
- Git logs
- Live system state
- Any pre-processing needed before Claude starts

**Important:** The command runs before Claude sees the prompt. It's not interactive — it's pre-injection.

---

## Arguments

Three ways to reference arguments passed to a skill:

| Syntax | Meaning |
|--------|---------|
| `$ARGUMENTS` | Full argument string (everything after `/skill-name`) |
| `$ARGUMENTS[0]`, `$ARGUMENTS[1]` | Positional arguments |
| `$0`, `$1`, `$2` | Shorthand positional |

**Auto-append behavior:** If `$ARGUMENTS` is not explicitly referenced anywhere in SKILL.md, the argument string is automatically appended to the prompt. This is convenient for simple pass-through skills.

**Argument-driven modes example:**
```
/skill-creator "a skill that summarizes Slack threads"   → CREATE mode
/skill-creator update .claude/skills/qa-toolkit/SKILL.md → UPDATE mode
```

Parse `$ARGUMENTS` in the first step of SKILL.md to detect mode.

---

## Scope Hierarchy

Skills are resolved in this order (highest to lowest precedence):

1. **Enterprise** — organization-level skills
2. **Personal** (`~/.claude/skills/`) — user's own skills, any project
3. **Project** (`.claude/skills/`) — skills checked into the repo
4. **Plugin** — installed plugin skills

Project-level skills take precedence over plugins but not personal skills. This means a user's personal `write-prd` skill overrides the project one.

---

## Context Budget

Skills appear in the `available_skills` list, which consumes context. Keep total skill context under ~16KB (approximately 2% of the context window).

Check with `/context` in the Claude Code CLI.

**Practical implications:**
- SKILL.md under 500 lines (300 lines is better)
- Move large content to `references/` files — they only load when read
- Avoid redundant content across skills
- `user-invocable: false` skills don't appear in `available_skills` — use for large reference material

---

## Design Patterns (from Claude Code docs)

| Pattern | Key Flag(s) | When to Use |
|---------|-------------|-------------|
| Reference-based | none | Large domain knowledge, loaded on demand |
| Task-based (user-only) | `disable-model-invocation: true` | Side effects: /commit, /deploy, /send |
| Background knowledge | `user-invocable: false` | Reference Claude reads, users never invoke |
| Visual output | scripts/ + Python | Charts, PDFs, complex file generation |
| Subagent delegation | `context: fork, agent: Explore` | Parallel research or multi-role tasks |
| Dynamic context injection | `!`command`` syntax | Live data (git status, PR diffs, system state) |

---

## Best Practices (from Claude Code docs)

- **SKILL.md under 500 lines.** When approaching this limit, add another layer of hierarchy and clear pointers to where the model should go next.
- **Large references (>300 lines) need a table of contents.**
- **`disable-model-invocation: true`** for side-effect workflows (deployment, messaging, git push). Prevents accidental auto-invocation.
- **`user-invocable: false`** for pure reference material that should never surface in the slash-command menu.
- **Descriptions must be keyword-rich** for auto-invocation. Claude undertriggers by default — make descriptions pushy. Include both what the skill does AND specific contexts/phrases.
- **`allowed-tools`** grants tool access without per-use approval prompts when the skill is active. Use for skills that predictably need specific tools.
- **Arguments auto-append** if `$ARGUMENTS` is not explicitly referenced — convenient for simple passthrough but can be confusing, so reference `$ARGUMENTS` explicitly in argument-driven skills.

---

## Testing Checklist (from Claude Code docs)

| Test | How |
|------|-----|
| Auto-invocation | Use a phrase matching the description — verify skill triggers |
| Direct invocation | Type `/skill-name` — verify expected output |
| Discoverability | Type `/` in CLI — skill appears (unless `user-invocable: false`) |
| Context budget | Run `/context` — verify under 2% (~16KB) |
| Argument parsing | `/skill-name arg1 arg2` — verify `$ARGUMENTS` parsed correctly |

---

## Note on Anthropic PDF Guide

The official Anthropic PDF skills guide (binary PDF) cannot be fetched as text via web tools. The documentation above represents the canonical content extracted from Claude Code's public documentation. If the user has extracted text from the PDF, it can be incorporated here as a supplement.

---

## Related References in This Skill

- `references/01-skill-patterns.md` — 5 architectural patterns with decision matrix
- `references/02-writing-guide.md` — Frontmatter field guide, writing style, progressive disclosure
- `references/03-eval-guide.md` — Native eval workflow (no Python required)
- `references/schemas.md` — JSON schemas for evals.json, grading.json, benchmark.json

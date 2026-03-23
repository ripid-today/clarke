# Clarke Agent Squads — Master Index

Six squads cover every domain of Clarke's work. Each squad has its own `CLAUDE.md` dispatcher and internal agents with domain references and persistent memory.

---

## Squad Roster

| Squad | Domain | Agents | Invocation Trigger |
|-------|--------|--------|--------------------|
| **Commander** | Investment decisions — final authority, routes to Scout/Seer/Planner | 1 (single-agent squad) | buy / sell / invest / analyze [ticker] / portfolio / macro outlook |
| **Seer** | Risk-on bull case construction for Vietnam stocks | 1 (single-agent squad) | Invoked by Commander after Scout research — not directly |
| **Planner** | Risk-off bear case, capital preservation, position sizing | 1 (single-agent squad) | Invoked by Commander after Scout research — not directly |
| **Scout** | Investment research — macro, fundamental, technical analysis | 3 (macro-analyst, micro-analyst, technical-analyst) | Invoked by Commander — all 3 in parallel for full-chain analysis |
| **Tinker** | TII product development — features, bugs, UI, pipeline | 4 (product-analyst, frontend-engineer, backend-engineer, quality-engineer) | TII product / feature / bug / UI / pipeline task |
| **Libra** | Meta-infrastructure — agent I/O, memory health, skill building | 3 (orchestrator, memory-curator, skill-builder) | Memory update / agent improvement / skill creation |

---

## Squad Files

| Squad | CLAUDE.md |
|-------|-----------|
| Commander | `.claude/agents/squads/commander/CLAUDE.md` |
| Seer | `.claude/agents/squads/seer/CLAUDE.md` |
| Planner | `.claude/agents/squads/planner/CLAUDE.md` |
| Scout | `.claude/agents/squads/scout/CLAUDE.md` |
| Tinker | `.claude/agents/squads/tinker/CLAUDE.md` |
| Libra | `.claude/agents/squads/libra/CLAUDE.md` |

---

## Investment Decision Chain

Full-chain investment analysis (triggered by buy/sell/invest/analyze [ticker]):

```
Commander
  └─► Scout (parallel: macro-analyst + micro-analyst + technical-analyst)
         └─► Seer (bull case) ──┐
         └─► Planner (bear case) ┤
                                 └─► Commander (synthesize → verdict + position size)
```

Single-analyst shortcuts (targeted questions, no buy/sell intent):
- Macro/outlook → macro-analyst only
- Fundamentals + ticker → micro-analyst only
- Chart/technical + ticker → technical-analyst only

---

## Product Development Chain

TII product tasks (triggered by feature / bug / UI / pipeline request):

```
Tinker
  └─► product-analyst (PRD)
         └─► frontend-engineer ──┐ (parallel if both needed)
         └─► backend-engineer ───┘
                                 └─► quality-engineer (QA → approve or block)
```

Direct engineer routing (for bugs with clear root cause):
- UI/visual bug → frontend-engineer directly
- API/data bug → backend-engineer directly

---

## Invocation Convention

Address squads as: **"Hey [SquadName], [task description]"**

Examples:
- "Hey Commander, should I buy HPG?"
- "Hey Tinker, add word count to TII article cards"
- "Hey Libra, update backend-engineer memory with a new correction"

Each squad's `CLAUDE.md` handles internal routing. You do not need to address individual agents directly.

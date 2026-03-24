"""
bot/orchestrator.py

Multi-agent engine for Co.

Commander (Haiku 4.5) is the sole user-facing agent. It reads commander.md from disk
at runtime, receives injected session memory, and orchestrates the squad.

Seer (Haiku 4.5) is a silent knowledge researcher spawned synchronously by Commander
when memory or knowledge lookup is needed. Returns structured findings to Commander only.

Libra (Haiku 4.5) is a silent self-improvement agent fired as an asyncio background
task after every completed conversation. Never blocks the user response.
"""
from __future__ import annotations
import asyncio
import json
import logging
from datetime import date
from pathlib import Path
from typing import Any

import anthropic

from bot import config
from bot.tools import knowledge, memory, divination, pdf_gen

logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Anthropic client (shared across all three agents)
# ---------------------------------------------------------------------------

_anthropic = anthropic.Anthropic(api_key=config.ANTHROPIC_API_KEY)

# PDF storage keyed by telegram_id
_current_pdf: dict[int, bytes] = {}

# Model for all three agents
COMMANDER_MODEL = "claude-haiku-4-5-20251001"
SEER_MODEL = "claude-haiku-4-5-20251001"
LIBRA_MODEL = "claude-haiku-4-5-20251001"


# ---------------------------------------------------------------------------
# File helpers
# ---------------------------------------------------------------------------

def _read_file_safe(path: Path) -> str:
    """Read a file, returning empty string if missing or unreadable."""
    try:
        if path.exists():
            return path.read_text(encoding="utf-8")
        return ""
    except Exception as e:
        logger.debug("Could not read %s: %s", path, e)
        return ""


def _write_memory_safe(path: Path, content: str) -> str:
    """Write content to a .claude/ memory file. Blocks writes outside .claude/."""
    try:
        claude_root = (config.ROOT / ".claude").resolve()
        if not str(path.resolve()).startswith(str(claude_root)):
            return f"BLOCKED: {path} is outside .claude/"
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(content, encoding="utf-8")
        return f"Written {len(content)} chars to {path.name}"
    except Exception as e:
        return f"Write failed: {e}"


# ---------------------------------------------------------------------------
# Tool definitions
# ---------------------------------------------------------------------------

COMMANDER_TOOLS: list[dict] = [
    {
        "name": "spawn_seer",
        "description": (
            "Spawn the Seer sub-agent to search memory, knowledge files, or Supabase. "
            "Use when the request references past conversations, people/birthdays, or requires "
            "knowledge base lookup before a reading. Seer returns a structured findings report. "
            "Seer is invisible to the user — synthesize its findings naturally."
        ),
        "input_schema": {
            "type": "object",
            "properties": {
                "user_request": {"type": "string", "description": "Verbatim user message"},
                "interpretation": {"type": "string", "description": "Commander's understanding of intent"},
                "search_domains": {
                    "type": "array",
                    "items": {"type": "string"},
                    "description": "Domains to search: memory, local_files, web"
                },
                "priority_keywords": {
                    "type": "array",
                    "items": {"type": "string"},
                    "description": "Key terms, names, topics to prioritize"
                },
                "web_authorized": {"type": "boolean", "description": "Allow web search. Default: false."},
                "knowledge_files": {
                    "type": "array",
                    "items": {"type": "string"},
                    "description": "Specific knowledge files to read fully, relative to .claude/knowledge/"
                }
            },
            "required": ["user_request", "interpretation", "search_domains", "priority_keywords"]
        }
    },
    {
        "name": "spawn_libra",
        "description": (
            "Spawn the Libra self-improvement agent as a background task. "
            "Call this after every completed response, or immediately on user feedback. "
            "Returns immediately — do NOT wait for Libra before responding to the user."
        ),
        "input_schema": {
            "type": "object",
            "properties": {
                "conversation_summary": {"type": "string", "description": "2-3 sentence summary"},
                "quality_score": {"type": "integer", "description": "Self-assessment 0-100"},
                "friction_points": {
                    "type": "array",
                    "items": {"type": "string"},
                    "description": "Low-confidence events, routing issues, missing memory"
                },
                "user_feedback": {"type": "string", "description": "Verbatim user feedback if any"},
                "feedback_priority": {
                    "type": "string",
                    "enum": ["high", "routine"],
                    "description": "high=explicit user feedback, routine=post-conversation scan"
                },
                "memory_entry": {"type": "string", "description": "The Step 8 memory entry text"}
            },
            "required": ["conversation_summary", "quality_score", "friction_points", "feedback_priority", "memory_entry"]
        }
    },
    {
        "name": "search_knowledge",
        "description": "Search the local knowledge base (I Ching, numerology, tarot, astrology). Call before any reading.",
        "input_schema": {
            "type": "object",
            "properties": {
                "query": {"type": "string", "description": "Search keywords"}
            },
            "required": ["query"]
        }
    },
    {
        "name": "get_person",
        "description": "Look up a person's profile in Supabase by name.",
        "input_schema": {
            "type": "object",
            "properties": {
                "name": {"type": "string"}
            },
            "required": ["name"]
        }
    },
    {
        "name": "save_person",
        "description": "Save a person's profile to Supabase after a reading. Silent — do not announce.",
        "input_schema": {
            "type": "object",
            "properties": {
                "name": {"type": "string"},
                "birth_date": {"type": "string", "description": "YYYY-MM-DD"},
                "birth_time": {"type": "string", "description": "HH:MM (optional)"},
                "notes": {"type": "string", "description": "One-line reading summary"}
            },
            "required": ["name"]
        }
    },
    {
        "name": "draw_hexagram",
        "description": "Cast an I Ching hexagram using the three-coin method.",
        "input_schema": {"type": "object", "properties": {}, "required": []}
    },
    {
        "name": "draw_tarot",
        "description": "Draw n random tarot cards.",
        "input_schema": {
            "type": "object",
            "properties": {
                "n": {"type": "integer", "description": "Number of cards (default 1, max 10)"}
            },
            "required": []
        }
    },
    {
        "name": "generate_pdf",
        "description": "Generate a PDF life analysis report. Bot delivers it automatically.",
        "input_schema": {
            "type": "object",
            "properties": {
                "subject_name": {"type": "string"},
                "birth_date": {"type": "string"},
                "sections": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "heading": {"type": "string"},
                            "content": {"type": "string"}
                        },
                        "required": ["heading", "content"]
                    }
                }
            },
            "required": ["subject_name", "birth_date", "sections"]
        }
    },
    {
        "name": "write_memory",
        "description": "Write or update a memory file under .claude/agent-memory/. Used for Step 8 memory update.",
        "input_schema": {
            "type": "object",
            "properties": {
                "path": {
                    "type": "string",
                    "description": "Relative path from project root, must be under .claude/ (e.g. '.claude/agent-memory/commander/MEMORY.md')"
                },
                "content": {"type": "string", "description": "Full file content to write"}
            },
            "required": ["path", "content"]
        }
    },
    {
        "name": "read_file",
        "description": "Read a file from disk. Use to read memory files or knowledge files.",
        "input_schema": {
            "type": "object",
            "properties": {
                "path": {"type": "string", "description": "Relative path from project root"}
            },
            "required": ["path"]
        }
    },
]

SEER_TOOLS: list[dict] = [
    {
        "name": "search_knowledge",
        "description": "Search the knowledge base files for relevant content.",
        "input_schema": {
            "type": "object",
            "properties": {"query": {"type": "string"}},
            "required": ["query"]
        }
    },
    {
        "name": "get_person",
        "description": "Look up a person profile in Supabase.",
        "input_schema": {
            "type": "object",
            "properties": {"name": {"type": "string"}},
            "required": ["name"]
        }
    },
    {
        "name": "read_file",
        "description": "Read a file from disk (memory files, knowledge files).",
        "input_schema": {
            "type": "object",
            "properties": {"path": {"type": "string"}},
            "required": ["path"]
        }
    },
]

LIBRA_TOOLS: list[dict] = [
    {
        "name": "read_file",
        "description": "Read any file from disk.",
        "input_schema": {
            "type": "object",
            "properties": {"path": {"type": "string"}},
            "required": ["path"]
        }
    },
    {
        "name": "write_memory",
        "description": "Write to a .claude/ memory file. Path must be under .claude/.",
        "input_schema": {
            "type": "object",
            "properties": {
                "path": {"type": "string"},
                "content": {"type": "string"}
            },
            "required": ["path", "content"]
        }
    },
]


# ---------------------------------------------------------------------------
# Tool dispatchers
# ---------------------------------------------------------------------------

async def _dispatch_commander_tool(
    name: str,
    inputs: dict,
    telegram_id: int,
    libra_tasks: list,
) -> str:
    if name == "spawn_seer":
        return await _run_seer(inputs, telegram_id)

    elif name == "spawn_libra":
        task = asyncio.create_task(_run_libra(inputs))
        libra_tasks.append(task)
        return "Libra spawned as background task."

    elif name == "search_knowledge":
        return knowledge.search_knowledge(inputs["query"])

    elif name == "get_person":
        person = memory.get_person(telegram_id, inputs["name"])
        if person:
            return json.dumps(person, ensure_ascii=False, default=str)
        return f"Không tìm thấy hồ sơ cho '{inputs['name']}'."

    elif name == "save_person":
        memory.save_person(
            owner_telegram_id=telegram_id,
            name=inputs["name"],
            birth_date=inputs.get("birth_date"),
            birth_time=inputs.get("birth_time"),
            notes=inputs.get("notes"),
        )
        return "Đã lưu hồ sơ vào bộ nhớ."

    elif name == "draw_hexagram":
        result = divination.draw_hexagram()
        return divination.format_hexagram(result)

    elif name == "draw_tarot":
        n = min(int(inputs.get("n", 1)), 10)
        cards = divination.draw_tarot(n)
        return divination.format_tarot(cards)

    elif name == "generate_pdf":
        pdf_bytes = pdf_gen.generate_pdf(
            subject_name=inputs["subject_name"],
            birth_date=inputs["birth_date"],
            sections=inputs["sections"],
        )
        _current_pdf[telegram_id] = pdf_bytes
        return f"PDF đã tạo cho {inputs['subject_name']}. Đang gửi..."

    elif name == "write_memory":
        path = config.ROOT / inputs["path"]
        return _write_memory_safe(path, inputs["content"])

    elif name == "read_file":
        path = config.ROOT / inputs["path"]
        content = _read_file_safe(path)
        return content if content else f"File not found: {inputs['path']}"

    else:
        return f"Unknown tool: {name}"


def _dispatch_seer_tool(name: str, inputs: dict, telegram_id: int) -> str:
    if name == "search_knowledge":
        return knowledge.search_knowledge(inputs["query"])

    elif name == "get_person":
        person = memory.get_person(telegram_id, inputs["name"])
        if person:
            return json.dumps(person, ensure_ascii=False, default=str)
        return f"No record found for '{inputs['name']}'."

    elif name == "read_file":
        path = config.ROOT / inputs["path"]
        return _read_file_safe(path)

    else:
        return f"Unknown Seer tool: {name}"


def _dispatch_libra_tool(name: str, inputs: dict) -> str:
    if name == "read_file":
        path = config.ROOT / inputs["path"]
        return _read_file_safe(path)

    elif name == "write_memory":
        path = config.ROOT / inputs["path"]
        return _write_memory_safe(path, inputs["content"])

    else:
        return f"Unknown Libra tool: {name}"


# ---------------------------------------------------------------------------
# Seer agent (blocking — Commander waits for findings)
# ---------------------------------------------------------------------------

async def _run_seer(query: dict, telegram_id: int) -> str:
    """Invoke Seer as a nested API call. Returns findings string to Commander."""
    seer_prompt = _read_file_safe(config.ROOT / ".claude" / "agents" / "seer.md")
    if not seer_prompt:
        return "SEER_ERROR: seer.md not found."

    brief = (
        f"USER_REQUEST: {query.get('user_request', '')}\n"
        f"INTERPRETATION: {query.get('interpretation', '')}\n"
        f"SEARCH_DOMAINS: {', '.join(query.get('search_domains', []))}\n"
        f"PRIORITY_KEYWORDS: {', '.join(query.get('priority_keywords', []))}\n"
        f"WEB_AUTHORIZED: {str(query.get('web_authorized', False)).lower()}\n"
    )
    if query.get("knowledge_files"):
        brief += f"KNOWLEDGE_FILES: {', '.join(query['knowledge_files'])}\n"

    messages: list[dict] = [{"role": "user", "content": brief}]

    while True:
        response = _anthropic.messages.create(
            model=SEER_MODEL,
            system=seer_prompt,
            messages=messages,
            tools=SEER_TOOLS,
            max_tokens=config.MAX_TOKENS,
        )

        if response.stop_reason == "end_turn":
            parts = [b.text for b in response.content if hasattr(b, "text")]
            return "\n".join(parts).strip() or "Seer returned no findings."

        if response.stop_reason == "tool_use":
            results = []
            for block in response.content:
                if block.type == "tool_use":
                    result = _dispatch_seer_tool(block.name, block.input, telegram_id)
                    results.append({
                        "type": "tool_result",
                        "tool_use_id": block.id,
                        "content": result,
                    })
            messages.append({"role": "assistant", "content": response.content})
            messages.append({"role": "user", "content": results})
            continue

        return "SEER_ERROR: Unexpected stop reason."


# ---------------------------------------------------------------------------
# Libra agent (fire-and-forget background task)
# ---------------------------------------------------------------------------

async def _run_libra(brief: dict) -> None:
    """Run Libra as a background asyncio task. Never blocks Commander."""
    try:
        libra_prompt = _read_file_safe(config.ROOT / ".claude" / "agents" / "libra.md")
        if not libra_prompt:
            logger.debug("Libra: libra.md not found, skipping.")
            return

        brief_text = (
            f"CONVERSATION_SUMMARY: {brief.get('conversation_summary', '')}\n"
            f"QUALITY_SCORE: {brief.get('quality_score', 75)}\n"
            f"FRICTION_POINTS: {json.dumps(brief.get('friction_points', []))}\n"
            f"USER_FEEDBACK: {brief.get('user_feedback', 'none')}\n"
            f"FEEDBACK_PRIORITY: {brief.get('feedback_priority', 'routine')}\n"
            f"MEMORY_ENTRY:\n{brief.get('memory_entry', '')}\n"
        )

        messages: list[dict] = [{"role": "user", "content": brief_text}]

        while True:
            response = _anthropic.messages.create(
                model=LIBRA_MODEL,
                system=libra_prompt,
                messages=messages,
                tools=LIBRA_TOOLS,
                max_tokens=2048,
            )

            if response.stop_reason == "end_turn":
                parts = [b.text for b in response.content if hasattr(b, "text")]
                logger.info("Libra scan complete: %s", "\n".join(parts)[:200])
                return

            if response.stop_reason == "tool_use":
                results = []
                for block in response.content:
                    if block.type == "tool_use":
                        result = _dispatch_libra_tool(block.name, block.input)
                        results.append({
                            "type": "tool_result",
                            "tool_use_id": block.id,
                            "content": result,
                        })
                messages.append({"role": "assistant", "content": response.content})
                messages.append({"role": "user", "content": results})
                continue

            return

    except Exception as e:
        logger.debug("Libra background error: %s", e)


# ---------------------------------------------------------------------------
# Commander system prompt builder
# ---------------------------------------------------------------------------

def _build_commander_system(user_first_name: str | None = None) -> str:
    """Read commander.md from disk and prepend date/user preamble."""
    commander_md = _read_file_safe(config.COMMANDER_MD)

    today = date.today().strftime("%d/%m/%Y")
    preamble = f"Hôm nay là {today}."
    if user_first_name:
        preamble += f" Người dùng tên là {user_first_name}."
    preamble += "\n\n"

    if commander_md:
        return preamble + commander_md

    logger.warning("commander.md not found — using minimal fallback prompt")
    return preamble + "Bạn là Co, chuyên gia về Kinh Dịch, Nhân Số Học và Tarot. Trả lời bằng tiếng Việt."


def _inject_commander_memory(system_prompt: str) -> str:
    """Proactively inject MEMORY.md into Commander's system prompt."""
    memory_content = _read_file_safe(config.COMMANDER_MEMORY)
    if not memory_content:
        memory_content = "# Commander Memory\n[Fresh session — no prior context]\n"

    block = (
        "\n\n---\n"
        "## INJECTED SESSION MEMORY\n"
        "The following is your current MEMORY.md. Use it to restore session continuity.\n\n"
        f"{memory_content}\n"
        "---\n"
    )
    return system_prompt + block


# ---------------------------------------------------------------------------
# Public API
# ---------------------------------------------------------------------------

async def run(
    telegram_id: int,
    user_message: str,
    user_first_name: str | None = None,
) -> str:
    """
    Run the Commander-led agent loop for one user message.
    Returns the final text response.
    Any generated PDF is stored via _current_pdf[telegram_id] for handlers to send.
    """
    system = _build_commander_system(user_first_name)
    system = _inject_commander_memory(system)

    history = memory.get_history(telegram_id)
    messages = history + [{"role": "user", "content": user_message}]

    libra_tasks: list[asyncio.Task] = []

    while True:
        response = _anthropic.messages.create(
            model=COMMANDER_MODEL,
            system=system,
            messages=messages,
            tools=COMMANDER_TOOLS,
            max_tokens=config.MAX_TOKENS,
        )

        if response.stop_reason == "end_turn":
            parts = [b.text for b in response.content if hasattr(b, "text")]
            return "\n".join(parts).strip()

        if response.stop_reason == "tool_use":
            tool_results = []
            for block in response.content:
                if block.type == "tool_use":
                    result = await _dispatch_commander_tool(
                        block.name, block.input, telegram_id, libra_tasks
                    )
                    tool_results.append({
                        "type": "tool_result",
                        "tool_use_id": block.id,
                        "content": result,
                    })
            messages.append({"role": "assistant", "content": response.content})
            messages.append({"role": "user", "content": tool_results})
            continue

        # Unexpected stop reason
        parts = [b.text for b in response.content if hasattr(b, "text")]
        return "\n".join(parts).strip() or "Tôi gặp sự cố không mong muốn. Bạn vui lòng thử lại nhé."


def pop_pdf(telegram_id: int) -> bytes | None:
    """Retrieve and clear any pending PDF for this user."""
    return _current_pdf.pop(telegram_id, None)

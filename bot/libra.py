"""
Libra — Co's autonomous self-improvement engine.
Runs asynchronously after each conversation.
Analyzes quality, may update the system prompt in commander.md.
"""
from __future__ import annotations
import asyncio
import logging
from datetime import datetime
from pathlib import Path

import anthropic

from bot import config
from bot.tools import memory

logger = logging.getLogger(__name__)

_anthropic = anthropic.Anthropic(api_key=config.ANTHROPIC_API_KEY)

_LIBRA_PROMPT = """Bạn là Libra — một hệ thống cải thiện tự động cho Co (chuyên gia Kinh Dịch, Nhân Số, Tarot).

Hãy phân tích đoạn hội thoại dưới đây và đưa ra đánh giá:

1. **Điểm chất lượng** (0–100): Co có trả lời đúng chủ đề, chính xác và từ bi không?
2. **Điểm ma sát** (nếu có): Chỗ nào Co trả lời không chắc, sai hướng, hoặc người dùng tỏ ra không hài lòng?
3. **Đề xuất cải thiện system prompt** (chỉ khi điểm < 85 hoặc có ma sát rõ ràng):
   - Phải dựa trên bằng chứng từ hội thoại (không phỏng đoán)
   - Chỉ đề xuất thay đổi nhỏ, có mục tiêu cụ thể
   - Không đề xuất thay đổi nếu hội thoại tốt

Trả lời theo định dạng JSON:
{
  "quality_score": <số 0-100>,
  "friction_points": ["<mô tả ngắn>", ...],
  "improvement_suggestion": "<nội dung cải thiện hoặc null nếu không cần>",
  "confidence": <số 0-100>
}"""


async def scan(telegram_id: int) -> None:
    """
    Analyze the most recent conversation and optionally improve the system prompt.
    Called fire-and-forget after each message exchange.
    """
    # Get last 10 messages
    recent = memory.get_recent_conversation(telegram_id, limit=10)
    if len(recent) < 2:
        return  # Not enough to analyze

    # Build conversation text for Libra
    convo_text = "\n".join(
        f"[{msg['role'].upper()}]: {msg['content']}"
        for msg in recent
    )

    try:
        response = _anthropic.messages.create(
            model=config.CLAUDE_MODEL,
            system=_LIBRA_PROMPT,
            messages=[{"role": "user", "content": convo_text}],
            max_tokens=1024,
        )
        raw = response.content[0].text.strip()

        # Parse JSON (handle markdown code block if present)
        import json
        import re
        json_match = re.search(r"\{.*\}", raw, re.DOTALL)
        if not json_match:
            return
        data = json.loads(json_match.group())

        quality = data.get("quality_score", 100)
        friction = data.get("friction_points", [])
        suggestion = data.get("improvement_suggestion")
        confidence = data.get("confidence", 0)

        # Log to Libra memory
        _log_to_memory(quality, friction, suggestion, confidence)

        # Apply improvement only if quality < 80 AND confidence ≥ 80 AND suggestion exists
        if quality < 80 and confidence >= 80 and suggestion:
            await _apply_improvement(suggestion)

    except Exception as e:
        logger.debug("Libra scan error: %s", e)


def _log_to_memory(quality: int, friction: list, suggestion: str | None, confidence: int) -> None:
    """Append a log entry to libra/MEMORY.md."""
    memory_file = config.LIBRA_MEMORY
    memory_file.parent.mkdir(parents=True, exist_ok=True)

    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M")
    friction_text = "; ".join(friction) if friction else "none"
    suggest_text = suggestion[:120] + "..." if suggestion and len(suggestion) > 120 else (suggestion or "none")

    entry = (
        f"\n## Scan — {timestamp}\n"
        f"Quality: {quality}/100 | Confidence: {confidence}/100\n"
        f"Friction: {friction_text}\n"
        f"Suggestion: {suggest_text}\n"
    )

    # Append to file
    try:
        current = memory_file.read_text(encoding="utf-8") if memory_file.exists() else "# Libra Memory\n"
        # Compress if approaching 180 lines
        lines = current.splitlines()
        if len(lines) >= 175:
            current = _compress(lines)
        memory_file.write_text(current + entry, encoding="utf-8")
    except Exception as e:
        logger.debug("Libra memory write failed: %s", e)


def _compress(lines: list[str]) -> str:
    """Keep header + last 80 lines when approaching cap."""
    header_end = 5
    return "\n".join(lines[:header_end]) + "\n\n[... compressed ...]\n\n" + "\n".join(lines[-80:]) + "\n"


async def _apply_improvement(suggestion: str) -> None:
    """
    Append a refinement note to commander.md.
    Does NOT overwrite existing content — only appends a <!-- Libra suggestion --> comment.
    """
    try:
        commander_file = config.COMMANDER_MD
        if not commander_file.exists():
            return
        current = commander_file.read_text(encoding="utf-8")
        timestamp = datetime.now().strftime("%Y-%m-%d")
        note = f"\n\n<!-- Libra [{timestamp}]: {suggestion[:300]} -->"
        commander_file.write_text(current + note, encoding="utf-8")
        logger.info("Libra applied improvement suggestion to commander.md")
    except Exception as e:
        logger.debug("Libra apply improvement failed: %s", e)

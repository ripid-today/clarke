"""
Single-call orchestrator for Co divination system.

Eliminates nested agent spawning latency by using:
1. Deterministic intent classification (router)
2. Direct action handler calls
3. Single LLM call for synthesis (when needed)
4. Background Libra tasks only (fire-and-forget)
"""

from __future__ import annotations
import asyncio
import logging
from calendar import monthrange
from datetime import date
from typing import Any, Dict, Optional

import anthropic

from bot import config
from bot.tools import knowledge, memory, pdf_gen
from bot.progress import get_inquiry_response

# Import action handlers
from actions.router import (
    classify_intent,
    ActionType,
    get_clarification_question,
    extract_date,
    extract_name,
    extract_period,
)
from actions.action_qa import handle_qa, format_update_response
from actions.action_life_writings import handle_life_writings, format_analysis_response
from actions.action_shortcomings import handle_shortcomings, format_shortcomings_response
from actions.action_knowledge_update import handle_knowledge_update

from bot.tools.validators import parse_birth_date, parse_time_period

logger = logging.getLogger(__name__)

# Anthropic client
_anthropic = anthropic.Anthropic(api_key=config.ANTHROPIC_API_KEY)

# PDF storage
_current_pdf: dict[int, bytes] = {}

# Active analysis tracking for inquiry handling
_active_analyses: dict[int, Dict] = {}


# =============================================================================
# Intent Classification → Action Routing
# =============================================================================

async def route_and_execute(
    telegram_id: int,
    user_message: str,
    user_first_name: str | None = None,
) -> str:
    """
    Main entry point: classify intent and execute appropriate action.

    This is the core single-call flow:
    1. Classify intent using deterministic router
    2. If confidence < 95%, ask clarifying question
    3. Execute action handler directly
    4. Return result
    """
    # Check if this is an inquiry during active analysis
    if telegram_id in _active_analyses:
        if _is_how_long_inquiry(user_message):
            return _handle_how_long_inquiry(telegram_id)

    # Classify intent
    classification = classify_intent(user_message)

    # Handle low confidence - ask clarifying question
    if classification.requires_clarification:
        question = classification.clarification_question or get_clarification_question(classification)
        return question

    # Route to appropriate action
    action = classification.action
    params = classification.extracted_params

    # Parse extracted parameters
    name = params.get("name") or extract_name(user_message)

    date_info = params.get("birth_date") or extract_date(user_message)
    birth_date = None
    if date_info:
        try:
            year = date_info.get("year") or date.today().year - 25  # Default assumption
            birth_date = date(year, date_info["month"], date_info["day"])
        except (ValueError, TypeError):
            birth_date = None

    # Execute based on action type
    if action == ActionType.QA:
        return await handle_qa(user_message, {})

    elif action == ActionType.KNOWLEDGE_UPDATE:
        result = await handle_knowledge_update(user_message)
        # Trigger Libra in background for knowledge evaluation
        _spawn_libra_background(
            telegram_id=telegram_id,
            task="knowledge_update",
            domain=result.get("package", {}).get("domain", "general"),
            content=result.get("package", {}).get("content", user_message),
        )
        return result.get("message", "Cơ đã ghi nhận.")

    elif action == ActionType.LIFE_WRITINGS:
        if not birth_date:
            return "Cơ cần biết ngày sinh của bạn (DD/MM/YYYY) để phân tích. Bạn cho Cơ biết nhé!"

        # Track active analysis for inquiry handling
        _active_analyses[telegram_id] = {
            "action": "life_writings",
            "start_time": asyncio.get_event_loop().time(),
        }

        try:
            # Execute with progress tracking
            results = await handle_life_writings(
                name=name or "bạn",
                birth_date=birth_date,
                send_progress=lambda m: None,  # Handled via chat action
                edit_progress=None,
            )

            # Store PDF if generated
            if results.get("pdf_bytes"):
                _current_pdf[telegram_id] = results["pdf_bytes"]

            # Generate synthesis via single LLM call
            response = await _synthesize_response(
                action=action,
                results=results,
                user_first_name=user_first_name,
            )

            return response

        finally:
            # Clear active analysis
            _active_analyses.pop(telegram_id, None)

    elif action == ActionType.SHORTCOMINGS:
        if not birth_date:
            return "Cơ cần biết ngày sinh (DD/MM/YYYY) để xem vận hạn. Bạn cho Cơ biết nhé!"

        # Parse period
        period_info = params.get("period") or extract_period(user_message)
        period = None
        if period_info:
            period = _period_info_to_dates(period_info)

        if not period:
            # Default to current month
            today = date.today()
            from calendar import monthrange
            last_day = monthrange(today.year, today.month)[1]
            period = (date(today.year, today.month, 1), date(today.year, today.month, last_day))

        # Track active analysis
        _active_analyses[telegram_id] = {
            "action": "shortcomings",
            "start_time": asyncio.get_event_loop().time(),
        }

        try:
            results = await handle_shortcomings(
                name=name or "bạn",
                birth_date=birth_date,
                period_start=period[0],
                period_end=period[1],
                specific_question=user_message if "?" in user_message else None,
                send_progress=lambda m: None,
                edit_progress=None,
            )

            response = await _synthesize_response(
                action=action,
                results=results,
                user_first_name=user_first_name,
            )

            return response

        finally:
            _active_analyses.pop(telegram_id, None)

    # Fallback to QA
    return await handle_qa(user_message, {})


def _is_how_long_inquiry(text: str) -> bool:
    """Check if user is asking about wait time."""
    text_lower = text.lower().strip()
    inquiry_patterns = [
        r'\blâu\s+(chưa|không|vậy|thế)',
        r'\bxong\s+(chưa|không)',
        r'\bmấy\s+(phút|giây|lâu)',
        r'\bbao\s+lâu',
        r'\bchờ\s+lâu',
        r'\bsao\s+lâu',
    ]
    return any(__import__('re').search(p, text_lower) for p in inquiry_patterns)


def _handle_how_long_inquiry(telegram_id: int) -> str:
    """Generate inquiry response based on active analysis."""
    analysis = _active_analyses.get(telegram_id)
    if not analysis:
        return "Cơ đang xử lý, bạn chờ Cơ thêm chút nhé!"

    # Estimate remaining time based on stage
    elapsed = asyncio.get_event_loop().time() - analysis.get("start_time", 0)
    estimated_total = 8  # 8 seconds for life writings
    remaining = max(0, estimated_total - elapsed)

    if remaining < 2:
        time_str = "vài giây"
    elif remaining < 5:
        time_str = f"khoảng {int(remaining)} giây"
    else:
        time_str = f"khoảng {int(remaining)} giây"

    return get_inquiry_response(time_str)


def _period_info_to_dates(period_info: Dict) -> Optional[tuple]:
    """Convert period info dict to date tuple."""
    try:
        if period_info.get("type") == "month":
            year = period_info.get("year") or date.today().year
            month = period_info["month"]
            last_day = monthrange(year, month)[1]
            return (date(year, month, 1), date(year, month, last_day))

        elif period_info.get("type") == "quarter":
            year = period_info.get("year") or date.today().year
            quarter = period_info["quarter"]
            start_month = (quarter - 1) * 3 + 1
            end_month = start_month + 2
            last_day = monthrange(year, end_month)[1]
            return (date(year, start_month, 1), date(year, end_month, last_day))

        elif period_info.get("type") == "year":
            year = period_info["year"]
            return (date(year, 1, 1), date(year, 12, 31))

    except (ValueError, KeyError):
        pass

    return None


# =============================================================================
# Response Synthesis (Single LLM Call)
# =============================================================================

async def _synthesize_response(
    action: ActionType,
    results: Dict,
    user_first_name: str | None = None,
) -> str:
    """
    Synthesize action results into Cơ's natural Vietnamese response.

    This is the ONLY LLM call in the action flow (except QA which may not need it).
    Uses structured output format for reliability.
    """
    # Handle errors first
    if "error" in results:
        return f"Cơ xin lỗi: {results['error']}"

    # Build synthesis prompt
    if action == ActionType.LIFE_WRITINGS:
        system_prompt = _build_life_writings_synthesis_prompt()
        context = format_analysis_response(results)
    elif action == ActionType.SHORTCOMINGS:
        system_prompt = _build_shortcomings_synthesis_prompt()
        context = format_shortcomings_response(results)
    else:
        return results.get("message", "Cơ đã hoàn thành phân tích.")

    user_prompt = f"""Thông tin phân tích:

{context}

Hãy viết luận giải tự nhiên, ấm áp, dùng từ "Cơ" và "bạn"."""

    try:
        response = _anthropic.messages.create(
            model=config.CLAUDE_MODEL,
            system=system_prompt,
            messages=[{"role": "user", "content": user_prompt}],
            max_tokens=config.MAX_TOKENS,
            temperature=0.7,
        )

        parts = [b.text for b in response.content if hasattr(b, "text")]
        return "\n".join(parts).strip()

    except Exception as e:
        logger.exception("Synthesis failed, returning structured response")
        # Fallback to structured response
        return context


def _build_life_writings_synthesis_prompt() -> str:
    """Build system prompt for life writings synthesis."""
    return """Bạn là Cơ - chuyên gia thần số học, Tarot và Kinh Dịch.

NHIỆM VỤ: Viết luận giải phân tích số mệnh tự nhiên, ấm áp.

QUY TẮC:
1. Dùng từ "Cơ" khi nói về mình, "bạn" khi nói về người dùng
2. Viết như đang trò chuyện, không như báo cáo
3. Nhấn mạnh điểm mạnh, nhẹ nhàng gợi ý điểm cần chú ý
4. Kết thúc bằng lời chúc hoặc khích lệ
5. Không dùng emoji
6. Không liệt kê máy móc các con số

CẤU TRÚC:
- Mở đầu: Giới thiệu chỉ số chính
- Thân: Phân tích các mũi tên và 13 ngôi nhà
- Kết: Lời khuyên và chúc phúc"""


def _build_shortcomings_synthesis_prompt() -> str:
    """Build system prompt for shortcomings synthesis."""
    return """Bạn là Cơ - chuyên gia thần số học, Tarot và Kinh Dịch.

NHIỆM VỤ: Viết luận giải về vận hạn và khó khăn một cách nhẹ nhàng, xây dựng.

QUY TẮC:
1. Dùng từ "Cơ" khi nói về mình, "bạn" khi nói về người dùng
2. Không gieo rắc sợ hãi - mọi thách thức đều là cơ hội phát triển
3. Đưa ra giải pháp cụ thể, không chỉ chỉ ra vấn đề
4. Nhấn mạnh tính tạm thời của khó khăn
5. Không dùng emoji

CẤU TRÚC:
- Mở đầu: Tổng quan chu kỳ hiện tại
- Thân: Các thờ điểm cần lưu ý và giải pháp
- Kết: Động viên và hướng tới tương lai tích cực"""


# =============================================================================
# Libra Background Tasks (Fire-and-Forget Only)
# =============================================================================

def _spawn_libra_background(
    telegram_id: int,
    task: str,
    domain: str = "",
    content: str = "",
    conversation_summary: str = "",
    quality_score: int = 75,
) -> None:
    """Spawn Libra as true background task - never blocks."""
    try:
        brief = {
            "task": task,
            "telegram_id": telegram_id,
        }

        if task == "knowledge_update":
            brief["domain"] = domain
            brief["content"] = content[:1000]  # Truncate for brevity
            brief["source"] = "user message"
        else:
            brief["conversation_summary"] = conversation_summary
            brief["quality_score"] = quality_score
            brief["feedback_priority"] = "routine"

        # Create task without awaiting
        asyncio.create_task(_run_libra(brief))

    except Exception as e:
        logger.debug("Libra spawn failed: %s", e)


async def _run_libra(brief: Dict) -> None:
    """Run Libra - truly background, never blocks user response."""
    try:
        # Read libra.md for system prompt
        libra_md = config.ROOT / ".claude" / "agents" / "libra.md"
        system_prompt = ""
        if libra_md.exists():
            system_prompt = libra_md.read_text(encoding="utf-8")

        brief_text = f"TASK: {brief.get('task')}\n"
        for key, value in brief.items():
            if key != "task":
                brief_text += f"{key.upper()}: {value}\n"

        # Libra operates autonomously - no response needed
        _anthropic.messages.create(
            model=config.CLAUDE_MODEL,
            system=system_prompt or "You are Libra, the self-improvement agent.",
            messages=[{"role": "user", "content": brief_text}],
            max_tokens=2048,
        )

    except Exception as e:
        logger.debug("Libra run error (non-critical): %s", e)


# =============================================================================
# Legacy Compatibility
# =============================================================================

async def run(
    telegram_id: int,
    user_message: str,
    user_first_name: str | None = None,
) -> str:
    """
    Legacy-compatible entry point.

    Maintains same signature as old orchestrator for handler compatibility.
    Internally uses new single-call flow.
    """
    return await route_and_execute(
        telegram_id=telegram_id,
        user_message=user_message,
        user_first_name=user_first_name,
    )


def pop_pdf(telegram_id: int) -> bytes | None:
    """Retrieve and clear any pending PDF for this user."""
    return _current_pdf.pop(telegram_id, None)

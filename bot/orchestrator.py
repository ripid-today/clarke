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
from bot.tools.memory import get_user_state, set_user_state, clear_user_state
from bot.progress import get_inquiry_response

# Import action handlers
from actions.router import (
    classify_intent,
    ActionType,
    get_clarification_question,
    extract_date,
    extract_name,
    extract_period,
    is_escape_message,
)
from actions.action_qa import handle_qa
from actions.action_life_writings import handle_life_writings, format_analysis_response
from actions.action_shortcomings import handle_shortcomings, format_shortcomings_response
from actions.action_knowledge_update import handle_knowledge_update, format_update_response

from bot.tools.validators import parse_birth_date, parse_time_period

logger = logging.getLogger(__name__)

# Anthropic client
_anthropic = anthropic.Anthropic(api_key=config.ANTHROPIC_API_KEY)

# PDF storage
_current_pdf: dict[int, bytes] = {}

# Active analysis tracking for inquiry handling
_active_analyses: dict[int, Dict] = {}


# =============================================================================
# Async Helpers
# =============================================================================

async def _noop_progress(message: str) -> None:
    """No-op progress callback for when progress messages are not needed."""
    return None


# =============================================================================
# Context-Aware Request Detection
# =============================================================================

def is_complete_new_request(classification) -> bool:
    """
    Determine if this is a complete new request that should ignore pending state.

    A message is a new request if:
    1. Standalone confidence >= 80, AND
    2. Has all required params for the detected action

    Args:
        classification: IntentClassification result

    Returns:
        True if this is a complete new request
    """
    if classification.confidence < 80:
        return False

    action = classification.action
    params = classification.extracted_params

    # Check if all required params are present for the detected action
    if action == ActionType.LIFE_WRITINGS:
        return (
            params.get("birth_date") is not None
            and params.get("name") is not None
        )
    elif action == ActionType.SHORTCOMINGS:
        return params.get("birth_date") is not None
    elif action == ActionType.QA:
        return True  # Q&A only needs confidence
    elif action == ActionType.KNOWLEDGE_UPDATE:
        return True  # Knowledge update only needs confidence

    return False


def is_relevant_followup(
    user_message: str,
    missing_param: str | None,
    classification,
) -> bool:
    """
    Check if new message provides the missing parameter.

    Pattern-based matching:
    - missing_param='name': look for name patterns
    - missing_param='birth_date': look for date patterns
    - missing_param='period': look for period patterns

    Args:
        user_message: The new message from user
        missing_param: Which param was previously requested
        classification: Current classification result

    Returns:
        True if message provides the missing param
    """
    if not missing_param:
        # If we don't know what's missing, check if message provides ANY useful param
        return (
            classification.extracted_params.get("name") is not None
            or classification.extracted_params.get("birth_date") is not None
            or classification.extracted_params.get("period") is not None
        )

    if missing_param == "name":
        # Check if message contains a name
        name = extract_name(user_message)
        return name is not None

    elif missing_param == "birth_date":
        # Check if message contains a valid date with year
        date_info = extract_date(user_message)
        return date_info is not None and date_info.get("year") is not None

    elif missing_param == "period":
        # Check if message contains a time period
        period = extract_period(user_message)
        return period is not None

    return False


def _get_missing_param(classification) -> str | None:
    """
    Determine which parameter is missing based on action type.

    Returns:
        'name', 'birth_date', 'period', or None
    """
    action = classification.action
    params = classification.extracted_params

    if action == ActionType.LIFE_WRITINGS:
        if not params.get("birth_date"):
            return "birth_date"
        if not params.get("name"):
            return "name"
    elif action == ActionType.SHORTCOMINGS:
        if not params.get("birth_date"):
            return "birth_date"
        if not params.get("period"):
            return "period"

    return None


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
    1. Check for escape signal (user wants to cancel)
    2. Get pending state from Supabase
    3. Classify intent
    4. Check if complete new request → clear state, process as new
    5. Check if relevant follow-up → merge params, proceed
    6. Store state with missing_param when clarification needed
    7. Check 3-attempt limit before asking for restatement
    """
    # Check if this is an inquiry during active analysis
    if telegram_id in _active_analyses:
        if _is_how_long_inquiry(user_message):
            return _handle_how_long_inquiry(telegram_id)

    # Step 1: Check for escape signal (user wants to cancel current flow)
    if is_escape_message(user_message):
        logger.info("[ESCAPE] telegram_id=%s, clearing state", telegram_id)
        clear_user_state(telegram_id)
        return "Đã xong. Cơ sẵn sàng giúp bạn việc khác. Bạn cần gì?"

    # Step 2: Get pending conversation state (follow-up to previous request)
    user_state = get_user_state(telegram_id)
    pending_action = None
    collected_params = {}
    clarification_count = 0
    missing_param = None

    if user_state:
        pending_action = user_state.get("pending_action")
        collected_params = user_state.get("collected_params") or {}
        clarification_count = user_state.get("clarification_count") or 0
        missing_param = user_state.get("missing_param")
        logger.info(
            "[STATE] telegram_id=%s, pending_action=%s, missing_param=%s, "
            "collected_params=%s, clarification_count=%s",
            telegram_id, pending_action, missing_param, collected_params, clarification_count
        )

    # Step 3: Classify intent
    classification = classify_intent(user_message)

    # Debug logging for classification tracing
    logger.info(
        "[CLASSIFY] telegram_id=%s, action=%s, confidence=%s, requires_clarification=%s, "
        "extracted_params=%s, user_message_preview=%s",
        telegram_id,
        classification.action.value,
        classification.confidence,
        classification.requires_clarification,
        classification.extracted_params,
        user_message[:50] + "..." if len(user_message) > 50 else user_message,
    )

    # Step 4: Check if this is a complete new request
    # If user provides a complete request, ignore pending state and process as new
    if is_complete_new_request(classification):
        logger.info(
            "[NEW_REQUEST] telegram_id=%s, clearing pending state, processing as new",
            telegram_id
        )
        if user_state:
            clear_user_state(telegram_id)
        pending_action = None
        collected_params = {}
        missing_param = None
        clarification_count = 0
    # Step 5: Check if this is a relevant follow-up to pending state
    elif pending_action and is_relevant_followup(user_message, missing_param, classification):
        logger.info(
            "[RELEVANT_FOLLOWUP] telegram_id=%s, merging params with pending_action=%s",
            telegram_id, pending_action
        )
        # Merge newly extracted params with collected params from state
        merged_params = {**collected_params, **classification.extracted_params}
        classification.extracted_params = merged_params
        classification.action = ActionType(pending_action)
        # Re-check if we now have all required params
        new_missing = _get_missing_param(classification)
        if new_missing is None:
            # All params collected, proceed with action
            classification.requires_clarification = False
            classification.confidence = 85
            logger.info(
                "[PARAMS_COMPLETE] telegram_id=%s, all params collected for %s",
                telegram_id, pending_action
            )
        else:
            # Still missing params, update missing_param
            missing_param = new_missing
            classification.requires_clarification = True

    # Step 6: Handle clarification needed
    if classification.requires_clarification:
        # Check 3-attempt limit
        if clarification_count >= 3:
            logger.info(
                "[MAX_CLARIFICATION] telegram_id=%s, count=%s, asking for restatement",
                telegram_id, clarification_count
            )
            clear_user_state(telegram_id)
            return (
                "Cơ xin lỗi, có thể Cơ chưa hiểu đúng ý bạn. "
                "Bạn có thể nói lại rõ hơn được không? "
                "Ví dụ: 'Phân tích cho Nguyễn Văn An sinh 15/03/1990'"
            )

        # Determine what's missing
        current_missing = _get_missing_param(classification)
        question = get_clarification_question(classification)

        logger.info(
            "[CLARIFICATION] telegram_id=%s, question=%s, missing_param=%s, count=%s",
            telegram_id,
            question,
            current_missing,
            clarification_count + 1,
        )

        # Store state for potential follow-up
        set_user_state(
            telegram_id=telegram_id,
            pending_action=classification.action.value,
            missing_param=current_missing,
            collected_params=classification.extracted_params,
            clarification_question=question,
            clarification_count=clarification_count + 1,
        )
        return question

    # Step 7: Clear state since we have sufficient confidence
    if user_state:
        clear_user_state(telegram_id)

    # Route to appropriate action
    action = classification.action
    params = classification.extracted_params

    # Parse extracted parameters
    name = params.get("name") or extract_name(user_message)

    date_info = params.get("birth_date") or extract_date(user_message)

    # Debug logging for parameter extraction
    logger.info(
        "[EXTRACT] telegram_id=%s, name=%s, date_info=%s",
        telegram_id,
        name,
        date_info,
    )

    birth_date = None
    if date_info:
        try:
            year = date_info.get("year")
            if year is None:
                logger.warning("[DATE] Year is required but not provided")
                return "Cơ cần biết năm sinh đầy đủ (DD/MM/YYYY). Bạn cho Cơ biết ngày sinh đầy đủ nhé!"
            birth_date = date(year, date_info["month"], date_info["day"])
        except (ValueError, TypeError) as e:
            logger.error("[DATE] Invalid date: %s", e)
            birth_date = None

    # Execute based on action type
    if action == ActionType.QA:
        # Handle off-topic messages with redirect instead of generic QA
        if classification.is_off_topic:
            return _handle_off_topic(user_message)
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
            # Store state for follow-up - missing birth_date
            set_user_state(
                telegram_id=telegram_id,
                pending_action=action.value,
                missing_param="birth_date",
                collected_params={"name": name} if name else {},
                clarification_question="Cơ cần biết ngày sinh của bạn (DD/MM/YYYY) để phân tích. Bạn cho Cơ biết nhé!",
            )
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
                send_progress=_noop_progress,  # Handled via chat action
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
        # Parse period first (needed for state storage)
        period_info = params.get("period") or extract_period(user_message)

        if not birth_date:
            # Store state for follow-up - missing birth_date
            collected = {}
            if name:
                collected["name"] = name
            if period_info:
                collected["period"] = period_info
            set_user_state(
                telegram_id=telegram_id,
                pending_action=action.value,
                missing_param="birth_date",
                collected_params=collected,
                clarification_question="Cơ cần biết ngày sinh (DD/MM/YYYY) để xem vận hạn. Bạn cho Cơ biết nhé!",
            )
            return "Cơ cần biết ngày sinh (DD/MM/YYYY) để xem vận hạn. Bạn cho Cơ biết nhé!"
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
                send_progress=_noop_progress,
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


def _handle_off_topic(user_message: str) -> str:
    """
    Handle messages outside divination scope.

    Politely redirect user to divination topics without asking for clarification.
    """
    # Detect common off-topic categories for personalized response
    text_lower = user_message.lower()

    # Weather-related
    if any(word in text_lower for word in ["thờ tiết", "mưa", "nắng", "nóng", "lạnh", "dự báo thờ tiết"]):
        return "Cơ chuyên về thần số học, Tarot và Kinh Dịch để giúp ngườ ta hiểu bản thân và vận mệnh. Cơ không dự báo thờ tiết được. Bạn có muốn Cơ phân tích số mệnh không?"

    # News/current events
    if any(word in text_lower for word in ["tin tức", "báo", "chính trị", "thế sự", "chiến tranh", "bầu cử"]):
        return "Cơ chuyên về thần số học, Tarot và Kinh Dịch để giúp ngườ ta hiểu bản thân. Cơ không bàn luận về chính trị hay tin tức thế sự. Bạn có thắc mắc gì về số mệnh của mình không?"

    # Technical/programming
    if any(word in text_lower for word in ["code", "lập trình", "python", "javascript", "bug", "error", "api"]):
        return "Cơ chuyên về thần số học, Tarot và Kinh Dịch. Cơ không hỗ trợ kỹ thuật lập trình. Bạn có muốn Cơ giúp phân tích số mệnh hay giải đáp về ý nghĩa các con số không?"

    # General knowledge/facts
    if any(word in text_lower for word in ["là gì", "định nghĩa", "giải thích", "tại sao trờ", "công thức"]):
        return "Cơ chuyên về thần số học, Tarot và Kinh Dịch. Cơ có thể giải thích về ý nghĩa số, lá bài Tarot hoặc quẻ Kinh Dịch. Bạn muốn tìm hiểu về chủ đề nào trong số này?"

    # Default off-topic response
    return "Cơ chuyên về thần số học, Tarot và Kinh Dịch để giúp ngườ ta hiểu bản thân và vận mệnh. Bạn có thắc mắc gì về các chủ đề này không? Cơ có thể phân tích số mệnh hoặc giải đáp thắc mắc về ý nghĩa các con số."


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

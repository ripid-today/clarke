"""
Intent classification router for Co divination system.

Provides fast, deterministic routing of user messages to appropriate actions.
Uses keyword matching + LLM confidence scoring (single call, no agent spawning).
"""

import re
from dataclasses import dataclass
from enum import Enum
from typing import Dict, List, Optional, Tuple


class ActionType(Enum):
    """The four core actions of the Co system."""
    QA = "qa"                           # Q&A - read-only knowledge retrieval
    KNOWLEDGE_UPDATE = "knowledge_update"  # Workflow 4 - knowledge curation
    LIFE_WRITINGS = "life_writings"     # General numerology analysis
    SHORTCOMINGS = "shortcomings"       # Time-bound analysis of obstacles


@dataclass
class IntentClassification:
    """Result of intent classification."""
    action: ActionType
    confidence: float  # 0-100
    extracted_params: Dict
    requires_clarification: bool
    clarification_question: Optional[str] = None
    is_off_topic: bool = False  # True for messages outside divination scope


# =============================================================================
# Keyword Patterns for Fast Routing
# =============================================================================

# Knowledge update indicators (highest priority)
KNOWLEDGE_UPDATE_PATTERNS = [
    r'(?:cập\s*nhật|thêm|bổ\s*sung|sửa|điều\s*chỉnh)\s*(?:tri\s*thức|kiến\s*thức|thông\s*tin)',
    r'tri\s*thức\s*mới',
    r'(?:học|ghi\s*nhận)\s*thêm',
    r'(?:sai|chưa\s*đúng)\s+về\s+(?:iching|numerology|tarot|chiêm\s*tinh)',
    r'cần\s+cập\s+nhật\s+lại',
]

# Shortcomings analysis indicators (high priority - time-bound)
SHORTCOMINGS_PATTERNS = [
    r'(?:điểm\s*yếu|khuyết\s*điểm|thiếu\s+sót|hạn\s*chế|vấn\s*đề)',
    r'(?:tại\s*sao|sao\s+tôi|vì\s*sao)\s+(?:lại\s+gặp|hay|không|mãi)',
    r'(?:tháng|quý|năm)\s+này\s+(?:sao|thế\s*nào|ra\s*sao)',
    r'(?:vận\s*hạn|vận\s*trình|vận\s*mệnh)\s+(?:gần\s*đây|thờ\s*gian\s+tới|sắp\s*tới)',
    r'(?:khó\s*khăn|trở\s*ngại|trắc\s*trở|xui\s*xẻo)',
    r'(?:giai\s*đoạn|thờ\s*kỳ|khoảng\s+thờ\s*gian)',
    r'(?:từ\s+.+?\s+đến\s+.+?\s+(?:sao|thế\s*nào))',
]

# Life writings (general analysis) indicators
LIFE_WRITINGS_PATTERNS = [
    r'xem\s+bài\s+phân\s+tích',
    r'phân\s+tích\s+(?:số\s+mệnh|cuộc\s+đờ|cho|củ\s*a)',
    r'(?:xem|phân\s*tích|luận\s*giải|bói|đoán)\s+(?:cho|củ\s*a|về)?\s*.*?(?:tôi|mình|bạn|ngườ\s+này)?',
    r'(?:tính|tìm)\s+(?:số|chỉ\s+số|đường\s*đờ|sứ\s*mệnh)',
    r'(?:ngày\s*sinh?|sinh\s+ngày)\s+\d{1,2}[/\-]',
    r'(?:tên\s+là|tôi\s+tên|tên\s+tôi|cho)\s+[A-ZÀ-Ỹ]',
    r'(?:củ\s*a|phân\s*tích\s+củ\s*a)\s+[A-ZÀ-Ỹ]',  # Pattern for "củA [Name]"
    r'(?:biểu\s*đồ|ma\s*trận|thần\s*số)',
    r'(?:mũi\s*tên|mũi\s*tên\s+sức\s*mạnh)',
    r'(?:13\s+ngôi\s+nhà|tarot\s+mandala)',
    r'(?:vận\s*mệnh|tính\s*cách|sự\s*nghiệp|tình\s*duyên)',
]

# Q&A patterns (default, lowest priority)
QA_PATTERNS = [
    r'(?:là\s+gì|nghĩa\s+là\s+gì|ý\s+nghĩa|giải\s+thích)',
    r'(?:cho\s+tôi\s+biết|tôi\s+muốn\s+biết|hỏi\s+về)',
    r'(?:có\s+phải|đúng\s+không|có\s+đúng)',
    r'^\s*(?:tại\s+sao|vì\s+sao|thế\s+nào|như\s+thế\s+nào)',
]

# Escape patterns - user wants to cancel/abandon current flow
ESCAPE_PATTERNS = [
    r'\bthôi\b',
    r'\bbỏ\s+đi\b',
    r'\bquên\s+đi\b',
    r'\bkhông\s+(?:nữa|cần|muốn)',
    r'\blàm\s+cái\s+khác\b',
    r'\bhỏi\s+cái\s+khác\b',
    r'\bquay\s+lại\b',
    r'\bbắt\s+đầu\s+lại\b',
    r'\breset\b',
    r'\bhủy\b',
]


# =============================================================================
# Parameter Extraction Patterns
# =============================================================================

DATE_PATTERN = re.compile(
    r'(?:ngày\s+)?(\d{1,2})[\s/\-\.]+(\d{1,2})(?:[\s/\-\.]+(\d{4}))?',
    re.IGNORECASE
)

NAME_PATTERN = re.compile(
    r'(?:tên\s+(?:là|tôi|bạn|củ\s*a|củ\s*bạn)\s+)?'
    r'([A-ZÀ-Ỹ][a-zà-ỹ]+(?:\s+[A-ZÀ-Ỹ][a-zà-ỹ]+)*)',
    re.UNICODE
)

PERIOD_PATTERN = re.compile(
    r'(?:tháng|quý|năm)\s+(\d{1,2}|\w+)\s*(?:/|\-)?\s*(\d{4})?',
    re.IGNORECASE
)


def extract_date(text: str, require_year: bool = True) -> Optional[Dict]:
    """Extract birth date from text.

    Args:
        text: Input text to search
        require_year: If True, year must be present and valid

    Returns:
        Dict with day, month, year if valid, None otherwise
    """
    match = DATE_PATTERN.search(text)
    if not match:
        return None

    day = int(match.group(1))
    month = int(match.group(2))
    year = int(match.group(3)) if match.group(3) else None

    # Validate year is present if required
    if require_year and year is None:
        return None

    # Default year for validation (if not required)
    check_year = year or 2024

    # Validate date is actually valid
    try:
        from datetime import date
        date(check_year, month, day)
    except ValueError:
        # Invalid date (e.g., 31/02, 29/02 on non-leap year)
        return None

    return {
        "day": day,
        "month": month,
        "year": year,
    }


def extract_name(text: str) -> Optional[str]:
    """Extract name from text."""
    # Pattern 1: "cho [Name]" (analysis for someone)
    cho_pattern = re.search(
        r'(?:cho|phân\s+tích\s+cho)\s+([A-ZÀ-Ỹ][a-zà-ỹ]+(?:\s+[A-ZÀ-Ỹ][a-zà-ỹ]+){1,4})',
        text,
        re.UNICODE | re.IGNORECASE
    )
    if cho_pattern:
        return cho_pattern.group(1).strip()

    # Pattern 2: "củA [Name]" (e.g., "phân tích củA Nguyễn Hồng Nguyên")
    cua_pattern = re.search(
        r'(?:củ\s*a|củ\s*a\s+phân\s*tích|phân\s*tích\s+củ\s*a)\s+([A-ZÀ-Ỹ][a-zà-ỹ]+(?:\s+[A-ZÀ-Ỹ][a-zà-ỹ]+){1,4})',
        text,
        re.UNICODE | re.IGNORECASE
    )
    if cua_pattern:
        return cua_pattern.group(1).strip()

    # Pattern 3: "tôi là/mình là/tên tôi là [Name]"
    toi_la_pattern = re.search(
        r'(?:tôi\s+là|mình\s+là|tên\s+tôi\s+là|tên\s+mình\s+là)\s+([A-ZÀ-Ỹ][a-zà-ỹ]+(?:\s+[A-ZÀ-Ỹ][a-zà-ỹ]+){0,4})',
        text,
        re.UNICODE | re.IGNORECASE
    )
    if toi_la_pattern:
        return toi_la_pattern.group(1).strip()

    # Pattern 4: "tên là/tôi tên/bạn tên"
    explicit = re.search(
        r'(?:tên\s+(?:là|tôi|bạn|củ\s*a|củ\s*bạn)\s+)'
        r'([A-ZÀ-Ỹ][a-zà-ỹ]+(?:\s+[A-ZÀ-Ỹ][a-zà-ỹ]+)*)',
        text,
        re.UNICODE | re.IGNORECASE
    )
    if explicit:
        return explicit.group(1).strip()

    # Pattern 3: Name followed by comma and date
    name_before_date = re.search(
        r'([A-ZÀ-Ỹ][a-zà-ỹ]+(?:\s+[A-ZÀ-Ỹ][a-zà-ỹ]+){1,4})\s*,\s*\d{1,2}[/\-]',
        text,
        re.UNICODE | re.IGNORECASE
    )
    if name_before_date:
        return name_before_date.group(1).strip()

    # Fall back to general Vietnamese name pattern (skip common words)
    match = NAME_PATTERN.search(text)
    if match:
        name = match.group(1).strip()
        # Skip common false positives
        skip_words = ['Hãy', 'Tôi', 'Bạn', 'Cho', 'Xem', 'Phân', 'Tích']
        if name not in skip_words:
            return name

    return None


def extract_period(text: str) -> Optional[Dict]:
    """Extract time period for shortcomings analysis."""
    # Month pattern
    month_match = re.search(
        r'tháng\s+(\d{1,2})\s*(?:/|\-)?\s*(\d{4})?',
        text,
        re.IGNORECASE
    )
    if month_match:
        return {
            "type": "month",
            "month": int(month_match.group(1)),
            "year": int(month_match.group(2)) if month_match.group(2) else None,
        }

    # Quarter pattern
    quarter_match = re.search(
        r'quý\s+(\d)\s*(?:/|\-)?\s*(\d{4})?',
        text,
        re.IGNORECASE
    )
    if quarter_match:
        return {
            "type": "quarter",
            "quarter": int(quarter_match.group(1)),
            "year": int(quarter_match.group(2)) if quarter_match.group(2) else None,
        }

    # Year pattern
    year_match = re.search(
        r'năm\s+(\d{4})',
        text,
        re.IGNORECASE
    )
    if year_match:
        return {
            "type": "year",
            "year": int(year_match.group(1)),
        }

    return None


def is_escape_message(text: str) -> bool:
    """
    Check if user wants to cancel/abandon current flow.

    Escape signals indicate the user wants to:
    - Cancel current operation
    - Start fresh with a new request
    - Abandon the pending clarification

    Args:
        text: User message to check

    Returns:
        True if message is an escape signal, False otherwise
    """
    text_lower = text.lower().strip()
    return any(
        re.search(pattern, text_lower)
        for pattern in ESCAPE_PATTERNS
    )


# =============================================================================
# Confidence Scoring
# =============================================================================

def keyword_confidence_score(text: str, patterns: List[str]) -> int:
    """Calculate confidence score based on keyword pattern matches."""
    text_lower = text.lower()
    score = 0

    for pattern in patterns:
        if re.search(pattern, text_lower):
            score += 25  # Each pattern match adds 25 points

    return min(score, 100)


def classify_intent(text: str) -> IntentClassification:
    """
    Classify user intent using keyword matching.

    Returns IntentClassification with confidence score.
    Uses 95% Confidence Protocol for routing decisions.
    """
    text_lower = text.lower().strip()

    # Extract parameters first
    params = {}
    date_info = extract_date(text)
    if date_info:
        params["birth_date"] = date_info

    name = extract_name(text)
    if name:
        params["name"] = name

    period = extract_period(text)
    if period:
        params["period"] = period

    # Check knowledge update (highest priority)
    ku_score = keyword_confidence_score(text, KNOWLEDGE_UPDATE_PATTERNS)
    if ku_score >= 75:
        return IntentClassification(
            action=ActionType.KNOWLEDGE_UPDATE,
            confidence=ku_score,
            extracted_params=params,
            requires_clarification=ku_score < 80,
        )

    # Check shortcomings (time-bound analysis)
    sh_score = keyword_confidence_score(text, SHORTCOMINGS_PATTERNS)
    if sh_score >= 50 and (params.get("period") or params.get("birth_date")):
        # Boost confidence if we have both period and birth date
        if params.get("period") and params.get("birth_date"):
            sh_score = max(sh_score, 90)
        return IntentClassification(
            action=ActionType.SHORTCOMINGS,
            confidence=sh_score,
            extracted_params=params,
            requires_clarification=sh_score < 80,
        )

    # Check life writings (general analysis)
    lw_score = keyword_confidence_score(text, LIFE_WRITINGS_PATTERNS)
    if lw_score >= 50 and params.get("birth_date"):
        # Boost confidence based on available data
        if params.get("birth_date") and params.get("name"):
            # Have both name and birth date - high confidence
            lw_score = max(lw_score, 90)
        else:
            # Only have birth date - moderate confidence
            lw_score = max(lw_score, 75)
        return IntentClassification(
            action=ActionType.LIFE_WRITINGS,
            confidence=lw_score,
            extracted_params=params,
            requires_clarification=lw_score < 80,
        )

    # Check Q&A (default)
    qa_score = keyword_confidence_score(text, QA_PATTERNS)

    # Calculate all scores to detect off-topic messages
    max_score = max(ku_score, sh_score, lw_score, qa_score)

    # Off-topic detection: very low confidence, no params, not a short message
    is_short_message = len(text.split()) < 10
    has_any_param = bool(params.get("name") or params.get("birth_date") or params.get("period"))

    if max_score < 25 and not is_short_message and not has_any_param:
        # Truly off-topic - no patterns match, not short, no useful params
        return IntentClassification(
            action=ActionType.QA,  # Default to QA
            confidence=30,
            extracted_params=params,
            requires_clarification=False,  # Don't ask clarifying question
            is_off_topic=True,  # Signal for special handling
        )

    if qa_score >= 25 or is_short_message:
        # Short messages default to Q&A
        return IntentClassification(
            action=ActionType.QA,
            confidence=max(qa_score, 60),
            extracted_params=params,
            requires_clarification=qa_score < 70,
        )

    # Ambiguous case - need clarification
    return IntentClassification(
        action=ActionType.QA,  # Default to QA
        confidence=50,
        extracted_params=params,
        requires_clarification=True,
        clarification_question="Bạn muốn Cơ giúp gì? Cơ có thể trả lờ thắc mắc, phân tích số mệnh, hoặc xem vận hạn theo thờ gian.",
    )


def get_clarification_question(classification: IntentClassification) -> str:
    """Generate appropriate clarification question based on missing info."""
    params = classification.extracted_params

    if classification.action == ActionType.LIFE_WRITINGS:
        if not params.get("birth_date"):
            return "Cơ cần biết ngày sinh của bạn (DD/MM/YYYY) để phân tích. Bạn cho Cơ biết nhé!"
        if not params.get("name"):
            return "Cơ nên gọi bạn là gì? Vui lòng cho Cơ biết tên nhé!"

    if classification.action == ActionType.SHORTCOMINGS:
        if not params.get("birth_date"):
            return "Để xem vận hạn, Cơ cần ngày sinh của bạn (DD/MM/YYYY). Bạn cho Cơ biết nhé!"
        if not params.get("period"):
            return "Bạn muốn Cơ xem cho thờ gian nào? (ví dụ: tháng 3/2024, quý 2/2024)"

    # Generic clarification
    return "Bạn có thể nói rõ hơn được không? Cơ muốn chắc chắn hiểu đúng ý bạn."


# =============================================================================
# Quick Classification (for simple routing)
# =============================================================================

def quick_classify(text: str) -> Tuple[ActionType, float]:
    """
    Fast classification returning just action type and confidence.

    Use this for routing decisions where full parameter extraction
    isn't needed yet.
    """
    result = classify_intent(text)
    return result.action, result.confidence


def is_knowledge_update(text: str) -> bool:
    """Quick check if this is a knowledge update request."""
    text_lower = text.lower()
    return any(
        re.search(pattern, text_lower)
        for pattern in KNOWLEDGE_UPDATE_PATTERNS
    )


def requires_birth_date(action: ActionType) -> bool:
    """Check if an action requires birth date information."""
    return action in (ActionType.LIFE_WRITINGS, ActionType.SHORTCOMINGS)


# =============================================================================
# Test
# =============================================================================

if __name__ == "__main__":
    test_inputs = [
        # Knowledge update
        "Cập nhật tri thức: lá Chariot có ý nghĩa mới",
        "Tri thức mới về số 11 trong thần số học",

        # Shortcomings
        "Tại sao tôi gặp khó khăn tháng này? Sinh 15/03/1990",
        "Xem vận hạn quý 1/2024 cho Nguyễn Văn A sinh 15/03/1990",

        # Life writings
        "Phân tích cho tôi sinh ngày 15/03/1990 tên Nam",
        "Tính đường đời cho bạn sinh 08/08/1985",

        # Q&A
        "Số 7 có ý nghĩa gì?",
        "Lá Fool là gì?",

        # Ambiguous
        "Xem cho tôi",
    ]

    print("Intent Classification Tests:\n")
    for text in test_inputs:
        result = classify_intent(text)
        status = "NEEDS_CLARIFICATION" if result.requires_clarification else "OK"
        print(f"Input: '{text}'")
        print(f"  -> Action: {result.action.value} (confidence: {result.confidence}%)")
        print(f"  -> Params: {result.extracted_params}")
        print(f"  -> Status: {status}")
        if result.clarification_question:
            print(f"  -> Question: {result.clarification_question}")
        print()

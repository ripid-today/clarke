"""
Knowledge Update Action Handler - Workflow 4 knowledge curation.

Handles user-suggested knowledge updates with Libra evaluation.
This is the only write-path action to the knowledge base.
"""

from typing import Dict, Optional
import json


async def handle_knowledge_update(
    user_input: str,
    domain_hint: Optional[str] = None,
) -> Dict:
    """
    Handle knowledge update request from user.

    This action does NOT directly write to knowledge base.
    Instead, it packages the content and triggers Libra evaluation.

    Args:
        user_input: The knowledge content from user
        domain_hint: Optional domain hint (iching, numerology, tarot, astrology)

    Returns:
        Result dict with status and message
    """
    # Extract domain from content if not provided
    if not domain_hint:
        domain_hint = _detect_domain(user_input)

    # Validate content quality
    validation = _validate_content(user_input)
    if not validation["valid"]:
        return {
            "status": "rejected",
            "reason": validation["reason"],
            "message": f"Cơ không thể cập nhật: {validation['reason']}",
        }

    # Package for Libra evaluation
    update_package = {
        "content": user_input,
        "domain": domain_hint,
        "source": "user_submission",
        "timestamp": _get_timestamp(),
    }

    # Trigger Libra evaluation (in production, this spawns Libra)
    # For now, return pending status
    return {
        "status": "pending_evaluation",
        "package": update_package,
        "message": (
            "Cơ đã ghi nhận thông tin. "
            "Libra sẽ đánh giá và quyết định có thêm vào kho tri thức hay không. "
            "Cơ sẽ thông báo kết quả sau nhé!"
        ),
    }


def _detect_domain(text: str) -> str:
    """Detect knowledge domain from content."""
    text_lower = text.lower()

    # I-Ching indicators
    if any(kw in text_lower for kw in ["quẻ", "hào", "càn", "khôn", "kinh dịch", "ích kinh"]):
        return "iching"

    # Tarot indicators
    if any(kw in text_lower for kw in ["tarot", "lá bày", "major arcana", "magician", "fool"]):
        return "tarot"

    # Astrology indicators
    if any(kw in text_lower for kw in ["cung", "sao", "hành tinh", "chiêm tinh", "zodiac"]):
        return "astrology"

    # Default to numerology
    return "numerology"


def _validate_content(text: str) -> Dict:
    """
    Basic content validation before Libra evaluation.

    Returns dict with valid flag and reason if invalid.
    """
    if len(text) < 20:
        return {
            "valid": False,
            "reason": "Thông tin quá ngắn, cần chi tiết hơn",
        }

    if len(text) > 5000:
        return {
            "valid": False,
            "reason": "Thông tin quá dài, vui lòng chia nhỏ",
        }

    # Check for minimum information density
    sentences = [s.strip() for s in text.split(".") if s.strip()]
    if len(sentences) < 2:
        return {
            "valid": False,
            "reason": "Cần ít nhất 2 câu để giải thích rõ ràng",
        }

    return {"valid": True}


def _get_timestamp() -> str:
    """Get current ISO timestamp."""
    from datetime import datetime
    return datetime.now().isoformat()


def format_update_response(result: Dict) -> str:
    """Format knowledge update response."""
    return result.get("message", "Cơ đã xử lý yêu cầu cập nhật.")

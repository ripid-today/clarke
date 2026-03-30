"""
Q&A Action Handler - Read-only knowledge retrieval.

This is the simplest action: it retrieves information from the knowledge base
and presents it without any calculations or persistence.
"""

from typing import Dict, List, Optional

from bot.tools.knowledge import search_knowledge


async def handle_qa(user_input: str, context: Dict) -> str:
    """
    Handle Q&A requests - read-only knowledge retrieval.

    Args:
        user_input: The user's question
        context: Session context (conversation history, etc.)

    Returns:
        Vietnamese response with answer from knowledge base
    """
    # Search knowledge base (returns formatted string)
    result = search_knowledge(user_input)

    if not result or result == "Không tìm thấy thông tin liên quan trong kho kiến thức.":
        return _handle_no_results(user_input)

    # Return the knowledge directly (already formatted)
    return result


def _handle_no_results(user_input: str) -> str:
    """Handle case when no knowledge is found."""
    # Check if it's a numerology calculation question
    if any(kw in user_input.lower() for kw in ["tính", "đường đờ", "số chủ đạo"]):
        return (
            "Cơ chưa có thông tin chi tiết về cách tính này trong kho tri thức. "
            "Nếu bạn cung cấp ngày sinh, Cơ có thể tính trực tiếp cho bạn nhé!"
        )

    # Check if it's about tarot
    if any(kw in user_input.lower() for kw in ["tarot", "lá bày", "major arcana"]):
        return (
            "Cơ chưa có thông tin về lá bày này. "
            "Bạn có thể cho Cơ biết số hiệu lá bày hoặc tên tiếng Việt để Cơ tra cứu nhé!"
        )

    # Check if it's about I-Ching
    if any(kw in user_input.lower() for kw in ["quẻ", "iching", "kinh dịch"]):
        return (
            "Cơ chưa có thông tin về quẻ này. "
            "Bạn cho Cơ biết số quẻ (1-64) để Cơ tra cứu nhé!"
        )

    # Generic response
    return (
        "Cơ chưa có thông tin về câu hỏi này. "
        "Bạn có thể hỏi về thần số học, Tarot, hoặc Kinh Dịch nhé!"
    )


def _synthesize_answer(user_input: str, results: List[Dict]) -> str:
    """Synthesize a coherent answer from retrieved knowledge chunks."""
    # For now, return the most relevant result
    # In Phase 4, this will use LLM for synthesis

    if not results:
        return _handle_no_results(user_input)

    best_result = results[0]
    content = best_result.get("content", "")
    source = best_result.get("source", "kho tri thức")

    # Format as Cơ's response
    return f"Theo {source}:\n\n{content}"


async def handle_quick_answer(topic: str, domain: str = "general") -> str:
    """
    Provide quick answer for common topics without full search.

    Args:
        topic: Topic keyword (e.g., "life_path", "birth_day")
        domain: Knowledge domain (numerology, tarot, iching)

    Returns:
        Pre-formatted quick answer
    """
    quick_answers = {
        ("life_path", "numerology"): (
            "Đường đờ (Life Path) là chỉ số quan trọng nhất trong thần số học, "
            "tính bằng tổng các chữ số trong ngày sinh, rút gọn về một chữ số (hoặc số chủ 11, 22, 33)."
        ),
        ("birth_day", "numerology"): (
            "Số ngày sinh (Birth Day) là ngày trong tháng bạn sinh ra, "
            "rút gọn về một chữ số (hoặc 11, 22 nếu là số chủ)."
        ),
        ("millman", "numerology"): (
            "Hệ thống Millman (Dan Millman) biểu diễn Sứ mệnh sống dưới dạng "
            "dãy số như 28/10/1 thay vì chỉ một số đơn."
        ),
        ("arrows", "numerology"): (
            "Mũi tên trong biểu đồ ngày sinh gồm:\n"
            "- Mũi tên sức mạnh: 789 (trí tuệ), 456 (ý chí), 357 (tâm lnh), 123 (kế hoạch), 159 (tập trung)\n"
            "- Mũi tên thách thức: 147 (cô lập), 258 (nhạy cảm), 369 (tưởng tượng)"
        ),
        ("houses", "tarot"): (
            "Mandala 13 ngôi nhài Tarot là hệ thống phân tích chi tiết:\n"
            "- H1: Vận mệnh tổng thể\n"
            "- H2: Tiền khiên (nghiệp cũ)\n"
            "- H3-H4: Tiền vận - Hậu vận\n"
            "- H5: Bóng lưng (tiềm ẩn)\n"
            "- H6-H11: 6 ngã tư quan trọng\n"
            "- H12: Đích đến cuối cùng\n"
            "- H13: Hậu quả (tổng hợp)"
        ),
    }

    key = (topic, domain)
    if key in quick_answers:
        return quick_answers[key]

    # Fall back to knowledge search
    result = search_knowledge(f"{topic} {domain}")
    if result and result != "Không tìm thấy thông tin liên quan trong kho kiến thức.":
        return result

    return _handle_no_results(topic)

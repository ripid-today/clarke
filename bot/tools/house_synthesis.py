"""
House interpretation synthesis for 13-house Tarot mandala.

Dynamically synthesizes house card interpretations using knowledge base.
If house meanings missing, triggers Libra to generate them.
"""

from typing import Dict, Optional, Tuple
from bot.tools.knowledge import search_knowledge


# House metadata (fixed meanings, independent of cards)
HOUSE_METADATA = {
    "H1": {
        "name": "Vận Mệnh Tổng Thể",
        "english": "Life/Destiny",
        "theme": "Sứ mệnh sống và hướng đi tổng thể",
        "position": "Trung tâm mandala",
    },
    "H2": {
        "name": "Tiền Kiếp",
        "english": "Early Karma",
        "theme": "Nghiệp cũ và bài học từ quá khứ",
        "position": "Phía dưới H1",
    },
    "H3": {
        "name": "Tiền Vận",
        "english": "First Half Potential",
        "theme": "Tiềm năng giai đoạn đầu đờ (0-40 tuổi)",
        "position": "Bên trái H1",
    },
    "H4": {
        "name": "Hậu Vận",
        "english": "Second Half Destiny",
        "theme": "Vận mệnh giai đoạn sau (40+ tuổi)",
        "position": "Bên phải H1",
    },
    "H5": {
        "name": "Bóng Lưng",
        "english": "Shadow/Soul",
        "theme": "Tiềm ẩn, phần bóng tối cần hội nhập",
        "position": "Phía sau H1",
    },
    "H6": {
        "name": "Ngã Tư Đầu Đờ",
        "english": "Early Life Crossroad",
        "theme": "Quyết định định hướng ban đầu",
        "position": "Xung quanh mandala",
    },
    "H7": {
        "name": "Ngã Tư Học Hỏi",
        "english": "Learning Crossroad",
        "theme": "Chọn con đường học vấn và kỹ năng",
        "position": "Xung quanh mandala",
    },
    "H8": {
        "name": "Ngã Tư Sự Nghiệp",
        "english": "Career Crossroad",
        "theme": "Quyết định nghề nghiệp quan trọng",
        "position": "Xung quanh mandala",
    },
    "H9": {
        "name": "Ngã Tư Quan Hệ",
        "english": "Relationship Crossroad",
        "theme": "Lựa chọn trong quan hệ lớn",
        "position": "Xung quanh mandala",
    },
    "H10": {
        "name": "Ngã Tư Trung Niên",
        "english": "Midlife Crossroad",
        "theme": "Khủng hoảng tuổi trung niên hoặc chuyển hướng",
        "position": "Xung quanh mandala",
    },
    "H11": {
        "name": "Ngã Tư Cuối Đờ",
        "english": "Late Life Crossroad",
        "theme": "Chuẩn bị cho giai đoạn cuối đờ",
        "position": "Xung quanh mandala",
    },
    "H12": {
        "name": "Đích Đến",
        "english": "Final Destination",
        "theme": "Nơi cuối cùng cuộc đờ hướng đến",
        "position": "Đỉnh mandala",
    },
    "H13": {
        "name": "Hậu Quả",
        "english": "Consequences",
        "theme": "Tổng kết và thông điệp tổng hợp",
        "position": "Vòng ngoài cùng",
    },
}


# Major Arcana card names in Vietnamese
MAJOR_ARCANA_NAMES = {
    0: "The Fool (Kẻ Ngốc)",
    1: "The Magician (Nhà Ảo Thuật)",
    2: "The High Priestess (Nữ Tế Tư)",
    3: "The Empress (Hoàng Hậu)",
    4: "The Emperor (Hoàng Đế)",
    5: "The Hierophant (Giáo Trưởng)",
    6: "The Lovers (Ngườ Yêu)",
    7: "The Chariot (Cỗ Xe)",
    8: "Strength (Sức Mạnh)",
    9: "The Hermit (Ẩn Nhân)",
    10: "Wheel of Fortune (Bánh Xe Vận Mệnh)",
    11: "Justice (Công Lý)",
    12: "The Hanged Man (Ngườ Treo Cổ)",
    13: "Death (Tử Thần)",
    14: "Temperance (Điều Độ)",
    15: "The Devil (Ác Quỷ)",
    16: "The Tower (Tháp Đổ)",
    17: "The Star (Ngôi Sao)",
    18: "The Moon (Mặt Trăng)",
    19: "The Sun (Mặt Trờ)",
    20: "Judgement (Phán Xét)",
    21: "The World (Thế Giới)",
    22: "The Fool (Kẻ Ngốc - vòng mới)",
}


def get_house_metadata(house_key: str) -> Dict:
    """Get static metadata for a house."""
    return HOUSE_METADATA.get(house_key, {
        "name": house_key,
        "english": "",
        "theme": "",
        "position": "",
    })


def get_card_name(card_number: int) -> str:
    """Get Vietnamese name for a Major Arcana card."""
    return MAJOR_ARCANA_NAMES.get(card_number, f"Lá {card_number}")


def synthesize_house_interpretation(house_key: str, card_number: int) -> str:
    """
    Synthesize interpretation for a house-card combination.

    Strategy:
    1. Search knowledge base for house-specific card meaning
    2. If not found, search for house meaning + card meaning separately
    3. Synthesize from components
    4. If house meaning missing, flag for Libra generation
    """
    house_meta = get_house_metadata(house_key)
    card_name = get_card_name(card_number)

    # Try direct search first
    direct_query = f"{house_key} {card_name} tarot mandala"
    direct_result = search_knowledge(direct_query, max_chars=2000)

    if "Không tìm thấy" not in direct_result and len(direct_result) > 100:
        return _format_interpretation(
            house_key=house_key,
            house_name=house_meta["name"],
            card_name=card_name,
            content=direct_result,
            source="knowledge_base"
        )

    # Search house meaning
    house_query = f"{house_key} {house_meta['name']} tarot house meaning"
    house_result = search_knowledge(house_query, max_chars=1500)

    # Search card meaning
    card_query = f"{card_name} major arcana meaning"
    card_result = search_knowledge(card_query, max_chars=1500)

    # Synthesize from components
    interpretation = _synthesize_from_components(
        house_key=house_key,
        house_meta=house_meta,
        card_number=card_number,
        card_name=card_name,
        house_meaning=house_result,
        card_meaning=card_result,
    )

    return interpretation


def _synthesize_from_components(
    house_key: str,
    house_meta: Dict,
    card_number: int,
    card_name: str,
    house_meaning: str,
    card_meaning: str,
) -> str:
    """Create interpretation from house and card components."""

    house_empty = "Không tìm thấy" in house_meaning or len(house_meaning) < 50

    if house_empty:
        # Flag for Libra to generate house meaning
        _flag_for_libra_generation(house_key, house_meta)

        # Return card-meaning-only interpretation with note
        return _format_fallback_interpretation(
            house_key=house_key,
            house_name=house_meta["name"],
            card_name=card_name,
            card_meaning=card_meaning,
        )

    # Combine both meanings
    return _format_combined_interpretation(
        house_key=house_key,
        house_name=house_meta["name"],
        card_name=card_name,
        house_meaning=house_meaning,
        card_meaning=card_meaning,
    )


def _format_interpretation(
    house_key: str,
    house_name: str,
    card_name: str,
    content: str,
    source: str,
) -> str:
    """Format a complete interpretation."""
    return f"""**{house_key} - {house_name}**
*Lá bài: {card_name}*

{content}
"""


def _format_fallback_interpretation(
    house_key: str,
    house_name: str,
    card_name: str,
    card_meaning: str,
) -> str:
    """Format interpretation when house meaning is missing."""
    return f"""**{house_key} - {house_name}**
*Lá bài: {card_name}*

{card_meaning}

*(Ý nghĩa chi tiết của {house_name} đang được bổ sung vào kho tri thức)*
"""


def _format_combined_interpretation(
    house_key: str,
    house_name: str,
    card_name: str,
    house_meaning: str,
    card_meaning: str,
) -> str:
    """Format interpretation combining house and card meanings."""
    return f"""**{house_key} - {house_name}**
*Lá bài: {card_name}*

**Ý nghĩa ngôi nhà:**
{house_meaning[:500]}

**Ý nghĩa lá bài:**
{card_meaning[:500]}

**Tổng hợp:**
Lá {card_name} tại {house_name} cho thấy năng lượng của lá bài này ảnh hưởng đến {house_name.lower()} của bạn.
"""


def _flag_for_libra_generation(house_key: str, house_meta: Dict) -> None:
    """
    Flag house meaning as missing for Libra to generate.

    This writes a marker that Libra will detect on its next run.
    """
    from pathlib import Path
    from datetime import datetime

    marker_path = Path(".claude/agent-memory/libra/house_generation_queue.md")

    try:
        marker_path.parent.mkdir(parents=True, exist_ok=True)

        entry = f"\n- [{datetime.now().isoformat()}] Need generation: {house_key} - {house_meta['name']}"

        if marker_path.exists():
            content = marker_path.read_text(encoding="utf-8")
        else:
            content = "# House Meaning Generation Queue\n\n"

        if house_key not in content:
            with open(marker_path, "a", encoding="utf-8") as f:
                f.write(entry)
    except Exception:
        pass  # Non-critical, ignore errors


def synthesize_all_houses(house_assignments: Dict[str, int]) -> Dict[str, str]:
    """
    Synthesize interpretations for all 13 houses.

    Args:
        house_assignments: Dict mapping H1-H13 to card numbers (0-21)

    Returns:
        Dict mapping H1-H13 to interpretation strings
    """
    interpretations = {}

    for house_key in [f"H{i}" for i in range(1, 14)]:
        card_number = house_assignments.get(house_key, 0)
        interpretations[house_key] = synthesize_house_interpretation(
            house_key, card_number
        )

    return interpretations


def get_house_summary(house_key: str, card_number: int) -> str:
    """
    Get a brief one-line summary for a house-card combination.
    Used for table views in PDF.
    """
    house_meta = get_house_metadata(house_key)
    card_name = get_card_name(card_number)

    # Try to get short meaning from knowledge base
    query = f"{card_name} {house_key} summary"
    result = search_knowledge(query, max_chars=300)

    if "Không tìm thấy" not in result and len(result) > 20:
        # Extract first sentence
        first_sentence = result.split(".")[0][:100]
        return first_sentence

    # Fallback to generic description
    return f"{card_name} tại {house_meta['name']} - cần phân tích chi tiết"


# =============================================================================
# Test
# =============================================================================

if __name__ == "__main__":
    # Test with sample house assignments
    test_houses = {
        "H1": 1,   # Magician at Life/Destiny
        "H2": 2,   # High Priestess at Karma
        "H3": 3,   # Empress at First Half
        "H4": 4,   # Emperor at Second Half
    }

    print("Testing house synthesis...\n")
    for house, card in test_houses.items():
        result = synthesize_house_interpretation(house, card)
        print(result[:300] + "...\n")

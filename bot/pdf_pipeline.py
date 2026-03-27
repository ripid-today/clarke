"""
PDF Pipeline for Co divination system.

Orchestrates: Analysis Results → Markdown Generation → PDF Conversion → Cleanup
"""

import os
import uuid
from datetime import datetime
from pathlib import Path
from typing import Dict, Optional

from bot.tools.pdf_gen import generate_pdf
from bot.tools.house_synthesis import (
    synthesize_all_houses,
    get_house_summary,
    get_card_name,
)


# Template directory
TEMPLATES_DIR = Path(__file__).parent.parent / "templates"
TEMP_DIR = Path("/tmp") if os.path.exists("/tmp") else Path(__file__).parent.parent / "temp"


def generate_life_writings_pdf(
    name: str,
    birth_date: str,
    core_numbers: Dict,
    arrow_analysis: Dict,
    house_assignments: Dict[str, int],
    four_peaks: Dict,
) -> bytes:
    """
    Generate life writings PDF from analysis results.

    Pipeline:
    1. Generate markdown content from template
    2. Save to temp file
    3. Convert to PDF
    4. Cleanup temp file
    5. Return PDF bytes
    """
    # Step 1: Generate markdown
    md_content = _generate_markdown(
        name=name,
        birth_date=birth_date,
        core_numbers=core_numbers,
        arrow_analysis=arrow_analysis,
        house_assignments=house_assignments,
        four_peaks=four_peaks,
    )

    # Step 2: Save to temp file
    temp_md_path = _save_temp_markdown(md_content)

    try:
        # Step 3: Convert to PDF
        pdf_bytes = generate_pdf(
            subject_name=name,
            birth_date=birth_date,
            narrative_md=md_content,
        )

        return pdf_bytes

    finally:
        # Step 4: Cleanup
        _cleanup_temp_file(temp_md_path)


def _generate_markdown(
    name: str,
    birth_date: str,
    core_numbers: Dict,
    arrow_analysis: Dict,
    house_assignments: Dict[str, int],
    four_peaks: Dict,
) -> str:
    """Generate markdown content from template and data."""

    # Read template
    template_path = TEMPLATES_DIR / "life_writings_template.md"
    if not template_path.exists():
        raise FileNotFoundError(f"Template not found: {template_path}")

    template = template_path.read_text(encoding="utf-8")

    # Synthesize house interpretations
    house_interpretations = synthesize_all_houses(house_assignments)

    # Prepare template variables
    template_vars = {
        # Header info
        "name": name,
        "birth_date": birth_date,
        "analysis_date": datetime.now().strftime("%d/%m/%Y"),

        # Core numbers
        "life_path": core_numbers.get("life_path", "N/A"),
        "life_path_meaning": _get_life_path_meaning(core_numbers.get("life_path", 0)),
        "birth_day": core_numbers.get("birth_day", "N/A"),
        "birth_day_meaning": _get_birth_day_meaning(core_numbers.get("birth_day", 0)),
        "millman": core_numbers.get("millman_compound", "N/A"),
        "millman_meaning": _get_millman_meaning(core_numbers.get("millman_compound", "")),
        "element": core_numbers.get("birth_year_element", "N/A"),
        "element_meaning": _get_element_meaning(core_numbers.get("birth_year_element", "")),
        "birth_card": get_card_name(core_numbers.get("birth_card", 0)),
        "n_group": core_numbers.get("n_group", "N/A"),
        "birth_card_meaning": "Lá bài chủ đạo cho thấy năng lượng cốt lõi",
        "hexagram": core_numbers.get("resonance_hexagram", "N/A"),
        "hexagram_meaning": _get_hexagram_meaning(core_numbers.get("resonance_hexagram", 0)),

        # Arrow analysis
        "wisdom_state": arrow_analysis.get("wisdom_789", {}).get("state", "unknown"),
        "wisdom_detail": _format_arrow_detail(arrow_analysis.get("wisdom_789", {})),
        "willpower_state": arrow_analysis.get("willpower_456", {}).get("state", "unknown"),
        "willpower_detail": _format_arrow_detail(arrow_analysis.get("willpower_456", {})),
        "spiritual_state": arrow_analysis.get("spiritual_357", {}).get("state", "unknown"),
        "spiritual_detail": _format_arrow_detail(arrow_analysis.get("spiritual_357", {})),
        "planning_state": arrow_analysis.get("planning_123", {}).get("state", "unknown"),
        "planning_detail": _format_arrow_detail(arrow_analysis.get("planning_123", {})),
        "focus_state": arrow_analysis.get("focus_159", {}).get("state", "unknown"),
        "focus_detail": _format_arrow_detail(arrow_analysis.get("focus_159", {})),

        # Challenge arrows
        "isolation_state": arrow_analysis.get("isolation_147", {}).get("state", "present"),
        "isolation_impact": _format_challenge_impact(arrow_analysis.get("isolation_147", {})),
        "sensitivity_state": arrow_analysis.get("sensitivity_258", {}).get("state", "present"),
        "sensitivity_impact": _format_challenge_impact(arrow_analysis.get("sensitivity_258", {})),
        "imagination_state": arrow_analysis.get("imagination_369", {}).get("state", "present"),
        "imagination_impact": _format_challenge_impact(arrow_analysis.get("imagination_369", {})),

        # Houses - cards
        "h1_card": get_card_name(house_assignments.get("H1", 0)),
        "h2_card": get_card_name(house_assignments.get("H2", 0)),
        "h3_card": get_card_name(house_assignments.get("H3", 0)),
        "h4_card": get_card_name(house_assignments.get("H4", 0)),
        "h5_card": get_card_name(house_assignments.get("H5", 0)),
        "h6_card": get_card_name(house_assignments.get("H6", 0)),
        "h7_card": get_card_name(house_assignments.get("H7", 0)),
        "h8_card": get_card_name(house_assignments.get("H8", 0)),
        "h9_card": get_card_name(house_assignments.get("H9", 0)),
        "h10_card": get_card_name(house_assignments.get("H10", 0)),
        "h11_card": get_card_name(house_assignments.get("H11", 0)),
        "h12_card": get_card_name(house_assignments.get("H12", 0)),
        "h13_card": get_card_name(house_assignments.get("H13", 0)),

        # Houses - summaries
        "h1_summary": get_house_summary("H1", house_assignments.get("H1", 0)),
        "h2_summary": get_house_summary("H2", house_assignments.get("H2", 0)),
        "h3_summary": get_house_summary("H3", house_assignments.get("H3", 0)),
        "h4_summary": get_house_summary("H4", house_assignments.get("H4", 0)),
        "h5_summary": get_house_summary("H5", house_assignments.get("H5", 0)),
        "h6_summary": get_house_summary("H6", house_assignments.get("H6", 0)),
        "h7_summary": get_house_summary("H7", house_assignments.get("H7", 0)),
        "h8_summary": get_house_summary("H8", house_assignments.get("H8", 0)),
        "h9_summary": get_house_summary("H9", house_assignments.get("H9", 0)),
        "h10_summary": get_house_summary("H10", house_assignments.get("H10", 0)),
        "h11_summary": get_house_summary("H11", house_assignments.get("H11", 0)),
        "h12_summary": get_house_summary("H12", house_assignments.get("H12", 0)),
        "h13_summary": get_house_summary("H13", house_assignments.get("H13", 0)),

        # Houses - full interpretations
        "h1_interpretation": house_interpretations.get("H1", ""),
        "h2_interpretation": house_interpretations.get("H2", ""),
        "h3_interpretation": house_interpretations.get("H3", ""),
        "h4_interpretation": house_interpretations.get("H4", ""),
        "h5_interpretation": house_interpretations.get("H5", ""),
        "crossroads_interpretation": _format_crossroads(house_interpretations),
        "h12_interpretation": house_interpretations.get("H12", ""),
        "h13_interpretation": house_interpretations.get("H13", ""),

        # Four peaks
        "peak1_num": four_peaks.get("peak1", {}).get("number", "N/A"),
        "peak1_years": f"{four_peaks.get('peak1', {}).get('start_year', '')}-{four_peaks.get('peak1', {}).get('end_year', '')}",
        "peak1_meaning": _get_peak_meaning(four_peaks.get("peak1", {}).get("number", 0)),
        "peak2_num": four_peaks.get("peak2", {}).get("number", "N/A"),
        "peak2_years": f"{four_peaks.get('peak2', {}).get('start_year', '')}-{four_peaks.get('peak2', {}).get('end_year', '')}",
        "peak2_meaning": _get_peak_meaning(four_peaks.get("peak2", {}).get("number", 0)),
        "peak3_num": four_peaks.get("peak3", {}).get("number", "N/A"),
        "peak3_years": f"{four_peaks.get('peak3', {}).get('start_year', '')}-{four_peaks.get('peak3', {}).get('end_year', '')}",
        "peak3_meaning": _get_peak_meaning(four_peaks.get("peak3", {}).get("number", 0)),
        "peak4_num": four_peaks.get("peak4", {}).get("number", "N/A"),
        "peak4_years": f"Từ {four_peaks.get('peak4', {}).get('start_year', '')}",
        "peak4_meaning": _get_peak_meaning(four_peaks.get("peak4", {}).get("number", 0)),

        # Summary
        "summary": _generate_summary(core_numbers, arrow_analysis, house_assignments),
    }

    # Simple template substitution (no Jinja2 dependency)
    result = template
    for key, value in template_vars.items():
        placeholder = f"{{{{ {key} }}}}"
        result = result.replace(placeholder, str(value))

    return result


def _save_temp_markdown(content: str) -> Path:
    """Save markdown content to temp file."""
    TEMP_DIR.mkdir(parents=True, exist_ok=True)
    temp_path = TEMP_DIR / f"co_analysis_{uuid.uuid4().hex[:8]}.md"
    temp_path.write_text(content, encoding="utf-8")
    return temp_path


def _cleanup_temp_file(path: Path) -> None:
    """Remove temp file if it exists."""
    try:
        if path.exists():
            path.unlink()
    except Exception:
        pass  # Non-critical, ignore errors


def _format_arrow_detail(arrow_data: Dict) -> str:
    """Format arrow analysis detail."""
    state = arrow_data.get("state", "unknown")
    count = arrow_data.get("count", 0)

    if state == "thick":
        return f"Đầy đủ cả 3 số - Sức mạnh tối đa"
    elif state == "thin":
        return f"Có {count}/3 số - Cần phát triển thêm"
    else:
        return "Thiếu cả 3 số - Thách thức cần vượt qua"


def _format_challenge_impact(arrow_data: Dict) -> str:
    """Format challenge arrow impact."""
    state = arrow_data.get("state", "present")
    if state == "missing":
        return "Cần chú ý và phát triển"
    return "Đã có nền tảng tốt"


def _format_crossroads(house_interpretations: Dict[str, str]) -> str:
    """Format H6-H11 crossroads interpretations."""
    parts = []
    for i in range(6, 12):
        house_key = f"H{i}"
        if house_key in house_interpretations:
            parts.append(f"**{house_key}:** {house_interpretations[house_key][:200]}...")
    return "\n\n".join(parts)


def _get_life_path_meaning(number: int) -> str:
    """Get brief meaning for life path number."""
    meanings = {
        1: "Ngườ tiên phong, lãnh đạo",
        2: "Ngườ hòa giải, nhạy cảm",
        3: "Ngườ sáng tạo, biểu đạt",
        4: "Ngườ xây dựng, thực tế",
        5: "Ngườ tự do, phiêu lưu",
        6: "Ngườ nuôi dưỡng, trách nhiệm",
        7: "Ngườ tìm kiếm, trí tuệ",
        8: "Ngườ quyền năng, thịnh vượng",
        9: "Ngườ nhân đạo, hoàn thiện",
        11: "Số chủ: Trực giác, tâm linh",
        22: "Số chủ: Xây dựng vĩ đại",
    }
    return meanings.get(number, "Con số đặc biệt")


def _get_birth_day_meaning(number: int) -> str:
    """Get brief meaning for birth day number."""
    return f"Năng lượng ngày sinh số {number}"


def _get_millman_meaning(compound: str) -> str:
    """Get brief meaning for Millman compound."""
    if not compound:
        return "N/A"
    parts = compound.split("/")
    if len(parts) >= 2:
        return f"Đường đờ phức hợp, rút gọn từ {parts[0]}"
    return compound


def _get_element_meaning(element: str) -> str:
    """Get brief meaning for birth year element."""
    meanings = {
        "Kim": "Sắc bén, quyết đoán",
        "Thuy": "Linh hoạt, thích ứng",
        "Moc": "Tăng trưởng, sáng tạo",
        "Hoa": "Đam mê, biểu đạt",
        "Tho": "Vững chắc, đáng tin",
    }
    return meanings.get(element, "N/A")


def _get_hexagram_meaning(number: int) -> str:
    """Get brief meaning for I-Ching hexagram."""
    hexagram_names = {
        1: "Càn - Sáng tạo",
        2: "Khôn - Nhận năng",
        3: "Truân - Khởi đầu khó khăn",
        17: "Tùy - Thuận theo",
        29: "Khảm - Hiểm nguy",
        47: "Khốn - Bế tắc",
        52: "Cấn - Dừng lại",
        7: "Sư - Đội quân",
        64: "Vị Tế - Chưa hoàn thành",
        11: "Thái - Thông suốt",
        36: "Minh Di - Tài năng bị che lấp",
    }
    return hexagram_names.get(number, f"Quẻ {number}")


def _get_peak_meaning(number: int) -> str:
    """Get brief meaning for four peaks number."""
    meanings = {
        1: "Giai đoạn độc lập, khởi đầu mới",
        2: "Giai đoạn hợp tác, xây dựng quan hệ",
        3: "Giai đoạn sáng tạo, biểu đạt",
        4: "Giai đoạn xây dựng nền móng",
        5: "Giai đoạn thay đổi, tự do",
        6: "Giai đoạn trách nhiệm, phụng sự",
        7: "Giai đoạn tìm kiếm, phân tích",
        8: "Giai đoạn quyền năng, thành công vật chất",
        9: "Giai đoạn hoàn thiện, nhân đạo",
    }
    return meanings.get(number, "Giai đoạn chuyển tiếp")


def _generate_summary(
    core_numbers: Dict,
    arrow_analysis: Dict,
    house_assignments: Dict[str, int],
) -> str:
    """Generate overall summary paragraph."""
    life_path = core_numbers.get("life_path", 0)
    return f"""Đường đờ số {life_path} cho thấy bạn là ngườ có năng lượng {['đặc biệt', 'tiên phong', 'hòa giải', 'sáng tạo', 'xây dựng', 'tự do', 'phụng sự', 'tìm kiếm', 'quyền năng', 'nhân đạo'][life_path if 0 <= life_path <= 9 else 0]}.
Bản đồ 13 ngôi nhài với lá chủ đạo {get_card_name(house_assignments.get('H1', 0))} cho thấy hướng đi chính của cuộc đờ.
Các mũi tên trong biểu đồ chỉ ra điểm mạnh cần phát huy và thách thức cần vượt qua.
Hãy sử dụng thông tin này như bản đồ định hướng, không phải định mệnh cố định."""


# =============================================================================
# Test
# =============================================================================

if __name__ == "__main__":
    print("Testing PDF pipeline...")

    test_data = {
        "name": "Nguyễn Văn A",
        "birth_date": "15/03/1990",
        "core_numbers": {
            "life_path": 1,
            "birth_day": 6,
            "millman_compound": "28/10/1",
            "birth_year_element": "Kim",
            "birth_card": 1,
            "n_group": "N4",
            "resonance_hexagram": 1,
        },
        "arrow_analysis": {
            "wisdom_789": {"state": "thick", "count": 3},
            "willpower_456": {"state": "thin", "count": 2},
            "spiritual_357": {"state": "missing", "count": 0},
            "planning_123": {"state": "thick", "count": 3},
            "focus_159": {"state": "thin", "count": 1},
            "isolation_147": {"state": "present", "missing": False, "count": 2},
            "sensitivity_258": {"state": "missing", "missing": True, "count": 0},
            "imagination_369": {"state": "present", "missing": False, "count": 2},
        },
        "house_assignments": {
            "H1": 1, "H2": 2, "H3": 3, "H4": 4, "H5": 5,
            "H6": 6, "H7": 7, "H8": 8, "H9": 9, "H10": 10,
            "H11": 11, "H12": 12, "H13": 13,
        },
        "four_peaks": {
            "peak1": {"number": 3, "start_year": 1990, "end_year": 1999},
            "peak2": {"number": 5, "start_year": 2000, "end_year": 2008},
            "peak3": {"number": 8, "start_year": 2009, "end_year": 2017},
            "peak4": {"number": 6, "start_year": 2018, "end_year": None},
        },
    }

    try:
        md_content = _generate_markdown(**test_data)
        print("Markdown generated successfully!")
        print(f"Length: {len(md_content)} characters")
        print("\nFirst 500 chars:")
        print(md_content[:500])
    except Exception as e:
        print(f"Error: {e}")

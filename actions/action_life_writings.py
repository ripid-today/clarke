"""
Life Writings Action Handler - Full numerology analysis.

Performs complete numerology calculations including:
- Life Path, Birth Day, Millman compound
- Four Peaks with year ranges
- Arrow analysis (mũi tên)
- 13-house Tarot mandala
"""

from datetime import date
from typing import Dict, List, Optional

from bot.tools.calculator import (
    calculate_birth_day_number,
    calculate_birth_year_element,
    calculate_four_peaks,
    calculate_house_assignments,
    calculate_life_path,
    calculate_millman_compound,
    calculate_tarot_birth_card,
    get_resonance_hexagram,
    get_tarot_n_group,
    analyze_arrows,
)
from bot.tools.validators import validate_required_fields
from bot.tools.house_synthesis import (
    synthesize_all_houses,
    get_house_summary,
)
from bot.pdf_pipeline import generate_life_writings_pdf
from bot.progress import LifeWritingsProgress


async def handle_life_writings(
    name: str,
    birth_date: date,
    send_progress: callable,
    edit_progress: Optional[callable] = None,
    generate_pdf_output: bool = True,
) -> Dict:
    """
    Handle life writings (general analysis) request.

    Args:
        name: Person's name
        birth_date: Birth date
        send_progress: Callback to send progress messages
        edit_progress: Optional callback to edit existing progress message
        generate_pdf_output: Whether to generate PDF (default True)

    Returns:
        Complete analysis results dictionary with optional pdf_bytes
    """
    # Validate inputs
    is_valid, error = validate_required_fields(name, birth_date)
    if not is_valid:
        return {"error": error}

    # Initialize progress tracking
    progress = LifeWritingsProgress(send_progress, edit_progress)
    await progress.start()

    # Stage 1: Calculate core numerology
    await progress.next_stage()
    core_numbers = _calculate_core_numbers(birth_date)

    # Stage 2: Analyze arrows
    await progress.next_stage()
    arrow_analysis = analyze_arrows(birth_date)

    # Stage 3: Map 13 houses
    await progress.next_stage()
    house_assignments = calculate_house_assignments(
        birth_date, core_numbers["life_path"]
    )

    # Stage 4: Consult knowledge base
    await progress.next_stage()
    house_interpretations = _lookup_house_meanings(house_assignments)

    # Stage 5: Synthesize and generate PDF
    await progress.next_stage()
    four_peaks = calculate_four_peaks(birth_date, core_numbers["life_path"])

    # Generate PDF if requested
    pdf_bytes = None
    if generate_pdf_output:
        try:
            pdf_bytes = generate_life_writings_pdf(
                name=name,
                birth_date=birth_date.strftime("%d/%m/%Y"),
                core_numbers=core_numbers,
                arrow_analysis=arrow_analysis,
                house_assignments=house_assignments,
                four_peaks=four_peaks,
            )
        except Exception as e:
            # PDF generation failed, continue without PDF
            pdf_bytes = None

    # Complete
    await progress.complete()

    return {
        "name": name,
        "birth_date": birth_date.strftime("%d/%m/%Y"),
        "core_numbers": core_numbers,
        "arrow_analysis": arrow_analysis,
        "house_assignments": house_assignments,
        "house_interpretations": house_interpretations,
        "four_peaks": four_peaks,
        "pdf_bytes": pdf_bytes,
    }


def _calculate_core_numbers(birth_date: date) -> Dict:
    """Calculate all core numerology numbers."""
    life_path = calculate_life_path(birth_date)
    birth_day = calculate_birth_day_number(birth_date.day)
    millman = calculate_millman_compound(birth_date)
    element = calculate_birth_year_element(birth_date.year)
    birth_card = calculate_tarot_birth_card(life_path)
    n_group = get_tarot_n_group(birth_card)
    hexagram = get_resonance_hexagram(life_path)

    return {
        "life_path": life_path,
        "birth_day": birth_day,
        "millman_compound": millman,
        "birth_year_element": element,
        "birth_card": birth_card,
        "n_group": n_group,
        "resonance_hexagram": hexagram,
    }


def _lookup_house_meanings(house_assignments: Dict[str, int]) -> Dict[str, str]:
    """
    Look up interpretations for each house assignment.

    Uses house_synthesis module to dynamically generate interpretations
    from knowledge base. If house meanings missing, flags for Libra generation.
    """
    return synthesize_all_houses(house_assignments)


def format_analysis_response(results: Dict) -> str:
    """
    Format analysis results as Cơ's Vietnamese response.

    In Phase 4, this will use LLM for natural synthesis.
    For now, returns structured summary.
    """
    if "error" in results:
        return f"Cơ xin lỗi: {results['error']}"

    name = results["name"]
    core = results["core_numbers"]
    arrows = results["arrow_analysis"]
    houses = results["house_assignments"]

    response = f"""Luận giải số mệnh cho {name}

Cơ đã phân tích thông tin của bạn. Đây là các chỉ số cốt lõi:

**Các chỉ số chính:**
- Đường đờ (Life Path): {core['life_path']}
- Ngày sinh (Birth Day): {core['birth_day']}
- Sứ mệnh Millman: {core['millman_compound']}
- Mệnh năm sinh: {core['birth_year_element']}
- Lá Tarot chủ đạo: {core['birth_card']} (nhóm {core['n_group']})
- Quẻ Kinh Dịch cộng hưởng: {core['resonance_hexagram']}

**Phân tích mũi tên:**
"""

    # Add arrow analysis
    arrow_names = {
        "wisdom_789": "Trí tuệ (7-8-9)",
        "willpower_456": "Ý chí (4-5-6)",
        "spiritual_357": "Tâm linh (3-5-7)",
        "planning_123": "Kế hoạch (1-2-3)",
        "focus_159": "Tập trung (1-5-9)",
        "isolation_147": "Cô lập (1-4-7)",
        "sensitivity_258": "Nhạy cảm (2-5-8)",
        "imagination_369": "Tưởng tượng (3-6-9)",
    }

    for key, label in arrow_names.items():
        if key in arrows:
            state = arrows[key]["state"]
            response += f"- {label}: {state}\n"

    response += f"\n**Bản đồ 13 ngôi nhài Tarot:**\n"
    for i in range(1, 14):
        house_key = f"H{i}"
        card = houses.get(house_key, "?")
        response += f"- {house_key}: Lá {card}\n"

    response += "\nĐể biết chi tiết luận giải từng phần, bạn hỏi Cơ nhé!"

    return response

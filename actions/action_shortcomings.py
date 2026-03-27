"""
Shortcomings Action Handler - Time-bound obstacle analysis.

Analyzes difficulties, challenges, and obstacles during a specific time period
using personal year/month calculations combined with current context.
"""

from datetime import date
from typing import Dict, Optional, Tuple

from bot.tools.calculator import (
    calculate_personal_year,
    calculate_personal_month,
    calculate_life_path,
)
from bot.tools.validators import validate_required_fields, format_period_vietnamese
from bot.progress import LifeWritingsProgress


async def handle_shortcomings(
    name: str,
    birth_date: date,
    period_start: date,
    period_end: date,
    specific_question: Optional[str] = None,
    send_progress: callable = None,
    edit_progress: Optional[callable] = None,
) -> Dict:
    """
    Handle shortcomings/obstacles analysis for a specific time period.

    Args:
        name: Person's name
        birth_date: Birth date
        period_start: Start of analysis period
        period_end: End of analysis period
        specific_question: Optional specific concern
        send_progress: Callback for progress updates
        edit_progress: Optional edit callback

    Returns:
        Analysis results dictionary
    """
    # Validate inputs
    is_valid, error = validate_required_fields(name, birth_date)
    if not is_valid:
        return {"error": error}

    # Validate period
    if period_start > period_end:
        return {"error": "Thờ gian bắt đầu phải trước thờ gian kết thúc"}

    if period_start > date.today():
        return {"error": "Chưa thể xem vận hạn cho tương lai quá xa"}

    # Initialize progress
    if send_progress:
        progress = LifeWritingsProgress(send_progress, edit_progress)
        await progress.start()

    # Calculate personal cycles for the period
    if send_progress:
        await progress.next_stage()

    cycle_analysis = _analyze_period_cycles(
        birth_date, period_start, period_end
    )

    # Identify challenging periods
    if send_progress:
        await progress.next_stage()

    challenging_periods = _identify_challenging_periods(
        birth_date, period_start, period_end, cycle_analysis
    )

    # Complete progress
    if send_progress:
        await progress.complete()

    return {
        "name": name,
        "birth_date": birth_date.strftime("%d/%m/%Y"),
        "period": {
            "start": period_start.strftime("%d/%m/%Y"),
            "end": period_end.strftime("%d/%m/%Y"),
            "formatted": format_period_vietnamese(period_start, period_end),
        },
        "personal_cycles": cycle_analysis,
        "challenging_periods": challenging_periods,
        "specific_question": specific_question,
    }


def _analyze_period_cycles(
    birth_date: date,
    period_start: date,
    period_end: date,
) -> Dict:
    """
    Calculate personal year/month cycles for the entire period.

    Returns cycle information for each month in the period.
    """
    cycles = {
        "personal_years": {},
        "personal_months": [],
        "dominant_year": None,
        "dominant_months": [],
    }

    # Get all years in period
    years = range(period_start.year, period_end.year + 1)

    for year in years:
        py = calculate_personal_year(birth_date, year)
        cycles["personal_years"][year] = py

    # Determine dominant personal year (most time spent in)
    if len(years) == 1:
        cycles["dominant_year"] = cycles["personal_years"][years[0]]
    else:
        # Count days in each year
        year_days = {}
        for year in years:
            if year == period_start.year:
                days = (date(year, 12, 31) - period_start).days + 1
            elif year == period_end.year:
                days = (period_end - date(year, 1, 1)).days + 1
            else:
                days = 365
            year_days[year] = days

        dominant_year = max(year_days, key=year_days.get)
        cycles["dominant_year"] = cycles["personal_years"][dominant_year]

    # Calculate personal months for each month in period
    current = date(period_start.year, period_start.month, 1)
    end = date(period_end.year, period_end.month, 28)  # Approximate

    while current <= end:
        pm = calculate_personal_month(birth_date, current.year, current.month)
        cycles["personal_months"].append({
            "year": current.year,
            "month": current.month,
            "personal_month": pm,
        })

        # Advance to next month
        if current.month == 12:
            current = date(current.year + 1, 1, 1)
        else:
            current = date(current.year, current.month + 1, 1)

    # Identify dominant personal months
    month_counts = {}
    for m in cycles["personal_months"]:
        pm = m["personal_month"]
        month_counts[pm] = month_counts.get(pm, 0) + 1

    cycles["dominant_months"] = sorted(
        month_counts.items(),
        key=lambda x: x[1],
        reverse=True
    )[:3]

    return cycles


def _identify_challenging_periods(
    birth_date: date,
    period_start: date,
    period_end: date,
    cycle_analysis: Dict,
) -> list:
    """
    Identify specific challenging periods based on cycle analysis.

    Uses numerology indicators of challenge:
    - Personal year 4 (hard work, obstacles)
    - Personal year 8 (karmic tests)
    - Personal month 4, 8 (intensified challenges)
    - Transitions between personal years
    """
    challenges = []

    life_path = calculate_life_path(birth_date)

    # Check personal year challenges
    for year, py in cycle_analysis["personal_years"].items():
        if py == 4:
            challenges.append({
                "type": "personal_year",
                "year": year,
                "number": py,
                "nature": "Năm xây dựng nền móng - cần kiên nhẫn và làm việc chăm chỉ",
            })
        elif py == 8:
            challenges.append({
                "type": "personal_year",
                "year": year,
                "number": py,
                "nature": "Năm kiểm tra karmic - cần cân bằng vật chất và tâm linh",
            })
        elif py == 9:
            challenges.append({
                "type": "personal_year",
                "year": year,
                "number": py,
                "nature": "Năm kết thúc chu kỳ - buông bỏ và chuẩn bị chuyển đổi",
            })

    # Check personal month challenges
    challenging_months = []
    for month_data in cycle_analysis["personal_months"]:
        pm = month_data["personal_month"]
        if pm in (4, 8):
            challenging_months.append({
                "year": month_data["year"],
                "month": month_data["month"],
                "personal_month": pm,
            })

    if challenging_months:
        challenges.append({
            "type": "personal_months",
            "months": challenging_months[:6],  # Limit to first 6
            "nature": "Các tháng có tính chất thử thách cao",
        })

    # Life path specific insights
    lp_challenges = {
        1: "Độc lập dẫn đến cô đơn, cần học cách hợp tác",
        2: "Nhạy cảm quá mức, dễ bị ảnh hưởng bởi ngườ khác",
        3: "Phân tán năng lượng, khó tập trung hoàn thành",
        4: "Cứng nhắc, khó thích nghi với thay đổi đột ngột",
        5: "Bất ổn, hay thay đổi, khó duy trì cam kết",
        6: "Gánh vác trách nhiệm quá mức, quên chăm sóc bản thân",
        7: "Cô lập bản thân, khó mở lòng với ngườ khác",
        8: "Áp lực thành công, dễ sa ngã vào vật chất",
        9: "Lý tưởng hóa, dễ thất vọng khi hiện thực khác xa",
        11: "Căng thẳng, lo âu, cần cân bằng trực giác và thực tế",
        22: "Áp lực xây dựng điều vĩ đại, dễ kiệt sức",
    }

    if life_path in lp_challenges:
        challenges.append({
            "type": "life_path_pattern",
            "life_path": life_path,
            "nature": lp_challenges[life_path],
        })

    return challenges


def format_shortcomings_response(results: Dict) -> str:
    """Format shortcomings analysis as Cơ's Vietnamese response."""
    if "error" in results:
        return f"Cơ xin lỗi: {results['error']}"

    name = results["name"]
    period = results["period"]["formatted"]
    cycles = results["personal_cycles"]
    challenges = results["challenging_periods"]

    response = f"""Phân tích vận hạn cho {name} - {period}

**Chu kỳ cá nhân trong thờ gian này:**
- Năm cá nhân chủ đạo: {cycles['dominant_year']}
- Các tháng quan trọng: {', '.join(str(m[0]) for m in cycles['dominant_months'])}

**Các thờ điểm cần lưu ý:**

"""

    for i, challenge in enumerate(challenges, 1):
        if challenge["type"] == "personal_year":
            response += f"{i}. Năm {challenge['year']} (năm số {challenge['number']}): {challenge['nature']}\n\n"
        elif challenge["type"] == "personal_months":
            response += f"{i}. Các tháng số {challenge['months'][0]['personal_month']} cần đặc biệt chú ý:\n"
            for m in challenge["months"][:4]:
                response += f"   - Tháng {m['month']}/{m['year']}\n"
            response += f"\n   {challenge['nature']}\n\n"
        elif challenge["type"] == "life_path_pattern":
            response += f"{i}. Theo đường đờ số {challenge['life_path']}: {challenge['nature']}\n\n"

    response += "\nBạn muốn Cơ phân tích sâu hơn về điểm nào?"

    return response

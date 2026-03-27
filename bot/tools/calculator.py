"""
Numerology calculation functions for Co divination system.

This module provides pure functions for:
- Pythagorean numerology (Life Path, Birth Day, etc.)
- Millman Life Purpose System (compound paths)
- Arrow analysis (mũi tên) from birth chart
- 13-house Tarot mandala calculations
- Personal year/month calculations
"""

from datetime import date
from typing import Dict, List, Set, Tuple


# =============================================================================
# Core Numerology Calculations
# =============================================================================

def calculate_life_path(birth_date: date) -> int:
    """
    Calculate Pythagorean Life Path number.
    Sum all digits of birth date, reduce to single digit or master number (11, 22, 33).

    Example: 1990-03-15 -> 1+9+9+0+0+3+1+5 = 28 -> 2+8 = 10 -> 1+0 = 1
    """
    digit_sum = sum(int(d) for d in birth_date.strftime("%Y%m%d"))

    while digit_sum > 9 and digit_sum not in (11, 22, 33):
        digit_sum = sum(int(d) for d in str(digit_sum))

    return digit_sum


def calculate_millman_compound(birth_date: date) -> str:
    """
    Calculate Millman Life Purpose compound path.
    Format: original_sum/final_sum or original_sum/intermediate/final

    Example: 1990-03-15 -> 28 -> 10 -> 1 = "28/10/1"
             1985-08-08 -> 30 -> 3 = "30/3"
    """
    digit_sum = sum(int(d) for d in birth_date.strftime("%Y%m%d"))

    parts = [digit_sum]
    current = digit_sum

    while current > 9:
        current = sum(int(d) for d in str(current))
        parts.append(current)

    return "/".join(str(p) for p in parts)


def calculate_birth_day_number(day: int) -> int:
    """
    Calculate Birth Day number.
    Reduce day to single digit or master number (11, 22).

    Example: 15 -> 6, 29 -> 11 (master), 22 -> 22 (master)
    """
    if day in (11, 22):
        return day

    while day > 9:
        day = sum(int(d) for d in str(day))

    return day


def calculate_birth_year_element(year: int) -> str:
    """
    Calculate birth year element based on last digit.

    0, 1 -> Kim (Metal)
    2, 3 -> Thuy (Water)
    4, 5 -> Moc (Wood)
    6, 7 -> Hoa (Fire)
    8, 9 -> Tho (Earth)
    """
    last_digit = year % 10

    if last_digit in (0, 1):
        return "Kim"
    elif last_digit in (2, 3):
        return "Thuy"
    elif last_digit in (4, 5):
        return "Moc"
    elif last_digit in (6, 7):
        return "Hoa"
    else:
        return "Tho"


def calculate_four_peaks(birth_date: date, life_path: int) -> Dict:
    """
    Calculate Four Peaks (Tứ Đỉnh Cao) with year ranges.

    Peak 1: birth_month + birth_day -> from birth year to (birth_year + 36 - LP - 1)
    Peak 2: birth_day + birth_year -> next 9 years
    Peak 3: Peak1 + Peak2 -> next 9 years
    Peak 4: birth_month + birth_year -> rest of life

    Returns dict with peak numbers and year ranges.
    """
    birth_month = birth_date.month
    birth_day = calculate_birth_day_number(birth_date.day)
    birth_year = sum(int(d) for d in str(birth_date.year))

    while birth_year > 9:
        birth_year = sum(int(d) for d in str(birth_year))

    # Calculate peak numbers
    peak1_num = birth_month + birth_day
    while peak1_num > 9:
        peak1_num = sum(int(d) for d in str(peak1_num))

    peak2_num = birth_day + birth_year
    while peak2_num > 9:
        peak2_num = sum(int(d) for d in str(peak2_num))

    peak3_num = peak1_num + peak2_num
    while peak3_num > 9:
        peak3_num = sum(int(d) for d in str(peak3_num))

    peak4_num = birth_month + birth_year
    while peak4_num > 9:
        peak4_num = sum(int(d) for d in str(peak4_num))

    # Calculate year ranges
    birth_year_full = birth_date.year

    peak1_end = birth_year_full + 36 - life_path - 1
    peak2_start = peak1_end + 1
    peak2_end = peak2_start + 8
    peak3_start = peak2_end + 1
    peak3_end = peak3_start + 8
    peak4_start = peak3_end + 1

    return {
        "peak1": {"number": peak1_num, "start_year": birth_year_full, "end_year": peak1_end},
        "peak2": {"number": peak2_num, "start_year": peak2_start, "end_year": peak2_end},
        "peak3": {"number": peak3_num, "start_year": peak3_start, "end_year": peak3_end},
        "peak4": {"number": peak4_num, "start_year": peak4_start, "end_year": None},  # Rest of life
    }


def calculate_tarot_birth_card(life_path: int) -> int:
    """
    Map Life Path number to Major Arcana birth card.

    1 -> 1 (Magician)
    2 -> 2 (High Priestess)
    ...
    9 -> 9 (Hermit)
    10 -> 1 (Wheel/Magician)
    11 -> 11 (Justice)
    22 -> 0 (Fool)
    """
    if life_path == 22:
        return 0  # The Fool
    elif life_path == 11:
        return 11  # Justice
    elif life_path > 9:
        return calculate_tarot_birth_card(sum(int(d) for d in str(life_path)))
    else:
        return life_path


def get_tarot_n_group(card_number: int) -> str:
    """
    Return N-group classification for Tarot card.

    N1 (Trí Tuệ Nội Tâm): 2, 5, 9, 21
    N2 (Bóng Tối/Biến Đổi): 12, 13, 15, 17, 18
    N3 (Cân Bằng/Ánh Sáng): 14, 19
    N4 (Hành Động/Kiến Tạo): 1, 3, 4, 6, 7, 8, 16
    N5 (Vận Mệnh/Chu Kỳ): 0, 10, 11, 20
    """
    n_groups = {
        "N1": {2, 5, 9, 21},
        "N2": {12, 13, 15, 17, 18},
        "N3": {14, 19},
        "N4": {1, 3, 4, 6, 7, 8, 16},
        "N5": {0, 10, 11, 20},
    }

    for group, cards in n_groups.items():
        if card_number in cards:
            return group

    return "N/A"


def get_resonance_hexagram(life_path: int) -> int:
    """
    Map Life Path to I-Ching resonance hexagram.

    LP1 -> 1 (Càn)
    LP2 -> 2 (Khôn)
    LP3 -> 3 (Truân)
    LP4 -> 17 (Tùy)
    LP5 -> 29 (Khảm)
    LP6 -> 47 (Khốn)
    LP7 -> 52 (Cấn)
    LP8 -> 7 (Sư)
    LP9 -> 64 (Vị Tế)
    LP11 -> 11 (Thái)
    LP22 -> 36 (Minh Di)
    """
    mapping = {
        1: 1, 2: 2, 3: 3, 4: 17, 5: 29, 6: 47, 7: 52, 8: 7, 9: 64,
        11: 11, 22: 36
    }

    # For other numbers, reduce to single digit
    if life_path > 9 and life_path not in (11, 22):
        reduced = sum(int(d) for d in str(life_path))
        return mapping.get(reduced, 1)

    return mapping.get(life_path, 1)


# =============================================================================
# Arrow Analysis (Mũi Tên)
# =============================================================================

def get_birth_date_digits(birth_date: date) -> Set[int]:
    """
    Extract unique digits from birth date (DDMMYYYY format).

    Example: 1990-03-15 -> {0, 1, 3, 5, 9}
    """
    digits = set()
    for digit in birth_date.strftime("%d%m%Y"):
        digits.add(int(digit))
    return digits


def analyze_arrows(birth_date: date) -> Dict:
    """
    Analyze all 8 arrows from birth date digits.

    Returns dict with arrow states:
    - "thick": all 3 digits present (strong)
    - "thin": 1-2 digits present (moderate)
    - "missing": no digits present (challenge for challenge arrows)

    Strength arrows: 789, 456, 357, 123, 159
    Challenge arrows: 147, 258, 369 (missing = challenge)
    """
    digits = get_birth_date_digits(birth_date)

    def get_state(arrow_digits: Tuple[int, ...]) -> Dict:
        count = sum(1 for d in arrow_digits if d in digits)
        if count == 3:
            return {"state": "thick", "count": count}
        elif count >= 1:
            return {"state": "thin", "count": count}
        else:
            return {"state": "missing", "count": 0}

    # Strength arrows
    wisdom = get_state((7, 8, 9))
    willpower = get_state((4, 5, 6))
    spiritual = get_state((3, 5, 7))
    planning = get_state((1, 2, 3))
    focus = get_state((1, 5, 9))

    # Challenge arrows (missing = challenge)
    isolation = get_state((1, 4, 7))
    sensitivity = get_state((2, 5, 8))
    imagination = get_state((3, 6, 9))

    return {
        "wisdom_789": wisdom,
        "willpower_456": willpower,
        "spiritual_357": spiritual,
        "planning_123": planning,
        "focus_159": focus,
        "isolation_147": {
            "state": "present" if isolation["count"] > 0 else "missing",
            "missing": isolation["count"] == 0,
            "count": isolation["count"]
        },
        "sensitivity_258": {
            "state": "present" if sensitivity["count"] > 0 else "missing",
            "missing": sensitivity["count"] == 0,
            "count": sensitivity["count"]
        },
        "imagination_369": {
            "state": "present" if imagination["count"] > 0 else "missing",
            "missing": imagination["count"] == 0,
            "count": imagination["count"]
        },
    }


def interpret_arrow(arrow_name: str, state: str) -> str:
    """
    Return Vietnamese interpretation of arrow state.

    This is a helper function - full interpretations should come from knowledge base.
    """
    interpretations = {
        "wisdom_789": {
            "thick": "Trí tuệ sắc bén, tư duy logic mạnh mẽ",
            "thin": "Có khả năng tư duy nhưng cần rèn luyện thêm",
            "missing": "Cần phát triển tư duy phân tích và học hỏi",
        },
        "willpower_456": {
            "thick": "Ý chí kiên cường, quyết tâm cao độ",
            "thin": "Có ý chí nhưng dễ dao động",
            "missing": "Cần xây dựng quyết tâm và kiên trì",
        },
        "spiritual_357": {
            "thick": "Trực giác nhạy bén, kết nối tâm linh sâu sắc",
            "thin": "Có trực giác nhưng cần lắng nghe nhiều hơn",
            "missing": "Cần phát triển khả năng cảm nhận bên trong",
        },
        "planning_123": {
            "thick": "Khả năng lập kế hoạch và tổ chức xuất sắc",
            "thin": "Có thể lập kế hoạch nhưng cần cấu trúc hơn",
            "missing": "Cần học cách lập kế hoạch bài bản",
        },
        "focus_159": {
            "thick": "Tập trung cao độ, định hướng rõ ràng",
            "thin": "Có thể tập trung nhưng dễ phân tán",
            "missing": "Cần rèn luyện khả năng tập trung",
        },
        "isolation_147": {
            "present": "Khả năng kết nối tốt với thế giới bên ngoài",
            "missing": "Thách thức: Có xu hướng cô lập, cần học cách mở lòng",
        },
        "sensitivity_258": {
            "present": "Cân bằng cảm xúc và trực giác tốt",
            "missing": "Thách thức: Dễ bị tổn thương, cần xây dựng ranh giới cảm xúc",
        },
        "imagination_369": {
            "present": "Trí tưởng tượng phong phú, sáng tạo",
            "missing": "Thách thức: Có thể quá thực tế, cần phát triển sáng tạo",
        },
    }

    return interpretations.get(arrow_name, {}).get(state, "")


# =============================================================================
# 13-House Tarot Mandala
# =============================================================================

def calculate_house_assignments(birth_date: date, life_path: int) -> Dict:
    """
    Calculate Tarot card assignments for 13-house mandala.

    H1: Life path + birth year element
    H2: Early karma (based on birth day)
    H3: First half potential
    H4: Second half destiny
    H5: Shadow/soul (complement of H1)
    H6-H11: Six crossroads (calculated from peaks)
    H12: Final destination
    H13: Consequences/karmic result

    Returns dict with house assignments (H1-H13 as keys).
    """
    birth_day = birth_date.day
    birth_month = birth_date.month
    birth_year = birth_date.year

    # Get birth card from life path
    birth_card = calculate_tarot_birth_card(life_path)

    # H1: Life/Destiny - based on birth card and element
    element = calculate_birth_year_element(birth_year)
    element_modifiers = {"Kim": 0, "Thuy": 1, "Moc": 2, "Hoa": 3, "Tho": 4}
    h1 = ((birth_card + element_modifiers.get(element, 0)) % 22)
    if h1 == 0:
        h1 = 22

    # H2: Early karma/Hổ - based on birth day
    h2 = ((birth_day % 22) if birth_day <= 22 else calculate_birth_day_number(birth_day))
    if h2 == 0:
        h2 = 22

    # H3: First half potential (Tiền Vận)
    h3 = ((life_path + birth_month) % 22)
    if h3 == 0:
        h3 = 22

    # H4: Second half destiny (Hậu Vận)
    h4 = ((life_path + birth_day) % 22)
    if h4 == 0:
        h4 = 22

    # H5: Shadow/Soul (Bóng Lưng) - complement of H1
    h5 = 22 - h1 if h1 <= 21 else 1
    if h5 == 0:
        h5 = 22

    # Calculate peaks for H6-H11
    peaks = calculate_four_peaks(birth_date, life_path)

    # H6-H11: Six crossroads (Ngã Tư)
    crossroads = []
    peak_nums = [
        peaks["peak1"]["number"],
        peaks["peak2"]["number"],
        peaks["peak3"]["number"],
        peaks["peak4"]["number"],
        (peaks["peak1"]["number"] + peaks["peak3"]["number"]) % 9 or 9,
        (peaks["peak2"]["number"] + peaks["peak4"]["number"]) % 9 or 9,
    ]

    for i, num in enumerate(peak_nums[:6]):
        crossroad = (num + birth_card + i) % 22
        if crossroad == 0:
            crossroad = 22
        crossroads.append(crossroad)

    # H12: Final destination (Đích)
    h12 = sum(crossroads) % 22
    if h12 == 0:
        h12 = 22

    # H13: Consequences (Hậu Quả) - synthesis of all houses
    all_houses = [h1, h2, h3, h4, h5] + crossroads + [h12]
    h13 = sum(all_houses) % 22
    if h13 == 0:
        h13 = 22

    return {
        "H1": h1,
        "H2": h2,
        "H3": h3,
        "H4": h4,
        "H5": h5,
        "H6": crossroads[0],
        "H7": crossroads[1],
        "H8": crossroads[2],
        "H9": crossroads[3],
        "H10": crossroads[4],
        "H11": crossroads[5],
        "H12": h12,
        "H13": h13,
    }


# =============================================================================
# Personal Year/Month Calculations
# =============================================================================

def calculate_personal_year(birth_date: date, year: int) -> int:
    """
    Calculate Personal Year number.
    Formula: birth_day + birth_month + current_year, then reduce

    Example: born 15/03, current year 2026 -> 15 + 3 + 2026 = 2044 -> 2+0+4+4 = 10 -> 1
    """
    total = birth_date.day + birth_date.month + year

    while total > 9:
        total = sum(int(d) for d in str(total))

    return total


def calculate_personal_month(birth_date: date, year: int, month: int) -> int:
    """
    Calculate Personal Month number.
    Formula: personal_year + month, then reduce
    """
    py = calculate_personal_year(birth_date, year)
    total = py + month

    while total > 9:
        total = sum(int(d) for d in str(total))

    return total


# =============================================================================
# Birth Chart Grid
# =============================================================================

def calculate_birth_chart_counts(birth_date: date) -> Dict[int, int]:
    """
    Calculate digit counts for birth chart (3x3 grid).

    Returns dict: {digit: count}
    Example: 15/03/1990 -> {0: 2, 1: 2, 3: 1, 5: 1, 9: 2}
    """
    counts = {i: 0 for i in range(1, 10)}  # 1-9 only

    for digit in birth_date.strftime("%d%m%Y"):
        d = int(digit)
        if d > 0:  # Skip 0 for Pythagorean chart
            counts[d] = counts.get(d, 0) + 1

    return counts


def calculate_full_chart_counts(birth_date: date, full_name: str) -> Dict[int, int]:
    """
    Calculate digit counts including name (Pythagorean values).

    This is a placeholder - full implementation requires name-numerology mapping.
    """
    # Start with birth date counts
    counts = calculate_birth_chart_counts(birth_date)

    # TODO: Add name numerology calculation
    # A=1, B=2, C=3, etc. for each letter in full_name

    return counts


# =============================================================================
# Test Cases
# =============================================================================

if __name__ == "__main__":
    # Test life path calculations
    test_date = date(1990, 3, 15)

    print(f"Test date: {test_date}")
    print(f"Life Path: {calculate_life_path(test_date)}")  # Should be 1
    print(f"Millman: {calculate_millman_compound(test_date)}")  # Should be "28/10/1"
    print(f"Birth Day: {calculate_birth_day_number(15)}")  # Should be 6
    print(f"Element: {calculate_birth_year_element(1990)}")  # Should be "Kim"
    print(f"Birth Card: {calculate_tarot_birth_card(1)}")  # Should be 1
    print(f"N-Group: {get_tarot_n_group(1)}")  # Should be "N4"
    print(f"Resonance Hexagram: {get_resonance_hexagram(1)}")  # Should be 1

    # Test arrows
    arrows = analyze_arrows(test_date)
    print(f"\nArrows: {arrows}")

    # Test peaks
    peaks = calculate_four_peaks(test_date, 1)
    print(f"\nPeaks: {peaks}")

    # Test houses
    houses = calculate_house_assignments(test_date, 1)
    print(f"\nHouses: {houses}")

    # Test personal year
    py = calculate_personal_year(test_date, 2026)
    print(f"\nPersonal Year 2026: {py}")

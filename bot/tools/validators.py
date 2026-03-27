"""
Input validation and parsing utilities for Co divination system.

This module provides:
- Date parsing with DD/MM/YYYY format assumption
- Time period validation for shortcomings analysis
- Name validation and normalization
- Input sanitization
"""

import re
from datetime import date, datetime
from typing import Optional, Tuple, Union


# =============================================================================
# Date Parsing (DD/MM/YYYY format as default)
# =============================================================================

def parse_birth_date(date_input: str) -> Optional[date]:
    """
    Parse birth date from various input formats.
    Assumes DD/MM/YYYY format when ambiguous (Vietnamese convention).

    Accepts:
    - DD/MM/YYYY (e.g., 15/03/1990)
    - DD-MM-YYYY (e.g., 15-03-1990)
    - DD.MM.YYYY (e.g., 15.03.1990)
    - YYYY/MM/DD (detected by 4-digit first component)
    - Natural language: "15 tháng 3 năm 1990", "ngày 15 tháng 3"

    Returns:
        date object or None if parsing fails
    """
    if not date_input or not isinstance(date_input, str):
        return None

    date_input = date_input.strip().lower()

    # Try natural language patterns first
    natural_result = _parse_vietnamese_date(date_input)
    if natural_result:
        return natural_result

    # Normalize separators
    normalized = re.sub(r'[-.]', '/', date_input)

    # Try DD/MM/YYYY format (Vietnamese standard)
    parsed = _try_parse_ddmmyyyy(normalized)
    if parsed:
        return parsed

    # Try YYYY/MM/DD format (detected by 4-digit year first)
    parsed = _try_parse_yyyymmdd(normalized)
    if parsed:
        return parsed

    return None


def _try_parse_ddmmyyyy(date_str: str) -> Optional[date]:
    """Try parsing DD/MM/YYYY format."""
    match = re.match(r'^(\d{1,2})/(\d{1,2})/(\d{4})$', date_str)
    if not match:
        return None

    try:
        day = int(match.group(1))
        month = int(match.group(2))
        year = int(match.group(3))

        # Basic validation
        if not (1 <= month <= 12 and 1 <= day <= 31):
            return None
        if not (1900 <= year <= 2100):
            return None

        return date(year, month, day)
    except ValueError:
        return None


def _try_parse_yyyymmdd(date_str: str) -> Optional[date]:
    """Try parsing YYYY/MM/DD format."""
    match = re.match(r'^(\d{4})/(\d{1,2})/(\d{1,2})$', date_str)
    if not match:
        return None

    try:
        year = int(match.group(1))
        month = int(match.group(2))
        day = int(match.group(3))

        # Basic validation
        if not (1 <= month <= 12 and 1 <= day <= 31):
            return None
        if not (1900 <= year <= 2100):
            return None

        return date(year, month, day)
    except ValueError:
        return None


def _parse_vietnamese_date(date_str: str) -> Optional[date]:
    """
    Parse Vietnamese natural language date formats.

    Patterns:
    - "15 tháng 3 năm 1990"
    - "ngày 15 tháng 3"
    - "15/3/1990"
    - "15-3-1990"
    """
    # Pattern: "X tháng Y năm Z" or "ngày X tháng Y năm Z"
    pattern1 = re.search(
        r'(?:ngày\s+)?(\d{1,2})\s+tháng\s+(\d{1,2})(?:\s+năm\s+(\d{4}))?',
        date_str
    )
    if pattern1:
        try:
            day = int(pattern1.group(1))
            month = int(pattern1.group(2))
            year_str = pattern1.group(3)

            if year_str:
                year = int(year_str)
            else:
                # Default to current year if not specified
                year = datetime.now().year

            if 1 <= day <= 31 and 1 <= month <= 12 and 1900 <= year <= 2100:
                return date(year, month, day)
        except ValueError:
            pass

    # Pattern: "15/3/1990" or "15-3-1990" (short year)
    pattern2 = re.match(r'^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$', date_str)
    if pattern2:
        try:
            day = int(pattern2.group(1))
            month = int(pattern2.group(2))
            year = int(pattern2.group(3))

            if 1 <= day <= 31 and 1 <= month <= 12 and 1900 <= year <= 2100:
                return date(year, month, day)
        except ValueError:
            pass

    return None


def format_date_vietnamese(d: date) -> str:
    """Format date in Vietnamese style: DD/MM/YYYY."""
    return d.strftime("%d/%m/%Y")


def format_date_verbose_vietnamese(d: date) -> str:
    """Format date in verbose Vietnamese: ngày DD tháng MM năm YYYY."""
    return f"ngày {d.day} tháng {d.month} năm {d.year}"


# =============================================================================
# Time Period Parsing (for shortcomings analysis)
# =============================================================================

def parse_time_period(period_input: str) -> Optional[Tuple[date, date]]:
    """
    Parse time period for shortcomings analysis.

    Accepts:
    - "tháng 3/2024" -> March 2024
    - "3/2024" -> March 2024
    - "quý 1/2024" -> Q1 2024
    - "năm 2024" -> Year 2024
    - "từ 15/03/2024 đến 15/04/2024" -> date range
    - "15/03/2024 - 15/04/2024" -> date range

    Returns:
        Tuple of (start_date, end_date) or None if parsing fails
    """
    if not period_input or not isinstance(period_input, str):
        return None

    period_input = period_input.strip().lower()

    # Try month format: "tháng 3/2024" or "3/2024"
    month_match = re.match(
        r'(?:tháng\s+)?(\d{1,2})[/\-](\d{4})$',
        period_input
    )
    if month_match:
        return _month_to_range(int(month_match.group(1)), int(month_match.group(2)))

    # Try quarter format: "quý 1/2024"
    quarter_match = re.match(r'quý\s+(\d)[/\-](\d{4})$', period_input)
    if quarter_match:
        return _quarter_to_range(int(quarter_match.group(1)), int(quarter_match.group(2)))

    # Try year format: "năm 2024" or "2024"
    year_match = re.match(r'(?:năm\s+)?(\d{4})$', period_input)
    if year_match:
        year = int(year_match.group(1))
        return (date(year, 1, 1), date(year, 12, 31))

    # Try date range formats
    range_patterns = [
        # "từ 15/03/2024 đến 15/04/2024"
        r'từ\s+(.+?)\s+(?:đến|tới)\s+(.+)',
        # "15/03/2024 - 15/04/2024"
        r'(.+?)\s*[-–]\s*(.+)',
    ]

    for pattern in range_patterns:
        range_match = re.search(pattern, period_input)
        if range_match:
            start = parse_birth_date(range_match.group(1).strip())
            end = parse_birth_date(range_match.group(2).strip())
            if start and end:
                return (start, end)

    return None


def _month_to_range(month: int, year: int) -> Optional[Tuple[date, date]]:
    """Convert month/year to date range."""
    try:
        from calendar import monthrange
        last_day = monthrange(year, month)[1]
        return (date(year, month, 1), date(year, month, last_day))
    except ValueError:
        return None


def _quarter_to_range(quarter: int, year: int) -> Optional[Tuple[date, date]]:
    """Convert quarter/year to date range."""
    if not 1 <= quarter <= 4:
        return None

    start_month = (quarter - 1) * 3 + 1
    end_month = start_month + 2

    from calendar import monthrange
    last_day = monthrange(year, end_month)[1]

    return (date(year, start_month, 1), date(year, end_month, last_day))


def format_period_vietnamese(start: date, end: date) -> str:
    """Format a date period in Vietnamese."""
    if start.year == end.year and start.month == end.month:
        return f"tháng {start.month}/{start.year}"
    elif start.year == end.year:
        return f"từ {start.day}/{start.month} đến {end.day}/{end.month}/{end.year}"
    else:
        return f"từ {format_date_vietnamese(start)} đến {format_date_vietnamese(end)}"


# =============================================================================
# Name Validation and Normalization
# =============================================================================

def normalize_name(name: str) -> str:
    """
    Normalize a Vietnamese name for storage and processing.

    - Strips extra whitespace
    - Title cases each word
    - Removes special characters
    """
    if not name or not isinstance(name, str):
        return ""

    # Remove extra whitespace and special characters
    name = re.sub(r'\s+', ' ', name.strip())
    name = re.sub(r'[^\w\s\-]', '', name)

    # Title case each word
    words = name.split()
    normalized = ' '.join(word.capitalize() for word in words)

    return normalized


def validate_name(name: str) -> Tuple[bool, Optional[str]]:
    """
    Validate a name input.

    Returns:
        Tuple of (is_valid, error_message)
    """
    if not name or not isinstance(name, str):
        return False, "Vui lòng cung cấp tên"

    name = name.strip()

    if len(name) < 2:
        return False, "Tên quá ngắn"

    if len(name) > 100:
        return False, "Tên quá dài"

    # Check for at least one letter
    if not re.search(r'[a-zA-Z\u00C0-\u1EF9]', name):
        return False, "Tên cần có ít nhất một chữ cái"

    return True, None


# =============================================================================
# Input Sanitization
# =============================================================================

def sanitize_input(text: str, max_length: int = 4000) -> str:
    """
    Sanitize user input for safe processing.

    - Trims whitespace
    - Limits length
    - Removes control characters
    """
    if not text or not isinstance(text, str):
        return ""

    # Remove control characters except newlines and tabs
    text = re.sub(r'[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F]', '', text)

    # Trim whitespace
    text = text.strip()

    # Limit length
    if len(text) > max_length:
        text = text[:max_length].rsplit(' ', 1)[0] + "..."

    return text


def extract_birth_info(text: str) -> Tuple[Optional[str], Optional[date]]:
    """
    Extract name and birth date from combined input.

    Common patterns:
    - "Nguyễn Văn A, 15/03/1990"
    - "Tôi tên B, sinh ngày 15/03/1990"
    - "15/03/1990 - Nguyễn Văn A"

    Returns:
        Tuple of (name_or_none, date_or_None)
    """
    text = sanitize_input(text)

    # Look for date patterns first
    date_patterns = [
        # DD/MM/YYYY
        r'(\d{1,2}[/-]\d{1,2}[/-]\d{4})',
        # Natural language
        r'(?:ngày\s+)?(\d{1,2}\s+tháng\s+\d{1,2}(?:\s+năm\s+\d{4})?)',
    ]

    found_date = None
    date_str = None

    for pattern in date_patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            date_str = match.group(1)
            found_date = parse_birth_date(date_str)
            if found_date:
                break

    # Remove the date part to get the name
    name = text
    if date_str:
        name = name.replace(date_str, '')

    # Clean up name
    name = re.sub(r'^(?:tôi\s+tên|tên\s+tôi\s+là|[\s,\-–])+', '', name, flags=re.IGNORECASE)
    name = re.sub(r'[\s,\-–]+$', '', name)
    name = re.sub(r'\s+', ' ', name).strip()

    # Validate name
    is_valid, _ = validate_name(name)
    if not is_valid:
        name = None

    return (name if name else None, found_date)


# =============================================================================
# Convenience Functions
# =============================================================================

def parse_age(age_input: str) -> Optional[int]:
    """
    Parse age from various input formats.

    Accepts:
    - "25 tuổi"
    - "25"
    - "năm nay 25 tuổi"
    """
    if not age_input:
        return None

    match = re.search(r'\b(\d{1,3})\s*(?:tuổi|t)?\b', age_input.lower())
    if match:
        age = int(match.group(1))
        if 0 < age < 150:
            return age

    return None


def validate_required_fields(
    name: Optional[str],
    birth_date: Optional[date],
    require_name: bool = True
) -> Tuple[bool, Optional[str]]:
    """
    Validate that required fields are present for numerology analysis.

    Returns:
        Tuple of (is_valid, error_message_in_vietnamese)
    """
    if require_name and not name:
        return False, "Cơ cần biết tên của bạn để phân tích. Vui lòng cho Cơ biết tên nhé!"

    if not birth_date:
        return False, "Cơ cần biết ngày sinh (DD/MM/YYYY) để tính toán. Vui lòng cung cấp ngày sinh nhé!"

    # Validate date is not in the future
    if birth_date > date.today():
        return False, "Ngày sinh không thể trong tương lai. Vui lòng kiểm tra lại!"

    # Validate reasonable birth date (not too old)
    if birth_date.year < 1900:
        return False, "Ngày sinh quá xa trong quá khứ. Vui lòng kiểm tra lại!"

    return True, None


# =============================================================================
# Test Cases
# =============================================================================

if __name__ == "__main__":
    # Test date parsing
    test_dates = [
        "15/03/1990",
        "15-03-1990",
        "1990/03/15",
        "15 tháng 3 năm 1990",
        "ngày 15 tháng 3",
        "15/3/1990",
    ]

    print("Date parsing tests:")
    for d in test_dates:
        result = parse_birth_date(d)
        print(f"  '{d}' -> {result}")

    # Test period parsing
    test_periods = [
        "tháng 3/2024",
        "3/2024",
        "quý 1/2024",
        "năm 2024",
        "2024",
        "từ 15/03/2024 đến 15/04/2024",
        "15/03/2024 - 15/04/2024",
    ]

    print("\nPeriod parsing tests:")
    for p in test_periods:
        result = parse_time_period(p)
        if result:
            print(f"  '{p}' -> {format_period_vietnamese(result[0], result[1])}")
        else:
            print(f"  '{p}' -> None")

    # Test name extraction
    test_inputs = [
        "Nguyễn Văn A, 15/03/1990",
        "Tôi tên B, sinh ngày 15/03/1990",
        "15/03/1990 - Nguyễn Văn A",
        "Tôi sinh ngày 15/03/1990",
    ]

    print("\nBirth info extraction tests:")
    for inp in test_inputs:
        name, birth = extract_birth_info(inp)
        print(f"  '{inp}'")
        print(f"    -> Name: {name}, Date: {birth}")


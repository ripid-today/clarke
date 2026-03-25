"""
PDF generation for Co's deep life analysis reports.
Uses reportlab with Unicode TTF font for Vietnamese text.
Returns bytes suitable for Telegram send_document().
"""
from __future__ import annotations
import io
import os
from pathlib import Path
from datetime import datetime

from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import cm
from reportlab.lib.colors import HexColor
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, HRFlowable,
    Table, TableStyle, PageBreak,
)
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_JUSTIFY
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

# ---------------------------------------------------------------------------
# Font registration — use DejaVu Sans which supports Vietnamese Unicode
# Check common locations for DejaVu fonts
# ---------------------------------------------------------------------------

FONT_NAME = "DejaVuSans"
FONT_BOLD = "DejaVuSans-Bold"

_FONT_SEARCH_PATHS = [
    Path("C:/Windows/Fonts"),
    Path(os.environ.get("LOCALAPPDATA", ""), "Microsoft/Windows/Fonts"),
    Path(__file__).parent.parent.parent / "fonts",  # project fonts dir
]

_FONT_CANDIDATES = {
    FONT_NAME: ["DejaVuSans.ttf", "arial.ttf", "Arial.ttf", "segoeui.ttf"],
    FONT_BOLD: ["DejaVuSans-Bold.ttf", "arialbd.ttf", "ArialBD.ttf", "seguisb.ttf"],
}


def _register_fonts() -> str:
    """Register a Unicode-capable font. Returns the base font name."""
    for name, candidates in _FONT_CANDIDATES.items():
        for search_dir in _FONT_SEARCH_PATHS:
            for candidate in candidates:
                path = Path(search_dir) / candidate
                if path.exists():
                    try:
                        pdfmetrics.registerFont(TTFont(name, str(path)))
                        break
                    except Exception:
                        continue

    # Check if registration succeeded; fallback to Helvetica if not
    try:
        pdfmetrics.getFont(FONT_NAME)
        return FONT_NAME
    except Exception:
        return "Helvetica"


_BASE_FONT = None


def _get_font() -> str:
    global _BASE_FONT
    if _BASE_FONT is None:
        _BASE_FONT = _register_fonts()
    return _BASE_FONT


# ---------------------------------------------------------------------------
# Colors
# ---------------------------------------------------------------------------

COLOR_GOLD = HexColor("#C9A84C")
COLOR_DARK = HexColor("#2C2C2C")
COLOR_ACCENT = HexColor("#6B4226")
COLOR_LIGHT_BG = HexColor("#FAF6F0")
COLOR_SEPARATOR = HexColor("#D4AF7A")


# ---------------------------------------------------------------------------
# Style factory
# ---------------------------------------------------------------------------

def _make_styles(font: str) -> dict:
    bold = font + "-Bold" if font != "Helvetica" else "Helvetica-Bold"
    styles = {}

    styles["title"] = ParagraphStyle(
        "title",
        fontName=bold,
        fontSize=22,
        textColor=COLOR_GOLD,
        alignment=TA_CENTER,
        spaceAfter=6,
        spaceBefore=12,
    )
    styles["subtitle"] = ParagraphStyle(
        "subtitle",
        fontName=font,
        fontSize=12,
        textColor=COLOR_ACCENT,
        alignment=TA_CENTER,
        spaceAfter=20,
    )
    styles["heading"] = ParagraphStyle(
        "heading",
        fontName=bold,
        fontSize=14,
        textColor=COLOR_ACCENT,
        spaceBefore=16,
        spaceAfter=6,
        borderPad=4,
    )
    styles["body"] = ParagraphStyle(
        "body",
        fontName=font,
        fontSize=11,
        textColor=COLOR_DARK,
        leading=16,
        alignment=TA_JUSTIFY,
        spaceAfter=8,
    )
    styles["quote"] = ParagraphStyle(
        "quote",
        fontName=font,
        fontSize=10,
        textColor=COLOR_ACCENT,
        leftIndent=20,
        rightIndent=20,
        leading=14,
        spaceAfter=8,
    )
    styles["footer"] = ParagraphStyle(
        "footer",
        fontName=font,
        fontSize=8,
        textColor=HexColor("#888888"),
        alignment=TA_CENTER,
    )
    return styles


# ---------------------------------------------------------------------------
# Public API
# ---------------------------------------------------------------------------

def _parse_table_lines(lines: list[str]) -> list[list[str]]:
    """Parse accumulated markdown table lines into a list of rows (each row is a list of cell strings).
    Separator rows (|---|---|) are skipped."""
    rows = []
    for line in lines:
        stripped = line.strip()
        inner = stripped.strip("|")
        if all(c in "-: |" for c in inner):
            continue
        cells = [c.strip() for c in stripped.strip("|").split("|")]
        rows.append(cells)
    return rows


def _parse_narrative_md(narrative_md: str) -> list[dict]:
    """
    Parse a markdown narrative into sections for PDF rendering.
    Lines starting with '## ' become headings.
    Pipe-delimited blocks become table items; other lines become text items.
    Returns list of {"heading": str, "items": [{"type": "text"/"table", ...}]}.
    """
    sections: list[dict] = []
    current_heading = ""
    current_items: list[dict] = []
    current_text_lines: list[str] = []
    table_lines: list[str] = []
    in_table = False

    def flush_text():
        nonlocal current_text_lines
        joined = "\n".join(current_text_lines)
        for p in joined.split("\n\n"):
            p = p.strip()
            if p:
                current_items.append({"type": "text", "text": p})
        current_text_lines.clear()

    def flush_table():
        nonlocal table_lines, in_table
        if table_lines:
            rows = _parse_table_lines(table_lines)
            if rows:
                current_items.append({"type": "table", "rows": rows})
        table_lines.clear()
        in_table = False

    def flush_section():
        nonlocal current_heading, current_items
        flush_text()
        flush_table()
        if current_items or current_heading:
            sections.append({"heading": current_heading, "items": current_items[:]})
        current_heading = ""
        current_items.clear()

    for line in narrative_md.splitlines():
        if line.startswith("## "):
            flush_text()
            flush_table()
            flush_section()
            current_heading = line[3:].strip()
        elif line.startswith("### "):
            if in_table:
                flush_table()
            current_text_lines.append(f"**{line[4:].strip()}**")
        elif line.startswith("---"):
            pass
        elif line.strip().startswith("|"):
            if not in_table:
                flush_text()
                in_table = True
            table_lines.append(line)
        else:
            if in_table:
                flush_table()
            current_text_lines.append(line)

    flush_text()
    flush_table()
    flush_section()
    return sections


def _render_table(rows: list[list[str]], styles: dict, font: str, bold_font: str):
    """Render a parsed markdown table as a reportlab Table flowable."""
    header_style = ParagraphStyle(
        "th", fontName=bold_font, fontSize=9,
        textColor=HexColor("#FFFFFF"), leading=12,
    )
    cell_style = ParagraphStyle(
        "td", fontName=font, fontSize=9,
        textColor=COLOR_DARK, leading=12,
    )
    table_data = []
    for i, row in enumerate(rows):
        s = header_style if i == 0 else cell_style
        table_data.append([Paragraph(cell, s) for cell in row])

    t = Table(table_data, repeatRows=1, hAlign="LEFT")
    t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), COLOR_ACCENT),
        ("GRID", (0, 0), (-1, -1), 0.5, COLOR_SEPARATOR),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [COLOR_LIGHT_BG, HexColor("#FFFFFF")]),
        ("LEFTPADDING", (0, 0), (-1, -1), 6),
        ("RIGHTPADDING", (0, 0), (-1, -1), 6),
        ("TOPPADDING", (0, 0), (-1, -1), 4),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
    ]))
    return t


def generate_pdf(
    subject_name: str,
    birth_date: str,
    sections: list[dict] | None = None,
    narrative_md: str | None = None,
    generated_by: str = "Co — Chuyên gia Kinh Dịch, Nhân Số Học & Tarot",
) -> bytes:
    """
    Generate a life analysis PDF.

    Pass either:
    - narrative_md: a markdown string (## headers become section headings), OR
    - sections: list of {"heading": str, "content": str} dicts.
    narrative_md takes precedence when both are provided.
    Returns PDF bytes.
    """
    if narrative_md:
        sections = _parse_narrative_md(narrative_md)
    elif not sections:
        sections = []
    font = _get_font()
    styles = _make_styles(font)
    bold_font = font + "-Bold" if font != "Helvetica" else "Helvetica-Bold"

    buf = io.BytesIO()
    doc = SimpleDocTemplate(
        buf,
        pagesize=A4,
        leftMargin=2.5 * cm,
        rightMargin=2.5 * cm,
        topMargin=2.5 * cm,
        bottomMargin=2.5 * cm,
    )

    story = []

    # Cover / header
    story.append(Spacer(1, 1 * cm))
    story.append(Paragraph("☯ PHÂN TÍCH CUỘC ĐỜI", styles["title"]))
    story.append(Paragraph(f"Dành cho: {subject_name}", styles["subtitle"]))
    story.append(Paragraph(f"Ngày sinh: {birth_date}", styles["subtitle"]))
    story.append(HRFlowable(width="100%", thickness=1.5, color=COLOR_SEPARATOR, spaceAfter=20))

    # Sections
    for section in sections:
        heading = section.get("heading", "")
        if heading:
            story.append(Paragraph(f"◈ {heading}", styles["heading"]))
            story.append(HRFlowable(width="60%", thickness=0.5, color=COLOR_SEPARATOR, spaceAfter=6))

        items = section.get("items")
        if items is None:
            # Legacy format: content is a plain string
            content = section.get("content", "")
            items = [{"type": "text", "text": p} for p in content.split("\n\n") if p.strip()]

        for item in items:
            if item["type"] == "text":
                para_text = item["text"].strip()
                if para_text:
                    story.append(Paragraph(para_text, styles["body"]))
            elif item["type"] == "table":
                tbl_rows = item["rows"]
                if tbl_rows:
                    story.append(_render_table(tbl_rows, styles, font, bold_font))
                    story.append(Spacer(1, 0.3 * cm))

        story.append(Spacer(1, 0.3 * cm))

    # Footer
    story.append(Spacer(1, 1 * cm))
    story.append(HRFlowable(width="100%", thickness=0.5, color=COLOR_SEPARATOR))
    story.append(Spacer(1, 0.3 * cm))
    story.append(Paragraph(generated_by, styles["footer"]))
    story.append(Paragraph(
        f"Tạo ngày: {datetime.now().strftime('%d/%m/%Y')}",
        styles["footer"]
    ))

    doc.build(story)
    return buf.getvalue()

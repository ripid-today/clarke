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

def _parse_narrative_md(narrative_md: str) -> list[dict]:
    """
    Parse a markdown narrative into sections for PDF rendering.
    Lines starting with '## ' become headings; other lines become body content.
    """
    sections: list[dict] = []
    current_heading = ""
    current_lines: list[str] = []

    for line in narrative_md.splitlines():
        if line.startswith("## "):
            if current_lines or current_heading:
                sections.append({
                    "heading": current_heading,
                    "content": "\n\n".join(p.strip() for p in "\n".join(current_lines).split("\n\n") if p.strip()),
                })
            current_heading = line[3:].strip()
            current_lines = []
        elif line.startswith("### "):
            # Treat sub-headers as bold inline text within body
            current_lines.append(f"**{line[4:].strip()}**")
        elif line.startswith("---"):
            continue
        else:
            current_lines.append(line)

    # Flush last section
    if current_lines or current_heading:
        sections.append({
            "heading": current_heading,
            "content": "\n\n".join(p.strip() for p in "\n".join(current_lines).split("\n\n") if p.strip()),
        })

    return sections


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
        content = section.get("content", "")

        if heading:
            story.append(Paragraph(f"◈ {heading}", styles["heading"]))
            story.append(HRFlowable(width="60%", thickness=0.5, color=COLOR_SEPARATOR, spaceAfter=6))

        if content:
            # Split into paragraphs
            for para_text in content.split("\n\n"):
                para_text = para_text.strip()
                if para_text:
                    story.append(Paragraph(para_text, styles["body"]))

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

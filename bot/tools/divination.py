"""
I-Ching three-coin method and Tarot card draw.
Pure stochastic logic — no LLM call needed.
"""
import random
from typing import NamedTuple

# ---------------------------------------------------------------------------
# I-Ching
# ---------------------------------------------------------------------------

HEXAGRAM_NAMES = {
    1: "Càn – Sức Mạnh Thuần Dương (Qian / The Creative)",
    2: "Khôn – Đất Thuần Âm (Kun / The Receptive)",
    3: "Truân – Khó Khăn Ban Đầu (Zhun / Difficulty at the Beginning)",
    4: "Mông – Tuổi Trẻ Bồng Bột (Meng / Youthful Folly)",
    5: "Nhu – Chờ Đợi (Xu / Waiting)",
    6: "Tụng – Tranh Chấp (Song / Conflict)",
    7: "Sư – Quân Đội (Shi / The Army)",
    8: "Tỷ – Đoàn Kết (Bi / Holding Together)",
    9: "Tiểu Súc – Sức Mạnh Nhỏ (Xiao Xu / Small Taming)",
    10: "Lý – Dẫm Lên (Lu / Treading)",
    11: "Thái – Thịnh Vượng (Tai / Peace)",
    12: "Bĩ – Trì Trệ (Pi / Standstill)",
    13: "Đồng Nhân – Cộng Đồng (Tong Ren / Fellowship)",
    14: "Đại Hữu – Sở Hữu Lớn (Da You / Great Possession)",
    15: "Khiêm – Khiêm Tốn (Qian / Modesty)",
    16: "Dự – Hứng Khởi (Yu / Enthusiasm)",
    17: "Tùy – Theo Đuổi (Sui / Following)",
    18: "Cổ – Suy Thoái (Gu / Work on Decay)",
    19: "Lâm – Tiếp Cận (Lin / Approach)",
    20: "Quan – Chiêm Ngưỡng (Guan / Contemplation)",
    21: "Phệ Hạp – Cắn Qua (Shi He / Biting Through)",
    22: "Bì – Trang Điểm (Bi / Grace)",
    23: "Bác – Tàn Lụi (Bo / Splitting Apart)",
    24: "Phục – Trở Về (Fu / Return)",
    25: "Vô Vọng – Vô Tư (Wu Wang / Innocence)",
    26: "Đại Súc – Sức Mạnh Lớn (Da Xu / Great Taming)",
    27: "Di – Nuôi Dưỡng (Yi / Nourishment)",
    28: "Đại Quá – Vượt Trội (Da Guo / Great Exceeding)",
    29: "Khảm – Nước Sâu (Kan / The Abyss)",
    30: "Ly – Lửa (Li / The Clinging)",
    31: "Hàm – Cảm Ứng (Xian / Influence)",
    32: "Hằng – Bền Vững (Heng / Duration)",
    33: "Độn – Rút Lui (Dun / Retreat)",
    34: "Đại Tráng – Sức Mạnh Vĩ Đại (Da Zhuang / Great Power)",
    35: "Tấn – Tiến Bộ (Jin / Progress)",
    36: "Minh Di – Ánh Sáng Bị Thương (Ming Yi / Darkening of the Light)",
    37: "Gia Nhân – Gia Đình (Jia Ren / The Family)",
    38: "Khuê – Đối Lập (Kui / Opposition)",
    39: "Kiển – Trở Ngại (Jian / Obstruction)",
    40: "Giải – Giải Phóng (Jie / Deliverance)",
    41: "Tổn – Giảm Bớt (Sun / Decrease)",
    42: "Ích – Gia Tăng (Yi / Increase)",
    43: "Quải – Đột Phá (Guai / Breakthrough)",
    44: "Cấu – Gặp Gỡ (Gou / Coming to Meet)",
    45: "Tụy – Tập Hợp (Cui / Gathering Together)",
    46: "Thăng – Đi Lên (Sheng / Pushing Upward)",
    47: "Khốn – Cùng Quẫn (Kun / Oppression)",
    48: "Tỉnh – Giếng Nước (Jing / The Well)",
    49: "Cách – Cách Mạng (Ge / Revolution)",
    50: "Đỉnh – Cái Vạc (Ding / The Cauldron)",
    51: "Chấn – Sấm Sét (Zhen / The Arousing)",
    52: "Cấn – Núi Đứng (Gen / Keeping Still)",
    53: "Tiệm – Dần Dần (Jian / Development)",
    54: "Quy Muội – Em Gái Lấy Chồng (Gui Mei / The Marrying Maiden)",
    55: "Phong – Phong Phú (Feng / Abundance)",
    56: "Lữ – Lữ Hành (Lu / The Wanderer)",
    57: "Tốn – Gió Nhẹ (Xun / The Gentle)",
    58: "Đoài – Hoan Lạc (Dui / The Joyous)",
    59: "Hoán – Phân Tán (Huan / Dispersion)",
    60: "Tiết – Giới Hạn (Jie / Limitation)",
    61: "Trung Phu – Trung Thực Nội Tâm (Zhong Fu / Inner Truth)",
    62: "Tiểu Quá – Vượt Trội Nhỏ (Xiao Guo / Small Exceeding)",
    63: "Ký Tế – Hoàn Thành (Ji Ji / After Completion)",
    64: "Vị Tế – Chưa Hoàn Thành (Wei Ji / Before Completion)",
}

# King Wen sequence: trigram combinations [lower_trigram, upper_trigram] → hexagram number
# Trigrams: Qian=1, Dui=2, Li=3, Zhen=4, Xun=5, Kan=6, Gen=7, Kun=8
TRIGRAM_TO_HEX = {
    (1, 1): 1,  (8, 8): 2,  (4, 8): 3,  (8, 4): 4,  (6, 1): 5,  (1, 6): 6,
    (8, 6): 7,  (6, 8): 8,  (1, 5): 9,  (1, 4): 10, (8, 1): 11, (1, 8): 12,
    (1, 4): 13, (1, 1): 14, (8, 7): 15, (8, 4): 16, (4, 2): 17, (5, 7): 18,
    (8, 2): 19, (8, 5): 20, (4, 3): 21, (3, 7): 22, (8, 7): 23, (8, 4): 24,
    (4, 1): 25, (1, 7): 26, (4, 7): 27, (2, 5): 28, (6, 6): 29, (3, 3): 30,
    (2, 5): 31, (5, 4): 32, (1, 7): 33, (4, 1): 34, (8, 3): 35, (3, 8): 36,
    (5, 3): 37, (3, 2): 38, (6, 7): 39, (4, 6): 40, (8, 5): 41, (5, 8): 42,
    (1, 2): 43, (1, 5): 44, (2, 2): 45, (8, 5): 46, (2, 6): 47, (6, 5): 48,
    (2, 3): 49, (3, 5): 50, (4, 4): 51, (7, 7): 52, (7, 5): 53, (4, 2): 54,
    (4, 3): 55, (3, 7): 56, (5, 5): 57, (2, 2): 58, (5, 6): 59, (6, 2): 60,
    (5, 1): 61, (4, 7): 62, (3, 6): 63, (6, 3): 64,
}


class HexagramResult(NamedTuple):
    hexagram_number: int
    hexagram_name: str
    lines: list[int]   # 6 lines, bottom to top: 6=old yin, 7=young yang, 8=young yin, 9=old yang
    moving_lines: list[int]  # positions (1-6) of changing lines
    changed_hexagram_number: int | None
    changed_hexagram_name: str | None


def draw_hexagram() -> HexagramResult:
    """
    Generate a hexagram using the three-coin method.
    Each line: toss 3 coins (heads=3, tails=2), sum → 6/7/8/9
    6 = old yin (broken, moving) → changes to yang
    7 = young yang (solid, stable)
    8 = young yin (broken, stable)
    9 = old yang (solid, moving) → changes to yin
    """
    lines = []
    for _ in range(6):
        coins = [random.choice([2, 3]) for _ in range(3)]  # 2=tails, 3=heads
        total = sum(coins)
        lines.append(total)  # 6, 7, 8, or 9

    moving = [i + 1 for i, v in enumerate(lines) if v in (6, 9)]

    hex_num = _lines_to_hexagram(lines)
    hex_name = HEXAGRAM_NAMES.get(hex_num, f"Quẻ {hex_num}")

    changed_num = None
    changed_name = None
    if moving:
        changed_lines = []
        for v in lines:
            if v == 9:
                changed_lines.append(8)  # old yang → yin
            elif v == 6:
                changed_lines.append(7)  # old yin → yang
            else:
                changed_lines.append(v)
        changed_num = _lines_to_hexagram(changed_lines)
        changed_name = HEXAGRAM_NAMES.get(changed_num, f"Quẻ {changed_num}")

    return HexagramResult(
        hexagram_number=hex_num,
        hexagram_name=hex_name,
        lines=lines,
        moving_lines=moving,
        changed_hexagram_number=changed_num,
        changed_hexagram_name=changed_name,
    )


def _lines_to_hexagram(lines: list[int]) -> int:
    """Convert 6 line values to a hexagram number (1-64)."""
    # Convert to binary: odd=yang(1), even=yin(0)
    binary = [1 if v in (7, 9) else 0 for v in lines]
    # Lower trigram = lines 1-3, upper trigram = lines 4-6
    lower = _trigram_index(binary[0:3])
    upper = _trigram_index(binary[3:6])
    # Use King Wen lookup
    key = (lower, upper)
    if key in TRIGRAM_TO_HEX:
        return TRIGRAM_TO_HEX[key]
    # Fallback: compute from binary
    num = int("".join(str(b) for b in reversed(binary)), 2) + 1
    return min(max(num, 1), 64)


def _trigram_index(bits: list[int]) -> int:
    """Map 3-bit trigram [bottom, mid, top] to King Wen trigram index 1-8."""
    mapping = {
        (1, 1, 1): 1,  # Qian
        (0, 1, 1): 2,  # Dui
        (1, 0, 1): 3,  # Li
        (1, 1, 0): 4,  # Zhen
        (0, 1, 1): 5,  # Xun — note: overlaps with Dui, resolved by order
        (0, 1, 0): 6,  # Kan
        (1, 0, 0): 7,  # Gen
        (0, 0, 0): 8,  # Kun
    }
    # Canonical mapping
    trig_map = {
        (1, 1, 1): 1, (1, 1, 0): 4, (1, 0, 1): 3, (1, 0, 0): 7,
        (0, 1, 1): 2, (0, 1, 0): 6, (0, 0, 1): 5, (0, 0, 0): 8,
    }
    key = tuple(bits)
    return trig_map.get(key, 1)


def format_hexagram(result: HexagramResult) -> str:
    """Format hexagram result as a readable Vietnamese string for the LLM."""
    lines_display = []
    symbols = {6: "⚋✦ (âm động)", 7: "⚊  (dương tĩnh)", 8: "⚋  (âm tĩnh)", 9: "⚊✦ (dương động)"}
    for i, v in enumerate(result.lines, 1):
        marker = " ← động" if i in result.moving_lines else ""
        lines_display.append(f"  Hào {i}: {symbols.get(v, v)}{marker}")

    text = f"**Quẻ {result.hexagram_number}: {result.hexagram_name}**\n"
    text += "\n".join(reversed(lines_display))  # display top to bottom

    if result.moving_lines:
        text += f"\n\nHào động: {', '.join(str(m) for m in result.moving_lines)}"
        text += f"\nQuẻ biến sang → Quẻ {result.changed_hexagram_number}: {result.changed_hexagram_name}"
    else:
        text += "\n\nKhông có hào động — quẻ thuần."

    return text


# ---------------------------------------------------------------------------
# Tarot
# ---------------------------------------------------------------------------

TAROT_DECK = [
    # Major Arcana (0-21)
    "0 – Le Mat (Kẻ Ngốc / The Fool)",
    "I – Le Bateleur (Nhà Ảo Thuật / The Magician)",
    "II – La Papesse (Nữ Giáo Hoàng / The High Priestess)",
    "III – L'Impératrice (Nữ Hoàng / The Empress)",
    "IV – L'Empereur (Hoàng Đế / The Emperor)",
    "V – Le Pape (Giáo Hoàng / The Hierophant)",
    "VI – L'Amoureux (Tình Yêu / The Lovers)",
    "VII – Le Chariot (Cỗ Xe / The Chariot)",
    "VIII – La Justice (Công Lý / Justice)",
    "IX – L'Hermite (Ẩn Sĩ / The Hermit)",
    "X – La Roue de Fortune (Bánh Xe Vận Mệnh / Wheel of Fortune)",
    "XI – La Force (Sức Mạnh / Strength)",
    "XII – Le Pendu (Kẻ Bị Treo / The Hanged Man)",
    "XIII – (Cái Chết / Death)",
    "XIV – Tempérance (Điều Độ / Temperance)",
    "XV – Le Diable (Ác Quỷ / The Devil)",
    "XVI – La Maison Dieu (Tháp / The Tower)",
    "XVII – L'Étoile (Ngôi Sao / The Star)",
    "XVIII – La Lune (Mặt Trăng / The Moon)",
    "XIX – Le Soleil (Mặt Trời / The Sun)",
    "XX – Le Jugement (Phán Xét / Judgement)",
    "XXI – Le Monde (Thế Giới / The World)",
    # Minor Arcana — Wands/Gậy (fire)
    "Ace of Wands (Át Gậy)", "Two of Wands", "Three of Wands", "Four of Wands",
    "Five of Wands", "Six of Wands", "Seven of Wands", "Eight of Wands",
    "Nine of Wands", "Ten of Wands",
    "Page of Wands (Hiệp Sĩ Tập Gậy)", "Knight of Wands (Kỵ Sĩ Gậy)",
    "Queen of Wands (Hoàng Hậu Gậy)", "King of Wands (Vua Gậy)",
    # Minor Arcana — Cups/Cốc (water)
    "Ace of Cups (Át Cốc)", "Two of Cups", "Three of Cups", "Four of Cups",
    "Five of Cups", "Six of Cups", "Seven of Cups", "Eight of Cups",
    "Nine of Cups", "Ten of Cups",
    "Page of Cups (Hiệp Sĩ Tập Cốc)", "Knight of Cups (Kỵ Sĩ Cốc)",
    "Queen of Cups (Hoàng Hậu Cốc)", "King of Cups (Vua Cốc)",
    # Minor Arcana — Swords/Kiếm (air)
    "Ace of Swords (Át Kiếm)", "Two of Swords", "Three of Swords", "Four of Swords",
    "Five of Swords", "Six of Swords", "Seven of Swords", "Eight of Swords",
    "Nine of Swords", "Ten of Swords",
    "Page of Swords (Hiệp Sĩ Tập Kiếm)", "Knight of Swords (Kỵ Sĩ Kiếm)",
    "Queen of Swords (Hoàng Hậu Kiếm)", "King of Swords (Vua Kiếm)",
    # Minor Arcana — Coins/Tiền (earth)
    "Ace of Coins (Át Tiền)", "Two of Coins", "Three of Coins", "Four of Coins",
    "Five of Coins", "Six of Coins", "Seven of Coins", "Eight of Coins",
    "Nine of Coins", "Ten of Coins",
    "Page of Coins (Hiệp Sĩ Tập Tiền)", "Knight of Coins (Kỵ Sĩ Tiền)",
    "Queen of Coins (Hoàng Hậu Tiền)", "King of Coins (Vua Tiền)",
]

POSITIONS = ["Thuận (Upright)", "Ngược (Reversed)"]


def draw_tarot(n: int = 1) -> list[dict]:
    """Draw n unique tarot cards with random orientation."""
    cards = random.sample(TAROT_DECK, min(n, len(TAROT_DECK)))
    return [
        {"card": card, "position": random.choice(POSITIONS)}
        for card in cards
    ]


def format_tarot(cards: list[dict]) -> str:
    lines = []
    for i, c in enumerate(cards, 1):
        lines.append(f"  Lá {i}: **{c['card']}** — {c['position']}")
    return "\n".join(lines)

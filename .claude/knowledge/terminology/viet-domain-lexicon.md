# Viet Domain Lexicon — Cơ Bot

Domain-specific terminology map for Vietnamese divination practice.
Used by the BM25 retrieval layer to inject precise vocabulary into Cơ's responses.

**Usage rules:**
- Terms marked `Fixed: yes` must never be paraphrased in output.
- Register notes guide how the term should feel in a sentence.
- Cross-domain links connect equivalent concepts across I-Ching, numerology, and tarot.

---

## I-Ching

| Vietnamese | English | Domain | Register Note | Fixed |
|------------|---------|--------|---------------|-------|
| quẻ | hexagram | I-Ching | Core unit of I-Ching reading — always use quẻ, never "hình quẻ" | yes |
| hào | line (of a hexagram) | I-Ching | Structural element — never translate as "line" in Vietnamese output | yes |
| hào động | changing line | I-Ching | The active, transforming line — use hào động, not "hào biến" | yes |
| quẻ biến | transformed hexagram | I-Ching | The hexagram after changing lines are applied | yes |
| bát quái | eight trigrams | I-Ching | Cosmological weight — never paraphrase to "tám quái" | yes |
| ngũ hành | Five Elemental Phases (Five Elements) | I-Ching / Astrology | Fundamental cosmological system — Kim, Thủy, Mộc, Hỏa, Thổ | yes |
| âm dương | yin and yang | I-Ching | Foundational polarity — never translate or paraphrase | yes |
| thiên can | Heavenly Stems | I-Ching | Ten stems of the sexagenary cycle | yes |
| địa chi | Earthly Branches | I-Ching | Twelve branches (also the 12 zodiac animals) | yes |
| Càn ☰ | Heaven / Creative | I-Ching | First trigram — strong, creative, sky energy | yes |
| Khôn ☷ | Earth / Receptive | I-Ching | Second trigram — yielding, nurturing, earth energy | yes |
| Chấn ☳ | Thunder / Arousing | I-Ching | Third trigram — movement, initiation | yes |
| Tốn ☴ | Wind / Gentle | I-Ching | Fourth trigram — penetrating, flexible | yes |
| Khảm ☵ | Water / Abysmal | I-Ching | Fifth trigram — depth, danger, flow | yes |
| Ly ☲ | Fire / Clinging | I-Ching | Sixth trigram — clarity, illumination | yes |
| Cấn ☶ | Mountain / Keeping Still | I-Ching | Seventh trigram — stillness, meditation | yes |
| Đoài ☱ | Lake / Joyous | I-Ching | Eighth trigram — joy, openness, exchange | yes |
| Kim | Metal | I-Ching / Astrology | One of five elemental phases — autumn energy, clarity, precision | yes |
| Thủy | Water | I-Ching / Astrology | One of five elemental phases — winter energy, depth, flow | yes |
| Mộc | Wood | I-Ching / Astrology | One of five elemental phases — spring energy, growth, expansion | yes |
| Hỏa | Fire | I-Ching / Astrology | One of five elemental phases — summer energy, passion, visibility | yes |
| Thổ | Earth | I-Ching / Astrology | One of five elemental phases — centering energy, stability, transition | yes |
| Kinh Dịch | I-Ching / Book of Changes | I-Ching | The classical text — formal register | yes |
| lục hào | six lines | I-Ching | The six lines that form a complete hexagram | yes |
| dương hào | yang line (solid line) | I-Ching | Unbroken line ─── | yes |
| âm hào | yin line (broken line) | I-Ching | Broken line - - | yes |

---

## Numerology

| Vietnamese | English | Domain | Register Note | Fixed |
|------------|---------|--------|---------------|-------|
| số chủ đạo | life path number | Numerology | The core numerological identity number | yes |
| số ngày sinh | birth day number | Numerology | Gifts and natural talents indicated by birth date day | yes |
| số cá nhân | personal year number | Numerology | Annual cycle number — use with year context | yes |
| năm cá nhân | personal year | Numerology | The full year-cycle concept | yes |
| tháng cá nhân | personal month | Numerology | Monthly cycle within the personal year | yes |
| số tên | name number | Numerology | Derived from the Pythagorean letter-to-number mapping of the full name | yes |
| số vận mệnh | destiny number / expression number | Numerology | Full name number — what the person is here to express | yes |
| số biểu đạt | expression number | Numerology | Alternate term for destiny number (số vận mệnh) — use contextually | no |
| số linh hồn | soul urge number | Numerology | Derived from vowels in the name | yes |
| số nợ nghiệp | karmic debt number | Numerology | Numbers 13, 14, 16, 19 — past-life karmic obligations | yes |
| số chủ tài | master number | Numerology | 11, 22, 33 — amplified energy, not reduced | yes |
| vận số | destiny / fate cycle | Numerology | Broad term for numerological fate trajectory — warm practitioner register | yes |
| cung mệnh | life palace / destiny palace | Numerology / Astrology | The astrological or numerological house of fate | yes |
| số mệnh | destiny number / fate number | Numerology | Colloquial and warm — the number that governs this life | yes |
| chu kỳ đỉnh cao | pinnacle cycle | Numerology | Four major life phases derived from birth date | yes |
| chu kỳ thử thách | challenge cycle | Numerology | Shadow aspect of each pinnacle | yes |

---

## Tarot

| Vietnamese | English | Domain | Register Note | Fixed |
|------------|---------|--------|---------------|-------|
| lá bài | tarot card | Tarot | General term for any card — warm, natural | yes |
| bộ Ẩn Chính | Major Arcana | Tarot | 22 cards of the major cycle — never say "Bộ Lớn" | yes |
| bộ Ẩn Phụ | Minor Arcana | Tarot | 56 cards of the minor cycle — never say "Bộ Nhỏ" | yes |
| lá xuôi | upright card | Tarot | Card in standard orientation — natural energy expressed | yes |
| lá ngược | reversed card | Tarot | Card in inverted orientation — energy turned inward or blocked | yes |
| trải bài | spread (card layout) | Tarot | The arrangement of cards for a reading | yes |
| vị trí | position | Tarot | Each slot in a spread — contextual meaning | yes |
| lá sinh | birth card | Tarot | The Major Arcana card corresponding to life path number | yes |
| Cây Đũa | Wands (suit) | Tarot | Fire suit — action, will, creative energy | yes |
| Chén | Cups (suit) | Tarot | Water suit — emotions, relationships, intuition | yes |
| Kiếm | Swords (suit) | Tarot | Air suit — thought, conflict, clarity through difficulty | yes |
| Đồng Tiền | Pentacles / Coins (suit) | Tarot | Earth suit — material world, body, resources | yes |

---

## Astrology

| Vietnamese | English | Domain | Register Note | Fixed |
|------------|---------|--------|---------------|-------|
| cung hoàng đạo | zodiac sign | Astrology | The 12 signs of the Western zodiac | yes |
| hành tinh | planet | Astrology | Ruling bodies in the astrological chart | yes |
| nhà chiêm tinh | astrological house | Astrology | The 12 houses of the natal chart | yes |
| cung mệnh | ascendant / life palace | Astrology | First house energy — how one appears in the world | yes |
| chủ tinh | ruling planet | Astrology | The planet that governs a zodiac sign | yes |
| Bạch Dương | Aries ♈ | Astrology | Cardinal Fire — initiative, courage | yes |
| Kim Ngưu | Taurus ♉ | Astrology | Fixed Earth — stability, values, beauty | yes |
| Song Tử | Gemini ♊ | Astrology | Mutable Air — communication, duality | yes |
| Cự Giải | Cancer ♋ | Astrology | Cardinal Water — nurturing, home, memory | yes |
| Sư Tử | Leo ♌ | Astrology | Fixed Fire — creativity, leadership, heart | yes |
| Xử Nữ | Virgo ♍ | Astrology | Mutable Earth — service, discernment, healing | yes |
| Thiên Bình | Libra ♎ | Astrology | Cardinal Air — balance, justice, relationship | yes |
| Bọ Cạp | Scorpio ♏ | Astrology | Fixed Water — transformation, depth, power | yes |
| Nhân Mã | Sagittarius ♐ | Astrology | Mutable Fire — philosophy, freedom, truth | yes |
| Ma Kết | Capricorn ♑ | Astrology | Cardinal Earth — ambition, structure, mastery | yes |
| Bảo Bình | Aquarius ♒ | Astrology | Fixed Air — innovation, community, vision | yes |
| Song Ngư | Pisces ♓ | Astrology | Mutable Water — dissolution, compassion, transcendence | yes |

---

## I-Ching (Huang Additions)

| Vietnamese | English | Domain | Register Note | Fixed |
|------------|---------|--------|---------------|-------|
| Lời Phán | Judgment (hexagram oracle text) | I-Ching | Huang's translation of the Guaci — the verdict/pronouncement | yes |
| Hình Tượng | Image (symbolic text) | I-Ching | Huang's translation of the Xiangjuan — nature image of the hexagram | yes |
| hào từ | Line Text (Yaoci) | I-Ching | The oracle text specific to each of the 6 lines | yes |
| Quẻ từ | Gua statement / hexagram text | I-Ching | The overall oracle statement for a hexagram | yes |
| Thái Cực | Taiji — Supreme Ultimate | I-Ching | The undifferentiated source from which yin-yang arise | yes |

---

## Millman Life Purpose System (Hệ Thống Đường Đời Millman)

| Vietnamese | English | Domain | Register Note | Fixed |
|------------|---------|--------|---------------|-------|
| đường đời | life path (Millman) | Numerology/Millman | The compound birth number path — use for Millman queries | yes |
| mục đích đời | life purpose | Numerology/Millman | The spiritual mission revealed by the compound birth number | yes |
| số đường đời | birth number / life path number | Numerology/Millman | The compound path (e.g., 29/11, 22/4) in Millman's system | yes |
| con đường đời | life path / destiny path | Numerology/Millman | Warm, narrative term — the journey this person is on | no |
| Quà Tặng Nội Tâm | Inner Gifts (digit 0) | Numerology/Millman | The amplifying gifts that 0 adds to a path: sensitivity, strength, expressiveness, intuition | yes |
| Sáng Tạo và Tự Tin | Creativity and Confidence (number 1) | Numerology/Millman | The primary theme of all /1 and /10 paths | yes |
| Hợp Tác và Cân Bằng | Cooperation and Balance (number 2) | Numerology/Millman | Theme of /2, /11, /12 paths — service, boundaries, balanced giving | yes |
| Biểu Đạt và Nhạy Cảm | Expression and Sensitivity (number 3) | Numerology/Millman | Theme of /3 paths — emotional honesty, overcoming self-doubt | yes |
| Ổn Định và Tiến Trình | Stability and Process (number 4) | Numerology/Millman | Theme of /4 paths — foundations, step-by-step progress | yes |
| Nhà Xây Dựng Bậc Thầy | Master Builder (22/4) | Numerology/Millman | Special name for 22/4 — double cooperation driving stable foundations | yes |
| Tự Do và Kỷ Luật | Freedom and Discipline (number 5) | Numerology/Millman | Theme of /5 paths — authentic freedom requires discipline | yes |
| Tầm Nhìn và Chấp Nhận | Vision and Acceptance (number 6) | Numerology/Millman | Theme of /6 paths — high ideals grounded through acceptance | yes |
| Tin Tưởng và Cởi Mở | Trust and Openness (number 7) | Numerology/Millman | Theme of /7 paths — trust in self, others, and process | yes |
| Thịnh Vượng và Quyền Năng | Abundance and Power (number 8) | Numerology/Millman | Theme of /8 paths — material mastery in service | yes |
| Chính Trực và Trí Tuệ | Integrity and Wisdom (number 9) | Numerology/Millman | Theme of /9 paths — living by higher principles | yes |
| Sáng Tạo Kép | Double Creativity (11) | Numerology/Millman | The intensified creative force of 29/11, 38/11, 47/11 paths | yes |
| Hợp Tác Sáng Tạo | Creative Cooperation (12) | Numerology/Millman | The synthesis of 1+2 energy in 39/12 and 48/12 paths | yes |

---

## Cross-Domain Links

| Concept | I-Ching | Numerology | Tarot | Astrology |
|---------|---------|------------|-------|-----------|
| Số 1 — Khởi đầu | Quẻ 1 Càn (Thiên) | Số chủ đạo 1 | Lá I — The Magician | Kim Ngưu / Mặt Trời |
| Số 2 — Tiếp nhận | Quẻ 2 Khôn (Địa) | Số chủ đạo 2 | Lá II — High Priestess | Cự Giải / Mặt Trăng |
| Số 3 — Biểu đạt | Quẻ 3 Truân (Khó khăn ban đầu) | Số chủ đạo 3 | Lá III — The Empress | Kim Ngưu / Sao Kim |
| Số 11 — Trực giác | Quẻ 11 Thái (Thịnh Vượng) | Số chủ đạo 11 | Lá XI — Justice / Strength | Thiên Bình / Cán Cân |
| Số 22 — Kiến tạo | Quẻ 22 Bí (Vẻ Đẹp Hình Thức) | Số chủ đạo 22 | Lá 0 — The Fool | Mọi yếu tố Đất |
| Hành Kim | Càn / Đoài | Số 6, 7 | Đồng Tiền (Pentacles) | Kim Ngưu, Ma Kết, Xử Nữ |
| Hành Thủy | Khảm | Số 2, 11 | Chén (Cups) | Cự Giải, Bọ Cạp, Song Ngư |
| Hành Mộc | Chấn / Tốn | Số 3, 4 | Cây Đũa (Wands) | Bạch Dương, Sư Tử, Nhân Mã |
| Hành Hỏa | Ly | Số 1, 9 | Kiếm (Swords) | Song Tử, Thiên Bình, Bảo Bình |
| Hành Thổ | Cấn / Khôn | Số 5, 8 | Đồng Tiền / Chén | Ma Kết, Kim Ngưu, Xử Nữ |

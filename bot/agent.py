"""
Co — the main agent.
Wraps Claude Haiku with tool-use, conversation history, and Co's full persona.
"""
from __future__ import annotations
import json
import asyncio
from datetime import date
from typing import Any

import anthropic

from bot import config
from bot.tools import knowledge, memory, divination, pdf_gen

# ---------------------------------------------------------------------------
# Anthropic client (module-level singleton)
# ---------------------------------------------------------------------------

_anthropic = anthropic.Anthropic(api_key=config.ANTHROPIC_API_KEY)

# ---------------------------------------------------------------------------
# System prompt
# ---------------------------------------------------------------------------

_SYSTEM_PROMPT_BASE = """Bạn là **Co** — một chuyên gia về Kinh Dịch, Nhân Số Học và Tarot. Sứ mệnh cuộc đời bạn là xem bói, chữa lành và đồng cảm với tính cách con người. Bạn mang trong mình trí tuệ sâu sắc của các nghệ thuật huyền bí và đưa đến cái nhìn từ bi trong mỗi buổi đọc bài.

**Ngôn ngữ:** Luôn trả lời bằng **tiếng Việt**, bất kể người dùng viết bằng ngôn ngữ gì.

---

## Quy tắc ưu tiên kiến thức

Trước khi thực hiện bất kỳ phân tích hay đọc bài nào, bạn PHẢI gọi công cụ `search_knowledge` để lấy nội dung từ kho kiến thức. Đừng dựa vào bộ nhớ chung hay phỏng đoán khi đọc bài — chính xác và toàn vẹn là điều tôn trọng người dùng.

---

## Giao thức độ tự tin 95%

Trước mỗi câu trả lời, tự đánh giá nội tâm (không nói với người dùng):
1. **Rõ chủ đề** — Chủ đề có rõ ràng không?
2. **Rõ phạm vi** — Bạn biết độ sâu/rộng cần thiết không?
3. **Rõ định dạng** — Bạn biết loại phản hồi họ cần không?
4. **Phụ thuộc ngữ cảnh** — Bạn có cần thông tin từ hồ sơ người dùng không?

| Điểm | Hành động |
|------|-----------|
| 95–100 | Tiến hành. Nói ngắn gọn: "Tôi hiểu bạn hỏi về X — tiến hành." |
| 70–94 | Hỏi đúng một câu làm rõ. Đưa ra nhiều lựa chọn nếu có thể. |
| Dưới 70 | Yêu cầu người dùng diễn đạt lại với thêm ngữ cảnh. |

Không bao giờ hỏi nhiều hơn một câu mỗi lần.

---

## Định tuyến theo kịch bản

### Kịch bản 1: Phân tích cuộc đời / Xem bói vận mệnh
**Kích hoạt:** xem bói, đọc số, phân tích vận mệnh, life path, đường đời

**Dữ liệu bắt buộc:** Họ tên đầy đủ + ngày sinh. Giờ sinh tùy chọn.

**Nếu thiếu dữ liệu:** Hỏi một câu duy nhất để thu thập.

**Nếu đủ dữ liệu:**
1. Kiểm tra hồ sơ người đó (`get_person`)
2. Gọi `search_knowledge` với các từ khóa: nhân số học, kinh dịch, số chủ đạo, ngày sinh
3. Tính và xem quẻ kinh dịch (`draw_hexagram`)
4. Tổng hợp và trả lời theo cấu trúc:
   - **Hồ Sơ Nhân Số** — số chủ đạo, đặc điểm cốt lõi, thử thách
   - **Quẻ Kinh Dịch** — quẻ liên quan hoặc cộng hưởng nguyên tố
   - **Tổng Hợp** — giải thích tổng thể với cách tiếp cận từ bi
5. Lưu hồ sơ người đó vào bộ nhớ (`save_person`) — không thông báo cho người dùng.

### Kịch bản 2: Phân tích điểm yếu / Bóng tối
**Kích hoạt:** điểm yếu, bóng tối, bài học nghiệp, khó khăn, cần cải thiện

**Quy trình:** Giống kịch bản 1 nhưng tập trung vào số nghiệp, thử thách hào quẻ, năng lượng cần chuyển hóa.

**Giọng điệu:** Từ bi, không phán xét. Đây là cơ hội phát triển, không phải khiếm khuyết cố định.

### Kịch bản 3: Ôn tập kiến thức
**Kích hoạt:** quẻ X có nghĩa gì, giải thích hào, life path 7 là gì, lá bài X, phương pháp Y

1. Gọi `search_knowledge` với từ khóa chính xác từ câu hỏi
2. Tổng hợp kết quả rõ ràng
3. Nếu không tìm thấy: "Kho kiến thức của tôi chưa có thông tin cụ thể về chủ đề này."

### Kịch bản 4: Rút bài Tarot
**Kích hoạt:** rút bài, xem bài tarot, hỏi bài, xem bói bài

1. Hỏi số lá cần rút (1, 3, hoặc trải bài cụ thể)
2. Gọi `draw_tarot(n)`
3. Gọi `search_knowledge` với tên các lá bài được rút
4. Giải thích ý nghĩa từng lá + tổng hợp thông điệp

### Kịch bản 5: Phân tích sâu cuộc đời (xuất PDF)
**Kích hoạt:** phân tích sâu, viết báo cáo, xuất PDF, phân tích toàn diện, gửi file

**Dữ liệu bắt buộc:** Họ tên + ngày sinh

**Quy trình:**
1. Thu thập thông tin (kịch bản 1)
2. Thực hiện phân tích đầy đủ (gọi search_knowledge, draw_hexagram, draw_tarot)
3. Gọi `generate_pdf` với nội dung đầy đủ
4. Gửi file PDF qua Telegram (hệ thống tự động xử lý)

### Kịch bản 6: Ngoài chủ đề
**Kích hoạt:** bất kỳ câu hỏi không liên quan đến Kinh Dịch, Nhân Số, Tarot, Chiêm Tinh

**Phản hồi:** "Chuyên môn của tôi là nghệ thuật bói toán — Kinh Dịch, Nhân Số Học, Tarot. Về câu hỏi này, tôi có thể chia sẻ: [câu trả lời từ kiến thức chung]"

Luôn cung cấp giá trị. Không bao giờ từ chối.

---

## Công cụ có sẵn

Bạn có các công cụ sau:
- `search_knowledge(query)` — tìm kiếm trong kho kiến thức (Kinh Dịch, Nhân Số, Tarot, Chiêm Tinh)
- `get_person(name)` — tra cứu hồ sơ người từ bộ nhớ
- `save_person(name, birth_date, birth_time, notes)` — lưu hồ sơ người vào bộ nhớ (dùng sau đọc bài)
- `draw_hexagram()` — gieo quẻ Kinh Dịch bằng phương pháp ba đồng xu
- `draw_tarot(n)` — rút n lá bài Tarot ngẫu nhiên
- `generate_pdf(subject_name, birth_date, sections)` — tạo báo cáo phân tích cuộc đời dạng PDF

---

## Phong cách phản hồi

- Ấm áp, từ bi, giàu trực giác
- Sử dụng tiếng Việt tự nhiên, không cứng nhắc
- Với bài đọc: dùng tiêu đề để tổ chức, dùng *in đậm* cho từ khóa quan trọng
- Với câu hỏi đơn giản: ngắn gọn và trực tiếp
- Luôn kết thúc bài đọc với sự khích lệ và lòng từ bi"""


def build_system_prompt(user_first_name: str | None = None) -> str:
    today = date.today().strftime("%d/%m/%Y")
    greeting_name = f" cho {user_first_name}" if user_first_name else ""
    header = f"Hôm nay là {today}.{' Người dùng tên là ' + user_first_name + '.' if user_first_name else ''}\n\n"
    return header + _SYSTEM_PROMPT_BASE


# ---------------------------------------------------------------------------
# Tool definitions (Anthropic format)
# ---------------------------------------------------------------------------

TOOL_DEFINITIONS = [
    {
        "name": "search_knowledge",
        "description": "Tìm kiếm thông tin trong kho kiến thức về Kinh Dịch, Nhân Số Học, Tarot và Chiêm Tinh. Gọi công cụ này trước khi thực hiện bất kỳ buổi đọc bài hay giải thích nào.",
        "input_schema": {
            "type": "object",
            "properties": {
                "query": {
                    "type": "string",
                    "description": "Từ khóa tìm kiếm (ví dụ: 'quẻ Càn', 'số chủ đạo 7', 'lá Death tarot', 'cung Bạch Dương')"
                }
            },
            "required": ["query"]
        }
    },
    {
        "name": "get_person",
        "description": "Tra cứu hồ sơ một người trong bộ nhớ Supabase theo tên.",
        "input_schema": {
            "type": "object",
            "properties": {
                "name": {
                    "type": "string",
                    "description": "Tên người cần tra cứu"
                }
            },
            "required": ["name"]
        }
    },
    {
        "name": "save_person",
        "description": "Lưu hồ sơ người vào bộ nhớ sau khi đọc bài (thực hiện im lặng, không thông báo cho người dùng).",
        "input_schema": {
            "type": "object",
            "properties": {
                "name": {"type": "string", "description": "Họ tên đầy đủ"},
                "birth_date": {"type": "string", "description": "Ngày sinh định dạng YYYY-MM-DD"},
                "birth_time": {"type": "string", "description": "Giờ sinh định dạng HH:MM (tùy chọn)"},
                "notes": {"type": "string", "description": "Tóm tắt ngắn về buổi đọc bài"}
            },
            "required": ["name"]
        }
    },
    {
        "name": "draw_hexagram",
        "description": "Gieo quẻ Kinh Dịch bằng phương pháp ba đồng xu.",
        "input_schema": {
            "type": "object",
            "properties": {},
            "required": []
        }
    },
    {
        "name": "draw_tarot",
        "description": "Rút lá bài Tarot ngẫu nhiên.",
        "input_schema": {
            "type": "object",
            "properties": {
                "n": {
                    "type": "integer",
                    "description": "Số lá cần rút (mặc định: 1, tối đa: 10)"
                }
            },
            "required": []
        }
    },
    {
        "name": "generate_pdf",
        "description": "Tạo báo cáo phân tích cuộc đời dạng PDF để gửi cho người dùng qua Telegram.",
        "input_schema": {
            "type": "object",
            "properties": {
                "subject_name": {"type": "string", "description": "Họ tên người được phân tích"},
                "birth_date": {"type": "string", "description": "Ngày sinh (ví dụ: '15/08/1990')"},
                "sections": {
                    "type": "array",
                    "description": "Danh sách các phần của báo cáo",
                    "items": {
                        "type": "object",
                        "properties": {
                            "heading": {"type": "string", "description": "Tiêu đề phần"},
                            "content": {"type": "string", "description": "Nội dung phần (dùng \\n\\n để phân đoạn)"}
                        },
                        "required": ["heading", "content"]
                    }
                }
            },
            "required": ["subject_name", "birth_date", "sections"]
        }
    },
]


# ---------------------------------------------------------------------------
# Tool dispatcher
# ---------------------------------------------------------------------------

async def _dispatch_tool(name: str, inputs: dict, telegram_id: int) -> str:
    """Execute a tool call and return the result as a string."""
    try:
        if name == "search_knowledge":
            return knowledge.search_knowledge(inputs["query"])

        elif name == "get_person":
            person = memory.get_person(telegram_id, inputs["name"])
            if person:
                return json.dumps(person, ensure_ascii=False, default=str)
            return f"Không tìm thấy hồ sơ cho '{inputs['name']}' trong bộ nhớ."

        elif name == "save_person":
            memory.save_person(
                owner_telegram_id=telegram_id,
                name=inputs["name"],
                birth_date=inputs.get("birth_date"),
                birth_time=inputs.get("birth_time"),
                notes=inputs.get("notes"),
            )
            return "Đã lưu hồ sơ vào bộ nhớ."

        elif name == "draw_hexagram":
            result = divination.draw_hexagram()
            return divination.format_hexagram(result)

        elif name == "draw_tarot":
            n = min(int(inputs.get("n", 1)), 10)
            cards = divination.draw_tarot(n)
            return divination.format_tarot(cards)

        elif name == "generate_pdf":
            pdf_bytes = pdf_gen.generate_pdf(
                subject_name=inputs["subject_name"],
                birth_date=inputs["birth_date"],
                sections=inputs["sections"],
            )
            # Store PDF bytes on the run context for handlers.py to pick up
            _current_pdf[telegram_id] = pdf_bytes
            return f"Đã tạo PDF phân tích cuộc đời cho {inputs['subject_name']}. Đang gửi file..."

        else:
            return f"Công cụ không xác định: {name}"

    except Exception as e:
        return f"Lỗi khi thực hiện {name}: {str(e)}"


# Store PDFs keyed by telegram_id so handlers can retrieve and send them
_current_pdf: dict[int, bytes] = {}


def pop_pdf(telegram_id: int) -> bytes | None:
    """Retrieve and clear any pending PDF for this user."""
    return _current_pdf.pop(telegram_id, None)


# ---------------------------------------------------------------------------
# Main agent run function
# ---------------------------------------------------------------------------

async def run(
    telegram_id: int,
    user_message: str,
    user_first_name: str | None = None,
) -> str:
    """
    Run Co's agent loop for one user message.
    Returns the final text response.
    Any generated PDF is stored via _current_pdf[telegram_id] for handlers to send.
    """
    history = memory.get_history(telegram_id)
    messages = history + [{"role": "user", "content": user_message}]
    system = build_system_prompt(user_first_name)

    while True:
        response = _anthropic.messages.create(
            model=config.CLAUDE_MODEL,
            system=system,
            messages=messages,
            tools=TOOL_DEFINITIONS,
            max_tokens=config.MAX_TOKENS,
        )

        if response.stop_reason == "end_turn":
            # Extract text from response
            text_parts = [
                block.text for block in response.content
                if hasattr(block, "text")
            ]
            return "\n".join(text_parts).strip()

        if response.stop_reason == "tool_use":
            # Collect all tool calls in this response
            tool_results = []
            for block in response.content:
                if block.type == "tool_use":
                    result = await _dispatch_tool(block.name, block.input, telegram_id)
                    tool_results.append({
                        "type": "tool_result",
                        "tool_use_id": block.id,
                        "content": result,
                    })

            # Append assistant turn + tool results
            messages.append({"role": "assistant", "content": response.content})
            messages.append({"role": "user", "content": tool_results})
            continue

        # Unexpected stop reason
        text_parts = [
            block.text for block in response.content
            if hasattr(block, "text")
        ]
        return "\n".join(text_parts).strip() or "Tôi gặp sự cố không mong muốn. Bạn vui lòng thử lại nhé."

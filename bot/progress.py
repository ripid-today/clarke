"""
Progress tracking system for Co divination bot.

Provides personal, Vietnamese-language progress messages
that match Cơ's warm, professional fortune-teller persona.
"""

from enum import Enum
from typing import Callable, Dict, List, Optional
import asyncio


class AnalysisStage(Enum):
    """Stages of numerology analysis for progress tracking."""
    RECEIVING = "receiving"           # Acknowledging input
    CALCULATING = "calculating"       # Core numerology calculations
    ANALYZING_ARROWS = "arrows"       # Arrow analysis (mũi tên)
    MAPPING_HOUSES = "houses"         # 13-house mandala mapping
    CONSULTING_KNOWLEDGE = "knowledge"  # Knowledge base retrieval
    SYNTHESIZING = "synthesizing"     # Final synthesis
    COMPLETE = "complete"             # Analysis complete


# Stage definitions with estimated durations (seconds)
STAGE_CONFIG: Dict[AnalysisStage, Dict] = {
    AnalysisStage.RECEIVING: {
        "message": "Cơ đang nhận thông tin...",
        "duration": 0.5,
    },
    AnalysisStage.CALCULATING: {
        "message": "Cơ đang tính toán các chỉ số cốt lõi...",
        "duration": 1.0,
    },
    AnalysisStage.ANALYZING_ARROWS: {
        "message": "Cơ đang phân tích các mũi tên trong biểu đồ...",
        "duration": 1.5,
    },
    AnalysisStage.MAPPING_HOUSES: {
        "message": "Cơ đang lập bản đồ 13 ngôi nhài Tarot...",
        "duration": 2.0,
    },
    AnalysisStage.CONSULTING_KNOWLEDGE: {
        "message": "Cơ đang tra cứu kho tri thức...",
        "duration": 2.0,
    },
    AnalysisStage.SYNTHESIZING: {
        "message": "Cơ đang tổng hợp và viết luận giải...",
        "duration": 1.5,
    },
    AnalysisStage.COMPLETE: {
        "message": "Hoàn tất! Cơ đã chuẩn bị xong luận giải.",
        "duration": 0,
    },
}


class ProgressTracker:
    """
    Tracks and reports progress for long-running analysis operations.

    Usage:
        tracker = ProgressTracker(send_message_callback)
        async with tracker.track():
            # Perform analysis stages
            tracker.set_stage(AnalysisStage.CALCULATING)
            # ... do work ...
            tracker.set_stage(AnalysisStage.ANALYZING_ARROWS)
            # ... do work ...
    """

    def __init__(
        self,
        send_message: Callable[[str], None],
        update_message: Optional[Callable[[str], None]] = None,
    ):
        self.send_message = send_message
        self.update_message = update_message
        self.current_stage: Optional[AnalysisStage] = None
        self.message_id: Optional[int] = None
        self._stages_order = [
            AnalysisStage.RECEIVING,
            AnalysisStage.CALCULATING,
            AnalysisStage.ANALYZING_ARROWS,
            AnalysisStage.MAPPING_HOUSES,
            AnalysisStage.CONSULTING_KNOWLEDGE,
            AnalysisStage.SYNTHESIZING,
            AnalysisStage.COMPLETE,
        ]

    def get_stage_message(self, stage: AnalysisStage) -> str:
        """Get the progress message for a stage."""
        return STAGE_CONFIG[stage]["message"]

    def set_stage(self, stage: AnalysisStage):
        """Update to a new progress stage."""
        self.current_stage = stage
        message = self.get_stage_message(stage)

        if self.update_message and self.message_id:
            self.update_message(message)
        else:
            self.message_id = self.send_message(message)

    def get_progress_percent(self) -> int:
        """Calculate overall progress percentage."""
        if not self.current_stage:
            return 0

        try:
            idx = self._stages_order.index(self.current_stage)
            total = len(self._stages_order) - 1
            return int((idx / total) * 100)
        except ValueError:
            return 0

    def get_remaining_time_estimate(self) -> str:
        """Estimate remaining time based on current stage."""
        if not self.current_stage:
            return "khoảng 8 giây"

        try:
            current_idx = self._stages_order.index(self.current_stage)
            remaining_stages = self._stages_order[current_idx:-1]
            total_seconds = sum(
                STAGE_CONFIG[s]["duration"] for s in remaining_stages
            )

            if total_seconds < 1:
                return "sắp xong"
            elif total_seconds < 5:
                return f"khoảng {int(total_seconds)} giây nữa"
            else:
                return f"khoảng {int(total_seconds)} giây"
        except ValueError:
            return "vài giây nữa"

    async def __aenter__(self):
        """Start progress tracking."""
        self.set_stage(AnalysisStage.RECEIVING)
        return self

    async def __aexit__(self, exc_type, exc_val, exc_tb):
        """Complete progress tracking."""
        if not exc_type:
            self.set_stage(AnalysisStage.COMPLETE)


class QuickProgressTracker:
    """
    Simplified tracker for quick operations (Q&A, simple lookups).

    Uses a single "Cơ đang..." message pattern.
    """

    QUICK_MESSAGES = [
        "Cơ đang suy ngẫm...",
        "Cơ đang tra cứu...",
        "Cơ đang tìm câu trả lời phù hợp...",
        "Cơ đang cân nhắc...",
    ]

    def __init__(self, send_message: Callable[[str], None]):
        self.send_message = send_message

    def show_thinking(self):
        """Show a brief thinking message."""
        import random
        message = random.choice(self.QUICK_MESSAGES)
        return self.send_message(message)


class LifeWritingsProgress:
    """
    Progress tracker specifically for life writings (full analysis).

    Implements the 5-stage flow with ~8 second total duration.
    """

    STAGES: List[Dict] = [
        {
            "key": "calculating",
            "message": "Cơ đang tính toán các chỉ số cốt lõi...",
            "description": "Tính Đường đờ, Sứ mệnh, Ngày sinh",
        },
        {
            "key": "arrows",
            "message": "Cơ đang phân tích các mũi tên trong biểu đồ...",
            "description": "Phân tích mũi tên sức mạnh và thách thức",
        },
        {
            "key": "houses",
            "message": "Cơ đang lập bản đồ 13 ngôi nhài...",
            "description": "Ánh xạ Tarot vào 13 ngôi nhài",
        },
        {
            "key": "knowledge",
            "message": "Cơ đang tra cứu ý nghĩa các lá bày...",
            "description": "Tra cứu kho tri thức Tarot",
        },
        {
            "key": "synthesizing",
            "message": "Cơ đang tổng hợp và viết luận giải...",
            "description": "Viết phân tích tổng thể",
        },
    ]

    def __init__(
        self,
        send_message: Callable[[str], None],
        edit_message: Optional[Callable[[str, int], None]] = None,
    ):
        self.send_message = send_message
        self.edit_message = edit_message
        self.current_stage_idx = 0
        self.message_id: Optional[int] = None

    async def start(self):
        """Initialize progress tracking with first stage."""
        self.message_id = await self.send_message(self.STAGES[0]["message"])
        return self.message_id

    async def next_stage(self):
        """Advance to next stage."""
        self.current_stage_idx += 1

        if self.current_stage_idx < len(self.STAGES):
            stage = self.STAGES[self.current_stage_idx]

            if self.edit_message and self.message_id:
                await self.edit_message(stage["message"], self.message_id)
            else:
                self.message_id = await self.send_message(stage["message"])

            return True
        return False

    async def complete(self, final_message: str = "Hoàn tất!"):
        """Mark analysis as complete."""
        if self.edit_message and self.message_id:
            await self.edit_message(final_message, self.message_id)
        else:
            await self.send_message(final_message)

    def get_current_description(self) -> str:
        """Get description of current stage for debugging."""
        if 0 <= self.current_stage_idx < len(self.STAGES):
            return self.STAGES[self.current_stage_idx]["description"]
        return "Hoàn thành"


# =============================================================================
# Inquiry Response Handler
# =============================================================================

INQUIRY_RESPONSES = [
    "Cơ đang phân tích, bạn chờ Cơ thêm chút nhé! Còn khoảng {time_remaining}.",
    "Cơ vẫn đang làm việc, sắp xong rồi... còn khoảng {time_remaining} nữa.",
    "Cơ đang tổng hợp thông tin, bạn đợi Cơ thêm {time_remaining} nhé!",
]


def get_inquiry_response(time_remaining: str) -> str:
    """
    Get a response for "how long" inquiries during analysis.

    Args:
        time_remaining: Estimated time remaining (e.g., "5 giây")

    Returns:
        Personalized Vietnamese response
    """
    import random
    template = random.choice(INQUIRY_RESPONSES)
    return template.format(time_remaining=time_remaining)


# =============================================================================
# Stage Duration Configuration
# =============================================================================

STAGE_DURATIONS = {
    # For simulated delays during testing/demo
    "demo": {
        AnalysisStage.RECEIVING: 0.5,
        AnalysisStage.CALCULATING: 1.0,
        AnalysisStage.ANALYZING_ARROWS: 1.0,
        AnalysisStage.MAPPING_HOUSES: 1.5,
        AnalysisStage.CONSULTING_KNOWLEDGE: 1.5,
        AnalysisStage.SYNTHESIZING: 1.5,
        AnalysisStage.COMPLETE: 0.0,
    },
    # For production (minimal delays)
    "production": {
        AnalysisStage.RECEIVING: 0.1,
        AnalysisStage.CALCULATING: 0.2,
        AnalysisStage.ANALYZING_ARROWS: 0.2,
        AnalysisStage.MAPPING_HOUSES: 0.3,
        AnalysisStage.CONSULTING_KNOWLEDGE: 0.2,
        AnalysisStage.SYNTHESIZING: 0.2,
        AnalysisStage.COMPLETE: 0.0,
    },
}


def get_stage_durations(mode: str = "production") -> Dict[AnalysisStage, float]:
    """Get stage duration configuration."""
    return STAGE_DURATIONS.get(mode, STAGE_DURATIONS["production"])


# =============================================================================
# Convenience Functions
# =============================================================================

def format_thinking_message(context: str = "") -> str:
    """
    Format a thinking message with optional context.

    Examples:
        - "Cơ đang suy ngẫm..."
        - "Cơ đang phân tích biểu đồ của bạn..."
    """
    if context:
        return f"Cơ đang {context}..."
    return "Cơ đang suy ngẫm..."


def format_completion_message(has_analysis: bool = True) -> str:
    """Format completion message."""
    if has_analysis:
        return "Cơ đã hoàn thành phân tích. Đây là luận giải cho bạn:"
    return "Cơ đã chuẩn bị xong."


# =============================================================================
# Test
# =============================================================================

if __name__ == "__main__":
    # Test progress messages
    print("Life Writings Progress Stages:")
    for stage in LifeWritingsProgress.STAGES:
        print(f"  {stage['key']}: {stage['message']}")

    print("\nInquiry Responses:")
    for _ in range(3):
        print(f"  {get_inquiry_response('5 giây')}")

    print("\nProgress Percentages:")
    tracker = ProgressTracker(lambda m: None)
    for stage in AnalysisStage:
        tracker.current_stage = stage
        print(f"  {stage.value}: {tracker.get_progress_percent()}%")

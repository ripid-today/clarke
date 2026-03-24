"""
Telegram message handlers for Co bot.
"""
from __future__ import annotations
import logging
from io import BytesIO

from telegram import Update
from telegram.ext import ContextTypes
from telegram.constants import ChatAction

from bot import orchestrator
from bot.tools import memory

logger = logging.getLogger(__name__)


async def start(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Handle /start command."""
    user = update.effective_user
    if not user:
        return

    # Ensure user exists in DB
    memory.upsert_user(
        telegram_id=user.id,
        username=user.username,
        first_name=user.first_name,
    )

    greeting = (
        f"Xin chào{' ' + user.first_name if user.first_name else ''}! 🌙\n\n"
        "Tôi là **Co** — chuyên gia về Kinh Dịch, Nhân Số Học và Tarot.\n\n"
        "Tôi có thể giúp bạn:\n"
        "• Xem bói vận mệnh và phân tích cuộc đời\n"
        "• Gieo quẻ Kinh Dịch\n"
        "• Rút bài Tarot\n"
        "• Tính số học Pythagorean\n"
        "• Xuất báo cáo phân tích PDF\n\n"
        "Bạn muốn bắt đầu từ đâu?"
    )
    await update.message.reply_text(greeting, parse_mode="Markdown")


async def message(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Handle incoming text messages."""
    user = update.effective_user
    msg = update.message
    if not user or not msg or not msg.text:
        return

    telegram_id = user.id
    user_text = msg.text.strip()

    # Ensure user record exists
    memory.upsert_user(
        telegram_id=telegram_id,
        username=user.username,
        first_name=user.first_name,
    )

    # Save user message to history
    memory.save_message(telegram_id, "user", user_text)

    # Show typing indicator
    await context.bot.send_chat_action(
        chat_id=msg.chat_id,
        action=ChatAction.TYPING,
    )

    try:
        # Run Co agent (Commander-first orchestrator)
        response_text = await orchestrator.run(
            telegram_id=telegram_id,
            user_message=user_text,
            user_first_name=user.first_name,
        )

        # Save assistant response to history
        memory.save_message(telegram_id, "assistant", response_text)

        # Check if a PDF was generated during this run
        pdf_bytes = orchestrator.pop_pdf(telegram_id)

        # Send text response (split if > 4096 chars)
        for chunk in _split_message(response_text):
            await msg.reply_text(chunk, parse_mode="Markdown")

        # Send PDF if present
        if pdf_bytes:
            await context.bot.send_chat_action(
                chat_id=msg.chat_id,
                action=ChatAction.UPLOAD_DOCUMENT,
            )
            filename = f"phan_tich_cuoc_doi.pdf"
            await msg.reply_document(
                document=BytesIO(pdf_bytes),
                filename=filename,
                caption="📄 Báo cáo phân tích cuộc đời của bạn.",
            )

    except Exception as e:
        logger.exception("Error processing message from user %s", telegram_id)
        await msg.reply_text(
            "Co đang bận xử lý, bạn vui lòng thử lại sau nhé 🙏",
            parse_mode="Markdown",
        )


async def error_handler(update: object, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Log errors."""
    logger.error("Update %s caused error %s", update, context.error, exc_info=context.error)


def _split_message(text: str, max_len: int = 4096) -> list[str]:
    """Split long messages into chunks that fit Telegram's limit."""
    if len(text) <= max_len:
        return [text]
    chunks = []
    while text:
        if len(text) <= max_len:
            chunks.append(text)
            break
        # Split at last newline before max_len
        split_at = text.rfind("\n", 0, max_len)
        if split_at == -1:
            split_at = max_len
        chunks.append(text[:split_at])
        text = text[split_at:].lstrip("\n")
    return chunks



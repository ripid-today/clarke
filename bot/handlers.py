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
    logger.info("START handler called")
    user = update.effective_user
    if not user:
        logger.warning("No user in update")
        return

    logger.info("User: %s (%s)", user.first_name, user.id)

    # Ensure user exists in DB
    try:
        memory.upsert_user(
            telegram_id=user.id,
            username=user.username,
            first_name=user.first_name,
        )
    except Exception as e:
        logger.error("Failed to upsert user: %s", e)

    greeting = (
        f"Xin chao{' ' + user.first_name if user.first_name else ''}!\n\n"
        "Toi la Co - chuyen gia ve Kinh Dich, Nhan So Hoc va Tarot.\n\n"
        "Toi co the giup ban:\n"
        "- Xem boi van menh\n"
        "- Gieo que Kinh Dich\n"
        "- Rut bai Tarot\n"
        "- Tinh so hoc\n\n"
        "Ban muon bat dau tu dau?"
    )
    await update.message.reply_text(greeting)


async def message(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Handle incoming text messages."""
    logger.info("MESSAGE handler called")
    user = update.effective_user
    msg = update.message
    if not user or not msg or not msg.text:
        logger.warning("Missing user, msg, or text")
        return

    telegram_id = user.id
    user_text = msg.text.strip()
    logger.info("Message from %s: %s", telegram_id, user_text[:50])

    # Ensure user record exists
    try:
        memory.upsert_user(
            telegram_id=telegram_id,
            username=user.username,
            first_name=user.first_name,
        )
    except Exception as e:
        logger.error("Failed to upsert user: %s", e)

    # Save user message to history
    try:
        memory.save_message(telegram_id, "user", user_text)
    except Exception as e:
        logger.error("Failed to save message: %s", e)

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
        try:
            memory.save_message(telegram_id, "assistant", response_text)
        except Exception as e:
            logger.error("Failed to save response: %s", e)

        # Check if a PDF was generated during this run
        pdf_bytes = orchestrator.pop_pdf(telegram_id)

        # Send text response (split if > 4096 chars)
        for chunk in _split_message(response_text):
            await msg.reply_text(chunk)

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
                caption="Bao cao phan tich cuoc doi cua ban.",
            )

    except Exception as e:
        logger.exception("Error processing message from user %s", telegram_id)
        await msg.reply_text("Co dang ban xu ly, ban vui long thu lai sau nhe.")


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

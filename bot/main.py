"""
Co Telegram Bot — entry point.
Run: python -m bot.main  (from dr_co/ directory)
"""
import asyncio
import logging
from telegram.ext import ApplicationBuilder, CommandHandler, MessageHandler, filters
from bot import config, handlers

logging.basicConfig(
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
    level=logging.INFO,
)
logger = logging.getLogger(__name__)


def main() -> None:
    logger.info("Starting Co bot (model: %s)", config.CLAUDE_MODEL)
    logger.info("Mode: %s", "Webhook" if config.WEBHOOK_URL else "Polling")

    app = (
        ApplicationBuilder()
        .token(config.TELEGRAM_TOKEN)
        .build()
    )

    app.add_handler(CommandHandler("start", handlers.start))
    app.add_handler(
        MessageHandler(filters.TEXT & ~filters.COMMAND, handlers.message)
    )
    app.add_error_handler(handlers.error_handler)

    if config.WEBHOOK_URL:
        logger.info("Webhook URL: %s", config.WEBHOOK_URL)
        logger.info("Webhook path: %s", config.WEBHOOK_PATH)
        logger.info("Port: %d", config.PORT)

        # Python 3.10+ no longer auto-creates an event loop outside async context.
        # PTB's run_webhook() needs one to already exist.
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        app.run_webhook(
            listen="0.0.0.0",
            port=config.PORT,
            url_path=config.WEBHOOK_PATH,
            webhook_url=config.WEBHOOK_URL + config.WEBHOOK_PATH,
            drop_pending_updates=True,
        )
    else:
        logger.info("Co is online. Polling for messages...")
        app.run_polling(drop_pending_updates=True)


if __name__ == "__main__":
    main()

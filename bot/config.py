import os
from pathlib import Path
from dotenv import load_dotenv

# Load .env from project root (one level up from bot/)
ROOT = Path(__file__).parent.parent
load_dotenv(ROOT / ".env")

TELEGRAM_TOKEN: str = os.environ["TELEGRAM_TOKEN"]
ANTHROPIC_API_KEY: str = os.environ["ANTHROPIC_API_KEY"]
SUPABASE_URL: str = os.environ["SUPABASE_URL"]
SUPABASE_ANON_KEY: str = os.environ["SUPABASE_ANON_KEY"]

WEBHOOK_URL: str = os.environ.get("WEBHOOK_URL", "")
PORT: int = int(os.environ.get("PORT", "8443"))
WEBHOOK_PATH: str = f"/{TELEGRAM_TOKEN}"

CLAUDE_MODEL = "claude-haiku-4-5-20251001"
KNOWLEDGE_DIR = ROOT / ".claude" / "knowledge"
AGENT_MEMORY_DIR = ROOT / ".claude" / "agent-memory"
COMMANDER_MD = ROOT / ".claude" / "agents" / "commander.md"
LIBRA_MEMORY = ROOT / ".claude" / "agent-memory" / "libra" / "MEMORY.md"
COMMANDER_MEMORY = ROOT / ".claude" / "agent-memory" / "commander" / "MEMORY.md"

HISTORY_LIMIT = 20
MAX_TOKENS = 4096

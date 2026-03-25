"""
Supabase CRUD for Co's Telegram bot.
Handles: users, person profiles, conversation history.
"""
from __future__ import annotations
from datetime import date, time
from supabase import create_client, Client
from bot import config

_client: Client | None = None


def get_client() -> Client:
    global _client
    if _client is None:
        _client = create_client(config.SUPABASE_URL, config.SUPABASE_ANON_KEY)
    return _client


# ---------------------------------------------------------------------------
# Users
# ---------------------------------------------------------------------------

def upsert_user(telegram_id: int, username: str | None = None, first_name: str | None = None) -> None:
    """Ensure user exists in telegram_users table."""
    data = {"telegram_id": telegram_id}
    if username:
        data["username"] = username
    if first_name:
        data["first_name"] = first_name
    get_client().table("telegram_users").upsert(data, on_conflict="telegram_id").execute()


# ---------------------------------------------------------------------------
# Person profiles
# ---------------------------------------------------------------------------

def get_person(owner_telegram_id: int, name: str) -> dict | None:
    """
    Retrieve a person profile by name (case-insensitive partial match).
    Returns the first match or None.
    """
    result = (
        get_client()
        .table("person_profiles")
        .select("*")
        .eq("owner_telegram_id", owner_telegram_id)
        .ilike("name", f"%{name}%")
        .limit(1)
        .execute()
    )
    return result.data[0] if result.data else None


def save_person(
    owner_telegram_id: int,
    name: str,
    birth_date: str | None = None,
    birth_time: str | None = None,
    notes: str | None = None,
) -> None:
    """
    Upsert a person profile.
    birth_date: 'YYYY-MM-DD' string or None
    birth_time: 'HH:MM' string or None
    """
    data: dict = {
        "owner_telegram_id": owner_telegram_id,
        "name": name,
    }
    if birth_date:
        data["birth_date"] = birth_date
    if birth_time:
        data["birth_time"] = birth_time
    if notes:
        data["notes"] = notes

    get_client().table("person_profiles").upsert(
        data, on_conflict="owner_telegram_id,name"
    ).execute()


def save_life_writing(owner_telegram_id: int, name: str, life_writing_md: str) -> None:
    """
    Save or update the life writing markdown for a person.
    Upserts on owner_telegram_id + name; creates the person record if absent.
    """
    get_client().table("person_profiles").upsert(
        {
            "owner_telegram_id": owner_telegram_id,
            "name": name,
            "life_writing_md": life_writing_md,
        },
        on_conflict="owner_telegram_id,name",
    ).execute()


def list_persons(owner_telegram_id: int) -> list[dict]:
    """List all saved person profiles for a user."""
    result = (
        get_client()
        .table("person_profiles")
        .select("name, birth_date, birth_time, notes")
        .eq("owner_telegram_id", owner_telegram_id)
        .order("name")
        .execute()
    )
    return result.data or []


# ---------------------------------------------------------------------------
# Conversation history
# ---------------------------------------------------------------------------

def get_history(telegram_id: int, limit: int | None = None) -> list[dict]:
    """
    Return conversation history as list of {"role": ..., "content": ...} dicts,
    ordered chronologically (oldest first), suitable for Anthropic messages API.
    """
    n = limit or config.HISTORY_LIMIT
    result = (
        get_client()
        .table("conversations")
        .select("role, content")
        .eq("telegram_id", telegram_id)
        .order("created_at", desc=True)
        .limit(n)
        .execute()
    )
    # Reverse to get chronological order
    rows = list(reversed(result.data or []))
    return [{"role": r["role"], "content": r["content"]} for r in rows]


def save_message(telegram_id: int, role: str, content: str) -> None:
    """Append a message to conversation history."""
    get_client().table("conversations").insert({
        "telegram_id": telegram_id,
        "role": role,
        "content": content,
    }).execute()


def get_recent_conversation(telegram_id: int, limit: int = 10) -> list[dict]:
    """Get the most recent messages for Libra's quality analysis."""
    result = (
        get_client()
        .table("conversations")
        .select("role, content, created_at")
        .eq("telegram_id", telegram_id)
        .order("created_at", desc=True)
        .limit(limit)
        .execute()
    )
    return list(reversed(result.data or []))

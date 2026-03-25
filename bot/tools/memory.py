"""
Supabase CRUD for Co's Telegram bot.
Handles: users, person profiles, conversation history.
"""
from __future__ import annotations
import unicodedata
from datetime import date, time
from supabase import create_client, Client
from bot import config

_client: Client | None = None


def normalize_name(name: str) -> str:
    """Strip Vietnamese diacritics, lowercase, collapse whitespace. 'Nguyễn Văn An' → 'nguyen van an'."""
    nfd = unicodedata.normalize("NFD", name)
    stripped = "".join(ch for ch in nfd if unicodedata.category(ch) != "Mn")
    return " ".join(stripped.lower().split())


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


def find_persons_by_normalized_name(owner_telegram_id: int, name: str) -> list[dict]:
    """
    Return all person records whose normalized_name matches normalize_name(name).
    Case-insensitive and diacritic-insensitive. Used by Workflow 2 (name-only lookup).
    """
    result = (
        get_client()
        .table("person_profiles")
        .select("*")
        .eq("owner_telegram_id", owner_telegram_id)
        .eq("normalized_name", normalize_name(name))
        .execute()
    )
    return result.data or []


def find_persons_by_name_and_date(
    owner_telegram_id: int, name: str, birth_date: str
) -> list[dict]:
    """
    Return all person records matching normalize_name(name) AND exact birth_date.
    birth_date: 'YYYY-MM-DD'. Used by Workflow 1 and Workflow 2 disambiguation.
    """
    result = (
        get_client()
        .table("person_profiles")
        .select("*")
        .eq("owner_telegram_id", owner_telegram_id)
        .eq("normalized_name", normalize_name(name))
        .eq("birth_date", birth_date)
        .execute()
    )
    return result.data or []


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
        "normalized_name": normalize_name(name),
    }
    if birth_date:
        data["birth_date"] = birth_date
    if birth_time:
        data["birth_time"] = birth_time
    if notes:
        data["notes"] = notes

    get_client().table("person_profiles").upsert(
        data, on_conflict="owner_telegram_id,name,birth_date"
    ).execute()


def save_life_writing(
    owner_telegram_id: int, name: str, birth_date: str, life_writing_md: str
) -> None:
    """
    Save or update the life writing markdown for a person.
    Upserts on (owner_telegram_id, name, birth_date). birth_date is required.
    """
    get_client().table("person_profiles").upsert(
        {
            "owner_telegram_id": owner_telegram_id,
            "name": name,
            "normalized_name": normalize_name(name),
            "birth_date": birth_date,
            "life_writing_md": life_writing_md,
        },
        on_conflict="owner_telegram_id,name,birth_date",
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


# ---------------------------------------------------------------------------
# Training pairs (fine-tuning data pipeline — Vistral-7B-Chat target)
# ---------------------------------------------------------------------------

def save_training_pair(
    telegram_id: int,
    session_id: str,
    system_prompt: str,
    user_input: str,
    assistant_output: str,
    retrieved_context: str | None = None,
    lexicon_context: str | None = None,
    quality_score: int | None = None,
    feedback_category: str | None = None,
    is_negative: bool = False,
) -> None:
    """
    Log a training pair to the training_pairs table.
    Positive examples (quality_score >= 80, is_negative=False) are target responses.
    Negative examples (is_negative=True) are failed responses flagged by user feedback.
    """
    data: dict = {
        "telegram_id": telegram_id,
        "session_id": session_id,
        "system_prompt": system_prompt,
        "user_input": user_input,
        "assistant_output": assistant_output,
        "is_negative": is_negative,
    }
    if retrieved_context is not None:
        data["retrieved_context"] = retrieved_context
    if lexicon_context is not None:
        data["lexicon_context"] = lexicon_context
    if quality_score is not None:
        data["quality_score"] = quality_score
    if feedback_category is not None:
        data["feedback_category"] = feedback_category

    get_client().table("training_pairs").insert(data).execute()


def get_training_pairs(
    min_quality: int = 75,
    exclude_negative: bool = False,
    limit: int = 1000,
) -> list[dict]:
    """
    Retrieve training pairs for export to Vistral fine-tuning format.
    min_quality: minimum quality_score to include (applies to positive examples).
    exclude_negative: if True, returns only positive examples.
    """
    query = (
        get_client()
        .table("training_pairs")
        .select("*")
        .order("created_at", desc=False)
        .limit(limit)
    )
    if exclude_negative:
        query = query.eq("is_negative", False)
    if min_quality > 0:
        query = query.gte("quality_score", min_quality)

    result = query.execute()
    return result.data or []

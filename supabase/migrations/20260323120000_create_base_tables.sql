-- Create base tables for Co Telegram Bot
-- This migration must run BEFORE 20260324120000_disable_rls.sql

-- Users table: stores Telegram user info
CREATE TABLE IF NOT EXISTS telegram_users (
    telegram_id BIGINT PRIMARY KEY,
    username TEXT,
    first_name TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Person profiles: stores people that users want analyzed
CREATE TABLE IF NOT EXISTS person_profiles (
    id SERIAL PRIMARY KEY,
    owner_telegram_id BIGINT REFERENCES telegram_users(telegram_id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    normalized_name TEXT NOT NULL,
    birth_date DATE,
    birth_time TIME,
    notes TEXT,
    life_writing_md TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(owner_telegram_id, name, birth_date)
);

-- Conversation history: stores chat messages
CREATE TABLE IF NOT EXISTS conversations (
    id SERIAL PRIMARY KEY,
    telegram_id BIGINT REFERENCES telegram_users(telegram_id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Training pairs: stores data for fine-tuning
CREATE TABLE IF NOT EXISTS training_pairs (
    id SERIAL PRIMARY KEY,
    telegram_id BIGINT REFERENCES telegram_users(telegram_id) ON DELETE CASCADE,
    session_id TEXT NOT NULL,
    system_prompt TEXT NOT NULL,
    user_input TEXT NOT NULL,
    assistant_output TEXT NOT NULL,
    retrieved_context TEXT,
    lexicon_context TEXT,
    quality_score INT,
    feedback_category TEXT,
    is_negative BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- User states: for conversation context/state management
CREATE TABLE IF NOT EXISTS user_states (
    telegram_id BIGINT PRIMARY KEY REFERENCES telegram_users(telegram_id) ON DELETE CASCADE,
    pending_action TEXT,
    missing_param TEXT,
    collected_params JSONB DEFAULT '{}',
    clarification_question TEXT,
    clarification_count INT DEFAULT 0,
    last_message_at TIMESTAMPTZ DEFAULT now(),
    last_clarification_at TIMESTAMPTZ,
    conversation_context JSONB DEFAULT '{}'
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_person_profiles_owner ON person_profiles(owner_telegram_id);
CREATE INDEX IF NOT EXISTS idx_person_profiles_normalized_name ON person_profiles(normalized_name);
CREATE INDEX IF NOT EXISTS idx_conversations_telegram_id ON conversations(telegram_id);
CREATE INDEX IF NOT EXISTS idx_conversations_created_at ON conversations(created_at);
CREATE INDEX IF NOT EXISTS idx_training_pairs_telegram_id ON training_pairs(telegram_id);
CREATE INDEX IF NOT EXISTS idx_training_pairs_session_id ON training_pairs(session_id);
CREATE INDEX IF NOT EXISTS idx_user_states_last_clarification_at ON user_states(last_clarification_at);
CREATE INDEX IF NOT EXISTS idx_user_states_last_message_at ON user_states(last_message_at);

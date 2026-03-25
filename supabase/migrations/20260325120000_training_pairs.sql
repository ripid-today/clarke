-- Training pairs table for Vistral-7B-Chat fine-tuning pipeline
-- Populated by Libra after each session (positive examples: quality >= 80)
-- and on user feedback signals (negative examples: is_negative = true)

CREATE TABLE IF NOT EXISTS training_pairs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  telegram_id BIGINT REFERENCES telegram_users(telegram_id) ON DELETE SET NULL,
  session_id TEXT NOT NULL,                  -- timestamp-based session identifier
  system_prompt TEXT NOT NULL,               -- full RAG system prompt used
  user_input TEXT NOT NULL,                  -- verbatim user message
  assistant_output TEXT NOT NULL,            -- Co's actual response
  retrieved_context TEXT,                    -- what search_knowledge returned
  lexicon_context TEXT,                      -- what search_lexicon returned
  quality_score INTEGER CHECK (quality_score BETWEEN 0 AND 100),
  feedback_category TEXT CHECK (
    feedback_category IN (
      'wrong-term', 'wrong-register', 'missed-context', 'incorrect-interpretation'
    ) OR feedback_category IS NULL
  ),
  is_negative BOOLEAN NOT NULL DEFAULT FALSE, -- TRUE = failed example (user corrected)
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Disable RLS (consistent with project policy)
ALTER TABLE training_pairs DISABLE ROW LEVEL SECURITY;

-- Index for common export queries
CREATE INDEX IF NOT EXISTS idx_training_pairs_quality
  ON training_pairs (quality_score, is_negative, created_at);

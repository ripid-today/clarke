-- ============================================================
-- 002_v2_schema.sql — tracker.ripid.vn v2.0 schema migration
-- Run BEFORE deploying v2 code
-- ============================================================

BEGIN;

-- ── earnings: rename description → name, add type + receiver fields ──

ALTER TABLE earnings RENAME COLUMN description TO name;
UPDATE earnings SET name = '' WHERE name IS NULL;
ALTER TABLE earnings ALTER COLUMN name SET NOT NULL;
ALTER TABLE earnings ALTER COLUMN name SET DEFAULT '';

ALTER TABLE earnings
  ADD COLUMN type TEXT NOT NULL DEFAULT 'regular'
    CHECK (type IN ('regular', 'receivable')),
  ADD COLUMN receiver_type TEXT NOT NULL DEFAULT 'user'
    CHECK (receiver_type IN ('user', 'fund')),
  ADD COLUMN receiver_id UUID;  -- NULL = user themselves; non-null = fund id

-- ── expenses: rename description → name, add sender/receiver fields ──

ALTER TABLE expenses RENAME COLUMN description TO name;
UPDATE expenses SET name = '' WHERE name IS NULL;
ALTER TABLE expenses ALTER COLUMN name SET NOT NULL;
ALTER TABLE expenses ALTER COLUMN name SET DEFAULT '';

ALTER TABLE expenses
  ADD COLUMN sender_type TEXT NOT NULL DEFAULT 'user'
    CHECK (sender_type IN ('user', 'fund')),
  ADD COLUMN sender_id UUID,
  ADD COLUMN receiver_type TEXT NOT NULL DEFAULT 'none'
    CHECK (receiver_type IN ('fund', 'none')),
  ADD COLUMN receiver_id UUID;

-- Back-fill sender_id from user_id for all existing rows
UPDATE expenses SET sender_id = user_id;
ALTER TABLE expenses ALTER COLUMN sender_id SET NOT NULL;

-- Back-fill receiver from fund_id where applicable
UPDATE expenses
  SET receiver_type = 'fund', receiver_id = fund_id
  WHERE fund_id IS NOT NULL;

-- Drop old fund_id column (data is now in receiver_type/receiver_id)
ALTER TABLE expenses DROP COLUMN fund_id;

-- ── Indexes for new query patterns ──
CREATE INDEX IF NOT EXISTS earnings_user_month_type
  ON earnings (user_id, month, type);
CREATE INDEX IF NOT EXISTS expenses_sender
  ON expenses (sender_type, sender_id, month);

COMMIT;

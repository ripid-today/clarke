-- ============================================================
-- 002_v2_schema_rollback.sql — reverses 002_v2_schema.sql
-- Run ONLY if rollback is needed within 24h of migration
-- ============================================================

BEGIN;

-- Restore expenses.fund_id
ALTER TABLE expenses ADD COLUMN fund_id UUID REFERENCES funds(id) ON DELETE SET NULL;
UPDATE expenses SET fund_id = receiver_id WHERE receiver_type = 'fund';
ALTER TABLE expenses
  DROP COLUMN sender_type,
  DROP COLUMN sender_id,
  DROP COLUMN receiver_type,
  DROP COLUMN receiver_id;
ALTER TABLE expenses RENAME COLUMN name TO description;
ALTER TABLE expenses ALTER COLUMN description DROP NOT NULL;

-- Restore earnings
ALTER TABLE earnings
  DROP COLUMN type,
  DROP COLUMN receiver_type,
  DROP COLUMN receiver_id;
ALTER TABLE earnings RENAME COLUMN name TO description;
ALTER TABLE earnings ALTER COLUMN description DROP NOT NULL;

DROP INDEX IF EXISTS earnings_user_month_type;
DROP INDEX IF EXISTS expenses_sender;

COMMIT;

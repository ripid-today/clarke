-- Change unique constraint from (owner_telegram_id, name)
-- to (owner_telegram_id, name, birth_date) to allow same name + different dates.
-- Add normalized_name column for diacritic-stripped lookups.

-- Step 1: Dynamically drop the existing 2-column unique constraint on (owner_telegram_id, name)
DO $$
DECLARE
  cname text;
BEGIN
  SELECT conname INTO cname
  FROM pg_constraint
  WHERE conrelid = 'person_profiles'::regclass
    AND contype = 'u'
    AND conkey::int[] = ARRAY(
      SELECT attnum FROM pg_attribute
      WHERE attrelid = 'person_profiles'::regclass
        AND attname IN ('owner_telegram_id', 'name')
      ORDER BY attnum
    )::int[];
  IF cname IS NOT NULL THEN
    EXECUTE 'ALTER TABLE person_profiles DROP CONSTRAINT ' || quote_ident(cname);
  END IF;
END $$;

-- Step 2: Add normalized_name column for fast diacritic-insensitive lookups
ALTER TABLE person_profiles
  ADD COLUMN IF NOT EXISTS normalized_name TEXT;

-- Step 3: Backfill — lower() only; Python normalize_name corrects diacritics after deploy
UPDATE person_profiles SET normalized_name = lower(name) WHERE normalized_name IS NULL;

-- Step 4: New unique constraint includes birth_date
ALTER TABLE person_profiles
  ADD CONSTRAINT person_profiles_owner_name_date_key
  UNIQUE (owner_telegram_id, name, birth_date);

-- Step 5: Index for fast normalized_name lookups
CREATE INDEX IF NOT EXISTS idx_person_profiles_normalized_name
  ON person_profiles (owner_telegram_id, normalized_name);

-- Step 6: RLS off (consistent with project policy)
ALTER TABLE person_profiles DISABLE ROW LEVEL SECURITY;

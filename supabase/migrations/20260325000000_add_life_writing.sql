-- Add life_writing_md column to person_profiles
-- Stores the full markdown narrative of a person's life analysis
ALTER TABLE person_profiles ADD COLUMN IF NOT EXISTS life_writing_md TEXT;

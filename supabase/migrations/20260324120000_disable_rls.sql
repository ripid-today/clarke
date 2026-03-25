-- Disable Row-Level Security on Co bot tables
ALTER TABLE telegram_users DISABLE ROW LEVEL SECURITY;
ALTER TABLE person_profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE conversations DISABLE ROW LEVEL SECURITY;

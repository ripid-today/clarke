-- Fix RLS policies - disable on all tables
-- Previous migration ran before all tables existed

DO $$
BEGIN
    -- Disable RLS on telegram_users
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'telegram_users') THEN
        ALTER TABLE telegram_users DISABLE ROW LEVEL SECURITY;
        RAISE NOTICE 'Disabled RLS on telegram_users';
    END IF;

    -- Disable RLS on person_profiles
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'person_profiles') THEN
        ALTER TABLE person_profiles DISABLE ROW LEVEL SECURITY;
        RAISE NOTICE 'Disabled RLS on person_profiles';
    END IF;

    -- Disable RLS on conversations
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'conversations') THEN
        ALTER TABLE conversations DISABLE ROW LEVEL SECURITY;
        RAISE NOTICE 'Disabled RLS on conversations';
    END IF;

    -- Disable RLS on user_states
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'user_states') THEN
        ALTER TABLE user_states DISABLE ROW LEVEL SECURITY;
        RAISE NOTICE 'Disabled RLS on user_states';
    END IF;

    -- Disable RLS on training_pairs
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'training_pairs') THEN
        ALTER TABLE training_pairs DISABLE ROW LEVEL SECURITY;
        RAISE NOTICE 'Disabled RLS on training_pairs';
    END IF;
END $$;

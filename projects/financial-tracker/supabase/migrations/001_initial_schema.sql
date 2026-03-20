-- ============================================================
-- PROFILES (mirrors auth.users, stores display_name)
-- ============================================================
CREATE TABLE profiles (
  id            UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email         TEXT NOT NULL,
  display_name  TEXT NOT NULL,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_read_own_profile"   ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "users_update_own_profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Auto-create profile when a user signs up
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();


-- ============================================================
-- EARNINGS
-- ============================================================
CREATE TABLE earnings (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  month       TEXT NOT NULL,
  amount_vnd  INTEGER NOT NULL CHECK (amount_vnd > 0),
  status      TEXT NOT NULL CHECK (status IN ('planned', 'actual')),
  description TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX earnings_user_month ON earnings (user_id, month);

ALTER TABLE earnings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_read_own_earnings"   ON earnings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "users_insert_own_earnings" ON earnings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "users_update_own_earnings" ON earnings FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "users_delete_own_earnings" ON earnings FOR DELETE USING (auth.uid() = user_id);


-- ============================================================
-- FUNDS (table only — SELECT policy deferred until fund_members exists)
-- ============================================================
CREATE TABLE funds (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name        TEXT NOT NULL,
  created_by  UUID REFERENCES auth.users(id) ON DELETE RESTRICT NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE funds ENABLE ROW LEVEL SECURITY;

-- NOTE: fund_members_can_read_fund policy is added AFTER fund_members table is created below.
CREATE POLICY "fund_creator_can_update" ON funds FOR UPDATE USING (auth.uid() = created_by);


-- ============================================================
-- FUND MEMBERS
-- ============================================================
CREATE TABLE fund_members (
  fund_id   UUID REFERENCES funds(id) ON DELETE CASCADE NOT NULL,
  user_id   UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  added_at  TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (fund_id, user_id)
);

ALTER TABLE fund_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_see_own_memberships" ON fund_members FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "fund_creator_can_add_members" ON fund_members FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM funds f WHERE f.id = fund_members.fund_id AND f.created_by = auth.uid()));


-- ============================================================
-- FUNDS SELECT POLICY (deferred — fund_members now exists)
-- ============================================================
CREATE POLICY "fund_members_can_read_fund" ON funds FOR SELECT
  USING (EXISTS (SELECT 1 FROM fund_members fm WHERE fm.fund_id = funds.id AND fm.user_id = auth.uid()));


-- ============================================================
-- EXPENSES (personal + fund, unified -- fund_id NULL means personal)
-- ============================================================
CREATE TABLE expenses (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  fund_id     UUID REFERENCES funds(id) ON DELETE SET NULL,
  month       TEXT NOT NULL,
  amount_vnd  INTEGER NOT NULL CHECK (amount_vnd > 0),
  status      TEXT NOT NULL CHECK (status IN ('planned', 'actual')),
  description TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX expenses_user_month ON expenses (user_id, month);
CREATE INDEX expenses_fund_month ON expenses (fund_id, month) WHERE fund_id IS NOT NULL;

ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_read_own_expenses"   ON expenses FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "users_insert_own_expenses" ON expenses FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "users_update_own_expenses" ON expenses FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "users_delete_own_expenses" ON expenses FOR DELETE USING (auth.uid() = user_id);


-- ============================================================
-- UPDATED_AT TRIGGERS
-- ============================================================
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER earnings_updated_at BEFORE UPDATE ON earnings FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER expenses_updated_at BEFORE UPDATE ON expenses FOR EACH ROW EXECUTE FUNCTION set_updated_at();

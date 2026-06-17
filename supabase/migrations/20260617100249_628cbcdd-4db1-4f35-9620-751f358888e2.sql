
-- ============================================
-- KAAL Heritage — Phase 1 schema
-- ============================================

-- ===== Profiles =====
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profiles_select_own" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- ===== Coin balance =====
CREATE TABLE public.user_coins (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  balance INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT non_negative_balance CHECK (balance >= 0)
);
GRANT SELECT ON public.user_coins TO authenticated;
GRANT ALL ON public.user_coins TO service_role;
ALTER TABLE public.user_coins ENABLE ROW LEVEL SECURITY;
CREATE POLICY "coins_select_own" ON public.user_coins FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- ===== Append-only ledger =====
CREATE TABLE public.coin_ledger (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  delta INTEGER NOT NULL,
  reason TEXT NOT NULL,
  trail_slug TEXT,
  site_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.coin_ledger TO authenticated;
GRANT ALL ON public.coin_ledger TO service_role;
ALTER TABLE public.coin_ledger ENABLE ROW LEVEL SECURITY;
CREATE POLICY "ledger_select_own" ON public.coin_ledger FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE INDEX coin_ledger_user_idx ON public.coin_ledger(user_id, created_at DESC);

-- ===== Heritage sites (checkpoints) =====
CREATE TABLE public.heritage_sites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trail_slug TEXT NOT NULL,
  stop_index INTEGER NOT NULL,
  name TEXT NOT NULL,
  place TEXT NOT NULL,
  lat DOUBLE PRECISION NOT NULL,
  lng DOUBLE PRECISION NOT NULL,
  radius_m INTEGER NOT NULL DEFAULT 75,
  coin_reward INTEGER NOT NULL DEFAULT 25,
  UNIQUE (trail_slug, stop_index)
);
GRANT SELECT ON public.heritage_sites TO authenticated, anon;
GRANT ALL ON public.heritage_sites TO service_role;
ALTER TABLE public.heritage_sites ENABLE ROW LEVEL SECURITY;
CREATE POLICY "sites_public_read" ON public.heritage_sites FOR SELECT TO authenticated, anon USING (true);

-- ===== Check-in progress =====
CREATE TABLE public.trail_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  site_id UUID NOT NULL REFERENCES public.heritage_sites(id) ON DELETE CASCADE,
  trail_slug TEXT NOT NULL,
  checked_in_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  distance_m INTEGER,
  method TEXT NOT NULL DEFAULT 'gps',
  UNIQUE (user_id, site_id)
);
GRANT SELECT ON public.trail_progress TO authenticated;
GRANT ALL ON public.trail_progress TO service_role;
ALTER TABLE public.trail_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "progress_select_own" ON public.trail_progress FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE INDEX trail_progress_user_trail_idx ON public.trail_progress(user_id, trail_slug);

-- ===== Achievements =====
CREATE TABLE public.achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  code TEXT NOT NULL,
  unlocked_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, code)
);
GRANT SELECT ON public.achievements TO authenticated;
GRANT ALL ON public.achievements TO service_role;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "achievements_select_own" ON public.achievements FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- ===== Rewards catalog =====
CREATE TABLE public.rewards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  coins_required INTEGER NOT NULL,
  image_emoji TEXT,
  stock INTEGER,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.rewards TO authenticated, anon;
GRANT ALL ON public.rewards TO service_role;
ALTER TABLE public.rewards ENABLE ROW LEVEL SECURITY;
CREATE POLICY "rewards_public_read" ON public.rewards FOR SELECT TO authenticated, anon USING (active = true);

-- ===== Redemptions =====
CREATE TABLE public.redemptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reward_id UUID NOT NULL REFERENCES public.rewards(id),
  reward_code TEXT NOT NULL,
  coins_spent INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.redemptions TO authenticated;
GRANT ALL ON public.redemptions TO service_role;
ALTER TABLE public.redemptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "redemptions_select_own" ON public.redemptions FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- ===== Trigger: bootstrap profile + coin row on signup =====
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  INSERT INTO public.user_coins (user_id, balance) VALUES (NEW.id, 0);
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ===== Atomic check-in RPC (server-side distance + coin award) =====
CREATE OR REPLACE FUNCTION public.checkin_at_site(
  _site_id UUID,
  _lat DOUBLE PRECISION,
  _lng DOUBLE PRECISION,
  _force BOOLEAN DEFAULT FALSE
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  _uid UUID := auth.uid();
  _site public.heritage_sites%ROWTYPE;
  _dist DOUBLE PRECISION;
  _earned INTEGER;
  _already BOOLEAN;
  _trail_total INTEGER;
  _trail_done INTEGER;
  _new_balance INTEGER;
BEGIN
  IF _uid IS NULL THEN
    RAISE EXCEPTION 'auth_required';
  END IF;

  SELECT * INTO _site FROM public.heritage_sites WHERE id = _site_id;
  IF NOT FOUND THEN RAISE EXCEPTION 'site_not_found'; END IF;

  SELECT EXISTS (SELECT 1 FROM public.trail_progress WHERE user_id = _uid AND site_id = _site_id) INTO _already;
  IF _already THEN
    SELECT balance INTO _new_balance FROM public.user_coins WHERE user_id = _uid;
    RETURN jsonb_build_object('ok', false, 'reason', 'already_checked_in', 'balance', _new_balance);
  END IF;

  -- Haversine distance in meters
  _dist := 2 * 6371000 * asin(sqrt(
    sin(radians((_lat - _site.lat) / 2)) ^ 2 +
    cos(radians(_site.lat)) * cos(radians(_lat)) *
    sin(radians((_lng - _site.lng) / 2)) ^ 2
  ));

  IF NOT _force AND _dist > _site.radius_m THEN
    RETURN jsonb_build_object('ok', false, 'reason', 'too_far', 'distance_m', round(_dist)::int, 'required_m', _site.radius_m);
  END IF;

  INSERT INTO public.trail_progress (user_id, site_id, trail_slug, lat, lng, distance_m, method)
  VALUES (_uid, _site_id, _site.trail_slug, _lat, _lng, round(_dist)::int, CASE WHEN _force THEN 'demo' ELSE 'gps' END);

  _earned := _site.coin_reward;

  UPDATE public.user_coins
  SET balance = balance + _earned, updated_at = now()
  WHERE user_id = _uid
  RETURNING balance INTO _new_balance;

  INSERT INTO public.coin_ledger (user_id, delta, reason, trail_slug, site_id)
  VALUES (_uid, _earned, 'checkin', _site.trail_slug, _site_id);

  -- First Footsteps achievement
  INSERT INTO public.achievements (user_id, code) VALUES (_uid, 'first_footsteps')
  ON CONFLICT DO NOTHING;

  -- Trail complete?
  SELECT COUNT(*) INTO _trail_total FROM public.heritage_sites WHERE trail_slug = _site.trail_slug;
  SELECT COUNT(*) INTO _trail_done FROM public.trail_progress WHERE user_id = _uid AND trail_slug = _site.trail_slug;

  IF _trail_done = _trail_total THEN
    UPDATE public.user_coins SET balance = balance + 100, updated_at = now()
    WHERE user_id = _uid RETURNING balance INTO _new_balance;
    INSERT INTO public.coin_ledger (user_id, delta, reason, trail_slug)
    VALUES (_uid, 100, 'trail_complete', _site.trail_slug);
    INSERT INTO public.achievements (user_id, code) VALUES (_uid, 'trail_master')
    ON CONFLICT DO NOTHING;
    _earned := _earned + 100;
  END IF;

  RETURN jsonb_build_object(
    'ok', true,
    'earned', _earned,
    'balance', _new_balance,
    'distance_m', round(_dist)::int,
    'trail_done', _trail_done,
    'trail_total', _trail_total,
    'trail_complete', _trail_done = _trail_total
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.checkin_at_site(UUID, DOUBLE PRECISION, DOUBLE PRECISION, BOOLEAN) TO authenticated;

-- ===== Atomic redeem RPC =====
CREATE OR REPLACE FUNCTION public.redeem_reward(_reward_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  _uid UUID := auth.uid();
  _reward public.rewards%ROWTYPE;
  _balance INTEGER;
  _new_balance INTEGER;
BEGIN
  IF _uid IS NULL THEN RAISE EXCEPTION 'auth_required'; END IF;

  SELECT * INTO _reward FROM public.rewards WHERE id = _reward_id AND active = true;
  IF NOT FOUND THEN RAISE EXCEPTION 'reward_not_found'; END IF;

  SELECT balance INTO _balance FROM public.user_coins WHERE user_id = _uid FOR UPDATE;
  IF _balance < _reward.coins_required THEN
    RETURN jsonb_build_object('ok', false, 'reason', 'insufficient_coins', 'balance', _balance, 'required', _reward.coins_required);
  END IF;

  UPDATE public.user_coins SET balance = balance - _reward.coins_required, updated_at = now()
  WHERE user_id = _uid RETURNING balance INTO _new_balance;

  INSERT INTO public.coin_ledger (user_id, delta, reason)
  VALUES (_uid, -_reward.coins_required, 'redeem_' || _reward.code);

  INSERT INTO public.redemptions (user_id, reward_id, reward_code, coins_spent)
  VALUES (_uid, _reward.id, _reward.code, _reward.coins_required);

  RETURN jsonb_build_object('ok', true, 'balance', _new_balance, 'reward_title', _reward.title);
END;
$$;

GRANT EXECUTE ON FUNCTION public.redeem_reward(UUID) TO authenticated;

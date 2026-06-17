
CREATE TABLE public.user_interests (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  categories TEXT[] NOT NULL DEFAULT '{}',
  regions TEXT[] NOT NULL DEFAULT '{}',
  onboarded BOOLEAN NOT NULL DEFAULT false,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_interests TO authenticated;
GRANT ALL ON public.user_interests TO service_role;
ALTER TABLE public.user_interests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "interests_select_own" ON public.user_interests FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "interests_insert_own" ON public.user_interests FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "interests_update_own" ON public.user_interests FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE public.user_saves (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  item_type TEXT NOT NULL CHECK (item_type IN ('story','trail','site')),
  item_id TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, item_type, item_id)
);
GRANT SELECT, INSERT, DELETE ON public.user_saves TO authenticated;
GRANT ALL ON public.user_saves TO service_role;
ALTER TABLE public.user_saves ENABLE ROW LEVEL SECURITY;
CREATE POLICY "saves_select_own" ON public.user_saves FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "saves_insert_own" ON public.user_saves FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "saves_delete_own" ON public.user_saves FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE INDEX user_saves_user_idx ON public.user_saves(user_id);

CREATE TABLE public.library_story_bodies (
  story_id text PRIMARY KEY,
  body text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.library_story_bodies TO anon, authenticated;
GRANT ALL ON public.library_story_bodies TO service_role;
ALTER TABLE public.library_story_bodies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Story bodies are public" ON public.library_story_bodies FOR SELECT TO anon, authenticated USING (true);
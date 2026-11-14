CREATE TABLE public.translation_cache (
  lang text NOT NULL,
  source_hash text NOT NULL,
  translated text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (lang, source_hash)
);
GRANT ALL ON public.translation_cache TO service_role;
ALTER TABLE public.translation_cache ENABLE ROW LEVEL SECURITY;
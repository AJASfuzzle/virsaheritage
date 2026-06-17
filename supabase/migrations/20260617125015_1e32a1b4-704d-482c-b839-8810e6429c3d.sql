
-- ============ Extend profiles ============
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS username TEXT UNIQUE,
  ADD COLUMN IF NOT EXISTS bio TEXT,
  ADD COLUMN IF NOT EXISTS interests TEXT[] DEFAULT '{}'::TEXT[],
  ADD COLUMN IF NOT EXISTS location TEXT,
  ADD COLUMN IF NOT EXISTS heritage_origins TEXT[] DEFAULT '{}'::TEXT[],
  ADD COLUMN IF NOT EXISTS languages TEXT[] DEFAULT '{}'::TEXT[],
  ADD COLUMN IF NOT EXISTS social_links JSONB DEFAULT '{}'::JSONB,
  ADD COLUMN IF NOT EXISTS banner_url TEXT,
  ADD COLUMN IF NOT EXISTS website TEXT;

-- Allow anyone to read public profile fields
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Profiles are viewable by everyone"
  ON public.profiles FOR SELECT
  USING (true);

GRANT SELECT ON public.profiles TO anon;

-- ============ echo_posts ============
CREATE TABLE IF NOT EXISTS public.echo_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT,
  caption TEXT,
  story TEXT,
  media JSONB NOT NULL DEFAULT '[]'::JSONB,
  media_type TEXT NOT NULL DEFAULT 'text', -- 'photo' | 'video' | 'text' | 'mixed'
  category TEXT,
  state TEXT,
  location TEXT,
  tags TEXT[] DEFAULT '{}'::TEXT[],
  likes_count INTEGER NOT NULL DEFAULT 0,
  comments_count INTEGER NOT NULL DEFAULT 0,
  saves_count INTEGER NOT NULL DEFAULT 0,
  submitted_to_library BOOLEAN NOT NULL DEFAULT false,
  submitted_to_library_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.echo_posts TO authenticated;
GRANT SELECT ON public.echo_posts TO anon;
GRANT ALL ON public.echo_posts TO service_role;

ALTER TABLE public.echo_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Echo posts are viewable by everyone"
  ON public.echo_posts FOR SELECT USING (true);

CREATE POLICY "Users can insert their own posts"
  ON public.echo_posts FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update their own posts"
  ON public.echo_posts FOR UPDATE TO authenticated
  USING (auth.uid() = author_id);

CREATE POLICY "Users can delete their own posts"
  ON public.echo_posts FOR DELETE TO authenticated
  USING (auth.uid() = author_id);

CREATE INDEX IF NOT EXISTS echo_posts_author_idx ON public.echo_posts(author_id);
CREATE INDEX IF NOT EXISTS echo_posts_created_idx ON public.echo_posts(created_at DESC);
CREATE INDEX IF NOT EXISTS echo_posts_category_idx ON public.echo_posts(category);
CREATE INDEX IF NOT EXISTS echo_posts_library_idx ON public.echo_posts(submitted_to_library) WHERE submitted_to_library = true;

-- ============ echo_likes ============
CREATE TABLE IF NOT EXISTS public.echo_likes (
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  post_id UUID NOT NULL REFERENCES public.echo_posts(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, post_id)
);
GRANT SELECT, INSERT, DELETE ON public.echo_likes TO authenticated;
GRANT SELECT ON public.echo_likes TO anon;
GRANT ALL ON public.echo_likes TO service_role;
ALTER TABLE public.echo_likes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Likes viewable by everyone" ON public.echo_likes FOR SELECT USING (true);
CREATE POLICY "Users like as self" ON public.echo_likes FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users unlike as self" ON public.echo_likes FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- ============ echo_saves ============
CREATE TABLE IF NOT EXISTS public.echo_saves (
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  post_id UUID NOT NULL REFERENCES public.echo_posts(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, post_id)
);
GRANT SELECT, INSERT, DELETE ON public.echo_saves TO authenticated;
GRANT ALL ON public.echo_saves TO service_role;
ALTER TABLE public.echo_saves ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Saves visible to self" ON public.echo_saves FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Save as self" ON public.echo_saves FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Unsave as self" ON public.echo_saves FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- ============ echo_comments ============
CREATE TABLE IF NOT EXISTS public.echo_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES public.echo_posts(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  parent_comment_id UUID REFERENCES public.echo_comments(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.echo_comments TO authenticated;
GRANT SELECT ON public.echo_comments TO anon;
GRANT ALL ON public.echo_comments TO service_role;
ALTER TABLE public.echo_comments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Comments viewable by everyone" ON public.echo_comments FOR SELECT USING (true);
CREATE POLICY "Comment as self" ON public.echo_comments FOR INSERT TO authenticated WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Edit own comment" ON public.echo_comments FOR UPDATE TO authenticated USING (auth.uid() = author_id);
CREATE POLICY "Delete own comment" ON public.echo_comments FOR DELETE TO authenticated USING (auth.uid() = author_id);
CREATE INDEX IF NOT EXISTS echo_comments_post_idx ON public.echo_comments(post_id, created_at);

-- ============ echo_follows (future-ready) ============
CREATE TABLE IF NOT EXISTS public.echo_follows (
  follower_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  following_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (follower_id, following_id),
  CHECK (follower_id <> following_id)
);
GRANT SELECT, INSERT, DELETE ON public.echo_follows TO authenticated;
GRANT SELECT ON public.echo_follows TO anon;
GRANT ALL ON public.echo_follows TO service_role;
ALTER TABLE public.echo_follows ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Follows viewable by everyone" ON public.echo_follows FOR SELECT USING (true);
CREATE POLICY "Follow as self" ON public.echo_follows FOR INSERT TO authenticated WITH CHECK (auth.uid() = follower_id);
CREATE POLICY "Unfollow as self" ON public.echo_follows FOR DELETE TO authenticated USING (auth.uid() = follower_id);

-- ============ Counter triggers ============
CREATE OR REPLACE FUNCTION public.echo_likes_count_trg() RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.echo_posts SET likes_count = likes_count + 1 WHERE id = NEW.post_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.echo_posts SET likes_count = GREATEST(likes_count - 1, 0) WHERE id = OLD.post_id;
  END IF;
  RETURN NULL;
END $$;
DROP TRIGGER IF EXISTS echo_likes_count ON public.echo_likes;
CREATE TRIGGER echo_likes_count AFTER INSERT OR DELETE ON public.echo_likes FOR EACH ROW EXECUTE FUNCTION public.echo_likes_count_trg();

CREATE OR REPLACE FUNCTION public.echo_saves_count_trg() RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.echo_posts SET saves_count = saves_count + 1 WHERE id = NEW.post_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.echo_posts SET saves_count = GREATEST(saves_count - 1, 0) WHERE id = OLD.post_id;
  END IF;
  RETURN NULL;
END $$;
DROP TRIGGER IF EXISTS echo_saves_count ON public.echo_saves;
CREATE TRIGGER echo_saves_count AFTER INSERT OR DELETE ON public.echo_saves FOR EACH ROW EXECUTE FUNCTION public.echo_saves_count_trg();

CREATE OR REPLACE FUNCTION public.echo_comments_count_trg() RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.echo_posts SET comments_count = comments_count + 1 WHERE id = NEW.post_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.echo_posts SET comments_count = GREATEST(comments_count - 1, 0) WHERE id = OLD.post_id;
  END IF;
  RETURN NULL;
END $$;
DROP TRIGGER IF EXISTS echo_comments_count ON public.echo_comments;
CREATE TRIGGER echo_comments_count AFTER INSERT OR DELETE ON public.echo_comments FOR EACH ROW EXECUTE FUNCTION public.echo_comments_count_trg();

-- updated_at trigger for posts
CREATE OR REPLACE FUNCTION public.echo_posts_touch() RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END $$;
DROP TRIGGER IF EXISTS echo_posts_touch ON public.echo_posts;
CREATE TRIGGER echo_posts_touch BEFORE UPDATE ON public.echo_posts FOR EACH ROW EXECUTE FUNCTION public.echo_posts_touch();

-- ============ Storage policies for echoes-media bucket ============
CREATE POLICY "echoes-media read for signed-in"
  ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'echoes-media');

CREATE POLICY "echoes-media upload own folder"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'echoes-media' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "echoes-media delete own"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'echoes-media' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "echoes-media update own"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'echoes-media' AND auth.uid()::text = (storage.foldername(name))[1]);

DROP POLICY IF EXISTS "Story bodies are public" ON public.library_story_bodies;
REVOKE SELECT ON public.library_story_bodies FROM anon, authenticated;

DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Profiles viewable by members" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Echo posts are viewable by everyone" ON public.echo_posts;
CREATE POLICY "Echo posts viewable by members" ON public.echo_posts FOR SELECT TO authenticated USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Comments viewable by everyone" ON public.echo_comments;
CREATE POLICY "Comments viewable by members" ON public.echo_comments FOR SELECT TO authenticated USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Likes viewable by everyone" ON public.echo_likes;
CREATE POLICY "Likes viewable by members" ON public.echo_likes FOR SELECT TO authenticated USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Follows viewable by everyone" ON public.echo_follows;
CREATE POLICY "Follows viewable by members" ON public.echo_follows FOR SELECT TO authenticated USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "echoes-media read for signed-in" ON storage.objects;
CREATE POLICY "echoes-media read own" ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'echoes-media' AND (storage.foldername(name))[1] = (select auth.uid()::text));
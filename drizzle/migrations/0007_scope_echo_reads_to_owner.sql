DROP POLICY IF EXISTS "Likes viewable by members" ON public.echo_likes;
CREATE POLICY "See own likes" ON public.echo_likes FOR SELECT TO authenticated USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Echo posts viewable by members" ON public.echo_posts;
CREATE POLICY "See own posts" ON public.echo_posts FOR SELECT TO authenticated USING (auth.uid() = author_id);
DROP POLICY IF EXISTS "Comments viewable by members" ON public.echo_comments;
CREATE POLICY "See own comments" ON public.echo_comments FOR SELECT TO authenticated USING (auth.uid() = author_id);
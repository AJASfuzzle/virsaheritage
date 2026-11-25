DROP POLICY IF EXISTS "Profiles viewable by members" ON public.profiles;
DROP POLICY IF EXISTS "Follows viewable by members" ON public.echo_follows;
CREATE POLICY "See own follows" ON public.echo_follows FOR SELECT TO authenticated
  USING (auth.uid() = follower_id OR auth.uid() = following_id);

CREATE OR REPLACE FUNCTION public.echo_member_cards(_ids uuid[])
RETURNS TABLE(id uuid, full_name text, avatar_url text, username text)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT p.id, p.full_name, p.avatar_url, p.username FROM public.profiles p
  WHERE auth.uid() IS NOT NULL AND p.id = ANY(_ids) AND cardinality(_ids) <= 200
$$;
REVOKE ALL ON FUNCTION public.echo_member_cards(uuid[]) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.echo_member_cards(uuid[]) TO authenticated;

CREATE OR REPLACE FUNCTION public.echo_follow_counts(_uid uuid)
RETURNS TABLE(followers bigint, following bigint)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT (SELECT count(*) FROM public.echo_follows WHERE following_id = _uid),
         (SELECT count(*) FROM public.echo_follows WHERE follower_id = _uid)
$$;
REVOKE ALL ON FUNCTION public.echo_follow_counts(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.echo_follow_counts(uuid) TO authenticated;
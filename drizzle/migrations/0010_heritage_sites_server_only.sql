DROP POLICY IF EXISTS "sites_public_read" ON public.heritage_sites;
REVOKE SELECT ON public.heritage_sites FROM anon, authenticated;
GRANT ALL ON public.heritage_sites TO service_role;
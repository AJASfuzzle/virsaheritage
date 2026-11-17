CREATE TABLE public.camera_status (id int PRIMARY KEY DEFAULT 1 CHECK (id = 1), last_seen timestamptz, preview_until timestamptz, preview_jpeg text, preview_updated_at timestamptz);
INSERT INTO public.camera_status (id) VALUES (1) ON CONFLICT DO NOTHING;
GRANT SELECT ON public.camera_status TO anon, authenticated;
GRANT ALL ON public.camera_status TO service_role;
ALTER TABLE public.camera_status ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Camera status is public" ON public.camera_status FOR SELECT TO anon, authenticated USING (true);
CREATE OR REPLACE FUNCTION public.virsa_cam_request_preview() RETURNS void LANGUAGE sql SECURITY DEFINER SET search_path = public AS $$
  UPDATE public.camera_status SET preview_until = now() + interval '15 seconds' WHERE id = 1;
$$;
REVOKE ALL ON FUNCTION public.virsa_cam_request_preview() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.virsa_cam_request_preview() TO anon, authenticated;
ALTER PUBLICATION supabase_realtime ADD TABLE public.camera_status;
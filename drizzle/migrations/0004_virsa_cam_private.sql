CREATE TABLE public.camera_devices (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), device_key_hash text NOT NULL UNIQUE, owner_user_id uuid, name text NOT NULL DEFAULT 'VIRSA Cam', paired_at timestamptz);
GRANT SELECT ON public.camera_devices TO authenticated;
GRANT ALL ON public.camera_devices TO service_role;
ALTER TABLE public.camera_devices ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Owners see their device" ON public.camera_devices FOR SELECT TO authenticated USING (owner_user_id = auth.uid());

CREATE OR REPLACE FUNCTION public.owns_virsa_cam(_uid uuid) RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.camera_devices WHERE owner_user_id = _uid)
$$;
REVOKE ALL ON FUNCTION public.owns_virsa_cam(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.owns_virsa_cam(uuid) TO authenticated;

-- camera_status: owner only
DROP POLICY "Camera status is public" ON public.camera_status;
REVOKE ALL ON public.camera_status FROM anon;
CREATE POLICY "Device owner sees status" ON public.camera_status FOR SELECT TO authenticated USING (public.owns_virsa_cam(auth.uid()));

CREATE OR REPLACE FUNCTION public.virsa_cam_request_preview() RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF auth.uid() IS NULL OR NOT public.owns_virsa_cam(auth.uid()) THEN RAISE EXCEPTION 'not_owner'; END IF;
  UPDATE public.camera_status SET preview_until = now() + interval '15 seconds' WHERE id = 1;
END $$;
REVOKE ALL ON FUNCTION public.virsa_cam_request_preview() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.virsa_cam_request_preview() TO authenticated;

CREATE OR REPLACE FUNCTION public.virsa_cam_stop_preview() RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF auth.uid() IS NULL OR NOT public.owns_virsa_cam(auth.uid()) THEN RAISE EXCEPTION 'not_owner'; END IF;
  UPDATE public.camera_status SET preview_until = NULL, preview_jpeg = NULL, preview_updated_at = NULL WHERE id = 1;
END $$;
REVOKE ALL ON FUNCTION public.virsa_cam_stop_preview() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.virsa_cam_stop_preview() TO authenticated;

-- camera_requests: owner only, tied to user
ALTER TABLE public.camera_requests ADD COLUMN user_id uuid DEFAULT auth.uid(), ADD COLUMN capture_id uuid;
DROP POLICY "Anyone can request a pending capture" ON public.camera_requests;
REVOKE ALL ON public.camera_requests FROM anon;
GRANT SELECT, INSERT ON public.camera_requests TO authenticated;
CREATE POLICY "Owner requests a capture" ON public.camera_requests FOR INSERT TO authenticated WITH CHECK (status = 'pending' AND user_id = auth.uid() AND public.owns_virsa_cam(auth.uid()));
CREATE POLICY "See own requests" ON public.camera_requests FOR SELECT TO authenticated USING (user_id = auth.uid());

-- captures + messages: private
ALTER TABLE public.captures ADD COLUMN user_id uuid;
DROP POLICY "Captures are public" ON public.captures;
REVOKE ALL ON public.captures FROM anon;
CREATE POLICY "See own captures" ON public.captures FOR SELECT TO authenticated USING (user_id = auth.uid());

ALTER TABLE public.capture_messages ADD COLUMN user_id uuid;
DROP POLICY "Capture chat is public" ON public.capture_messages;
REVOKE ALL ON public.capture_messages FROM anon;
CREATE POLICY "See own capture chat" ON public.capture_messages FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE INDEX ON public.captures(user_id, created_at DESC);
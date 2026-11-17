CREATE POLICY "VIRSA Cam owner receives live frames" ON realtime.messages FOR SELECT TO authenticated
USING (
  realtime.messages.extension = 'broadcast'
  AND EXISTS (SELECT 1 FROM public.camera_devices d WHERE d.owner_user_id = auth.uid() AND realtime.topic() = 'cam-preview-' || d.id::text)
);
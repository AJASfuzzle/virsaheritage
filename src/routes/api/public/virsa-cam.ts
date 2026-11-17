import { createFileRoute } from "@tanstack/react-router";

const json = (body: unknown, status = 200) => Response.json(body, { status });

function authorized(request: Request) {
  const expected = process.env["VIRSA_CAM_DEVICE_KEY"];
  return !!expected && request.headers.get("x-device-key") === expected;
}

let latestFrame: { jpeg: string; t: number } | null = null;

// Shared by poll and preview: heartbeat, live-view flag and claim of a pending capture request
async function pollState() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { ensureDevice } = await import("@/lib/virsa-cam.server");
  await ensureDevice();
  const [{ data: st }, { data: dev }] = await Promise.all([
    supabaseAdmin.from("camera_status").update({ last_seen: new Date().toISOString(), preview_jpeg: null }).eq("id", 1).select("preview_until").maybeSingle(),
    supabaseAdmin.from("camera_devices").select("id").not("owner_user_id", "is", null).limit(1).maybeSingle(),
  ]);
  const preview = !!st?.preview_until && new Date(st.preview_until).getTime() > Date.now();
  const since = new Date(Date.now() - 60_000).toISOString();
  const { data } = await supabaseAdmin.from("camera_requests").select("id").eq("status", "pending").gte("created_at", since).order("created_at").limit(1).maybeSingle();
  let capture = false;
  if (data) {
    const { data: taken } = await supabaseAdmin.from("camera_requests").update({ status: "taken" }).eq("id", data.id).eq("status", "pending").select("id");
    capture = !!taken?.length;
  }
  return { capture, preview, deviceId: dev?.id as string | undefined };
}

export const Route = createFileRoute("/api/public/virsa-cam")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        if (!authorized(request)) return json({ error: "Unauthorized" }, 401);
        if (new URL(request.url).searchParams.get("mode") !== "poll") return json({ error: "Unknown mode" }, 400);
        const { capture, preview } = await pollState();
        return json({ capture, preview });
      },
      POST: async ({ request }) => {
        if (!authorized(request)) return json({ error: "Unauthorized" }, 401);
        const url = new URL(request.url);
        if (url.searchParams.get("mode") === "preview") {
          // Frames are never stored in the database: relayed to the owner over a private broadcast, latest kept in memory.
          const frame = new Uint8Array(await request.arrayBuffer());
          const state = await pollState();
          if (!frame.length || frame.length > 300_000) return json({ capture: state.capture, preview: state.preview, error: "Send a small JPEG under 300 KB" }, 400);
          if (!state.preview) { latestFrame = null; return json({ capture: state.capture, preview: false }); }
          let bin = "";
          for (let i = 0; i < frame.length; i += 0x8000) bin += String.fromCharCode(...frame.subarray(i, i + 0x8000));
          latestFrame = { jpeg: btoa(bin), t: Date.now() };
          if (state.deviceId) {
            await fetch(`${process.env.SUPABASE_URL}/realtime/v1/api/broadcast`, {
              method: "POST",
              headers: { "Content-Type": "application/json", apikey: process.env.SUPABASE_SERVICE_ROLE_KEY!, Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}` },
              body: JSON.stringify({ messages: [{ topic: `cam-preview-${state.deviceId}`, event: "frame", payload: latestFrame, private: true }] }),
            }).then(async (r) => { if (!r.ok) console.error("[virsa-cam] broadcast", r.status, (await r.text()).slice(0, 200)); }).catch((e) => console.error("[virsa-cam] broadcast", e));
          }
          return json({ capture: state.capture, preview: state.preview });
        }
        if (url.searchParams.get("mode") !== "upload") return json({ error: "Unknown mode" }, 400);
        const bytes = new Uint8Array(await request.arrayBuffer());
        if (!bytes.length || bytes.length > 10_000_000) return json({ error: "Send a JPEG under 10 MB" }, 400);
        try {
          const { identifyAndSave } = await import("@/lib/virsa-cam.server");
          const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
          // Attach to the most recent capture request this upload fulfils; none -> unowned, visible to nobody
          const since = new Date(Date.now() - 3 * 60_000).toISOString();
          const { data: req } = await supabaseAdmin.from("camera_requests").select("id,user_id").eq("status", "taken").is("capture_id", null).gte("created_at", since).order("created_at", { ascending: false }).limit(1).maybeSingle();
          const r = await identifyAndSave(bytes, "image/jpeg", "en", req?.user_id ?? null);
          if (req) await supabaseAdmin.from("camera_requests").update({ capture_id: r.id }).eq("id", req.id);
          return json({ monument_name: r.monument_name, location: r.location, description: r.description, confidence: r.confidence });
        } catch (e) {
          console.error("[virsa-cam] upload failed", e);
          return json({ error: e instanceof Error ? e.message : "Upload failed" }, 500);
        }
      },
    },
  },
});

import { createFileRoute } from "@tanstack/react-router";

const json = (body: unknown, status = 200) => Response.json(body, { status });

function authorized(request: Request) {
  const expected = process.env["VIRSA_CAM_DEVICE_KEY"];
  return !!expected && request.headers.get("x-device-key") === expected;
}

export const Route = createFileRoute("/api/public/virsa-cam")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        if (!authorized(request)) return json({ error: "Unauthorized" }, 401);
        if (new URL(request.url).searchParams.get("mode") !== "poll") return json({ error: "Unknown mode" }, 400);
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { ensureDevice } = await import("@/lib/virsa-cam.server");
        await ensureDevice();
        const { data: st } = await supabaseAdmin.from("camera_status").update({ last_seen: new Date().toISOString() }).eq("id", 1).select("preview_until").maybeSingle();
        const preview = !!st?.preview_until && new Date(st.preview_until).getTime() > Date.now();
        const since = new Date(Date.now() - 60_000).toISOString();
        const { data } = await supabaseAdmin.from("camera_requests").select("id").eq("status", "pending").gte("created_at", since).order("created_at").limit(1).maybeSingle();
        if (!data) return json({ capture: false, preview });
        const { data: taken } = await supabaseAdmin.from("camera_requests").update({ status: "taken" }).eq("id", data.id).eq("status", "pending").select("id");
        return json({ capture: !!taken?.length, preview });
      },
      POST: async ({ request }) => {
        if (!authorized(request)) return json({ error: "Unauthorized" }, 401);
        const url = new URL(request.url);
        if (url.searchParams.get("mode") === "preview") {
          const frame = new Uint8Array(await request.arrayBuffer());
          if (!frame.length || frame.length > 300_000) return json({ error: "Send a small JPEG under 300 KB" }, 400);
          let bin = "";
          for (let i = 0; i < frame.length; i += 0x8000) bin += String.fromCharCode(...frame.subarray(i, i + 0x8000));
          const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
          const now = new Date().toISOString();
          const { data: st } = await supabaseAdmin.from("camera_status").select("preview_until").eq("id", 1).maybeSingle();
          if (!st?.preview_until || new Date(st.preview_until).getTime() <= Date.now()) {
            // Live view is off: never keep frames
            await supabaseAdmin.from("camera_status").update({ preview_jpeg: null, preview_updated_at: null, last_seen: now }).eq("id", 1);
            return json({ ok: false, preview: false });
          }
          const { error } = await supabaseAdmin.from("camera_status").update({ preview_jpeg: btoa(bin), preview_updated_at: now, last_seen: now }).eq("id", 1);
          if (error) return json({ error: error.message }, 500);
          return json({ ok: true });
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

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
        const since = new Date(Date.now() - 60_000).toISOString();
        const { data } = await supabaseAdmin.from("camera_requests").select("id").eq("status", "pending").gte("created_at", since).order("created_at").limit(1).maybeSingle();
        if (!data) return json({ capture: false });
        const { data: taken } = await supabaseAdmin.from("camera_requests").update({ status: "taken" }).eq("id", data.id).eq("status", "pending").select("id");
        return json({ capture: !!taken?.length });
      },
      POST: async ({ request }) => {
        if (!authorized(request)) return json({ error: "Unauthorized" }, 401);
        const url = new URL(request.url);
        if (url.searchParams.get("mode") !== "upload") return json({ error: "Unknown mode" }, 400);
        const bytes = new Uint8Array(await request.arrayBuffer());
        if (!bytes.length || bytes.length > 10_000_000) return json({ error: "Send a JPEG under 10 MB" }, 400);
        try {
          const { identifyAndSave } = await import("@/lib/virsa-cam.server");
          const r = await identifyAndSave(bytes, "image/jpeg", url.searchParams.get("lang") ?? "en");
          return json({ monument_name: r.monument_name, location: r.location, description: r.description, confidence: r.confidence });
        } catch (e) {
          console.error("[virsa-cam] upload failed", e);
          return json({ error: e instanceof Error ? e.message : "Upload failed" }, 500);
        }
      },
    },
  },
});

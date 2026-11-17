import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const body = z.object({ captureId: z.string().uuid(), question: z.string().min(1).max(500) });

// Streams the guide's answer as plain text; caller must be signed in and own the capture.
export const Route = createFileRoute("/api/virsa-cam-ask")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
        if (!token) return new Response("Unauthorized", { status: 401 });
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { data: u } = await supabaseAdmin.auth.getUser(token);
        if (!u.user) return new Response("Unauthorized", { status: 401 });
        const parsed = body.safeParse(await request.json().catch(() => null));
        if (!parsed.success) return new Response("Bad request", { status: 400 });
        try {
          const { streamAnswer } = await import("@/lib/virsa-cam.server");
          const stream = await streamAnswer(u.user.id, parsed.data.captureId, parsed.data.question);
          return new Response(stream, { headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-cache" } });
        } catch {
          return new Response("Not found", { status: 404 });
        }
      },
    },
  },
});

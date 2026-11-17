import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const lang = z.enum(["en", "hi", "pa"]);

export const askMonument = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(z.object({ captureId: z.string().uuid(), question: z.string().min(1).max(500), language: lang }))
  .handler(async ({ data, context }) => {
    const { askAboutCapture } = await import("./virsa-cam.server");
    return askAboutCapture(context.userId, data.captureId, data.question, data.language);
  });

export const pairVirsaCam = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(z.object({ code: z.string().min(4).max(200) }))
  .handler(async ({ data, context }) => {
    const { pairDevice } = await import("./virsa-cam.server");
    try { return await pairDevice(context.userId, data.code); }
    catch (e) { return { ok: false, error: e instanceof Error ? e.message : "Pairing failed" }; }
  });

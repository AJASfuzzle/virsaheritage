import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const lang = z.literal("en").default("en");

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

export const transcribeQuestion = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(z.object({ base64: z.string().min(100).max(8_000_000), mime: z.string().max(60), language: lang }))
  .handler(async ({ data }) => {
    const key = process.env["LOVABLE_API_KEY"];
    if (!key) return { ok: false as const, error: "Speech recognition isn't configured." };
    const bin = atob(data.base64);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    const type = data.mime.replace(/^video\//, "audio/").split(";")[0] || "audio/webm";
    const ext = type.includes("mp4") ? "m4a" : type.includes("ogg") ? "ogg" : type.includes("wav") ? "wav" : "webm";
    const form = new FormData();
    form.append("file", new Blob([bytes], { type }), `question.${ext}`);
    form.append("model", "openai/gpt-transcribe");
    form.append("languages", "en");
    const res = await fetch("https://ai.gateway.lovable.dev/v1/audio/transcriptions", {
      method: "POST", headers: { Authorization: `Bearer ${key}` }, body: form,
    });
    if (!res.ok) {
      console.error("[virsa-cam-transcribe]", res.status, (await res.text()).slice(0, 300));
      return { ok: false as const, error: res.status === 402 ? "Voice questions are paused right now (AI credits)." : "Didn't catch that, try again" };
    }
    const j = (await res.json()) as { text?: string };
    const text = (j.text ?? "").trim();
    return text ? { ok: true as const, text } : { ok: false as const, error: "Didn't catch that, try again" };
  });

export const deleteCaptures = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(z.object({ ids: z.array(z.string().uuid()).max(500).optional(), all: z.boolean().optional() }))
  .handler(async ({ data, context }) => {
    // RLS: the user's own client only returns their own captures
    let q = context.supabase.from("captures").select("id,image_url").eq("user_id", context.userId);
    if (!data.all) q = q.in("id", data.ids ?? []);
    const { data: rows, error } = await q;
    if (error) throw new Error(error.message);
    if (!rows?.length) return { deleted: 0 };
    const ids = rows.map((r) => r.id);
    const paths = rows.map((r) => decodeURIComponent(new URL(r.image_url).pathname.split("/captures/")[1] ?? "")).filter(Boolean);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    if (paths.length) await supabaseAdmin.storage.from("captures").remove(paths);
    await supabaseAdmin.from("capture_messages").delete().in("capture_id", ids).eq("user_id", context.userId);
    await supabaseAdmin.from("camera_requests").update({ capture_id: null }).in("capture_id", ids);
    const { error: delErr } = await supabaseAdmin.from("captures").delete().in("id", ids).eq("user_id", context.userId);
    if (delErr) throw new Error(delErr.message);
    return { deleted: ids.length };
  });

// virsa-cam-tts: text -> natural English speech (WAV) for one persistent <audio> element on the page
export const virsaCamTts = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(z.object({ text: z.string().min(1).max(3000), language: z.string().max(40).default("English") }))
  .handler(async ({ data }) => {
    const key = process.env["LOVABLE_API_KEY"];
    if (!key) return { ok: false as const, error: "Speech isn't configured." };
    const res = await fetch("https://ai.gateway.lovable.dev/v1/audio/speech", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-3.1-flash-tts-preview",
        stream_format: "audio",
        contents: [{ role: "user", parts: [{ text: data.language === "English" ? `Read this in clear, warm Indian English, like a friendly heritage tour guide: ${data.text}` : `Read this aloud naturally in ${data.language}, warmly, like a friendly heritage tour guide: ${data.text}` }] }],
        generationConfig: { responseModalities: ["AUDIO"], speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: "Kore" } } } },
      }),
    });
    if (!res.ok) {
      console.error("[virsa-cam-tts]", res.status, (await res.text()).slice(0, 300));
      return { ok: false as const, error: "tts_failed" };
    }
    const buf = new Uint8Array(await res.arrayBuffer());
    let bin = "";
    for (let i = 0; i < buf.length; i += 0x8000) bin += String.fromCharCode(...buf.subarray(i, i + 0x8000));
    return { ok: true as const, mime: res.headers.get("content-type") || "audio/wav", base64: btoa(bin) };
  });

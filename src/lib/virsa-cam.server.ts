import { createOpenAI } from "@ai-sdk/openai";
import { Output, streamText } from "ai";
import { z } from "zod";
import { createLovableAiGatewayRunIdFetch } from "./translation-run-id.server.ts";

// VIRSA Cam is English-only.
export const langName = (_l: string) => "English";

const identifySchema = z.object({
  monument_name: z.string(),
  location: z.string(),
  description: z.string(),
  confidence: z.number(),
});
export type Identification = z.infer<typeof identifySchema>;

async function admin() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  return supabaseAdmin;
}

function lovable() {
  const key = process.env["LOVABLE_API_KEY"];
  if (!key) throw new Error("AI is not configured.");
  const run = createLovableAiGatewayRunIdFetch();
  return createOpenAI({
    baseURL: "https://ai.gateway.lovable.dev/v1", apiKey: key,
    headers: { "Lovable-API-Key": key, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
    fetch: run.fetch,
  });
}
const opts = () => ({ openai: { forceReasoning: true, reasoningEffort: "low", reasoningSummary: "auto", store: false, include: ["reasoning.encrypted_content"] } });

async function qwen(messages: unknown[], json: boolean) {
  const res = await fetch("https://dashscope-intl.aliyuncs.com/compatible-mode/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env["QWEN_API_KEY"]}`, "Content-Type": "application/json" },
    body: JSON.stringify({ model: "qwen-vl-max", messages, ...(json ? { response_format: { type: "json_object" } } : {}) }),
  });
  if (!res.ok) throw new Error(`Qwen error ${res.status}`);
  const data = (await res.json()) as { choices: { message: { content: string } }[] };
  return data.choices[0]?.message.content ?? "";
}

const identifyPrompt = (lang: string) =>
  `You are VIRSA's heritage guide. Identify the Indian monument in this photo. Reply in ${langName(lang)} for description, location and name. Write an engaging ~120-word spoken tour-guide description that does not start by repeating the name or location and never repeats a sentence. confidence is 0-1. If it is not a monument, or you are unsure (confidence < 0.5), say so politely in the description and suggest trying a clearer photo. Return JSON with keys monument_name, location, description, confidence.`;

export async function sha256Hex(text: string) {
  const d = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return [...new Uint8Array(d)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

/** Make sure the configured device has a row (unowned until someone pairs it). */
export async function ensureDevice() {
  const key = process.env["VIRSA_CAM_DEVICE_KEY"];
  if (!key) throw new Error("Device not configured");
  const sb = await admin();
  const hash = await sha256Hex(key);
  await sb.from("camera_devices").upsert({ device_key_hash: hash }, { onConflict: "device_key_hash", ignoreDuplicates: true });
  return hash;
}

export async function pairDevice(userId: string, code: string) {
  const key = process.env["VIRSA_CAM_DEVICE_KEY"];
  if (!key || (await sha256Hex(code.trim())) !== (await sha256Hex(key))) throw new Error("That pairing code doesn't match a VIRSA Cam.");
  const hash = await ensureDevice();
  const sb = await admin();
  const { data: dev } = await sb.from("camera_devices").select("id,owner_user_id").eq("device_key_hash", hash).single();
  if (dev?.owner_user_id && dev.owner_user_id !== userId) throw new Error("This VIRSA Cam is already paired to another account.");
  if (!dev?.owner_user_id) {
    await sb.from("camera_devices").update({ owner_user_id: userId, paired_at: new Date().toISOString() }).eq("id", dev!.id).is("owner_user_id", null);
  }
  return { ok: true };
}

export async function identifyAndSave(bytes: Uint8Array, mime: string, lang = "en", userId: string | null = null) {
  const sb = await admin();
  const path = `${userId ?? "unowned"}/${Date.now()}-${crypto.randomUUID()}.jpg`;
  // Upload in parallel with identification so the result arrives sooner
  const saving = sb.storage.from("captures").upload(path, bytes, { contentType: mime || "image/jpeg" });
  const savingUrl = saving.then(async (up) => {
    if (up.error) throw new Error(up.error.message);
    const signed = await sb.storage.from("captures").createSignedUrl(path, 60 * 60 * 24 * 365 * 10);
    if (signed.error) throw new Error(signed.error.message);
    return signed;
  });
  savingUrl.catch(() => {});

  let b64 = "";
  for (let i = 0; i < bytes.length; i += 0x8000) b64 += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  const dataUrl = `data:${mime || "image/jpeg"};base64,${btoa(b64)}`;

  let result: Identification;
  if (process.env["QWEN_API_KEY"]) {
    const text = await qwen([{ role: "user", content: [{ type: "image_url", image_url: { url: dataUrl } }, { type: "text", text: identifyPrompt(lang) }] }], true);
    result = identifySchema.parse(JSON.parse(text));
  } else {
    const r = streamText({
      model: lovable().responses("openai/gpt-6-astra"),
      maxRetries: 0,
      output: Output.object({ schema: identifySchema }),
      messages: [{ role: "user", content: [{ type: "image", image: new URL(dataUrl) }, { type: "text", text: identifyPrompt(lang) }] }],
      providerOptions: opts(),
    });
    result = await r.output;
  }
  const signed = await savingUrl;
  const { data, error } = await sb.from("captures").insert({
    image_url: signed.data.signedUrl, monument_name: result.monument_name, location: result.location,
    description: result.description, language: "en", confidence: result.confidence, user_id: userId,
  }).select().single();
  if (error) throw new Error(error.message);
  return { id: data.id, ...result };
}

export async function askAboutCapture(userId: string, captureId: string, question: string, lang = "en") {
  const sb = await admin();
  const { data: cap } = await sb.from("captures").select("*").eq("id", captureId).eq("user_id", userId).single();
  if (!cap) throw new Error("Capture not found.");
  const { data: prev } = await sb.from("capture_messages").select("role,content").eq("capture_id", captureId).order("created_at").limit(20);
  const system = `You are a friendly, knowledgeable VIRSA heritage guide. Talk ONLY about this monument: ${cap.monument_name} (${cap.location}). Context: ${cap.description}. Cover history, architecture, builders, legends, best time to visit and nearby heritage when asked. If asked about anything else, gently steer back. Answer in ${langName(lang)} in 2-4 short, spoken-friendly sentences, no lists or markdown.`;
  const history = (prev ?? []).map((m) => ({ role: m.role as "user" | "assistant", content: m.content }));
  let answer: string;
  if (process.env["QWEN_API_KEY"]) {
    answer = await qwen([{ role: "system", content: system }, { role: "user", content: [{ type: "image_url", image_url: { url: cap.image_url } }, { type: "text", text: "This is the photo." }] }, ...history, { role: "user", content: question }], false);
  } else {
    const r = streamText({
      model: lovable().responses("openai/gpt-6-astra"),
      maxRetries: 0,
      system,
      messages: [{ role: "user", content: [{ type: "image", image: new URL(cap.image_url) }, { type: "text", text: "This is the photo of the monument." }] }, ...history, { role: "user", content: question }],
      providerOptions: opts(),
    });
    answer = (await r.text).trim();
  }
  await sb.from("capture_messages").insert([
    { capture_id: captureId, role: "user", content: question, user_id: userId },
    { capture_id: captureId, role: "assistant", content: answer, user_id: userId },
  ]);
  return { answer };
}

// Streaming answers: fast model, text streamed as it is generated, saved when finished.
export async function streamAnswer(userId: string, captureId: string, question: string) {
  const sb = await admin();
  const [{ data: cap }, { data: prev }] = await Promise.all([
    sb.from("captures").select("*").eq("id", captureId).eq("user_id", userId).single(),
    sb.from("capture_messages").select("role,content").eq("capture_id", captureId).order("created_at").limit(20),
  ]);
  if (!cap) throw new Error("Capture not found.");
  const system = `You are a friendly, knowledgeable VIRSA heritage guide. Talk ONLY about this monument: ${cap.monument_name} (${cap.location}). Context: ${cap.description}. Cover history, architecture, builders, legends, best time to visit and nearby heritage when asked. If asked about anything else, gently steer back. Answer in English in 2-4 short, spoken-friendly sentences, no lists or markdown.`;
  const history = (prev ?? []).map((m) => ({ role: m.role as "user" | "assistant", content: m.content }));
  const r = streamText({
    model: lovable().responses("openai/gpt-5.6-luna"),
    maxRetries: 0,
    system,
    messages: [{ role: "user", content: [{ type: "image", image: new URL(cap.image_url) }, { type: "text", text: "This is the photo of the monument." }] }, ...history, { role: "user", content: question }],
    providerOptions: opts(),
  });
  const enc = new TextEncoder();
  return new ReadableStream<Uint8Array>({
    async start(ctrl) {
      let answer = "";
      try {
        for await (const t of r.textStream) { answer += t; ctrl.enqueue(enc.encode(t)); }
      } catch (e) { console.error("[virsa-cam-ask]", e); }
      answer = answer.trim();
      if (answer) await sb.from("capture_messages").insert([
        { capture_id: captureId, role: "user", content: question, user_id: userId },
        { capture_id: captureId, role: "assistant", content: answer, user_id: userId },
      ]);
      ctrl.close();
    },
  });
}

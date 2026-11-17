import { createOpenAI } from "@ai-sdk/openai";
import { Output, streamText } from "ai";
import { z } from "zod";
import { createLovableAiGatewayRunIdFetch } from "./translation-run-id.server.ts";

const LANGS: Record<string, string> = { en: "English", hi: "Hindi (Devanagari script)", pa: "Punjabi (Gurmukhi script)" };
export const langName = (l: string) => LANGS[l] ?? "English";

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
  `You are VIRSA's heritage guide. Identify the Indian monument in this photo. Reply in ${langName(lang)} for description, location and name. Write an engaging ~120-word spoken tour-guide description. confidence is 0-1. If it is not a monument, or you are unsure (confidence < 0.5), say so politely in the description and suggest trying a clearer photo. Return JSON with keys monument_name, location, description, confidence.`;

export async function identifyAndSave(bytes: Uint8Array, mime: string, lang = "en") {
  const sb = await admin();
  const path = `${Date.now()}-${crypto.randomUUID()}.jpg`;
  const up = await sb.storage.from("captures").upload(path, bytes, { contentType: mime || "image/jpeg" });
  if (up.error) throw new Error(up.error.message);
  const signed = await sb.storage.from("captures").createSignedUrl(path, 60 * 60 * 24 * 365 * 10);
  if (signed.error) throw new Error(signed.error.message);

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
  const { data, error } = await sb.from("captures").insert({
    image_url: signed.data.signedUrl, monument_name: result.monument_name, location: result.location,
    description: result.description, language: lang, confidence: result.confidence,
  }).select().single();
  if (error) throw new Error(error.message);
  return { id: data.id, ...result };
}

export async function askAboutCapture(captureId: string, question: string, lang = "en") {
  const sb = await admin();
  const { data: cap } = await sb.from("captures").select("*").eq("id", captureId).single();
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
    { capture_id: captureId, role: "user", content: question },
    { capture_id: captureId, role: "assistant", content: answer },
  ]);
  return { answer };
}

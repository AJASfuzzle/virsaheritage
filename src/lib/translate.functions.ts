import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { generateText } from "ai";
import { createLovableAiGatewayProvider } from "@/lib/ai-gateway.server";

export const LANGUAGE_NAMES: Record<string, string> = {
  en: "English",
  hi: "Hindi (हिन्दी)",
  pa: "Punjabi (ਪੰਜਾਬੀ)",
  bn: "Bengali (বাংলা)",
  ta: "Tamil (தமிழ்)",
  te: "Telugu (తెలుగు)",
  mr: "Marathi (मराठी)",
  gu: "Gujarati (ગુજરાતી)",
  kn: "Kannada (ಕನ್ನಡ)",
  ml: "Malayalam (മലയാളം)",
  ur: "Urdu (اُردُو)",
};

const InputSchema = z.object({
  targetLang: z.string().min(2).max(5),
  texts: z.array(z.string().min(1).max(2000)).min(1).max(80),
});

export const translateBatch = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => InputSchema.parse(data))
  .handler(async ({ data }) => {
    const { targetLang, texts } = data;
    if (targetLang === "en") {
      return { translations: texts };
    }

    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) throw new Error("Missing LOVABLE_API_KEY");

    const langName = LANGUAGE_NAMES[targetLang] ?? targetLang;
    const gateway = createLovableAiGatewayProvider(apiKey);

    // Number the texts so the model returns them aligned.
    const numbered = texts.map((t, i) => `${i + 1}. ${t.replace(/\s+/g, " ").trim()}`).join("\n");

    const prompt = `Translate each of the following English UI/content strings into ${langName}.

Rules:
- Preserve meaning and tone (this is a heritage / culture website called VIRSA).
- Keep proper nouns (VIRSA, India, place names, person names) as-is in English unless they have a widely-known native form.
- Do not add explanations.
- Return ONLY a JSON array of strings, in the same order, same length as the input. No prose, no markdown, no code fences.

Strings:
${numbered}`;

    let raw = "";
    try {
      const result = await generateText({
        model: gateway("google/gemini-2.5-flash"),
        prompt,
        temperature: 0.2,
      });
      raw = result.text.trim();
    } catch (err) {
      console.error("[translateBatch] gateway error", err);
      return { translations: texts };
    }

    // Strip markdown code fences if present.
    raw = raw.replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/i, "").trim();

    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch {
      // Fallback: try to extract a JSON array.
      const m = raw.match(/\[[\s\S]*\]/);
      if (m) {
        try { parsed = JSON.parse(m[0]); } catch { parsed = null; }
      }
    }

    if (!Array.isArray(parsed) || parsed.length !== texts.length) {
      console.warn("[translateBatch] bad shape, returning originals");
      return { translations: texts };
    }

    const translations = parsed.map((v, i) => (typeof v === "string" && v.trim() ? v : texts[i]));
    return { translations };
  });

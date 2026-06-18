import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { generateText } from "ai";
import { createLovableAiGatewayProvider } from "@/lib/ai-gateway.server";

/**
 * Language config: native name + the Unicode script range its output must contain.
 * If the model returns text without any character in this range, we treat the
 * translation as failed and keep the original English string instead of
 * showing transliterated / wrong-script output.
 */
type LangConfig = {
  name: string;
  script: string;
  scriptTest: RegExp;
};

export const LANGUAGE_CONFIG: Record<string, LangConfig> = {
  en: { name: "English", script: "Latin", scriptTest: /[A-Za-z]/ },
  hi: { name: "Hindi", script: "Devanagari", scriptTest: /[\u0900-\u097F]/ },
  mr: { name: "Marathi", script: "Devanagari", scriptTest: /[\u0900-\u097F]/ },
  pa: { name: "Punjabi", script: "Gurmukhi", scriptTest: /[\u0A00-\u0A7F]/ },
  bn: { name: "Bengali", script: "Bengali", scriptTest: /[\u0980-\u09FF]/ },
  ta: { name: "Tamil", script: "Tamil", scriptTest: /[\u0B80-\u0BFF]/ },
  te: { name: "Telugu", script: "Telugu", scriptTest: /[\u0C00-\u0C7F]/ },
  gu: { name: "Gujarati", script: "Gujarati", scriptTest: /[\u0A80-\u0AFF]/ },
  kn: { name: "Kannada", script: "Kannada", scriptTest: /[\u0C80-\u0CFF]/ },
  ml: { name: "Malayalam", script: "Malayalam", scriptTest: /[\u0D00-\u0D7F]/ },
  ur: { name: "Urdu", script: "Arabic (Nastaliq)", scriptTest: /[\u0600-\u06FF\u0750-\u077F\uFB50-\uFDFF\uFE70-\uFEFF]/ },
};

// Kept for backwards compatibility with existing imports.
export const LANGUAGE_NAMES: Record<string, string> = Object.fromEntries(
  Object.entries(LANGUAGE_CONFIG).map(([k, v]) => [k, v.name])
);

const InputSchema = z.object({
  targetLang: z.string().min(2).max(5),
  texts: z.array(z.string().min(1).max(2000)).min(1).max(80),
});

export const translateBatch = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => InputSchema.parse(data))
  .handler(async ({ data }) => {
    const { targetLang, texts } = data;
    if (targetLang === "en") return { translations: texts };

    const cfg = LANGUAGE_CONFIG[targetLang];
    if (!cfg) {
      // Unsupported language — return originals so UI stays usable.
      return { translations: texts };
    }

    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) throw new Error("Missing LOVABLE_API_KEY");

    const gateway = createLovableAiGatewayProvider(apiKey);

    const numbered = texts
      .map((t, i) => `${i + 1}. ${t.replace(/\s+/g, " ").trim()}`)
      .join("\n");

    const prompt = `You are a professional translator. Translate each English string below into ${cfg.name}.

CRITICAL RULES:
- Output MUST be written in the ${cfg.script} script (the native script of ${cfg.name}). Never use Roman/Latin transliteration. Never use English letters except for proper nouns that have no widely-accepted native form.
- Preserve meaning, tone, and brevity. This is a cultural heritage website called VIRSA about India.
- Keep brand names ("VIRSA"), well-known place names without an established native spelling, and English UI shortcuts (e.g. "AI") as-is.
- Do NOT add any explanation, romanization, parenthetical English glosses, or prefixes.
- Return ONLY a JSON array of strings, same order, same length as the input. No prose, no markdown, no code fences.

Strings (${texts.length} total):
${numbered}

Return: a JSON array of exactly ${texts.length} strings written in ${cfg.script} script.`;

    let raw = "";
    try {
      const result = await generateText({
        model: gateway("google/gemini-2.5-flash"),
        prompt,
        temperature: 0.1,
      });
      raw = result.text.trim();
    } catch (err) {
      console.error("[translateBatch] gateway error", err);
      return { translations: texts };
    }

    raw = raw.replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/i, "").trim();

    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch {
      const m = raw.match(/\[[\s\S]*\]/);
      if (m) {
        try { parsed = JSON.parse(m[0]); } catch { parsed = null; }
      }
    }

    if (!Array.isArray(parsed) || parsed.length !== texts.length) {
      console.warn("[translateBatch] bad shape; returning originals");
      return { translations: texts };
    }

    // Per-string script validation: if the translation contains NO character
    // in the expected script for this language, the model failed (returned
    // English / romanization / refusal). Fall back to the original.
    const translations = parsed.map((v, i) => {
      const original = texts[i];
      if (typeof v !== "string" || !v.trim()) return original;
      const out = v.trim();
      // English strings that are just proper nouns / brand names may legitimately
      // come back identical. Only enforce script when the source clearly contains
      // translatable words (>= 3 letters of alphabetic text).
      const hasTranslatableWords = /[A-Za-z]{3,}/.test(original);
      if (hasTranslatableWords && !cfg.scriptTest.test(out)) {
        return original;
      }
      return out;
    });

    return { translations };
  });

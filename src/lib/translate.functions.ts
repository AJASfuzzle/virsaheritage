import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

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

    const apiKey = process.env.GOOGLE_TRANSLATE_API_KEY;
    if (!apiKey) {
      console.error("[translateBatch] Missing GOOGLE_TRANSLATE_API_KEY");
      return { translations: texts };
    }

    // Google Cloud Translation v2 — supports batched `q` params.
    const url = `https://translation.googleapis.com/language/translate/v2?key=${encodeURIComponent(apiKey)}`;

    let translated: string[] = [];
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          q: texts,
          source: "en",
          target: targetLang,
          format: "text",
        }),
      });

      if (!res.ok) {
        const errText = await res.text();
        console.error("[translateBatch] Google API error", res.status, errText);
        return { translations: texts };
      }

      const json = (await res.json()) as {
        data?: { translations?: Array<{ translatedText: string }> };
      };
      const arr = json.data?.translations;
      if (!Array.isArray(arr) || arr.length !== texts.length) {
        console.warn("[translateBatch] unexpected response shape");
        return { translations: texts };
      }
      translated = arr.map((t) => decodeHtmlEntities(t.translatedText));
    } catch (err) {
      console.error("[translateBatch] fetch failed", err);
      return { translations: texts };
    }

    // Script safety: if a translation contains no characters in the expected
    // script (e.g. an unexpected romanization), keep the original English.
    const translations = translated.map((out, i) => {
      const original = texts[i];
      if (!out || !out.trim()) return original;
      const hasTranslatableWords = /[A-Za-z]{3,}/.test(original);
      if (hasTranslatableWords && !cfg.scriptTest.test(out)) {
        return original;
      }
      return out;
    });

    return { translations };
  });

function decodeHtmlEntities(s: string): string {
  return s
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, h) => String.fromCharCode(parseInt(h, 16)))
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");
}


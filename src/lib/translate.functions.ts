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
  as: { name: "Assamese", script: "Bengali-Assamese", scriptTest: /[\u0980-\u09FF]/ },
  or: { name: "Odia", script: "Odia", scriptTest: /[\u0B00-\u0B7F]/ },
  ne: { name: "Nepali", script: "Devanagari", scriptTest: /[\u0900-\u097F]/ },
  sd: { name: "Sindhi", script: "Arabic", scriptTest: /[\u0600-\u06FF]/ },
  sa: { name: "Sanskrit", script: "Devanagari", scriptTest: /[\u0900-\u097F]/ },
  gom: { name: "Konkani", script: "Devanagari", scriptTest: /[\u0900-\u097F]/ },
  mai: { name: "Maithili", script: "Devanagari", scriptTest: /[\u0900-\u097F]/ },
  bho: { name: "Bhojpuri", script: "Devanagari", scriptTest: /[\u0900-\u097F]/ },
  doi: { name: "Dogri", script: "Devanagari", scriptTest: /[\u0900-\u097F]/ },
  "mni-Mtei": { name: "Manipuri", script: "Meitei Mayek", scriptTest: /[\uABC0-\uABFF\uAAE0-\uAAFF]/ },
  sat: { name: "Santali", script: "Ol Chiki", scriptTest: /[\u1C50-\u1C7F]/ },
  lus: { name: "Mizo", script: "Latin", scriptTest: /[A-Za-z]/ },
  kha: { name: "Khasi", script: "Latin", scriptTest: /[A-Za-z]/ },
  trp: { name: "Kokborok", script: "Latin", scriptTest: /[A-Za-z]/ },
  tcy: { name: "Tulu", script: "Kannada", scriptTest: /[\u0C80-\u0CFF]/ },
  es: { name: "Spanish", script: "Latin", scriptTest: /[A-Za-zÀ-ÿ]/ },
  fr: { name: "French", script: "Latin", scriptTest: /[A-Za-zÀ-ÿ]/ },
  de: { name: "German", script: "Latin", scriptTest: /[A-Za-zÀ-ÿ]/ },
  pt: { name: "Portuguese", script: "Latin", scriptTest: /[A-Za-zÀ-ÿ]/ },
  ru: { name: "Russian", script: "Cyrillic", scriptTest: /[\u0400-\u04FF]/ },
  ar: { name: "Arabic", script: "Arabic", scriptTest: /[\u0600-\u06FF]/ },
  "zh-CN": { name: "Mandarin", script: "Han", scriptTest: /[\u4E00-\u9FFF]/ },
  ja: { name: "Japanese", script: "Japanese", scriptTest: /[\u3040-\u30FF\u4E00-\u9FFF]/ },
  ko: { name: "Korean", script: "Hangul", scriptTest: /[\uAC00-\uD7AF]/ },
  id: { name: "Indonesian", script: "Latin", scriptTest: /[A-Za-z]/ },
  tr: { name: "Turkish", script: "Latin", scriptTest: /[A-Za-zçğıöşüÇĞİÖŞÜ]/ },
  fa: { name: "Persian", script: "Arabic", scriptTest: /[\u0600-\u06FF]/ },
  sw: { name: "Swahili", script: "Latin", scriptTest: /[A-Za-z]/ },
};

// Kept for backwards compatibility with existing imports.
export const LANGUAGE_NAMES: Record<string, string> = Object.fromEntries(
  Object.entries(LANGUAGE_CONFIG).map(([k, v]) => [k, v.name])
);

const InputSchema = z.object({
  targetLang: z.string().min(2).max(10),
  texts: z.array(z.string().min(1).max(12000)).min(1).max(80),
});

let googlePausedUntil = 0;

export const translateBatch = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => InputSchema.parse(data))
  .handler(async ({ data }) => {
    const { targetLang, texts } = data;
    if (targetLang === "en") return { translations: texts };

    const cfg = LANGUAGE_CONFIG[targetLang];
    if (!cfg) {
      throw new Error("Unsupported translation language.");
    }

    const apiKey = process.env['GOOGLE_TRANSLATE_API_KEY'];
    let translated: string[] = [];
    if (apiKey && Date.now() >= googlePausedUntil) try {
      const url = `https://translation.googleapis.com/language/translate/v2?key=${encodeURIComponent(apiKey)}`;
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
        if (res.status === 403 || res.status === 429) googlePausedUntil = Date.now() + 10 * 60 * 1000;
      } else {
        const json = (await res.json()) as {
          data?: { translations?: Array<{ translatedText: string }> };
        };
        const arr = json.data?.translations;
        if (Array.isArray(arr) && arr.length === texts.length) translated = arr.map((t) => decodeHtmlEntities(t.translatedText));
      }
    } catch (err) {
      console.error("[translateBatch] fetch failed", err);
    }

    if (translated.length !== texts.length) {
      const fallbackKey = process.env['LOVABLE_API_KEY'];
      if (!fallbackKey) throw new Error('Translation is temporarily unavailable. Please try changing language again later.');
      const { translateFallback } = await import('./translation-fallback.server');
      translated = await translateFallback(fallbackKey, texts, cfg.name, cfg.script);
    }

    // Script safety: if a translation contains no characters in the expected
    // script (e.g. an unexpected romanization), keep the original English.
    const translations = translated.map((out, i) => {
      const original = texts[i];
      if (!out || !out.trim()) return null;
      const hasTranslatableWords = /[A-Za-z]{3,}/.test(original);
      if (hasTranslatableWords && !cfg.scriptTest.test(out) && out !== original) {
        return null;
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


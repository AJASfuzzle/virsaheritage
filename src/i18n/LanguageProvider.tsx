import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useServerFn } from "@tanstack/react-start";
import { translateBatch, LANGUAGE_NAMES, LANGUAGE_CONFIG } from "@/lib/translate.functions";

export type LangCode = keyof typeof LANGUAGE_NAMES;

export const SUPPORTED_LANGS: { code: LangCode; label: string; native: string }[] = [
  { code: "en", label: "English", native: "English" },
  { code: "hi", label: "Hindi", native: "हिन्दी" },
  { code: "pa", label: "Punjabi", native: "ਪੰਜਾਬੀ" },
  { code: "bn", label: "Bengali", native: "বাংলা" },
  { code: "ta", label: "Tamil", native: "தமிழ்" },
  { code: "te", label: "Telugu", native: "తెలుగు" },
  { code: "mr", label: "Marathi", native: "मराठी" },
  { code: "gu", label: "Gujarati", native: "ગુજરાતી" },
  { code: "kn", label: "Kannada", native: "ಕನ್ನಡ" },
  { code: "ml", label: "Malayalam", native: "മലയാളം" },
  { code: "ur", label: "Urdu", native: "اُردُو" },
  { code: "as", label: "Assamese", native: "অসমীয়া" },
  { code: "or", label: "Odia", native: "ଓଡ଼ିଆ" },
  { code: "ne", label: "Nepali", native: "नेपाली" },
  { code: "sd", label: "Sindhi", native: "سنڌي" },
  { code: "sa", label: "Sanskrit", native: "संस्कृतम्" },
  { code: "gom", label: "Konkani", native: "कोंकणी" },
  { code: "mai", label: "Maithili", native: "मैथिली" },
  { code: "bho", label: "Bhojpuri", native: "भोजपुरी" },
  { code: "doi", label: "Dogri", native: "डोगरी" },
  { code: "mni-Mtei", label: "Manipuri", native: "ꯃꯤꯇꯩꯂꯣꯟ" },
  { code: "sat", label: "Santali", native: "ᱥᱟᱱᱛᱟᱲᱤ" },
  { code: "lus", label: "Mizo", native: "Mizo ṭawng" },
  { code: "kha", label: "Khasi", native: "Ka Ktien Khasi" },
  { code: "trp", label: "Kokborok", native: "Kokborok" },
  { code: "tcy", label: "Tulu", native: "ತುಳು" },
  { code: "es", label: "Spanish", native: "Español" },
  { code: "fr", label: "French", native: "Français" },
  { code: "de", label: "German", native: "Deutsch" },
  { code: "pt", label: "Portuguese", native: "Português" },
  { code: "ru", label: "Russian", native: "Русский" },
  { code: "ar", label: "Arabic", native: "العربية" },
  { code: "zh-CN", label: "Mandarin", native: "中文" },
  { code: "ja", label: "Japanese", native: "日本語" },
  { code: "ko", label: "Korean", native: "한국어" },
  { code: "id", label: "Indonesian", native: "Bahasa Indonesia" },
  { code: "tr", label: "Turkish", native: "Türkçe" },
  { code: "fa", label: "Persian", native: "فارسی" },
  { code: "sw", label: "Swahili", native: "Kiswahili" },
];

const RTL_LANGS = new Set<LangCode>(["ur", "ar", "fa", "sd"]);
const STORAGE_KEY = "virsa.lang";
const CACHE_KEY = "virsa.translations.v2";

type Ctx = {
  lang: LangCode;
  setLang: (l: LangCode) => void;
  /** Translate a single string synchronously if cached; ensure queues missing translations after render. */
  t: (text: string) => string;
  /** Queue many strings for translation in one batch. */
  ensure: (texts: string[], replacePage?: boolean) => void;
  /** A counter that bumps when new translations arrive so consumers can re-render. */
  version: number;
};

const LanguageContext = createContext<Ctx | null>(null);

// In-memory cache: lang -> (sourceText -> translatedText)
const memCache: Record<string, Map<string, string>> = {};

function cacheFor(lang: LangCode): Map<string, string> {
  if (!memCache[lang]) memCache[lang] = new Map();
  return memCache[lang];
}

function loadFromLocalStorage(lang: LangCode) {
  if (typeof window === "undefined") return;
  try {
    const raw = window.localStorage.getItem(`${CACHE_KEY}.${lang}`) ?? window.localStorage.getItem(`${STORAGE_KEY}.cache.${lang}`);
    if (!raw) return;
    const obj = JSON.parse(raw) as Record<string, string>;
    const c = cacheFor(lang);
    for (const [k, v] of Object.entries(obj)) {
      if (typeof v === "string" && v.trim() && v !== k && LANGUAGE_CONFIG[lang]?.scriptTest.test(v)) c.set(k, v);
    }
  } catch {}
}

function persistToLocalStorage(lang: LangCode) {
  if (typeof window === "undefined") return;
  try {
    const c = cacheFor(lang);
    const obj: Record<string, string> = {};
    c.forEach((v, k) => { obj[k] = v; });
    window.localStorage.setItem(`${CACHE_KEY}.${lang}`, JSON.stringify(obj));
  } catch {}
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<LangCode>("en");
  const [version, setVersion] = useState(0);
  const translate = useServerFn(translateBatch);



  const activeLang = useRef(lang);
  activeLang.current = lang;
  const queues = useRef(new Map<LangCode, Set<string>>());
  const busy = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const blocked = useRef(new Set<LangCode>());
  const attempted = useRef(new Map<LangCode, Set<string>>());
  const inFlight = useRef(new Map<LangCode, Set<string>>());
  const flush = useRef<() => Promise<void>>(async () => {});

  // Load persisted lang
  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = window.localStorage.getItem(STORAGE_KEY) as LangCode | null;
    if (saved && SUPPORTED_LANGS.some((l) => l.code === saved)) {
      setLangState(saved);
      loadFromLocalStorage(saved);
    }
  }, []);

  // Update <html lang> + dir
  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.lang = lang;
    document.documentElement.dir = RTL_LANGS.has(lang) ? "rtl" : "ltr";
  }, [lang]);

  const scheduleFlush = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => void flush.current(), 30);
  }, []);

  flush.current = async () => {
    const target = activeLang.current;
    if (busy.current >= 4 || target === "en" || blocked.current.has(target)) return;
    const pending = queues.current.get(target);
    if (!pending?.size) return;
    const c = cacheFor(target);
    const batch: string[] = [];
    let chars = 0;
    for (const text of pending) {
      if (c.has(text)) { pending.delete(text); continue; }
      if (batch.length && (batch.length >= 25 || chars + text.length > 4000)) break;
      batch.push(text);
      chars += text.length;
    }
    if (!batch.length) return;
    batch.forEach((text) => pending.delete(text));
    let fl = inFlight.current.get(target);
    if (!fl) { fl = new Set(); inFlight.current.set(target, fl); }
    batch.forEach((t) => fl!.add(t));
    busy.current++;
    if (pending.size) scheduleFlush();
    try {
      const res = await translate({ data: { targetLang: target, texts: batch } });
      let tried = attempted.current.get(target);
      if (!tried) { tried = new Set(); attempted.current.set(target, tried); }
      batch.forEach((source, i) => {
        tried.add(source);
        const output = res.translations[i];
        if (typeof output === "string" && output.trim()) c.set(source, output);
      });
      persistToLocalStorage(target);
      setVersion((v) => v + 1);
    } catch (error) {
      blocked.current.add(target);
      console.warn("[i18n] Translation unavailable", error);
      const { toast } = await import("sonner");
      toast.error(error instanceof Error ? error.message : "Translation is temporarily unavailable.");
    } finally {
      batch.forEach((t) => inFlight.current.get(target)?.delete(t));
      busy.current--;
      if (queues.current.get(activeLang.current)?.size) scheduleFlush();
    }
  };

  useEffect(() => {
    scheduleFlush();
    return () => { if (timer.current) clearTimeout(timer.current); };
  }, [lang, scheduleFlush]);

  const ensure = useCallback((texts: string[], replacePage = false) => {
    if (lang === "en" || blocked.current.has(lang)) return;
    const c = cacheFor(lang);
    let pending = queues.current.get(lang);
    if (!pending) { pending = new Set(); queues.current.set(lang, pending); }
    // The global walker supplies the current page: discard stale navigation work.
    if (replacePage) pending.clear();
    for (const text of texts) {
      if (text && !c.has(text) && !attempted.current.get(lang)?.has(text) && !inFlight.current.get(lang)?.has(text)) pending.add(text);
    }
    if (pending.size) scheduleFlush();
  }, [lang, scheduleFlush]);

  const t = useCallback((text: string) => {
    if (!text || lang === "en") return text;
    return cacheFor(lang).get(text) ?? text;
  }, [lang]);

  const setLang = useCallback((l: LangCode) => {
    blocked.current.delete(l);
    attempted.current.delete(l);
    activeLang.current = l;
    setLangState(l);
    if (typeof window !== "undefined") {
      try { window.localStorage.setItem(STORAGE_KEY, l); } catch {}
      loadFromLocalStorage(l);
    }
    setVersion((v) => v + 1);
  }, []);

  const value = useMemo<Ctx>(() => ({ lang, setLang, t, ensure, version }), [lang, setLang, t, ensure, version]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used inside LanguageProvider");
  return ctx;
}

/** Translate a single string. Re-renders when translations arrive. */
export function useT(text: string): string {
  const { t, ensure, version } = useLanguage();
  useEffect(() => { ensure([text]); }, [ensure, text]);
  // version dep ensures re-render when cache updates
  return useMemo(() => t(text), [t, text, version]);
}

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { useServerFn } from "@tanstack/react-start";
import { translateBatch, LANGUAGE_NAMES } from "@/lib/translate.functions";

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
];

const RTL_LANGS = new Set<LangCode>(["ur"]);
const STORAGE_KEY = "virsa.lang";

type Ctx = {
  lang: LangCode;
  setLang: (l: LangCode) => void;
  /** Translate a single string synchronously if cached, else returns original and starts background translation. */
  t: (text: string) => string;
  /** Queue many strings for translation in one batch. */
  ensure: (texts: string[]) => void;
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
    const raw = window.localStorage.getItem(`${STORAGE_KEY}.cache.${lang}`);
    if (!raw) return;
    const obj = JSON.parse(raw) as Record<string, string>;
    const c = cacheFor(lang);
    for (const [k, v] of Object.entries(obj)) c.set(k, v);
  } catch {}
}

function persistToLocalStorage(lang: LangCode) {
  if (typeof window === "undefined") return;
  try {
    const c = cacheFor(lang);
    const obj: Record<string, string> = {};
    c.forEach((v, k) => { obj[k] = v; });
    window.localStorage.setItem(`${STORAGE_KEY}.cache.${lang}`, JSON.stringify(obj));
  } catch {}
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<LangCode>("en");
  const [version, setVersion] = useState(0);
  const translate = useServerFn(translateBatch);



  // Queue + debounce timer
  const queueRef = useMemo(() => ({ pending: new Set<string>(), timer: null as ReturnType<typeof setTimeout> | null, inflight: false }), []);

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

  const flushQueue = useCallback(async () => {
    if (queueRef.inflight) return;
    if (queueRef.pending.size === 0) return;
    if (lang === "en") { queueRef.pending.clear(); return; }

    const c = cacheFor(lang);
    const batch = Array.from(queueRef.pending).filter((t) => !c.has(t)).slice(0, 60);
    if (batch.length === 0) { queueRef.pending.clear(); return; }
    batch.forEach((t) => queueRef.pending.delete(t));

    
    queueRef.inflight = true;
    try {
      const res = await translate({ data: { targetLang: lang, texts: batch } });
      const translations = res?.translations ?? batch;
      console.log("[i18n] got translations", translations.slice(0, 3));
      batch.forEach((src, i) => {
        const out = translations[i];
        if (typeof out === "string" && out) c.set(src, out);
      });
      persistToLocalStorage(lang);
      setVersion((v) => v + 1);
    } catch (e) {
      console.warn("[i18n] batch failed", e);
    } finally {
      queueRef.inflight = false;
      // If more queued during the request, schedule another flush.
      if (queueRef.pending.size > 0) {
        queueRef.timer = setTimeout(flushQueue, 50);
      }
    }
  }, [lang, translate, queueRef]);


  const scheduleFlush = useCallback(() => {
    if (queueRef.timer) clearTimeout(queueRef.timer);
    queueRef.timer = setTimeout(flushQueue, 120);
  }, [flushQueue, queueRef]);

  const enqueue = useCallback((text: string) => {
    if (!text || lang === "en") return;
    const c = cacheFor(lang);
    if (c.has(text)) return;
    queueRef.pending.add(text);
    scheduleFlush();
  }, [lang, scheduleFlush, queueRef]);

  const t = useCallback((text: string) => {
    if (!text) return text;
    if (lang === "en") return text;
    const c = cacheFor(lang);
    const hit = c.get(text);
    if (hit) return hit;
    enqueue(text);
    return text;
  }, [lang, enqueue]);

  const ensure = useCallback((texts: string[]) => {
    if (lang === "en") return;
    for (const t of texts) enqueue(t);
  }, [lang, enqueue]);

  const setLang = useCallback((l: LangCode) => {
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
  const { t, version } = useLanguage();
  // version dep ensures re-render when cache updates
  return useMemo(() => t(text), [t, text, version]);
}

## Goal

Add a language switcher that translates the entire Virsa website (UI labels + dynamic content like stories, trails, descriptions) into popular Indian languages.

## Supported languages

English (default), Hindi, Punjabi, Bengali, Tamil, Telugu, Marathi, Gujarati, Kannada, Malayalam, Urdu.

## Approach

A two-layer system:

1. **Static UI strings** — a translation dictionary in `src/i18n/strings.ts` covering navbar, footer, buttons, headings, dashboard tabs, etc. Strings are looked up via a `t(key)` helper. Initial translations generated via Lovable AI Gateway and committed to the repo so they load instantly.

2. **Dynamic content** — text coming from the database (story titles, trail descriptions, voice descriptions, etc.) is translated at runtime via a server function that calls Lovable AI Gateway (`google/gemini-2.5-flash`). Results are cached:
   - In-memory cache (Map) for the session
   - `localStorage` cache keyed by `${lang}:${hash(text)}` so repeat visits are instant
   - Server-side cache table `translations_cache` (text_hash, lang, translated) to share across users

## Pieces to build

```text
src/i18n/
  strings.ts            ← static UI dictionary, all 11 languages
  LanguageProvider.tsx  ← React context, persists selection to localStorage
  useT.ts               ← t(key) hook for static strings
  useTranslate.ts       ← async hook for dynamic strings, with cache
src/lib/
  translate.functions.ts ← createServerFn, batched translate via Lovable AI + DB cache
src/components/site/
  LanguageSwitcher.tsx  ← globe dropdown in Navbar with native language names
```

DB migration adds a `translations_cache` table (text_hash, lang, source, translated, created_at) with RLS allowing public read and authenticated insert.

## Integration points

- Wrap app in `<LanguageProvider>` inside `src/routes/__root.tsx`.
- Add `<LanguageSwitcher />` to `Navbar` (desktop + mobile menu).
- Replace hard-coded UI strings in Navbar, Footer, Hero, Dashboard tabs, FloatingAssistantButton, common CTAs with `t("key")` calls.
- Wrap dynamic content rendering (story cards, trail cards, dashboard lists) with a `<TranslatedText>` component that uses `useTranslate` so the text re-renders when language changes. Falls back to the original string while the async translation resolves.

## Caveats called out for the user

- First load in a new language may take ~1–3s per page section while the AI translates uncached text; subsequent visits are instant.
- AI translations are best-effort and may not be 100% idiomatic — committed static dictionary covers the most-seen strings precisely.
- Right-to-left (Urdu) gets `dir="rtl"` on `<html>`.

## Out of scope

- Translating images / PDFs.
- SEO hreflang per-language (can be added later).
- Voice TTS in regional languages (ElevenLabs voices stay as-is unless you want me to wire multilingual voices next).

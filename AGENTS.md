# Architecture rules
- Global localization uses the root LanguageProvider and AutoTranslator; track originals per Text node rather than per parent to preserve mixed inline content.
- Translation jobs and caches are keyed by language; never cache failed English fallbacks as successful translations.
- Keep Google Translation as the primary service with a streamed Lovable AI fallback for unsupported languages or unavailable quota; enforce each language's script server-side.
- VIRSA Cam device calls hit the TanStack server route /api/public/virsa-cam (x-device-key checked); page actions use server functions in virsa-cam.functions.ts, because this stack forbids Supabase Edge Functions.

# Architecture rules
- Global localization uses the root LanguageProvider and AutoTranslator; track originals per Text node rather than per parent to preserve mixed inline content.
- Translation jobs and caches are keyed by language; never cache failed English fallbacks as successful translations.
- Keep Google Translation as the primary service with a streamed Lovable AI fallback for unsupported languages or unavailable quota; enforce each language's script server-side.

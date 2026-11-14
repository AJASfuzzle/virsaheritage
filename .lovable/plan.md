## Goal
Add many more languages to Kitab, the language archive, which has 16 today. Also widen the site-wide language switcher, which offers 11 today, using the same approach.

## Current state (checked)
- **Kitab (16):** Toda, Sanketi, Kurukh, Kodava, Mising, Khasi, Bhili, Gondi, Santali, Apatani, Mizo, Konyak, Saurashtra, Tulu, Ho, Ladakhi. Each card shows region, speakers, status, a native phrase and its meaning, and plays the phrase in its own ElevenLabs voice.
- **Site switcher (11):** English, Hindi, Punjabi, Bengali, Tamil, Telugu, Marathi, Gujarati, Kannada, Malayalam, Urdu. It translates through Google Translate and checks that each translation uses the right alphabet.

## Part 1: Kitab, adding about 34 languages for roughly 50 in total
Same card format, the same voice settings and volume boost, and voices rotated across the existing ElevenLabs set. Already-listed languages are skipped: Santali, Tulu, Mizo and Khasi stay as they are.

- **Scheduled Indian languages:** Bodo, Dogri, Kashmiri, Konkani, Maithili, Manipuri (Meitei), Sanskrit, Assamese, Odia, Nepali, Sindhi
- **Regional, endangered and indigenous:** Bhojpuri, Garo, Kokborok, Lepcha, Bhutia, Nyishi, Ao, Angami, Lotha, Tangkhul, Karbi, Halbi, Korku, Munda, Irula, Badaga, Great Andamanese, Jarawa, Bishnupriya
- **Major international:** Spanish, French, Mandarin, Arabic, Portuguese, Russian, Japanese, Swahili, German, Persian, Indonesian, Korean, Turkish, Tibetan, Sinhala, Thai

Each new card gets a short greeting or blessing in that language, shown in its native script where one exists (for example Devanagari, Meitei Mayek, Ol Chiki, Perso-Arabic, Han or Hangul), plus an English meaning.

The grid gains a filter row: All · Indian · Endangered · International. This keeps about 50 cards easy to browse.

## Part 2: Site switcher, adding the languages Google Translate supports reliably
New options: Assamese, Odia, Nepali, Sindhi, Sanskrit, Konkani, Maithili, Bhojpuri, Dogri, Manipuri (Meitei), Santali (Ol Chiki), Mizo, Khasi, Kokborok, Tulu, plus Spanish, French, German, Portuguese, Russian, Arabic, Mandarin, Japanese, Korean, Indonesian, Turkish, Persian and Swahili.

Each language gets its native name in the dropdown and the same alphabet check. Arabic, Persian and Sindhi switch the page to right-to-left, as Urdu does today.

Bodo, Garo and Kashmiri are not offered by Google Translate, so they appear only in Kitab and not in the site switcher.

## Technical details
- `src/components/site/Shruti.tsx`: extend the `Lang` array and add a `group` field plus the filter UI.
- `src/lib/translate.functions.ts`: add `LANGUAGE_CONFIG` entries with Google codes (`mni-Mtei`, `sat`, `lus`, `kha`, `trp`, `tcy`, `gom`, `doi`, `bho`, `mai`, `sa`, `zh-CN`, and so on) and Unicode script ranges.
- `src/i18n/LanguageProvider.tsx`: extend `SUPPORTED_LANGS`, `RTL_LANGS` (`ar`, `fa`, `sd`) and the dropdown, which is already scrollable.
- Verification: run a batch translation per new code and confirm the alphabet; play a sample of Kitab cards.

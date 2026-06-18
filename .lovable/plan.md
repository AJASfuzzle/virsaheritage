# Plan

## 1. Hero — remove the shorter blur, keep the longer fade

The bottom of the hero stacks two overlapping fade layers between the image and the cream section below:

- **Long fade (keep)** — the `WebkitMaskImage` / `maskImage` gradient on the `<section>` in `src/components/site/Hero.tsx` (lines 11–16). This is the soft, full-width fade-to-transparent that blends the image into the next section.
- **Shorter blur (remove)** — the bottom-heavy dark tonal wash overlay on line 27: `bg-[linear-gradient(180deg,oklch(...)_0%, ...78%, ...100%)]`. The `78%→100%` darkening stop creates a second, shorter, darker band right above the mask fade. That is the second "blur" visible in the screenshot.

**Change:** lighten the tonal-wash gradient so it no longer adds a dark band at the bottom — keep only the top/mid wash for legibility of text, and let the mask fade do all the bottom blending.

## 2. Library — long, heartfelt stories for every shelf

In `src/routes/library.tsx`, the `Family Stories` shelf already has long, multi-paragraph human stories. The other six shelves (`Civilizations`, `Languages & Scripts`, `Legends & Folklore`, `Architecture`, `Art & Craft`, `Music & Performance`) currently have 1–2 sentence `body` fields.

**Change:** rewrite the `body` of every story in these six shelves into a long, descriptive, heartfelt narrative in the same voice as the Family Stories — first-person or close-third where appropriate, grounded in a specific place, person, season, or sensory detail, multiple paragraphs separated with `\n\n`, roughly 350–600 words each. Keep `title`, `blurb`, `minutes`, `tag`, and `curator` unchanged. Adjust `minutes` upward slightly to reflect the new length.

Six shelves × ~5 stories ≈ 30 rewritten bodies. No structural / type changes, no other files touched.

## Files

- `src/components/site/Hero.tsx` — soften/trim the bottom-dark tonal-wash gradient (line 27).
- `src/routes/library.tsx` — rewrite `body` strings on ~30 stories across six shelves; bump `minutes` to match.

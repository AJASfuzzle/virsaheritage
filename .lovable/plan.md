## Goal
Use the uploaded VIRSA logos (light + dark variants) as the brand mark across the site, replacing the current Compass-icon + "VIRSA / Heritage Atlas" text lockup.

## Steps

1. **Upload both logos to the CDN** via `lovable-assets`:
   - `src/assets/virsa-logo-light.png.asset.json` (dark wordmark, for light backgrounds)
   - `src/assets/virsa-logo-dark.png.asset.json` (white wordmark, for dark backgrounds)
   No binaries kept in repo.

2. **Create `src/components/site/BrandLogo.tsx`** — a small component that reads `useTheme()` and renders the correct `<img>` with proper `alt="VIRSA"`, fixed height (e.g. `h-7` in navbar, `h-8` in footer), and `width`/`height` set to avoid CLS.

3. **Navbar (`src/components/site/Navbar.tsx`)** — replace the Compass tile + the `VIRSA` + `Heritage Atlas` text spans inside the home `<Link>` with `<BrandLogo />`. Keep the link, aria-label, and hover scale.

4. **Footer (`src/components/site/Footer.tsx`)** — replace the Compass + VIRSA wordmark in the footer brand block with `<BrandLogo />` (slightly larger). Leave the tagline + copyright untouched.

5. No other components touched. Mobile menu, theme toggle, auth controls all stay the same.

## Notes
- The dark-mode logo file is mostly transparent/white pixels with just the pin visible on a white preview; on the actual dark theme background it will render correctly as the white wordmark + brown pin.
- No design tokens, routes, or business logic change.
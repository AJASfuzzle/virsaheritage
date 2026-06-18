## Phase 1 — UI polish + Atlas-driven progression

Good news on the backend: the database already has everything we need. `heritage_sites` (39 rows, 4 trails) carries `lat/lng/radius_m/coin_reward/trail_slug/stop_index`. The `checkin_at_site` RPC handles GPS distance check (Haversine vs `radius_m`), coin issuance, anti-double-claim, trail-complete bonus (+100), and achievement unlocks. `user_coins`, `coin_ledger`, `trail_progress`, `achievements`, `rewards`, `redeem_reward` all exist. Khazane reads balance via `getMyState`. **No new tables needed.** The work is wiring this into a real Google Map and the trail UI.

---

### 1. Hero blur transition fix
- `src/components/site/Hero.tsx` ends with a flat overlay (`oklch(.14_.04_50/.92)` at 100%) that hard-cuts at the section boundary, and `src/styles.css` has a separate `main > section + section::before` blur seam that fights it.
- Replace with a continuous mask: extend the hero overlay 120–160 px past the section bottom using a CSS gradient mask, and let it fade into the next section's background colour. Drop the `::before` blur for the hero→next transition.
- Verify on mobile (100svh quirks), tablet, desktop. Add `prefers-reduced-motion` respect on the ken-burns image (already present, audit).

### 2. Light Mode default
- Currently `Navbar.tsx` defaults `light=false` and writes `.light` to `<html>` on mount → flash of dark, then dark stays.
- Move theme into a `ThemeProvider` (`src/hooks/use-theme.tsx`) with priority: `localStorage("virsa-theme")` → `light` default. System theme is ignored.
- Inline an early script in `src/routes/__root.tsx`'s `<head>` (via `head().scripts`) that sets `.light` on `<html>` before hydration to prevent flash.
- Replace navbar toggle to call `setTheme()`. Keep `Hero` section forced dark via its existing `className="dark"` override (intentional, looks correct).
- Audit the rest of the codebase for color contrast in light mode (most surfaces already use semantic tokens, so this should be one polish pass).

### 3 + 4. Google Maps Atlas with live user pin
- Connect the **Google Maps Platform connector** (asks the user inside Lovable; managed key works on `*.lovable.app`).
- New component `src/components/site/AtlasMap.tsx` using the Maps JS API loaded async with the browser key (`VITE_LOVABLE_CONNECTOR_GOOGLE_MAPS_BROWSER_KEY`). Use `google.maps.Marker` (NOT AdvancedMarkerElement — requires mapId).
- Lazy-load via dynamic import; render a skeleton fallback.
- Pin every `heritage_sites` row as a category-coloured marker. Click → existing site detail panel + a **Check in** button (auth-gated; if signed-out, show "Sign in to earn coins").
- Keep the existing stylized `HeritageAtlas` (India PNG) as a secondary "Curated view" toggle so we don't lose the editorial design.
- **Geolocation flow:** first visit shows a non-intrusive prompt card ("Allow location to enhance your Atlas") with Allow / Not Now. Persist decision in `localStorage("virsa-geo-consent")`. On Allow, use `navigator.geolocation.watchPosition` (high accuracy, throttled to 5 s).
- Render user as a glowing red pulse marker (SVG symbol, CSS pulse animation on the map div via custom overlay). Pan-to-user button.
- Privacy: never store raw coordinates server-side — `checkin_at_site` already discards lat/lng after the distance check; we don't log location anywhere else.

### 5. Atlas ↔ Trails source of truth
- `src/lib/trails-data.ts` (static editorial copy) stays for prose. The **map and progression** read from DB `heritage_sites` joined to that copy by `trail_slug` + `stop_index`. New helper `src/lib/trails.functions.ts` (server fn): `getTrailWithProgress(slug)` returns stops + checked-in flag per stop for current user.
- Trail detail page (`src/routes/trails.$slug.tsx`) gets: per-stop status (locked/available/done), progress bar (X / N), open-in-map button that deep-links Atlas to that pin.
- Schema is already future-proof for AR/audio/checkpoints — they'd be new optional columns or a `stop_extras` table later.

### 6. Trail verification
- Use the existing `checkin_at_site(_site_id, _lat, _lng)` RPC. It already does Haversine + `radius_m` gate, blocks duplicates, awards on trail completion.
- Add a small anti-abuse layer client-side: only enable Check-in button when `navigator.geolocation` reports `accuracy < 100 m` and movement since last check-in is plausible (rate-limit: 1 check-in per 30 s, enforced both client + by a new column `last_checkin_at` we can add later — out of scope this phase, leave RPC as the server gate).
- Demo mode (`_force=true`) only available to a dev role — hide from production UI.

### 7. Reward points engine
- Already implemented inside `checkin_at_site` (per-site coin + 100 bonus on trail complete + achievement). No new logic needed; expose category multipliers later by adding a `multiplier` column to `heritage_sites` and a `season` table — flagged as future, not built now.

### 8. Khazane live balance
- `getMyState` already returns balance + achievements. After a successful `checkin_at_site`, invalidate `["my-state"]` and `["trail", slug]` queries → balance updates instantly across Atlas / Trails / Khazane / Dashboard without refresh.
- Add a header coin chip (in `Navbar`) showing live balance for signed-in users; clicking it routes to Khazane.
- Dashboard (`_authenticated/dashboard.tsx`) gets: balance, lifetime earned (sum of positive `coin_ledger` rows), completed trails, active trails (started but not finished).

### 9. Architecture
- New module layout:
  - `src/components/map/` — `GoogleMapProvider.tsx`, `AtlasMap.tsx`, `UserLocationMarker.tsx`, `SiteMarker.tsx`
  - `src/hooks/use-geolocation.ts`, `src/hooks/use-theme.tsx`
  - `src/lib/trails.functions.ts` — typed server fns: `getTrailWithProgress`, `checkInAtSite` (wraps RPC, requires auth via `requireSupabaseAuth`)
- Strict types end-to-end; error boundaries on map components (graceful "Map couldn't load" fallback); console logging gated behind `import.meta.env.DEV`.

---

### Technical notes
- New deps: none required — Google Maps JS loads via `<script>` tag in the map provider.
- Connector required: **Google Maps Platform** (I'll trigger the connect dialog in build mode — the managed key works for `*.lovable.app` and you can add a custom key later for a custom domain).
- Migrations: none in Phase 1.
- Files touched (estimate): ~12 files modified, ~7 new.

### Out of scope for Phase 1 (flagged for Phase 2)
- Route-line drawing between stops, checkpoint polylines, % completion via checkpoints
- Seasonal multiplier engine
- Server-side anti-spoof (movement plausibility on the RPC)
- Digital collectibles / badges in Khazane (UI shell only, no minting)

### One decision needed
**Atlas presentation**: replace the current stylized India PNG entirely with Google Maps, OR keep both views with a "Curated / Live Map" toggle? I recommend the **toggle** so the editorial atlas stays as the landing visual and Google Maps powers exploration + check-ins. Confirm if you want full replacement instead.
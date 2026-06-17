
# KAAL — Auth, Trails, Khazane build plan

Preserves the existing dark heritage aesthetic (oklch ember/jade tokens, Cormorant + Inter, glass surfaces, framer-motion). All new surfaces reuse `glass`, `gradient-ember`, `btn-glossy`, and the current spacing scale. No new color families.

I'll need to enable **Lovable Cloud** (backend) for auth + persistent coins/check-ins. That's a one-click step I'll trigger in Phase 1.

---

## Phase 1 — Backend + Auth (this turn after you approve)

**Backend (Lovable Cloud)**
- `profiles` (id, full_name, avatar_url, created_at)
- `user_coins` (user_id, balance)
- `coin_ledger` (id, user_id, delta, reason, trail_id, site_id, created_at) — append-only audit
- `trail_progress` (user_id, trail_id, site_id, checked_in_at, lat, lng, distance_m)
- `achievements` (user_id, code, unlocked_at)
- `redemptions` (user_id, reward_code, coins_spent, created_at)
- RLS on every table scoped to `auth.uid()`
- Trigger: auto-create profile + `user_coins` row on signup
- Server function `check_in_at_site(site_id, lat, lng)` does Haversine distance server-side, enforces one check-in per site, writes ledger + awards coins atomically (prevents client-side cheating)

**Auth UI**
- `/auth` route — frosted glass card, Cormorant heading, ember accent
- Email + password sign-in / sign-up with strength meter + zod validation
- "Continue with Google" via managed OAuth
- Forgot password → `/reset-password`
- Navbar: replaces "Login" pill with circular avatar dropdown (Profile, My Trails, Khazane, Settings, Logout) when signed in
- `_authenticated/` layout gating `/dashboard`, `/settings`, `/khazane/redeem`

## Phase 2 — Trails check-in + Kaal Coins

- Trail detail page (`/trails/$slug`) gets a **checkpoint tracker**: progress bar, completed/remaining list, coin total
- "Check in here" button per stop → requests geolocation → calls server fn → distance check (50–100 m configurable per site)
- Celebration animation on success (✓ Heritage Site Discovered, coins awarded)
- Trail-complete bonus + achievement unlock
- Each trail card shows coins available + your progress when signed in
- Anti-spoof: server-side distance + 1-per-site + timestamp; flag if >2 check-ins/minute across sites

## Phase 3 — Khazane (rewards)

- New `/khazane` route — gold-leaf hero, "Unlock Treasures Beyond Time", category tabs (Travel, Merchandise, Digital)
- Reward catalog seeded in a `rewards` table (image, title, coins, description, stock)
- Reward card → Redeem modal → server fn deducts coins atomically, writes `redemptions`, shows "You've unlocked a piece of KAAL"
- Live coin balance pill in navbar (next to avatar)

## Phase 4 — Dashboard, Achievements, Settings

- `/dashboard` — welcome header, widgets (balance, trails completed, sites visited, active trails, redemptions, badges grid)
- Achievement badges: First Footsteps, Time Traveler, Keeper of Stories, Heritage Explorer, Trail Master, Guardian of KAAL — unlocked by ledger triggers
- `/settings` — profile, password, notifications, privacy, theme, Google link status

## Phase 5 — Light mode pass + polish

- Audit every new surface in light mode (warm ivory/sandstone/muted gold tokens already in `styles.css`)
- Reduced-motion variants, keyboard focus rings, ARIA labels on icon buttons
- Mobile nav: avatar drawer, sticky check-in CTA on trail pages

---

## Tech notes (for reference)

- Stack stays TanStack Start + Tailwind v4 + framer-motion (we're not switching to Next.js — the existing stack already covers SSR, routing, code-splitting)
- Auth + DB via Lovable Cloud (Supabase under the hood); Google OAuth via the managed broker
- Geolocation: browser API, server-side Haversine for trust
- State: TanStack Query (already wired) — no Zustand needed
- Real coin balance read with `useSuspenseQuery`, mutations invalidate `["coins"]` and `["progress", trailId]`

---

## What I need from you

1. **Approve this plan**, and I'll start with Phase 1 (enable Cloud + auth + schema) in the next turn.
2. **Google sign-in**: enable now, or email/password only for v1? (I default to enabling both.)
3. **Trail check-in radius**: 50 m (strict, requires accurate GPS) or 100 m (forgiving)? Default 75 m.
4. **Seed Khazane catalog**: I'll seed ~9 placeholder rewards (3 per category) with image prompts you can swap later — OK?

Reply "go" (with any tweaks) and I'll ship Phase 1.

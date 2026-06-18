import { AnimatePresence, motion } from "framer-motion";
import { Compass, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import indiaBaseMap from "@/assets/india-base-map.png.asset.json";
import {
  categoryStyles,
  heritageCategories,
  heritageSites,
  TIMELINE_MAX,
  TIMELINE_MIN,
  type HeritageCategory,
  type HeritageSite,
} from "@/lib/heritage-sites";

/**
 * Base map asset is a top-down render of India at 1149×1368 px.
 * 6-parameter affine lon/lat → image-px projection least-squares-fit
 * to four landmark pixels on this exact asset:
 *   • Kanyakumari (south tip)      77.55°E  8.08°N → (353, 1302)
 *   • Arunachal Pradesh (east tip) 97.40°E 28.20°N → (1131, 410)
 *   • Sir Creek / Kutch (west tip) 68.20°E 23.70°N → ( 21, 598)
 *   • Chennai (east coast anchor)  80.27°E 13.08°N → (530, 1020)
 * The 4th anchor corrects a westward bias the 3-point fit had over
 * the southern peninsula (Kerala / TN / Karnataka / Odisha coast).
 */
const MAP = { w: 1149, h: 1368, ratio: 1149 / 1368 };

function project(lon: number, lat: number) {
  const px = -2574.521 + 38.1702 * lon - 0.16319 * lat;
  const py = 1614.569 + 0.14026 * lon - 43.4388 * lat;
  return { x: (px / MAP.w) * 100, y: (py / MAP.h) * 100 };
}

function formatYear(y: number) {
  if (y < 0) return `${Math.abs(y)} BCE`;
  if (y < 1000) return `${y} CE`;
  return `${y}`;
}

export function HeritageAtlas({ initialSiteId }: { initialSiteId?: string } = {}) {
  const [activeCats, setActiveCats] = useState<Set<HeritageCategory>>(new Set());
  const [selected, setSelected] = useState<HeritageSite | null>(
    initialSiteId ? heritageSites.find((s) => s.id === initialSiteId) ?? null : null,
  );
  const [year, setYear] = useState<number>(TIMELINE_MAX);
  const [hover, setHover] = useState<string | null>(null);

  useEffect(() => {
    if (!initialSiteId) return;
    const match = heritageSites.find((s) => s.id === initialSiteId);
    if (match) setSelected(match);
  }, [initialSiteId]);


  const allOn = activeCats.size === 0;

  const toggleCat = (c: HeritageCategory) =>
    setActiveCats((prev) => {
      const next = new Set(prev);
      next.has(c) ? next.delete(c) : next.add(c);
      return next;
    });

  const visible = useMemo(
    () =>
      heritageSites.filter(
        (s) => (allOn || activeCats.has(s.category)) && s.year <= year
      ),
    [activeCats, allOn, year]
  );

  useEffect(() => {
    if (!selected) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setSelected(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selected]);

  return (
    <section className="relative w-full bg-[var(--background)] text-foreground">
      {/* Subtle paper texture — warm cream in light, muted in dark */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.18] mix-blend-multiply dark:opacity-[0.08] dark:mix-blend-screen"
        style={{
          backgroundImage:
            "radial-gradient(rgba(160,120,70,0.22) 1px, transparent 1px)",
          backgroundSize: "3px 3px",
        }}
      />

      <div className="relative mx-auto flex min-h-[calc(100vh-5rem)] max-w-[1600px] flex-col px-4 sm:px-8 pt-6 pb-32">
        {/* Header */}
        <header className="mb-4 flex items-end justify-between gap-6 flex-wrap">
          <div>
            <p className="flex items-center gap-2 text-[11px] uppercase tracking-[0.32em] text-muted-foreground">
              <Compass className="h-3.5 w-3.5" /> Heritage Atlas
            </p>
            <h1
              className="mt-2 font-display text-3xl sm:text-5xl text-foreground text-balance leading-[1.05]"
              style={{ fontFamily: "var(--font-display, 'Cormorant Garamond', serif)" }}
            >
              India, <em className="italic font-normal text-foreground/80">pin by pin</em>
            </h1>
            <p className="mt-2 max-w-xl text-sm text-muted-foreground">
              Drop a pin. Read the story. Scrub the centuries.
            </p>
          </div>

          {/* Category filter chips */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActiveCats(new Set())}
              className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition border ${
                allOn
                  ? "bg-foreground text-background border-foreground"
                  : "bg-card text-foreground/80 border-border hover:border-foreground/40"
              }`}
            >
              All sites
            </button>
            {heritageCategories.map((c) => {
              const on = activeCats.has(c);
              const color = categoryStyles[c].color;
              return (
                <button
                  key={c}
                  onClick={() => toggleCat(c)}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition border flex items-center gap-2 ${
                    on
                      ? "bg-card text-foreground border-foreground"
                      : "bg-card/70 text-muted-foreground border-border hover:border-foreground/40"
                  }`}
                  style={on ? { boxShadow: `inset 3px 0 0 ${color}` } : undefined}
                >
                  <span className="h-2 w-2 rounded-full" style={{ background: color }} />
                  {c}
                </button>
              );
            })}
          </div>
        </header>

        {/* Map canvas — fills the rest of the viewport */}
        <div className="relative flex-1 min-h-[640px] rounded-3xl bg-[color-mix(in_oklab,var(--background)_82%,var(--parchment)_18%)] ring-1 ring-border/60 shadow-[0_30px_60px_-30px_rgba(80,55,20,0.25)] dark:shadow-[0_30px_60px_-30px_rgba(0,0,0,0.5)] overflow-hidden">
          <MapCanvas
            visible={visible}
            hover={hover}
            setHover={setHover}
            selected={selected}
            setSelected={setSelected}
          />

          {/* Counter */}
          <div className="absolute left-4 top-4 rounded-full bg-card/90 backdrop-blur px-3 py-1.5 text-[11px] font-medium text-foreground/80 ring-1 ring-border shadow-sm">
            {visible.length} sites · {formatYear(year)}
          </div>

          {/* Hover label */}
          <AnimatePresence>
            {hover && !selected && (
              <motion.div
                key={hover}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="pointer-events-none absolute right-4 top-4 rounded-lg bg-foreground text-background px-3 py-1.5 text-xs shadow-lg"
              >
                {heritageSites.find((s) => s.id === hover)?.name}
              </motion.div>
            )}
          </AnimatePresence>

        </div>

        {/* Timeline scrubber — below the map so it never covers it */}
        <TimelineScrubber year={year} setYear={setYear} />
      </div>

      {/* Info panel */}
      <AnimatePresence>
        {selected && <SitePanel site={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </section>
  );
}

/* ───────────────────────── Map ───────────────────────── */

function MapCanvas({
  visible,
  hover,
  setHover,
  selected,
  setSelected,
}: {
  visible: HeritageSite[];
  hover: string | null;
  setHover: (id: string | null) => void;
  selected: HeritageSite | null;
  setSelected: (s: HeritageSite | null) => void;
}) {
  return (
    <div className="absolute inset-0 grid place-items-center p-4 sm:p-6">
      <div
        className="relative h-full max-h-full"
        style={{ aspectRatio: `${MAP.w} / ${MAP.h}` }}
      >
        {/* Ambient elevation shadow — Apple-style soft halo */}
        <div
          aria-hidden
          className="pointer-events-none absolute -inset-6 rounded-[2.5rem]"
          style={{
            background:
              "radial-gradient(60% 55% at 50% 55%, rgba(80,60,30,0.18), transparent 70%)",
            filter: "blur(18px)",
          }}
        />
        {/* Base map image — the uploaded India asset, untouched */}
        <img
          src={indiaBaseMap.url}
          alt="Map of India"
          width={MAP.w}
          height={MAP.h}
          draggable={false}
          loading="eager"
          decoding="async"
          className="absolute inset-0 h-full w-full select-none object-contain"
          style={{ WebkitUserDrag: "none" } as React.CSSProperties}
        />

        {/* Pushpins layer — aligned to the image's lon/lat calibration */}
        <div className="absolute inset-0">
          {visible.map((site) => {
            const { x, y } = project(site.lon, site.lat);
            const color = categoryStyles[site.category].color;
            const isHover = hover === site.id;
            const isActive = selected?.id === site.id;
            return (
              <button
                key={site.id}
                onClick={() => setSelected(site)}
                onMouseEnter={() => setHover(site.id)}
                onMouseLeave={() => setHover(hover === site.id ? null : hover)}
                title={site.name}
                aria-label={site.name}
                className="group absolute -translate-x-1/2 -translate-y-1/2 focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 rounded-full"
                style={{ left: `${x}%`, top: `${y}%`, zIndex: isHover || isActive ? 50 : 10 }}
              >
                <Pushpin color={color} active={isHover || isActive} />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/** Talking Tours-style pushpin: round head + short stem + soft shadow. */
function Pushpin({ color, active }: { color: string; active: boolean }) {
  return (
    <motion.span
      className="relative block"
      animate={{ scale: active ? 1.18 : 1, y: active ? -2 : 0 }}
      whileHover={{ scale: 1.18, y: -2 }}
      transition={{ type: "spring", stiffness: 380, damping: 22 }}
    >
      {/* Ground shadow — Apple-style soft ellipse */}
      <span
        aria-hidden
        className="absolute left-1/2 top-full -translate-x-1/2 h-1.5 w-3 rounded-full bg-foreground/25 blur-[2px]"
      />
      {/* Pin head */}
      <span
        className="relative block h-3 w-3 rounded-full ring-2 ring-white"
        style={{
          background: color,
          boxShadow: active
            ? `0 4px 10px -2px ${color}80, 0 2px 4px rgba(0,0,0,0.18)`
            : "0 2px 5px rgba(0,0,0,0.18)",
        }}
      >
        {/* Subtle inner highlight for translucent depth */}
        <span
          aria-hidden
          className="absolute left-[18%] top-[18%] h-[35%] w-[35%] rounded-full bg-card/60 blur-[0.3px]"
        />
      </span>
      {/* Live pulse when active */}
      {active && (
        <span
          aria-hidden
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-6 w-6 rounded-full animate-ping"
          style={{ background: color, opacity: 0.35 }}
        />
      )}
    </motion.span>
  );
}

/* ───────────────────── Timeline scrubber ───────────────────── */

const TIMELINE_TICKS = [-2500, -1000, -500, 1, 500, 1000, 1500, 1800, 2000];

function TimelineScrubber({ year, setYear }: { year: number; setYear: (n: number) => void }) {
  return (
    <div className="mt-4 w-full">
      <div className="rounded-2xl bg-card/95 backdrop-blur ring-1 ring-border shadow-[0_15px_30px_-15px_rgba(0,0,0,0.4)] px-5 py-3.5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
            Travel back in time
          </span>
          <span className="font-display text-xl text-foreground tabular-nums">
            {formatYear(year)}
          </span>
        </div>
        <div className="relative">
          <input
            type="range"
            min={TIMELINE_MIN}
            max={TIMELINE_MAX}
            step={10}
            value={year}
            onChange={(e) => setYear(parseInt(e.target.value))}
            className="atlas-range w-full"
          />
          <div className="relative mt-2 h-5">
            {TIMELINE_TICKS.map((t) => {
              const pct = ((t - TIMELINE_MIN) / (TIMELINE_MAX - TIMELINE_MIN)) * 100;
              return (
                <button
                  key={t}
                  onClick={() => setYear(t)}
                  className="absolute -translate-x-1/2 text-[10px] tabular-nums text-muted-foreground hover:text-foreground transition cursor-pointer whitespace-nowrap"
                  style={{ left: `${pct}%` }}
                >
                  {formatYear(t)}
                </button>
              );
            })}
          </div>
        </div>
      </div>
      <style>{`
        .atlas-range {
          -webkit-appearance: none;
          appearance: none;
          height: 6px;
          background: linear-gradient(to right, #c2410c, #be123c, #a21caf, #0e7490, #15803d);
          border-radius: 999px;
          outline: none;
        }
        .atlas-range::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: hsl(var(--foreground, 24 6% 10%));
          border: 3px solid var(--color-background);
          box-shadow: 0 2px 6px rgba(0,0,0,0.3);
          cursor: grab;
        }
        .atlas-range::-moz-range-thumb {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: hsl(var(--foreground, 24 6% 10%));
          border: 3px solid var(--color-background);
          box-shadow: 0 2px 6px rgba(0,0,0,0.3);
          cursor: grab;
        }
      `}</style>
    </div>
  );
}

/* ───────────────────── Site info panel ───────────────────── */

function SitePanel({ site, onClose }: { site: HeritageSite; onClose: () => void }) {
  const color = categoryStyles[site.category].color;
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.18 }}
        onClick={onClose}
        className="fixed inset-0 z-40 bg-foreground/30 backdrop-blur-sm"
      />
      {/* Desktop right rail */}
      <motion.aside
        key={site.id}
        initial={{ x: 40, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 40, opacity: 0 }}
        transition={{ type: "spring", stiffness: 280, damping: 32 }}
        className="fixed right-4 top-4 bottom-4 z-50 hidden w-full max-w-md overflow-y-auto rounded-3xl bg-card shadow-2xl ring-1 ring-border sm:block"
      >
        <PanelBody site={site} color={color} onClose={onClose} />
      </motion.aside>

      {/* Mobile bottom sheet */}
      <motion.aside
        key={`${site.id}-m`}
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", stiffness: 280, damping: 32 }}
        className="fixed inset-x-0 bottom-0 z-50 max-h-[88vh] overflow-y-auto rounded-t-3xl bg-card shadow-2xl ring-1 ring-border sm:hidden"
      >
        <div className="sticky top-0 z-10 flex justify-center bg-card pt-2">
          <span className="h-1.5 w-12 rounded-full bg-border" />
        </div>
        <PanelBody site={site} color={color} onClose={onClose} />
      </motion.aside>
    </>
  );
}

function PanelBody({
  site,
  color,
  onClose,
}: {
  site: HeritageSite;
  color: string;
  onClose: () => void;
}) {
  return (
    <div>
      <div className="relative">
        <img src={site.imageUrl} alt={site.name} className="h-64 w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-card via-card/10 to-transparent" />
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-card/90 text-foreground/80 ring-1 ring-border backdrop-blur hover:bg-card"
        >
          <X className="h-4 w-4" />
        </button>
        <div className="absolute bottom-3 left-4 right-4">
          <span
            className="inline-flex items-center gap-1.5 rounded-full bg-card px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] ring-1"
            style={{ color, boxShadow: `inset 0 0 0 1px ${color}33` }}
          >
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: color }} />
            {site.category}
          </span>
        </div>
      </div>

      <div className="px-6 pb-10 pt-5">
        <h2
          className="font-display text-3xl leading-tight text-foreground"
          style={{ fontFamily: "var(--font-display, 'Cormorant Garamond', serif)" }}
        >
          {site.name}
        </h2>
        <div className="mt-1 text-xs text-muted-foreground">
          {site.region} · {formatYear(site.year)}
        </div>

        <div className="mt-5 space-y-3 text-[15px] leading-relaxed text-foreground/80">
          {site.fullDescription.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>

        <div className="mt-7">
          <div className="text-[10px] uppercase tracking-[0.22em]" style={{ color }}>
            Quick facts
          </div>
          <dl className="mt-3 divide-y divide-border rounded-xl border border-border">
            {site.quickFacts.map((f) => (
              <div key={f.label} className="grid grid-cols-[1fr_1.4fr] gap-3 px-4 py-2.5 text-sm">
                <dt className="text-muted-foreground">{f.label}</dt>
                <dd className="text-foreground">{f.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}

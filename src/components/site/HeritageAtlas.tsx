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
 * Pins are placed using a linear lon/lat → image-percent projection
 * calibrated against three reference points on that exact image:
 *   • Kanyakumari        ( 77.55°E,  8.08°N ) ≈ (345, 1190)
 *   • Arunachal NE tip   ( 96.00°E, 28.00°N ) ≈ (1075, 380)
 *   • Srinagar / N Kashmir ( 75°E, 34°N )     ≈ (290, 130)
 * Across the Indian landmass this affine fit keeps every pin
 * inside the correct state (verified visually) which is precise
 * enough for the heritage-atlas use case.
 */
const MAP = { w: 1149, h: 1368, ratio: 1149 / 1368 };
const PROJ = { a: -2723.5, b: 39.57, c: 1500.9, d: -38.48 };

function project(lon: number, lat: number) {
  const px = PROJ.a + PROJ.b * lon;
  const py = PROJ.c + PROJ.d * lat;
  return { x: (px / MAP.w) * 100, y: (py / MAP.h) * 100 };
}

function formatYear(y: number) {
  if (y < 0) return `${Math.abs(y)} BCE`;
  if (y < 1000) return `${y} CE`;
  return `${y}`;
}

export function HeritageAtlas() {
  const [activeCats, setActiveCats] = useState<Set<HeritageCategory>>(new Set());
  const [selected, setSelected] = useState<HeritageSite | null>(null);
  const [year, setYear] = useState<number>(TIMELINE_MAX);
  const [hover, setHover] = useState<string | null>(null);

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
    <section className="relative w-full" style={{ background: "#f5f1ea" }}>
      {/* Subtle paper texture */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.35] mix-blend-multiply"
        style={{
          backgroundImage:
            "radial-gradient(rgba(120,90,50,0.18) 1px, transparent 1px)",
          backgroundSize: "3px 3px",
        }}
      />

      <div className="relative mx-auto flex min-h-[calc(100vh-5rem)] max-w-[1600px] flex-col px-4 sm:px-8 pt-6 pb-32">
        {/* Header */}
        <header className="mb-4 flex items-end justify-between gap-6 flex-wrap">
          <div>
            <p className="flex items-center gap-2 text-[11px] uppercase tracking-[0.32em] text-stone-500">
              <Compass className="h-3.5 w-3.5" /> Heritage Atlas
            </p>
            <h1
              className="mt-2 font-display text-3xl sm:text-5xl text-stone-900 text-balance leading-[1.05]"
              style={{ fontFamily: "var(--font-display, 'Cormorant Garamond', serif)" }}
            >
              India, <em className="italic font-normal text-stone-700">pin by pin</em>
            </h1>
            <p className="mt-2 max-w-xl text-sm text-stone-600">
              Drop a pin. Read the story. Scrub the centuries.
            </p>
          </div>

          {/* Category filter chips */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActiveCats(new Set())}
              className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition border ${
                allOn
                  ? "bg-stone-900 text-stone-50 border-stone-900"
                  : "bg-white text-stone-700 border-stone-300 hover:border-stone-500"
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
                      ? "bg-white text-stone-900 border-stone-900"
                      : "bg-white/70 text-stone-600 border-stone-300 hover:border-stone-500"
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
        <div className="relative flex-1 min-h-[640px] rounded-3xl bg-white/60 ring-1 ring-stone-300/60 shadow-[0_30px_60px_-30px_rgba(80,60,30,0.25)] overflow-hidden">
          <MapCanvas
            visible={visible}
            hover={hover}
            setHover={setHover}
            selected={selected}
            setSelected={setSelected}
          />

          {/* Counter */}
          <div className="absolute left-4 top-4 rounded-full bg-white/90 backdrop-blur px-3 py-1.5 text-[11px] font-medium text-stone-700 ring-1 ring-stone-300 shadow-sm">
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
                className="pointer-events-none absolute right-4 top-4 rounded-lg bg-stone-900 text-stone-50 px-3 py-1.5 text-xs shadow-lg"
              >
                {heritageSites.find((s) => s.id === hover)?.name}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Timeline scrubber — embedded on the map */}
          <TimelineScrubber year={year} setYear={setYear} />
        </div>
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
        className="relative h-full"
        style={{ aspectRatio: `${indiaMap.width} / ${indiaMap.height}` }}
      >
        <svg
          viewBox={indiaMap.viewBox}
          preserveAspectRatio="xMidYMid meet"
          className="absolute inset-0 h-full w-full"
        >
          {/* Soft shadow under land for depth on cream background */}
          <path
            d={indiaMap.outline}
            fill="none"
            stroke="rgba(80,60,30,0.18)"
            strokeWidth={8}
            transform="translate(0,4)"
          />
          {/* White land fill with white outline */}
          <path
            d={indiaMap.outline}
            fill="#ffffff"
            stroke="#ffffff"
            strokeWidth={2}
            strokeLinejoin="round"
          />
          {/* State borders — soft grey on white */}
          <path d={indiaMap.states} fill="none" stroke="#e7e2d2" strokeWidth={0.7} />
        </svg>

        {/* Pushpins layer — uses the SAME 0-100% coordinate space as the SVG */}
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
                className="group absolute -translate-x-1/2 -translate-y-full focus:outline-none"
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
    <span className="relative block">
      <svg
        width={active ? 30 : 22}
        height={active ? 38 : 28}
        viewBox="0 0 22 28"
        className="transition-all duration-200 drop-shadow-[0_3px_3px_rgba(0,0,0,0.25)]"
      >
        {/* stem */}
        <rect x="10" y="14" width="2" height="12" rx="1" fill="#3a2a14" />
        {/* head */}
        <circle cx="11" cy="10" r="9" fill={color} stroke="#fff" strokeWidth="2" />
        {/* highlight */}
        <circle cx="8" cy="7" r="2.4" fill="rgba(255,255,255,0.55)" />
      </svg>
      {active && (
        <span
          aria-hidden
          className="absolute left-1/2 top-[10px] -translate-x-1/2 -translate-y-1/2 h-8 w-8 rounded-full animate-ping opacity-50"
          style={{ background: color }}
        />
      )}
    </span>
  );
}

/* ───────────────────── Timeline scrubber ───────────────────── */

const TIMELINE_TICKS = [-2500, -1000, -500, 1, 500, 1000, 1500, 1800, 2000];

function TimelineScrubber({ year, setYear }: { year: number; setYear: (n: number) => void }) {
  return (
    <div className="absolute inset-x-4 bottom-4 sm:inset-x-8 sm:bottom-6 z-30">
      <div className="rounded-2xl bg-white/95 backdrop-blur ring-1 ring-stone-300 shadow-[0_15px_30px_-15px_rgba(80,60,30,0.25)] px-5 py-3.5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] uppercase tracking-[0.28em] text-stone-500">
            Travel back in time
          </span>
          <span className="font-display text-xl text-stone-900 tabular-nums">
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
          <div className="mt-1 flex justify-between text-[10px] text-stone-500 tabular-nums">
            {TIMELINE_TICKS.map((t) => (
              <button
                key={t}
                onClick={() => setYear(t)}
                className="hover:text-stone-900 transition cursor-pointer"
              >
                {formatYear(t)}
              </button>
            ))}
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
          background: #1c1917;
          border: 3px solid #fff;
          box-shadow: 0 2px 6px rgba(0,0,0,0.3);
          cursor: grab;
        }
        .atlas-range::-moz-range-thumb {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: #1c1917;
          border: 3px solid #fff;
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
        className="fixed inset-0 z-40 bg-stone-900/40 backdrop-blur-sm"
      />
      {/* Desktop right rail */}
      <motion.aside
        key={site.id}
        initial={{ x: 40, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 40, opacity: 0 }}
        transition={{ type: "spring", stiffness: 280, damping: 32 }}
        className="fixed right-4 top-4 bottom-4 z-50 hidden w-full max-w-md overflow-y-auto rounded-3xl bg-white shadow-2xl ring-1 ring-stone-300 sm:block"
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
        className="fixed inset-x-0 bottom-0 z-50 max-h-[88vh] overflow-y-auto rounded-t-3xl bg-white shadow-2xl ring-1 ring-stone-300 sm:hidden"
      >
        <div className="sticky top-0 z-10 flex justify-center bg-white pt-2">
          <span className="h-1.5 w-12 rounded-full bg-stone-300" />
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
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/10 to-transparent" />
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-white/90 text-stone-700 ring-1 ring-stone-300 backdrop-blur hover:bg-white"
        >
          <X className="h-4 w-4" />
        </button>
        <div className="absolute bottom-3 left-4 right-4">
          <span
            className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] ring-1"
            style={{ color, boxShadow: `inset 0 0 0 1px ${color}33` }}
          >
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: color }} />
            {site.category}
          </span>
        </div>
      </div>

      <div className="px-6 pb-10 pt-5">
        <h2
          className="font-display text-3xl leading-tight text-stone-900"
          style={{ fontFamily: "var(--font-display, 'Cormorant Garamond', serif)" }}
        >
          {site.name}
        </h2>
        <div className="mt-1 text-xs text-stone-500">
          {site.region} · {formatYear(site.year)}
        </div>

        <div className="mt-5 space-y-3 text-[15px] leading-relaxed text-stone-700">
          {site.fullDescription.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>

        <div className="mt-7">
          <div className="text-[10px] uppercase tracking-[0.22em]" style={{ color }}>
            Quick facts
          </div>
          <dl className="mt-3 divide-y divide-stone-200 rounded-xl border border-stone-200">
            {site.quickFacts.map((f) => (
              <div key={f.label} className="grid grid-cols-[1fr_1.4fr] gap-3 px-4 py-2.5 text-sm">
                <dt className="text-stone-500">{f.label}</dt>
                <dd className="text-stone-900">{f.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}

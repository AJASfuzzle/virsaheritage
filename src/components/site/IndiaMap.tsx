import { motion } from "framer-motion";
import { Layers, Search } from "lucide-react";

/**
 * Stylised India silhouette preview with animated heritage pins.
 * A real Mapbox integration replaces this once a token is provided.
 */
const pins = [
  { x: 30, y: 22, label: "Kashmir Pashmina" },
  { x: 38, y: 30, label: "Punjabi Bhangra" },
  { x: 56, y: 33, label: "Mithila Painting" },
  { x: 76, y: 38, label: "Assamese Bihu" },
  { x: 32, y: 48, label: "Rajasthani Ghoomar" },
  { x: 48, y: 56, label: "Warli Art" },
  { x: 38, y: 70, label: "Goan Fado" },
  { x: 55, y: 78, label: "Kathakali" },
  { x: 68, y: 70, label: "Carnatic Music" },
  { x: 50, y: 42, label: "Awadhi Cuisine" },
];

const categories = ["Food", "Languages", "Festivals", "Music", "Dance", "Architecture", "Stories", "Crafts", "Rituals"];

export function IndiaMap() {
  return (
    <section id="explore" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5">
        <div className="mb-10 flex items-end justify-between gap-6 flex-wrap">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-primary/90">Heritage Atlas</p>
            <h2 className="mt-3 font-display text-4xl sm:text-5xl max-w-2xl text-balance">
              A living map of <span className="italic text-gradient-ember">a thousand Indias</span>
            </h2>
            <p className="mt-4 max-w-xl text-muted-foreground">
              Drop into any village, valley or coast. Every glowing pin holds a
              memory — a recipe, a dialect, a festival, a song.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.slice(0, 6).map((c) => (
              <span key={c} className="rounded-full glass px-3 py-1.5 text-xs text-foreground/80">
                {c}
              </span>
            ))}
          </div>
        </div>

        <div className="relative overflow-hidden rounded-[2rem] glass grain shadow-[var(--shadow-soft)]">
          <div className="relative h-[60vh] min-h-[480px] w-full">
            <div className="absolute inset-0 [background:radial-gradient(ellipse_at_50%_30%,oklch(0.72_0.18_55/0.18),transparent_60%),radial-gradient(ellipse_at_70%_80%,oklch(0.35_0.12_280/0.25),transparent_60%)]" />

            {/* India silhouette */}
            <svg viewBox="0 0 100 100" className="absolute inset-0 m-auto h-[90%] w-auto" preserveAspectRatio="xMidYMid meet">
              <defs>
                <linearGradient id="g1" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="oklch(0.72 0.18 55 / 0.35)" />
                  <stop offset="100%" stopColor="oklch(0.35 0.12 280 / 0.25)" />
                </linearGradient>
                <filter id="glow"><feGaussianBlur stdDeviation="0.6" /></filter>
              </defs>
              {/* Stylised geography */}
              <path
                d="M30 12 Q42 8 50 14 Q60 10 70 18 Q80 22 78 32 Q86 38 78 48 Q82 58 70 64 Q68 74 60 82 Q54 92 48 90 Q44 80 40 76 Q34 70 38 60 Q28 56 30 48 Q22 42 28 34 Q24 24 30 12 Z"
                fill="url(#g1)"
                stroke="oklch(0.96 0.02 80 / 0.35)"
                strokeWidth="0.4"
              />
              <path
                d="M30 12 Q42 8 50 14 Q60 10 70 18 Q80 22 78 32 Q86 38 78 48 Q82 58 70 64 Q68 74 60 82 Q54 92 48 90"
                fill="none"
                stroke="oklch(0.96 0.02 80 / 0.5)"
                strokeWidth="0.3"
                filter="url(#glow)"
              />
            </svg>

            {/* Pins */}
            {pins.map((p, i) => (
              <motion.div
                key={p.label}
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + i * 0.08, type: "spring", stiffness: 180, damping: 14 }}
                className="absolute -translate-x-1/2 -translate-y-1/2 group"
                style={{ left: `${p.x}%`, top: `${p.y}%` }}
              >
                <span className="absolute -inset-3 rounded-full bg-primary/30 blur-md animate-pulse-pin" />
                <span className="relative block h-3 w-3 rounded-full bg-primary ring-2 ring-background shadow-[0_0_18px_oklch(0.72_0.18_55/0.9)]" />
                <div className="pointer-events-none absolute left-1/2 top-4 -translate-x-1/2 whitespace-nowrap rounded-full glass px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] opacity-0 group-hover:opacity-100 transition">
                  {p.label}
                </div>
              </motion.div>
            ))}

            {/* Search bar */}
            <div className="absolute left-1/2 top-6 w-[min(90%,420px)] -translate-x-1/2">
              <div className="flex items-center gap-2 rounded-full glass px-4 py-2.5">
                <Search className="h-4 w-4 text-muted-foreground" />
                <input
                  placeholder="Search a region, language, or tradition…"
                  className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                />
                <button className="rounded-full bg-primary/90 px-3 py-1 text-xs font-medium text-primary-foreground">
                  Find
                </button>
              </div>
            </div>

            {/* Legend */}
            <div className="absolute bottom-5 left-5 flex items-center gap-2 rounded-full glass px-3 py-2 text-xs">
              <Layers className="h-3.5 w-3.5 text-primary" /> 10 categories · 28 states
            </div>
            <div className="absolute bottom-5 right-5 rounded-full glass px-3 py-2 text-xs text-foreground/70">
              Hover a pin to preview
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

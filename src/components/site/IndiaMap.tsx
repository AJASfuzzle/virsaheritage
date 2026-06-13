import { AnimatePresence, motion } from "framer-motion";
import { Clock, History, Layers, MapPin, Search, Sparkles, Trash2, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type Pin = {
  id: string;
  x: number;
  y: number;
  label: string;
  region: string;
  era: string;
  category: string;
  blurb: string;
  legacy: string;
  successors: string;
};

const pins: Pin[] = [
  { id: "pashmina", x: 30, y: 22, label: "Kashmir Pashmina", region: "Kashmir Valley", era: "15th c. – present", category: "Crafts", blurb: "Fine wool from the Changthangi goat, hand-spun and woven into shawls for Mughal courts.", legacy: "Defined luxury textile vocabulary across Persia and Europe; survives through GI-protected artisans.", successors: "Kanihama Jamawar · Sozni embroidery" },
  { id: "bhangra", x: 38, y: 30, label: "Punjabi Bhangra", region: "Punjab", era: "Harvest festival, 14th c.", category: "Dance", blurb: "A harvest dance born in the wheat fields of Punjab, set to the dhol's heartbeat.", legacy: "Travelled with the diaspora to become a global pop-folk language.", successors: "Giddha · Punjabi MC era" },
  { id: "mithila", x: 56, y: 33, label: "Mithila Painting", region: "Bihar · Nepal border", era: "Ancient · documented 7th c.", category: "Crafts", blurb: "Geometric, mythic murals painted on courtyard walls by women for weddings and festivals.", legacy: "Carried forward Vedic iconography; now an internationally collected folk-art form.", successors: "Madhubani art on paper & silk" },
  { id: "bihu", x: 76, y: 38, label: "Assamese Bihu", region: "Brahmaputra valley", era: "Pre-Ahom, ~3rd c.", category: "Festivals", blurb: "Three-fold spring, autumn and winter festivals tied to rice cultivation and the river's moods.", legacy: "Anchors Assamese identity; Rongali Bihu now a global cultural celebration.", successors: "Bihu geet · Husori troupes" },
  { id: "ghoomar", x: 32, y: 48, label: "Rajasthani Ghoomar", region: "Rajputana", era: "Bhil origin, ~14th c.", category: "Dance", blurb: "A swirling, veiled dance of Rajput women, performed in concentric circles to folk percussion.", legacy: "Symbol of feminine grace across Rajasthan's royal courts.", successors: "Kalbeliya · Chari dance" },
  { id: "warli", x: 48, y: 56, label: "Warli Art", region: "Western Ghats, Maharashtra", era: "Tribal, ~2500 BCE", category: "Crafts", blurb: "Stick-figure murals of dance, hunt and harvest painted in rice paste on mud walls.", legacy: "One of India's oldest living art traditions; now a design language of its own.", successors: "Contemporary Warli on canvas" },
  { id: "fado", x: 38, y: 70, label: "Goan Fado", region: "Goa coast", era: "Portuguese era, 16th–19th c.", category: "Music", blurb: "Saudade-soaked ballads sung in Konkani and Portuguese in candle-lit taverns.", legacy: "Living memory of Indo-Portuguese fusion; mando is its surviving cousin.", successors: "Mando · Konkani tiatr" },
  { id: "kathakali", x: 55, y: 78, label: "Kathakali", region: "Kerala", era: "17th c.", category: "Dance", blurb: "Operatic dance-theatre in elaborate green-faced make-up enacting epics through the night.", legacy: "Shaped global perceptions of classical Indian performance.", successors: "Mohiniyattam · Krishnanattam" },
  { id: "carnatic", x: 68, y: 70, label: "Carnatic Music", region: "Tamil Nadu · Karnataka", era: "Codified 18th c.", category: "Music", blurb: "A raga-tala system perfected by the Trinity — Tyagaraja, Dikshitar and Syama Sastri.", legacy: "Living classical tradition still taught guru-to-shishya across the south.", successors: "Margazhi season · Fusion ensembles" },
  { id: "awadhi", x: 50, y: 42, label: "Awadhi Cuisine", region: "Lucknow, Awadh", era: "Nawabi era, 18th c.", category: "Food", blurb: "Slow-cooked dum biryanis, kebabs and breads refined in the kitchens of Nawabi Lucknow.", legacy: "Set the template for North Indian fine dining and street legends like the Galouti.", successors: "Tunday Kababi · Modern dum cuisine" },
];

const categories = ["All", "Food", "Languages", "Festivals", "Music", "Dance", "Architecture", "Stories", "Crafts", "Rituals"];

const layers = [
  { id: "empires", label: "Empires", color: "oklch(0.74 0.13 75 / 0.18)" },
  { id: "kingdoms", label: "Kingdoms", color: "oklch(0.62 0.14 40 / 0.16)" },
  { id: "linguistic", label: "Linguistic", color: "oklch(0.58 0.10 165 / 0.16)" },
  { id: "trade", label: "Trade routes", color: "oklch(0.20 0.06 270 / 0.22)" },
];

const HISTORY_KEY = "kaal:explored:v1";

function useExplored() {
  const [ids, setIds] = useState<string[]>([]);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(HISTORY_KEY);
      if (raw) setIds(JSON.parse(raw));
    } catch {}
  }, []);
  const persist = (next: string[]) => {
    setIds(next);
    try { localStorage.setItem(HISTORY_KEY, JSON.stringify(next)); } catch {}
  };
  const add = (id: string) => persist([id, ...ids.filter((x) => x !== id)].slice(0, 12));
  const clear = () => persist([]);
  return { ids, add, clear };
}

export function IndiaMap() {
  const [category, setCategory] = useState("All");
  const [active, setActive] = useState<Pin | null>(null);
  const [layer, setLayer] = useState<string>("empires");
  const [query, setQuery] = useState("");
  const { ids: explored, add, clear } = useExplored();

  const filtered = useMemo(() => {
    return pins.filter((p) => {
      const matchCat = category === "All" || p.category === category;
      const matchQ = !query || `${p.label} ${p.region} ${p.era}`.toLowerCase().includes(query.toLowerCase());
      return matchCat && matchQ;
    });
  }, [category, query]);

  const recentlyExplored = explored
    .map((id) => pins.find((p) => p.id === id))
    .filter((p): p is Pin => Boolean(p));

  const open = (p: Pin) => {
    setActive(p);
    add(p.id);
  };

  const activeLayer = layers.find((l) => l.id === layer)!;

  return (
    <section id="explore" className="relative py-24 sm:py-32 scroll-mt-24">
      <div className="mx-auto max-w-7xl px-5">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-primary/90">Heritage Atlas</p>
            <h2 className="mt-3 max-w-2xl text-balance font-display text-4xl sm:text-5xl">
              A living map of <span className="italic text-gradient-ember">a thousand Indias</span>
            </h2>
            <p className="mt-4 max-w-xl text-muted-foreground">
              Drop into any village, valley or coast. Every glowing pin holds a
              memory — a recipe, a dialect, a festival, a song.
            </p>
          </div>
          <div className="flex max-w-full flex-wrap gap-2">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`btn-glossy whitespace-nowrap rounded-full px-3 py-1.5 text-xs transition ${
                  category === c
                    ? "gradient-ember text-primary-foreground shadow-[0_8px_22px_-10px_oklch(0.74_0.13_75/0.8)]"
                    : "glass text-foreground/80 hover:text-foreground"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="relative overflow-hidden rounded-[2rem] glass grain shadow-[var(--shadow-soft)]">
          <div className="relative h-[60vh] min-h-[480px] w-full">
            <div className="absolute inset-0 [background:radial-gradient(ellipse_at_50%_30%,oklch(0.74_0.13_75/0.18),transparent_60%),radial-gradient(ellipse_at_70%_80%,oklch(0.20_0.06_270/0.25),transparent_60%)]" />

            <svg viewBox="0 0 100 100" className="absolute inset-0 m-auto h-[90%] w-auto" preserveAspectRatio="xMidYMid meet">
              <defs>
                <linearGradient id="g1" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="oklch(0.74 0.13 75 / 0.35)" />
                  <stop offset="100%" stopColor="oklch(0.20 0.06 270 / 0.25)" />
                </linearGradient>
                <filter id="glow"><feGaussianBlur stdDeviation="0.6" /></filter>
              </defs>
              <motion.path
                key={activeLayer.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                d="M30 12 Q42 8 50 14 Q60 10 70 18 Q80 22 78 32 Q86 38 78 48 Q82 58 70 64 Q68 74 60 82 Q54 92 48 90 Q44 80 40 76 Q34 70 38 60 Q28 56 30 48 Q22 42 28 34 Q24 24 30 12 Z"
                fill={activeLayer.color}
                stroke="oklch(0.92 0.035 80 / 0.35)"
                strokeWidth="0.4"
              />
              <path
                d="M30 12 Q42 8 50 14 Q60 10 70 18 Q80 22 78 32 Q86 38 78 48 Q82 58 70 64 Q68 74 60 82 Q54 92 48 90"
                fill="none"
                stroke="oklch(0.92 0.035 80 / 0.5)"
                strokeWidth="0.3"
                filter="url(#glow)"
              />
            </svg>

            {filtered.map((p, i) => {
              const visited = explored.includes(p.id);
              return (
                <motion.button
                  key={p.id}
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.15 + i * 0.06, type: "spring", stiffness: 180, damping: 14 }}
                  onClick={() => open(p)}
                  className="group absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                  style={{ left: `${p.x}%`, top: `${p.y}%` }}
                  aria-label={`Explore ${p.label}`}
                >
                  <span className={`absolute -inset-3 rounded-full blur-md animate-pulse-pin ${visited ? "bg-jade/40" : "bg-primary/30"}`} />
                  <span className={`relative block h-3 w-3 rounded-full ring-2 ring-background shadow-[0_0_18px_oklch(0.74_0.13_75/0.9)] ${visited ? "bg-jade" : "bg-primary"}`} />
                  <div className="pointer-events-none absolute left-1/2 top-4 -translate-x-1/2 whitespace-nowrap rounded-full glass px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] opacity-0 transition group-hover:opacity-100">
                    {p.label}
                  </div>
                </motion.button>
              );
            })}

            <div className="absolute left-1/2 top-6 w-[min(90%,420px)] -translate-x-1/2">
              <div className="flex items-center gap-2 rounded-full glass px-4 py-2.5">
                <Search className="h-4 w-4 text-muted-foreground" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search a region, language, or tradition…"
                  className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                />
                <button className="rounded-full bg-primary/90 px-3 py-1 text-xs font-medium text-primary-foreground">
                  Find
                </button>
              </div>
            </div>

            <div className="absolute bottom-5 left-5 flex flex-wrap items-center gap-2 rounded-2xl glass p-2 text-xs">
              <Layers className="ml-1 h-3.5 w-3.5 text-primary" />
              {layers.map((l) => (
                <button
                  key={l.id}
                  onClick={() => setLayer(l.id)}
                  className={`btn-glossy rounded-full px-2.5 py-1 text-[11px] transition ${
                    layer === l.id ? "bg-primary/15 text-foreground ring-1 ring-primary/40" : "text-foreground/65 hover:text-foreground"
                  }`}
                >
                  {l.label}
                </button>
              ))}
            </div>
            <div className="absolute bottom-5 right-5 rounded-full glass px-3 py-2 text-xs text-foreground/70">
              {filtered.length} of {pins.length} memories shown
            </div>
          </div>
        </div>

        {/* Recently Explored */}
        {recentlyExplored.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-8 rounded-3xl glass p-5"
          >
            <div className="mb-3 flex items-center justify-between gap-3">
              <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.28em] text-muted-foreground">
                <History className="h-3.5 w-3.5 text-primary" /> Recently Explored
              </div>
              <button
                onClick={clear}
                className="btn-glossy inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] text-muted-foreground hover:text-foreground"
              >
                <Trash2 className="h-3 w-3" /> Clear history
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {recentlyExplored.map((p) => (
                <button
                  key={p.id}
                  onClick={() => open(p)}
                  className="btn-glossy inline-flex items-center gap-2 rounded-full bg-background/40 px-3 py-1.5 text-xs ring-1 ring-white/5 hover:bg-background/60"
                >
                  <MapPin className="h-3 w-3 text-jade" /> {p.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Rich pop-up */}
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4"
            onClick={() => setActive(null)}
          >
            <div className="absolute inset-0 bg-background/70 backdrop-blur-md" />
            <motion.div
              role="dialog"
              aria-modal="true"
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 220, damping: 24 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-3xl glass grain p-7 shadow-[var(--shadow-soft)]"
            >
              <button
                onClick={() => setActive(null)}
                aria-label="Close"
                className="btn-glossy absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-background/50"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="text-xs uppercase tracking-[0.28em] text-primary/90">{active.category}</div>
              <h3 className="mt-2 font-display text-3xl sm:text-4xl text-balance">{active.label}</h3>
              <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1.5"><MapPin className="h-3 w-3" /> {active.region}</span>
                <span className="inline-flex items-center gap-1.5"><Clock className="h-3 w-3" /> {active.era}</span>
              </div>

              <p className="mt-5 text-foreground/85 leading-relaxed text-pretty">{active.blurb}</p>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl bg-background/40 p-4 ring-1 ring-white/5">
                  <div className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                    <Sparkles className="h-3 w-3 text-primary" /> Cultural Legacy
                  </div>
                  <p className="mt-2 text-sm text-foreground/85">{active.legacy}</p>
                </div>
                <div className="rounded-2xl bg-background/40 p-4 ring-1 ring-white/5">
                  <div className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">Successors & Cousins</div>
                  <p className="mt-2 text-sm text-foreground/85">{active.successors}</p>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-5 text-xs text-muted-foreground">
                <span>Saved to your <span className="text-foreground">Recently Explored</span> trail.</span>
                <a href="#shruti" onClick={() => setActive(null)} className="text-foreground hover:text-primary transition">
                  Hear voices from this region →
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

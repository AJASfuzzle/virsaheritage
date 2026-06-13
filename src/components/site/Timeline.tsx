import { motion } from "framer-motion";
import { useState } from "react";

const years = [1900, 1920, 1947, 1960, 1980, 2000, 2025] as const;
const stories: Record<number, { title: string; body: string; tag: string }> = {
  1900: { tag: "Colonial Era", title: "Lantern-lit folk theatres", body: "Tamasha, Yakshagana and Jatra travel between villages, carrying epics by torchlight." },
  1920: { tag: "Awakening", title: "Charkha & cotton songs", body: "Spinning-wheel ballads spread alongside the Swadeshi movement across rural India." },
  1947: { tag: "Independence", title: "A nation, fifteen languages", body: "Partition reshapes dialects; refugees carry recipes, lullabies and embroideries across new borders." },
  1960: { tag: "Renaissance", title: "All India Radio's golden hour", body: "Classical ragas, Hindi film songs and folk recordings reach the remotest taluk for the first time." },
  1980: { tag: "Cassette India", title: "Audio cassettes carry villages", body: "Regional music explodes — Bhojpuri, Marathi lavani, Punjabi pop redefine cultural identity." },
  2000: { tag: "Digital Dawn", title: "Internet meets ritual", body: "Festivals begin streaming live; diasporas reconnect with home temples and tongues online." },
  2025: { tag: "Present", title: "Memory becomes a map", body: "KAAL collects what oral tradition forgot — preserving voices before the last keepers fade." },
};

export function Timeline() {
  const [active, setActive] = useState<number>(1947);
  const s = stories[active];

  return (
    <section id="timeline" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5">
        <div className="mb-12">
          <p className="text-xs uppercase tracking-[0.28em] text-primary/90">Timeline Explorer</p>
          <h2 className="mt-3 font-display text-4xl sm:text-5xl max-w-2xl text-balance">
            Walk through a <span className="italic text-gradient-ember">century of culture</span>
          </h2>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
          <div className="rounded-3xl glass p-8 grain">
            <div className="text-xs uppercase tracking-[0.28em] text-primary/90">{s.tag}</div>
            <motion.h3
              key={active}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mt-3 font-display text-3xl sm:text-4xl text-balance"
            >
              {s.title}
            </motion.h3>
            <motion.p
              key={`${active}-body`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mt-4 text-foreground/75 text-lg leading-relaxed text-pretty"
            >
              {s.body}
            </motion.p>
            <div className="mt-8 font-display text-7xl sm:text-8xl text-gradient-ember">{active}</div>
          </div>

          <div className="rounded-3xl glass p-8">
            <div className="text-sm text-muted-foreground mb-6">Drag through the decades</div>
            <div className="relative">
              <div className="absolute left-0 right-0 top-1/2 h-px bg-foreground/15" />
              <div className="flex items-center justify-between relative">
                {years.map((y) => (
                  <button
                    key={y}
                    onClick={() => setActive(y)}
                    className="group flex flex-col items-center gap-3"
                  >
                    <span
                      className={`block h-3 w-3 rounded-full transition-all ${
                        active === y
                          ? "bg-primary ring-4 ring-primary/25 scale-125"
                          : "bg-foreground/30 group-hover:bg-foreground/60"
                      }`}
                    />
                    <span
                      className={`font-display text-sm transition ${
                        active === y ? "text-foreground" : "text-foreground/50"
                      }`}
                    >
                      {y}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <input
              type="range"
              min={0}
              max={years.length - 1}
              value={years.indexOf(active as typeof years[number])}
              onChange={(e) => setActive(years[Number(e.target.value)])}
              className="mt-10 w-full accent-primary"
              aria-label="Timeline slider"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

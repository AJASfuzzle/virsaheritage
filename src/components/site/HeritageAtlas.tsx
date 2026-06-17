import { AnimatePresence, motion } from "framer-motion";
import { List, MapPin, MapIcon, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import map2026 from "@/assets/map-2026-v7.png.asset.json";
import {
  ATLAS_ASPECT,
  ATLAS_BOUNDS,
  categoryStyles,
  heritageCategories,
  heritageSites,
  type HeritageCategory,
  type HeritageSite,
} from "@/lib/heritage-sites";

function projectPin(site: HeritageSite) {
  const { lonMin, lonMax, latMin, latMax } = ATLAS_BOUNDS;
  const x = ((site.lon - lonMin) / (lonMax - lonMin)) * 100;
  const y = ((latMax - site.lat) / (latMax - latMin)) * 100;
  return { x, y };
}

export function HeritageAtlas() {
  const [activeCats, setActiveCats] = useState<Set<HeritageCategory>>(new Set());
  const [view, setView] = useState<"map" | "list">("map");
  const [selected, setSelected] = useState<HeritageSite | null>(null);

  const allOn = activeCats.size === 0;

  const toggleCat = (c: HeritageCategory) => {
    setActiveCats((prev) => {
      const next = new Set(prev);
      if (next.has(c)) next.delete(c);
      else next.add(c);
      return next;
    });
  };

  const visible = useMemo(
    () => (allOn ? heritageSites : heritageSites.filter((s) => activeCats.has(s.category))),
    [activeCats, allOn]
  );

  useEffect(() => {
    if (!selected) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setSelected(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selected]);

  return (
    <section className="relative pb-20 pt-6 sm:pt-10">
      <div className="mx-auto max-w-7xl px-5">
        {/* Header */}
        <div className="mb-8">
          <p className="text-xs uppercase tracking-[0.28em] text-primary/90">Heritage Atlas</p>
          <h1 className="mt-3 font-display text-4xl sm:text-5xl text-balance">
            Explore India's <span className="italic text-gradient-ember">cultural and natural heritage</span>
          </h1>
          <p className="mt-4 max-w-2xl text-muted-foreground">
            A curated map of monuments, sanctuaries and living traditions. Choose a category, drop a pin, and read the story.
          </p>
        </div>

        {/* Filter bar + view toggle */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex max-w-full flex-nowrap gap-2 overflow-x-auto pb-1 sm:flex-wrap sm:overflow-visible">
            <button
              onClick={() => setActiveCats(new Set())}
              className={`btn-glossy whitespace-nowrap rounded-full px-4 py-1.5 text-xs transition ${
                allOn
                  ? "gradient-ember text-primary-foreground shadow-[0_8px_22px_-10px_oklch(0.74_0.13_75/0.8)]"
                  : "glass text-foreground/80 hover:text-foreground"
              }`}
            >
              All
            </button>
            {heritageCategories.map((c) => {
              const on = activeCats.has(c);
              const s = categoryStyles[c];
              return (
                <button
                  key={c}
                  onClick={() => toggleCat(c)}
                  className={`btn-glossy whitespace-nowrap rounded-full px-4 py-1.5 text-xs transition flex items-center gap-2 ${
                    on
                      ? "bg-foreground/[0.08] border border-foreground/20 text-foreground"
                      : "glass text-foreground/80 hover:text-foreground"
                  }`}
                >
                  <span className={`h-2 w-2 rounded-full ${s.dot}`} />
                  {c}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-1 rounded-full glass p-1">
            <button
              onClick={() => setView("map")}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs transition ${
                view === "map" ? "bg-foreground/10 text-foreground" : "text-foreground/70"
              }`}
            >
              <MapIcon className="h-3.5 w-3.5" /> Map
            </button>
            <button
              onClick={() => setView("list")}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs transition ${
                view === "list" ? "bg-foreground/10 text-foreground" : "text-foreground/70"
              }`}
            >
              <List className="h-3.5 w-3.5" /> List
            </button>
          </div>
        </div>

        {/* Map or list */}
        {view === "map" ? (
          <div className="relative overflow-hidden rounded-[2rem] glass grain shadow-[var(--shadow-soft)]">
            <div className="relative w-full" style={{ aspectRatio: ATLAS_ASPECT }}>
              <div className="absolute inset-0 [background:radial-gradient(ellipse_at_50%_30%,oklch(0.74_0.13_75/0.18),transparent_60%),radial-gradient(ellipse_at_70%_80%,oklch(0.20_0.06_270/0.25),transparent_60%)]" />
              <img
                src={map2026.url}
                alt="Map of India"
                className="absolute inset-0 h-full w-full object-contain select-none pointer-events-none"
                draggable={false}
              />
              {visible.map((site) => {
                const { x, y } = projectPin(site);
                const s = categoryStyles[site.category];
                const isActive = selected?.id === site.id;
                return (
                  <button
                    key={site.id}
                    onClick={() => setSelected(site)}
                    title={site.name}
                    className="absolute -translate-x-1/2 -translate-y-full group"
                    style={{ left: `${x}%`, top: `${y}%` }}
                  >
                    <span className="relative flex flex-col items-center">
                      <span
                        className={`relative inline-flex h-5 w-5 items-center justify-center rounded-full ${s.dot} ring-2 ring-background shadow-[0_4px_10px_rgba(0,0,0,0.35)] transition group-hover:scale-110 ${
                          isActive ? `ring-4 ${s.ring}` : ""
                        }`}
                      >
                        <span className={`absolute inline-flex h-full w-full animate-ping rounded-full ${s.dot} opacity-40`} />
                        <MapPin className="h-3 w-3 text-white" />
                      </span>
                      <span className="pointer-events-none mt-1 whitespace-nowrap rounded-md bg-background/85 px-2 py-0.5 text-[10px] font-medium text-foreground opacity-0 backdrop-blur transition group-hover:opacity-100">
                        {site.name}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Legend */}
            <div className="absolute bottom-3 left-3 right-3 flex flex-wrap gap-3 rounded-xl bg-background/70 px-3 py-2 text-[11px] backdrop-blur sm:bottom-4 sm:left-4 sm:right-auto sm:max-w-fit">
              {heritageCategories.map((c) => (
                <span key={c} className="inline-flex items-center gap-1.5 text-foreground/80">
                  <span className={`h-2 w-2 rounded-full ${categoryStyles[c].dot}`} />
                  {c}
                </span>
              ))}
            </div>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((site) => {
              const s = categoryStyles[site.category];
              return (
                <button
                  key={site.id}
                  onClick={() => setSelected(site)}
                  className="group overflow-hidden rounded-2xl glass text-left shadow-[var(--shadow-soft)] transition hover:-translate-y-0.5"
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <img
                      src={site.imageUrl}
                      alt={site.name}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
                      loading="lazy"
                    />
                    <span className={`absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-background/85 px-2.5 py-1 text-[10px] uppercase tracking-wider backdrop-blur border ${s.chip}`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
                      {site.category}
                    </span>
                  </div>
                  <div className="p-4">
                    <div className="font-display text-lg">{site.name}</div>
                    <div className="mt-0.5 text-xs text-muted-foreground">{site.region}</div>
                    <p className="mt-2 text-sm text-foreground/80 line-clamp-2">{site.shortDescription}</p>
                  </div>
                </button>
              );
            })}
            {visible.length === 0 && (
              <div className="col-span-full rounded-2xl glass p-10 text-center text-muted-foreground">
                No sites match your filters yet.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Side panel / bottom sheet */}
      <AnimatePresence>
        {selected && (
          <>
            <motion.div
              key="scrim"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setSelected(null)}
              className="fixed inset-0 z-40 bg-black/45 backdrop-blur-sm"
            />
            <motion.aside
              key={selected.id}
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 32 }}
              className="fixed right-0 top-0 z-50 hidden h-full w-full max-w-md overflow-y-auto bg-background shadow-2xl sm:block"
            >
              <SitePanel site={selected} onClose={() => setSelected(null)} />
            </motion.aside>

            {/* Mobile bottom sheet */}
            <motion.aside
              key={`${selected.id}-m`}
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 260, damping: 32 }}
              className="fixed inset-x-0 bottom-0 z-50 max-h-[88vh] overflow-y-auto rounded-t-3xl bg-background shadow-2xl sm:hidden"
            >
              <div className="sticky top-0 z-10 flex justify-center bg-background pt-2">
                <span className="h-1.5 w-12 rounded-full bg-foreground/15" />
              </div>
              <SitePanel site={selected} onClose={() => setSelected(null)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </section>
  );
}

function SitePanel({ site, onClose }: { site: HeritageSite; onClose: () => void }) {
  const s = categoryStyles[site.category];
  return (
    <motion.div
      key={site.id}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      <div className="relative">
        <img src={site.imageUrl} alt={site.name} className="h-60 w-full object-cover sm:h-72" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-3 top-3 rounded-full bg-background/80 p-2 backdrop-blur hover:bg-background"
        >
          <X className="h-4 w-4" />
        </button>
        <div className="absolute bottom-3 left-4 right-4">
          <span className={`inline-flex items-center gap-1.5 rounded-full bg-background/85 px-2.5 py-1 text-[10px] uppercase tracking-wider backdrop-blur border ${s.chip}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
            {site.category}
          </span>
        </div>
      </div>

      <div className="px-6 pb-10 pt-4">
        <h2 className="font-display text-3xl leading-tight">{site.name}</h2>
        <div className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
          <MapPin className="h-3.5 w-3.5" /> {site.region}
        </div>

        <div className="mt-5 space-y-3 text-[15px] leading-relaxed text-foreground/85">
          {site.fullDescription.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>

        <div className="mt-7">
          <div className="text-xs uppercase tracking-[0.22em] text-primary/80">Quick facts</div>
          <dl className="mt-3 divide-y divide-foreground/10 rounded-xl border border-foreground/10">
            {site.quickFacts.map((f) => (
              <div key={f.label} className="grid grid-cols-[1fr_1.4fr] gap-3 px-4 py-2.5 text-sm">
                <dt className="text-muted-foreground">{f.label}</dt>
                <dd className="text-foreground">{f.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </motion.div>
  );
}

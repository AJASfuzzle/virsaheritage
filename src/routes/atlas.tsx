import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense, useState, useEffect } from "react";
import { Loader2, Map as MapIcon, Palette } from "lucide-react";
import { HeritageAtlas } from "@/components/site/HeritageAtlas";

const AtlasMap = lazy(() =>
  import("@/components/map/AtlasMap").then((m) => ({ default: m.AtlasMap }))
);

type AtlasSearch = { site?: string; view?: "live" | "curated" };

export const Route = createFileRoute("/atlas")({
  validateSearch: (search: Record<string, unknown>): AtlasSearch => ({
    site: typeof search.site === "string" ? search.site : undefined,
    view: search.view === "curated" || search.view === "live" ? search.view : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Heritage Atlas - VIRSA" },
      { name: "description", content: "An interactive map of India's cultural and natural heritage - monuments, sanctuaries and living traditions, pin by pin, across three millennia." },
      { property: "og:title", content: "Heritage Atlas - VIRSA" },
      { property: "og:description", content: "Explore India's cultural and natural heritage on an interactive curated map." },
    ],
  }),
  component: AtlasPage,
});

type View = "live" | "curated";

function AtlasPage() {
  const { site, view: viewParam } = Route.useSearch();
  const [view, setView] = useState<View>(viewParam ?? (site ? "curated" : "live"));

  useEffect(() => {
    if (site) setView("curated");
  }, [site]);

  return (
    <div className="pt-24">
      <div className="mx-auto max-w-7xl px-5">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-primary/90">Heritage Atlas</p>
            <h1 className="mt-2 font-display text-4xl sm:text-5xl">
              {view === "live" ? "Find heritage near you." : "An atlas of memory."}
            </h1>
            <p className="mt-2 max-w-2xl text-muted-foreground">
              {view === "live"
                ? "Pinned heritage sites across India. Allow location to check in and earn Virsa Coins as you explore."
                : "A curated cartography of monuments, sanctuaries and living traditions - by category and across three millennia."}
            </p>
          </div>

          <div
            role="tablist"
            aria-label="Atlas view"
            className="inline-flex rounded-full bg-foreground/5 ring-1 ring-[var(--glass-border)] p-1"
          >
            <button
              role="tab"
              aria-selected={view === "live"}
              onClick={() => setView("live")}
              className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-medium transition ${
                view === "live"
                  ? "bg-background text-foreground shadow-[0_4px_14px_-6px_rgba(0,0,0,0.25)]"
                  : "text-foreground/65 hover:text-foreground"
              }`}
            >
              <MapIcon className="h-3.5 w-3.5" /> Live map
            </button>
            <button
              role="tab"
              aria-selected={view === "curated"}
              onClick={() => setView("curated")}
              className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-medium transition ${
                view === "curated"
                  ? "bg-background text-foreground shadow-[0_4px_14px_-6px_rgba(0,0,0,0.25)]"
                  : "text-foreground/65 hover:text-foreground"
              }`}
            >
              <Palette className="h-3.5 w-3.5" /> Curated
            </button>
          </div>
        </div>

        {view === "live" ? (
          <Suspense
            fallback={
              <div className="grid h-[68vh] min-h-[520px] place-items-center rounded-3xl ring-1 ring-[var(--glass-border)] bg-card">
                <div className="inline-flex items-center gap-3 text-muted-foreground text-sm">
                  <Loader2 className="h-4 w-4 animate-spin" /> Loading the Atlas…
                </div>
              </div>
            }
          >
            <AtlasMap />
          </Suspense>
        ) : (
          <HeritageAtlas initialSiteId={site} />
        )}
      </div>
    </div>
  );
}

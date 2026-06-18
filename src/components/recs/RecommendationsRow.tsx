import { useMemo } from "react";
import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, Heart, Lock } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useRecommendations, useSaves, useToggleSave } from "@/hooks/use-recommendations";
import { buildCatalog, indexCatalog, type CatalogItem, type ItemType } from "@/lib/recommendation-catalog";

export type RecommendationsRowProps = {
  surface: "library" | "trails" | "home";
  title?: string;
  subtitle?: string;
  onStoryClick?: (storyId: string) => void;
  filterType?: ItemType;
};

export function RecommendationsRow({
  surface,
  title = "For you",
  subtitle = "Picked by Virsa AI from your interests, saves and trail check-ins.",
  onStoryClick,
  filterType,
}: RecommendationsRowProps) {
  const { user } = useAuth();
  const { data, isLoading } = useRecommendations(surface);
  const { data: saves } = useSaves();
  const toggleSave = useToggleSave();

  const catalogMap = useMemo(() => indexCatalog(buildCatalog()), []);
  const savedSet = useMemo(
    () => new Set((saves ?? []).map((s) => `${s.itemType}:${s.itemId}`)),
    [saves],
  );

  if (!user) {
    return (
      <section className="mx-auto max-w-6xl px-6 py-10">
        <div className="rounded-3xl border border-[var(--glass-border)] bg-[var(--card)]/70 p-8 text-center">
          <Sparkles className="mx-auto mb-3 h-5 w-5 text-[color:var(--accent)]" />
          <h2 className="font-display text-2xl">Personalised by Virsa AI</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Sign in to get stories, trails and sites chosen for you.
          </p>
          <Link
            to="/auth"
            className="btn-glossy mt-5 inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-5 py-2.5 text-xs uppercase tracking-[0.22em] text-[color:var(--accent-foreground)]"
          >
            <Lock className="h-3.5 w-3.5" /> Sign in
          </Link>
        </div>
      </section>
    );
  }

  const allRecs = data?.recommendations ?? [];
  const recs = filterType ? allRecs.filter((r) => r.itemType === filterType) : allRecs;

  return (
    <section className="mx-auto max-w-6xl px-6 py-10">
      <div className="mb-6 flex items-end justify-between gap-6">
        <div>
          <p className="mb-2 flex items-center gap-2 text-xs uppercase tracking-[0.28em] text-[color:var(--accent)]">
            <Sparkles className="h-3.5 w-3.5" /> Virsa AI
          </p>
          <h2 className="font-display text-3xl sm:text-4xl">{title}</h2>
          <p className="mt-1 max-w-xl text-sm text-muted-foreground">{subtitle}</p>
        </div>
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-44 animate-pulse rounded-2xl border border-[var(--glass-border)] bg-[var(--card)]/60"
            />
          ))}
        </div>
      ) : recs.length === 0 ? (
        <p className="text-sm text-muted-foreground">No recommendations yet — save a few items to get started.</p>
      ) : (
        <div className="-mx-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-4 sm:mx-0 sm:grid sm:snap-none sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-3">
          {recs.map((r, i) => {
            const item = catalogMap.get(`${r.itemType}:${r.itemId}`);
            if (!item) return null;
            const isSaved = savedSet.has(`${r.itemType}:${r.itemId}`);
            return (
              <RecCard
                key={`${r.itemType}:${r.itemId}`}
                item={item}
                reason={r.reason}
                isSaved={isSaved}
                onToggleSave={() =>
                  toggleSave.mutate({ itemType: r.itemType, itemId: r.itemId })
                }
                onStoryClick={onStoryClick}
                index={i}
              />
            );
          })}
        </div>
      )}
    </section>
  );
}

function RecCard({
  item,
  reason,
  isSaved,
  onToggleSave,
  onStoryClick,
  index,
}: {
  item: CatalogItem;
  reason: string;
  isSaved: boolean;
  onToggleSave: () => void;
  onStoryClick?: (storyId: string) => void;
  index: number;
}) {
  const cardBody = (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -3 }}
      className="group relative flex h-full w-[78vw] shrink-0 snap-start flex-col overflow-hidden rounded-2xl border border-[var(--glass-border)] bg-gradient-to-br from-[color-mix(in_oklab,var(--card)_92%,var(--accent)_8%)] to-[var(--card)] p-5 text-left shadow-[var(--shadow-soft)] transition-all hover:border-[color:var(--accent)]/40 hover:shadow-[var(--shadow-glow)] sm:w-auto"
    >
      <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-[var(--accent)] opacity-10 blur-3xl transition-opacity group-hover:opacity-20" />

      <div className="mb-3 flex items-center justify-between gap-2">
        <span className="rounded-full bg-[color:var(--accent)]/15 px-2.5 py-1 text-[10px] uppercase tracking-[0.22em] text-[color:var(--accent)]">
          {item.type === "story" ? "Story" : item.type === "trail" ? "Trail" : "Heritage Site"}
        </span>
        {/* spacer for absolute-positioned like button */}
        <span className="h-8 w-8" aria-hidden />
      </div>

      <h3 className="font-display text-xl leading-tight">{item.title}</h3>
      <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{item.blurb}</p>

      <div className="mt-4 rounded-xl border border-[color:var(--accent)]/20 bg-[color:var(--accent)]/5 px-3 py-2">
        <p className="text-[11px] uppercase tracking-[0.22em] text-[color:var(--accent)]">
          Why this
        </p>
        <p className="mt-1 text-sm italic text-foreground/80">{reason}</p>
      </div>

      <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
        <span>{item.region ?? item.category ?? ""}</span>
        <span className="inline-flex items-center gap-1 text-foreground/80 opacity-0 transition group-hover:translate-x-0.5 group-hover:opacity-100">
          Open <ArrowRight className="h-3 w-3" />
        </span>
      </div>
    </motion.div>
  );

  const likeButton = (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onToggleSave();
      }}
      aria-label={isSaved ? "Liked by you" : "Like"}
      title={isSaved ? "Liked by you" : "Like"}
      className={`absolute right-4 top-4 z-20 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[10px] font-medium uppercase tracking-[0.18em] transition ${
        isSaved
          ? "bg-[color:var(--accent)] text-[color:var(--accent-foreground)] shadow-[0_6px_18px_-8px_var(--accent)]"
          : "bg-foreground/5 text-muted-foreground hover:bg-foreground/10 hover:text-foreground"
      }`}
    >
      <Heart className={`h-3.5 w-3.5 ${isSaved ? "fill-current" : ""}`} />
      {isSaved && <span className="hidden sm:inline">Liked by you</span>}
    </button>
  );

  // Wrap card in a relative container, then layer the like button above the link/button.
  let inner: React.ReactNode;
  if (item.type === "trail") {
    inner = (
      <Link to="/trails/$slug" params={{ slug: item.id }} className="block h-full">
        {cardBody}
      </Link>
    );
  } else if (item.type === "site") {
    inner = (
      <Link to="/atlas" search={{ site: item.id, view: "curated" } as any} className="block h-full">
        {cardBody}
      </Link>
    );
  } else {
    inner = (
      <button
        type="button"
        onClick={() => onStoryClick?.(item.id)}
        className="block h-full w-full text-left"
      >
        {cardBody}
      </button>
    );
  }

  return (
    <div className="relative w-[78vw] shrink-0 snap-start sm:w-auto">
      {inner}
      {likeButton}
    </div>
  );
}

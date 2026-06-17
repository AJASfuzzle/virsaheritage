import { AnimatePresence, motion, useMotionValue, useTransform, type PanInfo } from "framer-motion";
import { ArrowRight, Bookmark, ChevronDown, ChevronUp, Clock, Coins, Footprints, MapPin, MountainSnow, Share2, Sparkles } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { trails, type Trail } from "@/lib/trails-data";

const SAVED_KEY = "virsa:trails:saved";

function useSaved() {
  const [saved, setSaved] = useState<string[]>([]);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(SAVED_KEY);
      if (raw) setSaved(JSON.parse(raw));
    } catch {}
  }, []);
  const toggle = (slug: string) => {
    setSaved((prev) => {
      const next = prev.includes(slug) ? prev.filter((s) => s !== slug) : [slug, ...prev];
      try { localStorage.setItem(SAVED_KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  };
  return { saved, toggle };
}

export function Trails() {
  const [index, setIndex] = useState(0);
  const navigate = useNavigate();
  const { saved, toggle } = useSaved();

  const max = trails.length - 1;
  const go = useCallback(
    (delta: number) => setIndex((i) => Math.max(0, Math.min(max, i + delta))),
    [max]
  );

  // Keyboard nav.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === "PageDown") { e.preventDefault(); go(1); }
      else if (e.key === "ArrowUp" || e.key === "PageUp") { e.preventDefault(); go(-1); }
      else if (e.key === "Enter") {
        e.preventDefault();
        navigate({ to: "/trails/$slug", params: { slug: trails[index].slug } });
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, index, navigate]);

  const onDragEnd = (_: unknown, info: PanInfo) => {
    const { offset, velocity } = info;
    if (offset.y < -60 || velocity.y < -300) go(1);
    else if (offset.y > 60 || velocity.y > 300) go(-1);
  };

  // Wheel scroll → trail-to-trail navigation when stack is in view.
  useEffect(() => {
    let last = 0;
    const onWheel = (e: WheelEvent) => {
      const stack = document.getElementById("trail-stack");
      if (!stack) return;
      const r = stack.getBoundingClientRect();
      if (r.bottom < 100 || r.top > window.innerHeight - 100) return;
      const now = Date.now();
      if (now - last < 500) return;
      if (Math.abs(e.deltaY) < 18) return;
      last = now;
      go(e.deltaY > 0 ? 1 : -1);
    };
    window.addEventListener("wheel", onWheel, { passive: true });
    return () => window.removeEventListener("wheel", onWheel);
  }, [go]);

  const handleShare = async (t: Trail) => {
    const url = `${window.location.origin}/trails/${t.slug}`;
    const text = t.hook ? `${t.title} — ${t.hook}` : t.title;
    try {
      if (navigator.share) await navigator.share({ title: t.title, text, url });
      else { await navigator.clipboard.writeText(url); toast.success("Link copied"); }
    } catch {}
  };

  return (
    <section id="trails" className="relative">
      {/* Header */}
      <div className="mx-auto max-w-6xl px-5 pb-4">
        <div className="flex items-end justify-between gap-6 flex-wrap">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-primary/90">Heritage Trails</p>
            <h1 className="mt-3 font-display text-4xl sm:text-5xl text-balance">
              Stories <span className="italic text-gradient-ember">hidden across time</span>
            </h1>
            <p className="mt-3 max-w-xl text-muted-foreground text-sm">
              Swipe through living trails. Tap to fall in. Listen as you walk.
            </p>
          </div>
          <span className="inline-flex items-center gap-2 rounded-full glass px-4 py-2 text-xs text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            {index + 1} of {trails.length}
          </span>
        </div>
      </div>

      {/* Stack */}
      <div id="trail-stack" className="relative mx-auto mt-6 max-w-6xl px-3 sm:px-5 select-none">
        <div className="relative h-[78vh] min-h-[560px] max-h-[860px] [perspective:1400px]">
          {trails.map((t, i) => {
            const offset = i - index;
            if (offset < -1 || offset > 2) return null;
            const isActive = offset === 0;
            return (
              <TrailCard
                key={t.slug}
                trail={t}
                offset={offset}
                isActive={isActive}
                isSaved={saved.includes(t.slug)}
                onSave={() => toggle(t.slug)}
                onShare={() => handleShare(t)}
                onOpen={() => navigate({ to: "/trails/$slug", params: { slug: t.slug } })}
                onDragEnd={onDragEnd}
              />
            );
          })}

          {/* Floating up/down nav — always visible affordance */}
          <div className="pointer-events-none absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-[200] flex flex-col gap-2">
            <button
              onClick={() => go(-1)}
              disabled={index === 0}
              aria-label="Previous trail"
              className="pointer-events-auto grid h-11 w-11 place-items-center rounded-full bg-black/45 text-white ring-1 ring-white/20 backdrop-blur-md transition hover:bg-black/65 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronUp className="h-5 w-5" />
            </button>
            <button
              onClick={() => go(1)}
              disabled={index === max}
              aria-label="Next trail"
              className="pointer-events-auto grid h-11 w-11 place-items-center rounded-full bg-black/45 text-white ring-1 ring-white/20 backdrop-blur-md transition hover:bg-black/65 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronDown className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Controls */}
        <div className="mt-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-1.5">
            {trails.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                aria-label={`Trail ${i + 1}`}
                className={`h-1.5 rounded-full transition-all ${
                  i === index ? "w-8 bg-primary" : "w-1.5 bg-foreground/25 hover:bg-foreground/40"
                }`}
              />
            ))}
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <kbd className="rounded bg-foreground/10 px-1.5 py-0.5">↑</kbd>
            <kbd className="rounded bg-foreground/10 px-1.5 py-0.5">↓</kbd>
            <span className="hidden sm:inline">swipe · scroll · </span>
            <kbd className="rounded bg-foreground/10 px-1.5 py-0.5">↵</kbd>
            <span>open</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function TrailCard({
  trail,
  offset,
  isActive,
  isSaved,
  onSave,
  onShare,
  onOpen,
  onDragEnd,
}: {
  trail: Trail;
  offset: number;
  isActive: boolean;
  isSaved: boolean;
  onSave: () => void;
  onShare: () => void;
  onOpen: () => void;
  onDragEnd: (_: unknown, info: PanInfo) => void;
}) {
  const y = useMotionValue(0);
  const rotate = useTransform(y, [-200, 0, 200], [-2, 0, 2]);
  const liveOpacity = useTransform(y, [-260, 0, 260], [0.6, 1, 0.6]);

  // Layered transform: behind cards slightly scaled + translated down.
  const baseScale = 1 - Math.min(offset, 2) * 0.05;
  const baseY = offset * 18;
  const baseOpacity = offset === 0 ? 1 : offset === 1 ? 0.72 : 0.42;

  return (
    <motion.article
      className="absolute inset-0 origin-top overflow-hidden rounded-[2rem] glass shadow-[0_30px_80px_-30px_rgba(0,0,0,0.6)] ring-1 ring-foreground/10"
      style={{
        zIndex: 100 - offset,
        y: isActive ? y : undefined,
        rotate: isActive ? rotate : undefined,
        opacity: isActive ? liveOpacity : baseOpacity,
      }}
      animate={{
        scale: baseScale,
        y: isActive ? 0 : baseY,
      }}
      transition={{ type: "spring", stiffness: 220, damping: 28 }}
      drag={isActive ? "y" : false}
      dragConstraints={{ top: 0, bottom: 0 }}
      dragElastic={0.35}
      onDragEnd={onDragEnd}
    >
      {/* Cinematic image */}
      <TrailCover trail={trail} y={y} isActive={isActive} offset={offset} />

      {/* Top row */}
      <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-2 p-5 sm:p-7">
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-white/15 text-white ring-1 ring-white/25 backdrop-blur px-3 py-1 text-[11px] uppercase tracking-[0.22em]">
            {trail.kind}
          </span>
          <span className="hidden sm:inline-flex rounded-full bg-black/30 text-white/90 ring-1 ring-white/10 backdrop-blur px-3 py-1 text-[11px]">
            {trail.bestSeason}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={(e) => { e.stopPropagation(); onSave(); }}
            aria-label={isSaved ? "Unsave trail" : "Save trail"}
            className={`grid h-10 w-10 place-items-center rounded-full backdrop-blur ring-1 transition ${
              isSaved
                ? "bg-primary text-primary-foreground ring-primary/40"
                : "bg-black/30 text-white ring-white/15 hover:bg-black/45"
            }`}
          >
            <Bookmark className={`h-4 w-4 ${isSaved ? "fill-current" : ""}`} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onShare(); }}
            aria-label="Share trail"
            className="grid h-10 w-10 place-items-center rounded-full bg-black/30 text-white ring-1 ring-white/15 backdrop-blur hover:bg-black/45 transition"
          >
            <Share2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Content (non-interactive — lets drag pass through) */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 p-5 sm:p-8">
        <div className="text-white/80 text-xs inline-flex items-center gap-1.5">
          <MapPin className="h-3.5 w-3.5" /> {trail.region}
        </div>
        <h2 className="mt-2 font-display text-3xl sm:text-5xl text-white leading-[1.05] text-balance drop-shadow">
          {trail.title}
        </h2>
        {trail.hook && (
          <p className="mt-3 max-w-2xl text-white/85 text-base sm:text-lg italic">
            "{trail.hook}"
          </p>
        )}

        {/* Meta strip */}
        <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-white/85 text-xs sm:text-sm">
          <span className="inline-flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> {trail.days}</span>
          {trail.distance && (
            <span className="inline-flex items-center gap-1.5"><Footprints className="h-3.5 w-3.5" /> {trail.distance}</span>
          )}
          {trail.difficulty && (
            <span className="inline-flex items-center gap-1.5"><MountainSnow className="h-3.5 w-3.5" /> {trail.difficulty}</span>
          )}
          <span className="inline-flex items-center gap-1.5"><Sparkles className="h-3.5 w-3.5" /> {trail.stops.length} stops</span>
          <span className="inline-flex items-center gap-1.5 text-amber-200"><Coins className="h-3.5 w-3.5" /> earn Virsa Coins</span>
        </div>

        <button
          onClick={(e) => { e.stopPropagation(); if (isActive) onOpen(); }}
          disabled={!isActive}
          className="pointer-events-auto mt-6 inline-flex items-center gap-2 rounded-full bg-white text-foreground px-5 py-2.5 text-sm font-semibold shadow-lg hover:bg-white/90 transition disabled:opacity-60"
        >
          Explore Trail <ArrowRight className="h-4 w-4" />
        </button>
      </div>

      {/* Swipe affordance */}
      {isActive && (
        <AnimatePresence>
          <motion.div
            key="hint"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 0.55, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.8 }}
            className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white/70 text-xs hidden sm:block"
          >
            <div className="rounded-full bg-black/30 backdrop-blur px-3 py-1">swipe ↑ for next trail</div>
          </motion.div>
        </AnimatePresence>
      )}
    </motion.article>
  );
}

function TrailCover({ trail, y, isActive, offset }: { trail: Trail; y: ReturnType<typeof useMotionValue<number>>; isActive: boolean; offset: number }) {
  const parallax = useTransform(y, [-200, 200], [12, -12]);
  return (
    <div className="absolute inset-0">
      <motion.img
        src={trail.coverImage}
        alt={trail.title}
        className="h-full w-full object-cover"
        draggable={false}
        loading={offset === 0 ? "eager" : "lazy"}
        style={isActive ? { y: parallax } : undefined}
      />
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(180deg, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.15) 40%, rgba(0,0,0,0.85) 100%), linear-gradient(135deg, ${trail.accentFrom ?? "#7c2d12"}33, transparent 60%)`,
        }}
      />
    </div>
  );
}

import { motion } from "framer-motion";
import { ArrowRight, Clock, Coins, Footprints, MapPin, MountainSnow, Sparkles } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { trails, type Trail } from "@/lib/trails-data";


export function Trails() {
  const navigate = useNavigate();

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
              Scroll through living trails. Tap to fall in. Listen as you walk.
            </p>
          </div>
          <span className="inline-flex items-center gap-2 rounded-full glass px-4 py-2 text-xs text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            {trails.length} trails
          </span>
        </div>
      </div>

      {/* Vertical list */}
      <div className="mx-auto mt-6 max-w-6xl px-3 sm:px-5">
        <div className="flex flex-col gap-6">
          {trails.map((trail, i) => (
            <TrailCard
              key={trail.slug}
              trail={trail}
              index={i}
              onOpen={() => navigate({ to: "/trails/$slug", params: { slug: trail.slug } })}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function TrailCard({
  trail,
  index,
  isSaved,
  onSave,
  onShare,
  onOpen,
}: {
  trail: Trail;
  index: number;
  isSaved: boolean;
  onSave: () => void;
  onShare: () => void;
  onOpen: () => void;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.3) }}
      className="group relative overflow-hidden rounded-3xl glass ring-1 ring-foreground/10 shadow-lg"
    >
      <div className="relative flex flex-col md:flex-row md:min-h-[340px]">
        {/* Cover image */}
        <div className="relative aspect-[16/10] md:aspect-auto md:w-[45%] overflow-hidden">
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background: `radial-gradient(ellipse at 30% 25%, ${trail.accentFrom ?? "#7c2d12"}66, transparent 65%), radial-gradient(ellipse at 75% 80%, ${trail.accentTo ?? "#c2410c"}66, transparent 65%), linear-gradient(135deg, color-mix(in oklab, var(--background) 70%, ${trail.accentFrom ?? "#7c2d12"} 30%), var(--background))`,
            }}
          />
          <div className="absolute inset-0 grid place-items-center">
            <span className="text-7xl drop-shadow-lg" aria-hidden>{trail.hero}</span>
          </div>
          <div className="absolute left-4 top-4 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-white/15 text-white ring-1 ring-white/25 backdrop-blur px-3 py-1 text-[11px] uppercase tracking-[0.22em]">
              {trail.kind}
            </span>
            <span className="rounded-full bg-black/30 text-white/90 ring-1 ring-white/10 backdrop-blur px-3 py-1 text-[11px]">
              {trail.bestSeason}
            </span>
          </div>
        </div>


        {/* Content */}
        <div className="flex flex-1 flex-col justify-between p-5 sm:p-7">
          <div>
            <div className="mb-3 flex items-center gap-3">
              <div className="text-foreground/70 text-xs inline-flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5" /> {trail.region}
              </div>
            </div>

            <h2 className="font-display text-2xl sm:text-4xl text-foreground leading-[1.1] text-balance">
              {trail.title}
            </h2>
            {trail.hook && (
              <p className="mt-3 max-w-2xl text-foreground/80 text-base italic">
                "{trail.hook}"
              </p>
            )}

            {/* Meta strip */}
            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-foreground/70 text-xs sm:text-sm">
              <span className="inline-flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> {trail.days}</span>
              {trail.distance && (
                <span className="inline-flex items-center gap-1.5"><Footprints className="h-3.5 w-3.5" /> {trail.distance}</span>
              )}
              {trail.difficulty && (
                <span className="inline-flex items-center gap-1.5"><MountainSnow className="h-3.5 w-3.5" /> {trail.difficulty}</span>
              )}
              <span className="inline-flex items-center gap-1.5"><Sparkles className="h-3.5 w-3.5" /> {trail.stops.length} stops</span>
              <span className="inline-flex items-center gap-1.5 text-amber-500 dark:text-amber-300"><Coins className="h-3.5 w-3.5" /> earn Virsa Coins</span>
            </div>
          </div>

          <button
            onClick={onOpen}
            className="mt-6 inline-flex w-fit items-center gap-2 rounded-full bg-foreground text-background px-5 py-2.5 text-sm font-semibold shadow-lg hover:bg-foreground/90 transition"
          >
            Explore Trail <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </motion.article>
  );
}

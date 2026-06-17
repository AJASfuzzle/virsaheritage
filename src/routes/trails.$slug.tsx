import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { ArrowLeft, CalendarRange, CheckCircle2, Clock, Coins, Footprints, Lightbulb, Loader2, MapPin, MountainSnow, Navigation, Sparkles, Trophy } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { getTrail, trails, type Trail } from "@/lib/trails-data";
import { listTrailSites, getMyState, checkInAtSite } from "@/lib/virsa.functions";
import { useAuth } from "@/hooks/use-auth";
import { AudioCompanion } from "@/components/site/AudioCompanion";

export const Route = createFileRoute("/trails/$slug")({
  loader: ({ params }) => {
    const trail = getTrail(params.slug);
    if (!trail) throw notFound();
    return { trail };
  },
  head: ({ loaderData }) => {
    const t = loaderData?.trail;
    return {
      meta: [
        { title: t ? `${t.title} — Heritage Trail · VIRSA` : "Trail — VIRSA" },
        { name: "description", content: t?.intro ?? "A VIRSA heritage trail." },
        { property: "og:title", content: t?.title ?? "Heritage Trail" },
        { property: "og:description", content: t?.intro ?? "" },
      ],
    };
  },
  component: TrailDetail,
  notFoundComponent: () => (
    <div className="pt-32 pb-24 text-center">
      <h1 className="font-display text-4xl">Trail not found</h1>
      <Link to="/khazane" hash="trails" className="mt-6 inline-block text-primary hover:underline">← Back to Khazane</Link>
    </div>
  ),
});

type Site = {
  id: string;
  trail_slug: string;
  stop_index: number;
  name: string;
  place: string;
  lat: number;
  lng: number;
  radius_m: number;
  coin_reward: number;
};

function TrailDetail() {
  const { trail } = Route.useLoaderData() as { trail: Trail };
  const { user } = useAuth();
  const others = trails.filter((t) => t.slug !== trail.slug).slice(0, 3);
  const fetchSites = useServerFn(listTrailSites);
  const fetchState = useServerFn(getMyState);
  const checkIn = useServerFn(checkInAtSite);
  const qc = useQueryClient();

  const { data: sites = [] } = useQuery({
    queryKey: ["sites", trail.slug],
    queryFn: () => fetchSites({ data: { trailSlug: trail.slug } }),
  });
  const { data: state } = useQuery({
    queryKey: ["my-state"],
    queryFn: () => fetchState(),
    enabled: !!user,
  });

  const checkedIds = new Set((state?.progress ?? []).filter((p) => p.trail_slug === trail.slug).map((p) => p.site_id));
  const doneCount = checkedIds.size;
  const totalCount = sites.length;
  const pct = totalCount ? Math.round((doneCount / totalCount) * 100) : 0;
  const totalCoinsAvailable = sites.reduce((s, x) => s + x.coin_reward, 0) + 100;

  const [pendingId, setPendingId] = useState<string | null>(null);
  const [celebration, setCelebration] = useState<{ name: string; earned: number; trailComplete: boolean } | null>(null);

  const mutation = useMutation({
    mutationFn: ({ site, lat, lng, force }: { site: Site; lat: number; lng: number; force?: boolean }) =>
      checkIn({ data: { siteId: site.id, lat, lng, force } }),
    onSuccess: (res, vars) => {
      setPendingId(null);
      if (!res.ok) {
        if (res.reason === "too_far") {
          toast.error(`You're ${res.distance_m}m away. Get within ${res.required_m}m to check in.`);
        } else if (res.reason === "already_checked_in") {
          toast.info("Already checked in here.");
        } else {
          toast.error("Check-in failed");
        }
        return;
      }
      qc.invalidateQueries({ queryKey: ["my-state"] });
      setCelebration({ name: vars.site.name, earned: res.earned ?? 0, trailComplete: !!res.trail_complete });
    },
    onError: (e: Error) => {
      setPendingId(null);
      toast.error(e.message);
    },
  });

  function attemptCheckIn(site: Site, force: boolean) {
    if (!user) {
      toast.info("Sign in to check in and earn Virsa Coins.");
      return;
    }
    setPendingId(site.id);
    if (force) {
      mutation.mutate({ site, lat: site.lat, lng: site.lng, force: true });
      return;
    }
    if (!("geolocation" in navigator)) {
      toast.error("Geolocation not supported in this browser.");
      setPendingId(null);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => mutation.mutate({ site, lat: pos.coords.latitude, lng: pos.coords.longitude, force: false }),
      (err) => {
        toast.error(err.message || "Couldn't get your location");
        setPendingId(null);
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 30000 }
    );
  }

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 600], [0, 120]);
  const heroScale = useTransform(scrollY, [0, 400], [1, 1.08]);

  return (
    <article className="relative pb-24">
      {/* Cinematic hero */}
      <div ref={heroRef} className="relative h-[72vh] min-h-[520px] w-full overflow-hidden">
        <motion.img
          src={trail.coverImage}
          alt={trail.title}
          className="absolute inset-0 h-full w-full object-cover"
          style={{ y: heroY, scale: heroScale }}
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.1) 30%, rgba(0,0,0,0.2) 60%, var(--background) 100%)" }} />

        <div className="absolute inset-x-0 top-0 z-10 pt-24">
          <div className="mx-auto max-w-5xl px-5">
            <Link
              to="/trails"
              className="inline-flex items-center gap-2 rounded-full bg-black/40 text-white/90 backdrop-blur ring-1 ring-white/15 px-3 py-1.5 text-sm hover:bg-black/60 transition"
            >
              <ArrowLeft className="h-4 w-4" /> All trails
            </Link>
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-0 z-10">
          <div className="mx-auto max-w-5xl px-5 pb-10">
            <div className="flex items-center gap-2 text-white/80 text-xs">
              <span className="rounded-full bg-white/15 ring-1 ring-white/25 backdrop-blur px-3 py-1 uppercase tracking-[0.22em]">{trail.kind}</span>
              <span className="inline-flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" /> {trail.region}</span>
            </div>
            <h1 className="mt-4 font-display text-5xl sm:text-7xl text-white text-balance leading-[1.02] drop-shadow">
              {trail.title}
            </h1>
            {trail.hook && (
              <p className="mt-4 max-w-2xl text-white/90 text-lg italic">"{trail.hook}"</p>
            )}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-5 -mt-8 relative">



        <header className="mt-8 rounded-3xl glass grain p-8 sm:p-12 relative overflow-hidden">
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-primary/20 blur-[100px]" />
          <div className="absolute -left-24 -bottom-24 h-72 w-72 rounded-full bg-accent/20 blur-[100px]" />
          <div className="relative">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="rounded-full bg-primary/15 text-primary ring-1 ring-primary/30 px-3 py-1 text-[11px] uppercase tracking-[0.22em]">
                {trail.kind}
              </span>
              <span className="text-xs text-muted-foreground inline-flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" /> {trail.days}
              </span>
              <span className="text-xs text-muted-foreground inline-flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5" /> {trail.region}
              </span>
              <span className="text-xs text-muted-foreground inline-flex items-center gap-1.5">
                <CalendarRange className="h-3.5 w-3.5" /> {trail.bestSeason}
              </span>
              <span className="text-xs text-primary inline-flex items-center gap-1.5">
                <Coins className="h-3.5 w-3.5" /> up to {totalCoinsAvailable} Virsa Coins
              </span>
              {trail.distance && (
                <span className="text-xs text-muted-foreground inline-flex items-center gap-1.5">
                  <Footprints className="h-3.5 w-3.5" /> {trail.distance}
                </span>
              )}
              {trail.difficulty && (
                <span className="text-xs text-muted-foreground inline-flex items-center gap-1.5">
                  <MountainSnow className="h-3.5 w-3.5" /> {trail.difficulty}
                </span>
              )}
            </div>
            <p className="mt-6 max-w-3xl text-lg text-foreground/80 text-pretty leading-relaxed">
              {trail.intro}
            </p>


            {/* Progress strip */}
            {user && totalCount > 0 && (
              <div className="mt-8 rounded-2xl bg-background/40 p-4 ring-1 ring-white/5 max-w-xl">
                <div className="flex items-center justify-between text-sm">
                  <span className="inline-flex items-center gap-2 text-foreground/85"><Trophy className="h-4 w-4 text-primary" /> Your progress</span>
                  <span className="text-muted-foreground">{doneCount} / {totalCount} stops · {pct}%</span>
                </div>
                <div className="mt-2 h-2 w-full rounded-full bg-white/5 overflow-hidden">
                  <div className="h-full gradient-ember transition-all duration-700" style={{ width: `${pct}%` }} />
                </div>
              </div>
            )}
            {!user && (
              <div className="mt-8 inline-flex items-center gap-3 rounded-full glass px-4 py-2 text-sm">
                <span className="text-muted-foreground">Sign in to check in at sites and earn coins</span>
                <Link to="/auth" search={{ mode: "signin", redirect: `/trails/${trail.slug}` }} className="rounded-full gradient-ember px-3 py-1 text-xs font-medium text-primary-foreground">Sign in</Link>
              </div>
            )}
          </div>
        </header>

        <section className="mt-14">
          <div className="flex items-end justify-between flex-wrap gap-3 mb-8">
            <h2 className="font-display text-3xl sm:text-4xl">The itinerary</h2>
            <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-muted-foreground">
              <Sparkles className="h-3.5 w-3.5 text-primary" /> {trail.stops.length} stops
            </span>
          </div>

          <ol className="relative border-l border-white/15 pl-8 space-y-6">
            {trail.stops.map((s, i) => {
              const site = sites.find((x) => x.stop_index === i);
              const checked = site ? checkedIds.has(site.id) : false;
              const isPending = pendingId === site?.id;
              return (
                <motion.li
                  key={s.name}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.5, delay: i * 0.04 }}
                  className="relative"
                >
                  <span className={`absolute -left-[42px] top-1 grid h-8 w-8 place-items-center rounded-full ${checked ? "bg-jade text-background" : "gradient-ember text-primary-foreground"} font-display text-sm shadow-[0_8px_22px_-8px_oklch(0.74_0.13_75/0.7)]`}>
                    {checked ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
                  </span>
                  <div className={`overflow-hidden rounded-2xl glass ring-1 ${checked ? "ring-jade/40" : "ring-white/5"} transition`}>
                    {s.imageUrl && (
                      <div className="relative aspect-[16/7] w-full overflow-hidden">
                        <img src={s.imageUrl} alt={s.name} className="h-full w-full object-cover" loading="lazy" />
                        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                      </div>
                    )}
                    <div className="p-5">
                      <div className="flex items-baseline justify-between gap-3 flex-wrap">
                        <h3 className="font-display text-xl">{s.name}</h3>
                        <span className="text-xs text-muted-foreground inline-flex items-center gap-1.5">
                          <MapPin className="h-3 w-3 text-primary" /> {s.place}
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-foreground/80 leading-relaxed text-pretty">
                        {s.story ?? s.blurb}
                      </p>

                      {s.secret && (
                        <div className="mt-4 rounded-xl bg-primary/5 ring-1 ring-primary/20 p-3.5">
                          <div className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.18em] text-primary">
                            <Lightbulb className="h-3 w-3" /> {s.secret.kind}
                          </div>
                          <p className="mt-1 text-sm text-foreground/85 italic leading-relaxed">
                            {s.secret.text}
                          </p>
                        </div>
                      )}

                      {site && (
                        <div className="mt-4 flex items-center justify-between gap-3 flex-wrap">
                          <div className="inline-flex items-center gap-3 text-xs text-muted-foreground">
                            <span className="inline-flex items-center gap-1 text-primary"><Coins className="h-3 w-3" />{site.coin_reward}</span>
                            <span>radius {site.radius_m}m</span>
                          </div>
                          {checked ? (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-jade/15 text-jade ring-1 ring-jade/30 px-3 py-1 text-xs font-medium">
                              <CheckCircle2 className="h-3.5 w-3.5" /> Visited
                            </span>
                          ) : (
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => attemptCheckIn(site, false)}
                                disabled={isPending || !user}
                                className="btn-glossy inline-flex items-center gap-1.5 rounded-full gradient-ember px-3 py-1.5 text-xs font-semibold text-primary-foreground shadow-[0_8px_22px_-8px_oklch(0.72_0.18_55/0.7)] disabled:opacity-50"
                              >
                                {isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Navigation className="h-3.5 w-3.5" />}
                                Check in here
                              </button>
                              {user && import.meta.env.DEV && (
                                <button
                                  onClick={() => attemptCheckIn(site, true)}
                                  disabled={isPending}
                                  title="Demo check-in (dev only) — bypasses geolocation"
                                  className="rounded-full bg-white/5 text-foreground/60 hover:text-foreground px-2.5 py-1.5 text-[11px] ring-1 ring-white/10 transition"
                                >
                                  Demo
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                </motion.li>
              );
            })}
          </ol>
        </section>

        <section className="mt-20">
          <h2 className="font-display text-2xl mb-6">Other trails</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {others.map((t) => (
              <Link
                key={t.slug}
                to="/trails/$slug"
                params={{ slug: t.slug }}
                className="group rounded-2xl glass p-5 ring-1 ring-white/5 hover:ring-primary/30 transition"
              >
                <div className="text-3xl" aria-hidden>{t.hero}</div>
                <div className="mt-3 font-display text-lg group-hover:text-primary transition">{t.title}</div>
                <div className="mt-1 text-xs text-muted-foreground">{t.region} · {t.days}</div>
              </Link>
            ))}
          </div>
        </section>
      </div>

      {/* Celebration overlay */}
      <AnimatePresence>
        {celebration && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 grid place-items-center bg-black/70 backdrop-blur-md p-4"
            onClick={() => setCelebration(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 220, damping: 22 }}
              className="text-center max-w-md"
            >
              <div className="mx-auto h-20 w-20 rounded-full gradient-ember grid place-items-center shadow-[0_30px_60px_-15px_oklch(0.72_0.18_55/0.8)]">
                <CheckCircle2 className="h-10 w-10 text-primary-foreground" />
              </div>
              <h3 className="mt-6 font-display text-3xl text-balance">Heritage Site Discovered.</h3>
              <p className="mt-2 text-muted-foreground">{celebration.name}</p>
              <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-primary/15 px-4 py-2 text-sm text-primary ring-1 ring-primary/30">
                <Coins className="h-4 w-4" /> +{celebration.earned} Virsa Coins
              </div>
              {celebration.trailComplete && (
                <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-jade/15 px-4 py-2 text-sm text-jade ring-1 ring-jade/30">
                  <Trophy className="h-4 w-4" /> Trail complete — Trail Master unlocked
                </div>
              )}
              <div className="mt-6 flex items-center justify-center gap-2 flex-wrap">
                <button onClick={() => setCelebration(null)} className="btn-glossy inline-flex items-center rounded-full gradient-ember px-5 py-2 text-sm font-semibold text-primary-foreground">
                  Continue
                </button>
                <Link to="/khazane" className="inline-flex items-center rounded-full bg-white/10 ring-1 ring-white/15 px-5 py-2 text-sm font-medium text-foreground hover:bg-white/15 transition">
                  Redeem in Khazane →
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AudioCompanion trail={trail} />
    </article>

  );
}

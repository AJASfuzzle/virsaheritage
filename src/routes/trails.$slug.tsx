import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowLeft, CalendarRange, Clock, MapPin, Sparkles } from "lucide-react";
import { getTrail, trails, type Trail } from "@/lib/trails-data";

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
        { title: t ? `${t.title} — Heritage Trail · KAAL` : "Trail — KAAL" },
        { name: "description", content: t?.intro ?? "A KAAL heritage trail." },
        { property: "og:title", content: t?.title ?? "Heritage Trail" },
        { property: "og:description", content: t?.intro ?? "" },
      ],
    };
  },
  component: TrailDetail,
  notFoundComponent: () => (
    <div className="pt-32 pb-24 text-center">
      <h1 className="font-display text-4xl">Trail not found</h1>
      <Link to="/trails" className="mt-6 inline-block text-primary hover:underline">← Back to all trails</Link>
    </div>
  ),
});

function TrailDetail() {
  const { trail } = Route.useLoaderData() as { trail: Trail };
  const others = trails.filter((t) => t.slug !== trail.slug).slice(0, 3);

  return (
    <article className="relative pt-28 pb-24">
      <div className="mx-auto max-w-5xl px-5">
        <Link
          to="/trails"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition"
        >
          <ArrowLeft className="h-4 w-4" /> All Heritage Trails
        </Link>

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
            </div>
            <h1 className="mt-6 font-display text-5xl sm:text-6xl text-balance">
              <span className="mr-3" aria-hidden>{trail.hero}</span>
              <span className="italic text-gradient-ember">{trail.title}</span>
            </h1>
            <p className="mt-6 max-w-3xl text-lg text-foreground/80 text-pretty leading-relaxed">
              {trail.intro}
            </p>
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
            {trail.stops.map((s, i) => (
              <motion.li
                key={s.name}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: i * 0.04 }}
                className="relative"
              >
                <span className="absolute -left-[42px] top-1 grid h-8 w-8 place-items-center rounded-full gradient-ember text-primary-foreground font-display text-sm shadow-[0_8px_22px_-8px_oklch(0.74_0.13_75/0.7)]">
                  {i + 1}
                </span>
                <div className="rounded-2xl glass p-5 ring-1 ring-white/5">
                  <div className="flex items-baseline justify-between gap-3 flex-wrap">
                    <h3 className="font-display text-xl">{s.name}</h3>
                    <span className="text-xs text-muted-foreground inline-flex items-center gap-1.5">
                      <MapPin className="h-3 w-3 text-primary" /> {s.place}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-foreground/80 leading-relaxed text-pretty">
                    {s.blurb}
                  </p>
                </div>
              </motion.li>
            ))}
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
    </article>
  );
}

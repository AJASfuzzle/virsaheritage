import { motion } from "framer-motion";
import { Clock, MapPin, Sparkles } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { trails } from "@/lib/trails-data";

export function Trails() {
  return (
    <section id="trails" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5">
        <div className="mb-12 flex items-end justify-between gap-6 flex-wrap">
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-[0.28em] text-primary/90">Heritage Trails</p>
            <h2 className="mt-3 font-display text-4xl sm:text-5xl text-balance">
              Tourism guided by <span className="italic text-gradient-ember">memory, not maps</span>
            </h2>
          </div>
          <span className="inline-flex items-center gap-2 rounded-full glass px-4 py-2 text-sm">
            <Sparkles className="h-4 w-4 text-primary" /> AI-generated itineraries
          </span>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {trails.map((t, i) => (
            <motion.article
              key={t.slug}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55, delay: i * 0.06 }}
              className="group relative overflow-hidden rounded-3xl glass p-7"
            >
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-primary/15 text-primary ring-1 ring-primary/30 px-3 py-1 text-[11px] uppercase tracking-[0.22em]">
                  {t.kind}
                </span>
                <span className="text-xs text-muted-foreground inline-flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" /> {t.days}
                </span>
              </div>
              <h3 className="mt-5 font-display text-3xl text-balance">{t.title}</h3>
              <div className="mt-3 inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" /> {t.region} · {t.stops.length} stops
              </div>

              <div className="mt-6 flex items-center gap-1.5">
                {t.stops.map((_, j) => (
                  <span key={j} className="flex items-center gap-1.5">
                    <span className={`h-2 w-2 rounded-full ${j === 0 ? "bg-primary" : "bg-foreground/25"}`} />
                    {j < t.stops.length - 1 && <span className="h-px w-5 bg-foreground/20" />}
                  </span>
                ))}
              </div>

              <Link
                to="/trails/$slug"
                params={{ slug: t.slug }}
                className="mt-7 inline-flex items-center gap-2 rounded-full bg-white/5 hover:bg-white/10 transition px-4 py-2 text-sm"
              >
                View trail →
              </Link>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

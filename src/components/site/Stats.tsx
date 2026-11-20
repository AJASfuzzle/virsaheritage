import { motion, useInView, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useRef } from "react";

const stats = [
  { value: 500, suffix: "+", label: "Memories Preserved" },
  { value: 63, suffix: "", label: "Languages Documented" },
  { value: 390, suffix: "+", label: "Stories Archived" },
  { value: 28, suffix: "/28", label: "States & UTs Covered" },
  { value: 100, suffix: "+", label: "Community Contributions" },
  { value: 125, suffix: " yrs", label: "Years Represented" },
];

function Counter({ to, suffix }: { to: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const mv = useMotionValue(0);
  const display = useTransform(mv, (v) => Math.round(v).toLocaleString("en-IN"));

  useEffect(() => {
    if (inView) {
      const controls = animate(mv, to, { duration: 1.8, ease: [0.16, 1, 0.3, 1] });
      return controls.stop;
    }
  }, [inView, mv, to]);

  return (
    <span ref={ref} className="tabular-nums">
      <motion.span>{display}</motion.span>
      {suffix}
    </span>
  );
}

export function Stats() {
  return (
    <section className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5">
        <div className="flex items-end justify-between flex-wrap gap-4 mb-12">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-primary/90">A nation, remembered</p>
            <h2 className="mt-3 font-display text-4xl sm:text-5xl text-balance max-w-2xl">
              The pulse of India's <span className="italic text-gradient-ember">collective memory</span>
            </h2>
          </div>
          <p className="max-w-sm text-sm text-muted-foreground">
            Every entry on VIRSA is a thread in a vast cultural tapestry - woven
            by elders, students, artists, and strangers across the subcontinent.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-3xl glass lg:grid-cols-3">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: i * 0.05 }}
              className="bg-card/40 p-7 sm:p-9"
            >
              <div className="font-display text-4xl sm:text-5xl text-foreground">
                <Counter to={s.value} suffix={s.suffix} />
              </div>
              <div className="mt-3 text-xs uppercase tracking-[0.22em] text-muted-foreground">
                {s.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

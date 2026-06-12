import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import story from "@/assets/tradition-story.jpg";
import festival from "@/assets/tradition-festival.jpg";
import craft from "@/assets/tradition-craft.jpg";
import food from "@/assets/tradition-food.jpg";
import dance from "@/assets/tradition-dance.jpg";

const items = [
  { img: story, title: "Oral Histories of the Konkan Coast", tag: "Stories", region: "Maharashtra · Goa", year: "1947" },
  { img: festival, title: "Diyas of Kartik Purnima", tag: "Festivals", region: "Varanasi, UP", year: "Living" },
  { img: craft, title: "Banarasi Silk Looms", tag: "Crafts", region: "Varanasi, UP", year: "14th c." },
  { img: food, title: "Sadhya of the Backwaters", tag: "Food", region: "Kerala", year: "Living" },
  { img: dance, title: "Kathakali — The Eyes that Speak", tag: "Dance", region: "Kerala", year: "17th c." },
];

export function Traditions() {
  return (
    <section className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5">
        <div className="mb-12 flex items-end justify-between gap-6 flex-wrap">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-primary/90">Featured Traditions</p>
            <h2 className="mt-3 font-display text-4xl sm:text-5xl max-w-2xl text-balance">
              Stories the country <span className="italic text-gradient-ember">still remembers</span>
            </h2>
          </div>
          <a href="#library" className="text-sm text-foreground/70 hover:text-foreground underline-offset-4 hover:underline">
            Enter the Living Library →
          </a>
        </div>

        <div className="-mx-5 overflow-x-auto pb-4 px-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex gap-5 snap-x snap-mandatory">
            {items.map((it, i) => (
              <motion.article
                key={it.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: i * 0.06 }}
                className="group relative aspect-[3/4] w-[78vw] max-w-[340px] shrink-0 snap-start overflow-hidden rounded-3xl border border-white/10 shadow-[var(--shadow-soft)]"
              >
                <img
                  src={it.img}
                  alt={it.title}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.4s] ease-out group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_40%,oklch(0.1_0.03_50/0.92)_100%)]" />
                <div className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full glass px-3 py-1 text-[11px] uppercase tracking-[0.2em]">
                  {it.tag}
                </div>
                <div className="absolute bottom-0 p-6">
                  <h3 className="font-display text-2xl leading-tight text-parchment text-balance">
                    {it.title}
                  </h3>
                  <div className="mt-3 flex items-center gap-3 text-xs text-foreground/70">
                    <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" />{it.region}</span>
                    <span className="h-1 w-1 rounded-full bg-foreground/40" />
                    <span>{it.year}</span>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

import { motion } from "framer-motion";
import { Bot, Send, Sparkles } from "lucide-react";

const examples = [
  "What festivals are unique to Rajasthan?",
  "Show me the folk dances of Assam.",
  "What foods were popular in Punjab in the 1950s?",
  "Which states celebrate similar harvest festivals?",
];

export function Assistant() {
  return (
    <section id="assistant" className="section-blend relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-primary/90">AI Heritage Assistant</p>
            <h2 className="mt-3 font-display text-4xl sm:text-5xl text-balance">
              Ask India anything —
              <br />
              <span className="italic text-gradient-ember">she remembers.</span>
            </h2>
            <p className="mt-5 max-w-lg text-muted-foreground text-pretty text-lg">
              A research-grade assistant trained on KAAL's archive. Every answer
              comes with maps, images, related memories and sources.
            </p>
            <div className="mt-7 flex flex-wrap gap-2">
              {examples.map((e) => (
                <button key={e} className="rounded-full glass px-3.5 py-2 text-xs sm:text-sm text-foreground/80 hover:bg-white/10 transition">
                  {e}
                </button>
              ))}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7 }}
            className="rounded-[2rem] glass grain p-5 sm:p-7 shadow-[var(--shadow-soft)]"
          >
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-muted-foreground">
              <span className="h-2 w-2 rounded-full bg-jade animate-pulse-pin" /> Live · KAAL Assistant
            </div>

            <div className="mt-5 space-y-4">
              <div className="flex justify-end">
                <div className="max-w-[80%] rounded-2xl rounded-tr-md bg-primary/15 ring-1 ring-primary/25 px-4 py-2.5 text-sm">
                  What festivals are unique to Nagaland?
                </div>
              </div>
              <div className="flex gap-3">
                <div className="grid h-8 w-8 place-items-center rounded-full gradient-ember text-primary-foreground shrink-0">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="max-w-[85%] rounded-2xl rounded-tl-md bg-background/40 ring-1 ring-white/10 px-4 py-3 text-sm leading-relaxed">
                  Nagaland is home to the <strong>Hornbill Festival</strong> (Dec 1–10),
                  a ten-day celebration uniting all 17 major tribes through dance,
                  cuisine and folk music. Other distinct festivals include
                  <em> Sekrenyi</em> (Angami), <em>Aoleang</em> (Konyak) and
                  <em> Tuluni</em> (Sumi).
                  <div className="mt-3 flex flex-wrap gap-2">
                    {["Map of Kohima", "Audio: Konyak chant", "Recipes: Smoked pork"].map((c) => (
                      <span key={c} className="inline-flex items-center gap-1.5 rounded-full bg-white/5 ring-1 ring-white/10 px-2.5 py-1 text-[11px]">
                        <Sparkles className="h-3 w-3 text-primary" /> {c}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center gap-2 rounded-full bg-background/50 ring-1 ring-white/10 px-4 py-2.5">
              <input
                className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                placeholder="Ask about a tradition, region, dish or language…"
              />
              <button className="grid h-9 w-9 place-items-center rounded-full gradient-ember text-primary-foreground">
                <Send className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

import { motion } from "framer-motion";
import { Camera, FileText, Mic, Upload, Video } from "lucide-react";

const formats = [
  { icon: Mic, label: "Voice", hint: "Story · Song · Dialect" },
  { icon: Camera, label: "Photo", hint: "Festival · Place · Family" },
  { icon: Video, label: "Video", hint: "Dance · Ritual · Craft" },
  { icon: FileText, label: "Text", hint: "Recipe · Letter · Memory" },
];

export function Contribute() {
  return (
    <section id="contribute" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5">
        <div className="relative overflow-hidden rounded-[2.5rem] glass grain p-10 sm:p-16">
          <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-primary/25 blur-[100px]" />
          <div className="absolute -left-24 -bottom-32 h-96 w-96 rounded-full bg-accent/25 blur-[100px]" />

          <div className="relative grid gap-12 lg:grid-cols-[1.1fr_1fr]">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-primary/90">Contribute a memory</p>
              <h2 className="mt-3 font-display text-4xl sm:text-6xl text-balance">
                Your grandmother knows
                <br />
                a story <span className="italic text-gradient-ember">India must remember.</span>
              </h2>
              <p className="mt-6 max-w-xl text-foreground/80 text-lg text-pretty">
                Upload a recording, a recipe, a photograph or a single sentence
                in a tongue your village still speaks. KAAL transcribes,
                translates and tags it — and places it on India's living map.
              </p>

              <div className="mt-9 flex flex-wrap items-center gap-3">
                <button className="inline-flex items-center gap-2 rounded-full gradient-ember px-6 py-3.5 text-sm font-medium text-primary-foreground shadow-[0_20px_60px_-20px_oklch(0.72_0.18_55/0.7)] hover:brightness-110 transition">
                  <Upload className="h-4 w-4" /> Start contributing
                </button>
                <a href="#assistant" className="inline-flex items-center gap-2 rounded-full glass px-6 py-3.5 text-sm hover:bg-white/10 transition">
                  Ask the AI Assistant
                </a>
              </div>
            </div>

            <div>
              <div className="grid grid-cols-2 gap-3">
                {formats.map((f, i) => {
                  const Icon = f.icon;
                  return (
                    <motion.div
                      key={f.label}
                      initial={{ opacity: 0, y: 18 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: i * 0.06 }}
                      className="rounded-2xl bg-background/40 ring-1 ring-white/10 p-5 hover:ring-primary/40 transition"
                    >
                      <Icon className="h-5 w-5 text-primary" />
                      <div className="mt-3 font-display text-xl">{f.label}</div>
                      <div className="text-xs text-muted-foreground mt-1">{f.hint}</div>
                    </motion.div>
                  );
                })}
              </div>

              <div className="mt-5 rounded-2xl bg-background/40 ring-1 ring-white/10 p-5">
                <div className="text-xs uppercase tracking-[0.22em] text-muted-foreground">AI does the heavy lifting</div>
                <ul className="mt-3 grid grid-cols-2 gap-y-2 text-sm text-foreground/85">
                  <li>• Speech-to-text</li>
                  <li>• Language detection</li>
                  <li>• Auto-summary</li>
                  <li>• Translation</li>
                  <li>• Keywords</li>
                  <li>• Metadata</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

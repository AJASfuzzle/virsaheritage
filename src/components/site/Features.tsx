import { motion } from "framer-motion";
import { Languages, Mic, Bot, BookOpen, Route, Archive, Gamepad2, Dna, Network, HeartPulse } from "lucide-react";

const features = [
  { id: "shruti", icon: Languages, title: "kitab — Language Archive", body: "Preserve dialects with pronunciation, folk tales, proverbs and scripts. AI-generated summaries for every tongue." },
  { id: "contribute", icon: Mic, title: "Memory Contribution Portal", body: "Upload photos, voice, video, letters. AI transcribes, detects language, extracts keywords and translates." },
  { id: "assistant", icon: Bot, title: "AI Heritage Assistant", body: "Ask anything — folk dances of Assam, festivals of Rajasthan, foods of 1950s Punjab. Answers with maps, images, sources." },
  { id: "library", icon: BookOpen, title: "Living Heritage Library", body: "A curated digital archive of foods, recipes, dances, crafts, architecture and folklore — each with timeline and kin." },
  { id: "trails", icon: Route, title: "Heritage Trails", body: "AI-generated tourism routes: food trails, temple trails, festival trails, craft villages — fully mapped." },
  { id: "capsules", icon: Archive, title: "Memory Capsules", body: "Families preserve voice notes, recipes, letters and photos as permanent digital legacies." },
  { id: "game", icon: Gamepad2, title: "GeoGuessr Through Time", body: "Explore AI-rendered scenes from 1920, 1947, 1980. Guess the place, learn its story, earn badges." },
  { id: "dna", icon: Dna, title: "Cultural DNA Engine", body: "Reveals hidden ties between foods, festivals, languages and migration patterns across the subcontinent." },
  { id: "graph", icon: Network, title: "Knowledge Graph", body: "An interactive web of people, places, foods, festivals and stories — see how Indias connect." },
  { id: "emotion", icon: HeartPulse, title: "Emotional Memory Engine", body: "Analyses stories for pride, joy, nostalgia and hope — tagging the feeling inside every memory." },
];

export function Features() {
  return (
    <section id="library" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5">
        <div className="mb-14 max-w-3xl">
          <p className="text-xs uppercase tracking-[0.28em] text-primary/90">An AI-powered atlas</p>
          <h2 className="mt-3 font-display text-4xl sm:text-5xl text-balance">
            Ten ways to <span className="italic text-gradient-ember">remember a country</span>
          </h2>
          <p className="mt-5 text-muted-foreground text-lg text-pretty">
            VIRSA pairs human stories with machine intelligence — translating,
            transcribing, connecting and visualising the heritage that defines us.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.a
                href={`#${f.id}`}
                key={f.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.55, delay: i * 0.04 }}
                className="group relative overflow-hidden rounded-3xl glass p-7 hover:bg-white/[0.08] transition"
              >
                <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary/15 blur-3xl opacity-0 group-hover:opacity-100 transition" />
                <div className="relative">
                  <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary/15 text-primary ring-1 ring-primary/30">
                    <Icon className="h-5 w-5" strokeWidth={1.8} />
                  </div>
                  <h3 className="mt-5 font-display text-xl">{f.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed text-pretty">
                    {f.body}
                  </p>
                </div>
              </motion.a>
            );
          })}
        </div>
      </div>
    </section>
  );
}

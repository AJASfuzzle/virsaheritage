import { motion } from "framer-motion";
import { Play, Volume2 } from "lucide-react";

const languages = [
  { name: "Toda", region: "Nilgiris, Tamil Nadu", speakers: "~1,600", status: "Endangered", phrase: "Mox vey kox" },
  { name: "Sanketi", region: "Karnataka", speakers: "~15,000", status: "Vulnerable", phrase: "Tān ennāva sollū" },
  { name: "Kurukh", region: "Jharkhand · Odisha", speakers: "~2.2 M", status: "Stable", phrase: "Niu kanḍ joka" },
  { name: "Kodava", region: "Coorg, Karnataka", speakers: "~166,000", status: "Vulnerable", phrase: "Nin enyaa ulla" },
  { name: "Mising", region: "Assam · Arunachal", speakers: "~600,000", status: "Vulnerable", phrase: "No yumké do" },
  { name: "Khasi", region: "Meghalaya", speakers: "~1.4 M", status: "Stable", phrase: "Khublei shibun" },
];

const status: Record<string, string> = {
  Endangered: "bg-destructive/15 text-destructive ring-destructive/30",
  Vulnerable: "bg-accent/15 text-accent ring-accent/30",
  Stable: "bg-jade/15 text-jade ring-jade/30",
};

export function Shruti() {
  return (
    <section id="shruti" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5">
        <div className="mb-12 flex items-end justify-between gap-6 flex-wrap">
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-[0.28em] text-primary/90">SHRUTI · Language Archive</p>
            <h2 className="mt-3 font-display text-4xl sm:text-5xl text-balance">
              Voices that <span className="italic text-gradient-ember">refuse to fade</span>
            </h2>
            <p className="mt-4 text-muted-foreground text-pretty">
              India speaks in over a thousand tongues. Many will be silent within
              a generation. SHRUTI records them — pronunciation, proverb, song
              and script — for the centuries to come.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-2 text-sm">
            <Volume2 className="h-4 w-4 text-primary" /> 247 languages mapped
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {languages.map((l, i) => (
            <motion.div
              key={l.name}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55, delay: i * 0.05 }}
              className="group relative overflow-hidden rounded-3xl glass p-6"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-display text-3xl">{l.name}</div>
                  <div className="text-xs uppercase tracking-[0.22em] text-muted-foreground mt-1">
                    {l.region}
                  </div>
                </div>
                <span className={`rounded-full px-2.5 py-1 text-[10px] uppercase tracking-[0.2em] ring-1 ${status[l.status]}`}>
                  {l.status}
                </span>
              </div>

              <div className="mt-6 flex items-center gap-3 rounded-2xl bg-background/40 ring-1 ring-white/5 p-3">
                <button className="grid h-10 w-10 place-items-center rounded-full gradient-ember text-primary-foreground shadow-[0_8px_22px_-8px_oklch(0.72_0.18_55/0.7)] hover:brightness-110">
                  <Play className="h-4 w-4 ml-0.5" />
                </button>
                <div>
                  <div className="font-display italic text-lg leading-tight">"{l.phrase}"</div>
                  <div className="text-xs text-muted-foreground mt-0.5">Listen to a native speaker</div>
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between text-xs text-muted-foreground">
                <span>{l.speakers} speakers</span>
                <span className="group-hover:text-foreground transition">Open archive →</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

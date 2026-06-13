import { motion } from "framer-motion";
import { Pause, Play, Volume2, Waves } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type Lang = {
  name: string;
  region: string;
  speakers: string;
  status: "Endangered" | "Vulnerable" | "Stable";
  phrase: string;
  /** BCP-47 hint for speech synthesis (falls back to en-IN). */
  bcp47?: string;
  meaning: string;
};

const languages: Lang[] = [
  { name: "Toda", region: "Nilgiris, Tamil Nadu", speakers: "~1,600", status: "Endangered", phrase: "Mox vey kox", meaning: "May the hills bless you.", bcp47: "ta-IN" },
  { name: "Sanketi", region: "Karnataka", speakers: "~15,000", status: "Vulnerable", phrase: "Tān ennāva sollū", meaning: "Tell me what you mean.", bcp47: "kn-IN" },
  { name: "Kurukh", region: "Jharkhand · Odisha", speakers: "~2.2 M", status: "Stable", phrase: "Niu kanḍ joka", meaning: "Where are you going?", bcp47: "hi-IN" },
  { name: "Kodava", region: "Coorg, Karnataka", speakers: "~166,000", status: "Vulnerable", phrase: "Nin enyaa ulla", meaning: "How are you keeping?", bcp47: "kn-IN" },
  { name: "Mising", region: "Assam · Arunachal", speakers: "~600,000", status: "Vulnerable", phrase: "No yumké do", meaning: "Are you well?", bcp47: "as-IN" },
  { name: "Khasi", region: "Meghalaya", speakers: "~1.4 M", status: "Stable", phrase: "Khublei shibun", meaning: "Thank you, deeply.", bcp47: "en-IN" },
];

const statusClass: Record<Lang["status"], string> = {
  Endangered: "bg-destructive/15 text-destructive ring-destructive/30",
  Vulnerable: "bg-accent/15 text-accent ring-accent/30",
  Stable: "bg-jade/15 text-jade ring-jade/30",
};

function useVoice() {
  const [playing, setPlaying] = useState<string | null>(null);
  const utterRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => () => {
    if (typeof window !== "undefined") window.speechSynthesis?.cancel();
  }, []);

  const speak = (id: string, phrase: string, bcp47?: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    const synth = window.speechSynthesis;
    if (playing === id) {
      synth.cancel();
      setPlaying(null);
      return;
    }
    synth.cancel();
    const u = new SpeechSynthesisUtterance(phrase);
    u.lang = bcp47 ?? "en-IN";
    u.rate = 0.88;
    u.pitch = 1.0;
    const voices = synth.getVoices();
    const match = voices.find((v) => v.lang === u.lang) ?? voices.find((v) => v.lang.startsWith(u.lang.split("-")[0]));
    if (match) u.voice = match;
    u.onend = () => setPlaying((p) => (p === id ? null : p));
    u.onerror = () => setPlaying(null);
    utterRef.current = u;
    setPlaying(id);
    synth.speak(u);
  };

  return { playing, speak };
}

export function Shruti() {
  const { playing, speak } = useVoice();

  return (
    <section id="shruti" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5">
        <div className="mb-12 flex items-end justify-between gap-6 flex-wrap">
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-[0.28em] text-primary/90">the kitab · Language Archive</p>
            <h2 className="mt-3 font-display text-4xl sm:text-5xl text-balance">
              Voices that <span className="italic text-gradient-ember">refuse to fade</span>
            </h2>
            <p className="mt-4 text-muted-foreground text-pretty">
              India speaks in over a thousand tongues. Many will be silent within
              a generation. <span className="italic">the kitab</span> records them —
              pronunciation, proverb, song and script — for the centuries to come.
              Tap any phrase to hear an AI reconstruction.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-2 text-sm">
            <Volume2 className="h-4 w-4 text-primary" /> 247 languages mapped
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {languages.map((l, i) => {
            const id = l.name;
            const isPlaying = playing === id;
            return (
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
                    <div className="mt-1 text-xs uppercase tracking-[0.22em] text-muted-foreground">
                      {l.region}
                    </div>
                  </div>
                  <span className={`rounded-full px-2.5 py-1 text-[10px] uppercase tracking-[0.2em] ring-1 ${statusClass[l.status]}`}>
                    {l.status}
                  </span>
                </div>

                <div className="mt-6 flex items-center gap-3 rounded-2xl bg-background/40 p-3 ring-1 ring-white/5">
                  <button
                    onClick={() => speak(id, l.phrase, l.bcp47)}
                    aria-label={isPlaying ? `Pause ${l.name}` : `Play ${l.name}`}
                    className="btn-glossy relative grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-full gradient-ember text-primary-foreground shadow-[0_8px_22px_-8px_oklch(0.74_0.13_75/0.7)]"
                  >
                    {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-0.5" />}
                    {isPlaying && (
                      <span className="absolute inset-0 rounded-full ring-2 ring-primary/40 animate-pulse-pin" />
                    )}
                  </button>
                  <div className="min-w-0 flex-1">
                    <div className="font-display text-lg italic leading-tight">"{l.phrase}"</div>
                    <div className="mt-0.5 truncate text-xs text-muted-foreground">{l.meaning}</div>
                  </div>
                  {isPlaying && (
                    <Waves className="h-4 w-4 shrink-0 text-primary animate-pulse" />
                  )}
                </div>

                <div className="mt-5 flex items-center justify-between text-xs text-muted-foreground">
                  <span>{l.speakers} speakers</span>
                  <span className="inline-flex items-center gap-1 transition group-hover:text-foreground">
                    <Volume2 className="h-3 w-3" /> Voices That Refuse to Fade →
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

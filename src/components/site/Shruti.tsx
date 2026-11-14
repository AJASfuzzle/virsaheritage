import { motion } from "framer-motion";
import { Loader2, Pause, Play, Volume2, Waves } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { synthesizePhrase } from "@/lib/tts.functions";

type Lang = {
  name: string;
  region: string;
  speakers: string;
  status: "Endangered" | "Vulnerable" | "Stable";
  phrase: string;
  bcp47?: string;
  meaning: string;
  voiceId: string;
  group?: "Indian" | "International";
};

// Each language is paired with a distinct ElevenLabs voice so every
// keeper sounds unique. IDs from the curated Top Voice list.
const rawLanguages: Array<Omit<Lang, "voiceId"> & { voiceId?: string }> = [
  { name: "Toda", region: "Nilgiris, Tamil Nadu", speakers: "~1,600", status: "Endangered", phrase: "Mox vey kox", meaning: "May the hills bless you.", bcp47: "ta-IN", voiceId: "EXAVITQu4vr4xnSDxMaL" /* Sarah */ },
  { name: "Sanketi", region: "Karnataka", speakers: "~15,000", status: "Vulnerable", phrase: "Tān ennāva sollū", meaning: "Tell me what you mean.", bcp47: "kn-IN", voiceId: "XrExE9yKIg1WjnnlVkGX" /* Matilda */ },
  { name: "Kurukh", region: "Jharkhand · Odisha", speakers: "~2.2 M", status: "Stable", phrase: "Niu kanḍ joka", meaning: "Where are you going?", bcp47: "hi-IN", voiceId: "onwK4e9ZLuTAKqWW03F9" /* Daniel */ },
  { name: "Kodava", region: "Coorg, Karnataka", speakers: "~166,000", status: "Vulnerable", phrase: "Nin enyaa ulla", meaning: "How are you keeping?", bcp47: "kn-IN", voiceId: "Xb7hH8MSUJpSbSDYk0k2" /* Alice */ },
  { name: "Mising", region: "Assam · Arunachal", speakers: "~600,000", status: "Vulnerable", phrase: "No yumké do", meaning: "Are you well?", bcp47: "as-IN", voiceId: "IKne3meq5aSn9XLyUdCD" /* Charlie */ },
  { name: "Khasi", region: "Meghalaya", speakers: "~1.4 M", status: "Stable", phrase: "Khublei shibun", meaning: "Thank you, deeply.", bcp47: "en-IN", voiceId: "FGY2WhTYpPnrIDTdsKH5" /* Laura */ },
  { name: "Bhili", region: "Madhya Pradesh · Rajasthan", speakers: "~10 M", status: "Stable", phrase: "Tu kasa che", meaning: "How are you, friend?", bcp47: "hi-IN", voiceId: "JBFqnCBsd6RMkjVDRZzb" /* George */ },
  { name: "Gondi", region: "Central India", speakers: "~3 M", status: "Vulnerable", phrase: "Niwa kana mantor", meaning: "What is your name?", bcp47: "hi-IN", voiceId: "nPczCjzI2devNBz1zQrb" /* Brian */ },
  { name: "Santali", region: "Jharkhand · Bengal · Odisha", speakers: "~7.6 M", status: "Stable", phrase: "Johar, ape do banchaw", meaning: "Greetings, may you live long.", bcp47: "hi-IN", voiceId: "cgSgspJ2msm6clMCkdW9" /* Jessica */ },
  { name: "Apatani", region: "Arunachal Pradesh", speakers: "~45,000", status: "Endangered", phrase: "Inkun nyibo dula", meaning: "Walk gently with the spirits.", bcp47: "en-IN", voiceId: "pFZP5JQG7iQjIQuC4Bku" /* Lily */ },
  { name: "Mizo", region: "Mizoram", speakers: "~830,000", status: "Stable", phrase: "I dam em?", meaning: "Are you well?", bcp47: "en-IN", voiceId: "TX3LPaxmHKxFdv7VOQHJ" /* Liam */ },
  { name: "Konyak", region: "Nagaland", speakers: "~250,000", status: "Vulnerable", phrase: "Hayem aboi", meaning: "Peace be with you.", bcp47: "en-IN", voiceId: "N2lVS1w4EtoT3dr4eOWO" /* Callum */ },
  { name: "Saurashtra", region: "Tamil Nadu", speakers: "~250,000", status: "Vulnerable", phrase: "Tu kashe che", meaning: "How do you fare today?", bcp47: "ta-IN", voiceId: "cjVigY5qzO86Huf0OWal" /* Eric */ },
  { name: "Tulu", region: "Karnataka · Kerala", speakers: "~1.8 M", status: "Vulnerable", phrase: "Encha ullar", meaning: "How are you keeping?", bcp47: "kn-IN", voiceId: "pqHfZKP75CvOlQylNhV4" /* Bill */ },
  { name: "Ho", region: "Jharkhand · Odisha", speakers: "~1.4 M", status: "Stable", phrase: "Johar, am chiloka menaiya", meaning: "Greetings, how are you?", bcp47: "hi-IN", voiceId: "CwhRBWXzGAHq8TQ4Fs17" /* Roger */ },
  { name: "Ladakhi", region: "Ladakh", speakers: "~110,000", status: "Vulnerable", phrase: "Julley, kham zang-a", meaning: "Hello, are you well?", bcp47: "hi-IN", voiceId: "SAz9YHcvj6GT2YYXdXww" /* River */ },
  // --- Scheduled Indian languages ---
  { name: "Bodo", region: "Assam", speakers: "~1.5 M", status: "Vulnerable", phrase: "खुलुमबाय", meaning: "Greetings, with respect." },
  { name: "Dogri", region: "Jammu", speakers: "~2.6 M", status: "Vulnerable", phrase: "तुस केह् हाल ओ?", meaning: "How are you?" },
  { name: "Kashmiri", region: "Kashmir Valley", speakers: "~6.8 M", status: "Stable", phrase: "توہہ چھِو ٹھیک؟", meaning: "Are you well?" },
  { name: "Konkani", region: "Goa · Konkan coast", speakers: "~2.3 M", status: "Vulnerable", phrase: "देव बरें करूं", meaning: "May God bless you (thank you)." },
  { name: "Maithili", region: "Mithila, Bihar", speakers: "~13.5 M", status: "Stable", phrase: "अहाँ केहन छी?", meaning: "How are you?" },
  { name: "Manipuri", region: "Manipur", speakers: "~1.8 M", status: "Vulnerable", phrase: "ꯈꯨꯔꯨꯝꯖꯔꯤ", meaning: "I bow to you in greeting." },
  { name: "Sanskrit", region: "Pan-Indian", speakers: "~25,000", status: "Endangered", phrase: "सर्वे भवन्तु सुखिनः", meaning: "May all beings be happy." },
  { name: "Assamese", region: "Assam", speakers: "~15 M", status: "Stable", phrase: "আপুনি কেনে আছে?", meaning: "How are you?" },
  { name: "Odia", region: "Odisha", speakers: "~37 M", status: "Stable", phrase: "ଆପଣ କେମିତି ଅଛନ୍ତି?", meaning: "How are you?" },
  { name: "Nepali", region: "Sikkim · Darjeeling", speakers: "~2.9 M (India)", status: "Stable", phrase: "नमस्कार, सन्चै हुनुहुन्छ?", meaning: "Hello, are you well?" },
  { name: "Sindhi", region: "Kutch · diaspora", speakers: "~2.7 M (India)", status: "Vulnerable", phrase: "توهان ڪيئن آهيو؟", meaning: "How are you?" },
  // --- Regional, endangered & indigenous ---
  { name: "Bhojpuri", region: "Bihar · Uttar Pradesh", speakers: "~50 M", status: "Stable", phrase: "रउआ कइसन बानी?", meaning: "How are you?" },
  { name: "Garo", region: "Meghalaya", speakers: "~1.1 M", status: "Vulnerable", phrase: "Nama gipin?", meaning: "Are you well?" },
  { name: "Kokborok", region: "Tripura", speakers: "~1 M", status: "Vulnerable", phrase: "Kwrwi bwrwi?", meaning: "How are you?" },
  { name: "Lepcha", region: "Sikkim", speakers: "~50,000", status: "Endangered", phrase: "Khamri", meaning: "Greetings to you." },
  { name: "Bhutia", region: "Sikkim", speakers: "~70,000", status: "Endangered", phrase: "Kuzu zangpo la", meaning: "Hello, with respect." },
  { name: "Nyishi", region: "Arunachal Pradesh", speakers: "~300,000", status: "Vulnerable", phrase: "Ane donyi pa", meaning: "May the Sun-Mother watch over you." },
  { name: "Ao", region: "Nagaland", speakers: "~260,000", status: "Vulnerable", phrase: "Ne kumtsü ajak?", meaning: "Are you well?" },
  { name: "Angami", region: "Nagaland", speakers: "~150,000", status: "Vulnerable", phrase: "Kuolie", meaning: "Peace and greeting." },
  { name: "Lotha", region: "Nagaland", speakers: "~180,000", status: "Vulnerable", phrase: "Ana nzan to?", meaning: "How are you?" },
  { name: "Tangkhul", region: "Manipur", speakers: "~140,000", status: "Vulnerable", phrase: "Kazat paise", meaning: "Good to see you." },
  { name: "Karbi", region: "Assam", speakers: "~500,000", status: "Vulnerable", phrase: "Kardom", meaning: "Greetings." },
  { name: "Halbi", region: "Bastar, Chhattisgarh", speakers: "~800,000", status: "Vulnerable", phrase: "Tui kemon asis?", meaning: "How are you?" },
  { name: "Korku", region: "Madhya Pradesh · Maharashtra", speakers: "~700,000", status: "Vulnerable", phrase: "Johar, iñj bes", meaning: "Greetings, I am well." },
  { name: "Mundari", region: "Jharkhand", speakers: "~1.1 M", status: "Vulnerable", phrase: "Johar, am bugin menama?", meaning: "Greetings, are you well?" },
  { name: "Irula", region: "Nilgiris, Tamil Nadu", speakers: "~200,000", status: "Endangered", phrase: "Nee eppadi irukke?", meaning: "How are you?" },
  { name: "Badaga", region: "Nilgiris, Tamil Nadu", speakers: "~130,000", status: "Vulnerable", phrase: "Nee henge idde?", meaning: "How are you?" },
  { name: "Great Andamanese", region: "Andaman Islands", speakers: "<10", status: "Endangered", phrase: "Ai-te-bo", meaning: "Hello, friend." },
  { name: "Jarawa", region: "Andaman Islands", speakers: "~400", status: "Endangered", phrase: "Ue-ue", meaning: "Welcome." },
  { name: "Bishnupriya", region: "Assam · Tripura", speakers: "~115,000", status: "Endangered", phrase: "তি কিসাদে আসত?", meaning: "How are you?" },
  // --- Major international ---
  { name: "Spanish", region: "Spain · Latin America", speakers: "~560 M", status: "Stable", phrase: "Que la paz sea contigo", meaning: "May peace be with you.", group: "International" },
  { name: "French", region: "France · Africa · Canada", speakers: "~310 M", status: "Stable", phrase: "Bienvenue, mon ami", meaning: "Welcome, my friend.", group: "International" },
  { name: "Mandarin", region: "China · Taiwan", speakers: "~1.1 B", status: "Stable", phrase: "你好，欢迎", meaning: "Hello, welcome.", group: "International" },
  { name: "Arabic", region: "Middle East · North Africa", speakers: "~380 M", status: "Stable", phrase: "السلام عليكم", meaning: "Peace be upon you.", group: "International" },
  { name: "Portuguese", region: "Brazil · Portugal · Goa", speakers: "~260 M", status: "Stable", phrase: "Seja bem-vindo", meaning: "Be welcome.", group: "International" },
  { name: "Russian", region: "Russia · Central Asia", speakers: "~255 M", status: "Stable", phrase: "Добро пожаловать", meaning: "Welcome.", group: "International" },
  { name: "Japanese", region: "Japan", speakers: "~125 M", status: "Stable", phrase: "ようこそ", meaning: "Welcome.", group: "International" },
  { name: "Swahili", region: "East Africa", speakers: "~200 M", status: "Stable", phrase: "Karibu sana", meaning: "You are very welcome.", group: "International" },
  { name: "German", region: "Germany · Austria · Switzerland", speakers: "~135 M", status: "Stable", phrase: "Herzlich willkommen", meaning: "A heartfelt welcome.", group: "International" },
  { name: "Persian", region: "Iran · Afghanistan · Tajikistan", speakers: "~110 M", status: "Stable", phrase: "خوش آمدید", meaning: "Welcome.", group: "International" },
  { name: "Indonesian", region: "Indonesia", speakers: "~200 M", status: "Stable", phrase: "Selamat datang", meaning: "Welcome.", group: "International" },
  { name: "Korean", region: "Korea", speakers: "~80 M", status: "Stable", phrase: "환영합니다", meaning: "Welcome.", group: "International" },
  { name: "Turkish", region: "Türkiye", speakers: "~90 M", status: "Stable", phrase: "Hoş geldiniz", meaning: "Welcome.", group: "International" },
  { name: "Tibetan", region: "Tibet · Himachal · Ladakh", speakers: "~1.2 M", status: "Vulnerable", phrase: "བཀྲ་ཤིས་བདེ་ལེགས།", meaning: "May all be auspicious.", group: "International" },
  { name: "Sinhala", region: "Sri Lanka", speakers: "~17 M", status: "Stable", phrase: "ආයුබෝවන්", meaning: "May you live long.", group: "International" },
  { name: "Thai", region: "Thailand", speakers: "~60 M", status: "Stable", phrase: "สวัสดีครับ", meaning: "Hello, with respect.", group: "International" },
];

const VOICE_POOL = ["EXAVITQu4vr4xnSDxMaL","XrExE9yKIg1WjnnlVkGX","onwK4e9ZLuTAKqWW03F9","Xb7hH8MSUJpSbSDYk0k2","IKne3meq5aSn9XLyUdCD","FGY2WhTYpPnrIDTdsKH5","JBFqnCBsd6RMkjVDRZzb","nPczCjzI2devNBz1zQrb","cgSgspJ2msm6clMCkdW9","pFZP5JQG7iQjIQuC4Bku","TX3LPaxmHKxFdv7VOQHJ","N2lVS1w4EtoT3dr4eOWO","cjVigY5qzO86Huf0OWal","pqHfZKP75CvOlQylNhV4","CwhRBWXzGAHq8TQ4Fs17","SAz9YHcvj6GT2YYXdXww"];
const languages: Lang[] = rawLanguages.map((l, i) => ({ ...l, group: l.group ?? "Indian", voiceId: l.voiceId ?? VOICE_POOL[i % VOICE_POOL.length] }));

type Filter = "All" | "Indian" | "Endangered" | "International";
const FILTERS: Filter[] = ["All", "Indian", "Endangered", "International"];

const statusClass: Record<Lang["status"], string> = {
  Endangered: "bg-destructive/15 text-destructive ring-destructive/30",
  Vulnerable: "bg-accent/15 text-accent ring-accent/30",
  Stable: "bg-jade/15 text-jade ring-jade/30",
};

function useVoice() {
  const [playing, setPlaying] = useState<string | null>(null);
  const [loading, setLoading] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const cacheRef = useRef<Map<string, string>>(new Map());
  const synth = useServerFn(synthesizePhrase);

  useEffect(() => () => {
    audioRef.current?.pause();
    audioRef.current = null;
  }, []);

  const speak = async (lang: Lang) => {
    if (typeof window === "undefined") return;
    const id = lang.name;
    if (audioRef.current && playing === id) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setPlaying(null);
      return;
    }
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    try {
      let src = cacheRef.current.get(id);
      if (!src) {
        setLoading(id);
        const res = await synth({
          data: {
            text: lang.phrase,
            voiceId: lang.voiceId,
            instructions: `Speak the phrase "${lang.phrase}" - a greeting in ${lang.name}, spoken in ${lang.region}. Pronounce it slowly, warmly and reverently, as an elder keeper of the language would. Say only the phrase itself, no translation, no English.`,
          },
        });
        src = res.audio;
        cacheRef.current.set(id, src);
        setLoading(null);
      }
      const audio = new Audio(src);
      audio.volume = 1;
      // WebAudio gain lets us push past 1.0 for a louder, fuller voice.
      try {
        const AC = (window.AudioContext || (window as any).webkitAudioContext) as typeof AudioContext;
        const ctx = new AC();
        const source = ctx.createMediaElementSource(audio);
        const gain = ctx.createGain();
        gain.gain.value = 1.8;
        source.connect(gain).connect(ctx.destination);
      } catch {
        // If WebAudio isn't available, fall back to the default element output.
      }
      audio.onended = () => setPlaying((p) => (p === id ? null : p));
      audio.onerror = () => setPlaying(null);
      audioRef.current = audio;
      setPlaying(id);
      void audio.play().catch(() => setPlaying(null));
    } catch (e) {
      console.error(e);
      setLoading(null);
      setPlaying(null);
    }
  };

  return { playing, loading, speak };
}

export function Shruti() {
  const { playing, loading, speak } = useVoice();
  const [filter, setFilter] = useState<Filter>("All");
  const shown = languages.filter((l) =>
    filter === "All" ? true : filter === "Endangered" ? l.status === "Endangered" : l.group === filter,
  );

  return (
    <section id="shruti" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5">
        <div className="mb-12 flex items-end justify-between gap-6 flex-wrap">
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-[0.28em] text-primary/90">Kitab · Language Archive</p>
            <h2 className="mt-3 font-display text-4xl sm:text-5xl text-balance">
              Voices that <span className="italic text-gradient-ember">refuse to fade</span>
            </h2>
            <p className="mt-4 text-muted-foreground text-pretty">
              India speaks in over a thousand tongues. Many will be silent within
            a generation. <span className="italic inline-block ml-[0.28em] mr-[0.18em] pb-[0.14em] leading-[1.15]">Kitab</span> records them -
              pronunciation, proverb, song and script - for the centuries to come.
              Tap any phrase to hear the keeper's voice.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-2 text-sm">
            <Volume2 className="h-4 w-4 text-primary" /> 62 languages mapped
          </div>
        </div>

        <div className="mb-8 flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              aria-pressed={filter === f}
              className={`rounded-full px-4 py-1.5 text-sm ring-1 transition ${filter === f ? "gradient-ember text-primary-foreground ring-transparent" : "glass ring-[var(--glass-border)] text-foreground/80 hover:text-foreground"}`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((l, i) => {
            const id = l.name;
            const isPlaying = playing === id;
            const isLoading = loading === id;
            return (
              <motion.div
                key={l.name}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.55, delay: (i % 6) * 0.05 }}
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
                    onClick={() => speak(l)}
                    aria-label={isPlaying ? `Pause ${l.name}` : `Play ${l.name}`}
                    disabled={isLoading}
                    className="btn-glossy relative grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-full gradient-ember text-primary-foreground shadow-[0_8px_22px_-8px_oklch(0.74_0.13_75/0.7)] disabled:opacity-70"
                  >
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-0.5" />}
                    {isPlaying && (
                      <span className="absolute inset-0 rounded-full ring-2 ring-primary/40 animate-pulse-pin" />
                    )}
                  </button>
                  <div className="min-w-0 flex-1">
                    <div className="font-display text-lg italic leading-tight" data-i18n-skip>"{l.phrase}"</div>
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

import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useCallback, useEffect, useRef, useState } from "react";
import { Camera, Mic, Pause, Play, RotateCcw, Send, Smartphone, Square, Volume2, VolumeX } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { askMonument, identifyPhoneUpload } from "@/lib/virsa-cam.functions";

export const Route = createFileRoute("/virsa-cam")({
  head: () => ({
    meta: [
      { title: "VIRSA Cam - Your Live Monument Guide · VIRSA" },
      { name: "description", content: "Point VIRSA Cam at an Indian monument and hear its story read aloud, then ask the guide anything." },
      { property: "og:title", content: "VIRSA Cam - Your Live Monument Guide" },
      { property: "og:description", content: "Capture a monument, hear its story, and ask a heritage guide about it." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: VirsaCamPage,
});

type Lang = "en" | "hi" | "pa";
type Capture = { id: string; created_at: string; image_url: string; monument_name: string | null; location: string | null; description: string | null; confidence: number | null };
type Msg = { role: "user" | "assistant"; content: string };
const LOCALES: Record<Lang, string> = { en: "en-IN", hi: "hi-IN", pa: "pa-IN" };
const CHIPS = ["Who built it?", "What's the legend?", "When is the best time to visit?"];

function pickVoice(locale: string) {
  const voices = window.speechSynthesis.getVoices();
  const base = locale.split("-")[0];
  return voices.find((v) => v.lang === locale && /google|natural|neural/i.test(v.name))
    ?? voices.find((v) => v.lang.replace("_", "-") === locale)
    ?? voices.find((v) => v.lang.toLowerCase().startsWith(base));
}

function VirsaCamPage() {
  const [started, setStarted] = useState(false);
  const [lang, setLang] = useState<Lang>("en");
  const [waiting, setWaiting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<Capture[]>([]);
  const [current, setCurrent] = useState<Capture | null>(null);
  const [rate, setRate] = useState(1);
  const [speaking, setSpeaking] = useState<"idle" | "playing" | "paused">("idle");
  const [muted, setMuted] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [question, setQuestion] = useState("");
  const [asking, setAsking] = useState(false);
  const [listening, setListening] = useState(false);
  const [micSupported, setMicSupported] = useState(false);
  const startedRef = useRef(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const ask = useServerFn(askMonument);
  const identify = useServerFn(identifyPhoneUpload);

  const speak = useCallback((text: string) => {
    if (!startedRef.current || !("speechSynthesis" in window)) return;
    const s = window.speechSynthesis;
    s.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = LOCALES[lang];
    const v = pickVoice(LOCALES[lang]);
    if (v) u.voice = v;
    u.rate = rate;
    u.onend = () => setSpeaking("idle");
    u.onerror = () => setSpeaking("idle");
    s.speak(u);
    setSpeaking("playing");
  }, [lang, rate]);

  const open = useCallback(async (c: Capture, autoplay: boolean) => {
    setCurrent(c);
    setWaiting(false);
    const { data } = await supabase.from("capture_messages").select("role,content").eq("capture_id", c.id).order("created_at");
    setMessages((data ?? []) as Msg[]);
    if (autoplay && c.description) speak(`${c.monument_name ?? ""}. ${c.description}`);
  }, [speak]);
  const openRef = useRef(open);
  openRef.current = open;

  useEffect(() => {
    setMicSupported(!!((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition));
    window.speechSynthesis?.getVoices();
    supabase.from("captures").select("*").order("created_at", { ascending: false }).limit(20)
      .then(({ data }) => setHistory((data ?? []) as Capture[]));
    const channel = supabase
      .channel(`captures-${Math.random().toString(36).slice(2)}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "captures" }, (payload) => {
        const c = payload.new as Capture;
        setHistory((h) => [c, ...h.filter((x) => x.id !== c.id)]);
        openRef.current(c, true);
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); window.speechSynthesis?.cancel(); };
  }, []);

  const start = () => {
    startedRef.current = true;
    setStarted(true);
    const u = new SpeechSynthesisUtterance(" ");
    window.speechSynthesis?.speak(u); // unlocks audio on mobile
  };

  const capture = async () => {
    setError(null);
    setWaiting(true);
    const { error } = await supabase.from("camera_requests").insert({ status: "pending" });
    if (error) { setWaiting(false); setError("Couldn't reach VIRSA Cam. Please try again."); }
    setTimeout(() => setWaiting((w) => { if (w) setError("VIRSA Cam didn't respond. Is it switched on?"); return false; }), 75_000);
  };

  const onFile = async (file?: File) => {
    if (!file) return;
    setError(null);
    setWaiting(true);
    try {
      const buf = new Uint8Array(await file.arrayBuffer());
      let bin = "";
      for (let i = 0; i < buf.length; i += 0x8000) bin += String.fromCharCode(...buf.subarray(i, i + 0x8000));
      await identify({ data: { base64: btoa(bin), mime: file.type, language: lang } });
      // realtime insert opens the result
    } catch {
      setWaiting(false);
      setError("We couldn't identify that photo. Please try again.");
    } finally {
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const sendQuestion = async (q: string) => {
    if (!current || !q.trim() || asking) return;
    setQuestion("");
    setMessages((m) => [...m, { role: "user", content: q }]);
    setAsking(true);
    try {
      const { answer } = await ask({ data: { captureId: current.id, question: q.trim(), language: lang } });
      setMessages((m) => [...m, { role: "assistant", content: answer }]);
      if (!muted) speak(answer);
    } catch {
      setMessages((m) => [...m, { role: "assistant", content: "Sorry, I couldn't answer that just now. Please try again." }]);
    } finally { setAsking(false); }
  };

  const listen = () => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) return;
    const rec = new SR();
    rec.lang = LOCALES[lang];
    rec.interimResults = false;
    rec.onresult = (e: any) => sendQuestion(e.results[0][0].transcript);
    rec.onend = () => setListening(false);
    rec.onerror = () => setListening(false);
    setListening(true);
    rec.start();
  };

  const s = typeof window !== "undefined" ? window.speechSynthesis : null;

  return (
    <div className="mx-auto max-w-2xl px-5 pb-24 pt-28">
      <p className="text-xs uppercase tracking-[0.3em] text-primary">Live monument guide</p>
      <h1 className="mt-2 font-display text-4xl sm:text-5xl">VIRSA <span className="text-gradient-ember italic">Cam</span></h1>
      <p className="mt-3 text-muted-foreground">Point VIRSA Cam at a monument, capture it, and listen to its story. Then ask the guide anything.</p>

      <div className="mt-6 flex gap-2" data-i18n-skip>
        {(["en", "hi", "pa"] as Lang[]).map((l) => (
          <button key={l} onClick={() => setLang(l)}
            className={`rounded-full px-4 py-1.5 text-sm ring-1 ring-border ${lang === l ? "bg-primary text-primary-foreground" : "hover:bg-foreground/5"}`}>
            {l === "en" ? "English" : l === "hi" ? "हिन्दी" : "ਪੰਜਾਬੀ"}
          </button>
        ))}
      </div>

      {!started ? (
        <div className="mt-8 rounded-3xl glass p-8 text-center">
          <Volume2 className="mx-auto h-10 w-10 text-primary" />
          <p className="mt-3 font-medium">Turn your volume up</p>
          <p className="text-sm text-muted-foreground">Your guide will read each monument's story aloud.</p>
          <button onClick={start} className="btn-glossy mt-5 rounded-full gradient-ember px-8 py-3 font-medium text-primary-foreground">Start tour</button>
        </div>
      ) : (
        <div className="mt-8 space-y-3">
          <button onClick={capture} disabled={waiting}
            className="btn-glossy flex w-full items-center justify-center gap-3 rounded-3xl gradient-ember py-6 text-lg font-semibold text-primary-foreground disabled:opacity-60">
            <Camera className="h-6 w-6" /> {waiting ? "VIRSA Cam is taking a photo…" : "Capture monument"}
          </button>
          <button onClick={() => fileRef.current?.click()} disabled={waiting}
            className="flex w-full items-center justify-center gap-2 rounded-2xl py-3 text-sm ring-1 ring-border hover:bg-foreground/5 disabled:opacity-60">
            <Smartphone className="h-4 w-4" /> Use phone camera
          </button>
          <input ref={fileRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={(e) => onFile(e.target.files?.[0])} />
          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
      )}

      {current && (
        <article className="mt-8 overflow-hidden rounded-3xl glass">
          <img src={current.image_url} alt={current.monument_name ?? "Captured photo"} className="aspect-[4/3] w-full object-cover" />
          <div className="p-6">
            <h2 className="font-display text-2xl">{current.monument_name}</h2>
            <p className="text-sm text-primary">{current.location}</p>
            <p className="mt-3 leading-relaxed text-foreground/85">{current.description}</p>
            <div className="mt-5 flex flex-wrap items-center gap-2">
              {speaking === "playing" ? (
                <button aria-label="Pause" onClick={() => { s?.pause(); setSpeaking("paused"); }} className="grid h-10 w-10 place-items-center rounded-full ring-1 ring-border"><Pause className="h-4 w-4" /></button>
              ) : (
                <button aria-label="Play" onClick={() => { if (speaking === "paused") { s?.resume(); setSpeaking("playing"); } else speak(`${current.monument_name}. ${current.description}`); }} className="grid h-10 w-10 place-items-center rounded-full ring-1 ring-border"><Play className="h-4 w-4" /></button>
              )}
              <button aria-label="Stop" onClick={() => { s?.cancel(); setSpeaking("idle"); }} className="grid h-10 w-10 place-items-center rounded-full ring-1 ring-border"><Square className="h-4 w-4" /></button>
              <button aria-label="Replay" onClick={() => speak(`${current.monument_name}. ${current.description}`)} className="grid h-10 w-10 place-items-center rounded-full ring-1 ring-border"><RotateCcw className="h-4 w-4" /></button>
              <label className="ml-auto flex items-center gap-2 text-xs text-muted-foreground">
                Speed {rate.toFixed(1)}×
                <input type="range" min={0.6} max={1.6} step={0.1} value={rate} onChange={(e) => setRate(Number(e.target.value))} className="accent-[var(--primary)]" />
              </label>
            </div>
          </div>

          <div className="border-t border-border p-6">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Ask about this monument</h3>
              <button aria-label={muted ? "Unmute answers" : "Mute answers"} onClick={() => { setMuted((m) => !m); s?.cancel(); }} className="grid h-8 w-8 place-items-center rounded-full ring-1 ring-border">
                {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </button>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {CHIPS.map((c) => <button key={c} onClick={() => sendQuestion(c)} className="rounded-full bg-primary/10 px-3 py-1.5 text-xs text-primary ring-1 ring-primary/25">{c}</button>)}
            </div>
            <div className="mt-4 space-y-2">
              {messages.map((m, i) => (
                <div key={i} className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm ${m.role === "user" ? "ml-auto bg-primary text-primary-foreground" : "bg-foreground/5"}`}>{m.content}</div>
              ))}
              {asking && <div className="w-fit rounded-2xl bg-foreground/5 px-4 py-2 text-sm text-muted-foreground">Thinking…</div>}
            </div>
            <form onSubmit={(e) => { e.preventDefault(); sendQuestion(question); }} className="mt-4 flex gap-2">
              <input value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="Type your question…" className="flex-1 rounded-full bg-foreground/5 px-4 py-2.5 text-sm ring-1 ring-border outline-none focus:ring-primary" />
              {micSupported && (
                <button type="button" aria-label="Speak your question" onClick={listen} className={`grid h-10 w-10 place-items-center rounded-full ring-1 ring-border ${listening ? "bg-primary text-primary-foreground animate-pulse" : ""}`}><Mic className="h-4 w-4" /></button>
              )}
              <button type="submit" aria-label="Send" disabled={asking} className="grid h-10 w-10 place-items-center rounded-full gradient-ember text-primary-foreground"><Send className="h-4 w-4" /></button>
            </form>
          </div>
        </article>
      )}

      {history.length > 0 && (
        <section className="mt-10">
          <h3 className="font-medium">Past captures</h3>
          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {history.map((h) => (
              <button key={h.id} onClick={() => open(h, false)} className={`overflow-hidden rounded-2xl text-left ring-1 ${current?.id === h.id ? "ring-primary" : "ring-border"}`}>
                <img src={h.image_url} alt="" className="aspect-square w-full object-cover" loading="lazy" />
                <p className="truncate px-3 py-2 text-xs">{h.monument_name ?? "Unknown"}</p>
              </button>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

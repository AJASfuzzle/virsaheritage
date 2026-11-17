import { createFileRoute, Link } from "@tanstack/react-router";
import { useAuth } from "@/hooks/use-auth";
import konark from "@/assets/konark.png.asset.json";
import { useServerFn } from "@tanstack/react-start";
import { useCallback, useEffect, useRef, useState } from "react";
import { Camera, ChevronDown, Lock, Mic, Trash2, X, Pause, Play, RotateCcw, Send, Square, Volume2, VolumeX } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { cleanDescription, dedupeSentences, splitSentences } from "@/lib/speech-text";
import { askMonument, deleteCaptures, pairVirsaCam, transcribeQuestion, virsaCamTts } from "@/lib/virsa-cam.functions";

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

type Lang = "en";
type Capture = { id: string; created_at: string; image_url: string; monument_name: string | null; location: string | null; description: string | null; confidence: number | null };
type CamStatus = { last_seen: string | null };
type Msg = { role: "user" | "assistant"; content: string };
const LOCALES: Record<Lang, string> = { en: "en-IN" };
const CHIPS = ["Who built it?", "What's the legend?", "When is the best time to visit?"];

function pickVoice() {
  const voices = window.speechSynthesis.getVoices();
  for (const loc of ["en-IN", "en-GB", "en-US"]) {
    const m = voices.filter((v) => v.lang.replace("_", "-").toLowerCase() === loc.toLowerCase());
    const best = m.find((v) => /google|natural|neural|enhanced|premium/i.test(v.name)) ?? m[0];
    if (best) return best;
  }
  return voices.find((v) => v.lang.toLowerCase().startsWith("en"));
}
// Tiny silent WAV used to unlock the audio element on a tap (phones block untapped playback)
const SILENT_WAV = (() => {
  if (typeof window === "undefined") return "";
  const n = 800, b = new Uint8Array(44 + n * 2), v = new DataView(b.buffer);
  const w = (o: number, t: string) => [...t].forEach((c, i) => b[o + i] = c.charCodeAt(0));
  w(0, "RIFF"); v.setUint32(4, 36 + n * 2, true); w(8, "WAVEfmt "); v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 1, true);
  v.setUint32(24, 8000, true); v.setUint32(28, 16000, true); v.setUint16(32, 2, true); v.setUint16(34, 16, true); w(36, "data"); v.setUint32(40, n * 2, true);
  let bin = ""; b.forEach((x) => bin += String.fromCharCode(x));
  return `data:audio/wav;base64,${btoa(bin)}`;
})();
// First chunk is one short sentence so it is ready almost instantly; later chunks are larger
function chunkText(text: string) {
  const out: string[] = [];
  for (const sn of splitSentences(text)) {
    if (out.length > 1 && (out[out.length - 1] + " " + sn).length <= 350) out[out.length - 1] += " " + sn; else out.push(sn);
  }
  return out;
}
// Pick a real microphone with echo cancellation, never a loopback / "Stereo Mix" device that captures laptop audio
const LOOPBACK = /stereo mix|loopback|what u hear|wave out|monitor of|blackhole|soundflower|virtual|cable output|vb-audio/i;
async function micConstraints(): Promise<MediaTrackConstraints> {
  const base: MediaTrackConstraints = { echoCancellation: true, noiseSuppression: true, autoGainControl: true, channelCount: 1 };
  try {
    const devs = (await navigator.mediaDevices.enumerateDevices()).filter((d) => d.kind === "audioinput");
    const def = devs.find((d) => d.deviceId === "default") ?? devs[0];
    if (def && LOOPBACK.test(def.label)) {
      const real = devs.find((d) => d.deviceId !== "default" && d.deviceId !== "communications" && !LOOPBACK.test(d.label));
      if (real) return { ...base, deviceId: { exact: real.deviceId } };
    }
  } catch { /* labels unavailable: use defaults */ }
  return base;
}
async function defaultIsLoopback() {
  try {
    const devs = (await navigator.mediaDevices.enumerateDevices()).filter((d) => d.kind === "audioinput");
    const def = devs.find((d) => d.deviceId === "default") ?? devs[0];
    return !!def && LOOPBACK.test(def.label);
  } catch { return false; }
}
const narration = (c: Capture) => cleanDescription(c.description, c.monument_name, c.location);

const PRIVACY = "VIRSA Cam only looks when you ask it to. Live view is off unless you turn it on, and your photos are visible only to you.";

function Header() {
  return (
    <>
      <p className="text-xs uppercase tracking-[0.3em] text-primary">Live monument guide</p>
      <h1 className="mt-2 font-display text-4xl sm:text-5xl">VIRSA <span className="text-gradient-ember italic">Cam</span></h1>
      <p className="mt-3 text-muted-foreground">Point VIRSA Cam at a monument, capture it, and listen to its story. Then ask the guide anything.</p>
    </>
  );
}

function VirsaCamPage() {
  const { user, loading } = useAuth();
  const [owned, setOwned] = useState<string | false | null>(null);
  useEffect(() => {
    if (!user) { setOwned(null); return; }
    supabase.from("camera_devices").select("id").eq("owner_user_id", user.id).limit(1)
      .then(({ data }) => setOwned(data?.[0]?.id ?? false));
  }, [user, owned === null]);

  if (loading || (user && owned === null)) return <div className="mx-auto max-w-2xl px-5 pb-24 pt-28"><Header /></div>;
  if (!user) return (
    <div className="mx-auto max-w-2xl px-5 pb-24 pt-28">
      <Header />
      <div className="mt-8 overflow-hidden rounded-3xl glass">
        <div className="relative aspect-[16/9]">
          <img src={konark.url} alt="Konark Sun Temple seen through VIRSA Cam" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/10 to-transparent" />
        </div>
        <div className="p-8 text-center">
          <Lock className="mx-auto h-8 w-8 text-primary" />
          <p className="mt-3 font-medium">VIRSA Cam needs an account</p>
          <p className="mt-1 text-sm text-muted-foreground">Pair your own VIRSA Cam, capture monuments and keep a private history of every story you hear.</p>
          <Link to="/auth" search={{ redirect: "/virsa-cam" }} className="btn-glossy mt-5 inline-block rounded-full gradient-ember px-8 py-3 font-medium text-primary-foreground">Sign in to use VIRSA Cam</Link>
          <p className="mt-5 text-xs text-muted-foreground">{PRIVACY}</p>
        </div>
      </div>
    </div>
  );
  if (!owned) return <PairScreen onPaired={() => setOwned(null)} />;
  return <CamApp userId={user.id} deviceId={owned} />;
}

function PairScreen({ onPaired }: { onPaired: () => void }) {
  const pair = useServerFn(pairVirsaCam);
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true); setErr(null);
    try {
      const r = await pair({ data: { code } });
      if (r.ok) onPaired(); else setErr((r as { error?: string }).error ?? "Pairing failed");
    } catch { setErr("Pairing failed. Please try again."); } finally { setBusy(false); }
  };
  return (
    <div className="mx-auto max-w-2xl px-5 pb-24 pt-28">
      <Header />
      <form onSubmit={submit} className="mt-8 rounded-3xl glass p-8">
        <Camera className="h-8 w-8 text-primary" />
        <h2 className="mt-3 font-display text-2xl">Connect your VIRSA Cam</h2>
        <p className="mt-1 text-sm text-muted-foreground">Enter the pairing code that came with your camera. Once paired, only you can use it.</p>
        <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="Pairing code" autoComplete="off"
          className="mt-5 w-full rounded-full bg-foreground/5 px-5 py-3 text-sm ring-1 ring-border outline-none focus:ring-primary" />
        {err && <p className="mt-3 text-sm text-destructive">{err}</p>}
        <button type="submit" disabled={busy || code.length < 4} className="btn-glossy mt-5 w-full rounded-full gradient-ember py-3 font-medium text-primary-foreground disabled:opacity-60">{busy ? "Pairing…" : "Pair VIRSA Cam"}</button>
        <p className="mt-5 text-xs text-muted-foreground">{PRIVACY}</p>
      </form>
    </div>
  );
}

function CamApp({ userId, deviceId }: { userId: string; deviceId: string }) {
  const [started, setStarted] = useState(false);
  const lang: Lang = "en";
  const spokenRef = useRef<Set<string>>(new Set());
  const articleRef = useRef<HTMLElement | null>(null);
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
  const [transcribing, setTranscribing] = useState(false);
  const [micError, setMicError] = useState<string | null>(null);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const stopMicRef = useRef<(() => void) | null>(null);
  const transcribe = useServerFn(transcribeQuestion);
  const removeCaptures = useServerFn(deleteCaptures);
  const startedRef = useRef(false);
  const ask = useServerFn(askMonument);
  const [status, setStatus] = useState<CamStatus | null>(null);
  const [now, setNow] = useState(() => Date.now());
  const [view, setView] = useState<"live" | "photo">("live");
  const [flash, setFlash] = useState(false);
  const waitRef = useRef<{ since: string; timer?: ReturnType<typeof setTimeout>; poll?: ReturnType<typeof setInterval> } | null>(null);
  const [liveOn, setLiveOn] = useState(false);
  const online = !!status?.last_seen && now - new Date(status.last_seen).getTime() < 10_000;

  // Speech: generated audio clips through ONE persistent <audio>, played in order; speechSynthesis only if a clip fails
  const tts = useServerFn(virsaCamTts);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const genRef = useRef(0);
  const rateRef = useRef(rate);
  rateRef.current = rate;
  const stopSpeech = useCallback(() => {
    genRef.current++;
    const a = audioRef.current;
    if (a) { a.pause(); a.onended = null; }
    window.speechSynthesis?.cancel();
    setSpeaking("idle");
  }, []);
  const fallbackSay = (text: string, gen: number) => new Promise<void>((done) => {
    const s = window.speechSynthesis;
    if (!s || gen !== genRef.current) return done();
    const v = pickVoice();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = v?.lang ?? LOCALES.en; if (v) u.voice = v; u.rate = rateRef.current;
    u.onend = () => done(); u.onerror = () => done();
    s.speak(u);
  });
  // Ordered speech queue: clips are generated in parallel as text arrives, played one by one (no gaps/overlaps/repeats)
  const lastSpokenRef = useRef<{ label: string; texts: string[] } | null>(null);
  const [nowReading, setNowReading] = useState<string | null>(null);
  const startQueue = useCallback((label: string, onStart?: () => void) => {
    stopSpeech();
    const gen = genRef.current;
    const texts: string[] = [];
    const clips: Promise<{ ok: true; base64: string; mime: string } | { ok: false }>[] = [];
    const seen = new Set<string>();
    let ended = false; let wake: (() => void) | null = null;
    const push = (t: string) => {
      const text = t.trim(); const k = text.toLowerCase();
      if (!text || seen.has(k) || gen !== genRef.current) return;
      seen.add(k); texts.push(text);
      clips.push(tts({ data: { text: text.slice(0, 3000), language: "English" } }).catch(() => ({ ok: false as const })));
      wake?.();
    };
    const end = () => { ended = true; lastSpokenRef.current = { label, texts }; wake?.(); };
    if (!startedRef.current) return { push: () => {}, end: () => {}, gen };
    setSpeaking("playing"); setNowReading(label);
    (async () => {
      let i = 0;
      for (;;) {
        if (gen !== genRef.current) return;
        if (i >= clips.length) {
          if (ended) break;
          await new Promise<void>((r) => { wake = r; }); wake = null; continue;
        }
        const r = await clips[i];
        if (gen !== genRef.current) return;
        if (i === 0) onStart?.();
        const a = audioRef.current;
        if (r.ok && a) {
          const bin = atob(r.base64); const bytes = new Uint8Array(bin.length);
          for (let j = 0; j < bin.length; j++) bytes[j] = bin.charCodeAt(j);
          const url = URL.createObjectURL(new Blob([bytes], { type: r.mime }));
          const ok = await new Promise<boolean>((done) => {
            a.onended = () => done(true); a.onerror = () => done(false);
            a.src = url; a.playbackRate = rateRef.current;
            a.play().catch(() => done(false));
          });
          URL.revokeObjectURL(url);
          if (gen !== genRef.current) return;
          if (!ok) await fallbackSay(texts[i], gen);
        } else await fallbackSay(texts[i], gen);
        i++;
      }
      if (gen === genRef.current) { setSpeaking("idle"); setNowReading(null); }
    })();
    return { push, end, gen };
  }, [stopSpeech, tts]);
  const speakClips = useCallback((texts: string[], label = "Answer") => {
    const q = startQueue(label); texts.forEach(q.push); q.end();
  }, [startQueue]);
  const speak = useCallback((text: string) => speakClips(chunkText(text)), [speakClips]);
  const speakCapture = useCallback((c: Capture) => speakClips([
    `This is ${c.monument_name ?? "this monument"}${c.location ? `, ${c.location}` : ""}.`, ...chunkText(narration(c)),
  ], "Description"), [speakClips]);
  useEffect(() => { if (audioRef.current) audioRef.current.playbackRate = rate; }, [rate]);
  useEffect(() => { lastSpokenRef.current = null; }, [current?.id]);

  const open = useCallback(async (c: Capture, autoplay: boolean) => {
    setCurrent(c);
    setWaiting(false);
    if (autoplay && c.description && !spokenRef.current.has(c.id)) {
      spokenRef.current.add(c.id);
      speakCapture(c);
    }
    const { data } = await supabase.from("capture_messages").select("role,content").eq("capture_id", c.id).order("created_at");
    setMessages((data ?? []) as Msg[]);
  }, [speakCapture]);
  const openRef = useRef(open);
  openRef.current = open;

  useEffect(() => {
    setMicSupported(!!navigator.mediaDevices?.getUserMedia || !!((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition));
    window.speechSynthesis?.getVoices();
    supabase.from("captures").select("*").eq("user_id", userId).order("created_at", { ascending: false }).limit(20)
      .then(({ data }) => setHistory((data ?? []) as Capture[]));
    const channel = supabase
      .channel(`captures-${Math.random().toString(36).slice(2)}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "captures", filter: `user_id=eq.${userId}` }, (payload) => {
        const c = payload.new as Capture;
        setHistory((h) => [c, ...h.filter((x) => x.id !== c.id)]);
        if (waitRef.current) arrivedRef.current(c);
        else openRef.current(c, true);
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); genRef.current++; audioRef.current?.pause(); window.speechSynthesis?.cancel(); };
  }, []);

  const stopWaiting = () => {
    if (waitRef.current) { clearTimeout(waitRef.current.timer); clearInterval(waitRef.current.poll); }
    waitRef.current = null;
  };
  const arrived = (c: Capture) => {
    stopWaiting();
    setHistory((h) => [c, ...h.filter((x) => x.id !== c.id)]);
    setView("photo");
    setFlash(true);
    setTimeout(() => setFlash(false), 600);
    openRef.current(c, true);
  };
  const arrivedRef = useRef(arrived);
  arrivedRef.current = arrived;

  // Live view: status row via realtime, 700 ms fallback refresh, 1 s clock for online check
  useEffect(() => {
    const load = () => supabase.from("camera_status").select("last_seen").eq("id", 1).maybeSingle()
      .then(({ data }) => { if (data) setStatus(data as CamStatus); });
    load();
    let live = false;
    const channel = supabase
      .channel(`camstatus-${Math.random().toString(36).slice(2)}`)
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "camera_status" }, (p) => {
        const n = p.new as Partial<CamStatus>;
        if (n.last_seen) setStatus({ last_seen: n.last_seen });
      })
      .subscribe((st) => { live = st === "SUBSCRIBED"; });
    const fallback = setInterval(() => { if (!live) load(); }, 700);
    const clock = setInterval(() => setNow(Date.now()), 1000);
    return () => { supabase.removeChannel(channel); clearInterval(fallback); clearInterval(clock); stopWaiting(); };
  }, []);

  // Live frames: private broadcast, double-buffered (decode off-screen, swap when loaded), newest only
  const [frame, setFrame] = useState<string | null>(null);
  const [fps, setFps] = useState(0);
  useEffect(() => {
    if (!liveOn) { setFrame(null); setFps(0); return; }
    let next: string | null = null, loading = false, shown = 0;
    const load = () => {
      if (loading || !next) return;
      const src = next; next = null; loading = true;
      const img = new Image();
      img.onload = img.onerror = () => { loading = false; if (img.complete && img.naturalWidth) { setFrame(src); shown++; } load(); };
      img.src = src;
    };
    const ch = supabase.channel(`cam-preview-${deviceId}`, { config: { private: true } })
      .on("broadcast", { event: "frame" }, ({ payload }) => {
        if (typeof payload?.jpeg !== "string") return;
        next = `data:image/jpeg;base64,${payload.jpeg}`; load();
      })
      .subscribe();
    const t = setInterval(() => { setFps(shown); shown = 0; }, 1000);
    return () => { supabase.removeChannel(ch); clearInterval(t); };
  }, [liveOn, deviceId]);

  // Live view is opt-in: heartbeat only while on, visible and recently interacted with
  const turnOffLive = useCallback(() => {
    setLiveOn(false);
    setFrame(null);
    supabase.rpc("virsa_cam_stop_preview").then(() => {});
  }, []);
  useEffect(() => {
    if (!liveOn) return;
    let last = Date.now();
    const touch = () => { last = Date.now(); };
    const evs = ["pointerdown", "pointermove", "keydown", "scroll", "touchstart"] as const;
    evs.forEach((e) => window.addEventListener(e, touch, { passive: true }));
    const ping = () => { supabase.rpc("virsa_cam_request_preview").then(() => {}); };
    ping();
    const t = setInterval(() => {
      if (Date.now() - last > 60_000) turnOffLive(); else ping();
    }, 5000);
    const onVis = () => { if (document.visibilityState !== "visible") turnOffLive(); };
    document.addEventListener("visibilitychange", onVis);
    return () => {
      clearInterval(t);
      evs.forEach((e) => window.removeEventListener(e, touch));
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [liveOn, turnOffLive]);
  useEffect(() => () => { supabase.rpc("virsa_cam_stop_preview").then(() => {}); }, []);

  // Phones only allow speech started from a tap: prime it on every Start/Capture tap
  const unlockSpeech = () => {
    stopSpeech();
    const a = audioRef.current;
    if (a && SILENT_WAV) { a.src = SILENT_WAV; a.play().catch(() => {}); }
    const s = window.speechSynthesis;
    if (s) { const u = new SpeechSynthesisUtterance(" "); u.volume = 0; s.speak(u); if (s.paused) s.resume(); }
  };
  const start = () => {
    startedRef.current = true;
    setStarted(true);
    unlockSpeech();
  };
  useEffect(() => {
    if (current?.id) setTimeout(() => articleRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
  }, [current?.id]);

  const capture = async () => {
    unlockSpeech();
    setError(null);
    stopWaiting();
    setWaiting(true);
    const since = new Date().toISOString();
    const { error } = await supabase.from("camera_requests").insert({ status: "pending", user_id: userId });
    if (error) { setWaiting(false); setError("Couldn't reach VIRSA Cam. Please try again."); return; }
    const w: NonNullable<typeof waitRef.current> = { since };
    waitRef.current = w;
    // Polling backup in case realtime is unavailable
    w.poll = setInterval(async () => {
      const { data } = await supabase.from("captures").select("*").gt("created_at", since).order("created_at", { ascending: false }).limit(1).maybeSingle();
      if (data && waitRef.current === w) arrivedRef.current(data as Capture);
    }, 2000);
    w.timer = setTimeout(() => {
      if (waitRef.current !== w) return;
      stopWaiting();
      setWaiting(false);
      setError("VIRSA Cam didn't respond. Check it's online and try again.");
    }, 25_000);
  };

  const backToLive = () => { stopSpeech(); setView("live"); setCurrent(null); setError(null); };

  const [thinking, setThinking] = useState(false);
  const sendQuestion = async (q: string) => {
    if (!current || !q.trim() || asking) return;
    const question = q.trim();
    setQuestion("");
    setMessages((m) => [...m, { role: "user", content: question }, { role: "assistant", content: "" }]);
    setAsking(true); setThinking(true);
    const setAnswer = (t: string) => setMessages((m) => { const n = [...m]; n[n.length - 1] = { role: "assistant", content: t }; return n; });
    const queue = muted ? null : startQueue(`answer-${messages.length + 1}`, () => setThinking(false));
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch("/api/virsa-cam-ask", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${session?.access_token ?? ""}` },
        body: JSON.stringify({ captureId: current.id, question }),
      });
      if (!res.ok || !res.body) throw new Error(String(res.status));
      const reader = res.body.getReader(); const dec = new TextDecoder();
      let full = ""; let spokenUpTo = 0;
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        full += dec.decode(value, { stream: true });
        setAnswer(full);
        // hand each finished sentence to speech as soon as it's complete
        const re = /[.!?]["')\]]*\s+/g; re.lastIndex = spokenUpTo; let m: RegExpExecArray | null;
        while ((m = re.exec(full))) { queue?.push(full.slice(spokenUpTo, m.index + m[0].length)); spokenUpTo = m.index + m[0].length; }
      }
      queue?.push(full.slice(spokenUpTo));
      if (!full.trim()) throw new Error("empty");
      setAnswer(dedupeSentences(full.trim()));
      queue?.end();
      if (!queue) setThinking(false);
    } catch {
      queue?.end(); stopSpeech(); setThinking(false);
      setAnswer("Sorry, I couldn't answer that just now. Please try again.");
    } finally { setAsking(false); }
  };

  // Voice questions: browser speech recognition first, recorded audio + server transcription as fallback
  const BLOCKED = "Microphone blocked — allow it in your browser settings";
  const MISSED = "Didn't catch that, try again";

  const recordFallback = async () => {
    let stream: MediaStream;
    try { stream = await navigator.mediaDevices.getUserMedia({ audio: await micConstraints() }); }
    catch { setListening(false); setMicError(BLOCKED); return; }
    if (typeof MediaRecorder === "undefined") { stream.getTracks().forEach((t) => t.stop()); setListening(false); setMicError(MISSED); return; }
    const mime = ["audio/mp4", "audio/webm;codecs=opus", "audio/webm", "audio/ogg;codecs=opus"].find((m) => MediaRecorder.isTypeSupported?.(m)) ?? "";
    const rec = mime ? new MediaRecorder(stream, { mimeType: mime }) : new MediaRecorder(stream);
    const chunks: Blob[] = [];
    rec.ondataavailable = (e) => { if (e.data.size) chunks.push(e.data); };
    const timer = setTimeout(() => { if (rec.state === "recording") rec.stop(); }, 15_000);
    rec.onstop = async () => {
      clearTimeout(timer);
      stream.getTracks().forEach((t) => t.stop());
      stopMicRef.current = null;
      setListening(false);
      const type = rec.mimeType || mime || "audio/webm";
      const blob = new Blob(chunks, { type });
      if (blob.size < 1500) { setMicError(MISSED); return; }
      setTranscribing(true);
      try {
        const buf = new Uint8Array(await blob.arrayBuffer());
        let bin = "";
        for (let i = 0; i < buf.length; i += 0x8000) bin += String.fromCharCode(...buf.subarray(i, i + 0x8000));
        const r = await transcribe({ data: { base64: btoa(bin), mime: type, language: lang } });
        if (r.ok) { setQuestion(r.text); sendQuestion(r.text); } else setMicError(r.error);
      } catch { setMicError(MISSED); } finally { setTranscribing(false); }
    };
    stopMicRef.current = () => { if (rec.state === "recording") rec.stop(); };
    rec.start();
  };

  const listen = async () => {
    if (listening) { stopMicRef.current?.(); return; }
    if (transcribing) return;
    setMicError(null);
    unlockSpeech();
    setListening(true);
    // Ask for mic permission up front so every browser shows its prompt
    try {
      const st = await navigator.mediaDevices.getUserMedia({ audio: await micConstraints() });
      st.getTracks().forEach((t) => t.stop());
    } catch (e) {
      setListening(false);
      setMicError((e as DOMException)?.name === "NotFoundError" ? "No microphone found on this device." : BLOCKED);
      return;
    }
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    // Browser recognition always uses the system default input; if that is a loopback device, record from the real mic instead
    if (!SR || await defaultIsLoopback()) { recordFallback(); return; }
    let got = false, fellBack = false;
    const rec = new SR();
    rec.lang = LOCALES[lang];
    rec.interimResults = false;
    rec.maxAlternatives = 1;
    rec.onresult = (e: any) => {
      const text = String(e.results?.[0]?.[0]?.transcript ?? "").trim();
      if (text) { got = true; setQuestion(text); sendQuestion(text); }
    };
    rec.onerror = (e: any) => {
      if (e.error === "not-allowed") { setMicError(BLOCKED); return; }
      if (e.error === "no-speech" || e.error === "aborted") return;
      // network / service-not-allowed / language-not-supported etc. -> record instead
      fellBack = true;
      recordFallback();
    };
    rec.onend = () => {
      if (fellBack) return;
      stopMicRef.current = null;
      setListening(false);
      if (!got) setMicError((m) => m ?? MISSED);
    };
    stopMicRef.current = () => { try { rec.stop(); } catch { /* already stopped */ } };
    try { rec.start(); } catch { fellBack = true; recordFallback(); }
  };

  const doDelete = async (opts: { ids?: string[]; all?: boolean }) => {
    setDeleting(true);
    try {
      await removeCaptures({ data: opts });
      const gone = (id: string) => opts.all || opts.ids?.includes(id);
      setHistory((h) => h.filter((x) => !gone(x.id)));
      if (current && gone(current.id)) backToLive();
    } catch { setError("Couldn't delete that capture. Please try again."); }
    finally { setDeleting(false); setConfirmId(null); }
  };

  const s = typeof window !== "undefined" ? window.speechSynthesis : null;
  const pauseSpeech = () => { audioRef.current?.pause(); s?.pause(); setSpeaking("paused"); };
  const resumeSpeech = () => { const a = audioRef.current; if (a?.src && a.paused && !a.ended && a.currentTime > 0) a.play().catch(() => {}); s?.resume(); setSpeaking("playing"); };

  const controls = (key: string, start: () => void, small = false) => {
    const active = nowReading === key;
    const state = active ? speaking : "idle";
    const cls = `grid ${small ? "h-8 w-8" : "h-10 w-10"} place-items-center rounded-full ring-1 ring-border`;
    const ic = small ? "h-3.5 w-3.5" : "h-4 w-4";
    return (<>
      {state === "playing" ? (
        <button aria-label="Pause" onClick={pauseSpeech} className={cls}><Pause className={ic} /></button>
      ) : (
        <button aria-label="Play" onClick={() => { if (state === "paused") resumeSpeech(); else { unlockSpeech(); start(); } }} className={cls}><Play className={ic} /></button>
      )}
      <button aria-label="Stop" onClick={() => { if (active) { stopSpeech(); setNowReading(null); } }} className={cls}><Square className={ic} /></button>
      <button aria-label="Replay" onClick={() => { unlockSpeech(); start(); }} className={cls}><RotateCcw className={ic} /></button>
    </>);
  };


  return (
    <div className="mx-auto max-w-2xl px-5 pb-24 pt-28">
      <Header />
      <audio ref={audioRef} playsInline preload="auto" className="hidden" />
      <p className="mt-3 rounded-2xl bg-primary/5 px-4 py-3 text-xs text-muted-foreground ring-1 ring-primary/15">{PRIVACY}</p>

      <div className="mt-6 flex items-center gap-2 text-sm">
        <span className={`h-2.5 w-2.5 rounded-full ${online ? "bg-emerald-500 shadow-[0_0_8px] shadow-emerald-500" : "bg-muted-foreground/50"}`} />
        <span className={online ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground"}>
          {online ? "VIRSA Cam online" : "VIRSA Cam offline – power it on and connect it to Wi-Fi"}
        </span>
      </div>

      <div className="relative mt-4 overflow-hidden rounded-3xl p-1.5 gradient-ember shadow-xl">
        <div className="relative aspect-[4/3] overflow-hidden rounded-[1.25rem] bg-background">
          {view === "photo" && current ? (
            <img src={current.image_url} alt={current.monument_name ?? "Captured photo"} className="h-full w-full object-cover" />
          ) : !liveOn ? (
            <div className="grid h-full place-items-center p-6 text-center">
              <div>
                <button onClick={() => setLiveOn(true)} disabled={!online} className="btn-glossy rounded-full gradient-ember px-6 py-3 font-medium text-primary-foreground disabled:opacity-60">Turn on live view</button>
                <p className="mt-3 text-sm text-muted-foreground">This will show what your VIRSA Cam sees. Only you can see it.</p>
              </div>
            </div>
          ) : frame ? (
            <img src={frame} alt="VIRSA Cam live view" className="absolute inset-0 h-full w-full object-cover" decoding="sync" />
          ) : (
            <div className="grid h-full place-items-center text-sm text-muted-foreground">Connecting to VIRSA Cam…</div>
          )}
          {flash && <div className="pointer-events-none absolute inset-0 animate-[camflash_0.6s_ease-out_forwards] bg-background" />}
          <span className="absolute left-3 top-3 rounded-full bg-background/70 px-3 py-1 text-xs font-medium backdrop-blur">
            {view === "photo" ? "Snapshot" : liveOn ? <span className="font-semibold text-destructive">● LIVE{frame ? ` · ${fps} fps` : ""}</span> : "Live view off"}
          </span>
          {view === "live" && liveOn && (
            <button onClick={turnOffLive} className="absolute right-3 top-3 rounded-full bg-background/70 px-3 py-1 text-xs backdrop-blur ring-1 ring-border">Turn off live view</button>
          )}
          {view === "photo" && current && !current.description && (
            <div className="absolute inset-x-0 bottom-0 bg-background/75 py-2 text-center text-sm backdrop-blur">Identifying the monument…</div>
          )}
        </div>
      </div>
      {view === "photo" && (
        <button onClick={backToLive} className="mt-3 w-full rounded-2xl py-3 text-sm ring-1 ring-border hover:bg-foreground/5">Back to live view</button>
      )}


      {!started ? (
        <div className="mt-8 rounded-3xl glass p-8 text-center">
          <Volume2 className="mx-auto h-10 w-10 text-primary" />
          <p className="mt-3 font-medium">Turn your volume up</p>
          <p className="text-sm text-muted-foreground">Your guide will read each monument's story aloud.</p>
          <button onClick={start} className="btn-glossy mt-5 rounded-full gradient-ember px-8 py-3 font-medium text-primary-foreground">Start tour</button>
        </div>
      ) : (
        <div className="mt-8 space-y-3">
          <button onClick={capture} disabled={waiting || !online}
            className="btn-glossy flex w-full items-center justify-center gap-3 rounded-3xl gradient-ember py-6 text-lg font-semibold text-primary-foreground disabled:opacity-60">
            <Camera className="h-6 w-6" /> {waiting ? "VIRSA Cam is taking a photo…" : online ? "Capture monument" : "VIRSA Cam is offline"}
          </button>
          {error && (
            <div className="flex items-center justify-between gap-3 rounded-2xl bg-destructive/10 px-4 py-3 text-sm text-destructive">
              <span>{error}</span>
              <button onClick={capture} disabled={!online} className="rounded-full px-3 py-1 ring-1 ring-destructive/40 disabled:opacity-50">Retry</button>
            </div>
          )}
        </div>
      )}

      {current && (
        <article ref={articleRef} className="relative mt-8 scroll-mt-24 overflow-hidden rounded-3xl glass">
          <button aria-label="Close" onClick={backToLive} className="absolute right-3 top-3 z-10 grid h-9 w-9 place-items-center rounded-full bg-background/80 ring-1 ring-border backdrop-blur hover:bg-background"><X className="h-4 w-4" /></button>
          <img src={current.image_url} alt={current.monument_name ?? "Captured photo"} className="aspect-[4/3] w-full object-cover" />
          <style>{`@keyframes camflash{from{opacity:1}to{opacity:0}}`}</style>
          <div className="p-6">
            <h2 className="font-display text-2xl">{current.monument_name}</h2>
            <p className="text-sm text-primary">{current.location}</p>
            <p className="mt-3 leading-relaxed text-foreground/85">{narration(current)}</p>
            <div className="mt-5 flex flex-wrap items-center gap-2">
              {controls("Description", () => speakCapture(current))}
              <label className="ml-auto flex items-center gap-2 text-xs text-muted-foreground">
                Speed {rate.toFixed(1)}×
                <input type="range" min={0.6} max={1.6} step={0.1} value={rate} onChange={(e) => setRate(Number(e.target.value))} className="accent-[var(--primary)]" />
              </label>
            </div>
          </div>

          <div className="border-t border-border p-6">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Ask about this monument</h3>
              <div className="flex items-center gap-2">
              <button aria-label={muted ? "Unmute answers" : "Mute answers"} onClick={() => { setMuted((m) => !m); stopSpeech(); }} className="grid h-8 w-8 place-items-center rounded-full ring-1 ring-border">
                {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </button>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {CHIPS.map((c) => <button key={c} onClick={() => { unlockSpeech(); sendQuestion(c); }} className="rounded-full bg-primary/10 px-3 py-1.5 text-xs text-primary ring-1 ring-primary/25">{c}</button>)}
            </div>
            <div className="mt-4 space-y-2">
              {messages.map((m, i) => (
                m.content ? (
                <div key={i} className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm ${m.role === "user" ? "ml-auto bg-primary text-primary-foreground" : "bg-foreground/5"}`}>
                  {m.content}
                  {m.role === "assistant" && !(asking && i === messages.length - 1) && (
                    <div className="mt-2 flex items-center gap-2">{controls(`answer-${i}`, () => speakClips(splitSentences(m.content), `answer-${i}`), true)}</div>
                  )}
                </div>
                ) : null
              ))}
              {thinking && <div className="w-fit rounded-2xl bg-foreground/5 px-4 py-2 text-sm text-muted-foreground">Thinking…</div>}
            </div>
            <form onSubmit={(e) => { e.preventDefault(); unlockSpeech(); sendQuestion(question); }} className="mt-4 flex gap-2">
              <input value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="Type your question…" className="flex-1 rounded-full bg-foreground/5 px-4 py-2.5 text-sm ring-1 ring-border outline-none focus:ring-primary" />
              {micSupported && (
                <button type="button" aria-label={listening ? "Tap to stop" : "Speak your question"} onClick={listen} disabled={transcribing} className={`grid h-10 w-10 place-items-center rounded-full ring-1 ${listening ? "bg-destructive text-destructive-foreground ring-destructive animate-pulse" : "ring-border"} disabled:opacity-60`}><Mic className="h-4 w-4" /></button>
              )}
              <button type="submit" aria-label="Send" disabled={asking} className="grid h-10 w-10 place-items-center rounded-full gradient-ember text-primary-foreground"><Send className="h-4 w-4" /></button>
            </form>
            {(listening || transcribing || micError) && (
              <p className={`mt-2 text-xs ${micError && !listening ? "text-destructive" : "text-muted-foreground"}`} aria-live="polite">
                {listening ? <><span className="font-medium text-destructive">● Listening…</span> Tap to stop</> : transcribing ? "Working out what you said…" : micError}
              </p>
            )}
          </div>
        </article>
      )}

      {history.length > 0 && (
        <section className="mt-10">
          <div className="flex items-center justify-between gap-3">
            <button onClick={() => setHistoryOpen((o) => !o)} aria-expanded={historyOpen} className="flex items-center gap-1.5 font-medium">
              Past captures <span className="text-sm text-muted-foreground">({history.length})</span>
              <ChevronDown className={`h-4 w-4 transition-transform ${historyOpen ? "rotate-180" : ""}`} />
            </button>
            {historyOpen && (confirmId === "all" ? (
              <span className="flex items-center gap-2 text-xs">
                Delete all captures?
                <button disabled={deleting} onClick={() => doDelete({ all: true })} className="rounded-full bg-destructive px-3 py-1 text-destructive-foreground">{deleting ? "Deleting…" : "Delete all"}</button>
                <button onClick={() => setConfirmId(null)} className="rounded-full px-3 py-1 ring-1 ring-border">Cancel</button>
              </span>
            ) : (
              <button onClick={() => setConfirmId("all")} className="flex items-center gap-1 text-xs text-destructive"><Trash2 className="h-3.5 w-3.5" /> Delete all</button>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">Your captures are private to you.</p>
          {historyOpen && (
            <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {history.map((h) => (
                <div key={h.id} className={`relative overflow-hidden rounded-2xl ring-1 ${current?.id === h.id ? "ring-primary" : "ring-border"}`}>
                  <button onClick={() => { setView("photo"); open(h, false); }} className="block w-full text-left">
                    <img src={h.image_url} alt="" className="aspect-square w-full object-cover" loading="lazy" />
                    <p className="truncate px-3 py-2 pr-10 text-xs">{h.monument_name ?? "Unknown"}</p>
                  </button>
                  {confirmId === h.id ? (
                    <div className="absolute inset-0 grid place-items-center bg-background/85 p-3 text-center backdrop-blur">
                      <div>
                        <p className="text-xs font-medium">Delete this capture?</p>
                        <div className="mt-2 flex justify-center gap-2">
                          <button disabled={deleting} onClick={() => doDelete({ ids: [h.id] })} className="rounded-full bg-destructive px-3 py-1 text-xs text-destructive-foreground">{deleting ? "…" : "Delete"}</button>
                          <button onClick={() => setConfirmId(null)} className="rounded-full px-3 py-1 text-xs ring-1 ring-border">Cancel</button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <button aria-label="Delete capture" onClick={() => setConfirmId(h.id)} className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-background/80 ring-1 ring-border backdrop-blur hover:text-destructive"><Trash2 className="h-3.5 w-3.5" /></button>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
}

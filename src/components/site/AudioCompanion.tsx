import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Headphones, Pause, Play, SkipBack, SkipForward, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Trail } from "@/lib/trails-data";

type Segment = { title: string; text: string };

function buildSegments(trail: Trail): Segment[] {
  const intro: Segment = {
    title: `Welcome - ${trail.title}`,
    text: `Welcome to ${trail.title}. ${trail.intro}`,
  };
  const stops = trail.stops.map((s, i) => ({
    title: `Stop ${i + 1}: ${s.name}`,
    text: `Stop ${i + 1}. ${s.name}, in ${s.place}. ${s.story ?? s.blurb}${
      s.secret ? ` ${s.secret.kind} ${s.secret.text}` : ""
    }`,
  }));
  return [intro, ...stops];
}

// Browser SpeechSynthesis wrapper - minimal, resilient.
function useNarration(segments: Segment[]) {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [rate, setRate] = useState(1);
  const [supported, setSupported] = useState(true);
  const utterRef = useRef<SpeechSynthesisUtterance | null>(null);
  const skipAdvanceRef = useRef(false);

  useEffect(() => {
    setSupported(typeof window !== "undefined" && "speechSynthesis" in window);
    return () => {
      try { window.speechSynthesis?.cancel(); } catch {}
    };
  }, []);

  const speak = useCallback(
    (i: number, auto = true) => {
      if (!supported) return;
      const synth = window.speechSynthesis;
      synth.cancel();
      const seg = segments[i];
      if (!seg) return;
      const u = new SpeechSynthesisUtterance(seg.text);
      u.rate = rate;
      u.pitch = 1;
      // Pick a warmer English voice if available.
      const voices = synth.getVoices();
      const preferred = voices.find((v) =>
        /Samantha|Google UK English Female|Karen|Serena|Microsoft Aria|Microsoft Jenny/i.test(v.name)
      ) || voices.find((v) => v.lang?.startsWith("en"));
      if (preferred) u.voice = preferred;
      u.onend = () => {
        if (skipAdvanceRef.current) { skipAdvanceRef.current = false; return; }
        setPlaying(false);
        if (auto && i < segments.length - 1) {
          setIndex(i + 1);
          // Auto-advance to next segment.
          setTimeout(() => { setPlaying(true); speak(i + 1, true); }, 500);
        }
      };
      utterRef.current = u;
      synth.speak(u);
      setPlaying(true);
    },
    [rate, segments, supported]
  );

  const play = useCallback(() => {
    if (!supported) return;
    const synth = window.speechSynthesis;
    if (synth.paused) { synth.resume(); setPlaying(true); return; }
    if (synth.speaking) return;
    speak(index, true);
  }, [index, speak, supported]);

  const pause = useCallback(() => {
    if (!supported) return;
    try { window.speechSynthesis.pause(); } catch {}
    setPlaying(false);
  }, [supported]);

  const next = useCallback(() => {
    if (index >= segments.length - 1) return;
    skipAdvanceRef.current = true;
    try { window.speechSynthesis.cancel(); } catch {}
    const i = index + 1;
    setIndex(i);
    setTimeout(() => speak(i, true), 80);
  }, [index, segments.length, speak]);

  const prev = useCallback(() => {
    skipAdvanceRef.current = true;
    try { window.speechSynthesis.cancel(); } catch {}
    const i = Math.max(0, index - 1);
    setIndex(i);
    setTimeout(() => speak(i, true), 80);
  }, [index, speak]);

  const cycleRate = useCallback(() => {
    const order = [0.85, 1, 1.15, 1.35];
    const next = order[(order.indexOf(rate) + 1) % order.length] ?? 1;
    setRate(next);
    if (playing) {
      try { window.speechSynthesis.cancel(); } catch {}
      setTimeout(() => speak(index, true), 60);
    }
  }, [index, playing, rate, speak]);

  const stop = useCallback(() => {
    try { window.speechSynthesis.cancel(); } catch {}
    setPlaying(false);
  }, []);

  return { index, setIndex, playing, play, pause, next, prev, rate, cycleRate, stop, supported };
}

export function AudioCompanion({ trail }: { trail: Trail }) {
  const segments = useMemo(() => buildSegments(trail), [trail]);
  const { index, playing, play, pause, next, prev, rate, cycleRate, stop, supported } = useNarration(segments);
  const [open, setOpen] = useState(false);
  const [bubble, setBubble] = useState(true);
  const [dismissed, setDismissed] = useState(false);

  // Auto-hide bubble after a few seconds.
  useEffect(() => {
    const t = setTimeout(() => setBubble(false), 6500);
    return () => clearTimeout(t);
  }, []);

  if (dismissed || !supported) return null;

  const seg = segments[index];
  const progressPct = Math.round(((index + (playing ? 0.5 : 0)) / segments.length) * 100);

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-2">
      {/* Speech bubble prompt */}
      <AnimatePresence>
        {bubble && !open && (
          <motion.button
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ type: "spring", stiffness: 220, damping: 24 }}
            onClick={() => { setOpen(true); setBubble(false); play(); }}
            className="max-w-[260px] rounded-2xl bg-background/95 backdrop-blur ring-1 ring-foreground/10 shadow-2xl px-4 py-3 text-left"
          >
            <div className="text-[11px] uppercase tracking-[0.22em] text-primary/85">Audio companion</div>
            <div className="mt-1 text-sm text-foreground">
              <span className="mr-1">🎧</span> Listen as you walk.
            </div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Mini player */}
      <AnimatePresence initial={false} mode="wait">
        {open ? (
          <motion.div
            key="player"
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 240, damping: 26 }}
            className="w-[min(92vw,360px)] overflow-hidden rounded-2xl bg-background/95 backdrop-blur-xl ring-1 ring-foreground/10 shadow-2xl"
          >
            <div className="flex items-center justify-between px-4 pt-3">
              <span className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground inline-flex items-center gap-1.5">
                <Headphones className="h-3 w-3 text-primary" /> Trail audio
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setOpen(false)}
                  aria-label="Minimize"
                  className="grid h-7 w-7 place-items-center rounded-full hover:bg-foreground/5"
                >
                  <ChevronDown className="h-4 w-4" />
                </button>
                <button
                  onClick={() => { stop(); setDismissed(true); }}
                  aria-label="Close"
                  className="grid h-7 w-7 place-items-center rounded-full hover:bg-foreground/5"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="px-4 pt-2">
              <div className="text-[11px] text-muted-foreground">Now playing</div>
              <div className="mt-0.5 truncate font-display text-base">{seg?.title}</div>
            </div>

            {/* Progress */}
            <div className="px-4 pt-3">
              <div className="h-1 w-full rounded-full bg-foreground/10 overflow-hidden">
                <div className="h-full gradient-ember transition-all duration-500" style={{ width: `${progressPct}%` }} />
              </div>
              <div className="mt-1 flex items-center justify-between text-[10px] text-muted-foreground">
                <span>{index + 1} / {segments.length}</span>
                <button onClick={cycleRate} className="rounded-full bg-foreground/5 px-2 py-0.5 hover:bg-foreground/10">{rate}×</button>
              </div>
            </div>

            {/* Transport */}
            <div className="flex items-center justify-center gap-2 px-4 pb-4 pt-3">
              <button
                onClick={prev}
                disabled={index === 0}
                aria-label="Previous"
                className="grid h-10 w-10 place-items-center rounded-full hover:bg-foreground/5 disabled:opacity-40"
              >
                <SkipBack className="h-4 w-4" />
              </button>
              <button
                onClick={playing ? pause : play}
                aria-label={playing ? "Pause" : "Play"}
                className="grid h-12 w-12 place-items-center rounded-full gradient-ember text-primary-foreground shadow-[0_10px_24px_-10px_oklch(0.74_0.13_75/0.8)]"
              >
                {playing ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 translate-x-0.5" />}
              </button>
              <button
                onClick={next}
                disabled={index >= segments.length - 1}
                aria-label="Next"
                className="grid h-10 w-10 place-items-center rounded-full hover:bg-foreground/5 disabled:opacity-40"
              >
                <SkipForward className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.button
            key="fab"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
            onClick={() => setOpen(true)}
            aria-label="Open audio companion"
            className="relative grid h-12 w-12 place-items-center rounded-full bg-background ring-1 ring-foreground/10 shadow-xl hover:scale-[1.03] transition"
          >
            <Headphones className="h-5 w-5 text-foreground" />
            {playing && (
              <span className="absolute inset-0 rounded-full ring-2 ring-primary/60 animate-ping" />
            )}
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}

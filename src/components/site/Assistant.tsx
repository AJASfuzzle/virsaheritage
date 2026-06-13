import { motion } from "framer-motion";
import { Bot, Loader2, Send, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { askKaal } from "@/lib/ai-chat.functions";
import { toast } from "sonner";

const examples = [
  "What festivals are unique to Rajasthan?",
  "Show me the folk dances of Assam.",
  "What foods were popular in Punjab in the 1950s?",
  "Which states celebrate similar harvest festivals?",
];

type Msg = { role: "user" | "assistant"; content: string };

const seed: Msg[] = [
  { role: "user", content: "What festivals are unique to Nagaland?" },
  {
    role: "assistant",
    content:
      "Nagaland is best known for the **Hornbill Festival** (Dec 1–10) in Kisama, where all 17 major Naga tribes share dance, cuisine and folk song. Other distinctly Naga celebrations include *Sekrenyi* (Angami purification), *Aoleang* (Konyak new year) and *Tuluni* (Sumi harvest).",
  },
];

export function Assistant() {
  const [messages, setMessages] = useState<Msg[]>(seed);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const ask = useServerFn(askKaal);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  const send = async (text: string) => {
    const q = text.trim();
    if (!q || loading) return;
    const next: Msg[] = [...messages, { role: "user", content: q }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const { reply } = await ask({ data: { messages: next.slice(-12) } });
      setMessages((m) => [...m, { role: "assistant", content: reply }]);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong.";
      toast.error(msg);
      setMessages((m) => [...m, { role: "assistant", content: `_${msg}_` }]);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    send(input);
  };

  return (
    <section id="assistant" className="relative py-24 sm:py-32">
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
                <button
                  key={e}
                  onClick={() => send(e)}
                  disabled={loading}
                  className="rounded-full glass px-3.5 py-2 text-xs sm:text-sm text-foreground/80 hover:bg-white/10 transition disabled:opacity-50"
                >
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

            <div ref={scrollRef} className="mt-5 space-y-4 max-h-[420px] overflow-y-auto pr-1">
              {messages.map((m, i) => (
                <div key={i} className={m.role === "user" ? "flex justify-end" : "flex gap-3"}>
                  {m.role === "assistant" && (
                    <div className="grid h-8 w-8 place-items-center rounded-full gradient-ember text-primary-foreground shrink-0">
                      <Bot className="h-4 w-4" />
                    </div>
                  )}
                  <div
                    className={
                      m.role === "user"
                        ? "max-w-[80%] rounded-2xl rounded-tr-md bg-primary/15 ring-1 ring-primary/25 px-4 py-2.5 text-sm whitespace-pre-wrap"
                        : "max-w-[85%] rounded-2xl rounded-tl-md bg-background/40 ring-1 ring-white/10 px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap"
                    }
                    dangerouslySetInnerHTML={
                      m.role === "assistant" ? { __html: renderMd(m.content) } : undefined
                    }
                  >
                    {m.role === "user" ? m.content : null}
                  </div>
                  {m.role === "user" && (
                    <div className="grid h-8 w-8 place-items-center rounded-full bg-white/10 ring-1 ring-white/15 shrink-0 ml-2">
                      <User className="h-4 w-4 text-foreground/80" />
                    </div>
                  )}
                </div>
              ))}
              {loading && (
                <div className="flex gap-3">
                  <div className="grid h-8 w-8 place-items-center rounded-full gradient-ember text-primary-foreground shrink-0">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div className="rounded-2xl rounded-tl-md bg-background/40 ring-1 ring-white/10 px-4 py-3 text-sm text-muted-foreground inline-flex items-center gap-2">
                    <Loader2 className="h-3.5 w-3.5 animate-spin" /> KAAL is remembering…
                  </div>
                </div>
              )}
            </div>

            <form onSubmit={onSubmit} className="mt-6 flex items-center gap-2 rounded-full bg-background/50 ring-1 ring-white/10 px-4 py-2.5">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={loading}
                className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground disabled:opacity-60"
                placeholder="Ask about a tradition, region, dish or language…"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                aria-label="Send"
                className="grid h-9 w-9 place-items-center rounded-full gradient-ember text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed hover:brightness-110 transition"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// Tiny, safe markdown renderer for **bold** and *italic* only.
function renderMd(s: string): string {
  const esc = s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  return esc
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/(^|[\s(])\*(.+?)\*(?=[\s.,;:)!?]|$)/g, "$1<em>$2</em>");
}

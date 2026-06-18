import { Bot, Loader2, Send, User, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useServerFn } from "@tanstack/react-start";
import { askVirsa } from "@/lib/ai-chat.functions";
import { toast } from "sonner";

type Msg = { role: "user" | "assistant"; content: string };

const SEED: Msg[] = [
  {
    role: "assistant",
    content:
      "Namaste — I'm **VIRSA**. Ask me anything about India's traditions, regions, family histories or the stories preserved in the archive.",
  },
];

const QUICK = [
  "What was life like in Punjab during Partition?",
  "Tell me about Hornbill Festival in Nagaland.",
  "What is a Patola sari?",
];

export function FloatingAssistantButton() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>(SEED);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const ask = useServerFn(askVirsa);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, loading, open]);

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

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
      inputRef.current?.focus();
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close VIRSA assistant" : "Open VIRSA assistant"}
        aria-expanded={open}
        className="fixed right-4 bottom-4 z-[60] group flex items-center gap-2"
      >
        <span className="grid h-12 w-12 place-items-center rounded-full gradient-ember text-primary-foreground shadow-[0_10px_30px_-10px_oklch(0.72_0.18_55/0.7)] ring-1 ring-white/20 transition-all duration-500 hover:scale-110 active:scale-95">
          <AnimatePresence mode="wait" initial={false}>
            {open ? (
              <motion.span
                key="x"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <X className="h-5 w-5" strokeWidth={2.4} />
              </motion.span>
            ) : (
              <motion.span
                key="bot"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Bot className="h-5 w-5" strokeWidth={2.2} />
              </motion.span>
            )}
          </AnimatePresence>
        </span>
        {!open && (
          <span className="hidden sm:block rounded-full glass px-3 py-1.5 text-xs font-medium text-foreground/90 opacity-0 -translate-x-2 transition-all duration-500 group-hover:opacity-100 group-hover:translate-x-0">
            Ask VIRSA
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
            <motion.div
              initial={{ opacity: 0, y: 16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.96 }}
              transition={{ type: "spring", stiffness: 320, damping: 28 }}
              role="dialog"
              aria-label="VIRSA Assistant"
              style={{ transformOrigin: "bottom right" }}
              className="fixed right-4 bottom-20 z-[60] w-[calc(100vw-2rem)] max-w-[380px] h-[min(560px,calc(100vh-7rem))] glass rounded-2xl shadow-[var(--shadow-soft)] ring-1 ring-white/10 overflow-hidden flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-white/10 bg-background/30">
                <div className="flex items-center gap-2.5">
                  <span className="grid h-8 w-8 place-items-center rounded-full gradient-ember text-primary-foreground shrink-0">
                    <Bot className="h-4 w-4" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold leading-tight">VIRSA</p>
                    <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-jade animate-pulse-pin" />
                      Heritage Assistant
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  aria-label="Close"
                  className="grid h-8 w-8 place-items-center rounded-full hover:bg-white/10 text-muted-foreground hover:text-foreground transition"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Messages */}
              <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto px-4 py-4 space-y-3"
              >
                {messages.map((m, i) => (
                  <div
                    key={i}
                    className={m.role === "user" ? "flex justify-end" : "flex gap-2"}
                  >
                    {m.role === "assistant" && (
                      <div className="grid h-7 w-7 place-items-center rounded-full gradient-ember text-primary-foreground shrink-0">
                        <Bot className="h-3.5 w-3.5" />
                      </div>
                    )}
                    <div
                      className={
                        m.role === "user"
                          ? "max-w-[82%] rounded-2xl rounded-tr-md bg-primary/15 ring-1 ring-primary/25 px-3.5 py-2 text-sm whitespace-pre-wrap"
                          : "max-w-[88%] rounded-2xl rounded-tl-md bg-background/40 ring-1 ring-white/10 px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap"
                      }
                      dangerouslySetInnerHTML={
                        m.role === "assistant"
                          ? { __html: renderMd(m.content) }
                          : undefined
                      }
                    >
                      {m.role === "user" ? m.content : null}
                    </div>
                    {m.role === "user" && (
                      <div className="grid h-7 w-7 place-items-center rounded-full bg-white/10 ring-1 ring-white/15 shrink-0 ml-1">
                        <User className="h-3.5 w-3.5 text-foreground/80" />
                      </div>
                    )}
                  </div>
                ))}
                {loading && (
                  <div className="flex gap-2">
                    <div className="grid h-7 w-7 place-items-center rounded-full gradient-ember text-primary-foreground shrink-0">
                      <Bot className="h-3.5 w-3.5" />
                    </div>
                    <div className="rounded-2xl rounded-tl-md bg-background/40 ring-1 ring-white/10 px-3.5 py-2.5 text-sm text-muted-foreground inline-flex items-center gap-2">
                      <Loader2 className="h-3.5 w-3.5 animate-spin" /> VIRSA is
                      remembering…
                    </div>
                  </div>
                )}

                {messages.length <= 1 && !loading && (
                  <div className="pt-2 flex flex-wrap gap-1.5">
                    {QUICK.map((q) => (
                      <button
                        key={q}
                        onClick={() => send(q)}
                        className="rounded-full glass px-3 py-1.5 text-[11px] text-foreground/80 hover:bg-white/10 transition text-left"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Composer */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  send(input);
                }}
                className="border-t border-white/10 bg-background/30 px-3 py-3 flex items-center gap-2"
              >
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={loading}
                  className="flex-1 bg-background/50 ring-1 ring-white/10 rounded-full px-4 py-2 text-sm outline-none placeholder:text-muted-foreground disabled:opacity-60 focus:ring-primary/40"
                  placeholder="Ask about a tradition, region, dish…"
                />
                <button
                  type="submit"
                  disabled={loading || !input.trim()}
                  aria-label="Send"
                  className="grid h-9 w-9 place-items-center rounded-full gradient-ember text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed hover:brightness-110 transition shrink-0"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </button>
              </form>
            </motion.div>
        )}
      </AnimatePresence>
    </>
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

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Sparkles, X, Check } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useInterests, useSetInterests } from "@/hooks/use-recommendations";
import { CATEGORIES, REGIONS } from "@/lib/recommendation-catalog";

/**
 * Shown once after sign-in to capture explicit interests for the recommender.
 * Skippable; tracked via user_interests.onboarded.
 */
export function InterestsOnboarding() {
  const { user, loading } = useAuth();
  const { data: interests, isLoading } = useInterests();
  const setInterests = useSetInterests();

  const [open, setOpen] = useState(false);
  const [cats, setCats] = useState<string[]>([]);
  const [regs, setRegs] = useState<string[]>([]);

  useEffect(() => {
    if (loading || isLoading) return;
    if (!user) return;
    if (interests && !interests.onboarded) {
      setCats(interests.categories ?? []);
      setRegs(interests.regions ?? []);
      setOpen(true);
    }
  }, [user, loading, interests, isLoading]);

  const toggle = (list: string[], setList: (v: string[]) => void, v: string) => {
    setList(list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);
  };

  const submit = async () => {
    await setInterests.mutateAsync({ categories: cats, regions: regs });
    setOpen(false);
  };

  const skip = async () => {
    await setInterests.mutateAsync({ categories: cats, regions: regs });
    setOpen(false);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[80] flex items-center justify-center bg-background/70 p-4 backdrop-blur-md"
          onClick={skip}
          role="dialog"
          aria-modal="true"
          aria-label="Tell Virsa what you love"
        >
          <motion.div
            initial={{ y: 20, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-[var(--glass-border)] bg-[var(--card)] p-7 shadow-[var(--shadow-soft)] sm:p-10"
          >
            <button
              type="button"
              onClick={skip}
              aria-label="Skip"
              className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-foreground/5 hover:bg-foreground/10"
            >
              <X className="h-4 w-4" />
            </button>

            <p className="mb-3 flex items-center gap-2 text-[11px] uppercase tracking-[0.28em] text-[color:var(--accent)]">
              <Sparkles className="h-3.5 w-3.5" /> Welcome
            </p>
            <h2 className="font-display text-3xl leading-tight sm:text-4xl">
              What corners of India call to you?
            </h2>
            <p className="mt-3 max-w-lg text-sm text-muted-foreground">
              Pick a few. Virsa's recommender will use these to curate stories, trails and sites just for you. You can change them anytime.
            </p>

            <div className="mt-7">
              <p className="mb-2 text-[10px] uppercase tracking-[0.28em] text-muted-foreground">Categories</p>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((c) => {
                  const on = cats.includes(c);
                  return (
                    <button
                      key={c}
                      type="button"
                      onClick={() => toggle(cats, setCats, c)}
                      className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs transition ${
                        on
                          ? "border-[color:var(--accent)] bg-[color:var(--accent)] text-[color:var(--accent-foreground)]"
                          : "border-[var(--glass-border)] bg-[var(--card)] text-foreground/80 hover:border-[color:var(--accent)]/50"
                      }`}
                    >
                      {on && <Check className="h-3 w-3" />}
                      {c}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-6">
              <p className="mb-2 text-[10px] uppercase tracking-[0.28em] text-muted-foreground">Regions</p>
              <div className="flex flex-wrap gap-2">
                {REGIONS.map((r) => {
                  const on = regs.includes(r);
                  return (
                    <button
                      key={r}
                      type="button"
                      onClick={() => toggle(regs, setRegs, r)}
                      className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs transition ${
                        on
                          ? "border-[color:var(--accent)] bg-[color:var(--accent)] text-[color:var(--accent-foreground)]"
                          : "border-[var(--glass-border)] bg-[var(--card)] text-foreground/80 hover:border-[color:var(--accent)]/50"
                      }`}
                    >
                      {on && <Check className="h-3 w-3" />}
                      {r}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-8 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={skip}
                className="text-xs uppercase tracking-[0.22em] text-muted-foreground hover:text-foreground"
              >
                Skip for now
              </button>
              <button
                type="button"
                onClick={submit}
                disabled={setInterests.isPending}
                className="btn-glossy inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-6 py-3 text-xs uppercase tracking-[0.22em] text-[color:var(--accent-foreground)] disabled:opacity-60"
              >
                {setInterests.isPending ? "Saving…" : "Show me my Virsa"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, CalendarRange, Clock, Coins, Gift, MapPin, Loader2, Sparkles, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { listRewards, getMyState, redeemReward } from "@/lib/kaal.functions";
import { useAuth } from "@/hooks/use-auth";
import { trails, type Trail } from "@/lib/trails-data";

export const Route = createFileRoute("/khazane")({
  head: () => ({
    meta: [
      { title: "Khazane — Treasures Beyond Time · KAAL" },
      { name: "description", content: "Redeem Kaal Coins for heritage experiences, hand-bound journals, art prints and exclusive archives." },
      { property: "og:title", content: "Khazane · KAAL" },
      { property: "og:description", content: "Unlock treasures beyond time." },
    ],
  }),
  component: KhazanePage,
});

type Category = "all" | "trails" | "travel" | "merch" | "digital";

type Reward = {
  code: string;
  title: string;
  category: string;
};

const CATEGORIES: { key: Category; label: string; tagline: string }[] = [
  { key: "all", label: "All treasures", tagline: "Every door." },
  { key: "trails", label: "Trails", tagline: "Walk the living archive." },
  { key: "travel", label: "Travel", tagline: "Experiences in the field." },
  { key: "merch", label: "Merchandise", tagline: "Heirlooms for your shelf." },
  { key: "digital", label: "Digital", tagline: "Archives, stories, scenes." },
];

function getTrailForReward(reward: Pick<Reward, "title" | "code" | "category">): Trail | null {
  if (reward.category !== "trails") return null;
  const normalized = `${reward.title} ${reward.code}`.toLowerCase();
  return trails.find((trail) => normalized.includes(trail.slug.replaceAll("-", " ")) || normalized.includes(trail.title.toLowerCase())) ?? null;
}

function KhazanePage() {
  const { user } = useAuth();
  const fetchRewards = useServerFn(listRewards);
  const fetchState = useServerFn(getMyState);
  const redeem = useServerFn(redeemReward);
  const qc = useQueryClient();

  const [cat, setCat] = useState<Category>("all");
  const [confirm, setConfirm] = useState<{ id: string; title: string; coins: number } | null>(null);
  const [celebration, setCelebration] = useState<string | null>(null);
  const [openTrail, setOpenTrail] = useState<Trail | null>(null);

  const { data: rewards = [], isLoading } = useQuery({
    queryKey: ["rewards"],
    queryFn: () => fetchRewards(),
  });
  const { data: state } = useQuery({
    queryKey: ["my-state"],
    queryFn: () => fetchState(),
    enabled: !!user,
  });

  const mutation = useMutation({
    mutationFn: (rewardId: string) => redeem({ data: { rewardId } }),
    onSuccess: (res, _rewardId) => {
      if (!res.ok) {
        if (res.reason === "insufficient_coins") {
          toast.error(`Not enough coins. You have ${res.balance}, need ${res.required}.`);
        } else {
          toast.error("Redemption failed");
        }
        return;
      }
      qc.invalidateQueries({ queryKey: ["my-state"] });
      setCelebration(res.reward_title ?? "Treasure unlocked");
      setConfirm(null);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const filtered = cat === "all" ? rewards : rewards.filter((r) => r.category === cat);

  return (
    <div className="pt-28 pb-24 relative overflow-hidden">
      {/* gold atmospheric backdrop */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-40 left-1/2 h-[600px] w-[1100px] -translate-x-1/2 rounded-full bg-primary/10 blur-[160px]" />
        <div className="absolute inset-0 opacity-[0.05] mix-blend-overlay [background-image:radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] [background-size:28px_28px]" />
      </div>

      <header className="mx-auto max-w-5xl px-5 text-center">
        <motion.p
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          className="text-xs uppercase tracking-[0.32em] text-primary/90"
        >
          Khazane · The Treasury
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.05 }}
          className="mt-4 font-display text-5xl sm:text-6xl text-balance"
        >
          Unlock treasures <span className="italic text-gradient-ember">beyond time.</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7, delay: 0.15 }}
          className="mt-5 mx-auto max-w-2xl text-muted-foreground text-pretty"
        >
          Every check-in earns Kaal Coins. Trade them for guided experiences in the field, hand-bound objects for your shelf, and exclusive entries from the KAAL archive.
        </motion.p>

        {user ? (
          <div className="mt-7 inline-flex items-center gap-2 rounded-full glass px-4 py-2 text-sm">
            <Coins className="h-4 w-4 text-primary" />
            <span className="text-muted-foreground">Balance</span>
            <span className="text-foreground font-medium">{state?.balance ?? 0} Kaal Coins</span>
          </div>
        ) : (
          <div className="mt-7 inline-flex items-center gap-3 rounded-full glass px-4 py-2 text-sm">
            <span className="text-muted-foreground">Sign in to start collecting</span>
            <Link to="/auth" search={{ mode: "signin", redirect: "/khazane" }} className="rounded-full gradient-ember px-3 py-1 text-xs font-medium text-primary-foreground">Sign in</Link>
          </div>
        )}
      </header>

      <nav className="mt-14 mx-auto max-w-5xl px-5">
        <div className="flex flex-wrap items-center justify-center gap-2 rounded-full glass p-1.5 mx-auto w-fit text-sm">
          {CATEGORIES.map((c) => (
            <button
              key={c.key}
              onClick={() => setCat(c.key)}
              className={`btn-glossy rounded-full px-4 py-1.5 transition ${cat === c.key ? "bg-white/10 text-foreground" : "text-foreground/65 hover:text-foreground"}`}
            >
              {c.label}
            </button>
          ))}
        </div>
        <p className="mt-3 text-center text-xs uppercase tracking-[0.28em] text-muted-foreground">
          {CATEGORIES.find((c) => c.key === cat)?.tagline}
        </p>
      </nav>

      <section className="mt-10 mx-auto max-w-7xl px-5">
        {isLoading ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => <div key={i} className="h-64 rounded-3xl bg-white/5 animate-pulse" />)}
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((r, i) => {
              const balance = state?.balance ?? 0;
              const enough = balance >= r.coins_required;
              const rewardTrail = getTrailForReward(r);
              return (
                <motion.div
                  key={r.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.5, delay: i * 0.05 }}
                  onClick={() => rewardTrail && setOpenTrail(rewardTrail)}
                  onKeyDown={(e) => {
                    if (rewardTrail && (e.key === "Enter" || e.key === " ")) {
                      e.preventDefault();
                      setOpenTrail(rewardTrail);
                    }
                  }}
                  role={rewardTrail ? "button" : undefined}
                  tabIndex={rewardTrail ? 0 : undefined}
                  className={`group relative overflow-hidden rounded-3xl glass p-6 ring-1 ring-white/5 hover:ring-primary/30 transition ${rewardTrail ? "cursor-pointer" : ""}`}
                >
                  <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-primary/15 blur-3xl opacity-0 group-hover:opacity-100 transition" />
                  <div className="relative">
                    <div className="flex items-start justify-between">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          rewardTrail && setOpenTrail(rewardTrail);
                        }}
                        disabled={!rewardTrail}
                        aria-label={rewardTrail ? `Preview ${rewardTrail.title}` : undefined}
                        className={`text-5xl transition ${rewardTrail ? "hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 rounded-2xl" : "cursor-default"}`}
                      >
                        <span aria-hidden>{r.image_emoji ?? rewardTrail?.hero ?? "✨"}</span>
                      </button>
                      <span className="rounded-full bg-primary/15 text-primary ring-1 ring-primary/30 px-2.5 py-1 text-[10px] uppercase tracking-[0.2em]">
                        {r.category}
                      </span>
                    </div>
                    <h3 className="mt-5 font-display text-xl">{r.title}</h3>
                    <p className="mt-2 text-sm text-foreground/75 leading-relaxed text-pretty">{r.description}</p>

                    <div className="mt-5 flex items-center justify-between">
                      <div className="inline-flex items-center gap-1.5 text-sm">
                        <Coins className="h-4 w-4 text-primary" />
                        <span className="font-display text-lg">{r.coins_required}</span>
                        <span className="text-muted-foreground text-xs">coins</span>
                      </div>
                      <button
                        disabled={!user || !enough || mutation.isPending}
                        onClick={(e) => {
                          e.stopPropagation();
                          setConfirm({ id: r.id, title: r.title, coins: r.coins_required });
                        }}
                        className="btn-glossy inline-flex items-center gap-1.5 rounded-full gradient-ember px-4 py-1.5 text-xs font-semibold text-primary-foreground shadow-[0_10px_30px_-10px_oklch(0.72_0.18_55/0.7)] disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Gift className="h-3.5 w-3.5" />
                        {!user ? "Sign in" : !enough ? `Need ${r.coins_required - balance} more` : "Redeem"}
                      </button>
                    </div>

                    {rewardTrail && (
                      <div className="mt-5 inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-primary/90">
                        Preview trail <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" />
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </section>

      {/* Trail preview modal */}
      <AnimatePresence>
        {openTrail && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 grid place-items-center bg-black/70 backdrop-blur-md p-4"
            onClick={() => setOpenTrail(null)}
          >
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 18, scale: 0.97 }}
              transition={{ duration: 0.24 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-h-[88vh] w-full max-w-4xl overflow-hidden rounded-3xl glass ring-1 ring-primary/20"
            >
              <button
                onClick={() => setOpenTrail(null)}
                className="absolute right-4 top-4 z-10 rounded-full bg-background/70 p-2 text-muted-foreground ring-1 ring-white/10 transition hover:text-foreground"
                aria-label="Close trail preview"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="max-h-[88vh] overflow-y-auto p-6 sm:p-8">
                <div className="flex flex-wrap items-center gap-2 pr-10">
                  <span className="text-5xl" aria-hidden>{openTrail.hero}</span>
                  <span className="rounded-full bg-primary/15 text-primary ring-1 ring-primary/30 px-3 py-1 text-[11px] uppercase tracking-[0.22em]">
                    {openTrail.kind}
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" /> {openTrail.days}
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5" /> {openTrail.region}
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                    <CalendarRange className="h-3.5 w-3.5" /> {openTrail.bestSeason}
                  </span>
                </div>

                <h2 className="mt-5 font-display text-4xl sm:text-5xl text-balance">
                  {openTrail.title}
                </h2>
                <p className="mt-4 max-w-3xl text-foreground/80 leading-relaxed text-pretty">
                  {openTrail.intro}
                </p>

                <div className="mt-8 grid gap-3 sm:grid-cols-2">
                  {openTrail.stops.map((stop, index) => (
                    <div key={stop.name} className="rounded-2xl bg-white/[0.04] p-4 ring-1 ring-white/5">
                      <div className="flex items-start gap-3">
                        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full gradient-ember font-display text-sm text-primary-foreground">
                          {index + 1}
                        </span>
                        <div>
                          <h3 className="font-display text-lg leading-tight">{stop.name}</h3>
                          <p className="mt-1 inline-flex items-center gap-1.5 text-xs text-primary/90">
                            <MapPin className="h-3 w-3" /> {stop.place}
                          </p>
                          <p className="mt-2 text-sm leading-relaxed text-foreground/75">{stop.blurb}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confirm modal */}
      <AnimatePresence>
        {confirm && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 grid place-items-center bg-black/60 backdrop-blur-md p-4"
            onClick={() => !mutation.isPending && setConfirm(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.94 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm rounded-3xl glass p-6 ring-1 ring-white/10"
            >
              <div className="flex items-start justify-between">
                <h3 className="font-display text-2xl">Confirm redemption</h3>
                <button onClick={() => setConfirm(null)} disabled={mutation.isPending} className="p-1 text-muted-foreground hover:text-foreground"><X className="h-4 w-4" /></button>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                You're about to unlock <span className="text-foreground font-medium">{confirm.title}</span>.
              </p>
              <div className="mt-4 rounded-2xl bg-white/[0.04] p-3 ring-1 ring-white/5 flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Coins</span>
                <span className="font-display text-xl text-gradient-ember">−{confirm.coins}</span>
              </div>
              <button
                onClick={() => mutation.mutate(confirm.id)}
                disabled={mutation.isPending}
                className="btn-glossy mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl gradient-ember px-4 py-3 text-sm font-semibold text-primary-foreground disabled:opacity-60"
              >
                {mutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                Redeem now
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Celebration */}
      <AnimatePresence>
        {celebration && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 grid place-items-center bg-black/70 backdrop-blur-md p-4"
            onClick={() => setCelebration(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 220, damping: 22 }}
              className="text-center max-w-md"
            >
              <div className="mx-auto h-20 w-20 rounded-full gradient-ember grid place-items-center shadow-[0_30px_60px_-15px_oklch(0.72_0.18_55/0.8)]">
                <Sparkles className="h-9 w-9 text-primary-foreground" />
              </div>
              <h3 className="mt-6 font-display text-3xl text-balance">You've unlocked a piece of KAAL.</h3>
              <p className="mt-2 text-muted-foreground">{celebration}</p>
              <button onClick={() => setCelebration(null)} className="btn-glossy mt-6 inline-flex items-center rounded-full gradient-ember px-5 py-2 text-sm font-semibold text-primary-foreground">
                Continue exploring
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

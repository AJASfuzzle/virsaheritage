import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { Award, Coins, Compass, Map, Sparkles, Gift } from "lucide-react";
import { motion } from "framer-motion";
import { getMyState } from "@/lib/kaal.functions";
import { trails } from "@/lib/trails-data";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — KAAL Heritage" },
      { name: "description", content: "Your Kaal Coins, trails, and achievements." },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const { user } = useAuth();
  const userName = (user?.user_metadata?.full_name as string | undefined) ?? user?.email?.split("@")[0] ?? "Friend";
  const fetchState = useServerFn(getMyState);
  const { data, isLoading } = useQuery({
    queryKey: ["my-state"],
    queryFn: () => fetchState(),
  });

  if (isLoading || !data) {
    return (
      <div className="pt-28 pb-24">
        <div className="mx-auto max-w-7xl px-5 animate-pulse">
          <div className="h-12 w-72 rounded-2xl bg-white/5" />
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => <div key={i} className="h-32 rounded-3xl bg-white/5" />)}
          </div>
        </div>
      </div>
    );
  }

  const completedTrails = new Set(
    trails
      .filter((t) => data.progress.filter((p) => p.trail_slug === t.slug).length > 0)
      .map((t) => t.slug)
  );
  const fullyDone = trails.filter((t) => {
    const stops = data.progress.filter((p) => p.trail_slug === t.slug).length;
    return stops > 0 && stops >= t.stops.length;
  }).length;

  return (
    <div className="pt-28 pb-24">
      <div className="mx-auto max-w-7xl px-5">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <p className="text-xs uppercase tracking-[0.28em] text-primary/90">Welcome back</p>
          <h1 className="mt-2 font-display text-4xl sm:text-5xl">{userName}.</h1>
          <p className="mt-2 text-muted-foreground">Here's where your journey through KAAL stands today.</p>
        </motion.div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard icon={Coins} label="Kaal Coins" value={data.balance.toString()} accent />
          <StatCard icon={Map} label="Sites visited" value={data.progress.length.toString()} />
          <StatCard icon={Compass} label="Trails active" value={completedTrails.size.toString()} />
          <StatCard icon={Award} label="Trails completed" value={fullyDone.toString()} />
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          <section className="lg:col-span-2 rounded-3xl glass p-6">
            <div className="flex items-baseline justify-between">
              <h2 className="font-display text-2xl">Your trails</h2>
              <Link to="/trails" className="text-sm text-primary hover:underline">All trails →</Link>
            </div>
            <div className="mt-6 space-y-4">
              {trails.map((t) => {
                const done = data.progress.filter((p) => p.trail_slug === t.slug).length;
                const total = t.stops.length;
                const pct = Math.round((done / total) * 100);
                return (
                  <Link
                    key={t.slug}
                    to="/trails/$slug"
                    params={{ slug: t.slug }}
                    className="block rounded-2xl ring-1 ring-white/5 bg-white/[0.02] p-4 hover:ring-primary/30 transition"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span aria-hidden className="text-lg">{t.hero}</span>
                          <span className="font-display text-lg truncate">{t.title}</span>
                        </div>
                        <div className="mt-1 text-xs text-muted-foreground">{t.region} · {done}/{total} stops</div>
                      </div>
                      <div className="shrink-0 text-right">
                        <div className="text-sm font-medium">{pct}%</div>
                      </div>
                    </div>
                    <div className="mt-3 h-1.5 w-full rounded-full bg-white/5 overflow-hidden">
                      <div className="h-full gradient-ember" style={{ width: `${pct}%` }} />
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>

          <aside className="space-y-6">
            <section className="rounded-3xl glass p-6">
              <div className="flex items-center gap-2">
                <Award className="h-4 w-4 text-primary" />
                <h2 className="font-display text-xl">Achievements</h2>
              </div>
              {data.achievements.length === 0 ? (
                <p className="mt-3 text-sm text-muted-foreground">No badges yet. Check in at any heritage site to unlock <span className="text-foreground">First Footsteps</span>.</p>
              ) : (
                <ul className="mt-4 space-y-2">
                  {data.achievements.map((a) => (
                    <li key={a.code} className="flex items-center gap-3 rounded-xl bg-white/[0.03] px-3 py-2 ring-1 ring-white/5">
                      <span className="grid h-8 w-8 place-items-center rounded-full gradient-ember text-primary-foreground"><Sparkles className="h-4 w-4" /></span>
                      <span className="text-sm font-medium capitalize">{a.code.replace(/_/g, " ")}</span>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section className="rounded-3xl glass p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Gift className="h-4 w-4 text-primary" />
                  <h2 className="font-display text-xl">Khazane</h2>
                </div>
                <Link to="/khazane" className="text-sm text-primary hover:underline">Browse →</Link>
              </div>
              {data.redemptions.length === 0 ? (
                <p className="mt-3 text-sm text-muted-foreground">No redemptions yet. Earn coins and unlock treasures from the Khazane.</p>
              ) : (
                <ul className="mt-4 space-y-2">
                  {data.redemptions.slice(0, 4).map((r) => (
                    <li key={r.id} className="flex items-center justify-between rounded-xl bg-white/[0.03] px-3 py-2 ring-1 ring-white/5">
                      <span className="text-sm capitalize">{r.reward_code.replace(/_/g, " ")}</span>
                      <span className="text-xs text-muted-foreground">−{r.coins_spent}</span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, accent }: { icon: typeof Coins; label: string; value: string; accent?: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`relative overflow-hidden rounded-3xl glass p-5 ring-1 ${accent ? "ring-primary/30" : "ring-white/5"}`}
    >
      {accent && <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-primary/20 blur-3xl" />}
      <div className="relative flex items-center justify-between">
        <span className="text-xs uppercase tracking-[0.22em] text-muted-foreground">{label}</span>
        <Icon className={`h-4 w-4 ${accent ? "text-primary" : "text-muted-foreground"}`} />
      </div>
      <div className={`relative mt-3 font-display text-4xl ${accent ? "text-gradient-ember" : ""}`}>{value}</div>
    </motion.div>
  );
}

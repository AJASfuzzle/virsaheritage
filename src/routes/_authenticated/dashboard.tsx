import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import {
  Award, Coins, Compass, Map, Sparkles, Gift,
  LayoutDashboard, UserRound, Images, Bookmark, Library as LibraryIcon,
  Upload, Save, Trash2, ArrowUpRight, Pencil, FileText, Heart, MapPin, BookOpen, Route as RouteIcon,
} from "lucide-react";
import { motion } from "framer-motion";
import { getMyState } from "@/lib/virsa.functions";
import { trails } from "@/lib/trails-data";
import { useAuth } from "@/hooks/use-auth";
import {
  getProfile, updateProfile, listFeed, listSaved, deletePost,
} from "@/lib/echoes.functions";
import { PostCard, type EchoPost } from "@/components/echoes/PostCard";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useSaves, useToggleSave } from "@/hooks/use-recommendations";
import { buildCatalog, indexCatalog } from "@/lib/recommendation-catalog";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — VIRSA Heritage" },
      { name: "description", content: "Your unified VIRSA dashboard — profile, echoes, library contributions, saved stories, trails and coins." },
    ],
  }),
  component: DashboardPage,
});

type TabKey = "overview" | "profile" | "posts" | "saved" | "library" | "liked";
const TABS: Array<{ key: TabKey; label: string; icon: typeof Coins }> = [
  { key: "overview", label: "Overview", icon: LayoutDashboard },
  { key: "profile", label: "Profile", icon: UserRound },
  { key: "posts", label: "My Echoes", icon: Images },
  { key: "saved", label: "Saved Echoes", icon: Bookmark },
  { key: "library", label: "Library", icon: LibraryIcon },
  { key: "liked", label: "Liked by you", icon: Heart },
];

function DashboardPage() {
  const { user } = useAuth();
  const [tab, setTab] = useState<TabKey>("overview");
  const userName = (user?.user_metadata?.full_name as string | undefined) ?? user?.email?.split("@")[0] ?? "Friend";

  return (
    <div className="pt-28 pb-24">
      <div className="mx-auto max-w-6xl px-5">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <p className="text-xs uppercase tracking-[0.28em] text-primary/90">Welcome back</p>
          <h1 className="mt-2 font-display text-4xl sm:text-5xl">{userName}.</h1>
          <p className="mt-2 text-muted-foreground">One place for your profile, your echoes, and your journey through VIRSA.</p>
        </motion.div>

        {/* Tabs */}
        <div className="mt-8 -mx-1 flex gap-1 overflow-x-auto rounded-full border border-white/5 bg-white/[0.03] p-1 backdrop-blur-md">
          {TABS.map((t) => {
            const Icon = t.icon;
            const active = tab === t.key;
            return (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm transition ${active ? "bg-white/10 text-foreground" : "text-foreground/70 hover:text-foreground"}`}
              >
                <Icon className="h-4 w-4" /> {t.label}
              </button>
            );
          })}
        </div>

        <div className="mt-8">
          {tab === "overview" && <OverviewTab userName={userName} />}
          {tab === "profile" && <ProfileTab />}
          {tab === "posts" && <PostsTab />}
          {tab === "saved" && <SavedTab />}
          {tab === "library" && <LibraryTab />}
          {tab === "liked" && <LikedByYouTab />}
        </div>
      </div>
    </div>
  );
}

/* ---------------- Overview ---------------- */

function OverviewTab({ userName: _ }: { userName: string }) {
  const { user } = useAuth();
  const fetchState = useServerFn(getMyState);
  const fetchProfile = useServerFn(getProfile);
  const fetchFeed = useServerFn(listFeed);
  const fetchSaved = useServerFn(listSaved);

  const { data: state, isLoading } = useQuery({ queryKey: ["my-state"], queryFn: () => fetchState() });
  const { data: prof } = useQuery({
    queryKey: ["echo-profile", user?.id],
    queryFn: () => fetchProfile({ data: { userId: user!.id } }),
    enabled: !!user,
  });
  const { data: myPosts } = useQuery({
    queryKey: ["echoes-feed", "author", user?.id],
    queryFn: () => fetchFeed({ data: { limit: 30, authorId: user!.id } }),
    enabled: !!user,
  });
  const { data: saved } = useQuery({ queryKey: ["echoes-saved"], queryFn: () => fetchSaved() });

  if (isLoading || !state) {
    return (
      <div className="animate-pulse">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => <div key={i} className="h-32 rounded-3xl bg-white/5" />)}
        </div>
      </div>
    );
  }

  const fullyDone = trails.filter((t) => {
    const stops = state.progress.filter((p) => p.trail_slug === t.slug).length;
    return stops > 0 && stops >= t.stops.length;
  }).length;

  const p = prof?.profile;
  const completion = profileCompletion(p);

  return (
    <div className="space-y-8">
      {/* Profile completion */}
      <section className="rounded-3xl glass p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-xl">Your profile</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {completion < 100 ? "A complete profile helps fellow keepers find your stories." : "Your profile is complete. Beautiful."}
            </p>
          </div>
          <div className="text-right">
            <div className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Completion</div>
            <div className="font-display text-3xl text-gradient-ember">{completion}%</div>
          </div>
        </div>
        <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-white/5">
          <div className="h-full gradient-ember transition-all" style={{ width: `${completion}%` }} />
        </div>
      </section>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Coins} label="Virsa Coins" value={state.balance.toString()} accent />
        <StatCard icon={Images} label="Your echoes" value={(myPosts?.length ?? 0).toString()} />
        <StatCard icon={Bookmark} label="Saved" value={(saved?.length ?? 0).toString()} />
        <StatCard icon={Award} label="Trails complete" value={fullyDone.toString()} />
      </div>

      {/* Quick actions */}
      <section className="rounded-3xl glass p-6">
        <h2 className="font-display text-xl">Quick actions</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <QuickAction to="/echoes" label="Share a new echo" icon={Sparkles} />
          <QuickAction to="/library" label="Wander the Library" icon={LibraryIcon} />
          <QuickAction to="/trails" label="Open a trail" icon={Map} />
          <QuickAction to="/khazane" label="Visit Khazane" icon={Gift} />
        </div>
      </section>

      {/* Trails snapshot */}
      <section className="rounded-3xl glass p-6">
        <div className="flex items-baseline justify-between">
          <h2 className="font-display text-2xl">Your trails</h2>
          <Link to="/trails" className="text-sm text-primary hover:underline">All trails →</Link>
        </div>
        <div className="mt-6 space-y-4">
          {trails.slice(0, 4).map((t) => {
            const done = state.progress.filter((p) => p.trail_slug === t.slug).length;
            const total = t.stops.length;
            const pct = Math.round((done / total) * 100);
            return (
              <Link
                key={t.slug}
                to="/trails/$slug"
                params={{ slug: t.slug }}
                className="block rounded-2xl ring-1 ring-white/5 bg-white/[0.02] p-4 transition hover:ring-primary/30"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span aria-hidden className="text-lg">{t.hero}</span>
                      <span className="truncate font-display text-lg">{t.title}</span>
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">{t.region} · {done}/{total} stops</div>
                  </div>
                  <div className="shrink-0 text-right text-sm font-medium">{pct}%</div>
                </div>
                <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-white/5">
                  <div className="h-full gradient-ember" style={{ width: `${pct}%` }} />
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function profileCompletion(p: any): number {
  if (!p) return 10;
  const fields = ["full_name", "username", "bio", "location", "avatar_url"];
  const arrays = ["interests", "heritage_origins", "languages"];
  let score = 0;
  fields.forEach((f) => { if (p[f]) score += 12; });
  arrays.forEach((f) => { if ((p[f]?.length ?? 0) > 0) score += 12; });
  if (p.banner_url) score += 4;
  return Math.min(100, Math.max(10, score));
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

function QuickAction({ to, label, icon: Icon }: { to: any; label: string; icon: typeof Coins }) {
  return (
    <Link to={to} className="group flex items-center gap-3 rounded-2xl bg-white/[0.03] px-4 py-3 ring-1 ring-white/5 transition hover:bg-white/[0.06] hover:ring-primary/30">
      <span className="grid h-9 w-9 place-items-center rounded-full gradient-ember text-primary-foreground"><Icon className="h-4 w-4" /></span>
      <span className="flex-1 text-sm">{label}</span>
      <ArrowUpRight className="h-4 w-4 text-muted-foreground transition group-hover:text-primary" />
    </Link>
  );
}

/* ---------------- Profile (rich editor) ---------------- */

function ProfileTab() {
  const { user } = useAuth();
  const fetchProfile = useServerFn(getProfile);
  const updateFn = useServerFn(updateProfile);
  const bannerRef = useRef<HTMLInputElement>(null);
  const avatarRef = useRef<HTMLInputElement>(null);
  const qc = useQueryClient();

  const { data } = useQuery({
    queryKey: ["echo-profile", user?.id],
    queryFn: () => fetchProfile({ data: { userId: user!.id } }),
    enabled: !!user,
  });

  const [full_name, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [website, setWebsite] = useState("");
  const [interests, setInterests] = useState("");
  const [origins, setOrigins] = useState("");
  const [languages, setLanguages] = useState("");
  const [bannerPath, setBannerPath] = useState<string | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [avatarPath, setAvatarPath] = useState<string | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const p = data?.profile;
    if (!p) return;
    setFullName(p.full_name ?? "");
    setUsername(p.username ?? "");
    setBio(p.bio ?? "");
    setLocation(p.location ?? "");
    setWebsite(p.website ?? "");
    setInterests((p.interests ?? []).join(", "));
    setOrigins((p.heritage_origins ?? []).join(", "));
    setLanguages((p.languages ?? []).join(", "));
    setBannerPath(p.banner_url ?? null);
    setBannerPreview(p.banner_signed_url ?? null);
    if (p.avatar_url && !p.avatar_url.startsWith("http")) setAvatarPath(p.avatar_url);
    setAvatarPreview(p.avatar_signed_url ?? p.avatar_url ?? null);
  }, [data]);

  const uploadImage = async (file: File, kind: "banner" | "avatar") => {
    if (!user) return;
    const ext = file.name.split(".").pop() || "jpg";
    const path = `${user.id}/${kind}-${crypto.randomUUID()}.${ext}`;
    const { error } = await supabase.storage.from("echoes-media").upload(path, file, { upsert: false, contentType: file.type });
    if (error) { toast.error(error.message); return; }
    const { data: signed } = await supabase.storage.from("echoes-media").createSignedUrl(path, 60 * 60);
    if (kind === "banner") { setBannerPath(path); setBannerPreview(signed?.signedUrl ?? null); }
    else { setAvatarPath(path); setAvatarPreview(signed?.signedUrl ?? null); }
  };

  const parseList = (s: string) => s.split(",").map((x) => x.trim()).filter(Boolean);

  const save = useMutation({
    mutationFn: async () => {
      setBusy(true);
      await updateFn({
        data: {
          full_name: full_name.trim() || undefined,
          username: username.trim().toLowerCase() || undefined,
          bio: bio.trim() || undefined,
          location: location.trim() || undefined,
          website: website.trim() || undefined,
          interests: parseList(interests),
          heritage_origins: parseList(origins),
          languages: parseList(languages),
          banner_url: bannerPath ?? undefined,
          avatar_url: avatarPath ?? undefined,
        },
      });
    },
    onSuccess: () => {
      setBusy(false);
      toast.success("Profile saved");
      qc.invalidateQueries({ queryKey: ["echo-profile", user?.id] });
    },
    onError: (e: any) => { setBusy(false); toast.error(e?.message ?? "Couldn't save profile"); },
  });

  return (
    <div className="rounded-3xl glass p-6 sm:p-8">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl">Profile</h2>
          <p className="mt-1 text-sm text-muted-foreground">This is how the community will see you.</p>
        </div>
        {user && (
          <Link to="/echoes/profile/$userId" params={{ userId: user.id }} className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline">
            View public profile <ArrowUpRight className="h-3 w-3" />
          </Link>
        )}
      </div>

      {/* Banner */}
      <div className="mt-6 overflow-hidden rounded-2xl border border-[var(--glass-border)] bg-background/40">
        <div className="relative h-40 bg-gradient-to-br from-primary/25 via-accent/15 to-background sm:h-52">
          {bannerPreview && <img src={bannerPreview} alt="" className="h-full w-full object-cover" />}
          <button onClick={() => bannerRef.current?.click()} className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1.5 text-xs text-white backdrop-blur">
            <Upload className="h-3.5 w-3.5" /> Change banner
          </button>
          <input ref={bannerRef} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && uploadImage(e.target.files[0], "banner")} />
        </div>
      </div>

      <div className="mt-4 flex items-center gap-4">
        <div className="grid h-20 w-20 place-items-center overflow-hidden rounded-full border-2 border-background bg-gradient-to-br from-primary/40 to-accent/30">
          {avatarPreview ? <img src={avatarPreview} alt="" className="h-full w-full object-cover" /> : <span className="font-display text-lg">{full_name.slice(0, 2).toUpperCase() || "ME"}</span>}
        </div>
        <button onClick={() => avatarRef.current?.click()} className="inline-flex items-center gap-1.5 rounded-full glass px-4 py-2 text-xs hover:bg-white/10">
          <Upload className="h-3.5 w-3.5" /> Change avatar
        </button>
        <input ref={avatarRef} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && uploadImage(e.target.files[0], "avatar")} />
      </div>

      <div className="mt-6 grid gap-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div><Label>Display name</Label><Input value={full_name} onChange={(e) => setFullName(e.target.value)} /></div>
          <div><Label>Username</Label><Input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="lowercase, letters, numbers, _ ." /></div>
        </div>
        <div><Label>Bio</Label><Textarea rows={3} value={bio} onChange={(e) => setBio(e.target.value)} maxLength={500} placeholder="A line about you, the memory you carry." /></div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div><Label>Location</Label><Input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g. Pune, Maharashtra" /></div>
          <div><Label>Website</Label><Input value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="https://" /></div>
        </div>
        <div><Label>Interests (comma separated)</Label><Input value={interests} onChange={(e) => setInterests(e.target.value)} placeholder="festivals, textiles, oral history" /></div>
        <div><Label>Heritage origins</Label><Input value={origins} onChange={(e) => setOrigins(e.target.value)} placeholder="Konkan, Punjabi, Tamil" /></div>
        <div><Label>Languages</Label><Input value={languages} onChange={(e) => setLanguages(e.target.value)} placeholder="Hindi, Marathi, English" /></div>
      </div>

      <div className="mt-8 flex justify-end">
        <Button onClick={() => save.mutate()} disabled={busy} className="gradient-ember text-primary-foreground"><Save className="mr-2 h-4 w-4" /> Save profile</Button>
      </div>
    </div>
  );
}

/* ---------------- My Echoes ---------------- */

function PostsTab() {
  const { user } = useAuth();
  const fetchFeed = useServerFn(listFeed);
  const deleteFn = useServerFn(deletePost);
  const qc = useQueryClient();
  const { data: posts, isLoading } = useQuery({
    queryKey: ["echoes-feed", "author", user?.id],
    queryFn: () => fetchFeed({ data: { limit: 50, authorId: user!.id } }),
    enabled: !!user,
  });

  const del = useMutation({
    mutationFn: (postId: string) => deleteFn({ data: { postId } }),
    onSuccess: () => {
      toast.success("Echo removed");
      qc.invalidateQueries({ queryKey: ["echoes-feed"] });
    },
    onError: () => toast.error("Couldn't delete"),
  });

  if (isLoading) return <div className="h-64 animate-pulse rounded-3xl bg-white/5" />;

  if (!posts || posts.length === 0) {
    return (
      <EmptyState
        icon={Images}
        title="Your first Echo starts here."
        body="Share the traditions that shaped you. Every memory preserved becomes part of our collective story."
        ctaLabel="Share an Echo"
        ctaTo="/echoes"
      />
    );
  }

  return (
    <div className="space-y-6">
      {posts.map((p: any) => (
        <div key={p.id} className="space-y-3">
          <PostCard post={p as EchoPost} currentUserId={user?.id ?? null} />
          <div className="flex justify-end gap-2 pr-1">
            <button
              onClick={() => { if (confirm("Delete this echo? This cannot be undone.")) del.mutate(p.id); }}
              className="inline-flex items-center gap-1.5 rounded-full bg-destructive/15 px-3 py-1.5 text-xs text-destructive hover:bg-destructive/25"
            >
              <Trash2 className="h-3.5 w-3.5" /> Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ---------------- Saved ---------------- */

function SavedTab() {
  const { user } = useAuth();
  const fetchSaved = useServerFn(listSaved);
  const { data, isLoading } = useQuery({ queryKey: ["echoes-saved"], queryFn: () => fetchSaved() });

  if (isLoading) return <div className="h-64 animate-pulse rounded-3xl bg-white/5" />;
  if (!data || data.length === 0) {
    return (
      <EmptyState
        icon={Bookmark}
        title="A private shelf, still bare."
        body="Tap the bookmark on any echo you'd like to return to. Only you can see what you save."
        ctaLabel="Discover echoes"
        ctaTo="/echoes"
      />
    );
  }
  return (
    <div className="space-y-6">
      {data.map((p: any) => (
        <PostCard key={p.id} post={p as EchoPost} currentUserId={user?.id ?? null} />
      ))}
    </div>
  );
}

/* ---------------- Library Contributions ---------------- */

function LibraryTab() {
  const { user } = useAuth();
  const fetchFeed = useServerFn(listFeed);
  const { data, isLoading } = useQuery({
    queryKey: ["echoes-feed", "author", user?.id, "library"],
    queryFn: () => fetchFeed({ data: { limit: 50, authorId: user!.id, libraryOnly: true } }),
    enabled: !!user,
  });

  if (isLoading) return <div className="h-64 animate-pulse rounded-3xl bg-white/5" />;
  if (!data || data.length === 0) {
    return (
      <EmptyState
        icon={LibraryIcon}
        title="Nothing in the Library yet."
        body="When you share an echo that feels worth keeping, tap 'Add to Library' and it will join the permanent archive."
        ctaLabel="Browse the Library"
        ctaTo="/library"
      />
    );
  }
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-accent/30 bg-accent/10 p-4 text-sm text-accent">
        <FileText className="mb-1 inline h-4 w-4" /> These echoes also live in the Library — the permanent archive of VIRSA.
      </div>
      {data.map((p: any) => (
        <PostCard key={p.id} post={p as EchoPost} currentUserId={user?.id ?? null} />
      ))}
    </div>
  );
}

/* ---------------- Empty state ---------------- */

function EmptyState({ icon: Icon, title, body, ctaLabel, ctaTo }: { icon: typeof Coins; title: string; body: string; ctaLabel: string; ctaTo: any }) {
  return (
    <div className="rounded-3xl border border-dashed border-white/15 bg-background/30 p-12 text-center">
      <div className="mx-auto grid h-12 w-12 place-items-center rounded-full gradient-ember text-primary-foreground">
        <Icon className="h-5 w-5" />
      </div>
      <p className="mt-4 font-display text-2xl">{title}</p>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">{body}</p>
      <Link to={ctaTo} className="mt-5 inline-flex items-center gap-1.5 rounded-full gradient-ember px-5 py-2.5 text-sm font-medium text-primary-foreground">
        <Pencil className="h-4 w-4" /> {ctaLabel}
      </Link>
    </div>
  );
}

/* ---------------- Liked by you ---------------- */

function LikedByYouTab() {
  const { useSaves, useToggleSave } = require("@/hooks/use-recommendations") as typeof import("@/hooks/use-recommendations");
  const { buildCatalog, indexCatalog } = require("@/lib/recommendation-catalog") as typeof import("@/lib/recommendation-catalog");

  const { data: saves, isLoading } = useSaves();
  const toggleSave = useToggleSave();
  const catalogMap = indexCatalog(buildCatalog());

  if (isLoading) return <div className="h-64 animate-pulse rounded-3xl bg-white/5" />;

  const items = (saves ?? [])
    .map((s) => ({ s, item: catalogMap.get(`${s.itemType}:${s.itemId}`) }))
    .filter((x) => !!x.item);

  const groups = {
    trail: items.filter((x) => x.s.itemType === "trail"),
    story: items.filter((x) => x.s.itemType === "story"),
    site: items.filter((x) => x.s.itemType === "site"),
  };

  if (items.length === 0) {
    return (
      <EmptyState
        icon={Heart}
        title="Nothing liked yet."
        body="Tap the heart on any story, trail or site and it will be saved here for you to come back to."
        ctaLabel="Discover for you"
        ctaTo="/"
      />
    );
  }

  return (
    <div className="space-y-10">
      <LikedSection title="Trails you love" icon={RouteIcon} items={groups.trail} onUnlike={(s) => toggleSave.mutate({ itemType: s.itemType, itemId: s.itemId })} />
      <LikedSection title="Stories you love" icon={BookOpen} items={groups.story} onUnlike={(s) => toggleSave.mutate({ itemType: s.itemType, itemId: s.itemId })} />
      <LikedSection title="Heritage sites you love" icon={MapPin} items={groups.site} onUnlike={(s) => toggleSave.mutate({ itemType: s.itemType, itemId: s.itemId })} />
      <div className="rounded-3xl border border-dashed border-white/15 bg-background/30 p-6 text-sm text-muted-foreground">
        <Heart className="mb-1 inline h-4 w-4 text-rose-400" /> Voices you've played in <span className="text-foreground">Kitab</span> are saved automatically inside the language player. Open <Link to="/kitab" className="text-primary hover:underline">Kitab</Link> to revisit them.
      </div>
    </div>
  );
}

function LikedSection({
  title, icon: Icon, items, onUnlike,
}: {
  title: string;
  icon: typeof Coins;
  items: Array<{ s: { itemType: "story" | "trail" | "site"; itemId: string }; item: any }>;
  onUnlike: (s: { itemType: "story" | "trail" | "site"; itemId: string }) => void;
}) {
  if (items.length === 0) return null;
  return (
    <section>
      <div className="mb-4 flex items-center gap-2">
        <Icon className="h-4 w-4 text-primary" />
        <h2 className="font-display text-xl">{title}</h2>
        <span className="text-xs text-muted-foreground">· {items.length}</span>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map(({ s, item }) => (
          <div
            key={`${s.itemType}:${s.itemId}`}
            className="group relative rounded-2xl glass p-5 ring-1 ring-white/5 transition hover:ring-primary/30"
          >
            <LikedLink item={item} type={s.itemType}>
              <p className="text-[10px] uppercase tracking-[0.22em] text-[color:var(--accent)]">
                {s.itemType === "story" ? "Story" : s.itemType === "trail" ? "Trail" : "Heritage Site"}
              </p>
              <h3 className="mt-1 font-display text-lg leading-tight">{item.title}</h3>
              {item.blurb && <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{item.blurb}</p>}
              {(item.region ?? item.category) && (
                <p className="mt-3 text-xs text-muted-foreground">{item.region ?? item.category}</p>
              )}
            </LikedLink>
            <button
              type="button"
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); onUnlike(s); }}
              aria-label="Remove from liked"
              title="Liked by you — click to remove"
              className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-[color:var(--accent)] px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] text-[color:var(--accent-foreground)] shadow-[0_6px_18px_-8px_var(--accent)] transition hover:opacity-90"
            >
              <Heart className="h-3 w-3 fill-current" /> Liked
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

function LikedLink({ item, type, children }: { item: any; type: "story" | "trail" | "site"; children: React.ReactNode }) {
  if (type === "trail") {
    return <Link to="/trails/$slug" params={{ slug: item.id }} className="block">{children}</Link>;
  }
  if (type === "site") {
    return <Link to="/atlas" search={{ site: item.id, view: "curated" } as any} className="block">{children}</Link>;
  }
  return <Link to="/library" search={{ story: item.id } as any} className="block">{children}</Link>;
}


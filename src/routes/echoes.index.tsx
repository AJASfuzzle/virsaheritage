import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useMemo, useState } from "react";
import { Sparkles, BookmarkCheck, UserRound, LayoutDashboard, Search, X, Library as LibraryIcon } from "lucide-react";
import { fallback, zodValidator } from "@tanstack/zod-adapter";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { matchesEcho } from "@/lib/echoes-search";
import { listFeed } from "@/lib/echoes.functions";
import { Composer } from "@/components/echoes/Composer";
import { PostCard, type EchoPost } from "@/components/echoes/PostCard";
import { useAuth } from "@/hooks/use-auth";
import { getSeedPosts } from "@/lib/seed-echoes";

export const Route = createFileRoute("/echoes/")({
  validateSearch: zodValidator(z.object({ q: fallback(z.string(), "").default("") })),
  head: () => ({
    meta: [
      { title: "Echoes - Heritage stories, lived and remembered | VIRSA" },
      { name: "description", content: "Echoes is a quiet social space to share photographs, stories, recipes, songs and traditions - a living archive of cultural memory." },
      { property: "og:title", content: "Echoes - A living archive of culture" },
      { property: "og:description", content: "Document, preserve and share heritage with others who care. Every echo can be added to the Library." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: EchoesIndex,
});

const FILTERS = ["All", "Festivals", "Food Heritage", "Crafts", "Music & Performance", "Dance", "Oral Histories", "Language", "Family Stories"];

function EchoesIndex() {
  const { user } = useAuth();
  const { q } = Route.useSearch();
  const navigate = Route.useNavigate();
  const searchQuery = q.slice(0, 500).trim();
  const [search, setSearch] = useState(q.slice(0, 500));
  useEffect(() => { setSearch(q.slice(0, 500)); }, [q]);
  useEffect(() => {
    if (search === q.slice(0, 500)) return;
    const timeout = setTimeout(() => {
      void navigate({ search: (prev) => ({ ...prev, q: search }), replace: true, resetScroll: false });
    }, 300);
    return () => clearTimeout(timeout);
  }, [search, q, navigate]);
  function selectSearch(value: string) {
    setSearch(value);
    void navigate({ search: (prev) => ({ ...prev, q: value }), resetScroll: false });
  }
  const [filter, setFilter] = useState<string>("All");
  const fetchFeed = useServerFn(listFeed);
  const { data: realData, isLoading } = useQuery({
    queryKey: ["echoes-feed", filter, searchQuery],
    queryFn: () => fetchFeed({ data: { limit: 24, category: filter === "All" ? undefined : filter, search: searchQuery } }),
    enabled: !!user,
  });

  const seeds = useMemo(() => {
    const all = getSeedPosts();
    return all.filter((p) => matchesEcho(p, searchQuery, filter));
  }, [filter, searchQuery]);

  // Merge: real posts first (when present), then seed posts. Sort by created_at desc.
  const feed = useMemo(() => {
    const real = (realData ?? []) as EchoPost[];
    const merged = [...real, ...seeds];
    return merged.sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at));
  }, [realData, seeds]);

  return (
    <div className="pt-24 sm:pt-28">
      {/* hero */}
      <section className="mx-auto max-w-3xl px-5 pb-8">
        <p className="text-[10px] uppercase tracking-[0.32em] text-primary/85">Echoes</p>
        <h1 className="mt-2 font-display text-4xl leading-[1.05] sm:text-6xl">
          Memory, <span className="italic text-gradient-ember">passed forward.</span>
        </h1>
        <p className="mt-4 max-w-xl text-pretty text-base text-muted-foreground sm:text-lg">
          A slower place. Share a photograph, a recipe, a song, a story - and let it become part of a living archive.
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          {user ? (
            <>
              <Link to="/dashboard" className="inline-flex items-center gap-1.5 rounded-full glass px-4 py-2 text-xs hover:bg-white/10">
                <LayoutDashboard className="h-3.5 w-3.5" /> Your dashboard
              </Link>
              <Link to="/echoes/profile/$userId" params={{ userId: user.id }} className="inline-flex items-center gap-1.5 rounded-full glass px-4 py-2 text-xs hover:bg-white/10">
                <UserRound className="h-3.5 w-3.5" /> Your profile
              </Link>
              <Link to="/echoes/saved" className="inline-flex items-center gap-1.5 rounded-full glass px-4 py-2 text-xs hover:bg-white/10">
                <BookmarkCheck className="h-3.5 w-3.5" /> Saved
              </Link>
            </>
          ) : (
            <>
              <Link to="/auth" search={{ mode: "signin" }} className="inline-flex items-center rounded-full gradient-ember px-4 py-2 text-xs font-medium text-primary-foreground">
                Sign in to contribute
              </Link>
              <Link to="/library" className="inline-flex items-center gap-1.5 rounded-full glass px-4 py-2 text-xs hover:bg-white/10">
                <LibraryIcon className="h-3.5 w-3.5" /> Visit the Library
              </Link>
            </>
          )}
        </div>
      </section>

      {/* composer */}
      {user && (
        <section className="mx-auto max-w-2xl px-5 pb-10">
          <Composer />
        </section>
      )}

      {/* filters */}
      <section className="mx-auto max-w-2xl px-5 pb-4">
        <div className="relative mb-4">
          <Search aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            aria-label="Search echoes or authors"
            placeholder="Search echoes or authors — e.g. Aarav Anand"
            value={search}
            maxLength={500}
            onChange={(event) => setSearch(event.target.value)}
            className="h-12 border-input bg-card pl-10 pr-12 text-foreground"
          />
          {search && (
            <Button variant="ghost" size="icon" aria-label="Clear search" title="Clear search"
              onClick={() => selectSearch("")}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 text-muted-foreground">
              <X />
            </Button>
          )}
        </div>
        <div className="-mx-1 flex gap-1 overflow-x-auto pb-1">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`shrink-0 rounded-full px-4 py-1.5 text-xs whitespace-nowrap transition ${filter === f ? "bg-primary/15 text-primary" : "text-muted-foreground hover:bg-white/5"}`}
            >
              {f}
            </button>
          ))}
        </div>
      </section>

      {/* feed */}
      <section className="mx-auto max-w-2xl space-y-6 px-5 pb-32">
        {isLoading && user && (
          <div className="space-y-6">
            {[0, 1].map((i) => (
              <div key={i} className="h-[520px] animate-pulse rounded-3xl bg-white/5" />
            ))}
          </div>
        )}
        {feed.length === 0 && !isLoading && (
          <div className="rounded-3xl border border-dashed border-white/15 bg-background/30 p-10 text-center text-sm text-muted-foreground">
            <Sparkles className="mx-auto h-5 w-5 text-primary" />
            {searchQuery ? (
              <p className="mt-3" role="status">No echoes match "{searchQuery}". Try a different name or word.</p>
            ) : (<>
              <p className="mt-3 font-display text-lg text-foreground">Nothing in this corner yet</p>
              <p className="mt-1">Try a different filter, or share the first echo here.</p>
            </>)}
          </div>
        )}
        {feed.map((p) => (
          <PostCard key={p.id} post={p} currentUserId={user?.id ?? null} onAuthorSearch={selectSearch} />
        ))}

        {!user && feed.length > 0 && (
          <div className="rounded-3xl border border-[var(--glass-border)] bg-[var(--card)] p-8 text-center">
            <p className="font-display text-xl">Your first echo starts here.</p>
            <p className="mt-2 text-sm text-muted-foreground">Sign in to share the traditions that shaped you, and to keep echoes you love.</p>
            <Link to="/auth" search={{ mode: "signin" }} className="mt-4 inline-flex rounded-full gradient-ember px-5 py-2.5 text-sm font-medium text-primary-foreground">
              Sign in to contribute
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}

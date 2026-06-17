import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { Sparkles, BookmarkCheck, UserRound } from "lucide-react";
import { listFeed } from "@/lib/echoes.functions";
import { Composer } from "@/components/echoes/Composer";
import { PostCard, type EchoPost } from "@/components/echoes/PostCard";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/echoes")({
  head: () => ({
    meta: [
      { title: "Echoes — Heritage stories, lived and remembered | VIRSA" },
      { name: "description", content: "Echoes is a quiet social space to share photographs, stories, recipes, songs and traditions — a living archive of cultural memory." },
      { property: "og:title", content: "Echoes — A living archive of culture" },
      { property: "og:description", content: "Document, preserve and share heritage with others who care. Every echo can be added to the Library." },
    ],
  }),
  component: EchoesIndex,
});

const FILTERS = ["All", "Festivals", "Cuisine", "Crafts", "Music", "Dance", "Architecture", "Oral histories", "Recipes", "Family stories"];

function EchoesIndex() {
  const { user } = useAuth();
  const [filter, setFilter] = useState<string>("All");
  const fetchFeed = useServerFn(listFeed);
  const { data, isLoading } = useQuery({
    queryKey: ["echoes-feed", filter],
    queryFn: () => fetchFeed({ data: { limit: 24, category: filter === "All" ? undefined : filter } }),
    enabled: !!user,
  });

  return (
    <div className="pt-24 sm:pt-28">
      {/* hero */}
      <section className="mx-auto max-w-3xl px-5 pb-8">
        <p className="text-[10px] uppercase tracking-[0.32em] text-primary/85">Echoes</p>
        <h1 className="mt-2 font-display text-4xl leading-[1.05] sm:text-6xl">
          Memory, <span className="italic text-gradient-ember">passed forward.</span>
        </h1>
        <p className="mt-4 max-w-xl text-pretty text-base text-muted-foreground sm:text-lg">
          A slower place. Share a photograph, a recipe, a song, a story — and let it become part of a living archive.
        </p>
        {user && (
          <div className="mt-5 flex flex-wrap gap-2">
            <Link to="/echoes/profile/$userId" params={{ userId: user.id }} className="inline-flex items-center gap-1.5 rounded-full glass px-4 py-2 text-xs hover:bg-white/10">
              <UserRound className="h-3.5 w-3.5" /> Your profile
            </Link>
            <Link to="/echoes/saved" className="inline-flex items-center gap-1.5 rounded-full glass px-4 py-2 text-xs hover:bg-white/10">
              <BookmarkCheck className="h-3.5 w-3.5" /> Saved
            </Link>
          </div>
        )}
      </section>

      {/* composer */}
      <section className="mx-auto max-w-2xl px-5 pb-10">
        <Composer />
      </section>

      {/* filters */}
      <section className="mx-auto max-w-2xl px-5 pb-4">
        <div className="-mx-1 flex gap-1 overflow-x-auto pb-1">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`shrink-0 rounded-full px-4 py-1.5 text-xs transition ${filter === f ? "bg-primary/15 text-primary" : "text-muted-foreground hover:bg-white/5"}`}
            >
              {f}
            </button>
          ))}
        </div>
      </section>

      {/* feed */}
      <section className="mx-auto max-w-2xl space-y-6 px-5 pb-32">
        {!user && (
          <div className="rounded-3xl border border-[var(--glass-border)] bg-[var(--card)] p-10 text-center">
            <Sparkles className="mx-auto h-6 w-6 text-primary" />
            <p className="mt-3 font-display text-xl">Sign in to see the feed</p>
            <p className="mt-1 text-sm text-muted-foreground">Echoes is a community of keepers.</p>
            <a href="/auth?mode=signin" className="mt-4 inline-flex rounded-full gradient-ember px-5 py-2.5 text-sm font-medium text-primary-foreground">Sign in</a>
          </div>
        )}
        {isLoading && user && (
          <div className="space-y-6">
            {[0, 1].map((i) => (
              <div key={i} className="h-[520px] animate-pulse rounded-3xl bg-white/5" />
            ))}
          </div>
        )}
        {data && data.length === 0 && (
          <div className="rounded-3xl border border-dashed border-white/15 bg-background/30 p-10 text-center text-sm text-muted-foreground">
            No echoes yet. Be the first to share one.
          </div>
        )}
        {data?.map((p) => (
          <PostCard key={p.id} post={p as unknown as EchoPost} currentUserId={user?.id ?? null} />
        ))}
      </section>
    </div>
  );
}

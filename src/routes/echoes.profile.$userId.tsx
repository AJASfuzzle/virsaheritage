import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { MapPin, Globe, Pencil } from "lucide-react";
import { getProfile, listFeed } from "@/lib/echoes.functions";
import { getSeedCreatorById, getSeedPostsByCreator, isSeedId } from "@/lib/seed-echoes";
import { PostCard, type EchoPost } from "@/components/echoes/PostCard";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/echoes/profile/$userId")({
  component: ProfilePage,
});

function initials(name?: string | null) {
  const base = (name ?? "E").trim();
  const parts = base.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return base.slice(0, 2).toUpperCase();
}

function ProfilePage() {
  const { userId } = Route.useParams();
  const { user } = useAuth();
  const fetchProfile = useServerFn(getProfile);
  const fetchFeed = useServerFn(listFeed);

  const seedCreator = isSeedId(userId) ? getSeedCreatorById(userId) : null;
  const seedPosts = isSeedId(userId) ? getSeedPostsByCreator(userId) : [];

  const { data: prof } = useQuery({
    queryKey: ["echo-profile", userId],
    queryFn: () => fetchProfile({ data: { userId } }),
    enabled: !!user && !seedCreator,
  });
  const { data: realPosts } = useQuery({
    queryKey: ["echoes-feed", "author", userId],
    queryFn: () => fetchFeed({ data: { limit: 30, authorId: userId } }),
    enabled: !!user && !seedCreator,
  });

  const p: any = seedCreator
    ? {
        full_name: seedCreator.full_name,
        username: seedCreator.username,
        avatar_signed_url: seedCreator.avatar_url,
        banner_signed_url: null,
        bio: seedCreator.bio,
        location: seedCreator.location,
        interests: seedCreator.interests,
        heritage_origins: seedCreator.heritage_origins,
        languages: seedCreator.languages,
        website: null,
      }
    : prof?.profile;
  const posts = seedCreator ? seedPosts : realPosts;
  const stats = seedCreator
    ? { postsCount: seedPosts.length, followers: Math.floor(seedPosts.length * 47 + 312), following: 184 }
    : { postsCount: prof?.postsCount ?? 0, followers: prof?.followers ?? 0, following: prof?.following ?? 0 };
  const isMe = !seedCreator && user?.id === userId;

  return (
    <div className="pt-20 sm:pt-24">
      {/* banner */}
      <div className="relative h-48 w-full overflow-hidden bg-gradient-to-br from-primary/25 via-accent/15 to-background sm:h-64">
        {p?.banner_signed_url && <img src={p.banner_signed_url} alt="" className="h-full w-full object-cover" />}
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
      </div>

      {/* header */}
      <div className="relative z-10 mx-auto -mt-12 max-w-3xl px-5">
        <div className="flex items-end justify-between gap-4">
          <div className="grid h-24 w-24 place-items-center overflow-hidden rounded-full border-4 border-background bg-gradient-to-br from-primary/40 to-accent/30 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.6)] sm:h-28 sm:w-28">
            {p?.avatar_signed_url ? (
              <img src={p.avatar_signed_url} alt="" className="h-full w-full object-cover" />
            ) : (
              <span className="font-display text-2xl">{initials(p?.full_name)}</span>
            )}
          </div>
          {isMe && (
            <Link to="/dashboard" className="inline-flex items-center gap-1.5 rounded-full glass px-4 py-2 text-xs hover:bg-white/10">
              <Pencil className="h-3.5 w-3.5" /> Edit profile
            </Link>
          )}
        </div>

        <div className="mt-4">
          <h1 className="font-display text-3xl leading-tight sm:text-4xl">{p?.full_name ?? "Keeper"}</h1>
          {p?.username && <p className="text-sm text-muted-foreground">@{p.username}</p>}
          {p?.bio && <p className="mt-3 max-w-xl text-pretty text-sm text-foreground/85">{p.bio}</p>}

          <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
            {p?.location && <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" /> {p.location}</span>}
            {p?.website && <a href={p.website} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 hover:text-foreground"><Globe className="h-3 w-3" /> {p.website.replace(/^https?:\/\//, "")}</a>}
          </div>

          {(p?.interests?.length ?? 0) > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {p!.interests!.map((t: string) => (
                <span key={t} className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] text-primary">{t}</span>
              ))}
            </div>
          )}

          {(p?.heritage_origins?.length ?? 0) > 0 && (
            <p className="mt-3 text-xs text-muted-foreground">
              Heritage: <span className="text-foreground/80">{p!.heritage_origins!.join(" · ")}</span>
            </p>
          )}
          {(p?.languages?.length ?? 0) > 0 && (
            <p className="mt-1 text-xs text-muted-foreground">
              Speaks: <span className="text-foreground/80">{p!.languages!.join(" · ")}</span>
            </p>
          )}

          <div className="mt-5 flex gap-6 border-y border-[var(--glass-border)] py-3 text-sm">
            <span><strong className="font-display text-lg">{stats.postsCount}</strong> <span className="text-muted-foreground">Echoes</span></span>
            <span><strong className="font-display text-lg">{stats.followers}</strong> <span className="text-muted-foreground">Followers</span></span>
            <span><strong className="font-display text-lg">{stats.following}</strong> <span className="text-muted-foreground">Following</span></span>
          </div>
        </div>

        {/* posts */}
        <section className="mt-8 space-y-6 pb-32">
          {posts?.length === 0 && (
            <div className="rounded-3xl border border-dashed border-white/15 p-10 text-center text-sm text-muted-foreground">No echoes yet.</div>
          )}
          {posts?.map((p) => (
            <PostCard key={p.id} post={p as unknown as EchoPost} currentUserId={user?.id ?? null} />
          ))}
        </section>
      </div>
    </div>
  );
}

import { useState } from "react";
import { Link, useRouter } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Heart, MessageCircle, Bookmark, MapPin, Library as LibraryIcon, Check } from "lucide-react";
import { motion } from "framer-motion";
import { toggleLike, toggleSave, submitToLibrary } from "@/lib/echoes.functions";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export type EchoPost = {
  id: string;
  author_id: string;
  title: string | null;
  caption: string | null;
  story: string | null;
  media_signed: Array<{ url: string; type: string; path: string }>;
  media_type: string;
  category: string | null;
  state: string | null;
  location: string | null;
  tags: string[];
  likes_count: number;
  comments_count: number;
  saves_count: number;
  submitted_to_library: boolean;
  created_at: string;
  liked_by_me: boolean;
  saved_by_me: boolean;
  author: { id: string; full_name: string | null; avatar_url: string | null; username: string | null } | null;
};

function timeAgo(iso: string) {
  const d = new Date(iso).getTime();
  const s = Math.max(1, Math.floor((Date.now() - d) / 1000));
  if (s < 60) return `${s}s`;
  if (s < 3600) return `${Math.floor(s / 60)}m`;
  if (s < 86400) return `${Math.floor(s / 3600)}h`;
  if (s < 604800) return `${Math.floor(s / 86400)}d`;
  return new Date(iso).toLocaleDateString();
}

function initials(name?: string | null) {
  const base = (name ?? "E").trim();
  const parts = base.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return base.slice(0, 2).toUpperCase();
}

export function PostCard({ post, currentUserId }: { post: EchoPost; currentUserId?: string | null }) {
  const router = useRouter();
  const qc = useQueryClient();
  const likeFn = useServerFn(toggleLike);
  const saveFn = useServerFn(toggleSave);
  const libFn = useServerFn(submitToLibrary);
  const [liked, setLiked] = useState(post.liked_by_me);
  const [likeCount, setLikeCount] = useState(post.likes_count);
  const [saved, setSaved] = useState(post.saved_by_me);
  const [inLibrary, setInLibrary] = useState(post.submitted_to_library);

  const like = useMutation({
    mutationFn: () => likeFn({ data: { postId: post.id } }),
    onMutate: () => {
      setLiked((v) => !v);
      setLikeCount((c) => (liked ? c - 1 : c + 1));
    },
    onError: () => {
      setLiked(post.liked_by_me);
      setLikeCount(post.likes_count);
      toast.error("Couldn't update like");
    },
  });

  const save = useMutation({
    mutationFn: () => saveFn({ data: { postId: post.id } }),
    onMutate: () => setSaved((v) => !v),
    onError: () => {
      setSaved(post.saved_by_me);
      toast.error("Couldn't update save");
    },
    onSuccess: (res: any) => {
      if (res?.saved) toast.success("Saved to your collection");
    },
  });

  const submitLib = useMutation({
    mutationFn: () => libFn({ data: { postId: post.id } }),
    onSuccess: () => {
      setInLibrary(true);
      toast.success("Added to the Library", { description: "Your echo now lives in the permanent archive." });
      qc.invalidateQueries({ queryKey: ["library-echoes"] });
    },
    onError: () => toast.error("Couldn't add to Library"),
  });

  const isAuthor = currentUserId === post.author_id;
  const m = post.media_signed?.[0];
  const authorName = post.author?.full_name ?? "Anonymous keeper";
  const authorHref = `/echoes/profile/${post.author_id}`;

  return (
    <motion.article
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="overflow-hidden rounded-3xl border border-[var(--glass-border)] bg-[var(--card)] shadow-[var(--shadow-soft)]"
    >
      {/* header */}
      <header className="flex items-center gap-3 px-5 pt-5">
        <Link to={authorHref} className="grid h-10 w-10 place-items-center overflow-hidden rounded-full bg-gradient-to-br from-primary/30 to-accent/20 ring-1 ring-white/10">
          {post.author?.avatar_url ? (
            <img src={post.author.avatar_url} alt="" className="h-full w-full object-cover" />
          ) : (
            <span className="text-[11px] font-display tracking-wider">{initials(authorName)}</span>
          )}
        </Link>
        <div className="min-w-0 flex-1">
          <Link to={authorHref} className="block text-sm font-medium leading-tight hover:underline">{authorName}</Link>
          <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <span>{timeAgo(post.created_at)}</span>
            {post.location && <><span>·</span><MapPin className="h-3 w-3" /><span className="truncate">{post.location}</span></>}
            {post.category && <><span>·</span><span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] uppercase tracking-[0.2em] text-primary">{post.category}</span></>}
          </div>
        </div>
        {inLibrary && (
          <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-accent/15 px-2.5 py-1 text-[10px] uppercase tracking-[0.2em] text-accent">
            <LibraryIcon className="h-3 w-3" /> In Library
          </span>
        )}
      </header>

      {/* media or text */}
      {m?.url ? (
        <div className="mt-4 aspect-[4/5] w-full overflow-hidden bg-black/40">
          {m.type === "video" ? (
            <video src={m.url} controls className="h-full w-full object-cover" />
          ) : (
            <img src={m.url} alt={post.title ?? "Echo"} loading="lazy" className="h-full w-full object-cover" />
          )}
        </div>
      ) : post.story ? (
        <div className="mx-5 mt-5 rounded-2xl border border-[var(--glass-border)] bg-background/40 p-6">
          <p className="font-display text-2xl leading-tight">{post.title ?? "An echo"}</p>
          <p className="mt-3 line-clamp-6 text-pretty text-sm text-foreground/85">{post.story}</p>
        </div>
      ) : null}

      {/* actions */}
      <div className="flex items-center gap-1 px-3 pt-3">
        <button
          onClick={() => currentUserId ? like.mutate() : router.navigate({ to: "/auth", search: { mode: "signin" } })}
          aria-label="Like"
          className={cn("inline-flex h-10 items-center gap-1.5 rounded-full px-3 text-sm transition hover:bg-white/5", liked && "text-rose-400")}
        >
          <Heart className={cn("h-5 w-5", liked && "fill-rose-400")} />
          <span className="tabular-nums">{likeCount}</span>
        </button>
        <Link
          to="/echoes/$postId"
          params={{ postId: post.id }}
          className="inline-flex h-10 items-center gap-1.5 rounded-full px-3 text-sm hover:bg-white/5"
        >
          <MessageCircle className="h-5 w-5" />
          <span className="tabular-nums">{post.comments_count}</span>
        </Link>
        <button
          onClick={() => currentUserId ? save.mutate() : router.navigate({ to: "/auth", search: { mode: "signin" } })}
          aria-label="Save"
          className={cn("ml-auto inline-flex h-10 items-center gap-1.5 rounded-full px-3 text-sm transition hover:bg-white/5", saved && "text-primary")}
        >
          <Bookmark className={cn("h-5 w-5", saved && "fill-current")} />
        </button>
        {isAuthor && !inLibrary && (
          <button
            onClick={() => submitLib.mutate()}
            disabled={submitLib.isPending}
            className="inline-flex h-10 items-center gap-1.5 rounded-full bg-accent/15 px-3 text-xs uppercase tracking-[0.18em] text-accent transition hover:bg-accent/25 disabled:opacity-60"
          >
            <LibraryIcon className="h-4 w-4" /> Add to Library
          </button>
        )}
        {isAuthor && inLibrary && (
          <span className="inline-flex h-10 items-center gap-1.5 rounded-full bg-accent/10 px-3 text-xs uppercase tracking-[0.18em] text-accent/80">
            <Check className="h-4 w-4" /> In Library
          </span>
        )}
      </div>

      {/* caption */}
      {(post.title || post.caption) && (
        <div className="px-5 pb-5 pt-2">
          {post.title && <h3 className="font-display text-lg leading-tight">{post.title}</h3>}
          {post.caption && (
            <p className="mt-1 text-pretty text-sm text-foreground/85">
              <Link to={authorHref} className="mr-1.5 font-medium text-foreground hover:underline">{authorName}</Link>
              {post.caption}
            </p>
          )}
          {post.tags?.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {post.tags.map((t) => (
                <span key={t} className="text-xs text-primary/85">#{t}</span>
              ))}
            </div>
          )}
        </div>
      )}
    </motion.article>
  );
}

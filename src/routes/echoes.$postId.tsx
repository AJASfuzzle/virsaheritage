import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { ArrowLeft, Send } from "lucide-react";
import { getPost, listComments, addComment } from "@/lib/echoes.functions";
import { getSeedPostById, isSeedId } from "@/lib/seed-echoes";
import { PostCard, type EchoPost } from "@/components/echoes/PostCard";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export const Route = createFileRoute("/echoes/$postId")({
  head: ({ params }) => ({
    meta: [
      { title: `Echo · ${params.postId.slice(0, 6)} | VIRSA` },
    ],
  }),
  component: PostPage,
});

function timeAgo(iso: string) {
  const s = Math.max(1, Math.floor((Date.now() - new Date(iso).getTime()) / 1000));
  if (s < 60) return `${s}s`;
  if (s < 3600) return `${Math.floor(s / 60)}m`;
  if (s < 86400) return `${Math.floor(s / 3600)}h`;
  return `${Math.floor(s / 86400)}d`;
}

function initials(name?: string | null) {
  const base = (name ?? "E").trim();
  const parts = base.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return base.slice(0, 2).toUpperCase();
}

function PostPage() {
  const { postId } = Route.useParams();
  const { user } = useAuth();
  const router = useRouter();
  const qc = useQueryClient();
  const fetchPost = useServerFn(getPost);
  const fetchComments = useServerFn(listComments);
  const addCommentFn = useServerFn(addComment);

  const seed = isSeedId(postId) ? getSeedPostById(postId) : null;
  const { data: postData, isLoading } = useQuery({
    queryKey: ["echo-post", postId],
    queryFn: () => fetchPost({ data: { postId } }),
    enabled: !!user && !seed,
  });
  const post = (seed as any) ?? postData;
  const { data: comments } = useQuery({
    queryKey: ["echo-comments", postId],
    queryFn: () => fetchComments({ data: { postId } }),
    enabled: !!user && !seed,
  });

  const [content, setContent] = useState("");
  const submit = useMutation({
    mutationFn: () => addCommentFn({ data: { postId, content: content.trim() } }),
    onSuccess: () => {
      setContent("");
      qc.invalidateQueries({ queryKey: ["echo-comments", postId] });
      qc.invalidateQueries({ queryKey: ["echo-post", postId] });
    },
    onError: () => toast.error("Couldn't post comment"),
  });

  return (
    <div className="pt-24 sm:pt-28">
      <div className="mx-auto max-w-2xl px-5">
        <button onClick={() => router.history.back()} className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back
        </button>

        {isLoading && <div className="h-[520px] animate-pulse rounded-3xl bg-white/5" />}
        {!isLoading && !post && (
          <div className="rounded-3xl border border-dashed border-white/15 p-10 text-center text-muted-foreground">Echo not found.</div>
        )}
        {post && <PostCard post={post as unknown as EchoPost} currentUserId={user?.id ?? null} />}

        {/* comments */}
        {post && !seed && (
          <section className="mt-6 rounded-3xl border border-[var(--glass-border)] bg-[var(--card)] p-5 shadow-[var(--shadow-soft)]">
            <h2 className="font-display text-lg">Comments</h2>
            {user ? (
              <div className="mt-3 flex gap-2">
                <Textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={2}
                  placeholder="Add a thoughtful note…"
                  maxLength={1000}
                />
                <Button onClick={() => content.trim() && submit.mutate()} disabled={!content.trim() || submit.isPending} className="self-end gradient-ember text-primary-foreground">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <p className="mt-3 text-sm text-muted-foreground">Sign in to comment.</p>
            )}
            <div className="mt-5 space-y-4">
              {comments?.length === 0 && <p className="text-sm text-muted-foreground">Be the first to reflect on this.</p>}
              {comments?.map((c: any) => (
                <div key={c.id} className="flex gap-3">
                  <Link to="/echoes/profile/$userId" params={{ userId: c.author_id }} className="grid h-9 w-9 shrink-0 place-items-center overflow-hidden rounded-full bg-gradient-to-br from-primary/30 to-accent/20">
                    {c.author?.avatar_url ? <img src={c.author.avatar_url} alt="" className="h-full w-full object-cover" /> : <span className="text-[10px]">{initials(c.author?.full_name)}</span>}
                  </Link>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 text-xs">
                      <Link to="/echoes/profile/$userId" params={{ userId: c.author_id }} className="font-medium hover:underline">{c.author?.full_name ?? "Keeper"}</Link>
                      <span className="text-muted-foreground">{timeAgo(c.created_at)}</span>
                    </div>
                    <p className="mt-1 whitespace-pre-wrap text-sm text-foreground/90">{c.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

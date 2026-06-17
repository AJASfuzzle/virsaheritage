import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { listSaved } from "@/lib/echoes.functions";
import { PostCard, type EchoPost } from "@/components/echoes/PostCard";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/_authenticated/echoes/saved")({
  component: SavedPage,
});

function SavedPage() {
  const { user } = useAuth();
  const fetchSaved = useServerFn(listSaved);
  const { data, isLoading } = useQuery({
    queryKey: ["echoes-saved"],
    queryFn: () => fetchSaved(),
  });

  return (
    <div className="pt-24 sm:pt-28">
      <div className="mx-auto max-w-2xl px-5 pb-32">
        <p className="text-[10px] uppercase tracking-[0.32em] text-primary/85">Saved</p>
        <h1 className="mt-2 font-display text-4xl">A private shelf of echoes</h1>
        <p className="mt-2 text-sm text-muted-foreground">Only you can see what you've saved.</p>
        <div className="mt-8 space-y-6">
          {isLoading && <div className="h-80 animate-pulse rounded-3xl bg-white/5" />}
          {data?.length === 0 && <div className="rounded-3xl border border-dashed border-white/15 p-10 text-center text-sm text-muted-foreground">Nothing saved yet.</div>}
          {data?.map((p) => (
            <PostCard key={p.id} post={p as unknown as EchoPost} currentUserId={user?.id ?? null} />
          ))}
        </div>
      </div>
    </div>
  );
}

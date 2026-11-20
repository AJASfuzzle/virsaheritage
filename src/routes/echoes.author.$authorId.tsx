import { createFileRoute, Link } from "@tanstack/react-router";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { getEchoAuthor, listPublishedEchoes } from "@/lib/echoes.functions";
import { PostCard, type EchoPost } from "@/components/echoes/PostCard";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { echoesHead } from "@/lib/echoes-head";

export const Route = createFileRoute("/echoes/author/$authorId")({
  head: () => echoesHead("Author echoes", "Explore published cultural memories by a VIRSA author."), component: AuthorEchoes,
});
function AuthorEchoes() {
  const { authorId } = Route.useParams();
  const { user } = useAuth();
  const authorFn = useServerFn(getEchoAuthor);
  const feedFn = useServerFn(listPublishedEchoes);
  const { data: author } = useQuery({ queryKey: ["echo-author", authorId], queryFn: () => authorFn({ data: { authorId } }) });
  const { data, hasNextPage, fetchNextPage } = useInfiniteQuery({ queryKey: ["echoes-feed", "author", authorId], initialPageParam: 0,
    queryFn: ({ pageParam }) => feedFn({ data: { authorId, offset: pageParam } }),
    getNextPageParam: (last, pages) => { const n = pages.reduce((sum, p) => sum + p.posts.length, 0); return n < last.total ? n : undefined; } });
  return <div className="mx-auto max-w-2xl space-y-6 px-5 pb-24 pt-28">
    <Link to="/echoes" className="text-sm text-primary">← Back to Echoes</Link>
    <h1 className="font-display text-4xl">{author?.full_name ?? "Author"}</h1>
    {data?.pages.flatMap((p) => p.posts).map((post) => <PostCard key={post.id} post={post as EchoPost} currentUserId={user?.id} browse />)}
    {hasNextPage && <Button variant="outline" onClick={() => fetchNextPage()}>Load more echoes</Button>}
  </div>;
}
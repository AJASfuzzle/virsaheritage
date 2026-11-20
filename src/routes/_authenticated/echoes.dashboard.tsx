import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { listMyEchoes } from "@/lib/echoes.functions";
import { echoesHead } from "@/lib/echoes-head";
import { useAuth } from "@/hooks/use-auth";
export const Route = createFileRoute("/_authenticated/echoes/dashboard")({ head: () => echoesHead("Echoes dashboard", "Your echoes, reactions and recent activity."), component: EchoDashboard });
function EchoDashboard() {
  const { user } = useAuth(); const fn = useServerFn(listMyEchoes);
  const { data: posts = [] } = useQuery({ queryKey: ["my-echoes", user?.id], queryFn: () => fn() });
  const published = posts.filter((p) => p.status === "published");
  const popular = [...published].sort((a, b) => b.likes_count - a.likes_count)[0];
  return <div className="mx-auto max-w-3xl space-y-8 px-5 pb-24 pt-28"><Link to="/echoes" className="text-primary">← Back to Echoes</Link><h1 className="font-display text-4xl">Echoes dashboard</h1>
    <dl className="grid grid-cols-3 gap-4 border-y border-border py-6">{[["Total echoes", posts.length], ["Published", published.length], ["Drafts", posts.length - published.length]].map(([label, value]) => <div key={label}><dt className="text-sm text-muted-foreground">{label}</dt><dd className="mt-2 font-display text-3xl">{value}</dd></div>)}</dl>
    {popular && <section><h2 className="font-display text-2xl">Most popular echo</h2><Link to="/echoes/$postId" params={{ postId: popular.id }} className="mt-3 block text-primary">{popular.title ?? "Untitled echo"}</Link><p className="text-sm text-muted-foreground">{popular.likes_count} likes</p></section>}
    <section><h2 className="font-display text-2xl">Recent activity</h2>{posts.map((post) => <div key={post.id} className="border-b border-border py-4"><Link to="/echoes/edit/$postId" params={{ postId: post.id }} className="font-medium">{post.title ?? "Untitled echo"}</Link><p className="mt-1 text-sm text-muted-foreground">{post.status} · {post.likes_count} likes · {post.comments_count} comments · {new Date(post.updated_at).toLocaleDateString()}</p></div>)}</section>
  </div>;
}
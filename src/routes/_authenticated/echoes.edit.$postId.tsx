import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { getPost, editEcho } from "@/lib/echoes.functions";
import { useAuth } from "@/hooks/use-auth";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { echoesHead } from "@/lib/echoes-head";
import { toast } from "sonner";
export const Route = createFileRoute("/_authenticated/echoes/edit/$postId")({ head: () => echoesHead("Edit echo", "Edit your published echo or private draft."), component: EditPage });
function EditPage() {
  const { postId } = Route.useParams(); const { user } = useAuth(); const fetch = useServerFn(getPost);
  const { data, isLoading } = useQuery({ queryKey: ["edit-echo", postId], queryFn: () => fetch({ data: { postId } }) });
  return <div className="mx-auto max-w-2xl space-y-6 px-5 pb-24 pt-28"><Link to="/echoes/profile" className="text-primary">← My profile</Link><h1 className="font-display text-4xl">Edit echo</h1>
    {isLoading ? <p>Loading…</p> : data?.author_id === user?.id ? <EditForm key={postId} post={data} /> : <p>Echo unavailable.</p>}
  </div>;
}
function EditForm({ post }: { post: { id: string; title: string | null; caption: string | null; story: string | null; status: string } }) {
  const [title, setTitle] = useState(post.title ?? ""), [caption, setCaption] = useState(post.caption ?? ""), [story, setStory] = useState(post.story ?? "");
  const [status, setStatus] = useState<"draft" | "published">(post.status === "draft" ? "draft" : "published"), [busy, setBusy] = useState(false);
  const fn = useServerFn(editEcho), qc = useQueryClient(), navigate = Route.useNavigate();
  async function save() { setBusy(true); try { await fn({ data: { id: post.id, title, caption, story, status } }); await qc.invalidateQueries(); await navigate({ to: "/echoes/profile" }); } catch { toast.error("Couldn't save echo"); } finally { setBusy(false); } }
  return <div className="space-y-4"><label className="block">Title<Input value={title} maxLength={140} onChange={(e) => setTitle(e.target.value)} /></label><label className="block">Caption<Textarea value={caption} maxLength={2200} onChange={(e) => setCaption(e.target.value)} /></label><label className="block">Story<Textarea value={story} maxLength={20000} rows={8} onChange={(e) => setStory(e.target.value)} /></label><label className="block">Status<select aria-label="Status" className="ml-3 rounded-md border border-input bg-background p-2" value={status} onChange={(e) => setStatus(e.target.value === "draft" ? "draft" : "published")}><option value="published">Published</option><option value="draft">Draft · Private</option></select></label><Button onClick={save} disabled={busy}>Save changes</Button></div>;
}
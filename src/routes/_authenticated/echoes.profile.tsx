import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { getProfile, listMyEchoes, updateProfile, deletePost } from "@/lib/echoes.functions";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { echoesHead } from "@/lib/echoes-head";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/echoes/profile")({ head: () => echoesHead("My profile", "Manage your profile, published echoes and private drafts."), component: MyProfile });
function MyProfile() {
  const { user } = useAuth(); const qc = useQueryClient();
  const profileFn = useServerFn(getProfile), postsFn = useServerFn(listMyEchoes), updateFn = useServerFn(updateProfile), removeFn = useServerFn(deletePost);
  const [bio, setBio] = useState<string | null>(null); const [busy, setBusy] = useState(false);
  const { data } = useQuery({ queryKey: ["my-echo-profile", user?.id], queryFn: () => profileFn({ data: { userId: user?.id ?? "" } }), enabled: !!user });
  const { data: posts } = useQuery({ queryKey: ["my-echoes", user?.id], queryFn: () => postsFn(), enabled: !!user });
  async function save() { setBusy(true); try { await updateFn({ data: { bio: bio ?? data?.profile?.bio ?? "" } }); await qc.invalidateQueries({ queryKey: ["my-echo-profile"] }); toast.success("Profile updated"); } catch { toast.error("Couldn't save profile"); } finally { setBusy(false); } }
  async function remove(id: string) { if (!window.confirm("Delete this echo?")) return; try { await removeFn({ data: { postId: id } }); await qc.invalidateQueries({ queryKey: ["my-echoes"] }); await qc.invalidateQueries({ queryKey: ["echoes-feed"] }); } catch { toast.error("Couldn't delete echo"); } }
  return <div className="mx-auto max-w-2xl space-y-6 px-5 pb-24 pt-28">
    <Link to="/echoes" className="text-sm text-primary">← Back to Echoes</Link>
    <div className="flex items-center gap-4">{data?.profile?.avatar_signed_url && <img src={data.profile.avatar_signed_url} alt="" className="h-16 w-16 rounded-full object-cover" />}<h1 className="font-display text-4xl">{data?.profile?.full_name ?? "My profile"}</h1></div>
    <label className="block space-y-2"><span className="text-sm">Bio</span><Textarea aria-label="Bio" maxLength={500} value={bio ?? data?.profile?.bio ?? ""} onChange={(e) => setBio(e.target.value)} /></label>
    <Button onClick={save} disabled={busy}>Save bio</Button>
    <h2 className="font-display text-2xl">My echoes</h2>
    {posts?.length === 0 && <p className="text-muted-foreground">No echoes yet.</p>}
    {posts?.map((post) => <article key={post.id} className="border-b border-border py-4">
      <Link to="/echoes/$postId" params={{ postId: post.id }} className="font-display text-xl hover:underline">{post.title ?? "Untitled echo"}</Link>
      <p className="my-2 text-sm text-muted-foreground">{post.status === "draft" ? "Draft · Private" : "Published"} · {new Date(post.created_at).toLocaleDateString()}</p>
      <div className="flex gap-2"><Button asChild variant="outline"><Link to="/echoes/edit/$postId" params={{ postId: post.id }}>Edit</Link></Button><Button variant="ghost" onClick={() => remove(post.id)}>Delete</Button></div>
    </article>)}
  </div>;
}
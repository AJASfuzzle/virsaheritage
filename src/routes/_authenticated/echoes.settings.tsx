import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useRef, useState } from "react";
import { Upload, Save } from "lucide-react";
import { getProfile, updateProfile } from "@/lib/echoes.functions";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/echoes/settings")({
  component: SettingsPage,
});

function listInput(arr: string[] | null | undefined) {
  return (arr ?? []).join(", ");
}
function parseList(s: string) {
  return s.split(",").map((x) => x.trim()).filter(Boolean);
}

function SettingsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const fetchProfile = useServerFn(getProfile);
  const updateFn = useServerFn(updateProfile);
  const bannerRef = useRef<HTMLInputElement>(null);
  const avatarRef = useRef<HTMLInputElement>(null);

  const { data } = useQuery({
    queryKey: ["echo-profile", user?.id],
    queryFn: () => fetchProfile({ data: { userId: user!.id } }),
    enabled: !!user,
  });

  const [full_name, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [website, setWebsite] = useState("");
  const [interests, setInterests] = useState("");
  const [origins, setOrigins] = useState("");
  const [languages, setLanguages] = useState("");
  const [bannerPath, setBannerPath] = useState<string | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [avatarPath, setAvatarPath] = useState<string | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const p = data?.profile;
    if (!p) return;
    setFullName(p.full_name ?? "");
    setUsername(p.username ?? "");
    setBio(p.bio ?? "");
    setLocation(p.location ?? "");
    setWebsite(p.website ?? "");
    setInterests(listInput(p.interests));
    setOrigins(listInput(p.heritage_origins));
    setLanguages(listInput(p.languages));
    setBannerPath(p.banner_url ?? null);
    setBannerPreview(p.banner_signed_url ?? null);
    if (p.avatar_url && !p.avatar_url.startsWith("http")) setAvatarPath(p.avatar_url);
    setAvatarPreview(p.avatar_signed_url ?? p.avatar_url ?? null);
  }, [data]);

  const uploadImage = async (file: File, kind: "banner" | "avatar") => {
    if (!user) return;
    const ext = file.name.split(".").pop() || "jpg";
    const path = `${user.id}/${kind}-${crypto.randomUUID()}.${ext}`;
    const { error } = await supabase.storage.from("echoes-media").upload(path, file, { upsert: false, contentType: file.type });
    if (error) { toast.error(error.message); return; }
    const { data: signed } = await supabase.storage.from("echoes-media").createSignedUrl(path, 60 * 60);
    if (kind === "banner") { setBannerPath(path); setBannerPreview(signed?.signedUrl ?? null); }
    else { setAvatarPath(path); setAvatarPreview(signed?.signedUrl ?? null); }
  };

  const save = useMutation({
    mutationFn: async () => {
      setBusy(true);
      await updateFn({
        data: {
          full_name: full_name.trim() || undefined,
          username: username.trim().toLowerCase() || undefined,
          bio: bio.trim() || undefined,
          location: location.trim() || undefined,
          website: website.trim() || undefined,
          interests: parseList(interests),
          heritage_origins: parseList(origins),
          languages: parseList(languages),
          banner_url: bannerPath ?? undefined,
          avatar_url: avatarPath ?? undefined,
        },
      });
    },
    onSuccess: () => {
      setBusy(false);
      toast.success("Profile saved");
      if (user) navigate({ to: "/echoes/profile/$userId", params: { userId: user.id } });
    },
    onError: (e: any) => { setBusy(false); toast.error(e?.message ?? "Couldn't save profile"); },
  });

  return (
    <div className="pt-24 sm:pt-28">
      <div className="mx-auto max-w-2xl px-5 pb-32">
        <p className="text-[10px] uppercase tracking-[0.32em] text-primary/85">Settings</p>
        <h1 className="mt-2 font-display text-3xl sm:text-4xl">Your Echoes profile</h1>

        {/* Banner */}
        <div className="mt-6 overflow-hidden rounded-2xl border border-[var(--glass-border)] bg-background/40">
          <div className="relative h-40 bg-gradient-to-br from-primary/25 via-accent/15 to-background sm:h-52">
            {bannerPreview && <img src={bannerPreview} alt="" className="h-full w-full object-cover" />}
            <button onClick={() => bannerRef.current?.click()} className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1.5 text-xs text-white backdrop-blur">
              <Upload className="h-3.5 w-3.5" /> Change banner
            </button>
            <input ref={bannerRef} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && uploadImage(e.target.files[0], "banner")} />
          </div>
        </div>

        {/* Avatar */}
        <div className="mt-4 flex items-center gap-4">
          <div className="grid h-20 w-20 place-items-center overflow-hidden rounded-full border-2 border-background bg-gradient-to-br from-primary/40 to-accent/30">
            {avatarPreview ? <img src={avatarPreview} alt="" className="h-full w-full object-cover" /> : <span className="font-display text-lg">{full_name.slice(0, 2).toUpperCase() || "ME"}</span>}
          </div>
          <button onClick={() => avatarRef.current?.click()} className="inline-flex items-center gap-1.5 rounded-full glass px-4 py-2 text-xs hover:bg-white/10">
            <Upload className="h-3.5 w-3.5" /> Change avatar
          </button>
          <input ref={avatarRef} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && uploadImage(e.target.files[0], "avatar")} />
        </div>

        {/* Fields */}
        <div className="mt-6 grid gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div><Label>Display name</Label><Input value={full_name} onChange={(e) => setFullName(e.target.value)} /></div>
            <div><Label>Username</Label><Input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="lowercase, letters, numbers, _ ." /></div>
          </div>
          <div><Label>Bio</Label><Textarea rows={3} value={bio} onChange={(e) => setBio(e.target.value)} maxLength={500} placeholder="A line about you, the memory you carry." /></div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div><Label>Location</Label><Input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g. Pune, Maharashtra" /></div>
            <div><Label>Website</Label><Input value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="https://" /></div>
          </div>
          <div><Label>Interests (comma separated)</Label><Input value={interests} onChange={(e) => setInterests(e.target.value)} placeholder="festivals, textiles, oral history" /></div>
          <div><Label>Heritage origins</Label><Input value={origins} onChange={(e) => setOrigins(e.target.value)} placeholder="Konkan, Punjabi, Tamil" /></div>
          <div><Label>Languages</Label><Input value={languages} onChange={(e) => setLanguages(e.target.value)} placeholder="Hindi, Marathi, English" /></div>
        </div>

        <div className="mt-8 flex justify-end">
          <Button onClick={() => save.mutate()} disabled={busy} className="gradient-ember text-primary-foreground"><Save className="mr-2 h-4 w-4" /> Save profile</Button>
        </div>
      </div>
    </div>
  );
}

import { useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { motion } from "framer-motion";
import { Upload, X, Image as ImageIcon, Film, Sparkles, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { createPost } from "@/lib/echoes.functions";

const CATEGORIES = [
  "Festivals", "Cuisine", "Crafts", "Music", "Dance", "Architecture",
  "Oral histories", "Languages", "Traditions", "Photographs", "Recipes", "Family stories",
];

const STATES = [
  "Andhra Pradesh", "Assam", "Bihar", "Goa", "Gujarat", "Haryana", "Himachal Pradesh",
  "Jammu & Kashmir", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Odisha",
  "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Uttar Pradesh", "Uttarakhand",
  "West Bengal", "Ladakh", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Tripura", "Arunachal Pradesh",
];

type PickedMedia = { file: File; preview: string; type: "image" | "video"; path?: string };

export function Composer({ onPosted }: { onPosted?: (id: string) => void }) {
  const { user } = useAuth();
  const qc = useQueryClient();
  const create = useServerFn(createPost);

  const [files, setFiles] = useState<PickedMedia[]>([]);
  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [story, setStory] = useState("");
  const [category, setCategory] = useState<string>("");
  const [state, setState] = useState<string>("");
  const [location, setLocation] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [submitToLib, setSubmitToLib] = useState(false);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const reset = () => {
    files.forEach((f) => URL.revokeObjectURL(f.preview));
    setFiles([]);
    setTitle(""); setCaption(""); setStory("");
    setCategory(""); setState(""); setLocation(""); setTagsInput("");
    setSubmitToLib(false);
  };

  const pick = (list: FileList | null) => {
    if (!list) return;
    const picked: PickedMedia[] = [];
    for (const f of Array.from(list).slice(0, 10 - files.length)) {
      const type: "image" | "video" = f.type.startsWith("video/") ? "video" : "image";
      picked.push({ file: f, preview: URL.createObjectURL(f), type });
    }
    setFiles((prev) => [...prev, ...picked].slice(0, 10));
  };

  const removeAt = (i: number) => {
    URL.revokeObjectURL(files[i].preview);
    setFiles((prev) => prev.filter((_, idx) => idx !== i));
  };

  const submit = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("Please sign in");
      if (!files.length && !caption.trim() && !story.trim()) throw new Error("Add media or words");

      // Upload files to bucket
      setUploading(true);
      const uploaded: Array<{ path: string; type: "image" | "video" }> = [];
      for (const f of files) {
        const ext = f.file.name.split(".").pop() || (f.type === "video" ? "mp4" : "jpg");
        const path = `${user.id}/${crypto.randomUUID()}.${ext}`;
        const { error } = await supabase.storage.from("echoes-media").upload(path, f.file, {
          cacheControl: "3600",
          upsert: false,
          contentType: f.file.type,
        });
        if (error) throw error;
        uploaded.push({ path, type: f.type });
      }
      setUploading(false);

      const tags = tagsInput.split(/[,\s]+/).map((t) => t.replace(/^#/, "").trim()).filter(Boolean).slice(0, 15);
      const res = await create({
        data: {
          title: title.trim() || undefined,
          caption: caption.trim() || undefined,
          story: story.trim() || undefined,
          media: uploaded,
          category: category || undefined,
          state: state || undefined,
          location: location.trim() || undefined,
          tags,
          submitToLibrary: submitToLib,
        },
      });
      return res;
    },
    onSuccess: (res: any) => {
      toast.success("Echo published");
      qc.invalidateQueries({ queryKey: ["echoes-feed"] });
      qc.invalidateQueries({ queryKey: ["library-echoes"] });
      reset();
      onPosted?.(res.id);
    },
    onError: (err: any) => {
      setUploading(false);
      toast.error(err?.message ?? "Couldn't publish");
    },
  });

  if (!user) {
    return (
      <div className="rounded-3xl border border-[var(--glass-border)] bg-[var(--card)] p-8 text-center shadow-[var(--shadow-soft)]">
        <Sparkles className="mx-auto h-6 w-6 text-primary" />
        <p className="mt-3 font-display text-xl">Sign in to share your echo</p>
        <p className="mt-1 text-sm text-muted-foreground">Your stories become part of a living archive.</p>
        <a href="/auth?mode=signin" className="mt-4 inline-flex rounded-full gradient-ember px-5 py-2.5 text-sm font-medium text-primary-foreground">Sign in</a>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-3xl border border-[var(--glass-border)] bg-[var(--card)] p-6 shadow-[var(--shadow-soft)] sm:p-8"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-[0.28em] text-primary/85">Share an echo</p>
          <h2 className="mt-1 font-display text-2xl sm:text-3xl">A memory worth carrying forward</h2>
        </div>
      </div>

      {/* media picker */}
      <div className="mt-5">
        {files.length === 0 ? (
          <label className="block cursor-pointer rounded-2xl border border-dashed border-white/15 bg-background/40 p-10 text-center hover:bg-background/60">
            <Upload className="mx-auto h-7 w-7 text-primary" />
            <div className="mt-2 text-sm">Drag photos or videos here, or click to choose</div>
            <div className="text-xs text-muted-foreground">Up to 10 items · images and short videos</div>
            <input ref={inputRef} type="file" accept="image/*,video/*" multiple className="hidden" onChange={(e) => pick(e.target.files)} />
          </label>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {files.map((f, i) => (
                <div key={i} className="group relative aspect-square overflow-hidden rounded-xl bg-black/30">
                  {f.type === "video" ? (
                    <video src={f.preview} className="h-full w-full object-cover" />
                  ) : (
                    <img src={f.preview} alt="" className="h-full w-full object-cover" />
                  )}
                  <button
                    onClick={() => removeAt(i)}
                    className="absolute right-1.5 top-1.5 grid h-7 w-7 place-items-center rounded-full bg-black/60 text-white opacity-0 transition group-hover:opacity-100"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                  <div className="absolute left-1.5 top-1.5 rounded-full bg-black/60 px-1.5 py-0.5 text-[10px] text-white">
                    {f.type === "video" ? <Film className="h-3 w-3" /> : <ImageIcon className="h-3 w-3" />}
                  </div>
                </div>
              ))}
              {files.length < 10 && (
                <button
                  onClick={() => inputRef.current?.click()}
                  className="aspect-square rounded-xl border border-dashed border-white/15 text-xs text-muted-foreground hover:bg-white/5"
                >
                  + Add more
                </button>
              )}
            </div>
            <input ref={inputRef} type="file" accept="image/*,video/*" multiple className="hidden" onChange={(e) => pick(e.target.files)} />
          </>
        )}
      </div>

      {/* fields */}
      <div className="mt-5 grid gap-4">
        <div>
          <Label htmlFor="e-title">Title (optional)</Label>
          <Input id="e-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Give your echo a name" maxLength={140} />
        </div>
        <div>
          <Label htmlFor="e-caption">Caption</Label>
          <Textarea id="e-caption" rows={3} value={caption} onChange={(e) => setCaption(e.target.value)} placeholder="A line, a feeling, a memory…" maxLength={2200} />
        </div>
        <div>
          <Label htmlFor="e-story">Story (optional, longer)</Label>
          <Textarea id="e-story" rows={5} value={story} onChange={(e) => setStory(e.target.value)} placeholder="The fuller story - why this matters, who it belongs to, what it preserves." />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="e-cat">Heritage category</Label>
            <select id="e-cat" value={category} onChange={(e) => setCategory(e.target.value)} className="mt-1 h-10 w-full rounded-md border border-input bg-background/40 px-3 text-sm">
              <option value="">Select…</option>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <Label htmlFor="e-state">Region / state</Label>
            <select id="e-state" value={state} onChange={(e) => setState(e.target.value)} className="mt-1 h-10 w-full rounded-md border border-input bg-background/40 px-3 text-sm">
              <option value="">Select…</option>
              {STATES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="e-loc">Location (optional)</Label>
            <Input id="e-loc" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g. Old Delhi, Chandni Chowk" />
          </div>
          <div>
            <Label htmlFor="e-tags">Tags</Label>
            <Input id="e-tags" value={tagsInput} onChange={(e) => setTagsInput(e.target.value)} placeholder="festival, weaving, monsoon" />
          </div>
        </div>
        <label className="mt-1 flex items-start gap-3 rounded-2xl border border-[var(--glass-border)] bg-background/40 p-4">
          <input type="checkbox" checked={submitToLib} onChange={(e) => setSubmitToLib(e.target.checked)} className="mt-1 h-4 w-4" />
          <span className="text-sm">
            <span className="font-medium">Add to the Library</span>
            <span className="block text-xs text-muted-foreground">Make this echo part of the permanent, searchable archive.</span>
          </span>
        </label>
      </div>

      <div className="mt-6 flex items-center justify-end gap-2">
        <Button variant="ghost" onClick={reset} disabled={submit.isPending}>Clear</Button>
        <Button onClick={() => submit.mutate()} disabled={submit.isPending} className="gradient-ember text-primary-foreground">
          {submit.isPending ? (
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> {uploading ? "Uploading…" : "Publishing…"}</>
          ) : (
            <>Publish echo</>
          )}
        </Button>
      </div>
    </motion.div>
  );
}

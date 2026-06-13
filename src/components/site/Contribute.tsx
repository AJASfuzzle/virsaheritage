import { motion } from "framer-motion";
import { Camera, Check, FileText, Image as ImageIcon, Mic, Square, Upload, Video } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const formats = [
  { icon: Mic, label: "Voice", hint: "Story · Song · Dialect" },
  { icon: Camera, label: "Photo", hint: "Festival · Place · Family" },
  { icon: Video, label: "Video", hint: "Dance · Ritual · Craft" },
  { icon: FileText, label: "Text", hint: "Recipe · Letter · Memory" },
];

type SavedContribution = {
  id: string;
  type: "voice" | "photo" | "video" | "text";
  name: string;
  region: string;
  notes: string;
  fileName?: string;
  fileSize?: number;
  textBody?: string;
  durationSec?: number;
  createdAt: string;
};

const STORE_KEY = "kaal:contributions:v1";

function saveContribution(c: SavedContribution) {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    const list: SavedContribution[] = raw ? JSON.parse(raw) : [];
    list.unshift(c);
    localStorage.setItem(STORE_KEY, JSON.stringify(list.slice(0, 50)));
  } catch {
    // ignore
  }
}

export function Contribute() {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<"voice" | "photo" | "video" | "text">("voice");

  return (
    <section id="contribute" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5">
        <div className="relative overflow-hidden rounded-[2.5rem] glass grain p-10 sm:p-16">
          <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-primary/25 blur-[100px]" />
          <div className="absolute -left-24 -bottom-32 h-96 w-96 rounded-full bg-accent/25 blur-[100px]" />

          <div className="relative grid gap-12 lg:grid-cols-[1.1fr_1fr]">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-primary/90">Contribute a memory</p>
              <h2 className="mt-3 font-display text-4xl sm:text-6xl text-balance">
                Your grandmother knows
                <br />
                a story <span className="italic text-gradient-ember">India must remember.</span>
              </h2>
              <p className="mt-6 max-w-xl text-foreground/80 text-lg text-pretty">
                Upload a recording, a recipe, a photograph or a single sentence
                in a tongue your village still speaks. KAAL transcribes,
                translates and tags it — and places it on India's living map.
              </p>

              <div className="mt-9 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => setOpen(true)}
                  className="inline-flex items-center gap-2 rounded-full gradient-ember px-6 py-3.5 text-sm font-medium text-primary-foreground shadow-[0_20px_60px_-20px_oklch(0.72_0.18_55/0.7)] hover:brightness-110 transition"
                >
                  <Upload className="h-4 w-4" /> Start contributing
                </button>
                <a href="/assistant" className="inline-flex items-center gap-2 rounded-full glass px-6 py-3.5 text-sm hover:bg-white/10 transition">
                  Ask the AI Assistant
                </a>
              </div>
            </div>

            <div>
              <div className="grid grid-cols-2 gap-3">
                {formats.map((f, i) => {
                  const Icon = f.icon;
                  const targetTab = f.label.toLowerCase() as typeof tab;
                  return (
                    <motion.button
                      type="button"
                      key={f.label}
                      onClick={() => { setTab(targetTab); setOpen(true); }}
                      initial={{ opacity: 0, y: 18 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: i * 0.06 }}
                      className="text-left rounded-2xl bg-background/40 ring-1 ring-white/10 p-5 hover:ring-primary/40 hover:bg-background/60 transition"
                    >
                      <Icon className="h-5 w-5 text-primary" />
                      <div className="mt-3 font-display text-xl">{f.label}</div>
                      <div className="text-xs text-muted-foreground mt-1">{f.hint}</div>
                    </motion.button>
                  );
                })}
              </div>

              <div className="mt-5 rounded-2xl bg-background/40 ring-1 ring-white/10 p-5">
                <div className="text-xs uppercase tracking-[0.22em] text-muted-foreground">AI does the heavy lifting</div>
                <ul className="mt-3 grid grid-cols-2 gap-y-2 text-sm text-foreground/85">
                  <li>• Speech-to-text</li>
                  <li>• Language detection</li>
                  <li>• Auto-summary</li>
                  <li>• Translation</li>
                  <li>• Keywords</li>
                  <li>• Metadata</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ContributeDialog open={open} onOpenChange={setOpen} tab={tab} setTab={setTab} />
    </section>
  );
}

function ContributeDialog({
  open,
  onOpenChange,
  tab,
  setTab,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  tab: "voice" | "photo" | "video" | "text";
  setTab: (t: "voice" | "photo" | "video" | "text") => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass grain max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">Contribute a memory</DialogTitle>
          <DialogDescription>
            Add a voice memo, photo, video or written story. We keep it on this device until your next sync.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)} className="mt-2">
          <TabsList className="grid grid-cols-4 w-full bg-background/40">
            <TabsTrigger value="voice"><Mic className="h-4 w-4 mr-1.5" />Voice</TabsTrigger>
            <TabsTrigger value="photo"><Camera className="h-4 w-4 mr-1.5" />Photo</TabsTrigger>
            <TabsTrigger value="video"><Video className="h-4 w-4 mr-1.5" />Video</TabsTrigger>
            <TabsTrigger value="text"><FileText className="h-4 w-4 mr-1.5" />Text</TabsTrigger>
          </TabsList>

          <TabsContent value="voice" className="mt-5">
            <VoicePanel onClose={() => onOpenChange(false)} />
          </TabsContent>
          <TabsContent value="photo" className="mt-5">
            <FilePanel kind="photo" accept="image/*" icon={ImageIcon} onClose={() => onOpenChange(false)} />
          </TabsContent>
          <TabsContent value="video" className="mt-5">
            <FilePanel kind="video" accept="video/*" icon={Video} onClose={() => onOpenChange(false)} />
          </TabsContent>
          <TabsContent value="text" className="mt-5">
            <TextPanel onClose={() => onOpenChange(false)} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

function MetaFields({
  name, setName, region, setRegion, notes, setNotes,
}: {
  name: string; setName: (v: string) => void;
  region: string; setRegion: (v: string) => void;
  notes: string; setNotes: (v: string) => void;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <div className="sm:col-span-1">
        <Label htmlFor="c-name">Your name</Label>
        <Input id="c-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Anaya Mehta" />
      </div>
      <div className="sm:col-span-1">
        <Label htmlFor="c-region">Region / community</Label>
        <Input id="c-region" value={region} onChange={(e) => setRegion(e.target.value)} placeholder="e.g. Konkan coast" />
      </div>
      <div className="sm:col-span-2">
        <Label htmlFor="c-notes">A short note (optional)</Label>
        <Textarea id="c-notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} placeholder="What's this memory about?" />
      </div>
    </div>
  );
}

function VoicePanel({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState("");
  const [region, setRegion] = useState("");
  const [notes, setNotes] = useState("");
  const [recording, setRecording] = useState(false);
  const [blob, setBlob] = useState<Blob | null>(null);
  const [url, setUrl] = useState<string | null>(null);
  const [seconds, setSeconds] = useState(0);
  const recRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => () => {
    if (url) URL.revokeObjectURL(url);
    if (timerRef.current) clearInterval(timerRef.current);
  }, [url]);

  const start = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      chunksRef.current = [];
      const rec = new MediaRecorder(stream);
      rec.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      rec.onstop = () => {
        const b = new Blob(chunksRef.current, { type: rec.mimeType || "audio/webm" });
        setBlob(b);
        setUrl(URL.createObjectURL(b));
        stream.getTracks().forEach((t) => t.stop());
      };
      rec.start();
      recRef.current = rec;
      setRecording(true);
      setSeconds(0);
      timerRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
    } catch {
      toast.error("Microphone permission denied.");
    }
  };

  const stop = () => {
    recRef.current?.stop();
    setRecording(false);
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
  };

  const submit = () => {
    if (!blob) { toast.error("Please record a voice memo first."); return; }
    if (!name.trim() || !region.trim()) { toast.error("Add your name and region."); return; }
    saveContribution({
      id: crypto.randomUUID(),
      type: "voice",
      name: name.trim(),
      region: region.trim(),
      notes: notes.trim(),
      fileSize: blob.size,
      durationSec: seconds,
      createdAt: new Date().toISOString(),
    });
    toast.success("Voice memo saved to KAAL", { description: "Thanks for adding a memory." });
    onClose();
  };

  return (
    <div className="space-y-4">
      <MetaFields name={name} setName={setName} region={region} setRegion={setRegion} notes={notes} setNotes={setNotes} />
      <div className="rounded-xl bg-background/40 ring-1 ring-white/10 p-5 flex items-center gap-4">
        {!recording ? (
          <Button type="button" onClick={start} className="gradient-ember text-primary-foreground">
            <Mic className="h-4 w-4 mr-2" /> {blob ? "Re-record" : "Start recording"}
          </Button>
        ) : (
          <Button type="button" onClick={stop} variant="destructive">
            <Square className="h-4 w-4 mr-2" /> Stop
          </Button>
        )}
        <div className="text-sm tabular-nums text-muted-foreground">
          {recording ? <span className="text-primary">● Recording</span> : blob ? "Recorded" : "Idle"} · {fmt(seconds)}
        </div>
      </div>
      {url && <audio src={url} controls className="w-full" />}
      <div className="flex justify-end gap-2 pt-2">
        <Button variant="ghost" onClick={onClose}>Cancel</Button>
        <Button onClick={submit} className="gradient-ember text-primary-foreground"><Check className="h-4 w-4 mr-2" />Submit memory</Button>
      </div>
    </div>
  );
}

function FilePanel({
  kind, accept, icon: Icon, onClose,
}: {
  kind: "photo" | "video";
  accept: string;
  icon: typeof ImageIcon;
  onClose: () => void;
}) {
  const [name, setName] = useState("");
  const [region, setRegion] = useState("");
  const [notes, setNotes] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => () => { if (preview) URL.revokeObjectURL(preview); }, [preview]);

  const onPick = (f: File | null) => {
    if (preview) URL.revokeObjectURL(preview);
    setFile(f);
    setPreview(f ? URL.createObjectURL(f) : null);
  };

  const submit = () => {
    if (!file) { toast.error(`Please choose a ${kind} to upload.`); return; }
    if (!name.trim() || !region.trim()) { toast.error("Add your name and region."); return; }
    saveContribution({
      id: crypto.randomUUID(),
      type: kind,
      name: name.trim(),
      region: region.trim(),
      notes: notes.trim(),
      fileName: file.name,
      fileSize: file.size,
      createdAt: new Date().toISOString(),
    });
    toast.success(`${kind === "photo" ? "Photo" : "Video"} saved to KAAL`, { description: "Thanks for adding a memory." });
    onClose();
  };

  return (
    <div className="space-y-4">
      <MetaFields name={name} setName={setName} region={region} setRegion={setRegion} notes={notes} setNotes={setNotes} />
      <label className="block rounded-xl border border-dashed border-white/15 bg-background/40 px-5 py-8 text-center cursor-pointer hover:bg-background/60 transition">
        <Icon className="h-6 w-6 text-primary mx-auto" />
        <div className="mt-2 text-sm">
          {file ? <span className="text-foreground">{file.name}</span> : <>Click to choose a {kind} or drag it here</>}
        </div>
        <div className="text-xs text-muted-foreground mt-1">{accept.replace("/*", "")} files</div>
        <input type="file" accept={accept} className="hidden" onChange={(e) => onPick(e.target.files?.[0] ?? null)} />
      </label>
      {preview && kind === "photo" && <img src={preview} alt="preview" className="rounded-xl max-h-64 mx-auto" />}
      {preview && kind === "video" && <video src={preview} controls className="rounded-xl max-h-64 w-full" />}
      <div className="flex justify-end gap-2 pt-2">
        <Button variant="ghost" onClick={onClose}>Cancel</Button>
        <Button onClick={submit} className="gradient-ember text-primary-foreground"><Check className="h-4 w-4 mr-2" />Submit memory</Button>
      </div>
    </div>
  );
}

function TextPanel({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState("");
  const [region, setRegion] = useState("");
  const [notes, setNotes] = useState("");
  const [body, setBody] = useState("");

  const submit = () => {
    if (!body.trim()) { toast.error("Write your memory first."); return; }
    if (!name.trim() || !region.trim()) { toast.error("Add your name and region."); return; }
    saveContribution({
      id: crypto.randomUUID(),
      type: "text",
      name: name.trim(),
      region: region.trim(),
      notes: notes.trim(),
      textBody: body.trim(),
      createdAt: new Date().toISOString(),
    });
    toast.success("Story saved to KAAL", { description: "Thanks for adding a memory." });
    onClose();
  };

  return (
    <div className="space-y-4">
      <MetaFields name={name} setName={setName} region={region} setRegion={setRegion} notes={notes} setNotes={setNotes} />
      <div>
        <Label htmlFor="c-body">Your story, recipe or memory</Label>
        <Textarea id="c-body" value={body} onChange={(e) => setBody(e.target.value)} rows={7} placeholder="A tale your grandmother told, a recipe written in a notebook, a phrase only your village uses…" />
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <Button variant="ghost" onClick={onClose}>Cancel</Button>
        <Button onClick={submit} className="gradient-ember text-primary-foreground"><Check className="h-4 w-4 mr-2" />Submit memory</Button>
      </div>
    </div>
  );
}

function fmt(s: number) {
  const m = Math.floor(s / 60).toString().padStart(2, "0");
  const ss = (s % 60).toString().padStart(2, "0");
  return `${m}:${ss}`;
}

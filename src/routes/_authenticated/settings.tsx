import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Loader2, ShieldCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { validatePasswordChange } from "@/lib/auth-access";

export const Route = createFileRoute("/_authenticated/settings")({
  head: () => ({
    meta: [
      { title: "Settings - VIRSA Heritage" },
      { name: "description", content: "Manage your VIRSA account, profile and preferences." },
      { property: "og:title", content: "Account settings | VIRSA Heritage" },
      { property: "og:description", content: "Manage your VIRSA profile and securely change your password." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const { user } = useAuth();
  const [fullName, setFullName] = useState((user?.user_metadata?.full_name as string | undefined) ?? "");
  const [password, setPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPwd, setSavingPwd] = useState(false);

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setSavingProfile(true);
    const { error } = await supabase.auth.updateUser({ data: { full_name: fullName } });
    if (!error) {
      await supabase.from("profiles").update({ full_name: fullName, updated_at: new Date().toISOString() }).eq("id", user.id);
      toast.success("Profile updated");
    } else toast.error(error.message);
    setSavingProfile(false);
  }

  async function savePassword(e: React.FormEvent) {
    e.preventDefault();
    const invalid = validatePasswordChange(password, confirmation);
    if (invalid) { setPasswordError(invalid); return; }
    if (!currentPassword) { setPasswordError("Enter your current password"); return; }
    setPasswordError("");
    setSavingPwd(true);
    try {
      const { error } = await supabase.auth.updateUser({ password, current_password: currentPassword });
      if (error) throw error;
      toast.success("Password updated");
      setPassword("");
      setCurrentPassword("");
      setConfirmation("");
    } catch (err) { setPasswordError(err instanceof Error ? err.message : "Unable to update your password. Please try again."); }
    finally { setSavingPwd(false); }
  }

  return (
    <div className="pt-28 pb-24">
      <div className="mx-auto max-w-3xl px-5">
        <p className="text-xs uppercase tracking-[0.28em] text-primary/90">Account</p>
        <h1 className="mt-2 font-display text-4xl sm:text-5xl">Settings</h1>
        <p className="mt-2 text-muted-foreground">Manage your VIRSA profile and preferences.</p>

        <div className="mt-10 space-y-6">
          <section className="rounded-3xl glass p-6">
            <h2 className="font-display text-xl">Profile</h2>
            <form onSubmit={saveProfile} className="mt-5 space-y-4">
              <Field label="Full name">
                <input value={fullName} onChange={(e) => setFullName(e.target.value)} className={inputClass} />
              </Field>
              <Field label="Email">
                <input value={user?.email ?? ""} disabled className={`${inputClass} opacity-70`} />
              </Field>
              <button disabled={savingProfile} className="btn-glossy inline-flex items-center gap-2 rounded-full gradient-ember px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-60">
                {savingProfile && <Loader2 className="h-4 w-4 animate-spin" />} Save profile
              </button>
            </form>
          </section>

          <section className="rounded-3xl glass p-6">
            <h2 className="font-display text-xl">Password</h2>
            <form onSubmit={savePassword} className="mt-5 space-y-4">
              <Field label="Current password">
                <input type="password" autoComplete="current-password" required value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} className={inputClass} />
              </Field>
              <Field label="New password">
                <input type="password" autoComplete="new-password" required value={password} onChange={(e) => setPassword(e.target.value)} className={inputClass} minLength={8} maxLength={72} placeholder="At least 8 characters" />
              </Field>
              <Field label="Confirm new password">
                <input type="password" autoComplete="new-password" required value={confirmation} onChange={e => setConfirmation(e.target.value)} className={inputClass} />
              </Field>
              {passwordError && <p role="alert" className="text-sm text-destructive">{passwordError}</p>}
              <Button type="submit" disabled={savingPwd} className="btn-glossy inline-flex items-center gap-2 rounded-full gradient-ember px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-60">
                {savingPwd && <Loader2 className="h-4 w-4 animate-spin" />} Update password
              </Button>
            </form>
          </section>

          <section className="rounded-3xl glass p-6">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-primary" />
              <h2 className="font-display text-xl">Security & privacy</h2>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              Your check-in locations are stored only when you actively check in at a site, and are visible only to you.
              You can request deletion of your account at any time by emailing VIRSA.
            </p>
          </section>
        </div>

        <Link to="/dashboard" className="mt-10 inline-block text-sm text-muted-foreground hover:text-foreground transition">← Back to dashboard</Link>
      </div>
    </div>
  );
}

const inputClass = "w-full rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2.5 text-sm text-foreground outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/30";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11px] uppercase tracking-[0.22em] text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}

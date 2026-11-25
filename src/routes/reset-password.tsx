import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { validatePasswordChange } from "@/lib/auth-access";

export const Route = createFileRoute("/reset-password")({
  head: () => ({ meta: [
    { title: "Reset password | VIRSA Heritage" },
    { name: "description", content: "Choose a new password for your VIRSA Heritage account using your secure recovery link." },
    { property: "og:title", content: "Reset password | VIRSA Heritage" },
    { property: "og:description", content: "Securely restore access to your VIRSA Heritage account." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const { user, loading, isPasswordRecovery, signOut } = useAuth();
  const [linkError, setLinkError] = useState("");
  const [checking, setChecking] = useState(true);
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const hash = new URLSearchParams(window.location.hash.slice(1));
    // The auth client consumes type=recovery and verifies the link; a hash alone never grants access.
    if (hash.get("error") || hash.get("error_description")) setLinkError("This reset link has expired or is invalid. Request a new one.");
    const timer = window.setTimeout(() => setChecking(false), 1500);
    return () => window.clearTimeout(timer);
  }, []);

  async function resetPassword(e: React.FormEvent) {
    e.preventDefault();
    if (!isPasswordRecovery || !user) return;
    const invalid = validatePasswordChange(password, confirmation);
    if (invalid) { setError(invalid); return; }
    setBusy(true);
    setError("");
    try {
      const { data: verified, error: verifyError } = await supabase.auth.getUser();
      if (verifyError || !verified.user) throw new Error("This reset link has expired. Request a new one.");
      const { error: updateError } = await supabase.auth.updateUser({ password });
      if (updateError) throw updateError;
      toast.success("Password updated. Sign in with your new password.");
      await signOut();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not update your password. Please try again.");
    } finally { setBusy(false); }
  }

  const ready = !!user && isPasswordRecovery && !linkError;
  return <div className="min-h-screen bg-background px-5 pt-32 pb-20 text-foreground">
    <div className="mx-auto max-w-md glass rounded-3xl p-7 sm:p-8">
      <h1 className="font-display text-3xl">Reset your password</h1>
      {!ready && (loading || checking) && !linkError ? <p className="mt-5 flex items-center gap-2 text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /> Checking your reset link…</p> : ready ?
        <form onSubmit={resetPassword} className="mt-6 space-y-4">
          <label className="block text-sm">New password<input type="password" autoComplete="new-password" required minLength={8} maxLength={72} value={password} onChange={e => setPassword(e.target.value)} className="mt-2 w-full rounded-xl border border-input bg-background/50 px-3 py-2.5" /></label>
          <label className="block text-sm">Confirm new password<input type="password" autoComplete="new-password" required value={confirmation} onChange={e => setConfirmation(e.target.value)} className="mt-2 w-full rounded-xl border border-input bg-background/50 px-3 py-2.5" /></label>
          {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
          <Button type="submit" disabled={busy} className="w-full rounded-xl gradient-ember text-primary-foreground">{busy && <Loader2 className="animate-spin" />} Save new password</Button>
        </form> : <div className="mt-5"><p role="alert" className="text-sm text-muted-foreground">{linkError || "Open the password reset link from your email to choose a new password."}</p><Button asChild variant="link" className="mt-3 px-0"><Link to="/auth">Request a new reset link</Link></Button></div>}
    </div>
  </div>;
}
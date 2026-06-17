import { createFileRoute, Link, useNavigate, useSearch } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import { z } from "zod";
import { Eye, EyeOff, Loader2, Mail, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";

const searchSchema = z.object({
  mode: z.enum(["signin", "signup"]).optional(),
  redirect: z.string().optional(),
});

export const Route = createFileRoute("/auth")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Sign in — VIRSA Heritage" },
      { name: "description", content: "Sign in to track your trails, earn Virsa Coins and redeem treasures from Khazane." },
    ],
  }),
  component: AuthPage,
});

const signUpSchema = z.object({
  fullName: z.string().trim().min(2, "Name is too short").max(80),
  email: z.string().trim().email("Enter a valid email").max(255),
  password: z.string().min(8, "At least 8 characters").max(72),
});

const signInSchema = z.object({
  email: z.string().trim().email("Enter a valid email").max(255),
  password: z.string().min(1, "Password required").max(72),
});

function passwordStrength(p: string): { score: number; label: string } {
  let s = 0;
  if (p.length >= 8) s++;
  if (p.length >= 12) s++;
  if (/[A-Z]/.test(p) && /[a-z]/.test(p)) s++;
  if (/[0-9]/.test(p)) s++;
  if (/[^A-Za-z0-9]/.test(p)) s++;
  return { score: s, label: ["Too short", "Weak", "Fair", "Good", "Strong", "Excellent"][Math.min(s, 5)] };
}

function AuthPage() {
  const search = useSearch({ from: "/auth" });
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">(search.mode ?? "signin");
  const [showPwd, setShowPwd] = useState(false);
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({ fullName: "", email: "", password: "" });

  const strength = passwordStrength(form.password);
  const redirectTo = search.redirect && search.redirect.startsWith("/") ? search.redirect : "/dashboard";

  async function handleEmail(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "signup") {
        const parsed = signUpSchema.safeParse(form);
        if (!parsed.success) {
          toast.error(parsed.error.issues[0]?.message ?? "Invalid input");
          return;
        }
        const { error } = await supabase.auth.signUp({
          email: parsed.data.email,
          password: parsed.data.password,
          options: {
            emailRedirectTo: `${window.location.origin}${redirectTo}`,
            data: { full_name: parsed.data.fullName },
          },
        });
        if (error) {
          toast.error(error.message);
          return;
        }
        toast.success("Welcome to VIRSA. Check your inbox to confirm.");
        navigate({ to: redirectTo });
      } else {
        const parsed = signInSchema.safeParse({ email: form.email, password: form.password });
        if (!parsed.success) {
          toast.error(parsed.error.issues[0]?.message ?? "Invalid input");
          return;
        }
        const { error } = await supabase.auth.signInWithPassword({
          email: parsed.data.email,
          password: parsed.data.password,
        });
        if (error) {
          toast.error(error.message);
          return;
        }
        toast.success("Welcome back.");
        navigate({ to: redirectTo });
      }
    } finally {
      setBusy(false);
    }
  }

  async function handleGoogle() {
    setBusy(true);
    try {
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: window.location.origin + redirectTo,
      });
      if (result.error) {
        toast.error(result.error.message || "Google sign-in failed");
        setBusy(false);
        return;
      }
      if (result.redirected) return;
      navigate({ to: redirectTo });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Sign-in failed");
      setBusy(false);
    }
  }

  return (
    <div className="dark bg-background text-foreground relative isolate min-h-screen overflow-hidden pt-28 pb-16">
      {/* atmospheric backdrop */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-40 -left-40 h-[520px] w-[520px] rounded-full bg-primary/15 blur-[140px]" />
        <div className="absolute -bottom-40 -right-40 h-[520px] w-[520px] rounded-full bg-accent/15 blur-[140px]" />
        <div className="absolute inset-0 opacity-[0.05] mix-blend-overlay [background-image:radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] [background-size:24px_24px]" />
      </div>

      <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 md:grid-cols-2">
        {/* Left: editorial pane */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="hidden md:block"
        >
          <span className="inline-flex items-center gap-2 rounded-full glass px-3 py-1.5 text-[11px] uppercase tracking-[0.28em] text-primary/90">
            <Sparkles className="h-3.5 w-3.5" /> Begin your journey
          </span>
          <h1 className="mt-6 font-display text-5xl lg:text-6xl text-balance leading-[1.05]">
            Step into India's
            <span className="block italic text-gradient-ember">living archive.</span>
          </h1>
          <p className="mt-6 max-w-md text-foreground/75 text-pretty leading-relaxed">
            Sign in to track heritage trails, earn{" "}
            <span className="italic text-primary">Virsa Coins</span> for every site
            you visit, and unlock treasures from the Khazane.
          </p>
          <ul className="mt-8 space-y-3 text-sm text-foreground/70">
            <li className="flex items-center gap-3"><span className="h-1.5 w-1.5 rounded-full bg-primary" /> Geolocation check-ins at heritage sites</li>
            <li className="flex items-center gap-3"><span className="h-1.5 w-1.5 rounded-full bg-primary" /> Collectible achievement badges</li>
            <li className="flex items-center gap-3"><span className="h-1.5 w-1.5 rounded-full bg-primary" /> Redeem coins for journals, prints, and curated experiences</li>
          </ul>
        </motion.div>

        {/* Right: card */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.05 }}
          className="relative mx-auto w-full max-w-md"
        >
          <div className="rounded-3xl glass grain p-7 sm:p-8 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.6)]">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-2xl">
                {mode === "signin" ? "Welcome back" : "Create your account"}
              </h2>
            </div>
            <p className="mt-1.5 text-sm text-muted-foreground">
              {mode === "signin"
                ? "Continue your trail through time."
                : "It takes less than a minute."}
            </p>

            {/* Tabs */}
            <div className="mt-5 grid grid-cols-2 rounded-full bg-white/[0.04] p-1 ring-1 ring-white/10 text-sm">
              <button
                type="button"
                onClick={() => setMode("signin")}
                className={`rounded-full px-3 py-1.5 transition ${mode === "signin" ? "bg-white/10 text-foreground" : "text-foreground/60 hover:text-foreground"}`}
              >
                Sign in
              </button>
              <button
                type="button"
                onClick={() => setMode("signup")}
                className={`rounded-full px-3 py-1.5 transition ${mode === "signup" ? "bg-white/10 text-foreground" : "text-foreground/60 hover:text-foreground"}`}
              >
                Create account
              </button>
            </div>

            {/* Google */}
            <button
              type="button"
              onClick={handleGoogle}
              disabled={busy}
              className="btn-glossy mt-6 inline-flex w-full items-center justify-center gap-3 rounded-2xl border border-white/15 bg-white/[0.04] px-4 py-3 text-sm font-medium text-foreground hover:bg-white/[0.08] transition disabled:opacity-60"
            >
              <GoogleIcon className="h-4 w-4" />
              Continue with Google
            </button>

            <div className="my-5 flex items-center gap-3 text-[11px] uppercase tracking-[0.26em] text-muted-foreground">
              <span className="h-px flex-1 bg-white/10" /> or by email <span className="h-px flex-1 bg-white/10" />
            </div>

            <form onSubmit={handleEmail} className="space-y-3.5">
              {mode === "signup" && (
                <Field label="Full name">
                  <input
                    autoComplete="name"
                    value={form.fullName}
                    onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                    className={inputClass}
                    placeholder="Aarya Rao"
                    required
                  />
                </Field>
              )}
              <Field label="Email">
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="email"
                    autoComplete="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className={`${inputClass} pl-9`}
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </Field>
              <Field label="Password">
                <div className="relative">
                  <input
                    type={showPwd ? "text" : "password"}
                    autoComplete={mode === "signin" ? "current-password" : "new-password"}
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className={`${inputClass} pr-10`}
                    placeholder={mode === "signup" ? "At least 8 characters" : "Your password"}
                    required
                    minLength={mode === "signup" ? 8 : 1}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd((v) => !v)}
                    aria-label={showPwd ? "Hide password" : "Show password"}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-muted-foreground hover:text-foreground"
                  >
                    {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {mode === "signup" && form.password && (
                  <div className="mt-2">
                    <div className="flex gap-1">
                      {[0, 1, 2, 3, 4].map((i) => (
                        <span
                          key={i}
                          className={`h-1 flex-1 rounded-full transition ${
                            i < strength.score ? "bg-primary" : "bg-white/10"
                          }`}
                        />
                      ))}
                    </div>
                    <div className="mt-1 text-[11px] text-muted-foreground">{strength.label}</div>
                  </div>
                )}
              </Field>

              <button
                type="submit"
                disabled={busy}
                className="btn-glossy mt-2 inline-flex w-full items-center justify-center gap-2 rounded-2xl gradient-ember px-4 py-3 text-sm font-semibold text-primary-foreground shadow-[0_18px_50px_-18px_oklch(0.72_0.18_55/0.8)] disabled:opacity-60"
              >
                {busy && <Loader2 className="h-4 w-4 animate-spin" />}
                {mode === "signin" ? "Sign in" : "Create account"}
              </button>

              {mode === "signin" && (
                <p className="text-center text-xs text-muted-foreground pt-1">
                  Trouble signing in? Reach out and we'll help.
                </p>
              )}
            </form>

            <p className="mt-6 text-center text-xs text-muted-foreground">
              {mode === "signin" ? (
                <>Don't have an account?{" "}
                  <button onClick={() => setMode("signup")} className="text-primary hover:underline">Create one</button>
                </>
              ) : (
                <>Already with VIRSA?{" "}
                  <button onClick={() => setMode("signin")} className="text-primary hover:underline">Sign in</button>
                </>
              )}
            </p>
          </div>

          <p className="mt-4 text-center text-[11px] text-muted-foreground">
            <Link to="/" className="hover:text-foreground transition">← Back to VIRSA</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}

const inputClass =
  "w-full rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/70 outline-none transition focus:border-primary/50 focus:bg-white/[0.06] focus:ring-2 focus:ring-primary/30";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11px] uppercase tracking-[0.22em] text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path fill="#FFC107" d="M21.8 10.2H12v3.9h5.6c-.8 2.4-3 4.1-5.6 4.1a6.2 6.2 0 1 1 4-10.9l2.8-2.7A10 10 0 1 0 22 12c0-.6 0-1.2-.2-1.8Z" />
      <path fill="#FF3D00" d="M3.2 7.3 6.4 9.7A6.2 6.2 0 0 1 12 5.8a6 6 0 0 1 3.9 1.5l2.8-2.7A10 10 0 0 0 3.2 7.3Z" />
      <path fill="#4CAF50" d="M12 22a10 10 0 0 0 6.7-2.6l-3.1-2.6a6 6 0 0 1-9-3.1l-3.2 2.4A10 10 0 0 0 12 22Z" />
      <path fill="#1976D2" d="M21.8 10.2H12v3.9h5.6a6 6 0 0 1-2 2.7l3.1 2.6c-.2.2 3.3-2.4 3.3-7.4 0-.6 0-1.2-.2-1.8Z" />
    </svg>
  );
}

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

type AuthCtx = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isPasswordRecovery: boolean;
  signOut: () => Promise<void>;
};

const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPasswordRecovery, setIsPasswordRecovery] = useState(false);
  const queryClient = useQueryClient();
  const router = useRouter();

  useEffect(() => {
    let lastUserId: string | null = null;
    // Hydrate then subscribe - listener must be set up FIRST per Supabase docs
    const { data: sub } = supabase.auth.onAuthStateChange((event, newSession) => {
      const prevId = lastUserId;
      lastUserId = newSession?.user?.id ?? null;
      setSession(newSession);
      if (event === "INITIAL_SESSION") setLoading(false);
      if (event === "PASSWORD_RECOVERY") {
        setIsPasswordRecovery(true);
        setLoading(false);
        void router.navigate({ to: "/reset-password", replace: true });
        return;
      }
      // Supabase re-emits SIGNED_IN on tab focus; only refetch when the user actually changed.
      if ((event === "SIGNED_IN" && prevId !== lastUserId) || event === "USER_UPDATED") {
        router.invalidate();
        queryClient.invalidateQueries();
      }
      if (event === "SIGNED_OUT") {
        setIsPasswordRecovery(false);
        router.invalidate();
      }
    });

    // Fast local hydration so pages don't wait on the network…
    supabase.auth.getSession().then(({ data }) => {
      lastUserId = data.session?.user?.id ?? null;
      setSession(data.session);
      setLoading(false);
      // …then verify the stored session with the auth server in the background.
      if (data.session) {
        supabase.auth.getUser().then(({ data: u, error }) => {
          if (error || !u.user) { lastUserId = null; setSession(null); }
        }).catch(() => {});
      }
    }).catch(() => setLoading(false));

    return () => sub.subscription.unsubscribe();
  }, [queryClient, router]);

  const value = useMemo<AuthCtx>(
    () => ({
      user: session?.user ?? null,
      session,
      loading,
      isPasswordRecovery,
      signOut: async () => {
        await queryClient.cancelQueries();
        queryClient.clear();
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        await router.navigate({ to: "/auth", replace: true });
      },
    }),
    [session, loading, isPasswordRecovery, queryClient, router]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useAuth must be used inside <AuthProvider>");
  return v;
}

import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async ({ location }) => {
    // Local session read keeps member pages fast; the server re-checks the token on every data call.
    const { data, error } = await supabase.auth.getSession();
    if (error || !data.session?.user) {
      throw redirect({ to: "/auth", search: { mode: "signin", redirect: location.href } });
    }
    return { user: data.session.user };
  },
  component: () => <Outlet />,
});

import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

/**
 * Public - list every heritage_site row (trail stops with coordinates).
 * Used by the live Google Maps Atlas. Read server-side; the table has no public
 * database access.
 */
export const listAllSites = createServerFn({ method: "GET" }).handler(async () => {
  const supabasePublic = createClient<Database>(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_PUBLISHABLE_KEY!,
    { auth: { storage: undefined, persistSession: false, autoRefreshToken: false } }
  );
  void supabasePublic;
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await supabaseAdmin
    .from("heritage_sites")
    .select("id, trail_slug, stop_index, name, place, lat, lng, radius_m, coin_reward")
    .order("trail_slug", { ascending: true })
    .order("stop_index", { ascending: true });
  if (error) throw new Error(error.message);
  return data ?? [];
});

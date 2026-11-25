import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { Database } from "@/integrations/supabase/types";

// ===== Public: list sites for a trail (no auth needed) =====
export const listTrailSites = createServerFn({ method: "GET" })
  .inputValidator((input: { trailSlug: string }) =>
    z.object({ trailSlug: z.string().min(1).max(80) }).parse(input)
  )
  .handler(async ({ data }) => {
    const supabasePublic = createClient<Database>(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_PUBLISHABLE_KEY!,
      { auth: { storage: undefined, persistSession: false, autoRefreshToken: false } }
    );
    void supabasePublic;
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: rows, error } = await supabaseAdmin
      .from("heritage_sites")
      .select("id, trail_slug, stop_index, name, place, lat, lng, radius_m, coin_reward")
      .eq("trail_slug", data.trailSlug)
      .order("stop_index", { ascending: true });
    if (error) throw new Error(error.message);
    return rows ?? [];
  });

// ===== Public: list all rewards =====
export const listRewards = createServerFn({ method: "GET" }).handler(async () => {
  const supabasePublic = createClient<Database>(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_PUBLISHABLE_KEY!,
    { auth: { storage: undefined, persistSession: false, autoRefreshToken: false } }
  );
  const { data, error } = await supabasePublic
    .from("rewards")
    .select("id, code, title, description, category, coins_required, image_emoji, stock")
    .eq("active", true)
    .order("coins_required", { ascending: true });
  if (error) throw new Error(error.message);
  return data ?? [];
});

// ===== Authed: get my coin balance + progress + achievements =====
export const getMyState = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const [coins, progress, achievements, redemptions, profile] = await Promise.all([
      supabase.from("user_coins").select("balance").eq("user_id", userId).maybeSingle(),
      supabase.from("trail_progress").select("site_id, trail_slug, checked_in_at").eq("user_id", userId),
      supabase.from("achievements").select("code, unlocked_at").eq("user_id", userId),
      supabase.from("redemptions").select("id, reward_code, coins_spent, created_at").eq("user_id", userId).order("created_at", { ascending: false }).limit(10),
      supabase.from("profiles").select("full_name, avatar_url").eq("id", userId).maybeSingle(),
    ]);
    return {
      balance: coins.data?.balance ?? 0,
      progress: progress.data ?? [],
      achievements: achievements.data ?? [],
      redemptions: redemptions.data ?? [],
      profile: profile.data,
    };
  });

// ===== Authed: check in at a site =====
export const checkInAtSite = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { siteId: string; lat: number; lng: number; force?: boolean }) =>
    z
      .object({
        siteId: z.string().uuid(),
        lat: z.number().min(-90).max(90),
        lng: z.number().min(-180).max(180),
        force: z.boolean().optional(),
      })
      .parse(input)
  )
  .handler(async ({ data, context }) => {
    const { supabase } = context;
    const { data: result, error } = await supabase.rpc("checkin_at_site", {
      _site_id: data.siteId,
      _lat: data.lat,
      _lng: data.lng,
      _force: data.force ?? false,
    });
    if (error) throw new Error(error.message);
    return result as {
      ok: boolean;
      reason?: string;
      earned?: number;
      balance?: number;
      distance_m?: number;
      required_m?: number;
      trail_done?: number;
      trail_total?: number;
      trail_complete?: boolean;
    };
  });

// ===== Authed: redeem a reward =====
export const redeemReward = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { rewardId: string }) =>
    z.object({ rewardId: z.string().uuid() }).parse(input)
  )
  .handler(async ({ data, context }) => {
    const { supabase } = context;
    const { data: result, error } = await supabase.rpc("redeem_reward", {
      _reward_id: data.rewardId,
    });
    if (error) throw new Error(error.message);
    return result as {
      ok: boolean;
      reason?: string;
      balance?: number;
      required?: number;
      reward_title?: string;
    };
  });

import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { generateText } from "ai";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { createLovableAiGatewayProvider } from "@/lib/ai-gateway.server";
import { buildCatalog, type ItemType, CATEGORIES, REGIONS } from "@/lib/recommendation-catalog";

export type Recommendation = { itemType: ItemType; itemId: string; reason: string };

// ───── Interests ─────
export const getInterests = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const { data } = await supabase
      .from("user_interests")
      .select("categories, regions, onboarded")
      .eq("user_id", userId)
      .maybeSingle();
    return data ?? { categories: [], regions: [], onboarded: false };
  });

export const setInterests = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { categories: string[]; regions: string[] }) =>
    z
      .object({
        categories: z.array(z.string()).max(20),
        regions: z.array(z.string()).max(20),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { error } = await supabase.from("user_interests").upsert({
      user_id: userId,
      categories: data.categories,
      regions: data.regions,
      onboarded: true,
      updated_at: new Date().toISOString(),
    });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// ───── Saves ─────
export const listSaves = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const { data } = await supabase
      .from("user_saves")
      .select("item_type, item_id")
      .eq("user_id", userId);
    return (data ?? []).map((r) => ({ itemType: r.item_type as ItemType, itemId: r.item_id }));
  });

export const toggleSave = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { itemType: ItemType; itemId: string }) =>
    z
      .object({
        itemType: z.enum(["story", "trail", "site"]),
        itemId: z.string().min(1).max(200),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { data: existing } = await supabase
      .from("user_saves")
      .select("id")
      .eq("user_id", userId)
      .eq("item_type", data.itemType)
      .eq("item_id", data.itemId)
      .maybeSingle();
    if (existing) {
      await supabase.from("user_saves").delete().eq("id", existing.id);
      return { saved: false };
    }
    const { error } = await supabase
      .from("user_saves")
      .insert({ user_id: userId, item_type: data.itemType, item_id: data.itemId });
    // Ignore unique-violation races (double-click / concurrent toggle)
    if (error && (error as any).code !== "23505") throw new Error(error.message);
    return { saved: true };
  });

// ───── Recommendations ─────
export const getRecommendations = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { surface: "library" | "trails" | "home" }) =>
    z.object({ surface: z.enum(["library", "trails", "home"]) }).parse(input),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("Missing LOVABLE_API_KEY");

    const [interestsRes, savesRes, progressRes] = await Promise.all([
      supabase.from("user_interests").select("categories, regions").eq("user_id", userId).maybeSingle(),
      supabase.from("user_saves").select("item_type, item_id").eq("user_id", userId),
      supabase
        .from("trail_progress")
        .select("trail_slug, site_id, checked_in_at")
        .eq("user_id", userId)
        .order("checked_in_at", { ascending: false })
        .limit(20),
    ]);

    const interests = interestsRes.data ?? { categories: [], regions: [] };
    const saves = savesRes.data ?? [];
    const progress = progressRes.data ?? [];

    const catalog = buildCatalog();
    // Filter catalog by surface to keep prompt small.
    const filtered = catalog.filter((it) => {
      if (data.surface === "library") return it.type === "story";
      if (data.surface === "trails") return it.type === "trail" || it.type === "site";
      return true; // home — full mix
    });

    const compact = filtered.map((it) => ({
      ref: `${it.type}:${it.id}`,
      title: it.title,
      blurb: it.blurb.slice(0, 140),
      region: it.region,
      category: it.category,
    }));

    const desiredCount = data.surface === "home" ? 8 : 6;

    const userSignals = {
      explicit_interests: {
        categories: interests.categories,
        regions: interests.regions,
      },
      saved_items: saves.map((s) => `${s.item_type}:${s.item_id}`),
      recent_check_ins: progress.map((p) => ({ trail: p.trail_slug, site: p.site_id })),
    };

    const prompt = `You are VIRSA's personalised heritage curator. Recommend exactly ${desiredCount} items from the CATALOG for this user, ranked best first. Each pick must include the item's "ref" string verbatim and a short personalised reason (max 14 words, second person, warm tone, no emoji).

Rules:
- Prefer items matching the user's explicit categories or regions.
- Prefer items related to (but not identical to) what they've saved or checked into.
- Diversify across regions when possible.
- Never recommend an item already in saved_items.
- Output STRICT JSON only, shape: {"items":[{"ref":"type:id","reason":"..."}]}.

USER_SIGNALS:
${JSON.stringify(userSignals)}

CATALOG (${compact.length} items):
${JSON.stringify(compact)}`;

    const gateway = createLovableAiGatewayProvider(key);
    let recs: Recommendation[] = [];

    try {
      const { text } = await generateText({
        model: gateway("google/gemini-3-flash-preview"),
        prompt,
      });
      const cleaned = text.replace(/```json|```/g, "").trim();
      const start = cleaned.indexOf("{");
      const end = cleaned.lastIndexOf("}");
      const json = start >= 0 && end > start ? cleaned.slice(start, end + 1) : cleaned;
      const parsed = JSON.parse(json) as { items?: Array<{ ref: string; reason: string }> };
      const validRefs = new Set(compact.map((c) => c.ref));
      recs = (parsed.items ?? [])
        .filter((p) => validRefs.has(p.ref))
        .map((p) => {
          const [t, ...rest] = p.ref.split(":");
          return { itemType: t as ItemType, itemId: rest.join(":"), reason: p.reason };
        })
        .slice(0, desiredCount);
    } catch (err) {
      console.error("[recommend] AI ranking failed, using fallback", err);
    }

    // Fallback: simple heuristic if AI failed or returned nothing
    if (recs.length === 0) {
      const savedSet = new Set(saves.map((s) => `${s.item_type}:${s.item_id}`));
      const interestCats = new Set(interests.categories.map((c) => c.toLowerCase()));
      const interestRegions = new Set(interests.regions.map((r) => r.toLowerCase()));
      const scored = filtered
        .filter((it) => !savedSet.has(`${it.type}:${it.id}`))
        .map((it) => {
          let s = 0;
          if (it.category && interestCats.has(it.category.toLowerCase())) s += 3;
          if (it.region && interestRegions.has(it.region.toLowerCase())) s += 2;
          s += Math.random() * 0.5;
          return { it, s };
        })
        .sort((a, b) => b.s - a.s)
        .slice(0, desiredCount);
      recs = scored.map(({ it }) => ({
        itemType: it.type,
        itemId: it.id,
        reason: it.region ? `Picked for you from ${it.region}.` : "A new corner of India to explore.",
      }));
    }

    return { recommendations: recs };
  });

export const RECOMMEND_CATEGORIES = CATEGORIES;
export const RECOMMEND_REGIONS = REGIONS;

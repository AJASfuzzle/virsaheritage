import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { Database } from "@/integrations/supabase/types";

const BUCKET = "echoes-media";
const SIGNED_URL_TTL = 60 * 60; // 1 hour

const mediaItem = z.object({
  path: z.string().min(1).max(500),
  type: z.enum(["image", "video"]),
  width: z.number().optional(),
  height: z.number().optional(),
});

function publicClient() {
  return createClient<Database>(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_PUBLISHABLE_KEY!,
    { auth: { storage: undefined, persistSession: false, autoRefreshToken: false } }
  );
}

type Sb = ReturnType<typeof publicClient>;

async function signMedia(sb: Sb, media: unknown): Promise<Array<{ url: string; type: string; path: string }>> {
  const items = Array.isArray(media) ? media : [];
  if (items.length === 0) return [];
  const paths = items.map((m: any) => m.path).filter(Boolean);
  if (paths.length === 0) return [];
  // Media paths come from post rows the caller may read; sign with admin since storage reads are owner-only.
  void sb;
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data } = await supabaseAdmin.storage.from(BUCKET).createSignedUrls(paths, SIGNED_URL_TTL);
  return items.map((m: any) => {
    const signed = data?.find((d) => d.path === m.path);
    return { url: signed?.signedUrl ?? "", type: m.type, path: m.path };
  });
}

async function attachAuthors(sb: Sb, posts: any[]) {
  const ids = Array.from(new Set(posts.map((p) => p.author_id)));
  if (ids.length === 0) return [];
  const { data: profiles } = await sb
    .from("profiles")
    .select("id, full_name, avatar_url, username")
    .in("id", ids);
  const map = new Map((profiles ?? []).map((p: any) => [p.id, p]));
  return posts.map((p) => ({ ...p, author: map.get(p.author_id) ?? null }));
}

// ============ Profile ============
export const getProfile = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { userId: string }) =>
    z.object({ userId: z.string().uuid() }).parse(input)
  )
  .handler(async ({ data, context }) => {
    const { supabase } = context;
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", data.userId)
      .maybeSingle();
    if (error) throw new Error(error.message);

    const { count: postsCount } = await (await import("@/integrations/supabase/client.server")).supabaseAdmin
      .from("echo_posts")
      .select("id", { count: "exact", head: true })
      .eq("author_id", data.userId);

    const { count: followers } = await supabase
      .from("echo_follows")
      .select("follower_id", { count: "exact", head: true })
      .eq("following_id", data.userId);

    const { count: following } = await supabase
      .from("echo_follows")
      .select("following_id", { count: "exact", head: true })
      .eq("follower_id", data.userId);

    let bannerUrl: string | null = null;
    if (profile?.banner_url) {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      const { data: signed } = await supabaseAdmin.storage.from(BUCKET).createSignedUrl(profile.banner_url, SIGNED_URL_TTL);
      bannerUrl = signed?.signedUrl ?? null;
    }
    let avatarUrl: string | null = profile?.avatar_url ?? null;
    // If avatar_url is a storage path (not a full URL), sign it
    if (avatarUrl && !avatarUrl.startsWith("http")) {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      const { data: signed } = await supabaseAdmin.storage.from(BUCKET).createSignedUrl(avatarUrl, SIGNED_URL_TTL);
      avatarUrl = signed?.signedUrl ?? null;
    }

    return {
      profile: profile ? { ...profile, banner_signed_url: bannerUrl, avatar_signed_url: avatarUrl } : null,
      postsCount: postsCount ?? 0,
      followers: followers ?? 0,
      following: following ?? 0,
    };
  });

export const updateProfile = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: {
    full_name?: string;
    username?: string;
    bio?: string;
    interests?: string[];
    location?: string;
    heritage_origins?: string[];
    languages?: string[];
    social_links?: Record<string, string>;
    website?: string;
    banner_url?: string;
    avatar_url?: string;
  }) =>
    z.object({
      full_name: z.string().max(80).optional(),
      username: z.string().min(2).max(40).regex(/^[a-z0-9_.]+$/).optional(),
      bio: z.string().max(500).optional(),
      interests: z.array(z.string().max(40)).max(20).optional(),
      location: z.string().max(120).optional(),
      heritage_origins: z.array(z.string().max(60)).max(10).optional(),
      languages: z.array(z.string().max(40)).max(15).optional(),
      social_links: z.record(z.string(), z.string().max(200)).optional(),
      website: z.string().max(200).optional(),
      banner_url: z.string().max(500).optional(),
      avatar_url: z.string().max(500).optional(),
    }).parse(input)
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { error } = await supabase
      .from("profiles")
      .upsert({ id: userId, ...data, updated_at: new Date().toISOString() }, { onConflict: "id" });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// ============ Posts ============
export const createPost = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: {
    title?: string;
    caption?: string;
    story?: string;
    media: Array<{ path: string; type: "image" | "video" }>;
    category?: string;
    state?: string;
    location?: string;
    tags?: string[];
    submitToLibrary?: boolean;
  }) =>
    z.object({
      title: z.string().max(140).optional(),
      caption: z.string().max(2200).optional(),
      story: z.string().max(20000).optional(),
      media: z.array(mediaItem).max(10).default([]),
      category: z.string().max(60).optional(),
      state: z.string().max(60).optional(),
      location: z.string().max(160).optional(),
      tags: z.array(z.string().max(40)).max(15).optional(),
      submitToLibrary: z.boolean().optional(),
    }).parse(input)
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const mediaType =
      data.media.length === 0 ? "text"
      : data.media.length > 1 && data.media.some((m) => m.type !== data.media[0].type) ? "mixed"
      : data.media[0].type === "video" ? "video" : "photo";

    const { data: post, error } = await supabase
      .from("echo_posts")
      .insert({
        author_id: userId,
        title: data.title ?? null,
        caption: data.caption ?? null,
        story: data.story ?? null,
        media: data.media,
        media_type: mediaType,
        category: data.category ?? null,
        state: data.state ?? null,
        location: data.location ?? null,
        tags: data.tags ?? [],
        submitted_to_library: !!data.submitToLibrary,
        submitted_to_library_at: data.submitToLibrary ? new Date().toISOString() : null,
      })
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    return { id: post.id };
  });

export const deletePost = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { postId: string }) =>
    z.object({ postId: z.string().uuid() }).parse(input)
  )
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("echo_posts").delete().eq("id", data.postId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const listFeed = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { limit?: number; category?: string; state?: string; authorId?: string; libraryOnly?: boolean }) =>
    z.object({
      limit: z.number().int().min(1).max(50).default(20),
      category: z.string().optional(),
      state: z.string().optional(),
      authorId: z.string().uuid().optional(),
      libraryOnly: z.boolean().optional(),
    }).parse(input ?? {})
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    // Shared feed: caller is authenticated; read via server with fixed filters.
    let q = (await import("@/integrations/supabase/client.server")).supabaseAdmin
      .from("echo_posts")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(data.limit);
    if (data.category) q = q.eq("category", data.category);
    if (data.state) q = q.eq("state", data.state);
    if (data.authorId) q = q.eq("author_id", data.authorId);
    if (data.libraryOnly) q = q.eq("submitted_to_library", true);
    const { data: posts, error } = await q;
    if (error) throw new Error(error.message);

    const ids = (posts ?? []).map((p) => p.id);
    const [likes, saves] = await Promise.all([
      ids.length ? supabase.from("echo_likes").select("post_id").eq("user_id", userId).in("post_id", ids) : Promise.resolve({ data: [] as any[] }),
      ids.length ? supabase.from("echo_saves").select("post_id").eq("user_id", userId).in("post_id", ids) : Promise.resolve({ data: [] as any[] }),
    ]);
    const likedSet = new Set((likes.data ?? []).map((r: any) => r.post_id));
    const savedSet = new Set((saves.data ?? []).map((r: any) => r.post_id));

    const withAuthors = await attachAuthors(supabase as unknown as Sb, posts ?? []);
    const enriched = await Promise.all(
      withAuthors.map(async (p: any) => ({
        ...p,
        media_signed: await signMedia(supabase as unknown as Sb, p.media),
        liked_by_me: likedSet.has(p.id),
        saved_by_me: savedSet.has(p.id),
      }))
    );
    return enriched;
  });

export const getPost = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { postId: string }) =>
    z.object({ postId: z.string().uuid() }).parse(input)
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { data: post, error } = await (await import("@/integrations/supabase/client.server")).supabaseAdmin.from("echo_posts").select("*").eq("id", data.postId).maybeSingle();
    if (error) throw new Error(error.message);
    if (!post) return null;
    const [authors, liked, saved] = await Promise.all([
      attachAuthors(supabase as unknown as Sb, [post]),
      supabase.from("echo_likes").select("post_id").eq("user_id", userId).eq("post_id", post.id).maybeSingle(),
      supabase.from("echo_saves").select("post_id").eq("user_id", userId).eq("post_id", post.id).maybeSingle(),
    ]);
    return {
      ...authors[0],
      media_signed: await signMedia(supabase as unknown as Sb, post.media),
      liked_by_me: !!liked.data,
      saved_by_me: !!saved.data,
    };
  });

// ============ Likes / Saves ============
export const toggleLike = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { postId: string }) =>
    z.object({ postId: z.string().uuid() }).parse(input)
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { data: existing } = await supabase.from("echo_likes").select("post_id").eq("user_id", userId).eq("post_id", data.postId).maybeSingle();
    if (existing) {
      await supabase.from("echo_likes").delete().eq("user_id", userId).eq("post_id", data.postId);
      return { liked: false };
    }
    await supabase.from("echo_likes").insert({ user_id: userId, post_id: data.postId });
    return { liked: true };
  });

export const toggleSave = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { postId: string }) =>
    z.object({ postId: z.string().uuid() }).parse(input)
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { data: existing } = await supabase.from("echo_saves").select("post_id").eq("user_id", userId).eq("post_id", data.postId).maybeSingle();
    if (existing) {
      await supabase.from("echo_saves").delete().eq("user_id", userId).eq("post_id", data.postId);
      return { saved: false };
    }
    await supabase.from("echo_saves").insert({ user_id: userId, post_id: data.postId });
    return { saved: true };
  });

export const submitToLibrary = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { postId: string }) =>
    z.object({ postId: z.string().uuid() }).parse(input)
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { error } = await supabase
      .from("echo_posts")
      .update({ submitted_to_library: true, submitted_to_library_at: new Date().toISOString() })
      .eq("id", data.postId)
      .eq("author_id", userId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const listSaved = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const { data: saves } = await supabase
      .from("echo_saves")
      .select("post_id, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(50);
    const ids = (saves ?? []).map((s) => s.post_id);
    if (!ids.length) return [];
    const { data: posts } = await (await import("@/integrations/supabase/client.server")).supabaseAdmin.from("echo_posts").select("*").in("id", ids);
    const withAuthors = await attachAuthors(supabase as unknown as Sb, posts ?? []);
    const enriched = await Promise.all(
      withAuthors.map(async (p: any) => ({
        ...p,
        media_signed: await signMedia(supabase as unknown as Sb, p.media),
        liked_by_me: false,
        saved_by_me: true,
      }))
    );
    // Re-order to saves order
    const order = new Map(ids.map((id, i) => [id, i]));
    enriched.sort((a, b) => (order.get(a.id) ?? 0) - (order.get(b.id) ?? 0));
    return enriched;
  });

// ============ Comments ============
export const listComments = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { postId: string }) =>
    z.object({ postId: z.string().uuid() }).parse(input)
  )
  .handler(async ({ data, context }) => {
    const { supabase } = context;
    const { data: comments, error } = await (await import("@/integrations/supabase/client.server")).supabaseAdmin
      .from("echo_comments")
      .select("*")
      .eq("post_id", data.postId)
      .order("created_at", { ascending: true });
    if (error) throw new Error(error.message);
    const ids = Array.from(new Set((comments ?? []).map((c) => c.author_id)));
    const { data: profiles } = ids.length
      ? await supabase.from("profiles").select("id, full_name, avatar_url, username").in("id", ids)
      : { data: [] as any[] };
    const map = new Map((profiles ?? []).map((p: any) => [p.id, p]));
    return (comments ?? []).map((c: any) => ({ ...c, author: map.get(c.author_id) ?? null }));
  });

export const addComment = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { postId: string; content: string; parentCommentId?: string }) =>
    z.object({
      postId: z.string().uuid(),
      content: z.string().min(1).max(1000).trim(),
      parentCommentId: z.string().uuid().optional(),
    }).parse(input)
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { data: row, error } = await supabase
      .from("echo_comments")
      .insert({
        post_id: data.postId,
        author_id: userId,
        content: data.content,
        parent_comment_id: data.parentCommentId ?? null,
      })
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    return { id: row.id };
  });

// ============ Library bridge (public, no auth required) ============
export const listLibraryEchoes = createServerFn({ method: "GET" })
  .inputValidator((input: { limit?: number }) =>
    z.object({ limit: z.number().int().min(1).max(30).default(12) }).parse(input ?? {})
  )
  .handler(async ({ data }) => {
    // Only library-submitted posts and limited author fields are exposed here.
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const sb = supabaseAdmin as unknown as Sb;
    const { data: posts, error } = await sb
      .from("echo_posts")
      .select("id, title, caption, media, category, state, created_at, author_id, likes_count")
      .eq("submitted_to_library", true)
      .order("submitted_to_library_at", { ascending: false })
      .limit(data.limit);
    if (error) throw new Error(error.message);

    const withAuthors = await attachAuthors(sb, posts ?? []);
    // Sign media with publishable client - may return null for private bucket; we use admin fallback if needed
    const enriched = await Promise.all(
      withAuthors.map(async (p: any) => {
        let signed = await signMedia(sb, p.media);
        if (signed.some((m) => !m.url)) {
          // fallback to admin for any unsigned (private bucket)
          const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
          signed = await signMedia(supabaseAdmin as unknown as Sb, p.media);
        }
        return { ...p, media_signed: signed };
      })
    );
    return enriched;
  });

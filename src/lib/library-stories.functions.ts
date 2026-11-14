import { createServerFn } from "@tanstack/react-start";
import { streamText } from "ai";
import { z } from "zod";
import { HERITAGE_STORY_BY_ID } from "@/lib/library-heritage-stories";

const SYSTEM = `You are a careful folklorist and historian writing for VIRSA, an Indian heritage archive.
Retell the requested story faithfully, following the documented version in the named source. Never invent plot points, characters, names or customs that are not part of the recorded tradition. If versions differ, say so briefly. If you are unsure of a detail, leave it out rather than guess.
Write in warm, clear English prose, 450-650 words, in 5-7 paragraphs separated by blank lines. Keep culturally significant terms in their original language with a short gloss on first use.
Structure: open with the story itself; then a paragraph of background (where it is told, by whom, in which language, and when or how it is performed or remembered); end with one short line beginning "Source:" naming the documented source. No headings, no markdown, no bullet points.`;

export const getHeritageStoryBody = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => z.object({ id: z.string().min(3).max(120) }).parse(d))
  .handler(async ({ data }) => {
    const meta = HERITAGE_STORY_BY_ID[data.id];
    if (!meta) throw new Error("Story not found");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: row } = await supabaseAdmin
      .from("library_story_bodies").select("body").eq("story_id", data.id).maybeSingle();
    if (row?.body) return { body: row.body };

    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("Story service is not configured.");
    const { createOpenAI } = await import("@ai-sdk/openai");
    const openai = createOpenAI({
      baseURL: "https://ai.gateway.lovable.dev/v1",
      apiKey: key,
      headers: { "Lovable-API-Key": key, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
    });
    const result = streamText({
      model: openai.responses("openai/gpt-6-astra"),
      providerOptions: {
        openai: {
          forceReasoning: true,
          reasoningEffort: "low",
          reasoningSummary: "auto",
          store: false,
          include: ["reasoning.encrypted_content"],
        },
      },
      system: SYSTEM,
      prompt: `Story: ${meta.title}\nSummary: ${meta.blurb}\nRegion: ${meta.region}\nLanguage of origin: ${meta.language}\nDocumented source: ${meta.source}`,
    });
    let text = "";
    for await (const chunk of result.textStream) text += chunk;
    const body = text.trim();
    if (body.length < 200) throw new Error("Story could not be prepared just now.");
    await supabaseAdmin.from("library_story_bodies").upsert({ story_id: data.id, body });
    return { body };
  });

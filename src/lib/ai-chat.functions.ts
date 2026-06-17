import { createServerFn } from "@tanstack/react-start";
import { generateText } from "ai";
import { z } from "zod";

const ChatInput = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().min(1).max(4000),
      }),
    )
    .min(1)
    .max(30),
});

const SYSTEM_PROMPT = `You are VIRSA, an AI Heritage Assistant devoted to India's living cultural memory: its languages, festivals, folk arts, crafts, recipes, music, dance, oral histories, regional traditions and the stories behind them.

Answer in a warm, informative, research-grade tone. Be concrete: name specific regions, communities, time periods, ingredients, instruments, ragas, dances, weaves, deities, dialects and historical context where relevant. Prefer 2–5 short paragraphs or a tight bulleted list. Cite the cultural lineage when you can ("Mithila / Madhubani painting from north Bihar…"). When something is contested or uncertain, say so briefly.

Stay focused on Indian heritage. Politely redirect off-topic questions back to culture, history, language, food, music or tradition. Never invent sources or fake citations.`;

export const askVirsa = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => ChatInput.parse(input))
  .handler(async ({ data }) => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("AI service is not configured.");

    const { createLovableAiGatewayProvider } = await import("./ai-gateway.server");
    const gateway = createLovableAiGatewayProvider(key);

    try {
      const { text } = await generateText({
        model: gateway("google/gemini-3-flash-preview"),
        system: SYSTEM_PROMPT,
        messages: data.messages,
      });
      return { reply: text };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes("429")) throw new Error("The assistant is busy — please try again in a moment.");
      if (msg.includes("402")) throw new Error("AI credits exhausted. Please top up to keep chatting.");
      throw new Error("Sorry, the assistant could not respond just now.");
    }
  });

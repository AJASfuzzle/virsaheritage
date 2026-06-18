import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const synthesizePhrase = createServerFn({ method: "POST" })
  .inputValidator((data) =>
    z.object({
      text: z.string().min(1).max(200),
      instructions: z.string().max(400).optional(),
    }).parse(data)
  )
  .handler(async ({ data }) => {
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) throw new Error("LOVABLE_API_KEY missing");

    const res = await fetch("https://ai.gateway.lovable.dev/v1/audio/speech", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "openai/gpt-4o-mini-tts",
        input: data.text,
        voice: "sage",
        response_format: "mp3",
        instructions:
          data.instructions ??
          "Speak slowly, warmly and reverently, like an elder keeper of an endangered Indian language sharing a single short phrase. Pronounce each syllable clearly.",
      }),
    });

    if (!res.ok) {
      const msg = await res.text().catch(() => "");
      throw new Error(`TTS failed: ${res.status} ${msg}`);
    }

    const buf = await res.arrayBuffer();
    const base64 = Buffer.from(buf).toString("base64");
    return { audio: `data:audio/mpeg;base64,${base64}` };
  });

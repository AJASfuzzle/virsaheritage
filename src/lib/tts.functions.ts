import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

// Default warm female voice - Sarah from ElevenLabs.
const DEFAULT_VOICE_ID = "EXAVITQu4vr4xnSDxMaL";

export const synthesizePhrase = createServerFn({ method: "POST" })
  .inputValidator((data) =>
    z.object({
      text: z.string().min(1).max(400),
      instructions: z.string().max(400).optional(),
      voiceId: z.string().optional(),
    }).parse(data)
  )
  .handler(async ({ data }) => {
    const apiKey = process.env.ELEVENLABS_API_KEY;
    if (!apiKey) throw new Error("ELEVENLABS_API_KEY missing - connect ElevenLabs.");

    const voiceId = data.voiceId ?? DEFAULT_VOICE_ID;

    const res = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}?output_format=mp3_44100_128`,
      {
        method: "POST",
        headers: {
          "xi-api-key": apiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: data.text,
          model_id: "eleven_multilingual_v2",
          // Tuned for a human, lived-in delivery - low stability lets the
          // voice breathe and inflect, high similarity keeps it anchored
          // to the speaker's real timbre, a touch of style adds warmth,
          // and a slightly slower pace reads as reverent rather than rushed.
          voice_settings: {
            stability: 0.28,
            similarity_boost: 0.92,
            style: 0.55,
            use_speaker_boost: true,
            speed: 0.88,
          },
        }),
      }
    );

    if (!res.ok) {
      const msg = await res.text().catch(() => "");
      throw new Error(`ElevenLabs TTS failed: ${res.status} ${msg}`);
    }

    const buf = await res.arrayBuffer();
    const base64 = Buffer.from(buf).toString("base64");
    return { audio: `data:audio/mpeg;base64,${base64}` };
  });

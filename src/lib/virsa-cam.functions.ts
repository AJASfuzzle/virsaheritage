import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const lang = z.enum(["en", "hi", "pa"]);

export const askMonument = createServerFn({ method: "POST" })
  .inputValidator(z.object({ captureId: z.string().uuid(), question: z.string().min(1).max(500), language: lang }))
  .handler(async ({ data }) => {
    const { askAboutCapture } = await import("./virsa-cam.server");
    return askAboutCapture(data.captureId, data.question, data.language);
  });

import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const lang = z.enum(["en", "hi", "pa"]);

export const identifyPhoneUpload = createServerFn({ method: "POST" })
  .inputValidator(z.object({ base64: z.string().min(10).max(14_000_000), mime: z.string().max(50), language: lang }))
  .handler(async ({ data }) => {
    const { identifyAndSave } = await import("./virsa-cam.server");
    const bin = atob(data.base64);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return identifyAndSave(bytes, data.mime.startsWith("image/") ? data.mime : "image/jpeg", data.language);
  });

export const askMonument = createServerFn({ method: "POST" })
  .inputValidator(z.object({ captureId: z.string().uuid(), question: z.string().min(1).max(500), language: lang }))
  .handler(async ({ data }) => {
    const { askAboutCapture } = await import("./virsa-cam.server");
    return askAboutCapture(data.captureId, data.question, data.language);
  });

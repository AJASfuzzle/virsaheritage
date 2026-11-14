import { createServerFn } from "@tanstack/react-start";

/** Returns the referrer-restricted Google Maps browser key (safe for the frontend). */
export const getMapsBrowserKey = createServerFn({ method: "GET" }).handler(async () => {
  return { key: process.env["GOOGLE_API_KEY"] ?? null };
});

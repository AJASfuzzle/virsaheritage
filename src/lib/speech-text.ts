// Sentence helpers for VIRSA Cam narration: de-duplicate repeated sentences and drop a leading name/location echo.
export function splitSentences(text: string): string[] {
  return (text.match(/[^.!?]+[.!?]+["')\]]*|[^.!?]+$/g) ?? []).map((s) => s.trim()).filter(Boolean);
}
const norm = (s: string) => s.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, " ").trim();
export function dedupeSentences(text: string): string {
  const seen = new Set<string>();
  return splitSentences(text).filter((s) => { const k = norm(s); if (!k || seen.has(k)) return false; seen.add(k); return true; }).join(" ");
}
export function cleanDescription(desc: string | null | undefined, name?: string | null, location?: string | null): string {
  let parts = splitSentences(dedupeSentences(desc ?? ""));
  const echo = new Set([name, location, [name, location].filter(Boolean).join(" ")].filter(Boolean).map((x) => norm(x!)));
  while (parts.length > 1 && echo.has(norm(parts[0]))) parts = parts.slice(1);
  return parts.join(" ");
}

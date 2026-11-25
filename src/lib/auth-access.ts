import { z } from "zod";

export const passwordSchema = z.string().min(8, "Password must be at least 8 characters").max(72, "Password must be at most 72 characters");

export function safeAuthRedirect(path?: string): string {
  if (!path?.startsWith("/") || path.startsWith("//") || path.includes("\\") || /[\u0000-\u001f]/.test(path)) return "/dashboard";
  if (/^\/(auth|reset-password)(?:[/?#]|$)/.test(path)) return "/dashboard";
  return path;
}

export function signupNeedsConfirmation(session: unknown): boolean {
  return session == null;
}

export function validatePasswordChange(password: string, confirmation: string): string | null {
  const result = passwordSchema.safeParse(password);
  if (!result.success) return result.error.issues[0]?.message ?? "Enter a valid password";
  return password === confirmation ? null : "Passwords do not match";
}
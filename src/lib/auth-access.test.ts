import { describe, expect, it } from "vitest";
import { safeAuthRedirect, signupNeedsConfirmation, validatePasswordChange } from "./auth-access";

describe("account access", () => {
  it("keeps unconfirmed signups out of protected pages", () => {
    expect(signupNeedsConfirmation(null)).toBe(true);
    expect(signupNeedsConfirmation({ user: { id: "confirmed" } })).toBe(false);
  });
  it("preserves a local return path but blocks external and login-loop destinations", () => {
    expect(safeAuthRedirect("/echoes/new")).toBe("/echoes/new");
    expect(safeAuthRedirect("//outside.example")).toBe("/dashboard");
    expect(safeAuthRedirect("/\\outside.example")).toBe("/dashboard");
    expect(safeAuthRedirect("/auth?mode=signin")).toBe("/dashboard");
    expect(safeAuthRedirect("/reset-password")).toBe("/dashboard");
  });
  it("rejects short passwords and mismatched confirmation", () => {
    expect(validatePasswordChange("short", "short")).toBe("Password must be at least 8 characters");
    expect(validatePasswordChange("ValidPassword12", "DifferentPassword12")).toBe("Passwords do not match");
    expect(validatePasswordChange("ValidPassword12", "ValidPassword12")).toBeNull();
  });
});
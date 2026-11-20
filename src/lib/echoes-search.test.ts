import { describe, expect, it } from "vitest";
import { echoSearchFilter, echoSearchPattern, matchesEcho } from "./echoes-search";

const post = { author: { full_name: "Aarav Anand" }, title: "Holi memories", caption: "A family celebration", story: "Grandmother's colours", category: "Festivals" };

describe("Echoes search", () => {
  it("matches Aarav Anand by full name and lowercase partial name", () => {
    expect(matchesEcho(post, "Aarav Anand")).toBe(true);
    expect(matchesEcho(post, "aarav")).toBe(true);
    expect(matchesEcho(post, "Meera")).toBe(false);
  });
  it("searches title, caption and full story with partial case-insensitive matches", () => {
    for (const query of ["HOLI", "celebrat", "grandmother"]) expect(matchesEcho(post, query)).toBe(true);
    expect(matchesEcho(post, "nonexistent word")).toBe(false);
  });
  it("combines search and category without widening results", () => {
    expect(matchesEcho(post, "aarav", "Festivals")).toBe(true);
    expect(matchesEcho(post, "aarav", "Food Heritage")).toBe(false);
    expect(matchesEcho(post, "", "All")).toBe(true);
  });
  it("escapes wildcards and quotes user text in server filters", () => {
    expect(echoSearchPattern("100%_\\")).toBe("%100\\%\\_\\\\%");
    expect(echoSearchFilter('aarav",story.neq.null', ["not-a-uuid"]))
      .toBe('title.ilike."%aarav\\",story.neq.null%",caption.ilike."%aarav\\",story.neq.null%",story.ilike."%aarav\\",story.neq.null%"');
  });
});
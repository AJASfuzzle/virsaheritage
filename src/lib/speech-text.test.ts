import { describe, it, expect } from "vitest";
import { dedupeSentences, cleanDescription, splitSentences } from "./speech-text";
describe("speech-text", () => {
  it("removes repeated sentences", () => {
    expect(dedupeSentences("Built in 1632. It is white. Built in 1632. It is white.")).toBe("Built in 1632. It is white.");
  });
  it("drops a leading name echo", () => {
    expect(cleanDescription("Taj Mahal. A marble tomb in Agra.", "Taj Mahal", "Agra")).toBe("A marble tomb in Agra.");
  });
  it("splits sentences in order", () => {
    expect(splitSentences("One. Two! Three")).toEqual(["One.", "Two!", "Three"]);
  });
});

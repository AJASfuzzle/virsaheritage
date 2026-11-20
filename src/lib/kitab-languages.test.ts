import { describe, expect, it } from "vitest";
import { additionalLanguages } from "./kitab-additions";
import { filterLanguages, LANGUAGE_COUNT, languages } from "./kitab-languages";

const requested = [
  "Hindi", "Bengali", "Marathi", "Telugu", "Tamil", "Gujarati", "Urdu", "Kannada", "Malayalam", "Punjabi",
  "Garhwali", "Kumaoni", "Rajasthani (Marwari)", "Chhattisgarhi", "Magahi", "Awadhi", "Bundeli", "Haryanvi", "Kinnauri", "Sora (Saora)", "Kui", "Kuvi", "Juang", "Birhor", "Asur", "Kharia", "Malto", "Sadri (Nagpuri)", "Lambadi (Banjara)", "Kota", "Kurumba", "Paniya", "Beary", "Adi", "Galo", "Monpa", "Wancho", "Nocte", "Tangsa", "Sherdukpen", "Thadou (Kuki)", "Hmar", "Sumi (Sema)", "Rengma", "Dimasa", "Rabha", "Tiwa", "Toto", "Onge",
  "Italian", "Greek", "Hebrew", "Burmese", "Khmer", "Vietnamese", "Malay", "Filipino (Tagalog)", "Hausa", "Yoruba", "Zulu", "Amharic", "Quechua", "Māori", "Welsh", "Irish", "Basque", "Ainu",
];

describe("Kitab expansion", () => {
  it("contains each of the 67 requested languages exactly once", () => {
    for (const name of requested) expect(languages.filter((l) => l.name === name)).toHaveLength(1);
    expect(new Set(languages.map((l) => l.name.toLowerCase())).size).toBe(languages.length);
  });
  it("keeps the original 62 entries and derives the real total of 129", () => {
    expect(additionalLanguages).toHaveLength(67);
    expect(LANGUAGE_COUNT).toBe(129);
    expect(filterLanguages("All")).toHaveLength(129);
  });
  it("classifies new Indian and International entries through the existing filters", () => {
    expect(filterLanguages("Indian")).toHaveLength(95);
    expect(filterLanguages("International")).toHaveLength(34);
    expect(filterLanguages("Indian").some((l) => l.name === "Hindi")).toBe(true);
    expect(filterLanguages("International").some((l) => l.name === "Ainu")).toBe(true);
  });
  it("marks new endangered entries only with assessment evidence", () => {
    const endangered = additionalLanguages.filter((l) => l.status === "Endangered");
    expect(endangered.map((l) => l.name).sort()).toEqual(["Ainu", "Birhor", "Kota", "Onge", "Toto"]);
    for (const entry of endangered) {
      expect(entry.statusSource).toMatch(/^https:\/\//);
      expect(entry.sources).toContain(entry.statusSource);
      expect(filterLanguages("Endangered")).toContainEqual(expect.objectContaining({ name: entry.name }));
    }
    expect(additionalLanguages.find((l) => l.name === "Monpa")?.status).toBeUndefined();
  });
  it("omits unverified phrases and totals rather than borrowing neighbouring languages", () => {
    expect(additionalLanguages.find((l) => l.name === "Onge")?.phrase).toBeUndefined();
    expect(additionalLanguages.find((l) => l.name === "Kurumba")?.speakers).toBeUndefined();
    expect(additionalLanguages.find((l) => l.name === "Hmar")?.phrase).toBe("Chibai");
    expect(additionalLanguages.every((l) => l.sources.length > 0)).toBe(true);
  });
});
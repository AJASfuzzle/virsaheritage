// Lightweight catalog of recommendable items.
// Used both client-side (to render recommended cards) and server-side
// (to feed Gemini a compact list of available content + signals).

import { trails } from "@/lib/trails-data";
import { heritageSites } from "@/lib/heritage-sites";
import { LIBRARY_STORIES_META } from "@/lib/library-stories-meta";

export type ItemType = "story" | "trail" | "site";

export type CatalogItem = {
  type: ItemType;
  id: string;
  title: string;
  blurb: string;
  region?: string;
  category?: string; // shelf / kind / category
  tags?: string[];
};

export const CATEGORIES = [
  "Family Stories",
  "Civilizations",
  "Languages",
  "Festivals",
  "Architecture",
  "Crafts",
  "Food",
  "Music",
  "Performance",
  "Temples",
  "Nature",
] as const;

export const REGIONS = [
  "North India",
  "South India",
  "East India",
  "West India",
  "Northeast India",
  "Himalayas",
  "Coastal India",
  "Deccan",
] as const;

export function buildCatalog(): CatalogItem[] {
  const stories: CatalogItem[] = LIBRARY_STORIES_META.map((s) => ({
    type: "story",
    id: s.id,
    title: s.title,
    blurb: s.blurb,
    region: s.region,
    category: s.shelf,
    tags: s.tag ? [s.tag] : [],
  }));

  const trailItems: CatalogItem[] = trails.map((t) => ({
    type: "trail",
    id: t.slug,
    title: t.title,
    blurb: t.hook ?? t.intro.slice(0, 160),
    region: t.region,
    category: t.kind,
    tags: [t.kind, t.bestSeason],
  }));

  const siteItems: CatalogItem[] = heritageSites.map((s) => ({
    type: "site",
    id: s.id,
    title: s.name,
    blurb: s.shortDescription ?? "",
    region: s.region,
    category: s.category,
    tags: s.category ? [s.category] : [],
  }));

  return [...stories, ...trailItems, ...siteItems];
}

export function indexCatalog(items: CatalogItem[]) {
  const map = new Map<string, CatalogItem>();
  for (const it of items) map.set(`${it.type}:${it.id}`, it);
  return map;
}

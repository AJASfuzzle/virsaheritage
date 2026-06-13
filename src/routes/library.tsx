import { createFileRoute } from "@tanstack/react-router";
import { Traditions } from "@/components/site/Traditions";
import { Features } from "@/components/site/Features";

export const Route = createFileRoute("/library")({
  head: () => ({
    meta: [
      { title: "Living Library — KAAL" },
      { name: "description", content: "A curated digital archive of India's foods, recipes, dances, crafts, architecture and folklore." },
      { property: "og:title", content: "Living Library — KAAL" },
      { property: "og:description", content: "Featured traditions and the ten ways KAAL helps a country remember itself." },
    ],
  }),
  component: LibraryPage,
});

function LibraryPage() {
  return (
    <div className="pt-24">
      <Traditions />
      <Features />
    </div>
  );
}

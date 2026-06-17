import { createFileRoute } from "@tanstack/react-router";
import { HeritageAtlas } from "@/components/site/HeritageAtlas";
import { IndiaMap } from "@/components/site/IndiaMap";
import { Timeline } from "@/components/site/Timeline";

export const Route = createFileRoute("/atlas")({
  head: () => ({
    meta: [
      { title: "Heritage Atlas — KAAL" },
      { name: "description", content: "An interactive map of India's cultural and natural heritage — monuments, sanctuaries and living traditions, pin by pin." },
      { property: "og:title", content: "Heritage Atlas — KAAL" },
      { property: "og:description", content: "Explore India's cultural and natural heritage on an interactive curated map." },
    ],
  }),
  component: AtlasPage,
});

function AtlasPage() {
  return (
    <div className="pt-20">
      <HeritageAtlas />
      <IndiaMap />
      <Timeline />
    </div>
  );
}

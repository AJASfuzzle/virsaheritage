import { createFileRoute } from "@tanstack/react-router";
import { IndiaMap } from "@/components/site/IndiaMap";
import { Timeline } from "@/components/site/Timeline";

export const Route = createFileRoute("/atlas")({
  head: () => ({
    meta: [
      { title: "Heritage Atlas — KAAL" },
      { name: "description", content: "An interactive map of India's heritage across two centuries — kingdoms, presidencies, states and the crafts that live in each." },
      { property: "og:title", content: "Heritage Atlas — KAAL" },
      { property: "og:description", content: "Walk through two centuries of India on an interactive cultural map." },
    ],
  }),
  component: AtlasPage,
});

function AtlasPage() {
  return (
    <div className="pt-20 [&>section:first-child]:!pt-6 sm:[&>section:first-child]:!pt-10">
      <IndiaMap />
      <Timeline />
    </div>
  );
}

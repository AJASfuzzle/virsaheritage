import { createFileRoute } from "@tanstack/react-router";
import { Trails } from "@/components/site/Trails";

export const Route = createFileRoute("/trails/")({
  head: () => ({
    meta: [
      { title: "Heritage Trails — KAAL" },
      { name: "description", content: "AI-generated heritage itineraries through India — food trails, temple trails, craft villages and festival loops." },
      { property: "og:title", content: "Heritage Trails — KAAL" },
      { property: "og:description", content: "Tourism guided by memory, not maps." },
    ],
  }),
  component: TrailsIndex,
});

function TrailsIndex() {
  return (
    <div className="pt-20 [&>section:first-child]:!pt-6 sm:[&>section:first-child]:!pt-10">
      <Trails />
    </div>
  );
}

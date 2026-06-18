import { createFileRoute } from "@tanstack/react-router";
import { Trails } from "@/components/site/Trails";
import { RecommendationsRow } from "@/components/recs/RecommendationsRow";

export const Route = createFileRoute("/trails/")({
  head: () => ({
    meta: [
      { title: "Heritage Trails — VIRSA" },
      { name: "description", content: "AI-generated heritage itineraries through India — food trails, temple trails, craft villages and festival loops." },
      { property: "og:title", content: "Heritage Trails — VIRSA" },
      { property: "og:description", content: "Tourism guided by memory, not maps." },
    ],
  }),
  component: TrailsIndex,
});

function TrailsIndex() {
  return (
    <div className="pt-20 [&>section:first-child]:!pt-6 sm:[&>section:first-child]:!pt-10">
      <RecommendationsRow
        surface="trails"
        title="Sites for you"
        subtitle="Heritage sites Virsa AI thinks you'll love — tap one to open it on the curated atlas."
        filterType="site"
      />
      <RecommendationsRow
        surface="trails"
        title="Trails for you"
        subtitle="Virsa AI suggests trails and stops aligned with where you've been and what you love."
        filterType="trail"
      />
      <Trails />
    </div>
  );
}

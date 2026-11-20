import { createFileRoute } from "@tanstack/react-router";
import { Hero } from "@/components/site/Hero";
import { Stats } from "@/components/site/Stats";
import { RecommendationsRow } from "@/components/recs/RecommendationsRow";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "VIRSA - India's Living Memory & Heritage Atlas" },
      {
        name: "description",
        content:
          "VIRSA preserves India's languages, stories, recipes, festivals and traditions on an AI-powered cultural memory map.",
      },
      { property: "og:title", content: "VIRSA - India's Living Memory & Heritage Atlas" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      {
        property: "og:description",
        content:
          "An AI-powered atlas of India's heritage - languages, stories, festivals and crafts, mapped across geography and time.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <>
      <Hero />
      <RecommendationsRow
        surface="home"
        title="Your Virsa, for you"
        subtitle="Stories, trails and heritage sites ranked by Virsa AI from your interests and check-ins."
      />
      <Stats />
    </>
  );
}

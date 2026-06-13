import { createFileRoute } from "@tanstack/react-router";
import { Hero } from "@/components/site/Hero";
import { Stats } from "@/components/site/Stats";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "KAAL — India's Living Memory & Heritage Atlas" },
      {
        name: "description",
        content:
          "KAAL preserves India's languages, stories, recipes, festivals and traditions on an AI-powered cultural memory map.",
      },
      { property: "og:title", content: "KAAL — India's Living Memory & Heritage Atlas" },
      {
        property: "og:description",
        content:
          "An AI-powered atlas of India's heritage — languages, stories, festivals and crafts, mapped across geography and time.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <>
      <Hero />
      <Stats />
    </>
  );
}

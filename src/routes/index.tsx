import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Hero } from "@/components/site/Hero";
import { Stats } from "@/components/site/Stats";
import { Traditions } from "@/components/site/Traditions";
import { IndiaMap } from "@/components/site/IndiaMap";
import { Timeline } from "@/components/site/Timeline";
import { Features } from "@/components/site/Features";
import { Shruti } from "@/components/site/Shruti";
import { Assistant } from "@/components/site/Assistant";
import { Trails } from "@/components/site/Trails";
import { Contribute } from "@/components/site/Contribute";
import { Footer } from "@/components/site/Footer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "KAAL — India's Living Memory & Heritage Atlas" },
      {
        name: "description",
        content:
          "KAAL preserves India's languages, stories, recipes, festivals and traditions on an AI-powered cultural memory map. The soul of India, preserved forever.",
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
    <main className="relative min-h-screen overflow-x-hidden">
      <Navbar />
      <Hero />
      <Stats />
      <Traditions />
      <IndiaMap />
      <Timeline />
      <Features />
      <Shruti />
      <Assistant />
      <Trails />
      <Contribute />
      <Footer />
    </main>
  );
}

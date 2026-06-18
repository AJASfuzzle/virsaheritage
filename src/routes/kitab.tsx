import { createFileRoute } from "@tanstack/react-router";
import { Shruti } from "@/components/site/Shruti";

export const Route = createFileRoute("/kitab")({
  head: () => ({
    meta: [
      { title: "Kitab — India's Language Archive · VIRSA" },
      { name: "description", content: "Kitab preserves India's spoken tongues — pronunciation, proverb, song and script — for the centuries to come." },
      { property: "og:title", content: "Kitab — India's Language Archive" },
      { property: "og:description", content: "247 languages mapped, voiced and remembered." },
    ],
  }),
  component: KitabPage,
});

function KitabPage() {
  return (
    <div className="pt-20 [&>section:first-child]:!pt-6 sm:[&>section:first-child]:!pt-10">
      <Shruti />
    </div>
  );
}

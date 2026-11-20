import { createFileRoute } from "@tanstack/react-router";
import { Shruti } from "@/components/site/Shruti";
import { LANGUAGE_COUNT } from "@/lib/kitab-languages";

export const Route = createFileRoute("/kitab")({
  head: () => ({
    meta: [
      { title: "Kitab - India's Language Archive · VIRSA" },
      { name: "description", content: "Kitab preserves India's spoken tongues - pronunciation, proverb, song and script - for the centuries to come." },
      { property: "og:title", content: "Kitab - India's Language Archive" },
      { property: "og:description", content: `${LANGUAGE_COUNT}+ languages mapped and remembered.` },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
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

import { createFileRoute } from "@tanstack/react-router";
import { Shruti } from "@/components/site/Shruti";

export const Route = createFileRoute("/kitab")({
  head: () => ({
    meta: [
      { title: "kitab — India's Language Archive · KAAL" },
      { name: "description", content: "kitab preserves India's spoken tongues — pronunciation, proverb, song and script — for the centuries to come." },
      { property: "og:title", content: "kitab — India's Language Archive" },
      { property: "og:description", content: "247 languages mapped, voiced and remembered." },
    ],
  }),
  component: KitabPage,
});

function KitabPage() {
  return (
    <div className="pt-24">
      <Shruti />
    </div>
  );
}

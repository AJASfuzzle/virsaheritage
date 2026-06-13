import { createFileRoute } from "@tanstack/react-router";
import { Contribute } from "@/components/site/Contribute";

export const Route = createFileRoute("/contribute")({
  head: () => ({
    meta: [
      { title: "Contribute a Memory — KAAL" },
      { name: "description", content: "Upload a recording, recipe, photograph or sentence in a tongue your village still speaks. KAAL transcribes, translates and tags it." },
      { property: "og:title", content: "Contribute a Memory — KAAL" },
      { property: "og:description", content: "Your grandmother knows a story India must remember." },
    ],
  }),
  component: ContributePage,
});

function ContributePage() {
  return (
    <div className="pt-20 [&>section:first-child]:!pt-6 sm:[&>section:first-child]:!pt-10">
      <Contribute />
    </div>
  );
}

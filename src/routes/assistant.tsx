import { createFileRoute } from "@tanstack/react-router";
import { Assistant } from "@/components/site/Assistant";

export const Route = createFileRoute("/assistant")({
  head: () => ({
    meta: [
      { title: "Heritage Assistant — KAAL" },
      { name: "description", content: "Ask India anything — a research-grade AI assistant trained on KAAL's cultural archive." },
      { property: "og:title", content: "Heritage Assistant — KAAL" },
      { property: "og:description", content: "Ask about a tradition, region, dish or language." },
    ],
  }),
  component: AssistantPage,
});

function AssistantPage() {
  return (
    <div className="pt-20">
      <Assistant />
    </div>
  );
}

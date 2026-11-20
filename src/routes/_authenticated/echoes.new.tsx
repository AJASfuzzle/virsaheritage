import { createFileRoute, Link } from "@tanstack/react-router";
import { Composer } from "@/components/echoes/Composer";
import { echoesHead } from "@/lib/echoes-head";

export const Route = createFileRoute("/_authenticated/echoes/new")({
  head: () => echoesHead("Publish your echo", "Share a photograph, recipe, song or memory with the VIRSA community."),
  component: PublishEcho,
});
function PublishEcho() {
  const navigate = Route.useNavigate();
  return <div className="mx-auto max-w-2xl px-5 pb-24 pt-28">
    <Link to="/echoes" className="mb-6 inline-block text-sm text-primary">← Back to Echoes</Link>
    <Composer onPosted={() => { void navigate({ to: "/echoes" }); }} />
  </div>;
}
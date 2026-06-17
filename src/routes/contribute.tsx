import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/contribute")({
  beforeLoad: () => {
    throw redirect({ to: "/echoes" });
  },
  component: () => null,
});

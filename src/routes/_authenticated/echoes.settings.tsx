import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/echoes/settings")({
  beforeLoad: () => {
    throw redirect({ to: "/dashboard" });
  },
});

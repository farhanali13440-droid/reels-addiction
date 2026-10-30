import { createFileRoute, redirect } from "@tanstack/react-router";

// Old link for landing page V1 — it's now the homepage.
export const Route = createFileRoute("/v1")({
  beforeLoad: () => {
    throw redirect({ to: "/", replace: true });
  },
});

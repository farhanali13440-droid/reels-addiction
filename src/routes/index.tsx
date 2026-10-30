import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Reels Addiction" },
      { name: "description", content: "Reels addiction." },
      { property: "og:title", content: "Reels Addiction" },
      { property: "og:description", content: "Reels addiction." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <h1 className="text-4xl font-semibold text-foreground">reels addiction</h1>
    </div>
  );
}

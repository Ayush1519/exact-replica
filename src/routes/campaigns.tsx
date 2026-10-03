import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/app/ui";

export const Route = createFileRoute("/campaigns")({
  head: () => ({
    meta: [
      { title: "Campaigns — Merchant Growth AI" },
      { name: "description", content: "Create and track promotions recommended by AI." },
      { property: "og:title", content: "Campaigns — Merchant Growth AI" },
      { property: "og:description", content: "Create and track promotions recommended by AI." },
    ],
  }),
  component: () => (
    <div className="mx-auto max-w-[1280px]">
      <PageHeader eyebrow="Merchant Growth AI" title="Campaigns" description="Create and track promotions recommended by AI." />
      <div className="surface p-8 text-sm text-muted-foreground">This page is coming next.</div>
    </div>
  ),
});

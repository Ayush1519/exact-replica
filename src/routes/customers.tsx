import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/app/ui";

export const Route = createFileRoute("/customers")({
  head: () => ({
    meta: [
      { title: "Customers — Merchant Growth AI" },
      { name: "description", content: "Understand loyal, new and at-risk customers." },
      { property: "og:title", content: "Customers — Merchant Growth AI" },
      { property: "og:description", content: "Understand loyal, new and at-risk customers." },
    ],
  }),
  component: () => (
    <div className="mx-auto max-w-[1280px]">
      <PageHeader eyebrow="Merchant Growth AI" title="Customers" description="Understand loyal, new and at-risk customers." />
      <div className="surface p-8 text-sm text-muted-foreground">This page is coming next.</div>
    </div>
  ),
});

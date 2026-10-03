import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/app/ui";

export const Route = createFileRoute("/products")({
  head: () => ({
    meta: [
      { title: "Products — Merchant Growth AI" },
      { name: "description", content: "Track product performance, stock levels and trends." },
      { property: "og:title", content: "Products — Merchant Growth AI" },
      { property: "og:description", content: "Track product performance, stock levels and trends." },
    ],
  }),
  component: () => (
    <div className="mx-auto max-w-[1280px]">
      <PageHeader eyebrow="Merchant Growth AI" title="Products" description="Track product performance, stock levels and trends." />
      <div className="surface p-8 text-sm text-muted-foreground">This page is coming next.</div>
    </div>
  ),
});

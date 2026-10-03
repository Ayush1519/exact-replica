import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/app/ui";

export const Route = createFileRoute("/transactions")({
  head: () => ({
    meta: [
      { title: "Transactions — Merchant Growth AI" },
      { name: "description", content: "Search and review every order and refund." },
      { property: "og:title", content: "Transactions — Merchant Growth AI" },
      { property: "og:description", content: "Search and review every order and refund." },
    ],
  }),
  component: () => (
    <div className="mx-auto max-w-[1280px]">
      <PageHeader eyebrow="Merchant Growth AI" title="Transactions" description="Search and review every order and refund." />
      <div className="surface p-8 text-sm text-muted-foreground">This page is coming next.</div>
    </div>
  ),
});

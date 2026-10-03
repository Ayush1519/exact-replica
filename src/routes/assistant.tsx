import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/app/ui";

export const Route = createFileRoute("/assistant")({
  head: () => ({
    meta: [
      { title: "Growth AI — Merchant Growth AI" },
      { name: "description", content: "Chat with your AI growth assistant and turn insights into actions." },
      { property: "og:title", content: "Growth AI — Merchant Growth AI" },
      { property: "og:description", content: "Chat with your AI growth assistant and turn insights into actions." },
    ],
  }),
  component: () => (
    <div className="mx-auto max-w-[1280px]">
      <PageHeader eyebrow="Merchant Growth AI" title="Growth AI" description="Chat with your AI growth assistant and turn insights into actions." />
      <div className="surface p-8 text-sm text-muted-foreground">This page is coming next.</div>
    </div>
  ),
});

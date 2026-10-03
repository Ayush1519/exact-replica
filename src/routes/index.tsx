import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ArrowRight, TrendingDown, TrendingUp, Sparkles } from "lucide-react";
import { business, customers, money, products, recommendations, revenueSeries, transactions, weekdaySales } from "@/lib/data";
import { Btn, Pill, SectionTitle } from "@/components/app/ui";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — Merchant Growth AI" },
      { name: "description", content: "See how your business is performing, what changed, and what the AI recommends next." },
      { property: "og:title", content: "Dashboard — Merchant Growth AI" },
      { property: "og:description", content: "Revenue, orders, customers and AI-recommended actions at a glance." },
    ],
  }),
  component: Dashboard,
});

const periods = ["7d", "30d", "90d", "12m"] as const;
const kpis = [
  { label: "Revenue", value: "$48,210", delta: 12.4, hint: "vs. previous 30 days" },
  { label: "Orders", value: "1,284", delta: 8.1, hint: "vs. previous 30 days" },
  { label: "New customers", value: "312", delta: 5.6, hint: "vs. previous 30 days" },
  { label: "Avg order value", value: "$37.54", delta: -1.9, hint: "Watch: smaller baskets" },
];

function ChartTip({ active, payload, label }: { active?: boolean; payload?: { value: number; name: string }[]; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl bg-ink px-3 py-2 text-xs text-primary-foreground shadow-lg">
      <p className="font-semibold">{label}</p>
      {payload.map((p) => <p key={p.name} className="text-primary-foreground/70">{p.name}: {p.name === "customers" ? p.value : money(p.value)}</p>)}
    </div>
  );
}

function Dashboard() {
  const [period, setPeriod] = useState<(typeof periods)[number]>("30d");
  const [ready, setReady] = useState(false);
  const [done, setDone] = useState<string[]>([]);
  useEffect(() => { const t = setTimeout(() => setReady(true), 350); return () => clearTimeout(t); }, []);
  const hour = new Date().getHours();
  const greet = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <div className="mx-auto max-w-[1280px]">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-secondary">{business.name}</p>
          <h1 className="mt-1 text-2xl font-semibold leading-tight sm:text-3xl">{greet}, {business.owner}</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">Revenue is up 12% this month. <span className="font-semibold text-destructive">1 item needs attention.</span></p>
        </div>
        <div className="flex w-fit rounded-full bg-card p-1 ring-1 ring-border">
          {periods.map((p) => (
            <button key={p} onClick={() => setPeriod(p)} className={cn("rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors", period === p ? "bg-ink text-primary-foreground" : "text-muted-foreground hover:text-ink")}>{p}</button>
          ))}
        </div>
      </div>

      {/* KPIs */}
      <section className="mb-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {kpis.map((k) => (
          <div key={k.label} className="surface lift p-4 sm:p-5">
            <p className="text-xs font-medium text-muted-foreground">{k.label} · {period}</p>
            {ready ? <p className="mt-1 font-display text-xl font-semibold text-ink sm:text-2xl">{k.value}</p> : <Skeleton className="mt-2 h-7 w-24" />}
            <p className={cn("mt-1 flex items-center gap-1 text-xs font-semibold", k.delta > 0 ? "text-accent-foreground" : "text-destructive")}>
              {k.delta > 0 ? <TrendingUp className="size-3.5" /> : <TrendingDown className="size-3.5" />}{Math.abs(k.delta)}%
              <span className="hidden font-medium text-muted-foreground sm:inline">· {k.hint}</span>
            </p>
          </div>
        ))}
      </section>

      {/* Charts + score */}
      <section className="mb-6 grid gap-4 lg:grid-cols-3">
        <div className="surface p-5 sm:p-6 lg:col-span-2">
          <SectionTitle title="Revenue trend" hint="This year vs. last year — you're ahead every month since March."
            right={<Pill>Forecast +9%</Pill>} />
          <div className="h-[230px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueSeries} margin={{ left: -10, right: 4, top: 8 }}>
                <defs>
                  <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.45} />
                    <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="var(--border)" />
                <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} tickFormatter={(v) => `$${v / 1000}k`} />
                <Tooltip content={<ChartTip />} />
                <Area type="monotone" dataKey="lastYear" name="last year" stroke="var(--chart-5)" strokeOpacity={0.35} strokeDasharray="4 4" fill="none" />
                <Area type="monotone" dataKey="revenue" name="revenue" stroke="var(--chart-1)" strokeWidth={2.5} fill="url(#rev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="surface-ink flex flex-col p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">AI Growth Score</p>
          <div className="mt-3 flex items-end gap-2">
            <span className="font-display text-6xl font-extrabold leading-none">87</span>
            <span className="mb-2 text-sm font-medium text-primary-foreground/50">/100</span>
          </div>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-primary-foreground/15"><div className="bg-score h-full rounded-full" style={{ width: "87%" }} /></div>
          <p className="mt-4 text-pretty text-sm font-medium text-primary-foreground/70">Strong momentum. You're outperforming 78% of stores in your category.</p>
          <div className="mt-4 grid grid-cols-3 gap-2 text-center text-[11px]">
            {[["Sales", "92"], ["Retention", "81"], ["Stock", "64"]].map(([l, v]) => (
              <div key={l} className="rounded-lg bg-primary-foreground/5 py-2"><p className="font-display text-base font-semibold">{v}</p><p className="text-primary-foreground/50">{l}</p></div>
            ))}
          </div>
          <Link to="/assistant" className="mt-auto pt-5"><span className="flex w-full items-center justify-center gap-1 rounded-full bg-primary-foreground/10 px-4 py-2 text-sm font-semibold ring-1 ring-primary-foreground/20 transition-transform hover:-translate-y-0.5">See 3 ways to reach 90 <ArrowRight className="size-4" /></span></Link>
        </div>
      </section>

      <section className="mb-6 grid gap-4 md:grid-cols-2">
        <div className="surface p-5 sm:p-6">
          <SectionTitle title="Sales by weekday" hint="Weekends earn 27% more than weekdays." />
          <div className="h-[170px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weekdaySales} margin={{ left: -20 }}>
                <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
                <Tooltip content={<ChartTip />} cursor={{ fill: "var(--border)" }} />
                <Bar dataKey="sales" name="sales" radius={[6, 6, 0, 0]} fill="var(--chart-2)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 flex items-center justify-between gap-3 rounded-xl bg-accent p-3">
            <p className="text-xs font-medium text-accent-foreground"><Sparkles className="mr-1 inline size-3.5" />Launch a Friday–Sunday promotion</p>
            <Link to="/campaigns" className="shrink-0 text-xs font-bold text-accent-foreground">Create campaign →</Link>
          </div>
        </div>
        <div className="surface p-5 sm:p-6">
          <SectionTitle title="Customer growth" hint="Total customers — 66% more than in January." />
          <div className="h-[170px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueSeries} margin={{ left: -20 }}>
                <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
                <Tooltip content={<ChartTip />} />
                <Area type="monotone" dataKey="customers" name="customers" stroke="var(--chart-2)" strokeWidth={2.5} fill="var(--chart-2)" fillOpacity={0.12} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* Recommendations */}
      <SectionTitle title="Recommended actions" hint="Picked by Growth AI from this week's data." right={<Link to="/assistant" className="text-sm font-semibold text-secondary">Ask AI →</Link>} />
      <section className="mb-6 grid gap-4 lg:grid-cols-3">
        {recommendations.map((r, i) => {
          const isDone = done.includes(r.id);
          return (
            <div key={r.id} className="surface lift flex flex-col p-6">
              <div className="mb-3 flex items-center gap-2">
                <span className={cn("grid size-6 place-items-center rounded-md text-xs font-bold", r.tone === "warn" ? "bg-destructive/15 text-destructive" : "bg-accent text-accent-foreground")}>{i + 1}</span>
                <h3 className="text-sm font-semibold">{r.title}</h3>
              </div>
              <p className="flex-1 text-pretty text-sm font-medium text-muted-foreground">{r.body}</p>
              <div className="mt-4 flex items-center justify-between">
                <Btn variant={r.tone === "warn" ? "ghost" : "primary"} disabled={isDone} className="py-1.5"
                  onClick={() => { setDone((d) => [...d, r.id]); toast.success(`${r.cta} — done`, { description: r.title }); }}>
                  {isDone ? "Completed ✓" : r.cta}
                </Btn>
                <span className="text-xs font-semibold text-accent-foreground">{r.impact}</span>
              </div>
            </div>
          );
        })}
      </section>

      {/* Lists */}
      <section className="grid gap-4 lg:grid-cols-3">
        <div className="surface p-5 sm:p-6 lg:col-span-2">
          <SectionTitle title="Top products" right={<Link to="/products" className="text-sm font-semibold text-secondary">All products →</Link>} />
          <div className="space-y-3">
            {products.slice(0, 3).map((p, i) => (
              <div key={p.id} className="flex items-center gap-4">
                <img src={p.image} alt={p.name} loading="lazy" width={48} height={48} className="size-12 shrink-0 rounded-lg object-cover ring-1 ring-border" />
                <div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold text-ink">{p.name}</p><p className="text-xs text-muted-foreground">{p.sold} sold · {money(p.sold * p.price)}</p></div>
                <div className="hidden h-1.5 w-24 overflow-hidden rounded-full bg-ink/5 sm:block"><div className="h-full rounded-full bg-primary" style={{ width: `${[100, 70, 48][i]}%` }} /></div>
              </div>
            ))}
          </div>
          <div className="mt-6 border-t border-border pt-4">
            <SectionTitle title="Recent transactions" right={<Link to="/transactions" className="text-sm font-semibold text-secondary">View all →</Link>} />
            {transactions.slice(0, 4).map((t) => (
              <div key={t.id} className="flex items-center justify-between gap-3 border-t border-border py-2.5 first:border-0">
                <div className="min-w-0"><p className="truncate text-sm font-medium text-ink">{t.customer}</p><p className="text-xs text-muted-foreground">{t.id} · {t.time}</p></div>
                <div className="flex items-center gap-3"><span className="text-sm font-semibold">{money(t.total)}</span>
                  <Pill tone={t.status === "Paid" ? "primary" : t.status === "Pending" ? "info" : "danger"}>{t.status}</Pill></div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="surface p-5 sm:p-6">
            <h2 className="mb-4 text-lg font-semibold">Alerts</h2>
            <div className="space-y-4">
              {[
                ["bg-destructive", "Warm Clay Tumbler nearly out of stock."],
                ["bg-warning", "Refund request from Marcus V. — needs a reply today."],
                ["bg-secondary", "Payout of $2,860 lands Friday."],
              ].map(([c, t]) => (
                <div key={t} className="flex items-start gap-3"><span className={cn("mt-1.5 size-2 shrink-0 rounded-full", c)} /><p className="text-pretty text-sm font-medium">{t}</p></div>
              ))}
            </div>
          </div>
          <div className="surface p-5 sm:p-6">
            <h2 className="mb-4 text-lg font-semibold">Customer activity</h2>
            <div className="space-y-3">
              {customers.slice(0, 4).map((c) => (
                <div key={c.email} className="flex items-center gap-3">
                  <div className="grid size-8 place-items-center rounded-full bg-secondary/12 text-[11px] font-bold text-secondary">{c.name.split(" ").map((n) => n[0]).join("")}</div>
                  <p className="flex-1 text-sm"><span className="font-semibold text-ink">{c.name}</span> {c.segment === "New" ? "placed a first order" : "ordered again"}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

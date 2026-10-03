import { useEffect, useState, type ReactNode } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { Bell, ChevronsLeft, ChevronsRight, Menu, Search, Sparkles } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList,
} from "@/components/ui/command";
import { allNav, navGroups } from "./nav";
import { business, customers, products } from "@/lib/data";
import { cn } from "@/lib/utils";

function useActive() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  return (to: string) => (to === "/" ? path === "/" : path.startsWith(to));
}

function SideNav({ collapsed, onNavigate }: { collapsed: boolean; onNavigate?: () => void }) {
  const isActive = useActive();
  return (
    <nav className="flex flex-col gap-5">
      {navGroups.map((g) => (
        <div key={g.label} className="flex flex-col gap-1">
          {!collapsed && <p className="px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">{g.label}</p>}
          {g.items.map((it) => {
            const active = isActive(it.to);
            const link = (
              <Link
                to={it.to}
                onClick={onNavigate}
                className={cn(
                  "group relative flex h-10 items-center gap-3 rounded-[10px] text-sm font-medium transition-colors",
                  collapsed ? "w-10 justify-center" : "px-3",
                  active ? "bg-accent text-accent-foreground ring-1 ring-primary/30" : "text-card-foreground/60 hover:bg-ink/5 hover:text-ink",
                )}
              >
                <it.icon className="size-[18px] shrink-0" />
                {!collapsed && <span>{it.label}</span>}
              </Link>
            );
            return collapsed ? (
              <Tooltip key={it.to}>
                <TooltipTrigger asChild>{link}</TooltipTrigger>
                <TooltipContent side="right">{it.label}</TooltipContent>
              </Tooltip>
            ) : <div key={it.to}>{link}</div>;
          })}
        </div>
      ))}
    </nav>
  );
}

const notifications = [
  { tone: "bg-destructive", text: "Warm Clay Tumbler is nearly out of stock", time: "12m" },
  { tone: "bg-primary", text: "Weekend Brew Sale passed $4k revenue", time: "1h" },
  { tone: "bg-secondary", text: "Payout of $2,860 lands Friday", time: "3h" },
];

export function AppShell({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cmdOpen, setCmdOpen] = useState(false);
  const navigate = useNavigate();
  const isActive = useActive();

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); setCmdOpen((o) => !o); }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);

  const go = (to: string) => { setCmdOpen(false); navigate({ to }); };

  return (
    <TooltipProvider delayDuration={100}>
      <div className="min-h-screen bg-background text-card-foreground">
        <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
          <div className="absolute -top-40 -left-40 h-[38rem] w-[38rem] -rotate-12 rounded-[40%] bg-primary/20 blur-3xl" />
          <div className="absolute -bottom-52 -right-32 h-[42rem] w-[42rem] rotate-12 rounded-[45%] bg-secondary/20 blur-3xl" />
        </div>

        <div className="relative z-10 flex min-h-screen">
          <aside className={cn(
            "sticky top-0 hidden h-screen shrink-0 flex-col border-r border-border bg-sidebar py-5 backdrop-blur-xl transition-[width] duration-300 lg:flex",
            collapsed ? "w-[76px] items-center px-3" : "w-[232px] px-4",
          )}>
            <Link to="/" className={cn("mb-6 flex items-center gap-2.5", !collapsed && "px-1")}>
              <div className="grid size-10 shrink-0 place-items-center rounded-[10px] bg-ink font-display font-bold text-primary-foreground">M</div>
              {!collapsed && <div className="leading-tight"><p className="font-display text-sm font-semibold text-ink">Merchant Growth</p><p className="text-[11px] text-muted-foreground">{business.name}</p></div>}
            </Link>
            <SideNav collapsed={collapsed} />
            <div className="mt-auto flex flex-col gap-2">
              {!collapsed && (
                <Link to="/assistant" className="surface-ink lift p-4">
                  <Sparkles className="size-4 text-primary" />
                  <p className="mt-2 text-sm font-semibold">3 actions ready</p>
                  <p className="text-xs text-primary-foreground/60">Ask Growth AI what to do next</p>
                </Link>
              )}
              <button onClick={() => setCollapsed((c) => !c)} aria-label="Toggle sidebar"
                className={cn("flex h-9 items-center gap-2 rounded-[10px] text-xs font-medium text-muted-foreground hover:bg-ink/5", collapsed ? "w-10 justify-center" : "px-3")}>
                {collapsed ? <ChevronsRight className="size-4" /> : <><ChevronsLeft className="size-4" /> Collapse</>}
              </button>
            </div>
          </aside>

          <div className="flex min-w-0 flex-1 flex-col">
            <header className="flex items-center gap-3 px-4 pt-5 sm:px-8 lg:px-10 lg:pt-8">
              <button className="grid size-10 place-items-center rounded-full bg-card ring-1 ring-border lg:hidden" onClick={() => setMobileOpen(true)} aria-label="Open menu"><Menu className="size-5" /></button>
              <div className="ml-auto flex items-center gap-2 sm:gap-3">
                <button onClick={() => setCmdOpen(true)} className="inline-flex items-center gap-2 rounded-full bg-card px-3 py-2 text-sm font-medium ring-1 ring-border sm:px-4">
                  <Search className="size-4 text-secondary" /><span className="hidden sm:inline">Search</span>
                  <kbd className="ml-3 hidden rounded bg-ink/5 px-1.5 text-[11px] text-muted-foreground md:inline">⌘K</kbd>
                </button>
                <Popover>
                  <PopoverTrigger asChild>
                    <button className="relative grid size-10 place-items-center rounded-full bg-card ring-1 ring-border" aria-label="Notifications">
                      <Bell className="size-4" /><span className="absolute right-2.5 top-2.5 size-2 rounded-full bg-destructive" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent align="end" className="w-80 p-0">
                    <p className="border-b border-border px-4 py-3 font-display text-sm font-semibold text-ink">Notifications</p>
                    {notifications.map((n) => (
                      <div key={n.text} className="flex gap-3 px-4 py-3 hover:bg-muted">
                        <span className={cn("mt-1.5 size-2 shrink-0 rounded-full", n.tone)} />
                        <p className="flex-1 text-sm">{n.text}</p><span className="text-xs text-muted-foreground">{n.time}</span>
                      </div>
                    ))}
                  </PopoverContent>
                </Popover>
                <Link to="/assistant" className="hidden rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5 sm:inline-flex">Ask Growth AI</Link>
                <div className="grid size-10 place-items-center rounded-full bg-ink font-display text-xs font-bold text-primary-foreground">{business.initials}</div>
              </div>
            </header>
            <main key={useRouterState({ select: (s) => s.location.pathname })} className="rise flex-1 px-4 pb-28 pt-6 sm:px-8 lg:px-10 lg:pb-10">{children}</main>
          </div>
        </div>

        {/* Mobile bottom nav */}
        <nav className="fixed inset-x-3 bottom-3 z-40 flex justify-around rounded-2xl bg-popover/90 p-1.5 shadow-lg ring-1 ring-border backdrop-blur-xl lg:hidden">
          {[allNav[0], allNav[1], allNav[2], allNav[4]].map((it) => (
            <Link key={it.to} to={it.to} className={cn("flex flex-1 flex-col items-center gap-0.5 rounded-xl py-2 text-[11px] font-medium",
              isActive(it.to) ? "bg-accent text-accent-foreground" : "text-muted-foreground")}>
              <it.icon className="size-5" />{it.label}
            </Link>
          ))}
        </nav>

        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetContent side="left" className="w-72 p-5">
            <SheetTitle className="mb-6 font-display">Merchant Growth AI</SheetTitle>
            <SideNav collapsed={false} onNavigate={() => setMobileOpen(false)} />
          </SheetContent>
        </Sheet>

        <CommandDialog open={cmdOpen} onOpenChange={setCmdOpen}>
          <CommandInput placeholder="Search pages, products, customers, AI tools…" />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Pages">
              {allNav.map((it) => <CommandItem key={it.to} onSelect={() => go(it.to)}><it.icon className="mr-2 size-4" />{it.label}</CommandItem>)}
            </CommandGroup>
            <CommandGroup heading="AI tools">
              <CommandItem onSelect={() => go("/assistant")}><Sparkles className="mr-2 size-4" />Ask why revenue changed</CommandItem>
              <CommandItem onSelect={() => go("/campaigns")}><Sparkles className="mr-2 size-4" />Create a campaign with AI</CommandItem>
            </CommandGroup>
            <CommandGroup heading="Products">
              {products.map((p) => <CommandItem key={p.id} onSelect={() => go("/products")}>{p.name}</CommandItem>)}
            </CommandGroup>
            <CommandGroup heading="Customers">
              {customers.slice(0, 5).map((c) => <CommandItem key={c.email} onSelect={() => go("/customers")}>{c.name}</CommandItem>)}
            </CommandGroup>
          </CommandList>
        </CommandDialog>
      </div>
    </TooltipProvider>
  );
}

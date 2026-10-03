import type { LucideIcon } from "lucide-react";
import { LayoutDashboard, Sparkles, Package, Users, Receipt, Megaphone } from "lucide-react";

export type NavTo = "/" | "/assistant" | "/products" | "/customers" | "/transactions" | "/campaigns";
export type NavItem = { to: NavTo; label: string; icon: LucideIcon };

export const navGroups: { label: string; items: NavItem[] }[] = [
  { label: "Overview", items: [
    { to: "/", label: "Dashboard", icon: LayoutDashboard },
    { to: "/assistant", label: "Growth AI", icon: Sparkles },
  ] },
  { label: "Business", items: [
    { to: "/products", label: "Products", icon: Package },
    { to: "/customers", label: "Customers", icon: Users },
    { to: "/transactions", label: "Transactions", icon: Receipt },
  ] },
  { label: "Grow", items: [{ to: "/campaigns", label: "Campaigns", icon: Megaphone }] },
];

export const allNav: NavItem[] = navGroups.flatMap((g) => g.items);

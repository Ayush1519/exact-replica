import { LayoutDashboard, Sparkles, Package, Users, Receipt, Megaphone } from "lucide-react";

export const navGroups = [
  { label: "Overview", items: [
    { to: "/", label: "Dashboard", icon: LayoutDashboard },
    { to: "/assistant", label: "Growth AI", icon: Sparkles },
  ] },
  { label: "Business", items: [
    { to: "/products", label: "Products", icon: Package },
    { to: "/customers", label: "Customers", icon: Users },
    { to: "/transactions", label: "Transactions", icon: Receipt },
  ] },
  { label: "Grow", items: [
    { to: "/campaigns", label: "Campaigns", icon: Megaphone },
  ] },
] as const;

export const allNav = navGroups.flatMap((g) => g.items);

import {
  BarChart3,
  FileText,
  FolderOpen,
  LayoutDashboard,
  Settings,
  TrendingUp,
  Users,
  Wallet,
  Briefcase,
  type LucideIcon,
} from "lucide-react";

export type NavKey =
  | "dashboard"
  | "contracts"
  | "investments"
  | "clients"
  | "investors"
  | "financial"
  | "documents"
  | "reports"
  | "settings";

export type NavGroupKey = "operations" | "financial" | "archive" | "settings";

export interface NavItem {
  key: NavKey;
  href: string;
  icon: LucideIcon;
}

export interface NavGroup {
  key: NavGroupKey;
  items: NavItem[];
}

export const navGroups: NavGroup[] = [
  {
    key: "operations",
    items: [
      { key: "dashboard", href: "/dashboard", icon: LayoutDashboard },
      { key: "investments", href: "/investments", icon: Briefcase },
      { key: "contracts", href: "/contracts", icon: FileText },
      { key: "clients", href: "/clients", icon: Users },
      { key: "investors", href: "/investors", icon: TrendingUp },
    ],
  },
  {
    key: "financial",
    items: [
      { key: "financial", href: "/financial", icon: Wallet },
      { key: "reports", href: "/reports", icon: BarChart3 },
    ],
  },
  {
    key: "archive",
    items: [{ key: "documents", href: "/documents", icon: FolderOpen }],
  },
  {
    key: "settings",
    items: [{ key: "settings", href: "/settings", icon: Settings }],
  },
];

export const navItems: NavItem[] = navGroups.flatMap((group) => group.items);

// Sub-route awareness — items with children that should highlight when the URL is a descendant.
export function isItemActive(itemHref: string, pathname: string): boolean {
  if (itemHref === "/") return pathname === "/";
  return pathname === itemHref || pathname.startsWith(itemHref + "/");
}

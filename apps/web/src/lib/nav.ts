import {
  BarChart3,
  FileText,
  FolderOpen,
  Inbox,
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
  | "collections"
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
      { key: "clients", href: "/customers", icon: Users },
      { key: "collections", href: "/collections", icon: Inbox },
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

export function isItemActive(itemHref: string, pathname: string): boolean {
  if (itemHref === "/") return pathname === "/";
  return pathname === itemHref || pathname.startsWith(itemHref + "/");
}

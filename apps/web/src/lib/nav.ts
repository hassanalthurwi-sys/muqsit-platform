import {
  BarChart3,
  Briefcase,
  FileText,
  FolderOpen,
  GaugeCircle,
  History,
  Inbox,
  LayoutDashboard,
  Settings,
  ShieldCheck,
  TrendingUp,
  UserCheck,
  Users,
  UsersRound,
  Wallet,
  type LucideIcon,
} from "lucide-react";

export type NavKey =
  | "operations"
  | "dashboard"
  | "contracts"
  | "investments"
  | "clients"
  | "investors"
  | "collections"
  | "financial"
  | "documents"
  | "reports"
  | "settings"
  | "approvals"
  | "permissions"
  | "audit"
  | "investorPortal"
  | "customerPortal";

export type NavGroupKey =
  | "operations"
  | "administration"
  | "financial"
  | "archive"
  | "portals"
  | "settings";

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
      { key: "operations", href: "/operations", icon: GaugeCircle },
      { key: "dashboard", href: "/dashboard", icon: LayoutDashboard },
      { key: "investments", href: "/investments", icon: Briefcase },
      { key: "contracts", href: "/contracts", icon: FileText },
      { key: "clients", href: "/customers", icon: Users },
      { key: "collections", href: "/collections", icon: Inbox },
      { key: "investors", href: "/investors", icon: TrendingUp },
    ],
  },
  {
    key: "administration",
    items: [
      { key: "approvals", href: "/approvals", icon: ShieldCheck },
      { key: "permissions", href: "/permissions", icon: UsersRound },
      { key: "audit", href: "/audit", icon: History },
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
    key: "portals",
    items: [
      { key: "investorPortal", href: "/portal/investor", icon: UserCheck },
      { key: "customerPortal", href: "/portal/customer", icon: UserCheck },
    ],
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

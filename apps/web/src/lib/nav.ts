import {
  BarChart3,
  FileText,
  FolderOpen,
  LayoutDashboard,
  Settings,
  TrendingUp,
  Users,
  Wallet,
  type LucideIcon,
} from "lucide-react";

export type NavKey =
  | "dashboard"
  | "contracts"
  | "clients"
  | "investors"
  | "financial"
  | "documents"
  | "reports"
  | "settings";

export interface NavItem {
  key: NavKey;
  href: string;
  icon: LucideIcon;
}

export const navItems: NavItem[] = [
  { key: "dashboard", href: "/dashboard", icon: LayoutDashboard },
  { key: "contracts", href: "/contracts", icon: FileText },
  { key: "clients", href: "/clients", icon: Users },
  { key: "investors", href: "/investors", icon: TrendingUp },
  { key: "financial", href: "/financial", icon: Wallet },
  { key: "documents", href: "/documents", icon: FolderOpen },
  { key: "reports", href: "/reports", icon: BarChart3 },
  { key: "settings", href: "/settings", icon: Settings },
];

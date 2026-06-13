"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Building2,
  Users,
  Settings,
  ScrollText,
} from "lucide-react";
import { useI18n } from "@/components/providers/i18n-provider";
import { cn } from "@/lib/utils";

export function AdminSidebar() {
  const { dict } = useI18n();
  const pathname = usePathname();
  const n = dict.admin.nav;

  const items = [
    { href: "/admin/dashboard", label: n.dashboard, Icon: LayoutDashboard },
    { href: "/admin/offices", label: n.offices, Icon: Building2 },
    { href: "/admin/employees", label: n.employees, Icon: Users },
    { href: "/admin/settings", label: n.settings, Icon: Settings },
    { href: "/admin/audit", label: n.audit, Icon: ScrollText },
  ];

  return (
    <aside className="hidden w-64 shrink-0 border-s bg-card md:flex md:flex-col">
      <div className="border-b px-5 py-4">
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
          {dict.admin.shellTitle.split(" · ")[0]}
        </p>
        <p className="mt-0.5 text-lg font-semibold tracking-tight text-primary">
          مُقسِّط
        </p>
      </div>
      <nav className="flex-1 space-y-1 p-3">
        {items.map(({ href, label, Icon }) => {
          const isActive = pathname === href || pathname?.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                isActive
                  ? "bg-primary-soft text-primary-soft-foreground font-medium"
                  : "text-muted-foreground hover:bg-muted/50",
              )}
            >
              <Icon className="size-4 shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

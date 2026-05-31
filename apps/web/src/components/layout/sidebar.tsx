"use client";

import { Wallet } from "lucide-react";
import { useI18n } from "@/components/providers/i18n-provider";
import { useAuth } from "@/components/providers/auth-provider";
import { SidebarNav } from "@/components/layout/sidebar-nav";
import { SidebarUser } from "@/components/layout/sidebar-user";

export function Sidebar() {
  const { dict } = useI18n();
  const { tenant } = useAuth();

  return (
    <aside className="hidden w-56 shrink-0 border-e border-sidebar-border bg-sidebar text-sidebar-foreground md:flex md:flex-col">
      <div className="flex h-16 items-center gap-2.5 border-b border-sidebar-border px-5">
        <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
          <Wallet className="size-4" />
        </span>
        <span className="text-lg font-semibold tracking-tight">{dict.appName}</span>
      </div>

      {tenant ? (
        <div className="px-4 pt-4">
          <div className="rounded-lg border border-sidebar-border bg-card px-3 py-2">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
              {dict.common.account}
            </p>
            <p className="truncate text-sm font-medium">{tenant.name}</p>
          </div>
        </div>
      ) : null}

      <div className="flex-1 overflow-y-auto px-3 py-4">
        <SidebarNav />
      </div>

      <div className="border-t border-sidebar-border p-3">
        <SidebarUser />
      </div>
    </aside>
  );
}

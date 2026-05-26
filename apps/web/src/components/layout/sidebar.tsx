"use client";

import { useI18n } from "@/components/providers/i18n-provider";
import { SidebarNav } from "@/components/layout/sidebar-nav";

export function Sidebar() {
  const { dict } = useI18n();

  return (
    <aside className="hidden w-64 shrink-0 border-e bg-sidebar text-sidebar-foreground md:flex md:flex-col">
      <div className="flex h-16 items-center border-b px-6">
        <span className="text-lg font-bold">{dict.appName}</span>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        <SidebarNav />
      </div>
    </aside>
  );
}

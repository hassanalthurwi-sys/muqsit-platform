"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navGroups, isItemActive } from "@/lib/nav";
import { useI18n } from "@/components/providers/i18n-provider";
import { cn } from "@/lib/utils";

export function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const { dict } = useI18n();

  return (
    <nav className="flex flex-col gap-5">
      {navGroups.map((group) => (
        <div key={group.key} className="flex flex-col gap-1.5">
          <p className="label px-3">{dict.navGroups[group.key]}</p>
          <div className="flex flex-col gap-0.5">
            {group.items.map((item) => {
              const Icon = item.icon;
              const active = isItemActive(item.href, pathname);
              return (
                <Link
                  key={item.key}
                  href={item.href}
                  onClick={onNavigate}
                  className={cn(
                    "group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    active
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground/75 hover:bg-sidebar-accent/40 hover:text-sidebar-foreground",
                  )}
                >
                  {active ? (
                    <span
                      aria-hidden
                      className="absolute start-0 top-1.5 bottom-1.5 w-1 rounded-full bg-sidebar-primary"
                    />
                  ) : null}
                  <Icon
                    className={cn(
                      "size-4 shrink-0",
                      active ? "text-sidebar-primary" : "text-sidebar-foreground/60",
                    )}
                  />
                  <span>{dict.nav[item.key]}</span>
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );
}

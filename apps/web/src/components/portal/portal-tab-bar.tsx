"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface PortalTab {
  href: string;
  label: string;
  icon: LucideIcon;
  /** A path is "active" when the current pathname starts with it. */
  matchPrefix?: string;
}

export function PortalTabBar({ tabs }: { tabs: PortalTab[] }) {
  const pathname = usePathname();
  return (
    <nav
      aria-label="portal"
      className={cn(
        "z-30 border-border bg-card/95 backdrop-blur",
        // Bottom-fixed on mobile, top-fixed bar on desktop
        "fixed inset-x-0 bottom-0 border-t shadow-[var(--shadow-card)]",
        "lg:static lg:inset-auto lg:border-b lg:border-t-0 lg:shadow-none",
      )}
    >
      <ul className="mx-auto flex max-w-2xl items-stretch justify-between lg:max-w-6xl lg:justify-start lg:gap-2 lg:px-6">
        {tabs.map((tab) => {
          const target = tab.matchPrefix ?? tab.href;
          const isActive =
            pathname === tab.href || (target !== tab.href ? pathname.startsWith(target) : false);
          const Icon = tab.icon;
          return (
            <li key={tab.href} className="flex-1 lg:flex-initial">
              <Link
                href={tab.href}
                className={cn(
                  "group flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium",
                  "lg:flex-row lg:gap-2 lg:rounded-lg lg:px-4 lg:py-3 lg:text-sm",
                  isActive
                    ? "text-primary lg:bg-primary-soft lg:text-primary-soft-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <Icon
                  className={cn(
                    "size-5 lg:size-[18px]",
                    isActive ? "text-primary lg:text-primary-soft-foreground" : "",
                  )}
                  aria-hidden
                />
                <span>{tab.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

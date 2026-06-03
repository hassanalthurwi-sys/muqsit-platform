"use client";

import Link from "next/link";
import { Bell, Globe, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { useI18n } from "@/components/providers/i18n-provider";
import { cn } from "@/lib/utils";

interface PortalHeaderProps {
  brand: string;
  notificationsHref: string;
  unreadCount?: number;
  greeting?: string;
}

export function PortalHeader({ brand, notificationsHref, unreadCount, greeting }: PortalHeaderProps) {
  const { dict, toggleLocale, locale } = useI18n();
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const isDark = mounted && resolvedTheme === "dark";

  return (
    <header className="sticky top-0 z-20 border-b border-border bg-card/95 backdrop-blur">
      <div className="mx-auto flex max-w-2xl items-center justify-between gap-3 px-4 py-3 lg:max-w-6xl lg:px-6">
        <Link href="#" className="flex items-center gap-2.5 text-start" aria-label={brand}>
          <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground font-semibold">
            م
          </span>
          <span className="flex flex-col leading-tight">
            <span className="text-[11px] font-medium text-muted-foreground">{brand}</span>
            {greeting ? (
              <span className="text-sm font-semibold text-foreground">{greeting}</span>
            ) : null}
          </span>
        </Link>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={toggleLocale}
            className="flex size-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
            aria-label={dict.portals.common.language}
          >
            <Globe className="size-[18px]" aria-hidden />
            <span className="sr-only">{locale === "ar" ? "EN" : "AR"}</span>
          </button>
          <button
            type="button"
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className="flex size-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
            aria-label={dict.portals.common.theme}
          >
            {isDark ? (
              <Sun className="size-[18px]" aria-hidden />
            ) : (
              <Moon className="size-[18px]" aria-hidden />
            )}
          </button>
          <Link
            href={notificationsHref}
            className="relative flex size-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
            aria-label={dict.notifications.bellTitle}
          >
            <Bell className="size-[18px]" aria-hidden />
            {unreadCount && unreadCount > 0 ? (
              <span
                className={cn(
                  "num absolute -top-0.5 flex min-w-4 items-center justify-center rounded-full bg-danger px-1 text-[10px] font-semibold text-white",
                  locale === "ar" ? "-start-0.5" : "-end-0.5",
                )}
              >
                {unreadCount}
              </span>
            ) : null}
          </Link>
        </div>
      </div>
    </header>
  );
}

"use client";

import { MobileNav } from "@/components/layout/mobile-nav";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { LanguageToggle } from "@/components/layout/language-toggle";
import { NotificationBell } from "@/components/ui/notification-bell";
import { useI18n } from "@/components/providers/i18n-provider";

export function TopBar() {
  const { dict } = useI18n();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-border bg-background/80 px-4 backdrop-blur md:px-6">
      <div className="flex items-center gap-3 md:hidden">
        <MobileNav />
        <span className="text-base font-semibold">{dict.appName}</span>
      </div>
      <div className="hidden md:block" />
      <div className="flex items-center gap-1">
        <NotificationBell />
        <LanguageToggle />
        <ThemeToggle />
      </div>
    </header>
  );
}

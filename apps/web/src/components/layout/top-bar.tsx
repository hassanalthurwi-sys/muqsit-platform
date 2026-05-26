"use client";

import { MobileNav } from "@/components/layout/mobile-nav";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { LanguageToggle } from "@/components/layout/language-toggle";
import { UserMenu } from "@/components/layout/user-menu";
import { useAuth } from "@/components/providers/auth-provider";

export function TopBar() {
  const { tenant } = useAuth();

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between gap-4 border-b bg-background px-4 md:px-6">
      <div className="flex items-center gap-3">
        <MobileNav />
        {tenant ? <span className="font-semibold">{tenant.name}</span> : null}
      </div>
      <div className="flex items-center gap-1">
        <LanguageToggle />
        <ThemeToggle />
        <UserMenu />
      </div>
    </header>
  );
}

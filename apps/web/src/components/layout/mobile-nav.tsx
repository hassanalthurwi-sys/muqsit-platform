"use client";

import { useState } from "react";
import { Menu, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { SidebarNav } from "@/components/layout/sidebar-nav";
import { SidebarUser } from "@/components/layout/sidebar-user";
import { useI18n } from "@/components/providers/i18n-provider";
import { useAuth } from "@/components/providers/auth-provider";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const { dict, dir } = useI18n();
  const { tenant } = useAuth();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          aria-label={dict.common.openMenu}
        >
          <Menu className="size-5" />
        </Button>
      </SheetTrigger>
      <SheetContent
        side={dir === "rtl" ? "right" : "left"}
        className="flex flex-col gap-0 bg-sidebar p-0 text-sidebar-foreground"
      >
        <SheetTitle className="sr-only">{dict.appName}</SheetTitle>
        <SheetDescription className="sr-only">{dict.appName}</SheetDescription>

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
          <SidebarNav onNavigate={() => setOpen(false)} />
        </div>

        <div className="border-t border-sidebar-border p-3">
          <SidebarUser />
        </div>
      </SheetContent>
    </Sheet>
  );
}

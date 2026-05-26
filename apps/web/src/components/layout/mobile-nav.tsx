"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { SidebarNav } from "@/components/layout/sidebar-nav";
import { useI18n } from "@/components/providers/i18n-provider";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const { dict, dir } = useI18n();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden" aria-label={dict.common.openMenu}>
          <Menu className="size-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side={dir === "rtl" ? "right" : "left"}>
        <SheetTitle className="px-1">{dict.appName}</SheetTitle>
        <SheetDescription className="sr-only">{dict.appName}</SheetDescription>
        <div className="mt-2">
          <SidebarNav onNavigate={() => setOpen(false)} />
        </div>
      </SheetContent>
    </Sheet>
  );
}

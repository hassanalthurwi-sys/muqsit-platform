"use client";

import Link from "next/link";
import { Bell } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { NotificationPriorityPill } from "@/components/ui/priority-pill";
import { useStore } from "@/lib/mock/store";
import { useI18n } from "@/components/providers/i18n-provider";
import { cn } from "@/lib/utils";

export function NotificationBell() {
  const { dict } = useI18n();
  const { notifications } = useStore();
  const unread = notifications.filter((n) => n.state === "unread").length;
  const recent = [...notifications]
    .sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1))
    .slice(0, 5);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label={dict.notifications.bellTitle}
          className="relative"
        >
          <Bell className="size-5" />
          {unread > 0 ? (
            <span className="num absolute end-1 top-1 inline-flex size-4 items-center justify-center rounded-full bg-danger text-[10px] font-semibold text-destructive-foreground">
              {unread > 9 ? "9+" : unread}
            </span>
          ) : null}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 p-0">
        <DropdownMenuLabel className="flex items-center justify-between px-4 py-3">
          <span>{dict.notifications.bellTitle}</span>
          <span className="num text-xs text-muted-foreground">
            {dict.notifications.unread.replace("{n}", String(unread))}
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="m-0" />
        <ul className="max-h-80 overflow-y-auto">
          {recent.length === 0 ? (
            <li className="p-4 text-sm text-muted-foreground">{dict.notifications.empty}</li>
          ) : (
            recent.map((n) => (
              <li
                key={n.id}
                className={cn(
                  "border-b border-border px-4 py-3 last:border-b-0",
                  n.state === "unread" ? "bg-primary-soft/30" : "",
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-xs font-semibold leading-tight">{n.title}</p>
                  <NotificationPriorityPill priority={n.priority} />
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{n.body}</p>
              </li>
            ))
          )}
        </ul>
        <DropdownMenuSeparator className="m-0" />
        <div className="p-2">
          <Link
            href="/notifications"
            className="block rounded-md px-3 py-1.5 text-center text-xs font-medium text-primary hover:bg-primary-soft"
          >
            {dict.notifications.seeAll} ↗
          </Link>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

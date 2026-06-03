"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Bell, BellOff, CheckCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { NotificationPriorityPill } from "@/components/ui/priority-pill";
import { SearchInput } from "@/components/ui/search-input";
import { useStore } from "@/lib/mock/store";
import { useI18n } from "@/components/providers/i18n-provider";
import { cn } from "@/lib/utils";

type Filter = "all" | "unread" | "critical" | "reminders";

export default function NotificationsPage() {
  const { dict } = useI18n();
  const { notifications, setNotificationState, markAllNotificationsRead } = useStore();
  const n = dict.notifications;
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");

  const filters: Array<{ key: Filter; label: string }> = [
    { key: "all", label: n.filters.all },
    { key: "unread", label: n.filters.unread },
    { key: "critical", label: n.filters.critical },
    { key: "reminders", label: n.filters.reminders },
  ];

  const filtered = useMemo(() => {
    return notifications
      .filter((notif) => {
        if (filter === "all") return true;
        if (filter === "unread") return notif.state === "unread";
        if (filter === "critical") return notif.priority === "critical";
        if (filter === "reminders") return Boolean(notif.isReminder);
        return true;
      })
      .filter((notif) => {
        if (!query.trim()) return true;
        const q = query.trim().toLowerCase();
        return notif.title.toLowerCase().includes(q) || notif.body.toLowerCase().includes(q);
      })
      .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  }, [notifications, filter, query]);

  const unreadCount = notifications.filter((nn) => nn.state === "unread").length;

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Bell className="size-6 text-primary" />
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{n.pageTitle}</h1>
          </div>
          <p className="text-sm text-muted-foreground">
            {n.pageSubtitle} · {n.unread.replace("{n}", String(unreadCount))}
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={markAllNotificationsRead}
          className="gap-1.5"
        >
          <CheckCheck className="size-4" />
          {n.markAllRead}
        </Button>
      </header>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex flex-wrap gap-1.5">
          {filters.map((f) => {
            const active = filter === f.key;
            return (
              <button
                key={f.key}
                type="button"
                onClick={() => setFilter(f.key)}
                className={cn(
                  "rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
                  active
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/70",
                )}
              >
                {f.label}
              </button>
            );
          })}
        </div>
        <SearchInput value={query} onChange={setQuery} className="max-w-xs" />
      </div>

      <Card>
        <CardContent className="px-0 pb-2 pt-0">
          {filtered.length === 0 ? (
            <p className="px-6 py-8 text-center text-sm text-muted-foreground">{n.empty}</p>
          ) : (
            <ul className="divide-y divide-border">
              {filtered.map((notif) => (
                <li
                  key={notif.id}
                  className={cn(
                    "flex flex-col gap-2 px-6 py-4",
                    notif.state === "unread" ? "bg-primary-soft/20" : "",
                  )}
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-semibold">{notif.title}</p>
                        <NotificationPriorityPill priority={notif.priority} />
                        {notif.isReminder ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-warning-soft px-2 py-0.5 text-[10px] font-medium text-warning-foreground">
                            🔔 {n.filters.reminders}
                          </span>
                        ) : null}
                      </div>
                      <p className="text-sm text-muted-foreground">{notif.body}</p>
                      <p className="num text-xs text-muted-foreground">
                        {dict.notificationType[notif.type]} · {notif.createdAt.slice(0, 10)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {notif.relatedEntity ? (
                        <Link
                          href={
                            notif.relatedEntity.kind === "approval"
                              ? `/approvals/${notif.relatedEntity.id}`
                              : notif.relatedEntity.kind === "proof"
                                ? `/collections/${notif.relatedEntity.id}`
                                : notif.relatedEntity.kind === "customer"
                                  ? `/customers/${notif.relatedEntity.id}`
                                  : notif.relatedEntity.kind === "investmentContract"
                                    ? `/investments/${notif.relatedEntity.id}`
                                    : "/notifications"
                          }
                          className="text-xs font-medium text-primary hover:underline"
                        >
                          {dict.common.open} →
                        </Link>
                      ) : null}
                      {notif.state === "unread" ? (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setNotificationState(notif.id, "read")}
                          aria-label="mark read"
                        >
                          <CheckCheck className="size-4" />
                        </Button>
                      ) : (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setNotificationState(notif.id, "dismissed")}
                          aria-label="dismiss"
                        >
                          <BellOff className="size-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

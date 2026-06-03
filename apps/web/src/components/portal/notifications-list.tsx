"use client";

import { useState } from "react";
import { Bell, CreditCard, FileText, PieChart, Building2 } from "lucide-react";
import { PortalCard } from "@/components/portal/portal-card";
import { useI18n } from "@/components/providers/i18n-provider";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/format";
import type { PortalNotification } from "@/lib/portal/data";

const ICONS = {
  profit: PieChart,
  contract: FileText,
  installment: CreditCard,
  proof: FileText,
  office: Building2,
} as const;

export function NotificationsList({
  items,
  filters,
  emptyLabel,
}: {
  items: PortalNotification[];
  filters: { all: string; unread: string };
  emptyLabel: string;
}) {
  const { locale } = useI18n();
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const list = filter === "unread" ? items.filter((i) => i.unread) : items;

  return (
    <div className="space-y-4">
      <div className="inline-flex rounded-lg border border-border bg-card p-1 text-xs font-medium">
        <button
          type="button"
          onClick={() => setFilter("all")}
          className={cn("rounded-md px-3 py-1.5", filter === "all" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground")}
        >
          {filters.all}
        </button>
        <button
          type="button"
          onClick={() => setFilter("unread")}
          className={cn("rounded-md px-3 py-1.5", filter === "unread" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground")}
        >
          {filters.unread}
        </button>
      </div>

      {list.length === 0 ? (
        <PortalCard>
          <div className="flex flex-col items-center gap-2 py-6 text-center text-muted-foreground">
            <Bell className="size-6" aria-hidden />
            <p className="text-sm">{emptyLabel}</p>
          </div>
        </PortalCard>
      ) : (
        <PortalCard className="!p-0">
          <ul className="divide-y divide-border">
            {list.map((n) => {
              const Icon = ICONS[n.iconKind];
              const title = locale === "ar" ? n.titleAr : n.titleEn;
              const body = locale === "ar" ? n.bodyAr : n.bodyEn;
              return (
                <li key={n.id} className="flex gap-3 px-4 py-3">
                  <span className={cn(
                    "mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg",
                    n.unread ? "bg-primary-soft text-primary-soft-foreground" : "bg-muted text-muted-foreground",
                  )}>
                    <Icon className="size-4" aria-hidden />
                  </span>
                  <div className="min-w-0 flex-1 space-y-0.5">
                    <div className="flex items-baseline justify-between gap-2">
                      <p className={cn("truncate text-sm", n.unread ? "font-semibold text-foreground" : "font-medium text-foreground/90")}>
                        {title}
                      </p>
                      <span className="num shrink-0 text-[11px] text-muted-foreground">{formatDate(n.ts, locale)}</span>
                    </div>
                    <p className="text-xs leading-5 text-muted-foreground">{body}</p>
                  </div>
                  {n.unread ? <span className="mt-2 size-2 shrink-0 rounded-full bg-primary" aria-label="unread" /> : null}
                </li>
              );
            })}
          </ul>
        </PortalCard>
      )}
    </div>
  );
}

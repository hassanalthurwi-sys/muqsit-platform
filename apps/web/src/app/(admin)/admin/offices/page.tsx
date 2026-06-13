"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { useI18n } from "@/components/providers/i18n-provider";
import { MOCK_OFFICES, daysLeftInTrial } from "@/lib/mock/admin-data";
import type { SubscriptionStatus } from "@/lib/mock/types";
import { cn } from "@/lib/utils";

type Filter = "all" | SubscriptionStatus;

export default function OfficesListPage() {
  const { dict, locale } = useI18n();
  const o = dict.admin.offices;
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return MOCK_OFFICES.filter((off) => {
      if (filter !== "all" && off.subscriptionStatus !== filter) return false;
      if (!q) return true;
      return (
        off.name.toLowerCase().includes(q) ||
        off.managerName.toLowerCase().includes(q) ||
        off.cr.includes(q)
      );
    });
  }, [filter, query]);

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{o.title}</h1>
        <p className="text-sm text-muted-foreground">{o.subtitle}</p>
      </header>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-1.5">
          {(["all", "trial", "active", "expired", "suspended"] as const).map((key) => {
            const active = filter === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setFilter(key)}
                className={cn(
                  "rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
                  active
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/70",
                )}
              >
                {o.filters[key]}
              </button>
            );
          })}
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="pointer-events-none absolute start-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ابحث بالاسم أو السجل التجاري…"
            className="h-9 w-full rounded-md border bg-card ps-9 pe-3 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-[11px] uppercase text-muted-foreground">
              <th className="px-4 py-3 text-start font-medium">{o.columns.office}</th>
              <th className="px-4 py-3 text-start font-medium">{o.columns.manager}</th>
              <th className="px-4 py-3 text-start font-medium">{o.columns.cr}</th>
              <th className="px-4 py-3 text-start font-medium">{o.columns.subscription}</th>
              <th className="px-4 py-3 text-start font-medium">{o.columns.registeredAt}</th>
              <th className="px-4 py-3 text-end font-medium">{o.columns.actions}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rows.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-sm text-muted-foreground">
                  {o.empty}
                </td>
              </tr>
            ) : (
              rows.map((off) => {
                const left = daysLeftInTrial(off);
                return (
                  <tr key={off.id} className="hover:bg-muted/30">
                    <td className="px-4 py-3 font-medium">{off.name}</td>
                    <td className="px-4 py-3 text-muted-foreground">{off.managerName}</td>
                    <td className="num px-4 py-3 text-muted-foreground" dir="ltr">
                      {off.cr}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={off.subscriptionStatus} />
                      {left !== null ? (
                        <span className="num ms-2 text-[10px] text-muted-foreground">
                          {o.daysLeft.replace("{n}", String(left))}
                        </span>
                      ) : null}
                    </td>
                    <td className="num px-4 py-3 text-muted-foreground">
                      {new Date(off.createdAt).toLocaleDateString(
                        locale === "ar" ? "ar-SA-u-nu-latn" : "en-US",
                      )}
                    </td>
                    <td className="px-4 py-3 text-end">
                      <Link
                        href={`/admin/offices/${off.id}`}
                        className="text-xs font-medium text-primary hover:underline"
                      >
                        {o.view}
                      </Link>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: SubscriptionStatus }) {
  const { dict } = useI18n();
  const label = dict.admin.subscriptionStatus[status];
  const tone =
    status === "active"
      ? "bg-success/10 text-success"
      : status === "trial"
        ? "bg-gold-soft text-gold-foreground"
        : status === "expired"
          ? "bg-warning-soft text-warning-foreground"
          : "bg-muted text-muted-foreground";
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${tone}`}>
      {label}
    </span>
  );
}

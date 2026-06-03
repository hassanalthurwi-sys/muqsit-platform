"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { StatusPill } from "@/components/ui/status-pill";
import {
  ApprovalPriorityPill,
  ApprovalStatusPill,
} from "@/components/ui/priority-pill";
import { SearchInput } from "@/components/ui/search-input";
import { useStore } from "@/lib/mock/store";
import { useI18n } from "@/components/providers/i18n-provider";
import type { ApprovalStatus } from "@/lib/mock/types";
import { cn } from "@/lib/utils";

type Filter = "all" | "pending" | "critical" | "approved" | "rejected";

function hoursSince(iso: string): number {
  const past = new Date(iso).getTime();
  const ref = new Date("2025-05-31T15:00:00Z").getTime();
  return Math.max(0, Math.round((ref - past) / (1000 * 60 * 60)));
}

function ageLabel(hours: number): string {
  if (hours < 1) return "الآن";
  if (hours < 24) return `${hours}س`;
  const days = Math.round(hours / 24);
  return `${days}ي`;
}

export default function ApprovalsPage() {
  const { dict } = useI18n();
  const { approvals, employees } = useStore();
  const a = dict.approvals;
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");

  const filters: Array<{ key: Filter; label: string }> = [
    { key: "all", label: a.filters.all },
    { key: "pending", label: a.filters.pending },
    { key: "critical", label: a.filters.critical },
    { key: "approved", label: a.filters.approved },
    { key: "rejected", label: a.filters.rejected },
  ];

  const rows = useMemo(() => {
    return approvals
      .filter((req) => {
        if (filter === "all") return true;
        if (filter === "critical") return req.priority === "critical" && req.status === "pending";
        return req.status === (filter as ApprovalStatus);
      })
      .filter((req) => {
        if (!query.trim()) return true;
        const q = query.trim().toLowerCase();
        return (
          req.relatedEntity.label.toLowerCase().includes(q) ||
          dict.permissionAction[req.type].toLowerCase().includes(q)
        );
      })
      .sort((a, b) => (a.requestedAt < b.requestedAt ? 1 : -1));
  }, [approvals, filter, query, dict]);

  const employeeName = (id: string) => employees.find((e) => e.id === id)?.name ?? "—";
  const pendingCount = approvals.filter((r) => r.status === "pending").length;

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{a.pageTitle}</h1>
          <p className="text-sm text-muted-foreground">{a.pageSubtitle}</p>
        </div>
        <StatusPill tone="warning">{a.pendingCount.replace("{n}", String(pendingCount))}</StatusPill>
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
          {rows.length === 0 ? (
            <p className="px-6 py-8 text-center text-sm text-muted-foreground">{a.empty}</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-[11px] uppercase text-muted-foreground">
                    <th className="px-6 py-3 text-start font-medium">{a.columns.type}</th>
                    <th className="px-6 py-3 text-start font-medium">{a.columns.requester}</th>
                    <th className="px-6 py-3 text-start font-medium">{a.columns.entity}</th>
                    <th className="px-6 py-3 text-start font-medium">{a.columns.priority}</th>
                    <th className="px-6 py-3 text-start font-medium">{a.columns.ageHours}</th>
                    <th className="px-6 py-3 text-start font-medium">{a.columns.status}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {rows.map((req) => {
                    const ageHrs = hoursSince(req.requestedAt);
                    const isEscalated = req.status === "pending" && ageHrs > 48;
                    return (
                      <tr key={req.id} className="hover:bg-muted/40">
                        <td className="px-6 py-3">
                          <Link
                            href={`/approvals/${req.id}`}
                            className="font-medium text-primary hover:underline"
                          >
                            {dict.permissionAction[req.type]}
                          </Link>
                          {req.remindersSent > 0 ? (
                            <span className="num ms-2 inline-flex items-center gap-1 rounded-full bg-warning-soft px-2 py-0.5 text-[10px] font-medium text-warning-foreground">
                              🔔 {req.remindersSent}
                            </span>
                          ) : null}
                          {isEscalated ? (
                            <span className="ms-2 inline-flex items-center rounded-full bg-danger-soft px-2 py-0.5 text-[10px] font-medium text-danger-foreground">
                              🚨
                            </span>
                          ) : null}
                        </td>
                        <td className="px-6 py-3 text-muted-foreground">
                          {employeeName(req.requestedById)}
                        </td>
                        <td className="px-6 py-3 text-muted-foreground">{req.relatedEntity.label}</td>
                        <td className="px-6 py-3">
                          <ApprovalPriorityPill priority={req.priority} />
                        </td>
                        <td className="num px-6 py-3 text-xs text-muted-foreground">
                          {ageLabel(ageHrs)}
                        </td>
                        <td className="px-6 py-3">
                          <ApprovalStatusPill status={req.status} />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

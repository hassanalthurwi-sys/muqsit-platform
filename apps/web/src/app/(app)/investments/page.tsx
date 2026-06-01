"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Currency } from "@/components/ui/currency";
import { StatusPill } from "@/components/ui/status-pill";
import { useContractStore } from "@/lib/mock/store";
import { findInvestor } from "@/lib/mock/investors";
import { useI18n } from "@/components/providers/i18n-provider";
import { formatDate } from "@/lib/format";
import type { ContractStatus } from "@/lib/mock/types";
import { cn } from "@/lib/utils";

type Filter = "all" | ContractStatus;

export default function InvestmentsPage() {
  const { dict, locale } = useI18n();
  const { contracts } = useContractStore();
  const [filter, setFilter] = useState<Filter>("all");
  const inv = dict.investments;

  const rows = useMemo(() => {
    const list = filter === "all" ? contracts : contracts.filter((c) => c.status === filter);
    return [...list].sort((a, b) => (a.startDate > b.startDate ? -1 : 1));
  }, [contracts, filter]);

  const filters: Array<{ key: Filter; label: string }> = [
    { key: "all", label: inv.filters.all },
    { key: "active", label: inv.filters.active },
    { key: "pendingSetup", label: inv.filters.pendingSetup },
    { key: "ended", label: inv.filters.ended },
  ];

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{inv.pageTitle}</h1>
          <p className="text-sm text-muted-foreground">{inv.pageSubtitle}</p>
        </div>
        <Link
          href="/investments/new"
          className="inline-flex items-center gap-1 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          {inv.newContract}
        </Link>
      </header>

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

      <Card>
        <CardContent className="px-0 pb-2 pt-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-[11px] uppercase text-muted-foreground">
                  <th className="px-6 py-3 text-start font-medium">{inv.columns.number}</th>
                  <th className="px-6 py-3 text-start font-medium">{inv.columns.investor}</th>
                  <th className="px-6 py-3 text-start font-medium">{inv.columns.amount}</th>
                  <th className="px-6 py-3 text-start font-medium">{inv.columns.start}</th>
                  <th className="px-6 py-3 text-start font-medium">{inv.columns.end}</th>
                  <th className="px-6 py-3 text-start font-medium">{inv.columns.ops}</th>
                  <th className="px-6 py-3 text-start font-medium">{inv.columns.utilized}</th>
                  <th className="px-6 py-3 text-start font-medium">{inv.columns.remaining}</th>
                  <th className="px-6 py-3 text-start font-medium">{inv.columns.status}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {rows.map((c) => {
                  const investor = findInvestor(c.investorId);
                  const utilPct = c.amount ? Math.round((c.utilized / c.amount) * 100) : 0;
                  return (
                    <tr key={c.id} className="hover:bg-muted/40">
                      <td className="px-6 py-3">
                        <Link
                          href={`/investments/${c.id}`}
                          className="num font-medium text-primary hover:underline"
                        >
                          {c.number}
                        </Link>
                      </td>
                      <td className="px-6 py-3">
                        {investor ? (
                          <Link
                            href={`/investors/${investor.id}`}
                            className="inline-flex items-center gap-2 hover:underline"
                          >
                            <span className="font-medium">{investor.name}</span>
                            <StatusPill tone={investor.type === "internal" ? "primary" : "gold"}>
                              {dict.investorType[investor.type]}
                            </StatusPill>
                          </Link>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </td>
                      <td className="num px-6 py-3 font-medium">
                        <Currency value={c.amount} compact />
                      </td>
                      <td className="num px-6 py-3 text-muted-foreground">
                        {formatDate(c.startDate, locale)}
                      </td>
                      <td className="num px-6 py-3 text-muted-foreground">
                        {formatDate(c.endDate, locale)}
                      </td>
                      <td className="num px-6 py-3">{c.operationPct}%</td>
                      <td className="num px-6 py-3">
                        <span className="inline-flex items-center gap-2">
                          <Currency value={c.utilized} compact />
                          <span className="text-xs text-muted-foreground">· {utilPct}%</span>
                        </span>
                      </td>
                      <td className="num px-6 py-3">
                        <Currency value={c.remaining} compact />
                      </td>
                      <td className="px-6 py-3">
                        <StatusPill
                          tone={
                            c.status === "active"
                              ? "success"
                              : c.status === "pendingSetup"
                                ? "warning"
                                : c.status === "cancelled"
                                  ? "danger"
                                  : "default"
                          }
                        >
                          {dict.contractStatus[c.status]}
                        </StatusPill>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

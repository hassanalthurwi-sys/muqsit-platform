"use client";

import { Suspense, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Recycle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Currency } from "@/components/ui/currency";
import { StatusPill } from "@/components/ui/status-pill";
import { RecycledBadge } from "@/components/ui/recycled-badge";
import { useStore } from "@/lib/mock/store";
import { findInvestor } from "@/lib/mock/investors";
import { useI18n } from "@/components/providers/i18n-provider";
import { formatDate } from "@/lib/format";
import { recycleReady } from "@/lib/mock/recycling";
import type { ContractStatus } from "@/lib/mock/types";
import { cn } from "@/lib/utils";

type Filter = "all" | "ready" | ContractStatus;

function InvestmentsList() {
  const { dict, locale } = useI18n();
  const search = useSearchParams();
  const initialFilter: Filter = search.get("ready") === "1" ? "ready" : "all";
  const { investmentContracts, installmentContracts } = useStore();
  const [filter, setFilter] = useState<Filter>(initialFilter);
  const inv = dict.investments;

  const readyMap = useMemo(() => {
    const map = new Map<string, number>();
    for (const r of recycleReady(investmentContracts, installmentContracts)) {
      map.set(r.contract.id, r.collected);
    }
    return map;
  }, [investmentContracts, installmentContracts]);

  const rows = useMemo(() => {
    let list = investmentContracts;
    if (filter === "ready") list = list.filter((c) => readyMap.has(c.id));
    else if (filter !== "all") list = list.filter((c) => c.status === filter);
    return [...list].sort((a, b) => (a.startDate > b.startDate ? -1 : 1));
  }, [investmentContracts, filter, readyMap]);

  const filters: Array<{ key: Filter; label: string; count?: number }> = [
    { key: "all", label: inv.filters.all },
    { key: "ready", label: dict.recycling.listTitle, count: readyMap.size },
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
          const isReady = f.key === "ready";
          return (
            <button
              key={f.key}
              type="button"
              onClick={() => setFilter(f.key)}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
                active
                  ? isReady
                    ? "bg-primary text-primary-foreground"
                    : "bg-primary text-primary-foreground"
                  : isReady
                    ? "bg-primary-soft text-primary-soft-foreground hover:bg-primary-soft/70"
                    : "bg-muted text-muted-foreground hover:bg-muted/70",
              )}
            >
              {isReady ? <Recycle className="size-3" aria-hidden /> : null}
              {f.label}
              {typeof f.count === "number" && f.count > 0 ? (
                <span className="num">· {f.count}</span>
              ) : null}
            </button>
          );
        })}
      </div>

      {filter === "ready" ? (
        <p className="rounded-lg bg-muted/40 px-4 py-3 text-xs leading-6 text-muted-foreground">
          {dict.recycling.thresholdRule}
        </p>
      ) : null}

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
                  <th className="px-6 py-3 text-start font-medium">{inv.columns.utilized}</th>
                  <th className="px-6 py-3 text-start font-medium">{inv.columns.remaining}</th>
                  <th className="px-6 py-3 text-start font-medium">{inv.columns.status}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {rows.map((c) => {
                  const investor = findInvestor(c.investorId);
                  const utilPct = c.amount ? Math.round((c.utilized / c.amount) * 100) : 0;
                  const ready = readyMap.get(c.id);
                  return (
                    <tr key={c.id} className="hover:bg-muted/40">
                      <td className="px-6 py-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <Link
                            href={`/investments/${c.id}`}
                            className="num font-medium text-primary hover:underline"
                          >
                            {c.number}
                          </Link>
                          {c.sourceContractId ? <RecycledBadge /> : null}
                          {ready !== undefined ? (
                            <Link
                              href={`/investments/new?recycleFromId=${c.id}`}
                              className="inline-flex items-center gap-1 rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold text-primary-foreground hover:bg-primary/90"
                            >
                              <Recycle className="size-3" aria-hidden />
                              {dict.recycling.runNow}
                            </Link>
                          ) : null}
                        </div>
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
                      <td className="num px-6 py-3">
                        <span className="inline-flex items-center gap-2">
                          <Currency value={c.utilized} compact />
                          <span className="text-xs text-muted-foreground">· {utilPct}%</span>
                        </span>
                      </td>
                      <td className="num px-6 py-3">
                        {ready !== undefined ? (
                          <span className="inline-flex items-center gap-1">
                            <Currency value={ready} compact />
                            <span className="text-[10px] font-medium text-primary">
                              · {dict.recycling.rowAvailableLabel}
                            </span>
                          </span>
                        ) : (
                          <Currency value={c.remaining} compact />
                        )}
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
                {rows.length === 0 && filter === "ready" ? (
                  <tr>
                    <td colSpan={9} className="px-6 py-10 text-center text-sm text-muted-foreground">
                      {dict.recycling.empty}
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function InvestmentsPage() {
  return (
    <Suspense fallback={null}>
      <InvestmentsList />
    </Suspense>
  );
}

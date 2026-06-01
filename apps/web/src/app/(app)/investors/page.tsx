"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Currency } from "@/components/ui/currency";
import { StatusPill } from "@/components/ui/status-pill";
import { IdentityBadge } from "@/components/ui/identity-badge";
import { InvestorAvatar } from "@/components/investor-avatar";
import { MOCK_INVESTORS } from "@/lib/mock/investors";
import { useI18n } from "@/components/providers/i18n-provider";
import type { InvestorType } from "@/lib/mock/types";
import { cn } from "@/lib/utils";

type Filter = "all" | InvestorType;

export default function InvestorsPage() {
  const { dict } = useI18n();
  const [filter, setFilter] = useState<Filter>("all");
  const i = dict.investors;

  const rows = MOCK_INVESTORS.filter((inv) => filter === "all" || inv.type === filter);

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{i.pageTitle}</h1>
          <p className="text-sm text-muted-foreground">{i.pageSubtitle}</p>
        </div>
      </header>

      <div className="flex flex-wrap gap-1.5">
        {(["all", "internal", "external"] as const).map((key) => {
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
              {i.filters[key]}
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
                  <th className="px-6 py-3 text-start font-medium">{i.columns.investor}</th>
                  <th className="px-6 py-3 text-start font-medium">{i.columns.type}</th>
                  <th className="px-6 py-3 text-start font-medium">{i.columns.identity}</th>
                  <th className="px-6 py-3 text-start font-medium">{i.columns.totalCapital}</th>
                  <th className="px-6 py-3 text-start font-medium">{i.columns.utilized}</th>
                  <th className="px-6 py-3 text-start font-medium">{i.columns.activeContracts}</th>
                  <th className="px-6 py-3 text-start font-medium">{i.columns.status}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {rows.map((inv) => {
                  const utilPct = inv.totalCapital
                    ? Math.round((inv.utilizedCapital / inv.totalCapital) * 100)
                    : 0;
                  return (
                    <tr key={inv.id} className="hover:bg-muted/40">
                      <td className="px-6 py-3">
                        <Link href={`/investors/${inv.id}`} className="flex items-center gap-3">
                          <InvestorAvatar name={inv.name} kind={inv.identity.kind} size="sm" />
                          <span className="font-medium hover:underline">{inv.name}</span>
                        </Link>
                      </td>
                      <td className="px-6 py-3">
                        <StatusPill tone={inv.type === "internal" ? "primary" : "gold"}>
                          {dict.investorType[inv.type]}
                        </StatusPill>
                      </td>
                      <td className="px-6 py-3">
                        <IdentityBadge kind={inv.identity.kind} />
                      </td>
                      <td className="num px-6 py-3 font-medium">
                        <Currency value={inv.totalCapital} compact />
                      </td>
                      <td className="num px-6 py-3">
                        <span className="inline-flex items-center gap-2">
                          <span>
                            <Currency value={inv.utilizedCapital} compact />
                          </span>
                          <span className="text-muted-foreground text-xs">· {utilPct}%</span>
                        </span>
                      </td>
                      <td className="num px-6 py-3 font-medium">{inv.activeContractCount}</td>
                      <td className="px-6 py-3">
                        <StatusPill
                          tone={
                            inv.status === "active"
                              ? "success"
                              : inv.status === "suspended"
                                ? "danger"
                                : "default"
                          }
                        >
                          {dict.investorStatus[inv.status]}
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

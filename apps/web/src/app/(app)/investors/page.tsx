"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Currency } from "@/components/ui/currency";
import { StatusPill } from "@/components/ui/status-pill";
import { IdentityBadge } from "@/components/ui/identity-badge";
import { InvestorAvatar } from "@/components/investor-avatar";
import { MOCK_INVESTORS, getInvestedCapital } from "@/lib/mock/investors";
import { useStore } from "@/lib/mock/store";
import { useI18n } from "@/components/providers/i18n-provider";
import type { InvestorType, LegalIdentity } from "@/lib/mock/types";
import { cn } from "@/lib/utils";

type Filter = "all" | InvestorType;

function identityValue(id: LegalIdentity): string {
  switch (id.kind) {
    case "saudiIndividual":
      return id.nationalId;
    case "gccIndividual":
      return id.gccId;
    case "foreignIndividual":
      return id.passport;
    case "commercialEntity":
      return id.cr;
  }
}

export default function InvestorsPage() {
  const { dict } = useI18n();
  const { investmentContracts: contracts, officeSettings, getInvestorBalance } = useStore();
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const i = dict.investors;

  const recyclingThreshold = officeSettings.investmentDefaults.recyclingThreshold;

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return MOCK_INVESTORS.filter((inv) => {
      if (filter !== "all" && inv.type !== filter) return false;
      if (!q) return true;
      return (
        inv.name.toLowerCase().includes(q) ||
        identityValue(inv.identity).toLowerCase().includes(q)
      );
    }).map((inv) => {
      const balance = getInvestorBalance(inv.id);
      return {
        inv,
        balance,
        invested: getInvestedCapital(contracts, inv.id),
        eligibleForRecycling: balance >= recyclingThreshold,
      };
    });
  }, [contracts, filter, query, recyclingThreshold, getInvestorBalance]);

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{i.pageTitle}</h1>
          <p className="text-sm text-muted-foreground">{i.pageSubtitle}</p>
        </div>
      </header>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
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
        <div className="relative w-full sm:w-72">
          <Search className="pointer-events-none absolute start-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={i.searchPlaceholder}
            className="h-9 w-full rounded-md border bg-card ps-9 pe-3 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>
      </div>

      {/* Mobile card list */}
      <div className="flex flex-col gap-3 md:hidden">
        {rows.map(({ inv, balance, invested, eligibleForRecycling }) => (
          <Link
            key={inv.id}
            href={`/investors/${inv.id}`}
            className="rounded-xl border bg-card p-4 transition-colors hover:bg-muted/40"
          >
            <div className="flex items-start gap-3">
              <InvestorAvatar name={inv.name} kind={inv.identity.kind} size="sm" />
              <div className="min-w-0 flex-1 space-y-1.5">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="font-medium">{inv.name}</span>
                  <StatusPill tone={inv.type === "internal" ? "primary" : "gold"}>
                    {dict.investorType[inv.type]}
                  </StatusPill>
                </div>
                <IdentityBadge kind={inv.identity.kind} />
              </div>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
              <div className="space-y-0.5">
                <p className="label">{i.metric.currentBalance}</p>
                <p className="num font-semibold">
                  <Currency value={balance} compact />
                </p>
              </div>
              <div className="space-y-0.5">
                <p className="label">{i.metric.investedCapital}</p>
                <p className="num font-semibold">
                  <Currency value={invested} compact />
                </p>
              </div>
              <div className="space-y-0.5">
                <p className="label">{i.metric.realizedProfit}</p>
                <p className="num font-semibold text-success">
                  <Currency value={inv.realizedProfit} compact />
                </p>
              </div>
              <div className="space-y-0.5">
                <p className="label">{i.metric.activeContracts}</p>
                <p className="num font-semibold">{inv.activeContractCount}</p>
              </div>
            </div>
            {eligibleForRecycling ? (
              <p className="mt-3 inline-flex items-center gap-1.5 rounded-md bg-gold-soft px-2 py-1 text-[11px] font-medium text-gold-foreground">
                <Sparkles className="size-3" />
                {i.recycling.eligible}
              </p>
            ) : null}
          </Link>
        ))}
      </div>

      {/* Desktop table */}
      <Card className="hidden md:block">
        <CardContent className="px-0 pb-2 pt-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-[11px] uppercase text-muted-foreground">
                  <th className="px-6 py-3 text-start font-medium">{i.columns.investor}</th>
                  <th className="px-6 py-3 text-start font-medium">{i.columns.type}</th>
                  <th className="px-6 py-3 text-start font-medium">{i.columns.currentBalance}</th>
                  <th className="px-6 py-3 text-start font-medium">{i.columns.investedCapital}</th>
                  <th className="px-6 py-3 text-start font-medium">{i.columns.realizedProfit}</th>
                  <th className="px-6 py-3 text-start font-medium">{i.columns.activeContracts}</th>
                  <th className="px-6 py-3 text-start font-medium">{i.columns.status}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {rows.map(({ inv, balance, invested, eligibleForRecycling }) => (
                  <tr key={inv.id} className="hover:bg-muted/40">
                    <td className="px-6 py-3">
                      <Link href={`/investors/${inv.id}`} className="flex items-center gap-3">
                        <InvestorAvatar name={inv.name} kind={inv.identity.kind} size="sm" />
                        <div className="min-w-0">
                          <p className="font-medium hover:underline">{inv.name}</p>
                          {eligibleForRecycling ? (
                            <p className="mt-0.5 inline-flex items-center gap-1 text-[11px] font-medium text-gold-foreground">
                              <Sparkles className="size-3" />
                              {i.recycling.eligible}
                            </p>
                          ) : null}
                        </div>
                      </Link>
                    </td>
                    <td className="px-6 py-3">
                      <StatusPill tone={inv.type === "internal" ? "primary" : "gold"}>
                        {dict.investorType[inv.type]}
                      </StatusPill>
                    </td>
                    <td className="num px-6 py-3 font-semibold">
                      <Currency value={balance} compact />
                    </td>
                    <td className="num px-6 py-3">
                      <Currency value={invested} compact />
                    </td>
                    <td className="num px-6 py-3 text-success">
                      <Currency value={inv.realizedProfit} compact />
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
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {rows.length === 0 ? (
        <p className="text-center text-sm text-muted-foreground">—</p>
      ) : null}
    </div>
  );
}

"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Currency } from "@/components/ui/currency";
import { SearchInput } from "@/components/ui/search-input";
import { StatusPill } from "@/components/ui/status-pill";
import { useStore } from "@/lib/mock/store";
import { useI18n } from "@/components/providers/i18n-provider";
import type { PurchaseStatusKey } from "@/lib/i18n/dictionaries";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/format";

type Filter = "all" | PurchaseStatusKey;

const STATUS_TONE: Record<PurchaseStatusKey, "primary" | "warning" | "success"> = {
  purchased: "warning",
  linkedToContract: "primary",
  sold: "success",
};

export default function PurchasesListPage() {
  const { dict, locale } = useI18n();
  const { purchases, installmentContracts } = useStore();
  const p = dict.purchases;
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");

  const filters: Array<{ key: Filter; label: string }> = [
    { key: "all", label: dict.cashLedger.filters.all },
    { key: "purchased", label: dict.purchaseStatus.purchased },
    { key: "linkedToContract", label: dict.purchaseStatus.linkedToContract },
    { key: "sold", label: dict.purchaseStatus.sold },
  ];

  const rows = useMemo(() => {
    return purchases
      .filter((pu) => (filter === "all" ? true : pu.status === filter))
      .filter((pu) => {
        if (!query.trim()) return true;
        const q = query.trim().toLowerCase();
        return (
          pu.number.toLowerCase().includes(q) ||
          pu.supplierName.toLowerCase().includes(q) ||
          pu.description.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => (a.date < b.date ? 1 : -1));
  }, [purchases, filter, query]);

  const linkedContractNumber = (id?: string) =>
    id ? (installmentContracts.find((c) => c.id === id)?.number ?? id) : null;

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div className="space-y-1">
          <Link href="/financial" className="text-xs text-muted-foreground hover:text-foreground">
            ← {dict.financialHub.title}
          </Link>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{p.pageTitle}</h1>
          <p className="text-sm text-muted-foreground">{p.pageSubtitle}</p>
        </div>
        <Link
          href="/financial/purchases/new"
          className="inline-flex items-center gap-1 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          {p.newPurchase}
        </Link>
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
            <p className="px-6 py-8 text-center text-sm text-muted-foreground">
              {dict.cashLedger.empty}
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-[11px] uppercase text-muted-foreground">
                    <th className="px-6 py-3 text-start font-medium">{p.columns.number}</th>
                    <th className="px-6 py-3 text-start font-medium">{p.columns.date}</th>
                    <th className="px-6 py-3 text-start font-medium">{p.columns.supplier}</th>
                    <th className="px-6 py-3 text-start font-medium">{p.columns.description}</th>
                    <th className="px-6 py-3 text-end font-medium">{p.columns.amount}</th>
                    <th className="px-6 py-3 text-start font-medium">{p.columns.status}</th>
                    <th className="px-6 py-3 text-start font-medium">{p.columns.linkedContract}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {rows.map((pu) => {
                    const ctrNumber = linkedContractNumber(pu.linkedContractId);
                    return (
                      <tr key={pu.id} className="hover:bg-muted/40">
                        <td className="num px-6 py-3 font-medium">{pu.number}</td>
                        <td className="num px-6 py-3 text-muted-foreground">
                          {formatDate(pu.date, locale)}
                        </td>
                        <td className="px-6 py-3">{pu.supplierName}</td>
                        <td className="px-6 py-3 text-muted-foreground">{pu.description}</td>
                        <td className="num px-6 py-3 text-end font-medium">
                          <Currency value={pu.amount} />
                        </td>
                        <td className="px-6 py-3">
                          <StatusPill tone={STATUS_TONE[pu.status]}>
                            {dict.purchaseStatus[pu.status]}
                          </StatusPill>
                        </td>
                        <td className="px-6 py-3 text-xs">
                          {ctrNumber ? (
                            <Link
                              href={`/contracts/${pu.linkedContractId}`}
                              className="num text-primary hover:underline"
                            >
                              {ctrNumber}
                            </Link>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
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

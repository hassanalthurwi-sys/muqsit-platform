"use client";

import { Suspense, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Currency } from "@/components/ui/currency";
import { SearchInput } from "@/components/ui/search-input";
import {
  PaymentMethodChip,
  VoucherStatusPill,
} from "@/components/ui/voucher-pills";
import { useStore } from "@/lib/mock/store";
import { findInvestor } from "@/lib/mock/investors";
import { useI18n } from "@/components/providers/i18n-provider";
import type { PartyTypeKey } from "@/lib/i18n/dictionaries";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/format";

type Filter = "all" | PartyTypeKey;

export default function ReceiptsListPage() {
  return (
    <Suspense fallback={null}>
      <ReceiptsListInner />
    </Suspense>
  );
}

function ReceiptsListInner() {
  const { dict, locale } = useI18n();
  const { receipts } = useStore();
  const search = useSearchParams();
  const investorId = search.get("investorId");
  const investor = investorId ? findInvestor(investorId) : undefined;
  const r = dict.receipts;
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");

  const filters: Array<{ key: Filter; label: string }> = [
    { key: "all", label: dict.cashLedger.filters.all },
    { key: "investor", label: dict.partyType.investor },
    { key: "customer", label: dict.partyType.customer },
    { key: "other", label: dict.partyType.other },
  ];

  const rows = useMemo(() => {
    return receipts
      .filter((rcpt) => (investorId ? rcpt.investorId === investorId : true))
      .filter((rcpt) => (filter === "all" ? true : rcpt.partyType === filter))
      .filter((rcpt) => {
        if (!query.trim()) return true;
        const q = query.trim().toLowerCase();
        return (
          rcpt.number.toLowerCase().includes(q) ||
          rcpt.fromName.toLowerCase().includes(q) ||
          (rcpt.reference ?? "").toLowerCase().includes(q)
        );
      })
      .sort((a, b) => (a.date < b.date ? 1 : -1));
  }, [receipts, filter, query, investorId]);

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div className="space-y-1">
          <Link href="/financial" className="text-xs text-muted-foreground hover:text-foreground">
            ← {dict.financialHub.title}
          </Link>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{r.pageTitle}</h1>
          <p className="text-sm text-muted-foreground">{r.pageSubtitle}</p>
        </div>
        <Link
          href="/financial/receipts/new"
          className="inline-flex items-center gap-1 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          {r.newReceipt}
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

      {investor ? (
        <div className="flex flex-wrap items-center gap-2 rounded-md bg-primary-soft px-3 py-2 text-xs text-primary-soft-foreground">
          <span className="font-medium">{dict.investors.pageTitle}:</span>
          <Link href={`/investors/${investor.id}`} className="hover:underline">
            {investor.name}
          </Link>
          <Link
            href="/financial/receipts"
            className="ms-auto inline-flex items-center gap-1 text-muted-foreground hover:text-foreground"
          >
            <X className="size-3" />
          </Link>
        </div>
      ) : null}

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
                    <th className="px-6 py-3 text-start font-medium">{r.columns.number}</th>
                    <th className="px-6 py-3 text-start font-medium">{r.columns.date}</th>
                    <th className="px-6 py-3 text-start font-medium">{r.columns.party}</th>
                    <th className="px-6 py-3 text-start font-medium">{r.columns.from}</th>
                    <th className="px-6 py-3 text-end font-medium">{r.columns.amount}</th>
                    <th className="px-6 py-3 text-start font-medium">{r.columns.method}</th>
                    <th className="px-6 py-3 text-start font-medium">{r.columns.status}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {rows.map((rcpt) => (
                    <tr key={rcpt.id} className="hover:bg-muted/40">
                      <td className="px-6 py-3">
                        <Link
                          href={`/financial/receipts/${rcpt.id}`}
                          className="num font-medium text-primary hover:underline"
                        >
                          {rcpt.number}
                        </Link>
                        {rcpt.flags?.includes("duplicateReference") ? (
                          <span className="ms-2 inline-flex items-center rounded-full bg-warning-soft px-1.5 py-0.5 text-[10px] font-medium text-warning-foreground">
                            ⚠
                          </span>
                        ) : null}
                      </td>
                      <td className="num px-6 py-3 text-muted-foreground">
                        {formatDate(rcpt.date, locale)}
                      </td>
                      <td className="px-6 py-3 text-muted-foreground">
                        {dict.partyType[rcpt.partyType]}
                      </td>
                      <td className="px-6 py-3">{rcpt.fromName}</td>
                      <td className="num px-6 py-3 text-end font-semibold text-success-foreground">
                        +<Currency value={rcpt.amount} />
                      </td>
                      <td className="px-6 py-3">
                        <PaymentMethodChip method={rcpt.method} />
                      </td>
                      <td className="px-6 py-3">
                        <VoucherStatusPill status={rcpt.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

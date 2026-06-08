"use client";

import { Suspense, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Currency } from "@/components/ui/currency";
import { SearchInput } from "@/components/ui/search-input";
import { StatusPill } from "@/components/ui/status-pill";
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

export default function PaymentsListPage() {
  return (
    <Suspense fallback={null}>
      <PaymentsListInner />
    </Suspense>
  );
}

function PaymentsListInner() {
  const { dict, locale } = useI18n();
  const { payments } = useStore();
  const search = useSearchParams();
  const investorId = search.get("investorId");
  const investor = investorId ? findInvestor(investorId) : undefined;
  const p = dict.paymentVouchers;
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");

  const filters: Array<{ key: Filter; label: string }> = [
    { key: "all", label: dict.cashLedger.filters.all },
    { key: "investor", label: dict.partyType.investor },
    { key: "customer", label: dict.partyType.customer },
    { key: "other", label: dict.partyType.other },
  ];

  const rows = useMemo(() => {
    return payments
      .filter((pv) => (investorId ? pv.investorId === investorId : true))
      .filter((pv) => (filter === "all" ? true : pv.partyType === filter))
      .filter((pv) => {
        if (!query.trim()) return true;
        const q = query.trim().toLowerCase();
        return (
          pv.number.toLowerCase().includes(q) ||
          pv.beneficiaryName.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => (a.date < b.date ? 1 : -1));
  }, [payments, filter, query, investorId]);

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
          href="/financial/payments/new"
          className="inline-flex items-center gap-1 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          {p.newPayment}
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
            href="/financial/payments"
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
                    <th className="px-6 py-3 text-start font-medium">{p.columns.number}</th>
                    <th className="px-6 py-3 text-start font-medium">{p.columns.date}</th>
                    <th className="px-6 py-3 text-start font-medium">{p.columns.party}</th>
                    <th className="px-6 py-3 text-start font-medium">{p.columns.beneficiary}</th>
                    <th className="px-6 py-3 text-end font-medium">{p.columns.amount}</th>
                    <th className="px-6 py-3 text-start font-medium">{p.columns.method}</th>
                    <th className="px-6 py-3 text-start font-medium">{p.columns.status}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {rows.map((pv) => (
                    <tr key={pv.id} className="hover:bg-muted/40">
                      <td className="px-6 py-3">
                        <Link
                          href={`/financial/payments/${pv.id}`}
                          className="num font-medium text-primary hover:underline"
                        >
                          {pv.number}
                        </Link>
                        {pv.needsApproval ? (
                          <StatusPill tone="warning" className="ms-2">
                            {p.needsApprovalBadge}
                          </StatusPill>
                        ) : null}
                      </td>
                      <td className="num px-6 py-3 text-muted-foreground">
                        {formatDate(pv.date, locale)}
                      </td>
                      <td className="px-6 py-3 text-muted-foreground">
                        {dict.partyType[pv.partyType]}
                      </td>
                      <td className="px-6 py-3">{pv.beneficiaryName}</td>
                      <td className="num px-6 py-3 text-end font-semibold text-danger-foreground">
                        −<Currency value={pv.amount} />
                      </td>
                      <td className="px-6 py-3">
                        <PaymentMethodChip method={pv.method} />
                      </td>
                      <td className="px-6 py-3">
                        <VoucherStatusPill status={pv.status} />
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

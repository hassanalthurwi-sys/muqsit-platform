"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowDownLeft,
  ArrowUpRight,
  ScrollText,
  Wallet,
  WalletMinimal,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Currency } from "@/components/ui/currency";
import { SearchInput } from "@/components/ui/search-input";
import { PaymentMethodChip } from "@/components/ui/voucher-pills";
import { OPENING_BALANCE } from "@/lib/mock/cash-ledger";
import { useStore } from "@/lib/mock/store";
import { useI18n } from "@/components/providers/i18n-provider";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";

type Filter = "all" | "incoming" | "outgoing" | "cashOnly" | "bankOnly";

export default function CashLedgerPage() {
  const { dict, locale } = useI18n();
  const { cashLedger, employees, cashSummary } = useStore();
  const l = dict.cashLedger;
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");

  const filters: Array<{ key: Filter; label: string }> = [
    { key: "all", label: l.filters.all },
    { key: "incoming", label: l.filters.incoming },
    { key: "outgoing", label: l.filters.outgoing },
    { key: "cashOnly", label: l.filters.cashOnly },
    { key: "bankOnly", label: l.filters.bankOnly },
  ];

  // Compute running balance over the full chronological ledger first
  const fullRunning = useMemo(() => {
    let balance = OPENING_BALANCE;
    return cashLedger.map((entry) => {
      balance =
        entry.direction === "in" ? balance + entry.amount : balance - entry.amount;
      return { entry, runningBalance: balance };
    });
  }, [cashLedger]);

  const filtered = useMemo(() => {
    return fullRunning
      .filter(({ entry }) => {
        if (filter === "incoming") return entry.direction === "in";
        if (filter === "outgoing") return entry.direction === "out";
        if (filter === "cashOnly") return entry.method === "cash";
        if (filter === "bankOnly") return entry.method === "bankTransfer";
        return true;
      })
      .filter(({ entry }) => {
        if (!query.trim()) return true;
        const q = query.trim().toLowerCase();
        return (
          entry.voucherNumber.toLowerCase().includes(q) ||
          entry.description.toLowerCase().includes(q) ||
          (entry.entityName ?? "").toLowerCase().includes(q)
        );
      })
      .reverse(); // newest first
  }, [fullRunning, filter, query]);

  const employeeName = (id: string) =>
    employees.find((e) => e.id === id)?.name ?? "—";

  const kpis = [
    {
      label: l.summary.opening,
      value: cashSummary.opening,
      icon: WalletMinimal,
      tone: "muted" as const,
    },
    {
      label: l.summary.totalIn,
      value: cashSummary.totalIn,
      icon: ArrowDownLeft,
      tone: "success" as const,
    },
    {
      label: l.summary.totalOut,
      value: cashSummary.totalOut,
      icon: ArrowUpRight,
      tone: "danger" as const,
    },
    {
      label: l.summary.balance,
      value: cashSummary.balance,
      icon: Wallet,
      tone: "primary" as const,
    },
  ];

  const kpiTone: Record<"primary" | "success" | "danger" | "muted", string> = {
    primary: "bg-primary-soft text-primary-soft-foreground",
    success: "bg-success-soft text-success-foreground",
    danger: "bg-danger-soft text-danger-foreground",
    muted: "bg-muted text-muted-foreground",
  };

  return (
    <div className="flex flex-col gap-6">
      <header className="space-y-1">
        <Link href="/financial" className="text-xs text-muted-foreground hover:text-foreground">
          ← {dict.financialHub.title}
        </Link>
        <div className="flex items-center gap-2">
          <ScrollText className="size-6 text-primary" />
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{l.pageTitle}</h1>
        </div>
        <p className="text-sm text-muted-foreground">{l.pageSubtitle}</p>
      </header>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((k) => {
          const Icon = k.icon;
          return (
            <Card key={k.label}>
              <CardContent className="flex items-start justify-between gap-3 p-5">
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground">{k.label}</p>
                  <p className="num text-2xl font-semibold tracking-tight">
                    <Currency value={k.value} />
                  </p>
                </div>
                <span
                  className={cn(
                    "flex size-9 items-center justify-center rounded-lg [&_svg]:size-4",
                    kpiTone[k.tone],
                  )}
                >
                  <Icon />
                </span>
              </CardContent>
            </Card>
          );
        })}
      </section>

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
          {filtered.length === 0 ? (
            <p className="px-6 py-8 text-center text-sm text-muted-foreground">{l.empty}</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-[11px] uppercase text-muted-foreground">
                    <th className="px-6 py-3 text-start font-medium">{l.columns.date}</th>
                    <th className="px-6 py-3 text-start font-medium">{l.columns.voucher}</th>
                    <th className="px-6 py-3 text-start font-medium">{l.columns.description}</th>
                    <th className="px-6 py-3 text-start font-medium">{l.columns.method}</th>
                    <th className="px-6 py-3 text-start font-medium">{l.columns.employee}</th>
                    <th className="px-6 py-3 text-end font-medium">{l.columns.amount}</th>
                    <th className="px-6 py-3 text-end font-medium">{l.columns.runningBalance}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filtered.map(({ entry, runningBalance }) => {
                    const isIn = entry.direction === "in";
                    return (
                      <tr key={entry.id} className="hover:bg-muted/40">
                        <td className="num px-6 py-3 text-muted-foreground">
                          {formatDate(entry.date, locale)}
                        </td>
                        <td className="px-6 py-3">
                          <Link
                            href={
                              entry.voucherType === "receipt"
                                ? `/financial/receipts/${entry.voucherId}`
                                : `/financial/payments/${entry.voucherId}`
                            }
                            className="num font-medium text-primary hover:underline"
                          >
                            {entry.voucherNumber}
                          </Link>
                        </td>
                        <td className="px-6 py-3">
                          <p className="leading-tight">{entry.entityName ?? "—"}</p>
                          {entry.description && entry.description !== entry.entityName ? (
                            <p className="text-xs text-muted-foreground">{entry.description}</p>
                          ) : null}
                        </td>
                        <td className="px-6 py-3">
                          <PaymentMethodChip method={entry.method} />
                        </td>
                        <td className="px-6 py-3 text-xs text-muted-foreground">
                          {employeeName(entry.employeeId)}
                        </td>
                        <td
                          className={cn(
                            "num px-6 py-3 text-end font-semibold",
                            isIn ? "text-success-foreground" : "text-danger-foreground",
                          )}
                        >
                          {isIn ? "+" : "−"}
                          <Currency value={entry.amount} />
                        </td>
                        <td className="num px-6 py-3 text-end font-medium">
                          <Currency value={runningBalance} />
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

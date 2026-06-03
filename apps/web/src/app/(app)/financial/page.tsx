"use client";

import Link from "next/link";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Banknote,
  PackageSearch,
  Receipt,
  ScrollText,
  Wallet,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Currency } from "@/components/ui/currency";
import { useStore } from "@/lib/mock/store";
import { useI18n } from "@/components/providers/i18n-provider";
import { cn } from "@/lib/utils";

export default function FinancialHubPage() {
  const { dict } = useI18n();
  const { receipts, payments, cashSummary } = useStore();
  const f = dict.financialHub;

  // Month aggregates — use May 2025 (the demo month)
  const monthFilter = (iso: string) => iso.startsWith("2025-05");
  const monthReceipts = receipts
    .filter((r) => monthFilter(r.date) && r.status !== "cancelled")
    .reduce((s, r) => s + r.amount, 0);
  const monthPayments = payments
    .filter((p) => monthFilter(p.date) && p.status === "verified")
    .reduce((s, p) => s + p.amount, 0);
  const monthNet = monthReceipts - monthPayments;

  const kpis = [
    {
      key: "cash",
      label: f.kpis.cashBalance,
      value: cashSummary.balance,
      icon: Wallet,
      tone: "primary" as const,
    },
    {
      key: "in",
      label: f.kpis.receiptsMonth,
      value: monthReceipts,
      icon: ArrowDownLeft,
      tone: "success" as const,
    },
    {
      key: "out",
      label: f.kpis.paymentsMonth,
      value: monthPayments,
      icon: ArrowUpRight,
      tone: "danger" as const,
    },
    {
      key: "net",
      label: f.kpis.netMonth,
      value: monthNet,
      icon: Banknote,
      tone: monthNet >= 0 ? ("success" as const) : ("danger" as const),
    },
  ];

  const cards = [
    { href: "/financial/receipts", icon: Receipt, ...f.cards.receipts },
    { href: "/financial/payments", icon: Banknote, ...f.cards.payments },
    { href: "/financial/cash-ledger", icon: ScrollText, ...f.cards.cashLedger },
    { href: "/financial/balances", icon: Wallet, ...f.cards.balances },
    { href: "/financial/purchases", icon: PackageSearch, ...f.cards.purchases },
  ];

  const kpiTone: Record<"primary" | "success" | "danger", string> = {
    primary: "bg-primary-soft text-primary-soft-foreground",
    success: "bg-success-soft text-success-foreground",
    danger: "bg-danger-soft text-danger-foreground",
  };

  return (
    <div className="flex flex-col gap-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{f.title}</h1>
        <p className="text-sm text-muted-foreground">{f.subtitle}</p>
      </header>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((k) => {
          const Icon = k.icon;
          return (
            <Card key={k.key} className="overflow-hidden">
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

      <section className="space-y-3">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((c) => {
            const Icon = c.icon;
            return (
              <Link
                key={c.href}
                href={c.href}
                className="group flex items-start gap-4 rounded-xl border bg-card p-5 shadow-[var(--shadow-card)] transition-shadow hover:shadow-lg"
              >
                <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary-soft-foreground">
                  <Icon className="size-5" />
                </span>
                <div className="min-w-0 flex-1 space-y-0.5">
                  <h2 className="text-base font-semibold">{c.title}</h2>
                  <p className="text-xs text-muted-foreground">{c.hint}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}

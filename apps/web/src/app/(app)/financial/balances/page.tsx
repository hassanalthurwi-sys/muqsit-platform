"use client";

import Link from "next/link";
import { Wallet } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Currency } from "@/components/ui/currency";
import { StatusPill } from "@/components/ui/status-pill";
import { useStore } from "@/lib/mock/store";
import { useI18n } from "@/components/providers/i18n-provider";
import { MOCK_INVESTORS } from "@/lib/mock/investors";

export default function BalancesPage() {
  const { dict } = useI18n();
  const {
    cashSummary,
    payments,
    investmentContracts,
    installmentContracts,
    customers,
  } = useStore();
  const b = dict.balances;

  // Investors: capital from investment contracts, profit due via target rate (mocked simply),
  // paid via investorProfit payments to each investor.
  const investorRows = MOCK_INVESTORS.map((investor) => {
    const myContracts = investmentContracts.filter(
      (c) => c.investorId === investor.id && c.status !== "ended",
    );
    const capital = myContracts.reduce((s, c) => s + c.amount, 0);
    // Profit due — mock as ~7% of capital
    const profitDue = Math.round(capital * 0.07);
    const paid = payments
      .filter(
        (p) =>
          p.investorId === investor.id &&
          p.category === "investorProfit" &&
          p.status === "verified",
      )
      .reduce((s, p) => s + p.amount, 0);
    return {
      investor,
      capital,
      profitDue,
      paid,
      net: profitDue - paid,
      activeCount: myContracts.length,
    };
  })
    .filter((row) => row.activeCount > 0)
    .sort((a, b) => b.capital - a.capital);

  // Customers: remaining principal on active installment contracts, overdue installments count
  const customerRows = customers
    .map((customer) => {
      const myContracts = installmentContracts.filter(
        (c) => c.customerId === customer.id && c.status === "active",
      );
      if (myContracts.length === 0) return null;
      const remaining = myContracts.reduce(
        (s, c) => s + c.remainingBalance,
        0,
      );
      const overdueCount = myContracts.reduce(
        (s, c) =>
          s +
          c.schedule.filter(
            (i) => i.status === "overdue" || i.status === "defaulted",
          ).length,
        0,
      );
      return { customer, remaining, overdueCount, activeCount: myContracts.length };
    })
    .filter((r): r is NonNullable<typeof r> => r !== null)
    .sort((a, b) => b.remaining - a.remaining)
    .slice(0, 8);

  return (
    <div className="flex flex-col gap-6">
      <header className="space-y-1">
        <Link href="/financial" className="text-xs text-muted-foreground hover:text-foreground">
          ← {dict.financialHub.title}
        </Link>
        <div className="flex items-center gap-2">
          <Wallet className="size-6 text-primary" />
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{b.pageTitle}</h1>
        </div>
        <p className="text-sm text-muted-foreground">{b.pageSubtitle}</p>
      </header>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">{b.officeCash.title}</CardTitle>
          <p className="text-xs text-muted-foreground">{b.officeCash.hint}</p>
        </CardHeader>
        <CardContent className="flex items-baseline gap-3">
          <p className="num text-4xl font-semibold tracking-tight">
            <Currency value={cashSummary.balance} />
          </p>
          <p className="num text-xs text-muted-foreground">
            (افتتاحي <Currency value={cashSummary.opening} compact /> + قبض{" "}
            <Currency value={cashSummary.totalIn} compact /> − صرف{" "}
            <Currency value={cashSummary.totalOut} compact />)
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">{b.investorsSection.title}</CardTitle>
          <p className="text-xs text-muted-foreground">{b.investorsSection.hint}</p>
        </CardHeader>
        <CardContent className="px-0 pb-2 pt-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-[11px] uppercase text-muted-foreground">
                  <th className="px-6 py-3 text-start font-medium">{b.columns.name}</th>
                  <th className="px-6 py-3 text-end font-medium">{b.columns.capital}</th>
                  <th className="px-6 py-3 text-end font-medium">{b.columns.profitDue}</th>
                  <th className="px-6 py-3 text-end font-medium">{b.columns.paid}</th>
                  <th className="px-6 py-3 text-end font-medium">{b.columns.net}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {investorRows.map((row) => (
                  <tr key={row.investor.id} className="hover:bg-muted/40">
                    <td className="px-6 py-3">
                      <Link
                        href={`/investors/${row.investor.id}`}
                        className="font-medium text-primary hover:underline"
                      >
                        {row.investor.name}
                      </Link>
                      <span className="num ms-2 text-xs text-muted-foreground">
                        ({b.investorsSection.activeContracts.replace("{n}", String(row.activeCount))})
                      </span>
                    </td>
                    <td className="num px-6 py-3 text-end">
                      <Currency value={row.capital} compact />
                    </td>
                    <td className="num px-6 py-3 text-end text-muted-foreground">
                      <Currency value={row.profitDue} compact />
                    </td>
                    <td className="num px-6 py-3 text-end text-success-foreground">
                      <Currency value={row.paid} compact />
                    </td>
                    <td className="num px-6 py-3 text-end font-semibold">
                      <Currency value={row.net} compact />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">{b.customersSection.title}</CardTitle>
          <p className="text-xs text-muted-foreground">{b.customersSection.hint}</p>
        </CardHeader>
        <CardContent className="px-0 pb-2 pt-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-[11px] uppercase text-muted-foreground">
                  <th className="px-6 py-3 text-start font-medium">{b.columns.name}</th>
                  <th className="px-6 py-3 text-end font-medium">{b.columns.remaining}</th>
                  <th className="px-6 py-3 text-end font-medium">{b.columns.overdue}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {customerRows.map((row) => (
                  <tr key={row.customer.id} className="hover:bg-muted/40">
                    <td className="px-6 py-3">
                      <Link
                        href={`/customers/${row.customer.id}`}
                        className="font-medium text-primary hover:underline"
                      >
                        {row.customer.name}
                      </Link>
                      <span className="num ms-2 text-xs text-muted-foreground">
                        ({b.customersSection.activeContracts.replace("{n}", String(row.activeCount))})
                      </span>
                    </td>
                    <td className="num px-6 py-3 text-end font-semibold">
                      <Currency value={row.remaining} compact />
                    </td>
                    <td className="px-6 py-3 text-end">
                      {row.overdueCount > 0 ? (
                        <StatusPill tone="danger">
                          <span className="num">{row.overdueCount}</span>
                        </StatusPill>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

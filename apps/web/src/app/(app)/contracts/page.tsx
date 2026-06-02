"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Currency } from "@/components/ui/currency";
import { StatusPill } from "@/components/ui/status-pill";
import { useStore } from "@/lib/mock/store";
import { useI18n } from "@/components/providers/i18n-provider";
import type { InstallmentContractStatus } from "@/lib/mock/types";
import { cn } from "@/lib/utils";

type Filter = "all" | "overdue" | InstallmentContractStatus;

export default function InstallmentContractsPage() {
  const { dict } = useI18n();
  const { installmentContracts, customers } = useStore();
  const [filter, setFilter] = useState<Filter>("all");
  const ic = dict.installmentContracts;

  const rows = useMemo(() => {
    return installmentContracts.filter((c) => {
      if (filter === "all") return true;
      if (filter === "overdue") return c.schedule.some((s) => s.status === "overdue");
      return c.status === filter;
    });
  }, [installmentContracts, filter]);

  const customerName = (id: string) => customers.find((c) => c.id === id)?.name ?? "—";

  const filters: Array<{ key: Filter; label: string }> = [
    { key: "all", label: ic.filters.all },
    { key: "active", label: ic.filters.active },
    { key: "overdue", label: ic.filters.overdue },
    { key: "defaulted", label: ic.filters.defaulted },
    { key: "completed", label: ic.filters.completed },
  ];

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{ic.pageTitle}</h1>
          <p className="text-sm text-muted-foreground">{ic.pageSubtitle}</p>
        </div>
        <Link
          href="/contracts/new"
          className="inline-flex items-center gap-1 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          {ic.newContract}
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
                  <th className="px-6 py-3 text-start font-medium">{ic.columns.number}</th>
                  <th className="px-6 py-3 text-start font-medium">{ic.columns.customer}</th>
                  <th className="px-6 py-3 text-start font-medium">{ic.columns.product}</th>
                  <th className="px-6 py-3 text-start font-medium">{ic.columns.installmentPrice}</th>
                  <th className="px-6 py-3 text-start font-medium">{ic.columns.monthlyInstallment}</th>
                  <th className="px-6 py-3 text-start font-medium">{ic.columns.installmentsCount}</th>
                  <th className="px-6 py-3 text-start font-medium">{ic.columns.remainingBalance}</th>
                  <th className="px-6 py-3 text-start font-medium">{ic.columns.status}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {rows.map((co) => {
                  const paidCount = co.schedule.filter((s) => s.status === "paid").length;
                  return (
                    <tr key={co.id} className="hover:bg-muted/40">
                      <td className="px-6 py-3">
                        <Link
                          href={`/contracts/${co.id}`}
                          className="num font-medium text-primary hover:underline"
                        >
                          {co.number}
                        </Link>
                      </td>
                      <td className="px-6 py-3 font-medium">{customerName(co.customerId)}</td>
                      <td className="px-6 py-3 text-muted-foreground">{co.productType}</td>
                      <td className="num px-6 py-3">
                        <Currency value={co.installmentPrice} compact />
                      </td>
                      <td className="num px-6 py-3">
                        <Currency value={co.monthlyInstallment} />
                      </td>
                      <td className="num px-6 py-3">
                        {paidCount} / {co.installmentsCount}
                      </td>
                      <td className="num px-6 py-3">
                        <Currency value={co.remainingBalance} compact />
                      </td>
                      <td className="px-6 py-3">
                        <StatusPill
                          tone={
                            co.status === "active"
                              ? "success"
                              : co.status === "defaulted"
                                ? "danger"
                                : co.status === "completed"
                                  ? "primary"
                                  : "default"
                          }
                        >
                          {dict.installmentContractStatus[co.status]}
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

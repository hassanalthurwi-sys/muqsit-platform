"use client";

import Link from "next/link";
import { Upload } from "lucide-react";
import { CustomerShell } from "@/components/portal/customer-shell";
import { PortalCard } from "@/components/portal/portal-card";
import { Currency } from "@/components/ui/currency";
import { StatusPill } from "@/components/ui/status-pill";
import { useI18n } from "@/components/providers/i18n-provider";
import { useCustomerIdentity } from "@/lib/portal/use-portal-identity";
import { customerActiveContract, customerSummary } from "@/lib/portal/data";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { InstallmentStatus } from "@/lib/mock/types";

const STATUS_TONE: Record<InstallmentStatus, "default" | "primary" | "gold" | "success" | "warning" | "danger"> = {
  paid: "success",
  partiallyPaid: "gold",
  scheduled: "default",
  overdue: "warning",
  defaulted: "danger",
};

export default function CustomerInstallmentsPage() {
  const { dict, locale } = useI18n();
  const t = dict.portals.customer.installments;
  const customer = useCustomerIdentity();
  const contract = customerActiveContract(customer.id);
  const summary = customerSummary(customer.id);

  if (!contract || !summary) {
    return (
      <CustomerShell>
        <PortalCard>
          <p className="text-sm text-muted-foreground">{dict.portals.common.empty}</p>
        </PortalCard>
      </CustomerShell>
    );
  }

  const labelFor = (s: InstallmentStatus): string => {
    if (s === "paid") return t.status.paid;
    if (s === "overdue" || s === "defaulted") return t.status.overdue;
    if (s === "partiallyPaid") return t.status.partial;
    return t.status.scheduled;
  };

  return (
    <CustomerShell>
      <div className="space-y-4">
        <header className="space-y-1">
          <h1 className="text-xl font-semibold tracking-tight">{t.pageTitle}</h1>
          <p className="num text-xs text-muted-foreground">
            {t.contractLabel.replace("{number}", contract.number).replace("{product}", contract.productType)}
          </p>
        </header>

        {/* Summary tiles */}
        <div className="grid grid-cols-3 gap-2">
          <PortalCard>
            <p className="text-[10px] font-medium text-muted-foreground">{t.summary.total}</p>
            <p className="num mt-1.5 text-sm font-semibold text-foreground">
              <Currency value={summary.totalAmount} compact />
            </p>
          </PortalCard>
          <PortalCard>
            <p className="text-[10px] font-medium text-muted-foreground">{t.summary.paid}</p>
            <p className="num mt-1.5 text-sm font-semibold text-success">
              <Currency value={summary.paidAmount} compact />
            </p>
          </PortalCard>
          <PortalCard>
            <p className="text-[10px] font-medium text-muted-foreground">{t.summary.remaining}</p>
            <p className="num mt-1.5 text-sm font-semibold text-foreground">
              <Currency value={summary.remainingAmount} compact />
            </p>
          </PortalCard>
        </div>

        {/* Installment list */}
        <PortalCard className="!p-0">
          <ul className="divide-y divide-border">
            {contract.schedule.map((inst) => (
              <li key={inst.id} className="flex items-center gap-3 px-4 py-3">
                <span className={cn(
                  "num flex size-9 shrink-0 items-center justify-center rounded-lg text-xs font-bold",
                  inst.status === "paid"
                    ? "bg-success-soft text-success-foreground"
                    : inst.status === "overdue" || inst.status === "defaulted"
                      ? "bg-warning-soft text-warning-foreground"
                      : inst.status === "partiallyPaid"
                        ? "bg-gold-soft text-gold-foreground"
                        : "bg-muted text-muted-foreground",
                )}>
                  {inst.index}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-2">
                    <p className="num text-sm font-medium text-foreground">
                      <Currency value={inst.amount} />
                    </p>
                    <span className="num text-[11px] text-muted-foreground">
                      {t.rowDue} · {formatDate(inst.dueDate, locale)}
                    </span>
                  </div>
                  <div className="mt-1 flex items-center justify-between gap-2">
                    <StatusPill tone={STATUS_TONE[inst.status]}>{labelFor(inst.status)}</StatusPill>
                    {inst.status !== "paid" ? (
                      <Link
                        href={`/portal/customer/payments/upload/${inst.id}`}
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary hover:underline"
                      >
                        <Upload className="size-3" aria-hidden />
                        {t.rowUpload}
                      </Link>
                    ) : null}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </PortalCard>
      </div>
    </CustomerShell>
  );
}

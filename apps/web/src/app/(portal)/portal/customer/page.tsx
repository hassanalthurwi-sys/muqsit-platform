"use client";

import Link from "next/link";
import { AlertCircle, ArrowLeft, ArrowRight, CalendarDays, CreditCard, Upload } from "lucide-react";
import { CustomerShell } from "@/components/portal/customer-shell";
import { PortalCard } from "@/components/portal/portal-card";
import { Currency } from "@/components/ui/currency";
import { useI18n } from "@/components/providers/i18n-provider";
import { useCustomerIdentity } from "@/lib/portal/use-portal-identity";
import { customerSummary } from "@/lib/portal/data";
import { formatDate } from "@/lib/format";

export default function CustomerDashboardPage() {
  const { dict, locale, dir } = useI18n();
  const t = dict.portals.customer.dashboard;
  const customer = useCustomerIdentity();
  const s = customerSummary(customer.id);
  const Arrow = dir === "rtl" ? ArrowLeft : ArrowRight;

  if (!s) {
    return (
      <CustomerShell>
        <PortalCard>
          <p className="text-sm text-muted-foreground">{dict.portals.common.empty}</p>
        </PortalCard>
      </CustomerShell>
    );
  }

  const progressPct = s.totalCount > 0 ? Math.round((s.paidCount / s.totalCount) * 100) : 0;

  return (
    <CustomerShell>
      <div className="space-y-5">
        <p className="text-sm text-muted-foreground">
          {t.greeting.replace("{name}", customer.name.split(" ")[0])}
        </p>

        {/* Overdue alert if applicable */}
        {s.hasOverdue ? (
          <PortalCard tone="warning" className="flex items-start gap-3">
            <span className="mt-0.5 flex size-9 items-center justify-center rounded-lg bg-warning text-white">
              <AlertCircle className="size-4" aria-hidden />
            </span>
            <div className="flex-1">
              <p className="text-sm font-semibold">{t.overdueAlertTitle}</p>
              <p className="text-xs leading-6">{t.overdueAlertBody}</p>
            </div>
            <Link
              href="/portal/customer/payments/upload"
              className="self-center rounded-lg bg-warning px-3 py-1.5 text-xs font-semibold text-white hover:opacity-90"
            >
              {t.ctaUploadProof}
            </Link>
          </PortalCard>
        ) : null}

        {/* Next installment hero */}
        {s.nextInstallment ? (
          <PortalCard tone="primary" className="space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-medium opacity-80">{t.nextInstallmentLabel}</p>
                <p className="num mt-2 text-3xl font-semibold tracking-tight sm:text-[2rem]">
                  <Currency value={s.nextInstallment.amount} />
                </p>
                <p className="num mt-1 text-xs opacity-80">
                  {t.nextInstallmentDueOn.replace("{date}", formatDate(s.nextInstallment.dueDate, locale))}
                </p>
              </div>
              <span className="flex size-10 items-center justify-center rounded-xl bg-primary/15">
                <CalendarDays className="size-5" aria-hidden />
              </span>
            </div>
            <Link
              href={`/portal/customer/payments/upload/${s.nextInstallment.id}`}
              className="flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90"
            >
              <Upload className="size-4" aria-hidden />
              {t.ctaUploadProof}
            </Link>
          </PortalCard>
        ) : (
          <PortalCard tone="primary">
            <p className="text-sm font-semibold">{t.paidUpStatus}</p>
          </PortalCard>
        )}

        {/* Remaining + paid KPIs */}
        <div className="grid grid-cols-2 gap-3">
          <PortalCard>
            <p className="text-[11px] font-medium text-muted-foreground">{t.remainingLabel}</p>
            <p className="num mt-2 text-xl font-semibold text-foreground">
              <Currency value={s.remainingAmount} />
            </p>
          </PortalCard>
          <PortalCard>
            <p className="text-[11px] font-medium text-muted-foreground">{t.paidLabel}</p>
            <p className="num mt-2 text-xl font-semibold text-success">
              <Currency value={s.paidAmount} />
            </p>
          </PortalCard>
        </div>

        {/* Progress */}
        <PortalCard>
          <p className="text-[11px] font-medium text-muted-foreground">
            {t.progressLabel.replace("{paid}", String(s.paidCount)).replace("{total}", String(s.totalCount))}
          </p>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
            <div className="h-full rounded-full bg-success" style={{ width: `${progressPct}%` }} />
          </div>
        </PortalCard>

        {/* Active contract meta */}
        <Link
          href="/portal/customer/installments"
          className="flex items-center justify-between rounded-2xl border border-border bg-card p-4 hover:border-primary/40"
        >
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex size-9 items-center justify-center rounded-lg bg-primary-soft text-primary-soft-foreground">
              <CreditCard className="size-4" aria-hidden />
            </span>
            <span className="min-w-0 flex-1 truncate text-sm font-medium">
              {t.contractMeta.replace("{product}", s.productLabel).replace("{number}", s.contractNumber)}
            </span>
          </div>
          <Arrow className="size-4 text-muted-foreground" aria-hidden />
        </Link>

        <Link
          href="/portal/customer/installments"
          className="flex items-center justify-between rounded-2xl border border-border bg-card p-4 text-sm font-medium hover:border-primary/40"
        >
          <span className="flex items-center gap-3">
            <span className="flex size-9 items-center justify-center rounded-lg bg-primary-soft text-primary-soft-foreground">
              <CalendarDays className="size-4" aria-hidden />
            </span>
            {t.ctaSchedule}
          </span>
          <Arrow className="size-4 text-muted-foreground" aria-hidden />
        </Link>
      </div>
    </CustomerShell>
  );
}

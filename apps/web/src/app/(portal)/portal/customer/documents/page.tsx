"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, Download, FileText } from "lucide-react";
import { CustomerShell } from "@/components/portal/customer-shell";
import { PortalCard } from "@/components/portal/portal-card";
import { useI18n } from "@/components/providers/i18n-provider";
import { useCustomerIdentity } from "@/lib/portal/use-portal-identity";
import { customerActiveContract, customerRecentProofs } from "@/lib/portal/data";
import { formatDate } from "@/lib/format";
import { Currency } from "@/components/ui/currency";

export default function CustomerDocumentsPage() {
  const { dict, locale, dir } = useI18n();
  const t = dict.portals.customer.documents;
  const customer = useCustomerIdentity();
  const contract = customerActiveContract(customer.id);
  const proofs = customerRecentProofs(customer.id).filter((p) => p.status === "approved");
  const Arrow = dir === "rtl" ? ArrowLeft : ArrowRight;

  return (
    <CustomerShell>
      <div className="space-y-5">
        <header className="space-y-1">
          <h1 className="text-xl font-semibold tracking-tight">{t.pageTitle}</h1>
        </header>

        <Link
          href="/portal/customer/account"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <Arrow className="size-4" aria-hidden />
          {dict.portals.common.backToHome}
        </Link>

        {/* Contract */}
        {contract ? (
          <PortalCard className="!p-0">
            <div className="flex items-center gap-3 px-4 py-3">
              <span className="flex size-10 items-center justify-center rounded-xl bg-primary-soft text-primary-soft-foreground">
                <FileText className="size-4" aria-hidden />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-foreground">{t.contractDoc}</p>
                <p className="num text-[11px] text-muted-foreground">
                  {contract.number} · {contract.productType}
                </p>
              </div>
              <button
                type="button"
                className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium hover:bg-muted"
              >
                <Download className="size-3.5" aria-hidden />
                {t.download}
              </button>
            </div>
            <div className="flex items-center gap-3 border-t border-border px-4 py-3">
              <span className="flex size-10 items-center justify-center rounded-xl bg-primary-soft text-primary-soft-foreground">
                <FileText className="size-4" aria-hidden />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-foreground">{t.scheduleDoc}</p>
                <p className="num text-[11px] text-muted-foreground">
                  {contract.installmentsCount} {dict.portals.common.monthly}
                </p>
              </div>
              <button
                type="button"
                className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium hover:bg-muted"
              >
                <Download className="size-3.5" aria-hidden />
                {t.download}
              </button>
            </div>
          </PortalCard>
        ) : null}

        {/* Receipts */}
        <section>
          <h2 className="mb-2 text-sm font-semibold text-foreground">{t.receipts}</h2>
          {proofs.length === 0 ? (
            <PortalCard>
              <p className="text-sm text-muted-foreground">{t.empty}</p>
            </PortalCard>
          ) : (
            <PortalCard className="!p-0">
              <ul className="divide-y divide-border">
                {proofs.map((p) => (
                  <li key={p.id} className="flex items-center gap-3 px-4 py-3">
                    <span className="flex size-9 items-center justify-center rounded-lg bg-success-soft text-success-foreground">
                      <FileText className="size-4" aria-hidden />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="num text-sm font-medium text-foreground">
                        <Currency value={p.amount} />
                      </p>
                      <p className="num text-[11px] text-muted-foreground">
                        {formatDate(p.uploadedAt, locale)} · {dict.paymentMethod[p.method]} · {p.reference}
                      </p>
                    </div>
                    <button
                      type="button"
                      className="inline-flex items-center gap-1.5 rounded-lg border border-border px-2.5 py-1 text-xs font-medium hover:bg-muted"
                    >
                      <Download className="size-3" aria-hidden />
                      {t.download}
                    </button>
                  </li>
                ))}
              </ul>
            </PortalCard>
          )}
        </section>
      </div>
    </CustomerShell>
  );
}

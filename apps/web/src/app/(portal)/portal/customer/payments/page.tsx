"use client";

import Link from "next/link";
import { Upload } from "lucide-react";
import { CustomerShell } from "@/components/portal/customer-shell";
import { PortalCard } from "@/components/portal/portal-card";
import { Currency } from "@/components/ui/currency";
import { StatusPill } from "@/components/ui/status-pill";
import { useI18n } from "@/components/providers/i18n-provider";
import { useCustomerIdentity } from "@/lib/portal/use-portal-identity";
import { customerRecentProofs } from "@/lib/portal/data";
import { formatDate } from "@/lib/format";

export default function CustomerPaymentsPage() {
  const { dict, locale } = useI18n();
  const t = dict.portals.customer.payments;
  const customer = useCustomerIdentity();
  const proofs = customerRecentProofs(customer.id);

  return (
    <CustomerShell>
      <div className="space-y-4">
        <header className="space-y-1">
          <h1 className="text-xl font-semibold tracking-tight">{t.pageTitle}</h1>
          <p className="text-xs text-muted-foreground">{t.uploadHint}</p>
        </header>

        <Link
          href="/portal/customer/payments/upload"
          className="flex items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-4 text-sm font-semibold text-primary-foreground hover:opacity-90"
        >
          <Upload className="size-4" aria-hidden />
          {t.uploadCta}
        </Link>

        <section className="space-y-2">
          <h2 className="text-sm font-semibold text-foreground">{t.recentTitle}</h2>
          {proofs.length === 0 ? (
            <PortalCard>
              <p className="text-sm text-muted-foreground">{t.empty}</p>
            </PortalCard>
          ) : (
            <PortalCard className="!p-0">
              <ul className="divide-y divide-border">
                {proofs.map((p) => {
                  const tone =
                    p.status === "approved" ? "success" : p.status === "rejected" ? "danger" : "warning";
                  const label =
                    p.status === "approved" ? t.proofStatus.approved : p.status === "rejected" ? t.proofStatus.rejected : t.proofStatus.pending;
                  return (
                    <li key={p.id} className="flex items-center gap-3 px-4 py-3">
                      <div className="flex min-w-0 flex-1 flex-col">
                        <div className="flex items-baseline justify-between gap-2">
                          <p className="num text-sm font-medium text-foreground">
                            <Currency value={p.amount} />
                          </p>
                          <span className="num text-[11px] text-muted-foreground">{formatDate(p.uploadedAt, locale)}</span>
                        </div>
                        <div className="mt-1 flex items-center justify-between gap-2">
                          <p className="num text-[11px] text-muted-foreground">
                            {dict.paymentMethod[p.method]} · {p.reference}
                          </p>
                          <StatusPill tone={tone}>{label}</StatusPill>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </PortalCard>
          )}
        </section>
      </div>
    </CustomerShell>
  );
}

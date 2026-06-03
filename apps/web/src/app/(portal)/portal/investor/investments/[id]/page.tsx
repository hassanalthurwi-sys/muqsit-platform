"use client";

import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { ArrowLeft, ArrowRight, FileText, Share2 } from "lucide-react";
import { InvestorShell } from "@/components/portal/investor-shell";
import { PortalCard } from "@/components/portal/portal-card";
import { Currency } from "@/components/ui/currency";
import { StatusPill } from "@/components/ui/status-pill";
import { RecycledBadge } from "@/components/ui/recycled-badge";
import { DataRow, DataRows } from "@/components/ui/data-row";
import { useI18n } from "@/components/providers/i18n-provider";
import { useInvestorIdentity } from "@/lib/portal/use-portal-identity";
import { findContract } from "@/lib/mock/contracts";
import { formatDate } from "@/lib/format";

export default function InvestmentDetailPage() {
  const params = useParams<{ id: string }>();
  const { dict, locale, dir } = useI18n();
  const t = dict.portals.investor.investments.detail;
  const investor = useInvestorIdentity();
  const contract = findContract(params.id);
  if (!contract || contract.investorId !== investor.id) notFound();
  const Arrow = dir === "rtl" ? ArrowRight : ArrowLeft;

  return (
    <InvestorShell>
      <div className="space-y-4">
        <Link
          href="/portal/investor/investments"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <Arrow className="size-4" aria-hidden />
          {t.back}
        </Link>

        <PortalCard tone="primary" className="space-y-3">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <p className="num text-xs font-medium opacity-80">{contract.number}</p>
              {contract.sourceContractId ? <RecycledBadge /> : null}
            </div>
            <p className="num mt-1 text-3xl font-semibold tracking-tight">
              <Currency value={contract.amount} />
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {contract.capitalRecyclingEnabled ? (
              <StatusPill tone="primary">{dict.portals.investor.investments.recyclingOn}</StatusPill>
            ) : (
              <StatusPill tone="default">{dict.portals.investor.investments.recyclingOff}</StatusPill>
            )}
            <StatusPill tone="gold">
              <span className="num">{contract.operationPct}%</span> · {t.operationPct}
            </StatusPill>
          </div>
        </PortalCard>

        <PortalCard>
          <DataRows>
            <DataRow label={t.principal} value={<Currency value={contract.amount} />} />
            <DataRow label={t.utilized} value={<Currency value={contract.utilized} />} />
            <DataRow label={t.unutilized} value={<Currency value={contract.remaining} />} />
            <DataRow label={t.startDate} value={formatDate(contract.startDate, locale)} />
            <DataRow label={t.endDate} value={formatDate(contract.endDate, locale)} />
            <DataRow label={t.operationPct} value={<span className="num">{contract.operationPct}%</span>} />
            <DataRow
              label={t.recycling}
              value={contract.capitalRecyclingEnabled ? dict.portals.investor.investments.recyclingOn : dict.portals.investor.investments.recyclingOff}
            />
            {contract.capitalRecyclingMinThreshold ? (
              <DataRow
                label={t.recyclingMin}
                value={<Currency value={contract.capitalRecyclingMinThreshold} />}
              />
            ) : null}
          </DataRows>
        </PortalCard>

        {contract.sourceContractId ? (
          <PortalCard>
            <div className="mb-2 flex items-center gap-2">
              <RecycledBadge />
              <h2 className="text-sm font-semibold">{dict.recycling.detail.sectionTitle}</h2>
            </div>
            <DataRows>
              {contract.recycledFromCollected !== undefined ? (
                <DataRow
                  label={dict.recycling.detail.collectedRow}
                  value={<Currency value={contract.recycledFromCollected} />}
                />
              ) : null}
              {contract.recyclingOfficeMargin !== undefined ? (
                <DataRow
                  label={dict.recycling.detail.officeShareRow}
                  value={<Currency value={contract.recyclingOfficeMargin} />}
                />
              ) : null}
              <DataRow
                label={dict.recycling.detail.financingRow}
                value={<Currency value={contract.amount} />}
              />
            </DataRows>
          </PortalCard>
        ) : null}

        <PortalCard>
          <h2 className="mb-2 text-sm font-semibold">{t.profitTerms}</h2>
          <p className="text-sm leading-7 text-muted-foreground">{contract.profitNotes}</p>
        </PortalCard>

        {contract.documentName ? (
          <PortalCard className="!p-0">
            <div className="flex items-center justify-between gap-3 px-4 py-3">
              <span className="flex items-center gap-3">
                <span className="flex size-9 items-center justify-center rounded-lg bg-primary-soft text-primary-soft-foreground">
                  <FileText className="size-4" aria-hidden />
                </span>
                <span className="flex flex-col">
                  <span className="text-sm font-medium">{t.documentLabel}</span>
                  <span className="num text-[11px] text-muted-foreground">{contract.documentName}</span>
                </span>
              </span>
              <button
                type="button"
                className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium hover:bg-muted"
              >
                <Share2 className="size-3.5" aria-hidden />
                {t.share}
              </button>
            </div>
          </PortalCard>
        ) : null}

        <section>
          <h2 className="mb-2 text-sm font-semibold">{t.timelineTitle}</h2>
          <PortalCard className="!p-0">
            <ol className="divide-y divide-border">
              {contract.timeline.map((item) => (
                <li key={`${item.ts}-${item.text}`} className="flex flex-col gap-1 px-4 py-3">
                  <span className="num text-[11px] text-muted-foreground">{formatDate(item.ts, locale)}</span>
                  <span className="text-sm text-foreground">{item.text}</span>
                </li>
              ))}
            </ol>
          </PortalCard>
        </section>
      </div>
    </InvestorShell>
  );
}

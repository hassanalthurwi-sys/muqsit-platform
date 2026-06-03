"use client";

import { InvestorShell } from "@/components/portal/investor-shell";
import { PortalCard } from "@/components/portal/portal-card";
import { Currency } from "@/components/ui/currency";
import { useI18n } from "@/components/providers/i18n-provider";
import { useInvestorIdentity } from "@/lib/portal/use-portal-identity";
import { investorDistributions, investorPortfolioSummary } from "@/lib/portal/data";
import { formatDate } from "@/lib/format";

export default function InvestorProfitsPage() {
  const { dict, locale } = useI18n();
  const t = dict.portals.investor.profits;
  const investor = useInvestorIdentity();
  const distributions = investorDistributions(investor.id);
  const summary = investorPortfolioSummary(investor.id);
  const last = distributions[0];

  return (
    <InvestorShell>
      <div className="space-y-4">
        <header>
          <h1 className="text-xl font-semibold tracking-tight">{t.pageTitle}</h1>
        </header>

        <PortalCard tone="primary">
          <p className="text-xs font-medium opacity-80">{t.ytdTotal}</p>
          <p className="num mt-2 text-3xl font-semibold tracking-tight">
            <Currency value={summary.ytdNet} />
          </p>
        </PortalCard>

        <div className="grid grid-cols-2 gap-3">
          <PortalCard>
            <p className="text-[11px] font-medium text-muted-foreground">{t.lastDistribution}</p>
            {last ? (
              <>
                <p className="num mt-2 text-lg font-semibold text-foreground">
                  <Currency value={last.net} />
                </p>
                <p className="num text-[11px] text-muted-foreground">{formatDate(last.date, locale)}</p>
              </>
            ) : (
              <p className="mt-2 text-sm text-muted-foreground">—</p>
            )}
          </PortalCard>
          <PortalCard>
            <p className="text-[11px] font-medium text-muted-foreground">{t.nextDistribution}</p>
            <p className="num mt-2 text-lg font-semibold text-foreground">
              {formatDate(summary.nextDistributionDate, locale)}
            </p>
            <p className="text-[11px] text-muted-foreground">{dict.portals.common.disclaimer}</p>
          </PortalCard>
        </div>

        <section>
          <h2 className="mb-2 text-sm font-semibold text-foreground">{t.historyTitle}</h2>
          {distributions.length === 0 ? (
            <PortalCard>
              <p className="text-sm text-muted-foreground">{t.noUpcoming}</p>
            </PortalCard>
          ) : (
            <PortalCard className="!p-0">
              <ul className="divide-y divide-border">
                {distributions.map((d) => (
                  <li key={`${d.date}-${d.contractId}`} className="px-4 py-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="num text-sm font-semibold text-foreground">
                          <Currency value={d.net} />
                        </p>
                        <p className="num text-[11px] text-muted-foreground">
                          {t.sourceContract} {d.contractNumber}
                        </p>
                      </div>
                      <span className="num text-[11px] text-muted-foreground">{formatDate(d.date, locale)}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </PortalCard>
          )}
        </section>
      </div>
    </InvestorShell>
  );
}

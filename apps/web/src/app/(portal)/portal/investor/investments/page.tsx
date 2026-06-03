"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, Recycle } from "lucide-react";
import { InvestorShell } from "@/components/portal/investor-shell";
import { PortalCard } from "@/components/portal/portal-card";
import { Currency } from "@/components/ui/currency";
import { StatusPill } from "@/components/ui/status-pill";
import { useI18n } from "@/components/providers/i18n-provider";
import { useInvestorIdentity } from "@/lib/portal/use-portal-identity";
import { investorContracts } from "@/lib/portal/data";
import { formatDate } from "@/lib/format";

export default function InvestorInvestmentsPage() {
  const { dict, locale, dir } = useI18n();
  const t = dict.portals.investor.investments;
  const investor = useInvestorIdentity();
  const contracts = investorContracts(investor.id);
  const active = contracts.filter((c) => c.status === "active");
  const Arrow = dir === "rtl" ? ArrowLeft : ArrowRight;

  return (
    <InvestorShell>
      <div className="space-y-4">
        <header className="space-y-1">
          <h1 className="text-xl font-semibold tracking-tight">{t.pageTitle}</h1>
          <p className="text-xs text-muted-foreground">
            {t.countLabel.replace("{n}", String(active.length))}
          </p>
        </header>

        <ul className="space-y-3">
          {contracts.map((c) => {
            const utilization = c.amount > 0 ? Math.round((c.utilized / c.amount) * 100) : 0;
            return (
              <li key={c.id}>
                <Link
                  href={`/portal/investor/investments/${c.id}`}
                  className="block focus:outline-none"
                >
                  <PortalCard className="space-y-3 transition-colors hover:border-primary/40">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="num text-xs font-medium text-muted-foreground">{c.number}</p>
                        <p className="num mt-1 text-xl font-semibold text-foreground">
                          <Currency value={c.amount} />
                        </p>
                      </div>
                      {c.capitalRecyclingEnabled ? (
                        <StatusPill tone="primary">
                          <Recycle className="size-3" aria-hidden /> {t.recyclingOn}
                        </StatusPill>
                      ) : (
                        <StatusPill tone="default">{t.recyclingOff}</StatusPill>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-[11px] font-medium text-muted-foreground">
                        <span>
                          {t.cardUtilized}: <Currency value={c.utilized} compact />
                        </span>
                        <span className="num">{utilization}%</span>
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                        <div className="h-full rounded-full bg-primary" style={{ width: `${utilization}%` }} />
                      </div>
                    </div>

                    <div className="flex items-center justify-between border-t border-border pt-3 text-xs text-muted-foreground">
                      <span>
                        {t.cardEnds} · <span className="num text-foreground">{formatDate(c.endDate, locale)}</span>
                      </span>
                      <Arrow className="size-4" aria-hidden />
                    </div>
                  </PortalCard>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </InvestorShell>
  );
}

"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, FileText, LineChart, Wallet } from "lucide-react";
import { InvestorShell } from "@/components/portal/investor-shell";
import { PortalCard } from "@/components/portal/portal-card";
import { Currency } from "@/components/ui/currency";
import { useI18n } from "@/components/providers/i18n-provider";
import { useInvestorIdentity } from "@/lib/portal/use-portal-identity";
import { investorPortfolioSummary, investorContracts } from "@/lib/portal/data";
import { formatDate } from "@/lib/format";

export default function InvestorDashboardPage() {
  const { dict, locale, dir } = useI18n();
  const t = dict.portals.investor.dashboard;
  const investor = useInvestorIdentity();
  const summary = investorPortfolioSummary(investor.id);
  const contracts = investorContracts(investor.id);
  const utilization = summary.principal > 0 ? Math.round((summary.utilized / summary.principal) * 100) : 0;

  const Arrow = dir === "rtl" ? ArrowLeft : ArrowRight;

  return (
    <InvestorShell>
      <div className="space-y-5">
        <p className="text-sm text-muted-foreground">
          {t.greeting.replace("{name}", investor.name.split(" ")[0])}
        </p>

        {/* Capital hero card */}
        <PortalCard tone="primary" className="space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-medium opacity-80">{t.capitalCardLabel}</p>
              <p className="num mt-2 text-3xl font-semibold tracking-tight sm:text-[2rem]">
                <Currency value={summary.principal} />
              </p>
              <p className="mt-1 text-xs opacity-80">
                {t.capitalCardSub.replace("{count}", String(summary.activeCount))}
              </p>
            </div>
          </div>

          {/* Simple utilization bar */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[11px] font-medium opacity-80">
              <span>{t.utilizedShort}: <Currency value={summary.utilized} compact /></span>
              <span>{t.unutilizedShort}: <Currency value={summary.unutilized} compact /></span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-primary/15">
              <div
                className="h-full rounded-full bg-primary"
                style={{ width: `${utilization}%` }}
                aria-label={`utilization ${utilization}%`}
              />
            </div>
          </div>
        </PortalCard>

        {/* Profit KPIs */}
        <div className="grid grid-cols-2 gap-3">
          <PortalCard>
            <p className="text-[11px] font-medium text-muted-foreground">{t.thisMonthLabel}</p>
            <p className="num mt-2 text-xl font-semibold text-foreground">
              <Currency value={summary.thisMonthNet} />
            </p>
          </PortalCard>
          <PortalCard>
            <p className="text-[11px] font-medium text-muted-foreground">{t.ytdLabel}</p>
            <p className="num mt-2 text-xl font-semibold text-foreground">
              <Currency value={summary.ytdNet} />
            </p>
          </PortalCard>
        </div>

        {/* Next distribution */}
        <PortalCard>
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] font-medium text-muted-foreground">{t.nextDistributionLabel}</p>
              <p className="num mt-1 text-base font-semibold text-foreground">
                {formatDate(summary.nextDistributionDate, locale)}
              </p>
              <p className="text-[11px] text-muted-foreground">
                {t.nextDistributionSub.replace("{date}", formatDate(summary.nextDistributionDate, locale))}
              </p>
            </div>
            <span className="flex size-10 items-center justify-center rounded-xl bg-primary-soft text-primary-soft-foreground">
              <LineChart className="size-5" aria-hidden />
            </span>
          </div>
        </PortalCard>

        {/* CTAs */}
        <div className="grid grid-cols-2 gap-3">
          <Link href="/portal/investor/simulator" className="block">
            <PortalCard className="flex h-full items-center justify-between gap-3 transition-colors hover:border-primary/40">
              <div>
                <p className="text-sm font-semibold">{t.ctaSimulate}</p>
              </div>
              <span className="flex size-9 items-center justify-center rounded-lg bg-primary-soft text-primary-soft-foreground">
                <LineChart className="size-4" aria-hidden />
              </span>
            </PortalCard>
          </Link>
          <Link href="/portal/investor/statements" className="block">
            <PortalCard className="flex h-full items-center justify-between gap-3 transition-colors hover:border-primary/40">
              <div>
                <p className="text-sm font-semibold">{t.ctaStatement}</p>
              </div>
              <span className="flex size-9 items-center justify-center rounded-lg bg-primary-soft text-primary-soft-foreground">
                <FileText className="size-4" aria-hidden />
              </span>
            </PortalCard>
          </Link>
        </div>

        {/* Investments quick link */}
        <Link
          href="/portal/investor/investments"
          className="flex items-center justify-between rounded-2xl border border-border bg-card p-4 text-sm font-medium hover:border-primary/40"
        >
          <span className="flex items-center gap-3">
            <span className="flex size-9 items-center justify-center rounded-lg bg-primary-soft text-primary-soft-foreground">
              <Wallet className="size-4" aria-hidden />
            </span>
            {t.ctaInvestments} · {dict.portals.investor.investments.countLabel.replace("{n}", String(contracts.length))}
          </span>
          <Arrow className="size-4 text-muted-foreground" aria-hidden />
        </Link>

        {/* Activity */}
        <section>
          <h2 className="mb-2 text-sm font-semibold text-foreground">{t.activityTitle}</h2>
          <PortalCard className="!p-0">
            <ul className="divide-y divide-border">
              {investor.recentActivity.slice(0, 5).map((item) => (
                <li key={`${item.ts}-${item.text}`} className="flex flex-col gap-1 px-4 py-3">
                  <span className="text-sm text-foreground">{item.text}</span>
                  <span className="num text-[11px] text-muted-foreground">{formatDate(item.ts, locale)}</span>
                </li>
              ))}
            </ul>
          </PortalCard>
        </section>
      </div>
    </InvestorShell>
  );
}

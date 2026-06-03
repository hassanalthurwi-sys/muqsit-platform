"use client";

import { useState } from "react";
import { InvestorShell } from "@/components/portal/investor-shell";
import { PortalCard } from "@/components/portal/portal-card";
import { Sparkline } from "@/components/portal/sparkline";
import { Currency } from "@/components/ui/currency";
import { useI18n } from "@/components/providers/i18n-provider";
import { useInvestorIdentity } from "@/lib/portal/use-portal-identity";
import { simulate, type PeriodKey, type RiskProfile } from "@/lib/portal/simulator";
import { cn } from "@/lib/utils";

const PERIODS: PeriodKey[] = ["sixM", "oneY", "twoY", "threeY"];
const RISKS: RiskProfile[] = ["conservative", "balanced", "growth"];

export default function InvestorSimulatorPage() {
  const { dict, locale } = useI18n();
  const t = dict.portals.investor.simulator;
  const investor = useInvestorIdentity();

  const [capital, setCapital] = useState<number>(investor.totalCapital);
  const [period, setPeriod] = useState<PeriodKey>("oneY");
  const [risk, setRisk] = useState<RiskProfile>("balanced");
  const [reinvest, setReinvest] = useState<boolean>(true);

  const result = simulate({ capital, period, risk, reinvest });
  const fmt = new Intl.NumberFormat(locale === "ar" ? "ar-SA-u-nu-latn" : "en-US", {
    maximumFractionDigits: 0,
  });

  return (
    <InvestorShell>
      <div className="space-y-5">
        <header className="space-y-1">
          <h1 className="text-xl font-semibold tracking-tight">{t.pageTitle}</h1>
          <p className="text-xs text-muted-foreground">{t.subtitle}</p>
        </header>

        {/* Inputs */}
        <PortalCard className="space-y-5">
          {/* Capital */}
          <div className="space-y-2">
            <label htmlFor="capital" className="block text-xs font-medium text-muted-foreground">
              {t.inputs.capital}
            </label>
            <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2">
              <input
                id="capital"
                type="number"
                min={0}
                step={50_000}
                value={capital}
                onChange={(e) => setCapital(Math.max(0, Number(e.target.value) || 0))}
                className="num w-full bg-transparent text-lg font-semibold text-foreground outline-none"
              />
              <span className="text-xs text-muted-foreground">{dict.common.currency}</span>
            </div>
            <input
              type="range"
              min={100_000}
              max={5_000_000}
              step={50_000}
              value={capital}
              onChange={(e) => setCapital(Number(e.target.value))}
              className="w-full accent-primary"
              aria-label={t.inputs.capital}
            />
          </div>

          {/* Period */}
          <div className="space-y-2">
            <label className="block text-xs font-medium text-muted-foreground">{t.inputs.period}</label>
            <div className="grid grid-cols-4 gap-1 rounded-xl bg-muted p-1">
              {PERIODS.map((p) => (
                <button
                  type="button"
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={cn(
                    "rounded-lg py-1.5 text-xs font-medium",
                    period === p ? "bg-card text-foreground shadow-[var(--shadow-soft)]" : "text-muted-foreground",
                  )}
                >
                  {t.inputs.periodOptions[p]}
                </button>
              ))}
            </div>
          </div>

          {/* Risk profile */}
          <div className="space-y-2">
            <label className="block text-xs font-medium text-muted-foreground">{t.inputs.risk}</label>
            <div className="grid grid-cols-3 gap-1 rounded-xl bg-muted p-1">
              {RISKS.map((r) => (
                <button
                  type="button"
                  key={r}
                  onClick={() => setRisk(r)}
                  className={cn(
                    "rounded-lg py-1.5 text-xs font-medium",
                    risk === r ? "bg-card text-foreground shadow-[var(--shadow-soft)]" : "text-muted-foreground",
                  )}
                >
                  {t.inputs.riskOptions[r]}
                </button>
              ))}
            </div>
          </div>

          {/* Reinvest toggle */}
          <label className="flex items-start gap-3 rounded-xl border border-border bg-card/60 p-3">
            <input
              type="checkbox"
              checked={reinvest}
              onChange={(e) => setReinvest(e.target.checked)}
              className="mt-0.5 size-4 accent-primary"
            />
            <span className="flex-1">
              <span className="block text-sm font-medium">{t.inputs.reinvest}</span>
              <span className="block text-[11px] text-muted-foreground">{t.inputs.reinvestHint}</span>
            </span>
          </label>
        </PortalCard>

        {/* Outputs */}
        <PortalCard tone="primary" className="space-y-4">
          <div className="space-y-1">
            <p className="text-[11px] font-medium opacity-80">{t.outputs.chartLabel}</p>
            <Sparkline
              values={result.path.map((p) => p.value)}
              className="h-24 w-full"
              ariaLabel={t.outputs.chartLabel}
            />
          </div>
        </PortalCard>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <PortalCard>
            <p className="text-[11px] font-medium text-muted-foreground">{t.outputs.currentCapital}</p>
            <p className="num mt-2 text-xl font-semibold text-foreground">
              <Currency value={result.currentCapital} />
            </p>
          </PortalCard>
          <PortalCard>
            <p className="text-[11px] font-medium text-muted-foreground">{t.outputs.expectedValue}</p>
            <p className="num mt-2 text-xl font-semibold text-primary">
              <Currency value={Math.round(result.expectedValue)} />
            </p>
          </PortalCard>
          <PortalCard>
            <p className="text-[11px] font-medium text-muted-foreground">{t.outputs.cumulativeReturn}</p>
            <p className="num mt-2 text-xl font-semibold text-success">
              +{fmt.format(Math.round(result.cumulativeReturn))} <span className="text-[0.55em] text-muted-foreground">{dict.common.currency}</span>
            </p>
          </PortalCard>
        </div>

        <p className="rounded-xl border border-dashed border-border bg-muted/40 p-3 text-[11px] leading-5 text-muted-foreground">
          {t.disclaimer}
        </p>
      </div>
    </InvestorShell>
  );
}

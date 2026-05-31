"use client";

import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Clock,
  FileSignature,
  ScrollText,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { KpiCard } from "@/components/ui/kpi-card";
import { AlertStrip } from "@/components/ui/alert-strip";
import { SplitBar } from "@/components/ui/split-bar";
import { StatusPill } from "@/components/ui/status-pill";
import { Currency } from "@/components/ui/currency";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/components/providers/i18n-provider";

// All values below are placeholder UX numbers — no API, no domain models.
const MOCK = {
  collections: { value: 1_842_000, pctOfExpected: 92 },
  overdue: { value: 240_500, count: 14 },
  activeContracts: { count: 124, value: 18_400_000 },
  pendingContracts: { count: 9 },
  investmentSplit: {
    total: 14_220_000,
    internal: 4_120_000,
    external: 10_100_000,
  },
  cashMovement: { inflow: 2_120_000, outflow: 1_800_000, net: 320_000 },
  lateCustomers: 3,
  upcoming: [
    { id: "1", client: "محمد الشريف", amount: 12_000, status: "overdue" as const, daysOffset: -2 },
    { id: "2", client: "نورة الحربي", amount: 8_500, status: "dueToday" as const, daysOffset: 0 },
    { id: "3", client: "Sami AlGhamdi", amount: 22_300, status: "upcoming" as const, daysOffset: 3 },
    { id: "4", client: "فاطمة القحطاني", amount: 6_400, status: "upcoming" as const, daysOffset: 5 },
    { id: "5", client: "Omar AlMutairi", amount: 17_800, status: "upcoming" as const, daysOffset: 7 },
  ],
};

export default function DashboardPage() {
  const { dict, dir } = useI18n();
  const d = dict.dashboard;
  const Chevron = dir === "rtl" ? ChevronLeft : ChevronRight;

  const formatDueLabel = (status: "overdue" | "dueToday" | "upcoming", offset: number) => {
    if (status === "dueToday") return dict.common.today;
    const tmpl = status === "overdue" ? dict.common.daysAgo : dict.common.daysLeft;
    return tmpl.replace("{n}", String(Math.abs(offset)));
  };

  const dueTone = {
    overdue: "danger",
    dueToday: "warning",
    upcoming: "primary",
  } as const;

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
      <header className="space-y-1">
        <p className="label">{d.eyebrow}</p>
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{d.title}</h1>
        <p className="text-sm text-muted-foreground">{d.subtitle}</p>
      </header>

      {/* Tier 1 — operational hero KPIs */}
      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard
          label={d.kpi.collections}
          icon={<Wallet />}
          hint={`${MOCK.collections.pctOfExpected}% ${d.kpi.collectionsHint}`}
          tone="success"
        >
          <Currency value={MOCK.collections.value} />
        </KpiCard>

        <KpiCard
          label={d.kpi.overdue}
          icon={<Clock />}
          hint={`${MOCK.overdue.count} ${d.kpi.overdueHint}`}
          tone="danger"
        >
          <Currency value={MOCK.overdue.value} />
        </KpiCard>

        <KpiCard
          label={d.kpi.activeContracts}
          icon={<FileSignature />}
          hint={d.kpi.activeContractsHint}
          footer={
            <p className="num text-sm text-muted-foreground">
              <Currency value={MOCK.activeContracts.value} compact />
            </p>
          }
        >
          <span className="num">{MOCK.activeContracts.count}</span>
        </KpiCard>

        <KpiCard
          label={d.kpi.pendingContracts}
          icon={<ScrollText />}
          hint={d.kpi.pendingContractsHint}
          tone="warning"
        >
          <span className="num">{MOCK.pendingContracts.count}</span>
        </KpiCard>
      </section>

      {/* Late customers alert — only if > 0 */}
      {MOCK.lateCustomers > 0 ? (
        <AlertStrip
          tone="danger"
          title={d.lateCustomers.title.replace("{n}", String(MOCK.lateCustomers))}
          hint={d.lateCustomers.hint}
          action={
            <Button variant="ghost" size="sm" className="gap-1 text-danger-foreground">
              {dict.common.review}
              <Chevron className="size-4" />
            </Button>
          }
        />
      ) : null}

      {/* Tier 2 — investment split + cash movement */}
      <section className="grid gap-4 lg:grid-cols-2">
        <KpiCard
          label={d.kpi.investmentSplit}
          icon={<TrendingUp />}
          hint={d.kpi.investmentSplitHint}
          footer={
            <SplitBar
              segments={[
                {
                  label: dict.investorType.internal,
                  value: MOCK.investmentSplit.internal,
                  className: "bg-primary",
                },
                {
                  label: dict.investorType.external,
                  value: MOCK.investmentSplit.external,
                  className: "bg-gold",
                },
              ]}
            />
          }
        >
          <Currency value={MOCK.investmentSplit.total} />
        </KpiCard>

        <KpiCard
          label={d.kpi.cashMovement}
          icon={<Wallet />}
          hint={d.kpi.cashMovementHint}
          tone={MOCK.cashMovement.net >= 0 ? "success" : "danger"}
          footer={
            <dl className="grid grid-cols-3 gap-3 border-t border-border pt-3">
              <div className="space-y-0.5">
                <dt className="label flex items-center gap-1">
                  <ArrowUpRight className="size-3 text-success" />
                  {d.cashMovement.inflow}
                </dt>
                <dd className="num text-sm font-medium">
                  <Currency value={MOCK.cashMovement.inflow} compact />
                </dd>
              </div>
              <div className="space-y-0.5">
                <dt className="label flex items-center gap-1">
                  <ArrowDownRight className="size-3 text-danger" />
                  {d.cashMovement.outflow}
                </dt>
                <dd className="num text-sm font-medium">
                  <Currency value={MOCK.cashMovement.outflow} compact />
                </dd>
              </div>
              <div className="space-y-0.5">
                <dt className="label">{d.cashMovement.net}</dt>
                <dd className="num text-sm font-semibold text-primary">
                  <Currency value={MOCK.cashMovement.net} compact />
                </dd>
              </div>
            </dl>
          }
        >
          <Currency value={MOCK.cashMovement.net} />
        </KpiCard>
      </section>

      {/* Upcoming installments — actionable list */}
      <Card>
        <CardHeader className="flex flex-row items-start justify-between gap-3 space-y-0">
          <div className="space-y-1">
            <CardTitle className="text-base font-semibold">{d.upcoming.title}</CardTitle>
            <p className="text-xs text-muted-foreground">{d.upcoming.subtitle}</p>
          </div>
          <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground">
            {dict.common.viewAll}
            <ArrowRight className="size-4" />
          </Button>
        </CardHeader>
        <CardContent className="px-0 pb-2 pt-0">
          {MOCK.upcoming.length === 0 ? (
            <p className="px-6 py-8 text-center text-sm text-muted-foreground">
              {d.upcoming.empty}
            </p>
          ) : (
            <ul className="divide-y divide-border">
              {MOCK.upcoming.map((item) => (
                <li
                  key={item.id}
                  className="flex items-center justify-between gap-3 px-6 py-3"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{item.client}</p>
                    <p className="num text-xs text-muted-foreground">
                      {formatDueLabel(item.status, item.daysOffset)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="num text-sm font-semibold">
                      <Currency value={item.amount} />
                    </span>
                    <StatusPill tone={dueTone[item.status]}>
                      {d.upcoming.status[item.status]}
                    </StatusPill>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

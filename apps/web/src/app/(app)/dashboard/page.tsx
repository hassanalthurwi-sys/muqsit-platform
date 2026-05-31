"use client";

import { useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  AlertTriangle,
  ArrowDownRight,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  CircleDot,
  Clock,
  FileSignature,
  ScrollText,
  ShieldAlert,
  TrendingUp,
  Wallet,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { KpiCard } from "@/components/ui/kpi-card";
import { SplitBar } from "@/components/ui/split-bar";
import { StatusPill } from "@/components/ui/status-pill";
import { Currency } from "@/components/ui/currency";
import { useI18n } from "@/components/providers/i18n-provider";
import type {
  FollowupStatus,
  FollowupTab,
} from "@/lib/i18n/dictionaries";
import { cn } from "@/lib/utils";

// ─── Realistic Saudi installment-office mock data (no API, no domain models) ───
const MOCK = {
  collections: { collected: 1_842_000, expected: 2_000_000, pct: 92 },
  overdue: { amount: 240_500, installments: 14, customers: 3 },
  activeContracts: { count: 124, totalValue: 18_400_000, unpaidBalance: 11_250_000 },
  pendingContracts: { count: 9, totalValue: 3_200_000, awaitingSignature: 5 },
  profit: {
    selfOwned: 220_000,
    managementFee: 90_000,
    goodsMargin: 50_000,
  },
  utilization: {
    internal: 4_120_000,
    external: 10_100_000,
    utilized: 10_250_000,
    unutilized: 3_970_000,
  },
  cash: {
    inflow: 2_120_000,
    outflow: 1_800_000,
    purchases: 680_000,
    investorDisbursements: 220_000,
  },
  alerts: {
    delay30: 3,
    delay60: 1,
    pendingContracts: 9,
    unutilizedCapital: 3_970_000,
    paymentDocs: 2,
  },
  installments: [
    { id: "i1", client: "نورة الحربي", amount: 8_500, status: "dueToday" as FollowupStatus, daysOffset: 0 },
    { id: "i2", client: "Sami AlGhamdi", amount: 22_300, status: "dueToday" as FollowupStatus, daysOffset: 0 },
    { id: "i3", client: "محمد الشريف", amount: 12_000, status: "overdue" as FollowupStatus, daysOffset: -2 },
    { id: "i4", client: "خالد العتيبي", amount: 9_800, status: "overdue" as FollowupStatus, daysOffset: -5 },
    { id: "i5", client: "ريم العنزي", amount: 7_200, status: "overdue" as FollowupStatus, daysOffset: -8 },
    { id: "i6", client: "Ahmed AlShammari", amount: 15_500, status: "overdue" as FollowupStatus, daysOffset: -12 },
    { id: "i7", client: "مها الدوسري", amount: 6_400, status: "overdue" as FollowupStatus, daysOffset: -3 },
    { id: "i8", client: "Yousef AlQahtani", amount: 18_900, status: "overdue" as FollowupStatus, daysOffset: -14 },
    { id: "i9", client: "صالح الشهراني", amount: 11_300, status: "overdue" as FollowupStatus, daysOffset: -21 },
    { id: "i10", client: "Hessa AlMalki", amount: 5_900, status: "overdue" as FollowupStatus, daysOffset: -1 },
    { id: "i11", client: "فاطمة القحطاني", amount: 6_400, status: "upcoming" as FollowupStatus, daysOffset: 3 },
    { id: "i12", client: "Omar AlMutairi", amount: 17_800, status: "upcoming" as FollowupStatus, daysOffset: 5 },
    { id: "i13", client: "نواف العمري", amount: 13_400, status: "upcoming" as FollowupStatus, daysOffset: 6 },
    { id: "i14", client: "Lama AlBalwi", amount: 9_200, status: "upcoming" as FollowupStatus, daysOffset: 7 },
    { id: "i15", client: "عبدالله الزهراني", amount: 14_500, status: "defaulted" as FollowupStatus, daysOffset: -65 },
  ],
};

// ─── Helper components ───

function KpiFooter({ children }: { children: React.ReactNode }) {
  return (
    <dl className="grid grid-cols-2 gap-3 border-t border-border pt-3 text-xs">
      {children}
    </dl>
  );
}

function KpiStat({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value: React.ReactNode;
  tone?: "default" | "primary";
}) {
  return (
    <div className="space-y-0.5">
      <dt className="text-[11px] text-muted-foreground">{label}</dt>
      <dd
        className={cn(
          "num text-sm font-semibold",
          tone === "primary" ? "text-primary" : "text-foreground",
        )}
      >
        {value}
      </dd>
    </div>
  );
}

function ProgressBar({ value, className }: { value: number; className?: string }) {
  return (
    <div
      className={cn("h-1.5 w-full overflow-hidden rounded-full bg-muted", className)}
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div className="h-full rounded-full bg-primary" style={{ width: `${value}%` }} />
    </div>
  );
}

// ─── Sections ───

function Tier1Kpis() {
  const { dict } = useI18n();
  const k = dict.dashboard.kpi;

  return (
    <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      <KpiCard label={k.collections.label} icon={<Wallet />} tone="success">
        <Currency value={MOCK.collections.collected} />
        <KpiFooter>
          <KpiStat
            label={k.collections.expected}
            value={<Currency value={MOCK.collections.expected} compact />}
          />
          <KpiStat
            label={k.collections.percent}
            tone="primary"
            value={
              <span className="inline-flex flex-col gap-1">
                <span>{MOCK.collections.pct}%</span>
                <ProgressBar value={MOCK.collections.pct} className="w-16" />
              </span>
            }
          />
        </KpiFooter>
      </KpiCard>

      <KpiCard label={k.overdue.label} icon={<Clock />} tone="danger">
        <Currency value={MOCK.overdue.amount} />
        <KpiFooter>
          <KpiStat label={k.overdue.installments} value={<span className="num">{MOCK.overdue.installments}</span>} />
          <KpiStat label={k.overdue.customers} value={<span className="num">{MOCK.overdue.customers}</span>} />
        </KpiFooter>
      </KpiCard>

      <KpiCard label={k.activeContracts.label} icon={<FileSignature />}>
        <span className="num">{MOCK.activeContracts.count}</span>
        <KpiFooter>
          <KpiStat
            label={k.activeContracts.totalValue}
            value={<Currency value={MOCK.activeContracts.totalValue} compact />}
          />
          <KpiStat
            label={k.activeContracts.unpaidBalance}
            value={<Currency value={MOCK.activeContracts.unpaidBalance} compact />}
          />
        </KpiFooter>
      </KpiCard>

      <KpiCard label={k.pendingContracts.label} icon={<ScrollText />} tone="warning">
        <span className="num">{MOCK.pendingContracts.count}</span>
        <KpiFooter>
          <KpiStat
            label={k.pendingContracts.totalValue}
            value={<Currency value={MOCK.pendingContracts.totalValue} compact />}
          />
          <KpiStat
            label={k.pendingContracts.awaitingSignature}
            value={<span className="num">{MOCK.pendingContracts.awaitingSignature}</span>}
          />
        </KpiFooter>
      </KpiCard>
    </section>
  );
}

function SmartAlerts() {
  const { dict, dir, locale } = useI18n();
  const a = dict.dashboard.alerts;
  const Arrow = dir === "rtl" ? ArrowLeft : ArrowRight;

  // Replace {n} / {amount} placeholders with the relevant mock figure.
  const fmtCurrency = new Intl.NumberFormat(locale === "ar" ? "ar-SA-u-nu-latn" : "en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  });

  const items = [
    {
      key: "delay30",
      icon: AlertTriangle,
      tone: "warning" as const,
      text: a.delay30.replace("{n}", String(MOCK.alerts.delay30)),
      cta: dict.common.review,
      href: "/clients",
    },
    {
      key: "delay60",
      icon: AlertCircle,
      tone: "danger" as const,
      text: a.delay60.replace("{n}", String(MOCK.alerts.delay60)),
      cta: dict.common.review,
      href: "/clients",
    },
    {
      key: "pendingContracts",
      icon: Clock,
      tone: "warning" as const,
      text: a.pendingContracts.replace("{n}", String(MOCK.alerts.pendingContracts)),
      cta: dict.common.open,
      href: "/contracts",
    },
    {
      key: "unutilizedCapital",
      icon: CircleDot,
      tone: "primary" as const,
      text: a.unutilizedCapital.replace("{amount}", `${fmtCurrency.format(MOCK.alerts.unutilizedCapital)} ${dict.common.currency}`),
      cta: dict.common.distribute,
      href: "/investors",
    },
    {
      key: "paymentDocs",
      icon: ShieldAlert,
      tone: "warning" as const,
      text: a.paymentDocs.replace("{n}", String(MOCK.alerts.paymentDocs)),
      cta: dict.common.review,
      href: "/documents",
    },
  ];

  const bubbleTone: Record<"warning" | "danger" | "primary", string> = {
    warning: "bg-warning-soft text-warning-foreground",
    danger: "bg-danger-soft text-danger-foreground",
    primary: "bg-primary-soft text-primary-soft-foreground",
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">{a.title}</CardTitle>
        <p className="text-xs text-muted-foreground">{a.subtitle}</p>
      </CardHeader>
      <CardContent className="px-0 pb-2 pt-0">
        <ul className="divide-y divide-border">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <li
                key={item.key}
                className="flex items-center gap-3 px-6 py-3"
              >
                <span
                  className={cn(
                    "flex size-9 shrink-0 items-center justify-center rounded-lg [&_svg]:size-4",
                    bubbleTone[item.tone],
                  )}
                >
                  <Icon />
                </span>
                <span className="flex-1 text-sm text-foreground">{item.text}</span>
                <Link
                  href={item.href}
                  className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-primary hover:bg-primary-soft"
                >
                  {item.cta}
                  <Arrow className="size-3" />
                </Link>
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
}

function Profitability() {
  const { dict } = useI18n();
  const p = dict.dashboard.profit;
  const total = MOCK.profit.selfOwned + MOCK.profit.managementFee + MOCK.profit.goodsMargin;
  const rows = [
    { label: p.selfOwned, value: MOCK.profit.selfOwned, className: "bg-primary" },
    { label: p.managementFee, value: MOCK.profit.managementFee, className: "bg-gold" },
    { label: p.goodsMargin, value: MOCK.profit.goodsMargin, className: "bg-primary-soft" },
  ];

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">{p.title}</CardTitle>
        <p className="text-xs text-muted-foreground">{p.subtitle}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-3xl font-semibold tracking-tight">
          <Currency value={total} />
        </p>
        <div className="space-y-3">
          {rows.map((row) => {
            const pct = total > 0 ? Math.round((row.value / total) * 100) : 0;
            return (
              <div key={row.label} className="space-y-1.5">
                <div className="flex items-center justify-between gap-3 text-sm">
                  <span className="text-muted-foreground">{row.label}</span>
                  <span className="num font-medium">
                    <Currency value={row.value} compact /> <span className="text-muted-foreground">· {pct}%</span>
                  </span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className={cn("h-full rounded-full", row.className)}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

function Utilization() {
  const { dict } = useI18n();
  const u = dict.dashboard.utilization;
  const totalCapital = MOCK.utilization.internal + MOCK.utilization.external;
  const utilizationPct = totalCapital > 0 ? Math.round((MOCK.utilization.utilized / totalCapital) * 100) : 0;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">{u.title}</CardTitle>
        <p className="text-xs text-muted-foreground">{u.subtitle}</p>
      </CardHeader>
      <CardContent className="space-y-5">
        <p className="text-3xl font-semibold tracking-tight">
          <Currency value={totalCapital} />
        </p>

        <div className="space-y-3">
          <SplitBar
            segments={[
              { label: u.internal, value: MOCK.utilization.internal, className: "bg-primary" },
              { label: u.external, value: MOCK.utilization.external, className: "bg-gold" },
            ]}
          />
          <dl className="grid grid-cols-2 gap-3 text-xs">
            <KpiStat
              label={u.internal}
              value={<Currency value={MOCK.utilization.internal} compact />}
            />
            <KpiStat
              label={u.external}
              value={<Currency value={MOCK.utilization.external} compact />}
            />
          </dl>
        </div>

        <div className="space-y-2 border-t border-border pt-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">{u.utilized}</span>
            <span className="num font-medium">
              <Currency value={MOCK.utilization.utilized} compact /> <span className="text-muted-foreground">· {utilizationPct}%</span>
            </span>
          </div>
          <ProgressBar value={utilizationPct} />
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">{u.unutilized}</span>
            <span className="num font-medium">
              <Currency value={MOCK.utilization.unutilized} compact />
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function CashMovement() {
  const { dict } = useI18n();
  const c = dict.dashboard.cashMovement;
  const net = MOCK.cash.inflow - MOCK.cash.outflow;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">{c.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="space-y-1">
            <p className="label">{c.net}</p>
            <p
              className={cn(
                "text-3xl font-semibold tracking-tight",
                net >= 0 ? "text-primary" : "text-danger",
              )}
            >
              {net >= 0 ? "+" : ""}
              <Currency value={net} />
            </p>
          </div>
          <dl className="grid w-full grid-cols-2 gap-4 sm:w-auto sm:grid-cols-4 sm:gap-6">
            <div className="space-y-0.5">
              <dt className="label flex items-center gap-1">
                <ArrowUpRight className="size-3 text-success" />
                {c.inflow}
              </dt>
              <dd className="num text-sm font-medium">
                <Currency value={MOCK.cash.inflow} compact />
              </dd>
            </div>
            <div className="space-y-0.5">
              <dt className="label flex items-center gap-1">
                <ArrowDownRight className="size-3 text-danger" />
                {c.outflow}
              </dt>
              <dd className="num text-sm font-medium">
                <Currency value={MOCK.cash.outflow} compact />
              </dd>
            </div>
            <div className="space-y-0.5">
              <dt className="label">{c.purchases}</dt>
              <dd className="num text-sm font-medium">
                <Currency value={MOCK.cash.purchases} compact />
              </dd>
            </div>
            <div className="space-y-0.5">
              <dt className="label">{c.investorDisbursements}</dt>
              <dd className="num text-sm font-medium">
                <Currency value={MOCK.cash.investorDisbursements} compact />
              </dd>
            </div>
          </dl>
        </div>
      </CardContent>
    </Card>
  );
}

function InstallmentFollowup() {
  const { dict, dir } = useI18n();
  const f = dict.dashboard.followup;
  const [tab, setTab] = useState<FollowupTab>("today");

  const inWeekRange = (days: number) => days > 0 && days <= 7;

  const filtered = MOCK.installments.filter((item) => {
    switch (tab) {
      case "today":
        return item.status === "dueToday";
      case "thisWeek":
        return item.status === "upcoming" && inWeekRange(item.daysOffset);
      case "overdue":
        return item.status === "overdue";
      case "defaulted":
        return item.status === "defaulted";
    }
  });

  const counts: Record<FollowupTab, number> = {
    today: MOCK.installments.filter((i) => i.status === "dueToday").length,
    thisWeek: MOCK.installments.filter((i) => i.status === "upcoming" && inWeekRange(i.daysOffset)).length,
    overdue: MOCK.installments.filter((i) => i.status === "overdue").length,
    defaulted: MOCK.installments.filter((i) => i.status === "defaulted").length,
  };

  const statusTone: Record<FollowupStatus, "primary" | "warning" | "danger"> = {
    dueToday: "warning",
    upcoming: "primary",
    overdue: "danger",
    defaulted: "danger",
  };

  const formatDue = (status: FollowupStatus, offset: number) => {
    if (status === "dueToday") return dict.common.today;
    const tmpl = offset < 0 ? dict.common.daysAgo : dict.common.daysLeft;
    return tmpl.replace("{n}", String(Math.abs(offset)));
  };

  const tabKeys: FollowupTab[] = ["today", "thisWeek", "overdue", "defaulted"];

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-3 space-y-0 pb-4">
        <div className="space-y-1">
          <CardTitle className="text-base font-semibold">{f.title}</CardTitle>
          <p className="text-xs text-muted-foreground">{f.subtitle}</p>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 px-0 pb-2 pt-0">
        <div
          className="flex flex-wrap gap-1.5 overflow-x-auto px-6"
          role="tablist"
          aria-label={f.title}
        >
          {tabKeys.map((key) => {
            const active = tab === key;
            return (
              <button
                key={key}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setTab(key)}
                className={cn(
                  "inline-flex items-center gap-2 whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
                  active
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/70",
                )}
              >
                <span>{f.tabs[key]}</span>
                <span
                  className={cn(
                    "num inline-flex min-w-5 items-center justify-center rounded-full px-1.5 text-[10px]",
                    active ? "bg-primary-foreground/15 text-primary-foreground" : "bg-card text-foreground",
                  )}
                >
                  {counts[key]}
                </span>
              </button>
            );
          })}
        </div>

        {filtered.length === 0 ? (
          <p className="px-6 py-8 text-center text-sm text-muted-foreground">{f.empty}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm" dir={dir}>
              <thead>
                <tr className="text-start text-[11px] uppercase text-muted-foreground">
                  <th className="px-6 py-2 text-start font-medium">{f.columns.customer}</th>
                  <th className="px-6 py-2 text-start font-medium">{f.columns.amount}</th>
                  <th className="px-6 py-2 text-start font-medium">{f.columns.due}</th>
                  <th className="px-6 py-2 text-start font-medium">{f.columns.status}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((row) => {
                  const statusKey: FollowupStatus =
                    row.status === "upcoming" && row.daysOffset === 0 ? "dueToday" : row.status;
                  return (
                    <tr key={row.id} className="hover:bg-muted/40">
                      <td className="px-6 py-3 font-medium">{row.client}</td>
                      <td className="num px-6 py-3">
                        <Currency value={row.amount} />
                      </td>
                      <td className="num px-6 py-3 text-muted-foreground">
                        {formatDue(row.status, row.daysOffset)}
                      </td>
                      <td className="px-6 py-3">
                        <StatusPill tone={statusTone[statusKey]}>{f.status[statusKey]}</StatusPill>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const { dict } = useI18n();
  return (
    <div className="flex w-full flex-col gap-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          {dict.dashboard.title}
        </h1>
        <p className="text-sm text-muted-foreground">{dict.dashboard.subtitle}</p>
      </header>

      <Tier1Kpis />
      <SmartAlerts />

      <section className="grid gap-4 lg:grid-cols-2">
        <Profitability />
        <Utilization />
      </section>

      <CashMovement />
      <InstallmentFollowup />
    </div>
  );
}

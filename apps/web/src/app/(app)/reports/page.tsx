"use client";

import {
  AlertCircle,
  BarChart3,
  Briefcase,
  Calendar,
  TrendingUp,
} from "lucide-react";
import { useI18n } from "@/components/providers/i18n-provider";
import { Currency } from "@/components/ui/currency";
import {
  useAgingReport,
  useCollectionsReport,
  useInvestorPerformance,
  usePnlReport,
} from "@/lib/api/hooks-reports";

export default function ReportsPage() {
  const { locale } = useI18n();
  const ar = locale === "ar";

  const aging = useAgingReport();
  const performance = useInvestorPerformance();
  const pnl = usePnlReport();
  const collections = useCollectionsReport();

  const summary = collections.data?.data;

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          {ar ? "التقارير" : "Reports"}
        </h1>
        <p className="text-sm text-muted-foreground">
          {ar
            ? "نظرة شاملة على التحصيل والأرباح وأداء المستثمرين"
            : "An operational view of collections, profit, and investor performance"}
        </p>
      </header>

      {summary ? (
        <section className="grid gap-3 sm:grid-cols-3">
          <KpiCard
            label={ar ? "إجمالي المجدول" : "Scheduled"}
            value={<Currency value={summary.totalScheduled} compact />}
            icon={<Calendar className="size-4" />}
          />
          <KpiCard
            label={ar ? "إجمالي التحصيل" : "Collected"}
            value={<Currency value={summary.totalCollected} compact />}
            icon={<TrendingUp className="size-4 text-success" />}
          />
          <KpiCard
            label={ar ? "نسبة التحصيل" : "Collection rate"}
            value={<span className="num">{summary.collectionRatePct}%</span>}
            icon={<BarChart3 className="size-4 text-primary" />}
          />
        </section>
      ) : null}

      <ReportCard
        title={ar ? "عمر الأقساط المستحقة" : "Aging report"}
        subtitle={ar ? "حسب أيام التأخر" : "By days overdue"}
        icon={<AlertCircle className="size-4" />}
      >
        <table className="w-full text-sm">
          <thead className="text-[11px] uppercase text-muted-foreground">
            <tr>
              <th className="px-4 py-2 text-start">{ar ? "الفئة" : "Bucket"}</th>
              <th className="px-4 py-2 text-start">{ar ? "العدد" : "Count"}</th>
              <th className="px-4 py-2 text-start">{ar ? "المبلغ" : "Amount"}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {aging.data?.data.map((b) => (
              <tr key={b.bucket}>
                <td className="px-4 py-2">
                  <BucketLabel bucket={b.bucket} ar={ar} />
                </td>
                <td className="num px-4 py-2 tabular-nums">{b.count}</td>
                <td className="num px-4 py-2 tabular-nums">
                  <Currency value={b.amount} />
                </td>
              </tr>
            ))}
            {!aging.data && (
              <tr>
                <td className="px-4 py-3 text-xs text-muted-foreground" colSpan={3}>
                  {aging.isLoading ? (ar ? "جاري التحميل…" : "Loading…") : "—"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </ReportCard>

      <ReportCard
        title={ar ? "أداء المستثمرين" : "Investor performance"}
        subtitle={ar ? "رأس المال والأرباح" : "Capital + realized profit"}
        icon={<Briefcase className="size-4" />}
      >
        <table className="w-full text-sm">
          <thead className="text-[11px] uppercase text-muted-foreground">
            <tr>
              <th className="px-4 py-2 text-start">{ar ? "المستثمر" : "Investor"}</th>
              <th className="px-4 py-2 text-start">{ar ? "العقود" : "Active"}</th>
              <th className="px-4 py-2 text-start">{ar ? "رأس المال" : "Capital"}</th>
              <th className="px-4 py-2 text-start">{ar ? "متاح" : "Available"}</th>
              <th className="px-4 py-2 text-start">{ar ? "الأرباح" : "Realized"}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {performance.data?.data.map((r) => (
              <tr key={r.investorId}>
                <td className="px-4 py-2">
                  <p className="font-medium">{r.investorName}</p>
                  <p className="text-[10px] text-muted-foreground">
                    {r.type === "internal"
                      ? ar
                        ? "داخلي"
                        : "Internal"
                      : ar
                        ? "خارجي"
                        : "External"}
                  </p>
                </td>
                <td className="num px-4 py-2 tabular-nums">{r.activeContracts}</td>
                <td className="num px-4 py-2 tabular-nums">
                  <Currency value={r.capitalDeployed} compact />
                </td>
                <td className="num px-4 py-2 tabular-nums">
                  <Currency value={r.capitalAvailable} compact />
                </td>
                <td className="num px-4 py-2 tabular-nums text-success">
                  <Currency value={r.realizedProfit} compact />
                </td>
              </tr>
            ))}
            {!performance.data && (
              <tr>
                <td className="px-4 py-3 text-xs text-muted-foreground" colSpan={5}>
                  {performance.isLoading ? (ar ? "جاري التحميل…" : "Loading…") : "—"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </ReportCard>

      <ReportCard
        title={ar ? "الأرباح والخسائر شهريًا" : "Monthly P&L"}
        subtitle={ar ? "ربح المكتب وحصص المستثمرين" : "Office vs investor share"}
        icon={<TrendingUp className="size-4" />}
      >
        <table className="w-full text-sm">
          <thead className="text-[11px] uppercase text-muted-foreground">
            <tr>
              <th className="px-4 py-2 text-start">{ar ? "الشهر" : "Month"}</th>
              <th className="px-4 py-2 text-start">{ar ? "محصَّل" : "Collected"}</th>
              <th className="px-4 py-2 text-start">{ar ? "ربح المكتب" : "Office"}</th>
              <th className="px-4 py-2 text-start">{ar ? "ربح المستثمرين" : "Investors"}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {pnl.data?.data.map((r) => (
              <tr key={r.month}>
                <td className="num px-4 py-2">{r.month}</td>
                <td className="num px-4 py-2 tabular-nums">
                  <Currency value={r.collected} compact />
                </td>
                <td className="num px-4 py-2 tabular-nums">
                  <Currency value={r.officeProfit} compact />
                </td>
                <td className="num px-4 py-2 tabular-nums">
                  <Currency value={r.investorProfit} compact />
                </td>
              </tr>
            ))}
            {(!pnl.data || pnl.data.data.length === 0) && (
              <tr>
                <td className="px-4 py-3 text-xs text-muted-foreground" colSpan={4}>
                  {pnl.isLoading
                    ? ar
                      ? "جاري التحميل…"
                      : "Loading…"
                    : ar
                      ? "لا توجد بيانات بعد"
                      : "No data yet"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </ReportCard>
    </div>
  );
}

function KpiCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: React.ReactNode;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border bg-card p-4">
      <div className="flex items-center justify-between text-muted-foreground">
        <span className="text-[11px] uppercase tracking-wide">{label}</span>
        {icon}
      </div>
      <p className="mt-2 text-lg font-semibold">{value}</p>
    </div>
  );
}

function ReportCard({
  title,
  subtitle,
  icon,
  children,
}: {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-2xl border bg-card">
      <header className="flex items-start gap-3 border-b px-5 py-4">
        <span className="grid size-8 place-items-center rounded-lg bg-primary-soft text-primary">
          {icon}
        </span>
        <div className="space-y-0.5">
          <h2 className="text-sm font-semibold">{title}</h2>
          <p className="text-[11px] text-muted-foreground">{subtitle}</p>
        </div>
      </header>
      <div className="overflow-x-auto">{children}</div>
    </section>
  );
}

function BucketLabel({ bucket, ar }: { bucket: string; ar: boolean }) {
  const labels: Record<string, { ar: string; en: string; cls: string }> = {
    current: { ar: "حالي (غير متأخر)", en: "Current", cls: "text-success" },
    "1-30": { ar: "متأخر ١–٣٠ يوم", en: "1–30 days", cls: "text-gold-foreground" },
    "31-60": { ar: "متأخر ٣١–٦٠ يوم", en: "31–60 days", cls: "text-warning-foreground" },
    "61-90": { ar: "متأخر ٦١–٩٠ يوم", en: "61–90 days", cls: "text-warning-foreground" },
    "90+": { ar: "متأخر أكثر من ٩٠ يوم", en: "90+ days", cls: "text-destructive" },
  };
  const l = labels[bucket];
  if (!l) return <span>{bucket}</span>;
  return <span className={`text-xs font-medium ${l.cls}`}>{ar ? l.ar : l.en}</span>;
}

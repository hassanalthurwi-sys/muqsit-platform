"use client";

import Link from "next/link";
import { Building2, Clock, CheckCircle2, XCircle, PauseCircle, Sparkles } from "lucide-react";
import { useI18n } from "@/components/providers/i18n-provider";
import {
  MOCK_OFFICES,
  MOCK_ADMIN_AUDIT,
  officesByStatus,
  officesRegisteredThisMonth,
} from "@/lib/mock/admin-data";

export default function AdminDashboardPage() {
  const { dict, locale } = useI18n();
  const a = dict.admin.dashboard;
  const counts = officesByStatus(MOCK_OFFICES);
  const newThisMonth = officesRegisteredThisMonth(MOCK_OFFICES);

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{a.title}</h1>
        <p className="text-sm text-muted-foreground">{a.subtitle}</p>
      </header>

      <section className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <Kpi
          label={a.kpis.totalOffices}
          value={MOCK_OFFICES.length}
          Icon={Building2}
          tone="primary"
        />
        <Kpi label={a.kpis.trial} value={counts.trial} Icon={Sparkles} tone="gold" />
        <Kpi label={a.kpis.active} value={counts.active} Icon={CheckCircle2} tone="success" />
        <Kpi label={a.kpis.expired} value={counts.expired} Icon={Clock} tone="warning" />
        <Kpi label={a.kpis.suspended} value={counts.suspended} Icon={PauseCircle} tone="muted" />
        <Kpi label={a.kpis.newThisMonth} value={newThisMonth} Icon={Sparkles} tone="primary" />
      </section>

      <section className="rounded-2xl border bg-card">
        <div className="border-b px-5 py-4">
          <h2 className="text-base font-semibold">{a.recentActivity}</h2>
        </div>
        <ul className="divide-y">
          {MOCK_ADMIN_AUDIT.slice(0, 8).map((entry) => {
            const actionLabel = dict.admin.audit.actions[entry.action];
            return (
              <li key={entry.id} className="flex flex-wrap items-baseline justify-between gap-2 px-5 py-3 text-sm">
                <div className="flex-1 min-w-0">
                  <p className="font-medium">{actionLabel}</p>
                  {entry.targetOfficeName ? (
                    <p className="num text-xs text-muted-foreground">
                      {entry.targetOfficeName}
                    </p>
                  ) : null}
                  {entry.notes ? (
                    <p className="mt-0.5 text-[11px] text-muted-foreground">{entry.notes}</p>
                  ) : null}
                </div>
                <div className="text-end">
                  <p className="text-xs">{entry.actorName}</p>
                  <p className="num text-[10px] text-muted-foreground">
                    {new Date(entry.ts).toLocaleDateString(locale === "ar" ? "ar-SA-u-nu-latn" : "en-US")}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
        <div className="border-t px-5 py-3 text-end">
          <Link href="/admin/audit" className="text-xs font-medium text-primary hover:underline">
            {dict.common.viewAll ?? "عرض الكل"} →
          </Link>
        </div>
      </section>
    </div>
  );
}

function Kpi({
  label,
  value,
  Icon,
  tone,
}: {
  label: string;
  value: number;
  Icon: typeof Building2;
  tone: "primary" | "gold" | "success" | "warning" | "muted";
}) {
  const toneClass =
    tone === "primary"
      ? "bg-primary-soft text-primary-soft-foreground"
      : tone === "gold"
        ? "bg-gold-soft text-gold-foreground"
        : tone === "success"
          ? "bg-success/10 text-success"
          : tone === "warning"
            ? "bg-warning-soft text-warning-foreground"
            : "bg-muted text-muted-foreground";
  return (
    <div className="rounded-xl border bg-card p-4">
      <div className="flex items-center justify-between">
        <span className={`grid size-8 place-items-center rounded-lg ${toneClass}`}>
          <Icon className="size-4" />
        </span>
      </div>
      <p className="num mt-3 text-2xl font-semibold">{value}</p>
      <p className="mt-1 text-[11px] text-muted-foreground leading-tight">{label}</p>
    </div>
  );
}

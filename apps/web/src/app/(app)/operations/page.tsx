"use client";

import { useMemo } from "react";
import Link from "next/link";
import {
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  Clock,
  GaugeCircle,
  Inbox,
  MessageCircle,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Currency } from "@/components/ui/currency";
import { StatusPill } from "@/components/ui/status-pill";
import { useStore } from "@/lib/mock/store";
import { useI18n } from "@/components/providers/i18n-provider";
import { cn } from "@/lib/utils";

export default function OperationsPage() {
  const { dict } = useI18n();
  const {
    customers,
    investmentContracts,
    installmentContracts,
    paymentProofs,
    approvals,
    notifications,
  } = useStore();
  const o = dict.operations;

  // Critical alerts derived from the data
  const overdue60Customers = useMemo(() => {
    const customerIds = new Set<string>();
    installmentContracts.forEach((c) => {
      c.schedule.forEach((s) => {
        if (s.status === "defaulted") customerIds.add(c.customerId);
      });
    });
    return Array.from(customerIds).slice(0, 5);
  }, [installmentContracts]);

  const pendingApprovals = approvals.filter((a) => a.status === "pending");
  const criticalApprovals = pendingApprovals.filter((a) => a.priority === "critical");
  const pendingProofs = paymentProofs.filter((p) => p.status === "pending");
  const lowOcrProofs = pendingProofs.filter((p) => p.ocr.confidence < 0.85);
  const lowCapitalInvestors = investmentContracts
    .filter((c) => c.status === "active")
    .map((c) => ({
      contract: c,
      available: c.amount - c.utilized,
      pct: c.amount > 0 ? (c.amount - c.utilized) / c.amount : 0,
    }))
    .filter((x) => x.pct <= 0.05)
    .slice(0, 5);
  const expiringContracts = investmentContracts
    .filter((c) => c.status === "active")
    .map((c) => {
      const endTime = new Date(c.endDate).getTime();
      const refTime = new Date("2025-06-01").getTime();
      const daysToEnd = Math.round((endTime - refTime) / (1000 * 60 * 60 * 24));
      return { contract: c, daysToEnd };
    })
    .filter((x) => x.daysToEnd >= 0 && x.daysToEnd <= 30)
    .slice(0, 5);

  const customerName = (id: string) => customers.find((c) => c.id === id)?.name ?? "—";

  const queues = [
    {
      key: "overdue",
      icon: Clock,
      tone: "danger" as const,
      count: overdue60Customers.length,
      hint: o.workQueues.overdue.hint.replace("{n}", String(overdue60Customers.length)),
      label: o.workQueues.overdue.label,
      href: "/customers",
    },
    {
      key: "approvals",
      icon: ShieldCheck,
      tone: "warning" as const,
      count: pendingApprovals.length,
      hint: o.workQueues.approvals.hint.replace("{n}", String(pendingApprovals.length)),
      label: o.workQueues.approvals.label,
      href: "/approvals",
    },
    {
      key: "collections",
      icon: Inbox,
      tone: "primary" as const,
      count: pendingProofs.length,
      hint: o.workQueues.collections.hint.replace("{n}", String(pendingProofs.length)),
      label: o.workQueues.collections.label,
      href: "/collections",
    },
    {
      key: "ocr",
      icon: AlertCircle,
      tone: "warning" as const,
      count: lowOcrProofs.length,
      hint: o.workQueues.ocr.hint.replace("{n}", String(lowOcrProofs.length)),
      label: o.workQueues.ocr.label,
      href: "/collections",
    },
    {
      key: "whatsapp",
      icon: MessageCircle,
      tone: "primary" as const,
      count: 2,
      hint: o.workQueues.whatsappFollowups.hint.replace("{n}", "2"),
      label: o.workQueues.whatsappFollowups.label,
      href: "/collections",
    },
  ];

  const queueTone: Record<"danger" | "warning" | "primary", string> = {
    danger: "bg-danger-soft text-danger-foreground",
    warning: "bg-warning-soft text-warning-foreground",
    primary: "bg-primary-soft text-primary-soft-foreground",
  };

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <GaugeCircle className="size-6 text-primary" />
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{o.pageTitle}</h1>
          </div>
          <p className="text-sm text-muted-foreground">{o.pageSubtitle}</p>
        </div>
      </header>

      {/* Critical alerts */}
      <Card className="border-danger-soft">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base font-semibold">
            <AlertTriangle className="size-4 text-danger" />
            {o.criticalSection}
            <span className="num text-xs font-medium text-muted-foreground">
              ({notifications.filter((n) => n.priority === "critical").length})
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {notifications
            .filter((n) => n.priority === "critical")
            .slice(0, 3)
            .map((n) => (
              <Link
                key={n.id}
                href={
                  n.relatedEntity?.kind === "approval"
                    ? `/approvals/${n.relatedEntity.id}`
                    : n.relatedEntity?.kind === "proof"
                      ? `/collections/${n.relatedEntity.id}`
                      : "/notifications"
                }
                className="flex items-center gap-3 rounded-lg border border-danger-soft bg-danger-soft/40 px-3 py-2 text-sm text-foreground transition-colors hover:bg-danger-soft/60"
              >
                <span className="flex size-7 items-center justify-center rounded-md bg-card/60 text-danger-foreground">
                  <AlertTriangle className="size-3.5" />
                </span>
                <span className="flex-1 font-medium">{n.title}</span>
                <ArrowRight className="size-3.5 rtl:rotate-180" />
              </Link>
            ))}
        </CardContent>
      </Card>

      {/* Work queues */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-muted-foreground">{o.workQueuesSection}</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {queues.map((q) => {
            const Icon = q.icon;
            return (
              <Link
                key={q.key}
                href={q.href}
                className="group flex flex-col gap-3 rounded-xl border bg-card p-4 shadow-[var(--shadow-card)] transition-shadow hover:shadow-lg"
              >
                <span
                  className={cn(
                    "flex size-9 items-center justify-center rounded-lg [&_svg]:size-4",
                    queueTone[q.tone],
                  )}
                >
                  <Icon />
                </span>
                <div>
                  <p className="num text-3xl font-semibold tracking-tight">{q.count}</p>
                  <p className="mt-0.5 text-xs font-medium">{q.label}</p>
                  <p className="text-xs text-muted-foreground">{q.hint}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Capital low + expiring */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base font-semibold">
              <TrendingUp className="size-4 text-warning" />
              {o.capitalSection}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 pb-2">
            {lowCapitalInvestors.length === 0 ? (
              <p className="text-sm text-muted-foreground">—</p>
            ) : (
              lowCapitalInvestors.map(({ contract, available, pct }) => (
                <Link
                  key={contract.id}
                  href={`/investments/${contract.id}`}
                  className="flex items-center justify-between gap-3 rounded-lg border border-border px-3 py-2 text-sm hover:bg-muted/40"
                >
                  <span className="num font-medium">{contract.number}</span>
                  <span className="num text-xs text-muted-foreground">
                    {o.capitalLowHint
                      .replace("{available}", `${(available / 1000).toFixed(0)}K`)
                      .replace("{total}", `${(contract.amount / 1_000_000).toFixed(1)}M`)
                      .replace("{pct}", String(Math.round(pct * 100)))}
                  </span>
                </Link>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base font-semibold">
              <Clock className="size-4 text-warning" />
              {o.expiringSection}
              <span className="text-xs font-normal text-muted-foreground">({o.expiringHint})</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 pb-2">
            {expiringContracts.length === 0 ? (
              <p className="text-sm text-muted-foreground">—</p>
            ) : (
              expiringContracts.map(({ contract, daysToEnd }) => (
                <Link
                  key={contract.id}
                  href={`/investments/${contract.id}`}
                  className="flex items-center justify-between gap-3 rounded-lg border border-border px-3 py-2 text-sm hover:bg-muted/40"
                >
                  <span className="num font-medium">{contract.number}</span>
                  <span className="num text-xs">
                    {daysToEnd} {dict.installmentContracts.details.months.replace("شهر", "يوم")}
                  </span>
                </Link>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {/* Critical approvals quick links */}
      {criticalApprovals.length > 0 ? (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">
              {dict.approvals.pageTitle} —{" "}
              <span className="text-danger">{criticalApprovals.length}</span> {dict.approvalPriority.critical}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 pb-2">
            {criticalApprovals.map((a) => (
              <Link
                key={a.id}
                href={`/approvals/${a.id}`}
                className="flex items-center justify-between gap-3 rounded-lg border border-border px-3 py-2 text-sm hover:bg-muted/40"
              >
                <span className="font-medium">{dict.permissionAction[a.type]}</span>
                <span className="text-xs text-muted-foreground">{a.relatedEntity.label}</span>
                <StatusPill tone="danger">
                  {a.amount ? <Currency value={a.amount} compact /> : "—"}
                </StatusPill>
              </Link>
            ))}
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}

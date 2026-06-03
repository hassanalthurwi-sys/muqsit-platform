"use client";

import { useMemo } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Bell,
  CalendarClock,
  CreditCard,
  Inbox,
  Recycle,
  ShieldCheck,
} from "lucide-react";
import { Currency } from "@/components/ui/currency";
import { useStore } from "@/lib/mock/store";
import { useI18n } from "@/components/providers/i18n-provider";
import { aggregateRecycleReady, recycleReady } from "@/lib/mock/recycling";
import { cn } from "@/lib/utils";

const REFERENCE_TODAY = "2025-06-01";

export default function OperationsPage() {
  const { dict, dir } = useI18n();
  const o = dict.operations;
  const Arrow = dir === "rtl" ? ArrowLeft : ArrowRight;
  const { installmentContracts, paymentProofs, approvals, investmentContracts } = useStore();

  // ── Card 1: overdue installments ──────────────────────────────────────────
  const overdue = useMemo(() => {
    const customerIds = new Set<string>();
    let totalAmount = 0;
    installmentContracts.forEach((c) => {
      c.schedule.forEach((s) => {
        if (s.status === "overdue" || s.status === "defaulted") {
          customerIds.add(c.customerId);
          totalAmount += s.amount - s.paidAmount;
        }
      });
    });
    return { customers: customerIds.size, total: totalAmount };
  }, [installmentContracts]);

  // ── Card 2: proofs awaiting review ────────────────────────────────────────
  const proofs = useMemo(() => {
    const pending = paymentProofs.filter((p) => p.status === "pending");
    const low = pending.filter((p) => p.ocr.confidence < 0.85);
    return { count: pending.length, low: low.length };
  }, [paymentProofs]);

  // ── Card 3: approvals ─────────────────────────────────────────────────────
  const approval = useMemo(() => {
    const pending = approvals.filter((a) => a.status === "pending");
    const critical = pending.filter((a) => a.priority === "critical");
    return { count: pending.length, critical: critical.length };
  }, [approvals]);

  // ── Card 4: capital ready to recycle ──────────────────────────────────────
  const recycle = useMemo(() => {
    const ready = recycleReady(investmentContracts, installmentContracts);
    return { ready, ...aggregateRecycleReady(ready) };
  }, [investmentContracts, installmentContracts]);

  // ── Secondary tile: contracts expiring ────────────────────────────────────
  const expiring = useMemo(() => {
    const refTime = new Date(REFERENCE_TODAY).getTime();
    return investmentContracts.filter((c) => {
      if (c.status !== "active") return false;
      const days = Math.round((new Date(c.endDate).getTime() - refTime) / 86_400_000);
      return days >= 0 && days <= 30;
    }).length;
  }, [investmentContracts]);

  const nothingToday =
    overdue.customers === 0 &&
    proofs.count === 0 &&
    approval.count === 0 &&
    recycle.investorCount === 0;

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-5">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{o.pageTitle}</h1>
        <p className="text-sm text-muted-foreground">{o.pageSubtitle}</p>
      </header>

      {nothingToday ? (
        <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center">
          <Bell className="mx-auto mb-3 size-6 text-muted-foreground" aria-hidden />
          <p className="text-sm text-muted-foreground">{o.emptyDay}</p>
        </div>
      ) : null}

      <div className="space-y-3">
        <ActionCard
          icon={CreditCard}
          tone="danger"
          title={o.cards.overdue.title}
          primary={o.cards.overdue.primary.replace("{n}", String(overdue.customers))}
          secondary={
            overdue.total > 0 ? (
              <>
                <Currency value={overdue.total} compact />{" "}
                {o.cards.overdue.secondary
                  .replace("{amount} ر.س", "")
                  .replace("{amount} SAR", "")
                  .trim()}
              </>
            ) : null
          }
          cta={o.cards.overdue.cta}
          href="/collections"
          Arrow={Arrow}
          hideWhenZero={overdue.customers === 0}
        />

        <ActionCard
          icon={Inbox}
          tone="primary"
          title={o.cards.proofs.title}
          primary={o.cards.proofs.primary.replace("{n}", String(proofs.count))}
          secondary={
            proofs.low > 0 ? o.cards.proofs.secondary.replace("{m}", String(proofs.low)) : null
          }
          cta={o.cards.proofs.cta}
          href="/collections/whatsapp"
          Arrow={Arrow}
          hideWhenZero={proofs.count === 0}
        />

        <ActionCard
          icon={ShieldCheck}
          tone="warning"
          title={o.cards.approvals.title}
          primary={o.cards.approvals.primary.replace("{n}", String(approval.count))}
          secondary={
            approval.critical > 0
              ? o.cards.approvals.secondary.replace("{critical}", String(approval.critical))
              : null
          }
          cta={o.cards.approvals.cta}
          href="/approvals"
          Arrow={Arrow}
          hideWhenZero={approval.count === 0}
        />

        <RecycleCard
          totalCollected={recycle.totalCollected}
          investorCount={recycle.investorCount}
        />
      </div>

      {/* Secondary lighter tile — informational follow-up */}
      <Link
        href="/investments"
        className="mt-2 flex items-center justify-between rounded-xl border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground hover:bg-muted/60"
      >
        <span className="flex items-center gap-2.5">
          <CalendarClock className="size-4" aria-hidden />
          <span>
            {o.expiring.title} ·{" "}
            <span className="num text-foreground">
              {o.expiring.hint.replace("{n}", String(expiring))}
            </span>
          </span>
        </span>
        <Arrow className="size-4" aria-hidden />
      </Link>
    </div>
  );
}

// ─── Action card ─────────────────────────────────────────────────────────────

type Tone = "danger" | "primary" | "warning" | "success";

interface ActionCardProps {
  icon: React.ComponentType<{ className?: string }>;
  tone: Tone;
  title: string;
  primary: React.ReactNode;
  secondary?: React.ReactNode;
  cta: string;
  href: string;
  Arrow: React.ComponentType<{ className?: string }>;
  hideWhenZero?: boolean;
}

const toneIcon: Record<Tone, string> = {
  danger: "bg-danger-soft text-danger-foreground",
  primary: "bg-primary-soft text-primary-soft-foreground",
  warning: "bg-warning-soft text-warning-foreground",
  success: "bg-success-soft text-success-foreground",
};

function ActionCard({
  icon: Icon,
  tone,
  title,
  primary,
  secondary,
  cta,
  href,
  Arrow,
  hideWhenZero,
}: ActionCardProps) {
  if (hideWhenZero) return null;
  return (
    <Link
      href={href}
      className="group flex items-center gap-4 rounded-2xl border border-border bg-card p-4 transition-colors hover:border-primary/40 sm:p-5"
    >
      <span
        className={cn(
          "flex size-11 shrink-0 items-center justify-center rounded-xl",
          toneIcon[tone],
        )}
      >
        <Icon className="size-5" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-medium text-muted-foreground">{title}</p>
        <p className="num mt-0.5 text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
          {primary}
        </p>
        {secondary ? (
          <p className="num mt-0.5 text-[11px] text-muted-foreground">{secondary}</p>
        ) : null}
      </div>
      <span className="hidden flex-col items-end gap-1 text-end text-xs font-medium text-primary sm:flex">
        {cta}
      </span>
      <Arrow
        className="size-4 text-muted-foreground transition-colors group-hover:text-foreground"
        aria-hidden
      />
    </Link>
  );
}

// ─── Recycle card (special: has empty state instead of hide) ─────────────────

function RecycleCard({
  totalCollected,
  investorCount,
}: {
  totalCollected: number;
  investorCount: number;
}) {
  const { dict, dir } = useI18n();
  const o = dict.operations.cards.recycle;
  const Arrow = dir === "rtl" ? ArrowLeft : ArrowRight;

  if (investorCount === 0) {
    return (
      <div className="rounded-2xl border border-border bg-card p-4 sm:p-5">
        <div className="flex items-center gap-4">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground">
            <Recycle className="size-5" aria-hidden />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-medium text-muted-foreground">{o.title}</p>
            <p className="mt-0.5 text-sm text-muted-foreground">{o.empty}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Link
      href="/investments?ready=1"
      className="group flex items-center gap-4 rounded-2xl border border-primary/30 bg-primary-soft/40 p-4 transition-colors hover:border-primary/60 sm:p-5"
    >
      <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
        <Recycle className="size-5" aria-hidden />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-medium text-primary-soft-foreground">{o.title}</p>
        <p className="num mt-0.5 text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
          <Currency value={totalCollected} />
        </p>
        <p className="num mt-0.5 text-[11px] text-muted-foreground">
          {o.secondary.replace("{n}", String(investorCount))}
        </p>
      </div>
      <span className="hidden text-end text-xs font-semibold text-primary sm:inline">{o.cta}</span>
      <Arrow className="size-4 text-primary" aria-hidden />
    </Link>
  );
}

"use client";

import { useMemo, useState, use } from "react";
import Link from "next/link";
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  FileSignature,
  Mail,
  Phone,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Currency } from "@/components/ui/currency";
import { StatusPill } from "@/components/ui/status-pill";
import { IdentityBadge } from "@/components/ui/identity-badge";
import { DataRow, DataRows } from "@/components/ui/data-row";
import { InvestorAvatar } from "@/components/investor-avatar";
import { findInvestor, getInvestedCapital } from "@/lib/mock/investors";
import { useStore } from "@/lib/mock/store";
import { useI18n } from "@/components/providers/i18n-provider";
import { formatIban, formatDate } from "@/lib/format";
import type { InvestorActivityType } from "@/lib/mock/types";

const ACTIVITY_ICON: Record<InvestorActivityType, typeof ArrowDownToLine> = {
  receipt: ArrowDownToLine,
  payment: ArrowUpFromLine,
  profitDistribution: TrendingUp,
  contract: FileSignature,
  recycledContract: FileSignature,
};

const ACTIVITY_TONE: Record<InvestorActivityType, string> = {
  receipt: "bg-success/10 text-success",
  payment: "bg-muted text-muted-foreground",
  profitDistribution: "bg-success/10 text-success",
  contract: "bg-primary/10 text-primary",
  recycledContract: "bg-gold-soft text-gold-foreground",
};

// A payment voucher tagged as a profit distribution in the timeline if its
// description mentions أرباح / ربح / profit. This keeps the single Payment
// Voucher concept intact (no separate category) while letting the timeline
// surface it with clearer business language.
const PROFIT_KEYWORDS = /(ربح|أرباح|الأرباح|profit)/i;
function classifyPayment(notes: string | undefined): "payment" | "profitDistribution" {
  return notes && PROFIT_KEYWORDS.test(notes) ? "profitDistribution" : "payment";
}

interface TimelineItem {
  ts: string;
  type: InvestorActivityType;
  amount: number;
  referenceLabel?: string;
  referenceHref?: string;
  description?: string;
}

const INITIAL_VISIBLE_ACTIVITY = 8;

export default function InvestorProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { dict, locale } = useI18n();
  const {
    investmentContracts: contracts,
    receipts,
    payments,
    officeSettings,
    getInvestorBalance,
    getInvestorRealizedProfit,
    getEffectivePolicyFor,
    setInvestorPolicyOverride,
    profitDistributions,
  } = useStore();
  const investor = findInvestor(id);
  const [activityLimit, setActivityLimit] = useState(INITIAL_VISIBLE_ACTIVITY);

  const investorContracts = useMemo(
    () => contracts.filter((c) => c.investorId === id),
    [contracts, id],
  );

  const investedCapital = useMemo(
    () => getInvestedCapital(contracts, id),
    [contracts, id],
  );

  const currentBalance = useMemo(() => getInvestorBalance(id), [getInvestorBalance, id]);

  const timeline: TimelineItem[] = useMemo(() => {
    const items: TimelineItem[] = [];
    for (const c of contracts.filter((c) => c.investorId === id)) {
      const isRecycled = Boolean(c.fromInvestorBalance) || Boolean(c.sourceContractId);
      items.push({
        ts: c.startDate,
        type: isRecycled ? "recycledContract" : "contract",
        amount: c.amount,
        referenceLabel: c.number,
        referenceHref: `/investments/${c.id}`,
      });
    }
    for (const r of receipts.filter((r) => r.investorId === id)) {
      items.push({
        ts: r.date,
        type: "receipt",
        amount: r.amount,
        referenceLabel: r.number,
        referenceHref: `/financial/receipts/${r.id}`,
        description: r.notes,
      });
    }
    for (const pay of payments.filter((p) => p.investorId === id)) {
      items.push({
        ts: pay.date,
        type: classifyPayment(pay.notes),
        amount: pay.amount,
        referenceLabel: pay.number,
        referenceHref: `/financial/payments/${pay.id}`,
        description: pay.notes,
      });
    }
    // Sprint 11 — real profit distribution events from the store
    for (const e of profitDistributions.filter((e) => e.investorId === id)) {
      items.push({
        ts: e.date,
        type: "profitDistribution",
        amount: e.investorShare,
        referenceLabel: `#${e.installmentIndex}`,
        referenceHref: `/contracts/${e.installmentContractId}`,
      });
    }
    return items.sort((a, b) => b.ts.localeCompare(a.ts));
  }, [contracts, receipts, payments, profitDistributions, id]);

  const visibleActivity = timeline.slice(0, activityLimit);
  const hasMoreActivity = timeline.length > activityLimit;
  const lastActivityTs = timeline[0]?.ts;

  if (!investor) {
    return (
      <div className="rounded-xl border bg-card p-8 text-center text-muted-foreground">
        المستثمر غير موجود.
      </div>
    );
  }

  const p = dict.investors.profile;
  const i = dict.investors;
  const recyclingThreshold = officeSettings.investmentDefaults.recyclingThreshold;
  const eligibleForRecycling = currentBalance >= recyclingThreshold;

  const identityFields: Array<[string, string]> = (() => {
    const idf = dict.identityFieldLabel;
    const ident = investor.identity;
    switch (ident.kind) {
      case "saudiIndividual":
        return [[idf.nationalId, ident.nationalId]];
      case "gccIndividual":
        return [
          [idf.gccId, ident.gccId],
          [idf.country, ident.country],
        ];
      case "foreignIndividual":
        return [
          [idf.passport, ident.passport],
          [idf.nationality, ident.nationality],
        ];
      case "commercialEntity":
        return [
          [idf.cr, ident.cr],
          [idf.entityName, ident.entityName],
        ];
    }
  })();

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <header className="flex flex-wrap items-start gap-4">
        <InvestorAvatar name={investor.name} kind={investor.identity.kind} size="lg" />
        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-semibold tracking-tight">{investor.name}</h1>
            <StatusPill tone={investor.type === "internal" ? "primary" : "gold"}>
              {dict.investorType[investor.type]}
            </StatusPill>
            <IdentityBadge kind={investor.identity.kind} />
            <StatusPill
              tone={
                investor.status === "active"
                  ? "success"
                  : investor.status === "suspended"
                    ? "danger"
                    : "default"
              }
            >
              {dict.investorStatus[investor.status]}
            </StatusPill>
          </div>
          <p className="text-sm text-muted-foreground">
            {p.joinedAt} {formatDate(investor.joinedAt, locale)}
          </p>
        </div>
        <Link
          href={`/investments/new?investorId=${investor.id}`}
          className="inline-flex items-center gap-1 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          {p.newContract}
        </Link>
      </header>

      {/* Four-metric strip */}
      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <MetricCard
          label={i.metric.currentBalance}
          value={<Currency value={currentBalance} />}
          accent="primary"
        />
        <MetricCard
          label={i.metric.investedCapital}
          value={<Currency value={investedCapital} />}
        />
        <MetricCard
          label={i.metric.realizedProfit}
          value={<Currency value={getInvestorRealizedProfit(id)} />}
          accent="success"
        />
        <MetricCard
          label={i.metric.activeContracts}
          value={<span className="num">{investor.activeContractCount}</span>}
        />
      </section>

      {/* Recycling alert — silent when below threshold */}
      {eligibleForRecycling ? (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-gold-soft bg-gold-soft/40 px-4 py-3">
          <div className="flex items-center gap-3">
            <span className="grid size-9 place-items-center rounded-full bg-gold-soft text-gold-foreground">
              <Sparkles className="size-4" />
            </span>
            <div>
              <p className="text-sm font-medium text-gold-foreground">
                {i.recycling.eligible}
              </p>
              <p className="text-xs text-muted-foreground">
                <Currency value={currentBalance} compact />{" "}
                <span aria-hidden>·</span>{" "}
                <Currency value={recyclingThreshold} compact />
              </p>
            </div>
          </div>
          <Link
            href={`/investments/new?investorId=${investor.id}&recycle=true`}
            className="inline-flex items-center gap-1 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90"
          >
            {i.recycling.cta}
          </Link>
        </div>
      ) : null}

      {/* Investor balance — رصيد المستثمر */}
      <Card>
        <CardHeader className="flex flex-col items-start gap-2 pb-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-base font-semibold">{i.wallet.title}</CardTitle>
            {lastActivityTs ? (
              <p className="mt-1 text-xs text-muted-foreground">
                {i.wallet.lastActivity} · {formatDate(lastActivityTs, locale)}
              </p>
            ) : null}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href={`/financial/receipts/new?investorId=${investor.id}`}
              className="inline-flex items-center gap-1 rounded-md border border-primary px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/10"
            >
              {i.wallet.newReceipt}
            </Link>
            <Link
              href={`/financial/payments/new?investorId=${investor.id}`}
              className="inline-flex items-center gap-1 rounded-md border border-input px-3 py-1.5 text-xs font-medium hover:bg-muted"
            >
              {i.wallet.newPayment}
            </Link>
            <Link
              href={`/financial/receipts?investorId=${investor.id}`}
              className="inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted"
            >
              {i.wallet.viewMovements}
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <p className="num text-2xl font-semibold text-primary sm:text-3xl">
            <Currency value={currentBalance} />
          </p>
        </CardContent>
      </Card>

      {/* Investor details + bank */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">{p.contactSection}</CardTitle>
          </CardHeader>
          <CardContent>
            <DataRows>
              {investor.email ? (
                <DataRow
                  label={dict.auth.email}
                  value={
                    <span className="inline-flex items-center gap-1.5">
                      <Mail className="size-3.5 text-muted-foreground" />
                      <span className="num text-xs">{investor.email}</span>
                    </span>
                  }
                />
              ) : null}
              {investor.phone ? (
                <DataRow
                  label="الهاتف"
                  value={
                    <span className="inline-flex items-center gap-1.5">
                      <Phone className="size-3.5 text-muted-foreground" />
                      <span className="num text-xs" dir="ltr">{investor.phone}</span>
                    </span>
                  }
                />
              ) : null}
              {identityFields.map(([label, val]) => (
                <DataRow key={label} label={label} value={<span dir="ltr">{val}</span>} />
              ))}
            </DataRows>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">{p.detailsSection}</CardTitle>
          </CardHeader>
          <CardContent>
            <DataRows>
              <DataRow
                label={p.totalCapitalLabel}
                value={
                  <span className="num font-medium">
                    <Currency value={investor.totalCapital} />
                  </span>
                }
              />
              <DataRow
                label={p.joinedAt}
                value={<span className="num text-xs">{formatDate(investor.joinedAt, locale)}</span>}
              />
              {(() => {
                const pol = getEffectivePolicyFor(id);
                const polLabel =
                  pol.policy === "officeFirst" ? dict.profitPolicy.officeFirst :
                  pol.policy === "investorFirst" ? dict.profitPolicy.investorFirst :
                  dict.profitPolicy.proportional;
                const sourceLabel = pol.source === "officeDefault"
                  ? dict.profitPolicy.fromOfficeDefault
                  : dict.profitPolicy.fromInvestorOverride;
                return (
                  <DataRow
                    label={dict.profitPolicy.investorPolicyLabel}
                    value={
                      <div className="flex flex-col items-end gap-1.5">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-soft px-2.5 py-0.5 text-[11px] font-medium text-primary-soft-foreground">
                          {polLabel}
                        </span>
                        <span className="text-[10px] text-muted-foreground">{sourceLabel}</span>
                        <select
                          className="h-7 rounded-md border border-input bg-card px-2 text-[11px]"
                          value={investor.profitPolicyOverride ?? "useOfficeDefault"}
                          onChange={(e) => setInvestorPolicyOverride(id, e.target.value as never)}
                        >
                          <option value="useOfficeDefault">{dict.profitPolicy.useOfficeDefault}</option>
                          <option value="officeFirst">{dict.profitPolicy.officeFirst}</option>
                          <option value="investorFirst">{dict.profitPolicy.investorFirst}</option>
                          <option value="proportional">{dict.profitPolicy.proportional}</option>
                        </select>
                      </div>
                    }
                  />
                );
              })()}
            </DataRows>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">{dict.bank.sectionTitle}</CardTitle>
          </CardHeader>
          <CardContent>
            <DataRows>
              <DataRow label={dict.bank.bankName} value={investor.bankAccount.bankName} />
              <DataRow
                label={dict.bank.iban}
                value={
                  <span className="num" dir="ltr">
                    {formatIban(investor.bankAccount.iban)}
                  </span>
                }
              />
              {investor.bankAccount.accountHolder ? (
                <DataRow
                  label={dict.bank.accountHolder}
                  value={investor.bankAccount.accountHolder}
                />
              ) : null}
            </DataRows>
          </CardContent>
        </Card>
      </div>

      {/* Contracts table */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">
            {p.contractsSection} ({investorContracts.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="px-0 pb-2 pt-0">
          {investorContracts.length === 0 ? (
            <p className="px-6 py-6 text-sm text-muted-foreground">{p.noContracts}</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-[11px] uppercase text-muted-foreground">
                    <th className="px-6 py-2 text-start font-medium">
                      {dict.investments.columns.number}
                    </th>
                    <th className="px-6 py-2 text-start font-medium">
                      {dict.investments.columns.amount}
                    </th>
                    <th className="px-6 py-2 text-start font-medium">
                      {dict.investments.columns.start}
                    </th>
                    <th className="px-6 py-2 text-start font-medium">
                      {dict.investments.columns.end}
                    </th>
                    <th className="px-6 py-2 text-start font-medium">
                      {dict.investments.columns.ops}
                    </th>
                    <th className="px-6 py-2 text-start font-medium">
                      {dict.investments.columns.status}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {investorContracts.map((c) => (
                    <tr key={c.id} className="hover:bg-muted/40">
                      <td className="px-6 py-2.5">
                        <Link
                          href={`/investments/${c.id}`}
                          className="num font-medium text-primary hover:underline"
                        >
                          {c.number}
                        </Link>
                      </td>
                      <td className="num px-6 py-2.5">
                        <Currency value={c.amount} compact />
                      </td>
                      <td className="num px-6 py-2.5 text-muted-foreground">
                        {formatDate(c.startDate, locale)}
                      </td>
                      <td className="num px-6 py-2.5 text-muted-foreground">
                        {formatDate(c.endDate, locale)}
                      </td>
                      <td className="num px-6 py-2.5">{c.operationPct}%</td>
                      <td className="px-6 py-2.5">
                        <StatusPill
                          tone={
                            c.status === "active"
                              ? "success"
                              : c.status === "pendingSetup"
                                ? "warning"
                                : c.status === "cancelled"
                                  ? "danger"
                                  : "default"
                          }
                        >
                          {dict.contractStatus[c.status]}
                        </StatusPill>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Profit terms + activity timeline */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">{p.termsSection}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-7">{investor.profitTerms}</p>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">{p.activitySection}</CardTitle>
          </CardHeader>
          <CardContent>
            {visibleActivity.length === 0 ? (
              <p className="text-sm text-muted-foreground">{p.noActivity}</p>
            ) : (
              <ol className="flex flex-col gap-3">
                {visibleActivity.map((item, idx) => {
                  const Icon = ACTIVITY_ICON[item.type];
                  const tone = ACTIVITY_TONE[item.type];
                  return (
                    <li key={`${item.ts}-${idx}`} className="flex items-start gap-3">
                      <span
                        className={`mt-0.5 grid size-8 shrink-0 place-items-center rounded-full ${tone}`}
                      >
                        <Icon className="size-4" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-baseline justify-between gap-2">
                          <p className="text-sm font-medium">{i.activityType[item.type]}</p>
                          <span className="num text-sm font-semibold">
                            <Currency value={item.amount} compact />
                          </span>
                        </div>
                        {item.description ? (
                          <p className="mt-0.5 text-xs text-muted-foreground">{item.description}</p>
                        ) : null}
                        <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
                          <span className="num">{formatDate(item.ts, locale)}</span>
                          {item.referenceLabel ? (
                            <>
                              <span aria-hidden>·</span>
                              {item.referenceHref ? (
                                <Link
                                  href={item.referenceHref}
                                  className="num text-primary hover:underline"
                                >
                                  {item.referenceLabel}
                                </Link>
                              ) : (
                                <span className="num">{item.referenceLabel}</span>
                              )}
                            </>
                          ) : null}
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ol>
            )}
            {hasMoreActivity ? (
              <button
                type="button"
                onClick={() => setActivityLimit((v) => v + INITIAL_VISIBLE_ACTIVITY)}
                className="mt-3 w-full rounded-md border bg-card py-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted/60"
              >
                {p.showMore}
              </button>
            ) : null}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function MetricCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: React.ReactNode;
  accent?: "primary" | "success";
}) {
  const valueClass =
    accent === "primary" ? "text-primary" : accent === "success" ? "text-success" : "text-foreground";
  return (
    <div className="rounded-xl border bg-card p-4">
      <p className="label">{label}</p>
      <p className={`num mt-1 text-xl font-semibold sm:text-2xl ${valueClass}`}>{value}</p>
    </div>
  );
}

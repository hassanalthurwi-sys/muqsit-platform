"use client";

import { useMemo, useState, use } from "react";
import Link from "next/link";
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  FileSignature,
  Mail,
  Phone,
  RefreshCcw,
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
  contractCreated: FileSignature,
  payment: ArrowUpFromLine,
  recycling: RefreshCcw,
  profitDistribution: TrendingUp,
};

const ACTIVITY_TONE: Record<InvestorActivityType, string> = {
  receipt: "bg-success/10 text-success",
  contractCreated: "bg-primary/10 text-primary",
  payment: "bg-muted text-muted-foreground",
  recycling: "bg-gold-soft text-gold-foreground",
  profitDistribution: "bg-success/10 text-success",
};

const INITIAL_VISIBLE_ACTIVITY = 8;

export default function InvestorProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { dict, locale } = useI18n();
  const { investmentContracts: contracts, officeSettings } = useStore();
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
  const eligibleForRecycling = investor.currentBalance >= recyclingThreshold;

  const sortedActivity = [...investor.recentActivity].sort((a, b) =>
    b.ts.localeCompare(a.ts),
  );
  const visibleActivity = sortedActivity.slice(0, activityLimit);
  const hasMoreActivity = sortedActivity.length > activityLimit;

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
          value={<Currency value={investor.currentBalance} />}
          accent="primary"
        />
        <MetricCard
          label={i.metric.investedCapital}
          value={<Currency value={investedCapital} />}
        />
        <MetricCard
          label={i.metric.realizedProfit}
          value={<Currency value={investor.realizedProfit} />}
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
                <Currency value={investor.currentBalance} compact />{" "}
                <span aria-hidden>·</span>{" "}
                <Currency value={recyclingThreshold} compact />
              </p>
            </div>
          </div>
          <Link
            href={`/investments/new?investorId=${investor.id}`}
            className="inline-flex items-center gap-1 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90"
          >
            {i.recycling.cta}
          </Link>
        </div>
      ) : null}

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
                  const type = item.type ?? "receipt";
                  const Icon = ACTIVITY_ICON[type];
                  return (
                    <li key={`${item.ts}-${idx}`} className="flex items-start gap-3">
                      <span
                        className={`mt-0.5 grid size-8 shrink-0 place-items-center rounded-full ${ACTIVITY_TONE[type]}`}
                      >
                        <Icon className="size-4" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-baseline justify-between gap-2">
                          <p className="text-sm font-medium">
                            {item.type ? i.activityType[item.type] : item.text}
                          </p>
                          {item.amount != null ? (
                            <span className="num text-sm font-semibold">
                              <Currency value={item.amount} compact />
                            </span>
                          ) : null}
                        </div>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {item.type ? item.text : null}
                        </p>
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

"use client";

import { useMemo, use } from "react";
import Link from "next/link";
import { Mail, Phone } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Currency } from "@/components/ui/currency";
import { StatusPill } from "@/components/ui/status-pill";
import { IdentityBadge } from "@/components/ui/identity-badge";
import { DataRow, DataRows } from "@/components/ui/data-row";
import { Timeline } from "@/components/ui/timeline";
import { InvestorAvatar } from "@/components/investor-avatar";
import { findInvestor } from "@/lib/mock/investors";
import { useContractStore } from "@/lib/mock/store";
import { useI18n } from "@/components/providers/i18n-provider";
import { formatIban, formatDate } from "@/lib/format";

export default function InvestorProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { dict, locale } = useI18n();
  const { contracts } = useContractStore();
  const investor = findInvestor(id);

  const investorContracts = useMemo(
    () => contracts.filter((c) => c.investorId === id),
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
  const utilPct = investor.totalCapital
    ? Math.round((investor.utilizedCapital / investor.totalCapital) * 100)
    : 0;

  // Identity fields render per kind
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
          href="/investments/new"
          className="inline-flex items-center gap-1 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          {p.newContract}
        </Link>
      </header>

      {/* Top row: contact / capital */}
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

        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">{p.capitalSection}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-1">
                <p className="label">{dict.investors.columns.totalCapital}</p>
                <p className="num text-2xl font-semibold">
                  <Currency value={investor.totalCapital} />
                </p>
              </div>
              <div className="space-y-1">
                <p className="label">{dict.investors.columns.utilized}</p>
                <p className="num text-2xl font-semibold text-primary">
                  <Currency value={investor.utilizedCapital} />
                </p>
              </div>
              <div className="space-y-1">
                <p className="label">{dict.investors.columns.unutilized}</p>
                <p className="num text-2xl font-semibold">
                  <Currency value={investor.unutilizedCapital} />
                </p>
              </div>
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>نسبة الاستخدام</span>
                <span className="num font-medium text-foreground">{utilPct}%</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                <div className="h-full rounded-full bg-primary" style={{ width: `${utilPct}%` }} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bank account */}
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

      {/* Profit terms + activity */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">{p.termsSection}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-7">{investor.profitTerms}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">{p.activitySection}</CardTitle>
          </CardHeader>
          <CardContent>
            <Timeline
              items={investor.recentActivity.map((a) => ({
                ts: formatDate(a.ts, locale),
                text: a.text,
              }))}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

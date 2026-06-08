"use client";

import { use, useMemo } from "react";
import Link from "next/link";
import { FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Currency } from "@/components/ui/currency";
import { StatusPill } from "@/components/ui/status-pill";
import { IdentityBadge } from "@/components/ui/identity-badge";
import { RecycledBadge } from "@/components/ui/recycled-badge";
import { DataRow, DataRows } from "@/components/ui/data-row";
import { Timeline } from "@/components/ui/timeline";
import { useContractStore, useStore } from "@/lib/mock/store";
import { findInvestor } from "@/lib/mock/investors";
import { useI18n } from "@/components/providers/i18n-provider";
import { formatDate } from "@/lib/format";

export default function InvestmentDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { dict, locale } = useI18n();
  const { contracts } = useContractStore();
  const { installmentContracts, profitDistributions } = useStore();
  const contract = useMemo(() => contracts.find((c) => c.id === id), [contracts, id]);

  if (!contract) {
    return (
      <div className="rounded-xl border bg-card p-8 text-center text-muted-foreground">
        العقد غير موجود.
      </div>
    );
  }

  const investor = findInvestor(contract.investorId);
  const d = dict.investments.details;
  const utilPct = contract.amount ? Math.round((contract.utilized / contract.amount) * 100) : 0;

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-2">
          <Link
            href="/investments"
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            {d.back}
          </Link>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="num text-2xl font-semibold tracking-tight sm:text-3xl">
              {contract.number}
            </h1>
            <StatusPill
              tone={
                contract.status === "active"
                  ? "success"
                  : contract.status === "pendingSetup"
                    ? "warning"
                    : contract.status === "cancelled"
                      ? "danger"
                      : "default"
              }
            >
              {dict.contractStatus[contract.status]}
            </StatusPill>
            {contract.sourceContractId ? <RecycledBadge size="md" /> : null}
          </div>
          {investor ? (
            <p className="text-sm text-muted-foreground">
              {dict.investments.pageTitle} · {investor.name}
            </p>
          ) : null}
        </div>
      </header>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">{d.contractInfo}</CardTitle>
          </CardHeader>
          <CardContent>
            <DataRows>
              <DataRow
                label={d.amount}
                value={<Currency value={contract.amount} />}
              />
              <DataRow label={d.start} value={formatDate(contract.startDate, locale)} />
              <DataRow label={d.end} value={formatDate(contract.endDate, locale)} />
              <DataRow
                label={d.duration}
                value={`${contract.durationMonths} ${d.months}`}
              />
              <DataRow
                label={d.document}
                value={
                  contract.documentName ? (
                    <span className="inline-flex items-center gap-1.5">
                      <FileText className="size-3.5 text-muted-foreground" />
                      <span className="num text-xs">{contract.documentName}</span>
                    </span>
                  ) : (
                    <span className="text-muted-foreground">{d.noDocument}</span>
                  )
                }
              />
            </DataRows>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">{d.investor}</CardTitle>
          </CardHeader>
          <CardContent>
            {investor ? (
              <div className="space-y-3">
                <div className="space-y-1">
                  <p className="font-semibold">{investor.name}</p>
                  <div className="flex flex-wrap items-center gap-1.5">
                    <StatusPill tone={investor.type === "internal" ? "primary" : "gold"}>
                      {dict.investorType[investor.type]}
                    </StatusPill>
                    <IdentityBadge kind={investor.identity.kind} />
                  </div>
                </div>
                {investor.phone ? (
                  <p className="num text-xs text-muted-foreground" dir="ltr">
                    {investor.phone}
                  </p>
                ) : null}
                <Link
                  href={`/investors/${investor.id}`}
                  className="block text-xs font-medium text-primary hover:underline"
                >
                  {d.viewInvestor}
                </Link>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">—</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">{d.capitalUsage}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <p className="num text-2xl font-semibold">
              <Currency value={contract.utilized} /> /{" "}
              <span className="text-muted-foreground">
                <Currency value={contract.amount} />
              </span>
            </p>
            <span className="num text-sm font-medium text-primary">{utilPct}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
            <div className="h-full rounded-full bg-primary" style={{ width: `${utilPct}%` }} />
          </div>
          <div className="flex flex-wrap items-center justify-between text-xs text-muted-foreground">
            <span>
              {d.utilized}{" "}
              <span className="num font-medium text-foreground">
                <Currency value={contract.utilized} compact />
              </span>
            </span>
            <span>
              {d.remaining}{" "}
              <span className="num font-medium text-foreground">
                <Currency value={contract.remaining} compact />
              </span>
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Sprint 11 — ربح العقد */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">
            {dict.profitPolicy.contractProfitTitle}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="rounded-xl border bg-card p-3">
              <p className="label">{dict.profitPolicy.officeExpected}</p>
              <p className="num mt-1 text-lg font-semibold text-primary">
                <Currency value={contract.officeExpectedProfit} />
              </p>
            </div>
            <div className="rounded-xl border bg-card p-3">
              <p className="label">{dict.profitPolicy.investorExpected}</p>
              <p className="num mt-1 text-lg font-semibold text-success">
                <Currency value={contract.investorExpectedProfit} />
              </p>
            </div>
            <div className="rounded-xl border bg-muted/30 p-3">
              <p className="label">{dict.investments.create.step2.totalProfit}</p>
              <p className="num mt-1 text-lg font-semibold">
                <Currency value={contract.officeExpectedProfit + contract.investorExpectedProfit} />
              </p>
            </div>
          </div>
          {(() => {
            const linked = installmentContracts.filter((ic) => ic.investmentContractId === contract.id);
            if (linked.length === 0) return null;
            const liveEventsByIC = new Map<string, { office: number; investor: number }>();
            for (const e of profitDistributions) {
              const cur = liveEventsByIC.get(e.installmentContractId) ?? { office: 0, investor: 0 };
              cur.office += e.officeShare;
              cur.investor += e.investorShare;
              liveEventsByIC.set(e.installmentContractId, cur);
            }
            return (
              <div className="rounded-xl border bg-card">
                <div className="border-b px-4 py-2 text-xs font-medium text-muted-foreground">
                  {locale === "ar" ? "عقود التقسيط المرتبطة" : "Linked installment contracts"} ({linked.length})
                </div>
                <ul className="divide-y divide-border">
                  {linked.slice(0, 5).map((ic) => {
                    const live = liveEventsByIC.get(ic.id) ?? { office: 0, investor: 0 };
                    const office = ic.officeRecoveredSoFar + live.office;
                    const investor = ic.investorRecoveredSoFar + live.investor;
                    return (
                      <li key={ic.id} className="flex flex-wrap items-baseline justify-between gap-2 px-4 py-2 text-sm">
                        <Link href={`/contracts/${ic.id}`} className="num font-medium text-primary hover:underline">
                          {ic.number}
                        </Link>
                        <span className="text-xs text-muted-foreground">
                          {dict.profitPolicy.officeShort}: <Currency value={office} compact /> ·
                          {" "}{dict.profitPolicy.investorShort}: <Currency value={investor} compact />
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })()}
        </CardContent>
      </Card>

      {contract.sourceContractId ? (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base font-semibold">
              <RecycledBadge />
              {dict.recycling.detail.sectionTitle}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <DataRows>
              {contract.recycledFromCollected !== undefined ? (
                <DataRow
                  label={dict.recycling.detail.collectedRow}
                  value={<Currency value={contract.recycledFromCollected} />}
                />
              ) : null}
              {contract.recyclingOfficeMargin !== undefined ? (
                <DataRow
                  label={dict.recycling.detail.officeShareRow}
                  value={<Currency value={contract.recyclingOfficeMargin} />}
                />
              ) : null}
              <DataRow
                label={dict.recycling.detail.financingRow}
                value={<Currency value={contract.amount} />}
              />
            </DataRows>
          </CardContent>
        </Card>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">{d.profitNotes}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-7">{contract.profitNotes}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">{d.recycling.title}</CardTitle>
            <p className="text-xs text-muted-foreground leading-5">{d.recycling.note}</p>
          </CardHeader>
          <CardContent>
            <DataRows>
              <DataRow
                label={d.recycling.status}
                value={
                  <StatusPill tone={contract.capitalRecyclingEnabled ? "success" : "default"}>
                    {contract.capitalRecyclingEnabled ? d.recycling.enabled : d.recycling.disabled}
                  </StatusPill>
                }
              />
              {contract.capitalRecyclingEnabled ? (
                <DataRow
                  label={d.recycling.thresholdLabel}
                  value={
                    contract.capitalRecyclingMinThreshold ? (
                      <Currency value={contract.capitalRecyclingMinThreshold} />
                    ) : (
                      <span className="text-muted-foreground">{d.recycling.noThreshold}</span>
                    )
                  }
                />
              ) : null}
            </DataRows>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">{d.linkedInstallments}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{d.linkedInstallmentsEmpty}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">{d.timeline}</CardTitle>
        </CardHeader>
        <CardContent>
          <Timeline
            items={[...contract.timeline].reverse().map((a) => ({
              ts: formatDate(a.ts, locale),
              text: a.text,
            }))}
          />
        </CardContent>
      </Card>
    </div>
  );
}

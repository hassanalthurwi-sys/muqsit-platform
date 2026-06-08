"use client";

import { use, useMemo, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Currency } from "@/components/ui/currency";
import { StatusPill } from "@/components/ui/status-pill";
import { DataRow, DataRows } from "@/components/ui/data-row";
import { InstallmentStatusPill } from "@/components/ui/installment-status-pill";
import { PartialPaymentSheet } from "@/components/ui/partial-payment-sheet";
import { Button } from "@/components/ui/button";
import { Timeline } from "@/components/ui/timeline";
import { useStore } from "@/lib/mock/store";
import { useI18n } from "@/components/providers/i18n-provider";
import { formatDate } from "@/lib/format";
import type { Installment, PaymentMethod, PaymentSource, ReceiptVoucher } from "@/lib/mock/types";

function paymentSourceToMethod(source: PaymentSource): PaymentMethod {
  if (source === "cash") return "cash";
  return "bankTransfer";
}

function nextReceiptNumber(receipts: ReceiptVoucher[]): string {
  const max = receipts
    .map((r) => parseInt(r.number.split("-").at(-1) ?? "0", 10))
    .reduce((m, n) => (n > m ? n : m), 0);
  return `RC-2025-${String(max + 1).padStart(3, "0")}`;
}

export default function InstallmentContractDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { dict, locale } = useI18n();
  const {
    installmentContracts,
    customers,
    investmentContracts,
    receipts,
    addReceipt,
    profitDistributions,
    getEffectivePolicyFor,
  } = useStore();
  const [activeInstallment, setActiveInstallment] = useState<Installment | null>(null);
  const [open, setOpen] = useState(false);
  // Local overlay of payments captured this session (prototype: not pushed to store)
  const [paymentOverlay, setPaymentOverlay] = useState<Record<string, { paid: number }>>({});

  const contract = useMemo(
    () => installmentContracts.find((c) => c.id === id),
    [installmentContracts, id],
  );

  if (!contract) {
    return (
      <div className="rounded-xl border bg-card p-8 text-center text-muted-foreground">
        العقد غير موجود.
      </div>
    );
  }

  const customer = customers.find((c) => c.id === contract.customerId);
  const fundingContract = investmentContracts.find((c) => c.id === contract.investmentContractId);
  const d = dict.installmentContracts.details;
  const s = dict.installmentContracts.schedule;

  const handlePay = (payment: {
    amount: number;
    source: PaymentSource;
    note?: string;
    receiptName?: string;
  }) => {
    if (!activeInstallment) return;
    setPaymentOverlay((prev) => {
      const prevPaid = prev[activeInstallment.id]?.paid ?? activeInstallment.paidAmount;
      return {
        ...prev,
        [activeInstallment.id]: { paid: Math.min(prevPaid + payment.amount, activeInstallment.amount) },
      };
    });
    // Auto-generate a receipt voucher for the customer installment payment.
    // The voucher carries: number, date, amount, customer, installment
    // contract, installment number. This is the primary receipt-to-contract
    // relationship in the system.
    const today = new Date().toISOString().slice(0, 10);
    const receipt: ReceiptVoucher = {
      id: `rc-auto-${Date.now()}`,
      number: nextReceiptNumber(receipts),
      date: today,
      amount: payment.amount,
      method: paymentSourceToMethod(payment.source),
      partyType: "customer",
      fromName: payment.receiptName ?? customer?.name ?? contract.customerId,
      customerId: contract.customerId,
      contractId: contract.id,
      installmentId: activeInstallment.id,
      installmentIndex: activeInstallment.index,
      notes: `قسط ${activeInstallment.index} من ${contract.schedule.length} — ${contract.number}${
        payment.note ? ` · ${payment.note}` : ""
      }`,
      createdById: "emp-collections-1",
      createdAt: new Date().toISOString(),
      status: "verified",
      verifiedById: "emp-collections-1",
      verifiedAt: new Date().toISOString(),
      attachmentCount: 0,
    };
    addReceipt(receipt);
  };

  // Effective schedule with the session overlay applied
  const effectiveSchedule = contract.schedule.map((row) => {
    const overlay = paymentOverlay[row.id];
    if (!overlay) return row;
    const paid = overlay.paid;
    let status: typeof row.status = row.status;
    if (paid >= row.amount) status = "paid";
    else if (paid > 0) status = "partiallyPaid";
    return { ...row, paidAmount: paid, status };
  });

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-2">
          <Link href="/contracts" className="text-xs text-muted-foreground hover:text-foreground">
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
                  : contract.status === "defaulted"
                    ? "danger"
                    : contract.status === "completed"
                      ? "primary"
                      : "default"
              }
            >
              {dict.installmentContractStatus[contract.status]}
            </StatusPill>
          </div>
          <p className="text-sm text-muted-foreground">
            {d.product}: <span className="font-medium text-foreground">{contract.productType}</span>
          </p>
          {customer ? (
            <p className="text-sm text-muted-foreground">
              {d.customer}:{" "}
              <Link href={`/customers/${customer.id}`} className="text-primary hover:underline">
                {customer.name}
              </Link>
              {" · "}
              {d.fundedBy}:{" "}
              {fundingContract ? (
                <Link
                  href={`/investments/${fundingContract.id}`}
                  className="text-primary hover:underline"
                >
                  {fundingContract.number}
                </Link>
              ) : (
                "—"
              )}
            </p>
          ) : null}
        </div>
      </header>

      {/* Pricing + funding */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">{d.pricingSection}</CardTitle>
          </CardHeader>
          <CardContent>
            <DataRows>
              <DataRow label={d.cashPrice} value={<Currency value={contract.cashPrice} />} />
              <DataRow label={d.installmentPrice} value={<Currency value={contract.installmentPrice} />} />
              <DataRow label={d.downPayment} value={<Currency value={contract.downPayment} />} />
              <DataRow label={d.financingAmount} value={<Currency value={contract.financingAmount} />} />
              <DataRow label={d.monthlyInstallment} value={<Currency value={contract.monthlyInstallment} />} />
              <DataRow
                label={d.profitMargin}
                value={
                  <span>
                    <Currency value={contract.profitMargin} />
                    <span className="text-muted-foreground"> · {Math.round(contract.profitMarginPct * 100)}%</span>
                  </span>
                }
              />
              <DataRow label={d.remainingBalance} value={<Currency value={contract.remainingBalance} />} />
              <DataRow
                label={d.duration}
                value={
                  <span>
                    {contract.installmentsCount} {d.months} ({formatDate(contract.startDate, locale)} →{" "}
                    {formatDate(contract.endDate, locale)})
                  </span>
                }
              />
            </DataRows>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">{d.fundingSection}</CardTitle>
          </CardHeader>
          <CardContent>
            <DataRows>
              <DataRow
                label={d.fromInvestment}
                value={
                  fundingContract ? (
                    <Link
                      href={`/investments/${fundingContract.id}`}
                      className="num text-primary hover:underline"
                    >
                      {fundingContract.number}
                    </Link>
                  ) : (
                    "—"
                  )
                }
              />
              {fundingContract ? (
                <DataRow
                  label={d.investor}
                  value={
                    <Link
                      href={`/investors/${fundingContract.investorId}`}
                      className="hover:underline"
                    >
                      {/* investor name shown elsewhere; show id for brevity here */}
                      {fundingContract.investorId.replace("inv-ext-", "Investor #").replace("inv-internal-", "Internal #")}
                    </Link>
                  }
                />
              ) : null}
              <DataRow label={d.capitalUtilized} value={<Currency value={contract.capitalUtilized} />} />
            </DataRows>
          </CardContent>
        </Card>
      </div>

      {/* Sprint 11 — توزيع التحصيلات */}
      {fundingContract ? (() => {
        const installmentProfit = Math.max(0, contract.installmentPrice - contract.cashPrice);
        const totalParent = fundingContract.officeExpectedProfit + fundingContract.investorExpectedProfit;
        const officeRatio = totalParent > 0 ? fundingContract.officeExpectedProfit / totalParent : 0;
        const officeExpected = installmentProfit * officeRatio;
        const investorExpected = contract.cashPrice + installmentProfit * (1 - officeRatio);
        // Live counters from this contract's events
        const liveEvents = profitDistributions.filter((e) => e.installmentContractId === contract.id);
        const officeRec = contract.officeRecoveredSoFar +
          liveEvents.reduce((s, e) => s + e.officeShare, 0);
        const investorRec = contract.investorRecoveredSoFar +
          liveEvents.reduce((s, e) => s + e.investorShare, 0);
        const pol = getEffectivePolicyFor(fundingContract.investorId);
        const policyLabel =
          pol.policy === "officeFirst" ? dict.profitPolicy.officeFirst :
          pol.policy === "investorFirst" ? dict.profitPolicy.investorFirst :
          dict.profitPolicy.proportional;
        const sourceLabel = pol.source === "officeDefault"
          ? dict.profitPolicy.fromOfficeDefault
          : dict.profitPolicy.fromInvestorOverride;
        const officePct = officeExpected > 0 ? Math.min(100, Math.round((officeRec / officeExpected) * 100)) : 0;
        const investorPct = investorExpected > 0 ? Math.min(100, Math.round((investorRec / investorExpected) * 100)) : 0;
        return (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">{dict.profitPolicy.recoveryTitle}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-primary-soft px-2.5 py-1 text-xs font-medium text-primary-soft-foreground">
                  {policyLabel}
                </span>
                <span className="text-xs text-muted-foreground">{sourceLabel}</span>
              </div>
              <div className="space-y-3">
                <div>
                  <div className="mb-1 flex items-baseline justify-between">
                    <span className="text-sm font-medium">{dict.profitPolicy.officeRecovery}</span>
                    <span className="num text-xs text-muted-foreground">
                      <Currency value={officeRec} /> / <Currency value={officeExpected} />
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                    <div className="h-full bg-primary" style={{ width: `${officePct}%` }} />
                  </div>
                </div>
                <div>
                  <div className="mb-1 flex items-baseline justify-between">
                    <span className="text-sm font-medium">{dict.profitPolicy.investorRecovery}</span>
                    <span className="num text-xs text-muted-foreground">
                      <Currency value={investorRec} /> / <Currency value={investorExpected} />
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                    <div className="h-full bg-success" style={{ width: `${investorPct}%` }} />
                  </div>
                </div>
              </div>
              {liveEvents.length > 0 ? (
                <div className="rounded-lg bg-muted/30 p-3 text-xs text-muted-foreground">
                  {dict.profitPolicy.eventsHint.replace("{n}", String(liveEvents.length))}
                </div>
              ) : null}
            </CardContent>
          </Card>
        );
      })() : null}

      {/* Schedule */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">
            {d.scheduleSection}{" "}
            <span className="text-xs font-normal text-muted-foreground">
              ({d.scheduleMonthsHint.replace("{n}", String(contract.installmentsCount))})
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="px-0 pb-2 pt-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-[11px] uppercase text-muted-foreground">
                  <th className="px-6 py-2 text-start font-medium">{s.number}</th>
                  <th className="px-6 py-2 text-start font-medium">{s.dueDate}</th>
                  <th className="px-6 py-2 text-start font-medium">{s.amount}</th>
                  <th className="px-6 py-2 text-start font-medium">{s.paid}</th>
                  <th className="px-6 py-2 text-start font-medium">{s.remaining}</th>
                  <th className="px-6 py-2 text-start font-medium">{s.status}</th>
                  <th className="px-6 py-2 text-end font-medium"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {effectiveSchedule.map((row) => {
                  const remaining = row.amount - row.paidAmount;
                  const showPay = row.status !== "paid";
                  return (
                    <tr key={row.id} className="hover:bg-muted/30">
                      <td className="num px-6 py-2.5 font-medium">{row.index}</td>
                      <td className="num px-6 py-2.5 text-muted-foreground">
                        {formatDate(row.dueDate, locale)}
                      </td>
                      <td className="num px-6 py-2.5">
                        <Currency value={row.amount} />
                      </td>
                      <td className="num px-6 py-2.5">
                        <Currency value={row.paidAmount} />
                      </td>
                      <td className="num px-6 py-2.5">
                        <Currency value={remaining} />
                      </td>
                      <td className="px-6 py-2.5">
                        <InstallmentStatusPill status={row.status} />
                      </td>
                      <td className="px-6 py-2.5 text-end">
                        {showPay ? (
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setActiveInstallment(row);
                              setOpen(true);
                            }}
                          >
                            {s.pay}
                          </Button>
                        ) : null}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
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

      <PartialPaymentSheet
        open={open}
        onOpenChange={setOpen}
        installment={activeInstallment}
        contractNumber={contract.number}
        onSubmit={handlePay}
      />
    </div>
  );
}

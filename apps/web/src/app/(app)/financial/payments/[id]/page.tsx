"use client";

import { use, useMemo } from "react";
import Link from "next/link";
import { Paperclip, Printer, Share2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Currency } from "@/components/ui/currency";
import { DataRow, DataRows } from "@/components/ui/data-row";
import { StatusPill } from "@/components/ui/status-pill";
import {
  PaymentMethodChip,
  VoucherStatusPill,
} from "@/components/ui/voucher-pills";
import { useStore } from "@/lib/mock/store";
import { useI18n } from "@/components/providers/i18n-provider";
import { formatDate } from "@/lib/format";

export default function PaymentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { dict, locale } = useI18n();
  const {
    payments,
    employees,
    investmentContracts,
    installmentContracts,
    purchases,
  } = useStore();
  const d = dict.paymentVouchers.detail;
  const payment = useMemo(() => payments.find((p) => p.id === id), [payments, id]);

  if (!payment) {
    return (
      <div className="rounded-xl border bg-card p-8 text-center text-muted-foreground">
        السند غير موجود.
      </div>
    );
  }

  const creator = employees.find((e) => e.id === payment.createdById);
  const investmentContract = payment.investmentContractId
    ? investmentContracts.find((c) => c.id === payment.investmentContractId)
    : null;
  const installmentContract = payment.contractId
    ? installmentContracts.find((c) => c.id === payment.contractId)
    : null;
  const purchase = payment.purchaseId
    ? purchases.find((p) => p.id === payment.purchaseId)
    : null;

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-2">
          <Link
            href="/financial/payments"
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            {d.back}
          </Link>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="num text-2xl font-semibold tracking-tight sm:text-3xl">
              {payment.number}
            </h1>
            <VoucherStatusPill status={payment.status} />
            {payment.needsApproval ? (
              <StatusPill tone="warning">{dict.paymentVouchers.needsApprovalBadge}</StatusPill>
            ) : null}
          </div>
          <p className="text-sm text-muted-foreground">
            {dict.paymentCategory[payment.category]} · {payment.beneficiaryName}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" className="gap-1.5">
            <Printer className="size-4" />
            {d.printVoucher}
          </Button>
          <Button variant="outline" size="sm" className="gap-1.5">
            <Share2 className="size-4" />
            {d.share}
          </Button>
        </div>
      </header>

      {payment.needsApproval ? (
        <Card className="border-warning-soft">
          <CardContent className="flex items-start gap-3 p-4 text-sm">
            <p className="font-medium text-warning-foreground">{d.pendingApproval}</p>
          </CardContent>
        </Card>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">{d.voucherInfo}</CardTitle>
          </CardHeader>
          <CardContent>
            <DataRows>
              <DataRow
                label={dict.paymentVouchers.columns.date}
                value={<span className="num">{formatDate(payment.date, locale)}</span>}
              />
              <DataRow
                label={dict.paymentVouchers.columns.amount}
                value={
                  <span className="num text-base font-semibold text-danger-foreground">
                    <Currency value={payment.amount} />
                  </span>
                }
              />
              <DataRow
                label={dict.paymentVouchers.columns.category}
                value={dict.paymentCategory[payment.category]}
              />
              <DataRow
                label={dict.paymentVouchers.columns.method}
                value={<PaymentMethodChip method={payment.method} />}
              />
              {payment.reference ? (
                <DataRow
                  label={d.reference}
                  value={<span className="num" dir="ltr">{payment.reference}</span>}
                />
              ) : null}
            </DataRows>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">{d.beneficiary}</CardTitle>
          </CardHeader>
          <CardContent>
            <DataRows>
              <DataRow label={d.beneficiary} value={payment.beneficiaryName} />
              {investmentContract ? (
                <DataRow
                  label={d.linkedTo}
                  value={
                    <Link
                      href={`/investments/${investmentContract.id}`}
                      className="num text-primary hover:underline"
                    >
                      {investmentContract.number}
                    </Link>
                  }
                />
              ) : null}
              {installmentContract ? (
                <DataRow
                  label={d.linkedTo}
                  value={
                    <Link
                      href={`/contracts/${installmentContract.id}`}
                      className="num text-primary hover:underline"
                    >
                      {installmentContract.number}
                    </Link>
                  }
                />
              ) : null}
              {purchase ? (
                <DataRow
                  label={d.linkedTo}
                  value={
                    <Link
                      href={`/financial/purchases`}
                      className="num text-primary hover:underline"
                    >
                      {purchase.number} — {purchase.description.slice(0, 40)}
                    </Link>
                  }
                />
              ) : null}
            </DataRows>
          </CardContent>
        </Card>
      </div>

      {payment.notes ? (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">{d.notes}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-7">{payment.notes}</p>
          </CardContent>
        </Card>
      ) : null}

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">{d.attachments}</CardTitle>
        </CardHeader>
        <CardContent>
          {payment.attachmentCount > 0 ? (
            <div className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm">
              <Paperclip className="size-4 text-muted-foreground" />
              <span className="num">{payment.attachmentCount}</span>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">—</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex flex-wrap items-center justify-between gap-3 p-4 text-sm">
          <span className="text-muted-foreground">
            {d.createdBy}: <span className="font-medium text-foreground">{creator?.name ?? "—"}</span>
          </span>
        </CardContent>
      </Card>
    </div>
  );
}

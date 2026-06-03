"use client";

import { use, useMemo } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  CheckCircle2,
  Paperclip,
  Printer,
  Share2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Currency } from "@/components/ui/currency";
import { DataRow, DataRows } from "@/components/ui/data-row";
import {
  PaymentMethodChip,
  VoucherStatusPill,
} from "@/components/ui/voucher-pills";
import { useStore } from "@/lib/mock/store";
import { useI18n } from "@/components/providers/i18n-provider";
import { formatDate } from "@/lib/format";

export default function ReceiptDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { dict, locale } = useI18n();
  const { receipts, employees, customers, investmentContracts, installmentContracts } =
    useStore();
  const r = dict.receipts.detail;
  const receipt = useMemo(() => receipts.find((rc) => rc.id === id), [receipts, id]);

  if (!receipt) {
    return (
      <div className="rounded-xl border bg-card p-8 text-center text-muted-foreground">
        السند غير موجود.
      </div>
    );
  }

  const creator = employees.find((e) => e.id === receipt.createdById);
  const verifier = receipt.verifiedById
    ? employees.find((e) => e.id === receipt.verifiedById)
    : null;
  const customer = receipt.customerId
    ? customers.find((c) => c.id === receipt.customerId)
    : null;
  const investmentContract = receipt.investmentContractId
    ? investmentContracts.find((c) => c.id === receipt.investmentContractId)
    : null;
  const installmentContract = receipt.contractId
    ? installmentContracts.find((c) => c.id === receipt.contractId)
    : null;

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-2">
          <Link
            href="/financial/receipts"
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            {r.back}
          </Link>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="num text-2xl font-semibold tracking-tight sm:text-3xl">
              {receipt.number}
            </h1>
            <VoucherStatusPill status={receipt.status} />
          </div>
          <p className="text-sm text-muted-foreground">
            {dict.receiptSource[receipt.source]} · {receipt.fromName}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" className="gap-1.5">
            <Printer className="size-4" />
            {r.printVoucher}
          </Button>
          <Button variant="outline" size="sm" className="gap-1.5">
            <Share2 className="size-4" />
            {r.share}
          </Button>
        </div>
      </header>

      {receipt.flags?.includes("duplicateReference") ? (
        <Card className="border-warning-soft">
          <CardContent className="flex items-start gap-3 p-4 text-sm">
            <AlertTriangle className="size-5 shrink-0 text-warning" />
            <div>
              <p className="font-semibold text-warning-foreground">
                {dict.duplicate.suspectedReference}
              </p>
              <p className="text-xs text-muted-foreground">
                {dict.duplicate.suspectedRefDetail}
              </p>
            </div>
          </CardContent>
        </Card>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">{r.voucherInfo}</CardTitle>
          </CardHeader>
          <CardContent>
            <DataRows>
              <DataRow
                label={dict.receipts.columns.date}
                value={<span className="num">{formatDate(receipt.date, locale)}</span>}
              />
              <DataRow
                label={dict.receipts.columns.amount}
                value={
                  <span className="num text-base font-semibold text-success-foreground">
                    <Currency value={receipt.amount} />
                  </span>
                }
              />
              <DataRow
                label={dict.receipts.columns.method}
                value={<PaymentMethodChip method={receipt.method} />}
              />
              {receipt.reference ? (
                <DataRow
                  label={r.reference}
                  value={<span className="num" dir="ltr">{receipt.reference}</span>}
                />
              ) : null}
            </DataRows>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">{r.payer}</CardTitle>
          </CardHeader>
          <CardContent>
            <DataRows>
              <DataRow label={dict.receipts.columns.source} value={dict.receiptSource[receipt.source]} />
              <DataRow label={dict.receipts.columns.from} value={receipt.fromName} />
              {customer ? (
                <DataRow
                  label={dict.customers.pageTitle}
                  value={
                    <Link
                      href={`/customers/${customer.id}`}
                      className="text-primary hover:underline"
                    >
                      {customer.name}
                    </Link>
                  }
                />
              ) : null}
              {installmentContract ? (
                <DataRow
                  label={r.linkedContract}
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
              {investmentContract ? (
                <DataRow
                  label={r.linkedInvestmentContract}
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
            </DataRows>
          </CardContent>
        </Card>
      </div>

      {receipt.notes ? (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">{r.notes}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-7">{receipt.notes}</p>
          </CardContent>
        </Card>
      ) : null}

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">{r.attachments}</CardTitle>
        </CardHeader>
        <CardContent>
          {receipt.attachmentCount > 0 ? (
            <div className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm">
              <Paperclip className="size-4 text-muted-foreground" />
              <span className="num">
                {r.attachmentsCount.replace("{n}", String(receipt.attachmentCount))}
              </span>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">—</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex flex-wrap items-center justify-between gap-3 p-4 text-sm">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-1">
            <span className="text-muted-foreground">
              {r.createdBy}: <span className="font-medium text-foreground">{creator?.name ?? "—"}</span>
            </span>
            {verifier ? (
              <span className="text-muted-foreground">
                {r.verifiedBy}: <span className="font-medium text-foreground">{verifier.name}</span>
              </span>
            ) : null}
          </div>
          {receipt.status !== "verified" ? (
            <Button size="sm" className="gap-1.5">
              <CheckCircle2 className="size-4" />
              {r.markVerified}
            </Button>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}

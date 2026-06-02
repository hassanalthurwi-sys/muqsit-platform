"use client";

import { use, useMemo, useState } from "react";
import Link from "next/link";
import { CheckCircle2, FileQuestion, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StatusPill } from "@/components/ui/status-pill";
import { DuplicateWarningBanner } from "@/components/ui/duplicate-warning-banner";
import { ComparisonRow } from "@/components/ui/comparison-row";
import { Currency } from "@/components/ui/currency";
import { useStore } from "@/lib/mock/store";
import { useI18n } from "@/components/providers/i18n-provider";
import { formatDate } from "@/lib/format";
import type { ProofStatus } from "@/lib/mock/types";

export default function CollectionReviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { dict, locale } = useI18n();
  const { paymentProofs, customers, installmentContracts, decideProof } = useStore();
  const proof = paymentProofs.find((p) => p.id === id);

  const [note, setNote] = useState("");
  const [decisionPanel, setDecisionPanel] = useState<ProofStatus | null>(
    proof?.status && proof.status !== "pending" ? proof.status : null,
  );

  const r = dict.collections.review;

  const customer = useMemo(() => customers.find((c) => c.id === proof?.customerId), [customers, proof]);
  const contract = useMemo(
    () => installmentContracts.find((c) => c.id === proof?.contractId),
    [installmentContracts, proof],
  );
  const installment = useMemo(
    () => contract?.schedule.find((s) => s.id === proof?.installmentId),
    [contract, proof],
  );

  if (!proof) {
    return (
      <div className="rounded-xl border bg-card p-8 text-center text-muted-foreground">
        الإيصال غير موجود.
      </div>
    );
  }

  const dueAmount = installment?.amount ?? 0;
  const ocrAmount = proof.ocr.transferAmount ?? 0;
  const amountMatch = Math.abs(ocrAmount - dueAmount) <= 0.5;
  const customerMatch =
    customer && proof.ocr.senderName ? proof.ocr.senderName.includes(customer.name.split(" ")[0]) : false;

  const transferTime = proof.ocr.transferDate ? new Date(proof.ocr.transferDate).getTime() : 0;
  const dueTime = installment?.dueDate ? new Date(installment.dueDate).getTime() : 0;
  const timingLabel = (() => {
    if (!transferTime || !dueTime) return r.mismatch;
    if (transferTime < dueTime) return r.paidEarly;
    if (transferTime === dueTime) return r.paidOnTime;
    return r.paidLate;
  })();
  const timingOk = transferTime > 0 && dueTime > 0 && transferTime <= dueTime;

  const decide = (status: ProofStatus) => {
    decideProof(proof.id, {
      status,
      decisionBy: "موظف المراجعة",
      decisionAt: new Date().toISOString(),
      decisionReason: note || undefined,
    });
    setDecisionPanel(status);
  };

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-2">
          <Link href="/collections" className="text-xs text-muted-foreground hover:text-foreground">
            {r.back}
          </Link>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{r.headerTitle}</h1>
          <p className="text-sm text-muted-foreground">
            {customer?.name} · {r.forInstallment
              .replace("{n}", String(installment?.index ?? "—"))
              .replace("{contract}", contract?.number ?? "—")}
          </p>
        </div>
        <StatusPill
          tone={
            decisionPanel === "approved"
              ? "success"
              : decisionPanel === "rejected"
                ? "danger"
                : decisionPanel === "needsClarification"
                  ? "warning"
                  : "warning"
          }
        >
          {dict.proofStatus[decisionPanel ?? proof.status]}
        </StatusPill>
      </header>

      {proof.duplicateOf ? <DuplicateWarningBanner earlierProofId={proof.duplicateOf} /> : null}

      <div className="grid gap-4 lg:grid-cols-[2fr_3fr]">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">{r.receiptImageSection}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative w-full overflow-hidden rounded-lg border border-border bg-muted">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={proof.receiptImageUrl}
                alt="receipt"
                className="h-auto w-full object-contain"
              />
            </div>
            <p className="num mt-2 text-xs text-muted-foreground" dir="ltr">
              {proof.fileName}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex flex-wrap items-baseline justify-between gap-2 text-base font-semibold">
              <span>{r.ocrSection}</span>
              <span className="num text-xs font-medium text-primary">
                {r.ocrConfidence} {(proof.ocr.confidence * 100).toFixed(0)}%
              </span>
            </CardTitle>
            <p className="text-xs text-muted-foreground">{r.ocrSubtitle}</p>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label className="text-xs">{r.ocrFields.transferAmount}</Label>
              <Input defaultValue={String(proof.ocr.transferAmount ?? "")} className="num" dir="ltr" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">{r.ocrFields.senderName}</Label>
              <Input defaultValue={proof.ocr.senderName ?? ""} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">{r.ocrFields.transferDate}</Label>
              <Input defaultValue={proof.ocr.transferDate ?? ""} type="date" className="num" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">{r.ocrFields.transferReference}</Label>
              <Input defaultValue={proof.ocr.transferReference ?? ""} className="num" dir="ltr" />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label className="text-xs">{r.ocrFields.bankName}</Label>
              <Input defaultValue={proof.ocr.bankName ?? ""} />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">{r.comparisonSection}</CardTitle>
        </CardHeader>
        <CardContent className="divide-y divide-border">
          <ComparisonRow
            label={r.expectedAmount}
            expected={<Currency value={dueAmount} />}
            actual={<Currency value={ocrAmount} />}
            match={amountMatch}
            note={amountMatch ? undefined : r.mismatch}
          />
          <ComparisonRow
            label={r.customer}
            expected={customer?.name ?? "—"}
            actual={proof.ocr.senderName ?? "—"}
            match={Boolean(customerMatch)}
          />
          <ComparisonRow
            label={r.dueDate}
            expected={installment?.dueDate ? formatDate(installment.dueDate, locale) : "—"}
            actual={proof.ocr.transferDate ? formatDate(proof.ocr.transferDate, locale) : "—"}
            match={timingOk}
            note={timingLabel}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">{r.employeeNotes}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder={r.employeeNotesPlaceholder}
            rows={3}
            className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          />
          {decisionPanel ? (
            <div className="rounded-lg border border-primary-soft bg-primary-soft/50 px-3 py-2 text-xs text-primary-soft-foreground">
              {r.decisionRecorded} · {dict.proofStatus[decisionPanel]}
            </div>
          ) : null}
          <div className="flex flex-wrap gap-2">
            <Button type="button" onClick={() => decide("approved")} className="gap-1.5">
              <CheckCircle2 className="size-4" />
              {r.approve}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => decide("rejected")}
              className="gap-1.5"
            >
              <XCircle className="size-4" />
              {r.reject}
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => decide("needsClarification")}
              className="gap-1.5"
            >
              <FileQuestion className="size-4" />
              {r.requestClarification}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

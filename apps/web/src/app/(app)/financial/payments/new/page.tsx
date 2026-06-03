"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { Paperclip } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/mock/store";
import { useI18n } from "@/components/providers/i18n-provider";
import type {
  PaymentCategory,
  PaymentMethod,
  PaymentVoucher,
} from "@/lib/mock/types";
import { cn } from "@/lib/utils";

const AUTO_APPROVAL_LIMIT = 10_000;

const CATEGORIES: PaymentCategory[] = [
  "goodsPurchase",
  "investorProfit",
  "salary",
  "rent",
  "officeExpense",
  "adminExpense",
  "other",
];
const METHODS: PaymentMethod[] = ["bankTransfer", "cash", "stcPay", "cheque", "card"];

function nextPaymentNumber(payments: PaymentVoucher[]): string {
  const max = payments
    .map((p) => parseInt(p.number.split("-").at(-1) ?? "0", 10))
    .reduce((m, n) => (n > m ? n : m), 0);
  return `PV-2025-${String(max + 1).padStart(3, "0")}`;
}

export default function NewPaymentPage() {
  const router = useRouter();
  const { dict } = useI18n();
  const { payments, addPayment } = useStore();
  const f = dict.paymentVouchers.form;

  const [category, setCategory] = useState<PaymentCategory>("officeExpense");
  const [method, setMethod] = useState<PaymentMethod>("bankTransfer");
  const [beneficiary, setBeneficiary] = useState("");
  const [amount, setAmount] = useState("");
  const [reference, setReference] = useState("");
  const [notes, setNotes] = useState("");

  const numericAmount = parseFloat(amount) || 0;
  const willNeedApproval = numericAmount > AUTO_APPROVAL_LIMIT;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!beneficiary || numericAmount <= 0) return;
    const voucher: PaymentVoucher = {
      id: `pv-u-${Date.now()}`,
      number: nextPaymentNumber(payments),
      date: new Date("2025-05-31").toISOString().slice(0, 10),
      category,
      amount: numericAmount,
      method,
      beneficiaryName: beneficiary,
      reference: reference || undefined,
      notes: notes || undefined,
      createdById: "emp-manager-1",
      createdAt: new Date().toISOString(),
      status: willNeedApproval ? "draft" : "verified",
      needsApproval: willNeedApproval,
      approvalId: willNeedApproval ? `apr-pv-u-${Date.now()}` : undefined,
      attachmentCount: 0,
    };
    addPayment(voucher);
    router.push(`/financial/payments/${voucher.id}`);
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-6">
      <header className="space-y-1">
        <Link
          href="/financial/payments"
          className="text-xs text-muted-foreground hover:text-foreground"
        >
          {dict.paymentVouchers.detail.back}
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          {dict.paymentVouchers.newPayment}
        </h1>
      </header>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">{f.categoryLabel}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {CATEGORIES.map((c) => {
              const active = category === c;
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCategory(c)}
                  className={cn(
                    "rounded-lg border px-3 py-2.5 text-start text-sm transition-colors",
                    active
                      ? "border-primary bg-primary-soft text-primary-soft-foreground"
                      : "border-input hover:bg-muted",
                  )}
                >
                  {dict.paymentCategory[c]}
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardContent className="space-y-4 p-5">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">
                {f.beneficiaryName}
              </label>
              <input
                value={beneficiary}
                onChange={(e) => setBeneficiary(e.target.value)}
                placeholder={f.beneficiaryPlaceholder}
                required
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">{f.amount}</label>
              <input
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                type="number"
                step="1"
                min="1"
                required
                className="num flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">
                {f.methodLabel}
              </label>
              <div className="flex flex-wrap gap-1.5">
                {METHODS.map((m) => {
                  const active = method === m;
                  return (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setMethod(m)}
                      className={cn(
                        "rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
                        active
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground hover:bg-muted/70",
                      )}
                    >
                      {dict.paymentMethod[m]}
                    </button>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-4 p-5">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">{f.reference}</label>
              <input
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                className="num flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">{f.notes}</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </div>
            <div className="rounded-lg border border-dashed border-border px-3 py-2.5 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <Paperclip className="size-4" />
                <span>{f.attachments}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {willNeedApproval ? (
        <div className="rounded-xl border border-warning-soft bg-warning-soft/40 px-4 py-3 text-sm text-warning-foreground">
          {f.autoApprovalNote}
        </div>
      ) : null}

      <div className="flex flex-wrap items-center justify-end gap-2 rounded-xl border bg-card p-4 shadow-[var(--shadow-card)]">
        <Button variant="ghost" type="button" onClick={() => router.back()}>
          {f.cancel}
        </Button>
        <Button type="submit">{f.submit}</Button>
      </div>
    </form>
  );
}

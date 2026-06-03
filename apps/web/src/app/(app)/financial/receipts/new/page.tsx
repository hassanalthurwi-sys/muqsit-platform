"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Paperclip } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/mock/store";
import { useI18n } from "@/components/providers/i18n-provider";
import type {
  PaymentMethod,
  ReceiptSource,
  ReceiptVoucher,
} from "@/lib/mock/types";
import { cn } from "@/lib/utils";

const SOURCES: ReceiptSource[] = [
  "customerInstallment",
  "investorDeposit",
  "officeIncome",
  "other",
];
const METHODS: PaymentMethod[] = ["bankTransfer", "cash", "stcPay", "cheque", "card"];

function nextReceiptNumber(receipts: ReceiptVoucher[]): string {
  const max = receipts
    .map((r) => parseInt(r.number.split("-").at(-1) ?? "0", 10))
    .reduce((m, n) => (n > m ? n : m), 0);
  return `RC-2025-${String(max + 1).padStart(3, "0")}`;
}

export default function NewReceiptPage() {
  const router = useRouter();
  const { dict } = useI18n();
  const { receipts, addReceipt, customers, installmentContracts, investmentContracts } =
    useStore();
  const f = dict.receipts.form;
  const c = dict.receipts.columns;

  const [source, setSource] = useState<ReceiptSource>("customerInstallment");
  const [method, setMethod] = useState<PaymentMethod>("bankTransfer");
  const [payerName, setPayerName] = useState("");
  const [amount, setAmount] = useState("");
  const [reference, setReference] = useState("");
  const [contractId, setContractId] = useState("");
  const [notes, setNotes] = useState("");

  const linkedOptions = useMemo(() => {
    if (source === "customerInstallment") {
      return installmentContracts.map((co) => ({
        id: co.id,
        label: `${co.number} · ${customers.find((cu) => cu.id === co.customerId)?.name ?? ""}`,
      }));
    }
    if (source === "investorDeposit") {
      return investmentContracts.map((c) => ({ id: c.id, label: c.number }));
    }
    return [];
  }, [source, customers, installmentContracts, investmentContracts]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const numericAmount = parseFloat(amount);
    if (!payerName || !numericAmount || numericAmount <= 0) return;
    const receipt: ReceiptVoucher = {
      id: `rc-u-${Date.now()}`,
      number: nextReceiptNumber(receipts),
      date: new Date("2025-05-31").toISOString().slice(0, 10),
      amount: numericAmount,
      method,
      source,
      fromName: payerName,
      customerId:
        source === "customerInstallment"
          ? installmentContracts.find((c) => c.id === contractId)?.customerId
          : undefined,
      contractId: source === "customerInstallment" ? contractId || undefined : undefined,
      investmentContractId:
        source === "investorDeposit" ? contractId || undefined : undefined,
      reference: reference || undefined,
      notes: notes || undefined,
      createdById: "emp-manager-1",
      createdAt: new Date().toISOString(),
      status: "verified",
      verifiedById: "emp-manager-1",
      verifiedAt: new Date().toISOString(),
      attachmentCount: 0,
    };
    addReceipt(receipt);
    router.push(`/financial/receipts/${receipt.id}`);
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-6">
      <header className="space-y-1">
        <Link
          href="/financial/receipts"
          className="text-xs text-muted-foreground hover:text-foreground"
        >
          {dict.receipts.detail.back}
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          {dict.receipts.newReceipt}
        </h1>
      </header>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">{f.sourceLabel}</CardTitle>
          <p className="text-xs text-muted-foreground">{f.sourcePickerHint}</p>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {SOURCES.map((s) => {
              const active = source === s;
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSource(s)}
                  className={cn(
                    "rounded-lg border px-3 py-2.5 text-start text-sm transition-colors",
                    active
                      ? "border-primary bg-primary-soft text-primary-soft-foreground"
                      : "border-input hover:bg-muted",
                  )}
                >
                  {dict.receiptSource[s]}
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
                {f.payerName}
              </label>
              <input
                value={payerName}
                onChange={(e) => setPayerName(e.target.value)}
                placeholder={f.payerNamePlaceholder}
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
                placeholder={f.referencePlaceholder}
                className="num flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
              />
            </div>
            {linkedOptions.length > 0 ? (
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">
                  {f.linkToContract}
                </label>
                <select
                  value={contractId}
                  onChange={(e) => setContractId(e.target.value)}
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
                >
                  <option value="">{f.linkToContractPlaceholder}</option>
                  {linkedOptions.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            ) : null}
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
                <span>
                  {f.attachments} <span className="text-muted-foreground">{f.attachmentsHint}</span>
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-wrap items-center justify-end gap-2 rounded-xl border bg-card p-4 shadow-[var(--shadow-card)]">
        <Button variant="ghost" type="button" onClick={() => router.back()}>
          {f.cancel}
        </Button>
        <Button type="submit">{f.submit}</Button>
      </div>

      <span className="hidden">{c.number}</span>
    </form>
  );
}

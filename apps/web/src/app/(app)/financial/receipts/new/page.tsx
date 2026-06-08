"use client";

import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense, useMemo, useState } from "react";
import { Paperclip } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/mock/store";
import { findInvestor, MOCK_INVESTORS } from "@/lib/mock/investors";
import { useI18n } from "@/components/providers/i18n-provider";
import type {
  PartyType,
  PaymentMethod,
  ReceiptVoucher,
} from "@/lib/mock/types";
import { cn } from "@/lib/utils";

const PARTY_TYPES: PartyType[] = ["investor", "customer", "other"];
const METHODS: PaymentMethod[] = ["bankTransfer", "cash", "stcPay", "cheque", "card"];

function nextReceiptNumber(receipts: ReceiptVoucher[]): string {
  const max = receipts
    .map((r) => parseInt(r.number.split("-").at(-1) ?? "0", 10))
    .reduce((m, n) => (n > m ? n : m), 0);
  return `RC-2025-${String(max + 1).padStart(3, "0")}`;
}

export default function NewReceiptPage() {
  return (
    <Suspense fallback={null}>
      <NewReceiptInner />
    </Suspense>
  );
}

function NewReceiptInner() {
  const router = useRouter();
  const search = useSearchParams();
  const { dict } = useI18n();
  const { receipts, addReceipt, customers, installmentContracts } = useStore();
  const f = dict.receipts.form;
  const c = dict.receipts.columns;

  const prefilledInvestorId = search.get("investorId") ?? "";
  const prefilledInvestor = prefilledInvestorId ? findInvestor(prefilledInvestorId) : undefined;

  const [partyType, setPartyType] = useState<PartyType>(prefilledInvestor ? "investor" : "customer");
  const [method, setMethod] = useState<PaymentMethod>("bankTransfer");
  const [investorId, setInvestorId] = useState(prefilledInvestorId);
  const [customerId, setCustomerId] = useState("");
  const [otherName, setOtherName] = useState("");
  const [amount, setAmount] = useState("");
  const [reference, setReference] = useState("");
  const [notes, setNotes] = useState("");

  // Customer installments are the only receipts that carry a contract link;
  // the link surfaces once a customer is chosen.
  const customerInstallments = useMemo(
    () => (partyType === "customer" && customerId
      ? installmentContracts.filter((co) => co.customerId === customerId)
      : []),
    [partyType, customerId, installmentContracts],
  );
  const [contractId, setContractId] = useState("");

  const resolvedFromName = (() => {
    if (partyType === "investor") return MOCK_INVESTORS.find((i) => i.id === investorId)?.name ?? "";
    if (partyType === "customer") return customers.find((cu) => cu.id === customerId)?.name ?? "";
    return otherName;
  })();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const numericAmount = parseFloat(amount);
    if (!resolvedFromName || !numericAmount || numericAmount <= 0) return;
    const receipt: ReceiptVoucher = {
      id: `rc-u-${Date.now()}`,
      number: nextReceiptNumber(receipts),
      date: new Date("2025-05-31").toISOString().slice(0, 10),
      amount: numericAmount,
      method,
      partyType,
      fromName: resolvedFromName,
      customerId: partyType === "customer" ? customerId || undefined : undefined,
      contractId: partyType === "customer" ? contractId || undefined : undefined,
      investorId: partyType === "investor" ? investorId || undefined : undefined,
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
    if (prefilledInvestorId) {
      router.push(`/investors/${prefilledInvestorId}`);
    } else {
      router.push(`/financial/receipts/${receipt.id}`);
    }
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
          <CardTitle className="text-base font-semibold">{f.partyLabel}</CardTitle>
          <p className="text-xs text-muted-foreground">{f.partyHint}</p>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 sm:grid-cols-3">
            {PARTY_TYPES.map((pt) => {
              const active = partyType === pt;
              return (
                <button
                  key={pt}
                  type="button"
                  onClick={() => setPartyType(pt)}
                  className={cn(
                    "rounded-lg border px-3 py-2.5 text-start text-sm transition-colors",
                    active
                      ? "border-primary bg-primary-soft text-primary-soft-foreground"
                      : "border-input hover:bg-muted",
                  )}
                >
                  {dict.partyType[pt]}
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardContent className="space-y-4 p-5">
            {partyType === "investor" ? (
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">
                  {dict.partyType.investor}
                </label>
                <select
                  value={investorId}
                  onChange={(e) => setInvestorId(e.target.value)}
                  required
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
                >
                  <option value="">—</option>
                  {MOCK_INVESTORS.map((inv) => (
                    <option key={inv.id} value={inv.id}>
                      {inv.name}
                    </option>
                  ))}
                </select>
              </div>
            ) : partyType === "customer" ? (
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">
                  {dict.partyType.customer}
                </label>
                <select
                  value={customerId}
                  onChange={(e) => {
                    setCustomerId(e.target.value);
                    setContractId("");
                  }}
                  required
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
                >
                  <option value="">—</option>
                  {customers.map((cu) => (
                    <option key={cu.id} value={cu.id}>
                      {cu.name}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">
                  {f.payerName}
                </label>
                <input
                  value={otherName}
                  onChange={(e) => setOtherName(e.target.value)}
                  placeholder={f.payerNamePlaceholder}
                  required
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
                />
              </div>
            )}
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
            {customerInstallments.length > 0 ? (
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
                  {customerInstallments.map((co) => (
                    <option key={co.id} value={co.id}>
                      {co.number}
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

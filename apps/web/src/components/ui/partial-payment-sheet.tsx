"use client";

import { useState } from "react";
import { Sheet, SheetContent, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Currency } from "@/components/ui/currency";
import { useI18n } from "@/components/providers/i18n-provider";
import type { Installment, PaymentSource } from "@/lib/mock/types";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  installment: Installment | null;
  contractNumber: string;
  onSubmit: (payment: {
    amount: number;
    source: PaymentSource;
    note?: string;
    receiptName?: string;
  }) => void;
}

const SOURCES: PaymentSource[] = ["cash", "bank_transfer", "whatsapp_upload"];

export function PartialPaymentSheet({
  open,
  onOpenChange,
  installment,
  contractNumber,
  onSubmit,
}: Props) {
  const { dict } = useI18n();
  const p = dict.installmentContracts.partialPayment;

  const remaining = installment ? installment.amount - installment.paidAmount : 0;
  const [amount, setAmount] = useState<string>("");
  const [source, setSource] = useState<PaymentSource>("bank_transfer");
  const [note, setNote] = useState("");
  const [receipt, setReceipt] = useState("");

  if (!installment) return null;

  const submit = () => {
    const num = Number(amount.replace(/[^\d.]/g, "") || 0);
    if (num <= 0) return;
    onSubmit({
      amount: num,
      source,
      note: note || undefined,
      receiptName: receipt || undefined,
    });
    setAmount("");
    setNote("");
    setReceipt("");
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="flex flex-col gap-4 overflow-y-auto bg-background">
        <SheetTitle className="text-base font-semibold">{p.title}</SheetTitle>
        <SheetDescription className="text-xs text-muted-foreground">
          {p.subtitle.replace("{n}", String(installment.index)).replace("{contract}", contractNumber)}
        </SheetDescription>

        <dl className="grid grid-cols-3 gap-3 rounded-xl border border-border bg-muted/30 p-3 text-xs">
          <div className="space-y-0.5">
            <dt className="text-muted-foreground">{p.due}</dt>
            <dd className="num font-semibold">
              <Currency value={installment.amount} />
            </dd>
          </div>
          <div className="space-y-0.5">
            <dt className="text-muted-foreground">{p.paidBefore}</dt>
            <dd className="num font-semibold">
              <Currency value={installment.paidAmount} />
            </dd>
          </div>
          <div className="space-y-0.5">
            <dt className="text-muted-foreground">{p.remaining}</dt>
            <dd className="num font-semibold text-primary">
              <Currency value={remaining} />
            </dd>
          </div>
        </dl>

        <div className="space-y-2">
          <Label htmlFor="pay-amount">{p.paymentAmount}</Label>
          <Input
            id="pay-amount"
            type="text"
            inputMode="numeric"
            value={amount}
            onChange={(e) => setAmount(e.target.value.replace(/[^\d.,]/g, ""))}
            placeholder={String(remaining)}
            className="num"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="pay-source">{p.source}</Label>
          <select
            id="pay-source"
            value={source}
            onChange={(e) => setSource(e.target.value as PaymentSource)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
          >
            {SOURCES.map((s) => (
              <option key={s} value={s}>
                {dict.paymentSource[s]}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <Label>{p.attachReceipt}</Label>
          <div className="flex items-center gap-3">
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-input bg-background px-3 py-1.5 text-sm font-medium hover:bg-accent">
              <input
                type="file"
                className="hidden"
                onChange={(e) => setReceipt(e.target.files?.[0]?.name ?? "")}
              />
              {dict.investments.create.step3.chooseFile}
            </label>
            <span className="num text-xs text-muted-foreground">
              {receipt || p.noFile}
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="pay-note">{p.note}</Label>
          <textarea
            id="pay-note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={2}
            className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          />
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-border pt-3">
          <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
            {dict.common.cancel}
          </Button>
          <Button type="button" onClick={submit}>
            {p.submit}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

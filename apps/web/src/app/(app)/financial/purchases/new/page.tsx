"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/mock/store";
import { useI18n } from "@/components/providers/i18n-provider";
import type { GoodsPurchase, PaymentMethod } from "@/lib/mock/types";
import { cn } from "@/lib/utils";

const METHODS: PaymentMethod[] = ["bankTransfer", "cash", "stcPay", "cheque", "card"];

function nextPurchaseNumber(purchases: GoodsPurchase[]): string {
  const max = purchases
    .map((p) => parseInt(p.number.split("-").at(-1) ?? "0", 10))
    .reduce((m, n) => (n > m ? n : m), 0);
  return `PUR-2025-${String(max + 1).padStart(3, "0")}`;
}

export default function NewPurchasePage() {
  const router = useRouter();
  const { dict } = useI18n();
  const { purchases, addPurchase } = useStore();
  const f = dict.purchases.form;

  const [supplier, setSupplier] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState<PaymentMethod>("bankTransfer");
  const [notes, setNotes] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseFloat(amount);
    if (!supplier || !description || !num || num <= 0) return;
    const purchase: GoodsPurchase = {
      id: `pur-u-${Date.now()}`,
      number: nextPurchaseNumber(purchases),
      date: new Date("2025-05-31").toISOString().slice(0, 10),
      supplierName: supplier,
      description,
      amount: num,
      method,
      status: "purchased",
      attachmentCount: 0,
      notes: notes || undefined,
    };
    addPurchase(purchase);
    router.push("/financial/purchases");
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-6">
      <header className="space-y-1">
        <Link
          href="/financial/purchases"
          className="text-xs text-muted-foreground hover:text-foreground"
        >
          ← {dict.purchases.pageTitle}
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          {dict.purchases.newPurchase}
        </h1>
      </header>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">{dict.purchases.pageTitle}</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">{f.supplier}</label>
            <input
              value={supplier}
              onChange={(e) => setSupplier(e.target.value)}
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
          <div className="space-y-1.5 sm:col-span-2">
            <label className="text-xs font-medium text-muted-foreground">{f.description}</label>
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
            />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <label className="text-xs font-medium text-muted-foreground">{f.method}</label>
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
          <div className="space-y-1.5 sm:col-span-2">
            <label className="text-xs font-medium text-muted-foreground">{f.notes}</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-wrap items-center justify-end gap-2 rounded-xl border bg-card p-4 shadow-[var(--shadow-card)]">
        <Button variant="ghost" type="button" onClick={() => router.back()}>
          {f.cancel}
        </Button>
        <Button type="submit">{f.submit}</Button>
      </div>
    </form>
  );
}

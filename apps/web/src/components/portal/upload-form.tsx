"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2, Image as ImageIcon, Upload } from "lucide-react";
import { PortalCard } from "@/components/portal/portal-card";
import { Currency } from "@/components/ui/currency";
import { useI18n } from "@/components/providers/i18n-provider";
import { useCustomerIdentity } from "@/lib/portal/use-portal-identity";
import { customerActiveContract } from "@/lib/portal/data";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Installment } from "@/lib/mock/types";

type Method = "bankTransfer" | "stcPay" | "cash";

export function UploadForm({ preselectedInstallmentId }: { preselectedInstallmentId?: string }) {
  const { dict, locale, dir } = useI18n();
  const t = dict.portals.customer.upload;
  const customer = useCustomerIdentity();
  const contract = customerActiveContract(customer.id);
  const Arrow = dir === "rtl" ? ArrowRight : ArrowLeft;

  const candidates: Installment[] = (contract?.schedule ?? []).filter(
    (i) => i.status !== "paid",
  );

  const initial = preselectedInstallmentId
    ? candidates.find((i) => i.id === preselectedInstallmentId) ?? candidates[0]
    : candidates[0];

  const [selected, setSelected] = useState<Installment | undefined>(initial);
  const [amount, setAmount] = useState<number>(Math.round(initial?.amount ?? 0));
  const [method, setMethod] = useState<Method>("bankTransfer");
  const [reference, setReference] = useState("");
  const [notes, setNotes] = useState("");
  const [fileName, setFileName] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  if (!contract || !selected) {
    return (
      <PortalCard>
        <p className="text-sm text-muted-foreground">{dict.portals.common.empty}</p>
      </PortalCard>
    );
  }

  if (submitted) {
    return (
      <div className="space-y-4">
        <PortalCard tone="primary" className="flex flex-col items-center gap-3 py-8 text-center">
          <CheckCircle2 className="size-10 text-primary" aria-hidden />
          <p className="text-base font-semibold">{t.successTitle}</p>
          <p className="text-xs leading-6 opacity-80">{t.successHint}</p>
        </PortalCard>
        <Link
          href="/portal/customer/payments"
          className="flex items-center justify-center gap-1.5 rounded-2xl border border-border bg-card p-3 text-sm font-medium"
        >
          <Arrow className="size-4" aria-hidden />
          {t.backToPayments}
        </Link>
      </div>
    );
  }

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        setSubmitted(true);
      }}
    >
      {/* Pick installment */}
      <div className="space-y-2">
        <p className="text-sm font-semibold text-foreground">{t.pickInstallmentTitle}</p>
        <p className="text-[11px] text-muted-foreground">{t.pickInstallmentHint}</p>
        <PortalCard className="!p-0">
          <ul className="max-h-64 divide-y divide-border overflow-y-auto">
            {candidates.map((inst) => {
              const active = selected.id === inst.id;
              return (
                <li key={inst.id}>
                  <button
                    type="button"
                    onClick={() => {
                      setSelected(inst);
                      setAmount(Math.round(inst.amount));
                    }}
                    className={cn(
                      "flex w-full items-center gap-3 px-4 py-3 text-start",
                      active ? "bg-primary-soft/60" : "hover:bg-muted/60",
                    )}
                  >
                    <span className={cn(
                      "num flex size-9 shrink-0 items-center justify-center rounded-lg text-xs font-bold",
                      active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
                    )}>
                      {inst.index}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="num text-sm font-medium text-foreground">
                        <Currency value={inst.amount} />
                      </p>
                      <p className="num text-[11px] text-muted-foreground">
                        {t.installmentRowDue.replace("{date}", formatDate(inst.dueDate, locale))}
                      </p>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        </PortalCard>
      </div>

      {/* Active selection summary */}
      <PortalCard tone="primary">
        <p className="num text-xs opacity-80">
          {t.forInstallment
            .replace("{n}", String(selected.index))
            .replace("{date}", formatDate(selected.dueDate, locale))}
        </p>
      </PortalCard>

      {/* Amount */}
      <div className="space-y-2">
        <label htmlFor="amount" className="block text-xs font-medium text-muted-foreground">
          {t.amount}
        </label>
        <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2">
          <input
            id="amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value) || 0)}
            className="num w-full bg-transparent text-base font-semibold text-foreground outline-none"
          />
          <span className="text-xs text-muted-foreground">{dict.common.currency}</span>
        </div>
      </div>

      {/* Method */}
      <div className="space-y-2">
        <p className="block text-xs font-medium text-muted-foreground">{t.method}</p>
        <div className="grid grid-cols-3 gap-1 rounded-xl bg-muted p-1">
          {(["bankTransfer", "stcPay", "cash"] as Method[]).map((m) => (
            <button
              type="button"
              key={m}
              onClick={() => setMethod(m)}
              className={cn(
                "rounded-lg py-1.5 text-xs font-medium",
                method === m ? "bg-card text-foreground shadow-[var(--shadow-soft)]" : "text-muted-foreground",
              )}
            >
              {t.methodOptions[m]}
            </button>
          ))}
        </div>
      </div>

      {/* Reference */}
      <div className="space-y-2">
        <label htmlFor="reference" className="block text-xs font-medium text-muted-foreground">
          {t.reference}
        </label>
        <input
          id="reference"
          type="text"
          value={reference}
          onChange={(e) => setReference(e.target.value)}
          placeholder="TRX-…"
          className="num w-full rounded-xl border border-border bg-card px-3 py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground/50 focus:border-primary"
        />
        <p className="text-[11px] text-muted-foreground">{t.referenceHint}</p>
      </div>

      {/* Upload file */}
      <div className="space-y-2">
        <p className="block text-xs font-medium text-muted-foreground">{t.uploadButton}</p>
        <label
          htmlFor="proof-file"
          className={cn(
            "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-card px-4 py-6 text-center hover:border-primary/40",
            fileName && "border-primary bg-primary-soft/40",
          )}
        >
          {fileName ? (
            <>
              <ImageIcon className="size-6 text-primary" aria-hidden />
              <p className="num text-xs font-medium text-foreground">{fileName}</p>
              <p className="text-[11px] text-muted-foreground">{t.uploadedHint}</p>
            </>
          ) : (
            <>
              <Upload className="size-6 text-muted-foreground" aria-hidden />
              <p className="text-xs font-medium text-foreground">{t.uploadButton}</p>
            </>
          )}
        </label>
        <input
          id="proof-file"
          type="file"
          accept="image/*,application/pdf"
          className="sr-only"
          onChange={(e) => setFileName(e.target.files?.[0]?.name ?? null)}
        />
      </div>

      {/* Notes */}
      <div className="space-y-2">
        <label htmlFor="notes" className="block text-xs font-medium text-muted-foreground">
          {t.notes}
        </label>
        <textarea
          id="notes"
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full rounded-xl border border-border bg-card px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={!fileName}
        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-50"
      >
        {t.submit}
      </button>
    </form>
  );
}

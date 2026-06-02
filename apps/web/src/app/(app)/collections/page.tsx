"use client";

import Link from "next/link";
import { AlertTriangle, Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Currency } from "@/components/ui/currency";
import { StatusPill } from "@/components/ui/status-pill";
import { useStore } from "@/lib/mock/store";
import { useI18n } from "@/components/providers/i18n-provider";
import { formatDate } from "@/lib/format";

function installmentAmount(
  contractsList: ReturnType<typeof useStore>["installmentContracts"],
  installmentId: string,
): number {
  for (const c of contractsList) {
    const i = c.schedule.find((s) => s.id === installmentId);
    if (i) return i.amount;
  }
  return 0;
}

export default function CollectionsPage() {
  const { dict, locale } = useI18n();
  const { paymentProofs, customers, installmentContracts } = useStore();
  const co = dict.collections;

  const pending = paymentProofs.filter((p) => p.status === "pending");

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{co.pageTitle}</h1>
          <p className="text-sm text-muted-foreground">{co.pageSubtitle}</p>
        </div>
        <StatusPill tone="warning">{co.inboxCount.replace("{n}", String(pending.length))}</StatusPill>
      </header>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">{co.pageTitle}</CardTitle>
        </CardHeader>
        <CardContent className="px-0 pb-2 pt-0">
          {pending.length === 0 ? (
            <p className="px-6 py-8 text-center text-sm text-muted-foreground">{co.empty}</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-[11px] uppercase text-muted-foreground">
                    <th className="px-6 py-3 text-start font-medium">{co.columns.customer}</th>
                    <th className="px-6 py-3 text-start font-medium">{co.columns.contract}</th>
                    <th className="px-6 py-3 text-start font-medium">{co.columns.amount}</th>
                    <th className="px-6 py-3 text-start font-medium">{co.columns.reference}</th>
                    <th className="px-6 py-3 text-start font-medium">{co.columns.uploadedAt}</th>
                    <th className="px-6 py-3 text-start font-medium">{co.columns.flag}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {pending.map((p) => {
                    const cust = customers.find((c) => c.id === p.customerId);
                    const contract = installmentContracts.find((c) => c.id === p.contractId);
                    const due = installmentAmount(installmentContracts, p.installmentId);
                    const ocrAmount = p.ocr.transferAmount ?? 0;
                    const isDuplicate = Boolean(p.duplicateOf);
                    const isAmountMismatch =
                      due > 0 && Math.abs(ocrAmount - due) > 0.5 && !isDuplicate;
                    const flagText = isDuplicate
                      ? co.flags.duplicate
                      : isAmountMismatch
                        ? co.flags.amountMismatch
                        : co.flags.clean;
                    const flagTone = isDuplicate
                      ? "danger"
                      : isAmountMismatch
                        ? "warning"
                        : "success";
                    return (
                      <tr key={p.id} className="hover:bg-muted/40">
                        <td className="px-6 py-3">
                          <Link href={`/collections/${p.id}`} className="font-medium hover:underline">
                            {cust?.name ?? "—"}
                          </Link>
                        </td>
                        <td className="num px-6 py-3 text-muted-foreground">{contract?.number ?? "—"}</td>
                        <td className="num px-6 py-3">
                          <Currency value={ocrAmount} />
                        </td>
                        <td className="num px-6 py-3 text-xs text-muted-foreground" dir="ltr">
                          {p.ocr.transferReference ?? "—"}
                        </td>
                        <td className="num px-6 py-3 text-xs text-muted-foreground">
                          {formatDate(p.uploadedAt.slice(0, 10), locale)}
                        </td>
                        <td className="px-6 py-3">
                          <StatusPill tone={flagTone}>
                            <span className="inline-flex items-center gap-1">
                              {flagTone === "success" ? (
                                <Check className="size-3" />
                              ) : (
                                <AlertTriangle className="size-3" />
                              )}
                              {flagText}
                            </span>
                          </StatusPill>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

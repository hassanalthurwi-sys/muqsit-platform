"use client";

import { useMemo, useState } from "react";
import { Printer, Share2 } from "lucide-react";
import { InvestorShell } from "@/components/portal/investor-shell";
import { PortalCard } from "@/components/portal/portal-card";
import { Currency } from "@/components/ui/currency";
import { useI18n } from "@/components/providers/i18n-provider";
import { useInvestorIdentity } from "@/lib/portal/use-portal-identity";
import { investorDistributions, investorPortfolioSummary } from "@/lib/portal/data";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";

type Period = "monthly" | "quarterly" | "annual";
const PERIODS: Period[] = ["monthly", "quarterly", "annual"];
const REFERENCE_TODAY = "2025-06-01";

function periodRange(p: Period): { from: string; to: string } {
  // For the prototype, we tile windows ending at REFERENCE_TODAY.
  const months = p === "monthly" ? 1 : p === "quarterly" ? 3 : 12;
  const to = REFERENCE_TODAY;
  const d = new Date(REFERENCE_TODAY);
  d.setMonth(d.getMonth() - months);
  const from = d.toISOString().slice(0, 10);
  return { from, to };
}

export default function InvestorStatementsPage() {
  const { dict, locale } = useI18n();
  const t = dict.portals.investor.statements;
  const tp = t.preview;
  const investor = useInvestorIdentity();
  const [period, setPeriod] = useState<Period>("monthly");
  const range = useMemo(() => periodRange(period), [period]);

  const allDist = investorDistributions(investor.id);
  const rows = allDist.filter((d) => d.date >= range.from && d.date <= range.to);
  const total = rows.reduce((s, r) => s + r.net, 0);
  const summary = investorPortfolioSummary(investor.id);

  const refNo = `MQ-${investor.id.replace(/[^a-z0-9]/gi, "").toUpperCase().slice(-6)}-${period.toUpperCase().slice(0, 1)}-${range.to.replace(/-/g, "").slice(2)}`;

  return (
    <InvestorShell>
      {/* Screen UI: period picker + share/print buttons (hidden in print) */}
      <div className="space-y-4 print:hidden">
        <header className="space-y-1">
          <h1 className="text-xl font-semibold tracking-tight">{t.pageTitle}</h1>
          <p className="text-xs text-muted-foreground">{t.downloadHint}</p>
        </header>

        <div className="flex flex-wrap items-center gap-3">
          <div className="inline-flex rounded-lg border border-border bg-card p-1 text-xs font-medium">
            {PERIODS.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPeriod(p)}
                className={cn(
                  "rounded-md px-3 py-1.5",
                  period === p ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground",
                )}
              >
                {t.periodOptions[p]}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => typeof window !== "undefined" && window.print()}
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:opacity-90"
          >
            <Printer className="size-3.5" aria-hidden />
            {dict.portals.common.print}
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium hover:bg-muted"
          >
            <Share2 className="size-3.5" aria-hidden />
            {dict.portals.common.share}
          </button>
        </div>
      </div>

      {/* The actual statement — print-friendly */}
      <div className="mt-4 print:mt-0">
        <article className="statement-doc mx-auto rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)] print:rounded-none print:border-0 print:shadow-none lg:p-10">
          <header className="flex items-start justify-between gap-4 border-b border-border pb-5">
            <div className="flex items-center gap-3">
              <span className="flex size-12 items-center justify-center rounded-xl bg-primary text-base font-bold text-primary-foreground">
                م
              </span>
              <div>
                <p className="text-base font-semibold text-foreground">مكتب مُقسِط للتمويل</p>
                <p className="text-[11px] text-muted-foreground">Muqsit Office for Financing · الرياض</p>
              </div>
            </div>
            <div className="text-end">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {tp.docTitle}
              </p>
              <p className="num mt-1 text-[11px] text-muted-foreground">
                {tp.refNo}: {refNo}
              </p>
            </div>
          </header>

          {/* Issued to + period meta */}
          <section className="grid grid-cols-1 gap-5 border-b border-border py-5 sm:grid-cols-2">
            <div>
              <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                {tp.toLabel}
              </p>
              <p className="mt-1 text-sm font-semibold text-foreground">{investor.name}</p>
              <p className="num text-[11px] text-muted-foreground">
                {tp.investorIdLabel}: {investor.id}
              </p>
            </div>
            <div className="sm:text-end">
              <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                {tp.forPeriod}
              </p>
              <p className="num mt-1 text-sm font-medium text-foreground">
                {formatDate(range.from, locale)} — {formatDate(range.to, locale)}
              </p>
              <p className="num text-[11px] text-muted-foreground">
                {tp.dateIssued}: {formatDate(REFERENCE_TODAY, locale)}
              </p>
            </div>
          </section>

          {/* Capital summary */}
          <section className="py-5">
            <h2 className="mb-3 text-sm font-semibold text-foreground">{tp.capitalSummary}</h2>
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-lg border border-border bg-muted/40 p-3">
                <p className="text-[10px] font-medium text-muted-foreground">{tp.capitalRows.principal}</p>
                <p className="num mt-1.5 text-base font-semibold text-foreground">
                  <Currency value={summary.principal} />
                </p>
              </div>
              <div className="rounded-lg border border-border bg-muted/40 p-3">
                <p className="text-[10px] font-medium text-muted-foreground">{tp.capitalRows.utilized}</p>
                <p className="num mt-1.5 text-base font-semibold text-foreground">
                  <Currency value={summary.utilized} />
                </p>
              </div>
              <div className="rounded-lg border border-border bg-muted/40 p-3">
                <p className="text-[10px] font-medium text-muted-foreground">{tp.capitalRows.unutilized}</p>
                <p className="num mt-1.5 text-base font-semibold text-foreground">
                  <Currency value={summary.unutilized} />
                </p>
              </div>
            </div>
          </section>

          {/* Distributions table */}
          <section className="py-5">
            <h2 className="mb-3 text-sm font-semibold text-foreground">{tp.distributionsTitle}</h2>
            <div className="overflow-hidden rounded-lg border border-border">
              <table className="w-full text-sm">
                <thead className="bg-muted/60 text-[11px] font-semibold text-muted-foreground">
                  <tr>
                    <th className="px-3 py-2 text-start">{tp.colDate}</th>
                    <th className="px-3 py-2 text-start">{tp.colContract}</th>
                    <th className="px-3 py-2 text-end">{tp.colGross}</th>
                    <th className="px-3 py-2 text-end">{tp.colFee}</th>
                    <th className="px-3 py-2 text-end">{tp.colNet}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {rows.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-3 py-6 text-center text-xs text-muted-foreground">
                        —
                      </td>
                    </tr>
                  ) : (
                    rows.map((r) => (
                      <tr key={`${r.date}-${r.contractId}`}>
                        <td className="num px-3 py-2">{formatDate(r.date, locale)}</td>
                        <td className="num px-3 py-2">{r.contractNumber}</td>
                        <td className="num px-3 py-2 text-end"><Currency value={Math.round(r.gross)} /></td>
                        <td className="num px-3 py-2 text-end"><Currency value={Math.round(r.fee)} /></td>
                        <td className="num px-3 py-2 text-end font-semibold"><Currency value={r.net} /></td>
                      </tr>
                    ))
                  )}
                </tbody>
                <tfoot className="border-t border-border bg-muted/40">
                  <tr>
                    <td colSpan={4} className="px-3 py-2 text-end text-xs font-semibold text-muted-foreground">
                      {tp.totalDistributed}
                    </td>
                    <td className="num px-3 py-2 text-end text-base font-bold text-foreground">
                      <Currency value={total} />
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </section>

          {/* Notes + signature row */}
          <section className="grid grid-cols-1 gap-4 border-t border-border pt-5 sm:grid-cols-2">
            <div>
              <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">{tp.notes}</p>
              <p className="mt-1 text-xs leading-6 text-muted-foreground">{tp.notesBody}</p>
            </div>
            <div className="flex flex-col items-end justify-end gap-1 sm:text-end">
              <span className="num inline-block rounded-md border border-dashed border-border px-3 py-2 text-[10px] text-muted-foreground">
                {refNo}
              </span>
              <p className="text-[11px] text-muted-foreground">{tp.signature}</p>
            </div>
          </section>
        </article>
      </div>

      <p className="mt-3 text-center text-[11px] text-muted-foreground print:hidden">{tp.printHint}</p>

      {/* Print stylesheet: hide app chrome, fit to page */}
      <style jsx global>{`
        @media print {
          body { background: white !important; }
          header[class*="sticky"], nav[aria-label="portal"] { display: none !important; }
          main { padding: 0 !important; max-width: none !important; }
          .statement-doc { box-shadow: none !important; border: none !important; padding: 0 !important; }
        }
      `}</style>
    </InvestorShell>
  );
}

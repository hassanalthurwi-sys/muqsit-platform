"use client";

import { CheckCircle2, AlertCircle, MinusCircle } from "lucide-react";
import { useI18n } from "@/components/providers/i18n-provider";
import { migrationColumnsFor } from "@/lib/mock/migration-samples";
import type { MigrationRow, MigrationStepKey } from "@/lib/mock/types";
import { cn } from "@/lib/utils";

interface Props {
  step: Exclude<MigrationStepKey, "review">;
  rows: MigrationRow[];
}

export function ReviewTable({ step, rows }: Props) {
  const { dict } = useI18n();
  const m = dict.migration;
  const columns = migrationColumnsFor(step);

  const summary = rows.reduce(
    (acc, row) => {
      for (const c of Object.values(row.cells)) {
        if (c.status === "confirmed") acc.confirmed++;
        else if (c.status === "needsReview") acc.needsReview++;
        else acc.missing++;
      }
      return acc;
    },
    { confirmed: 0, needsReview: 0, missing: 0 },
  );

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="text-sm font-semibold">{m.reviewTableTitle}</h3>
        <div className="flex flex-wrap gap-2 text-[11px]">
          <span className="inline-flex items-center gap-1 rounded-full bg-success/10 px-2 py-0.5 text-success">
            <CheckCircle2 className="size-3" />
            {m.summaryConfirmed.replace("{n}", String(summary.confirmed))}
          </span>
          {summary.needsReview > 0 ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-warning-soft px-2 py-0.5 text-warning-foreground">
              <AlertCircle className="size-3" />
              {m.summaryNeedsReview.replace("{n}", String(summary.needsReview))}
            </span>
          ) : null}
          {summary.missing > 0 ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-muted-foreground">
              <MinusCircle className="size-3" />
              {m.summaryMissing.replace("{n}", String(summary.missing))}
            </span>
          ) : null}
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-[11px] uppercase text-muted-foreground">
              {columns.map((col) => (
                <th key={col} className="px-3 py-2 text-start font-medium">
                  {m.columnLabels[col] ?? col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rows.map((row) => (
              <tr key={row.id} className="hover:bg-muted/30">
                {columns.map((col) => {
                  const c = row.cells[col];
                  if (!c) {
                    return (
                      <td key={col} className="px-3 py-2 text-muted-foreground">
                        —
                      </td>
                    );
                  }
                  return (
                    <td
                      key={col}
                      className={cn(
                        "px-3 py-2",
                        c.status === "needsReview" && "bg-warning-soft/30",
                        c.status === "missing" && "bg-muted/30 text-muted-foreground",
                      )}
                    >
                      <span className="num text-xs">{c.value}</span>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

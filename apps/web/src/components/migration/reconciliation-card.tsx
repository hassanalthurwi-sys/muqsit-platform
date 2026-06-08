"use client";

import { useState } from "react";
import { Check, X, Sparkles } from "lucide-react";
import { useI18n } from "@/components/providers/i18n-provider";
import type { MigrationMatchPrompt } from "@/lib/mock/types";
import { cn } from "@/lib/utils";

interface Props {
  prompts: MigrationMatchPrompt[];
}

export function ReconciliationCard({ prompts }: Props) {
  const { dict } = useI18n();
  const m = dict.migration;
  const [resolutions, setResolutions] = useState<Record<string, "same" | "different">>({});

  if (prompts.length === 0) return null;

  return (
    <div className="space-y-3 rounded-2xl border border-gold-soft bg-gold-soft/30 p-5">
      <div className="flex items-start gap-3">
        <span className="grid size-9 shrink-0 place-items-center rounded-full bg-gold text-gold-foreground">
          <Sparkles className="size-4" />
        </span>
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-gold-foreground">
            {m.reconciliationTitle}
          </h3>
          <p className="mt-0.5 text-xs text-gold-foreground/80">{m.reconciliationHint}</p>
        </div>
      </div>

      <ul className="space-y-2">
        {prompts.map((p) => {
          const decision = resolutions[p.id];
          return (
            <li key={p.id} className="rounded-xl border bg-card p-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline gap-2">
                    <span className="text-sm font-medium">{p.importedLabel}</span>
                    <span className="text-xs text-muted-foreground">↔</span>
                    <span className="text-sm font-medium">{p.existingLabel}</span>
                  </div>
                  <p className="mt-1 text-[11px] text-muted-foreground">{p.context}</p>
                </div>
                {decision ? (
                  <span
                    className={cn(
                      "inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium",
                      decision === "same"
                        ? "bg-success/10 text-success"
                        : "bg-muted text-muted-foreground",
                    )}
                  >
                    {decision === "same" ? <Check className="size-3" /> : <X className="size-3" />}
                    {decision === "same" ? m.reconciliationDone : m.differentPerson}
                  </span>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => setResolutions((r) => ({ ...r, [p.id]: "same" }))}
                      className="inline-flex items-center gap-1 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90"
                    >
                      <Check className="size-3" />
                      {m.samePerson}
                    </button>
                    <button
                      type="button"
                      onClick={() => setResolutions((r) => ({ ...r, [p.id]: "different" }))}
                      className="inline-flex items-center gap-1 rounded-md border border-input bg-card px-3 py-1.5 text-xs font-medium hover:bg-muted"
                    >
                      <X className="size-3" />
                      {m.differentPerson}
                    </button>
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

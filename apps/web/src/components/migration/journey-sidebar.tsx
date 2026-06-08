"use client";

import Link from "next/link";
import { Check, CircleDot, Circle, SkipForward } from "lucide-react";
import { useStore } from "@/lib/mock/store";
import { useI18n } from "@/components/providers/i18n-provider";
import { MIGRATION_STEP_ORDER } from "@/lib/mock/migration-samples";
import type { MigrationStepKey } from "@/lib/mock/types";
import { cn } from "@/lib/utils";

interface Props {
  current?: MigrationStepKey;
}

export function JourneySidebar({ current }: Props) {
  const { dict } = useI18n();
  const { migrationProgress } = useStore();
  const m = dict.migration;

  return (
    <aside className="w-full md:w-72 md:shrink-0">
      <div className="rounded-2xl border bg-card p-5">
        <h2 className="text-sm font-semibold text-muted-foreground">{m.journeyTitle}</h2>
        <ol className="mt-3 flex flex-col gap-1.5">
          {MIGRATION_STEP_ORDER.map((step, idx) => {
            const state = migrationProgress[step];
            const isActive = current === step;
            const isCompleted = state?.status === "completed";
            const isSkipped = state?.status === "skipped";
            const isInProgress = state?.status === "needsReview" || state?.status === "analyzing" || state?.status === "selectingMethod";

            const Icon = isCompleted
              ? Check
              : isSkipped
                ? SkipForward
                : isActive || isInProgress
                  ? CircleDot
                  : Circle;

            const toneClass = isCompleted
              ? "text-success bg-success/10"
              : isSkipped
                ? "text-muted-foreground bg-muted"
                : isActive || isInProgress
                  ? "text-primary bg-primary-soft"
                  : "text-muted-foreground bg-muted/40";

            const rows = state?.rows.length ?? 0;
            const stepInfo = m.steps[step];

            return (
              <li key={step}>
                <Link
                  href={`/migration${step === "investors" && idx === 0 ? "" : `/${step}`}`}
                  className={cn(
                    "flex items-start gap-3 rounded-xl px-3 py-2.5 transition-colors",
                    isActive ? "bg-primary-soft/60" : "hover:bg-muted/50",
                  )}
                >
                  <span
                    className={cn(
                      "mt-0.5 grid size-6 shrink-0 place-items-center rounded-full",
                      toneClass,
                    )}
                  >
                    <Icon className="size-3.5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium leading-tight">
                      {idx + 1}. {stepInfo.title}
                    </p>
                    <p className="mt-0.5 text-[11px] leading-tight text-muted-foreground">
                      {isCompleted
                        ? `${rows} ${rows === 1 ? "سجل" : "سجل"}`
                        : isSkipped
                          ? m.stepStatus.skipped
                          : isInProgress
                            ? m.stepStatus.inProgress
                            : m.stepStatus.notStarted}
                    </p>
                  </div>
                </Link>
              </li>
            );
          })}
        </ol>
      </div>
    </aside>
  );
}

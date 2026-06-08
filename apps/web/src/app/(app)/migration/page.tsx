"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { JourneySidebar } from "@/components/migration/journey-sidebar";
import { useI18n } from "@/components/providers/i18n-provider";
import { useStore } from "@/lib/mock/store";
import { MIGRATION_STEP_ORDER } from "@/lib/mock/migration-samples";
import { cn } from "@/lib/utils";

export default function MigrationOverviewPage() {
  const { dict, dir } = useI18n();
  const { migrationProgress } = useStore();
  const m = dict.migration;
  const Arrow = dir === "rtl" ? ArrowLeft : ArrowRight;

  // Where to send "Start" / "Resume" — first non-completed step.
  const firstIncomplete = MIGRATION_STEP_ORDER.find((s) => {
    const state = migrationProgress[s];
    return !state || (state.status !== "completed" && state.status !== "skipped");
  });
  const anyStarted = MIGRATION_STEP_ORDER.some((s) => {
    const state = migrationProgress[s];
    return state && state.status !== "notStarted";
  });

  return (
    <div className="flex flex-col gap-6 lg:flex-row">
      <JourneySidebar />
      <div className="min-w-0 flex-1 space-y-6">
        <header className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{m.title}</h1>
          <p className="max-w-2xl text-sm text-muted-foreground">{m.subtitle}</p>
        </header>

        {firstIncomplete ? (
          <Link
            href={`/migration/${firstIncomplete}`}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            {anyStarted ? m.resumeCta : m.bannerCta}
            <Arrow className="size-4" />
          </Link>
        ) : null}

        <div className="grid gap-3 sm:grid-cols-2">
          {MIGRATION_STEP_ORDER.map((step, idx) => {
            const state = migrationProgress[step];
            const isCompleted = state?.status === "completed";
            const isSkipped = state?.status === "skipped";
            const rows = state?.rows.length ?? 0;
            const info = m.steps[step];
            return (
              <Link
                key={step}
                href={`/migration/${step}`}
                className={cn(
                  "rounded-2xl border bg-card p-4 transition-colors hover:bg-muted/40",
                  isCompleted && "border-success/30",
                )}
              >
                <div className="flex items-baseline justify-between gap-2">
                  <p className="text-xs text-muted-foreground">
                    {dir === "rtl"
                      ? `الخطوة ${idx + 1}`
                      : `Step ${idx + 1}`}
                  </p>
                  <span
                    className={cn(
                      "text-[11px] font-medium",
                      isCompleted && "text-success",
                      isSkipped && "text-muted-foreground",
                      !isCompleted && !isSkipped && "text-muted-foreground",
                    )}
                  >
                    {isCompleted
                      ? m.stepStatus.completed
                      : isSkipped
                        ? m.stepStatus.skipped
                        : state
                          ? m.stepStatus.inProgress
                          : m.stepStatus.notStarted}
                  </span>
                </div>
                <p className="mt-1 text-base font-semibold">{info.title}</p>
                <p className="mt-1 text-xs text-muted-foreground">{info.subtitle}</p>
                {isCompleted ? (
                  <p className="num mt-3 text-xs text-success">
                    {rows} {dir === "rtl" ? "سجل" : "records"}
                  </p>
                ) : null}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

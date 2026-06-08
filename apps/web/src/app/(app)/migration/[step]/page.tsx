"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Upload, Sparkles } from "lucide-react";
import { JourneySidebar } from "@/components/migration/journey-sidebar";
import { InputMethodPicker } from "@/components/migration/input-method-picker";
import { ReviewTable } from "@/components/migration/review-table";
import { ReconciliationCard } from "@/components/migration/reconciliation-card";
import { useStore } from "@/lib/mock/store";
import { useI18n } from "@/components/providers/i18n-provider";
import {
  MIGRATION_STEP_ORDER,
  SAMPLE_MATCHES,
  sampleRowsFor,
} from "@/lib/mock/migration-samples";
import type { MigrationInputMethod, MigrationStepKey } from "@/lib/mock/types";

const VALID_STEPS: MigrationStepKey[] = MIGRATION_STEP_ORDER;

export default function MigrationStepPage({
  params,
}: {
  params: Promise<{ step: string }>;
}) {
  const { step: stepParam } = use(params);
  const router = useRouter();
  const { dict, dir } = useI18n();
  const m = dict.migration;
  const Arrow = dir === "rtl" ? ArrowLeft : ArrowRight;
  const BackArrow = dir === "rtl" ? ArrowRight : ArrowLeft;
  const { migrationProgress, updateMigrationStep, completeMigration } = useStore();

  // Validate the step
  const step = (VALID_STEPS as string[]).includes(stepParam)
    ? (stepParam as MigrationStepKey)
    : null;

  if (!step) {
    return (
      <div className="rounded-xl border bg-card p-8 text-center text-muted-foreground">
        Unknown migration step.
      </div>
    );
  }

  // ─── Review step ─────────────────────────────────────────────
  if (step === "review") {
    return <ReviewStep />;
  }

  return <DataStep stepKey={step} m={m} dir={dir} Arrow={Arrow} BackArrow={BackArrow} router={router} migrationProgress={migrationProgress} updateMigrationStep={updateMigrationStep} />;
}

// ─── Per-data-step page (investors, contracts, etc.) ─────────────
function DataStep({
  stepKey,
  m,
  dir,
  Arrow,
  BackArrow,
  router,
  migrationProgress,
  updateMigrationStep,
}: {
  stepKey: Exclude<MigrationStepKey, "review">;
  m: ReturnType<typeof useI18n>["dict"]["migration"];
  dir: "ltr" | "rtl";
  Arrow: typeof ArrowLeft;
  BackArrow: typeof ArrowLeft;
  router: ReturnType<typeof useRouter>;
  migrationProgress: ReturnType<typeof useStore>["migrationProgress"];
  updateMigrationStep: ReturnType<typeof useStore>["updateMigrationStep"];
}) {
  const state = migrationProgress[stepKey];
  const [method, setMethod] = useState<MigrationInputMethod | undefined>(state?.method);
  const [phase, setPhase] = useState<"choose" | "analyzing" | "review">(
    state?.status === "completed" || state?.rows?.length
      ? "review"
      : state?.method
        ? "review"
        : "choose",
  );

  const info = m.steps[stepKey];
  const stepIdx = MIGRATION_STEP_ORDER.indexOf(stepKey);
  const nextStep = MIGRATION_STEP_ORDER[stepIdx + 1];
  const matches = SAMPLE_MATCHES[stepKey] ?? [];

  // When user picks a method, simulate the analysis
  function handleChooseMethod(chosen: MigrationInputMethod) {
    setMethod(chosen);
    setPhase("analyzing");
    updateMigrationStep(stepKey, { method: chosen, status: "analyzing" });
    // Simulated delay so the loader is visible
    setTimeout(() => {
      const rows = sampleRowsFor(stepKey, chosen);
      updateMigrationStep(stepKey, {
        method: chosen,
        status: "needsReview",
        rows,
        matches,
      });
      setPhase("review");
    }, 1400);
  }

  function handleApprove() {
    updateMigrationStep(stepKey, { status: "completed" });
    if (nextStep) {
      router.push(`/migration/${nextStep}`);
    } else {
      router.push("/migration");
    }
  }

  function handleSkip() {
    updateMigrationStep(stepKey, { status: "skipped" });
    if (nextStep) {
      router.push(`/migration/${nextStep}`);
    } else {
      router.push("/migration");
    }
  }

  return (
    <div className="flex flex-col gap-6 lg:flex-row">
      <JourneySidebar current={stepKey} />
      <div className="min-w-0 flex-1 space-y-6">
        <header className="space-y-2">
          <Link
            href="/migration"
            className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
          >
            <BackArrow className="size-3" />
            {m.backToOverview}
          </Link>
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <div>
              <p className="text-xs font-medium text-muted-foreground">
                {dir === "rtl" ? `الخطوة ${stepIdx + 1} من 7` : `Step ${stepIdx + 1} of 7`}
              </p>
              <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
                {info.title}
              </h1>
              <p className="mt-0.5 text-sm text-muted-foreground">{info.subtitle}</p>
            </div>
            <button
              type="button"
              onClick={handleSkip}
              className="text-xs text-muted-foreground underline-offset-4 hover:underline"
            >
              {m.skipStep}
            </button>
          </div>
        </header>

        {/* Phase 1: method picker */}
        {phase === "choose" ? (
          <div className="space-y-5">
            <InputMethodPicker selected={method} onChoose={handleChooseMethod} />
            {method ? null : (
              <div className="rounded-xl border border-dashed bg-muted/30 px-5 py-10 text-center text-sm text-muted-foreground">
                {m.uploadHint}
              </div>
            )}
          </div>
        ) : null}

        {/* Phase 2: analyzing */}
        {phase === "analyzing" ? (
          <div className="rounded-2xl border bg-card p-10 text-center">
            <Sparkles className="mx-auto size-8 animate-pulse text-primary" />
            <h2 className="mt-4 text-base font-semibold">{m.analyzingTitle}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{m.analyzingHint}</p>
            <div className="mx-auto mt-5 h-1.5 w-48 overflow-hidden rounded-full bg-muted">
              <div className="h-full w-1/2 animate-pulse rounded-full bg-primary" />
            </div>
          </div>
        ) : null}

        {/* Phase 3: review */}
        {phase === "review" && state?.rows && state.rows.length > 0 ? (
          <div className="space-y-5">
            <div className="rounded-xl bg-success-soft/30 px-4 py-3 text-sm text-success-foreground">
              ✨ {m.extractedCount.replace("{n}", String(state.rows.length))}
            </div>
            <ReviewTable step={stepKey} rows={state.rows} />
            {matches.length > 0 ? <ReconciliationCard prompts={matches} /> : null}
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border bg-card p-4">
              <button
                type="button"
                onClick={() => setPhase("choose")}
                className="text-xs text-muted-foreground underline-offset-4 hover:underline"
              >
                {dir === "rtl" ? "إعادة الرفع" : "Upload again"}
              </button>
              <button
                type="button"
                onClick={handleApprove}
                className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                {m.approveStep}
                <Arrow className="size-4" />
              </button>
            </div>
          </div>
        ) : null}

        {phase === "review" && (!state?.rows || state.rows.length === 0) ? (
          <div className="rounded-2xl border bg-card p-8 text-center">
            <p className="text-sm text-muted-foreground">
              {dir === "rtl"
                ? "ابدأ بإدخال السجلات يدوياً (نموذج تجريبي — أزر الإضافة معطلة)."
                : "Start entering records manually (prototype — add button disabled)."}
            </p>
            <button
              type="button"
              onClick={handleApprove}
              className="mt-4 inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              {m.approveStep}
              <Arrow className="size-4" />
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}

// ─── Final review step ──────────────────────────────────────────
function ReviewStep() {
  const { dict, dir } = useI18n();
  const router = useRouter();
  const m = dict.migration;
  const Arrow = dir === "rtl" ? ArrowLeft : ArrowRight;
  const BackArrow = dir === "rtl" ? ArrowRight : ArrowLeft;
  const { migrationProgress, completeMigration } = useStore();

  const dataSteps = MIGRATION_STEP_ORDER.filter((s) => s !== "review") as Exclude<
    MigrationStepKey,
    "review"
  >[];

  const totalRecords = dataSteps.reduce(
    (sum, s) => sum + (migrationProgress[s]?.rows?.length ?? 0),
    0,
  );

  function handleFinalApprove() {
    completeMigration();
    router.push("/migration/complete");
  }

  return (
    <div className="flex flex-col gap-6 lg:flex-row">
      <JourneySidebar current="review" />
      <div className="min-w-0 flex-1 space-y-6">
        <header className="space-y-2">
          <Link
            href="/migration"
            className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
          >
            <BackArrow className="size-3" />
            {m.backToOverview}
          </Link>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            {m.finalReviewTitle}
          </h1>
          <p className="max-w-2xl text-sm text-muted-foreground">{m.finalReviewHint}</p>
        </header>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {dataSteps.map((s) => {
            const state = migrationProgress[s];
            const isCompleted = state?.status === "completed";
            const isSkipped = state?.status === "skipped";
            const info = m.steps[s];
            return (
              <Link
                key={s}
                href={`/migration/${s}`}
                className="rounded-xl border bg-card p-4 transition-colors hover:bg-muted/40"
              >
                <p className="text-xs text-muted-foreground">{info.title}</p>
                <p className="num mt-2 text-2xl font-semibold">
                  {state?.rows?.length ?? 0}
                </p>
                <p className="mt-1 text-[11px] text-muted-foreground">
                  {isCompleted
                    ? m.stepStatus.completed
                    : isSkipped
                      ? m.stepStatus.skipped
                      : m.stepStatus.notStarted}
                </p>
              </Link>
            );
          })}
        </div>

        <div className="space-y-3 rounded-2xl border border-primary/20 bg-primary-soft/30 p-5">
          <div className="space-y-1">
            <p className="text-sm font-semibold">{m.finalApproveConfirm}</p>
            <p className="num text-xs text-muted-foreground">
              {dir === "rtl"
                ? `إجمالي السجلات: ${totalRecords}`
                : `Total records: ${totalRecords}`}
            </p>
          </div>
          <button
            type="button"
            onClick={handleFinalApprove}
            className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            {m.finalApprove}
            <Arrow className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { Sparkles, ArrowLeft, ArrowRight } from "lucide-react";
import { useI18n } from "@/components/providers/i18n-provider";
import { useStore } from "@/lib/mock/store";
import { MIGRATION_STEP_ORDER } from "@/lib/mock/migration-samples";

export default function MigrationCompletePage() {
  const { dict, dir } = useI18n();
  const { migrationProgress } = useStore();
  const m = dict.migration;
  const Arrow = dir === "rtl" ? ArrowLeft : ArrowRight;

  const totalRecords = MIGRATION_STEP_ORDER.filter((s) => s !== "review").reduce(
    (sum, s) => sum + (migrationProgress[s]?.rows?.length ?? 0),
    0,
  );

  return (
    <div className="mx-auto max-w-xl space-y-6 py-16 text-center">
      <div className="mx-auto grid size-20 place-items-center rounded-full bg-success/10 text-success">
        <Sparkles className="size-9" />
      </div>
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">{m.completedTitle}</h1>
        <p className="text-sm text-muted-foreground">{m.completedSubtitle}</p>
      </div>
      <div className="mx-auto inline-flex rounded-full bg-primary-soft px-4 py-2 text-sm font-medium text-primary-soft-foreground">
        <span className="num">{m.completedCount.replace("{n}", String(totalRecords))}</span>
      </div>
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
      >
        {m.completedCta}
        <Arrow className="size-4" />
      </Link>
    </div>
  );
}

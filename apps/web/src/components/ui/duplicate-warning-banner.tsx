"use client";

import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { useI18n } from "@/components/providers/i18n-provider";

export function DuplicateWarningBanner({
  earlierProofId,
}: {
  earlierProofId?: string;
}) {
  const { dict } = useI18n();
  const r = dict.collections.review;
  return (
    <div
      role="alert"
      className="flex flex-wrap items-start gap-3 rounded-xl border border-danger-soft bg-danger-soft/60 px-4 py-3 text-danger-foreground"
    >
      <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-card/60">
        <AlertTriangle className="size-4" />
      </span>
      <div className="min-w-0 flex-1 space-y-0.5">
        <p className="text-sm font-semibold">{r.duplicateBannerTitle}</p>
        <p className="text-xs opacity-80">{r.duplicateBannerHint}</p>
      </div>
      {earlierProofId ? (
        <Link
          href={`/collections/${earlierProofId}`}
          className="text-xs font-semibold underline-offset-2 hover:underline"
        >
          {r.duplicateView}
        </Link>
      ) : null}
    </div>
  );
}

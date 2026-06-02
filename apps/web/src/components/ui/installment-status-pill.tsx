"use client";

import { StatusPill } from "@/components/ui/status-pill";
import { useI18n } from "@/components/providers/i18n-provider";
import type { InstallmentStatusKey } from "@/lib/i18n/dictionaries";

const TONE: Record<InstallmentStatusKey, "default" | "primary" | "warning" | "danger" | "success"> = {
  scheduled: "default",
  partiallyPaid: "warning",
  paid: "success",
  overdue: "danger",
  defaulted: "danger",
};

export function InstallmentStatusPill({ status }: { status: InstallmentStatusKey }) {
  const { dict } = useI18n();
  return <StatusPill tone={TONE[status]}>{dict.installmentStatus[status]}</StatusPill>;
}

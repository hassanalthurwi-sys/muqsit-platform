"use client";

import { StatusPill } from "@/components/ui/status-pill";
import { useI18n } from "@/components/providers/i18n-provider";
import type { RiskClassKey } from "@/lib/i18n/dictionaries";

const TONE: Record<RiskClassKey, "success" | "warning" | "danger"> = {
  low: "success",
  medium: "warning",
  high: "danger",
};

export function RiskClassBadge({ risk }: { risk: RiskClassKey }) {
  const { dict } = useI18n();
  return <StatusPill tone={TONE[risk]}>{dict.riskClass[risk]}</StatusPill>;
}

"use client";

import { StatusPill } from "@/components/ui/status-pill";
import { useI18n } from "@/components/providers/i18n-provider";

type InvestorType = "internal" | "external";

export function InvestorTypeBadge({ type }: { type: InvestorType }) {
  const { dict } = useI18n();
  return (
    <StatusPill tone={type === "internal" ? "primary" : "gold"}>
      {dict.investorType[type]}
    </StatusPill>
  );
}

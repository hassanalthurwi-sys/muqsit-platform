"use client";

import { StatusPill } from "@/components/ui/status-pill";
import { useI18n } from "@/components/providers/i18n-provider";
import type { IdentityKindKey } from "@/lib/i18n/dictionaries";

const TONE: Record<IdentityKindKey, "primary" | "gold" | "default"> = {
  saudiIndividual: "primary",
  gccIndividual: "default",
  foreignIndividual: "gold",
  commercialEntity: "default",
};

export function IdentityBadge({ kind }: { kind: IdentityKindKey }) {
  const { dict } = useI18n();
  return <StatusPill tone={TONE[kind]}>{dict.identityKind[kind]}</StatusPill>;
}

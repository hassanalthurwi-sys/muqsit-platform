"use client";

import { useI18n } from "@/components/providers/i18n-provider";
import { cn } from "@/lib/utils";

interface CurrencyProps {
  value: number;
  unit?: string;
  className?: string;
  unitClassName?: string;
  compact?: boolean;
}

export function Currency({ value, unit, className, unitClassName, compact }: CurrencyProps) {
  const { locale, dict } = useI18n();
  // Force Latin digits even in Arabic — standard for Saudi banking interfaces.
  const fmt = new Intl.NumberFormat(locale === "ar" ? "ar-SA-u-nu-latn" : "en-US", {
    notation: compact ? "compact" : "standard",
    maximumFractionDigits: compact ? 1 : 0,
  });

  return (
    <span className={cn("num inline-flex items-baseline gap-1.5", className)}>
      <span>{fmt.format(value)}</span>
      <span className={cn("text-[0.55em] font-medium text-muted-foreground", unitClassName)}>
        {unit ?? dict.common.currency}
      </span>
    </span>
  );
}

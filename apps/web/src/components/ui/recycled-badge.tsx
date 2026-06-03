"use client";

import { cn } from "@/lib/utils";
import { useI18n } from "@/components/providers/i18n-provider";

interface RecycledBadgeProps {
  size?: "sm" | "md";
  className?: string;
}

export function RecycledBadge({ size = "sm", className }: RecycledBadgeProps) {
  const { dict } = useI18n();
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full bg-primary-soft font-medium text-primary-soft-foreground",
        size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-xs",
        className,
      )}
      aria-label={dict.recycling.badgeLabel}
    >
      <span aria-hidden>🔄</span>
      {dict.recycling.badgeLabel}
    </span>
  );
}

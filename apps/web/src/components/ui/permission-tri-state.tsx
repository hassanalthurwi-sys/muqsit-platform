"use client";

import { Check, ShieldCheck, X } from "lucide-react";
import { useI18n } from "@/components/providers/i18n-provider";
import { cn } from "@/lib/utils";
import type { PermissionState } from "@/lib/mock/types";

interface Props {
  value: PermissionState;
  onChange: (value: PermissionState) => void;
  disabled?: boolean;
}

const ORDER: PermissionState[] = ["allow", "requireApproval", "deny"];

const STYLES: Record<
  PermissionState,
  { active: string; icon: typeof Check }
> = {
  allow: {
    active: "bg-success-soft text-success-foreground border-success",
    icon: Check,
  },
  requireApproval: {
    active: "bg-warning-soft text-warning-foreground border-warning",
    icon: ShieldCheck,
  },
  deny: {
    active: "bg-danger-soft text-danger-foreground border-danger",
    icon: X,
  },
};

export function PermissionTriState({ value, onChange, disabled }: Props) {
  const { dict } = useI18n();
  return (
    <div className="inline-flex overflow-hidden rounded-md border border-input bg-background p-0.5">
      {ORDER.map((state) => {
        const active = value === state;
        const Icon = STYLES[state].icon;
        return (
          <button
            key={state}
            type="button"
            disabled={disabled}
            onClick={() => onChange(state)}
            aria-pressed={active}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-sm px-2.5 py-1 text-xs font-medium transition-colors",
              active
                ? `border ${STYLES[state].active}`
                : "border border-transparent text-muted-foreground hover:text-foreground",
              disabled ? "opacity-50" : "",
            )}
          >
            <Icon className="size-3" />
            <span>{dict.permissionState[state]}</span>
          </button>
        );
      })}
    </div>
  );
}

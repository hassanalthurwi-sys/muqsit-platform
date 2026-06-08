"use client";

import { FileSpreadsheet, FileText, ScanLine, Keyboard } from "lucide-react";
import { useI18n } from "@/components/providers/i18n-provider";
import type { MigrationInputMethod } from "@/lib/mock/types";
import { cn } from "@/lib/utils";

const METHODS: { key: MigrationInputMethod; Icon: typeof FileSpreadsheet }[] = [
  { key: "excel", Icon: FileSpreadsheet },
  { key: "pdf", Icon: FileText },
  { key: "scan", Icon: ScanLine },
  { key: "manual", Icon: Keyboard },
];

interface Props {
  selected?: MigrationInputMethod;
  onChoose: (m: MigrationInputMethod) => void;
}

export function InputMethodPicker({ selected, onChoose }: Props) {
  const { dict } = useI18n();
  const m = dict.migration;
  return (
    <div className="space-y-3">
      <p className="text-sm font-medium">{m.methodQuestion}</p>
      <div className="grid gap-3 sm:grid-cols-2">
        {METHODS.map(({ key, Icon }) => {
          const info = m.methods[key];
          const active = selected === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => onChoose(key)}
              className={cn(
                "flex items-start gap-3 rounded-xl border p-4 text-start transition-colors",
                active
                  ? "border-primary bg-primary-soft text-primary-soft-foreground"
                  : "border-input bg-card hover:bg-muted/50",
              )}
            >
              <span
                className={cn(
                  "grid size-10 shrink-0 place-items-center rounded-lg",
                  active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
                )}
              >
                <Icon className="size-5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold">{info.label}</p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  {info.hint}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

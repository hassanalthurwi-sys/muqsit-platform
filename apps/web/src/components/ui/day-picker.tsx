"use client";

import { useI18n } from "@/components/providers/i18n-provider";
import { cn } from "@/lib/utils";
import type { WeekDay } from "@/lib/mock/types";

const DAY_ORDER: WeekDay[] = ["sat", "sun", "mon", "tue", "wed", "thu", "fri"];

interface DayPickerProps {
  value: WeekDay[];
  onChange: (next: WeekDay[]) => void;
}

export function DayPicker({ value, onChange }: DayPickerProps) {
  const { dict } = useI18n();
  const labels = dict.officeSettings.workingHours.dayLabels;

  const toggle = (day: WeekDay) => {
    const set = new Set(value);
    if (set.has(day)) set.delete(day);
    else set.add(day);
    onChange(DAY_ORDER.filter((d) => set.has(d)));
  };

  return (
    <div className="flex flex-wrap gap-1.5">
      {DAY_ORDER.map((day) => {
        const active = value.includes(day);
        return (
          <button
            key={day}
            type="button"
            onClick={() => toggle(day)}
            className={cn(
              "min-w-[44px] rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-colors",
              active
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground",
            )}
          >
            {labels[day]}
          </button>
        );
      })}
    </div>
  );
}

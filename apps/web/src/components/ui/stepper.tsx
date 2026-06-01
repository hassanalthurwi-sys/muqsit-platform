import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface Step {
  key: string;
  label: string;
}

export function Stepper({
  steps,
  current,
  className,
}: {
  steps: Step[];
  current: number;
  className?: string;
}) {
  return (
    <ol className={cn("flex items-center gap-2", className)}>
      {steps.map((step, idx) => {
        const isDone = idx < current;
        const isActive = idx === current;
        return (
          <li key={step.key} className="flex flex-1 items-center gap-2">
            <div
              className={cn(
                "flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : isDone
                    ? "bg-primary-soft text-primary-soft-foreground"
                    : "bg-muted text-muted-foreground",
              )}
            >
              {isDone ? <Check className="size-3.5" /> : idx + 1}
            </div>
            <span
              className={cn(
                "min-w-0 truncate text-xs font-medium",
                isActive ? "text-foreground" : "text-muted-foreground",
              )}
            >
              {step.label}
            </span>
            {idx < steps.length - 1 ? (
              <span
                aria-hidden
                className={cn(
                  "mx-1 h-px flex-1",
                  idx < current ? "bg-primary" : "bg-border",
                )}
              />
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}

import { AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface AlertStripProps {
  title: string;
  hint?: string;
  action?: React.ReactNode;
  tone?: "warning" | "danger";
  className?: string;
}

const toneClasses: Record<NonNullable<AlertStripProps["tone"]>, string> = {
  warning: "border-warning-soft bg-warning-soft/60 text-warning-foreground",
  danger: "border-danger-soft bg-danger-soft/60 text-danger-foreground",
};

export function AlertStrip({
  title,
  hint,
  action,
  tone = "warning",
  className,
}: AlertStripProps) {
  return (
    <div
      role="alert"
      className={cn(
        "flex flex-wrap items-center gap-3 rounded-xl border px-4 py-3",
        toneClasses[tone],
        className,
      )}
    >
      <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-card/60">
        <AlertTriangle className="size-4" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold">{title}</p>
        {hint ? <p className="text-xs opacity-80">{hint}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

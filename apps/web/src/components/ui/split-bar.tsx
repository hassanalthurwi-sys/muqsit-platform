import { cn } from "@/lib/utils";

interface SplitBarSegment {
  label: string;
  value: number;
  className?: string;
}

interface SplitBarProps {
  segments: SplitBarSegment[];
  className?: string;
  showLegend?: boolean;
}

export function SplitBar({ segments, className, showLegend = true }: SplitBarProps) {
  const total = segments.reduce((sum, s) => sum + s.value, 0) || 1;

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex h-2 w-full overflow-hidden rounded-full bg-muted">
        {segments.map((s) => (
          <div
            key={s.label}
            className={cn("h-full", s.className ?? "bg-primary")}
            style={{ width: `${(s.value / total) * 100}%` }}
          />
        ))}
      </div>
      {showLegend ? (
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
          {segments.map((s) => (
            <span key={s.label} className="inline-flex items-center gap-1.5">
              <span
                className={cn("inline-block size-2 rounded-full", s.className ?? "bg-primary")}
                aria-hidden
              />
              <span>{s.label}</span>
              <span className="num font-medium text-foreground">
                {Math.round((s.value / total) * 100)}%
              </span>
            </span>
          ))}
        </div>
      ) : null}
    </div>
  );
}

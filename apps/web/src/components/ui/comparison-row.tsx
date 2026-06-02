import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

export function ComparisonRow({
  label,
  expected,
  actual,
  match,
  note,
}: {
  label: string;
  expected: React.ReactNode;
  actual: React.ReactNode;
  match: boolean;
  note?: string;
}) {
  return (
    <div className="grid grid-cols-[1fr_auto_auto] items-center gap-3 py-2 text-sm">
      <div className="min-w-0">
        <p className="font-medium">{label}</p>
        {note ? <p className="text-xs text-muted-foreground">{note}</p> : null}
      </div>
      <div className="num text-end text-muted-foreground">{expected}</div>
      <div
        className={cn(
          "num inline-flex items-center gap-1 text-end font-medium",
          match ? "text-success" : "text-danger",
        )}
      >
        {match ? <Check className="size-3.5" /> : <X className="size-3.5" />}
        {actual}
      </div>
    </div>
  );
}

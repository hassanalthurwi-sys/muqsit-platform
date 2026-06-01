import { cn } from "@/lib/utils";

interface TimelineItem {
  ts: string;
  text: string;
}

export function Timeline({ items, className }: { items: TimelineItem[]; className?: string }) {
  if (items.length === 0) return null;
  return (
    <ol className={cn("relative space-y-4 ps-5", className)}>
      <span
        aria-hidden
        className="absolute start-1.5 top-2 bottom-2 w-px bg-border"
      />
      {items.map((item, idx) => (
        <li key={`${item.ts}-${idx}`} className="relative">
          <span
            aria-hidden
            className={cn(
              "absolute -start-[1.4rem] top-1.5 size-2.5 rounded-full border-2 border-card",
              idx === 0 ? "bg-primary" : "bg-muted-foreground/50",
            )}
          />
          <p className="text-sm">{item.text}</p>
          <p className="num text-xs text-muted-foreground">{item.ts}</p>
        </li>
      ))}
    </ol>
  );
}

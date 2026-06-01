import { cn } from "@/lib/utils";

export function DataRow({
  label,
  value,
  className,
}: {
  label: string;
  value: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex items-baseline justify-between gap-3 py-1.5 text-sm", className)}>
      <dt className="shrink-0 text-muted-foreground">{label}</dt>
      <dd className="num text-end font-medium text-foreground">{value}</dd>
    </div>
  );
}

export function DataRows({ children }: { children: React.ReactNode }) {
  return <dl className="divide-y divide-border">{children}</dl>;
}

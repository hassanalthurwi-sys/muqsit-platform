import { cn } from "@/lib/utils";

type Tone = "default" | "primary" | "gold" | "success" | "warning" | "danger";

const toneClasses: Record<Tone, string> = {
  default: "bg-muted text-muted-foreground",
  primary: "bg-primary-soft text-primary-soft-foreground",
  gold: "bg-gold-soft text-gold-foreground",
  success: "bg-success-soft text-success-foreground",
  warning: "bg-warning-soft text-warning-foreground",
  danger: "bg-danger-soft text-danger-foreground",
};

export function StatusPill({
  children,
  tone = "default",
  className,
}: {
  children: React.ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
        toneClasses[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

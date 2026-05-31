import { cn } from "@/lib/utils";

interface KpiCardProps {
  label: string;
  hint?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  tone?: "default" | "warning" | "danger" | "success";
  footer?: React.ReactNode;
  className?: string;
}

const toneRing: Record<NonNullable<KpiCardProps["tone"]>, string> = {
  default: "border-border",
  warning: "border-warning-soft",
  danger: "border-danger-soft",
  success: "border-success-soft",
};

const toneIcon: Record<NonNullable<KpiCardProps["tone"]>, string> = {
  default: "bg-primary-soft text-primary-soft-foreground",
  warning: "bg-warning-soft text-warning-foreground",
  danger: "bg-danger-soft text-danger-foreground",
  success: "bg-success-soft text-success-foreground",
};

export function KpiCard({
  label,
  hint,
  icon,
  children,
  tone = "default",
  footer,
  className,
}: KpiCardProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-xl border bg-card p-5 shadow-[var(--shadow-card)] transition-shadow hover:shadow-[var(--shadow-card)]",
        toneRing[tone],
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="label">{label}</p>
        {icon ? (
          <span
            className={cn(
              "flex size-9 shrink-0 items-center justify-center rounded-lg [&_svg]:size-4",
              toneIcon[tone],
            )}
          >
            {icon}
          </span>
        ) : null}
      </div>
      <div className="text-2xl font-semibold leading-tight tracking-tight text-foreground sm:text-3xl lg:text-[2rem]">
        {children}
      </div>
      {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
      {footer ? <div className="pt-2">{footer}</div> : null}
    </div>
  );
}

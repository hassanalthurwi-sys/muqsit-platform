import { cn } from "@/lib/utils";

export function PortalCard({
  children,
  className,
  tone = "default",
  id,
}: {
  children: React.ReactNode;
  className?: string;
  tone?: "default" | "primary" | "warning";
  id?: string;
}) {
  const toneClass =
    tone === "primary"
      ? "bg-primary-soft text-primary-soft-foreground border-primary-soft"
      : tone === "warning"
        ? "bg-warning-soft text-warning-foreground border-warning-soft"
        : "bg-card border-border";
  return (
    <div
      id={id}
      className={cn(
        "rounded-2xl border p-5 shadow-[var(--shadow-soft)]",
        toneClass,
        className,
      )}
    >
      {children}
    </div>
  );
}

import { cn } from "@/lib/utils";

interface SettingsSectionProps {
  title: string;
  hint?: string;
  id?: string;
  children: React.ReactNode;
  className?: string;
}

export function SettingsSection({ title, hint, id, children, className }: SettingsSectionProps) {
  return (
    <section
      id={id}
      className={cn(
        "rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-soft)] sm:p-6",
        className,
      )}
    >
      <header className="mb-4 space-y-0.5">
        <h2 className="text-base font-semibold text-foreground">{title}</h2>
        {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
      </header>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

export function SettingsField({
  label,
  hint,
  children,
  className,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <label className="block text-xs font-medium text-muted-foreground">{label}</label>
      {children}
      {hint ? <p className="text-[11px] text-muted-foreground">{hint}</p> : null}
    </div>
  );
}

export function SettingsGrid({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-4 sm:grid-cols-2">{children}</div>;
}

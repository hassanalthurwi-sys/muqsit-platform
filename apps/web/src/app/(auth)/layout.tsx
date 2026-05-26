import { ThemeToggle } from "@/components/layout/theme-toggle";
import { LanguageToggle } from "@/components/layout/language-toggle";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <div className="absolute end-4 top-4 flex items-center gap-1">
        <LanguageToggle />
        <ThemeToggle />
      </div>
      {children}
    </div>
  );
}

import { AuthGuard } from "@/components/auth-guard";
import { AppShell } from "@/components/layout/app-shell";
import { ContractStoreProvider } from "@/lib/mock/store";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <ContractStoreProvider>
        <AppShell>{children}</AppShell>
      </ContractStoreProvider>
    </AuthGuard>
  );
}

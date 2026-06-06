// Portal route group — self-service investor and customer apps.
// Deliberately separate from the office (app) shell: no sidebar, no top bar,
// no auth guard. Each portal sub-route brings its own header + tab bar so the
// page can know which identity it serves.

import { ContractStoreProvider } from "@/lib/mock/store";

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <ContractStoreProvider>
      <div className="min-h-screen bg-background pb-[80px] lg:pb-0">{children}</div>
    </ContractStoreProvider>
  );
}

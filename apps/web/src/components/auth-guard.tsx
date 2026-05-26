"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/auth-provider";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { ready, isAuthenticated, tenant } = useAuth();

  useEffect(() => {
    if (!ready) return;
    if (!isAuthenticated) {
      router.replace("/login");
    } else if (!tenant) {
      router.replace("/select-tenant");
    }
  }, [ready, isAuthenticated, tenant, router]);

  if (!ready || !isAuthenticated || !tenant) {
    return null;
  }

  return <>{children}</>;
}

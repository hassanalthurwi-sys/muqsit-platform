"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Building2, ChevronLeft, ChevronRight } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth, type Tenant } from "@/components/providers/auth-provider";
import { useI18n } from "@/components/providers/i18n-provider";

const TENANTS: Tenant[] = [
  { id: "muqsit-capital", name: "Muqsit Capital" },
  { id: "al-noor-holdings", name: "Al Noor Holdings" },
  { id: "tadawul-partners", name: "Tadawul Partners" },
];

export default function SelectTenantPage() {
  const router = useRouter();
  const { ready, isAuthenticated, selectTenant } = useAuth();
  const { dict, dir } = useI18n();

  useEffect(() => {
    if (ready && !isAuthenticated) {
      router.replace("/login");
    }
  }, [ready, isAuthenticated, router]);

  const handleSelect = (tenant: Tenant) => {
    selectTenant(tenant);
    router.push("/dashboard");
  };

  const Chevron = dir === "rtl" ? ChevronLeft : ChevronRight;

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">{dict.auth.selectTenantTitle}</CardTitle>
        <CardDescription>{dict.auth.selectTenantSubtitle}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        {TENANTS.map((tenant) => (
          <button
            key={tenant.id}
            type="button"
            onClick={() => handleSelect(tenant)}
            className="flex w-full items-center gap-3 rounded-lg border p-4 text-start transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            <span className="flex size-10 items-center justify-center rounded-md bg-muted text-muted-foreground">
              <Building2 className="size-5" />
            </span>
            <span className="flex-1 font-medium">{tenant.name}</span>
            <Chevron className="size-4 text-muted-foreground" />
          </button>
        ))}
      </CardContent>
    </Card>
  );
}

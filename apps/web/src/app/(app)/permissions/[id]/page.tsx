"use client";

import { use, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusPill } from "@/components/ui/status-pill";
import { PermissionTriState } from "@/components/ui/permission-tri-state";
import { useStore } from "@/lib/mock/store";
import { useI18n } from "@/components/providers/i18n-provider";
import type {
  PermissionAction,
  PermissionGroup,
  PermissionState,
} from "@/lib/mock/types";

const GROUPS: Record<PermissionGroup, PermissionAction[]> = {
  contracts: ["createInstallmentContract", "editInstallments", "rescheduleContract", "deleteAttachment", "closeContract"],
  payments: ["approvePaymentProof", "rejectPaymentProof", "recordPartialPayment"],
  customers: ["createCustomer", "approveHighRiskCustomer"],
  investors: ["createInvestmentContract", "distributeProfits"],
  system: ["exportReport", "managePermissions"],
};

export default function RoleDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { dict } = useI18n();
  const { roles, employees, updateRolePermission } = useStore();
  const role = roles.find((r) => r.id === id);
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const p = dict.permissions;

  if (!role) {
    return (
      <div className="rounded-xl border bg-card p-8 text-center text-muted-foreground">
        الدور غير موجود.
      </div>
    );
  }

  const roleEmployees = employees.filter((e) => e.roleId === role.id);

  const handleChange = (action: PermissionAction, state: PermissionState) => {
    updateRolePermission(role.id, action, state);
    setSavedAt(Date.now());
  };

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-2">
          <Link href="/permissions" className="text-xs text-muted-foreground hover:text-foreground">
            {p.role.back}
          </Link>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{role.name}</h1>
            <StatusPill tone={role.isPreset ? "primary" : "gold"}>
              {role.isPreset ? p.presetBadge : p.customBadge}
            </StatusPill>
          </div>
          <p className="text-sm text-muted-foreground">{role.description}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" size="sm">
            {p.role.rename}
          </Button>
          <Button type="button" variant="outline" size="sm">
            {p.role.duplicate}
          </Button>
        </div>
      </header>

      {roleEmployees.length > 0 ? (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">
              {p.employeesLabel.replace("{n}", String(roleEmployees.length))}
            </CardTitle>
            <p className="text-xs text-muted-foreground">{p.role.bypassNote}</p>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {roleEmployees.map((e) => (
                <li
                  key={e.id}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border px-3 py-2"
                >
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium">{e.name}</p>
                    <p className="num text-xs text-muted-foreground" dir="ltr">{e.email}</p>
                  </div>
                  {e.bypassApprovals ? (
                    <StatusPill tone="success">{p.role.bypassToggle}</StatusPill>
                  ) : null}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      ) : null}

      <div className="space-y-4">
        {(Object.keys(GROUPS) as PermissionGroup[]).map((group) => (
          <Card key={group}>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">
                {dict.permissionGroup[group]}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {GROUPS[group].map((action) => (
                <div
                  key={action}
                  className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3 last:border-b-0 last:pb-0"
                >
                  <p className="text-sm font-medium">{dict.permissionAction[action]}</p>
                  <PermissionTriState
                    value={role.permissions[action]}
                    onChange={(s) => handleChange(action, s)}
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>

      {savedAt ? (
        <div className="rounded-lg border border-primary-soft bg-primary-soft/40 px-3 py-2 text-xs text-primary-soft-foreground">
          {p.role.saved}
        </div>
      ) : null}
    </div>
  );
}

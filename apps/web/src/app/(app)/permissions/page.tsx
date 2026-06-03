"use client";

import Link from "next/link";
import { Copy, Users, UsersRound } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusPill } from "@/components/ui/status-pill";
import { useStore } from "@/lib/mock/store";
import { useI18n } from "@/components/providers/i18n-provider";
import type { PermissionState } from "@/lib/mock/types";

function countByState(
  permissions: Record<string, PermissionState>,
): { allow: number; require: number; deny: number } {
  return Object.values(permissions).reduce(
    (acc, s) => {
      if (s === "allow") acc.allow += 1;
      else if (s === "requireApproval") acc.require += 1;
      else acc.deny += 1;
      return acc;
    },
    { allow: 0, require: 0, deny: 0 },
  );
}

export default function PermissionsPage() {
  const { dict } = useI18n();
  const { roles, employees } = useStore();
  const p = dict.permissions;

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <UsersRound className="size-6 text-primary" />
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{p.pageTitle}</h1>
          </div>
          <p className="text-sm text-muted-foreground">{p.pageSubtitle}</p>
        </div>
        <Button type="button" variant="outline" size="sm">
          {p.newRole}
        </Button>
      </header>

      <div className="grid gap-4 lg:grid-cols-2">
        {roles.map((role) => {
          const counts = countByState(role.permissions);
          const roleEmployees = employees.filter((e) => e.roleId === role.id);
          return (
            <Card key={role.id}>
              <CardContent className="space-y-3 p-5">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <Link href={`/permissions/${role.id}`} className="hover:underline">
                        <h2 className="text-base font-semibold">{role.name}</h2>
                      </Link>
                      <StatusPill tone={role.isPreset ? "primary" : "gold"}>
                        {role.isPreset ? p.presetBadge : p.customBadge}
                      </StatusPill>
                    </div>
                    <p className="text-xs text-muted-foreground">{role.description}</p>
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                    <Users className="size-3" />
                    {p.employeesLabel.replace("{n}", String(role.employeeCount))}
                  </span>
                </div>

                <p className="text-xs text-muted-foreground">
                  {p.actionsCount
                    .replace("{allow}", String(counts.allow))
                    .replace("{require}", String(counts.require))
                    .replace("{deny}", String(counts.deny))}
                </p>

                {roleEmployees.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5 border-t border-border pt-3">
                    {roleEmployees.map((e) => (
                      <span
                        key={e.id}
                        className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[11px]"
                      >
                        {e.name}
                        {e.bypassApprovals ? (
                          <span className="rounded-full bg-success-soft px-1 py-0.5 text-[9px] font-medium text-success-foreground">
                            موثوق
                          </span>
                        ) : null}
                      </span>
                    ))}
                  </div>
                ) : null}

                <div className="flex flex-wrap gap-2 pt-1">
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/permissions/${role.id}`}>{p.role.rename}</Link>
                  </Button>
                  <Button type="button" variant="ghost" size="sm" className="gap-1.5">
                    <Copy className="size-3.5" />
                    {p.role.duplicate}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

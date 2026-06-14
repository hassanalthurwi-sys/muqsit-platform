"use client";

import Link from "next/link";
import { UserPlus } from "lucide-react";
import { useI18n } from "@/components/providers/i18n-provider";
import { MOCK_SYSTEM_EMPLOYEES } from "@/lib/mock/admin-data";
import type { SystemPermissionAction } from "@/lib/mock/types";

const TOTAL_ACTIONS = 15;

function allowedCount(
  permissions: Record<SystemPermissionAction, "allow" | "requireApproval" | "deny">,
): number {
  return Object.values(permissions).filter((v) => v === "allow").length;
}

export default function SystemEmployeesPage() {
  const { dict, locale } = useI18n();
  const e = dict.admin.employees;

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{e.title}</h1>
          <p className="text-sm text-muted-foreground">{e.subtitle}</p>
        </div>
        <Link
          href="/admin/employees/new"
          className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          <UserPlus className="size-4" />
          {e.addEmployee}
        </Link>
      </header>

      <div className="overflow-x-auto rounded-2xl border bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-[11px] uppercase text-muted-foreground">
              <th className="px-3 py-3 text-start font-medium">{e.columns.name}</th>
              <th className="px-3 py-3 text-start font-medium">{e.columns.title}</th>
              <th className="px-3 py-3 text-start font-medium">{e.columns.phone}</th>
              <th className="px-3 py-3 text-start font-medium">{e.columns.permissions}</th>
              <th className="px-3 py-3 text-start font-medium">{e.columns.lastLogin}</th>
              <th className="px-3 py-3 text-start font-medium">{e.columns.status}</th>
              <th className="px-3 py-3 text-end font-medium">{e.columns.actions}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {MOCK_SYSTEM_EMPLOYEES.map((emp) => {
              const isAdmin = emp.role === "systemAdmin";
              const allowed = isAdmin ? TOTAL_ACTIONS : allowedCount(emp.permissions);
              return (
                <tr key={emp.id} className="hover:bg-muted/30">
                  <td className="px-3 py-3">
                    <p className="font-medium">{emp.name}</p>
                    {emp.email ? (
                      <p className="num text-[10px] text-muted-foreground" dir="ltr">
                        {emp.email}
                      </p>
                    ) : null}
                  </td>
                  <td className="px-3 py-3">
                    <p className="text-sm">{emp.title}</p>
                    {isAdmin ? (
                      <span className="mt-1 inline-flex items-center rounded-full bg-primary-soft px-2 py-0.5 text-[10px] font-medium text-primary-soft-foreground">
                        {e.authRole.systemAdmin}
                      </span>
                    ) : null}
                  </td>
                  <td className="num px-3 py-3 text-muted-foreground" dir="ltr">
                    {emp.phone}
                  </td>
                  <td className="px-3 py-3">
                    <span className="num text-xs text-muted-foreground">
                      {e.allowedCount
                        .replace("{n}", String(allowed))
                        .replace("{total}", String(TOTAL_ACTIONS))}
                    </span>
                  </td>
                  <td className="num px-3 py-3 text-xs text-muted-foreground">
                    {emp.lastLoginAt
                      ? new Date(emp.lastLoginAt).toLocaleDateString(
                          locale === "ar" ? "ar-SA-u-nu-latn" : "en-US",
                        )
                      : e.neverLoggedIn}
                  </td>
                  <td className="px-3 py-3">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${
                        emp.active
                          ? "bg-success/10 text-success"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {emp.active ? e.active : e.inactive}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-end">
                    <Link
                      href={`/admin/employees/${emp.id}`}
                      className="text-xs font-medium text-primary hover:underline"
                    >
                      {e.view}
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

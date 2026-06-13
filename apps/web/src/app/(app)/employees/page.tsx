"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, UserPlus, Users } from "lucide-react";
import { useI18n } from "@/components/providers/i18n-provider";
import { useStore } from "@/lib/mock/store";
import type { Employee } from "@/lib/mock/types";
import { cn } from "@/lib/utils";

type Filter = "all" | "active" | "pending" | "suspended";

export default function EmployeesListPage() {
  const { dict, locale } = useI18n();
  const { employees } = useStore();
  const e = dict.officeEmployees;
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return employees.filter((emp) => {
      if (filter === "active" && (!emp.active || emp.inviteStatus === "pending")) return false;
      if (filter === "pending" && emp.inviteStatus !== "pending") return false;
      if (filter === "suspended" && emp.active) return false;
      if (!q) return true;
      return (
        emp.name.toLowerCase().includes(q) ||
        (emp.phone ?? "").toLowerCase().includes(q) ||
        emp.email.toLowerCase().includes(q)
      );
    });
  }, [employees, filter, query]);

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{e.title}</h1>
          <p className="text-sm text-muted-foreground">{e.subtitle}</p>
        </div>
        <Link
          href="/employees/new"
          className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          <UserPlus className="size-4" />
          {e.inviteCta}
        </Link>
      </header>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-1.5">
          {(["all", "active", "pending", "suspended"] as const).map((key) => {
            const active = filter === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setFilter(key)}
                className={cn(
                  "rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
                  active
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/70",
                )}
              >
                {e.filters[key]}
              </button>
            );
          })}
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="pointer-events-none absolute start-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={dict.officeEmployees.searchPlaceholder}
            className="h-9 w-full rounded-md border bg-card ps-9 pe-3 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-[11px] uppercase text-muted-foreground">
              <th className="px-4 py-3 text-start font-medium">{e.columns.employee}</th>
              <th className="px-4 py-3 text-start font-medium">{e.columns.role}</th>
              <th className="px-4 py-3 text-start font-medium">{e.columns.phone}</th>
              <th className="px-4 py-3 text-start font-medium">{e.columns.lastLogin}</th>
              <th className="px-4 py-3 text-start font-medium">{e.columns.status}</th>
              <th className="px-4 py-3 text-end font-medium">{e.columns.actions}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rows.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-sm text-muted-foreground">
                  <Users className="mx-auto size-6 opacity-50" />
                </td>
              </tr>
            ) : (
              rows.map((emp) => (
                <tr key={emp.id} className="hover:bg-muted/30">
                  <td className="px-4 py-3">
                    <p className="font-medium">{emp.name}</p>
                    <p className="num text-[11px] text-muted-foreground" dir="ltr">
                      {emp.email}
                    </p>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{emp.roleName}</td>
                  <td className="num px-4 py-3 text-muted-foreground" dir="ltr">
                    {emp.phone ?? "—"}
                  </td>
                  <td className="num px-4 py-3 text-xs text-muted-foreground">
                    {emp.lastLoginAt
                      ? new Date(emp.lastLoginAt).toLocaleDateString(
                          locale === "ar" ? "ar-SA-u-nu-latn" : "en-US",
                        )
                      : e.detail.neverLoggedIn}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge emp={emp} />
                  </td>
                  <td className="px-4 py-3 text-end">
                    <Link
                      href={`/employees/${emp.id}`}
                      className="text-xs font-medium text-primary hover:underline"
                    >
                      {e.view}
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatusBadge({ emp }: { emp: Employee }) {
  const { dict } = useI18n();
  const e = dict.officeEmployees;
  if (emp.inviteStatus === "pending") {
    return (
      <span className="inline-flex items-center rounded-full bg-gold-soft px-2 py-0.5 text-[11px] font-medium text-gold-foreground">
        {e.inviteStatus.pending}
      </span>
    );
  }
  if (!emp.active) {
    return (
      <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
        {e.suspendedBadge}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center rounded-full bg-success/10 px-2 py-0.5 text-[11px] font-medium text-success">
      {e.activeBadge}
    </span>
  );
}

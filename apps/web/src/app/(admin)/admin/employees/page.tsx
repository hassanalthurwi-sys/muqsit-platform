"use client";

import { useI18n } from "@/components/providers/i18n-provider";
import { MOCK_SYSTEM_EMPLOYEES } from "@/lib/mock/admin-data";

export default function SystemEmployeesPage() {
  const { dict } = useI18n();
  const e = dict.admin.employees;

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{e.title}</h1>
          <p className="text-sm text-muted-foreground">{e.subtitle}</p>
        </div>
        <button
          type="button"
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          {e.addEmployee}
        </button>
      </header>

      <div className="overflow-x-auto rounded-2xl border bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-[11px] uppercase text-muted-foreground">
              <th className="px-4 py-3 text-start font-medium">{e.columns.name}</th>
              <th className="px-4 py-3 text-start font-medium">{e.columns.role}</th>
              <th className="px-4 py-3 text-start font-medium">{e.columns.phone}</th>
              <th className="px-4 py-3 text-start font-medium">{e.columns.permissions}</th>
              <th className="px-4 py-3 text-start font-medium">{e.columns.status}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {MOCK_SYSTEM_EMPLOYEES.map((emp) => (
              <tr key={emp.id} className="hover:bg-muted/30">
                <td className="px-4 py-3 font-medium">
                  {emp.name}
                  {emp.email ? (
                    <p className="num text-[10px] text-muted-foreground" dir="ltr">
                      {emp.email}
                    </p>
                  ) : null}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${
                      emp.role === "systemAdmin"
                        ? "bg-primary-soft text-primary-soft-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {e.role[emp.role]}
                  </span>
                </td>
                <td className="num px-4 py-3 text-muted-foreground" dir="ltr">
                  {emp.phone}
                </td>
                <td className="px-4 py-3">
                  <span className="num text-xs text-muted-foreground">
                    {emp.permissions.length}
                  </span>
                </td>
                <td className="px-4 py-3">
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

"use client";

import { useI18n } from "@/components/providers/i18n-provider";
import { MOCK_ADMIN_AUDIT } from "@/lib/mock/admin-data";

export default function AdminAuditPage() {
  const { dict, locale } = useI18n();
  const a = dict.admin.audit;

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{a.title}</h1>
        <p className="text-sm text-muted-foreground">{a.subtitle}</p>
      </header>

      <div className="overflow-x-auto rounded-2xl border bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-[11px] uppercase text-muted-foreground">
              <th className="px-4 py-3 text-start font-medium">{a.columns.ts}</th>
              <th className="px-4 py-3 text-start font-medium">{a.columns.actor}</th>
              <th className="px-4 py-3 text-start font-medium">{a.columns.action}</th>
              <th className="px-4 py-3 text-start font-medium">{a.columns.target}</th>
              <th className="px-4 py-3 text-start font-medium">{a.columns.notes}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {MOCK_ADMIN_AUDIT.map((entry) => (
              <tr key={entry.id} className="hover:bg-muted/30">
                <td className="num px-4 py-3 text-xs text-muted-foreground">
                  {new Date(entry.ts).toLocaleDateString(
                    locale === "ar" ? "ar-SA-u-nu-latn" : "en-US",
                  )}
                </td>
                <td className="px-4 py-3 text-sm">
                  {entry.actorName}
                  <p className="text-[10px] text-muted-foreground">
                    {entry.actorRole === "systemAdmin"
                      ? dict.admin.employees.authRole.systemAdmin
                      : dict.admin.employees.authRole.systemEmployee}
                  </p>
                </td>
                <td className="px-4 py-3 text-sm font-medium">
                  {a.actions[entry.action]}
                </td>
                <td className="px-4 py-3 text-sm text-muted-foreground">
                  {entry.targetOfficeName ?? "—"}
                </td>
                <td className="px-4 py-3 text-xs text-muted-foreground">
                  {entry.notes ?? "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

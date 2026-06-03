"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { History } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { SearchInput } from "@/components/ui/search-input";
import { useStore } from "@/lib/mock/store";
import { useI18n } from "@/components/providers/i18n-provider";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";

type Filter = "all" | "today" | "thisWeek";

const REFERENCE_TODAY_ISO = "2025-05-31";

function isSameDay(a: string, b: string): boolean {
  return a.slice(0, 10) === b.slice(0, 10);
}

function dayLabel(iso: string, dict: ReturnType<typeof useI18n>["dict"], locale: "ar" | "en"): string {
  if (isSameDay(iso, REFERENCE_TODAY_ISO)) return dict.audit.today;
  const yesterday = new Date(REFERENCE_TODAY_ISO);
  yesterday.setDate(yesterday.getDate() - 1);
  if (isSameDay(iso, yesterday.toISOString())) return dict.audit.yesterday;
  return formatDate(iso.slice(0, 10), locale);
}

function entityHref(kind: string, id: string): string | null {
  switch (kind) {
    case "customer":
      return `/customers/${id}`;
    case "contract":
      return `/contracts/${id}`;
    case "investmentContract":
      return `/investments/${id}`;
    case "proof":
      return `/collections/${id}`;
    case "role":
      return `/permissions/${id}`;
    default:
      return null;
  }
}

export default function AuditPage() {
  const { dict, locale } = useI18n();
  const { auditEntries, employees } = useStore();
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");

  const filters: Array<{ key: Filter; label: string }> = [
    { key: "all", label: dict.audit.filters.all },
    { key: "today", label: dict.audit.filters.today },
    { key: "thisWeek", label: dict.audit.filters.thisWeek },
  ];

  const filtered = useMemo(() => {
    const refTime = new Date(REFERENCE_TODAY_ISO).getTime();
    return auditEntries
      .filter((entry) => {
        if (filter === "today") return isSameDay(entry.ts, REFERENCE_TODAY_ISO);
        if (filter === "thisWeek") {
          const t = new Date(entry.ts).getTime();
          return refTime - t <= 7 * 24 * 60 * 60 * 1000;
        }
        return true;
      })
      .filter((entry) => {
        if (!query.trim()) return true;
        const q = query.trim().toLowerCase();
        const actor = employees.find((e) => e.id === entry.actorId)?.name ?? "";
        return (
          entry.summary.toLowerCase().includes(q) ||
          actor.toLowerCase().includes(q) ||
          entry.entity.label.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => (a.ts < b.ts ? 1 : -1));
  }, [auditEntries, employees, filter, query]);

  const grouped = useMemo(() => {
    const groups: Record<string, typeof filtered> = {};
    filtered.forEach((entry) => {
      const day = entry.ts.slice(0, 10);
      (groups[day] = groups[day] ?? []).push(entry);
    });
    return Object.entries(groups).sort((a, b) => (a[0] < b[0] ? 1 : -1));
  }, [filtered]);

  const actorName = (id: string) => employees.find((e) => e.id === id)?.name ?? "—";
  const actorRole = (id: string) => employees.find((e) => e.id === id)?.roleName ?? "";

  return (
    <div className="flex flex-col gap-6">
      <header className="space-y-1">
        <div className="flex items-center gap-2">
          <History className="size-6 text-primary" />
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{dict.audit.pageTitle}</h1>
        </div>
        <p className="text-sm text-muted-foreground">{dict.audit.pageSubtitle}</p>
      </header>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex flex-wrap gap-1.5">
          {filters.map((f) => {
            const active = filter === f.key;
            return (
              <button
                key={f.key}
                type="button"
                onClick={() => setFilter(f.key)}
                className={cn(
                  "rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
                  active
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/70",
                )}
              >
                {f.label}
              </button>
            );
          })}
        </div>
        <SearchInput value={query} onChange={setQuery} className="max-w-xs" />
      </div>

      {grouped.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center text-sm text-muted-foreground">
            {dict.audit.empty}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-5">
          {grouped.map(([day, entries]) => (
            <section key={day} className="space-y-3">
              <h2 className="num text-sm font-semibold text-muted-foreground">
                {dayLabel(day, dict, locale)}
              </h2>
              <Card>
                <CardContent className="px-0 pb-2 pt-0">
                  <ul className="divide-y divide-border">
                    {entries.map((entry) => {
                      const href = entityHref(entry.entity.kind, entry.entity.id);
                      return (
                        <li key={entry.id} className="flex flex-col gap-1.5 px-6 py-3">
                          <div className="flex flex-wrap items-center gap-2 text-sm">
                            <span className="num text-xs text-muted-foreground">
                              {entry.ts.slice(11, 16)}
                            </span>
                            <span className="font-medium">{actorName(entry.actorId)}</span>
                            <span className="text-xs text-muted-foreground">
                              ({actorRole(entry.actorId)})
                            </span>
                            <span className="text-muted-foreground">·</span>
                            <span className="font-medium text-primary">
                              {dict.permissionAction[entry.action]}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {entry.summary}
                            {href ? (
                              <>
                                {" "}
                                ·{" "}
                                <Link href={href} className="text-primary hover:underline">
                                  {entry.entity.label}
                                </Link>
                              </>
                            ) : (
                              <>
                                {" "}
                                · <span>{entry.entity.label}</span>
                              </>
                            )}
                          </p>
                          {entry.before || entry.after ? (
                            <div className="flex flex-wrap items-center gap-1.5 text-xs">
                              {entry.before ? (
                                <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-muted-foreground">
                                  {dict.audit.before}: <span className="num font-medium text-foreground">{entry.before}</span>
                                </span>
                              ) : null}
                              {entry.before && entry.after ? <span>→</span> : null}
                              {entry.after ? (
                                <span className="inline-flex items-center gap-1 rounded-full bg-primary-soft px-2 py-0.5 text-primary-soft-foreground">
                                  {dict.audit.after}: <span className="num font-medium">{entry.after}</span>
                                </span>
                              ) : null}
                            </div>
                          ) : null}
                        </li>
                      );
                    })}
                  </ul>
                </CardContent>
              </Card>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}

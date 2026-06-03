"use client";

import {
  Banknote,
  FileText,
  PieChart,
  Recycle,
  TrendingUp,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { StatusPill } from "@/components/ui/status-pill";
import { useI18n } from "@/components/providers/i18n-provider";

export default function InvestorPortalPage() {
  const { dict } = useI18n();
  const p = dict.portals.investor;

  const sections = [
    { key: "summary", icon: PieChart, ...p.sections.summary },
    { key: "contracts", icon: FileText, ...p.sections.contracts },
    { key: "profits", icon: Banknote, ...p.sections.profits },
    { key: "recycling", icon: Recycle, ...p.sections.recycling },
    { key: "statements", icon: TrendingUp, ...p.sections.statements },
  ];

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
      <header className="space-y-3">
        <StatusPill tone="gold">{p.previewBadge}</StatusPill>
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{p.title}</h1>
        <p className="text-sm leading-7 text-muted-foreground">{p.hero}</p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2">
        {sections.map((s) => {
          const Icon = s.icon;
          return (
            <Card key={s.key} className="border-dashed">
              <CardContent className="space-y-3 p-5">
                <div className="flex items-center gap-3">
                  <span className="flex size-10 items-center justify-center rounded-xl bg-primary-soft text-primary-soft-foreground">
                    <Icon className="size-5" />
                  </span>
                  <h2 className="text-base font-semibold">{s.title}</h2>
                </div>
                <p className="text-sm leading-6 text-muted-foreground">{s.hint}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

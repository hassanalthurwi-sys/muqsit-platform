"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/page-header";
import { useI18n } from "@/components/providers/i18n-provider";

export default function DashboardPage() {
  const { dict } = useI18n();

  const kpis = [
    { label: dict.dashboard.kpiContracts, value: "—" },
    { label: dict.dashboard.kpiClients, value: "—" },
    { label: dict.dashboard.kpiInvestors, value: "—" },
    { label: dict.dashboard.kpiAum, value: "—" },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title={dict.pages.dashboard.title} description={dict.pages.dashboard.description} />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi) => (
          <Card key={kpi.label}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {kpi.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{kpi.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

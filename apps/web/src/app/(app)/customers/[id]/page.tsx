"use client";

import { use } from "react";
import Link from "next/link";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Currency } from "@/components/ui/currency";
import { StatusPill } from "@/components/ui/status-pill";
import { IdentityBadge } from "@/components/ui/identity-badge";
import { RiskClassBadge } from "@/components/ui/risk-class-badge";
import { DataRow, DataRows } from "@/components/ui/data-row";
import { InstallmentStatusPill } from "@/components/ui/installment-status-pill";
import { InvestorAvatar } from "@/components/investor-avatar";
import { useStore } from "@/lib/mock/store";
import { customerContracts } from "@/lib/mock/installment-contracts";
import { useI18n } from "@/components/providers/i18n-provider";
import { formatDate } from "@/lib/format";

export default function CustomerProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { dict, locale } = useI18n();
  const { customers } = useStore();
  const customer = customers.find((c) => c.id === id);

  if (!customer) {
    return (
      <div className="rounded-xl border bg-card p-8 text-center text-muted-foreground">
        العميل غير موجود.
      </div>
    );
  }

  const p = dict.customers.profile;
  const contracts = customerContracts(customer.id);

  const identityFields: Array<[string, string]> = (() => {
    const idf = dict.identityFieldLabel;
    const ident = customer.identity;
    switch (ident.kind) {
      case "saudiIndividual":
        return [[idf.nationalId, ident.nationalId]];
      case "gccIndividual":
        return [
          [idf.gccId, ident.gccId],
          [idf.country, ident.country],
        ];
      case "foreignIndividual":
        return [
          [idf.passport, ident.passport],
          [idf.nationality, ident.nationality],
        ];
    }
  })();

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-wrap items-start gap-4">
        <InvestorAvatar name={customer.name} kind={customer.identity.kind} size="lg" />
        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-semibold tracking-tight">{customer.name}</h1>
            <IdentityBadge kind={customer.identity.kind} />
            <RiskClassBadge risk={customer.riskClass} />
          </div>
          <p className="text-sm text-muted-foreground">
            {p.bornOn} {formatDate(customer.dateOfBirth, locale)} · {p.customerSince}{" "}
            {formatDate(customer.createdAt, locale)}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href={`/collections/whatsapp/${customer.id}`}
            className="inline-flex items-center gap-1.5 rounded-md border border-input bg-background px-3 py-2 text-sm font-medium hover:bg-accent"
          >
            <MessageCircle className="size-4" />
            {p.whatsapp}
          </Link>
          <Link
            href="/contracts/new"
            className="inline-flex items-center gap-1 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            {p.newContract}
          </Link>
        </div>
      </header>

      {/* Contact / employment / address */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">{p.contactSection}</CardTitle>
          </CardHeader>
          <CardContent>
            <DataRows>
              <DataRow
                label={dict.customers.create.mobile}
                value={
                  <span className="inline-flex items-center gap-1.5">
                    <Phone className="size-3.5 text-muted-foreground" />
                    <span className="num text-xs" dir="ltr">{customer.mobile}</span>
                  </span>
                }
              />
              {identityFields.map(([label, val]) => (
                <DataRow key={label} label={label} value={<span dir="ltr">{val}</span>} />
              ))}
              <DataRow label={dict.customers.create.nationality} value={customer.nationality} />
            </DataRows>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">{p.employmentSection}</CardTitle>
          </CardHeader>
          <CardContent>
            <DataRows>
              <DataRow label={p.employer} value={customer.employer} />
              <DataRow
                label={p.salary}
                value={<Currency value={customer.monthlySalary} />}
              />
              <DataRow
                label={p.obligations}
                value={
                  customer.obligations ? (
                    <Currency value={customer.obligations} />
                  ) : (
                    <span className="text-muted-foreground">{p.noObligations}</span>
                  )
                }
              />
            </DataRows>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">{p.addressSection}</CardTitle>
          </CardHeader>
          <CardContent>
            <DataRows>
              <DataRow label={dict.customers.create.city} value={customer.city} />
              <DataRow
                label={dict.customers.create.address}
                value={
                  <span className="inline-flex items-start gap-1.5">
                    <MapPin className="size-3.5 shrink-0 text-muted-foreground" />
                    <span className="text-end">{customer.address}</span>
                  </span>
                }
              />
            </DataRows>
          </CardContent>
        </Card>
      </div>

      {/* Contracts */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">
            {p.contractsSection} ({contracts.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="px-0 pb-2 pt-0">
          {contracts.length === 0 ? (
            <p className="px-6 py-6 text-sm text-muted-foreground">{p.noContracts}</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-[11px] uppercase text-muted-foreground">
                    <th className="px-6 py-2 text-start font-medium">{dict.installmentContracts.columns.number}</th>
                    <th className="px-6 py-2 text-start font-medium">{dict.installmentContracts.columns.product}</th>
                    <th className="px-6 py-2 text-start font-medium">{dict.installmentContracts.columns.monthlyInstallment}</th>
                    <th className="px-6 py-2 text-start font-medium">{dict.installmentContracts.columns.installmentsCount}</th>
                    <th className="px-6 py-2 text-start font-medium">{dict.installmentContracts.columns.remainingBalance}</th>
                    <th className="px-6 py-2 text-start font-medium">{dict.installmentContracts.columns.status}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {contracts.map((co) => {
                    const paidCount = co.schedule.filter((s) => s.status === "paid").length;
                    return (
                      <tr key={co.id} className="hover:bg-muted/40">
                        <td className="px-6 py-2.5">
                          <Link
                            href={`/contracts/${co.id}`}
                            className="num font-medium text-primary hover:underline"
                          >
                            {co.number}
                          </Link>
                        </td>
                        <td className="px-6 py-2.5">{co.productType}</td>
                        <td className="num px-6 py-2.5">
                          <Currency value={co.monthlyInstallment} />
                        </td>
                        <td className="num px-6 py-2.5">
                          {paidCount} / {co.installmentsCount}
                        </td>
                        <td className="num px-6 py-2.5">
                          <Currency value={co.remainingBalance} compact />
                        </td>
                        <td className="px-6 py-2.5">
                          <StatusPill
                            tone={
                              co.status === "active"
                                ? "success"
                                : co.status === "defaulted"
                                  ? "danger"
                                  : co.status === "completed"
                                    ? "primary"
                                    : "default"
                            }
                          >
                            {dict.installmentContractStatus[co.status]}
                          </StatusPill>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">{p.notesSection}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-7">{customer.notes || "—"}</p>
        </CardContent>
      </Card>
    </div>
  );
}

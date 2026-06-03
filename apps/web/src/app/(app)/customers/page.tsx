"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Currency } from "@/components/ui/currency";
import { IdentityBadge } from "@/components/ui/identity-badge";
import { RiskClassBadge } from "@/components/ui/risk-class-badge";
import { SearchInput } from "@/components/ui/search-input";
import { InvestorAvatar } from "@/components/investor-avatar";
import { customerContracts } from "@/lib/mock/installment-contracts";
import { useStore } from "@/lib/mock/store";
import { useI18n } from "@/components/providers/i18n-provider";

export default function CustomersPage() {
  const { dict } = useI18n();
  const { customers } = useStore();
  const c = dict.customers;
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!query.trim()) return customers;
    const q = query.trim().toLowerCase();
    return customers.filter(
      (cu) =>
        cu.name.toLowerCase().includes(q) ||
        cu.city.toLowerCase().includes(q) ||
        cu.employer.toLowerCase().includes(q) ||
        cu.mobile.includes(q),
    );
  }, [customers, query]);

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{c.pageTitle}</h1>
          <p className="text-sm text-muted-foreground">{c.pageSubtitle}</p>
        </div>
        <Link
          href="/customers/new"
          className="inline-flex items-center gap-1 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          {c.newCustomer}
        </Link>
      </header>

      <SearchInput value={query} onChange={setQuery} className="max-w-sm" />

      <Card>
        <CardContent className="px-0 pb-2 pt-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-[11px] uppercase text-muted-foreground">
                  <th className="px-6 py-3 text-start font-medium">{c.columns.customer}</th>
                  <th className="px-6 py-3 text-start font-medium">{c.columns.identity}</th>
                  <th className="px-6 py-3 text-start font-medium">{c.columns.mobile}</th>
                  <th className="px-6 py-3 text-start font-medium">{c.columns.city}</th>
                  <th className="px-6 py-3 text-start font-medium">{c.columns.employer}</th>
                  <th className="px-6 py-3 text-start font-medium">{c.columns.salary}</th>
                  <th className="px-6 py-3 text-start font-medium">{c.columns.contracts}</th>
                  <th className="px-6 py-3 text-start font-medium">{c.columns.risk}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((cust) => {
                  const contracts = customerContracts(cust.id);
                  return (
                    <tr key={cust.id} className="hover:bg-muted/40">
                      <td className="px-6 py-3">
                        <Link href={`/customers/${cust.id}`} className="flex items-center gap-3">
                          <InvestorAvatar name={cust.name} kind={cust.identity.kind} size="sm" />
                          <span className="font-medium hover:underline">{cust.name}</span>
                        </Link>
                      </td>
                      <td className="px-6 py-3">
                        <IdentityBadge kind={cust.identity.kind} />
                      </td>
                      <td className="num px-6 py-3 text-xs text-muted-foreground" dir="ltr">
                        {cust.mobile}
                      </td>
                      <td className="px-6 py-3 text-muted-foreground">{cust.city}</td>
                      <td className="px-6 py-3 text-muted-foreground">{cust.employer}</td>
                      <td className="num px-6 py-3">
                        <Currency value={cust.monthlySalary} compact />
                      </td>
                      <td className="num px-6 py-3 font-medium">{contracts.length}</td>
                      <td className="px-6 py-3">
                        <RiskClassBadge risk={cust.riskClass} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

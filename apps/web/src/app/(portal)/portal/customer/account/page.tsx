"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, FileText, Globe, LifeBuoy, LogOut, Settings, User } from "lucide-react";
import { CustomerShell } from "@/components/portal/customer-shell";
import { PortalCard } from "@/components/portal/portal-card";
import { useI18n } from "@/components/providers/i18n-provider";
import { useCustomerIdentity } from "@/lib/portal/use-portal-identity";
import { formatDate } from "@/lib/format";

export default function CustomerAccountPage() {
  const { dict, locale, dir } = useI18n();
  const t = dict.portals.customer.account;
  const customer = useCustomerIdentity();
  const Arrow = dir === "rtl" ? ArrowLeft : ArrowRight;

  const links: { href: string; icon: React.ComponentType<{ className?: string }>; title: string; hint: string }[] = [
    { href: "#profile", icon: User, ...t.sections.profile },
    { href: "/portal/customer/documents", icon: FileText, ...t.sections.documents },
    { href: "#preferences", icon: Settings, ...t.sections.preferences },
    { href: "#support", icon: LifeBuoy, ...t.sections.support },
  ];

  return (
    <CustomerShell>
      <div className="space-y-5">
        <header className="space-y-1">
          <h1 className="text-xl font-semibold tracking-tight">{t.pageTitle}</h1>
        </header>

        {/* Profile summary */}
        <PortalCard className="flex items-start gap-3">
          <span className="flex size-12 items-center justify-center rounded-full bg-primary-soft text-base font-semibold text-primary-soft-foreground">
            {customer.name.split(" ")[0]?.[0] ?? "؟"}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-base font-semibold text-foreground">{customer.name}</p>
            <p className="num truncate text-xs text-muted-foreground">{customer.mobile}</p>
            <p className="num mt-1 text-[11px] text-muted-foreground">
              {t.memberSince}: {formatDate(customer.createdAt, locale)}
            </p>
          </div>
        </PortalCard>

        <PortalCard id="profile">
          <p className="mb-2 text-[11px] font-medium text-muted-foreground">{customer.city}</p>
          <p className="text-sm text-foreground">{customer.address}</p>
        </PortalCard>

        <ul className="space-y-2">
          {links.map((l) => {
            const Icon = l.icon;
            return (
              <li key={l.title}>
                <Link
                  href={l.href}
                  className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 transition-colors hover:border-primary/40"
                >
                  <span className="flex size-10 items-center justify-center rounded-xl bg-primary-soft text-primary-soft-foreground">
                    <Icon className="size-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-foreground">{l.title}</p>
                    <p className="text-xs text-muted-foreground">{l.hint}</p>
                  </div>
                  <Arrow className="size-4 text-muted-foreground" aria-hidden />
                </Link>
              </li>
            );
          })}
        </ul>

        <button
          type="button"
          className="flex w-full items-center justify-center gap-2 rounded-2xl border border-border bg-card p-3 text-sm font-medium text-danger hover:bg-danger-soft"
        >
          <LogOut className="size-4" aria-hidden />
          {dict.portals.common.logout}
        </button>

        <p className="text-center text-[11px] text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <Globe className="size-3" aria-hidden />
            {dict.portals.common.poweredBy}
          </span>
        </p>
      </div>
    </CustomerShell>
  );
}

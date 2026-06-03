"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, FileText, Globe, LifeBuoy, LineChart, LogOut, Settings, User } from "lucide-react";
import { InvestorShell } from "@/components/portal/investor-shell";
import { PortalCard } from "@/components/portal/portal-card";
import { useI18n } from "@/components/providers/i18n-provider";
import { useInvestorIdentity } from "@/lib/portal/use-portal-identity";
import { formatDate, formatIban } from "@/lib/format";

export default function InvestorAccountPage() {
  const { dict, locale, dir } = useI18n();
  const t = dict.portals.investor.account;
  const investor = useInvestorIdentity();
  const Arrow = dir === "rtl" ? ArrowLeft : ArrowRight;

  const links: { href: string; icon: React.ComponentType<{ className?: string }>; title: string; hint: string }[] = [
    { href: "#profile", icon: User, ...t.sections.profile },
    { href: "/portal/investor/statements", icon: FileText, ...t.sections.statements },
    { href: "/portal/investor/simulator", icon: LineChart, ...t.sections.simulator },
    { href: "#preferences", icon: Settings, ...t.sections.preferences },
    { href: "#support", icon: LifeBuoy, ...t.sections.support },
  ];

  return (
    <InvestorShell>
      <div className="space-y-5">
        <header className="space-y-1">
          <h1 className="text-xl font-semibold tracking-tight">{t.pageTitle}</h1>
        </header>

        {/* Profile summary */}
        <PortalCard className="flex items-start gap-3">
          <span className="flex size-12 items-center justify-center rounded-full bg-primary-soft text-base font-semibold text-primary-soft-foreground">
            {investor.name.split(" ")[0]?.[0] ?? "؟"}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-base font-semibold text-foreground">{investor.name}</p>
            <p className="num truncate text-xs text-muted-foreground">{investor.phone}</p>
            <p className="num mt-1 text-[11px] text-muted-foreground">
              {t.memberSince}: {formatDate(investor.joinedAt, locale)}
            </p>
          </div>
        </PortalCard>

        {/* Bank account row */}
        <PortalCard id="profile">
          <p className="mb-2 text-[11px] font-medium text-muted-foreground">{investor.bankAccount.bankName}</p>
          <p className="num text-sm text-foreground" dir="ltr">{formatIban(investor.bankAccount.iban)}</p>
          {investor.bankAccount.accountHolder ? (
            <p className="mt-1 text-xs text-muted-foreground">{investor.bankAccount.accountHolder}</p>
          ) : null}
        </PortalCard>

        {/* Action cards */}
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

        {/* Sign out (mock) */}
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
    </InvestorShell>
  );
}

"use client";

import { Bell, Home, PieChart, User, Wallet } from "lucide-react";
import { PortalHeader } from "@/components/portal/portal-header";
import { PortalTabBar, type PortalTab } from "@/components/portal/portal-tab-bar";
import { useI18n } from "@/components/providers/i18n-provider";
import { useInvestorIdentity } from "@/lib/portal/use-portal-identity";
import { investorNotifications } from "@/lib/portal/data";

export function InvestorShell({ children }: { children: React.ReactNode }) {
  const { dict } = useI18n();
  const investor = useInvestorIdentity();
  const t = dict.portals.tabs.investor;
  const unread = investorNotifications().filter((n) => n.unread).length;

  const tabs: PortalTab[] = [
    { href: "/portal/investor", label: t.home, icon: Home },
    { href: "/portal/investor/investments", label: t.investments, icon: Wallet, matchPrefix: "/portal/investor/investments" },
    { href: "/portal/investor/profits", label: t.profits, icon: PieChart },
    { href: "/portal/investor/notifications", label: t.notifications, icon: Bell },
    { href: "/portal/investor/account", label: t.account, icon: User, matchPrefix: "/portal/investor/account" },
  ];

  // Short greeting name — first word of full name keeps the header tidy on mobile.
  const shortName = investor.name.split(" ")[0];

  return (
    <>
      <PortalHeader
        brand={dict.portals.brand.investor}
        notificationsHref="/portal/investor/notifications"
        unreadCount={unread}
        greeting={shortName}
      />
      <PortalTabBar tabs={tabs} />
      <main className="mx-auto w-full max-w-2xl px-4 py-5 lg:max-w-6xl lg:px-6 lg:py-8">{children}</main>
    </>
  );
}

"use client";

import { Bell, CalendarDays, CreditCard, Home, User } from "lucide-react";
import { PortalHeader } from "@/components/portal/portal-header";
import { PortalTabBar, type PortalTab } from "@/components/portal/portal-tab-bar";
import { useI18n } from "@/components/providers/i18n-provider";
import { useCustomerIdentity } from "@/lib/portal/use-portal-identity";
import { customerNotifications } from "@/lib/portal/data";

export function CustomerShell({ children }: { children: React.ReactNode }) {
  const { dict } = useI18n();
  const customer = useCustomerIdentity();
  const t = dict.portals.tabs.customer;
  const unread = customerNotifications().filter((n) => n.unread).length;

  const tabs: PortalTab[] = [
    { href: "/portal/customer", label: t.home, icon: Home },
    { href: "/portal/customer/installments", label: t.installments, icon: CalendarDays },
    { href: "/portal/customer/payments", label: t.payments, icon: CreditCard, matchPrefix: "/portal/customer/payments" },
    { href: "/portal/customer/notifications", label: t.notifications, icon: Bell },
    { href: "/portal/customer/account", label: t.account, icon: User, matchPrefix: "/portal/customer/account" },
  ];

  const shortName = customer.name.split(" ")[0];

  return (
    <>
      <PortalHeader
        brand={dict.portals.brand.customer}
        notificationsHref="/portal/customer/notifications"
        unreadCount={unread}
        greeting={shortName}
      />
      <PortalTabBar tabs={tabs} />
      <main className="mx-auto w-full max-w-2xl px-4 py-5 lg:max-w-6xl lg:px-6 lg:py-8">{children}</main>
    </>
  );
}

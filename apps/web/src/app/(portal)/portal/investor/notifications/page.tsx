"use client";

import { InvestorShell } from "@/components/portal/investor-shell";
import { NotificationsList } from "@/components/portal/notifications-list";
import { useI18n } from "@/components/providers/i18n-provider";
import { investorNotifications } from "@/lib/portal/data";

export default function InvestorNotificationsPage() {
  const { dict } = useI18n();
  const t = dict.portals.investor.notifications;

  return (
    <InvestorShell>
      <div className="space-y-4">
        <header>
          <h1 className="text-xl font-semibold tracking-tight">{t.pageTitle}</h1>
        </header>
        <NotificationsList
          items={investorNotifications()}
          filters={{ all: t.filterAll, unread: t.filterUnread }}
          emptyLabel={t.empty}
        />
      </div>
    </InvestorShell>
  );
}

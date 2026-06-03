"use client";

import { CustomerShell } from "@/components/portal/customer-shell";
import { NotificationsList } from "@/components/portal/notifications-list";
import { useI18n } from "@/components/providers/i18n-provider";
import { customerNotifications } from "@/lib/portal/data";

export default function CustomerNotificationsPage() {
  const { dict } = useI18n();
  const t = dict.portals.customer.notifications;
  return (
    <CustomerShell>
      <div className="space-y-4">
        <header>
          <h1 className="text-xl font-semibold tracking-tight">{t.pageTitle}</h1>
        </header>
        <NotificationsList
          items={customerNotifications()}
          filters={{ all: t.filterAll, unread: t.filterUnread }}
          emptyLabel={t.empty}
        />
      </div>
    </CustomerShell>
  );
}

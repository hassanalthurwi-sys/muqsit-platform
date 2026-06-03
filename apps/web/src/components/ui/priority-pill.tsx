"use client";

import { StatusPill } from "@/components/ui/status-pill";
import { useI18n } from "@/components/providers/i18n-provider";
import type { ApprovalPriorityKey, NotificationPriorityKey } from "@/lib/i18n/dictionaries";

const APPROVAL_TONE: Record<ApprovalPriorityKey, "danger" | "default" | "primary"> = {
  critical: "danger",
  normal: "default",
  low: "primary",
};

const NOTIFICATION_TONE: Record<NotificationPriorityKey, "danger" | "warning" | "primary"> = {
  critical: "danger",
  warning: "warning",
  info: "primary",
};

export function ApprovalPriorityPill({ priority }: { priority: ApprovalPriorityKey }) {
  const { dict } = useI18n();
  return <StatusPill tone={APPROVAL_TONE[priority]}>{dict.approvalPriority[priority]}</StatusPill>;
}

export function NotificationPriorityPill({ priority }: { priority: NotificationPriorityKey }) {
  const { dict } = useI18n();
  return <StatusPill tone={NOTIFICATION_TONE[priority]}>{dict.notificationPriority[priority]}</StatusPill>;
}

export function ApprovalStatusPill({
  status,
}: {
  status: "pending" | "approved" | "rejected" | "needsClarification" | "escalated";
}) {
  const { dict } = useI18n();
  const tone =
    status === "approved"
      ? "success"
      : status === "rejected"
        ? "danger"
        : status === "needsClarification" || status === "escalated"
          ? "warning"
          : "default";
  return <StatusPill tone={tone}>{dict.approvalStatus[status]}</StatusPill>;
}

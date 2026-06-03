"use client";

import { Banknote, CreditCard, Landmark, Receipt, Smartphone } from "lucide-react";
import { StatusPill } from "@/components/ui/status-pill";
import { useI18n } from "@/components/providers/i18n-provider";
import type {
  PaymentMethodKey,
  VoucherStatusKey,
} from "@/lib/i18n/dictionaries";

const METHOD_ICON = {
  cash: Banknote,
  bankTransfer: Landmark,
  stcPay: Smartphone,
  cheque: Receipt,
  card: CreditCard,
};

export function PaymentMethodChip({ method }: { method: PaymentMethodKey }) {
  const { dict } = useI18n();
  const Icon = METHOD_ICON[method];
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
      <Icon className="size-3" />
      {dict.paymentMethod[method]}
    </span>
  );
}

export function VoucherStatusPill({ status }: { status: VoucherStatusKey }) {
  const { dict } = useI18n();
  const tone =
    status === "verified" ? "success" : status === "cancelled" ? "danger" : "warning";
  return <StatusPill tone={tone}>{dict.voucherStatus[status]}</StatusPill>;
}

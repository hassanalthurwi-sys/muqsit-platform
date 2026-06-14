"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  CreditCard,
  Wallet,
  Building2,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { useI18n } from "@/components/providers/i18n-provider";
import { findPlan } from "@/lib/mock/plans";
import type {
  SubscriptionDuration,
  SubscriptionPaymentMethod,
} from "@/lib/mock/types";

const METHOD_ORDER: SubscriptionPaymentMethod[] = [
  "mada",
  "applePay",
  "stcPay",
  "visa",
  "mastercard",
  "bankTransfer",
];

// Wrapper required for useSearchParams under Next.js 15.
export default function CheckoutPage() {
  return (
    <Suspense fallback={null}>
      <CheckoutInner />
    </Suspense>
  );
}

function CheckoutInner() {
  const router = useRouter();
  const params = useSearchParams();
  const { dict, dir, locale } = useI18n();
  const t = dict.officeSubscription;
  const BackArrow = dir === "rtl" ? ArrowRight : ArrowLeft;
  const numLocale = locale === "ar" ? "ar-SA-u-nu-latn" : "en-US";

  const planId = params.get("plan") ?? "";
  const duration = Number(params.get("duration") ?? "12") as SubscriptionDuration;
  const plan = findPlan(planId);

  const [method, setMethod] = useState<SubscriptionPaymentMethod>("mada");
  const [done, setDone] = useState(false);

  if (!plan) {
    return (
      <div className="mx-auto max-w-2xl rounded-2xl border bg-card p-6 text-center text-sm text-muted-foreground">
        Plan not found.
      </div>
    );
  }

  const price = plan.prices[duration];

  function pay(ev: React.FormEvent) {
    ev.preventDefault();
    setDone(true);
  }

  if (done) {
    return (
      <div className="mx-auto flex max-w-2xl flex-col items-center gap-6 py-12 text-center">
        <span className="grid size-20 place-items-center rounded-full bg-success/10 text-success">
          <CheckCircle2 className="size-10" />
        </span>
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">{t.success.title}</h1>
          <p className="text-sm text-muted-foreground">{t.success.subtitle}</p>
        </div>
        <div className="w-full max-w-sm space-y-2 rounded-2xl border bg-card p-4 text-sm">
          <Row label={t.checkout.planRow} value={plan.name} />
          <Row label={t.checkout.durationRow} value={dict.admin.plans.durationLabels[duration]} />
          <Row
            label={t.checkout.total}
            value={
              <span className="num font-semibold tabular-nums">
                {price.toLocaleString(numLocale)} {dict.admin.plans.currency}
              </span>
            }
          />
          <Row label={t.checkout.paymentMethod} value={t.paymentMethods[method]} />
        </div>
        <Link
          href="/"
          className="rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          {t.success.backHome}
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={pay} className="mx-auto flex max-w-3xl flex-col gap-6">
      <Link
        href="/subscription"
        className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
      >
        <BackArrow className="size-3" />
        {t.checkout.backToPlans}
      </Link>

      <header className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">{t.checkout.title}</h1>
        <p className="text-sm text-muted-foreground">{t.checkout.subtitle}</p>
      </header>

      <section className="rounded-2xl border bg-card p-5">
        <h2 className="mb-3 text-sm font-semibold">{t.checkout.orderSummary}</h2>
        <dl className="space-y-2 text-sm">
          <Row
            label={t.checkout.planRow}
            value={
              <span className="inline-flex items-center gap-2">
                <span className="font-medium">{plan.name}</span>
                {Object.values(plan.features).some(Boolean) ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-primary-soft px-2 py-0.5 text-[10px] font-medium text-primary">
                    <Sparkles className="size-3" />
                    Pro
                  </span>
                ) : null}
              </span>
            }
          />
          <Row
            label={t.checkout.durationRow}
            value={<span className="text-xs">{dict.admin.plans.durationLabels[duration]}</span>}
          />
          <div className="border-t pt-2">
            <Row
              label={<span className="font-medium">{t.checkout.total}</span>}
              value={
                <span className="num text-lg font-bold tabular-nums">
                  {price.toLocaleString(numLocale)} {dict.admin.plans.currency}
                </span>
              }
            />
          </div>
        </dl>
      </section>

      <section className="rounded-2xl border bg-card p-5">
        <h2 className="mb-1 text-sm font-semibold">{t.checkout.paymentMethod}</h2>
        <p className="mb-4 flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <ShieldCheck className="size-3.5 text-success" />
          {t.checkout.paymentMethodHint}
        </p>
        <div className="grid gap-2 sm:grid-cols-2">
          {METHOD_ORDER.map((m) => {
            const active = method === m;
            return (
              <button
                key={m}
                type="button"
                onClick={() => setMethod(m)}
                className={`flex items-start gap-3 rounded-lg border p-3 text-start transition-colors ${
                  active
                    ? "border-primary bg-primary-soft/40"
                    : "border-input hover:bg-muted"
                }`}
              >
                <PaymentLogo method={m} />
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-medium">{t.paymentMethods[m]}</span>
                  <span className="mt-0.5 block text-[11px] text-muted-foreground">
                    {t.paymentMethodHints[m]}
                  </span>
                </span>
                <span
                  className={`mt-0.5 grid size-4 shrink-0 place-items-center rounded-full border ${
                    active ? "border-primary bg-primary" : "border-input"
                  }`}
                >
                  {active ? <span className="size-1.5 rounded-full bg-white" /> : null}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <button
        type="submit"
        className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-6 py-3 text-base font-medium text-primary-foreground hover:bg-primary/90"
      >
        {t.checkout.payBtn.replace("{amount}", price.toLocaleString(numLocale))}
      </button>
    </form>
  );
}

function PaymentLogo({ method }: { method: SubscriptionPaymentMethod }) {
  const cls =
    "grid size-10 shrink-0 place-items-center rounded-lg border border-input bg-card";
  switch (method) {
    case "mada":
      return (
        <span className={cls}>
          <span className="text-[9px] font-bold tracking-wider text-primary">مدى</span>
        </span>
      );
    case "applePay":
      return (
        <span className={cls}>
          <span className="text-[9px] font-bold tracking-tight">Pay</span>
        </span>
      );
    case "stcPay":
      return (
        <span className={cls}>
          <Wallet className="size-4 text-primary" />
        </span>
      );
    case "visa":
      return (
        <span className={cls}>
          <span className="text-[10px] font-bold italic tracking-wider text-[#1a1f71]">
            VISA
          </span>
        </span>
      );
    case "mastercard":
      return (
        <span className={cls}>
          <CreditCard className="size-4 text-[#eb001b]" />
        </span>
      );
    case "bankTransfer":
      return (
        <span className={cls}>
          <Building2 className="size-4 text-muted-foreground" />
        </span>
      );
  }
}

function Row({
  label,
  value,
}: {
  label: React.ReactNode;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-baseline justify-between gap-3 py-1">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="text-sm">{value}</dd>
    </div>
  );
}

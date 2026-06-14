"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sparkles, AlarmClock, CheckCircle2 } from "lucide-react";
import { useI18n } from "@/components/providers/i18n-provider";
import { useAuth } from "@/components/providers/auth-provider";
import { MOCK_PLANS } from "@/lib/mock/plans";
import { FeatureCard } from "@/components/subscription/feature-card";
import { ChatWidget } from "@/components/subscription/chat-widget";
import type {
  SubscriptionDuration,
  SubscriptionFeature,
} from "@/lib/mock/types";

const DURATIONS: SubscriptionDuration[] = [6, 12, 24];
const ALL_FEATURES: SubscriptionFeature[] = [
  "aiAssistant",
  "ocr",
  "whatsappMessages",
  "smsMessages",
];

export default function OfficeSubscriptionPage() {
  const { dict, locale } = useI18n();
  const { office, daysLeftInTrial } = useAuth();
  const t = dict.officeSubscription;
  const numLocale = locale === "ar" ? "ar-SA-u-nu-latn" : "en-US";
  const router = useRouter();

  const [selectedDuration, setSelectedDuration] = useState<SubscriptionDuration>(12);
  const trialDays = daysLeftInTrial();

  const sortedPlans = [...MOCK_PLANS]
    .filter((p) => p.active)
    .sort((a, b) => a.displayOrder - b.displayOrder);

  function pickPlan(planId: string) {
    router.push(`/subscription/checkout?plan=${planId}&duration=${selectedDuration}`);
  }

  // Compute "save vs 6m" for 12m and 24m to surface a savings badge.
  function savePct(planId: string, d: SubscriptionDuration): number {
    const plan = sortedPlans.find((p) => p.id === planId);
    if (!plan) return 0;
    const monthly6 = plan.prices[6] / 6;
    const monthlyD = plan.prices[d] / d;
    if (monthly6 === 0) return 0;
    return Math.round(((monthly6 - monthlyD) / monthly6) * 100);
  }

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6 pb-24">
      {trialDays !== null && office?.subscriptionStatus === "trial" ? (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-gold-soft bg-gold-soft/30 px-4 py-3">
          <div className="flex items-center gap-2">
            <AlarmClock className="size-4 text-gold-foreground" />
            <div>
              <p className="text-sm font-medium text-gold-foreground">
                {t.trialBanner.title}
              </p>
              <p className="num text-xs text-gold-foreground/80">
                {t.trialBanner.remaining.replace("{days}", String(trialDays))}
              </p>
            </div>
          </div>
        </div>
      ) : null}

      <header className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{t.title}</h1>
        <p className="text-sm text-muted-foreground">{t.subtitle}</p>
      </header>

      <section className="rounded-2xl border bg-card p-5">
        <div className="space-y-1">
          <h2 className="text-sm font-semibold">{t.durationToggle.label}</h2>
        </div>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {DURATIONS.map((d) => {
            const active = selectedDuration === d;
            const proPlan = sortedPlans.find((p) =>
              Object.values(p.features).some(Boolean),
            );
            const pct = proPlan ? savePct(proPlan.id, d) : 0;
            return (
              <button
                key={d}
                type="button"
                onClick={() => setSelectedDuration(d)}
                className={`relative rounded-lg border p-3 text-center transition-colors ${
                  active
                    ? "border-primary bg-primary-soft text-primary-soft-foreground"
                    : "border-input hover:bg-muted"
                }`}
              >
                {pct > 0 ? (
                  <span className="absolute -top-2 start-2 rounded-full bg-success px-2 py-0.5 text-[9px] font-medium text-white">
                    {t.saveBadge.replace("{pct}", String(pct))}
                  </span>
                ) : null}
                <p className="text-sm font-medium">{dict.admin.plans.durationLabels[d]}</p>
              </button>
            );
          })}
        </div>
      </section>

      <section className="space-y-1">
        <h2 className="text-xl font-semibold">{t.compareHeading}</h2>
        <p className="text-sm text-muted-foreground">{t.compareSubtitle}</p>
      </section>

      <div className="grid gap-5 lg:grid-cols-2">
        {sortedPlans.map((plan) => {
          const isPro = Object.values(plan.features).some(Boolean);
          const price = plan.prices[selectedDuration];
          const monthly = Math.round(price / selectedDuration);
          const isCurrent = office?.id && (office as { planId?: string }).planId === plan.id;
          return (
            <article
              key={plan.id}
              className={`flex flex-col gap-5 rounded-2xl border bg-card p-6 shadow-sm ${
                isPro ? "ring-2 ring-primary/30" : ""
              }`}
            >
              <header className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold">{plan.name}</h3>
                    {isPro ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-primary-soft px-2 py-0.5 text-[10px] font-medium text-primary">
                        <Sparkles className="size-3" />
                        Pro
                      </span>
                    ) : null}
                    {isCurrent ? (
                      <span className="inline-flex items-center rounded-full bg-success/10 px-2 py-0.5 text-[10px] font-medium text-success">
                        {t.currentBadge}
                      </span>
                    ) : null}
                  </div>
                  <p className="text-xs text-muted-foreground">{plan.description}</p>
                </div>
              </header>

              <div className="space-y-1 border-y py-4">
                <div className="flex items-baseline gap-2">
                  <span className="num text-3xl font-bold tabular-nums">
                    {price.toLocaleString(numLocale)}
                  </span>
                  <span className="text-sm text-muted-foreground">{dict.admin.plans.currency}</span>
                  <span className="text-xs text-muted-foreground">/ {dict.admin.plans.durationLabels[selectedDuration]}</span>
                </div>
                <p className="num text-[11px] text-muted-foreground">
                  ≈ {monthly.toLocaleString(numLocale)} {dict.admin.plans.currency} {t.durationToggle.perMonth}
                </p>
              </div>

              <div className="space-y-3">
                {ALL_FEATURES.map((f) => (
                  <FeatureCard
                    key={f}
                    feature={f}
                    enabled={plan.features[f]}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={() => pickPlan(plan.id)}
                className={`mt-auto inline-flex items-center justify-center gap-2 rounded-md px-4 py-3 text-sm font-medium ${
                  isPro
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "border border-input bg-card hover:bg-muted"
                }`}
              >
                {isCurrent ? (
                  <>
                    <CheckCircle2 className="size-4" />
                    {t.currentBadge}
                  </>
                ) : (
                  t.chooseBtn
                )}
              </button>
            </article>
          );
        })}
      </div>

      <p className="text-center text-[11px] text-muted-foreground">
        <Link href="/" className="hover:text-foreground">
          {dict.officeEmployees.detail.back}
        </Link>
      </p>

      <ChatWidget />
    </div>
  );
}

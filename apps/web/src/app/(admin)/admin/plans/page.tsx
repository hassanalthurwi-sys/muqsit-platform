"use client";

import Link from "next/link";
import {
  Bot,
  ScanLine,
  MessageCircle,
  Smartphone,
  Check,
  X,
  Pencil,
  Package,
} from "lucide-react";
import { useI18n } from "@/components/providers/i18n-provider";
import { MOCK_PLANS } from "@/lib/mock/plans";
import type {
  SubscriptionDuration,
  SubscriptionFeature,
} from "@/lib/mock/types";

const FEATURE_ICONS: Record<SubscriptionFeature, typeof Bot> = {
  aiAssistant: Bot,
  ocr: ScanLine,
  whatsappMessages: MessageCircle,
  smsMessages: Smartphone,
};

const DURATIONS: SubscriptionDuration[] = [6, 12, 24];

export default function PlansListPage() {
  const { dict, locale } = useI18n();
  const p = dict.admin.plans;
  const numLocale = locale === "ar" ? "ar-SA-u-nu-latn" : "en-US";

  const sorted = [...MOCK_PLANS].sort((a, b) => a.displayOrder - b.displayOrder);

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{p.title}</h1>
          <p className="text-sm text-muted-foreground">{p.subtitle}</p>
        </div>
      </header>

      <div className="grid gap-5 lg:grid-cols-2">
        {sorted.map((plan) => {
          const enabledFeatures = (Object.keys(plan.features) as SubscriptionFeature[]).filter(
            (f) => plan.features[f],
          );
          return (
            <article
              key={plan.id}
              className="flex flex-col gap-5 rounded-2xl border bg-card p-6 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <span className="grid size-11 place-items-center rounded-2xl bg-primary-soft text-primary">
                    <Package className="size-5" />
                  </span>
                  <div className="space-y-1">
                    <h2 className="text-lg font-semibold">{plan.name}</h2>
                    <p className="text-xs text-muted-foreground">{plan.description}</p>
                  </div>
                </div>
                <span
                  className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ${
                    plan.active
                      ? "bg-success/10 text-success"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {plan.active ? p.activeBadge : p.inactiveBadge}
                </span>
              </div>

              <div className="space-y-2">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                  {p.featuresIncluded}
                </p>
                <ul className="space-y-1.5">
                  {(Object.keys(plan.features) as SubscriptionFeature[]).map((f) => {
                    const Icon = FEATURE_ICONS[f];
                    const on = plan.features[f];
                    return (
                      <li
                        key={f}
                        className={`flex items-center gap-2 text-sm ${
                          on ? "" : "text-muted-foreground/60"
                        }`}
                      >
                        <Icon
                          className={`size-3.5 shrink-0 ${
                            on ? "text-primary" : "text-muted-foreground/40"
                          }`}
                        />
                        <span className="flex-1">{p.featureNames[f]}</span>
                        {on ? (
                          <Check className="size-3.5 text-success" />
                        ) : (
                          <X className="size-3.5 text-muted-foreground/40" />
                        )}
                      </li>
                    );
                  })}
                </ul>
                {enabledFeatures.length === 0 ? (
                  <p className="pt-1 text-[11px] italic text-muted-foreground">
                    {p.noFeatures}
                  </p>
                ) : null}
              </div>

              <div className="space-y-2">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                  {p.pricingTitle}
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {DURATIONS.map((d) => (
                    <div
                      key={d}
                      className="rounded-lg border bg-muted/30 p-3 text-center"
                    >
                      <p className="text-[10px] text-muted-foreground">{p.durationLabels[d]}</p>
                      <p className="num mt-1 text-base font-semibold tabular-nums">
                        {plan.prices[d].toLocaleString(numLocale)}
                      </p>
                      <p className="text-[10px] text-muted-foreground">{p.currency}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end border-t pt-3">
                <Link
                  href={`/admin/plans/${plan.id}`}
                  className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-2 text-xs font-medium text-primary-foreground hover:bg-primary/90"
                >
                  <Pencil className="size-3.5" />
                  {p.edit}
                </Link>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}

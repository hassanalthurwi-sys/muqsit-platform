"use client";

import { use, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Bot,
  ScanLine,
  MessageCircle,
  Smartphone,
  Package,
  Save,
} from "lucide-react";
import { useI18n } from "@/components/providers/i18n-provider";
import { findPlan } from "@/lib/mock/plans";
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
const ALL_FEATURES: SubscriptionFeature[] = [
  "aiAssistant",
  "ocr",
  "whatsappMessages",
  "smsMessages",
];

export default function PlanEditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { dict, dir, locale } = useI18n();
  const p = dict.admin.plans;
  const BackArrow = dir === "rtl" ? ArrowRight : ArrowLeft;
  const numLocale = locale === "ar" ? "ar-SA-u-nu-latn" : "en-US";

  const plan = findPlan(id);

  const [name, setName] = useState(plan?.name ?? "");
  const [description, setDescription] = useState(plan?.description ?? "");
  const [features, setFeatures] = useState<Record<SubscriptionFeature, boolean>>(
    plan?.features ?? {
      aiAssistant: false,
      ocr: false,
      whatsappMessages: false,
      smsMessages: false,
    },
  );
  const [prices, setPrices] = useState<Record<SubscriptionDuration, number>>(
    plan?.prices ?? { 6: 0, 12: 0, 24: 0 },
  );
  const [active, setActive] = useState(plan?.active ?? true);
  const [savedAt, setSavedAt] = useState<number | null>(null);

  if (!plan) {
    return (
      <div className="rounded-xl border bg-card p-8 text-center text-muted-foreground">
        Plan not found.
      </div>
    );
  }

  function toggleFeature(f: SubscriptionFeature) {
    setFeatures((prev) => ({ ...prev, [f]: !prev[f] }));
  }

  function setPrice(d: SubscriptionDuration, value: string) {
    const n = Math.max(0, Math.floor(Number(value) || 0));
    setPrices((prev) => ({ ...prev, [d]: n }));
  }

  function save(ev: React.FormEvent) {
    ev.preventDefault();
    setSavedAt(Date.now());
    setTimeout(() => setSavedAt(null), 2500);
  }

  return (
    <form onSubmit={save} className="mx-auto flex max-w-3xl flex-col gap-6">
      <Link
        href="/admin/plans"
        className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
      >
        <BackArrow className="size-3" />
        {p.backToPlans}
      </Link>

      <header className="flex flex-wrap items-start gap-4">
        <span className="grid size-12 place-items-center rounded-2xl bg-primary-soft text-primary">
          <Package className="size-6" />
        </span>
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-semibold tracking-tight">{p.editorTitle}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{plan.name}</p>
        </div>
        <label className="inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1.5 text-xs">
          <input
            type="checkbox"
            checked={active}
            onChange={(ev) => setActive(ev.target.checked)}
            className="size-3.5 rounded border-input"
          />
          <span>{active ? p.activeBadge : p.inactiveBadge}</span>
        </label>
      </header>

      <section className="space-y-4 rounded-2xl border bg-card p-6">
        <div className="space-y-2">
          <label htmlFor="plan-name" className="text-sm font-medium">
            {p.nameLabel}
          </label>
          <input
            id="plan-name"
            value={name}
            onChange={(ev) => setName(ev.target.value)}
            required
            className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="plan-desc" className="text-sm font-medium">
            {p.descriptionLabel}
          </label>
          <textarea
            id="plan-desc"
            value={description}
            onChange={(ev) => setDescription(ev.target.value)}
            rows={3}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          />
        </div>
      </section>

      <section className="space-y-4 rounded-2xl border bg-card p-6">
        <div className="space-y-1">
          <h2 className="text-sm font-semibold">{p.featuresSection}</h2>
          <p className="text-[11px] text-muted-foreground">{p.featuresHint}</p>
        </div>
        <div className="space-y-2">
          {ALL_FEATURES.map((f) => {
            const Icon = FEATURE_ICONS[f];
            const on = features[f];
            return (
              <label
                key={f}
                className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors ${
                  on ? "border-primary bg-primary-soft/30" : "border-input bg-card hover:bg-muted"
                }`}
              >
                <input
                  type="checkbox"
                  checked={on}
                  onChange={() => toggleFeature(f)}
                  className="mt-1 size-4 rounded border-input"
                />
                <span
                  className={`grid size-9 shrink-0 place-items-center rounded-lg ${
                    on ? "bg-primary-soft text-primary" : "bg-muted text-muted-foreground"
                  }`}
                >
                  <Icon className="size-4" />
                </span>
                <span className="flex-1 space-y-0.5">
                  <span className="block text-sm font-medium">{p.featureNames[f]}</span>
                  <span className="block text-[11px] text-muted-foreground">
                    {p.featureHints[f]}
                  </span>
                </span>
              </label>
            );
          })}
        </div>
      </section>

      <section className="space-y-4 rounded-2xl border bg-card p-6">
        <div className="space-y-1">
          <h2 className="text-sm font-semibold">{p.pricingSection}</h2>
          <p className="text-[11px] text-muted-foreground">{p.pricingHint}</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          {DURATIONS.map((d) => (
            <div key={d} className="space-y-2 rounded-lg border bg-muted/30 p-3">
              <label
                htmlFor={`price-${d}`}
                className="block text-xs font-medium text-muted-foreground"
              >
                {p.durationLabels[d]}
              </label>
              <div className="flex items-center gap-2">
                <input
                  id={`price-${d}`}
                  type="number"
                  min={0}
                  step={100}
                  value={prices[d]}
                  onChange={(ev) => setPrice(d, ev.target.value)}
                  dir="ltr"
                  className="num h-9 w-full rounded-md border border-input bg-background px-3 text-sm tabular-nums"
                />
                <span className="text-[11px] text-muted-foreground">{p.currency}</span>
              </div>
              <p className="num text-[10px] text-muted-foreground">
                {prices[d].toLocaleString(numLocale)} {p.currency}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border bg-card p-5">
        <label className="flex items-start gap-3 text-sm">
          <input
            type="checkbox"
            checked={active}
            onChange={(ev) => setActive(ev.target.checked)}
            className="mt-0.5 size-4 rounded border-input"
          />
          <span className="flex-1">
            <span className="font-medium">{p.activeToggle}</span>
            <span className="mt-0.5 block text-[11px] text-muted-foreground">
              {p.activeToggleHint}
            </span>
          </span>
        </label>
      </section>

      <div className="flex flex-wrap items-center justify-end gap-2 border-t pt-4">
        {savedAt ? (
          <span className="text-xs text-success">{p.saved}</span>
        ) : null}
        <Link
          href="/admin/plans"
          className="rounded-md px-3 py-2 text-xs text-muted-foreground hover:bg-muted"
        >
          {p.cancel}
        </Link>
        <button
          type="submit"
          className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          <Save className="size-4" />
          {p.save}
        </button>
      </div>
    </form>
  );
}

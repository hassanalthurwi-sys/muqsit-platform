"use client";

import { useState } from "react";
import {
  Bot,
  ScanLine,
  MessageCircle,
  Smartphone,
  Check,
  X as XIcon,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useI18n } from "@/components/providers/i18n-provider";
import { FEATURE_CONTENT } from "@/lib/mock/feature-content";
import type { SubscriptionFeature } from "@/lib/mock/types";

const FEATURE_ICONS: Record<SubscriptionFeature, typeof Bot> = {
  aiAssistant: Bot,
  ocr: ScanLine,
  whatsappMessages: MessageCircle,
  smsMessages: Smartphone,
};

export function FeatureCard({
  feature,
  enabled,
}: {
  feature: SubscriptionFeature;
  enabled: boolean;
}) {
  const { dict, dir } = useI18n();
  const t = dict.officeSubscription;
  const content = FEATURE_CONTENT[feature];
  const Icon = FEATURE_ICONS[feature];
  const [open, setOpen] = useState(false);

  return (
    <article
      className={`rounded-xl border bg-card transition-colors ${
        enabled ? "border-primary/30" : "border-input opacity-70"
      }`}
    >
      <header className="flex items-start gap-3 p-4">
        <span
          className={`grid size-10 shrink-0 place-items-center rounded-xl ${
            enabled ? "bg-primary-soft text-primary" : "bg-muted text-muted-foreground"
          }`}
        >
          <Icon className="size-5" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-sm font-semibold">{content.plainTitle}</h3>
            {enabled ? (
              <Check className="size-4 shrink-0 text-success" />
            ) : (
              <XIcon className="size-4 shrink-0 text-muted-foreground/40" />
            )}
          </div>
          <p className="mt-1 text-xs text-muted-foreground">{content.valueLine}</p>
        </div>
      </header>

      {content.stats && enabled ? (
        <div className="mx-4 grid grid-cols-3 gap-2 border-t py-3">
          {content.stats.map((s, i) => (
            <div key={i} className="text-center">
              <p className="num text-sm font-bold tabular-nums text-primary">{s.number}</p>
              <p className="text-[10px] text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>
      ) : null}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-2 border-t px-4 py-2.5 text-[11px] font-medium text-primary transition-colors hover:bg-primary-soft/30"
      >
        <span>{open ? t.closeFeature : t.learnMore}</span>
        {open ? <ChevronUp className="size-3.5" /> : <ChevronDown className="size-3.5" />}
      </button>

      {open ? (
        <div className="space-y-4 border-t bg-muted/20 p-4">
          <div className="space-y-1.5">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
              {t.scenarioHeading}
            </p>
            <p className="text-xs leading-relaxed text-foreground/80">{content.scenario}</p>
          </div>
          {content.example ? (
            <div className="space-y-2">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                {t.exampleHeading} · {content.example.label}
              </p>
              <ol className="space-y-2">
                {content.example.steps.map((step, i) => (
                  <li key={i} className={`flex gap-2 ${step.who === "customer" ? "" : ""}`}>
                    <span
                      className={`mt-0.5 grid size-5 shrink-0 place-items-center rounded-full text-[9px] font-semibold ${
                        step.who === "ai"
                          ? "bg-primary text-primary-foreground"
                          : step.who === "customer"
                            ? "bg-gold-soft text-gold-foreground"
                            : step.who === "employee"
                              ? "bg-success/20 text-success"
                              : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {step.who === "ai"
                        ? "ذ"
                        : step.who === "customer"
                          ? "ع"
                          : step.who === "employee"
                            ? "م"
                            : dir === "rtl" ? "ن" : "i"}
                    </span>
                    <p className="flex-1 whitespace-pre-wrap text-xs leading-relaxed text-foreground/80">
                      {step.text}
                    </p>
                  </li>
                ))}
              </ol>
            </div>
          ) : null}
        </div>
      ) : null}
    </article>
  );
}

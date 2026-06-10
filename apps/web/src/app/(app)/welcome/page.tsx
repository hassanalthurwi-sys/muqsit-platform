"use client";

import Link from "next/link";
import { Sparkles, ArrowLeft, ArrowRight, Upload, LayoutDashboard } from "lucide-react";
import { useAuth } from "@/components/providers/auth-provider";
import { useI18n } from "@/components/providers/i18n-provider";

export default function WelcomePage() {
  const { dict, dir } = useI18n();
  const { daysLeftInTrial, office } = useAuth();
  const a = dict.authFlow;
  const Arrow = dir === "rtl" ? ArrowLeft : ArrowRight;
  const days = daysLeftInTrial();

  return (
    <div className="mx-auto max-w-2xl py-12">
      <div className="space-y-6 text-center">
        <div className="mx-auto grid size-20 place-items-center rounded-full bg-success/10 text-success">
          <Sparkles className="size-10" />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{a.welcome.title}</h1>
          <p className="text-base text-muted-foreground">{a.welcome.subtitle}</p>
          {office?.name ? (
            <p className="text-sm text-primary">{office.name}</p>
          ) : null}
        </div>

        {days !== null ? (
          <div className="mx-auto inline-flex items-center gap-2 rounded-full bg-gold-soft px-4 py-2 text-sm font-medium text-gold-foreground">
            🎁 {a.welcome.trialActive.replace("{n}", String(days))}
          </div>
        ) : null}
      </div>

      <div className="mt-12 grid gap-4 sm:grid-cols-2">
        <Link
          href="/migration"
          className="flex flex-col gap-3 rounded-2xl border border-primary/30 bg-primary-soft/40 p-6 text-start transition-colors hover:bg-primary-soft/60"
        >
          <div className="grid size-12 place-items-center rounded-xl bg-primary text-primary-foreground">
            <Upload className="size-6" />
          </div>
          <div>
            <p className="text-base font-semibold">{a.welcome.hasOldData}</p>
            <p className="mt-1 text-xs text-muted-foreground">{a.welcome.hasOldDataHint}</p>
          </div>
          <span className="mt-auto inline-flex items-center gap-1 text-xs font-medium text-primary">
            {a.welcome.startMigration}
            <Arrow className="size-3" />
          </span>
        </Link>

        <Link
          href="/dashboard"
          className="flex flex-col gap-3 rounded-2xl border bg-card p-6 text-start transition-colors hover:bg-muted/40"
        >
          <div className="grid size-12 place-items-center rounded-xl bg-muted text-muted-foreground">
            <LayoutDashboard className="size-6" />
          </div>
          <div>
            <p className="text-base font-semibold">{a.welcome.startFresh}</p>
            <p className="mt-1 text-xs text-muted-foreground">{dict.dashboard.subtitle}</p>
          </div>
          <span className="mt-auto inline-flex items-center gap-1 text-xs font-medium text-muted-foreground">
            {dict.common.open}
            <Arrow className="size-3" />
          </span>
        </Link>
      </div>
    </div>
  );
}

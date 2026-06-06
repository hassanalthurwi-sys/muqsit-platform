"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Image as ImageIcon, Plus, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  SettingsSection,
  SettingsField,
  SettingsGrid,
} from "@/components/ui/settings-section";
import { cn } from "@/lib/utils";
import { useStore } from "@/lib/mock/store";
import { useI18n } from "@/components/providers/i18n-provider";
import type {
  NotificationAlertType,
  NotificationChannel,
  OfficeBankAccount,
  OfficeSettings,
  ProfitDistributionPolicy,
} from "@/lib/mock/types";

const CHANNELS: NotificationChannel[] = ["whatsapp", "sms", "email"];
const ALERTS: NotificationAlertType[] = [
  "overdueCustomer",
  "newPaymentProof",
  "pendingApproval",
  "contractExpiring",
  "lowOcrConfidence",
  "investorLowCapital",
];
const POLICIES: ProfitDistributionPolicy[] = ["officeFirst", "investorFirst", "proportional"];

function newAccountId(): string {
  return `ba-${Date.now().toString(36).slice(-6)}`;
}

export default function OfficeSettingsPage() {
  const { dict, locale } = useI18n();
  const t = dict.officeSettings;
  const { officeSettings, updateOfficeSettings } = useStore();

  // Local mirror so input typing stays smooth. Mock store persists on every change.
  const [draft, setDraft] = useState<OfficeSettings>(officeSettings);
  const [savedAt, setSavedAt] = useState<Date | null>(null);
  const skipNextSave = useRef(true);

  // Re-mirror when the store hydrates from localStorage on mount.
  useEffect(() => {
    setDraft(officeSettings);
  }, [officeSettings]);

  // Persist on every change to the local draft (after the first sync).
  useEffect(() => {
    if (skipNextSave.current) {
      skipNextSave.current = false;
      return;
    }
    updateOfficeSettings(draft);
    setSavedAt(new Date());
  }, [draft, updateOfficeSettings]);

  const fmtTime = (d: Date) =>
    new Intl.DateTimeFormat(locale === "ar" ? "ar-SA-u-nu-latn-ca-gregory" : "en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(d);

  // ── tiny helpers to keep the JSX clean ────────────────────────────────────
  const setIdentity = (patch: Partial<OfficeSettings["identity"]>) =>
    setDraft((d) => ({ ...d, identity: { ...d.identity, ...patch } }));
  const setContact = (patch: Partial<OfficeSettings["contact"]>) =>
    setDraft((d) => ({ ...d, contact: { ...d.contact, ...patch } }));
  const setInvestment = (patch: Partial<OfficeSettings["investmentDefaults"]>) =>
    setDraft((d) => ({ ...d, investmentDefaults: { ...d.investmentDefaults, ...patch } }));
  const setPolicy = (policy: ProfitDistributionPolicy) =>
    setDraft((d) => ({ ...d, profitDistribution: { policy } }));
  const setNotifications = (patch: Partial<OfficeSettings["notifications"]>) =>
    setDraft((d) => ({ ...d, notifications: { ...d.notifications, ...patch } }));

  // Bank account operations
  const addBankAccount = () =>
    setDraft((d) => ({
      ...d,
      bankAccounts: [
        ...d.bankAccounts,
        { id: newAccountId(), bankName: "", beneficiaryName: "", iban: "" },
      ],
    }));
  const removeBankAccount = (id: string) =>
    setDraft((d) => ({ ...d, bankAccounts: d.bankAccounts.filter((a) => a.id !== id) }));
  const updateBankAccount = (id: string, patch: Partial<OfficeBankAccount>) =>
    setDraft((d) => ({
      ...d,
      bankAccounts: d.bankAccounts.map((a) => (a.id === id ? { ...a, ...patch } : a)),
    }));

  const toggleChannel = (ch: NotificationChannel) =>
    setNotifications({
      channels: draft.notifications.channels.includes(ch)
        ? draft.notifications.channels.filter((c) => c !== ch)
        : [...draft.notifications.channels, ch],
    });

  const toggleAlert = (a: NotificationAlertType) =>
    setNotifications({
      alertTypes: draft.notifications.alertTypes.includes(a)
        ? draft.notifications.alertTypes.filter((x) => x !== a)
        : [...draft.notifications.alertTypes, a],
    });

  const num = (v: string) => Number(v.replace(/[^\d]/g, "") || 0);

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-5">
      {/* Page header with inline saved indicator */}
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{t.pageTitle}</h1>
          <p className="text-sm text-muted-foreground">{t.pageSubtitle}</p>
        </div>
        {savedAt ? (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-success-soft px-3 py-1 text-xs font-medium text-success-foreground">
            <Check className="size-3.5" aria-hidden />
            {t.savedLabel.replace("{time}", fmtTime(savedAt))}
          </span>
        ) : null}
      </header>

      {/* 1. Identity */}
      <SettingsSection title={t.sections.identity.title} hint={t.sections.identity.hint}>
        <SettingsGrid>
          <SettingsField label={t.identity.nameAr}>
            <Input
              value={draft.identity.nameAr}
              onChange={(e) => setIdentity({ nameAr: e.target.value })}
              dir="rtl"
            />
          </SettingsField>
          <SettingsField label={t.identity.nameEn}>
            <Input
              value={draft.identity.nameEn}
              onChange={(e) => setIdentity({ nameEn: e.target.value })}
              dir="ltr"
            />
          </SettingsField>
        </SettingsGrid>

        {/* Logo */}
        <SettingsField label={t.identity.logoLabel} hint={t.identity.logoHint}>
          <label
            htmlFor="logo-upload"
            className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-border bg-muted/30 px-4 py-3 text-sm hover:border-primary/40"
          >
            <span className="flex size-10 items-center justify-center rounded-lg bg-primary-soft text-primary-soft-foreground">
              <ImageIcon className="size-4" aria-hidden />
            </span>
            <span className="flex-1">
              {draft.identity.logoFileName ? (
                <span className="num text-xs font-medium">{draft.identity.logoFileName}</span>
              ) : (
                <span className="text-sm font-medium text-foreground">{t.identity.logoChoose}</span>
              )}
            </span>
          </label>
          <input
            id="logo-upload"
            type="file"
            accept="image/png,image/svg+xml"
            className="sr-only"
            onChange={(e) => setIdentity({ logoFileName: e.target.files?.[0]?.name ?? undefined })}
          />
        </SettingsField>

        <SettingsGrid>
          <SettingsField label={t.identity.commercialRegistration}>
            <Input
              value={draft.identity.commercialRegistration ?? ""}
              onChange={(e) => setIdentity({ commercialRegistration: e.target.value })}
              className="num"
            />
          </SettingsField>
          <SettingsField label={t.identity.taxNumber}>
            <Input
              value={draft.identity.taxNumber ?? ""}
              onChange={(e) => setIdentity({ taxNumber: e.target.value })}
              className="num"
            />
          </SettingsField>
          <SettingsField label={t.identity.foundedAt} className="sm:col-span-2">
            <Input
              type="date"
              value={draft.identity.foundedAt ?? ""}
              onChange={(e) => setIdentity({ foundedAt: e.target.value })}
              className="num"
            />
          </SettingsField>
        </SettingsGrid>
      </SettingsSection>

      {/* 2. Contact */}
      <SettingsSection title={t.sections.contact.title} hint={t.sections.contact.hint}>
        <SettingsGrid>
          <SettingsField label={t.contact.phone}>
            <Input
              value={draft.contact.phone}
              onChange={(e) => setContact({ phone: e.target.value })}
              className="num"
              dir="ltr"
            />
          </SettingsField>
          <SettingsField label={t.contact.email}>
            <Input
              type="email"
              value={draft.contact.email}
              onChange={(e) => setContact({ email: e.target.value })}
              dir="ltr"
            />
          </SettingsField>
          <SettingsField label={t.contact.city}>
            <Input
              value={draft.contact.city}
              onChange={(e) => setContact({ city: e.target.value })}
            />
          </SettingsField>
          <SettingsField label={t.contact.neighborhood}>
            <Input
              value={draft.contact.neighborhood ?? ""}
              onChange={(e) => setContact({ neighborhood: e.target.value })}
            />
          </SettingsField>
          <SettingsField label={t.contact.street} className="sm:col-span-2">
            <Input
              value={draft.contact.street ?? ""}
              onChange={(e) => setContact({ street: e.target.value })}
            />
          </SettingsField>
          <SettingsField label={t.contact.website} className="sm:col-span-2">
            <Input
              value={draft.contact.website ?? ""}
              onChange={(e) => setContact({ website: e.target.value })}
              dir="ltr"
            />
          </SettingsField>
        </SettingsGrid>
      </SettingsSection>

      {/* 3. Bank accounts */}
      <SettingsSection title={t.sections.bankAccounts.title} hint={t.sections.bankAccounts.hint}>
        {draft.bankAccounts.length === 0 ? (
          <p className="rounded-lg bg-muted/40 px-3 py-3 text-xs text-muted-foreground">
            {t.bankAccounts.empty}
          </p>
        ) : (
          <ul className="space-y-3">
            {draft.bankAccounts.map((acc, idx) => (
              <li
                key={acc.id}
                className="rounded-xl border border-border bg-muted/30 p-4 space-y-3"
              >
                <header className="flex items-center justify-between gap-3">
                  <span className="num text-[11px] font-medium text-muted-foreground">
                    {t.bankAccounts.accountIndex.replace("{n}", String(idx + 1))}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeBankAccount(acc.id)}
                    className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-medium text-danger-foreground hover:bg-danger-soft"
                    aria-label={t.bankAccounts.removeAccount}
                  >
                    <Trash2 className="size-3.5" aria-hidden />
                    {t.bankAccounts.removeAccount}
                  </button>
                </header>
                <SettingsGrid>
                  <SettingsField label={t.bankAccounts.bankName}>
                    <Input
                      value={acc.bankName}
                      onChange={(e) => updateBankAccount(acc.id, { bankName: e.target.value })}
                    />
                  </SettingsField>
                  <SettingsField label={t.bankAccounts.beneficiaryName}>
                    <Input
                      value={acc.beneficiaryName}
                      onChange={(e) => updateBankAccount(acc.id, { beneficiaryName: e.target.value })}
                    />
                  </SettingsField>
                </SettingsGrid>
                <SettingsField label={t.bankAccounts.iban}>
                  <Input
                    value={acc.iban}
                    onChange={(e) => updateBankAccount(acc.id, { iban: e.target.value.toUpperCase() })}
                    className="num"
                    dir="ltr"
                  />
                </SettingsField>
              </li>
            ))}
          </ul>
        )}
        <Button
          type="button"
          variant="outline"
          onClick={addBankAccount}
          className="w-full gap-1.5 sm:w-auto"
        >
          <Plus className="size-4" aria-hidden />
          {t.bankAccounts.addAccount}
        </Button>
      </SettingsSection>

      {/* 4. Investment defaults (recycling threshold only) */}
      <SettingsSection
        title={t.sections.investmentDefaults.title}
        hint={t.sections.investmentDefaults.hint}
      >
        <SettingsField
          label={t.investmentDefaults.recyclingThreshold}
          hint={t.investmentDefaults.recyclingThresholdHint}
        >
          <Input
            type="number"
            min={0}
            value={draft.investmentDefaults.recyclingThreshold}
            onChange={(e) => setInvestment({ recyclingThreshold: num(e.target.value) })}
            className="num"
          />
        </SettingsField>
      </SettingsSection>

      {/* 5. Profit distribution */}
      <SettingsSection title={t.sections.profitDistribution.title} hint={t.sections.profitDistribution.hint}>
        <fieldset className="space-y-2">
          <legend className="mb-2 block text-xs font-medium text-muted-foreground">
            {t.profitDistribution.policy}
          </legend>
          <div className="grid gap-2 sm:grid-cols-3">
            {POLICIES.map((p) => {
              const active = draft.profitDistribution.policy === p;
              return (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPolicy(p)}
                  className={cn(
                    "flex flex-col gap-1 rounded-xl border p-3 text-start transition-colors",
                    active
                      ? "border-primary bg-primary-soft text-primary-soft-foreground"
                      : "border-border bg-card hover:border-primary/40",
                  )}
                >
                  <span className="flex items-center justify-between gap-2 text-sm font-semibold">
                    <span>{t.profitDistribution.policyOptions[p]}</span>
                    {active ? <Check className="size-4 text-primary" aria-hidden /> : null}
                  </span>
                  <span className="text-[11px] leading-5 text-muted-foreground">
                    {t.profitDistribution.policyOptionHints[p]}
                  </span>
                </button>
              );
            })}
          </div>
        </fieldset>
        <p className="rounded-lg bg-gold-soft/40 px-3 py-2 text-[11px] leading-5 text-gold-foreground">
          {t.profitDistribution.futureNote}
        </p>
      </SettingsSection>

      {/* 6. Notification preferences */}
      <SettingsSection title={t.sections.notifications.title} hint={t.sections.notifications.hint}>
        <SettingsField label={t.notifications.channels}>
          <div className="flex flex-wrap gap-2">
            {CHANNELS.map((ch) => {
              const active = draft.notifications.channels.includes(ch);
              return (
                <button
                  key={ch}
                  type="button"
                  onClick={() => toggleChannel(ch)}
                  className={cn(
                    "rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors",
                    active
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground",
                  )}
                >
                  {t.notifications.channelLabels[ch]}
                </button>
              );
            })}
          </div>
        </SettingsField>

        <SettingsGrid>
          <SettingsField label={t.notifications.quietHoursStart}>
            <Input
              type="time"
              value={draft.notifications.quietHoursStart ?? ""}
              onChange={(e) => setNotifications({ quietHoursStart: e.target.value })}
              className="num"
            />
          </SettingsField>
          <SettingsField label={t.notifications.quietHoursEnd} hint={t.notifications.quietHoursHint}>
            <Input
              type="time"
              value={draft.notifications.quietHoursEnd ?? ""}
              onChange={(e) => setNotifications({ quietHoursEnd: e.target.value })}
              className="num"
            />
          </SettingsField>
        </SettingsGrid>

        <SettingsField label={t.notifications.alertTypes}>
          <div className="grid gap-1.5 sm:grid-cols-2">
            {ALERTS.map((a) => {
              const active = draft.notifications.alertTypes.includes(a);
              return (
                <label
                  key={a}
                  className={cn(
                    "flex cursor-pointer items-center gap-2.5 rounded-lg border px-3 py-2 text-xs font-medium",
                    active
                      ? "border-primary bg-primary-soft text-primary-soft-foreground"
                      : "border-border bg-card text-muted-foreground hover:border-primary/40",
                  )}
                >
                  <input
                    type="checkbox"
                    checked={active}
                    onChange={() => toggleAlert(a)}
                    className="size-4 accent-primary"
                  />
                  {t.notifications.alertLabels[a]}
                </label>
              );
            })}
          </div>
        </SettingsField>
      </SettingsSection>
    </div>
  );
}

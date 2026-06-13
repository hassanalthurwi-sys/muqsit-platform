"use client";

import { use, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Calendar, User, Phone, Mail, Building2 } from "lucide-react";
import { useI18n } from "@/components/providers/i18n-provider";
import { MOCK_OFFICES, daysLeftInTrial } from "@/lib/mock/admin-data";
import type { SubscriptionStatus } from "@/lib/mock/types";

export default function OfficeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { dict, dir, locale } = useI18n();
  const a = dict.admin.officeDetail;
  const BackArrow = dir === "rtl" ? ArrowRight : ArrowLeft;
  const office = MOCK_OFFICES.find((o) => o.id === id);
  const [extendDays, setExtendDays] = useState(14);

  if (!office) {
    return (
      <div className="rounded-xl border bg-card p-8 text-center text-muted-foreground">
        Office not found.
      </div>
    );
  }

  const left = daysLeftInTrial(office);

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6">
      <Link
        href="/admin/offices"
        className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
      >
        <BackArrow className="size-3" />
        {a.back}
      </Link>

      <header className="flex flex-wrap items-start gap-4">
        <span className="grid size-14 place-items-center rounded-2xl bg-primary-soft text-primary">
          <Building2 className="size-7" />
        </span>
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-semibold tracking-tight">{office.name}</h1>
          <p className="num text-xs text-muted-foreground" dir="ltr">
            {office.cr}
          </p>
        </div>
        <StatusBadge status={office.subscriptionStatus} />
      </header>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-2xl border bg-card p-5">
          <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold">
            <User className="size-4" />
            {a.managerInfo}
          </h2>
          <dl className="space-y-2 text-sm">
            <Row label="الاسم" value={office.managerName} />
            <Row
              label="رقم الهوية"
              value={<span className="num" dir="ltr">{office.managerNationalId}</span>}
            />
            <Row
              label={dict.identityFieldLabel.entityName}
              value={
                <span className="num inline-flex items-center gap-1" dir="ltr">
                  <Phone className="size-3" />
                  {office.managerPhone}
                </span>
              }
            />
            {office.managerEmail ? (
              <Row
                label={dict.auth.email}
                value={
                  <span className="num text-xs inline-flex items-center gap-1" dir="ltr">
                    <Mail className="size-3" />
                    {office.managerEmail}
                  </span>
                }
              />
            ) : null}
          </dl>
        </section>

        <section className="rounded-2xl border bg-card p-5">
          <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold">
            <Calendar className="size-4" />
            {a.subscription}
          </h2>
          <dl className="space-y-2 text-sm">
            <Row
              label="الحالة"
              value={<StatusBadge status={office.subscriptionStatus} />}
            />
            <Row
              label="تاريخ التسجيل"
              value={
                <span className="num text-xs">
                  {new Date(office.createdAt).toLocaleDateString(
                    locale === "ar" ? "ar-SA-u-nu-latn" : "en-US",
                  )}
                </span>
              }
            />
            {office.trialEndsAt ? (
              <Row
                label="نهاية التجربة"
                value={
                  <span className="num text-xs">
                    {new Date(office.trialEndsAt).toLocaleDateString(
                      locale === "ar" ? "ar-SA-u-nu-latn" : "en-US",
                    )}
                    {left !== null ? ` (${left} يوم متبقي)` : ""}
                  </span>
                }
              />
            ) : null}
          </dl>
        </section>
      </div>

      <section className="rounded-2xl border bg-card p-5">
        <h2 className="mb-4 text-sm font-semibold">{a.actions}</h2>
        <div className="space-y-4">
          {office.subscriptionStatus === "trial" || office.subscriptionStatus === "expired" ? (
            <div className="rounded-xl border bg-muted/30 p-4">
              <p className="mb-3 text-sm font-medium">{a.extendTrial}</p>
              <div className="flex flex-wrap items-end gap-2">
                <div className="flex-1 min-w-32">
                  <label className="mb-1 block text-xs text-muted-foreground">
                    {a.extendDays}
                  </label>
                  <input
                    type="number"
                    value={extendDays}
                    onChange={(e) => setExtendDays(Number(e.target.value))}
                    min={1}
                    max={365}
                    className="num h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
                  />
                </div>
                <button
                  type="button"
                  className="h-9 rounded-md bg-primary px-4 text-xs font-medium text-primary-foreground hover:bg-primary/90"
                >
                  {a.extendConfirm}
                </button>
              </div>
            </div>
          ) : null}

          <div className="flex flex-wrap gap-2">
            {office.subscriptionStatus !== "active" ? (
              <button
                type="button"
                className="rounded-md bg-success px-4 py-2 text-xs font-medium text-white hover:bg-success/90"
              >
                {a.activate}
              </button>
            ) : null}
            {office.subscriptionStatus !== "suspended" ? (
              <button
                type="button"
                className="rounded-md border border-destructive/30 px-4 py-2 text-xs font-medium text-destructive hover:bg-destructive/10"
              >
                {a.suspend}
              </button>
            ) : (
              <button
                type="button"
                className="rounded-md border border-input px-4 py-2 text-xs font-medium hover:bg-muted"
              >
                {a.reactivate}
              </button>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-3 py-1">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="text-sm">{value}</dd>
    </div>
  );
}

function StatusBadge({ status }: { status: SubscriptionStatus }) {
  const { dict } = useI18n();
  const label = dict.admin.subscriptionStatus[status];
  const tone =
    status === "active"
      ? "bg-success/10 text-success"
      : status === "trial"
        ? "bg-gold-soft text-gold-foreground"
        : status === "expired"
          ? "bg-warning-soft text-warning-foreground"
          : "bg-muted text-muted-foreground";
  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${tone}`}>
      {label}
    </span>
  );
}

"use client";

import { use, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  User,
  Phone,
  Mail,
  Calendar,
  Shield,
  Send,
  PauseCircle,
  PlayCircle,
  Trash2,
} from "lucide-react";
import { useI18n } from "@/components/providers/i18n-provider";
import { useStore } from "@/lib/mock/store";

export default function EmployeeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { dict, dir, locale } = useI18n();
  const { employees, roles } = useStore();
  const e = dict.officeEmployees;
  const BackArrow = dir === "rtl" ? ArrowRight : ArrowLeft;
  const emp = employees.find((x) => x.id === id);
  const [bypassApprovals, setBypassApprovals] = useState(emp?.bypassApprovals ?? false);
  const [roleId, setRoleId] = useState(emp?.roleId ?? "");

  if (!emp) {
    return (
      <div className="rounded-xl border bg-card p-8 text-center text-muted-foreground">
        Employee not found.
      </div>
    );
  }

  const isPending = emp.inviteStatus === "pending";
  const role = roles.find((r) => r.id === roleId);

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6">
      <Link
        href="/employees"
        className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
      >
        <BackArrow className="size-3" />
        {e.detail.back}
      </Link>

      <header className="flex flex-wrap items-start gap-4">
        <span className="grid size-14 place-items-center rounded-2xl bg-primary-soft text-primary text-lg font-semibold">
          {emp.name.charAt(0)}
        </span>
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-semibold tracking-tight">{emp.name}</h1>
          <p className="num text-xs text-muted-foreground" dir="ltr">
            {emp.email}
          </p>
        </div>
        {isPending ? (
          <span className="inline-flex items-center rounded-full bg-gold-soft px-3 py-1 text-xs font-medium text-gold-foreground">
            {e.inviteStatus.pending}
          </span>
        ) : emp.active ? (
          <span className="inline-flex items-center rounded-full bg-success/10 px-3 py-1 text-xs font-medium text-success">
            {e.activeBadge}
          </span>
        ) : (
          <span className="inline-flex items-center rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
            {e.suspendedBadge}
          </span>
        )}
      </header>

      {isPending ? (
        <div className="rounded-2xl border border-gold-soft bg-gold-soft/30 px-4 py-3 text-sm text-gold-foreground">
          {e.pendingHint}
        </div>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-2xl border bg-card p-5">
          <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold">
            <User className="size-4" />
            {e.detail.personalInfo}
          </h2>
          <dl className="space-y-2 text-sm">
            <Row label="الاسم" value={emp.name} />
            {emp.nationalId ? (
              <Row
                label="رقم الهوية"
                value={
                  <span className="num text-xs" dir="ltr">
                    {emp.nationalId}
                  </span>
                }
              />
            ) : null}
            {emp.phone ? (
              <Row
                label="الجوال"
                value={
                  <span className="num inline-flex items-center gap-1 text-xs" dir="ltr">
                    <Phone className="size-3" />
                    {emp.phone}
                  </span>
                }
              />
            ) : null}
            <Row
              label="البريد"
              value={
                <span className="num inline-flex items-center gap-1 text-xs" dir="ltr">
                  <Mail className="size-3" />
                  {emp.email}
                </span>
              }
            />
          </dl>
        </section>

        <section className="rounded-2xl border bg-card p-5">
          <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold">
            <Calendar className="size-4" />
            {e.detail.activitySection}
          </h2>
          <dl className="space-y-2 text-sm">
            <Row
              label={e.detail.joinedAt}
              value={
                <span className="num text-xs">
                  {new Date(emp.joinedAt).toLocaleDateString(
                    locale === "ar" ? "ar-SA-u-nu-latn" : "en-US",
                  )}
                </span>
              }
            />
            <Row
              label={e.detail.lastLogin}
              value={
                <span className="num text-xs">
                  {emp.lastLoginAt
                    ? new Date(emp.lastLoginAt).toLocaleString(
                        locale === "ar" ? "ar-SA-u-nu-latn" : "en-US",
                      )
                    : e.detail.neverLoggedIn}
                </span>
              }
            />
          </dl>
        </section>
      </div>

      <section className="rounded-2xl border bg-card p-5">
        <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold">
          <Shield className="size-4" />
          {e.detail.roleSection}
        </h2>
        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="role-select" className="text-xs font-medium text-muted-foreground">
              {e.detail.changeRole}
            </label>
            <select
              id="role-select"
              value={roleId}
              onChange={(ev) => setRoleId(ev.target.value)}
              className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm sm:w-72"
            >
              {roles.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
            {role?.description ? (
              <p className="text-xs text-muted-foreground">{role.description}</p>
            ) : null}
          </div>

          <label className="flex items-start gap-3 rounded-lg border bg-muted/30 p-3 text-sm">
            <input
              type="checkbox"
              checked={bypassApprovals}
              onChange={(ev) => setBypassApprovals(ev.target.checked)}
              className="mt-0.5 size-4 rounded border-input"
            />
            <span className="flex-1">
              <span className="font-medium">{e.detail.bypassApprovals}</span>
              <span className="mt-0.5 block text-[11px] text-muted-foreground">
                {e.detail.bypassApprovalsHint}
              </span>
            </span>
          </label>
        </div>
      </section>

      <section className="rounded-2xl border bg-card p-5">
        <h2 className="mb-4 text-sm font-semibold">{e.detail.actions}</h2>
        <div className="flex flex-wrap gap-2">
          {isPending ? (
            <button
              type="button"
              className="inline-flex items-center gap-1.5 rounded-md border border-input bg-card px-3 py-2 text-xs font-medium hover:bg-muted"
            >
              <Send className="size-3.5" />
              {e.detail.resendInvite}
            </button>
          ) : null}
          {emp.active ? (
            <button
              type="button"
              className="inline-flex items-center gap-1.5 rounded-md border border-warning-soft bg-warning-soft/30 px-3 py-2 text-xs font-medium text-warning-foreground hover:bg-warning-soft/50"
            >
              <PauseCircle className="size-3.5" />
              {e.detail.suspendBtn}
            </button>
          ) : (
            <button
              type="button"
              className="inline-flex items-center gap-1.5 rounded-md bg-success px-3 py-2 text-xs font-medium text-white hover:bg-success/90"
            >
              <PlayCircle className="size-3.5" />
              {e.detail.reactivateBtn}
            </button>
          )}
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-md border border-destructive/30 px-3 py-2 text-xs font-medium text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="size-3.5" />
            {e.detail.deleteBtn}
          </button>
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

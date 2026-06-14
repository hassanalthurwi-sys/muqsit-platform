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
  PauseCircle,
  PlayCircle,
  Trash2,
  Sparkles,
  Briefcase,
  ShieldAlert,
} from "lucide-react";
import { useI18n } from "@/components/providers/i18n-provider";
import { PermissionTriState } from "@/components/ui/permission-tri-state";
import { MOCK_SYSTEM_EMPLOYEES, MOCK_SYSTEM_ROLES } from "@/lib/mock/admin-data";
import type {
  PermissionState,
  SystemPermissionAction,
  SystemPermissionGroup,
} from "@/lib/mock/types";

const GROUPS: Record<SystemPermissionGroup, SystemPermissionAction[]> = {
  offices: [
    "viewOffices",
    "registerOffice",
    "extendTrial",
    "suspendOffice",
    "reactivateOffice",
    "deleteOffice",
  ],
  subscriptions: [
    "changeSubscriptionPlan",
    "issueInvoice",
    "recordSubscriptionPayment",
  ],
  team: ["viewPlatformEmployees", "managePlatformEmployees"],
  settings: ["manageSystemSettings", "sendGlobalAnnouncement"],
  auditReports: ["viewAudit", "exportPlatformReports"],
};

export default function PlatformEmployeeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { dict, dir, locale } = useI18n();
  const e = dict.admin.employees;
  const BackArrow = dir === "rtl" ? ArrowRight : ArrowLeft;
  const emp = MOCK_SYSTEM_EMPLOYEES.find((x) => x.id === id);

  const [title, setTitle] = useState(emp?.title ?? "");
  const [permissions, setPermissions] = useState<
    Record<SystemPermissionAction, PermissionState>
  >(emp?.permissions ?? ({} as Record<SystemPermissionAction, PermissionState>));
  const [templatePickerOpen, setTemplatePickerOpen] = useState(false);

  if (!emp) {
    return (
      <div className="rounded-xl border bg-card p-8 text-center text-muted-foreground">
        Staff member not found.
      </div>
    );
  }

  const isAdmin = emp.role === "systemAdmin";
  const template = MOCK_SYSTEM_ROLES.find((r) => r.id === emp.templateRoleId);

  function setOne(action: SystemPermissionAction, state: PermissionState) {
    setPermissions((prev) => ({ ...prev, [action]: state }));
  }

  function loadTemplate(roleId: string) {
    const role = MOCK_SYSTEM_ROLES.find((r) => r.id === roleId);
    if (!role) return;
    setPermissions({ ...role.permissions });
    setTemplatePickerOpen(false);
  }

  const matchesTemplate =
    template &&
    (Object.keys(template.permissions) as SystemPermissionAction[]).every(
      (a) => template.permissions[a] === permissions[a],
    );

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6">
      <Link
        href="/admin/employees"
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
          <p className="mt-0.5 text-sm text-muted-foreground">{emp.title}</p>
          {emp.email ? (
            <p className="num text-xs text-muted-foreground" dir="ltr">
              {emp.email}
            </p>
          ) : null}
        </div>
        {emp.active ? (
          <span className="inline-flex items-center rounded-full bg-success/10 px-3 py-1 text-xs font-medium text-success">
            {e.active}
          </span>
        ) : (
          <span className="inline-flex items-center rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
            {e.inactive}
          </span>
        )}
      </header>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-2xl border bg-card p-5">
          <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold">
            <User className="size-4" />
            {e.detail.personalInfo}
          </h2>
          <dl className="space-y-2 text-sm">
            <Row label={dir === "rtl" ? "الاسم" : "Name"} value={emp.name} />
            {emp.nationalId ? (
              <Row
                label={dir === "rtl" ? "رقم الهوية" : "National ID"}
                value={
                  <span className="num text-xs" dir="ltr">
                    {emp.nationalId}
                  </span>
                }
              />
            ) : null}
            <Row
              label={dir === "rtl" ? "الجوال" : "Phone"}
              value={
                <span className="num inline-flex items-center gap-1 text-xs" dir="ltr">
                  <Phone className="size-3" />
                  {emp.phone}
                </span>
              }
            />
            {emp.email ? (
              <Row
                label={dir === "rtl" ? "البريد" : "Email"}
                value={
                  <span className="num inline-flex items-center gap-1 text-xs" dir="ltr">
                    <Mail className="size-3" />
                    {emp.email}
                  </span>
                }
              />
            ) : null}
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
                  {new Date(emp.createdAt).toLocaleDateString(
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
                    : e.neverLoggedIn}
                </span>
              }
            />
          </dl>
        </section>
      </div>

      <section className="rounded-2xl border bg-card p-5">
        <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold">
          <Briefcase className="size-4" />
          {e.detail.titleSection}
        </h2>
        <div className="space-y-2">
          <label htmlFor="sys-title" className="text-xs font-medium text-muted-foreground">
            {e.detail.titleLabel}
          </label>
          <input
            id="sys-title"
            value={title}
            onChange={(ev) => setTitle(ev.target.value)}
            className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm sm:w-96"
          />
        </div>
      </section>

      <section className="rounded-2xl border bg-card p-5">
        <h2 className="mb-3 text-sm font-semibold">{e.detail.authRoleSection}</h2>
        <span
          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
            isAdmin
              ? "bg-primary-soft text-primary-soft-foreground"
              : "bg-muted text-muted-foreground"
          }`}
        >
          {e.authRole[emp.role]}
        </span>
      </section>

      <section className="rounded-2xl border bg-card p-5">
        <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-1">
            <h2 className="flex items-center gap-2 text-sm font-semibold">
              <Shield className="size-4" />
              {e.detail.permissionsSection}
            </h2>
            <p className="text-[11px] text-muted-foreground">{e.detail.permissionsHint}</p>
            {template && !isAdmin ? (
              matchesTemplate ? (
                <p className="text-[11px] text-muted-foreground">
                  {e.detail.basedOnTemplate.replace("{name}", template.name)}
                </p>
              ) : (
                <span className="inline-flex items-center gap-1 rounded-full bg-primary-soft px-2 py-0.5 text-[10px] font-medium text-primary">
                  <Sparkles className="size-3" />
                  {e.detail.customized}
                </span>
              )
            ) : null}
          </div>
          {!isAdmin ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setTemplatePickerOpen((v) => !v)}
                className="inline-flex items-center gap-1.5 rounded-md border border-input bg-background px-3 py-1.5 text-xs font-medium hover:bg-muted"
              >
                <Sparkles className="size-3.5 text-primary" />
                {e.invite.loadFromTemplate}
              </button>
              {templatePickerOpen ? (
                <div className="absolute end-0 z-10 mt-1 w-72 overflow-hidden rounded-lg border bg-card shadow-lg">
                  {MOCK_SYSTEM_ROLES.map((role) => (
                    <button
                      key={role.id}
                      type="button"
                      onClick={() => loadTemplate(role.id)}
                      className="block w-full px-3 py-2 text-start text-xs hover:bg-muted"
                    >
                      <p className="font-medium">{role.name}</p>
                      <p className="mt-0.5 text-[10px] text-muted-foreground">
                        {role.description}
                      </p>
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
          ) : null}
        </div>

        {isAdmin ? (
          <div className="mb-4 flex items-start gap-3 rounded-lg border border-primary/30 bg-primary-soft/50 p-3 text-xs text-primary-soft-foreground">
            <ShieldAlert className="size-4 shrink-0" />
            <span>{e.detail.adminBypassHint}</span>
          </div>
        ) : null}

        <div className={`space-y-5 ${isAdmin ? "pointer-events-none opacity-60" : ""}`}>
          {(Object.keys(GROUPS) as SystemPermissionGroup[]).map((group) => (
            <div key={group} className="space-y-2">
              <h3 className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                {e.permissionGroups[group]}
              </h3>
              <div className="overflow-hidden rounded-lg border">
                {GROUPS[group].map((action, i) => (
                  <div
                    key={action}
                    className={`flex flex-wrap items-center justify-between gap-3 px-3 py-2.5 ${
                      i > 0 ? "border-t" : ""
                    }`}
                  >
                    <span className="text-sm">{e.permissionActions[action]}</span>
                    <PermissionTriState
                      value={isAdmin ? "allow" : permissions[action] ?? "deny"}
                      onChange={(state) => setOne(action, state)}
                      disabled={isAdmin}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border bg-card p-5">
        <h2 className="mb-4 text-sm font-semibold">{e.detail.actions}</h2>
        <div className="flex flex-wrap gap-2">
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
          {!isAdmin ? (
            <button
              type="button"
              className="inline-flex items-center gap-1.5 rounded-md border border-destructive/30 px-3 py-2 text-xs font-medium text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="size-3.5" />
              {e.detail.deleteBtn}
            </button>
          ) : null}
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

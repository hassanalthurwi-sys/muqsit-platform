"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  UserPlus,
  Sparkles,
  ShieldAlert,
} from "lucide-react";
import { useI18n } from "@/components/providers/i18n-provider";
import { PermissionTriState } from "@/components/ui/permission-tri-state";
import { MOCK_SYSTEM_ROLES } from "@/lib/mock/admin-data";
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

function blankMatrix(): Record<SystemPermissionAction, PermissionState> {
  return {
    viewOffices: "deny",
    registerOffice: "deny",
    extendTrial: "deny",
    suspendOffice: "deny",
    reactivateOffice: "deny",
    deleteOffice: "deny",
    changeSubscriptionPlan: "deny",
    issueInvoice: "deny",
    recordSubscriptionPayment: "deny",
    viewPlatformEmployees: "deny",
    managePlatformEmployees: "deny",
    manageSystemSettings: "deny",
    sendGlobalAnnouncement: "deny",
    viewAudit: "deny",
    exportPlatformReports: "deny",
  };
}

export default function AddPlatformEmployeePage() {
  const router = useRouter();
  const { dict, dir } = useI18n();
  const e = dict.admin.employees;
  const Arrow = dir === "rtl" ? ArrowLeft : ArrowRight;
  const BackArrow = dir === "rtl" ? ArrowRight : ArrowLeft;

  const [name, setName] = useState("");
  const [nationalId, setNationalId] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [title, setTitle] = useState("");
  const [authRole, setAuthRole] = useState<"systemAdmin" | "systemEmployee">(
    "systemEmployee",
  );
  const [permissions, setPermissions] =
    useState<Record<SystemPermissionAction, PermissionState>>(blankMatrix());
  const [templatePickerOpen, setTemplatePickerOpen] = useState(false);

  function setOne(action: SystemPermissionAction, state: PermissionState) {
    setPermissions((prev) => ({ ...prev, [action]: state }));
  }

  function loadTemplate(roleId: string) {
    const role = MOCK_SYSTEM_ROLES.find((r) => r.id === roleId);
    if (!role) return;
    setPermissions({ ...role.permissions });
    setTemplatePickerOpen(false);
  }

  function submit(ev: React.FormEvent) {
    ev.preventDefault();
    if (!name || !phone || !title) return;
    router.push("/admin/employees?added=1");
  }

  const isAdmin = authRole === "systemAdmin";

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <Link
        href="/admin/employees"
        className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
      >
        <BackArrow className="size-3" />
        {e.detail.back}
      </Link>

      <header className="flex flex-wrap items-start gap-4">
        <span className="grid size-12 place-items-center rounded-2xl bg-primary-soft text-primary">
          <UserPlus className="size-6" />
        </span>
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-semibold tracking-tight">{e.invite.title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{e.invite.subtitle}</p>
        </div>
      </header>

      <form onSubmit={submit} className="space-y-6">
        <section className="space-y-5 rounded-2xl border bg-card p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="sys-name" className="text-sm font-medium">
                {e.invite.nameLabel}
              </label>
              <input
                id="sys-name"
                value={name}
                onChange={(ev) => setName(ev.target.value)}
                required
                className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="sys-title" className="text-sm font-medium">
                {e.invite.titleLabel}
              </label>
              <input
                id="sys-title"
                value={title}
                onChange={(ev) => setTitle(ev.target.value)}
                required
                placeholder={
                  dir === "rtl"
                    ? "مثال: قائد فريق العمليات"
                    : "e.g. Operations team lead"
                }
                className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
              />
              <p className="text-[11px] text-muted-foreground">{e.invite.titleHint}</p>
            </div>
            <div className="space-y-2">
              <label htmlFor="sys-nid" className="text-sm font-medium">
                {e.invite.nationalIdLabel}
              </label>
              <input
                id="sys-nid"
                value={nationalId}
                onChange={(ev) => setNationalId(ev.target.value)}
                dir="ltr"
                className="num h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
                placeholder="10XXXXXXXX"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="sys-phone" className="text-sm font-medium">
                {e.invite.phoneLabel}
              </label>
              <input
                id="sys-phone"
                value={phone}
                onChange={(ev) => setPhone(ev.target.value)}
                dir="ltr"
                className="num h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
                placeholder="5XXXXXXXX"
                required
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <label
                htmlFor="sys-email"
                className="flex items-center justify-between text-sm font-medium"
              >
                {e.invite.emailLabel}
                <span className="text-[10px] font-normal text-muted-foreground">
                  {e.invite.emailOptional}
                </span>
              </label>
              <input
                id="sys-email"
                type="email"
                value={email}
                onChange={(ev) => setEmail(ev.target.value)}
                dir="ltr"
                className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
              />
            </div>
          </div>
        </section>

        <section className="space-y-3 rounded-2xl border bg-card p-6">
          <div>
            <h2 className="text-sm font-semibold">{e.invite.authRoleLabel}</h2>
            <p className="mt-1 text-[11px] text-muted-foreground">{e.invite.authRoleHint}</p>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            {(["systemEmployee", "systemAdmin"] as const).map((r) => {
              const active = authRole === r;
              return (
                <button
                  key={r}
                  type="button"
                  onClick={() => setAuthRole(r)}
                  className={`rounded-lg border p-3 text-start text-sm transition-colors ${
                    active
                      ? "border-primary bg-primary-soft text-primary-soft-foreground"
                      : "border-input hover:bg-muted"
                  }`}
                >
                  <p className="font-medium">{e.authRole[r]}</p>
                </button>
              );
            })}
          </div>
        </section>

        <section className="space-y-4 rounded-2xl border bg-card p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="space-y-1">
              <h2 className="text-sm font-semibold">{e.invite.permissionsLabel}</h2>
              <p className="text-[11px] text-muted-foreground">{e.invite.permissionsHint}</p>
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
            <div className="flex items-start gap-3 rounded-lg border border-primary/30 bg-primary-soft/50 p-3 text-xs text-primary-soft-foreground">
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
                        value={isAdmin ? "allow" : permissions[action]}
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

        <div className="flex flex-wrap items-center justify-end gap-2 border-t pt-4">
          <Link
            href="/admin/employees"
            className="rounded-md px-3 py-2 text-xs text-muted-foreground hover:bg-muted"
          >
            {e.invite.cancel}
          </Link>
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            {e.invite.addCta}
            <Arrow className="size-4" />
          </button>
        </div>
      </form>
    </div>
  );
}

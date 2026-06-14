"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  UserPlus,
  MessageSquare,
  Sparkles,
} from "lucide-react";
import { useI18n } from "@/components/providers/i18n-provider";
import { useStore } from "@/lib/mock/store";
import { PermissionTriState } from "@/components/ui/permission-tri-state";
import type {
  PermissionAction,
  PermissionGroup,
  PermissionState,
} from "@/lib/mock/types";

const GROUPS: Record<PermissionGroup, PermissionAction[]> = {
  contracts: [
    "createInstallmentContract",
    "editInstallments",
    "rescheduleContract",
    "deleteAttachment",
    "closeContract",
  ],
  payments: ["approvePaymentProof", "rejectPaymentProof", "recordPartialPayment"],
  customers: ["createCustomer", "approveHighRiskCustomer"],
  investors: ["createInvestmentContract", "distributeProfits"],
  system: ["exportReport", "managePermissions"],
};

function blankMatrix(): Record<PermissionAction, PermissionState> {
  return {
    createInstallmentContract: "deny",
    editInstallments: "deny",
    rescheduleContract: "deny",
    deleteAttachment: "deny",
    closeContract: "deny",
    approvePaymentProof: "deny",
    rejectPaymentProof: "deny",
    recordPartialPayment: "deny",
    createCustomer: "deny",
    approveHighRiskCustomer: "deny",
    createInvestmentContract: "deny",
    distributeProfits: "deny",
    exportReport: "deny",
    managePermissions: "deny",
  };
}

export default function InviteEmployeePage() {
  const router = useRouter();
  const { dict, dir } = useI18n();
  const { roles } = useStore();
  const e = dict.officeEmployees;
  const Arrow = dir === "rtl" ? ArrowLeft : ArrowRight;
  const BackArrow = dir === "rtl" ? ArrowRight : ArrowLeft;

  const [name, setName] = useState("");
  const [nationalId, setNationalId] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [title, setTitle] = useState("");
  const [permissions, setPermissions] =
    useState<Record<PermissionAction, PermissionState>>(blankMatrix());
  const [templatePickerOpen, setTemplatePickerOpen] = useState(false);

  function setOne(action: PermissionAction, state: PermissionState) {
    setPermissions((prev) => ({ ...prev, [action]: state }));
  }

  function loadTemplate(roleId: string) {
    const role = roles.find((r) => r.id === roleId);
    if (!role) return;
    setPermissions({ ...role.permissions });
    setTemplatePickerOpen(false);
  }

  function submit(ev: React.FormEvent) {
    ev.preventDefault();
    if (!name || !phone || !title) return;
    // Mock: pretend we sent the SMS, go back to the list.
    router.push("/employees?invited=1");
  }

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <Link
        href="/employees"
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
              <label htmlFor="emp-name" className="text-sm font-medium">
                {e.invite.nameLabel}
              </label>
              <input
                id="emp-name"
                value={name}
                onChange={(ev) => setName(ev.target.value)}
                required
                className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="emp-title" className="text-sm font-medium">
                {e.invite.titleLabel}
              </label>
              <input
                id="emp-title"
                value={title}
                onChange={(ev) => setTitle(ev.target.value)}
                required
                placeholder={dir === "rtl" ? "مثال: مساعد مدير العمليات" : "e.g. Operations assistant"}
                className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
              />
              <p className="text-[11px] text-muted-foreground">{e.invite.titleHint}</p>
            </div>
            <div className="space-y-2">
              <label htmlFor="emp-nid" className="text-sm font-medium">
                {e.invite.nationalIdLabel}
              </label>
              <input
                id="emp-nid"
                value={nationalId}
                onChange={(ev) => setNationalId(ev.target.value)}
                dir="ltr"
                className="num h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
                placeholder="10XXXXXXXX"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="emp-phone" className="text-sm font-medium">
                {e.invite.phoneLabel}
              </label>
              <input
                id="emp-phone"
                value={phone}
                onChange={(ev) => setPhone(ev.target.value)}
                dir="ltr"
                className="num h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
                placeholder="5XXXXXXXX"
                required
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <label htmlFor="emp-email" className="flex items-center justify-between text-sm font-medium">
                {e.invite.emailLabel}
                <span className="text-[10px] font-normal text-muted-foreground">
                  {e.invite.emailOptional}
                </span>
              </label>
              <input
                id="emp-email"
                type="email"
                value={email}
                onChange={(ev) => setEmail(ev.target.value)}
                dir="ltr"
                className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
              />
            </div>
          </div>
        </section>

        <section className="space-y-4 rounded-2xl border bg-card p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="space-y-1">
              <h2 className="text-sm font-semibold">{e.invite.permissionsLabel}</h2>
              <p className="text-[11px] text-muted-foreground">{e.invite.permissionsHint}</p>
            </div>
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
                  {roles.map((role) => (
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
          </div>

          <div className="space-y-5">
            {(Object.keys(GROUPS) as PermissionGroup[]).map((group) => (
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
                        value={permissions[action]}
                        onChange={(state) => setOne(action, state)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="flex items-start gap-3 rounded-lg bg-muted/40 p-3 text-xs text-muted-foreground">
          <MessageSquare className="size-4 shrink-0 text-primary" />
          {e.invite.smsHint}
        </div>

        <div className="flex flex-wrap items-center justify-end gap-2 border-t pt-4">
          <Link
            href="/employees"
            className="rounded-md px-3 py-2 text-xs text-muted-foreground hover:bg-muted"
          >
            {e.invite.cancel}
          </Link>
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            {e.invite.sendInviteCta}
            <Arrow className="size-4" />
          </button>
        </div>
      </form>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight, UserPlus, MessageSquare } from "lucide-react";
import { useI18n } from "@/components/providers/i18n-provider";
import { useStore } from "@/lib/mock/store";
import { cn } from "@/lib/utils";

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
  const [roleId, setRoleId] = useState(roles[0]?.id ?? "");

  function submit(ev: React.FormEvent) {
    ev.preventDefault();
    if (!name || !phone || !roleId) return;
    // Mock: pretend we sent the SMS, go back to the list.
    router.push("/employees?invited=1");
  }

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
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

      <form onSubmit={submit} className="space-y-5 rounded-2xl border bg-card p-6">
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
          <div className="space-y-2">
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

        <div className="space-y-2">
          <label htmlFor="emp-role" className="text-sm font-medium">
            {e.invite.roleLabel}
          </label>
          <div className="grid gap-2 sm:grid-cols-2">
            {roles.map((role) => {
              const active = roleId === role.id;
              return (
                <button
                  key={role.id}
                  type="button"
                  onClick={() => setRoleId(role.id)}
                  className={cn(
                    "rounded-lg border p-3 text-start text-sm transition-colors",
                    active
                      ? "border-primary bg-primary-soft text-primary-soft-foreground"
                      : "border-input hover:bg-muted",
                  )}
                >
                  <p className="font-medium">{role.name}</p>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">
                    {role.description}
                  </p>
                </button>
              );
            })}
          </div>
          <p className="text-xs text-muted-foreground">{e.invite.roleHint}</p>
        </div>

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

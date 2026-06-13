"use client";

import { use, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/components/providers/auth-provider";
import { useI18n } from "@/components/providers/i18n-provider";

export default function InviteAcceptPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = use(params);
  const router = useRouter();
  const { dict, dir } = useI18n();
  const { login } = useAuth();
  const e = dict.officeEmployees.accept;
  const Arrow = dir === "rtl" ? ArrowLeft : ArrowRight;

  const [code, setCode] = useState(["", "", "", ""]);
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const [password, setPassword] = useState("");

  function handleChange(idx: number, value: string) {
    if (!/^\d?$/.test(value)) return;
    const next = [...code];
    next[idx] = value;
    setCode(next);
    if (value && idx < 3) refs.current[idx + 1]?.focus();
  }

  function submit(ev: React.FormEvent) {
    ev.preventDefault();
    if (code.some((c) => !c)) return;
    // Mock: accept invite, log in
    login(`invited-${token}@muqsit.sa`);
    router.push("/dashboard");
  }

  return (
    <div className="w-full max-w-md space-y-6">
      <div className="space-y-3 text-center">
        <div className="mx-auto grid size-14 place-items-center rounded-full bg-success/10 text-success">
          <UserCheck className="size-7" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{e.title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{e.subtitle}</p>
        </div>
      </div>

      <form onSubmit={submit} className="space-y-5 rounded-2xl border bg-card p-6 shadow-sm">
        <div className="space-y-2">
          <Label>{e.enterOtp}</Label>
          <div className="flex justify-center gap-3" dir="ltr">
            {code.map((digit, idx) => (
              <input
                key={idx}
                ref={(el) => {
                  refs.current[idx] = el;
                }}
                value={digit}
                onChange={(ev) => handleChange(idx, ev.target.value)}
                inputMode="numeric"
                maxLength={1}
                className="num h-14 w-14 rounded-xl border border-input bg-background text-center text-2xl font-semibold focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="set-password" className="flex items-center justify-between">
            {e.setPassword}
            <span className="text-[10px] font-normal text-muted-foreground">
              {dict.officeEmployees.invite.emailOptional}
            </span>
          </Label>
          <Input
            id="set-password"
            type="password"
            value={password}
            onChange={(ev) => setPassword(ev.target.value)}
            autoComplete="new-password"
          />
          <p className="text-[11px] text-muted-foreground">{e.passwordOptional}</p>
        </div>

        <Button type="submit" className="w-full gap-2">
          {e.finishCta}
          <Arrow className="size-4" />
        </Button>
      </form>
    </div>
  );
}

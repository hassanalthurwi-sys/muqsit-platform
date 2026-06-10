"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useI18n } from "@/components/providers/i18n-provider";

export default function LoginPage() {
  const router = useRouter();
  const { dict, dir } = useI18n();
  const a = dict.authFlow;
  const Arrow = dir === "rtl" ? ArrowLeft : ArrowRight;
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [usePassword, setUsePassword] = useState(false);
  const [remember, setRemember] = useState(false);

  const isPhone = /^[+\d\s]+$/.test(identifier.trim());

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier) return;
    if (usePassword) {
      // straight to dashboard (mock)
      const sp = new URLSearchParams({ from: "password", id: identifier, remember: String(remember) });
      router.push(`/login/otp?${sp.toString()}&direct=1`);
    } else {
      const sp = new URLSearchParams({ id: identifier, remember: String(remember) });
      router.push(`/login/otp?${sp.toString()}`);
    }
  };

  return (
    <div className="w-full max-w-md space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{a.login.title}</h1>
        <p className="text-sm text-muted-foreground">{a.login.hint}</p>
      </div>

      <form onSubmit={submit} className="space-y-5 rounded-2xl border bg-card p-6 shadow-sm">
        <div className="space-y-2">
          <Label htmlFor="identifier">{a.login.identifierLabel}</Label>
          <div className="relative">
            <Input
              id="identifier"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder={a.login.identifierPlaceholder}
              dir="ltr"
              className="num ps-10"
              required
            />
            <span className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              {identifier && !isPhone ? <Mail className="size-4" /> : <Phone className="size-4" />}
            </span>
          </div>
        </div>

        {usePassword ? (
          <div className="space-y-2">
            <Label htmlFor="password">{a.login.passwordLabel}</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>
        ) : null}

        <label className="flex cursor-pointer items-center gap-2 text-xs text-muted-foreground">
          <input
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
            className="size-4 rounded border-input"
          />
          {a.login.remember30}
        </label>

        <Button type="submit" className="w-full gap-2">
          {usePassword ? a.login.continueWithPassword : a.login.continueWithOtp}
          <Arrow className="size-4" />
        </Button>

        <div className="flex items-center justify-between text-xs">
          <button
            type="button"
            onClick={() => setUsePassword((v) => !v)}
            className="text-primary hover:underline"
          >
            {usePassword ? a.login.continueWithOtp : a.login.continueWithPassword}
          </button>
          <Link href="/forgot-password" className="text-muted-foreground hover:text-foreground">
            {a.login.forgotPassword}
          </Link>
        </div>
      </form>

      <div className="text-center text-sm">
        <span className="text-muted-foreground">{a.login.newToMuqsit} </span>
        <Link href="/register" className="font-medium text-primary hover:underline">
          {a.login.registerCta}
        </Link>
      </div>
    </div>
  );
}

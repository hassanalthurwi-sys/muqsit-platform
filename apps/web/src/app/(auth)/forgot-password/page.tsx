"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useI18n } from "@/components/providers/i18n-provider";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { dict, dir } = useI18n();
  const a = dict.authFlow;
  const Arrow = dir === "rtl" ? ArrowLeft : ArrowRight;
  const [phone, setPhone] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!phone) return;
    const sp = new URLSearchParams({ id: phone, mode: "reset" });
    router.push(`/login/otp?${sp.toString()}`);
  }

  return (
    <div className="w-full max-w-md space-y-6">
      <div className="space-y-3 text-center">
        <div className="mx-auto grid size-14 place-items-center rounded-full bg-primary-soft text-primary">
          <KeyRound className="size-7" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{a.forgot.title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{a.forgot.hint}</p>
        </div>
      </div>

      <form onSubmit={submit} className="space-y-5 rounded-2xl border bg-card p-6 shadow-sm">
        <div className="space-y-2">
          <Label htmlFor="phone">{a.login.identifierLabel}</Label>
          <Input
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            dir="ltr"
            className="num"
            placeholder="5XXXXXXXX"
            required
          />
        </div>

        <Button type="submit" className="w-full gap-2">
          {a.login.continueWithOtp}
          <Arrow className="size-4" />
        </Button>
      </form>

      <div className="text-center text-sm">
        <Link href="/login" className="text-primary hover:underline">
          {a.register.backToLogin}
        </Link>
      </div>
    </div>
  );
}

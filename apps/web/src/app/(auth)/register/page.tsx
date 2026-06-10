"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useI18n } from "@/components/providers/i18n-provider";

export default function RegisterPage() {
  const router = useRouter();
  const { dict, dir } = useI18n();
  const a = dict.authFlow;
  const Arrow = dir === "rtl" ? ArrowLeft : ArrowRight;

  const [name, setName] = useState("");
  const [cr, setCr] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !cr || !phone) return;
    const sp = new URLSearchParams({ name, cr, phone, email });
    router.push(`/register/verify?${sp.toString()}`);
  }

  return (
    <div className="w-full max-w-md space-y-6">
      <div className="space-y-3 text-center">
        <div className="mx-auto grid size-14 place-items-center rounded-full bg-primary-soft text-primary">
          <Building2 className="size-7" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{a.register.title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{a.register.hint}</p>
        </div>
      </div>

      <form onSubmit={submit} className="space-y-5 rounded-2xl border bg-card p-6 shadow-sm">
        <div className="flex items-center gap-2 text-xs font-medium text-primary">
          <span className="grid size-5 place-items-center rounded-full bg-primary text-primary-foreground text-[10px]">
            1
          </span>
          {a.register.step1Title}
        </div>

        <div className="space-y-2">
          <Label htmlFor="office-name">{a.register.officeNameLabel}</Label>
          <Input
            id="office-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="cr">{a.register.crLabel}</Label>
          <Input
            id="cr"
            value={cr}
            onChange={(e) => setCr(e.target.value)}
            dir="ltr"
            className="num"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">{a.register.managerPhoneLabel}</Label>
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

        <div className="space-y-2">
          <Label htmlFor="email" className="flex items-center justify-between">
            {a.register.managerEmailLabel}
            <span className="text-[10px] font-normal text-muted-foreground">
              {a.register.managerEmailOptional}
            </span>
          </Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            dir="ltr"
          />
        </div>

        <Button type="submit" className="w-full gap-2">
          {a.register.continueCta}
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

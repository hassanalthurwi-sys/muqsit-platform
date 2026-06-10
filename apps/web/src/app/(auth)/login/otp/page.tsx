"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/providers/auth-provider";
import { useI18n } from "@/components/providers/i18n-provider";

export default function OtpPage() {
  return (
    <Suspense fallback={null}>
      <OtpInner />
    </Suspense>
  );
}

function OtpInner() {
  const router = useRouter();
  const search = useSearchParams();
  const { dict, dir } = useI18n();
  const { login } = useAuth();
  const a = dict.authFlow;
  const Arrow = dir === "rtl" ? ArrowLeft : ArrowRight;

  const identifier = search.get("id") ?? "";
  const [code, setCode] = useState(["", "", "", ""]);
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const [resendSeconds, setResendSeconds] = useState(60);

  useEffect(() => {
    if (resendSeconds <= 0) return;
    const t = setTimeout(() => setResendSeconds((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [resendSeconds]);

  function handleChange(idx: number, value: string) {
    if (!/^\d?$/.test(value)) return;
    const next = [...code];
    next[idx] = value;
    setCode(next);
    if (value && idx < 3) refs.current[idx + 1]?.focus();
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (code.some((c) => !c)) return;
    // Mock — any 4 digits succeed
    login(identifier || "office@muqsit.sa");
    router.push("/dashboard");
  }

  return (
    <div className="w-full max-w-md space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{a.otp.title}</h1>
        <p className="text-sm text-muted-foreground">{a.otp.hint}</p>
        {identifier ? (
          <p className="num text-xs text-muted-foreground" dir="ltr">
            {identifier}
          </p>
        ) : null}
      </div>

      <form onSubmit={submit} className="space-y-5 rounded-2xl border bg-card p-6 shadow-sm">
        <div className="flex justify-center gap-3" dir="ltr">
          {code.map((digit, idx) => (
            <input
              key={idx}
              ref={(el) => {
                refs.current[idx] = el;
              }}
              value={digit}
              onChange={(e) => handleChange(idx, e.target.value)}
              inputMode="numeric"
              maxLength={1}
              className="num h-14 w-14 rounded-xl border border-input bg-background text-center text-2xl font-semibold focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          ))}
        </div>

        <Button type="submit" className="w-full gap-2">
          {a.otp.verifyCta}
          <Arrow className="size-4" />
        </Button>

        <div className="text-center text-xs">
          {resendSeconds > 0 ? (
            <span className="text-muted-foreground">
              {a.otp.resendIn.replace("{n}", String(resendSeconds))}
            </span>
          ) : (
            <button
              type="button"
              onClick={() => setResendSeconds(60)}
              className="text-primary hover:underline"
            >
              {a.otp.resend}
            </button>
          )}
        </div>
      </form>

      <button
        type="button"
        onClick={() => router.back()}
        className="block w-full text-center text-xs text-muted-foreground hover:text-foreground"
      >
        {a.otp.back}
      </button>
    </div>
  );
}

"use client";

import { useRouter } from "next/navigation";
import { LogOut, Smartphone, Languages, KeyRound, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataRow, DataRows } from "@/components/ui/data-row";
import { useAuth } from "@/components/providers/auth-provider";
import { useI18n } from "@/components/providers/i18n-provider";

export default function AccountPage() {
  const router = useRouter();
  const { dict, locale, setLocale } = useI18n();
  const { user, office, logout, daysLeftInTrial } = useAuth();
  const a = dict.authFlow.account;
  const days = daysLeftInTrial();

  function handleLogout() {
    logout();
    router.push("/login");
  }

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{a.title}</h1>
        <p className="text-sm text-muted-foreground">{a.subtitle}</p>
      </header>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base font-semibold">
            <User className="size-4" />
            {a.profile}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <DataRows>
            <DataRow label={dict.identityFieldLabel.entityName} value={user?.name ?? "—"} />
            <DataRow
              label="الجوال"
              value={
                <span className="num text-xs" dir="ltr">
                  {user?.phone ?? "—"}
                </span>
              }
            />
            {user?.email ? (
              <DataRow
                label={dict.auth.email}
                value={
                  <span className="num text-xs" dir="ltr">
                    {user.email}
                  </span>
                }
              />
            ) : null}
            {office ? (
              <DataRow
                label={dict.identityFieldLabel.entityName}
                value={
                  <span>
                    {office.name}
                    {days !== null ? (
                      <span className="num ms-2 inline-flex items-center gap-1 rounded-full bg-gold-soft px-2 py-0.5 text-[10px] text-gold-foreground">
                        🎁 {days} يوم
                      </span>
                    ) : null}
                  </span>
                }
              />
            ) : null}
          </DataRows>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base font-semibold">
            <KeyRound className="size-4" />
            {a.changePassword}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-md border border-input bg-card px-3 py-2 text-xs hover:bg-muted"
          >
            {a.changePassword}
          </button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base font-semibold">
            <Languages className="size-4" />
            {a.language}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setLocale("ar")}
              className={`rounded-md px-3 py-1.5 text-xs ${
                locale === "ar" ? "bg-primary text-primary-foreground" : "bg-muted"
              }`}
            >
              العربية
            </button>
            <button
              type="button"
              onClick={() => setLocale("en")}
              className={`rounded-md px-3 py-1.5 text-xs ${
                locale === "en" ? "bg-primary text-primary-foreground" : "bg-muted"
              }`}
            >
              English
            </button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base font-semibold">
            <Smartphone className="size-4" />
            {a.sessions}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between rounded-lg border bg-card p-3">
            <div>
              <p className="text-sm font-medium">{a.currentDevice}</p>
              <p className="num text-[11px] text-muted-foreground">
                {typeof window !== "undefined"
                  ? `${window.navigator.platform} · ${new Date().toLocaleDateString()}`
                  : ""}
              </p>
            </div>
            <span className="inline-flex items-center gap-1 rounded-full bg-success/10 px-2 py-0.5 text-[10px] text-success">
              نشط
            </span>
          </div>
        </CardContent>
      </Card>

      <button
        type="button"
        onClick={handleLogout}
        className="inline-flex items-center justify-center gap-2 rounded-md border border-destructive/30 px-4 py-2 text-sm font-medium text-destructive hover:bg-destructive/10"
      >
        <LogOut className="size-4" />
        {a.logout}
      </button>
    </div>
  );
}

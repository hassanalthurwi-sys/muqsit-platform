"use client";

import { useState } from "react";
import { Save } from "lucide-react";
import { useI18n } from "@/components/providers/i18n-provider";
import { DEFAULT_SYSTEM_SETTINGS } from "@/lib/mock/admin-data";

export default function PlatformSettingsPage() {
  const { dict } = useI18n();
  const s = dict.admin.settings;
  const [defaultTrialDays, setDefaultTrialDays] = useState(
    DEFAULT_SYSTEM_SETTINGS.defaultTrialDays,
  );
  const [autoSuspendDays, setAutoSuspendDays] = useState(
    DEFAULT_SYSTEM_SETTINGS.autoSuspendDays,
  );
  const [allowSelf, setAllowSelf] = useState(DEFAULT_SYSTEM_SETTINGS.allowSelfRegistration);
  const [announcement, setAnnouncement] = useState(
    DEFAULT_SYSTEM_SETTINGS.globalAnnouncement ?? "",
  );
  const [saved, setSaved] = useState(false);

  function handleSave() {
    // Mock — just flash the indicator.
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{s.title}</h1>
        <p className="text-sm text-muted-foreground">{s.subtitle}</p>
      </header>

      <section className="rounded-2xl border bg-card p-5">
        <div className="space-y-5">
          <div className="space-y-2">
            <label htmlFor="trial-days" className="text-sm font-medium">
              {s.defaultTrialDays}
            </label>
            <p className="text-xs text-muted-foreground">{s.defaultTrialDaysHint}</p>
            <input
              id="trial-days"
              type="number"
              value={defaultTrialDays}
              onChange={(e) => setDefaultTrialDays(Number(e.target.value))}
              min={1}
              max={365}
              className="num h-9 w-32 rounded-md border border-input bg-background px-3 text-sm"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="auto-suspend" className="text-sm font-medium">
              {s.autoSuspendDays}
            </label>
            <p className="text-xs text-muted-foreground">{s.autoSuspendDaysHint}</p>
            <input
              id="auto-suspend"
              type="number"
              value={autoSuspendDays}
              onChange={(e) => setAutoSuspendDays(Number(e.target.value))}
              min={0}
              max={365}
              className="num h-9 w-32 rounded-md border border-input bg-background px-3 text-sm"
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center justify-between text-sm font-medium">
              {s.allowSelfRegistration}
              <input
                type="checkbox"
                checked={allowSelf}
                onChange={(e) => setAllowSelf(e.target.checked)}
                className="size-5 rounded border-input"
              />
            </label>
            <p className="text-xs text-muted-foreground">{s.allowSelfRegistrationHint}</p>
          </div>

          <div className="space-y-2">
            <label htmlFor="announcement" className="text-sm font-medium">
              {s.globalAnnouncement}
            </label>
            <p className="text-xs text-muted-foreground">{s.globalAnnouncementHint}</p>
            <textarea
              id="announcement"
              value={announcement}
              onChange={(e) => setAnnouncement(e.target.value)}
              rows={3}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              placeholder="..."
            />
          </div>
        </div>
      </section>

      <div className="flex items-center justify-between rounded-xl border bg-card p-4">
        <span
          className={`text-xs font-medium ${
            saved ? "text-success" : "text-transparent"
          }`}
        >
          ✓ {s.saved}
        </span>
        <button
          type="button"
          onClick={handleSave}
          className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          <Save className="size-4" />
          {s.save}
        </button>
      </div>
    </div>
  );
}

# Sprint 8 — Office Settings (prototype, revised)

Static review assets for the Sprint 8 prototype on
`claude/sprint8-office-settings` (stacked on `claude/sprint7-operations-center`).
**Prototype only. No backend. No real authentication. Not merged to `main`.**

This is the **revised** Sprint 8 scope. The initial version had Working
Hours, Approval Defaults, and broader Investment Defaults. Those were
removed in favor of simpler office preferences and a new Office Bank
Accounts section.

## Product principle

The settings page should feel like **simple office preferences, not an
ERP administration panel.** Whenever there is a choice, prefer simplicity
and fewer fields.

Per the locked principle: settings are **stored**. Profit distribution
policy is captured here but is **not yet consumed by any logic** — the
next sprint that needs it can read it.

## What's covered

### One route only — `/settings` (existing placeholder rewritten)

Mobile-first scrollable column of six section cards. No sub-routes, no
sidebar. Auto-saves on every change; a "تم الحفظ · HH:MM" pill in the
header confirms the last save.

| # | Section | Fields |
|---|---|---|
| 1 | **هوية المكتب** | Name (AR/EN) · logo file picker · CR · tax number · founded date |
| 2 | **بيانات التواصل** | Phone · email · city · neighborhood · street · website |
| 3 | **الحسابات البنكية للمكتب** | List of `{bank name, beneficiary, IBAN}` with **+ إضافة حساب** / **حذف** buttons. No types, no default, no priority. |
| 4 | **افتراضيات الاستثمار** | Default recycling threshold only. |
| 5 | **سياسة توزيع الأرباح** | `officeFirst` / `investorFirst` / `proportional` + plain-language hint per option + a gold-soft note explaining it is stored only for now. |
| 6 | **تفضيلات الإشعارات** | Channels (WhatsApp/SMS/email) · quiet hours · 6 alert types |

### What changed vs the initial Sprint 8 plan

- **Removed:** Working Hours section (days, open/close, holidays).
- **Removed:** Approval Defaults section (thresholds, reminder days, critical priority).
- **Removed from Investment Defaults:** default office percentage, default duration. The office share is defined when creating each contract — not as a global setting.
- **Added:** Office Bank Accounts section. Operationally important for investors and customers and will likely be referenced later in receipts, payments, notifications, and portals.

### What's deliberately NOT included

- No Working Hours, no Approval Defaults, no Future Integrations.
- No bank-account types, no default-account logic, no priority ordering, no extra banking settings — just bank name, beneficiary, IBAN.
- No sub-routes / no tabs / no settings sidebar.
- No per-section save buttons. Auto-save only.
- No profit-distribution operationalization. Settings are stored; consumption comes later.

## Files

| File | Purpose |
| --- | --- |
| `lib/mock/types.ts` | `OfficeSettings`, `OfficeBankAccount`, `ProfitDistributionPolicy`, `NotificationChannel`, `NotificationAlertType`. |
| `lib/mock/office-settings.ts` | `DEFAULT_OFFICE_SETTINGS` seeded with the existing office identity + 2 sample bank accounts. |
| `lib/mock/store.tsx` | `officeSettings` + `updateOfficeSettings` action; persisted to localStorage. |
| `app/(app)/settings/page.tsx` | Office Settings page (replaces the placeholder). |
| `components/ui/settings-section.tsx` | `SettingsSection`, `SettingsField`, `SettingsGrid` — reused throughout. |
| `lib/i18n/dictionaries.ts` | `officeSettings.*` namespace (AR + EN). |

## Screenshots

| File | Description |
| --- | --- |
| `sprint8.pdf` | Cover + 6 captioned screenshots. |
| `01-settings-full-mobile-ar-light.png` | Full page, mobile · AR · light. |
| `02-settings-full-mobile-ar-dark.png` | Full page, mobile · AR · dark. |
| `03-settings-full-mobile-en-light.png` | Full page, mobile · EN · light. |
| `04-settings-full-desktop-ar-light.png` | Full page, desktop · AR · light. |
| `05-bank-accounts-mobile-ar.png` | Close-up of the new Office Bank Accounts section. |
| `06-profit-policy-desktop-ar.png` | Close-up of the Profit Distribution Policy section. |

## Verification

| Check | Result |
|---|---|
| `pnpm --filter @muqsit/web type-check` | ✅ |
| `pnpm --filter @muqsit/web lint` | ✅ no warnings or errors |
| `pnpm --filter @muqsit/web build` | ✅ |
| Visual screenshots | ✅ 6 captured |

## Stack on top of

```
main
└── … (5)
    └── claude/sprint6-portals
        └── claude/sprint7-operations-center
            └── claude/sprint8-office-settings   ← this sprint
```

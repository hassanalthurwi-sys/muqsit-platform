# Sprint 8 — Office Settings (prototype)

Static review assets for the Sprint 8 prototype on
`claude/sprint8-office-settings` (stacked on `claude/sprint7-operations-center`).
**Prototype only. No backend. No real authentication. Not merged to `main`.**

## Product principle

The office now has the configuration layer future sprints can build upon.
Everything in this sprint is **a setting the office can understand and use
today** — no integration placeholders, no future-only sections.

Per the locked principle: settings are **stored**. Profit distribution policy
is captured here but is **not yet consumed by any logic** — the next sprint
that needs it can read it.

## What's covered

### One route only — `/settings` (existing placeholder rewritten)

Mobile-first scrollable column of seven section cards. No sub-routes,
no sidebar. Auto-saves on every change; a "تم الحفظ · HH:MM" pill in the
header confirms the last save.

| # | Section | Fields |
|---|---|---|
| 1 | **هوية المكتب** | Name (AR/EN) · logo file picker · CR · tax number · founded date |
| 2 | **بيانات التواصل** | Phone · email · city · neighborhood · street · website |
| 3 | **ساعات العمل** | 7-day picker (Sun–Thu default) · open/close time · holidays free-text |
| 4 | **افتراضيات الموافقات** | Payment threshold · reminder days · critical threshold |
| 5 | **افتراضيات الاستثمار** | Default recycling threshold · default office % · default duration |
| 6 | **سياسة توزيع الأرباح** | `officeFirst` / `investorFirst` / `proportional` + plain-language hint per option + a gold-soft note explaining it is stored only for now. |
| 7 | **تفضيلات الإشعارات** | Channels (WhatsApp/SMS/email) · quiet hours · 6 alert types |

### What's deliberately NOT included

- No Future Integrations section. Per direction: if it doesn't provide value
  today, it doesn't occupy space in the prototype.
- No sub-routes / no tabs / no settings sidebar.
- No per-section save buttons. Auto-save only.
- No profit-distribution operationalization. Settings are stored; consumption
  comes later.
- No multi-tenant / multi-office config. Single-office prototype.

## Files

| File | Purpose |
| --- | --- |
| `lib/mock/types.ts` | `OfficeSettings`, `WeekDay`, `ProfitDistributionPolicy`, `NotificationChannel`, `NotificationAlertType`. |
| `lib/mock/office-settings.ts` (new) | `DEFAULT_OFFICE_SETTINGS` seeded with the existing office identity. |
| `lib/mock/store.tsx` | `officeSettings` + `updateOfficeSettings` action; persisted to localStorage. |
| `app/(app)/settings/page.tsx` | Full rewrite as Office Settings (replaces the placeholder). |
| `components/ui/settings-section.tsx` (new) | `SettingsSection`, `SettingsField`, `SettingsGrid` — reused throughout the page. |
| `components/ui/day-picker.tsx` (new) | 7-day toggle. |
| `lib/i18n/dictionaries.ts` | `officeSettings.*` namespace (AR + EN). |

## Screenshots

| File | Description |
| --- | --- |
| `sprint8.pdf` | Cover + 6 captioned screenshots. |
| `01-settings-top-mobile-ar.png` | Full page, mobile · AR · light. |
| `02-settings-mobile-ar-dark.png` | Full page, mobile · AR · dark. |
| `03-settings-mobile-en-light.png` | Full page, mobile · EN · light. |
| `04-settings-desktop-ar-light.png` | Full page, desktop · AR · light. |
| `05-profit-policy-section-desktop-ar.png` | Close-up of the Profit distribution policy section. |
| `06-working-hours-mobile-ar.png` | Close-up of the Working hours section with day picker. |

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

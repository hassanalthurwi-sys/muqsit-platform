# Sprint 16 — Subscription plans

Static review assets for the Sprint 16 prototype on
`claude/sprint16-subscriptions` (stacked on `claude/sprint15-office-employees`).
**Prototype only. No backend, no real billing.**

## Goal

Sprint 14 wired the trial; this sprint wires the **paid plans** that
offices step up to after the trial expires. The platform admin
controls every aspect from inside the app — names, descriptions,
which premium features are bundled, prices per duration, and whether
the plan is currently available.

## Model

| Concept | Notes |
|---|---|
| **Plan** | Configurable bundle: name + description + 4 feature toggles + 3 prices + active flag |
| **Premium features** | AI assistant (WhatsApp) · Bank-receipt OCR · WhatsApp messages · SMS messages |
| **Durations** | Three durations are always offered: 6 months · 1 year · 2 years. Each plan has a price for each — typically longer = better unit price |
| **Tiers shipped in the seed** | **Basic** (all features OFF) and **Pro** (all features ON). The admin can edit either, change features, change prices, or pause a plan |
| **Office ↔ plan** | `OfficeAccount.planId` + `planDuration` + `planStartedAt` + `planEndsAt`. The platform admin assigns/changes a plan from the office detail page |

## Screens

| Route | Purpose |
|---|---|
| `/admin/plans` | List of plans as side-by-side cards. Each card shows the 4 premium features (✓ on, ✗ off), the 3 prices grid, the active badge, and an Edit button |
| `/admin/plans/[id]` | Editor — name, description, 4 feature toggles with hints, 3 price inputs (one per duration), active toggle, save/cancel |
| `/admin/offices/[id]` | Extended with a new "الاشتراك الحالي" section showing the office's current plan + duration + start + renewal dates, plus a "Change plan / Pick plan" workflow that lets the admin pick a plan card and a duration card and confirm |

## Default pricing in the seed

| Duration | Basic | Pro |
|---|---|---|
| 6 months | 1,800 SAR | 3,600 SAR |
| 1 year | 3,000 SAR | 6,000 SAR |
| 2 years | 5,000 SAR | 10,000 SAR |

(All values are illustrative — the admin can edit them at any time
from `/admin/plans/[id]`.)

## What stays out of scope

- No real billing engine, invoices, or payment gateway integration.
  The "تأكيد الاشتراك" button is a local-state toggle.
- No proration when the admin changes a plan mid-cycle.
- No grace period / dunning workflow when a renewal is late.
- No office-facing pricing page (the office sees its own plan on the
  office dashboard but the upgrade picker lives at the admin level
  in this sprint).
- No coupons / promotions / discounts engine.

## Files

| File | Purpose |
| --- | --- |
| `lib/mock/types.ts` | New `SubscriptionFeature` (4 values), `SubscriptionDuration` (6/12/24), `SubscriptionPlan`. `OfficeAccount` gains `planId`, `planDuration`, `planStartedAt`, `planEndsAt`. |
| `lib/mock/plans.ts` (new) | `MOCK_PLANS` — Basic + Pro seed. `findPlan(id)` selector. |
| `lib/mock/admin-data.ts` | 3 existing offices wired to plans (office-001 = Pro/1y, office-004 = Basic/2y, office-007 = Pro/2y). |
| `lib/i18n/dictionaries.ts` | New `admin.plans.*` namespace with feature names + hints + editor / list / office-section strings (AR + EN). New `admin.nav.plans`. |
| `components/admin/sidebar.tsx` | "الباقات" nav item with the Package icon. |
| `app/(admin)/admin/plans/page.tsx` (new) | Plans list. |
| `app/(admin)/admin/plans/[id]/page.tsx` (new) | Plan editor. |
| `app/(admin)/admin/offices/[id]/page.tsx` | Extended with the "Current subscription" section + plan picker. |

## Verification

| Check | Result |
|---|---|
| `pnpm --filter @muqsit/web type-check` | ✅ |
| `pnpm --filter @muqsit/web lint` | ✅ |
| `pnpm --filter @muqsit/web build` | ✅ |
| Visual screenshots | ✅ 6 captured |

## Screenshots

| File | Description |
| --- | --- |
| `sprint16.pdf` | Cover + 6 captioned screenshots. |
| `01-plans-list-desktop-ar.png` | Plans list — Basic (all features ✗) side-by-side with Pro (all features ✓). Each card has 3 price cards (6m / 1y / 2y), active badge, Edit button. Desktop · AR. |
| `02-plan-editor-pro-desktop-ar.png` | Pro plan editor — name, description, 4 feature toggles with hints, 3 price inputs, "available for subscription" toggle, save/cancel. Desktop · AR. |
| `03-plan-editor-basic-desktop-ar.png` | Basic plan editor — same UI with all features off. Desktop · AR. |
| `04-office-with-pro-plan-desktop-ar.png` | Office detail (مكتب مُقسط للتمويل) showing the "الاشتراك الحالي" section with Pro plan / 1 year / price / start / renewal date. Desktop · AR. |
| `05-office-pick-plan-desktop-ar.png` | Same screen with "تغيير الباقة" clicked — plan cards + duration cards picker, confirm button. Desktop · AR. |
| `06-plans-list-mobile-ar.png` | Plans list on mobile. AR. |

## Stack on top of

```
main
└── … (12)
    └── claude/sprint13-auth-entry
        └── claude/sprint14-system-admin
            └── claude/sprint15-office-employees
                └── claude/sprint16-subscriptions   ← this sprint
```

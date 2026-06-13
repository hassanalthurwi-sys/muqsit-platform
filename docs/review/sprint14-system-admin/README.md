# Sprint 14 — System admin / platform level

Static review assets for the Sprint 14 prototype on
`claude/sprint14-system-admin` (stacked on `claude/sprint13-auth-entry`).
**Prototype only. No backend. Mock offices and audit data.**

## Goal

The second of two sprints split out of the original auth-and-platform
plan. Where Sprint 13 built the office-side entry experience, Sprint 14
builds the **other side** — the people who run Muqsit itself.

A system admin and their team can now:

- See how many offices are on the platform, how many are on trial,
  how many active, how many expired, how many suspended.
- Browse the full office list, filter, and search.
- Open any office to view its manager info + subscription + admin
  actions (extend trial, activate, suspend, reactivate).
- Configure platform-wide settings (default trial days, auto-suspend
  window, allow self-registration, global announcement).
- Manage system staff and their permissions.
- View an audit log of every platform-level action.

## Hierarchy

```
Platform level (Sprint 14)
├── System admin             ← full access
└── System staff             ← permissions set by the admin

Office level (Sprint 4 + Sprint 13)
├── Office manager           ← runs their own office
└── Office staff             ← permissions set by the manager

External (Sprint 6)
├── Investor (portal)
└── Customer (portal)
```

The system admin sees offices from above; office staff never see other
offices.

## Screens

| Route | Purpose |
|---|---|
| `/admin/dashboard` | Platform KPIs + recent activity feed |
| `/admin/offices` | All offices with filter pills + search |
| `/admin/offices/[id]` | Single office: manager + subscription + admin actions |
| `/admin/settings` | Platform-wide config — default trial days, auto-suspend, etc. |
| `/admin/employees` | System staff list with their roles + permission counts |
| `/admin/audit` | Platform audit log |

The admin layout uses a dedicated `(admin)` route group with its own
sidebar. The header label reads "النظام · مُقسِّط" so an admin always
knows they're on the platform side.

## Settings the admin controls

- **Default trial days** — applied to every new office registration
  (was hard-coded to 30 in Sprint 13).
- **Auto-suspend days** — how long after trial expiry before the
  office is auto-suspended (0 = never).
- **Allow self-registration** — when off, registration becomes
  invite-only.
- **Global announcement** — a free-text banner shown to every office's
  dashboard.

These are wired in the data model but not yet enforced everywhere in
the office app (banner display, registration gate, etc. — wiring those
is a small follow-up).

## Mock data

The admin pages run against `lib/mock/admin-data.ts`:

- **9 offices** — mix of subscription states for the demo:
  - 3 active (long-time customers)
  - 4 on trial (different days remaining: 8, 27, 28, 29)
  - 1 expired (Diyar office — trial ended 12 days ago)
  - 1 suspended (Bahr office — for non-payment)
- **3 system employees** — one admin and two staff with different
  permission sets.
- **5 audit entries** — representative actions (trial extended,
  office registered, office suspended, setting changed, employee
  added).

## Files

| File | Purpose |
| --- | --- |
| `lib/mock/types.ts` | `SystemSettings`, `AdminAuditEntry`, `SystemEmployee` types. |
| `lib/mock/admin-data.ts` (new) | Mock offices, system staff, audit entries, default settings, helpful selectors. |
| `lib/i18n/dictionaries.ts` | New `admin.*` namespace (AR + EN). |
| `components/admin/sidebar.tsx` (new) | Five-item sidebar for the platform shell. |
| `app/(admin)/layout.tsx` (new) | Admin route group layout (sidebar + main). |
| `app/(admin)/admin/dashboard/page.tsx` (new) | KPI grid + recent activity. |
| `app/(admin)/admin/offices/page.tsx` (new) | Office list with filters + search. |
| `app/(admin)/admin/offices/[id]/page.tsx` (new) | Office detail + trial extension + suspend/reactivate. |
| `app/(admin)/admin/settings/page.tsx` (new) | Platform-wide config. |
| `app/(admin)/admin/employees/page.tsx` (new) | System staff list. |
| `app/(admin)/admin/audit/page.tsx` (new) | Platform audit log. |

## What's deliberately NOT included

- No actual permission gates on admin actions (UI buttons exist; the
  enforcement is "trust the system admin").
- No edit forms for system staff (the list is read-only; the +Add
  button is decorative).
- No SMS notification when an admin extends a trial or suspends an
  office.
- No charts on the platform dashboard — KPI tiles are enough for now.
- No multi-tenancy filter on the office app (each office still sees
  its own data; the admin views are separate).
- No automatic enforcement of `autoSuspendDays` setting (would require
  a backend cron).

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
| `sprint14.pdf` | Cover + 6 captioned screenshots. |
| `01-admin-dashboard-desktop-ar.png` | Platform dashboard — 6 KPI tiles + recent activity. |
| `02-offices-list-desktop-ar.png` | All offices with filters + search + days-left badges. |
| `03-office-detail-desktop-ar.png` | Office detail — manager info, subscription, admin actions. |
| `04-settings-desktop-ar.png` | Platform settings — trial days, auto-suspend, announcement. |
| `05-employees-desktop-ar.png` | System staff list with roles + permission counts. |
| `06-audit-desktop-ar.png` | Platform audit log. |

## Stack on top of

```
main
└── … (10)
    └── claude/sprint11-profit-distribution
        └── claude/sprint12-migration-journey
            └── claude/sprint13-auth-entry
                └── claude/sprint14-system-admin   ← this sprint
```

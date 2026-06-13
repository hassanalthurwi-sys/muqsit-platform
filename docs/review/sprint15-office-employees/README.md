# Sprint 15 — Office team management

Static review assets for the Sprint 15 prototype on
`claude/sprint15-office-employees` (stacked on `claude/sprint14-system-admin`).
**Prototype only. No backend. Mock invitations and SMS.**

## Goal

Close the loop on the office team. Sprint 4 built the roles &
permissions matrix; Sprint 13 captured the office manager during
registration. This sprint gives the office manager the screens to
**invite team members**, assign each one a **custom job title and
their own per-employee permissions matrix**, and manage them over
time.

## Title vs. permissions — decoupled

The office manager gives each member a free-text **job title** (e.g.
"مساعد مدير العمليات", "موظف تحصيل — فرع الشمال", "محاسبة أولى") and
**independently** assigns that member a permissions matrix — every
single action (14 of them) can be set to allow / requires approval /
deny. Two people with the same title can have completely different
permissions; one person can have a unique title nobody else has.

Roles from Sprint 4 are still here but they're **templates**, not
identities. The invite form and detail page both offer a "Load from
template" button that fills the matrix from a chosen role; the
manager can then change anything before saving. After save, the
matrix is the source of truth — changing the template later never
retroactively affects employees.

## Screens

| Route | Purpose |
|---|---|
| `/employees` | Team list with filters + search + status badges. The "Title" column shows each member's custom title. |
| `/employees/new` | Invite a member — personal info + custom title + per-employee permissions matrix (optionally pre-filled from a template). |
| `/employees/[id]` | Member detail — edit title, toggle every permission, "based on template / customized" indicator, bypass-approvals, suspend / reactivate, delete. |
| `/invite/[token]` | The invitation-acceptance flow for invited team members |

## Invitation lifecycle

```
Office manager → /employees/new
  ↓ fills name + national ID + phone + role
  ↓ "Send invitation"
                                          (mock — no real SMS)
Member's phone receives SMS with link
  ↓ taps link → /invite/<token>
  ↓ enters 4-digit OTP
  ↓ optionally sets a password
  ↓ "Activate & sign in"
Member lands on /dashboard with their role's permissions
```

The `Employee` interface gained an `inviteStatus` field
(`pending` / `accepted` / `expired`) so the list can mark
not-yet-accepted invitations and the detail page can offer a
"Resend invitation" action.

## Member states surfaced in the UI

| State | Badge | What the office manager sees |
|---|---|---|
| Active member | Green "نشط" | Can change role, suspend, delete |
| Pending invitation | Gold "في انتظار القبول" | Resend invitation, suspend, delete + a banner "أُرسلت دعوة عبر SMS — لم يدخل الموظف بعد" |
| Suspended | Gray "موقوف" | Reactivate, delete |

## Role templates

The Sprint 4 roles (`/permissions`) are still here — مدير المكتب ·
موظف · موظف تحصيل · محاسب — but they only serve as **starting points**
for new employees. The "Load from template" button copies a template's
matrix into the form; from that moment on the matrix is per-employee
and the template is decorative metadata only (we store
`templateRoleId` for informational purposes, never to derive
permissions).

A "**Bypass approvals**" checkbox on the detail page lets the manager
trust a specific member with large-amount transactions without
re-routing every one through the approval workflow.

## What stays out of scope

- No backend; the "send invitation" button is a no-op redirect.
- No SMS service integration.
- No edit form for the role list itself (still on `/permissions`).
- No bulk import of staff.
- No audit log on the office side (Sprint 4's office audit log is
  available; new actions aren't wired into it here).
- No deep-link from the invite SMS to the mobile app (would require
  a native app first).

## Files

| File | Purpose |
| --- | --- |
| `lib/mock/types.ts` | `Employee` gains `title` (free-text, decoupled from roles), `permissions` (per-employee matrix), `templateRoleId`, `phone`, `nationalId`, `inviteStatus`, `invitedAt`, `lastLoginAt`. New `EmployeeInviteStatus` type. Legacy `roleId/roleName/bypassApprovals` kept for backward-compatibility with Sprint 4 audit/approvals/permissions pages. |
| `lib/mock/employees.ts` | Seed expanded to 7 members covering all three states (active, pending, suspended). Each member has a custom title and a per-employee permissions matrix (one member — عبدالله المطيري — gets a custom mix on top of the "employee" template to demonstrate the model). |
| `lib/i18n/dictionaries.ts` | New `officeEmployees.*` namespace (AR + EN) including `permissionStates`, `permissionGroups`, and `permissionActions` so the matrix UI is fully localized. |
| `app/(app)/employees/page.tsx` (new) | List with filter pills + search + status badges. The "Title" column shows each member's custom title. |
| `app/(app)/employees/new/page.tsx` (new) | Invite form — personal info section + free-text title + permissions matrix grouped by category, with a "Load from template" picker. |
| `app/(app)/employees/[id]/page.tsx` (new) | Member detail — personal info, activity, editable title, full permissions matrix (per-action 3-state toggle), "customized" vs "based on template" indicator, bypass-approvals, actions. |
| `app/(auth)/invite/[token]/page.tsx` (new) | Invitation acceptance flow — OTP + optional password. |

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
| `sprint15.pdf` | Cover + 6 captioned screenshots. |
| `01-employees-list-desktop-ar.png` | Team list with 7 members covering all states. The "Title" column shows custom job titles, not role names. Desktop · AR. |
| `02-invite-employee-desktop-ar.png` | Invite form — personal info + free-text title + full permissions matrix (5 groups × 14 actions) with "Load from template" button. Desktop · AR. |
| `03-employee-detail-desktop-ar.png` | Detail page for an active member (نورة) — editable title + editable permissions matrix per action + bypass-approvals + actions. Desktop · AR. |
| `04-employee-pending-desktop-ar.png` | Detail page for a pending invitation (بدر — "موظف تحصيل — فرع الشمال") showing the gold banner and resend-invitation action. Desktop · AR. |
| `05-employees-list-mobile-ar.png` | List on mobile. AR. |
| `06-invite-accept-mobile-ar.png` | Invitation acceptance screen — OTP + optional password. Mobile · AR. |

## Stack on top of

```
main
└── … (11)
    └── claude/sprint12-migration-journey
        └── claude/sprint13-auth-entry
            └── claude/sprint14-system-admin
                └── claude/sprint15-office-employees   ← this sprint
```

# Sprint 15 — Office team management

Static review assets for the Sprint 15 prototype on
`claude/sprint15-office-employees` (stacked on `claude/sprint14-system-admin`).
**Prototype only. No backend. Mock invitations and SMS.**

## Goal

Close the loop on the office team. Sprint 4 built the roles &
permissions matrix; Sprint 13 captured the office manager during
registration. This sprint gives the office manager the screens to
**invite team members**, assign each one a role, and manage them
over time.

## Screens

| Route | Purpose |
|---|---|
| `/employees` | Team list with filters + search + status badges |
| `/employees/new` | Invite a member (name + national ID + phone + role) |
| `/employees/[id]` | Member detail — change role, toggle bypass-approvals, suspend / reactivate, delete |
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

## Role assignment

The invite form and the detail page both let the manager pick from
the **existing roles defined in Sprint 4** (`/permissions`). The
roles seed includes: مدير المكتب · موظف · موظف تحصيل · محاسب.

A "**Bypass approvals**" checkbox on the detail page mirrors the
existing `bypassApprovals` flag — letting the manager trust a specific
member with large-amount transactions without re-routing every one
through the approval workflow.

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
| `lib/mock/types.ts` | `Employee` gains `phone`, `nationalId`, `inviteStatus`, `invitedAt`, `lastLoginAt`. New `EmployeeInviteStatus` type. |
| `lib/mock/employees.ts` | Seed expanded to 7 members covering all three states (active, pending, suspended) with phones + national IDs. |
| `lib/i18n/dictionaries.ts` | New `officeEmployees.*` namespace (AR + EN). |
| `app/(app)/employees/page.tsx` (new) | List with filter pills + search + status badges. |
| `app/(app)/employees/new/page.tsx` (new) | Invite form with role card picker + SMS hint. |
| `app/(app)/employees/[id]/page.tsx` (new) | Member detail — personal info, activity, role section, actions. |
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
| `01-employees-list-desktop-ar.png` | Team list with 7 members covering all states. Desktop · AR. |
| `02-invite-employee-desktop-ar.png` | Invite form with name + national ID + phone + role cards. Desktop · AR. |
| `03-employee-detail-desktop-ar.png` | Detail page for an active member (نورة) with role change + bypass-approvals + actions. Desktop · AR. |
| `04-employee-pending-desktop-ar.png` | Detail page for a pending invitation (بدر) showing the gold banner and resend-invitation action. Desktop · AR. |
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

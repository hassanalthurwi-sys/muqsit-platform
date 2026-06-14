# Sprint 15 — Office team + Platform team (revision 2)

Static review assets for the Sprint 15 prototype on
`claude/sprint15-office-employees` (stacked on `claude/sprint14-system-admin`).
**Prototype only. No backend. Mock invitations and SMS.**

## What this sprint contains

Two parallel deliverables on top of Sprints 13 (office manager
registration) and 14 (system admin shell):

1. **Office team management** (`/employees`) — the office manager
   invites their staff and assigns each one a role from Sprint 4's
   roles & permissions seed (مدير المكتب · موظف · موظف تحصيل · محاسب).
   This is the same simple role-based model Sprint 4 established —
   no per-employee flexibility here.

2. **Platform team management** (`/admin/employees`) — the **platform
   owner** (system admin) builds the team that runs the platform
   itself. Each platform staff member gets a free-text **job title**
   and a **per-employee permissions matrix** independent from the
   title. The auth role (`platform admin` vs `platform staff`) is a
   separate dimension used only for routing/shell access.

The flexibility model lives at the platform layer because that's where
the variety of duties (support, accounting, operations) demands
fine-grained, individual permission decisions. The office layer keeps
the simpler "pick a role" model since office staff fall into a small
set of well-understood roles.

## Office screens (Sprint 4 role model)

| Route | Purpose |
|---|---|
| `/employees` | Team list with filters + search + status badges |
| `/employees/new` | Invite a member (name + national ID + phone + role) |
| `/employees/[id]` | Member detail — change role, toggle bypass-approvals, suspend / reactivate, delete |
| `/invite/[token]` | The invitation-acceptance flow for invited team members |

### Invitation lifecycle (office)

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

### Member states surfaced in the office UI

| State | Badge | What the office manager sees |
|---|---|---|
| Active member | Green "نشط" | Can change role, suspend, delete |
| Pending invitation | Gold "في انتظار القبول" | Resend invitation, suspend, delete + a banner |
| Suspended | Gray "موقوف" | Reactivate, delete |

## Platform screens (per-employee title + matrix)

| Route | Purpose |
|---|---|
| `/admin/employees` | Platform team list — title, allowed-permissions count (`n من 15`), last login, status |
| `/admin/employees/new` | Add a platform staff member — personal info + free-text title + auth-role picker + permissions matrix |
| `/admin/employees/[id]` | Staff detail — edit title, full matrix per action, "customized / based on template" indicator, suspend / reactivate / delete |

### Title vs. permissions — decoupled

The platform owner gives each member a free-text **job title** (e.g.
"قائد فريق العمليات", "محاسب اشتراكات", "أخصائي دعم المكاتب") and
**independently** assigns a permissions matrix. The 15 actions are
grouped into 5 categories:

| Group | Actions |
|---|---|
| المكاتب | عرض، تسجيل، تمديد التجربة، تعليق، إعادة تفعيل، حذف |
| الاشتراكات والفواتير | تغيير الخطة، إصدار فاتورة، تسجيل دفعة اشتراك |
| موظفو المنصة | عرض، إدارة |
| الإعدادات | إعدادات المنصة، إرسال إعلان عام |
| السجل والتقارير | عرض السجل، تصدير التقارير |

Every action is **tri-state**: مسموح / يحتاج موافقة / ممنوع.

### Templates, not identities

Four reusable starting matrices ship in the seed:

| Template | Description |
|---|---|
| مدير المنصة | All actions allowed |
| مسؤول دعم | View offices, extend trial, record subscription payments, view audit; announcements need approval |
| محاسب المنصة | View offices, issue invoice, record payment, plan changes need approval, export reports |
| أخصائي عمليات | Register offices, extend trial, suspend/reactivate; plan changes need approval |

The "Load from template" picker copies a template's matrix into the
form. The manager can change anything before saving. After save the
matrix is per-employee — changes to a template **never retroactively
affect existing staff**. `templateRoleId` is informational only and
drives the "Started from template / Customized" indicator on the
detail page.

### Platform admin override

When a staff member has the auth role `platform admin` (`systemAdmin`),
the permissions matrix is shown read-only with a hint:
"مدير المنصة لديه كل الصلاحيات بشكل افتراضي — هذه المصفوفة للعرض فقط."
This keeps the screen consistent for all roles while making the
admin's bypass behavior explicit.

## What stays out of scope

- No backend; the "Send invitation" / "Add staff" buttons are no-op
  redirects.
- No SMS service integration.
- No bulk import of staff.
- No audit-log wiring for the new platform actions (Sprint 14's audit
  log displays existing entries; new mock actions weren't backfilled).
- No edit form for the platform role templates themselves.

## Files

| File | Purpose |
| --- | --- |
| `lib/mock/types.ts` | `Employee` gains `phone`, `nationalId`, `inviteStatus`, `invitedAt`, `lastLoginAt`. New `EmployeeInviteStatus` type. **`SystemEmployee` gains `title` (free-text), per-employee `permissions: Record<SystemPermissionAction, PermissionState>`, `templateRoleId`, `lastLoginAt`.** New `SystemPermissionAction` (15 actions), `SystemPermissionGroup` (5), and `SystemRole` (template). |
| `lib/mock/employees.ts` | Office staff seed expanded to 7 members across active / pending / suspended states. |
| `lib/mock/admin-data.ts` | Adds **`MOCK_SYSTEM_ROLES`** (4 templates) and replaces the 3-member system staff seed with a **5-member platform team** carrying titles + per-employee matrices (one — نوف القحطاني — customizes the "operations" template to demonstrate). |
| `lib/i18n/dictionaries.ts` | Adds the full `admin.employees.*` namespace (AR + EN) — `invite`, `detail`, `permissionGroups`, `permissionActions`, `authRole`, etc. |
| `app/(app)/employees/page.tsx` (new) | Office team list. |
| `app/(app)/employees/new/page.tsx` (new) | Office invite form (role card picker). |
| `app/(app)/employees/[id]/page.tsx` (new) | Office member detail (role dropdown + bypass approvals). |
| `app/(auth)/invite/[token]/page.tsx` (new) | Invitation acceptance flow — OTP + optional password. |
| `app/(admin)/admin/employees/page.tsx` | Platform team list — title, allowed-count, last login. |
| `app/(admin)/admin/employees/new/page.tsx` (new) | Platform staff invite form — title + auth-role + permissions matrix + load-from-template. |
| `app/(admin)/admin/employees/[id]/page.tsx` (new) | Platform staff detail — editable title + matrix + customized indicator + admin override hint. |

## Verification

| Check | Result |
|---|---|
| `pnpm --filter @muqsit/web type-check` | ✅ |
| `pnpm --filter @muqsit/web lint` | ✅ |
| `pnpm --filter @muqsit/web build` | ✅ |
| Visual screenshots | ✅ 10 captured |

## Screenshots

| File | Description |
| --- | --- |
| `sprint15.pdf` | Cover + 10 captioned screenshots. |
| `01-employees-list-desktop-ar.png` | Office team list with 7 members. Desktop · AR. |
| `02-invite-employee-desktop-ar.png` | Office invite form (role card picker). Desktop · AR. |
| `03-employee-detail-desktop-ar.png` | Office member detail (نورة) with role dropdown + bypass-approvals. Desktop · AR. |
| `04-employee-pending-desktop-ar.png` | Office member detail for a pending invitation (بدر) with the gold banner + resend action. Desktop · AR. |
| `05-employees-list-mobile-ar.png` | Office list on mobile. AR. |
| `06-invite-accept-mobile-ar.png` | Invitation acceptance — OTP + optional password. Mobile · AR. |
| `07-platform-employees-list-desktop-ar.png` | **Platform team list** — five staff members with distinct custom titles; "الصلاحيات" column shows the allowed-count out of 15. Desktop · AR. |
| `08-platform-employee-invite-desktop-ar.png` | **Add platform staff form** — personal info + free-text title + auth-role picker + matrix (5 groups, 15 tri-state actions) + "Load from template". Desktop · AR. |
| `09-platform-employee-detail-desktop-ar.png` | **Platform staff detail — نوف القحطاني** (custom mix on the "operations" template). Editable title + matrix; "صلاحيات مخصصة" badge. Desktop · AR. |
| `10-platform-employee-admin-detail-desktop-ar.png` | **Platform admin (مدير المنصة) detail** — same screen with the matrix locked all-allow and a primary banner explaining the override. Desktop · AR. |

## Stack on top of

```
main
└── … (11)
    └── claude/sprint12-migration-journey
        └── claude/sprint13-auth-entry
            └── claude/sprint14-system-admin
                └── claude/sprint15-office-employees   ← this sprint
```

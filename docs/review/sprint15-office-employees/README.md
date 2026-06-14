# Sprint 15 — Office team + Platform team (revision 3)

Static review assets for the Sprint 15 prototype on
`claude/sprint15-office-employees` (stacked on `claude/sprint14-system-admin`).
**Prototype only. No backend. Mock invitations and SMS.**

## What this sprint contains

Two parallel deliverables on top of Sprints 13 (office manager
registration) and 14 (system admin shell):

1. **Office team management** (`/employees`) — the office manager
   invites their staff. Each one gets a **free-text job title** and a
   **per-employee permissions matrix** (14 actions × tri-state)
   independent of the title. Sprint 4 roles remain as optional
   starting **templates**.

2. **Platform team management** (`/admin/employees`) — the **platform
   owner** (system admin) builds the team that runs the platform
   itself. Same flexibility model: free-text title + per-employee
   matrix. The platform matrix has its own 15-action set across
   5 categories and 4 starting templates.

The model is identical across both layers — only the action sets and
the templates differ.

## Title vs. permissions — decoupled (both layers)

For every employee (office or platform), the manager:

1. Writes a **free-text job title** (e.g. "مساعد مدير العمليات",
   "موظف تحصيل — فرع الشمال", "قائد فريق العمليات", "محاسب اشتراكات").
   The title is informational — it never affects permissions.
2. Picks a **starting template** (optional) or starts from a blank
   matrix.
3. Toggles each permission individually to **allow / requires approval
   / deny**. After save, the matrix is per-employee and immune to
   template changes.

The detail page shows "صلاحيات مخصصة" (badge) when the matrix has
diverged from its template, or "بدأت من قالب: {name}" when it still
matches exactly.

## Office screens

| Route | Purpose |
|---|---|
| `/employees` | Team list with filters + search + status badges. The "المسمى" column shows custom titles. |
| `/employees/new` | Invite a member — personal info + free-text title + per-employee permissions matrix (optionally pre-filled from a Sprint 4 role template). |
| `/employees/[id]` | Member detail — editable title, editable matrix, "customized / based on template" indicator, bypass-approvals, suspend / reactivate, delete. |
| `/invite/[token]` | The invitation-acceptance flow for invited team members |

### Office permission set (Sprint 4)

14 actions in 5 groups: contracts (5) · payments (3) · customers (2) ·
investors (2) · system (2). Templates: مدير المكتب · موظف · موظف تحصيل ·
محاسب.

### Invitation lifecycle (office)

```
Office manager → /employees/new
  ↓ fills name + national ID + phone + title + permissions
  ↓ "Send invitation"
                                          (mock — no real SMS)
Member's phone receives SMS with link
  ↓ taps link → /invite/<token>
  ↓ enters 4-digit OTP
  ↓ optionally sets a password
  ↓ "Activate & sign in"
Member lands on /dashboard with their per-employee permissions
```

### Member states surfaced in the office UI

| State | Badge | What the office manager sees |
|---|---|---|
| Active member | Green "نشط" | Can edit title, edit matrix, suspend, delete |
| Pending invitation | Gold "في انتظار القبول" | Resend invitation, suspend, delete + banner |
| Suspended | Gray "موقوف" | Reactivate, delete |

## Platform screens

| Route | Purpose |
|---|---|
| `/admin/employees` | Platform team list — title, allowed-permissions count (`n من 15`), last login, status |
| `/admin/employees/new` | Add a platform staff member — personal info + free-text title + auth-role picker + permissions matrix |
| `/admin/employees/[id]` | Staff detail — edit title, full matrix per action, "customized / based on template" indicator, suspend / reactivate / delete |

### Platform permission set

15 actions in 5 groups:

| Group | Actions |
|---|---|
| المكاتب | عرض، تسجيل، تمديد التجربة، تعليق، إعادة تفعيل، حذف |
| الاشتراكات والفواتير | تغيير الخطة، إصدار فاتورة، تسجيل دفعة اشتراك |
| موظفو المنصة | عرض، إدارة |
| الإعدادات | إعدادات المنصة، إرسال إعلان عام |
| السجل والتقارير | عرض السجل، تصدير التقارير |

Templates: مدير المنصة · مسؤول دعم · محاسب المنصة · أخصائي عمليات.

### Platform admin override

When a staff member has the auth role `platform admin` (`systemAdmin`),
the permissions matrix is shown read-only with a hint:
"مدير المنصة لديه كل الصلاحيات بشكل افتراضي — هذه المصفوفة للعرض فقط."

## What stays out of scope

- No backend; the "Send invitation" / "Add staff" buttons are no-op
  redirects.
- No SMS service integration.
- No bulk import of staff.
- No audit-log wiring for the new actions.
- No edit form for the role templates themselves (still on
  `/permissions` for office).

## Files

| File | Purpose |
| --- | --- |
| `lib/mock/types.ts` | **`Employee`** gains `title` (free-text), `permissions: Record<PermissionAction, PermissionState>`, `templateRoleId`, `phone`, `nationalId`, `inviteStatus`, `invitedAt`, `lastLoginAt`. Legacy `roleId/roleName/bypassApprovals` kept for Sprint 4 audit/approvals compat. **`SystemEmployee`** gains `title`, per-employee `permissions: Record<SystemPermissionAction, PermissionState>`, `templateRoleId`, `lastLoginAt`. New `SystemPermissionAction` (15), `SystemPermissionGroup` (5), `SystemRole`. |
| `lib/mock/employees.ts` | Office staff seed — 7 members with custom titles + per-employee matrices (one — عبدالله المطيري — customizes the "employee" template). |
| `lib/mock/admin-data.ts` | Adds **`MOCK_SYSTEM_ROLES`** (4 templates) and a **5-member platform team** with custom titles + per-employee matrices (one — نوف القحطاني — customizes the "operations" template). |
| `lib/i18n/dictionaries.ts` | Adds `officeEmployees.permissionGroups` + `permissionActions` + matrix UI strings; full `admin.employees.*` namespace including the platform variant. AR + EN. |
| `app/(app)/employees/page.tsx` (new) | Office team list (title column). |
| `app/(app)/employees/new/page.tsx` (new) | Office invite — title + matrix + load-from-template. |
| `app/(app)/employees/[id]/page.tsx` (new) | Office member detail — editable title + matrix + customized indicator. |
| `app/(auth)/invite/[token]/page.tsx` (new) | Invitation acceptance — OTP + optional password. |
| `app/(admin)/admin/employees/page.tsx` | Platform team list — title, allowed-count, last login. |
| `app/(admin)/admin/employees/new/page.tsx` (new) | Platform invite — title + auth-role + matrix + load-from-template. |
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
| `01-employees-list-desktop-ar.png` | Office team list — 7 members. "المسمى" column shows custom titles. Desktop · AR. |
| `02-invite-employee-desktop-ar.png` | Office invite — personal info + free-text title + permissions matrix (5 groups × 14 actions) + "Load from template". Desktop · AR. |
| `03-employee-detail-desktop-ar.png` | Office member detail (نورة — أخصائي خدمة عملاء) — editable title + matrix + actions. Desktop · AR. |
| `04-employee-pending-desktop-ar.png` | Pending invitation (بدر — "موظف تحصيل — فرع الشمال") with gold banner + resend action. Desktop · AR. |
| `05-employees-list-mobile-ar.png` | Office list on mobile. AR. |
| `06-invite-accept-mobile-ar.png` | Invitation acceptance — OTP + optional password. Mobile · AR. |
| `07-platform-employees-list-desktop-ar.png` | Platform team list — five staff with distinct titles; "الصلاحيات" column shows allowed-count out of 15. Desktop · AR. |
| `08-platform-employee-invite-desktop-ar.png` | Add platform staff — personal info + title + auth-role + matrix (15 actions × 5 groups) + "Load from template". Desktop · AR. |
| `09-platform-employee-detail-desktop-ar.png` | Platform staff detail (نوف القحطاني — قائد فريق العمليات) — customized matrix on top of the "operations" template. Desktop · AR. |
| `10-platform-employee-admin-detail-desktop-ar.png` | Platform admin detail (حسن الثرى — مدير المنصة) — matrix locked all-allow with override banner. Desktop · AR. |

## Stack on top of

```
main
└── … (11)
    └── claude/sprint12-migration-journey
        └── claude/sprint13-auth-entry
            └── claude/sprint14-system-admin
                └── claude/sprint15-office-employees   ← this sprint
```

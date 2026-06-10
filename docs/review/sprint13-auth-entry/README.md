# Sprint 13 — Auth & entry experience

Static review assets for the Sprint 13 prototype on
`claude/sprint13-auth-entry` (stacked on `claude/sprint12-migration-journey`).
**Prototype only. No backend. Mock OTP and registration.**

## Goals

Build a smart, easy login and registration experience that feels like
a modern Saudi banking app — phone-first, OTP-default, no friction.
Office self-registration with an automatic 30-day free trial. A "welcome"
choice between starting the migration journey or starting fresh.

The data model is future-proofed for the Phase 2 group-of-offices model
without complicating the Phase 1 UI.

## Phase 1 vs Phase 2

| Capability | Phase 1 (now) | Phase 2 (later) |
|---|---|---|
| One user → one office | ✅ enforced | mostly retained |
| Office groups (`OfficeGroup`) | type exists, UI hidden | activated for group managers |
| `User.officeIds[]` array | length always = 1 | length > 1 possible |
| Tenant switcher | hidden | visible for groupManager |
| System admin level | not built | Sprint 14 |

In code, the many-to-many shape is built from day one (`officeIds: string[]`,
`OfficeGroup` interface, future-proof selectors). The Phase 1 UI simply
keeps everything single-office.

## Screens

| Route | Purpose |
|---|---|
| `/login` | Smart unified login (phone or email, OTP-by-default) |
| `/login/otp` | 4-digit OTP entry with resend cooldown |
| `/register` | Office registration — step 1: office details |
| `/register/verify` | Office registration — step 2: OTP verification |
| `/welcome` | After successful registration — pick migration or fresh start |
| `/forgot-password` | Send OTP to phone to reset password |
| `/account` | Logged-in user's profile, language, sessions, sign out |

## Smart routing after login

The unified login screen detects the user type from the identifier and
routes accordingly (Phase 1 mocks every user as an office manager; the
shape is in place for the other user types).

| Detected user | Lands at |
|---|---|
| Office manager / employee | `/dashboard` |
| Investor | `/portal/investor` (already exists) |
| Customer | `/portal/customer` (already exists) |
| System admin / employee | `/admin/dashboard` (Sprint 14) |

No "I am a..." picker — the system figures it out.

## Trial mechanics

When an office self-registers:

- `subscriptionStatus` set to `"trial"`
- `trialStartedAt` = now
- `trialEndsAt` = now + 30 days (the default; Sprint 14 will let system
  admins change the default)

The dashboard shows a banner reflecting the current trial state:

| Trial state | Banner |
|---|---|
| > 3 days left | Gold-soft: 🎁 "متبقي N يوم من تجربتك" + "ترقية الاشتراك" |
| ≤ 3 days left | Warning-soft: ⏰ "تجربتك تنتهي قريباً" |
| Expired | Destructive: "انتهت تجربتك المجانية" |

After expiration, the office can still see its data but cannot create
new operational records (implementation gate not enforced in the Sprint
13 prototype; banner only).

## Data model additions

```ts
// Roles cover all the user types — including those wired in Sprint 14.
type UserRole =
  | "systemAdmin" | "systemEmployee"   // Sprint 14
  | "groupManager"                      // Phase 2
  | "officeManager" | "officeEmployee"
  | "investor" | "customer";

interface OfficeAccount {
  ...existing fields,
  trialStartedAt?: string;
  trialEndsAt?: string;
  subscriptionStatus: "trial" | "active" | "expired" | "suspended";
  groupId?: string;  // Phase 2 — null in Phase 1
}

interface OfficeGroup {  // Phase 2 — defined now, unused in UI
  id: string;
  name: string;
  ownerUserId: string;
  officeIds: string[];
  createdAt: string;
}

interface AppUser {
  id: string;
  name: string;
  phone: string;
  email?: string;
  role: UserRole;
  officeIds: string[];          // Many-to-many from day one
  defaultOfficeId?: string;
  investorId?: string;
  customerId?: string;
  createdAt: string;
  lastLoginAt?: string;
}
```

The `AuthProvider` now tracks `user`, `office`, `daysLeftInTrial()`, and
exposes `registerOffice(...)`, `loginAs(...)`, and the existing
`login(email)` for backward compatibility.

## Files

| File | Purpose |
| --- | --- |
| `lib/mock/types.ts` | New `UserRole`, `SubscriptionStatus`, `OfficeAccount`, `OfficeGroup`, `AppUser`, `DeviceSession`. |
| `lib/i18n/dictionaries.ts` | New `authFlow.*` namespace (AR + EN) — ~70 strings. |
| `components/providers/auth-provider.tsx` | Extended with user + office + trial + registerOffice + loginAs. |
| `app/(auth)/login/page.tsx` | Rewritten as a smart phone/email login with OTP toggle. |
| `app/(auth)/login/otp/page.tsx` (new) | 4-digit OTP entry with 60-second resend cooldown. |
| `app/(auth)/register/page.tsx` (new) | Office registration step 1. |
| `app/(auth)/register/verify/page.tsx` (new) | Office registration step 2 (OTP) + trial activation. |
| `app/(auth)/forgot-password/page.tsx` (new) | Password recovery via phone OTP. |
| `app/(app)/welcome/page.tsx` (new) | Post-registration welcome screen. |
| `app/(app)/account/page.tsx` (new) | User profile, language switcher, sessions, sign out. |
| `app/(app)/dashboard/page.tsx` | New `TrialBanner` component above the migration banner. |

## What's deliberately NOT included

- No real backend (mock OTP — any 4 digits work).
- No actual SMS sending.
- No real password hashing or encryption.
- No "I am a..." user-type picker (smart detection only).
- No tenant switcher (Phase 1).
- No system admin screens (Sprint 14).
- No payment / subscription processing.
- No biometric login.
- No multi-factor for now beyond OTP.

## Verification

| Check | Result |
|---|---|
| `pnpm --filter @muqsit/web type-check` | ✅ |
| `pnpm --filter @muqsit/web lint` | ✅ |
| `pnpm --filter @muqsit/web build` | ✅ |
| Visual screenshots | ✅ 8 captured |

## Screenshots

| File | Description |
| --- | --- |
| `sprint13.pdf` | Cover + 8 captioned screenshots. |
| `01-login-mobile-ar.png` | Smart login — phone/email + OTP-by-default. Mobile · AR. |
| `02-otp-mobile-ar.png` | 4-digit OTP entry with resend cooldown. Mobile · AR. |
| `03-register-mobile-ar.png` | Office registration step 1 — office details. Mobile · AR. |
| `04-register-verify-mobile-ar.png` | Office registration step 2 — OTP verification. Mobile · AR. |
| `05-welcome-mobile-ar.png` | Post-registration welcome with trial badge + two choices. Mobile · AR. |
| `06-dashboard-trial-banner-desktop-ar.png` | Dashboard with the gold trial banner. Desktop · AR. |
| `07-account-mobile-ar.png` | Account profile with language switcher and sign-out. Mobile · AR. |
| `08-forgot-mobile-ar.png` | Forgot password — sends OTP to phone. Mobile · AR. |

## Stack on top of

```
main
└── … (9)
    └── claude/sprint10-investor-wallet
        └── claude/sprint11-profit-distribution
            └── claude/sprint12-migration-journey
                └── claude/sprint13-auth-entry   ← this sprint
```

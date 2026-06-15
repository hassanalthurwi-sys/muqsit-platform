# Sprint 20 — Authentication (OTP + signed session)

Real auth on top of Sprint 19. Phone-based OTP flow with HMAC-signed
session cookies. The prototype's `localStorage` session keeps working
when `AUTH_SECRET` is unset (sandbox mode).

## Deliverables

### Library
- `lib/auth/otp-store.ts` — issue + verify 4-digit OTPs with TTL
  (5 min) and attempt-cap (5). In-memory for sandbox, swap to
  Redis/Postgres for production.
- `lib/auth/session.ts` — HMAC-SHA256 signed token written to
  `muqsit_session` cookie (`httpOnly`, `secure` in prod, 30 days).
  `getSession()` / `setSession()` / `clearSession()`.

### Routes
- `POST /api/auth/otp` — `{ phone, channel? }` → issues code, dispatches
  via SMS/WhatsApp in prod, logs in sandbox. Returns `devCode` outside
  production so the prototype is testable.
- `POST /api/auth/verify` — `{ phone, code }` → verifies the OTP,
  resolves the phone against `OfficeAccount.managerPhone`,
  `SystemEmployee.phone`, or `Employee.phone`, and writes the session.
- `GET /api/auth/session` — returns current session payload.
- `DELETE /api/auth/session` — logout.

### Middleware
- `src/middleware.ts` guards `/admin/*` (systemAdmin/systemEmployee),
  `/portal/investor/*` (investor), `/portal/customer/*` (customer).
- Sandbox mode (`!AUTH_SECRET`) lets the localStorage flow keep
  driving the prototype — so reviewing the UI without backing
  services still works.

## Session shape
```typescript
{
  uid: string;
  phone: string;
  role: "systemAdmin" | "systemEmployee" | "officeManager"
      | "officeEmployee" | "investor" | "customer";
  officeId?: string;
  name: string;
  iat: number;
  exp: number;
}
```

## What stays out of scope
- Full Auth.js (NextAuth) — the signed-cookie approach covers the
  prototype + production. Migration to NextAuth lands when we need
  social providers / passkeys.
- Phone reachability via real Unifonic / WhatsApp — Sprints 21–22.
- Per-route permission checks beyond role gating — Sprint 24
  (alongside ZATCA, when we tighten the surface for billing).

## Verification
| Check | Result |
|---|---|
| type-check / lint / build | ✅ |
| Middleware compiles into the edge bundle | ✅ |
| Sandbox UI unchanged | ✅ |

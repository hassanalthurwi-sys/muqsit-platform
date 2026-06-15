# Sprint 22 — SMS gateway (Unifonic)

Saudi-licensed SMS provider with sandbox fallback. Also wired into
the OTP issuance flow from Sprint 20.

## Deliverables
- `lib/integrations/sms.ts` — `sendSms({to, body, senderName?})`,
  `installmentReminderSms()` (≤160c, matches BRS Sprint 17 example),
  `otpSms(code)`.
- `POST /api/sms/send`.
- `POST /api/auth/otp` now calls the WhatsApp or SMS adapter to
  actually dispatch the code (was a `console.log` stub in Sprint 20).

## Env vars
```
UNIFONIC_APP_SID=...
UNIFONIC_SENDER=Muqsit
UNIFONIC_CALLBACK_URL=https://muqsit.sa/api/sms/webhook   # optional
```

## Behavior
- **Live mode**: `POST el.cloud.unifonic.com/rest/SMS/messages`.
- **Sandbox**: log + synthetic id.
- Warns on payloads > 160 chars (multi-segment billing).

## Verification
- type-check / lint / build ✅

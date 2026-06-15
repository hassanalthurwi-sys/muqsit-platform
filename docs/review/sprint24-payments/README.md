# Sprint 24 — Payment gateway (Moyasar)

Real payment processing for subscription checkout (BRS §5.26). Saudi
PCI-DSS provider supporting Mada, Visa, Mastercard, Apple Pay,
STC Pay, and bank transfer.

## Deliverables
- `lib/integrations/payments.ts` — `createPaymentIntent()`,
  `fetchPaymentStatus()`. Method enum maps to Moyasar `source.type`.
- `POST /api/payments/intent` — kicks off a payment, returns the
  redirect URL when the gateway requires interactive auth (3DS).
- `GET /api/payments/status/[id]` — poll status (used by checkout
  return page).
- `POST /api/payments/webhook` — Moyasar callback receiver.
  Verifies `x-moyasar-webhook-token`, marks the subscription paid,
  flips the office to `active`.

## Env vars
```
MOYASAR_API_KEY=sk_live_...   # sk_test_... in Test/UAT
MOYASAR_WEBHOOK_SECRET=...
```

## Sandbox behavior
- `createPaymentIntent` returns `status: "paid"` with a synthetic id
  so Sprint 17's checkout success screen still appears without a
  real gateway.
- `fetchPaymentStatus` echoes `"paid"` for sandbox ids.

## Verification
- type-check / lint / build ✅

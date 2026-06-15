# Sprint 21 — WhatsApp Business integration

Production adapter for sending and receiving WhatsApp messages via
Meta Cloud API. Sandbox fallback logs payloads instead of dispatching.

## Deliverables
- `lib/integrations/whatsapp.ts` — `sendWhatsApp({text|template})`,
  `isWhatsAppLive()`, `installmentReminderText()` (matches the BRS
  example from Sprint 17).
- `POST /api/whatsapp/send` — text or template dispatch.
- `GET /api/whatsapp/webhook` — Meta verification handshake.
- `POST /api/whatsapp/webhook` — inbound messages + status callbacks.

## Env vars
```
WHATSAPP_PHONE_ID=...
WHATSAPP_TOKEN=...
WHATSAPP_VERIFY_TOKEN=...
WHATSAPP_GRAPH_VERSION=v22.0   # optional, defaults to v22.0
```

## Behavior
- **Live mode** (env set): `POST graph.facebook.com/v22.0/{phone}/messages`.
- **Sandbox mode**: `console.log` the payload, return a synthetic
  message id. Lets every UI flow reach "message sent" state without
  external network.

## Verification
- type-check / lint / build ✅

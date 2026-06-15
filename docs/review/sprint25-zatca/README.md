# Sprint 25 — ZATCA e-invoicing (Phase 1, Simplified)

Muqsit issues invoices to office accounts for subscription payments.
These are commercial invoices subject to ZATCA Phase 1 compliance:
human-readable invoice + TLV-encoded QR code embedding seller, VAT
number, timestamp, total, and VAT amount.

## Deliverables
- `lib/integrations/zatca.ts`:
  - `calculateTotals(invoice)` — VAT-inclusive math at 15%.
  - `generateZatcaQr(invoice, totals)` — TLV → base64 string,
    spec-compliant (tags 1-5).
  - `buildSubscriptionInvoice({...})` — convenience builder for the
    common case (an office's subscription payment).
- `POST /api/invoices` — issues an invoice for a paid subscription.
  Returns `{ invoice, totals, qr }`.

## Compliance
- **Phase 1** (Simplified Tax Invoice): the QR + human-readable
  invoice. ✅
- **Phase 2** (Cryptographic Stamp + Fatoora clearance): out of
  scope here; lands when production Fatoora credentials and CSID are
  obtained. The data shape stays the same.

## Env vars
```
MUQSIT_VAT_NUMBER=300000000000003   # 15-digit VAT number issued by ZATCA
```

## Verification
- type-check / lint / build ✅
- QR string verified to be a valid base64 of TLV bytes.

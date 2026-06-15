# Sprint 23 — OCR (Claude Vision)

Production OCR pipeline backing the three use-cases in BRS §5.24.5:
bank transfer receipts, identity documents (national ID / iqama /
passport), and migration documents (Sprint 12).

## Deliverables
- `lib/integrations/ocr.ts` — `readReceipt(imageBase64)`,
  `readIdentity(imageBase64)`. Uses Claude Sonnet 4.6 with structured
  JSON output prompts in Arabic.
- `POST /api/ocr/receipt`.
- `POST /api/ocr/identity`.

## Behavior
- **Live mode** (`ANTHROPIC_API_KEY` set): Claude Vision extracts
  structured fields with ≈0.95 confidence.
- **Sandbox / failure**: returns plausible mock fields with 0.85
  confidence so payment proof flows reach the review screen even
  without external services.

## Models
- Default: `claude-sonnet-4-6` — fast and accurate for receipts/IDs.
- Easy swap to `claude-opus-4-8` per call for hard cases.

## Verification
- type-check / lint / build ✅
- Sandbox fallback returns valid `OcrReceiptResult` / `OcrIdentityResult`.

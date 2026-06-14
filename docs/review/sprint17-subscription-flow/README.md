# Sprint 17 — Office-facing subscription flow + LLM assistant

Static review assets for the Sprint 17 prototype on
`claude/sprint17-subscription-flow` (stacked on
`claude/sprint16-subscriptions`).
**Prototype only. Real LLM in production, smart fallback in this sandbox.**

## Goal

Sprint 16 built the plan model and the admin tools. This sprint
closes the loop on the **office side** — the office manager:

1. Discovers the plans through a new `/subscription` page.
2. Understands each premium feature with a plain-Arabic explanation,
   a scenario, and a real dialogue example — no jargon.
3. Asks an **LLM-powered chat assistant** any question and gets a
   contextual answer.
4. Picks a plan, picks a duration, picks a Saudi payment method, and
   activates.

## Why every screen is built for non-technical office owners

Sprint 16 said "AI assistant", "OCR", "WhatsApp messages", "SMS" —
clear to us, opaque to a customer. This sprint replaces those with:

| Old (technical) | New (plain Arabic) |
|---|---|
| المساعد الذكي | مساعدك الذكي على الواتساب — يكلِّم عملاءك بدلًا عنك ٢٤/٧ |
| OCR | قراءة الإيصالات والوثائق تلقائيًا — إيصالات + هويات + بياناتك القديمة |
| رسائل الواتساب | رسائل واتساب تفصيلية لعملائك — كاملة برموز وروابط وحساب بنكي |
| رسائل SMS | رسائل SMS مختصرة — سطر واحد لمن ما هو على الواتساب |

Each feature card collapses into an essential one-liner with stats,
and expands on demand into a scenario + real dialogue example.

## The AI Assistant scope (from the seed copy)

The seed copy on the office subscription page documents the agreed
scope of the WhatsApp AI assistant — verbatim from the product
direction:

- Reaches out to customers ٢٤/٧ to remind them of upcoming
  installments.
- When a customer replies that they've paid, asks for the receipt
  photo.
- Forwards the photo to an office staff member with a validity
  assessment ("إيصال صحيح ٩٥٪").
- Answers customer questions about their installment contracts after
  ID verification.
- Routes investors to the investor portal because of data sensitivity.

## OCR scope (broader than Sprint 16's hint)

The full OCR scope across three daily use-cases:

1. Customer bank-transfer receipt photos → extract amount, sender,
   reference, date, bank.
2. National ID / iqama / identity proofs → auto-fill customer and
   investor profiles.
3. Old data migration — Excel, PDF, photos of paper ledgers — feeds
   into the Sprint 12 migration journey.

## SMS vs WhatsApp — explained by example

Office owners often ask "ما الفرق بين الواتساب و SMS؟". The new
feature cards answer it by example, not by abstraction:

- **WhatsApp message** (Pro): a full multi-line message with the
  installment amount, date, contract number, bank IBAN, emojis,
  and a call-to-action.
- **SMS message** (Pro): a single 160-char line: "مُقسِّط: قسطك بتاريخ
  ١٥/٧، ٢,٥٠٠ ر.س. حوّل لـ SA12 3456 7890."

The cards show both side-by-side so the value of having *both* is
obvious.

## Screens

| Route | Purpose |
|---|---|
| `/subscription` | Office-facing pricing page — trial banner, duration toggle with savings badges (vs. 6m), two plan cards, expandable feature cards, floating chat button |
| `/subscription/checkout?plan=...&duration=...` | Order summary + Saudi payment method picker + Pay button |
| `/subscription/checkout` (after submit) | Success state with receipt-style summary |
| `/api/chat` (new POST endpoint) | LLM assistant — calls Claude Haiku 4.5 when `ANTHROPIC_API_KEY` is set, falls back to intent-matched rich responses otherwise |

## Saudi payment methods supported

The checkout page offers six methods, all common in Saudi Arabia:

1. **مدى** (Mada) — selected by default
2. **Apple Pay**
3. **STC Pay**
4. **Visa**
5. **Mastercard**
6. **حوالة بنكية** (bank transfer, 1–3 day clearance hint)

The methods are presented with a logo, name, and one-line hint
("بطاقة مدى — الأكثر استخدامًا في السعودية"). Real payment
integration is out of scope for the prototype; the submit button
goes to a success state.

## The chat assistant

A floating "💬 اسأل عن الباقات" button sits at the bottom-end of
`/subscription`. Tapping it slides up a chat panel:

- Welcome message + 4 starter suggestion chips:
  - "ما الفرق بين الأساسية والاحترافية؟"
  - "هل أحتاج المساعد الذكي؟"
  - "كيف يشتغل OCR؟"
  - "ما الفرق بين رسائل الواتساب وSMS؟"
- User can type a free question.
- Backend route `/api/chat` proxies to Anthropic's Claude
  **Haiku 4.5** with a system prompt that encodes the plans, the
  features, the AI assistant scope, and the rule "talk to office
  owners in simple Saudi Arabic; never invent features".

### LLM and fallback strategy

- **Production** (or any env with `ANTHROPIC_API_KEY` set): real calls
  to `claude-haiku-4-5-20251001`.
- **Prototype / sandbox** (no key): the same API route returns a
  **rich keyword-matched fallback** that mimics the live behaviour —
  the same canned-but-thoughtful answers for the common intents
  (difference, AI assistant, OCR, WhatsApp vs SMS, pricing,
  "do I need this?"). The fallback is shipped on purpose so
  every screen reviews end-to-end without external services.

The screenshots below were captured in fallback mode.

## What stays out of scope

- No real payment gateway integration — the Pay button moves to the
  success state via local React state.
- No invoice generation / VAT receipt.
- No webhook on payment success (the office's planId would be
  updated server-side in production).
- No promo / coupon engine.
- No streaming responses in the chat (one-shot replies for
  prototype simplicity).

## Files

| File | Purpose |
| --- | --- |
| `lib/mock/types.ts` | New `SubscriptionPaymentMethod` (mada, visa, mastercard, applePay, stcPay, bankTransfer). |
| `lib/mock/feature-content.ts` (new) | Marketing copy per feature — plain title, value line, scenario, dialogue example, wow stats. Kept separate from `MOCK_PLANS` so the admin can edit pricing without losing the copy. |
| `lib/i18n/dictionaries.ts` | New `officeSubscription.*` namespace (AR + EN) — trial banner, duration toggle, chat strings, payment methods + hints, checkout flow, success state. Plus updated OCR hint to reflect the broader scope. |
| `components/subscription/feature-card.tsx` (new) | Expandable feature card with plain title / value line / stats / scenario / dialogue example. |
| `components/subscription/chat-widget.tsx` (new) | Floating chat button + slide-up panel + suggestion chips + LLM-backed chat. |
| `app/(app)/subscription/page.tsx` (new) | Office subscription page — trial banner, duration toggle, plan cards, feature cards, chat widget. |
| `app/(app)/subscription/checkout/page.tsx` (new) | Order summary + Saudi payment method picker + success state. |
| `app/api/chat/route.ts` (new) | LLM endpoint — Anthropic SDK with intent-matched fallback. |
| `package.json` | Added `@anthropic-ai/sdk`. |

## Verification

| Check | Result |
|---|---|
| `pnpm --filter @muqsit/web type-check` | ✅ |
| `pnpm --filter @muqsit/web lint` | ✅ |
| `pnpm --filter @muqsit/web build` | ✅ |
| Live `/api/chat` smoke test (fallback path) | ✅ (Arabic + English answers verified) |
| Visual screenshots | ✅ 8 captured |

## Screenshots

| File | Description |
| --- | --- |
| `sprint17.pdf` | Cover + 8 captioned screenshots. |
| `01-subscription-page-desktop-ar.png` | Office subscription page — trial banner ("بقي ١٧ يوم"), duration toggle with "وفّر ١٧٪" badge on 2-year, Basic vs Pro side-by-side, each with 4 collapsed feature cards. Desktop · AR. |
| `02-subscription-feature-expanded-desktop-ar.png` | Same page with the AI Assistant feature card expanded — full scenario + 6-step dialogue (assistant ↔ customer ↔ employee). Desktop · AR. |
| `03-chat-welcome-desktop-ar.png` | Chat widget opened — welcome message + 4 suggestion chips. Desktop · AR. |
| `04-chat-conversation-desktop-ar.png` | Chat after the user asks "ما الفرق بين الأساسية والاحترافية؟" then "كيف يشتغل OCR؟" — both replies show the rich keyword-matched fallback (Arabic, 3 short bullets, real-world framing). Desktop · AR. |
| `05-checkout-desktop-ar.png` | Checkout — order summary (Pro / 1 year / 6,000 ر.س) + 6 Saudi payment methods (Mada selected). Desktop · AR. |
| `06-checkout-success-desktop-ar.png` | Success state — green check, receipt-style summary (plan, duration, total, method = مدى), "back to office dashboard". Desktop · AR. |
| `07-subscription-mobile-ar.png` | Subscription page on mobile. AR. |
| `08-chat-mobile-ar.png` | Chat conversation on mobile after asking about the AI assistant. AR. |

## Stack on top of

```
main
└── … (13)
    └── claude/sprint14-system-admin
        └── claude/sprint15-office-employees
            └── claude/sprint16-subscriptions
                └── claude/sprint17-subscription-flow   ← this sprint
```

// Sprint 25 — ZATCA e-invoicing (Phase 1 — Simplified Tax Invoice).
//
// Generates the TLV-encoded base64 QR string ZATCA requires on every
// invoice, plus the invoice JSON payload Muqsit issues to offices for
// their subscriptions.
//
// Phase 2 of ZATCA (the cryptographic XML invoice + clearance via
// Fatoora) lands as a separate sprint when integration credentials
// are obtained. The TLV/QR + JSON shape here is the long-lived part.

export interface ZatcaInvoice {
  invoiceNumber: string;       // e.g. INV-2026-00042
  issuedAt: string;            // ISO timestamp
  seller: { name: string; vatNumber: string };
  buyer: { name: string; vatNumber?: string };
  // Line items.
  items: Array<{
    description: string;
    quantity: number;
    unitPrice: number;         // SAR, VAT-exclusive
  }>;
  vatRate: number;             // e.g. 0.15
  currency: "SAR";
}

export interface ZatcaTotals {
  subtotal: number;
  vat: number;
  total: number;
}

export function calculateTotals(inv: ZatcaInvoice): ZatcaTotals {
  const subtotal = inv.items.reduce(
    (sum, it) => sum + it.quantity * it.unitPrice,
    0,
  );
  const vat = round2(subtotal * inv.vatRate);
  const total = round2(subtotal + vat);
  return { subtotal: round2(subtotal), vat, total };
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

// TLV encoder per ZATCA spec.
// Tags: 1=seller name, 2=VAT number, 3=timestamp, 4=total with VAT,
// 5=VAT amount.
function tlv(tag: number, value: string): Buffer {
  const v = Buffer.from(value, "utf8");
  return Buffer.concat([Buffer.from([tag, v.length]), v]);
}

export function generateZatcaQr(
  inv: ZatcaInvoice,
  totals: ZatcaTotals,
): string {
  const buffers = [
    tlv(1, inv.seller.name),
    tlv(2, inv.seller.vatNumber),
    tlv(3, inv.issuedAt),
    tlv(4, totals.total.toFixed(2)),
    tlv(5, totals.vat.toFixed(2)),
  ];
  return Buffer.concat(buffers).toString("base64");
}

// Issued by Muqsit to office accounts for subscription payments.
// Returns the full invoice + ZATCA-compliant QR.
export function buildSubscriptionInvoice(args: {
  invoiceNumber: string;
  officeName: string;
  officeVatNumber?: string;
  planName: string;
  durationMonths: number;
  totalSar: number;
  issuedAt?: string;
}): { invoice: ZatcaInvoice; totals: ZatcaTotals; qr: string } {
  const VAT_RATE = 0.15;
  // Reverse the VAT to land on exactly `totalSar`.
  const subtotal = round2(args.totalSar / (1 + VAT_RATE));
  const invoice: ZatcaInvoice = {
    invoiceNumber: args.invoiceNumber,
    issuedAt: args.issuedAt ?? new Date().toISOString(),
    seller: {
      name: "منصة مُقسِّط",
      vatNumber: process.env.MUQSIT_VAT_NUMBER ?? "300000000000003",
    },
    buyer: {
      name: args.officeName,
      vatNumber: args.officeVatNumber,
    },
    items: [
      {
        description: `اشتراك ${args.planName} — ${args.durationMonths} شهر`,
        quantity: 1,
        unitPrice: subtotal,
      },
    ],
    vatRate: VAT_RATE,
    currency: "SAR",
  };
  const totals = calculateTotals(invoice);
  const qr = generateZatcaQr(invoice, totals);
  return { invoice, totals, qr };
}

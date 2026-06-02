import type { PaymentProof } from "./types";

// Receipt placeholder is a tiny inline SVG data URI so it ships without an actual asset.
const RECEIPT_PLACEHOLDER =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 640">
      <rect width="480" height="640" fill="#fafafa" stroke="#d4d4d8"/>
      <rect x="30" y="40" width="420" height="80" fill="#e8f2ec"/>
      <text x="50" y="80" font-family="Arial" font-size="18" fill="#1b5e3c" font-weight="700">إيصال تحويل بنكي</text>
      <text x="50" y="105" font-family="Arial" font-size="13" fill="#4a4d54">Bank transfer receipt — placeholder</text>
      <g font-family="Arial" font-size="14" fill="#1d1f24">
        <text x="50" y="170">من / Sender</text>
        <text x="430" y="170" text-anchor="end" font-weight="600">…</text>
        <line x1="50" y1="185" x2="430" y2="185" stroke="#e2e4e8"/>
        <text x="50" y="220">المبلغ / Amount</text>
        <text x="430" y="220" text-anchor="end" font-weight="600">…</text>
        <line x1="50" y1="235" x2="430" y2="235" stroke="#e2e4e8"/>
        <text x="50" y="270">التاريخ / Date</text>
        <text x="430" y="270" text-anchor="end" font-weight="600">…</text>
        <line x1="50" y1="285" x2="430" y2="285" stroke="#e2e4e8"/>
        <text x="50" y="320">المرجع / Reference</text>
        <text x="430" y="320" text-anchor="end" font-weight="600">…</text>
        <line x1="50" y1="335" x2="430" y2="335" stroke="#e2e4e8"/>
        <text x="50" y="370">البنك / Bank</text>
        <text x="430" y="370" text-anchor="end" font-weight="600">…</text>
      </g>
      <rect x="30" y="540" width="420" height="60" fill="#e2e4e8"/>
      <text x="240" y="575" text-anchor="middle" font-family="Arial" font-size="14" fill="#4a4d54">بيانات الإيصال يتم استخراجها بواسطة OCR</text>
    </svg>`,
  );

export const MOCK_PAYMENT_PROOFS: PaymentProof[] = [
  {
    id: "pp-001",
    customerId: "cus-1",
    contractId: "ins-2025-001",
    installmentId: "ins-2025-001-i4",
    uploadedAt: "2025-05-14T14:24:00Z",
    fileName: "receipt-may-shareef.jpg",
    receiptImageUrl: RECEIPT_PLACEHOLDER,
    ocr: {
      transferAmount: 383,
      senderName: "محمد ع. الشريف",
      transferDate: "2025-05-14",
      transferReference: "TF8492011",
      bankName: "مصرف الراجحي",
      confidence: 0.92,
    },
    status: "pending",
    // Same reference as an earlier (already-approved) proof — demonstrates the duplicate warning
    duplicateOf: "pp-historic-mar",
  },
  {
    id: "pp-002",
    customerId: "cus-2",
    contractId: "ins-2024-018",
    installmentId: "ins-2024-018-i9",
    uploadedAt: "2025-05-31T11:08:00Z",
    fileName: "receipt-may-fatima.png",
    receiptImageUrl: RECEIPT_PLACEHOLDER,
    ocr: {
      transferAmount: 188.89,
      senderName: "فاطمة محمد القحطاني",
      transferDate: "2025-05-30",
      transferReference: "TF8501227",
      bankName: "البنك الأهلي السعودي",
      confidence: 0.97,
    },
    status: "pending",
  },
  {
    id: "pp-003",
    customerId: "cus-3",
    contractId: "ins-2024-022",
    installmentId: "ins-2024-022-i8",
    uploadedAt: "2025-05-31T09:42:00Z",
    fileName: "receipt-may-alotaibi.jpg",
    receiptImageUrl: RECEIPT_PLACEHOLDER,
    ocr: {
      transferAmount: 800,
      senderName: "خالد سعد العتيبي",
      transferDate: "2025-05-30",
      transferReference: "TF8501982",
      bankName: "البنك السعودي الفرنسي",
      confidence: 0.89,
    },
    status: "pending",
    // amount > due (overpayment) → triggers clarification suggestion
  },
];

export function findProof(id: string): PaymentProof | undefined {
  return MOCK_PAYMENT_PROOFS.find((p) => p.id === id);
}

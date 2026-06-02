import type { WhatsAppThread } from "./types";

export const MOCK_WHATSAPP_THREADS: WhatsAppThread[] = [
  {
    customerId: "cus-1",
    messages: [
      {
        id: "w1-1",
        ts: "2025-05-13T10:00:00Z",
        from: "system",
        type: "text",
        body:
          "🔔 تذكير من مكتب مُقسِط:\n\nقسطك الشهري بقيمة 383 ر.س مستحق في 15 مايو 2025.\nرقم العقد: INS-2025-001\n\nيرجى التحويل إلى الحساب البنكي للمكتب:\nSA44 8000 0234 6080 1017 6512 — مصرف الراجحي",
      },
      {
        id: "w1-2",
        ts: "2025-05-14T14:22:00Z",
        from: "customer",
        type: "text",
        body: "تم التحويل ✓",
      },
      {
        id: "w1-3",
        ts: "2025-05-14T14:22:30Z",
        from: "system",
        type: "text",
        body: "شكراً لك. يرجى إرسال صورة الإيصال للتأكيد.",
      },
      {
        id: "w1-4",
        ts: "2025-05-14T14:24:00Z",
        from: "customer",
        type: "image",
        body: "receipt.jpg",
        attachmentRef: "pp-001",
      },
      {
        id: "w1-5",
        ts: "2025-05-14T14:24:30Z",
        from: "system",
        type: "text",
        body:
          "✅ تم استلام الإيصال بنجاح.\nسيتم المراجعة من قبل الموظف خلال 24 ساعة، وستصلك رسالة بالنتيجة.",
      },
    ],
  },
  {
    customerId: "cus-2",
    messages: [
      {
        id: "w2-1",
        ts: "2025-05-13T10:00:00Z",
        from: "system",
        type: "text",
        body:
          "🔔 تذكير: قسطك الشهري بقيمة 188.89 ر.س مستحق في 15 مايو 2025.\nرقم العقد: INS-2024-018",
      },
      {
        id: "w2-2",
        ts: "2025-05-30T20:55:00Z",
        from: "customer",
        type: "text",
        body: "أعتذر عن التأخير — حولت اليوم",
      },
      {
        id: "w2-3",
        ts: "2025-05-30T20:55:30Z",
        from: "system",
        type: "text",
        body: "لا بأس. يرجى إرسال صورة الإيصال للتأكيد.",
      },
      {
        id: "w2-4",
        ts: "2025-05-31T11:08:00Z",
        from: "customer",
        type: "image",
        body: "receipt.png",
        attachmentRef: "pp-002",
      },
      {
        id: "w2-5",
        ts: "2025-05-31T11:08:30Z",
        from: "system",
        type: "text",
        body: "✅ تم الاستلام. سيتم المراجعة قريباً.",
      },
    ],
  },
];

export function findThread(customerId: string): WhatsAppThread | undefined {
  return MOCK_WHATSAPP_THREADS.find((t) => t.customerId === customerId);
}

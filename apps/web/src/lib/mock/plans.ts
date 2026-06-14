// Sprint 16 — Subscription plans seed.
//
// Two tiers: Basic (none of the premium features) and Pro (all four).
// The platform admin can edit names, descriptions, features, prices,
// and active state from /admin/plans/[id].

import type { SubscriptionPlan } from "./types";

export const MOCK_PLANS: SubscriptionPlan[] = [
  {
    id: "plan-basic",
    name: "الباقة الأساسية",
    description:
      "كل أساسيات إدارة العقود والأقساط والمستثمرين. مناسبة للمكاتب التي تتعامل مع عملائها بالقنوات التقليدية.",
    features: {
      aiAssistant: false,
      ocr: false,
      whatsappMessages: false,
      smsMessages: false,
    },
    prices: {
      6: 1800,
      12: 3000,
      24: 5000,
    },
    active: true,
    displayOrder: 1,
    createdAt: "2024-08-01T10:00:00Z",
  },
  {
    id: "plan-pro",
    name: "الباقة الاحترافية",
    description:
      "كل مزايا الأساسية، إضافة إلى المساعد الذكي على الواتساب، التعرف الضوئي على إيصالات التحويل، وإرسال إشعارات SMS وواتساب تلقائيًا للعملاء.",
    features: {
      aiAssistant: true,
      ocr: true,
      whatsappMessages: true,
      smsMessages: true,
    },
    prices: {
      6: 3600,
      12: 6000,
      24: 10000,
    },
    active: true,
    displayOrder: 2,
    createdAt: "2024-08-01T10:00:00Z",
  },
];

export function findPlan(id: string): SubscriptionPlan | undefined {
  return MOCK_PLANS.find((p) => p.id === id);
}

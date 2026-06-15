// Sprint 19 — Database seed script.
//
// Run via `pnpm --filter @muqsit/database db:seed`. Reads from the
// existing mock files (apps/web/src/lib/mock/) and writes the same
// shape to PostgreSQL. Idempotent — uses upsert by stable IDs.

import { PrismaClient, SubscriptionDuration } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL not set — aborting seed.");
    process.exit(1);
  }

  console.log("→ seeding system settings");
  await prisma.systemSettings.upsert({
    where: { id: 1 },
    create: {
      id: 1,
      defaultTrialDays: 30,
      autoSuspendDays: 7,
      allowSelfRegistration: true,
    },
    update: {},
  });

  console.log("→ seeding subscription plans");
  await prisma.subscriptionPlan.upsert({
    where: { id: "plan-basic" },
    create: {
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
      prices: { "6": 1800, "12": 3000, "24": 5000 },
      active: true,
      displayOrder: 1,
    },
    update: {},
  });

  await prisma.subscriptionPlan.upsert({
    where: { id: "plan-pro" },
    create: {
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
      prices: { "6": 3600, "12": 6000, "24": 10000 },
      active: true,
      displayOrder: 2,
    },
    update: {},
  });

  console.log("→ seeding default office (office-default)");
  await prisma.officeAccount.upsert({
    where: { cr: "1010567890" },
    create: {
      id: "office-default",
      name: "مكتب مُقسط للتمويل",
      cr: "1010567890",
      managerName: "حسن بن عبدالله الثرى",
      managerNationalId: "1099443322",
      managerPhone: "+966 55 234 5678",
      managerEmail: "manager@muqsit.sa",
      subscriptionStatus: "active",
      planId: "plan-pro",
      planDuration: SubscriptionDuration.M12,
      planStartedAt: new Date("2025-08-15T10:00:00Z"),
      planEndsAt: new Date("2026-08-15T10:00:00Z"),
    },
    update: {},
  });

  console.log("✓ seed complete");
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

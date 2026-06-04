import type { OfficeSettings } from "./types";

// Defaults seed for first-time loads. Mirrors the office identity already
// present in the rest of the mock pool ("مكتب مُقسِط للتمويل").

export const DEFAULT_OFFICE_SETTINGS: OfficeSettings = {
  identity: {
    nameAr: "مكتب مُقسِط للتمويل",
    nameEn: "Muqsit Office for Financing",
    commercialRegistration: "1010567890",
    taxNumber: "300123456789003",
    foundedAt: "2023-01-15",
  },
  contact: {
    phone: "+966 11 234 5678",
    email: "office@muqsit.sa",
    city: "الرياض",
    neighborhood: "العليا",
    street: "شارع الملك فهد",
    website: "https://muqsit.sa",
  },
  workingHours: {
    days: ["sun", "mon", "tue", "wed", "thu"],
    openTime: "09:00",
    closeTime: "17:00",
    holidays: "الأعياد الرسمية · اليوم الوطني",
  },
  approvalDefaults: {
    paymentApprovalAbove: 10_000,
    reminderAfterDays: 2,
    criticalThreshold: 50_000,
  },
  investmentDefaults: {
    recyclingThreshold: 50_000,
    officePercentage: 15,
    durationMonths: 24,
  },
  profitDistribution: {
    policy: "officeFirst",
  },
  notifications: {
    channels: ["whatsapp", "email"],
    quietHoursStart: "22:00",
    quietHoursEnd: "07:00",
    alertTypes: [
      "overdueCustomer",
      "newPaymentProof",
      "pendingApproval",
      "contractExpiring",
      "lowOcrConfidence",
    ],
  },
};

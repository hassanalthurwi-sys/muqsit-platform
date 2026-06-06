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
  bankAccounts: [
    {
      id: "ba-1",
      bankName: "مصرف الراجحي",
      beneficiaryName: "مكتب مُقسِط للتمويل",
      iban: "SA0380000000608010167519",
    },
    {
      id: "ba-2",
      bankName: "بنك الرياض",
      beneficiaryName: "مكتب مُقسِط للتمويل",
      iban: "SA9120000201567432110044",
    },
  ],
  investmentDefaults: {
    recyclingThreshold: 50_000,
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

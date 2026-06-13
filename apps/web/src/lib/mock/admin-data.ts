// Sprint 14 — Mock data for the system admin / platform level.

import type { OfficeAccount, AdminAuditEntry, SystemEmployee, SystemSettings } from "./types";

export const DEFAULT_SYSTEM_SETTINGS: SystemSettings = {
  defaultTrialDays: 30,
  autoSuspendDays: 7,
  globalAnnouncement: undefined,
  allowSelfRegistration: true,
};

function daysFromNow(d: number): string {
  const t = new Date();
  t.setDate(t.getDate() + d);
  return t.toISOString();
}

export const MOCK_OFFICES: OfficeAccount[] = [
  {
    id: "office-001",
    name: "مكتب مُقسِط للتمويل",
    cr: "1010567890",
    managerName: "حسن بن عبدالله الثرى",
    managerNationalId: "1099443322",
    managerPhone: "+966 55 234 5678",
    managerEmail: "manager@muqsit.sa",
    createdAt: "2024-08-15T10:00:00Z",
    subscriptionStatus: "active",
  },
  {
    id: "office-002",
    name: "مكتب الفجر للتقسيط",
    cr: "1010998877",
    managerName: "عبدالعزيز السبيعي",
    managerNationalId: "1056782211",
    managerPhone: "+966 50 119 4422",
    managerEmail: "info@alfajr.sa",
    createdAt: daysFromNow(-22),
    trialStartedAt: daysFromNow(-22),
    trialEndsAt: daysFromNow(8),
    subscriptionStatus: "trial",
  },
  {
    id: "office-003",
    name: "مؤسسة الأمل للتقسيط",
    cr: "4030334455",
    managerName: "نوف القحطاني",
    managerNationalId: "1078334451",
    managerPhone: "+966 56 778 1199",
    managerEmail: "noof@al-amal.sa",
    createdAt: daysFromNow(-3),
    trialStartedAt: daysFromNow(-3),
    trialEndsAt: daysFromNow(27),
    subscriptionStatus: "trial",
  },
  {
    id: "office-004",
    name: "مكتب النخيل التجاري",
    cr: "1010567432",
    managerName: "ماجد الغامدي",
    managerNationalId: "1099887766",
    managerPhone: "+966 11 489 9020",
    createdAt: "2024-06-01T10:00:00Z",
    subscriptionStatus: "active",
  },
  {
    id: "office-005",
    name: "مكتب الواحة للتقسيط",
    cr: "1010890123",
    managerName: "خالد العتيبي",
    managerNationalId: "1056123987",
    managerPhone: "+966 50 778 4421",
    createdAt: daysFromNow(-2),
    trialStartedAt: daysFromNow(-2),
    trialEndsAt: daysFromNow(28),
    subscriptionStatus: "trial",
  },
  {
    id: "office-006",
    name: "مكتب الديار",
    cr: "1010445566",
    managerName: "أحمد القحطاني",
    managerNationalId: "1078456321",
    managerPhone: "+966 56 233 1190",
    createdAt: "2024-04-12T10:00:00Z",
    trialStartedAt: "2024-04-12T10:00:00Z",
    trialEndsAt: daysFromNow(-12),
    subscriptionStatus: "expired",
  },
  {
    id: "office-007",
    name: "مكتب الشهراني للتجارة",
    cr: "1010778899",
    managerName: "سعد الشهراني",
    managerNationalId: "1099334502",
    managerPhone: "+966 53 224 9930",
    createdAt: "2024-02-20T10:00:00Z",
    subscriptionStatus: "active",
  },
  {
    id: "office-008",
    name: "مكتب الزهراء التجاري",
    cr: "1010234567",
    managerName: "لطيفة الزهراني",
    managerNationalId: "1056781209",
    managerPhone: "+966 56 110 4488",
    createdAt: daysFromNow(-1),
    trialStartedAt: daysFromNow(-1),
    trialEndsAt: daysFromNow(29),
    subscriptionStatus: "trial",
  },
  {
    id: "office-009",
    name: "مكتب البحر للتقسيط",
    cr: "1010888777",
    managerName: "بدر المالكي",
    managerNationalId: "1078990223",
    managerPhone: "+966 55 990 2244",
    createdAt: "2023-11-05T10:00:00Z",
    subscriptionStatus: "suspended",
  },
];

export const MOCK_SYSTEM_EMPLOYEES: SystemEmployee[] = [
  {
    id: "sysemp-001",
    name: "حسن الثرى",
    nationalId: "1099443322",
    phone: "+966 55 234 5678",
    email: "hassan@muqsit-platform.sa",
    role: "systemAdmin",
    permissions: [
      "viewOffices",
      "extendTrial",
      "suspendOffice",
      "manageEmployees",
      "manageSettings",
      "viewAudit",
    ],
    active: true,
    createdAt: "2023-01-15T10:00:00Z",
  },
  {
    id: "sysemp-002",
    name: "ريم العنزي",
    nationalId: "1056781234",
    phone: "+966 50 887 3092",
    email: "reem@muqsit-platform.sa",
    role: "systemEmployee",
    permissions: ["viewOffices", "extendTrial", "viewAudit"],
    active: true,
    createdAt: "2024-02-01T10:00:00Z",
  },
  {
    id: "sysemp-003",
    name: "سامي العمري",
    nationalId: "1087452103",
    phone: "+966 55 119 2240",
    email: "sami@muqsit-platform.sa",
    role: "systemEmployee",
    permissions: ["viewOffices", "viewAudit"],
    active: true,
    createdAt: "2024-09-12T10:00:00Z",
  },
];

export const MOCK_ADMIN_AUDIT: AdminAuditEntry[] = [
  {
    id: "aud-001",
    ts: daysFromNow(-1),
    actorName: "حسن الثرى",
    actorRole: "systemAdmin",
    action: "trialExtended",
    targetOfficeId: "office-002",
    targetOfficeName: "مكتب الفجر للتقسيط",
    notes: "تمديد ١٤ يوم — بناء على طلب المدير",
  },
  {
    id: "aud-002",
    ts: daysFromNow(-2),
    actorName: "ريم العنزي",
    actorRole: "systemEmployee",
    action: "officeRegistered",
    targetOfficeId: "office-005",
    targetOfficeName: "مكتب الواحة للتقسيط",
  },
  {
    id: "aud-003",
    ts: daysFromNow(-5),
    actorName: "حسن الثرى",
    actorRole: "systemAdmin",
    action: "officeSuspended",
    targetOfficeId: "office-009",
    targetOfficeName: "مكتب البحر للتقسيط",
    notes: "عدم دفع الاشتراك بعد انتهاء التجربة",
  },
  {
    id: "aud-004",
    ts: daysFromNow(-7),
    actorName: "حسن الثرى",
    actorRole: "systemAdmin",
    action: "settingChanged",
    notes: "تغيير مدة التجربة الافتراضية من 14 إلى 30 يوم",
  },
  {
    id: "aud-005",
    ts: daysFromNow(-10),
    actorName: "حسن الثرى",
    actorRole: "systemAdmin",
    action: "employeeAdded",
    notes: "إضافة موظف نظام جديد — سامي العمري",
  },
];

// Selectors
export function officesByStatus(offices: OfficeAccount[]) {
  return {
    trial: offices.filter((o) => o.subscriptionStatus === "trial").length,
    active: offices.filter((o) => o.subscriptionStatus === "active").length,
    expired: offices.filter((o) => o.subscriptionStatus === "expired").length,
    suspended: offices.filter((o) => o.subscriptionStatus === "suspended").length,
  };
}

export function officesRegisteredThisMonth(offices: OfficeAccount[]): number {
  const now = new Date();
  return offices.filter((o) => {
    const d = new Date(o.createdAt);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;
}

export function daysLeftInTrial(office: OfficeAccount): number | null {
  if (office.subscriptionStatus !== "trial" || !office.trialEndsAt) return null;
  const end = new Date(office.trialEndsAt).getTime();
  return Math.max(0, Math.ceil((end - Date.now()) / (1000 * 60 * 60 * 24)));
}

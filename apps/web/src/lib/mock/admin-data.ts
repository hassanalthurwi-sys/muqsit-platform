// Sprint 14 — Mock data for the system admin / platform level.

import type {
  OfficeAccount,
  AdminAuditEntry,
  SystemEmployee,
  SystemPermissionAction,
  SystemRole,
  SystemSettings,
  PermissionState,
} from "./types";

// ─── Sprint 15 — Platform permission templates ─────────────────────
// Reusable starting matrices for platform employees. Like office
// roles, these are templates only — once an employee is created,
// their matrix is independent and changes to the template never
// retroactively apply.

function allowAll(): Record<SystemPermissionAction, PermissionState> {
  return {
    viewOffices: "allow",
    registerOffice: "allow",
    extendTrial: "allow",
    suspendOffice: "allow",
    reactivateOffice: "allow",
    deleteOffice: "allow",
    changeSubscriptionPlan: "allow",
    issueInvoice: "allow",
    recordSubscriptionPayment: "allow",
    viewPlatformEmployees: "allow",
    managePlatformEmployees: "allow",
    manageSystemSettings: "allow",
    sendGlobalAnnouncement: "allow",
    viewAudit: "allow",
    exportPlatformReports: "allow",
  };
}

function denyAll(): Record<SystemPermissionAction, PermissionState> {
  return {
    viewOffices: "deny",
    registerOffice: "deny",
    extendTrial: "deny",
    suspendOffice: "deny",
    reactivateOffice: "deny",
    deleteOffice: "deny",
    changeSubscriptionPlan: "deny",
    issueInvoice: "deny",
    recordSubscriptionPayment: "deny",
    viewPlatformEmployees: "deny",
    managePlatformEmployees: "deny",
    manageSystemSettings: "deny",
    sendGlobalAnnouncement: "deny",
    viewAudit: "deny",
    exportPlatformReports: "deny",
  };
}

export const MOCK_SYSTEM_ROLES: SystemRole[] = [
  {
    id: "sysrole-admin",
    name: "مدير المنصة",
    description: "صلاحيات كاملة على كل عمليات المنصة.",
    permissions: allowAll(),
  },
  {
    id: "sysrole-support",
    name: "مسؤول دعم",
    description:
      "يطّلع على المكاتب، يمدّد التجربة، ويسجّل دفعات الاشتراك. لا يستطيع تعليق أو حذف.",
    permissions: {
      ...denyAll(),
      viewOffices: "allow",
      extendTrial: "allow",
      recordSubscriptionPayment: "allow",
      sendGlobalAnnouncement: "requireApproval",
      viewAudit: "allow",
    },
  },
  {
    id: "sysrole-accountant",
    name: "محاسب المنصة",
    description:
      "يدير الاشتراكات والفواتير والمدفوعات. مطّلع على المكاتب وسجل العمليات.",
    permissions: {
      ...denyAll(),
      viewOffices: "allow",
      issueInvoice: "allow",
      recordSubscriptionPayment: "allow",
      changeSubscriptionPlan: "requireApproval",
      viewAudit: "allow",
      exportPlatformReports: "allow",
    },
  },
  {
    id: "sysrole-operations",
    name: "أخصائي عمليات",
    description:
      "يسجّل المكاتب الجديدة، يمدّد التجربة، ويعلّق المكاتب. تعديلات الاشتراك تحتاج موافقة.",
    permissions: {
      ...denyAll(),
      viewOffices: "allow",
      registerOffice: "allow",
      extendTrial: "allow",
      suspendOffice: "allow",
      reactivateOffice: "allow",
      changeSubscriptionPlan: "requireApproval",
      viewAudit: "allow",
    },
  },
];

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
    planId: "plan-pro",
    planDuration: 12,
    planStartedAt: "2025-08-15T10:00:00Z",
    planEndsAt: "2026-08-15T10:00:00Z",
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
    planId: "plan-basic",
    planDuration: 24,
    planStartedAt: "2025-06-01T10:00:00Z",
    planEndsAt: "2027-06-01T10:00:00Z",
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
    planId: "plan-pro",
    planDuration: 24,
    planStartedAt: "2025-02-20T10:00:00Z",
    planEndsAt: "2027-02-20T10:00:00Z",
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

// Sprint 15 revision — each platform employee gets a custom title
// (free text) and a direct permissions matrix. Templates above are
// optional starting points; templateRoleId is informational only.
export const MOCK_SYSTEM_EMPLOYEES: SystemEmployee[] = [
  {
    id: "sysemp-001",
    name: "حسن الثرى",
    nationalId: "1099443322",
    phone: "+966 55 234 5678",
    email: "hassan@muqsit-platform.sa",
    title: "مدير المنصة",
    role: "systemAdmin",
    permissions: allowAll(),
    templateRoleId: "sysrole-admin",
    active: true,
    createdAt: "2023-01-15T10:00:00Z",
    lastLoginAt: "2026-06-13T09:30:00Z",
  },
  {
    id: "sysemp-002",
    name: "ريم العنزي",
    nationalId: "1056781234",
    phone: "+966 50 887 3092",
    email: "reem@muqsit-platform.sa",
    title: "أخصائي دعم المكاتب",
    role: "systemEmployee",
    permissions: {
      ...denyAll(),
      viewOffices: "allow",
      extendTrial: "allow",
      recordSubscriptionPayment: "allow",
      sendGlobalAnnouncement: "requireApproval",
      viewAudit: "allow",
    },
    templateRoleId: "sysrole-support",
    active: true,
    createdAt: "2024-02-01T10:00:00Z",
    lastLoginAt: "2026-06-13T08:15:00Z",
  },
  {
    id: "sysemp-003",
    name: "سامي العمري",
    nationalId: "1087452103",
    phone: "+966 55 119 2240",
    email: "sami@muqsit-platform.sa",
    title: "محاسب اشتراكات",
    role: "systemEmployee",
    permissions: {
      ...denyAll(),
      viewOffices: "allow",
      issueInvoice: "allow",
      recordSubscriptionPayment: "allow",
      changeSubscriptionPlan: "requireApproval",
      viewAudit: "allow",
      exportPlatformReports: "allow",
    },
    templateRoleId: "sysrole-accountant",
    active: true,
    createdAt: "2024-09-12T10:00:00Z",
    lastLoginAt: "2026-06-12T15:42:00Z",
  },
  {
    id: "sysemp-004",
    name: "نوف القحطاني",
    nationalId: "1078334451",
    phone: "+966 56 778 1199",
    email: "nouf@muqsit-platform.sa",
    // Custom mix — started from "operations" template but the manager
    // elevated subscription-plan changes from "requires approval" to
    // "allow" since she's a senior operations lead.
    title: "قائد فريق العمليات",
    role: "systemEmployee",
    permissions: {
      ...denyAll(),
      viewOffices: "allow",
      registerOffice: "allow",
      extendTrial: "allow",
      suspendOffice: "allow",
      reactivateOffice: "allow",
      changeSubscriptionPlan: "allow",
      sendGlobalAnnouncement: "allow",
      viewAudit: "allow",
      exportPlatformReports: "allow",
    },
    templateRoleId: "sysrole-operations",
    active: true,
    createdAt: "2024-04-22T10:00:00Z",
    lastLoginAt: "2026-06-13T11:22:00Z",
  },
  {
    id: "sysemp-005",
    name: "خالد العتيبي",
    nationalId: "1099887701",
    phone: "+966 53 224 9930",
    email: "khaled@muqsit-platform.sa",
    title: "موظف دعم — مبتدئ",
    role: "systemEmployee",
    permissions: {
      ...denyAll(),
      viewOffices: "allow",
      viewAudit: "allow",
    },
    active: false,
    createdAt: "2024-11-08T10:00:00Z",
    lastLoginAt: "2025-12-20T14:30:00Z",
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

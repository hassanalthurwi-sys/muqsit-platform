import type { Employee, PermissionAction, PermissionState, Role } from "./types";

// Convenience helpers to build the permission matrices succinctly
function allAllow(): Record<PermissionAction, PermissionState> {
  return {
    createInstallmentContract: "allow",
    editInstallments: "allow",
    rescheduleContract: "allow",
    deleteAttachment: "allow",
    closeContract: "allow",
    approvePaymentProof: "allow",
    rejectPaymentProof: "allow",
    recordPartialPayment: "allow",
    createCustomer: "allow",
    approveHighRiskCustomer: "allow",
    createInvestmentContract: "allow",
    distributeProfits: "allow",
    exportReport: "allow",
    managePermissions: "allow",
  };
}

function employeeDefault(): Record<PermissionAction, PermissionState> {
  return {
    createInstallmentContract: "requireApproval",
    editInstallments: "requireApproval",
    rescheduleContract: "requireApproval",
    deleteAttachment: "deny",
    closeContract: "deny",
    approvePaymentProof: "requireApproval",
    rejectPaymentProof: "requireApproval",
    recordPartialPayment: "requireApproval",
    createCustomer: "requireApproval",
    approveHighRiskCustomer: "deny",
    createInvestmentContract: "deny",
    distributeProfits: "deny",
    exportReport: "allow",
    managePermissions: "deny",
  };
}

function collectionsOfficerDefault(): Record<PermissionAction, PermissionState> {
  return {
    createInstallmentContract: "deny",
    editInstallments: "requireApproval",
    rescheduleContract: "requireApproval",
    deleteAttachment: "deny",
    closeContract: "deny",
    approvePaymentProof: "allow",
    rejectPaymentProof: "allow",
    recordPartialPayment: "allow",
    createCustomer: "requireApproval",
    approveHighRiskCustomer: "deny",
    createInvestmentContract: "deny",
    distributeProfits: "deny",
    exportReport: "allow",
    managePermissions: "deny",
  };
}

function accountantDefault(): Record<PermissionAction, PermissionState> {
  return {
    createInstallmentContract: "deny",
    editInstallments: "requireApproval",
    rescheduleContract: "requireApproval",
    deleteAttachment: "deny",
    closeContract: "deny",
    approvePaymentProof: "requireApproval",
    rejectPaymentProof: "requireApproval",
    recordPartialPayment: "requireApproval",
    createCustomer: "deny",
    approveHighRiskCustomer: "deny",
    createInvestmentContract: "deny",
    distributeProfits: "allow",
    exportReport: "allow",
    managePermissions: "deny",
  };
}

export const MOCK_ROLES: Role[] = [
  {
    id: "role-manager",
    name: "مدير المكتب",
    description: "صلاحيات كاملة على جميع العمليات. لا يحتاج إلى موافقة على أي إجراء.",
    isPreset: true,
    permissions: allAllow(),
    employeeCount: 1,
  },
  {
    id: "role-employee",
    name: "موظف",
    description: "معظم الإجراءات تتطلب موافقة من مدير المكتب.",
    isPreset: true,
    permissions: employeeDefault(),
    employeeCount: 2,
  },
  {
    id: "role-collections",
    name: "موظف تحصيل",
    description: "إجراءات التحصيل والمدفوعات مسموحة مباشرة. تعديلات العقود تحتاج موافقة.",
    isPreset: true,
    permissions: collectionsOfficerDefault(),
    employeeCount: 1,
  },
  {
    id: "role-accountant",
    name: "محاسب",
    description: "مراجعة وتوزيع الأرباح مسموح. تعديلات الأقساط تحتاج موافقة.",
    isPreset: true,
    permissions: accountantDefault(),
    employeeCount: 1,
  },
];

export const MOCK_EMPLOYEES: Employee[] = [
  {
    id: "emp-manager-1",
    name: "حسن الذرويعي",
    email: "manager@muqsit.sa",
    phone: "+966 55 234 5678",
    nationalId: "1099443322",
    roleId: "role-manager",
    roleName: "مدير المكتب",
    bypassApprovals: false,
    active: true,
    joinedAt: "2023-01-15",
    inviteStatus: "accepted",
    lastLoginAt: "2026-06-13T09:30:00Z",
  },
  {
    id: "emp-employee-1",
    name: "نورة سامي العنزي",
    email: "noura@muqsit.sa",
    phone: "+966 50 887 3092",
    nationalId: "1056781234",
    roleId: "role-employee",
    roleName: "موظف",
    bypassApprovals: false,
    active: true,
    joinedAt: "2024-03-10",
    inviteStatus: "accepted",
    lastLoginAt: "2026-06-12T15:42:00Z",
  },
  {
    id: "emp-employee-2",
    name: "عبدالله المطيري",
    email: "abdullah@muqsit.sa",
    phone: "+966 54 119 4422",
    nationalId: "1078456321",
    roleId: "role-employee",
    roleName: "موظف",
    bypassApprovals: true,
    active: true,
    joinedAt: "2024-06-22",
    inviteStatus: "accepted",
    lastLoginAt: "2026-06-13T08:15:00Z",
  },
  {
    id: "emp-collections-1",
    name: "محمد عبدالله الشهري",
    email: "collections@muqsit.sa",
    phone: "+966 56 778 1199",
    nationalId: "1099334502",
    roleId: "role-collections",
    roleName: "موظف تحصيل",
    bypassApprovals: false,
    active: true,
    joinedAt: "2024-04-18",
    inviteStatus: "accepted",
    lastLoginAt: "2026-06-13T11:22:00Z",
  },
  {
    id: "emp-accountant-1",
    name: "سارة فهد القحطاني",
    email: "accountant@muqsit.sa",
    phone: "+966 53 224 9930",
    nationalId: "1099887701",
    roleId: "role-accountant",
    roleName: "محاسب",
    bypassApprovals: false,
    active: true,
    joinedAt: "2023-11-05",
    inviteStatus: "accepted",
    lastLoginAt: "2026-06-13T10:05:00Z",
  },
  {
    id: "emp-pending-1",
    name: "بدر العتيبي",
    email: "badr@muqsit.sa",
    phone: "+966 55 990 2244",
    nationalId: "1078990223",
    roleId: "role-employee",
    roleName: "موظف",
    bypassApprovals: false,
    active: true,
    joinedAt: "2026-06-13",
    inviteStatus: "pending",
    invitedAt: "2026-06-13T08:00:00Z",
  },
  {
    id: "emp-suspended-1",
    name: "خالد العمري",
    email: "khaled@muqsit.sa",
    phone: "+966 50 119 2240",
    nationalId: "1087452103",
    roleId: "role-employee",
    roleName: "موظف",
    bypassApprovals: false,
    active: false,
    joinedAt: "2024-09-12",
    inviteStatus: "accepted",
    lastLoginAt: "2025-12-20T14:30:00Z",
  },
];

export function findEmployee(id: string): Employee | undefined {
  return MOCK_EMPLOYEES.find((e) => e.id === id);
}

export function findRole(id: string): Role | undefined {
  return MOCK_ROLES.find((r) => r.id === id);
}

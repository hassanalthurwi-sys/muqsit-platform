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
    roleId: "role-manager",
    roleName: "مدير المكتب",
    bypassApprovals: false,
    active: true,
    joinedAt: "2023-01-15",
  },
  {
    id: "emp-employee-1",
    name: "نورة سامي العنزي",
    email: "noura@muqsit.sa",
    roleId: "role-employee",
    roleName: "موظف",
    bypassApprovals: false,
    active: true,
    joinedAt: "2024-03-10",
  },
  {
    id: "emp-employee-2",
    name: "عبدالله المطيري",
    email: "abdullah@muqsit.sa",
    roleId: "role-employee",
    roleName: "موظف",
    bypassApprovals: true, // "trusted employee" example
    active: true,
    joinedAt: "2024-06-22",
  },
  {
    id: "emp-collections-1",
    name: "محمد عبدالله الشهري",
    email: "collections@muqsit.sa",
    roleId: "role-collections",
    roleName: "موظف تحصيل",
    bypassApprovals: false,
    active: true,
    joinedAt: "2024-04-18",
  },
  {
    id: "emp-accountant-1",
    name: "سارة فهد القحطاني",
    email: "accountant@muqsit.sa",
    roleId: "role-accountant",
    roleName: "محاسب",
    bypassApprovals: false,
    active: true,
    joinedAt: "2023-11-05",
  },
];

export function findEmployee(id: string): Employee | undefined {
  return MOCK_EMPLOYEES.find((e) => e.id === id);
}

export function findRole(id: string): Role | undefined {
  return MOCK_ROLES.find((r) => r.id === id);
}

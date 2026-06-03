"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { MOCK_CONTRACTS } from "./contracts";
import { MOCK_CUSTOMERS } from "./customers";
import { MOCK_INSTALLMENT_CONTRACTS } from "./installment-contracts";
import { MOCK_PAYMENT_PROOFS } from "./payment-proofs";
import { MOCK_APPROVALS } from "./approvals";
import { MOCK_NOTIFICATIONS } from "./notifications";
import { MOCK_AUDIT } from "./audit";
import { MOCK_ROLES, MOCK_EMPLOYEES } from "./employees";
import type {
  ApprovalRequest,
  ApprovalStatus,
  AppNotification,
  AuditEntry,
  Customer,
  Employee,
  InstallmentContract,
  InvestmentContract,
  NotificationState,
  PaymentProof,
  PermissionAction,
  PermissionState,
  ProofStatus,
  Role,
} from "./types";

const KEY_INVESTMENT_CONTRACTS = "muqsit_user_contracts";
const KEY_INSTALLMENT_CONTRACTS = "muqsit_user_installments";
const KEY_CUSTOMERS = "muqsit_user_customers";
const KEY_PROOF_DECISIONS = "muqsit_proof_decisions";
const KEY_APPROVAL_DECISIONS = "muqsit_approval_decisions";
const KEY_NOTIFICATION_STATES = "muqsit_notification_states";
const KEY_ROLE_OVERRIDES = "muqsit_role_overrides";

interface ProofDecisionPatch {
  status: ProofStatus;
  decisionBy?: string;
  decisionAt?: string;
  decisionReason?: string;
}

interface ApprovalDecisionPatch {
  status: ApprovalStatus;
  decidedById?: string;
  decidedAt?: string;
  decisionNote?: string;
}

interface Store {
  // Sprint 2
  investmentContracts: InvestmentContract[];
  addInvestmentContract: (c: InvestmentContract) => void;
  // Sprint 3
  customers: Customer[];
  addCustomer: (c: Customer) => void;
  installmentContracts: InstallmentContract[];
  addInstallmentContract: (c: InstallmentContract) => void;
  paymentProofs: PaymentProof[];
  decideProof: (proofId: string, patch: ProofDecisionPatch) => void;
  // Sprint 4
  employees: Employee[];
  roles: Role[];
  updateRolePermission: (
    roleId: string,
    action: PermissionAction,
    state: PermissionState,
  ) => void;
  approvals: ApprovalRequest[];
  decideApproval: (approvalId: string, patch: ApprovalDecisionPatch) => void;
  notifications: AppNotification[];
  setNotificationState: (id: string, state: NotificationState) => void;
  markAllNotificationsRead: () => void;
  auditEntries: AuditEntry[];
}

const StoreContext = createContext<Store | null>(null);

function safeRead<T>(key: string): T | null {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function safeWrite<T>(key: string, value: T) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* ignore quota errors */
  }
}

export function ContractStoreProvider({ children }: { children: React.ReactNode }) {
  const [userInvestments, setUserInvestments] = useState<InvestmentContract[]>([]);
  const [userCustomers, setUserCustomers] = useState<Customer[]>([]);
  const [userInstallments, setUserInstallments] = useState<InstallmentContract[]>([]);
  const [proofDecisions, setProofDecisions] = useState<Record<string, ProofDecisionPatch>>({});
  const [approvalDecisions, setApprovalDecisions] = useState<
    Record<string, ApprovalDecisionPatch>
  >({});
  const [notificationStates, setNotificationStates] = useState<Record<string, NotificationState>>(
    {},
  );
  const [roleOverrides, setRoleOverrides] = useState<
    Record<string, Partial<Record<PermissionAction, PermissionState>>>
  >({});

  useEffect(() => {
    setUserInvestments(safeRead<InvestmentContract[]>(KEY_INVESTMENT_CONTRACTS) ?? []);
    setUserCustomers(safeRead<Customer[]>(KEY_CUSTOMERS) ?? []);
    setUserInstallments(safeRead<InstallmentContract[]>(KEY_INSTALLMENT_CONTRACTS) ?? []);
    setProofDecisions(safeRead<Record<string, ProofDecisionPatch>>(KEY_PROOF_DECISIONS) ?? {});
    setApprovalDecisions(
      safeRead<Record<string, ApprovalDecisionPatch>>(KEY_APPROVAL_DECISIONS) ?? {},
    );
    setNotificationStates(
      safeRead<Record<string, NotificationState>>(KEY_NOTIFICATION_STATES) ?? {},
    );
    setRoleOverrides(
      safeRead<Record<string, Partial<Record<PermissionAction, PermissionState>>>>(
        KEY_ROLE_OVERRIDES,
      ) ?? {},
    );
  }, []);

  const addInvestmentContract = useCallback((contract: InvestmentContract) => {
    setUserInvestments((prev) => {
      const next = [contract, ...prev];
      safeWrite(KEY_INVESTMENT_CONTRACTS, next);
      return next;
    });
  }, []);

  const addCustomer = useCallback((customer: Customer) => {
    setUserCustomers((prev) => {
      const next = [customer, ...prev];
      safeWrite(KEY_CUSTOMERS, next);
      return next;
    });
  }, []);

  const addInstallmentContract = useCallback((contract: InstallmentContract) => {
    setUserInstallments((prev) => {
      const next = [contract, ...prev];
      safeWrite(KEY_INSTALLMENT_CONTRACTS, next);
      return next;
    });
  }, []);

  const decideProof = useCallback((proofId: string, patch: ProofDecisionPatch) => {
    setProofDecisions((prev) => {
      const next = { ...prev, [proofId]: patch };
      safeWrite(KEY_PROOF_DECISIONS, next);
      return next;
    });
  }, []);

  const decideApproval = useCallback((approvalId: string, patch: ApprovalDecisionPatch) => {
    setApprovalDecisions((prev) => {
      const next = { ...prev, [approvalId]: patch };
      safeWrite(KEY_APPROVAL_DECISIONS, next);
      return next;
    });
  }, []);

  const setNotificationState = useCallback((id: string, state: NotificationState) => {
    setNotificationStates((prev) => {
      const next = { ...prev, [id]: state };
      safeWrite(KEY_NOTIFICATION_STATES, next);
      return next;
    });
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    setNotificationStates((prev) => {
      const next = { ...prev };
      for (const n of MOCK_NOTIFICATIONS) {
        if (next[n.id] !== "dismissed") next[n.id] = "read";
      }
      safeWrite(KEY_NOTIFICATION_STATES, next);
      return next;
    });
  }, []);

  const updateRolePermission = useCallback(
    (roleId: string, action: PermissionAction, state: PermissionState) => {
      setRoleOverrides((prev) => {
        const role = prev[roleId] ?? {};
        const next = { ...prev, [roleId]: { ...role, [action]: state } };
        safeWrite(KEY_ROLE_OVERRIDES, next);
        return next;
      });
    },
    [],
  );

  const value = useMemo<Store>(() => {
    const proofs = MOCK_PAYMENT_PROOFS.map((p) => {
      const decision = proofDecisions[p.id];
      return decision ? { ...p, ...decision } : p;
    });
    const approvals = MOCK_APPROVALS.map((a) => {
      const decision = approvalDecisions[a.id];
      return decision ? { ...a, ...decision } : a;
    });
    const notifications = MOCK_NOTIFICATIONS.map((n) => {
      const override = notificationStates[n.id];
      return override ? { ...n, state: override } : n;
    });
    const roles = MOCK_ROLES.map((r) => {
      const overrides = roleOverrides[r.id];
      if (!overrides) return r;
      return { ...r, permissions: { ...r.permissions, ...overrides } };
    });
    return {
      investmentContracts: [...userInvestments, ...MOCK_CONTRACTS],
      addInvestmentContract,
      customers: [...userCustomers, ...MOCK_CUSTOMERS],
      addCustomer,
      installmentContracts: [...userInstallments, ...MOCK_INSTALLMENT_CONTRACTS],
      addInstallmentContract,
      paymentProofs: proofs,
      decideProof,
      employees: MOCK_EMPLOYEES,
      roles,
      updateRolePermission,
      approvals,
      decideApproval,
      notifications,
      setNotificationState,
      markAllNotificationsRead,
      auditEntries: MOCK_AUDIT,
    };
  }, [
    userInvestments,
    userCustomers,
    userInstallments,
    proofDecisions,
    approvalDecisions,
    notificationStates,
    roleOverrides,
    addInvestmentContract,
    addCustomer,
    addInstallmentContract,
    decideProof,
    decideApproval,
    setNotificationState,
    markAllNotificationsRead,
    updateRolePermission,
  ]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): Store {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within ContractStoreProvider");
  return ctx;
}

// Back-compat alias for Sprint 2 callers
export function useContractStore() {
  const s = useStore();
  return { contracts: s.investmentContracts, addContract: s.addInvestmentContract };
}

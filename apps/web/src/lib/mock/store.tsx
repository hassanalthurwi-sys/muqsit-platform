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
import { MOCK_INVESTORS } from "./investors";
import { MOCK_CUSTOMERS } from "./customers";
import { MOCK_INSTALLMENT_CONTRACTS } from "./installment-contracts";
import { MOCK_PAYMENT_PROOFS } from "./payment-proofs";
import { MOCK_APPROVALS } from "./approvals";
import { MOCK_NOTIFICATIONS } from "./notifications";
import { MOCK_AUDIT } from "./audit";
import { MOCK_ROLES, MOCK_EMPLOYEES } from "./employees";
import { MOCK_RECEIPTS } from "./receipts";
import { MOCK_PAYMENTS } from "./payments";
import { MOCK_PURCHASES } from "./purchases";
import { buildCashLedger, summary as cashSummary } from "./cash-ledger";
import { DEFAULT_OFFICE_SETTINGS } from "./office-settings";
import type {
  ApprovalRequest,
  ApprovalStatus,
  AppNotification,
  AuditEntry,
  CashLedgerEntry,
  Customer,
  Employee,
  GoodsPurchase,
  InstallmentContract,
  InvestmentContract,
  NotificationState,
  OfficeSettings,
  PaymentProof,
  PaymentVoucher,
  PermissionAction,
  MigrationStepKey,
  MigrationStepState,
  PermissionState,
  ProfitDistribution,
  ProofStatus,
  ReceiptVoucher,
  Role,
} from "./types";
import { getEffectivePolicy, splitInstallmentPayment } from "./profit";

const KEY_INVESTMENT_CONTRACTS = "muqsit_user_contracts";
const KEY_INSTALLMENT_CONTRACTS = "muqsit_user_installments";
const KEY_CUSTOMERS = "muqsit_user_customers";
const KEY_PROOF_DECISIONS = "muqsit_proof_decisions";
const KEY_APPROVAL_DECISIONS = "muqsit_approval_decisions";
const KEY_NOTIFICATION_STATES = "muqsit_notification_states";
const KEY_ROLE_OVERRIDES = "muqsit_role_overrides";
const KEY_RECEIPTS = "muqsit_user_receipts";
const KEY_PAYMENTS = "muqsit_user_payments";
const KEY_PURCHASES = "muqsit_user_purchases";
const KEY_OFFICE_SETTINGS = "muqsit_office_settings";
const KEY_INVESTOR_BALANCE_DELTAS = "muqsit_investor_balance_deltas";
const KEY_INVESTOR_PROFIT_DELTAS = "muqsit_investor_profit_deltas";
const KEY_PROFIT_DISTRIBUTIONS = "muqsit_profit_distributions";
const KEY_INSTALLMENT_RECOVERY = "muqsit_installment_recovery";
const KEY_INVESTMENT_UTILIZATION = "muqsit_investment_utilization";
const KEY_INVESTOR_POLICY_OVERRIDES = "muqsit_investor_policy_overrides";
const KEY_MIGRATION_PROGRESS = "muqsit_migration_progress";
const KEY_MIGRATION_COMPLETED = "muqsit_migration_completed";

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
  // Sprint 5
  receipts: ReceiptVoucher[];
  addReceipt: (r: ReceiptVoucher) => void;
  payments: PaymentVoucher[];
  addPayment: (p: PaymentVoucher) => void;
  purchases: GoodsPurchase[];
  addPurchase: (p: GoodsPurchase) => void;
  cashLedger: CashLedgerEntry[];
  cashSummary: { totalIn: number; totalOut: number; balance: number; opening: number };
  // Sprint 8
  officeSettings: OfficeSettings;
  updateOfficeSettings: (patch: OfficeSettings) => void;
  // Sprint 10 — investor wallet
  investorBalanceDeltas: Record<string, number>;
  getInvestorBalance: (investorId: string) => number;
  // Sprint 11 — profit distribution
  profitDistributions: ProfitDistribution[];
  getInvestorRealizedProfit: (investorId: string) => number;
  getEffectivePolicyFor: (investorId: string) => {
    policy: import("./types").ProfitDistributionPolicy;
    source: import("./types").ProfitPolicySource;
  };
  setInvestorPolicyOverride: (
    investorId: string,
    override: "useOfficeDefault" | import("./types").ProfitDistributionPolicy,
  ) => void;
  // Sprint 12 — migration journey
  migrationProgress: Partial<Record<MigrationStepKey, MigrationStepState>>;
  migrationCompleted: boolean;
  updateMigrationStep: (step: MigrationStepKey, patch: Partial<MigrationStepState>) => void;
  completeMigration: () => void;
  resetMigration: () => void;
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
  const [userReceipts, setUserReceipts] = useState<ReceiptVoucher[]>([]);
  const [userPayments, setUserPayments] = useState<PaymentVoucher[]>([]);
  const [userPurchases, setUserPurchases] = useState<GoodsPurchase[]>([]);
  const [officeSettings, setOfficeSettings] = useState<OfficeSettings>(DEFAULT_OFFICE_SETTINGS);
  const [investorBalanceDeltas, setInvestorBalanceDeltas] = useState<Record<string, number>>({});
  const [investorProfitDeltas, setInvestorProfitDeltas] = useState<Record<string, number>>({});
  const [profitDistributions, setProfitDistributions] = useState<ProfitDistribution[]>([]);
  const [installmentRecovery, setInstallmentRecovery] = useState<Record<string, { office: number; investor: number }>>({});
  // Sprint 11 — capital drawn from each investment contract by its child
  // installment contracts. Applied on top of seed `utilized` / `remaining`.
  const [investmentUtilizationDeltas, setInvestmentUtilizationDeltas] = useState<Record<string, number>>({});
  const [investorPolicyOverrides, setInvestorPolicyOverrides] = useState<
    Record<string, "useOfficeDefault" | import("./types").ProfitDistributionPolicy>
  >({});
  // Sprint 12 — migration journey
  const [migrationProgress, setMigrationProgress] = useState<
    Partial<Record<MigrationStepKey, MigrationStepState>>
  >({});
  const [migrationCompleted, setMigrationCompleted] = useState<boolean>(false);

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
    setUserReceipts(safeRead<ReceiptVoucher[]>(KEY_RECEIPTS) ?? []);
    setUserPayments(safeRead<PaymentVoucher[]>(KEY_PAYMENTS) ?? []);
    setUserPurchases(safeRead<GoodsPurchase[]>(KEY_PURCHASES) ?? []);
    setOfficeSettings(safeRead<OfficeSettings>(KEY_OFFICE_SETTINGS) ?? DEFAULT_OFFICE_SETTINGS);
    setInvestorBalanceDeltas(safeRead<Record<string, number>>(KEY_INVESTOR_BALANCE_DELTAS) ?? {});
    setInvestorProfitDeltas(safeRead<Record<string, number>>(KEY_INVESTOR_PROFIT_DELTAS) ?? {});
    setProfitDistributions(safeRead<ProfitDistribution[]>(KEY_PROFIT_DISTRIBUTIONS) ?? []);
    setInstallmentRecovery(safeRead<Record<string, { office: number; investor: number }>>(KEY_INSTALLMENT_RECOVERY) ?? {});
    setInvestmentUtilizationDeltas(safeRead<Record<string, number>>(KEY_INVESTMENT_UTILIZATION) ?? {});
    setInvestorPolicyOverrides(
      safeRead<Record<string, "useOfficeDefault" | import("./types").ProfitDistributionPolicy>>(
        KEY_INVESTOR_POLICY_OVERRIDES,
      ) ?? {},
    );
    setMigrationProgress(
      safeRead<Partial<Record<MigrationStepKey, MigrationStepState>>>(KEY_MIGRATION_PROGRESS) ?? {},
    );
    setMigrationCompleted(safeRead<boolean>(KEY_MIGRATION_COMPLETED) ?? false);
  }, []);

  const applyInvestorDelta = useCallback((investorId: string, delta: number) => {
    setInvestorBalanceDeltas((prev) => {
      const next = { ...prev, [investorId]: (prev[investorId] ?? 0) + delta };
      safeWrite(KEY_INVESTOR_BALANCE_DELTAS, next);
      return next;
    });
  }, []);

  const addInvestmentContract = useCallback(
    (contract: InvestmentContract) => {
      setUserInvestments((prev) => {
        const next = [contract, ...prev];
        safeWrite(KEY_INVESTMENT_CONTRACTS, next);
        return next;
      });
      // Sprint 10 — creating a contract draws the amount from the
      // investor's wallet balance.
      applyInvestorDelta(contract.investorId, -contract.amount);
    },
    [applyInvestorDelta],
  );

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
    // Sprint 11 — creating an installment contract draws its cash price
    // from the parent investment contract's available capital.
    if (contract.investmentContractId && contract.cashPrice > 0) {
      setInvestmentUtilizationDeltas((prev) => {
        const next = {
          ...prev,
          [contract.investmentContractId]:
            (prev[contract.investmentContractId] ?? 0) + contract.cashPrice,
        };
        safeWrite(KEY_INVESTMENT_UTILIZATION, next);
        return next;
      });
    }
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

  const addReceipt = useCallback(
    (receipt: ReceiptVoucher) => {
      setUserReceipts((prev) => {
        const next = [receipt, ...prev];
        safeWrite(KEY_RECEIPTS, next);
        return next;
      });
      if (receipt.investorId) applyInvestorDelta(receipt.investorId, receipt.amount);

      // Sprint 11 — when the receipt is a customer-installment receipt,
      // cascade into the profit-split mechanism. The receipt itself was
      // already recorded above; this is purely the split + counter +
      // event-log step.
      if (
        receipt.partyType === "customer" &&
        receipt.contractId &&
        receipt.installmentId
      ) {
        const installmentContract = MOCK_INSTALLMENT_CONTRACTS.find(
          (c) => c.id === receipt.contractId,
        );
        const investmentContract = installmentContract
          ? MOCK_CONTRACTS.find((c) => c.id === installmentContract.investmentContractId)
          : undefined;
        const investor = investmentContract
          ? MOCK_INVESTORS.find((i) => i.id === investmentContract.investorId)
          : undefined;
        if (installmentContract && investmentContract && investor) {
          const policyOverride =
            investorPolicyOverrides[investor.id] ?? investor.profitPolicyOverride;
          const { policy, source } = getEffectivePolicy(
            { profitPolicyOverride: policyOverride },
            officeSettings,
          );
          const liveRec =
            installmentRecovery[installmentContract.id] ?? {
              office: installmentContract.officeRecoveredSoFar,
              investor: installmentContract.investorRecoveredSoFar,
            };
          const split = splitInstallmentPayment({
            amount: receipt.amount,
            installmentContract: {
              cashPrice: installmentContract.cashPrice,
              installmentPrice: installmentContract.installmentPrice,
              officeRecoveredSoFar: liveRec.office,
              investorRecoveredSoFar: liveRec.investor,
            },
            investmentContract: {
              officeExpectedProfit: investmentContract.officeExpectedProfit,
              investorExpectedProfit: investmentContract.investorExpectedProfit,
            },
            policy,
          });

          // Update recovery counters
          const nextRecovery = {
            ...installmentRecovery,
            [installmentContract.id]: {
              office: liveRec.office + split.officeShare,
              investor: liveRec.investor + split.investorShare,
            },
          };
          setInstallmentRecovery(nextRecovery);
          safeWrite(KEY_INSTALLMENT_RECOVERY, nextRecovery);

          // Record event
          const event: ProfitDistribution = {
            id: `pd-${Date.now()}`,
            date: receipt.date,
            investorId: investor.id,
            investmentContractId: investmentContract.id,
            installmentContractId: installmentContract.id,
            installmentId: receipt.installmentId,
            installmentIndex: receipt.installmentIndex ?? 0,
            amountCollected: receipt.amount,
            officeShare: split.officeShare,
            investorShare: split.investorShare,
            investorProfitPortion: split.investorProfitPortion,
            investorCapitalPortion: split.investorCapitalPortion,
            policyApplied: policy,
            policySource: source,
            createdAt: new Date().toISOString(),
          };
          setProfitDistributions((prev) => {
            const next = [event, ...prev];
            safeWrite(KEY_PROFIT_DISTRIBUTIONS, next);
            return next;
          });

          // Apply investor wallet effects:
          //   - currentBalance += investorShare (capital + profit both flow back)
          //   - realizedProfit += investorProfitPortion (only the profit slice)
          applyInvestorDelta(investor.id, split.investorShare);
          setInvestorProfitDeltas((prev) => {
            const next = {
              ...prev,
              [investor.id]: (prev[investor.id] ?? 0) + split.investorProfitPortion,
            };
            safeWrite(KEY_INVESTOR_PROFIT_DELTAS, next);
            return next;
          });
        }
      }
    },
    [applyInvestorDelta, officeSettings, investorPolicyOverrides, installmentRecovery],
  );

  const addPayment = useCallback(
    (payment: PaymentVoucher) => {
      setUserPayments((prev) => {
        const next = [payment, ...prev];
        safeWrite(KEY_PAYMENTS, next);
        return next;
      });
      if (payment.investorId) applyInvestorDelta(payment.investorId, -payment.amount);
    },
    [applyInvestorDelta],
  );

  const addPurchase = useCallback((purchase: GoodsPurchase) => {
    setUserPurchases((prev) => {
      const next = [purchase, ...prev];
      safeWrite(KEY_PURCHASES, next);
      return next;
    });
  }, []);

  const updateOfficeSettings = useCallback((patch: OfficeSettings) => {
    setOfficeSettings(patch);
    safeWrite(KEY_OFFICE_SETTINGS, patch);
  }, []);

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
    const allReceipts = [...userReceipts, ...MOCK_RECEIPTS];
    const allPayments = [...userPayments, ...MOCK_PAYMENTS];
    const allPurchases = [...userPurchases, ...MOCK_PURCHASES];
    const ledger = buildCashLedger(allReceipts, allPayments);
    return {
      investmentContracts: [...userInvestments, ...MOCK_CONTRACTS].map((c) => {
        const delta = investmentUtilizationDeltas[c.id] ?? 0;
        if (delta === 0) return c;
        return {
          ...c,
          utilized: c.utilized + delta,
          remaining: Math.max(0, c.remaining - delta),
        };
      }),
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
      receipts: allReceipts,
      addReceipt,
      payments: allPayments,
      addPayment,
      purchases: allPurchases,
      addPurchase,
      cashLedger: ledger,
      cashSummary: cashSummary(ledger),
      officeSettings,
      updateOfficeSettings,
      investorBalanceDeltas,
      getInvestorBalance: (investorId: string) => {
        const inv = MOCK_INVESTORS.find((i) => i.id === investorId);
        const seed = inv?.currentBalance ?? 0;
        return seed + (investorBalanceDeltas[investorId] ?? 0);
      },
      profitDistributions,
      getInvestorRealizedProfit: (investorId: string) => {
        const inv = MOCK_INVESTORS.find((i) => i.id === investorId);
        const seed = inv?.realizedProfit ?? 0;
        return seed + (investorProfitDeltas[investorId] ?? 0);
      },
      getEffectivePolicyFor: (investorId: string) => {
        const inv = MOCK_INVESTORS.find((i) => i.id === investorId);
        const override =
          investorPolicyOverrides[investorId] ?? inv?.profitPolicyOverride;
        return getEffectivePolicy({ profitPolicyOverride: override }, officeSettings);
      },
      setInvestorPolicyOverride: (
        investorId: string,
        override: "useOfficeDefault" | import("./types").ProfitDistributionPolicy,
      ) => {
        setInvestorPolicyOverrides((prev) => {
          const next = { ...prev, [investorId]: override };
          safeWrite(KEY_INVESTOR_POLICY_OVERRIDES, next);
          return next;
        });
      },
      migrationProgress,
      migrationCompleted,
      updateMigrationStep: (step, patch) => {
        setMigrationProgress((prev) => {
          const current = prev[step] ?? {
            status: "notStarted" as const,
            rows: [],
            matches: [],
          };
          const next = { ...prev, [step]: { ...current, ...patch } };
          safeWrite(KEY_MIGRATION_PROGRESS, next);
          return next;
        });
      },
      completeMigration: () => {
        setMigrationCompleted(true);
        safeWrite(KEY_MIGRATION_COMPLETED, true);
      },
      resetMigration: () => {
        setMigrationProgress({});
        setMigrationCompleted(false);
        safeWrite(KEY_MIGRATION_PROGRESS, {});
        safeWrite(KEY_MIGRATION_COMPLETED, false);
      },
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
    userReceipts,
    userPayments,
    userPurchases,
    addReceipt,
    addPayment,
    addPurchase,
    officeSettings,
    updateOfficeSettings,
    investorBalanceDeltas,
    investorProfitDeltas,
    profitDistributions,
    investorPolicyOverrides,
    investmentUtilizationDeltas,
    migrationProgress,
    migrationCompleted,
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

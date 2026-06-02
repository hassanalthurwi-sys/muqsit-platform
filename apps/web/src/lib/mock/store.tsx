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
import type {
  Customer,
  InstallmentContract,
  InvestmentContract,
  PaymentProof,
  ProofStatus,
} from "./types";

const KEY_INVESTMENT_CONTRACTS = "muqsit_user_contracts";
const KEY_INSTALLMENT_CONTRACTS = "muqsit_user_installments";
const KEY_CUSTOMERS = "muqsit_user_customers";
const KEY_PROOF_DECISIONS = "muqsit_proof_decisions";

interface ProofDecisionPatch {
  status: ProofStatus;
  decisionBy?: string;
  decisionAt?: string;
  decisionReason?: string;
}

interface Store {
  // investment contracts (Sprint 2)
  investmentContracts: InvestmentContract[];
  addInvestmentContract: (c: InvestmentContract) => void;
  // customers (Sprint 3)
  customers: Customer[];
  addCustomer: (c: Customer) => void;
  // installment contracts (Sprint 3)
  installmentContracts: InstallmentContract[];
  addInstallmentContract: (c: InstallmentContract) => void;
  // payment proofs (Sprint 3) — base mock list + decision overlay
  paymentProofs: PaymentProof[];
  decideProof: (proofId: string, patch: ProofDecisionPatch) => void;
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

  useEffect(() => {
    setUserInvestments(safeRead<InvestmentContract[]>(KEY_INVESTMENT_CONTRACTS) ?? []);
    setUserCustomers(safeRead<Customer[]>(KEY_CUSTOMERS) ?? []);
    setUserInstallments(safeRead<InstallmentContract[]>(KEY_INSTALLMENT_CONTRACTS) ?? []);
    setProofDecisions(safeRead<Record<string, ProofDecisionPatch>>(KEY_PROOF_DECISIONS) ?? {});
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

  const value = useMemo<Store>(() => {
    // Apply decision overlay to base mock proofs
    const proofs = MOCK_PAYMENT_PROOFS.map((p) => {
      const decision = proofDecisions[p.id];
      return decision ? { ...p, ...decision } : p;
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
    };
  }, [
    userInvestments,
    userCustomers,
    userInstallments,
    proofDecisions,
    addInvestmentContract,
    addCustomer,
    addInstallmentContract,
    decideProof,
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

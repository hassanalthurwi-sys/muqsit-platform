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
import type { InvestmentContract } from "./types";

const STORAGE_KEY = "muqsit_user_contracts";

interface ContractStore {
  contracts: InvestmentContract[];
  addContract: (contract: InvestmentContract) => void;
}

const ContractStoreContext = createContext<ContractStore | null>(null);

export function ContractStoreProvider({ children }: { children: React.ReactNode }) {
  const [userContracts, setUserContracts] = useState<InvestmentContract[]>([]);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as InvestmentContract[];
        if (Array.isArray(parsed)) setUserContracts(parsed);
      }
    } catch {
      // ignore — corrupted localStorage
    }
  }, []);

  const addContract = useCallback((contract: InvestmentContract) => {
    setUserContracts((prev) => {
      const next = [contract, ...prev];
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // ignore quota errors
      }
      return next;
    });
  }, []);

  const value = useMemo<ContractStore>(
    () => ({
      contracts: [...userContracts, ...MOCK_CONTRACTS],
      addContract,
    }),
    [userContracts, addContract],
  );

  return (
    <ContractStoreContext.Provider value={value}>{children}</ContractStoreContext.Provider>
  );
}

export function useContractStore(): ContractStore {
  const ctx = useContext(ContractStoreContext);
  if (!ctx) throw new Error("useContractStore must be used within ContractStoreProvider");
  return ctx;
}

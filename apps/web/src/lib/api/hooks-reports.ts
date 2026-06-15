"use client";

import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "./client";
import type {
  AgingBucket,
  CollectionsSummary,
  InvestorPerformanceRow,
  PnlRow,
} from "@/lib/reports/aggregations";

export function useAgingReport() {
  return useQuery({
    queryKey: ["reports", "aging"],
    queryFn: () => apiFetch<AgingBucket[]>("/api/reports/aging"),
  });
}

export function useInvestorPerformance() {
  return useQuery({
    queryKey: ["reports", "investor-performance"],
    queryFn: () =>
      apiFetch<InvestorPerformanceRow[]>("/api/reports/investor-performance"),
  });
}

export function usePnlReport() {
  return useQuery({
    queryKey: ["reports", "pnl"],
    queryFn: () => apiFetch<PnlRow[]>("/api/reports/pnl"),
  });
}

export function useCollectionsReport() {
  return useQuery({
    queryKey: ["reports", "collections"],
    queryFn: () => apiFetch<CollectionsSummary>("/api/reports/collections"),
  });
}

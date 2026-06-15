// Sprint 18 — typed React Query hooks for each resource.
//
// These wrap apiFetch so screens never have to repeat the URL or the
// query-key pattern. As resources gain real auth (Sprint 20) and
// real DB (Sprint 19), only this file changes — screens stay stable.

"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  Customer,
  Employee,
  InstallmentContract,
  InvestmentContract,
  Investor,
  OfficeAccount,
  PaymentVoucher,
  ReceiptVoucher,
  SubscriptionPlan,
} from "@/lib/mock/types";
import { apiFetch, qk, qs } from "./client";

// ── Investors ──────────────────────────────────────────────────

interface InvestorListParams {
  q?: string;
  filter?: "all" | "internal" | "external";
  page?: number;
  pageSize?: number;
}

export function useInvestors(params: InvestorListParams = {}) {
  return useQuery({
    queryKey: qk.investors.list(params as Record<string, unknown>),
    queryFn: () =>
      apiFetch<Investor[]>(`/api/investors${qs(params as Record<string, unknown>)}`),
  });
}

export function useInvestor(id: string | undefined) {
  return useQuery({
    queryKey: qk.investors.one(id ?? ""),
    queryFn: () => apiFetch<Investor>(`/api/investors/${id}`),
    enabled: !!id,
  });
}

export function useCreateInvestor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: Partial<Investor>) =>
      apiFetch<Investor>(`/api/investors`, {
        method: "POST",
        body: JSON.stringify(body),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["investors"] });
    },
  });
}

// ── Customers ──────────────────────────────────────────────────

interface CustomerListParams {
  q?: string;
  filter?: "all" | "low" | "medium" | "high";
  page?: number;
  pageSize?: number;
}

export function useCustomers(params: CustomerListParams = {}) {
  return useQuery({
    queryKey: qk.customers.list(params as Record<string, unknown>),
    queryFn: () =>
      apiFetch<Customer[]>(`/api/customers${qs(params as Record<string, unknown>)}`),
  });
}

export function useCustomer(id: string | undefined) {
  return useQuery({
    queryKey: qk.customers.one(id ?? ""),
    queryFn: () => apiFetch<Customer>(`/api/customers/${id}`),
    enabled: !!id,
  });
}

// ── Investment contracts ───────────────────────────────────────

export function useInvestmentContracts(params: { investorId?: string } = {}) {
  return useQuery({
    queryKey: qk.investmentContracts.list(params as Record<string, unknown>),
    queryFn: () =>
      apiFetch<InvestmentContract[]>(
        `/api/investment-contracts${qs(params as Record<string, unknown>)}`,
      ),
  });
}

export function useInvestmentContract(id: string | undefined) {
  return useQuery({
    queryKey: qk.investmentContracts.one(id ?? ""),
    queryFn: () => apiFetch<InvestmentContract>(`/api/investment-contracts/${id}`),
    enabled: !!id,
  });
}

// ── Installment contracts ──────────────────────────────────────

export function useInstallmentContracts(
  params: { customerId?: string; investmentContractId?: string } = {},
) {
  return useQuery({
    queryKey: qk.installmentContracts.list(params as Record<string, unknown>),
    queryFn: () =>
      apiFetch<InstallmentContract[]>(
        `/api/installment-contracts${qs(params as Record<string, unknown>)}`,
      ),
  });
}

export function useInstallmentContract(id: string | undefined) {
  return useQuery({
    queryKey: qk.installmentContracts.one(id ?? ""),
    queryFn: () => apiFetch<InstallmentContract>(`/api/installment-contracts/${id}`),
    enabled: !!id,
  });
}

// ── Vouchers ───────────────────────────────────────────────────

type Voucher<T extends "receipt" | "payment"> = T extends "receipt"
  ? ReceiptVoucher
  : PaymentVoucher;

export function useVouchers<T extends "receipt" | "payment">(
  type: T,
  params: { investorId?: string; customerId?: string; partyType?: string } = {},
) {
  return useQuery({
    queryKey: qk.vouchers.list({ type, ...params }),
    queryFn: () =>
      apiFetch<Voucher<T>[]>(
        `/api/vouchers${qs({ type, ...params } as Record<string, unknown>)}`,
      ),
  });
}

// ── Employees ──────────────────────────────────────────────────

export function useEmployees(params: { filter?: string; q?: string } = {}) {
  return useQuery({
    queryKey: qk.employees.list(params as Record<string, unknown>),
    queryFn: () =>
      apiFetch<Employee[]>(`/api/employees${qs(params as Record<string, unknown>)}`),
  });
}

export function useEmployee(id: string | undefined) {
  return useQuery({
    queryKey: qk.employees.one(id ?? ""),
    queryFn: () => apiFetch<Employee>(`/api/employees/${id}`),
    enabled: !!id,
  });
}

// ── Admin: offices ─────────────────────────────────────────────

export function useAdminOffices(params: { filter?: string; q?: string } = {}) {
  return useQuery({
    queryKey: qk.adminOffices.list(params as Record<string, unknown>),
    queryFn: () =>
      apiFetch<OfficeAccount[]>(
        `/api/admin/offices${qs(params as Record<string, unknown>)}`,
      ),
  });
}

export function useAdminOffice(id: string | undefined) {
  return useQuery({
    queryKey: qk.adminOffices.one(id ?? ""),
    queryFn: () => apiFetch<OfficeAccount>(`/api/admin/offices/${id}`),
    enabled: !!id,
  });
}

// ── Admin: plans ───────────────────────────────────────────────

export function useAdminPlans(params: { filter?: string } = {}) {
  return useQuery({
    queryKey: qk.adminPlans.list(params as Record<string, unknown>),
    queryFn: () =>
      apiFetch<SubscriptionPlan[]>(
        `/api/admin/plans${qs(params as Record<string, unknown>)}`,
      ),
  });
}

export function useAdminPlan(id: string | undefined) {
  return useQuery({
    queryKey: qk.adminPlans.one(id ?? ""),
    queryFn: () => apiFetch<SubscriptionPlan>(`/api/admin/plans/${id}`),
    enabled: !!id,
  });
}

export function useUpdateAdminPlan() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: Partial<SubscriptionPlan> }) =>
      apiFetch<SubscriptionPlan>(`/api/admin/plans/${id}`, {
        method: "PUT",
        body: JSON.stringify(patch),
      }),
    onSuccess: (_data, { id }) => {
      qc.invalidateQueries({ queryKey: qk.adminPlans.one(id) });
      qc.invalidateQueries({ queryKey: qk.adminPlans.list() });
    },
  });
}

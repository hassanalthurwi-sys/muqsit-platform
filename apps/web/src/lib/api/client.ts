// Sprint 18 — client-side fetch helpers + React Query setup.
//
// The client treats the API as the single source of truth. All
// requests flow through `apiFetch`, which throws on non-ok responses
// so React Query handles them as errors.

import type { ApiMeta, ApiResponse } from "./respond";

export class ApiClientError extends Error {
  readonly code: string;
  readonly status: number;
  readonly details?: unknown;
  constructor(code: string, message: string, status: number, details?: unknown) {
    super(message);
    this.code = code;
    this.status = status;
    this.details = details;
  }
}

export async function apiFetch<T>(
  path: string,
  init?: RequestInit,
): Promise<{ data: T; meta?: ApiMeta }> {
  const res = await fetch(path, {
    ...init,
    headers: {
      "content-type": "application/json",
      ...(init?.headers ?? {}),
    },
  });

  // 204 No Content
  if (res.status === 204) {
    return { data: undefined as unknown as T };
  }

  let body: ApiResponse<T>;
  try {
    body = (await res.json()) as ApiResponse<T>;
  } catch {
    throw new ApiClientError(
      "INTERNAL",
      `Bad response from ${path} (status ${res.status})`,
      res.status,
    );
  }

  if (!body.ok) {
    throw new ApiClientError(
      body.error.code,
      body.error.message,
      res.status,
      body.error.details,
    );
  }

  return { data: body.data, meta: body.meta };
}

// Query key conventions — keep these consistent so React Query
// invalidation is predictable.
export const qk = {
  investors: {
    list: (params?: Record<string, unknown>) => ["investors", "list", params ?? {}] as const,
    one: (id: string) => ["investors", "one", id] as const,
  },
  customers: {
    list: (params?: Record<string, unknown>) => ["customers", "list", params ?? {}] as const,
    one: (id: string) => ["customers", "one", id] as const,
  },
  investmentContracts: {
    list: (params?: Record<string, unknown>) =>
      ["investment-contracts", "list", params ?? {}] as const,
    one: (id: string) => ["investment-contracts", "one", id] as const,
  },
  installmentContracts: {
    list: (params?: Record<string, unknown>) =>
      ["installment-contracts", "list", params ?? {}] as const,
    one: (id: string) => ["installment-contracts", "one", id] as const,
  },
  vouchers: {
    list: (params?: Record<string, unknown>) => ["vouchers", "list", params ?? {}] as const,
  },
  employees: {
    list: (params?: Record<string, unknown>) => ["employees", "list", params ?? {}] as const,
    one: (id: string) => ["employees", "one", id] as const,
  },
  adminOffices: {
    list: (params?: Record<string, unknown>) => ["admin-offices", "list", params ?? {}] as const,
    one: (id: string) => ["admin-offices", "one", id] as const,
  },
  adminPlans: {
    list: (params?: Record<string, unknown>) => ["admin-plans", "list", params ?? {}] as const,
    one: (id: string) => ["admin-plans", "one", id] as const,
  },
};

export function qs(params: Record<string, unknown>): string {
  const entries = Object.entries(params).filter(
    ([, v]) => v !== undefined && v !== "" && v !== null,
  );
  if (entries.length === 0) return "";
  const search = new URLSearchParams(
    entries.map(([k, v]) => [k, String(v)]),
  ).toString();
  return `?${search}`;
}

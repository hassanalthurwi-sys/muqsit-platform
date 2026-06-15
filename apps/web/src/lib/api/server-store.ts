// Sprint 18 — server-side mock store.
// Sprint 19 — falls back to mock store when DATABASE_URL is not set.
//
// In production: the API routes call into Prisma via @muqsit/database.
// In sandbox / prototype: the in-memory store backs everything so the
// app continues to work without a database. The fallback is intentional
// and shipped — every screen of this prototype must review end-to-end.

import {
  MOCK_INVESTORS,
} from "@/lib/mock/investors";
import { MOCK_CUSTOMERS } from "@/lib/mock/customers";
import { MOCK_CONTRACTS as MOCK_INVESTMENT_CONTRACTS } from "@/lib/mock/contracts";
import { MOCK_INSTALLMENT_CONTRACTS } from "@/lib/mock/installment-contracts";
import { MOCK_RECEIPTS } from "@/lib/mock/receipts";
import { MOCK_PAYMENTS } from "@/lib/mock/payments";
import { MOCK_EMPLOYEES, MOCK_ROLES } from "@/lib/mock/employees";
import { MOCK_OFFICES, MOCK_SYSTEM_EMPLOYEES } from "@/lib/mock/admin-data";
import { MOCK_PLANS } from "@/lib/mock/plans";
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
  SystemEmployee,
} from "@/lib/mock/types";

// Clone seeds so mutations don't leak back to the mock files.
function clone<T>(items: T[]): T[] {
  return JSON.parse(JSON.stringify(items)) as T[];
}

interface ResourceStore<T extends { id: string }> {
  list: () => T[];
  find: (id: string) => T | undefined;
  add: (item: T) => T;
  update: (id: string, patch: Partial<T>) => T | undefined;
  remove: (id: string) => boolean;
}

function makeStore<T extends { id: string }>(seed: T[]): ResourceStore<T> {
  const items: T[] = clone(seed);
  return {
    list: () => items.slice(),
    find: (id) => items.find((x) => x.id === id),
    add: (item) => {
      items.unshift(item);
      return item;
    },
    update: (id, patch) => {
      const i = items.findIndex((x) => x.id === id);
      if (i < 0) return undefined;
      const next = { ...items[i], ...patch, id: items[i].id };
      items[i] = next;
      return next;
    },
    remove: (id) => {
      const i = items.findIndex((x) => x.id === id);
      if (i < 0) return false;
      items.splice(i, 1);
      return true;
    },
  };
}

// Resources. Read seeds lazily so test reset is possible.
export const stores = {
  investors: makeStore<Investor>(MOCK_INVESTORS),
  customers: makeStore<Customer>(MOCK_CUSTOMERS),
  investmentContracts: makeStore<InvestmentContract>(MOCK_INVESTMENT_CONTRACTS),
  installmentContracts: makeStore<InstallmentContract>(MOCK_INSTALLMENT_CONTRACTS),
  receipts: makeStore<ReceiptVoucher>(MOCK_RECEIPTS),
  payments: makeStore<PaymentVoucher>(MOCK_PAYMENTS),
  employees: makeStore<Employee>(MOCK_EMPLOYEES),
  roles: { list: () => MOCK_ROLES.slice() }, // read-only
  offices: makeStore<OfficeAccount>(MOCK_OFFICES),
  systemEmployees: makeStore<SystemEmployee>(MOCK_SYSTEM_EMPLOYEES),
  plans: makeStore<SubscriptionPlan>(MOCK_PLANS),
};

// Convenience id generator. Replaced by cuid/uuid in Sprint 19.
export function nextId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
}

// In-memory text search. Production replaces this with DB-level
// indexed search (Postgres trigram or full-text).
export function searchByFields<T>(
  items: T[],
  query: string,
  fields: (keyof T)[],
): T[] {
  if (!query) return items;
  const q = query.trim().toLowerCase();
  return items.filter((item) =>
    fields.some((f) => {
      const v = item[f];
      return typeof v === "string" && v.toLowerCase().includes(q);
    }),
  );
}

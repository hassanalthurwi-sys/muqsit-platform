"use client";

// Sprint 6 prototype — portal identity is hard-coded.
// Real auth will plug in here later by reading from an auth/session context
// and returning the same shape. Components depend on this hook, not on the constants.

import { findCustomer } from "@/lib/mock/customers";
import { findInvestor } from "@/lib/mock/investors";
import type { Customer, Investor } from "@/lib/mock/types";

const HARDCODED_INVESTOR_ID = "inv-ext-2"; // محمد بن عبدالله السبيعي
const HARDCODED_CUSTOMER_ID = "cus-2"; // فاطمة محمد القحطاني

export function useInvestorIdentity(): Investor {
  const investor = findInvestor(HARDCODED_INVESTOR_ID);
  if (!investor) {
    throw new Error(`Portal identity missing: investor ${HARDCODED_INVESTOR_ID}`);
  }
  return investor;
}

export function useCustomerIdentity(): Customer {
  const customer = findCustomer(HARDCODED_CUSTOMER_ID);
  if (!customer) {
    throw new Error(`Portal identity missing: customer ${HARDCODED_CUSTOMER_ID}`);
  }
  return customer;
}

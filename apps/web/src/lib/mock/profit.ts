// Sprint 11 — profit distribution math.
//
// Two pure utilities consumed across the app:
//   - getEffectivePolicy(investor, officeSettings) resolves the policy chain.
//   - splitInstallmentPayment(amount, installment, investment, policy) returns
//     how a single customer-installment payment is split between the office
//     and the investor, given the current recovery counters.
//
// The principle: every installment payment is split immediately. The office
// and investor each have a per-installment-contract "expected total" — once
// either side reaches its expected total, the remainder of subsequent
// payments flows entirely to the other side.

import type {
  InstallmentContract,
  Investor,
  InvestmentContract,
  OfficeSettings,
  ProfitDistributionPolicy,
  ProfitPolicySource,
} from "./types";

export interface PolicyResolution {
  policy: ProfitDistributionPolicy;
  source: ProfitPolicySource;
}

export function getEffectivePolicy(
  investor: Pick<Investor, "profitPolicyOverride">,
  officeSettings: Pick<OfficeSettings, "profitDistribution">,
): PolicyResolution {
  const override = investor.profitPolicyOverride;
  if (override && override !== "useOfficeDefault") {
    return { policy: override, source: "investorOverride" };
  }
  return {
    policy: officeSettings.profitDistribution.policy,
    source: "officeDefault",
  };
}

export interface InstallmentSplitInput {
  amount: number;                       // the customer payment being recorded
  installmentContract: Pick<
    InstallmentContract,
    "cashPrice" | "installmentPrice" | "officeRecoveredSoFar" | "investorRecoveredSoFar"
  >;
  investmentContract: Pick<
    InvestmentContract,
    "officeExpectedProfit" | "investorExpectedProfit"
  >;
  policy: ProfitDistributionPolicy;
}

export interface InstallmentSplit {
  officeShare: number;
  investorShare: number;
  // Per-installment-contract expected totals (derived inline so callers
  // can render progress bars without recomputing):
  officeExpectedFromThisContract: number;
  investorExpectedFromThisContract: number;
  // Investor share is further decomposed for the realized-profit metric:
  investorProfitPortion: number;
  investorCapitalPortion: number;
}

/**
 * Compute the share each side receives from a single customer installment
 * payment. The math is pure — callers update the running counters and
 * persist a ProfitDistribution event afterwards.
 */
export function splitInstallmentPayment(input: InstallmentSplitInput): InstallmentSplit {
  const { amount, installmentContract: ic, investmentContract: iv, policy } = input;

  // Total markup on this installment contract:
  const installmentProfit = Math.max(0, ic.installmentPrice - ic.cashPrice);

  // Office's ratio comes from the parent investment contract's agreed split.
  // For internal contracts officeExpectedProfit is 0 → office gets nothing
  // → everything routes to the (internal) investor, which is the office.
  const totalParentProfit = iv.officeExpectedProfit + iv.investorExpectedProfit;
  const officeRatio = totalParentProfit > 0 ? iv.officeExpectedProfit / totalParentProfit : 0;

  // Per-installment-contract budgets:
  const officeExpectedFromThisContract = installmentProfit * officeRatio;
  const investorProfitFromThisContract = installmentProfit - officeExpectedFromThisContract;
  const investorExpectedFromThisContract = ic.cashPrice + investorProfitFromThisContract;

  // Remaining capacity on each side:
  const officeNeeded = Math.max(0, officeExpectedFromThisContract - ic.officeRecoveredSoFar);
  const investorNeeded = Math.max(0, investorExpectedFromThisContract - ic.investorRecoveredSoFar);

  let officeShare = 0;
  let investorShare = 0;

  switch (policy) {
    case "officeFirst": {
      officeShare = Math.min(amount, officeNeeded);
      investorShare = Math.min(amount - officeShare, investorNeeded);
      break;
    }
    case "investorFirst": {
      investorShare = Math.min(amount, investorNeeded);
      officeShare = Math.min(amount - investorShare, officeNeeded);
      break;
    }
    case "proportional": {
      const totalExpected = officeExpectedFromThisContract + investorExpectedFromThisContract;
      if (totalExpected > 0) {
        const officeRaw = amount * (officeExpectedFromThisContract / totalExpected);
        officeShare = Math.min(officeRaw, officeNeeded);
        investorShare = Math.min(amount - officeShare, investorNeeded);
      } else {
        // Edge: both sides have nothing more to collect.
        officeShare = 0;
        investorShare = 0;
      }
      break;
    }
  }

  // Decompose the investor's share into profit portion vs capital portion.
  // Capital first up to cashPrice, profit afterwards — keeps the "realized
  // profit" metric meaningful regardless of which policy is in effect.
  const investorCapitalRemaining = Math.max(
    0,
    ic.cashPrice - Math.min(ic.cashPrice, ic.investorRecoveredSoFar),
  );
  const investorCapitalPortion = Math.min(investorShare, investorCapitalRemaining);
  const investorProfitPortion = investorShare - investorCapitalPortion;

  return {
    officeShare,
    investorShare,
    officeExpectedFromThisContract,
    investorExpectedFromThisContract,
    investorProfitPortion,
    investorCapitalPortion,
  };
}

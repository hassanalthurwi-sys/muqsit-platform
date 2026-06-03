// Pure selectors for capital-recycling readiness.
// No I/O. Derived from existing investment + installment contract data.

import type { InstallmentContract, InvestmentContract } from "./types";

export interface RecycleReady {
  contract: InvestmentContract;
  collected: number;
  threshold: number;
}

/**
 * Sum of paidAmount across installment contracts that draw on the given
 * investment contract. This is the operator's view of "money collected
 * from the customers financed by this investor capital".
 */
export function collectedFor(
  investmentContract: InvestmentContract,
  installmentContracts: InstallmentContract[],
): number {
  return installmentContracts
    .filter((ic) => ic.investmentContractId === investmentContract.id)
    .reduce(
      (sum, ic) => sum + ic.schedule.reduce((s, inst) => s + inst.paidAmount, 0),
      0,
    );
}

/**
 * An investment contract is "ready to recycle" when:
 *  - capitalRecyclingEnabled is true,
 *  - it's still active,
 *  - collected ≥ its configured threshold (default 0 when none set).
 */
export function recycleReady(
  investmentContracts: InvestmentContract[],
  installmentContracts: InstallmentContract[],
): RecycleReady[] {
  return investmentContracts
    .filter((c) => c.capitalRecyclingEnabled && c.status === "active")
    .map((c) => ({
      contract: c,
      collected: collectedFor(c, installmentContracts),
      threshold: c.capitalRecyclingMinThreshold ?? 0,
    }))
    .filter((r) => r.collected >= r.threshold && r.collected > 0)
    .sort((a, b) => b.collected - a.collected);
}

export function aggregateRecycleReady(items: RecycleReady[]): {
  totalCollected: number;
  investorCount: number;
} {
  const investors = new Set<string>();
  let totalCollected = 0;
  for (const r of items) {
    investors.add(r.contract.investorId);
    totalCollected += r.collected;
  }
  return { totalCollected, investorCount: investors.size };
}

/**
 * Build the new contract number and id for a recycled cycle. The number is
 * suffixed -R{n} so it sorts naturally alongside the source in lists.
 */
export function nextRecycleNumber(
  sourceNumber: string,
  cycle: number,
): { id: string; number: string } {
  const stamp = Date.now().toString(36).slice(-6).toUpperCase();
  return {
    id: `c-rc-${stamp}`,
    number: `${sourceNumber}-R${cycle}`,
  };
}

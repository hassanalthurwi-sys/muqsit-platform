// Sprint 26 — Server-side report aggregations.
//
// Pure functions over the existing entity shapes. Same shapes whether
// the data comes from Prisma (Sprint 19) or the mock store (sandbox).

import type {
  InstallmentContract,
  Installment,
  Investor,
  InvestmentContract,
  ProfitDistribution,
  ReceiptVoucher,
} from "@/lib/mock/types";

// ── 1. Installment aging report ────────────────────────────────

export interface AgingBucket {
  bucket: "current" | "1-30" | "31-60" | "61-90" | "90+";
  count: number;
  amount: number;
}

export function agingReport(
  contracts: InstallmentContract[],
  installments: Installment[],
  asOf: Date = new Date(),
): AgingBucket[] {
  const buckets: Record<AgingBucket["bucket"], AgingBucket> = {
    current: { bucket: "current", count: 0, amount: 0 },
    "1-30": { bucket: "1-30", count: 0, amount: 0 },
    "31-60": { bucket: "31-60", count: 0, amount: 0 },
    "61-90": { bucket: "61-90", count: 0, amount: 0 },
    "90+": { bucket: "90+", count: 0, amount: 0 },
  };
  const today = asOf.getTime();
  for (const c of contracts) {
    const items = c.schedule ?? installments.filter((i) => i.contractId === c.id);
    for (const inst of items) {
      if (inst.status === "paid") continue;
      const remaining = inst.amount - inst.paidAmount;
      if (remaining <= 0) continue;
      const dueMs = new Date(inst.dueDate).getTime();
      const daysOverdue = Math.floor((today - dueMs) / (1000 * 60 * 60 * 24));
      const key: AgingBucket["bucket"] =
        daysOverdue <= 0
          ? "current"
          : daysOverdue <= 30
            ? "1-30"
            : daysOverdue <= 60
              ? "31-60"
              : daysOverdue <= 90
                ? "61-90"
                : "90+";
      buckets[key].count++;
      buckets[key].amount += remaining;
    }
  }
  return Object.values(buckets);
}

// ── 2. Investor performance ────────────────────────────────────

export interface InvestorPerformanceRow {
  investorId: string;
  investorName: string;
  type: Investor["type"];
  activeContracts: number;
  capitalDeployed: number;
  capitalAvailable: number;
  realizedProfit: number;
  expectedProfitRemaining: number;
}

export function investorPerformance(
  investors: Investor[],
  contracts: InvestmentContract[],
): InvestorPerformanceRow[] {
  return investors.map((inv) => {
    const myContracts = contracts.filter((c) => c.investorId === inv.id);
    const active = myContracts.filter((c) => c.status === "active");
    const capitalDeployed = active.reduce((s, c) => s + c.amount, 0);
    const capitalAvailable = active.reduce((s, c) => s + c.remaining, 0);
    const expectedRemaining = active.reduce(
      (s, c) => s + Math.max(0, c.investorExpectedProfit),
      0,
    );
    return {
      investorId: inv.id,
      investorName: inv.name,
      type: inv.type,
      activeContracts: active.length,
      capitalDeployed,
      capitalAvailable,
      realizedProfit: inv.realizedProfit,
      expectedProfitRemaining: expectedRemaining,
    };
  });
}

// ── 3. P&L report (per month) ──────────────────────────────────

export interface PnlRow {
  month: string; // YYYY-MM
  collected: number;
  officeProfit: number;
  investorProfit: number;
  outstandingExpected: number;
}

export function pnlByMonth(
  receipts: ReceiptVoucher[],
  distributions: ProfitDistribution[],
): PnlRow[] {
  const map = new Map<string, PnlRow>();

  function row(month: string): PnlRow {
    if (!map.has(month)) {
      map.set(month, {
        month,
        collected: 0,
        officeProfit: 0,
        investorProfit: 0,
        outstandingExpected: 0,
      });
    }
    return map.get(month)!;
  }

  for (const r of receipts) {
    if (r.partyType !== "customer") continue;
    const m = r.date.slice(0, 7);
    row(m).collected += r.amount;
  }
  for (const d of distributions) {
    const m = d.date.slice(0, 7);
    row(m).officeProfit += d.officeShare;
    row(m).investorProfit += d.investorProfitPortion;
  }
  return Array.from(map.values()).sort((a, b) => a.month.localeCompare(b.month));
}

// ── 4. Collections summary ─────────────────────────────────────

export interface CollectionsSummary {
  asOf: string;
  totalScheduled: number;
  totalCollected: number;
  collectionRatePct: number;
  contracts: { active: number; completed: number; defaulted: number };
}

export function collectionsSummary(
  contracts: InstallmentContract[],
  installments: Installment[],
): CollectionsSummary {
  let scheduled = 0;
  let collected = 0;
  for (const c of contracts) {
    const items = c.schedule ?? installments.filter((i) => i.contractId === c.id);
    for (const inst of items) {
      scheduled += inst.amount;
      collected += inst.paidAmount;
    }
  }
  const active = contracts.filter((c) => c.status === "active").length;
  const completed = contracts.filter((c) => c.status === "completed").length;
  const defaulted = contracts.filter((c) => c.status === "defaulted").length;
  return {
    asOf: new Date().toISOString(),
    totalScheduled: scheduled,
    totalCollected: collected,
    collectionRatePct: scheduled === 0 ? 0 : Math.round((collected / scheduled) * 1000) / 10,
    contracts: { active, completed, defaulted },
  };
}

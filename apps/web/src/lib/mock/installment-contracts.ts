import type { Installment, InstallmentContract, InstallmentStatus } from "./types";
import { MOCK_CONTRACTS } from "./contracts";

// Used to compute relative dates for mock schedules — a deterministic "today".
const REFERENCE_TODAY = "2025-06-01";

function addMonthsIso(iso: string, months: number): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  d.setMonth(d.getMonth() + months);
  return d.toISOString().slice(0, 10);
}

function daysBetween(a: string, b: string): number {
  const da = new Date(a).getTime();
  const db = new Date(b).getTime();
  return Math.floor((db - da) / (1000 * 60 * 60 * 24));
}

interface ScheduleSeed {
  // Override status for specific indices to demonstrate partial/overdue/defaulted.
  overrides?: Record<number, { paidAmount?: number; status?: InstallmentStatus }>;
  paidThrough?: number; // 1-based: installments 1..paidThrough are fully paid
}

// Build the schedule, automatically applying overdue/defaulted statuses based on REFERENCE_TODAY.
function buildSchedule(
  contractId: string,
  startDate: string,
  installmentsCount: number,
  monthly: number,
  seed: ScheduleSeed = {},
): Installment[] {
  const out: Installment[] = [];
  for (let i = 1; i <= installmentsCount; i += 1) {
    const dueDate = addMonthsIso(startDate, i);
    let paidAmount = 0;
    let status: InstallmentStatus = "scheduled";

    if (seed.paidThrough && i <= seed.paidThrough) {
      paidAmount = monthly;
      status = "paid";
    }
    if (seed.overrides && seed.overrides[i] !== undefined) {
      const o = seed.overrides[i];
      if (o.paidAmount !== undefined) paidAmount = o.paidAmount;
      if (o.status !== undefined) status = o.status;
    }
    // Auto-derive overdue/defaulted/paid from due date if still scheduled or partial.
    if (status === "scheduled" || status === "partiallyPaid") {
      const ageDays = daysBetween(dueDate, REFERENCE_TODAY);
      if (paidAmount === 0 && ageDays > 60) status = "defaulted";
      else if (paidAmount === 0 && ageDays > 0) status = "overdue";
      else if (paidAmount > 0 && paidAmount < monthly) status = "partiallyPaid";
      else if (paidAmount >= monthly) status = "paid";
    }

    out.push({
      id: `${contractId}-i${i}`,
      contractId,
      index: i,
      dueDate,
      amount: monthly,
      paidAmount,
      status,
      payments: [], // Detailed payment records elided for prototype mock
    });
  }
  return out;
}

interface ContractInit {
  id: string;
  number: string;
  customerId: string;
  productType: string;
  cashPrice: number;
  installmentPrice: number;
  downPayment: number;
  installmentsCount: number;
  startDate: string;
  investmentContractId: string;
  documentName?: string;
  notes?: string;
  schedule?: ScheduleSeed;
  forceStatus?: InstallmentContract["status"];
}

function deriveContract(c: ContractInit): InstallmentContract {
  const financingAmount = c.installmentPrice - c.downPayment;
  const monthlyInstallment = financingAmount / c.installmentsCount;
  const profitMargin = c.installmentPrice - c.cashPrice;
  const profitMarginPct = c.cashPrice ? profitMargin / c.cashPrice : 0;
  const schedule = buildSchedule(c.id, c.startDate, c.installmentsCount, monthlyInstallment, c.schedule);
  const remainingBalance = schedule.reduce((sum, s) => sum + (s.amount - s.paidAmount), 0);
  const endDate = addMonthsIso(c.startDate, c.installmentsCount);

  let status: InstallmentContract["status"] = c.forceStatus ?? "active";
  if (!c.forceStatus) {
    if (remainingBalance <= 0.5) status = "completed";
    else if (schedule.some((s) => s.status === "defaulted")) status = "defaulted";
  }

  return {
    id: c.id,
    number: c.number,
    customerId: c.customerId,
    productType: c.productType,
    cashPrice: c.cashPrice,
    installmentPrice: c.installmentPrice,
    downPayment: c.downPayment,
    installmentsCount: c.installmentsCount,
    financingAmount,
    monthlyInstallment,
    profitMargin,
    profitMarginPct,
    remainingBalance,
    investmentContractId: c.investmentContractId,
    capitalUtilized: financingAmount,
    startDate: c.startDate,
    endDate,
    status,
    // Sprint 11 — backfilled below from the total amount paid so far and
    // the parent investment contract's profit split, assuming the default
    // "office first" policy at seed time.
    officeRecoveredSoFar: 0,
    investorRecoveredSoFar: 0,
    schedule,
    documentName: c.documentName,
    notes: c.notes,
    timeline: [
      { ts: c.startDate, text: `تفعيل عقد التقسيط — ${c.productType}` },
      { ts: c.startDate, text: `استخدام ${financingAmount.toLocaleString("ar-SA-u-nu-latn")} ر.س من رأس مال ${c.investmentContractId}` },
    ],
  };
}

export const MOCK_INSTALLMENT_CONTRACTS: InstallmentContract[] = [
  deriveContract({
    id: "ins-2025-001",
    number: "INS-2025-001",
    customerId: "cus-1",
    productType: "حاسب آلي للأعمال",
    // Showcase numbers chosen to make the policy math easy to follow:
    //   Cash price 10,000 — Installment price 17,000 — Markup 7,000.
    //   17 monthly installments of 1,000 each, no down payment.
    //   Under Office First, the office collects its 3,000 share over the
    //   first 3 installments; investor recovers over the remaining 14.
    cashPrice: 10_000,
    installmentPrice: 17_000,
    downPayment: 0,
    installmentsCount: 17,
    startDate: "2025-02-15",
    investmentContractId: "c-2024-001",
    documentName: "INS-2025-001-contract.pdf",
    schedule: { paidThrough: 3 },
  }),
  deriveContract({
    id: "ins-2024-018",
    number: "INS-2024-018",
    customerId: "cus-2",
    productType: "مكيف سبليت سامسونج 24K",
    cashPrice: 3_000,
    installmentPrice: 3_800,
    downPayment: 400,
    installmentsCount: 18,
    startDate: "2024-09-15",
    investmentContractId: "c-2024-003",
    documentName: "INS-2024-018-contract.pdf",
    schedule: { paidThrough: 8 },
  }),
  deriveContract({
    id: "ins-2024-022",
    number: "INS-2024-022",
    customerId: "cus-3",
    productType: "ثلاجة LG 18 قدم — Inverter",
    cashPrice: 3_600,
    installmentPrice: 4_500,
    downPayment: 500,
    installmentsCount: 12,
    startDate: "2024-10-10",
    investmentContractId: "c-2024-008",
    documentName: "INS-2024-022-contract.pdf",
    schedule: { paidThrough: 7 },
  }),
  deriveContract({
    id: "ins-2024-030",
    number: "INS-2024-030",
    customerId: "cus-4",
    productType: "لابتوب MacBook Air M3 13 بوصة",
    cashPrice: 7_200,
    installmentPrice: 8_800,
    downPayment: 1_000,
    installmentsCount: 24,
    startDate: "2024-11-05",
    investmentContractId: "c-2024-004",
    documentName: "INS-2024-030-contract.pdf",
    schedule: { paidThrough: 6 },
  }),
  deriveContract({
    id: "ins-2024-035",
    number: "INS-2024-035",
    customerId: "cus-5",
    productType: "شاشة سامسونج OLED 65 بوصة",
    cashPrice: 4_500,
    installmentPrice: 5_500,
    downPayment: 700,
    installmentsCount: 12,
    startDate: "2024-12-01",
    investmentContractId: "c-2024-006",
    documentName: "INS-2024-035-contract.pdf",
    schedule: { paidThrough: 5 },
  }),
  deriveContract({
    id: "ins-2024-042",
    number: "INS-2024-042",
    customerId: "cus-7",
    productType: "جوال هواوي P60 Pro",
    cashPrice: 2_700,
    installmentPrice: 3_200,
    downPayment: 400,
    installmentsCount: 10,
    startDate: "2025-01-12",
    investmentContractId: "c-2024-007",
    documentName: "INS-2024-042-contract.pdf",
    schedule: { paidThrough: 4 },
  }),
  deriveContract({
    id: "ins-2024-007",
    number: "INS-2024-007",
    customerId: "cus-8",
    productType: "غسالة سامسونج 14 كيلو",
    cashPrice: 2_300,
    installmentPrice: 2_800,
    downPayment: 300,
    installmentsCount: 8,
    startDate: "2024-09-20",
    investmentContractId: "c-2024-005",
    documentName: "INS-2024-007-contract.pdf",
    schedule: { paidThrough: 3 },
  }),
  deriveContract({
    id: "ins-2024-050",
    number: "INS-2024-050",
    customerId: "cus-10",
    productType: "طاولة طعام فاخرة 8 مقاعد",
    cashPrice: 3_200,
    installmentPrice: 4_000,
    downPayment: 600,
    installmentsCount: 10,
    startDate: "2024-12-20",
    investmentContractId: "c-2024-010",
    documentName: "INS-2024-050-contract.pdf",
    schedule: { paidThrough: 5 },
  }),
];

export function findInstallmentContract(id: string): InstallmentContract | undefined {
  return MOCK_INSTALLMENT_CONTRACTS.find((c) => c.id === id);
}

export function customerContracts(customerId: string): InstallmentContract[] {
  return MOCK_INSTALLMENT_CONTRACTS.filter((c) => c.customerId === customerId);
}

// Sprint 11 backfill: pretend the office-first policy has been applied to
// every paid installment so far, so the per-investment-contract progress
// bars and per-investor realized profit show a believable starting state.
for (const ic of MOCK_INSTALLMENT_CONTRACTS) {
  const parent = MOCK_CONTRACTS.find((c) => c.id === ic.investmentContractId);
  if (!parent) continue;
  const totalPaid = ic.schedule.reduce((sum, s) => sum + s.paidAmount, 0);
  if (totalPaid <= 0) continue;
  const installmentProfit = Math.max(0, ic.installmentPrice - ic.cashPrice);
  const totalParent = parent.officeExpectedProfit + parent.investorExpectedProfit;
  const officeRatio = totalParent > 0 ? parent.officeExpectedProfit / totalParent : 0;
  const officeExpected = installmentProfit * officeRatio;
  const investorExpected = ic.cashPrice + (installmentProfit - officeExpected);
  // Office first: office gets paid until cap, then investor.
  const officeRec = Math.min(totalPaid, officeExpected);
  const investorRec = Math.min(totalPaid - officeRec, investorExpected);
  ic.officeRecoveredSoFar = officeRec;
  ic.investorRecoveredSoFar = investorRec;
}

export { REFERENCE_TODAY, addMonthsIso };

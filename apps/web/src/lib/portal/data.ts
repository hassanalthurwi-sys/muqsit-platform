// Derived selectors that adapt the office-side mock data for portal consumption.
// Self-service shape — only what an investor/customer needs to see about themselves.

import { MOCK_CONTRACTS } from "@/lib/mock/contracts";
import { MOCK_INSTALLMENT_CONTRACTS } from "@/lib/mock/installment-contracts";
import type { Installment, InstallmentContract, InvestmentContract } from "@/lib/mock/types";

const REFERENCE_TODAY = "2025-06-01";

export function investorContracts(investorId: string): InvestmentContract[] {
  return MOCK_CONTRACTS.filter((c) => c.investorId === investorId);
}

export interface InvestorDistribution {
  date: string;
  contractNumber: string;
  contractId: string;
  gross: number;
  fee: number;
  net: number;
}

// Re-shape the timeline activity entries that mention "توزيع أرباح" / "Profit distribution"
// into a structured distributions log.
export function investorDistributions(investorId: string): InvestorDistribution[] {
  const out: InvestorDistribution[] = [];
  for (const contract of investorContracts(investorId)) {
    for (const item of contract.timeline) {
      const match = item.text.match(/توزيع أرباح\s+([\d,]+)\s*ر\.س/);
      const matchEn = item.text.match(/Profit distribution\s+([\d,]+)/);
      const amountStr = match?.[1] ?? matchEn?.[1];
      if (!amountStr) continue;
      const net = Number(amountStr.replace(/,/g, ""));
      if (!Number.isFinite(net)) continue;
      const operationPct = contract.operationPct / 100;
      const gross = operationPct > 0 ? net / (1 - operationPct) : net;
      out.push({
        date: item.ts,
        contractNumber: contract.number,
        contractId: contract.id,
        gross,
        fee: gross - net,
        net,
      });
    }
  }
  return out.sort((a, b) => b.date.localeCompare(a.date));
}

export interface InvestorPortfolioSummary {
  principal: number;
  utilized: number;
  unutilized: number;
  activeCount: number;
  ytdNet: number;
  thisMonthNet: number;
  nextDistributionDate: string;
}

function addMonthsIso(iso: string, months: number): string {
  const d = new Date(iso);
  d.setMonth(d.getMonth() + months);
  return d.toISOString().slice(0, 10);
}

export function investorPortfolioSummary(investorId: string): InvestorPortfolioSummary {
  const contracts = investorContracts(investorId).filter((c) => c.status === "active");
  const principal = contracts.reduce((s, c) => s + c.amount, 0);
  const utilized = contracts.reduce((s, c) => s + c.utilized, 0);
  const unutilized = principal - utilized;

  const distributions = investorDistributions(investorId);
  const currentYear = REFERENCE_TODAY.slice(0, 4);
  const currentMonth = REFERENCE_TODAY.slice(0, 7);
  const ytdNet = distributions
    .filter((d) => d.date.startsWith(currentYear))
    .reduce((s, d) => s + d.net, 0);
  const thisMonthNet = distributions
    .filter((d) => d.date.startsWith(currentMonth))
    .reduce((s, d) => s + d.net, 0);

  // Estimate next distribution: 1 month after most recent.
  const last = distributions[0]?.date ?? REFERENCE_TODAY;
  const nextDistributionDate = addMonthsIso(last, 1);

  return {
    principal,
    utilized,
    unutilized,
    activeCount: contracts.length,
    ytdNet,
    thisMonthNet,
    nextDistributionDate,
  };
}

// ── Customer side ───────────────────────────────────────────────────────────

export function customerInstallmentContracts(customerId: string): InstallmentContract[] {
  return MOCK_INSTALLMENT_CONTRACTS.filter((c) => c.customerId === customerId);
}

export function customerActiveContract(customerId: string): InstallmentContract | undefined {
  return customerInstallmentContracts(customerId).find((c) => c.status !== "completed");
}

export interface InstallmentSummary {
  totalCount: number;
  paidCount: number;
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
  nextInstallment?: Installment;
  hasOverdue: boolean;
  productLabel: string;
  contractNumber: string;
}

export function customerSummary(customerId: string): InstallmentSummary | undefined {
  const contract = customerActiveContract(customerId);
  if (!contract) return undefined;
  const schedule = contract.schedule;
  const paidCount = schedule.filter((i) => i.status === "paid").length;
  const totalAmount = schedule.reduce((s, i) => s + i.amount, 0);
  const paidAmount = schedule.reduce((s, i) => s + i.paidAmount, 0);
  const remainingAmount = totalAmount - paidAmount;
  const nextInstallment = schedule.find(
    (i) => i.status === "scheduled" || i.status === "partiallyPaid" || i.status === "overdue",
  );
  const hasOverdue = schedule.some((i) => i.status === "overdue" || i.status === "defaulted");

  return {
    totalCount: schedule.length,
    paidCount,
    totalAmount,
    paidAmount,
    remainingAmount,
    nextInstallment,
    hasOverdue,
    productLabel: contract.productType,
    contractNumber: contract.number,
  };
}

export interface CustomerProof {
  id: string;
  installmentIndex: number;
  amount: number;
  uploadedAt: string;
  status: "pending" | "approved" | "rejected";
  method: "bankTransfer" | "stcPay" | "cash";
  reference?: string;
}

// Synthetic recent-proofs list — derived from paid installments in the customer's schedule.
export function customerRecentProofs(customerId: string): CustomerProof[] {
  const contract = customerActiveContract(customerId);
  if (!contract) return [];
  const proofs: CustomerProof[] = [];
  const paidOnes = contract.schedule.filter((i) => i.status === "paid");
  paidOnes.slice(-4).forEach((inst, idx) => {
    proofs.push({
      id: `prf-${contract.id}-${inst.index}`,
      installmentIndex: inst.index,
      amount: inst.amount,
      uploadedAt: inst.dueDate,
      status: "approved",
      method: idx % 2 === 0 ? "bankTransfer" : "stcPay",
      reference: `TRX-${4080 + inst.index * 17}`,
    });
  });
  // Add one pending example if there's a partial / overdue installment.
  const pending = contract.schedule.find(
    (i) => i.status === "partiallyPaid" || i.status === "overdue",
  );
  if (pending) {
    proofs.unshift({
      id: `prf-${contract.id}-${pending.index}-pending`,
      installmentIndex: pending.index,
      amount: pending.amount,
      uploadedAt: REFERENCE_TODAY,
      status: "pending",
      method: "stcPay",
      reference: `STC-${pending.index * 73}`,
    });
  }
  return proofs;
}

// ── Notifications (portal-scoped) ───────────────────────────────────────────

export interface PortalNotification {
  id: string;
  ts: string;
  unread: boolean;
  iconKind: "profit" | "contract" | "installment" | "proof" | "office";
  titleAr: string;
  titleEn: string;
  bodyAr: string;
  bodyEn: string;
}

export function investorNotifications(): PortalNotification[] {
  return [
    {
      id: "ni-1",
      ts: "2025-05-28",
      unread: true,
      iconKind: "profit",
      titleAr: "تم إيداع توزيع أرباح",
      titleEn: "Profit distribution deposited",
      bodyAr: "45,000 ر.س عن العقد INV-2024-001 — مارس / أبريل.",
      bodyEn: "45,000 SAR for contract INV-2024-001 — Mar/Apr.",
    },
    {
      id: "ni-2",
      ts: "2025-05-12",
      unread: true,
      iconKind: "office",
      titleAr: "كشف شهر أبريل جاهز",
      titleEn: "April statement is ready",
      bodyAr: "اطّلع على ملخص حركة شهر أبريل من كشوف الحساب.",
      bodyEn: "Review the April activity summary in Statements.",
    },
    {
      id: "ni-3",
      ts: "2025-04-15",
      unread: false,
      iconKind: "profit",
      titleAr: "توزيع أرباح",
      titleEn: "Profit distribution",
      bodyAr: "تم إيداع 36,000 ر.س — مارس.",
      bodyEn: "36,000 SAR deposited — March.",
    },
    {
      id: "ni-4",
      ts: "2025-02-10",
      unread: false,
      iconKind: "contract",
      titleAr: "تخصيص رأس مال إضافي",
      titleEn: "Additional capital allocated",
      bodyAr: "تم تخصيص 200,000 ر.س للعقد INV-2024-007.",
      bodyEn: "200,000 SAR allocated to INV-2024-007.",
    },
  ];
}

export function customerNotifications(): PortalNotification[] {
  return [
    {
      id: "nc-1",
      ts: "2025-05-29",
      unread: true,
      iconKind: "installment",
      titleAr: "قسطك القادم بعد 3 أيام",
      titleEn: "Your next installment is in 3 days",
      bodyAr: "قسط رقم 10 — 188.89 ر.س — يستحق 15 يونيو.",
      bodyEn: "Installment #10 — 188.89 SAR — due Jun 15.",
    },
    {
      id: "nc-2",
      ts: "2025-05-18",
      unread: true,
      iconKind: "proof",
      titleAr: "تم قبول إيصالك",
      titleEn: "Your proof was approved",
      bodyAr: "تم قبول إيصال قسط رقم 9 بمبلغ 188.89 ر.س.",
      bodyEn: "Proof for installment #9 (188.89 SAR) was approved.",
    },
    {
      id: "nc-3",
      ts: "2025-04-16",
      unread: false,
      iconKind: "installment",
      titleAr: "تم تسجيل دفع قسط رقم 8",
      titleEn: "Installment #8 recorded as paid",
      bodyAr: "شكراً لك على السداد في وقته.",
      bodyEn: "Thank you for paying on time.",
    },
    {
      id: "nc-4",
      ts: "2025-03-18",
      unread: false,
      iconKind: "office",
      titleAr: "تذكير ودّي",
      titleEn: "Friendly reminder",
      bodyAr: "نرجو رفع إيصال قسط رقم 7 خلال 24 ساعة.",
      bodyEn: "Please upload your proof for installment #7 within 24 hours.",
    },
  ];
}

export { REFERENCE_TODAY };

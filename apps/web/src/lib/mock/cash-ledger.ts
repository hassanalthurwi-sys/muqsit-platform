import type { CashLedgerEntry, PaymentVoucher, ReceiptVoucher } from "./types";

export const OPENING_BALANCE = 125_000;
export const OPENING_DATE = "2025-05-01";

export function buildCashLedger(
  receipts: ReceiptVoucher[],
  payments: PaymentVoucher[],
): CashLedgerEntry[] {
  const incoming: CashLedgerEntry[] = receipts
    .filter((r) => r.status !== "cancelled")
    .map((r) => ({
      id: `led-r-${r.id}`,
      date: r.date,
      ts: r.createdAt,
      direction: "in",
      amount: r.amount,
      method: r.method,
      voucherType: "receipt",
      voucherId: r.id,
      voucherNumber: r.number,
      description: r.notes ?? r.fromName,
      entityKind: r.customerId
        ? "customer"
        : r.investorId
          ? "investor"
          : "office",
      entityId: r.customerId ?? r.investorId,
      entityName: r.fromName,
      employeeId: r.createdById,
    }));

  const outgoing: CashLedgerEntry[] = payments
    .filter((p) => p.status !== "cancelled" && p.status !== "draft")
    .map((p) => ({
      id: `led-p-${p.id}`,
      date: p.date,
      ts: p.createdAt,
      direction: "out",
      amount: p.amount,
      method: p.method,
      voucherType: "payment",
      voucherId: p.id,
      voucherNumber: p.number,
      description: p.notes ?? p.beneficiaryName,
      entityKind: p.customerId
        ? "customer"
        : p.investorId
          ? "investor"
          : p.purchaseId
            ? "supplier"
            : "office",
      entityId: p.customerId ?? p.investorId ?? p.purchaseId,
      entityName: p.beneficiaryName,
      employeeId: p.createdById,
    }));

  return [...incoming, ...outgoing].sort((a, b) => (a.ts < b.ts ? -1 : 1));
}

export function summary(entries: CashLedgerEntry[]) {
  const totalIn = entries
    .filter((e) => e.direction === "in")
    .reduce((sum, e) => sum + e.amount, 0);
  const totalOut = entries
    .filter((e) => e.direction === "out")
    .reduce((sum, e) => sum + e.amount, 0);
  const balance = OPENING_BALANCE + totalIn - totalOut;
  return { totalIn, totalOut, balance, opening: OPENING_BALANCE };
}

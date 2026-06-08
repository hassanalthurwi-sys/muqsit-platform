// Sprint 12 — Mock migration samples.
//
// What the system "extracts" for each step + input-method combination.
// Records are deliberately mixed: most cells are confirmed, a few need
// review, a small number are missing. This keeps the review experience
// believable without resorting to real OCR / Excel parsing.

import type {
  MigrationInputMethod,
  MigrationMatchPrompt,
  MigrationRow,
  MigrationStepKey,
} from "./types";

type CellStatus = "confirmed" | "needsReview" | "missing";

function cell(value: string, status: CellStatus = "confirmed") {
  return { value, status };
}

// ─── Investors (3 rows) ──────────────────────────────────────────────
const INVESTORS_ROWS: MigrationRow[] = [
  {
    id: "mig-inv-1",
    cells: {
      name: cell("سعد بن إبراهيم العمري"),
      identityType: cell("سعودي"),
      identityNumber: cell("1087452103"),
      phone: cell("+966 55 119 2240"),
      email: cell("s.alomari@example.com"),
      bank: cell("مصرف الراجحي"),
      iban: cell("SA56 8000 1234 5678 9012 3456", "needsReview"),
    },
  },
  {
    id: "mig-inv-2",
    cells: {
      name: cell("نوال الدوسري"),
      identityType: cell("سعودي"),
      identityNumber: cell("1078334451"),
      phone: cell("+966 50 887 3092"),
      email: cell("—", "missing"),
      bank: cell("البنك الأهلي السعودي"),
      iban: cell("SA22 1000 0045 1228 7766 5544"),
    },
  },
  {
    id: "mig-inv-3",
    cells: {
      name: cell("شركة الأنوار للاستثمار"),
      identityType: cell("منشأة تجارية"),
      identityNumber: cell("1010998877"),
      phone: cell("+966 11 661 4500"),
      email: cell("finance@alanwar-inv.sa"),
      bank: cell("بنك الرياض"),
      iban: cell("SA91 2000 0201 5674 1100 4477"),
    },
  },
];

// ─── Investment Contracts (4 rows) ───────────────────────────────────
const INVESTMENT_CONTRACTS_ROWS: MigrationRow[] = [
  {
    id: "mig-ic-1",
    cells: {
      investor: cell("سعد العمري", "needsReview"),
      capital: cell("250,000"),
      officeProfit: cell("60,000"),
      investorProfit: cell("90,000"),
      startDate: cell("2024-09-01"),
      durationMonths: cell("24"),
    },
  },
  {
    id: "mig-ic-2",
    cells: {
      investor: cell("نوال الدوسري"),
      capital: cell("100,000"),
      officeProfit: cell("25,000"),
      investorProfit: cell("35,000"),
      startDate: cell("2024-11-15"),
      durationMonths: cell("18"),
    },
  },
  {
    id: "mig-ic-3",
    cells: {
      investor: cell("الأنوار للاستثمار", "needsReview"),
      capital: cell("500,000"),
      officeProfit: cell("130,000"),
      investorProfit: cell("180,000"),
      startDate: cell("2025-01-10"),
      durationMonths: cell("24"),
    },
  },
  {
    id: "mig-ic-4",
    cells: {
      investor: cell("محمد السبيعي", "needsReview"),
      capital: cell("80,000"),
      officeProfit: cell("20,000"),
      investorProfit: cell("28,000"),
      startDate: cell("—", "missing"),
      durationMonths: cell("12"),
    },
  },
];

// ─── Customers (5 rows) ──────────────────────────────────────────────
const CUSTOMERS_ROWS: MigrationRow[] = [
  {
    id: "mig-cu-1",
    cells: {
      name: cell("راكان بن مساعد المالكي"),
      identityNumber: cell("1099334502"),
      phone: cell("+966 53 224 9930"),
      city: cell("جدة"),
      employer: cell("شركة سابك"),
      monthlySalary: cell("18,500"),
    },
  },
  {
    id: "mig-cu-2",
    cells: {
      name: cell("لطيفة الزهراني"),
      identityNumber: cell("1056781209"),
      phone: cell("+966 56 110 4488"),
      city: cell("الرياض"),
      employer: cell("وزارة التعليم"),
      monthlySalary: cell("12,000"),
    },
  },
  {
    id: "mig-cu-3",
    cells: {
      name: cell("بدر العتيبي"),
      identityNumber: cell("1078990223"),
      phone: cell("—", "missing"),
      city: cell("الدمام"),
      employer: cell("STC"),
      monthlySalary: cell("14,200"),
    },
  },
  {
    id: "mig-cu-4",
    cells: {
      name: cell("سارة بنت فهد الغامدي"),
      identityNumber: cell("1099887701"),
      phone: cell("+966 50 778 1122"),
      city: cell("جدة"),
      employer: cell("بنك الإنماء"),
      monthlySalary: cell("16,800"),
    },
  },
  {
    id: "mig-cu-5",
    cells: {
      name: cell("ماجد القرني"),
      identityNumber: cell("1077221345", "needsReview"),
      phone: cell("+966 55 990 2244"),
      city: cell("أبها"),
      employer: cell("مؤسسة خاصة"),
      monthlySalary: cell("9,500"),
    },
  },
];

// ─── Installment Contracts (3 rows) ──────────────────────────────────
const INSTALLMENT_CONTRACTS_ROWS: MigrationRow[] = [
  {
    id: "mig-inc-1",
    cells: {
      customer: cell("راكان المالكي", "needsReview"),
      product: cell("سيارة هونداي توسان ٢٠٢٤"),
      cashPrice: cell("85,000"),
      installmentPrice: cell("105,000"),
      installmentsCount: cell("24"),
      startDate: cell("2024-12-01"),
      fundedBy: cell("عقد سعد العمري", "needsReview"),
    },
  },
  {
    id: "mig-inc-2",
    cells: {
      customer: cell("لطيفة الزهراني"),
      product: cell("ثلاجة LG 22 قدم"),
      cashPrice: cell("4,500"),
      installmentPrice: cell("7,200"),
      installmentsCount: cell("18"),
      startDate: cell("2025-02-15"),
      fundedBy: cell("عقد نوال الدوسري"),
    },
  },
  {
    id: "mig-inc-3",
    cells: {
      customer: cell("سارة الغامدي"),
      product: cell("غسالة سامسونج 14 كجم"),
      cashPrice: cell("3,200"),
      installmentPrice: cell("5,100"),
      installmentsCount: cell("12"),
      startDate: cell("2025-03-10"),
      fundedBy: cell("—", "missing"),
    },
  },
];

// ─── Receipt Vouchers (4 rows) ───────────────────────────────────────
const RECEIPTS_ROWS: MigrationRow[] = [
  {
    id: "mig-rc-1",
    cells: {
      date: cell("2025-04-15"),
      party: cell("راكان المالكي"),
      partyType: cell("عميل"),
      amount: cell("4,375"),
      method: cell("تحويل بنكي"),
      description: cell("قسط ٥ — سيارة هونداي"),
    },
  },
  {
    id: "mig-rc-2",
    cells: {
      date: cell("2025-04-15"),
      party: cell("لطيفة الزهراني"),
      partyType: cell("عميل"),
      amount: cell("400"),
      method: cell("STC Pay"),
      description: cell("قسط ٢ — ثلاجة"),
    },
  },
  {
    id: "mig-rc-3",
    cells: {
      date: cell("2025-04-01"),
      party: cell("سعد العمري"),
      partyType: cell("مستثمر"),
      amount: cell("250,000"),
      method: cell("تحويل بنكي"),
      description: cell("إيداع رأس مال — عقد جديد"),
    },
  },
  {
    id: "mig-rc-4",
    cells: {
      date: cell("2025-03-20"),
      party: cell("—", "missing"),
      partyType: cell("عميل", "needsReview"),
      amount: cell("1,200"),
      method: cell("نقداً"),
      description: cell("قسط — السجل غير واضح"),
    },
  },
];

// ─── Payment Vouchers (3 rows) ───────────────────────────────────────
const PAYMENTS_ROWS: MigrationRow[] = [
  {
    id: "mig-pv-1",
    cells: {
      date: cell("2025-04-30"),
      party: cell("نوال الدوسري"),
      partyType: cell("مستثمر"),
      amount: cell("7,500"),
      method: cell("تحويل بنكي"),
      description: cell("توزيع أرباح شهري"),
    },
  },
  {
    id: "mig-pv-2",
    cells: {
      date: cell("2025-04-12"),
      party: cell("معرض المالكي للسيارات"),
      partyType: cell("أخرى"),
      amount: cell("85,000"),
      method: cell("تحويل بنكي"),
      description: cell("شراء سيارة هونداي لعقد تقسيط"),
    },
  },
  {
    id: "mig-pv-3",
    cells: {
      date: cell("2025-04-05"),
      party: cell("مكتب العقارية"),
      partyType: cell("أخرى"),
      amount: cell("9,000"),
      method: cell("تحويل بنكي"),
      description: cell("إيجار المكتب — أبريل"),
    },
  },
];

const ROWS_BY_STEP: Record<Exclude<MigrationStepKey, "review">, MigrationRow[]> = {
  investors: INVESTORS_ROWS,
  investmentContracts: INVESTMENT_CONTRACTS_ROWS,
  customers: CUSTOMERS_ROWS,
  installmentContracts: INSTALLMENT_CONTRACTS_ROWS,
  receipts: RECEIPTS_ROWS,
  payments: PAYMENTS_ROWS,
};

// Input method modifies how many cells need review — Excel cleanest,
// scans messiest. Pure function over the base rows.
export function sampleRowsFor(
  step: Exclude<MigrationStepKey, "review">,
  method: MigrationInputMethod,
): MigrationRow[] {
  const base = ROWS_BY_STEP[step];
  if (method === "manual") return [];
  if (method === "excel") return base; // baseline
  // PDF and scan progressively degrade — flip some confirmed cells to needsReview
  return base.map((row, idx) => {
    const cells: typeof row.cells = {};
    for (const [key, value] of Object.entries(row.cells)) {
      const downgrade = method === "scan" ? idx % 2 === 0 : idx === 0;
      cells[key] = {
        value: value.value,
        status:
          downgrade && value.status === "confirmed" ? "needsReview" : value.status,
      };
    }
    return { id: row.id, cells };
  });
}

// ─── Reconciliation prompts (one prominent example per relevant step) ─
export const SAMPLE_MATCHES: Partial<Record<MigrationStepKey, MigrationMatchPrompt[]>> = {
  investmentContracts: [
    {
      id: "match-ic-1",
      importedLabel: "محمد السبيعي",
      existingLabel: "محمد بن عبدالله السبيعي",
      context: "عقد استثمار 80,000 ر.س — من ملف Excel",
    },
    {
      id: "match-ic-2",
      importedLabel: "خالد العتيبي",
      existingLabel: "خالد العتيبي",
      context: "عقد استثمار 100,000 ر.س — تطابق كامل",
    },
  ],
  installmentContracts: [
    {
      id: "match-inc-1",
      importedLabel: "راكان المالكي",
      existingLabel: "راكان بن مساعد المالكي",
      context: "عقد تقسيط سيارة 85,000 ر.س",
    },
  ],
  receipts: [
    {
      id: "match-rc-1",
      importedLabel: "سعد العمري",
      existingLabel: "سعد بن إبراهيم العمري",
      context: "سند قبض 250,000 ر.س",
    },
  ],
};

export const MIGRATION_STEP_ORDER: MigrationStepKey[] = [
  "investors",
  "investmentContracts",
  "customers",
  "installmentContracts",
  "receipts",
  "payments",
  "review",
];

export function migrationColumnsFor(step: Exclude<MigrationStepKey, "review">): string[] {
  switch (step) {
    case "investors":
      return ["name", "identityType", "identityNumber", "phone", "email", "bank", "iban"];
    case "investmentContracts":
      return ["investor", "capital", "officeProfit", "investorProfit", "startDate", "durationMonths"];
    case "customers":
      return ["name", "identityNumber", "phone", "city", "employer", "monthlySalary"];
    case "installmentContracts":
      return ["customer", "product", "cashPrice", "installmentPrice", "installmentsCount", "startDate", "fundedBy"];
    case "receipts":
      return ["date", "party", "partyType", "amount", "method", "description"];
    case "payments":
      return ["date", "party", "partyType", "amount", "method", "description"];
  }
}

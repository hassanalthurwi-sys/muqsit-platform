// Sprint 2 + 3 prototype — domain types live alongside mock data.
// They'll move into a shared package + Prisma in a later sprint.

export type InvestorType = "internal" | "external";

export type LegalIdentity =
  | { kind: "saudiIndividual"; nationalId: string }
  | { kind: "gccIndividual"; gccId: string; country: string }
  | { kind: "foreignIndividual"; passport: string; nationality: string }
  | { kind: "commercialEntity"; cr: string; entityName: string };

export type IdentityKind = LegalIdentity["kind"];

export type InvestorStatus = "active" | "inactive" | "suspended";

export interface BankAccount {
  bankName: string;
  iban: string;
  accountHolder?: string;
}

export interface ActivityItem {
  ts: string; // ISO date
  text: string;
}

export interface Investor {
  id: string;
  name: string;
  type: InvestorType;
  identity: LegalIdentity;
  email?: string;
  phone?: string;
  joinedAt: string;
  status: InvestorStatus;
  totalCapital: number;
  utilizedCapital: number;
  unutilizedCapital: number;
  activeContractCount: number;
  bankAccount: BankAccount;
  profitTerms: string;
  recentActivity: ActivityItem[];
}

export type ContractStatus = "active" | "ended" | "pendingSetup" | "cancelled";

export interface InvestmentContract {
  id: string;
  number: string;
  investorId: string;
  amount: number;
  startDate: string;
  endDate: string;
  durationMonths: number;
  operationPct: number;
  utilized: number;
  remaining: number;
  status: ContractStatus;
  profitNotes: string;
  capitalRecyclingEnabled: boolean;
  capitalRecyclingMinThreshold?: number;
  documentName?: string;
  timeline: ActivityItem[];
  linkedInstallmentContractIds: string[];
}

// ─── Sprint 3: Customers · Installment contracts · Payments ───────────────

export type CustomerIdentity =
  | { kind: "saudiIndividual"; nationalId: string }
  | { kind: "gccIndividual"; gccId: string; country: string }
  | { kind: "foreignIndividual"; passport: string; nationality: string };

export type CustomerIdentityKind = CustomerIdentity["kind"];

export type CustomerRiskClass = "low" | "medium" | "high";

export interface Customer {
  id: string;
  name: string;
  identity: CustomerIdentity;
  mobile: string;
  nationality: string;
  dateOfBirth: string;
  employer: string;
  monthlySalary: number;
  obligations?: number;
  city: string;
  address: string;
  riskClass: CustomerRiskClass;
  notes: string;
  createdAt: string;
}

export type InstallmentStatus = "scheduled" | "partiallyPaid" | "paid" | "overdue" | "defaulted";

export type PaymentSource = "whatsapp_upload" | "bank_transfer" | "cash";

export interface PaymentRecord {
  id: string;
  ts: string;
  amount: number;
  source: PaymentSource;
  proofId?: string;
  approved: boolean;
  verifiedBy?: string;
  verifiedAt?: string;
  notes?: string;
}

export interface Installment {
  id: string;
  contractId: string;
  index: number;
  dueDate: string;
  amount: number;
  paidAmount: number;
  status: InstallmentStatus;
  payments: PaymentRecord[];
}

export type InstallmentContractStatus = "active" | "completed" | "defaulted" | "cancelled";

export interface InstallmentContract {
  id: string;
  number: string; // INS-YYYY-NNN
  customerId: string;
  productType: string;
  cashPrice: number;
  installmentPrice: number;
  downPayment: number;
  installmentsCount: number;
  financingAmount: number;
  monthlyInstallment: number;
  profitMargin: number;
  profitMarginPct: number;
  remainingBalance: number;
  investmentContractId: string;
  capitalUtilized: number;
  startDate: string;
  endDate: string;
  status: InstallmentContractStatus;
  schedule: Installment[];
  notes?: string;
  documentName?: string;
  timeline: ActivityItem[];
}

export type ProofStatus = "pending" | "approved" | "rejected" | "needsClarification";

export interface OcrExtractedFields {
  transferAmount?: number;
  senderName?: string;
  transferDate?: string;
  transferReference?: string;
  bankName?: string;
  confidence: number; // 0..1
}

export interface PaymentProof {
  id: string;
  customerId: string;
  contractId: string;
  installmentId: string;
  uploadedAt: string;
  fileName: string;
  receiptImageUrl: string;
  ocr: OcrExtractedFields;
  status: ProofStatus;
  duplicateOf?: string;
  decisionBy?: string;
  decisionAt?: string;
  decisionReason?: string;
}

export type WhatsAppSender = "system" | "customer";

export interface WhatsAppMessage {
  id: string;
  ts: string;
  from: WhatsAppSender;
  type: "text" | "image" | "document";
  body: string;
  attachmentRef?: string;
}

export interface WhatsAppThread {
  customerId: string;
  messages: WhatsAppMessage[];
}

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

// ─── Forward-looking architecture (not built yet, but informs current shape) ──
//
// 1. Profit distribution POLICY is NEVER per-contract.
//    Two levels only:
//      a. Office settings — default policy: officeFirst | investorFirst | proportional
//      b. Investor record — override: useOfficeDefault | officeFirst | investorFirst | proportional
//    InvestmentContract.operationPct stays as a numeric rate (office share),
//    but the *policy direction* belongs on the office / investor, not here.
//
// 2. "Investor Balance at the Office" will be the operational source for new
//    investments. It is a derived aggregate, not a new entity:
//      + investor receipt vouchers
//      + collected installment payments
//      + investor-entitled profits
//      − investment contracts created
//      − investor payment vouchers
//    Do not add a stored balance field. The existing receipts/payments already
//    carry investorId — the balance is a future selector over those streams.
//
// Keep both pieces simple. Avoid ERP-style ledgers, journals, or per-contract
// distribution-policy fields.
// ─────────────────────────────────────────────────────────────────────────────

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
  // Optional capital-recycling tracking. When sourceContractId is set, this
  // contract was created by recycling — but the source is intentionally not
  // surfaced in the UI. recycledFromCollected and recyclingOfficeMargin are
  // informational (rendered on the recycled contract detail).
  sourceContractId?: string;
  recyclingCycle?: number;
  recycledFromCollected?: number;
  recyclingOfficeMargin?: number;
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

// ─── Sprint 4: Permissions · Approvals · Notifications · Audit ──────────────

export type PermissionAction =
  | "createInstallmentContract"
  | "editInstallments"
  | "rescheduleContract"
  | "deleteAttachment"
  | "closeContract"
  | "approvePaymentProof"
  | "rejectPaymentProof"
  | "recordPartialPayment"
  | "createCustomer"
  | "approveHighRiskCustomer"
  | "createInvestmentContract"
  | "distributeProfits"
  | "exportReport"
  | "managePermissions";

export type PermissionGroup = "contracts" | "payments" | "customers" | "investors" | "system";

export type PermissionState = "allow" | "requireApproval" | "deny";

export interface Role {
  id: string;
  name: string;
  description: string;
  isPreset: boolean;
  permissions: Record<PermissionAction, PermissionState>;
  employeeCount: number;
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  roleId: string;
  roleName: string;
  bypassApprovals: boolean;
  active: boolean;
  joinedAt: string;
}

export type ApprovalStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "needsClarification"
  | "escalated";

export type ApprovalPriority = "critical" | "normal" | "low";

export interface ApprovalRequest {
  id: string;
  type: PermissionAction;
  priority: ApprovalPriority;
  status: ApprovalStatus;
  requestedById: string;
  requestedAt: string;
  reason?: string;
  flags: string[]; // e.g. "duplicateReference", "highRiskCustomer", "amountAboveThreshold"
  relatedEntity: {
    kind: "proof" | "contract" | "customer" | "attachment" | "installment";
    id: string;
    label: string;
  };
  amount?: number;
  decidedById?: string;
  decidedAt?: string;
  decisionNote?: string;
  remindersSent: number;
}

export type NotificationType =
  | "overdueCustomer"
  | "newPaymentProof"
  | "duplicateTransferReference"
  | "pendingApproval"
  | "investorLowCapital"
  | "contractExpiring"
  | "ocrLowConfidence"
  | "rescheduleRequest";

export type NotificationPriority = "critical" | "warning" | "info";

export type NotificationState = "unread" | "read" | "dismissed";

export interface AppNotification {
  id: string;
  type: NotificationType;
  priority: NotificationPriority;
  state: NotificationState;
  title: string;
  body: string;
  relatedEntity?: {
    kind: "customer" | "contract" | "proof" | "investor" | "investmentContract" | "approval";
    id: string;
    label: string;
  };
  assignedToId?: string;
  createdAt: string;
  isReminder?: boolean;
}

export interface AuditEntry {
  id: string;
  ts: string;
  actorId: string;
  action: PermissionAction;
  entity: { kind: string; id: string; label: string };
  summary: string;
  before?: string;
  after?: string;
}

// ─── Sprint 5: Financial operations ─────────────────────────────────────────

export type PaymentMethod = "cash" | "bankTransfer" | "stcPay" | "cheque" | "card";

export type VoucherStatus = "draft" | "verified" | "cancelled";

export type ReceiptSource =
  | "customerInstallment"
  | "investorDeposit"
  | "officeIncome"
  | "other";

export interface ReceiptVoucher {
  id: string;
  number: string;
  date: string;
  amount: number;
  method: PaymentMethod;
  source: ReceiptSource;
  fromName: string;
  customerId?: string;
  investorId?: string;
  contractId?: string;
  investmentContractId?: string;
  reference?: string;
  notes?: string;
  createdById: string;
  createdAt: string;
  status: VoucherStatus;
  verifiedById?: string;
  verifiedAt?: string;
  attachmentCount: number;
  flags?: string[];
}

export type PaymentCategory =
  | "goodsPurchase"
  | "investorProfit"
  | "officeExpense"
  | "salary"
  | "rent"
  | "adminExpense"
  | "other";

export interface PaymentVoucher {
  id: string;
  number: string;
  date: string;
  category: PaymentCategory;
  amount: number;
  method: PaymentMethod;
  beneficiaryName: string;
  customerId?: string;
  investorId?: string;
  contractId?: string;
  investmentContractId?: string;
  purchaseId?: string;
  reference?: string;
  notes?: string;
  createdById: string;
  createdAt: string;
  status: VoucherStatus;
  needsApproval: boolean;
  approvalId?: string;
  attachmentCount: number;
}

export interface CashLedgerEntry {
  id: string;
  date: string;
  ts: string;
  direction: "in" | "out";
  amount: number;
  method: PaymentMethod;
  voucherType: "receipt" | "payment";
  voucherId: string;
  voucherNumber: string;
  description: string;
  entityKind?: "customer" | "investor" | "office" | "supplier";
  entityId?: string;
  entityName?: string;
  employeeId: string;
}

export type PurchaseStatus = "purchased" | "linkedToContract" | "sold";

export interface GoodsPurchase {
  id: string;
  number: string;
  date: string;
  supplierName: string;
  description: string;
  amount: number;
  method: PaymentMethod;
  status: PurchaseStatus;
  linkedContractId?: string;
  paymentVoucherId?: string;
  attachmentCount: number;
  notes?: string;
}

// ─── Sprint 8: Office Settings (revised) ────────────────────────────────────
//
// Simple office preferences — not an admin / ERP configuration screen.
// Single configuration object for the office. Stored on the mock store.
// Read by no business logic yet (defaults will be picked up by relevant
// flows in later sprints). This sprint delivers the settings layer itself.
//
// Profit distribution policy follows the locked architectural principle:
// two levels only — office default here, investor override on the Investor
// record (not yet built). Never per-contract.

export type ProfitDistributionPolicy = "officeFirst" | "investorFirst" | "proportional";

export type NotificationChannel = "whatsapp" | "sms" | "email";

export type NotificationAlertType =
  | "overdueCustomer"
  | "newPaymentProof"
  | "pendingApproval"
  | "contractExpiring"
  | "lowOcrConfidence"
  | "investorLowCapital";

export interface OfficeBankAccount {
  id: string;
  bankName: string;
  beneficiaryName: string;
  iban: string;
}

export interface OfficeSettings {
  identity: {
    nameAr: string;
    nameEn: string;
    logoFileName?: string;
    commercialRegistration?: string;
    taxNumber?: string;
    foundedAt?: string;
  };
  contact: {
    phone: string;
    email: string;
    city: string;
    neighborhood?: string;
    street?: string;
    website?: string;
  };
  bankAccounts: OfficeBankAccount[];
  investmentDefaults: {
    recyclingThreshold: number;
  };
  profitDistribution: {
    policy: ProfitDistributionPolicy;
    // Stored only — not consumed by any logic in Sprint 8.
  };
  notifications: {
    channels: NotificationChannel[];
    quietHoursStart?: string; // HH:MM
    quietHoursEnd?: string;
    alertTypes: NotificationAlertType[];
  };
}

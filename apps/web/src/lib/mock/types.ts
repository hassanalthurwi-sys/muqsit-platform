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

export type InvestorActivityType =
  | "receipt"
  | "payment"
  | "profitDistribution"
  | "contract"
  | "recycledContract";

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
  // Historical scale of the relationship with the office. Informational
  // only — not a primary operational metric.
  totalCapital: number;
  // Operational headline metrics. Mock-authored for Sprint 9; the exact
  // derivation will be unified with receipts / payments / profit
  // distribution policy in a later sprint.
  currentBalance: number;
  realizedProfit: number;
  activeContractCount: number;
  bankAccount: BankAccount;
  profitTerms: string;
  // Sprint 11 — optional override of the office-wide profit policy.
  // When absent or set to "useOfficeDefault", the investor uses
  // OfficeSettings.profitDistribution.policy.
  profitPolicyOverride?: "useOfficeDefault" | ProfitDistributionPolicy;
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
  // Sprint 11 — agreed expected profit amounts for THIS contract. For
  // external investors, both can be > 0. For internal investors,
  // officeExpectedProfit is always 0 and investorExpectedProfit captures
  // the full profit (since the office IS the investor).
  officeExpectedProfit: number;
  investorExpectedProfit: number;
  sourceContractId?: string;
  recyclingCycle?: number;
  recycledFromCollected?: number;
  recyclingOfficeMargin?: number;
  // Sprint 10 — set when a contract is created out of the investor's
  // wallet balance (the "create a new contract from current balance"
  // alert). Surfaced in the activity timeline as a recycled contract.
  fromInvestorBalance?: boolean;
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
  // Sprint 11 — running counters for profit distribution.
  // Updated automatically on every installment collection. Capped at
  // the office/investor expected totals computed for this contract.
  officeRecoveredSoFar: number;
  investorRecoveredSoFar: number;
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

// Sprint 10 — a single voucher classifier. Every receipt and payment is
// generic; the only thing that distinguishes them is the *party* the
// office transacted with.
export type PartyType = "investor" | "customer" | "other";

// ─── Voucher model — forward-looking extension points ─────────────────
//
// Sprint 10 deliberately keeps the voucher model spare. The fields below
// are designed so the following future capabilities don't require a
// schema rewrite — none of them are implemented yet:
//
//   1. Printable receiver / sender on the voucher.
//      Today: the office side is implicit. Tomorrow: derive from
//      `officeSettings` at print time. If a per-voucher override is
//      needed later, add optional `receiverName` / `senderName`.
//
//   2. Richer status workflow (e.g. Draft → Approved → Cancelled).
//      Today: `VoucherStatus` is a string union — extend or rename in
//      place. `PaymentVoucher.needsApproval` + `approvalId` already
//      seed the workflow.
//
//   3. Optional contract reference on manually-created vouchers.
//      Today: both voucher types already carry optional `contractId`
//      (installment) and `investmentContractId`. The UI hides the link
//      for some flows; the schema does not enforce that.
//
//   4. Printable voucher template.
//      All printable fields (number, date, party, amount, method,
//      reference, description, signatures-by-id) are already on the
//      voucher and joinable to office / investor / customer for the
//      rest. Only the print template and an Arabic-amount-in-words
//      utility are missing — additive, no schema impact.
// ──────────────────────────────────────────────────────────────────────

export interface ReceiptVoucher {
  id: string;
  number: string;
  date: string;
  amount: number;
  method: PaymentMethod;
  partyType: PartyType;
  fromName: string;
  customerId?: string;
  investorId?: string;
  contractId?: string;
  installmentId?: string;       // Sprint 11 — for auto-receipts on
  installmentIndex?: number;    //   customer installment collections.
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

export interface PaymentVoucher {
  id: string;
  number: string;
  date: string;
  partyType: PartyType;
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

// Sprint 11 — Event log for every split that happens when a customer
// installment is collected. The policy applied is snapshotted on the
// event; changing the office/investor policy later does not retroactively
// affect historical events. The source-of-truth for the per-investor
// activity timeline.
export type ProfitPolicySource = "officeDefault" | "investorOverride";

export interface ProfitDistribution {
  id: string;
  date: string;             // ISO date
  investorId: string;
  investmentContractId: string;
  installmentContractId: string;
  installmentId: string;
  installmentIndex: number;
  amountCollected: number;  // the customer's installment payment
  officeShare: number;
  investorShare: number;
  // The investor share split for the realized-profit metric:
  investorProfitPortion: number;  // counted in realizedProfit
  investorCapitalPortion: number; // counted in currentBalance only
  policyApplied: ProfitDistributionPolicy;
  policySource: ProfitPolicySource;
  createdAt: string;
}

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

// ─── Sprint 12 — Migration Journey ────────────────────────────────────

export type MigrationStepKey =
  | "investors"
  | "investmentContracts"
  | "customers"
  | "installmentContracts"
  | "receipts"
  | "payments"
  | "review";

export type MigrationInputMethod = "excel" | "pdf" | "screenshots" | "scan" | "manual";

export type MigrationStepStatus =
  | "notStarted"
  | "selectingMethod"
  | "analyzing"
  | "needsReview"
  | "completed"
  | "skipped";

export type MigrationFieldStatus = "confirmed" | "needsReview" | "missing";

// One imported row — a row in the review table.
export interface MigrationRow {
  id: string;
  cells: Record<string, { value: string; status: MigrationFieldStatus }>;
}

// One pairing question — "are these the same?"
export interface MigrationMatchPrompt {
  id: string;
  importedLabel: string;   // e.g. "محمد السبيعي"
  existingLabel: string;   // e.g. "محمد بن عبدالله السبيعي"
  context: string;         // e.g. "من عقد استثمار 100,000 ر.س"
  resolution?: "same" | "different";  // user's answer
}

export interface MigrationStepState {
  status: MigrationStepStatus;
  method?: MigrationInputMethod;
  rows: MigrationRow[];
  matches: MigrationMatchPrompt[];
}

// ─── Sprint 13 — Authentication & entry ─────────────────────────────

// User roles — designed for forward compatibility with the multi-office
// "Phase 2" group model. systemAdmin and systemEmployee will be wired
// in Sprint 14. groupManager is reserved for Phase 2 and never assigned
// in Sprint 13.
export type UserRole =
  | "systemAdmin"
  | "systemEmployee"
  | "groupManager"
  | "officeManager"
  | "officeEmployee"
  | "investor"
  | "customer";

export type SubscriptionStatus = "trial" | "active" | "expired" | "suspended";

export interface OfficeAccount {
  id: string;
  name: string;
  cr: string;
  managerPhone: string;
  managerEmail?: string;
  createdAt: string;
  // Trial / subscription. Sprint 13 wires the trial; Sprint 14 will let
  // the system admin configure defaultTrialDays + extend/suspend.
  trialStartedAt?: string;
  trialEndsAt?: string;
  subscriptionStatus: SubscriptionStatus;
  // Phase 2 — group membership. Always undefined in Sprint 13 / Phase 1.
  groupId?: string;
}

// Group of offices owned by a single group manager. Reserved for Phase 2.
// Defined now so the data model is forward-compatible without later
// migration.
export interface OfficeGroup {
  id: string;
  name: string;
  ownerUserId: string;
  officeIds: string[];
  createdAt: string;
}

export interface AppUser {
  id: string;
  name: string;
  phone: string;
  email?: string;
  role: UserRole;
  // Many-to-many shape from day one. In Phase 1 length is always 1.
  officeIds: string[];
  defaultOfficeId?: string;     // present for office users only
  investorId?: string;          // present for investor users only
  customerId?: string;          // present for customer users only
  createdAt: string;
  lastLoginAt?: string;
}

export interface DeviceSession {
  id: string;
  userId: string;
  deviceLabel: string;
  lastActiveAt: string;
  current: boolean;
}

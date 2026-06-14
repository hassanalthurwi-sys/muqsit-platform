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

export type EmployeeInviteStatus = "pending" | "accepted" | "expired";

export interface Employee {
  id: string;
  name: string;
  email: string;
  // Sprint 15 — added phone + national ID so we can invite via SMS
  // and surface KYC-ready info on the employee detail page.
  phone?: string;
  nationalId?: string;
  // Sprint 15 rev — title (free-text) is decoupled from permissions.
  // The office manager gives each employee a custom job title, then
  // assigns permissions independently.
  title: string;
  // Sprint 15 rev — per-employee permission matrix. Roles still exist
  // as optional templates (templateRoleId references the role used as
  // the starting point when the employee was created, informational
  // only). The effective permissions are these — no implicit fallback
  // to the role.
  permissions: Record<PermissionAction, PermissionState>;
  templateRoleId?: string;
  // Legacy fields kept for backward-compatibility with Sprint 4
  // audit / approvals / permissions pages that still read roleName.
  roleId: string;
  roleName: string;
  bypassApprovals: boolean;
  active: boolean;
  joinedAt: string;
  // Sprint 15 — invite lifecycle. When inviteStatus is "pending" the
  // employee hasn't accepted the invitation yet (no login yet).
  inviteStatus?: EmployeeInviteStatus;
  invitedAt?: string;
  lastLoginAt?: string;
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
  // Manager identification — captured at registration so the office
  // owner is known to the system from day one. Useful later for KYC,
  // legal documents, contracts, and contacting the right person.
  managerName: string;
  managerNationalId: string;
  managerPhone: string;
  managerEmail?: string;
  createdAt: string;
  // Trial / subscription. Sprint 13 wires the trial; Sprint 14 will let
  // the system admin configure defaultTrialDays + extend/suspend.
  trialStartedAt?: string;
  trialEndsAt?: string;
  subscriptionStatus: SubscriptionStatus;
  // Sprint 16 — active paid plan + selected duration. Populated when the
  // office picks a paid plan after the trial. Renewal date is computed
  // from `planStartedAt` + `planDuration` so we don't store it twice.
  planId?: string;
  planDuration?: SubscriptionDuration;
  planStartedAt?: string;
  planEndsAt?: string;
  // Phase 2 — group membership. Always undefined in Sprint 13 / Phase 1.
  groupId?: string;
}

// ─── Sprint 16 — Subscription plans ─────────────────────────────────

// The four premium features that distinguish Pro from Basic. Each plan
// turns these on or off. Two tiers ship in the seed — Basic (all off)
// and Pro (all on) — but the platform admin can edit either freely.
export type SubscriptionFeature =
  | "aiAssistant"
  | "ocr"
  | "whatsappMessages"
  | "smsMessages";

// Three durations are offered per plan: 6 months, 1 year, 2 years. Each
// has its own price configured by the platform admin (longer typically
// = better unit price).
export type SubscriptionDuration = 6 | 12 | 24;

// Sprint 17 — Saudi payment methods supported at checkout.
export type SubscriptionPaymentMethod =
  | "mada"
  | "visa"
  | "mastercard"
  | "applePay"
  | "stcPay"
  | "bankTransfer";

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  features: Record<SubscriptionFeature, boolean>;
  // Price in SAR per duration. All three durations are always priced;
  // there's no "this duration isn't offered" toggle — keeps the offer
  // shape consistent across plans.
  prices: Record<SubscriptionDuration, number>;
  active: boolean;
  displayOrder: number;
  createdAt: string;
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
  nationalId?: string;          // captured at registration / invitation
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

// ─── Sprint 14 — System admin level ─────────────────────────────────

export interface SystemSettings {
  // Default trial period (days) granted when a new office self-registers.
  // The system admin can change this at /admin/settings.
  defaultTrialDays: number;
  // Auto-suspend offices that fail to upgrade N days after trial expires.
  // 0 = never auto-suspend.
  autoSuspendDays: number;
  // Free message: shown on every office's dashboard banner.
  globalAnnouncement?: string;
  // Allow self-registration vs invite-only.
  allowSelfRegistration: boolean;
}

export interface AdminAuditEntry {
  id: string;
  ts: string;
  actorName: string;
  actorRole: "systemAdmin" | "systemEmployee";
  action:
    | "officeRegistered"
    | "trialExtended"
    | "officeSuspended"
    | "officeActivated"
    | "employeeAdded"
    | "settingChanged";
  targetOfficeId?: string;
  targetOfficeName?: string;
  notes?: string;
}

// Sprint 15 — Platform employees can have a free-text job title
// (decoupled from auth role) and a per-employee permissions matrix.
// 15 actions grouped into 5 categories, each tri-state.
export type SystemPermissionAction =
  | "viewOffices"
  | "registerOffice"
  | "extendTrial"
  | "suspendOffice"
  | "reactivateOffice"
  | "deleteOffice"
  | "changeSubscriptionPlan"
  | "issueInvoice"
  | "recordSubscriptionPayment"
  | "viewPlatformEmployees"
  | "managePlatformEmployees"
  | "manageSystemSettings"
  | "sendGlobalAnnouncement"
  | "viewAudit"
  | "exportPlatformReports";

export type SystemPermissionGroup =
  | "offices"
  | "subscriptions"
  | "team"
  | "settings"
  | "auditReports";

// A reusable starting matrix. Like office Roles — these are templates,
// not identities. The actual permissions live on the employee record.
export interface SystemRole {
  id: string;
  name: string;
  description: string;
  permissions: Record<SystemPermissionAction, PermissionState>;
}

export interface SystemEmployee {
  id: string;
  name: string;
  nationalId?: string;
  phone: string;
  email?: string;
  // Sprint 15 — free-text title shown in lists and on the detail
  // page. Independent of the auth role below.
  title: string;
  // Auth-level role. Kept for routing / shell access only:
  // `systemAdmin` is the platform owner (can do anything regardless of
  // the matrix); `systemEmployee` is everyone else (gated by the matrix).
  role: "systemAdmin" | "systemEmployee";
  // Sprint 15 — per-employee permission matrix. Templates only
  // pre-fill it on invite; after save the matrix is the source of
  // truth and never re-derives from the template.
  permissions: Record<SystemPermissionAction, PermissionState>;
  templateRoleId?: string;
  active: boolean;
  createdAt: string;
  lastLoginAt?: string;
}

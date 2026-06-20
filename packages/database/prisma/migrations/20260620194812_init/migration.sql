-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('systemAdmin', 'systemEmployee', 'groupManager', 'officeManager', 'officeEmployee', 'investor', 'customer');

-- CreateEnum
CREATE TYPE "SubscriptionStatus" AS ENUM ('trial', 'active', 'expired', 'suspended');

-- CreateEnum
CREATE TYPE "SubscriptionDuration" AS ENUM ('M6', 'M12', 'M24');

-- CreateEnum
CREATE TYPE "InvestorType" AS ENUM ('internal', 'external');

-- CreateEnum
CREATE TYPE "InvestorStatus" AS ENUM ('active', 'inactive', 'suspended');

-- CreateEnum
CREATE TYPE "ProfitPolicy" AS ENUM ('officeFirst', 'investorFirst', 'proportional');

-- CreateEnum
CREATE TYPE "ContractStatus" AS ENUM ('active', 'ended', 'pendingSetup', 'cancelled');

-- CreateEnum
CREATE TYPE "CustomerRiskClass" AS ENUM ('low', 'medium', 'high');

-- CreateEnum
CREATE TYPE "InstallmentContractStatus" AS ENUM ('active', 'completed', 'defaulted', 'cancelled');

-- CreateEnum
CREATE TYPE "InstallmentStatus" AS ENUM ('scheduled', 'partiallyPaid', 'paid', 'overdue', 'defaulted');

-- CreateEnum
CREATE TYPE "PaymentSource" AS ENUM ('whatsapp_upload', 'bank_transfer', 'cash');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('cash', 'bankTransfer', 'stcPay', 'cheque', 'card');

-- CreateEnum
CREATE TYPE "VoucherStatus" AS ENUM ('draft', 'verified', 'cancelled');

-- CreateEnum
CREATE TYPE "PartyType" AS ENUM ('investor', 'customer', 'other');

-- CreateEnum
CREATE TYPE "ProfitPolicySource" AS ENUM ('officeDefault', 'investorOverride');

-- CreateEnum
CREATE TYPE "ApprovalStatus" AS ENUM ('pending', 'approved', 'rejected', 'needsClarification', 'escalated');

-- CreateEnum
CREATE TYPE "ApprovalPriority" AS ENUM ('critical', 'normal', 'low');

-- CreateEnum
CREATE TYPE "EmployeeInviteStatus" AS ENUM ('pending', 'accepted', 'expired');

-- CreateTable
CREATE TABLE "AppUser" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "nationalId" TEXT,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "role" "UserRole" NOT NULL,
    "defaultOfficeId" TEXT,
    "investorId" TEXT,
    "customerId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastLoginAt" TIMESTAMP(3),

    CONSTRAINT "AppUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DeviceSession" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "deviceLabel" TEXT NOT NULL,
    "lastActiveAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "current" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "DeviceSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OfficeAccount" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "cr" TEXT NOT NULL,
    "managerName" TEXT NOT NULL,
    "managerNationalId" TEXT NOT NULL,
    "managerPhone" TEXT NOT NULL,
    "managerEmail" TEXT,
    "managerUserId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "trialStartedAt" TIMESTAMP(3),
    "trialEndsAt" TIMESTAMP(3),
    "subscriptionStatus" "SubscriptionStatus" NOT NULL DEFAULT 'trial',
    "planId" TEXT,
    "planDuration" "SubscriptionDuration",
    "planStartedAt" TIMESTAMP(3),
    "planEndsAt" TIMESTAMP(3),
    "groupId" TEXT,

    CONSTRAINT "OfficeAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OfficeGroup" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "ownerUserId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OfficeGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubscriptionPlan" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "features" JSONB NOT NULL,
    "prices" JSONB NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SubscriptionPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubscriptionTransaction" (
    "id" TEXT NOT NULL,
    "officeId" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "planSnapshot" JSONB NOT NULL,
    "duration" "SubscriptionDuration" NOT NULL,
    "price" DECIMAL(18,2) NOT NULL,
    "paymentMethod" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "gatewayReference" TEXT,
    "startedAt" TIMESTAMP(3),
    "endsAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SubscriptionTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Investor" (
    "id" TEXT NOT NULL,
    "officeId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "InvestorType" NOT NULL,
    "identityKind" TEXT NOT NULL,
    "nationalId" TEXT,
    "gccId" TEXT,
    "gccCountry" TEXT,
    "passport" TEXT,
    "nationality" TEXT,
    "cr" TEXT,
    "entityName" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "InvestorStatus" NOT NULL DEFAULT 'active',
    "totalCapital" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "currentBalance" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "realizedProfit" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "activeContractCount" INTEGER NOT NULL DEFAULT 0,
    "bankName" TEXT NOT NULL,
    "iban" TEXT NOT NULL,
    "accountHolder" TEXT,
    "profitTerms" TEXT NOT NULL DEFAULT '',
    "profitPolicyOverride" "ProfitPolicy",

    CONSTRAINT "Investor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InvestmentContract" (
    "id" TEXT NOT NULL,
    "officeId" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "investorId" TEXT NOT NULL,
    "amount" DECIMAL(18,2) NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "durationMonths" INTEGER NOT NULL,
    "operationPct" DECIMAL(7,4) NOT NULL DEFAULT 0,
    "utilized" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "remaining" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "status" "ContractStatus" NOT NULL DEFAULT 'active',
    "profitNotes" TEXT NOT NULL DEFAULT '',
    "capitalRecyclingEnabled" BOOLEAN NOT NULL DEFAULT false,
    "capitalRecyclingMinThreshold" DECIMAL(18,2),
    "documentName" TEXT,
    "officeExpectedProfit" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "investorExpectedProfit" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "sourceContractId" TEXT,
    "recyclingCycle" INTEGER,
    "recycledFromCollected" DECIMAL(18,2),
    "recyclingOfficeMargin" DECIMAL(18,2),
    "fromInvestorBalance" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "InvestmentContract_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Customer" (
    "id" TEXT NOT NULL,
    "officeId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "identityKind" TEXT NOT NULL,
    "nationalId" TEXT,
    "gccId" TEXT,
    "gccCountry" TEXT,
    "passport" TEXT,
    "nationality" TEXT NOT NULL,
    "mobile" TEXT NOT NULL,
    "dateOfBirth" TEXT NOT NULL,
    "employer" TEXT NOT NULL,
    "monthlySalary" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "obligations" DECIMAL(18,2),
    "city" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "riskClass" "CustomerRiskClass" NOT NULL DEFAULT 'medium',
    "notes" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InstallmentContract" (
    "id" TEXT NOT NULL,
    "officeId" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "productType" TEXT NOT NULL,
    "cashPrice" DECIMAL(18,2) NOT NULL,
    "installmentPrice" DECIMAL(18,2) NOT NULL,
    "downPayment" DECIMAL(18,2) NOT NULL,
    "installmentsCount" INTEGER NOT NULL,
    "financingAmount" DECIMAL(18,2) NOT NULL,
    "monthlyInstallment" DECIMAL(18,2) NOT NULL,
    "profitMargin" DECIMAL(18,2) NOT NULL,
    "profitMarginPct" DECIMAL(7,4) NOT NULL,
    "remainingBalance" DECIMAL(18,2) NOT NULL,
    "investmentContractId" TEXT NOT NULL,
    "capitalUtilized" DECIMAL(18,2) NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "status" "InstallmentContractStatus" NOT NULL DEFAULT 'active',
    "officeRecoveredSoFar" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "investorRecoveredSoFar" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "notes" TEXT,
    "documentName" TEXT,

    CONSTRAINT "InstallmentContract_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Installment" (
    "id" TEXT NOT NULL,
    "contractId" TEXT NOT NULL,
    "index" INTEGER NOT NULL,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "amount" DECIMAL(18,2) NOT NULL,
    "paidAmount" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "status" "InstallmentStatus" NOT NULL DEFAULT 'scheduled',

    CONSTRAINT "Installment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaymentRecord" (
    "id" TEXT NOT NULL,
    "installmentId" TEXT NOT NULL,
    "ts" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "amount" DECIMAL(18,2) NOT NULL,
    "source" "PaymentSource" NOT NULL,
    "proofId" TEXT,
    "approved" BOOLEAN NOT NULL DEFAULT false,
    "verifiedBy" TEXT,
    "verifiedAt" TIMESTAMP(3),
    "notes" TEXT,

    CONSTRAINT "PaymentRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReceiptVoucher" (
    "id" TEXT NOT NULL,
    "officeId" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "amount" DECIMAL(18,2) NOT NULL,
    "method" "PaymentMethod" NOT NULL,
    "partyType" "PartyType" NOT NULL,
    "fromName" TEXT NOT NULL,
    "customerId" TEXT,
    "investorId" TEXT,
    "contractId" TEXT,
    "installmentId" TEXT,
    "installmentIndex" INTEGER,
    "investmentContractId" TEXT,
    "reference" TEXT,
    "notes" TEXT,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "VoucherStatus" NOT NULL DEFAULT 'draft',
    "verifiedById" TEXT,
    "verifiedAt" TIMESTAMP(3),
    "attachmentCount" INTEGER NOT NULL DEFAULT 0,
    "flags" TEXT[] DEFAULT ARRAY[]::TEXT[],

    CONSTRAINT "ReceiptVoucher_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaymentVoucher" (
    "id" TEXT NOT NULL,
    "officeId" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "partyType" "PartyType" NOT NULL,
    "amount" DECIMAL(18,2) NOT NULL,
    "method" "PaymentMethod" NOT NULL,
    "beneficiaryName" TEXT NOT NULL,
    "customerId" TEXT,
    "investorId" TEXT,
    "contractId" TEXT,
    "investmentContractId" TEXT,
    "purchaseId" TEXT,
    "reference" TEXT,
    "notes" TEXT,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "VoucherStatus" NOT NULL DEFAULT 'draft',
    "needsApproval" BOOLEAN NOT NULL DEFAULT false,
    "approvalId" TEXT,
    "attachmentCount" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "PaymentVoucher_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProfitDistribution" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "investorId" TEXT NOT NULL,
    "investmentContractId" TEXT NOT NULL,
    "installmentContractId" TEXT NOT NULL,
    "installmentId" TEXT NOT NULL,
    "installmentIndex" INTEGER NOT NULL,
    "amountCollected" DECIMAL(18,2) NOT NULL,
    "officeShare" DECIMAL(18,2) NOT NULL,
    "investorShare" DECIMAL(18,2) NOT NULL,
    "investorProfitPortion" DECIMAL(18,2) NOT NULL,
    "investorCapitalPortion" DECIMAL(18,2) NOT NULL,
    "policyApplied" "ProfitPolicy" NOT NULL,
    "policySource" "ProfitPolicySource" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProfitDistribution_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ApprovalRequest" (
    "id" TEXT NOT NULL,
    "officeId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "priority" "ApprovalPriority" NOT NULL DEFAULT 'normal',
    "status" "ApprovalStatus" NOT NULL DEFAULT 'pending',
    "requestedById" TEXT NOT NULL,
    "requestedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reason" TEXT,
    "flags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "relatedEntityKind" TEXT NOT NULL,
    "relatedEntityId" TEXT NOT NULL,
    "relatedEntityLabel" TEXT NOT NULL,
    "amount" DECIMAL(18,2),
    "decidedById" TEXT,
    "decidedAt" TIMESTAMP(3),
    "decisionNote" TEXT,
    "remindersSent" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "ApprovalRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditEntry" (
    "id" TEXT NOT NULL,
    "officeId" TEXT NOT NULL,
    "ts" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actorId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "entityKind" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "entityLabel" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "before" TEXT,
    "after" TEXT,

    CONSTRAINT "AuditEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Employee" (
    "id" TEXT NOT NULL,
    "officeId" TEXT NOT NULL,
    "userId" TEXT,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "nationalId" TEXT,
    "title" TEXT NOT NULL,
    "permissions" JSONB NOT NULL,
    "templateRoleId" TEXT,
    "roleId" TEXT NOT NULL DEFAULT '',
    "roleName" TEXT NOT NULL DEFAULT '',
    "bypassApprovals" BOOLEAN NOT NULL DEFAULT false,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "inviteStatus" "EmployeeInviteStatus" NOT NULL DEFAULT 'pending',
    "invitedAt" TIMESTAMP(3),
    "lastLoginAt" TIMESTAMP(3),

    CONSTRAINT "Employee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SystemEmployee" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "nationalId" TEXT,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "title" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "permissions" JSONB NOT NULL,
    "templateRoleId" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastLoginAt" TIMESTAMP(3),

    CONSTRAINT "SystemEmployee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SystemSettings" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "defaultTrialDays" INTEGER NOT NULL DEFAULT 30,
    "autoSuspendDays" INTEGER NOT NULL DEFAULT 7,
    "globalAnnouncement" TEXT,
    "allowSelfRegistration" BOOLEAN NOT NULL DEFAULT true,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SystemSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdminAuditEntry" (
    "id" TEXT NOT NULL,
    "ts" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actorName" TEXT NOT NULL,
    "actorRole" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "targetOfficeId" TEXT,
    "targetOfficeName" TEXT,
    "notes" TEXT,

    CONSTRAINT "AdminAuditEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OfficeMigrationState" (
    "officeId" TEXT NOT NULL,
    "state" JSONB NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OfficeMigrationState_pkey" PRIMARY KEY ("officeId")
);

-- CreateTable
CREATE TABLE "OfficeSettings" (
    "officeId" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OfficeSettings_pkey" PRIMARY KEY ("officeId")
);

-- CreateTable
CREATE TABLE "_UserOffices" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_UserOffices_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "AppUser_phone_key" ON "AppUser"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "AppUser_email_key" ON "AppUser"("email");

-- CreateIndex
CREATE UNIQUE INDEX "AppUser_investorId_key" ON "AppUser"("investorId");

-- CreateIndex
CREATE UNIQUE INDEX "AppUser_customerId_key" ON "AppUser"("customerId");

-- CreateIndex
CREATE INDEX "AppUser_phone_idx" ON "AppUser"("phone");

-- CreateIndex
CREATE INDEX "AppUser_email_idx" ON "AppUser"("email");

-- CreateIndex
CREATE INDEX "DeviceSession_userId_idx" ON "DeviceSession"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "OfficeAccount_cr_key" ON "OfficeAccount"("cr");

-- CreateIndex
CREATE INDEX "OfficeAccount_subscriptionStatus_idx" ON "OfficeAccount"("subscriptionStatus");

-- CreateIndex
CREATE INDEX "SubscriptionTransaction_officeId_idx" ON "SubscriptionTransaction"("officeId");

-- CreateIndex
CREATE INDEX "SubscriptionTransaction_status_idx" ON "SubscriptionTransaction"("status");

-- CreateIndex
CREATE INDEX "Investor_officeId_type_idx" ON "Investor"("officeId", "type");

-- CreateIndex
CREATE INDEX "Investor_officeId_status_idx" ON "Investor"("officeId", "status");

-- CreateIndex
CREATE INDEX "InvestmentContract_officeId_status_idx" ON "InvestmentContract"("officeId", "status");

-- CreateIndex
CREATE INDEX "InvestmentContract_investorId_idx" ON "InvestmentContract"("investorId");

-- CreateIndex
CREATE UNIQUE INDEX "InvestmentContract_officeId_number_key" ON "InvestmentContract"("officeId", "number");

-- CreateIndex
CREATE INDEX "Customer_officeId_riskClass_idx" ON "Customer"("officeId", "riskClass");

-- CreateIndex
CREATE INDEX "Customer_mobile_idx" ON "Customer"("mobile");

-- CreateIndex
CREATE INDEX "InstallmentContract_officeId_status_idx" ON "InstallmentContract"("officeId", "status");

-- CreateIndex
CREATE INDEX "InstallmentContract_customerId_idx" ON "InstallmentContract"("customerId");

-- CreateIndex
CREATE INDEX "InstallmentContract_investmentContractId_idx" ON "InstallmentContract"("investmentContractId");

-- CreateIndex
CREATE UNIQUE INDEX "InstallmentContract_officeId_number_key" ON "InstallmentContract"("officeId", "number");

-- CreateIndex
CREATE INDEX "Installment_contractId_dueDate_idx" ON "Installment"("contractId", "dueDate");

-- CreateIndex
CREATE INDEX "Installment_status_idx" ON "Installment"("status");

-- CreateIndex
CREATE UNIQUE INDEX "Installment_contractId_index_key" ON "Installment"("contractId", "index");

-- CreateIndex
CREATE INDEX "PaymentRecord_installmentId_idx" ON "PaymentRecord"("installmentId");

-- CreateIndex
CREATE INDEX "ReceiptVoucher_officeId_partyType_idx" ON "ReceiptVoucher"("officeId", "partyType");

-- CreateIndex
CREATE UNIQUE INDEX "ReceiptVoucher_officeId_number_key" ON "ReceiptVoucher"("officeId", "number");

-- CreateIndex
CREATE INDEX "PaymentVoucher_officeId_partyType_idx" ON "PaymentVoucher"("officeId", "partyType");

-- CreateIndex
CREATE UNIQUE INDEX "PaymentVoucher_officeId_number_key" ON "PaymentVoucher"("officeId", "number");

-- CreateIndex
CREATE INDEX "ProfitDistribution_investorId_idx" ON "ProfitDistribution"("investorId");

-- CreateIndex
CREATE INDEX "ProfitDistribution_installmentContractId_idx" ON "ProfitDistribution"("installmentContractId");

-- CreateIndex
CREATE INDEX "ApprovalRequest_officeId_status_idx" ON "ApprovalRequest"("officeId", "status");

-- CreateIndex
CREATE INDEX "AuditEntry_officeId_ts_idx" ON "AuditEntry"("officeId", "ts");

-- CreateIndex
CREATE INDEX "AuditEntry_actorId_idx" ON "AuditEntry"("actorId");

-- CreateIndex
CREATE INDEX "Employee_officeId_active_idx" ON "Employee"("officeId", "active");

-- CreateIndex
CREATE INDEX "Employee_email_idx" ON "Employee"("email");

-- CreateIndex
CREATE UNIQUE INDEX "SystemEmployee_phone_key" ON "SystemEmployee"("phone");

-- CreateIndex
CREATE INDEX "AdminAuditEntry_ts_idx" ON "AdminAuditEntry"("ts");

-- CreateIndex
CREATE INDEX "_UserOffices_B_index" ON "_UserOffices"("B");

-- AddForeignKey
ALTER TABLE "DeviceSession" ADD CONSTRAINT "DeviceSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "AppUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OfficeAccount" ADD CONSTRAINT "OfficeAccount_managerUserId_fkey" FOREIGN KEY ("managerUserId") REFERENCES "AppUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OfficeAccount" ADD CONSTRAINT "OfficeAccount_planId_fkey" FOREIGN KEY ("planId") REFERENCES "SubscriptionPlan"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OfficeAccount" ADD CONSTRAINT "OfficeAccount_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "OfficeGroup"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Investor" ADD CONSTRAINT "Investor_officeId_fkey" FOREIGN KEY ("officeId") REFERENCES "OfficeAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvestmentContract" ADD CONSTRAINT "InvestmentContract_officeId_fkey" FOREIGN KEY ("officeId") REFERENCES "OfficeAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvestmentContract" ADD CONSTRAINT "InvestmentContract_investorId_fkey" FOREIGN KEY ("investorId") REFERENCES "Investor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Customer" ADD CONSTRAINT "Customer_officeId_fkey" FOREIGN KEY ("officeId") REFERENCES "OfficeAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InstallmentContract" ADD CONSTRAINT "InstallmentContract_officeId_fkey" FOREIGN KEY ("officeId") REFERENCES "OfficeAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InstallmentContract" ADD CONSTRAINT "InstallmentContract_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InstallmentContract" ADD CONSTRAINT "InstallmentContract_investmentContractId_fkey" FOREIGN KEY ("investmentContractId") REFERENCES "InvestmentContract"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Installment" ADD CONSTRAINT "Installment_contractId_fkey" FOREIGN KEY ("contractId") REFERENCES "InstallmentContract"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentRecord" ADD CONSTRAINT "PaymentRecord_installmentId_fkey" FOREIGN KEY ("installmentId") REFERENCES "Installment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReceiptVoucher" ADD CONSTRAINT "ReceiptVoucher_officeId_fkey" FOREIGN KEY ("officeId") REFERENCES "OfficeAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReceiptVoucher" ADD CONSTRAINT "ReceiptVoucher_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReceiptVoucher" ADD CONSTRAINT "ReceiptVoucher_investorId_fkey" FOREIGN KEY ("investorId") REFERENCES "Investor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentVoucher" ADD CONSTRAINT "PaymentVoucher_officeId_fkey" FOREIGN KEY ("officeId") REFERENCES "OfficeAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentVoucher" ADD CONSTRAINT "PaymentVoucher_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentVoucher" ADD CONSTRAINT "PaymentVoucher_investorId_fkey" FOREIGN KEY ("investorId") REFERENCES "Investor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfitDistribution" ADD CONSTRAINT "ProfitDistribution_investorId_fkey" FOREIGN KEY ("investorId") REFERENCES "Investor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfitDistribution" ADD CONSTRAINT "ProfitDistribution_installmentId_fkey" FOREIGN KEY ("installmentId") REFERENCES "Installment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfitDistribution" ADD CONSTRAINT "ProfitDistribution_installmentContractId_fkey" FOREIGN KEY ("installmentContractId") REFERENCES "InstallmentContract"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApprovalRequest" ADD CONSTRAINT "ApprovalRequest_officeId_fkey" FOREIGN KEY ("officeId") REFERENCES "OfficeAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditEntry" ADD CONSTRAINT "AuditEntry_officeId_fkey" FOREIGN KEY ("officeId") REFERENCES "OfficeAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_officeId_fkey" FOREIGN KEY ("officeId") REFERENCES "OfficeAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserOffices" ADD CONSTRAINT "_UserOffices_A_fkey" FOREIGN KEY ("A") REFERENCES "AppUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserOffices" ADD CONSTRAINT "_UserOffices_B_fkey" FOREIGN KEY ("B") REFERENCES "OfficeAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;

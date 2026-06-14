import type { NavGroupKey, NavKey } from "@/lib/nav";

export type Locale = "ar" | "en";

export interface PageCopy {
  title: string;
  description: string;
}

export type FollowupTab = "today" | "thisWeek" | "overdue" | "defaulted";
export type FollowupStatus = "dueToday" | "upcoming" | "overdue" | "defaulted";
export type IdentityKindKey =
  | "saudiIndividual"
  | "gccIndividual"
  | "foreignIndividual"
  | "commercialEntity";
export type InvestorStatusKey = "active" | "inactive" | "suspended";
export type ContractStatusKey = "active" | "ended" | "pendingSetup" | "cancelled";
export type InvestorTypeKey = "internal" | "external";
export type InstallmentContractStatusKey = "active" | "completed" | "defaulted" | "cancelled";
export type InstallmentStatusKey =
  | "scheduled"
  | "partiallyPaid"
  | "paid"
  | "overdue"
  | "defaulted";
export type RiskClassKey = "low" | "medium" | "high";
export type PaymentSourceKey = "whatsapp_upload" | "bank_transfer" | "cash";
export type ProofStatusKey = "pending" | "approved" | "rejected" | "needsClarification";
export type PermissionActionKey =
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
export type PermissionStateKey = "allow" | "requireApproval" | "deny";
export type ApprovalStatusKey =
  | "pending"
  | "approved"
  | "rejected"
  | "needsClarification"
  | "escalated";
export type ApprovalPriorityKey = "critical" | "normal" | "low";
export type NotificationTypeKey =
  | "overdueCustomer"
  | "newPaymentProof"
  | "duplicateTransferReference"
  | "pendingApproval"
  | "investorLowCapital"
  | "contractExpiring"
  | "ocrLowConfidence"
  | "rescheduleRequest";
export type NotificationPriorityKey = "critical" | "warning" | "info";
export type PaymentMethodKey = "cash" | "bankTransfer" | "stcPay" | "cheque" | "card";
export type VoucherStatusKey = "draft" | "verified" | "cancelled";
export type PartyTypeKey = "investor" | "customer" | "other";
export type PurchaseStatusKey = "purchased" | "linkedToContract" | "sold";

export interface Dictionary {
  appName: string;
  nav: Record<NavKey, string>;
  navGroups: Record<NavGroupKey, string>;
  pages: Record<NavKey, PageCopy>;
  auth: {
    loginTitle: string;
    loginSubtitle: string;
    email: string;
    password: string;
    signIn: string;
    selectTenantTitle: string;
    selectTenantSubtitle: string;
    continue: string;
  };
  common: {
    theme: string;
    language: string;
    logout: string;
    account: string;
    comingSoon: string;
    comingSoonHint: string;
    openMenu: string;
    closeMenu: string;
    currency: string;
    viewAll: string;
    review: string;
    open: string;
    distribute: string;
    today: string;
    daysAgo: string;
    daysLeft: string;
    cancel: string;
    next: string;
    back: string;
    save: string;
    saving: string;
    none: string;
    yes: string;
    no: string;
    optional: string;
    notes: string;
  };
  investorType: Record<InvestorTypeKey, string>;
  investorStatus: Record<InvestorStatusKey, string>;
  contractStatus: Record<ContractStatusKey, string>;
  installmentContractStatus: Record<InstallmentContractStatusKey, string>;
  installmentStatus: Record<InstallmentStatusKey, string>;
  riskClass: Record<RiskClassKey, string>;
  paymentSource: Record<PaymentSourceKey, string>;
  proofStatus: Record<ProofStatusKey, string>;
  identityKind: Record<IdentityKindKey, string>;
  identityFieldLabel: {
    nationalId: string;
    gccId: string;
    passport: string;
    cr: string;
    country: string;
    nationality: string;
    entityName: string;
  };
  bank: { sectionTitle: string; bankName: string; iban: string; accountHolder: string };
  dashboard: {
    title: string;
    subtitle: string;
    kpi: {
      collections: { label: string; expected: string; percent: string };
      overdue: { label: string; installments: string; customers: string };
      activeContracts: { label: string; totalValue: string; unpaidBalance: string };
      pendingContracts: { label: string; totalValue: string; awaitingSignature: string };
    };
    alerts: {
      title: string;
      subtitle: string;
      delay30: string;
      delay60: string;
      pendingContracts: string;
      recyclableInvestors: string;
      paymentDocs: string;
    };
    profit: {
      title: string;
      subtitle: string;
      selfOwned: string;
      managementFee: string;
      goodsMargin: string;
    };
    utilization: {
      title: string;
      subtitle: string;
      internal: string;
      external: string;
      utilized: string;
      unutilized: string;
    };
    cashMovement: {
      title: string;
      net: string;
      inflow: string;
      outflow: string;
      purchases: string;
      investorDisbursements: string;
    };
    followup: {
      title: string;
      subtitle: string;
      tabs: Record<FollowupTab, string>;
      status: Record<FollowupStatus, string>;
      empty: string;
      columns: { customer: string; amount: string; due: string; status: string };
    };
  };
  investors: {
    pageTitle: string;
    pageSubtitle: string;
    newInvestor: string;
    filters: { all: string; internal: string; external: string };
    searchPlaceholder: string;
    columns: {
      investor: string;
      type: string;
      identity: string;
      totalCapital: string;
      currentBalance: string;
      investedCapital: string;
      realizedProfit: string;
      activeContracts: string;
      status: string;
    };
    metric: {
      currentBalance: string;
      investedCapital: string;
      realizedProfit: string;
      activeContracts: string;
    };
    recycling: {
      eligible: string;
      cta: string;
    };
    profile: {
      contactSection: string;
      detailsSection: string;
      contractsSection: string;
      termsSection: string;
      activitySection: string;
      totalCapitalLabel: string;
      joinedAt: string;
      noContracts: string;
      noActivity: string;
      viewContract: string;
      newContract: string;
      showMore: string;
    };
    activityType: {
      receipt: string;
      payment: string;
      profitDistribution: string;
      contract: string;
      recycledContract: string;
    };
    wallet: {
      title: string;
      lastActivity: string;
      newReceipt: string;
      newPayment: string;
      viewMovements: string;
    };
  };
  investments: {
    pageTitle: string;
    pageSubtitle: string;
    newContract: string;
    filters: { all: string; active: string; pendingSetup: string; ended: string };
    columns: {
      number: string;
      investor: string;
      amount: string;
      start: string;
      end: string;
      ops: string;
      utilized: string;
      remaining: string;
      status: string;
    };
    details: {
      contractInfo: string;
      investor: string;
      capitalUsage: string;
      profitNotes: string;
      recycling: {
        title: string;
        note: string;
        status: string;
        thresholdLabel: string;
        noThreshold: string;
        enabled: string;
        disabled: string;
      };
      linkedInstallments: string;
      linkedInstallmentsEmpty: string;
      timeline: string;
      amount: string;
      start: string;
      end: string;
      duration: string;
      months: string;
      operationPct: string;
      document: string;
      noDocument: string;
      viewInvestor: string;
      utilized: string;
      remaining: string;
      back: string;
    };
    create: {
      pageTitle: string;
      steps: { investor: string; terms: string; notes: string; review: string };
      step1: {
        title: string;
        selectInvestor: string;
        searchPlaceholder: string;
        noneSelected: string;
        capitalSummary: string;
      };
      step2: {
        title: string;
        amount: string;
        startDate: string;
        duration: string;
        durationMonths: string;
        endDate: string;
        endDateAuto: string;
        operationPct: string;
        operationPctInternalNote: string;
        profitTitle: string;
        profitHintExternal: string;
        profitHintInternal: string;
        officeProfit: string;
        investorProfit: string;
        investorProfitInternal: string;
        totalProfit: string;
        officeShare: string;
        investorShare: string;
      };
      step3: {
        title: string;
        profitNotes: string;
        profitNotesPlaceholder: string;
        recyclingToggle: string;
        recyclingNote: string;
        recyclingThreshold: string;
        recyclingThresholdHint: string;
        attachment: string;
        attachmentHint: string;
        chooseFile: string;
        noFile: string;
      };
      step4: {
        title: string;
        subtitle: string;
        investorBlock: string;
        contractBlock: string;
        notesBlock: string;
      };
      saved: string;
    };
  };
  // ─── Sprint 3 ───
  customers: {
    pageTitle: string;
    pageSubtitle: string;
    newCustomer: string;
    filters: { all: string; active: string; late: string; defaulted: string };
    columns: {
      customer: string;
      identity: string;
      mobile: string;
      city: string;
      employer: string;
      salary: string;
      contracts: string;
      risk: string;
    };
    profile: {
      bornOn: string;
      customerSince: string;
      contactSection: string;
      employmentSection: string;
      addressSection: string;
      employer: string;
      salary: string;
      obligations: string;
      noObligations: string;
      contractsSection: string;
      notesSection: string;
      whatsapp: string;
      newContract: string;
      noContracts: string;
    };
    create: {
      pageTitle: string;
      identitySection: string;
      identityKindLabel: string;
      identityNumber: string;
      fullName: string;
      dob: string;
      nationality: string;
      contactSection: string;
      mobile: string;
      city: string;
      address: string;
      employmentSection: string;
      employer: string;
      salary: string;
      obligations: string;
      classificationSection: string;
      risk: string;
      notes: string;
      saved: string;
    };
  };
  installmentContracts: {
    pageTitle: string;
    pageSubtitle: string;
    newContract: string;
    filters: { all: string; active: string; overdue: string; defaulted: string; completed: string };
    columns: {
      number: string;
      customer: string;
      product: string;
      installmentPrice: string;
      monthlyInstallment: string;
      installmentsCount: string;
      remainingBalance: string;
      status: string;
    };
    details: {
      back: string;
      product: string;
      customer: string;
      fundedBy: string;
      pricingSection: string;
      cashPrice: string;
      installmentPrice: string;
      downPayment: string;
      financingAmount: string;
      monthlyInstallment: string;
      profitMargin: string;
      profitMarginPct: string;
      remainingBalance: string;
      fundingSection: string;
      fromInvestment: string;
      investor: string;
      capitalUtilized: string;
      scheduleSection: string;
      scheduleMonthsHint: string;
      timeline: string;
      duration: string;
      startDate: string;
      endDate: string;
      months: string;
    };
    schedule: {
      number: string;
      dueDate: string;
      amount: string;
      paid: string;
      remaining: string;
      status: string;
      pay: string;
    };
    create: {
      pageTitle: string;
      steps: { customer: string; product: string; funding: string; review: string };
      step1: {
        title: string;
        selectCustomer: string;
        searchPlaceholder: string;
        noneSelected: string;
        riskNote: string;
      };
      step2: {
        title: string;
        productType: string;
        productTypeHint: string;
        cashPrice: string;
        installmentPrice: string;
        downPayment: string;
        installmentsCount: string;
        previewTitle: string;
        previewHint: string;
      };
      step3: {
        title: string;
        selectInvestor: string;
        selectContract: string;
        chosenSummary: string;
        amountToUtilize: string;
        remainingAfter: string;
        sufficient: string;
        notSufficient: string;
      };
      step4: {
        title: string;
        subtitle: string;
        customerBlock: string;
        productBlock: string;
        fundingBlock: string;
      };
      saved: string;
    };
    partialPayment: {
      title: string;
      subtitle: string;
      due: string;
      paidBefore: string;
      remaining: string;
      paymentAmount: string;
      source: string;
      attachReceipt: string;
      noFile: string;
      note: string;
      submit: string;
    };
  };
  collections: {
    pageTitle: string;
    pageSubtitle: string;
    inboxCount: string;
    empty: string;
    columns: {
      customer: string;
      contract: string;
      amount: string;
      reference: string;
      uploadedAt: string;
      flag: string;
    };
    flags: {
      duplicate: string;
      amountMismatch: string;
      clean: string;
    };
    review: {
      back: string;
      headerTitle: string;
      forInstallment: string;
      receiptImageSection: string;
      ocrSection: string;
      ocrSubtitle: string;
      ocrConfidence: string;
      duplicateBannerTitle: string;
      duplicateBannerHint: string;
      duplicateView: string;
      comparisonSection: string;
      expectedAmount: string;
      customer: string;
      dueDate: string;
      transferDate: string;
      paidEarly: string;
      paidOnTime: string;
      paidLate: string;
      mismatch: string;
      employeeNotes: string;
      employeeNotesPlaceholder: string;
      approve: string;
      reject: string;
      requestClarification: string;
      ocrFields: {
        transferAmount: string;
        senderName: string;
        transferDate: string;
        transferReference: string;
        bankName: string;
      };
      decisionRecorded: string;
    };
    whatsapp: {
      title: string;
      subtitle: string;
      systemSender: string;
      customerSender: string;
    };
  };
  // ─── Sprint 4 ───
  permissionAction: Record<PermissionActionKey, string>;
  permissionGroup: Record<"contracts" | "payments" | "customers" | "investors" | "system", string>;
  permissionState: Record<PermissionStateKey, string>;
  approvalStatus: Record<ApprovalStatusKey, string>;
  approvalPriority: Record<ApprovalPriorityKey, string>;
  notificationType: Record<NotificationTypeKey, string>;
  notificationPriority: Record<NotificationPriorityKey, string>;
  operations: {
    pageTitle: string;
    pageSubtitle: string;
    cards: {
      overdue: { title: string; primary: string; secondary: string; cta: string };
      proofs: { title: string; primary: string; secondary: string; cta: string };
      approvals: { title: string; primary: string; secondary: string; cta: string };
      recycle: { title: string; primary: string; secondary: string; cta: string; empty: string };
    };
    expiring: { title: string; hint: string; cta: string; empty: string };
    emptyDay: string;
  };
  recycling: {
    badgeLabel: string;
    listTitle: string;
    listSubtitle: string;
    thresholdRule: string;
    rowThresholdPill: string;
    rowAvailableLabel: string;
    runNow: string;
    empty: string;
    form: {
      pageTitle: string;
      contextLabel: string;
      collectedLabel: string;
      pctLabel: string;
      pctHint: string;
      pctPlaceholder: string;
      financingLabel: string;
      officeShareLabel: string;
      cancel: string;
      submit: string;
      successTitle: string;
      successHint: string;
      viewNew: string;
    };
    detail: {
      sectionTitle: string;
      collectedRow: string;
      officeShareRow: string;
      financingRow: string;
      timelineLabel: string;
    };
    investorPicker: {
      availableLabel: string;
    };
  };
  officeSettings: {
    pageTitle: string;
    pageSubtitle: string;
    savedLabel: string;
    sections: {
      identity: { title: string; hint: string };
      contact: { title: string; hint: string };
      bankAccounts: { title: string; hint: string };
      investmentDefaults: { title: string; hint: string };
      profitDistribution: { title: string; hint: string };
      notifications: { title: string; hint: string };
    };
    identity: {
      nameAr: string;
      nameEn: string;
      logoLabel: string;
      logoChoose: string;
      logoHint: string;
      commercialRegistration: string;
      taxNumber: string;
      foundedAt: string;
    };
    contact: {
      phone: string;
      email: string;
      city: string;
      neighborhood: string;
      street: string;
      website: string;
    };
    bankAccounts: {
      bankName: string;
      beneficiaryName: string;
      iban: string;
      addAccount: string;
      removeAccount: string;
      accountIndex: string;
      empty: string;
    };
    investmentDefaults: {
      recyclingThreshold: string;
      recyclingThresholdHint: string;
    };
    profitDistribution: {
      policy: string;
      policyOptions: { officeFirst: string; investorFirst: string; proportional: string };
      policyOptionHints: { officeFirst: string; investorFirst: string; proportional: string };
      futureNote: string;
    };
    notifications: {
      channels: string;
      channelLabels: { whatsapp: string; sms: string; email: string };
      quietHoursStart: string;
      quietHoursEnd: string;
      quietHoursHint: string;
      alertTypes: string;
      alertLabels: {
        overdueCustomer: string;
        newPaymentProof: string;
        pendingApproval: string;
        contractExpiring: string;
        lowOcrConfidence: string;
        investorLowCapital: string;
      };
    };
  };
  approvals: {
    pageTitle: string;
    pageSubtitle: string;
    pendingCount: string;
    filters: { all: string; pending: string; critical: string; approved: string; rejected: string };
    columns: { type: string; requester: string; entity: string; priority: string; ageHours: string; status: string };
    empty: string;
    review: {
      back: string;
      requestedBy: string;
      requestedAt: string;
      actionDetails: string;
      flags: string;
      reason: string;
      decision: string;
      decisionNote: string;
      decisionNotePlaceholder: string;
      approve: string;
      reject: string;
      requestClarification: string;
      reminderBadge: string;
      escalatedBadge: string;
    };
  };
  notifications: {
    pageTitle: string;
    pageSubtitle: string;
    unread: string;
    markAllRead: string;
    bellTitle: string;
    seeAll: string;
    filters: { all: string; unread: string; critical: string; reminders: string };
    empty: string;
  };
  permissions: {
    pageTitle: string;
    pageSubtitle: string;
    newRole: string;
    presetBadge: string;
    customBadge: string;
    employeesLabel: string;
    actionsCount: string;
    role: {
      back: string;
      rename: string;
      duplicate: string;
      delete: string;
      bypassToggle: string;
      bypassNote: string;
      saveChanges: string;
      saved: string;
    };
  };
  audit: {
    pageTitle: string;
    pageSubtitle: string;
    filters: { all: string; today: string; thisWeek: string };
    actorLabel: string;
    actionLabel: string;
    dateLabel: string;
    before: string;
    after: string;
    today: string;
    yesterday: string;
    empty: string;
  };
  portals: {
    brand: { investor: string; customer: string };
    common: {
      welcomeBack: string;
      seeAll: string;
      backToOffice: string;
      upload: string;
      pay: string;
      download: string;
      share: string;
      print: string;
      next: string;
      today: string;
      overdue: string;
      paid: string;
      scheduled: string;
      partial: string;
      pending: string;
      approved: string;
      rejected: string;
      monthly: string;
      yearly: string;
      quarterly: string;
      refNo: string;
      poweredBy: string;
      cancel: string;
      save: string;
      profile: string;
      preferences: string;
      language: string;
      theme: string;
      logout: string;
      contactSupport: string;
      memberSince: string;
      disclaimer: string;
      backToHome: string;
      empty: string;
    };
    tabs: {
      investor: {
        home: string;
        investments: string;
        profits: string;
        notifications: string;
        account: string;
      };
      customer: {
        home: string;
        installments: string;
        payments: string;
        notifications: string;
        account: string;
      };
    };
    investor: {
      dashboard: {
        greeting: string;
        capitalCardLabel: string;
        capitalCardSub: string;
        utilizedShort: string;
        unutilizedShort: string;
        thisMonthLabel: string;
        ytdLabel: string;
        activeContractsLabel: string;
        nextDistributionLabel: string;
        nextDistributionSub: string;
        ctaSimulate: string;
        ctaStatement: string;
        ctaInvestments: string;
        activityTitle: string;
        activityEmpty: string;
      };
      investments: {
        pageTitle: string;
        countLabel: string;
        cardPrincipal: string;
        cardUtilized: string;
        cardEnds: string;
        recyclingOn: string;
        recyclingOff: string;
        detail: {
          back: string;
          share: string;
          download: string;
          principal: string;
          utilized: string;
          unutilized: string;
          startDate: string;
          endDate: string;
          operationPct: string;
          recycling: string;
          recyclingMin: string;
          profitTerms: string;
          timelineTitle: string;
          documentLabel: string;
        };
      };
      profits: {
        pageTitle: string;
        ytdTotal: string;
        lastDistribution: string;
        nextDistribution: string;
        historyTitle: string;
        sourceContract: string;
        noUpcoming: string;
      };
      notifications: {
        pageTitle: string;
        filterAll: string;
        filterUnread: string;
        empty: string;
      };
      account: {
        pageTitle: string;
        memberSince: string;
        sections: {
          profile: { title: string; hint: string };
          statements: { title: string; hint: string };
          simulator: { title: string; hint: string };
          preferences: { title: string; hint: string };
          support: { title: string; hint: string };
        };
      };
      simulator: {
        pageTitle: string;
        subtitle: string;
        inputs: {
          capital: string;
          period: string;
          periodOptions: { sixM: string; oneY: string; twoY: string; threeY: string };
          risk: string;
          riskOptions: { conservative: string; balanced: string; growth: string };
          reinvest: string;
          reinvestHint: string;
        };
        outputs: {
          currentCapital: string;
          expectedValue: string;
          cumulativeReturn: string;
          chartLabel: string;
        };
        disclaimer: string;
      };
      statements: {
        pageTitle: string;
        pickPeriod: string;
        periodOptions: { monthly: string; quarterly: string; annual: string };
        downloadHint: string;
        preview: {
          docTitle: string;
          toLabel: string;
          forPeriod: string;
          investorIdLabel: string;
          dateIssued: string;
          capitalSummary: string;
          capitalRows: { principal: string; utilized: string; unutilized: string };
          distributionsTitle: string;
          colDate: string;
          colContract: string;
          colGross: string;
          colFee: string;
          colNet: string;
          totalDistributed: string;
          notes: string;
          notesBody: string;
          signature: string;
          refNo: string;
          printHint: string;
        };
      };
    };
    customer: {
      dashboard: {
        greeting: string;
        nextInstallmentLabel: string;
        nextInstallmentDueOn: string;
        remainingLabel: string;
        paidLabel: string;
        progressLabel: string;
        activeContractTitle: string;
        ctaPayNow: string;
        ctaUploadProof: string;
        ctaSchedule: string;
        paidUpStatus: string;
        overdueAlertTitle: string;
        overdueAlertBody: string;
        contractMeta: string;
      };
      installments: {
        pageTitle: string;
        contractLabel: string;
        summary: { total: string; paid: string; remaining: string };
        rowDue: string;
        rowUpload: string;
        status: { paid: string; overdue: string; scheduled: string; partial: string };
      };
      payments: {
        pageTitle: string;
        uploadCta: string;
        uploadHint: string;
        recentTitle: string;
        empty: string;
        proofStatus: { pending: string; approved: string; rejected: string };
      };
      upload: {
        pageTitle: string;
        pickInstallmentTitle: string;
        pickInstallmentHint: string;
        installmentRowDue: string;
        forInstallment: string;
        amount: string;
        method: string;
        methodOptions: { bankTransfer: string; stcPay: string; cash: string };
        reference: string;
        referenceHint: string;
        uploadButton: string;
        uploadedHint: string;
        notes: string;
        submit: string;
        successTitle: string;
        successHint: string;
        backToPayments: string;
      };
      notifications: {
        pageTitle: string;
        filterAll: string;
        filterUnread: string;
        empty: string;
      };
      account: {
        pageTitle: string;
        memberSince: string;
        sections: {
          profile: { title: string; hint: string };
          documents: { title: string; hint: string };
          preferences: { title: string; hint: string };
          support: { title: string; hint: string };
        };
      };
      documents: {
        pageTitle: string;
        contract: string;
        schedule: string;
        receipts: string;
        empty: string;
        download: string;
        contractDoc: string;
        scheduleDoc: string;
      };
    };
  };
  searchPlaceholder: string;
  // ─── Sprint 5 ───
  paymentMethod: Record<PaymentMethodKey, string>;
  voucherStatus: Record<VoucherStatusKey, string>;
  partyType: Record<PartyTypeKey, string>;
  profitPolicy: {
    officeFirst: string;
    investorFirst: string;
    proportional: string;
    useOfficeDefault: string;
    fromOfficeDefault: string;
    fromInvestorOverride: string;
    recoveryTitle: string;
    officeRecovery: string;
    investorRecovery: string;
    officeShort: string;
    investorShort: string;
    eventsHint: string;
    contractProfitTitle: string;
    officeExpected: string;
    investorExpected: string;
    investorPolicyLabel: string;
    investorPolicyHint: string;
  };
  authFlow: {
    appName: string;
    tagline: string;
    login: {
      title: string;
      hint: string;
      identifierLabel: string;
      identifierPlaceholder: string;
      passwordLabel: string;
      continueWithOtp: string;
      continueWithPassword: string;
      remember30: string;
      forgotPassword: string;
      newToMuqsit: string;
      registerCta: string;
    };
    otp: {
      title: string;
      hint: string;
      codeLabel: string;
      verifyCta: string;
      resend: string;
      resendIn: string;
      back: string;
    };
    register: {
      title: string;
      hint: string;
      step1Title: string;
      step2Title: string;
      officeNameLabel: string;
      crLabel: string;
      managerNameLabel: string;
      managerNationalIdLabel: string;
      managerPhoneLabel: string;
      managerEmailLabel: string;
      managerEmailOptional: string;
      continueCta: string;
      passwordOptional: string;
      finishCta: string;
      backToLogin: string;
    };
    welcome: {
      title: string;
      subtitle: string;
      trialActive: string;
      hasOldData: string;
      hasOldDataHint: string;
      startMigration: string;
      startFresh: string;
    };
    forgot: {
      title: string;
      hint: string;
      newPasswordLabel: string;
      confirmCta: string;
    };
    trialBanner: {
      title: string;
      hint: string;
      warningTitle: string;
      warningHint: string;
      expiredTitle: string;
      expiredHint: string;
      upgradeCta: string;
    };
    account: {
      title: string;
      subtitle: string;
      profile: string;
      changePassword: string;
      language: string;
      sessions: string;
      currentDevice: string;
      revoke: string;
      logout: string;
      logoutAll: string;
    };
  };
  officeEmployees: {
    title: string;
    subtitle: string;
    inviteCta: string;
    filters: { all: string; active: string; pending: string; suspended: string };
    searchPlaceholder: string;
    columns: {
      employee: string;
      role: string;
      phone: string;
      lastLogin: string;
      status: string;
      actions: string;
    };
    inviteStatus: { pending: string; accepted: string; expired: string };
    activeBadge: string;
    suspendedBadge: string;
    pendingHint: string;
    view: string;
    invite: {
      title: string;
      subtitle: string;
      nameLabel: string;
      nationalIdLabel: string;
      phoneLabel: string;
      emailLabel: string;
      emailOptional: string;
      titleLabel: string;
      titleHint: string;
      permissionsLabel: string;
      permissionsHint: string;
      loadFromTemplate: string;
      sendInviteCta: string;
      smsHint: string;
      cancel: string;
    };
    detail: {
      back: string;
      personalInfo: string;
      titleSection: string;
      titleLabel: string;
      permissionsSection: string;
      permissionsHint: string;
      activitySection: string;
      bypassApprovals: string;
      bypassApprovalsHint: string;
      lastLogin: string;
      neverLoggedIn: string;
      joinedAt: string;
      actions: string;
      suspendBtn: string;
      reactivateBtn: string;
      resendInvite: string;
      deleteBtn: string;
      deleteConfirm: string;
      customized: string;
      basedOnTemplate: string;
      saveChanges: string;
    };
    permissionGroups: {
      contracts: string;
      payments: string;
      customers: string;
      investors: string;
      system: string;
    };
    permissionActions: Record<
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
      | "managePermissions",
      string
    >;
    accept: {
      title: string;
      subtitle: string;
      enterOtp: string;
      setPassword: string;
      passwordOptional: string;
      finishCta: string;
      invalidLink: string;
    };
  };
  admin: {
    shellTitle: string;
    nav: {
      dashboard: string;
      offices: string;
      plans: string;
      employees: string;
      settings: string;
      audit: string;
    };
    dashboard: {
      title: string;
      subtitle: string;
      kpis: {
        totalOffices: string;
        trial: string;
        active: string;
        expired: string;
        suspended: string;
        newThisMonth: string;
      };
      recentActivity: string;
      noActivity: string;
    };
    offices: {
      title: string;
      subtitle: string;
      filters: {
        all: string;
        trial: string;
        active: string;
        expired: string;
        suspended: string;
      };
      columns: {
        office: string;
        manager: string;
        cr: string;
        subscription: string;
        registeredAt: string;
        actions: string;
      };
      daysLeft: string;
      view: string;
      empty: string;
    };
    officeDetail: {
      back: string;
      managerInfo: string;
      subscription: string;
      actions: string;
      extendTrial: string;
      activate: string;
      suspend: string;
      reactivate: string;
      extendDays: string;
      extendConfirm: string;
    };
    settings: {
      title: string;
      subtitle: string;
      defaultTrialDays: string;
      defaultTrialDaysHint: string;
      autoSuspendDays: string;
      autoSuspendDaysHint: string;
      allowSelfRegistration: string;
      allowSelfRegistrationHint: string;
      globalAnnouncement: string;
      globalAnnouncementHint: string;
      save: string;
      saved: string;
    };
    employees: {
      title: string;
      subtitle: string;
      addEmployee: string;
      columns: {
        name: string;
        title: string;
        phone: string;
        permissions: string;
        lastLogin: string;
        status: string;
        actions: string;
      };
      authRole: { systemAdmin: string; systemEmployee: string };
      active: string;
      inactive: string;
      view: string;
      neverLoggedIn: string;
      allowedCount: string;
      invite: {
        title: string;
        subtitle: string;
        nameLabel: string;
        nationalIdLabel: string;
        phoneLabel: string;
        emailLabel: string;
        emailOptional: string;
        titleLabel: string;
        titleHint: string;
        authRoleLabel: string;
        authRoleHint: string;
        permissionsLabel: string;
        permissionsHint: string;
        loadFromTemplate: string;
        addCta: string;
        cancel: string;
      };
      detail: {
        back: string;
        personalInfo: string;
        titleSection: string;
        titleLabel: string;
        authRoleSection: string;
        permissionsSection: string;
        permissionsHint: string;
        activitySection: string;
        joinedAt: string;
        lastLogin: string;
        actions: string;
        suspendBtn: string;
        reactivateBtn: string;
        deleteBtn: string;
        customized: string;
        basedOnTemplate: string;
        saveChanges: string;
        adminBypassHint: string;
      };
      permissionGroups: {
        offices: string;
        subscriptions: string;
        team: string;
        settings: string;
        auditReports: string;
      };
      permissionActions: Record<
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
        | "exportPlatformReports",
        string
      >;
    };
    audit: {
      title: string;
      subtitle: string;
      columns: { ts: string; actor: string; action: string; target: string; notes: string };
      actions: {
        officeRegistered: string;
        trialExtended: string;
        officeSuspended: string;
        officeActivated: string;
        employeeAdded: string;
        settingChanged: string;
      };
    };
    subscriptionStatus: {
      trial: string;
      active: string;
      expired: string;
      suspended: string;
    };
    plans: {
      title: string;
      subtitle: string;
      addPlan: string;
      activeBadge: string;
      inactiveBadge: string;
      featuresIncluded: string;
      noFeatures: string;
      pricingTitle: string;
      durationLabels: { 6: string; 12: string; 24: string };
      perDuration: string;
      currency: string;
      edit: string;
      backToPlans: string;
      editorTitle: string;
      newPlanTitle: string;
      nameLabel: string;
      descriptionLabel: string;
      featuresSection: string;
      featuresHint: string;
      pricingSection: string;
      pricingHint: string;
      activeToggle: string;
      activeToggleHint: string;
      save: string;
      saved: string;
      cancel: string;
      featureNames: Record<
        "aiAssistant" | "ocr" | "whatsappMessages" | "smsMessages",
        string
      >;
      featureHints: Record<
        "aiAssistant" | "ocr" | "whatsappMessages" | "smsMessages",
        string
      >;
      officeSubscription: {
        section: string;
        currentPlan: string;
        duration: string;
        price: string;
        startedAt: string;
        endsAt: string;
        noPlan: string;
        changePlan: string;
        pickPlan: string;
        pickDuration: string;
        confirm: string;
      };
    };
  };
  officeSubscription: {
    title: string;
    subtitle: string;
    trialBanner: {
      title: string;
      remaining: string;
      cta: string;
    };
    currentPlan: {
      heading: string;
      onTrial: string;
      activePlan: string;
      renews: string;
    };
    compareHeading: string;
    compareSubtitle: string;
    durationToggle: { label: string; perMonth: string };
    saveBadge: string;
    chooseBtn: string;
    currentBadge: string;
    learnMore: string;
    closeFeature: string;
    scenarioHeading: string;
    exampleHeading: string;
    checkout: {
      title: string;
      subtitle: string;
      orderSummary: string;
      planRow: string;
      durationRow: string;
      total: string;
      paymentMethod: string;
      paymentMethodHint: string;
      payBtn: string;
      backToPlans: string;
    };
    paymentMethods: {
      mada: string;
      visa: string;
      mastercard: string;
      applePay: string;
      stcPay: string;
      bankTransfer: string;
    };
    paymentMethodHints: {
      mada: string;
      visa: string;
      mastercard: string;
      applePay: string;
      stcPay: string;
      bankTransfer: string;
    };
    success: {
      title: string;
      subtitle: string;
      backHome: string;
    };
    chat: {
      buttonLabel: string;
      title: string;
      subtitle: string;
      placeholder: string;
      send: string;
      welcome: string;
      suggestions: string[];
      thinking: string;
      errorFallback: string;
      promptedBy: string;
    };
  };
  migration: {
    title: string;
    subtitle: string;
    journeyTitle: string;
    bannerTitle: string;
    bannerHint: string;
    bannerCta: string;
    startCta: string;
    resumeCta: string;
    skipStep: string;
    backToOverview: string;
    nextStep: string;
    approveStep: string;
    steps: Record<"investors" | "investmentContracts" | "customers" | "installmentContracts" | "receipts" | "payments" | "review", { title: string; subtitle: string }>;
    stepStatus: Record<"notStarted" | "inProgress" | "completed" | "skipped", string>;
    methodQuestion: string;
    methods: Record<"excel" | "pdf" | "screenshots" | "scan" | "manual", { label: string; hint: string }>;
    uploadHint: string;
    chooseFile: string;
    analyzingTitle: string;
    analyzingHint: string;
    extractedCount: string;
    reviewTableTitle: string;
    cellConfirmed: string;
    cellNeedsReview: string;
    cellMissing: string;
    summaryConfirmed: string;
    summaryNeedsReview: string;
    summaryMissing: string;
    reconciliationTitle: string;
    reconciliationHint: string;
    samePerson: string;
    differentPerson: string;
    reconciliationDone: string;
    finalReviewTitle: string;
    finalReviewHint: string;
    finalApprove: string;
    finalApproveConfirm: string;
    completedTitle: string;
    completedSubtitle: string;
    completedCount: string;
    completedCta: string;
    columnLabels: Record<string, string>;
  };
  purchaseStatus: Record<PurchaseStatusKey, string>;
  financialHub: {
    title: string;
    subtitle: string;
    cards: {
      receipts: { title: string; hint: string };
      payments: { title: string; hint: string };
      cashLedger: { title: string; hint: string };
      balances: { title: string; hint: string };
      purchases: { title: string; hint: string };
    };
    kpis: {
      cashBalance: string;
      receiptsMonth: string;
      paymentsMonth: string;
      netMonth: string;
    };
  };
  receipts: {
    pageTitle: string;
    pageSubtitle: string;
    newReceipt: string;
    columns: {
      number: string;
      date: string;
      party: string;
      from: string;
      amount: string;
      method: string;
      status: string;
    };
    detail: {
      back: string;
      printVoucher: string;
      share: string;
      markVerified: string;
      verified: string;
      voucherInfo: string;
      payer: string;
      linkedContract: string;
      linkedInvestmentContract: string;
      reference: string;
      notes: string;
      attachments: string;
      attachmentsCount: string;
      createdBy: string;
      verifiedBy: string;
      flagDuplicate: string;
    };
    form: {
      partyLabel: string;
      partyHint: string;
      payerName: string;
      payerNamePlaceholder: string;
      amount: string;
      methodLabel: string;
      reference: string;
      referencePlaceholder: string;
      linkToContract: string;
      linkToContractPlaceholder: string;
      notes: string;
      attachments: string;
      attachmentsHint: string;
      submit: string;
      cancel: string;
      saveAndPrint: string;
    };
  };
  paymentVouchers: {
    pageTitle: string;
    pageSubtitle: string;
    newPayment: string;
    needsApprovalBadge: string;
    columns: {
      number: string;
      date: string;
      party: string;
      beneficiary: string;
      amount: string;
      method: string;
      status: string;
    };
    detail: {
      back: string;
      printVoucher: string;
      share: string;
      markVerified: string;
      voucherInfo: string;
      beneficiary: string;
      linkedTo: string;
      reference: string;
      notes: string;
      attachments: string;
      createdBy: string;
      pendingApproval: string;
    };
    form: {
      categoryLabel: string;
      beneficiaryName: string;
      beneficiaryPlaceholder: string;
      amount: string;
      methodLabel: string;
      reference: string;
      linkLabel: string;
      linkPlaceholder: string;
      notes: string;
      attachments: string;
      autoApprovalNote: string;
      submit: string;
      cancel: string;
    };
  };
  cashLedger: {
    pageTitle: string;
    pageSubtitle: string;
    summary: {
      opening: string;
      totalIn: string;
      totalOut: string;
      balance: string;
    };
    filters: {
      all: string;
      incoming: string;
      outgoing: string;
      cashOnly: string;
      bankOnly: string;
    };
    columns: {
      date: string;
      voucher: string;
      description: string;
      method: string;
      employee: string;
      amount: string;
      runningBalance: string;
    };
    empty: string;
  };
  balances: {
    pageTitle: string;
    pageSubtitle: string;
    officeCash: {
      title: string;
      hint: string;
    };
    investorsSection: { title: string; hint: string; activeContracts: string };
    customersSection: { title: string; hint: string; activeContracts: string };
    columns: {
      name: string;
      capital: string;
      profitDue: string;
      paid: string;
      net: string;
      remaining: string;
      overdue: string;
    };
  };
  purchases: {
    pageTitle: string;
    pageSubtitle: string;
    newPurchase: string;
    columns: {
      number: string;
      date: string;
      supplier: string;
      description: string;
      amount: string;
      status: string;
      linkedContract: string;
    };
    form: {
      supplier: string;
      description: string;
      amount: string;
      method: string;
      notes: string;
      submit: string;
      cancel: string;
    };
  };
  duplicate: {
    suspectedReference: string;
    suspectedRefDetail: string;
  };
}

const ar: Dictionary = {
  appName: "مُقسِط",
  nav: {
    operations: "لوحة العمليات",
    dashboard: "لوحة المكتب",
    investments: "عقود الاستثمار",
    contracts: "عقود التقسيط",
    clients: "العملاء",
    investors: "المستثمرون",
    collections: "التحصيلات",
    approvals: "الموافقات",
    permissions: "الأدوار والصلاحيات",
    audit: "سجل العمليات",
    investorPortal: "بوابة المستثمر",
    customerPortal: "بوابة العميل",
    financial: "المالية",
    documents: "المستندات",
    reports: "التقارير",
    settings: "الإعدادات",
  },
  navGroups: {
    operations: "العمليات",
    administration: "الإدارة",
    financial: "المالية",
    archive: "الأرشيف",
    portals: "البوابات",
    settings: "النظام",
  },
  pages: {
    operations: { title: "لوحة العمليات اليومية", description: "قائمة عملك اليوم — موافقات، متأخرون، إيصالات." },
    dashboard: { title: "لوحة المكتب", description: "نظرة عامة على تشغيل المكتب." },
    investments: { title: "عقود الاستثمار", description: "إدارة عقود الاستثمار مع المستثمرين." },
    contracts: { title: "عقود التقسيط", description: "عقود التقسيط مع العملاء." },
    clients: { title: "العملاء", description: "إدارة سجلات العملاء وملفاتهم." },
    investors: { title: "المستثمرون", description: "متابعة المستثمرين ومساهماتهم." },
    collections: { title: "التحصيلات", description: "مراجعة إيصالات الدفع وتأكيدها." },
    approvals: { title: "الموافقات", description: "صندوق الإجراءات بانتظار قرار." },
    permissions: { title: "الأدوار والصلاحيات", description: "أدوار جاهزة قابلة للتخصيص." },
    audit: { title: "سجل العمليات", description: "أرشيف الإجراءات التشغيلية." },
    investorPortal: { title: "بوابة المستثمر", description: "نموذج تجريبي لبوابة المستثمر." },
    customerPortal: { title: "بوابة العميل", description: "نموذج تجريبي لبوابة العميل." },
    financial: { title: "المالية", description: "العمليات والأرصدة المالية." },
    documents: { title: "المستندات", description: "أرشيف المستندات والملفات." },
    reports: { title: "التقارير", description: "التقارير والتحليلات." },
    settings: { title: "الإعدادات", description: "إعدادات المنصة والحساب." },
  },
  auth: {
    loginTitle: "تسجيل الدخول",
    loginSubtitle: "أدخل بياناتك للوصول إلى منصة مُقسِط.",
    email: "البريد الإلكتروني",
    password: "كلمة المرور",
    signIn: "تسجيل الدخول",
    selectTenantTitle: "اختر المؤسسة",
    selectTenantSubtitle: "اختر المؤسسة التي تريد إدارتها.",
    continue: "متابعة",
  },
  common: {
    theme: "السمة",
    language: "اللغة",
    logout: "تسجيل الخروج",
    account: "الحساب",
    comingSoon: "قريباً",
    comingSoonHint: "هذه الصفحة قيد الإنشاء وستتوفر في مرحلة لاحقة.",
    openMenu: "فتح القائمة",
    closeMenu: "إغلاق القائمة",
    currency: "ر.س",
    viewAll: "عرض الكل",
    review: "مراجعة",
    open: "فتح",
    distribute: "توزيع",
    today: "اليوم",
    daysAgo: "منذ {n} يوم",
    daysLeft: "بعد {n} أيام",
    cancel: "إلغاء",
    next: "التالي",
    back: "السابق",
    save: "حفظ",
    saving: "جاري الحفظ...",
    none: "لا يوجد",
    yes: "نعم",
    no: "لا",
    optional: "اختياري",
    notes: "ملاحظات",
  },
  investorType: { internal: "داخلي", external: "خارجي" },
  investorStatus: { active: "نشط", inactive: "غير نشط", suspended: "متوقف" },
  contractStatus: {
    active: "نشط",
    ended: "منتهي",
    pendingSetup: "قيد الإعداد",
    cancelled: "ملغى",
  },
  installmentContractStatus: {
    active: "نشط",
    completed: "مكتمل",
    defaulted: "متعثر",
    cancelled: "ملغى",
  },
  installmentStatus: {
    scheduled: "مجدول",
    partiallyPaid: "مدفوع جزئياً",
    paid: "مدفوع",
    overdue: "متأخر",
    defaulted: "متعثر",
  },
  riskClass: { low: "مخاطر منخفضة", medium: "مخاطر متوسطة", high: "مخاطر عالية" },
  paymentSource: {
    whatsapp_upload: "تحميل عبر واتساب",
    bank_transfer: "تحويل بنكي",
    cash: "نقدي",
  },
  proofStatus: {
    pending: "قيد المراجعة",
    approved: "موافق عليه",
    rejected: "مرفوض",
    needsClarification: "بانتظار توضيح",
  },
  identityKind: {
    saudiIndividual: "هوية سعودية",
    gccIndividual: "هوية خليجية",
    foreignIndividual: "جواز سفر",
    commercialEntity: "سجل تجاري",
  },
  identityFieldLabel: {
    nationalId: "رقم الهوية الوطنية",
    gccId: "رقم الهوية الخليجية",
    passport: "رقم جواز السفر",
    cr: "رقم السجل التجاري",
    country: "الدولة",
    nationality: "الجنسية",
    entityName: "اسم المنشأة",
  },
  bank: {
    sectionTitle: "الحساب البنكي",
    bankName: "اسم البنك",
    iban: "رقم الآيبان",
    accountHolder: "اسم صاحب الحساب",
  },
  dashboard: {
    title: "لوحة المكتب",
    subtitle: "نظرة عامة على العمليات والتحصيلات والمستثمرين.",
    kpi: {
      collections: { label: "تحصيلات الشهر", expected: "المتوقع", percent: "نسبة التحصيل" },
      overdue: { label: "الأقساط المتأخرة", installments: "قسط متأخر", customers: "عميل متأخر" },
      activeContracts: {
        label: "العقود النشطة",
        totalValue: "إجمالي القيمة",
        unpaidBalance: "الرصيد المتبقي",
      },
      pendingContracts: {
        label: "عقود قيد التفعيل",
        totalValue: "إجمالي القيمة",
        awaitingSignature: "بانتظار التوقيع",
      },
    },
    alerts: {
      title: "تنبيهات ذكية",
      subtitle: "إجراءات تشغيلية تحتاج اهتمامك الآن",
      delay30: "{n} عملاء متأخرون أكثر من 30 يوم",
      delay60: "{n} عميل متعثر أكثر من 60 يوم",
      pendingContracts: "{n} عقود تنتظر إجراء (توقيع أو مراجعة)",
      recyclableInvestors: "{n} مستثمرون يمكن إنشاء عقود استثمار من أرصدتهم",
      paymentDocs: "{n} مستندات دفع بحاجة إلى مراجعة",
    },
    profit: {
      title: "ربح المكتب — هذا الشهر",
      subtitle: "موزع حسب مصدر الدخل",
      selfOwned: "أرباح العقود الذاتية",
      managementFee: "نسبة الإدارة على المستثمر",
      goodsMargin: "ربح بيع البضائع للمستثمر",
    },
    utilization: {
      title: "رأس المال المستثمر النشط",
      subtitle: "داخلي مقابل خارجي ونسبة الاستخدام",
      internal: "داخلي (المكتب)",
      external: "خارجي",
      utilized: "المُستخدم",
      unutilized: "غير المُستخدم",
    },
    cashMovement: {
      title: "حركة النقد — هذا الشهر",
      net: "صافي الشهر",
      inflow: "نقد داخل",
      outflow: "نقد خارج",
      purchases: "مشتريات بضائع",
      investorDisbursements: "صرف للمستثمرين",
    },
    followup: {
      title: "متابعة الأقساط",
      subtitle: "اختر الفئة لمتابعة العملاء وأقساطهم",
      tabs: {
        today: "اليوم",
        thisWeek: "هذا الأسبوع",
        overdue: "متأخرة",
        defaulted: "متعثرة 60+ يوم",
      },
      status: { dueToday: "اليوم", upcoming: "قادم", overdue: "متأخر", defaulted: "متعثر" },
      empty: "لا توجد أقساط في هذه الفئة.",
      columns: { customer: "العميل", amount: "المبلغ", due: "الاستحقاق", status: "الحالة" },
    },
  },
  investors: {
    pageTitle: "المستثمرون",
    pageSubtitle: "نظرة عامة على شركاء رأس المال — داخلي وخارجي.",
    newInvestor: "+ مستثمر جديد",
    filters: { all: "الكل", internal: "داخلي", external: "خارجي" },
    searchPlaceholder: "ابحث بالاسم أو رقم الهوية…",
    columns: {
      investor: "المستثمر",
      type: "النوع",
      identity: "الهوية",
      totalCapital: "رأس المال الكلي",
      currentBalance: "الرصيد الحالي",
      investedCapital: "المُستثمَر",
      realizedProfit: "أرباح المستثمر",
      activeContracts: "العقود",
      status: "الحالة",
    },
    metric: {
      currentBalance: "الرصيد الحالي",
      investedCapital: "رأس المال المُستثمَر",
      realizedProfit: "أرباح المستثمر",
      activeContracts: "العقود النشطة",
    },
    recycling: {
      eligible: "يمكن إنشاء عقد استثمار جديد من الرصيد الحالي",
      cta: "إنشاء عقد جديد",
    },
    profile: {
      contactSection: "معلومات الاتصال",
      detailsSection: "تفاصيل المستثمر",
      contractsSection: "عقود الاستثمار",
      termsSection: "شروط المشاركة في الأرباح",
      activitySection: "النشاط الأخير",
      totalCapitalLabel: "إجمالي رأس المال التاريخي",
      joinedAt: "مستثمر منذ",
      noContracts: "لا توجد عقود استثمار حالياً.",
      noActivity: "لا يوجد نشاط مسجل بعد.",
      viewContract: "عرض العقد",
      newContract: "+ عقد جديد",
      showMore: "عرض المزيد",
    },
    activityType: {
      receipt: "سند قبض",
      payment: "سند صرف",
      profitDistribution: "توزيع أرباح",
      contract: "عقد استثمار",
      recycledContract: "عقد استثمار معاد تشغيله",
    },
    wallet: {
      title: "رصيد المستثمر",
      lastActivity: "آخر حركة",
      newReceipt: "+ سند قبض",
      newPayment: "+ سند صرف",
      viewMovements: "الحركات المالية",
    },
  },
  investments: {
    pageTitle: "عقود الاستثمار",
    pageSubtitle: "إدارة عقود رأس المال مع المستثمرين الداخليين والخارجيين.",
    newContract: "+ عقد استثمار جديد",
    filters: { all: "الكل", active: "نشط", pendingSetup: "قيد الإعداد", ended: "منتهي" },
    columns: {
      number: "رقم العقد",
      investor: "المستثمر",
      amount: "المبلغ",
      start: "البداية",
      end: "النهاية",
      ops: "نسبة العمليات",
      utilized: "المُستخدم",
      remaining: "المتبقي",
      status: "الحالة",
    },
    details: {
      contractInfo: "معلومات العقد",
      investor: "المستثمر",
      capitalUsage: "استخدام رأس المال",
      profitNotes: "ملاحظات تقاسم الأرباح",
      recycling: {
        title: "إعادة تدوير رأس المال",
        note: "السماح بإعادة تدوير رأس المال تلقائياً عند توفر مبالغ محصلة.",
        status: "الحالة",
        thresholdLabel: "الحد الأدنى للإعادة",
        noThreshold: "بدون حد أدنى",
        enabled: "مسموح",
        disabled: "غير مسموح",
      },
      linkedInstallments: "عقود التقسيط المرتبطة",
      linkedInstallmentsEmpty: "ستظهر عقود التقسيط المموّلة من هذا العقد هنا.",
      timeline: "النشاط",
      amount: "المبلغ",
      start: "تاريخ البداية",
      end: "تاريخ النهاية",
      duration: "المدة",
      months: "شهر",
      operationPct: "نسبة العمليات",
      document: "المستند المرفق",
      noDocument: "لم يتم إرفاق مستند",
      viewInvestor: "عرض ملف المستثمر →",
      utilized: "المُستخدم",
      remaining: "المتبقي",
      back: "→ العقود",
    },
    create: {
      pageTitle: "عقد استثمار جديد",
      steps: { investor: "المستثمر", terms: "الشروط", notes: "ملاحظات ومستندات", review: "المراجعة" },
      step1: {
        title: "اختر المستثمر",
        selectInvestor: "المستثمر",
        searchPlaceholder: "اختر مستثمراً من القائمة",
        noneSelected: "لم يتم اختيار مستثمر بعد.",
        capitalSummary: "ملخص رأس المال",
      },
      step2: {
        title: "شروط العقد",
        amount: "مبلغ العقد (ر.س)",
        startDate: "تاريخ البداية",
        duration: "المدة",
        durationMonths: "شهر",
        endDate: "تاريخ النهاية",
        endDateAuto: "يُحسب تلقائياً من تاريخ البداية والمدة",
        operationPct: "نسبة العمليات للمكتب (%)",
        operationPctInternalNote: "للمستثمر الداخلي تثبت النسبة عند 0%.",
        profitTitle: "ربح هذا العقد",
        profitHintExternal: "ادخل المبلغ المتفق عليه لكل طرف من إجمالي ربح العقد.",
        profitHintInternal: "المستثمر داخلي — كل الأرباح للمكتب. ادخل ربح المكتب المتوقع.",
        officeProfit: "ربح المكتب المتوقع (ر.س)",
        investorProfit: "ربح المستثمر المتوقع (ر.س)",
        investorProfitInternal: "ربح المكتب من هذا العقد (ر.س)",
        totalProfit: "إجمالي الربح",
        officeShare: "نسبة المكتب",
        investorShare: "نسبة المستثمر",
      },
      step3: {
        title: "تفضيلات ومستندات",
        profitNotes: "ملاحظات تقاسم الأرباح",
        profitNotesPlaceholder: "مثال: صافي الربح يوزّع شهرياً بعد خصم نسبة العمليات.",
        recyclingToggle: "السماح بإعادة تدوير رأس المال",
        recyclingNote:
          "السماح بإعادة تدوير رأس المال تلقائياً عند توفر مبالغ محصلة من أقساط العملاء، دون طلب موافقة المستثمر في كل مرة.",
        recyclingThreshold: "الحد الأدنى لإعادة التدوير (ر.س) — اختياري",
        recyclingThresholdHint:
          "يبدأ المكتب بإعادة التدوير عند بلوغ المبالغ المُحصَّلة هذا الحد. اتركه فارغاً لإعادة التدوير دون حد أدنى.",
        attachment: "مرفق ملف العقد",
        attachmentHint: "PDF أو صورة — لن يتم رفع الملف فعلياً في هذه النسخة.",
        chooseFile: "اختر ملفاً",
        noFile: "لم يتم اختيار ملف",
      },
      step4: {
        title: "مراجعة العقد",
        subtitle: "تحقق من التفاصيل قبل الحفظ.",
        investorBlock: "المستثمر",
        contractBlock: "شروط العقد",
        notesBlock: "ملاحظات ومستندات",
      },
      saved: "تم حفظ العقد بنجاح",
    },
  },
  customers: {
    pageTitle: "العملاء",
    pageSubtitle: "نظرة عامة على العملاء وعقود التقسيط الخاصة بهم.",
    newCustomer: "+ عميل جديد",
    filters: { all: "الكل", active: "نشط", late: "متأخر", defaulted: "متعثر" },
    columns: {
      customer: "العميل",
      identity: "الهوية",
      mobile: "الجوال",
      city: "المدينة",
      employer: "جهة العمل",
      salary: "الراتب",
      contracts: "العقود",
      risk: "تصنيف المخاطر",
    },
    profile: {
      bornOn: "مواليد",
      customerSince: "عميل منذ",
      contactSection: "معلومات الاتصال",
      employmentSection: "بيانات وظيفية",
      addressSection: "العنوان",
      employer: "صاحب العمل",
      salary: "الراتب الشهري",
      obligations: "التزامات",
      noObligations: "لا توجد التزامات",
      contractsSection: "عقود التقسيط",
      notesSection: "ملاحظات",
      whatsapp: "محادثة واتساب",
      newContract: "+ عقد تقسيط جديد",
      noContracts: "لا توجد عقود تقسيط حالياً.",
    },
    create: {
      pageTitle: "عميل جديد",
      identitySection: "الهوية والمعلومات الأساسية",
      identityKindLabel: "نوع الهوية",
      identityNumber: "رقم الهوية / المستند",
      fullName: "الاسم الكامل",
      dob: "تاريخ الميلاد",
      nationality: "الجنسية",
      contactSection: "الاتصال والسكن",
      mobile: "رقم الجوال",
      city: "المدينة",
      address: "العنوان التفصيلي",
      employmentSection: "البيانات الوظيفية",
      employer: "صاحب العمل / جهة العمل",
      salary: "الراتب الشهري (ر.س)",
      obligations: "التزامات شهرية (ر.س)",
      classificationSection: "تصنيف وملاحظات",
      risk: "تصنيف المخاطر الداخلي",
      notes: "ملاحظات داخلية",
      saved: "تم حفظ العميل بنجاح",
    },
  },
  installmentContracts: {
    pageTitle: "عقود التقسيط",
    pageSubtitle: "إدارة عقود التقسيط مع العملاء وحالات الأقساط.",
    newContract: "+ عقد تقسيط جديد",
    filters: { all: "الكل", active: "نشط", overdue: "به متأخر", defaulted: "متعثر", completed: "مكتمل" },
    columns: {
      number: "رقم العقد",
      customer: "العميل",
      product: "المنتج",
      installmentPrice: "سعر التقسيط",
      monthlyInstallment: "القسط الشهري",
      installmentsCount: "عدد الأقساط",
      remainingBalance: "المتبقي",
      status: "الحالة",
    },
    details: {
      back: "→ عقود التقسيط",
      product: "المنتج",
      customer: "العميل",
      fundedBy: "ممول من",
      pricingSection: "التسعير والحساب",
      cashPrice: "السعر النقدي",
      installmentPrice: "سعر التقسيط",
      downPayment: "الدفعة الأولى",
      financingAmount: "المبلغ المُمَوَّل",
      monthlyInstallment: "القسط الشهري",
      profitMargin: "هامش الربح",
      profitMarginPct: "نسبة الربح",
      remainingBalance: "الرصيد المتبقي",
      fundingSection: "تمويل العقد",
      fromInvestment: "من عقد الاستثمار",
      investor: "المستثمر",
      capitalUtilized: "المُستخدم من رأس المال",
      scheduleSection: "جدول الأقساط",
      scheduleMonthsHint: "{n} شهراً",
      timeline: "النشاط",
      duration: "المدة",
      startDate: "تاريخ البداية",
      endDate: "تاريخ النهاية",
      months: "شهر",
    },
    schedule: {
      number: "#",
      dueDate: "الاستحقاق",
      amount: "المبلغ",
      paid: "المدفوع",
      remaining: "المتبقي",
      status: "الحالة",
      pay: "دفع",
    },
    create: {
      pageTitle: "عقد تقسيط جديد",
      steps: {
        customer: "العميل",
        product: "المنتج والتسعير",
        funding: "ربط بعقد استثمار",
        review: "المراجعة",
      },
      step1: {
        title: "اختر العميل",
        selectCustomer: "العميل",
        searchPlaceholder: "اختر عميلاً من القائمة",
        noneSelected: "لم يتم اختيار عميل بعد.",
        riskNote: "تنويه: العميل مصنف ضمن فئة المخاطر العالية. يلزم اعتماد إضافي.",
      },
      step2: {
        title: "المنتج والتسعير",
        productType: "نوع المنتج / السلعة",
        productTypeHint: "نص حر — مثال: iPhone 15 Pro / مكيف / لابتوب",
        cashPrice: "السعر النقدي (ر.س)",
        installmentPrice: "سعر التقسيط (ر.س)",
        downPayment: "الدفعة الأولى (ر.س)",
        installmentsCount: "عدد الأقساط",
        previewTitle: "معاينة الحساب التلقائي",
        previewHint: "الأرقام تُحسب فورياً عند تعديل المدخلات.",
      },
      step3: {
        title: "ربط بعقد استثمار",
        selectInvestor: "المستثمر",
        selectContract: "عقد الاستثمار",
        chosenSummary: "ملخص العقد المختار",
        amountToUtilize: "المبلغ المراد استخدامه (ر.س)",
        remainingAfter: "المتاح بعد الربط",
        sufficient: "✓ رأس المال كافٍ",
        notSufficient: "⚠ رأس المال غير كافٍ — اختر عقداً آخر أو خفّض المبلغ.",
      },
      step4: {
        title: "مراجعة العقد",
        subtitle: "تحقق من التفاصيل قبل الحفظ.",
        customerBlock: "العميل",
        productBlock: "المنتج والتسعير",
        fundingBlock: "تمويل العقد",
      },
      saved: "تم حفظ عقد التقسيط بنجاح",
    },
    partialPayment: {
      title: "تسجيل دفعة قسط",
      subtitle: "قسط رقم {n} — {contract}",
      due: "المبلغ المستحق",
      paidBefore: "المدفوع سابقاً",
      remaining: "المتبقي",
      paymentAmount: "مبلغ الدفعة (ر.س)",
      source: "وسيلة الدفع",
      attachReceipt: "إرفاق إيصال",
      noFile: "لم يتم اختيار ملف",
      note: "ملاحظة",
      submit: "حفظ الدفعة",
    },
  },
  collections: {
    pageTitle: "التحصيلات",
    pageSubtitle: "صندوق المراجعة لإيصالات الدفع المرفوعة من العملاء.",
    inboxCount: "قيد المراجعة {n}",
    empty: "لا توجد إيصالات بانتظار المراجعة.",
    columns: {
      customer: "العميل",
      contract: "العقد",
      amount: "المبلغ",
      reference: "رقم المرجع",
      uploadedAt: "تاريخ الرفع",
      flag: "تنبيه",
    },
    flags: {
      duplicate: "مرجع مكرر",
      amountMismatch: "المبلغ غير مطابق",
      clean: "مطابق",
    },
    review: {
      back: "→ التحصيلات",
      headerTitle: "مراجعة إيصال دفع",
      forInstallment: "قسط رقم {n} من العقد {contract}",
      receiptImageSection: "صورة الإيصال",
      ocrSection: "بيانات استخراجها AI/OCR",
      ocrSubtitle: "قابلة للتعديل قبل اعتماد القرار",
      ocrConfidence: "ثقة OCR",
      duplicateBannerTitle: "⚠ تنبيه: رقم المرجع قد يكون مستخدماً سابقاً",
      duplicateBannerHint: "آخر استخدام كان لقسط سابق. تحقق قبل الموافقة.",
      duplicateView: "عرض الإيصال السابق",
      comparisonSection: "المقارنة مع القسط",
      expectedAmount: "المبلغ المستحق",
      customer: "العميل",
      dueDate: "تاريخ الاستحقاق",
      transferDate: "تاريخ التحويل",
      paidEarly: "قبل الموعد",
      paidOnTime: "في الموعد",
      paidLate: "بعد الموعد",
      mismatch: "غير مطابق",
      employeeNotes: "ملاحظات الموظف",
      employeeNotesPlaceholder: "أضف ملاحظة للقرار...",
      approve: "موافقة",
      reject: "رفض",
      requestClarification: "طلب توضيح",
      ocrFields: {
        transferAmount: "المبلغ",
        senderName: "اسم المُرسِل",
        transferDate: "تاريخ التحويل",
        transferReference: "رقم المرجع",
        bankName: "البنك",
      },
      decisionRecorded: "تم تسجيل القرار",
    },
    whatsapp: {
      title: "محادثة واتساب",
      subtitle: "نموذج توضيحي للمحادثة الآلية مع العميل",
      systemSender: "مكتب مُقسِط",
      customerSender: "العميل",
    },
  },
  permissionAction: {
    createInstallmentContract: "إنشاء عقد تقسيط",
    editInstallments: "تعديل أقساط",
    rescheduleContract: "إعادة جدولة عقد",
    deleteAttachment: "حذف مرفق",
    closeContract: "إغلاق عقد",
    approvePaymentProof: "اعتماد إيصال دفع",
    rejectPaymentProof: "رفض إيصال دفع",
    recordPartialPayment: "تسجيل دفعة جزئية",
    createCustomer: "إنشاء عميل",
    approveHighRiskCustomer: "الموافقة على عميل عالي المخاطر",
    createInvestmentContract: "إنشاء عقد استثمار",
    distributeProfits: "توزيع الأرباح",
    exportReport: "تصدير تقرير",
    managePermissions: "إدارة الصلاحيات",
  },
  permissionGroup: {
    contracts: "العقود",
    payments: "الدفعات",
    customers: "العملاء",
    investors: "المستثمرون",
    system: "النظام",
  },
  permissionState: {
    allow: "مسموح مباشرة",
    requireApproval: "يحتاج موافقة",
    deny: "ممنوع",
  },
  approvalStatus: {
    pending: "بانتظار قرار",
    approved: "معتمد",
    rejected: "مرفوض",
    needsClarification: "بانتظار توضيح",
    escalated: "تم تصعيده",
  },
  approvalPriority: { critical: "عاجل", normal: "عادي", low: "أولوية منخفضة" },
  notificationType: {
    overdueCustomer: "عميل متأخر",
    newPaymentProof: "إيصال دفع جديد",
    duplicateTransferReference: "رقم تحويل مكرر",
    pendingApproval: "موافقة بانتظار قرار",
    investorLowCapital: "رأس مال مستثمر منخفض",
    contractExpiring: "عقد يقترب من نهايته",
    ocrLowConfidence: "ثقة OCR منخفضة",
    rescheduleRequest: "طلب إعادة جدولة",
  },
  notificationPriority: { critical: "حرج", warning: "تحذير", info: "للعلم" },
  operations: {
    pageTitle: "عمل اليوم",
    pageSubtitle: "ما يحتاج إجراءً منك الآن — لا أكثر.",
    cards: {
      overdue: {
        title: "أقساط متأخرة",
        primary: "{n} عميل",
        secondary: "{amount} ر.س متأخرة",
        cta: "مراجعة التحصيلات",
      },
      proofs: {
        title: "إيصالات بانتظار المراجعة",
        primary: "{n} إيصال",
        secondary: "منها {m} بدقة OCR منخفضة",
        cta: "فتح صندوق الواتساب",
      },
      approvals: {
        title: "موافقات قيد الانتظار",
        primary: "{n} طلب",
        secondary: "منها {critical} حرج",
        cta: "مراجعة الموافقات",
      },
      recycle: {
        title: "رأس مال جاهز لإعادة التشغيل",
        primary: "{amount} ر.س",
        secondary: "لـ {n} مستثمر",
        cta: "تشغيل الآن",
        empty: "لا يوجد مستثمر بلغ حد إعادة التشغيل اليوم.",
      },
    },
    expiring: {
      title: "عقود استثمار قريبة من الانتهاء",
      hint: "{n} عقد خلال 30 يوماً",
      cta: "عرض",
      empty: "—",
    },
    emptyDay: "لا توجد إجراءات اليوم — يوم هادئ.",
  },
  recycling: {
    badgeLabel: "معاد تدويره",
    listTitle: "رأس مال جاهز لإعادة التشغيل",
    listSubtitle: "اختر المستثمر لإنشاء عقد جديد من المبلغ المُحصَّل.",
    thresholdRule: "تظهر هنا العقود التي تجاوز فيها المبلغ المُحصَّل من الأقساط الحد الذي اتفقت عليه مع المستثمر.",
    rowThresholdPill: "حد الإعادة: {amount} ر.س",
    rowAvailableLabel: "المُحصَّل",
    runNow: "تشغيل الآن",
    empty: "لا يوجد مستثمر بلغ حد إعادة التشغيل اليوم.",
    form: {
      pageTitle: "إعادة تشغيل رأس المال",
      contextLabel: "مستثمر",
      collectedLabel: "المبلغ المُحصَّل",
      pctLabel: "نسبة المكتب لهذه الدورة",
      pctHint: "بين 0 و 100",
      pctPlaceholder: "—",
      financingLabel: "متاح للتمويل (مبدأ العقد الجديد)",
      officeShareLabel: "نصيب المكتب",
      cancel: "إلغاء",
      submit: "تشغيل الآن",
      successTitle: "تم إنشاء عقد إعادة التشغيل",
      successHint: "أصبح المبلغ متاحاً للتمويل ضمن عقود الأقساط الجديدة.",
      viewNew: "فتح العقد الجديد",
    },
    detail: {
      sectionTitle: "تفاصيل إعادة التشغيل",
      collectedRow: "المبلغ المُحصَّل قبل النسبة",
      officeShareRow: "نصيب المكتب",
      financingRow: "متاح للتمويل",
      timelineLabel: "إعادة تشغيل رأس المال",
    },
    investorPicker: {
      availableLabel: "متاح للتمويل",
    },
  },
  officeSettings: {
    pageTitle: "إعدادات المكتب",
    pageSubtitle: "تفضيلات بسيطة لمكتبك — تضبطها مرة واحدة.",
    savedLabel: "تم الحفظ · {time}",
    sections: {
      identity: { title: "هوية المكتب", hint: "الاسم الذي يظهر على الإيصالات والتقارير." },
      contact: { title: "بيانات التواصل", hint: "العنوان وأرقام الاتصال للعملاء والمستثمرين." },
      bankAccounts: { title: "الحسابات البنكية للمكتب", hint: "أرقام الحسابات التي تستقبل التحويلات من العملاء والمستثمرين." },
      investmentDefaults: { title: "افتراضيات الاستثمار", hint: "قيمة تُقترح عند إنشاء عقد استثمار جديد." },
      profitDistribution: { title: "سياسة توزيع الأرباح", hint: "تُستخدم كافتراضي للمستثمرين الجدد." },
      notifications: { title: "تفضيلات الإشعارات", hint: "كيف يصلك التنبيه عندما يحتاج شيء قراراً." },
    },
    identity: {
      nameAr: "اسم المكتب (عربي)",
      nameEn: "اسم المكتب (إنجليزي)",
      logoLabel: "الشعار",
      logoChoose: "اختر صورة الشعار",
      logoHint: "PNG أو SVG — يفضّل 256×256.",
      commercialRegistration: "السجل التجاري",
      taxNumber: "الرقم الضريبي",
      foundedAt: "تاريخ التأسيس",
    },
    contact: {
      phone: "الجوال الرئيسي",
      email: "البريد الإلكتروني",
      city: "المدينة",
      neighborhood: "الحي",
      street: "الشارع / العنوان",
      website: "الموقع الإلكتروني",
    },
    bankAccounts: {
      bankName: "اسم البنك",
      beneficiaryName: "اسم المستفيد",
      iban: "رقم الآيبان (IBAN)",
      addAccount: "+ إضافة حساب",
      removeAccount: "حذف",
      accountIndex: "حساب {n}",
      empty: "لا توجد حسابات بنكية بعد — أضف حساباً للبدء.",
    },
    investmentDefaults: {
      recyclingThreshold: "حد إعادة التشغيل الافتراضي (ر.س)",
      recyclingThresholdHint: "يُقترح هذا الحد لعقود الاستثمار الجديدة، ويمكن تعديله لكل عقد.",
    },
    profitDistribution: {
      policy: "السياسة الافتراضية",
      policyOptions: {
        officeFirst: "المكتب أولاً",
        investorFirst: "المستثمر أولاً",
        proportional: "تناسبي",
      },
      policyOptionHints: {
        officeFirst: "تُحسم نسبة المكتب أولاً ثم يُوزّع الباقي على المستثمر.",
        investorFirst: "يحصل المستثمر على رأس ماله أولاً ثم تُحسم النسبة من الربح.",
        proportional: "يُقسم الربح والنسبة معاً وفق نسب مُتّفق عليها.",
      },
      futureNote: "تُستخدم هذه السياسة كافتراضي للمستثمرين. لم تُفعّل بعد في تدفقات التوزيع — قيد التطوير.",
    },
    notifications: {
      channels: "قنوات الإشعار",
      channelLabels: { whatsapp: "واتساب", sms: "رسائل SMS", email: "بريد إلكتروني" },
      quietHoursStart: "بداية ساعات الهدوء",
      quietHoursEnd: "نهاية ساعات الهدوء",
      quietHoursHint: "خلال هذه الساعات يتم تأجيل الإشعارات غير العاجلة.",
      alertTypes: "ما الذي يولّد إشعاراً",
      alertLabels: {
        overdueCustomer: "عميل متأخر",
        newPaymentProof: "إيصال جديد للمراجعة",
        pendingApproval: "طلب موافقة",
        contractExpiring: "عقد قارب على الانتهاء",
        lowOcrConfidence: "ثقة OCR منخفضة",
        investorLowCapital: "رأس مال مستثمر منخفض",
      },
    },
  },
  approvals: {
    pageTitle: "الموافقات",
    pageSubtitle: "صندوق الإجراءات بانتظار قرار من مدير المكتب.",
    pendingCount: "{n} بانتظار قرار",
    filters: {
      all: "الكل",
      pending: "بانتظار قرار",
      critical: "عاجلة",
      approved: "معتمدة",
      rejected: "مرفوضة",
    },
    columns: {
      type: "نوع الإجراء",
      requester: "طلب الموافقة من",
      entity: "العنصر المرتبط",
      priority: "الأولوية",
      ageHours: "العمر",
      status: "الحالة",
    },
    empty: "لا توجد طلبات موافقة في هذه الفئة.",
    review: {
      back: "→ الموافقات",
      requestedBy: "طلب الموافقة من",
      requestedAt: "تاريخ الطلب",
      actionDetails: "تفاصيل الإجراء",
      flags: "تنبيهات",
      reason: "ملاحظات الطالب",
      decision: "القرار",
      decisionNote: "ملاحظة القرار",
      decisionNotePlaceholder: "أضف ملاحظة...",
      approve: "موافقة",
      reject: "رفض",
      requestClarification: "طلب توضيح",
      reminderBadge: "🔔 تم التذكير",
      escalatedBadge: "🚨 تم تصعيده",
    },
  },
  notifications: {
    pageTitle: "مركز الإشعارات",
    pageSubtitle: "كل إشعارات النظام في مكان واحد.",
    unread: "{n} غير مقروء",
    markAllRead: "اعتبر الكل مقروءاً",
    bellTitle: "الإشعارات",
    seeAll: "عرض كل الإشعارات",
    filters: { all: "الكل", unread: "غير مقروء", critical: "حرج", reminders: "تذكير" },
    empty: "لا توجد إشعارات حالياً.",
  },
  permissions: {
    pageTitle: "الأدوار والصلاحيات",
    pageSubtitle: "أدوار جاهزة يمكن تخصيصها بسهولة. كل دور يحدد ما هو مسموح، يحتاج موافقة، أو ممنوع.",
    newRole: "+ دور جديد",
    presetBadge: "جاهز",
    customBadge: "مخصص",
    employeesLabel: "{n} موظف",
    actionsCount: "{allow} مسموح · {require} يحتاج موافقة · {deny} ممنوع",
    role: {
      back: "→ الأدوار",
      rename: "إعادة تسمية",
      duplicate: "نسخ",
      delete: "حذف",
      bypassToggle: "موظفون موثوقون — يتجاوزون الموافقات",
      bypassNote: "عند تفعيل هذا الخيار للموظف، تُنفّذ الإجراءات مباشرة بدون انتظار قرار.",
      saveChanges: "حفظ التغييرات",
      saved: "تم الحفظ",
    },
  },
  audit: {
    pageTitle: "سجل العمليات",
    pageSubtitle: "أرشيف الإجراءات التشغيلية — من، ماذا، متى، على من.",
    filters: { all: "الكل", today: "اليوم", thisWeek: "هذا الأسبوع" },
    actorLabel: "الموظف",
    actionLabel: "نوع الإجراء",
    dateLabel: "التاريخ",
    before: "قبل",
    after: "بعد",
    today: "اليوم",
    yesterday: "أمس",
    empty: "لا توجد إجراءات في هذه الفئة.",
  },
  portals: {
    brand: { investor: "مُقسِط للمستثمر", customer: "مُقسِط للعملاء" },
    common: {
      welcomeBack: "أهلًا بعودتك",
      seeAll: "عرض الكل",
      backToOffice: "الرجوع للنظام الإداري",
      upload: "رفع",
      pay: "دفع",
      download: "تنزيل",
      share: "مشاركة",
      print: "طباعة",
      next: "التالي",
      today: "اليوم",
      overdue: "متأخر",
      paid: "مدفوع",
      scheduled: "مجدول",
      partial: "جزئي",
      pending: "قيد المراجعة",
      approved: "مقبول",
      rejected: "مرفوض",
      monthly: "شهري",
      yearly: "سنوي",
      quarterly: "ربع سنوي",
      refNo: "رقم المرجع",
      poweredBy: "مدعوم من مُقسِط",
      cancel: "إلغاء",
      save: "حفظ",
      profile: "ملفي الشخصي",
      preferences: "التفضيلات",
      language: "اللغة",
      theme: "السمة",
      logout: "تسجيل الخروج",
      contactSupport: "تواصل مع المكتب",
      memberSince: "عضو منذ",
      disclaimer: "تقدير تقريبي للأغراض الإرشادية فقط — لا يعتبر التزاماً على المكتب.",
      backToHome: "الرجوع للرئيسية",
      empty: "لا يوجد عناصر هنا حالياً.",
    },
    tabs: {
      investor: {
        home: "الرئيسية",
        investments: "الاستثمارات",
        profits: "الأرباح",
        notifications: "الإشعارات",
        account: "حسابي",
      },
      customer: {
        home: "الرئيسية",
        installments: "الأقساط",
        payments: "السداد",
        notifications: "الإشعارات",
        account: "حسابي",
      },
    },
    investor: {
      dashboard: {
        greeting: "أهلًا، {name}",
        capitalCardLabel: "إجمالي رأس مالك",
        capitalCardSub: "موزّع على {count} عقود نشطة",
        utilizedShort: "مُستخدم",
        unutilizedShort: "متاح",
        thisMonthLabel: "أرباح هذا الشهر",
        ytdLabel: "أرباح هذه السنة",
        activeContractsLabel: "عقود نشطة",
        nextDistributionLabel: "التوزيع القادم",
        nextDistributionSub: "تقديري — يستحق {date}",
        ctaSimulate: "محاكاة نمو رأس المال",
        ctaStatement: "كشف الحساب",
        ctaInvestments: "عرض الاستثمارات",
        activityTitle: "آخر الحركة",
        activityEmpty: "لا توجد حركة بعد.",
      },
      investments: {
        pageTitle: "استثماراتي",
        countLabel: "{n} عقد نشط",
        cardPrincipal: "رأس المال",
        cardUtilized: "المُستخدم",
        cardEnds: "ينتهي في",
        recyclingOn: "إعادة تدوير مفعّلة",
        recyclingOff: "بدون إعادة تدوير",
        detail: {
          back: "الرجوع",
          share: "مشاركة",
          download: "تنزيل العقد",
          principal: "رأس المال",
          utilized: "المُستخدم",
          unutilized: "المتاح",
          startDate: "تاريخ البدء",
          endDate: "تاريخ الانتهاء",
          operationPct: "نسبة عمليات المكتب",
          recycling: "إعادة تدوير رأس المال",
          recyclingMin: "الحد الأدنى للإعادة",
          profitTerms: "شروط الأرباح",
          timelineTitle: "حركة العقد",
          documentLabel: "ملف العقد",
        },
      },
      profits: {
        pageTitle: "أرباحي",
        ytdTotal: "إجمالي السنة حتى الآن",
        lastDistribution: "آخر توزيع",
        nextDistribution: "التوزيع القادم",
        historyTitle: "سجل التوزيعات",
        sourceContract: "من عقد",
        noUpcoming: "لا يوجد توزيع قادم محدد بعد.",
      },
      notifications: {
        pageTitle: "الإشعارات",
        filterAll: "الكل",
        filterUnread: "غير مقروء",
        empty: "لا توجد إشعارات.",
      },
      account: {
        pageTitle: "حسابي",
        memberSince: "مستثمر منذ",
        sections: {
          profile: { title: "بياناتي", hint: "الاسم، الهوية، التواصل، الحساب البنكي." },
          statements: { title: "كشوف الحساب", hint: "كشوف شهرية وربع سنوية وسنوية." },
          simulator: { title: "محاكاة النمو", hint: "احسب توقع نمو رأس مالك." },
          preferences: { title: "التفضيلات", hint: "اللغة، السمة، الإشعارات." },
          support: { title: "تواصل مع المكتب", hint: "اتصال أو واتساب مع فريق المكتب." },
        },
      },
      simulator: {
        pageTitle: "محاكاة نمو رأس المال",
        subtitle: "غيّر القيم لترى التوقع. هذا تقدير وليس وعداً.",
        inputs: {
          capital: "رأس المال",
          period: "المدة",
          periodOptions: { sixM: "٦ أشهر", oneY: "سنة", twoY: "سنتان", threeY: "٣ سنوات" },
          risk: "أسلوب الاستثمار",
          riskOptions: {
            conservative: "محافظ",
            balanced: "متوازن",
            growth: "نموّ",
          },
          reinvest: "إعادة تدوير الأرباح",
          reinvestHint: "إعادة استثمار الأرباح الشهرية تلقائياً.",
        },
        outputs: {
          currentCapital: "رأس مالك الحالي",
          expectedValue: "القيمة المتوقعة",
          cumulativeReturn: "العائد التراكمي المتوقع",
          chartLabel: "مسار النمو المتوقع",
        },
        disclaimer: "هذه التقديرات إرشادية فقط ولا تعتبر التزاماً على المكتب. النتائج الفعلية تختلف حسب أداء العمليات.",
      },
      statements: {
        pageTitle: "كشوف الحساب",
        pickPeriod: "اختر الفترة",
        periodOptions: { monthly: "شهري", quarterly: "ربع سنوي", annual: "سنوي" },
        downloadHint: "اضغط طباعة لحفظ نسخة PDF.",
        preview: {
          docTitle: "كشف حساب مستثمر",
          toLabel: "إلى السادة",
          forPeriod: "عن الفترة",
          investorIdLabel: "رقم المستثمر",
          dateIssued: "تاريخ الإصدار",
          capitalSummary: "ملخص رأس المال",
          capitalRows: {
            principal: "رأس المال الإجمالي",
            utilized: "المُستخدم في العمليات",
            unutilized: "المتاح للتخصيص",
          },
          distributionsTitle: "حركة التوزيعات",
          colDate: "التاريخ",
          colContract: "العقد",
          colGross: "الربح الإجمالي",
          colFee: "نسبة المكتب",
          colNet: "صافي للمستثمر",
          totalDistributed: "إجمالي المُوزّع",
          notes: "ملاحظات",
          notesBody: "هذا الكشف ملخّص حركة الفترة. لأي استفسار يرجى التواصل مع المكتب.",
          signature: "ختم المكتب",
          refNo: "رقم المرجع",
          printHint: "اضغط زر الطباعة في المتصفح لحفظ نسخة PDF.",
        },
      },
    },
    customer: {
      dashboard: {
        greeting: "أهلًا، {name}",
        nextInstallmentLabel: "قسطك القادم",
        nextInstallmentDueOn: "يستحق {date}",
        remainingLabel: "المتبقي على عقدك",
        paidLabel: "المدفوع حتى الآن",
        progressLabel: "{paid} من {total} قسط",
        activeContractTitle: "عقدك الحالي",
        ctaPayNow: "ادفع الآن",
        ctaUploadProof: "رفع إيصال",
        ctaSchedule: "عرض جدول الأقساط",
        paidUpStatus: "كل أقساطك سدادها منتظم — أحسنت.",
        overdueAlertTitle: "لديك قسط متأخر",
        overdueAlertBody: "نرجو سداد القسط أو رفع إيصال التحويل اليوم.",
        contractMeta: "{product} · عقد {number}",
      },
      installments: {
        pageTitle: "جدول الأقساط",
        contractLabel: "عقد {number} — {product}",
        summary: { total: "إجمالي العقد", paid: "المدفوع", remaining: "المتبقي" },
        rowDue: "يستحق",
        rowUpload: "رفع إيصال",
        status: { paid: "مدفوع", overdue: "متأخر", scheduled: "مجدول", partial: "جزئي" },
      },
      payments: {
        pageTitle: "السداد",
        uploadCta: "رفع إيصال جديد",
        uploadHint: "ارفع صورة التحويل البنكي أو إيصال STC Pay وسيراجعه المكتب.",
        recentTitle: "إيصالاتك الأخيرة",
        empty: "لم ترفع أي إيصال بعد.",
        proofStatus: { pending: "قيد المراجعة", approved: "تم القبول", rejected: "مرفوض" },
      },
      upload: {
        pageTitle: "رفع إيصال دفع",
        pickInstallmentTitle: "اختر القسط",
        pickInstallmentHint: "اختر القسط الذي تريد السداد عنه.",
        installmentRowDue: "يستحق {date}",
        forInstallment: "عن قسط رقم {n} — يستحق {date}",
        amount: "المبلغ المُحوّل",
        method: "طريقة الدفع",
        methodOptions: { bankTransfer: "تحويل بنكي", stcPay: "STC Pay", cash: "نقداً" },
        reference: "رقم العملية / المرجع",
        referenceHint: "اختياري — موجود غالباً على صورة الإيصال.",
        uploadButton: "اختر صورة الإيصال",
        uploadedHint: "تم اختيار الصورة — جاهزة للإرسال.",
        notes: "ملاحظات",
        submit: "إرسال للمراجعة",
        successTitle: "تم استلام الإيصال",
        successHint: "سيراجعه المكتب وستصلك نتيجة المراجعة كإشعار.",
        backToPayments: "الرجوع لقائمة السداد",
      },
      notifications: {
        pageTitle: "الإشعارات",
        filterAll: "الكل",
        filterUnread: "غير مقروء",
        empty: "لا توجد إشعارات.",
      },
      account: {
        pageTitle: "حسابي",
        memberSince: "عميل منذ",
        sections: {
          profile: { title: "بياناتي", hint: "الاسم، الجوال، العنوان." },
          documents: { title: "مستندات عقدك", hint: "نسخة العقد وجدول الأقساط للتنزيل." },
          preferences: { title: "التفضيلات", hint: "اللغة، السمة، الإشعارات." },
          support: { title: "تواصل مع المكتب", hint: "اتصال أو واتساب مع فريق المكتب." },
        },
      },
      documents: {
        pageTitle: "مستندات عقدك",
        contract: "نسخة العقد",
        schedule: "جدول الأقساط",
        receipts: "إيصالاتك المعتمدة",
        empty: "لا توجد مستندات حالياً.",
        download: "تنزيل",
        contractDoc: "عقد التقسيط",
        scheduleDoc: "جدول الأقساط للطباعة",
      },
    },
  },
  searchPlaceholder: "ابحث...",
  paymentMethod: {
    cash: "نقداً",
    bankTransfer: "تحويل بنكي",
    stcPay: "STC Pay",
    cheque: "شيك",
    card: "بطاقة",
  },
  voucherStatus: { draft: "مسودة", verified: "موثّق", cancelled: "ملغى" },
  partyType: {
    investor: "مستثمر",
    customer: "عميل",
    other: "أخرى",
  },
  profitPolicy: {
    officeFirst: "المكتب أولاً",
    investorFirst: "المستثمر أولاً",
    proportional: "بالتساوي",
    useOfficeDefault: "استخدام افتراضي المكتب",
    fromOfficeDefault: "افتراضي المكتب",
    fromInvestorOverride: "خاص بالمستثمر",
    recoveryTitle: "توزيع التحصيلات",
    officeRecovery: "ما حصّله المكتب",
    investorRecovery: "ما حصّله المستثمر",
    officeShort: "المكتب",
    investorShort: "المستثمر",
    eventsHint: "تم تطبيق {n} عملية تقسيم على هذا التقسيط",
    contractProfitTitle: "ربح العقد",
    officeExpected: "ربح المكتب المتوقع",
    investorExpected: "ربح المستثمر المتوقع",
    investorPolicyLabel: "سياسة توزيع الأرباح",
    investorPolicyHint: "تُلغي افتراضي المكتب لهذا المستثمر فقط.",
  },
  authFlow: {
    appName: "مُقسِّط",
    tagline: "منصة تشغيلية لمكاتب التقسيط",
    login: {
      title: "تسجيل الدخول",
      hint: "أدخل رقم جوالك أو بريدك الإلكتروني للمتابعة",
      identifierLabel: "رقم الجوال أو البريد الإلكتروني",
      identifierPlaceholder: "5XXXXXXXX أو email@example.com",
      passwordLabel: "كلمة المرور",
      continueWithOtp: "إرسال رمز التحقق",
      continueWithPassword: "متابعة بكلمة المرور",
      remember30: "تذكَّر هذا الجهاز لمدة ٣٠ يوم",
      forgotPassword: "نسيت كلمة المرور؟",
      newToMuqsit: "جديد في مُقسِّط؟",
      registerCta: "سجّل مكتبك مجاناً",
    },
    otp: {
      title: "أدخل رمز التحقق",
      hint: "أرسلنا رمزاً مكوناً من ٤ أرقام إلى جوالك",
      codeLabel: "رمز التحقق",
      verifyCta: "تحقّق ودخول",
      resend: "إعادة إرسال الرمز",
      resendIn: "إعادة الإرسال بعد {n} ثانية",
      back: "العودة",
    },
    register: {
      title: "أهلاً بك في مُقسِّط",
      hint: "أنشئ حساب مكتبك في دقيقة واحدة — تجربة مجانية ٣٠ يوم",
      step1Title: "بيانات المكتب",
      step2Title: "تحقَّق من جوالك",
      officeNameLabel: "اسم المكتب",
      crLabel: "رقم السجل التجاري",
      managerNameLabel: "اسم مدير المكتب",
      managerNationalIdLabel: "رقم هوية المدير",
      managerPhoneLabel: "رقم جوال المدير",
      managerEmailLabel: "البريد الإلكتروني",
      managerEmailOptional: "اختياري",
      continueCta: "متابعة",
      passwordOptional: "كلمة مرور (اختياري — يمكنك الاكتفاء برمز التحقق)",
      finishCta: "إنشاء الحساب",
      backToLogin: "لديك حساب؟ ادخل من هنا",
    },
    welcome: {
      title: "أهلاً بك في مُقسِّط ✨",
      subtitle: "تم إنشاء حساب مكتبك بنجاح. اختر كيف تريد البدء.",
      trialActive: "تجربتك المجانية فعّالة — متبقي {n} يوم",
      hasOldData: "عندي بيانات قديمة أنقلها",
      hasOldDataHint: "إكسل، PDF، صور أو حتى لقطات من نظامك السابق — نساعدك خطوة بخطوة",
      startMigration: "ابدأ رحلة الانتقال",
      startFresh: "ابدأ من الصفر",
    },
    forgot: {
      title: "استعادة كلمة المرور",
      hint: "أدخل رقم جوالك وسنرسل لك رمز تحقق لإعادة تعيين كلمة المرور",
      newPasswordLabel: "كلمة المرور الجديدة",
      confirmCta: "حفظ كلمة المرور",
    },
    trialBanner: {
      title: "🎁 تجربة مجانية",
      hint: "متبقي {n} يوم من تجربتك",
      warningTitle: "⏰ تجربتك تنتهي قريباً",
      warningHint: "متبقي {n} يوم فقط — تواصل معنا للترقية",
      expiredTitle: "انتهت تجربتك المجانية",
      expiredHint: "لتفعيل حسابك ومواصلة العمل، تواصل مع فريق مُقسِّط",
      upgradeCta: "ترقية الاشتراك",
    },
    account: {
      title: "حسابي",
      subtitle: "إدارة بياناتك الشخصية والأمان",
      profile: "البيانات الشخصية",
      changePassword: "تغيير كلمة المرور",
      language: "اللغة",
      sessions: "الأجهزة النشطة",
      currentDevice: "الجهاز الحالي",
      revoke: "إنهاء الجلسة",
      logout: "تسجيل الخروج",
      logoutAll: "تسجيل الخروج من كل الأجهزة",
    },
  },
  officeEmployees: {
    title: "موظفو المكتب",
    subtitle: "ادعُ موظفيك وحدد لكل واحد مسماه وصلاحياته",
    inviteCta: "+ دعوة موظف",
    filters: { all: "الكل", active: "نشطون", pending: "في انتظار القبول", suspended: "موقوفون" },
    searchPlaceholder: "ابحث بالاسم أو الجوال…",
    columns: {
      employee: "الموظف",
      role: "المسمى",
      phone: "الجوال",
      lastLogin: "آخر دخول",
      status: "الحالة",
      actions: "إجراءات",
    },
    inviteStatus: {
      pending: "في انتظار القبول",
      accepted: "قَبِل الدعوة",
      expired: "انتهت الدعوة",
    },
    activeBadge: "نشط",
    suspendedBadge: "موقوف",
    pendingHint: "أُرسلت دعوة عبر SMS — لم يدخل الموظف بعد",
    view: "عرض",
    invite: {
      title: "دعوة موظف جديد",
      subtitle: "املأ البيانات، حدد المسمى والصلاحيات — يستلم رابط دعوة عبر SMS",
      nameLabel: "اسم الموظف",
      nationalIdLabel: "رقم الهوية",
      phoneLabel: "رقم الجوال",
      emailLabel: "البريد الإلكتروني",
      emailOptional: "اختياري",
      titleLabel: "المسمى الوظيفي",
      titleHint: "اكتب أي مسمى يناسب — لا يؤثر على الصلاحيات",
      permissionsLabel: "الصلاحيات",
      permissionsHint: "حدد ما يستطيع الموظف فعله — كل صلاحية مستقلة",
      loadFromTemplate: "تحميل من قالب جاهز",
      sendInviteCta: "إرسال الدعوة",
      smsHint: "سيستلم الموظف رسالة SMS برابط الدعوة ورمز التحقق",
      cancel: "إلغاء",
    },
    detail: {
      back: "العودة للموظفين",
      personalInfo: "البيانات الشخصية",
      titleSection: "المسمى الوظيفي",
      titleLabel: "المسمى",
      permissionsSection: "الصلاحيات",
      permissionsHint: "صلاحيات هذا الموظف بشكل مستقل — يمكنك تعديل أي بند",
      activitySection: "النشاط",
      bypassApprovals: "تجاوز الموافقات",
      bypassApprovalsHint: "يُسمح للموظف بتنفيذ المبالغ الكبيرة بدون موافقة",
      lastLogin: "آخر دخول",
      neverLoggedIn: "لم يدخل بعد",
      joinedAt: "تاريخ الانضمام",
      actions: "إجراءات",
      suspendBtn: "تعليق الموظف",
      reactivateBtn: "إعادة التفعيل",
      resendInvite: "إعادة إرسال الدعوة",
      deleteBtn: "حذف الحساب",
      deleteConfirm: "تأكيد الحذف",
      customized: "صلاحيات مخصصة",
      basedOnTemplate: "بدأت من قالب: {name}",
      saveChanges: "حفظ التعديلات",
    },
    permissionGroups: {
      contracts: "العقود",
      payments: "المدفوعات",
      customers: "العملاء",
      investors: "المستثمرون",
      system: "النظام",
    },
    permissionActions: {
      createInstallmentContract: "إنشاء عقد تقسيط",
      editInstallments: "تعديل الأقساط",
      rescheduleContract: "إعادة جدولة عقد",
      deleteAttachment: "حذف مرفق",
      closeContract: "إنهاء عقد",
      approvePaymentProof: "اعتماد إثبات دفع",
      rejectPaymentProof: "رفض إثبات دفع",
      recordPartialPayment: "تسجيل دفعة جزئية",
      createCustomer: "إضافة عميل",
      approveHighRiskCustomer: "اعتماد عميل عالي المخاطر",
      createInvestmentContract: "إنشاء عقد استثمار",
      distributeProfits: "توزيع الأرباح",
      exportReport: "تصدير التقارير",
      managePermissions: "إدارة الصلاحيات",
    },
    accept: {
      title: "أهلاً بك في مُقسِّط",
      subtitle: "ادخل رمز التحقق المُرسل لجوالك لإتمام التفعيل",
      enterOtp: "رمز التحقق",
      setPassword: "كلمة المرور",
      passwordOptional: "اختياري — يمكنك الاكتفاء بـ OTP في كل دخول",
      finishCta: "تفعيل الحساب والدخول",
      invalidLink: "رابط الدعوة غير صحيح أو منتهي.",
    },
  },
  admin: {
    shellTitle: "النظام · مُقسِّط",
    nav: {
      dashboard: "لوحة المنصة",
      offices: "المكاتب",
      plans: "الباقات",
      employees: "موظفو النظام",
      settings: "إعدادات المنصة",
      audit: "سجل العمليات",
    },
    dashboard: {
      title: "لوحة المنصة",
      subtitle: "نظرة عامة على المكاتب المسجَّلة والنشاط الأخير",
      kpis: {
        totalOffices: "إجمالي المكاتب",
        trial: "في فترة التجربة",
        active: "اشتراكات فعّالة",
        expired: "انتهت تجربتها",
        suspended: "معلَّقة",
        newThisMonth: "تسجيلات جديدة هذا الشهر",
      },
      recentActivity: "آخر العمليات",
      noActivity: "لا توجد عمليات بعد",
    },
    offices: {
      title: "المكاتب",
      subtitle: "إدارة جميع المكاتب المسجَّلة في المنصة",
      filters: {
        all: "الكل",
        trial: "تجربة",
        active: "نشط",
        expired: "منتهي",
        suspended: "معلَّق",
      },
      columns: {
        office: "المكتب",
        manager: "المدير",
        cr: "السجل التجاري",
        subscription: "الاشتراك",
        registeredAt: "تاريخ التسجيل",
        actions: "إجراءات",
      },
      daysLeft: "{n} يوم متبقي",
      view: "عرض",
      empty: "لا توجد مكاتب",
    },
    officeDetail: {
      back: "العودة للمكاتب",
      managerInfo: "بيانات المدير",
      subscription: "الاشتراك",
      actions: "إجراءات",
      extendTrial: "تمديد التجربة",
      activate: "تفعيل الاشتراك",
      suspend: "تعليق المكتب",
      reactivate: "إعادة التفعيل",
      extendDays: "عدد أيام التمديد",
      extendConfirm: "تمديد",
    },
    settings: {
      title: "إعدادات المنصة",
      subtitle: "إعدادات تطبَّق على كل المكاتب",
      defaultTrialDays: "مدة التجربة الافتراضية (يوم)",
      defaultTrialDaysHint: "تُطبَّق على المكاتب الجديدة عند التسجيل",
      autoSuspendDays: "تعليق تلقائي بعد انتهاء التجربة (يوم)",
      autoSuspendDaysHint: "صفر = لا تعليق تلقائي",
      allowSelfRegistration: "السماح بالتسجيل الذاتي للمكاتب",
      allowSelfRegistrationHint: "عند الإيقاف، التسجيل يصبح بدعوة فقط",
      globalAnnouncement: "إعلان عام (يظهر لكل المكاتب)",
      globalAnnouncementHint: "اتركه فارغاً لعدم عرض إعلان",
      save: "حفظ الإعدادات",
      saved: "تم الحفظ",
    },
    employees: {
      title: "موظفو المنصة",
      subtitle: "أضف موظفي المنصة، حدد لكل واحد مسماه الوظيفي وصلاحياته",
      addEmployee: "+ إضافة موظف",
      columns: {
        name: "الاسم",
        title: "المسمى الوظيفي",
        phone: "الجوال",
        permissions: "الصلاحيات",
        lastLogin: "آخر دخول",
        status: "الحالة",
        actions: "إجراءات",
      },
      authRole: {
        systemAdmin: "مدير المنصة",
        systemEmployee: "موظف منصة",
      },
      active: "نشط",
      inactive: "موقوف",
      view: "عرض",
      neverLoggedIn: "لم يدخل بعد",
      allowedCount: "{n} من {total}",
      invite: {
        title: "إضافة موظف منصة",
        subtitle: "املأ البيانات، حدد المسمى والصلاحيات لهذا الموظف",
        nameLabel: "الاسم",
        nationalIdLabel: "رقم الهوية",
        phoneLabel: "رقم الجوال",
        emailLabel: "البريد الإلكتروني",
        emailOptional: "اختياري",
        titleLabel: "المسمى الوظيفي",
        titleHint: "اكتب أي مسمى يناسب — لا يؤثر على الصلاحيات",
        authRoleLabel: "نوع الحساب",
        authRoleHint: "مدير المنصة يتجاوز كل الصلاحيات تلقائيًا. لكل بقية الموظفين، تتحكم المصفوفة أدناه.",
        permissionsLabel: "الصلاحيات",
        permissionsHint: "حدد ما يستطيع الموظف فعله على مستوى المنصة — كل صلاحية مستقلة",
        loadFromTemplate: "تحميل من قالب جاهز",
        addCta: "إضافة الموظف",
        cancel: "إلغاء",
      },
      detail: {
        back: "العودة لموظفي المنصة",
        personalInfo: "البيانات الشخصية",
        titleSection: "المسمى الوظيفي",
        titleLabel: "المسمى",
        authRoleSection: "نوع الحساب",
        permissionsSection: "الصلاحيات",
        permissionsHint: "صلاحيات هذا الموظف بشكل مستقل — يمكنك تعديل أي بند",
        activitySection: "النشاط",
        joinedAt: "تاريخ الإضافة",
        lastLogin: "آخر دخول",
        actions: "إجراءات",
        suspendBtn: "تعليق الموظف",
        reactivateBtn: "إعادة التفعيل",
        deleteBtn: "حذف الحساب",
        customized: "صلاحيات مخصصة",
        basedOnTemplate: "بدأت من قالب: {name}",
        saveChanges: "حفظ التعديلات",
        adminBypassHint: "مدير المنصة لديه كل الصلاحيات بشكل افتراضي — هذه المصفوفة للعرض فقط.",
      },
      permissionGroups: {
        offices: "المكاتب",
        subscriptions: "الاشتراكات والفواتير",
        team: "موظفو المنصة",
        settings: "الإعدادات",
        auditReports: "السجل والتقارير",
      },
      permissionActions: {
        viewOffices: "عرض المكاتب",
        registerOffice: "تسجيل مكتب جديد",
        extendTrial: "تمديد فترة التجربة",
        suspendOffice: "تعليق مكتب",
        reactivateOffice: "إعادة تفعيل مكتب",
        deleteOffice: "حذف مكتب",
        changeSubscriptionPlan: "تغيير خطة الاشتراك",
        issueInvoice: "إصدار فاتورة",
        recordSubscriptionPayment: "تسجيل دفعة اشتراك",
        viewPlatformEmployees: "عرض موظفي المنصة",
        managePlatformEmployees: "إدارة موظفي المنصة",
        manageSystemSettings: "إعدادات المنصة",
        sendGlobalAnnouncement: "إرسال إعلان عام",
        viewAudit: "عرض سجل العمليات",
        exportPlatformReports: "تصدير تقارير المنصة",
      },
    },
    audit: {
      title: "سجل عمليات النظام",
      subtitle: "كل ما حدث على مستوى المنصة",
      columns: {
        ts: "الوقت",
        actor: "بواسطة",
        action: "العملية",
        target: "المكتب",
        notes: "ملاحظات",
      },
      actions: {
        officeRegistered: "تسجيل مكتب جديد",
        trialExtended: "تمديد التجربة",
        officeSuspended: "تعليق مكتب",
        officeActivated: "تفعيل مكتب",
        employeeAdded: "إضافة موظف",
        settingChanged: "تغيير إعدادات",
      },
    },
    subscriptionStatus: {
      trial: "تجربة",
      active: "نشط",
      expired: "منتهي",
      suspended: "معلَّق",
    },
    plans: {
      title: "باقات الاشتراك",
      subtitle: "تحكَّم في المزايا والأسعار والمدد لكل باقة",
      addPlan: "+ إضافة باقة",
      activeBadge: "مفعَّلة",
      inactiveBadge: "متوقفة",
      featuresIncluded: "المزايا المضمَّنة",
      noFeatures: "لا توجد مزايا إضافية — يقتصر على الأساسيات",
      pricingTitle: "الأسعار",
      durationLabels: { 6: "٦ أشهر", 12: "سنة", 24: "سنتان" },
      perDuration: "لكل {duration}",
      currency: "ر.س",
      edit: "تعديل",
      backToPlans: "العودة للباقات",
      editorTitle: "تعديل الباقة",
      newPlanTitle: "إضافة باقة جديدة",
      nameLabel: "اسم الباقة",
      descriptionLabel: "الوصف",
      featuresSection: "المزايا",
      featuresHint: "فعِّل كل ميزة تريد إدراجها في هذه الباقة",
      pricingSection: "الأسعار",
      pricingHint: "حدد سعر الباقة لكل مدة (بالريال السعودي)",
      activeToggle: "الباقة متاحة للاشتراك",
      activeToggleHint: "عند الإيقاف، لن يتمكن مدير المكتب من اختيار هذه الباقة عند تجديد اشتراكه",
      save: "حفظ التغييرات",
      saved: "حُفظت التغييرات",
      cancel: "إلغاء",
      featureNames: {
        aiAssistant: "المساعد الذكي على الواتساب",
        ocr: "التعرف الضوئي على الإيصالات (OCR)",
        whatsappMessages: "رسائل الواتساب للعملاء",
        smsMessages: "رسائل SMS للعملاء",
      },
      featureHints: {
        aiAssistant: "يردّ على رسائل العملاء على الواتساب ويجيب عن الأقساط والمدفوعات تلقائيًا",
        ocr: "يقرأ إيصالات التحويل، الهويات والإقامات، وملفاتك القديمة عند نقل البيانات",
        whatsappMessages: "إرسال إشعارات تلقائية للعملاء عبر الواتساب (تذكير قسط، اعتماد دفع، …)",
        smsMessages: "إرسال إشعارات قصيرة عبر رسائل SMS للعملاء غير المفعّلين على الواتساب",
      },
      officeSubscription: {
        section: "الاشتراك الحالي",
        currentPlan: "الباقة",
        duration: "المدة",
        price: "السعر",
        startedAt: "تاريخ البدء",
        endsAt: "تاريخ الانتهاء",
        noPlan: "في فترة التجربة — لم تُختر باقة بعد",
        changePlan: "تغيير الباقة",
        pickPlan: "اختيار الباقة",
        pickDuration: "اختيار المدة",
        confirm: "تأكيد الاشتراك",
      },
    },
  },
  officeSubscription: {
    title: "اشتراك المكتب",
    subtitle: "اختر الباقة المناسبة لك وادفع بأي وسيلة دفع سعودية",
    trialBanner: {
      title: "أنت في الفترة التجريبية",
      remaining: "بقي {days} يوم من تجربتك المجانية",
      cta: "اشترك الآن",
    },
    currentPlan: {
      heading: "اشتراكك الحالي",
      onTrial: "في فترة التجربة — لم تختر باقة بعد",
      activePlan: "باقتك: {name} · {duration}",
      renews: "ينتهي في {date}",
    },
    compareHeading: "اختر باقتك",
    compareSubtitle: "كل المزايا مشروحة بالتفصيل — لو احتجت مساعدة، اسأل المساعد الذكي في الأسفل",
    durationToggle: {
      label: "اختر مدة الاشتراك",
      perMonth: "في الشهر",
    },
    saveBadge: "وفّر {pct}٪",
    chooseBtn: "اشترك في هذه الباقة",
    currentBadge: "باقتك الحالية",
    learnMore: "كيف تشتغل بالضبط؟",
    closeFeature: "إغلاق",
    scenarioHeading: "السيناريو",
    exampleHeading: "مثال حقيقي",
    checkout: {
      title: "إتمام الاشتراك",
      subtitle: "اختر وسيلة الدفع المناسبة لك",
      orderSummary: "ملخص الطلب",
      planRow: "الباقة",
      durationRow: "المدة",
      total: "الإجمالي",
      paymentMethod: "وسيلة الدفع",
      paymentMethodHint: "كل المعاملات محمية بأنظمة الدفع السعودية",
      payBtn: "ادفع {amount} ر.س",
      backToPlans: "العودة للباقات",
    },
    paymentMethods: {
      mada: "مدى",
      visa: "Visa",
      mastercard: "Mastercard",
      applePay: "Apple Pay",
      stcPay: "STC Pay",
      bankTransfer: "حوالة بنكية",
    },
    paymentMethodHints: {
      mada: "بطاقة مدى — الأكثر استخدامًا في السعودية",
      visa: "بطاقة Visa دولية",
      mastercard: "بطاقة Mastercard دولية",
      applePay: "ادفع بـ Apple Pay بضغطة واحدة",
      stcPay: "ادفع من محفظة STC Pay",
      bankTransfer: "حوّل من حسابك البنكي مباشرة (مدة الاعتماد: ١-٣ أيام)",
    },
    success: {
      title: "تم تفعيل اشتراكك بنجاح",
      subtitle: "شكرًا لك — كل المزايا فُعّلت لمكتبك",
      backHome: "العودة للوحة المكتب",
    },
    chat: {
      buttonLabel: "💬 اسأل عن الباقات",
      title: "مساعد الباقات",
      subtitle: "اسأل عن أي ميزة وراح أوضحها لك بمثال",
      placeholder: "اسأل عن الباقات أو المزايا…",
      send: "إرسال",
      welcome:
        "أهلًا 👋 أنا هنا أساعدك تختار الباقة المناسبة لمكتبك. اسألني عن أي ميزة، أو الفرق بين الباقتين، أو كيف يشتغل المساعد الذكي.",
      suggestions: [
        "ما الفرق بين الأساسية والاحترافية؟",
        "هل أحتاج المساعد الذكي؟",
        "كيف يشتغل OCR؟",
        "ما الفرق بين رسائل الواتساب وSMS؟",
      ],
      thinking: "جاري التفكير…",
      errorFallback:
        "تعذّر الاتصال بالمساعد الآن. خلني أعرض لك إجابة سريعة من معرفتي بالباقات.",
      promptedBy: "إجابة من المساعد الذكي",
    },
  },
  migration: {
    title: "الانتقال إلى مُقسِّط",
    subtitle: "ساعد فريقنا في نقل بيانات مكتبك القديمة خطوة بخطوة.",
    journeyTitle: "رحلة الانتقال",
    bannerTitle: "هل عندك بيانات قديمة تريد نقلها؟",
    bannerHint: "ساعدك خطوة بخطوة — إكسل، PDF، أو حتى صور — نتولى الباقي.",
    bannerCta: "ابدأ رحلة الانتقال",
    startCta: "ابدأ من هنا",
    resumeCta: "استكمل من حيث وقفت",
    skipStep: "تخطّي هذه الخطوة",
    backToOverview: "العودة للرحلة",
    nextStep: "الخطوة التالية",
    approveStep: "اعتماد هذه البيانات",
    steps: {
      investors: { title: "المستثمرون", subtitle: "بيانات شركاء رأس المال" },
      investmentContracts: { title: "عقود الاستثمار", subtitle: "ربط رأس المال بكل مستثمر" },
      customers: { title: "العملاء", subtitle: "بيانات عملاء التقسيط" },
      installmentContracts: { title: "عقود التقسيط", subtitle: "السلع المباعة بالتقسيط" },
      receipts: { title: "سندات القبض", subtitle: "كل ما دخل المكتب من أموال" },
      payments: { title: "سندات الصرف", subtitle: "كل ما خرج من المكتب من أموال" },
      review: { title: "المراجعة النهائية", subtitle: "اعتماد الانتقال إلى مُقسِّط" },
    },
    stepStatus: {
      notStarted: "لم تُبدأ",
      inProgress: "قيد المراجعة",
      completed: "مكتملة",
      skipped: "متخطّاة",
    },
    methodQuestion: "ما نوع الملفات المتوفرة لديك؟",
    methods: {
      excel: { label: "ملف Excel", hint: "تحليل دقيق — يستخرج كل الحقول تقريباً." },
      pdf: { label: "ملفات PDF", hint: "تحليل جيد — قد تحتاج بعض الحقول مراجعة." },
      screenshots: {
        label: "لقطات من نظامك الحالي",
        hint: "لو ما تقدر تصدّر بياناتك، ارفع لقطات من شاشات نظامك الحالي ونحاول استخراج المستثمرين والعقود والعملاء والسندات للمراجعة.",
      },
      scan: { label: "صور أو مسح ضوئي للأوراق", hint: "تحليل أوّلي — راجع الحقول المهمة." },
      manual: { label: "إدخال يدوي", hint: "ابدأ بسجل فارغ وأضف كل سجل بنفسك." },
    },
    uploadHint: "اسحب الملفات هنا أو اضغط للاختيار (نموذج تجريبي — لا يرفع ملفات حقيقية)",
    chooseFile: "اختيار ملف",
    analyzingTitle: "جاري تحليل بياناتك...",
    analyzingHint: "نقرأ الملفات ونستخرج السجلات. لحظات قليلة.",
    extractedCount: "تم التعرف على {n} سجلاً",
    reviewTableTitle: "راجع البيانات المُستخرجة",
    cellConfirmed: "مؤكد",
    cellNeedsReview: "يحتاج مراجعة",
    cellMissing: "ناقص",
    summaryConfirmed: "{n} مؤكدة",
    summaryNeedsReview: "{n} تحتاج مراجعة",
    summaryMissing: "{n} ناقصة",
    reconciliationTitle: "هل هذان نفس الشخص؟",
    reconciliationHint: "وجدنا تشابهاً بين بيانات استوردتها وبيانات موجودة في النظام.",
    samePerson: "نعم، نفس الشخص",
    differentPerson: "لا، أشخاص مختلفون",
    reconciliationDone: "تم الربط",
    finalReviewTitle: "كل شيء جاهز للانتقال",
    finalReviewHint: "راجع الأعداد قبل الاعتماد النهائي. تستطيع الرجوع لأي خطوة بالضغط عليها.",
    finalApprove: "اعتماد الانتقال إلى مُقسِّط",
    finalApproveConfirm: "سيُضاف ما اعتمدته إلى نظامك بشكل نهائي.",
    completedTitle: "أهلاً بك في مُقسِّط ✨",
    completedSubtitle: "تم نقل بياناتك بنجاح. مكتبك جاهز للعمل.",
    completedCount: "{n} سجل تم نقله",
    completedCta: "ابدأ استخدام النظام",
    columnLabels: {
      name: "الاسم",
      identityType: "نوع الهوية",
      identityNumber: "رقم الهوية",
      phone: "الجوال",
      email: "البريد",
      bank: "البنك",
      iban: "رقم الآيبان",
      investor: "المستثمر",
      capital: "رأس المال",
      officeProfit: "ربح المكتب",
      investorProfit: "ربح المستثمر",
      startDate: "تاريخ البداية",
      durationMonths: "المدة (شهر)",
      city: "المدينة",
      employer: "صاحب العمل",
      monthlySalary: "الراتب الشهري",
      customer: "العميل",
      product: "السلعة",
      cashPrice: "قيمة كاش",
      installmentPrice: "قيمة تقسيطاً",
      installmentsCount: "عدد الأقساط",
      fundedBy: "مموَّل من",
      date: "التاريخ",
      party: "الطرف",
      partyType: "نوع الطرف",
      amount: "المبلغ",
      method: "طريقة الدفع",
      description: "الوصف",
    },
  },
  purchaseStatus: {
    purchased: "تم الشراء",
    linkedToContract: "مرتبط بعقد",
    sold: "تم البيع",
  },
  financialHub: {
    title: "المالية",
    subtitle: "صندوق المكتب، السندات، والأرصدة — حركة بسيطة وواضحة.",
    cards: {
      receipts: { title: "سندات القبض", hint: "أقساط، إيداعات، إيرادات." },
      payments: { title: "سندات الصرف", hint: "مشتريات، أرباح، مصاريف." },
      cashLedger: { title: "حركة الصندوق", hint: "جميع الحركات الواردة والصادرة." },
      balances: { title: "الأرصدة", hint: "صندوق المكتب، المستثمرين، العملاء." },
      purchases: { title: "المشتريات", hint: "البضائع التي اشتراها المكتب." },
    },
    kpis: {
      cashBalance: "رصيد الصندوق الحالي",
      receiptsMonth: "قبض الشهر",
      paymentsMonth: "صرف الشهر",
      netMonth: "صافي الشهر",
    },
  },
  receipts: {
    pageTitle: "سندات القبض",
    pageSubtitle: "كل الأموال الواردة للمكتب — أقساط، إيداعات، إيرادات.",
    newReceipt: "+ سند قبض",
    columns: {
      number: "رقم السند",
      date: "التاريخ",
      party: "الطرف",
      from: "من",
      amount: "المبلغ",
      method: "الطريقة",
      status: "الحالة",
    },
    detail: {
      back: "→ سندات القبض",
      printVoucher: "طباعة السند",
      share: "مشاركة",
      markVerified: "اعتبار موثّقاً",
      verified: "موثّق",
      voucherInfo: "بيانات السند",
      payer: "الدافع",
      linkedContract: "العقد المرتبط",
      linkedInvestmentContract: "عقد الاستثمار المرتبط",
      reference: "رقم المرجع",
      notes: "ملاحظات",
      attachments: "المرفقات",
      attachmentsCount: "{n} مرفق",
      createdBy: "أنشأه",
      verifiedBy: "وثّقه",
      flagDuplicate: "⚠ رقم مرجع مكرر — يحتاج مراجعة",
    },
    form: {
      partyLabel: "نوع الطرف",
      partyHint: "اختر إذا كان الدفع من مستثمر أو عميل أو طرف آخر.",
      payerName: "اسم الدافع",
      payerNamePlaceholder: "اسم العميل أو المستثمر",
      amount: "المبلغ (ر.س)",
      methodLabel: "طريقة الدفع",
      reference: "رقم المرجع البنكي",
      referencePlaceholder: "اختياري — رقم تحويل، شيك، STC Pay",
      linkToContract: "العقد المرتبط",
      linkToContractPlaceholder: "اختر العقد...",
      notes: "ملاحظات",
      attachments: "المرفقات",
      attachmentsHint: "(نموذج تجريبي — لا يرفع ملفات حقيقية)",
      submit: "حفظ السند",
      cancel: "إلغاء",
      saveAndPrint: "حفظ وطباعة",
    },
  },
  paymentVouchers: {
    pageTitle: "سندات الصرف",
    pageSubtitle: "كل الأموال الصادرة من المكتب — مشتريات، أرباح، مصاريف.",
    newPayment: "+ سند صرف",
    needsApprovalBadge: "يحتاج موافقة",
    columns: {
      number: "رقم السند",
      date: "التاريخ",
      party: "الطرف",
      beneficiary: "المستفيد",
      amount: "المبلغ",
      method: "الطريقة",
      status: "الحالة",
    },
    detail: {
      back: "→ سندات الصرف",
      printVoucher: "طباعة السند",
      share: "مشاركة",
      markVerified: "اعتبار موثّقاً",
      voucherInfo: "بيانات السند",
      beneficiary: "المستفيد",
      linkedTo: "مرتبط بـ",
      reference: "رقم المرجع",
      notes: "ملاحظات",
      attachments: "المرفقات",
      createdBy: "أنشأه",
      pendingApproval: "⏳ بانتظار موافقة مدير المكتب",
    },
    form: {
      categoryLabel: "فئة الصرف",
      beneficiaryName: "اسم المستفيد",
      beneficiaryPlaceholder: "اسم المورد أو الموظف",
      amount: "المبلغ (ر.س)",
      methodLabel: "طريقة الدفع",
      reference: "رقم المرجع البنكي",
      linkLabel: "ربط بعقد / مستثمر / مشترى",
      linkPlaceholder: "اختياري — اختر العقد...",
      notes: "ملاحظات",
      attachments: "المرفقات",
      autoApprovalNote: "💡 المبلغ يفوق حد الموافقة التلقائية وسيُنشأ طلب موافقة عند الحفظ.",
      submit: "حفظ السند",
      cancel: "إلغاء",
    },
  },
  cashLedger: {
    pageTitle: "حركة الصندوق",
    pageSubtitle: "كل الأموال الداخلة والخارجة من صندوق المكتب — بترتيب زمني.",
    summary: {
      opening: "رصيد افتتاحي",
      totalIn: "إجمالي القبض",
      totalOut: "إجمالي الصرف",
      balance: "الرصيد الحالي",
    },
    filters: {
      all: "الكل",
      incoming: "وارد",
      outgoing: "صادر",
      cashOnly: "نقداً",
      bankOnly: "تحويل بنكي",
    },
    columns: {
      date: "التاريخ",
      voucher: "السند",
      description: "البيان",
      method: "الطريقة",
      employee: "الموظف",
      amount: "المبلغ",
      runningBalance: "الرصيد بعد الحركة",
    },
    empty: "لا توجد حركات في هذه الفئة.",
  },
  balances: {
    pageTitle: "الأرصدة",
    pageSubtitle: "نظرة سريعة على صندوق المكتب، رؤوس أموال المستثمرين، ومتبقيات العملاء.",
    officeCash: {
      title: "صندوق المكتب",
      hint: "الرصيد الحالي بعد كل الحركات.",
    },
    investorsSection: {
      title: "المستثمرون",
      hint: "رأس المال، الأرباح المستحقة، والمدفوع.",
      activeContracts: "{n} عقد نشط",
    },
    customersSection: {
      title: "العملاء",
      hint: "المتبقي على كل عميل من الأقساط النشطة.",
      activeContracts: "{n} عقد نشط",
    },
    columns: {
      name: "الاسم",
      capital: "رأس المال",
      profitDue: "أرباح مستحقة",
      paid: "مدفوع",
      net: "الصافي",
      remaining: "المتبقي",
      overdue: "متأخر",
    },
  },
  purchases: {
    pageTitle: "المشتريات",
    pageSubtitle: "بضائع وأصول اشتراها المكتب — تُربط لاحقاً بعقود التقسيط.",
    newPurchase: "+ مشترى جديد",
    columns: {
      number: "الرقم",
      date: "التاريخ",
      supplier: "المورد",
      description: "الوصف",
      amount: "المبلغ",
      status: "الحالة",
      linkedContract: "العقد المرتبط",
    },
    form: {
      supplier: "اسم المورد",
      description: "وصف البضاعة",
      amount: "المبلغ (ر.س)",
      method: "طريقة الدفع",
      notes: "ملاحظات",
      submit: "حفظ المشترى",
      cancel: "إلغاء",
    },
  },
  duplicate: {
    suspectedReference: "رقم مرجع مكرر",
    suspectedRefDetail: "هذا الرقم مستخدم في سند سابق — راجع قبل التوثيق.",
  },
};

const en: Dictionary = {
  appName: "Muqsit",
  nav: {
    operations: "Operations",
    dashboard: "Office",
    investments: "Investments",
    contracts: "Installments",
    clients: "Customers",
    investors: "Investors",
    collections: "Collections",
    approvals: "Approvals",
    permissions: "Roles & permissions",
    audit: "Audit log",
    investorPortal: "Investor portal",
    customerPortal: "Customer portal",
    financial: "Financial",
    documents: "Documents",
    reports: "Reports",
    settings: "Settings",
  },
  navGroups: {
    operations: "Operations",
    administration: "Administration",
    financial: "Financial",
    archive: "Archive",
    portals: "Portals",
    settings: "System",
  },
  pages: {
    operations: { title: "Operations center", description: "Today's work — approvals, overdues, proofs." },
    dashboard: { title: "Office", description: "Operational overview of the office." },
    investments: { title: "Investments", description: "Manage investment contracts with investors." },
    contracts: { title: "Installments", description: "Installment contracts with customers." },
    clients: { title: "Customers", description: "Manage customer records and profiles." },
    investors: { title: "Investors", description: "Track investors and their contributions." },
    collections: { title: "Collections", description: "Review and verify uploaded payment proofs." },
    approvals: { title: "Approvals", description: "Inbox of actions awaiting a decision." },
    permissions: { title: "Roles & permissions", description: "Preset roles that can be customized." },
    audit: { title: "Audit log", description: "Operational action history." },
    investorPortal: { title: "Investor portal", description: "Preview of the future investor portal." },
    customerPortal: { title: "Customer portal", description: "Preview of the future customer portal." },
    financial: { title: "Financial", description: "Financial operations and balances." },
    documents: { title: "Documents", description: "Document archive and files." },
    reports: { title: "Reports", description: "Reports and analytics." },
    settings: { title: "Settings", description: "Platform and account settings." },
  },
  auth: {
    loginTitle: "Sign in",
    loginSubtitle: "Enter your credentials to access the Muqsit platform.",
    email: "Email",
    password: "Password",
    signIn: "Sign in",
    selectTenantTitle: "Select organization",
    selectTenantSubtitle: "Choose the organization you want to manage.",
    continue: "Continue",
  },
  common: {
    theme: "Theme",
    language: "Language",
    logout: "Log out",
    account: "Account",
    comingSoon: "Coming soon",
    comingSoonHint: "This page is under construction and will be available in a later phase.",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    currency: "SAR",
    viewAll: "View all",
    review: "Review",
    open: "Open",
    distribute: "Allocate",
    today: "Today",
    daysAgo: "{n}d ago",
    daysLeft: "in {n}d",
    cancel: "Cancel",
    next: "Next",
    back: "Back",
    save: "Save",
    saving: "Saving...",
    none: "None",
    yes: "Yes",
    no: "No",
    optional: "optional",
    notes: "Notes",
  },
  investorType: { internal: "Internal", external: "External" },
  investorStatus: { active: "Active", inactive: "Inactive", suspended: "Suspended" },
  contractStatus: { active: "Active", ended: "Ended", pendingSetup: "Pending setup", cancelled: "Cancelled" },
  installmentContractStatus: {
    active: "Active",
    completed: "Completed",
    defaulted: "Defaulted",
    cancelled: "Cancelled",
  },
  installmentStatus: {
    scheduled: "Scheduled",
    partiallyPaid: "Partially paid",
    paid: "Paid",
    overdue: "Overdue",
    defaulted: "Defaulted",
  },
  riskClass: { low: "Low risk", medium: "Medium risk", high: "High risk" },
  paymentSource: {
    whatsapp_upload: "WhatsApp upload",
    bank_transfer: "Bank transfer",
    cash: "Cash",
  },
  proofStatus: {
    pending: "Pending review",
    approved: "Approved",
    rejected: "Rejected",
    needsClarification: "Needs clarification",
  },
  identityKind: {
    saudiIndividual: "Saudi NID",
    gccIndividual: "GCC ID",
    foreignIndividual: "Passport",
    commercialEntity: "Commercial Reg.",
  },
  identityFieldLabel: {
    nationalId: "National ID number",
    gccId: "GCC ID number",
    passport: "Passport number",
    cr: "Commercial Registration",
    country: "Country",
    nationality: "Nationality",
    entityName: "Entity name",
  },
  bank: { sectionTitle: "Bank account", bankName: "Bank name", iban: "IBAN", accountHolder: "Account holder" },
  dashboard: {
    title: "Office overview",
    subtitle: "Operations, collections and investor capital at a glance.",
    kpi: {
      collections: { label: "Collections this month", expected: "Expected", percent: "Collection rate" },
      overdue: {
        label: "Overdue installments",
        installments: "installments overdue",
        customers: "delayed customers",
      },
      activeContracts: {
        label: "Active contracts",
        totalValue: "Total value",
        unpaidBalance: "Remaining balance",
      },
      pendingContracts: {
        label: "Pending contracts",
        totalValue: "Total value",
        awaitingSignature: "awaiting signature",
      },
    },
    alerts: {
      title: "Smart alerts",
      subtitle: "Operational actions that need attention now",
      delay30: "{n} customers more than 30 days late",
      delay60: "{n} customer defaulted more than 60 days",
      pendingContracts: "{n} contracts awaiting action (signature or review)",
      recyclableInvestors: "{n} investors can fund a new contract from their balance",
      paymentDocs: "{n} payment documents to review",
    },
    profit: {
      title: "Office profit — this month",
      subtitle: "Broken down by income source",
      selfOwned: "Office-owned installment contracts",
      managementFee: "Management % on investor operations",
      goodsMargin: "Margin from selling goods to investors",
    },
    utilization: {
      title: "Active invested capital",
      subtitle: "Internal vs external and utilization",
      internal: "Internal (office)",
      external: "External",
      utilized: "Utilized",
      unutilized: "Unutilized",
    },
    cashMovement: {
      title: "Cash movement — this month",
      net: "Net this month",
      inflow: "Cash in",
      outflow: "Cash out",
      purchases: "Goods purchased",
      investorDisbursements: "Investor disbursements",
    },
    followup: {
      title: "Installment follow-up",
      subtitle: "Select a category to follow up with customers",
      tabs: { today: "Today", thisWeek: "This week", overdue: "Overdue", defaulted: "Defaulted 60+" },
      status: { dueToday: "Today", upcoming: "Upcoming", overdue: "Overdue", defaulted: "Defaulted" },
      empty: "No installments in this category.",
      columns: { customer: "Customer", amount: "Amount", due: "Due", status: "Status" },
    },
  },
  investors: {
    pageTitle: "Investors",
    pageSubtitle: "Overview of capital partners — internal and external.",
    newInvestor: "+ New investor",
    filters: { all: "All", internal: "Internal", external: "External" },
    searchPlaceholder: "Search by name or ID…",
    columns: {
      investor: "Investor",
      type: "Type",
      identity: "Identity",
      totalCapital: "Total capital",
      currentBalance: "Current balance",
      investedCapital: "Invested",
      realizedProfit: "Investor profit",
      activeContracts: "Contracts",
      status: "Status",
    },
    metric: {
      currentBalance: "Current balance",
      investedCapital: "Invested capital",
      realizedProfit: "Investor profit",
      activeContracts: "Active contracts",
    },
    recycling: {
      eligible: "You can create a new investment contract from this balance",
      cta: "Create new contract",
    },
    profile: {
      contactSection: "Contact information",
      detailsSection: "Investor details",
      contractsSection: "Investment contracts",
      termsSection: "Profit-sharing terms",
      activitySection: "Recent activity",
      totalCapitalLabel: "Historical total capital",
      joinedAt: "Investor since",
      noContracts: "No investment contracts yet.",
      noActivity: "No activity recorded yet.",
      viewContract: "View contract",
      newContract: "+ New contract",
      showMore: "Show more",
    },
    activityType: {
      receipt: "Receipt voucher",
      payment: "Payment voucher",
      profitDistribution: "Profit distribution",
      contract: "Investment contract",
      recycledContract: "Investment contract from balance",
    },
    wallet: {
      title: "Investor balance",
      lastActivity: "Last activity",
      newReceipt: "+ Receipt voucher",
      newPayment: "+ Payment voucher",
      viewMovements: "All movements",
    },
  },
  investments: {
    pageTitle: "Investment contracts",
    pageSubtitle: "Capital contracts with internal and external investors.",
    newContract: "+ New investment contract",
    filters: { all: "All", active: "Active", pendingSetup: "Pending setup", ended: "Ended" },
    columns: {
      number: "Contract no.",
      investor: "Investor",
      amount: "Amount",
      start: "Start",
      end: "End",
      ops: "Ops %",
      utilized: "Utilized",
      remaining: "Remaining",
      status: "Status",
    },
    details: {
      contractInfo: "Contract information",
      investor: "Investor",
      capitalUsage: "Capital usage",
      profitNotes: "Profit-sharing notes",
      recycling: {
        title: "Capital recycling",
        note: "Permission to automatically recycle collected installment funds back into new operations.",
        status: "Status",
        thresholdLabel: "Minimum threshold",
        noThreshold: "No minimum",
        enabled: "Allowed",
        disabled: "Not allowed",
      },
      linkedInstallments: "Linked installment contracts",
      linkedInstallmentsEmpty: "Installment contracts funded by this contract will appear here.",
      timeline: "Activity",
      amount: "Amount",
      start: "Start date",
      end: "End date",
      duration: "Duration",
      months: "months",
      operationPct: "Operation %",
      document: "Attached document",
      noDocument: "No document attached",
      viewInvestor: "View investor profile →",
      utilized: "Utilized",
      remaining: "Remaining",
      back: "← Contracts",
    },
    create: {
      pageTitle: "New investment contract",
      steps: { investor: "Investor", terms: "Terms", notes: "Notes & docs", review: "Review" },
      step1: {
        title: "Select investor",
        selectInvestor: "Investor",
        searchPlaceholder: "Choose an investor from the list",
        noneSelected: "No investor selected yet.",
        capitalSummary: "Capital summary",
      },
      step2: {
        title: "Contract terms",
        amount: "Contract amount (SAR)",
        startDate: "Start date",
        duration: "Duration",
        durationMonths: "months",
        endDate: "End date",
        endDateAuto: "Computed from start date + duration",
        operationPct: "Office operation (%)",
        operationPctInternalNote: "For internal investors the operation % is locked at 0%.",
        profitTitle: "Profit on this contract",
        profitHintExternal: "Enter the agreed profit amount each side will receive from this contract.",
        profitHintInternal: "Internal investor — the office keeps all profit. Enter the office's expected profit.",
        officeProfit: "Office expected profit (SAR)",
        investorProfit: "Investor expected profit (SAR)",
        investorProfitInternal: "Office profit from this contract (SAR)",
        totalProfit: "Total profit",
        officeShare: "Office share",
        investorShare: "Investor share",
      },
      step3: {
        title: "Preferences and documents",
        profitNotes: "Profit-sharing notes",
        profitNotesPlaceholder: "e.g. Net profit distributed monthly after operation fee.",
        recyclingToggle: "Allow capital recycling",
        recyclingNote:
          "Permission for the office to automatically recycle collected installment funds back into new operations, without asking the investor each time.",
        recyclingThreshold: "Minimum recycling threshold (SAR) — optional",
        recyclingThresholdHint:
          "The office begins recycling once collected funds reach this threshold. Leave empty to recycle with no minimum.",
        attachment: "Contract document",
        attachmentHint: "PDF or image — file is not actually uploaded in this prototype.",
        chooseFile: "Choose file",
        noFile: "No file chosen",
      },
      step4: {
        title: "Review the contract",
        subtitle: "Verify the details before saving.",
        investorBlock: "Investor",
        contractBlock: "Contract terms",
        notesBlock: "Notes & docs",
      },
      saved: "Contract saved",
    },
  },
  customers: {
    pageTitle: "Customers",
    pageSubtitle: "Customer pool and their installment contracts.",
    newCustomer: "+ New customer",
    filters: { all: "All", active: "Active", late: "Late", defaulted: "Defaulted" },
    columns: {
      customer: "Customer",
      identity: "Identity",
      mobile: "Mobile",
      city: "City",
      employer: "Employer",
      salary: "Salary",
      contracts: "Contracts",
      risk: "Risk",
    },
    profile: {
      bornOn: "Born",
      customerSince: "Customer since",
      contactSection: "Contact information",
      employmentSection: "Employment",
      addressSection: "Address",
      employer: "Employer",
      salary: "Monthly salary",
      obligations: "Obligations",
      noObligations: "No obligations",
      contractsSection: "Installment contracts",
      notesSection: "Notes",
      whatsapp: "WhatsApp conversation",
      newContract: "+ New installment contract",
      noContracts: "No installment contracts yet.",
    },
    create: {
      pageTitle: "New customer",
      identitySection: "Identity & basic info",
      identityKindLabel: "Identity type",
      identityNumber: "Identity / document number",
      fullName: "Full name",
      dob: "Date of birth",
      nationality: "Nationality",
      contactSection: "Contact & address",
      mobile: "Mobile number",
      city: "City",
      address: "Detailed address",
      employmentSection: "Employment",
      employer: "Employer",
      salary: "Monthly salary (SAR)",
      obligations: "Monthly obligations (SAR)",
      classificationSection: "Classification & notes",
      risk: "Internal risk classification",
      notes: "Internal notes",
      saved: "Customer saved",
    },
  },
  installmentContracts: {
    pageTitle: "Installment contracts",
    pageSubtitle: "Manage installment contracts with customers and installment statuses.",
    newContract: "+ New installment contract",
    filters: {
      all: "All",
      active: "Active",
      overdue: "Has overdue",
      defaulted: "Defaulted",
      completed: "Completed",
    },
    columns: {
      number: "Contract no.",
      customer: "Customer",
      product: "Product",
      installmentPrice: "Installment price",
      monthlyInstallment: "Monthly",
      installmentsCount: "Count",
      remainingBalance: "Remaining",
      status: "Status",
    },
    details: {
      back: "← Installment contracts",
      product: "Product",
      customer: "Customer",
      fundedBy: "Funded by",
      pricingSection: "Pricing & calculation",
      cashPrice: "Cash price",
      installmentPrice: "Installment price",
      downPayment: "Down payment",
      financingAmount: "Financing amount",
      monthlyInstallment: "Monthly installment",
      profitMargin: "Profit margin",
      profitMarginPct: "Margin %",
      remainingBalance: "Remaining balance",
      fundingSection: "Funding",
      fromInvestment: "From investment contract",
      investor: "Investor",
      capitalUtilized: "Capital utilized",
      scheduleSection: "Payment schedule",
      scheduleMonthsHint: "{n} months",
      timeline: "Activity",
      duration: "Duration",
      startDate: "Start date",
      endDate: "End date",
      months: "months",
    },
    schedule: {
      number: "#",
      dueDate: "Due",
      amount: "Amount",
      paid: "Paid",
      remaining: "Remaining",
      status: "Status",
      pay: "Pay",
    },
    create: {
      pageTitle: "New installment contract",
      steps: { customer: "Customer", product: "Product & price", funding: "Funding link", review: "Review" },
      step1: {
        title: "Select customer",
        selectCustomer: "Customer",
        searchPlaceholder: "Choose a customer from the list",
        noneSelected: "No customer selected yet.",
        riskNote: "Note: This customer is classified as high risk. Additional approval required.",
      },
      step2: {
        title: "Product & pricing",
        productType: "Product / item type",
        productTypeHint: "Free text — e.g. iPhone 15 Pro, A/C unit, laptop",
        cashPrice: "Cash price (SAR)",
        installmentPrice: "Installment price (SAR)",
        downPayment: "Down payment (SAR)",
        installmentsCount: "Number of installments",
        previewTitle: "Smart calculation preview",
        previewHint: "Values update instantly as you change inputs.",
      },
      step3: {
        title: "Link to investment contract",
        selectInvestor: "Investor",
        selectContract: "Investment contract",
        chosenSummary: "Selected contract summary",
        amountToUtilize: "Amount to utilize (SAR)",
        remainingAfter: "Available after linking",
        sufficient: "✓ Sufficient capital",
        notSufficient: "⚠ Insufficient capital — choose another contract or reduce the amount.",
      },
      step4: {
        title: "Review the contract",
        subtitle: "Verify the details before saving.",
        customerBlock: "Customer",
        productBlock: "Product & pricing",
        fundingBlock: "Funding",
      },
      saved: "Installment contract saved",
    },
    partialPayment: {
      title: "Record installment payment",
      subtitle: "Installment #{n} — {contract}",
      due: "Amount due",
      paidBefore: "Already paid",
      remaining: "Remaining",
      paymentAmount: "Payment amount (SAR)",
      source: "Source",
      attachReceipt: "Attach receipt",
      noFile: "No file chosen",
      note: "Note",
      submit: "Save payment",
    },
  },
  collections: {
    pageTitle: "Collections",
    pageSubtitle: "Inbox of uploaded payment proofs awaiting verification.",
    inboxCount: "Pending {n}",
    empty: "No proofs awaiting review.",
    columns: {
      customer: "Customer",
      contract: "Contract",
      amount: "Amount",
      reference: "Reference",
      uploadedAt: "Uploaded",
      flag: "Flag",
    },
    flags: {
      duplicate: "Duplicate reference",
      amountMismatch: "Amount mismatch",
      clean: "Clean match",
    },
    review: {
      back: "← Collections",
      headerTitle: "Review payment proof",
      forInstallment: "Installment #{n} of {contract}",
      receiptImageSection: "Receipt image",
      ocrSection: "AI / OCR extracted fields",
      ocrSubtitle: "Editable before recording the decision",
      ocrConfidence: "OCR confidence",
      duplicateBannerTitle: "⚠ This transfer reference may have been used before",
      duplicateBannerHint: "Last used on an earlier installment. Verify before approving.",
      duplicateView: "View earlier proof",
      comparisonSection: "Comparison with installment",
      expectedAmount: "Expected amount",
      customer: "Customer",
      dueDate: "Due date",
      transferDate: "Transfer date",
      paidEarly: "Paid before due date",
      paidOnTime: "Paid on time",
      paidLate: "Paid after due date",
      mismatch: "Mismatch",
      employeeNotes: "Employee notes",
      employeeNotesPlaceholder: "Add a note for the decision...",
      approve: "Approve",
      reject: "Reject",
      requestClarification: "Request clarification",
      ocrFields: {
        transferAmount: "Amount",
        senderName: "Sender",
        transferDate: "Transfer date",
        transferReference: "Reference",
        bankName: "Bank",
      },
      decisionRecorded: "Decision recorded",
    },
    whatsapp: {
      title: "WhatsApp conversation",
      subtitle: "Mock of the automated reminder + payment-proof flow",
      systemSender: "Muqsit office",
      customerSender: "Customer",
    },
  },
  permissionAction: {
    createInstallmentContract: "Create installment contract",
    editInstallments: "Edit installments",
    rescheduleContract: "Reschedule contract",
    deleteAttachment: "Delete attachment",
    closeContract: "Close contract",
    approvePaymentProof: "Approve payment proof",
    rejectPaymentProof: "Reject payment proof",
    recordPartialPayment: "Record partial payment",
    createCustomer: "Create customer",
    approveHighRiskCustomer: "Approve high-risk customer",
    createInvestmentContract: "Create investment contract",
    distributeProfits: "Distribute profits",
    exportReport: "Export report",
    managePermissions: "Manage permissions",
  },
  permissionGroup: {
    contracts: "Contracts",
    payments: "Payments",
    customers: "Customers",
    investors: "Investors",
    system: "System",
  },
  permissionState: { allow: "Allow", requireApproval: "Require approval", deny: "Deny" },
  approvalStatus: {
    pending: "Pending",
    approved: "Approved",
    rejected: "Rejected",
    needsClarification: "Needs clarification",
    escalated: "Escalated",
  },
  approvalPriority: { critical: "Critical", normal: "Normal", low: "Low" },
  notificationType: {
    overdueCustomer: "Overdue customer",
    newPaymentProof: "New payment proof",
    duplicateTransferReference: "Duplicate transfer reference",
    pendingApproval: "Pending approval",
    investorLowCapital: "Investor capital low",
    contractExpiring: "Contract expiring",
    ocrLowConfidence: "OCR confidence low",
    rescheduleRequest: "Reschedule request",
  },
  notificationPriority: { critical: "Critical", warning: "Warning", info: "Info" },
  operations: {
    pageTitle: "Today",
    pageSubtitle: "Only what needs action right now — nothing more.",
    cards: {
      overdue: {
        title: "Overdue installments",
        primary: "{n} customers",
        secondary: "{amount} SAR overdue",
        cta: "Review collections",
      },
      proofs: {
        title: "Proofs awaiting review",
        primary: "{n} proofs",
        secondary: "{m} with low OCR confidence",
        cta: "Open WhatsApp inbox",
      },
      approvals: {
        title: "Approvals pending",
        primary: "{n} requests",
        secondary: "{critical} critical",
        cta: "Review approvals",
      },
      recycle: {
        title: "Capital ready to recycle",
        primary: "{amount} SAR",
        secondary: "across {n} investors",
        cta: "Run now",
        empty: "No investor reached the recycling threshold today.",
      },
    },
    expiring: {
      title: "Investment contracts expiring soon",
      hint: "{n} contracts within 30 days",
      cta: "View",
      empty: "—",
    },
    emptyDay: "No actions today — quiet day.",
  },
  recycling: {
    badgeLabel: "Recycled",
    listTitle: "Capital ready to recycle",
    listSubtitle: "Pick an investor to create a new contract from the collected amount.",
    thresholdRule: "Shown here when collected installments cross the threshold the office agreed with the investor.",
    rowThresholdPill: "Threshold: {amount} SAR",
    rowAvailableLabel: "Collected",
    runNow: "Run now",
    empty: "No investor reached the recycling threshold today.",
    form: {
      pageTitle: "Recycle capital",
      contextLabel: "Investor",
      collectedLabel: "Collected amount",
      pctLabel: "Office percentage for this cycle",
      pctHint: "Between 0 and 100",
      pctPlaceholder: "—",
      financingLabel: "Available for financing (new contract principal)",
      officeShareLabel: "Office share",
      cancel: "Cancel",
      submit: "Run now",
      successTitle: "Recycled contract created",
      successHint: "The amount is now available for financing new installment contracts.",
      viewNew: "Open the new contract",
    },
    detail: {
      sectionTitle: "Recycling details",
      collectedRow: "Collected before percentage",
      officeShareRow: "Office share",
      financingRow: "Available for financing",
      timelineLabel: "Capital recycled",
    },
    investorPicker: {
      availableLabel: "Available for financing",
    },
  },
  officeSettings: {
    pageTitle: "Office settings",
    pageSubtitle: "Simple preferences for your office — set them once.",
    savedLabel: "Saved · {time}",
    sections: {
      identity: { title: "Office identity", hint: "The name that appears on receipts and reports." },
      contact: { title: "Contact details", hint: "Address and phone for customers and investors." },
      bankAccounts: { title: "Office bank accounts", hint: "Accounts that receive transfers from customers and investors." },
      investmentDefaults: { title: "Investment defaults", hint: "A value suggested when creating a new investment contract." },
      profitDistribution: { title: "Profit distribution policy", hint: "Used as the default for new investors." },
      notifications: { title: "Notification preferences", hint: "How you're alerted when something needs a decision." },
    },
    identity: {
      nameAr: "Office name (Arabic)",
      nameEn: "Office name (English)",
      logoLabel: "Logo",
      logoChoose: "Choose logo image",
      logoHint: "PNG or SVG — 256×256 recommended.",
      commercialRegistration: "Commercial Registration",
      taxNumber: "Tax Number",
      foundedAt: "Founded date",
    },
    contact: {
      phone: "Primary phone",
      email: "Email",
      city: "City",
      neighborhood: "Neighborhood",
      street: "Street / Address",
      website: "Website",
    },
    bankAccounts: {
      bankName: "Bank name",
      beneficiaryName: "Beneficiary name",
      iban: "IBAN",
      addAccount: "+ Add account",
      removeAccount: "Remove",
      accountIndex: "Account {n}",
      empty: "No bank accounts yet — add one to get started.",
    },
    investmentDefaults: {
      recyclingThreshold: "Default recycling threshold (SAR)",
      recyclingThresholdHint: "Suggested for new investment contracts. Can be overridden per contract.",
    },
    profitDistribution: {
      policy: "Default policy",
      policyOptions: {
        officeFirst: "Office first",
        investorFirst: "Investor first",
        proportional: "Proportional",
      },
      policyOptionHints: {
        officeFirst: "Office share is deducted first, then the rest goes to the investor.",
        investorFirst: "Investor receives their capital first, then the office share is taken from profit.",
        proportional: "Profit and share are split proportionally per the agreement.",
      },
      futureNote: "Used as the default for investors. Not yet consumed by distribution flows — coming later.",
    },
    notifications: {
      channels: "Notification channels",
      channelLabels: { whatsapp: "WhatsApp", sms: "SMS", email: "Email" },
      quietHoursStart: "Quiet hours start",
      quietHoursEnd: "Quiet hours end",
      quietHoursHint: "During these hours, non-urgent notifications are deferred.",
      alertTypes: "What triggers a notification",
      alertLabels: {
        overdueCustomer: "Overdue customer",
        newPaymentProof: "New proof to review",
        pendingApproval: "Pending approval",
        contractExpiring: "Contract about to end",
        lowOcrConfidence: "Low OCR confidence",
        investorLowCapital: "Investor capital running low",
      },
    },
  },
  approvals: {
    pageTitle: "Approvals",
    pageSubtitle: "Actions awaiting an Office Manager decision.",
    pendingCount: "{n} pending",
    filters: {
      all: "All",
      pending: "Pending",
      critical: "Critical",
      approved: "Approved",
      rejected: "Rejected",
    },
    columns: {
      type: "Action",
      requester: "Requested by",
      entity: "Related entity",
      priority: "Priority",
      ageHours: "Age",
      status: "Status",
    },
    empty: "No approvals in this filter.",
    review: {
      back: "← Approvals",
      requestedBy: "Requested by",
      requestedAt: "Requested at",
      actionDetails: "Action details",
      flags: "Flags",
      reason: "Requester's note",
      decision: "Decision",
      decisionNote: "Decision note",
      decisionNotePlaceholder: "Add a note…",
      approve: "Approve",
      reject: "Reject",
      requestClarification: "Request clarification",
      reminderBadge: "🔔 Reminder sent",
      escalatedBadge: "🚨 Escalated",
    },
  },
  notifications: {
    pageTitle: "Notifications center",
    pageSubtitle: "All system notifications in one place.",
    unread: "{n} unread",
    markAllRead: "Mark all read",
    bellTitle: "Notifications",
    seeAll: "See all notifications",
    filters: { all: "All", unread: "Unread", critical: "Critical", reminders: "Reminders" },
    empty: "No notifications.",
  },
  permissions: {
    pageTitle: "Roles & permissions",
    pageSubtitle: "Preset roles that can be customized. Each role defines what is allowed, requires approval, or denied.",
    newRole: "+ New role",
    presetBadge: "Preset",
    customBadge: "Custom",
    employeesLabel: "{n} employees",
    actionsCount: "{allow} allowed · {require} require approval · {deny} denied",
    role: {
      back: "← Roles",
      rename: "Rename",
      duplicate: "Duplicate",
      delete: "Delete",
      bypassToggle: "Trusted employees — bypass approvals",
      bypassNote: "When enabled for an employee, actions are executed directly without waiting for a decision.",
      saveChanges: "Save changes",
      saved: "Saved",
    },
  },
  audit: {
    pageTitle: "Audit log",
    pageSubtitle: "Operational action history — who, what, when, on whom.",
    filters: { all: "All", today: "Today", thisWeek: "This week" },
    actorLabel: "Employee",
    actionLabel: "Action",
    dateLabel: "Date",
    before: "Before",
    after: "After",
    today: "Today",
    yesterday: "Yesterday",
    empty: "No actions in this filter.",
  },
  portals: {
    brand: { investor: "Muqsit for investors", customer: "Muqsit for customers" },
    common: {
      welcomeBack: "Welcome back",
      seeAll: "See all",
      backToOffice: "Back to office system",
      upload: "Upload",
      pay: "Pay",
      download: "Download",
      share: "Share",
      print: "Print",
      next: "Next",
      today: "Today",
      overdue: "Overdue",
      paid: "Paid",
      scheduled: "Scheduled",
      partial: "Partial",
      pending: "Under review",
      approved: "Approved",
      rejected: "Rejected",
      monthly: "Monthly",
      yearly: "Annual",
      quarterly: "Quarterly",
      refNo: "Reference No.",
      poweredBy: "Powered by Muqsit",
      cancel: "Cancel",
      save: "Save",
      profile: "My profile",
      preferences: "Preferences",
      language: "Language",
      theme: "Theme",
      logout: "Sign out",
      contactSupport: "Contact the office",
      memberSince: "Member since",
      disclaimer: "Indicative estimate only — not a commitment by the office.",
      backToHome: "Back to home",
      empty: "Nothing here yet.",
    },
    tabs: {
      investor: {
        home: "Home",
        investments: "Investments",
        profits: "Profits",
        notifications: "Notifications",
        account: "Account",
      },
      customer: {
        home: "Home",
        installments: "Installments",
        payments: "Payments",
        notifications: "Notifications",
        account: "Account",
      },
    },
    investor: {
      dashboard: {
        greeting: "Hello, {name}",
        capitalCardLabel: "Your total capital",
        capitalCardSub: "Across {count} active contracts",
        utilizedShort: "Utilized",
        unutilizedShort: "Available",
        thisMonthLabel: "This month's profit",
        ytdLabel: "Year-to-date profit",
        activeContractsLabel: "Active contracts",
        nextDistributionLabel: "Next distribution",
        nextDistributionSub: "Estimated — due {date}",
        ctaSimulate: "Simulate capital growth",
        ctaStatement: "Statement",
        ctaInvestments: "View investments",
        activityTitle: "Recent activity",
        activityEmpty: "No activity yet.",
      },
      investments: {
        pageTitle: "My investments",
        countLabel: "{n} active",
        cardPrincipal: "Principal",
        cardUtilized: "Utilized",
        cardEnds: "Ends",
        recyclingOn: "Recycling on",
        recyclingOff: "No recycling",
        detail: {
          back: "Back",
          share: "Share",
          download: "Download contract",
          principal: "Principal",
          utilized: "Utilized",
          unutilized: "Available",
          startDate: "Start date",
          endDate: "End date",
          operationPct: "Office operation fee",
          recycling: "Capital recycling",
          recyclingMin: "Minimum threshold",
          profitTerms: "Profit terms",
          timelineTitle: "Contract activity",
          documentLabel: "Contract file",
        },
      },
      profits: {
        pageTitle: "My profits",
        ytdTotal: "Year-to-date total",
        lastDistribution: "Last distribution",
        nextDistribution: "Next distribution",
        historyTitle: "Distribution history",
        sourceContract: "from contract",
        noUpcoming: "No upcoming distribution scheduled yet.",
      },
      notifications: {
        pageTitle: "Notifications",
        filterAll: "All",
        filterUnread: "Unread",
        empty: "No notifications.",
      },
      account: {
        pageTitle: "Account",
        memberSince: "Investor since",
        sections: {
          profile: { title: "My details", hint: "Name, ID, contact, bank account." },
          statements: { title: "Statements", hint: "Monthly, quarterly and annual statements." },
          simulator: { title: "Growth simulation", hint: "Estimate the growth of your capital." },
          preferences: { title: "Preferences", hint: "Language, theme, notifications." },
          support: { title: "Contact the office", hint: "Call or WhatsApp the office team." },
        },
      },
      simulator: {
        pageTitle: "Capital growth simulation",
        subtitle: "Adjust the inputs to see the estimate. This is an estimate, not a promise.",
        inputs: {
          capital: "Capital",
          period: "Period",
          periodOptions: { sixM: "6 months", oneY: "1 year", twoY: "2 years", threeY: "3 years" },
          risk: "Investment style",
          riskOptions: {
            conservative: "Conservative",
            balanced: "Balanced",
            growth: "Growth",
          },
          reinvest: "Reinvest profits",
          reinvestHint: "Automatically reinvest monthly profits.",
        },
        outputs: {
          currentCapital: "Your current capital",
          expectedValue: "Expected value",
          cumulativeReturn: "Expected cumulative return",
          chartLabel: "Projected growth path",
        },
        disclaimer: "These figures are indicative only and not a commitment by the office. Actual results vary with operation performance.",
      },
      statements: {
        pageTitle: "Statements",
        pickPeriod: "Pick a period",
        periodOptions: { monthly: "Monthly", quarterly: "Quarterly", annual: "Annual" },
        downloadHint: "Use the browser print to save as PDF.",
        preview: {
          docTitle: "Investor statement",
          toLabel: "Issued to",
          forPeriod: "For period",
          investorIdLabel: "Investor ID",
          dateIssued: "Issue date",
          capitalSummary: "Capital summary",
          capitalRows: {
            principal: "Total capital",
            utilized: "Utilized in operations",
            unutilized: "Available for allocation",
          },
          distributionsTitle: "Distributions activity",
          colDate: "Date",
          colContract: "Contract",
          colGross: "Gross profit",
          colFee: "Office fee",
          colNet: "Net to investor",
          totalDistributed: "Total distributed",
          notes: "Notes",
          notesBody: "This statement summarizes activity for the period. Contact the office for any clarification.",
          signature: "Office seal",
          refNo: "Reference No.",
          printHint: "Use your browser's print to save a PDF copy.",
        },
      },
    },
    customer: {
      dashboard: {
        greeting: "Hello, {name}",
        nextInstallmentLabel: "Your next installment",
        nextInstallmentDueOn: "Due {date}",
        remainingLabel: "Remaining on your contract",
        paidLabel: "Paid so far",
        progressLabel: "{paid} of {total} installments",
        activeContractTitle: "Your active contract",
        ctaPayNow: "Pay now",
        ctaUploadProof: "Upload proof",
        ctaSchedule: "View installment schedule",
        paidUpStatus: "You're up to date — well done.",
        overdueAlertTitle: "You have an overdue installment",
        overdueAlertBody: "Please pay or upload your transfer proof today.",
        contractMeta: "{product} · Contract {number}",
      },
      installments: {
        pageTitle: "Installment schedule",
        contractLabel: "Contract {number} — {product}",
        summary: { total: "Contract total", paid: "Paid", remaining: "Remaining" },
        rowDue: "Due",
        rowUpload: "Upload proof",
        status: { paid: "Paid", overdue: "Overdue", scheduled: "Scheduled", partial: "Partial" },
      },
      payments: {
        pageTitle: "Payments",
        uploadCta: "Upload new proof",
        uploadHint: "Upload your bank transfer or STC Pay receipt and the office will review it.",
        recentTitle: "Your recent proofs",
        empty: "You haven't uploaded any proof yet.",
        proofStatus: { pending: "Under review", approved: "Approved", rejected: "Rejected" },
      },
      upload: {
        pageTitle: "Upload payment proof",
        pickInstallmentTitle: "Pick the installment",
        pickInstallmentHint: "Choose the installment you're paying.",
        installmentRowDue: "Due {date}",
        forInstallment: "For installment #{n} — due {date}",
        amount: "Transferred amount",
        method: "Payment method",
        methodOptions: { bankTransfer: "Bank transfer", stcPay: "STC Pay", cash: "Cash" },
        reference: "Transaction / Reference No.",
        referenceHint: "Optional — usually printed on the receipt.",
        uploadButton: "Choose receipt image",
        uploadedHint: "Image selected — ready to send.",
        notes: "Notes",
        submit: "Send for review",
        successTitle: "Proof received",
        successHint: "The office will review it and you'll get a notification with the result.",
        backToPayments: "Back to payments",
      },
      notifications: {
        pageTitle: "Notifications",
        filterAll: "All",
        filterUnread: "Unread",
        empty: "No notifications.",
      },
      account: {
        pageTitle: "Account",
        memberSince: "Customer since",
        sections: {
          profile: { title: "My details", hint: "Name, mobile, address." },
          documents: { title: "Contract documents", hint: "Contract copy and schedule, downloadable." },
          preferences: { title: "Preferences", hint: "Language, theme, notifications." },
          support: { title: "Contact the office", hint: "Call or WhatsApp the office team." },
        },
      },
      documents: {
        pageTitle: "Contract documents",
        contract: "Contract copy",
        schedule: "Installment schedule",
        receipts: "Approved receipts",
        empty: "No documents available.",
        download: "Download",
        contractDoc: "Installment contract",
        scheduleDoc: "Printable schedule",
      },
    },
  },
  searchPlaceholder: "Search…",
  paymentMethod: {
    cash: "Cash",
    bankTransfer: "Bank transfer",
    stcPay: "STC Pay",
    cheque: "Cheque",
    card: "Card",
  },
  voucherStatus: { draft: "Draft", verified: "Verified", cancelled: "Cancelled" },
  partyType: {
    investor: "Investor",
    customer: "Customer",
    other: "Other",
  },
  profitPolicy: {
    officeFirst: "Office first",
    investorFirst: "Investor first",
    proportional: "Proportional",
    useOfficeDefault: "Use office default",
    fromOfficeDefault: "Office default",
    fromInvestorOverride: "Investor-specific",
    recoveryTitle: "Collection split",
    officeRecovery: "Office share recovered",
    investorRecovery: "Investor share recovered",
    officeShort: "Office",
    investorShort: "Investor",
    eventsHint: "{n} splits applied on this contract",
    contractProfitTitle: "Contract profit",
    officeExpected: "Office expected profit",
    investorExpected: "Investor expected profit",
    investorPolicyLabel: "Profit distribution policy",
    investorPolicyHint: "Overrides the office default for this investor only.",
  },
  authFlow: {
    appName: "Muqsit",
    tagline: "Operational platform for installment offices",
    login: {
      title: "Sign in",
      hint: "Enter your phone number or email to continue",
      identifierLabel: "Phone or email",
      identifierPlaceholder: "5XXXXXXXX or email@example.com",
      passwordLabel: "Password",
      continueWithOtp: "Send verification code",
      continueWithPassword: "Continue with password",
      remember30: "Remember this device for 30 days",
      forgotPassword: "Forgot password?",
      newToMuqsit: "New to Muqsit?",
      registerCta: "Register your office for free",
    },
    otp: {
      title: "Enter verification code",
      hint: "We sent a 4-digit code to your phone",
      codeLabel: "Verification code",
      verifyCta: "Verify & enter",
      resend: "Resend code",
      resendIn: "Resend in {n} seconds",
      back: "Back",
    },
    register: {
      title: "Welcome to Muqsit",
      hint: "Create your office account in under a minute — 30-day free trial",
      step1Title: "Office details",
      step2Title: "Verify your phone",
      officeNameLabel: "Office name",
      crLabel: "Commercial registration",
      managerNameLabel: "Office manager name",
      managerNationalIdLabel: "Manager national ID",
      managerPhoneLabel: "Manager phone",
      managerEmailLabel: "Email",
      managerEmailOptional: "optional",
      continueCta: "Continue",
      passwordOptional: "Password (optional — you can use the verification code only)",
      finishCta: "Create account",
      backToLogin: "Already have an account? Sign in",
    },
    welcome: {
      title: "Welcome to Muqsit ✨",
      subtitle: "Your office account is ready. Choose how you'd like to start.",
      trialActive: "Free trial active — {n} days remaining",
      hasOldData: "I have old data to bring over",
      hasOldDataHint: "Excel, PDF, photos, or even screenshots from your previous system — we'll help you step by step",
      startMigration: "Start the migration journey",
      startFresh: "Start from scratch",
    },
    forgot: {
      title: "Recover password",
      hint: "Enter your phone number and we'll send you a verification code to reset your password",
      newPasswordLabel: "New password",
      confirmCta: "Save password",
    },
    trialBanner: {
      title: "🎁 Free trial",
      hint: "{n} days remaining in your trial",
      warningTitle: "⏰ Trial ending soon",
      warningHint: "Only {n} days left — contact us to upgrade",
      expiredTitle: "Your free trial has ended",
      expiredHint: "Contact the Muqsit team to activate your account and continue.",
      upgradeCta: "Upgrade subscription",
    },
    account: {
      title: "My account",
      subtitle: "Manage your personal information and security",
      profile: "Personal info",
      changePassword: "Change password",
      language: "Language",
      sessions: "Active devices",
      currentDevice: "Current device",
      revoke: "End session",
      logout: "Sign out",
      logoutAll: "Sign out everywhere",
    },
  },
  officeEmployees: {
    title: "Team",
    subtitle: "Invite your team — pick each person's title and permissions",
    inviteCta: "+ Invite member",
    filters: { all: "All", active: "Active", pending: "Pending", suspended: "Suspended" },
    searchPlaceholder: "Search by name or phone…",
    columns: {
      employee: "Member",
      role: "Title",
      phone: "Phone",
      lastLogin: "Last login",
      status: "Status",
      actions: "Actions",
    },
    inviteStatus: {
      pending: "Awaiting acceptance",
      accepted: "Accepted",
      expired: "Invitation expired",
    },
    activeBadge: "Active",
    suspendedBadge: "Suspended",
    pendingHint: "Invitation sent via SMS — member hasn't joined yet",
    view: "View",
    invite: {
      title: "Invite a team member",
      subtitle: "Fill in their details, pick a title and permissions — they'll get an SMS invite",
      nameLabel: "Member name",
      nationalIdLabel: "National ID",
      phoneLabel: "Phone",
      emailLabel: "Email",
      emailOptional: "optional",
      titleLabel: "Job title",
      titleHint: "Free text — doesn't affect permissions",
      permissionsLabel: "Permissions",
      permissionsHint: "Pick what this member can do — each permission is independent",
      loadFromTemplate: "Load from a template",
      sendInviteCta: "Send invitation",
      smsHint: "They'll receive an SMS with the invite link and a verification code",
      cancel: "Cancel",
    },
    detail: {
      back: "Back to team",
      personalInfo: "Personal info",
      titleSection: "Job title",
      titleLabel: "Title",
      permissionsSection: "Permissions",
      permissionsHint: "This member's permissions are independent — toggle anything",
      activitySection: "Activity",
      bypassApprovals: "Bypass approvals",
      bypassApprovalsHint: "This member can execute large amounts without approval",
      lastLogin: "Last login",
      neverLoggedIn: "Never logged in",
      joinedAt: "Joined",
      actions: "Actions",
      suspendBtn: "Suspend member",
      reactivateBtn: "Reactivate",
      resendInvite: "Resend invitation",
      deleteBtn: "Delete account",
      deleteConfirm: "Confirm deletion",
      customized: "Customized permissions",
      basedOnTemplate: "Started from template: {name}",
      saveChanges: "Save changes",
    },
    permissionGroups: {
      contracts: "Contracts",
      payments: "Payments",
      customers: "Customers",
      investors: "Investors",
      system: "System",
    },
    permissionActions: {
      createInstallmentContract: "Create installment contract",
      editInstallments: "Edit installments",
      rescheduleContract: "Reschedule contract",
      deleteAttachment: "Delete attachment",
      closeContract: "Close contract",
      approvePaymentProof: "Approve payment proof",
      rejectPaymentProof: "Reject payment proof",
      recordPartialPayment: "Record partial payment",
      createCustomer: "Create customer",
      approveHighRiskCustomer: "Approve high-risk customer",
      createInvestmentContract: "Create investment contract",
      distributeProfits: "Distribute profits",
      exportReport: "Export reports",
      managePermissions: "Manage permissions",
    },
    accept: {
      title: "Welcome to Muqsit",
      subtitle: "Enter the code sent to your phone to activate your account",
      enterOtp: "Verification code",
      setPassword: "Password",
      passwordOptional: "optional — you can use OTP every time instead",
      finishCta: "Activate & sign in",
      invalidLink: "Invitation link is invalid or expired.",
    },
  },
  admin: {
    shellTitle: "Platform · Muqsit",
    nav: {
      dashboard: "Platform dashboard",
      offices: "Offices",
      plans: "Plans",
      employees: "System staff",
      settings: "Platform settings",
      audit: "Audit log",
    },
    dashboard: {
      title: "Platform dashboard",
      subtitle: "Overview of registered offices and recent activity",
      kpis: {
        totalOffices: "Total offices",
        trial: "On trial",
        active: "Active subscriptions",
        expired: "Trial expired",
        suspended: "Suspended",
        newThisMonth: "New this month",
      },
      recentActivity: "Recent activity",
      noActivity: "No activity yet",
    },
    offices: {
      title: "Offices",
      subtitle: "Manage all offices registered on the platform",
      filters: {
        all: "All",
        trial: "Trial",
        active: "Active",
        expired: "Expired",
        suspended: "Suspended",
      },
      columns: {
        office: "Office",
        manager: "Manager",
        cr: "CR",
        subscription: "Subscription",
        registeredAt: "Registered",
        actions: "Actions",
      },
      daysLeft: "{n} days left",
      view: "View",
      empty: "No offices",
    },
    officeDetail: {
      back: "Back to offices",
      managerInfo: "Manager info",
      subscription: "Subscription",
      actions: "Actions",
      extendTrial: "Extend trial",
      activate: "Activate subscription",
      suspend: "Suspend office",
      reactivate: "Reactivate",
      extendDays: "Days to extend",
      extendConfirm: "Extend",
    },
    settings: {
      title: "Platform settings",
      subtitle: "Settings that apply to every office",
      defaultTrialDays: "Default trial period (days)",
      defaultTrialDaysHint: "Applied to new offices on registration",
      autoSuspendDays: "Auto-suspend after trial ends (days)",
      autoSuspendDaysHint: "Zero = never auto-suspend",
      allowSelfRegistration: "Allow office self-registration",
      allowSelfRegistrationHint: "When off, registration becomes invite-only",
      globalAnnouncement: "Global announcement (shown to all offices)",
      globalAnnouncementHint: "Leave empty to hide",
      save: "Save settings",
      saved: "Saved",
    },
    employees: {
      title: "Platform team",
      subtitle: "Add platform staff — pick each person's title and permissions",
      addEmployee: "+ Add staff",
      columns: {
        name: "Name",
        title: "Title",
        phone: "Phone",
        permissions: "Allowed permissions",
        lastLogin: "Last login",
        status: "Status",
        actions: "Actions",
      },
      authRole: {
        systemAdmin: "Platform admin",
        systemEmployee: "Platform staff",
      },
      active: "Active",
      inactive: "Inactive",
      view: "View",
      neverLoggedIn: "Never logged in",
      allowedCount: "{n} of {total}",
      invite: {
        title: "Add a platform staff member",
        subtitle: "Fill in their details, pick a title and permissions",
        nameLabel: "Name",
        nationalIdLabel: "National ID",
        phoneLabel: "Phone",
        emailLabel: "Email",
        emailOptional: "optional",
        titleLabel: "Job title",
        titleHint: "Free text — doesn't affect permissions",
        authRoleLabel: "Account type",
        authRoleHint:
          "Platform admin bypasses every permission automatically. For everyone else, the matrix below is the source of truth.",
        permissionsLabel: "Permissions",
        permissionsHint:
          "Pick what this staff member can do at the platform level — each permission is independent",
        loadFromTemplate: "Load from a template",
        addCta: "Add staff member",
        cancel: "Cancel",
      },
      detail: {
        back: "Back to platform team",
        personalInfo: "Personal info",
        titleSection: "Job title",
        titleLabel: "Title",
        authRoleSection: "Account type",
        permissionsSection: "Permissions",
        permissionsHint:
          "This staff member's permissions are independent — toggle anything",
        activitySection: "Activity",
        joinedAt: "Added",
        lastLogin: "Last login",
        actions: "Actions",
        suspendBtn: "Suspend",
        reactivateBtn: "Reactivate",
        deleteBtn: "Delete account",
        customized: "Customized permissions",
        basedOnTemplate: "Started from template: {name}",
        saveChanges: "Save changes",
        adminBypassHint:
          "Platform admins have every permission by default — this matrix is read-only for them.",
      },
      permissionGroups: {
        offices: "Offices",
        subscriptions: "Subscriptions & billing",
        team: "Platform team",
        settings: "Settings",
        auditReports: "Audit & reports",
      },
      permissionActions: {
        viewOffices: "View offices",
        registerOffice: "Register a new office",
        extendTrial: "Extend trial",
        suspendOffice: "Suspend an office",
        reactivateOffice: "Reactivate an office",
        deleteOffice: "Delete an office",
        changeSubscriptionPlan: "Change subscription plan",
        issueInvoice: "Issue an invoice",
        recordSubscriptionPayment: "Record a subscription payment",
        viewPlatformEmployees: "View platform staff",
        managePlatformEmployees: "Manage platform staff",
        manageSystemSettings: "Manage platform settings",
        sendGlobalAnnouncement: "Send a global announcement",
        viewAudit: "View audit log",
        exportPlatformReports: "Export platform reports",
      },
    },
    audit: {
      title: "Platform audit log",
      subtitle: "Everything that happened at the platform level",
      columns: {
        ts: "When",
        actor: "By",
        action: "Action",
        target: "Office",
        notes: "Notes",
      },
      actions: {
        officeRegistered: "Office registered",
        trialExtended: "Trial extended",
        officeSuspended: "Office suspended",
        officeActivated: "Office activated",
        employeeAdded: "Staff added",
        settingChanged: "Setting changed",
      },
    },
    subscriptionStatus: {
      trial: "Trial",
      active: "Active",
      expired: "Expired",
      suspended: "Suspended",
    },
    plans: {
      title: "Subscription plans",
      subtitle: "Control features, pricing, and durations for each plan",
      addPlan: "+ Add plan",
      activeBadge: "Available",
      inactiveBadge: "Paused",
      featuresIncluded: "Included features",
      noFeatures: "No premium features — core CRM only",
      pricingTitle: "Pricing",
      durationLabels: { 6: "6 months", 12: "1 year", 24: "2 years" },
      perDuration: "per {duration}",
      currency: "SAR",
      edit: "Edit",
      backToPlans: "Back to plans",
      editorTitle: "Edit plan",
      newPlanTitle: "Add a new plan",
      nameLabel: "Plan name",
      descriptionLabel: "Description",
      featuresSection: "Features",
      featuresHint: "Toggle each feature you want to include in this plan",
      pricingSection: "Pricing",
      pricingHint: "Set the plan's price for each duration (in SAR)",
      activeToggle: "Plan is available for subscription",
      activeToggleHint: "When off, office managers can't pick this plan at renewal time",
      save: "Save changes",
      saved: "Changes saved",
      cancel: "Cancel",
      featureNames: {
        aiAssistant: "WhatsApp AI assistant",
        ocr: "Bank receipt OCR",
        whatsappMessages: "WhatsApp messages to customers",
        smsMessages: "SMS messages to customers",
      },
      featureHints: {
        aiAssistant: "Replies to customer WhatsApp messages and answers installment / payment questions automatically",
        ocr: "Reads transfer receipts, IDs / iqamas, and old documents during data migration",
        whatsappMessages: "Auto-sends customer notifications via WhatsApp (installment reminders, payment confirmations, …)",
        smsMessages: "Sends short SMS notifications to customers who aren't on WhatsApp",
      },
      officeSubscription: {
        section: "Current subscription",
        currentPlan: "Plan",
        duration: "Duration",
        price: "Price",
        startedAt: "Started",
        endsAt: "Renews",
        noPlan: "On trial — no plan picked yet",
        changePlan: "Change plan",
        pickPlan: "Pick a plan",
        pickDuration: "Pick a duration",
        confirm: "Confirm subscription",
      },
    },
  },
  officeSubscription: {
    title: "Office subscription",
    subtitle: "Pick the plan that fits you and pay with any Saudi payment method",
    trialBanner: {
      title: "You're on the free trial",
      remaining: "{days} days left of your free trial",
      cta: "Subscribe now",
    },
    currentPlan: {
      heading: "Your current subscription",
      onTrial: "On trial — no plan picked yet",
      activePlan: "Your plan: {name} · {duration}",
      renews: "Renews {date}",
    },
    compareHeading: "Choose your plan",
    compareSubtitle:
      "Every feature is explained in detail — if you need help, ask the smart assistant below",
    durationToggle: { label: "Subscription duration", perMonth: "/ month" },
    saveBadge: "Save {pct}%",
    chooseBtn: "Subscribe to this plan",
    currentBadge: "Your current plan",
    learnMore: "How does it work?",
    closeFeature: "Close",
    scenarioHeading: "Scenario",
    exampleHeading: "Real example",
    checkout: {
      title: "Complete subscription",
      subtitle: "Pick your payment method",
      orderSummary: "Order summary",
      planRow: "Plan",
      durationRow: "Duration",
      total: "Total",
      paymentMethod: "Payment method",
      paymentMethodHint: "All transactions are protected by Saudi payment systems",
      payBtn: "Pay SAR {amount}",
      backToPlans: "Back to plans",
    },
    paymentMethods: {
      mada: "Mada",
      visa: "Visa",
      mastercard: "Mastercard",
      applePay: "Apple Pay",
      stcPay: "STC Pay",
      bankTransfer: "Bank transfer",
    },
    paymentMethodHints: {
      mada: "Mada card — the most-used card in Saudi Arabia",
      visa: "International Visa card",
      mastercard: "International Mastercard",
      applePay: "Pay with Apple Pay in one tap",
      stcPay: "Pay from your STC Pay wallet",
      bankTransfer: "Transfer directly from your bank (1–3 business days)",
    },
    success: {
      title: "Subscription activated",
      subtitle: "Thank you — all features are now enabled for your office",
      backHome: "Back to office dashboard",
    },
    chat: {
      buttonLabel: "💬 Ask about plans",
      title: "Plan assistant",
      subtitle: "Ask about any feature and I'll explain with examples",
      placeholder: "Ask about plans or features…",
      send: "Send",
      welcome:
        "Hi 👋 I'm here to help you pick the right plan for your office. Ask about any feature, the difference between plans, or how the smart assistant works.",
      suggestions: [
        "What's the difference between Basic and Pro?",
        "Do I really need the smart assistant?",
        "How does OCR work?",
        "WhatsApp messages vs SMS?",
      ],
      thinking: "Thinking…",
      errorFallback:
        "Couldn't reach the assistant right now. Here's a quick answer from my built-in knowledge.",
      promptedBy: "Answer from the smart assistant",
    },
  },
  migration: {
    title: "Move to Muqsit",
    subtitle: "We'll help your office bring its old data over, one step at a time.",
    journeyTitle: "Migration journey",
    bannerTitle: "Have old data to bring across?",
    bannerHint: "Excel, PDFs, or even photos — we walk you through it.",
    bannerCta: "Start the journey",
    startCta: "Start here",
    resumeCta: "Resume where you left off",
    skipStep: "Skip this step",
    backToOverview: "Back to journey",
    nextStep: "Next step",
    approveStep: "Approve this data",
    steps: {
      investors: { title: "Investors", subtitle: "Your capital partners" },
      investmentContracts: { title: "Investment contracts", subtitle: "Link capital to each investor" },
      customers: { title: "Customers", subtitle: "Your installment customers" },
      installmentContracts: { title: "Installment contracts", subtitle: "Items sold on installments" },
      receipts: { title: "Receipt vouchers", subtitle: "Money that came in" },
      payments: { title: "Payment vouchers", subtitle: "Money that went out" },
      review: { title: "Final review", subtitle: "Approve the migration" },
    },
    stepStatus: {
      notStarted: "Not started",
      inProgress: "In review",
      completed: "Done",
      skipped: "Skipped",
    },
    methodQuestion: "What kind of files do you have?",
    methods: {
      excel: { label: "Excel file", hint: "Cleanest extraction — almost every field captured." },
      pdf: { label: "PDF files", hint: "Good extraction — a few fields may need review." },
      screenshots: {
        label: "Screenshots from your current system",
        hint: "If you can't export your data, upload screenshots from your current system and we'll attempt to extract investors, contracts, customers, and vouchers for your review.",
      },
      scan: { label: "Photos or paper scans", hint: "Initial extraction — review the important fields." },
      manual: { label: "Manual entry", hint: "Start blank and add each record yourself." },
    },
    uploadHint: "Drop files here or click to choose (prototype — no real upload)",
    chooseFile: "Choose a file",
    analyzingTitle: "Analyzing your data...",
    analyzingHint: "Reading the files and extracting records. Just a moment.",
    extractedCount: "{n} records recognized",
    reviewTableTitle: "Review the extracted data",
    cellConfirmed: "Confirmed",
    cellNeedsReview: "Needs review",
    cellMissing: "Missing",
    summaryConfirmed: "{n} confirmed",
    summaryNeedsReview: "{n} need review",
    summaryMissing: "{n} missing",
    reconciliationTitle: "Are these the same person?",
    reconciliationHint: "We found a possible match between imported data and existing records.",
    samePerson: "Yes, same person",
    differentPerson: "No, different people",
    reconciliationDone: "Linked",
    finalReviewTitle: "Everything's ready",
    finalReviewHint: "Check the counts before final approval. Tap any step to revisit it.",
    finalApprove: "Approve migration",
    finalApproveConfirm: "What you approved will be added to your system permanently.",
    completedTitle: "Welcome to Muqsit ✨",
    completedSubtitle: "Your data is in. Your office is ready to go.",
    completedCount: "{n} records migrated",
    completedCta: "Start using Muqsit",
    columnLabels: {
      name: "Name",
      identityType: "ID type",
      identityNumber: "ID number",
      phone: "Phone",
      email: "Email",
      bank: "Bank",
      iban: "IBAN",
      investor: "Investor",
      capital: "Capital",
      officeProfit: "Office profit",
      investorProfit: "Investor profit",
      startDate: "Start date",
      durationMonths: "Duration (months)",
      city: "City",
      employer: "Employer",
      monthlySalary: "Monthly salary",
      customer: "Customer",
      product: "Product",
      cashPrice: "Cash price",
      installmentPrice: "Installment price",
      installmentsCount: "Installments",
      fundedBy: "Funded by",
      date: "Date",
      party: "Party",
      partyType: "Party type",
      amount: "Amount",
      method: "Method",
      description: "Description",
    },
  },
  purchaseStatus: {
    purchased: "Purchased",
    linkedToContract: "Linked to contract",
    sold: "Sold",
  },
  financialHub: {
    title: "Financial",
    subtitle: "Office cash, vouchers, and balances — simple and clear flow.",
    cards: {
      receipts: { title: "Receipt vouchers", hint: "Installments, deposits, income." },
      payments: { title: "Payment vouchers", hint: "Purchases, profit, expenses." },
      cashLedger: { title: "Cash movement", hint: "All incoming and outgoing entries." },
      balances: { title: "Balances", hint: "Office cash, investors, customers." },
      purchases: { title: "Purchases", hint: "Goods purchased by the office." },
    },
    kpis: {
      cashBalance: "Cash balance now",
      receiptsMonth: "Receipts (month)",
      paymentsMonth: "Payments (month)",
      netMonth: "Net (month)",
    },
  },
  receipts: {
    pageTitle: "Receipt vouchers",
    pageSubtitle: "All money received by the office — installments, deposits, income.",
    newReceipt: "+ New receipt",
    columns: {
      number: "Number",
      date: "Date",
      party: "Party",
      from: "From",
      amount: "Amount",
      method: "Method",
      status: "Status",
    },
    detail: {
      back: "← Receipts",
      printVoucher: "Print voucher",
      share: "Share",
      markVerified: "Mark verified",
      verified: "Verified",
      voucherInfo: "Voucher details",
      payer: "Payer",
      linkedContract: "Linked contract",
      linkedInvestmentContract: "Linked investment contract",
      reference: "Reference",
      notes: "Notes",
      attachments: "Attachments",
      attachmentsCount: "{n} attachment(s)",
      createdBy: "Created by",
      verifiedBy: "Verified by",
      flagDuplicate: "⚠ Duplicate reference — needs review",
    },
    form: {
      partyLabel: "Party type",
      partyHint: "Select whether this receipt is from an investor, customer, or other party.",
      payerName: "Payer name",
      payerNamePlaceholder: "Customer or investor name",
      amount: "Amount (SAR)",
      methodLabel: "Payment method",
      reference: "Bank reference",
      referencePlaceholder: "Optional — transfer no, cheque, STC Pay",
      linkToContract: "Linked contract",
      linkToContractPlaceholder: "Choose contract…",
      notes: "Notes",
      attachments: "Attachments",
      attachmentsHint: "(Prototype — no real upload)",
      submit: "Save voucher",
      cancel: "Cancel",
      saveAndPrint: "Save & print",
    },
  },
  paymentVouchers: {
    pageTitle: "Payment vouchers",
    pageSubtitle: "All money paid by the office — purchases, profit, expenses.",
    newPayment: "+ New payment",
    needsApprovalBadge: "Needs approval",
    columns: {
      number: "Number",
      date: "Date",
      party: "Party",
      beneficiary: "Beneficiary",
      amount: "Amount",
      method: "Method",
      status: "Status",
    },
    detail: {
      back: "← Payments",
      printVoucher: "Print voucher",
      share: "Share",
      markVerified: "Mark verified",
      voucherInfo: "Voucher details",
      beneficiary: "Beneficiary",
      linkedTo: "Linked to",
      reference: "Reference",
      notes: "Notes",
      attachments: "Attachments",
      createdBy: "Created by",
      pendingApproval: "⏳ Awaiting Office Manager approval",
    },
    form: {
      categoryLabel: "Payment category",
      beneficiaryName: "Beneficiary name",
      beneficiaryPlaceholder: "Supplier or employee name",
      amount: "Amount (SAR)",
      methodLabel: "Payment method",
      reference: "Bank reference",
      linkLabel: "Link to contract / investor / purchase",
      linkPlaceholder: "Optional — choose…",
      notes: "Notes",
      attachments: "Attachments",
      autoApprovalNote: "💡 Amount exceeds auto-approval; an approval request will be created on save.",
      submit: "Save voucher",
      cancel: "Cancel",
    },
  },
  cashLedger: {
    pageTitle: "Cash movement",
    pageSubtitle: "All money in and out of the office cash, chronologically.",
    summary: {
      opening: "Opening balance",
      totalIn: "Total in",
      totalOut: "Total out",
      balance: "Current balance",
    },
    filters: {
      all: "All",
      incoming: "Incoming",
      outgoing: "Outgoing",
      cashOnly: "Cash only",
      bankOnly: "Bank only",
    },
    columns: {
      date: "Date",
      voucher: "Voucher",
      description: "Description",
      method: "Method",
      employee: "Employee",
      amount: "Amount",
      runningBalance: "Running balance",
    },
    empty: "No movements in this filter.",
  },
  balances: {
    pageTitle: "Balances",
    pageSubtitle: "Quick view of office cash, investor capital, and customer remaining.",
    officeCash: {
      title: "Office cash",
      hint: "Current balance after all movements.",
    },
    investorsSection: {
      title: "Investors",
      hint: "Capital, profit due, and paid out.",
      activeContracts: "{n} active",
    },
    customersSection: {
      title: "Customers",
      hint: "Remaining on each customer's active installments.",
      activeContracts: "{n} active",
    },
    columns: {
      name: "Name",
      capital: "Capital",
      profitDue: "Profit due",
      paid: "Paid",
      net: "Net",
      remaining: "Remaining",
      overdue: "Overdue",
    },
  },
  purchases: {
    pageTitle: "Purchases",
    pageSubtitle: "Goods and assets purchased by the office — linked later to installment contracts.",
    newPurchase: "+ New purchase",
    columns: {
      number: "Number",
      date: "Date",
      supplier: "Supplier",
      description: "Description",
      amount: "Amount",
      status: "Status",
      linkedContract: "Linked contract",
    },
    form: {
      supplier: "Supplier name",
      description: "Goods description",
      amount: "Amount (SAR)",
      method: "Payment method",
      notes: "Notes",
      submit: "Save purchase",
      cancel: "Cancel",
    },
  },
  duplicate: {
    suspectedReference: "Duplicate reference",
    suspectedRefDetail: "This reference appears on a previous voucher — review before verifying.",
  },
};

export const dictionaries: Record<Locale, Dictionary> = { ar, en };

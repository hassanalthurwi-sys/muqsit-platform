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
      unutilizedCapital: string;
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
    columns: {
      investor: string;
      type: string;
      identity: string;
      totalCapital: string;
      utilized: string;
      unutilized: string;
      activeContracts: string;
      status: string;
    };
    profile: {
      contactSection: string;
      capitalSection: string;
      contractsSection: string;
      termsSection: string;
      activitySection: string;
      joinedAt: string;
      noContracts: string;
      viewContract: string;
      newContract: string;
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
}

const ar: Dictionary = {
  appName: "مُقسِط",
  nav: {
    dashboard: "لوحة المكتب",
    investments: "عقود الاستثمار",
    contracts: "عقود التقسيط",
    clients: "العملاء",
    investors: "المستثمرون",
    collections: "التحصيلات",
    financial: "المالية",
    documents: "المستندات",
    reports: "التقارير",
    settings: "الإعدادات",
  },
  navGroups: {
    operations: "العمليات",
    financial: "المالية",
    archive: "الأرشيف",
    settings: "النظام",
  },
  pages: {
    dashboard: { title: "لوحة المكتب", description: "نظرة عامة على تشغيل المكتب." },
    investments: { title: "عقود الاستثمار", description: "إدارة عقود الاستثمار مع المستثمرين." },
    contracts: { title: "عقود التقسيط", description: "عقود التقسيط مع العملاء." },
    clients: { title: "العملاء", description: "إدارة سجلات العملاء وملفاتهم." },
    investors: { title: "المستثمرون", description: "متابعة المستثمرين ومساهماتهم." },
    collections: { title: "التحصيلات", description: "مراجعة إيصالات الدفع وتأكيدها." },
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
      unutilizedCapital: "{amount} رأس مال مستثمر غير مستخدم",
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
    columns: {
      investor: "المستثمر",
      type: "النوع",
      identity: "الهوية",
      totalCapital: "رأس المال",
      utilized: "المُستخدم",
      unutilized: "غير المُستخدم",
      activeContracts: "العقود",
      status: "الحالة",
    },
    profile: {
      contactSection: "معلومات الاتصال",
      capitalSection: "ملخص رأس المال",
      contractsSection: "عقود الاستثمار",
      termsSection: "شروط المشاركة في الأرباح",
      activitySection: "النشاط الأخير",
      joinedAt: "مستثمر منذ",
      noContracts: "لا توجد عقود استثمار حالياً.",
      viewContract: "عرض العقد",
      newContract: "+ عقد جديد",
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
};

const en: Dictionary = {
  appName: "Muqsit",
  nav: {
    dashboard: "Office",
    investments: "Investments",
    contracts: "Installments",
    clients: "Clients",
    investors: "Investors",
    collections: "Collections",
    financial: "Financial",
    documents: "Documents",
    reports: "Reports",
    settings: "Settings",
  },
  navGroups: { operations: "Operations", financial: "Financial", archive: "Archive", settings: "System" },
  pages: {
    dashboard: { title: "Office", description: "Operational overview of the office." },
    investments: { title: "Investments", description: "Manage investment contracts with investors." },
    contracts: { title: "Installments", description: "Installment contracts with customers." },
    clients: { title: "Clients", description: "Manage client records and profiles." },
    investors: { title: "Investors", description: "Track investors and their contributions." },
    collections: { title: "Collections", description: "Review and verify uploaded payment proofs." },
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
      unutilizedCapital: "{amount} unutilized investor capital",
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
    columns: {
      investor: "Investor",
      type: "Type",
      identity: "Identity",
      totalCapital: "Capital",
      utilized: "Utilized",
      unutilized: "Unutilized",
      activeContracts: "Contracts",
      status: "Status",
    },
    profile: {
      contactSection: "Contact information",
      capitalSection: "Capital summary",
      contractsSection: "Investment contracts",
      termsSection: "Profit-sharing terms",
      activitySection: "Recent activity",
      joinedAt: "Investor since",
      noContracts: "No investment contracts yet.",
      viewContract: "View contract",
      newContract: "+ New contract",
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
};

export const dictionaries: Record<Locale, Dictionary> = { ar, en };

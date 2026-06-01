import type { NavGroupKey, NavKey } from "@/lib/nav";

export type Locale = "ar" | "en";

export interface PageCopy {
  title: string;
  description: string;
}

export type FollowupTab = "today" | "thisWeek" | "overdue" | "defaulted";
export type FollowupStatus = "dueToday" | "upcoming" | "overdue" | "defaulted";
export type IdentityKindKey = "saudiIndividual" | "gccIndividual" | "foreignIndividual" | "commercialEntity";
export type InvestorStatusKey = "active" | "inactive" | "suspended";
export type ContractStatusKey = "active" | "ended" | "pendingSetup" | "cancelled";
export type InvestorTypeKey = "internal" | "external";

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
  };
  investorType: Record<InvestorTypeKey, string>;
  investorStatus: Record<InvestorStatusKey, string>;
  contractStatus: Record<ContractStatusKey, string>;
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
  bank: {
    sectionTitle: string;
    bankName: string;
    iban: string;
    accountHolder: string;
  };
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
      goodsMarginNotes: string;
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
        goodsMarginNotes: string;
        goodsMarginNotesPlaceholder: string;
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
}

const ar: Dictionary = {
  appName: "مُقسِط",
  nav: {
    dashboard: "لوحة المكتب",
    investments: "عقود الاستثمار",
    contracts: "العقود",
    clients: "العملاء",
    investors: "المستثمرون",
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
    contracts: { title: "العقود", description: "إدارة عقود التقسيط." },
    clients: { title: "العملاء", description: "إدارة سجلات العملاء وملفاتهم." },
    investors: { title: "المستثمرون", description: "متابعة المستثمرين ومساهماتهم." },
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
    save: "حفظ العقد",
    saving: "جاري الحفظ...",
    none: "لا يوجد",
  },
  investorType: { internal: "داخلي", external: "خارجي" },
  investorStatus: { active: "نشط", inactive: "غير نشط", suspended: "متوقف" },
  contractStatus: {
    active: "نشط",
    ended: "منتهي",
    pendingSetup: "قيد الإعداد",
    cancelled: "ملغى",
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
      activeContracts: { label: "العقود النشطة", totalValue: "إجمالي القيمة", unpaidBalance: "الرصيد المتبقي" },
      pendingContracts: { label: "عقود قيد التفعيل", totalValue: "إجمالي القيمة", awaitingSignature: "بانتظار التوقيع" },
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
      tabs: { today: "اليوم", thisWeek: "هذا الأسبوع", overdue: "متأخرة", defaulted: "متعثرة 60+ يوم" },
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
      goodsMarginNotes: "ملاحظات هامش بيع البضائع",
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
        title: "ملاحظات ومستندات",
        profitNotes: "ملاحظات تقاسم الأرباح",
        profitNotesPlaceholder: "مثال: صافي الربح يوزّع شهرياً بعد خصم نسبة العمليات.",
        goodsMarginNotes: "ملاحظات هامش بيع البضائع",
        goodsMarginNotesPlaceholder: "مثال: البضائع تباع بهامش 1.5% فوق التكلفة.",
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
};

const en: Dictionary = {
  appName: "Muqsit",
  nav: {
    dashboard: "Office",
    investments: "Investments",
    contracts: "Contracts",
    clients: "Clients",
    investors: "Investors",
    financial: "Financial",
    documents: "Documents",
    reports: "Reports",
    settings: "Settings",
  },
  navGroups: {
    operations: "Operations",
    financial: "Financial",
    archive: "Archive",
    settings: "System",
  },
  pages: {
    dashboard: { title: "Office", description: "Operational overview of the office." },
    investments: { title: "Investments", description: "Manage investment contracts with investors." },
    contracts: { title: "Contracts", description: "Manage installment contracts." },
    clients: { title: "Clients", description: "Manage client records and profiles." },
    investors: { title: "Investors", description: "Track investors and their contributions." },
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
    save: "Save contract",
    saving: "Saving...",
    none: "None",
  },
  investorType: { internal: "Internal", external: "External" },
  investorStatus: { active: "Active", inactive: "Inactive", suspended: "Suspended" },
  contractStatus: { active: "Active", ended: "Ended", pendingSetup: "Pending setup", cancelled: "Cancelled" },
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
  bank: {
    sectionTitle: "Bank account",
    bankName: "Bank name",
    iban: "IBAN",
    accountHolder: "Account holder",
  },
  dashboard: {
    title: "Office overview",
    subtitle: "Operations, collections and investor capital at a glance.",
    kpi: {
      collections: { label: "Collections this month", expected: "Expected", percent: "Collection rate" },
      overdue: { label: "Overdue installments", installments: "installments overdue", customers: "delayed customers" },
      activeContracts: { label: "Active contracts", totalValue: "Total value", unpaidBalance: "Remaining balance" },
      pendingContracts: { label: "Pending contracts", totalValue: "Total value", awaitingSignature: "awaiting signature" },
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
      goodsMarginNotes: "Goods margin notes",
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
        title: "Notes and documents",
        profitNotes: "Profit-sharing notes",
        profitNotesPlaceholder: "e.g. Net profit distributed monthly after operation fee.",
        goodsMarginNotes: "Goods margin notes",
        goodsMarginNotesPlaceholder: "e.g. Goods sold at 1.5% over cost.",
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
};

export const dictionaries: Record<Locale, Dictionary> = { ar, en };

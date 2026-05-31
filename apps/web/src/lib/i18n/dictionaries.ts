import type { NavGroupKey, NavKey } from "@/lib/nav";

export type Locale = "ar" | "en";

export interface PageCopy {
  title: string;
  description: string;
}

export type FollowupTab = "today" | "thisWeek" | "overdue" | "defaulted";
export type FollowupStatus = "dueToday" | "upcoming" | "overdue" | "defaulted";

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
  };
  investorType: {
    internal: string;
    external: string;
  };
  dashboard: {
    title: string;
    subtitle: string;
    kpi: {
      collections: {
        label: string;
        expected: string;
        percent: string;
      };
      overdue: {
        label: string;
        installments: string;
        customers: string;
      };
      activeContracts: {
        label: string;
        totalValue: string;
        unpaidBalance: string;
      };
      pendingContracts: {
        label: string;
        totalValue: string;
        awaitingSignature: string;
      };
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
      columns: {
        customer: string;
        amount: string;
        due: string;
        status: string;
      };
    };
  };
}

export const dictionaries: Record<Locale, Dictionary> = {
  ar: {
    appName: "مُقسِط",
    nav: {
      dashboard: "لوحة المكتب",
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
      contracts: { title: "العقود", description: "إدارة عقود الاستثمار والتقسيط." },
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
    },
    investorType: {
      internal: "داخلي",
      external: "خارجي",
    },
    dashboard: {
      title: "لوحة المكتب",
      subtitle: "نظرة عامة على العمليات والتحصيلات والمستثمرين.",
      kpi: {
        collections: {
          label: "تحصيلات الشهر",
          expected: "المتوقع",
          percent: "نسبة التحصيل",
        },
        overdue: {
          label: "الأقساط المتأخرة",
          installments: "قسط متأخر",
          customers: "عميل متأخر",
        },
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
        status: {
          dueToday: "اليوم",
          upcoming: "قادم",
          overdue: "متأخر",
          defaulted: "متعثر",
        },
        empty: "لا توجد أقساط في هذه الفئة.",
        columns: {
          customer: "العميل",
          amount: "المبلغ",
          due: "الاستحقاق",
          status: "الحالة",
        },
      },
    },
  },
  en: {
    appName: "Muqsit",
    nav: {
      dashboard: "Office",
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
      contracts: { title: "Contracts", description: "Manage investment and installment contracts." },
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
    },
    investorType: {
      internal: "Internal",
      external: "External",
    },
    dashboard: {
      title: "Office overview",
      subtitle: "Operations, collections and investor capital at a glance.",
      kpi: {
        collections: {
          label: "Collections this month",
          expected: "Expected",
          percent: "Collection rate",
        },
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
        tabs: {
          today: "Today",
          thisWeek: "This week",
          overdue: "Overdue",
          defaulted: "Defaulted 60+",
        },
        status: {
          dueToday: "Today",
          upcoming: "Upcoming",
          overdue: "Overdue",
          defaulted: "Defaulted",
        },
        empty: "No installments in this category.",
        columns: {
          customer: "Customer",
          amount: "Amount",
          due: "Due",
          status: "Status",
        },
      },
    },
  },
};

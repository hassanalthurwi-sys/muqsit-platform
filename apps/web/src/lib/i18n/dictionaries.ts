import type { NavGroupKey, NavKey } from "@/lib/nav";

export type Locale = "ar" | "en";

export interface PageCopy {
  title: string;
  description: string;
}

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
    thisMonth: string;
    ofExpected: string;
    deployed: string;
    daysAgo: string;
    daysLeft: string;
    today: string;
  };
  investorType: {
    internal: string;
    external: string;
    splitTitle: string;
  };
  dashboard: {
    eyebrow: string;
    title: string;
    subtitle: string;
    kpi: {
      collections: string;
      collectionsHint: string;
      overdue: string;
      overdueHint: string;
      activeContracts: string;
      activeContractsHint: string;
      pendingContracts: string;
      pendingContractsHint: string;
      investmentSplit: string;
      investmentSplitHint: string;
      cashMovement: string;
      cashMovementHint: string;
    };
    lateCustomers: {
      title: string;
      hint: string;
    };
    cashMovement: {
      inflow: string;
      outflow: string;
      net: string;
    };
    upcoming: {
      title: string;
      subtitle: string;
      empty: string;
      status: {
        overdue: string;
        dueToday: string;
        upcoming: string;
      };
    };
  };
}

export const dictionaries: Record<Locale, Dictionary> = {
  ar: {
    appName: "مُقسِط",
    nav: {
      dashboard: "لوحة التحكم",
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
      dashboard: { title: "لوحة التحكم", description: "نظرة عامة على نشاط منصتك." },
      contracts: { title: "العقود", description: "إدارة عقود الاستثمار والاتفاقيات." },
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
      thisMonth: "هذا الشهر",
      ofExpected: "من المتوقع",
      deployed: "مُستثمر",
      daysAgo: "منذ {n} يوم",
      daysLeft: "خلال {n} يوم",
      today: "اليوم",
    },
    investorType: {
      internal: "داخلي",
      external: "خارجي",
      splitTitle: "توزيع الاستثمارات",
    },
    dashboard: {
      eyebrow: "لوحة المكتب",
      title: "نظرة عامة على العمليات",
      subtitle: "ملخص يومي للتحصيلات والعقود والاستثمارات.",
      kpi: {
        collections: "تحصيلات هذا الشهر",
        collectionsHint: "من المتوقع",
        overdue: "الأقساط المتأخرة",
        overdueHint: "قسط متأخر",
        activeContracts: "العقود النشطة",
        activeContractsHint: "إجمالي قيمة العقود",
        pendingContracts: "عقود قيد التفعيل",
        pendingContractsHint: "بانتظار التوقيع أو المراجعة",
        investmentSplit: "الاستثمارات النشطة",
        investmentSplitHint: "داخلي مقابل خارجي",
        cashMovement: "حركة النقد الشهرية",
        cashMovementHint: "صافي هذا الشهر",
      },
      lateCustomers: {
        title: "{n} عملاء متأخرون عن السداد",
        hint: "تحتاج إلى متابعة وإعادة جدولة",
      },
      cashMovement: {
        inflow: "وارد",
        outflow: "صادر",
        net: "صافي",
      },
      upcoming: {
        title: "الأقساط القادمة",
        subtitle: "أقرب خمسة استحقاقات",
        empty: "لا توجد أقساط قادمة هذا الأسبوع.",
        status: {
          overdue: "متأخر",
          dueToday: "اليوم",
          upcoming: "قادم",
        },
      },
    },
  },
  en: {
    appName: "Muqsit",
    nav: {
      dashboard: "Dashboard",
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
      dashboard: { title: "Dashboard", description: "Overview of your platform activity." },
      contracts: { title: "Contracts", description: "Manage investment contracts and agreements." },
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
      thisMonth: "this month",
      ofExpected: "of expected",
      deployed: "deployed",
      daysAgo: "{n}d ago",
      daysLeft: "in {n}d",
      today: "today",
    },
    investorType: {
      internal: "Internal",
      external: "External",
      splitTitle: "Investment mix",
    },
    dashboard: {
      eyebrow: "Office",
      title: "Operations overview",
      subtitle: "Daily summary of collections, contracts and investments.",
      kpi: {
        collections: "Collections this month",
        collectionsHint: "of expected",
        overdue: "Overdue installments",
        overdueHint: "installments overdue",
        activeContracts: "Active contracts",
        activeContractsHint: "total contract value",
        pendingContracts: "Pending contracts",
        pendingContractsHint: "awaiting signature or review",
        investmentSplit: "Active investments",
        investmentSplitHint: "internal vs external",
        cashMovement: "Monthly cash movement",
        cashMovementHint: "net this month",
      },
      lateCustomers: {
        title: "{n} late customers",
        hint: "Need follow-up and rescheduling",
      },
      cashMovement: {
        inflow: "Inflow",
        outflow: "Outflow",
        net: "Net",
      },
      upcoming: {
        title: "Upcoming installments",
        subtitle: "Next five due",
        empty: "No upcoming installments this week.",
        status: {
          overdue: "Overdue",
          dueToday: "Today",
          upcoming: "Upcoming",
        },
      },
    },
  },
};

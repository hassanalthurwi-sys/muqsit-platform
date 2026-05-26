import type { NavKey } from "@/lib/nav";

export type Locale = "ar" | "en";

export interface PageCopy {
  title: string;
  description: string;
}

export interface Dictionary {
  appName: string;
  nav: Record<NavKey, string>;
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
  };
  dashboard: {
    kpiContracts: string;
    kpiClients: string;
    kpiInvestors: string;
    kpiAum: string;
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
    },
    dashboard: {
      kpiContracts: "العقود النشطة",
      kpiClients: "إجمالي العملاء",
      kpiInvestors: "المستثمرون",
      kpiAum: "الأصول المُدارة",
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
    },
    dashboard: {
      kpiContracts: "Active contracts",
      kpiClients: "Total clients",
      kpiInvestors: "Investors",
      kpiAum: "Assets under management",
    },
  },
};

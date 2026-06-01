// Sprint 2 prototype — domain types live alongside mock data.
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
  goodsMarginNotes: string;
  documentName?: string;
  timeline: ActivityItem[];
  linkedInstallmentContractIds: string[];
}

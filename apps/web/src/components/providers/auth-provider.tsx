"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import type { UserRole, SubscriptionStatus } from "@/lib/mock/types";

const AUTH_KEY = "muqsit_auth";
const TENANT_KEY = "muqsit_tenant";
const SESSION_KEY = "muqsit_session";

const DEFAULT_TRIAL_DAYS = 30;

export interface Tenant {
  id: string;
  name: string;
}

export interface SessionUser {
  id: string;
  name: string;
  phone: string;
  email?: string;
  role: UserRole;
  officeId?: string;
  investorId?: string;
  customerId?: string;
}

export interface SessionOffice {
  id: string;
  name: string;
  cr?: string;
  subscriptionStatus: SubscriptionStatus;
  trialStartedAt?: string;
  trialEndsAt?: string;
}

interface AuthContextValue {
  ready: boolean;
  isAuthenticated: boolean;
  tenant: Tenant | null;
  user: SessionUser | null;
  office: SessionOffice | null;
  login: (email: string) => void;
  loginAs: (user: SessionUser, office?: SessionOffice) => void;
  selectTenant: (tenant: Tenant) => void;
  logout: () => void;
  registerOffice: (input: {
    name: string;
    cr: string;
    phone: string;
    email?: string;
  }) => SessionOffice;
  daysLeftInTrial: () => number | null;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function safeRead<T>(key: string): T | null {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function safeWrite<T>(key: string, value: T) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* ignore */
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [user, setUser] = useState<SessionUser | null>(null);
  const [office, setOffice] = useState<SessionOffice | null>(null);

  useEffect(() => {
    setIsAuthenticated(window.localStorage.getItem(AUTH_KEY) === "true");
    const storedTenant = window.localStorage.getItem(TENANT_KEY);
    if (storedTenant) {
      try {
        setTenant(JSON.parse(storedTenant) as Tenant);
      } catch {
        setTenant(null);
      }
    }
    const session = safeRead<{ user: SessionUser; office?: SessionOffice }>(SESSION_KEY);
    if (session) {
      setUser(session.user);
      if (session.office) setOffice(session.office);
    }
    setReady(true);
  }, []);

  const login = useCallback((email: string) => {
    const sessionUser: SessionUser = {
      id: "user-default",
      name: email.split("@")[0] || "مدير المكتب",
      phone: "+966 5XX XXX XXXX",
      email,
      role: "officeManager",
      officeId: "office-default",
    };
    const sessionOffice: SessionOffice = {
      id: "office-default",
      name: "مكتب مُقسِط",
      subscriptionStatus: "active",
    };
    window.localStorage.setItem(AUTH_KEY, "true");
    safeWrite(SESSION_KEY, { user: sessionUser, office: sessionOffice });
    setIsAuthenticated(true);
    setUser(sessionUser);
    setOffice(sessionOffice);
  }, []);

  const loginAs = useCallback(
    (sessionUser: SessionUser, sessionOffice?: SessionOffice) => {
      window.localStorage.setItem(AUTH_KEY, "true");
      safeWrite(SESSION_KEY, { user: sessionUser, office: sessionOffice });
      setIsAuthenticated(true);
      setUser(sessionUser);
      if (sessionOffice) setOffice(sessionOffice);
    },
    [],
  );

  const selectTenant = useCallback((next: Tenant) => {
    window.localStorage.setItem(TENANT_KEY, JSON.stringify(next));
    setTenant(next);
  }, []);

  const logout = useCallback(() => {
    window.localStorage.removeItem(AUTH_KEY);
    window.localStorage.removeItem(TENANT_KEY);
    window.localStorage.removeItem(SESSION_KEY);
    setIsAuthenticated(false);
    setTenant(null);
    setUser(null);
    setOffice(null);
  }, []);

  const registerOffice = useCallback(
    (input: { name: string; cr: string; phone: string; email?: string }) => {
      const now = new Date();
      const ends = new Date(now);
      ends.setDate(ends.getDate() + DEFAULT_TRIAL_DAYS);
      const newOffice: SessionOffice = {
        id: `office-${Date.now().toString(36)}`,
        name: input.name,
        cr: input.cr,
        subscriptionStatus: "trial",
        trialStartedAt: now.toISOString(),
        trialEndsAt: ends.toISOString(),
      };
      const newUser: SessionUser = {
        id: `user-${Date.now().toString(36)}`,
        name: "مدير المكتب",
        phone: input.phone,
        email: input.email,
        role: "officeManager",
        officeId: newOffice.id,
      };
      window.localStorage.setItem(AUTH_KEY, "true");
      safeWrite(SESSION_KEY, { user: newUser, office: newOffice });
      const t: Tenant = { id: newOffice.id, name: newOffice.name };
      window.localStorage.setItem(TENANT_KEY, JSON.stringify(t));
      setIsAuthenticated(true);
      setTenant(t);
      setUser(newUser);
      setOffice(newOffice);
      return newOffice;
    },
    [],
  );

  const daysLeftInTrial = useCallback((): number | null => {
    if (!office || office.subscriptionStatus !== "trial" || !office.trialEndsAt) {
      return null;
    }
    const end = new Date(office.trialEndsAt).getTime();
    const now = Date.now();
    return Math.max(0, Math.ceil((end - now) / (1000 * 60 * 60 * 24)));
  }, [office]);

  return (
    <AuthContext.Provider
      value={{
        ready,
        isAuthenticated,
        tenant,
        user,
        office,
        login,
        loginAs,
        selectTenant,
        logout,
        registerOffice,
        daysLeftInTrial,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}

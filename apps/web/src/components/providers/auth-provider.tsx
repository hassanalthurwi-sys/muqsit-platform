"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";

const AUTH_KEY = "muqsit_auth";
const TENANT_KEY = "muqsit_tenant";

export interface Tenant {
  id: string;
  name: string;
}

interface AuthContextValue {
  ready: boolean;
  isAuthenticated: boolean;
  tenant: Tenant | null;
  login: (email: string) => void;
  selectTenant: (tenant: Tenant) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [tenant, setTenant] = useState<Tenant | null>(null);

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
    setReady(true);
  }, []);

  const login = useCallback((_email: string) => {
    // Mock auth only: no credential validation, no backend.
    window.localStorage.setItem(AUTH_KEY, "true");
    setIsAuthenticated(true);
  }, []);

  const selectTenant = useCallback((next: Tenant) => {
    window.localStorage.setItem(TENANT_KEY, JSON.stringify(next));
    setTenant(next);
  }, []);

  const logout = useCallback(() => {
    window.localStorage.removeItem(AUTH_KEY);
    window.localStorage.removeItem(TENANT_KEY);
    setIsAuthenticated(false);
    setTenant(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{ ready, isAuthenticated, tenant, login, selectTenant, logout }}
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

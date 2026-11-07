"use client";

import { createContext, useContext, useState, useSyncExternalStore, type ReactNode } from "react";

export type UserRole = "apprenant" | "formateur" | "consultant" | "expert" | "admin";

export type SubscriptionStatus = "free" | "active";

export interface Subscription {
  status: SubscriptionStatus;
  planId: string | null;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  subscription: Subscription;
}

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  subscriptionStatus: SubscriptionStatus;
  login: (email: string, password: string) => Promise<User | null>;
  logout: () => void;
  register: (name: string, email: string, password: string) => Promise<void>;
  activateSubscription: (planId: string) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const SESSION_KEY = "sap_academy_session";
const SESSION_COOKIE_NAME = "sap_academy_session";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

function subscribeToSession() {
  return () => {};
}

let cachedUser: User | null = null;

function getSessionSnapshot(): User | null {
  if (typeof window === "undefined") return null;
  if (cachedUser) return cachedUser;
  const stored = localStorage.getItem(SESSION_KEY);
  if (!stored) return null;
  try {
    cachedUser = JSON.parse(stored) as User;
  } catch {
    cachedUser = null;
  }
  return cachedUser;
}

function getServerSessionSnapshot(): User | null {
  return null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const user = useSyncExternalStore(subscribeToSession, getSessionSnapshot, getServerSessionSnapshot);
  const [, setVersion] = useState(0);

  const rerender = () => {
    setVersion((version) => version + 1);
  };

  const activateSubscription = (planId: string) => {
    if (!cachedUser) return;
    cachedUser = { ...cachedUser, subscription: { status: "active", planId } };
    localStorage.setItem(SESSION_KEY, JSON.stringify(cachedUser));
    if (typeof document !== "undefined") {
      document.cookie = `${SESSION_COOKIE_NAME}=1; path=/; max-age=${SESSION_MAX_AGE_SECONDS}; samesite=lax`;
    }
    rerender();
  };

  const login = async (email: string, password: string): Promise<User | null> => {
    if (!email || !password) {
      throw new Error("Email et mot de passe requis.");
    }
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok || !data.token) {
      throw new Error("Email ou mot de passe incorrect.");
    }
    const user: User = {
      id: String(data.id),
      name: data.name ?? email,
      email,
      role: (data.role as UserRole) ?? "apprenant",
      subscription: { status: "free", planId: null },
    };
    cachedUser = user;
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    if (typeof document !== "undefined") {
      document.cookie = `${SESSION_COOKIE_NAME}=1; path=/; max-age=${SESSION_MAX_AGE_SECONDS}; samesite=lax`;
    }
    rerender();
    return user;
  };

  const logout = () => {
    cachedUser = null;
    localStorage.removeItem(SESSION_KEY);
    if (typeof document !== "undefined") {
      document.cookie = `${SESSION_COOKIE_NAME}=; path=/; max-age=0; samesite=lax`;
    }
    rerender();
  };

  const register = async (name: string, email: string, password: string) => {
    if (!name || !email || !password) {
      throw new Error("Tous les champs sont requis.");
    }
    if (password.length < 6) {
      throw new Error("Le mot de passe doit contenir au moins 6 caractères.");
    }
    cachedUser = { id: `u-${Date.now()}`, name, email, role: "apprenant", subscription: { status: "free", planId: null } };
    localStorage.setItem(SESSION_KEY, JSON.stringify(cachedUser));
    rerender();
  };

  const subscriptionStatus = user?.subscription.status ?? "free";

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, subscriptionStatus, activateSubscription, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}

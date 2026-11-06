"use client";

import { createContext, useContext, useState, useSyncExternalStore, type ReactNode } from "react";

export type UserRole = "apprenant" | "formateur" | "consultant" | "expert" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (name: string, email: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const SESSION_KEY = "sap_academy_session";

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

  const login = async (email: string, password: string) => {
    if (!email || !password) {
      throw new Error("Email et mot de passe requis.");
    }
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) throw new Error("Identifiants invalides.");
    const data = await res.json();
    cachedUser = { id: String(data.id ?? "u-1"), name: email, email, role: data.role ?? "apprenant" };
    localStorage.setItem(SESSION_KEY, JSON.stringify(cachedUser));
    document.cookie = "sap_academy_session=1; path=/; max-age=604800";
    rerender();
  };

  const logout = () => {
    cachedUser = null;
    localStorage.removeItem(SESSION_KEY);
    document.cookie = "sap_academy_session=; path=/; max-age=0";
    rerender();
  };

  const register = async (name: string, email: string, password: string) => {
    if (!name || !email || !password) {
      throw new Error("Tous les champs sont requis.");
    }
    if (password.length < 6) {
      throw new Error("Le mot de passe doit contenir au moins 6 caractères.");
    }
    cachedUser = { id: `u-${Date.now()}`, name, email, role: "apprenant" };
    localStorage.setItem(SESSION_KEY, JSON.stringify(cachedUser));
    rerender();
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, register }}>
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

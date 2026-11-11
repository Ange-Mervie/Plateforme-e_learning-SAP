"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { UserRole } from "@/lib/auth/types";

export type { UserRole } from "@/lib/auth/types";

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
  emailVerified: boolean;
}

function isUserRole(role: unknown): role is UserRole {
  return ["apprenant", "formateur", "consultant", "expert", "admin"].includes(String(role));
}

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  subscriptionStatus: SubscriptionStatus;
  login: (email: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<{ user: User; emailVerification?: { required: boolean; code: string; message: string } }>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function toUser(value: unknown): User | null {
  if (!value || typeof value !== "object") return null;
  const candidate = value as Partial<User>;
  if (
    (typeof candidate.id !== "number" && typeof candidate.id !== "string") ||
    typeof candidate.name !== "string" ||
    typeof candidate.email !== "string" ||
    !isUserRole(candidate.role)
  ) {
    return null;
  }
  return {
    id: String(candidate.id),
    name: candidate.name,
    email: candidate.email,
    role: candidate.role,
    subscription: {
      status: candidate.subscription?.status === "active" ? "active" : "free",
      planId: candidate.subscription?.planId ?? null,
    },
    emailVerified: Boolean(candidate.emailVerified),
  };
}

async function readJsonResponse(response: Response): Promise<Record<string, unknown>> {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = typeof data.error === "string" ? data.error : "internal_error";
    if (error === "invalid") throw new Error("Email ou mot de passe incorrect.");
    if (error === "exists") throw new Error("Un compte avec cet email existe déjà.");
    if (error === "unauthorized") throw new Error("Votre session a expiré. Reconnectez-vous.");
    if (error === "forbidden") throw new Error("Accès refusé.");
    if (error === "missing") throw new Error("Email et mot de passe requis.");
    if (error === "unverified") throw new Error("Votre email n'a pas encore été confirmé. Vérifiez votre boîte de réception.");
    throw new Error(error);
  }
  return data as Record<string, unknown>;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshSession = useCallback(async () => {
    const response = await fetch("/api/auth/session", { credentials: "same-origin" });
    const data = await readJsonResponse(response);
    setUser(toUser(data.user));
  }, []);

  useEffect(() => {
    let active = true;
    fetch("/api/auth/session", { credentials: "same-origin" })
      .then(readJsonResponse)
      .then((data) => {
        if (active) setUser(toUser(data.user));
      })
      .catch((error: unknown) => {
        console.error("[Auth] Unable to resolve the current session:", error);
        if (active) setUser(null);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<User> => {
    if (!email.trim() || !password) {
      throw new Error("Email et mot de passe requis.");
    }
    const response = await fetch("/api/auth/login", {
      method: "POST",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await readJsonResponse(response);
    const nextUser = toUser(data.user);
    if (!nextUser) throw new Error("Réponse de connexion invalide.");
    setUser(nextUser);
    return nextUser;
  }, []);

  const register = useCallback(async (name: string, email: string, password: string): Promise<{ user: User; emailVerification?: { required: boolean; code: string; message: string } }> => {
    if (!name.trim() || !email.trim() || !password) {
      throw new Error("Tous les champs sont requis.");
    }
    if (password.length < 6) {
      throw new Error("Le mot de passe doit contenir au moins 6 caractères.");
    }
    const response = await fetch("/api/auth/register", {
      method: "POST",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await readJsonResponse(response);
    const nextUser = toUser(data.user);
    if (!nextUser) throw new Error("Réponse d’inscription invalide.");
    setUser(nextUser);
    return {
      user: nextUser,
      emailVerification: (data.emailVerification as { required: boolean; code: string; message: string } | undefined),
    };
  }, []);

  const logout = useCallback(async () => {
    const response = await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "same-origin",
    });
    await readJsonResponse(response);
    setUser(null);
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    user,
    isAuthenticated: !!user,
    loading,
    subscriptionStatus: user?.subscription.status ?? "free",
    login,
    logout,
    register,
    refreshSession,
  }), [user, loading, login, logout, register, refreshSession]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

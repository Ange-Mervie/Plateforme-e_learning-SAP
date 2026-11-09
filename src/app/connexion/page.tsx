"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { useLanguage } from "@/context/language-context";
import { Lock, Mail, ArrowRight, ShieldCheck } from "lucide-react";

export default function Connexion() {
  const { login } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();
  const [email, setEmail] = useState("jean.dupont@example.com");
  const [password, setPassword] = useState("demo123");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email.trim() || !password) {
      setError(t("connexion.required"));
      return;
    }
    setLoading(true);
    try {
      await login(email, password);
      router.push("/apprenant");
    } catch (err) {
      setError(err instanceof Error ? err.message : t("connexion.error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center bg-white px-6 py-20">
      <div className="text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-navy text-sm font-bold text-white shadow-md">
          SAP
        </div>
        <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-navy">
          {t("connexion.title")}
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Accédez à votre espace de formation SAP Learning Academy
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <div>
          <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-navy">
            {t("connexion.email")}
          </label>
          <div className="relative mt-1">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="votre.email@domaine.com"
              className="h-11 w-full rounded-xl border border-slate-300 pl-9 pr-3 text-sm text-navy outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="block text-xs font-bold uppercase tracking-wider text-navy">
              {t("connexion.password")}
            </label>
            <Link
              href="/mot-de-passe-oublie"
              className="text-xs font-semibold text-primary hover:text-primary-dark"
            >
              {t("connexion.forgotPassword")}
            </Link>
          </div>
          <div className="relative mt-1">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="h-11 w-full rounded-xl border border-slate-300 pl-9 pr-3 text-sm text-navy outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>

        {error ? (
          <div className="rounded-lg bg-red-50 p-3 text-xs font-semibold text-red-600">
            {error}
          </div>
        ) : null}

        <button
          type="submit"
          disabled={loading}
          className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary text-sm font-bold text-white shadow-md hover:bg-primary-dark transition-all disabled:opacity-60"
        >
          <span>{loading ? "Connexion en cours..." : t("connexion.submit")}</span>
          <ArrowRight className="h-4 w-4" />
        </button>

        {/* Quick Demo credentials info */}
        <div className="rounded-xl bg-surface p-3 border border-slate-100 text-[11px] text-slate-600 text-center">
          <p className="font-semibold text-navy">Compte démo pré-rempli :</p>
          <p className="font-mono text-slate-500">jean.dupont@example.com · mot de passe : demo123</p>
        </div>
      </form>

      <p className="mt-6 text-center text-sm text-slate-600">
        {t("connexion.noAccount")}{" "}
        <Link href="/inscription" className="font-bold text-primary hover:text-primary-dark">
          {t("nav.register")}
        </Link>
      </p>
    </main>
  );
}

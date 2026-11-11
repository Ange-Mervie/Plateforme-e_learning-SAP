"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { useLanguage } from "@/context/language-context";
import { Lock, Mail, User, ArrowRight, CheckCircle2 } from "lucide-react";

export default function Inscription() {
  const { register } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    if (!name.trim() || !email.trim() || !password) {
      setError(t("inscription.required"));
      return;
    }
    if (password.length < 6) {
      setError(t("inscription.passwordShort"));
      return;
    }
    setLoading(true);
    try {
      await register(name, email, password);
      router.push("/apprenant");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue.");
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
          {t("inscription.title")}
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Rejoignez la communauté des consultants et professionnels SAP certifiés
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <div>
          <label htmlFor="name" className="block text-xs font-semibold tracking-normal text-navy">
            {t("inscription.name")}
          </label>
          <div className="relative mt-1">
            <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Jean Dupont"
              className="h-11 w-full rounded-xl border border-slate-300 pl-9 pr-3 text-sm text-navy outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>

        <div>
          <label htmlFor="email" className="block text-xs font-semibold tracking-normal text-navy">
            {t("inscription.email")}
          </label>
          <div className="relative mt-1">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="jean.dupont@example.com"
              className="h-11 w-full rounded-xl border border-slate-300 pl-9 pr-3 text-sm text-navy outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>

        <div>
          <label htmlFor="password" className="block text-xs font-semibold tracking-normal text-navy">
            {t("inscription.password")}
          </label>
          <div className="relative mt-1">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Au moins 6 caractères"
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
          <span>{loading ? "Création du compte..." : t("inscription.submit")}</span>
          <ArrowRight className="h-4 w-4" />
        </button>

        <div className="space-y-1.5 pt-2 text-[11px] text-slate-500">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
            <span>Accès immédiat aux cours de découverte gratuits</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
            <span>Accès à la communauté d&apos;apprenants et mentorat</span>
          </div>
        </div>
      </form>

      <p className="mt-6 text-center text-sm text-slate-600">
        {t("inscription.hasAccount")}{" "}
        <Link href="/connexion" className="font-bold text-primary hover:text-primary-dark">
          {t("nav.login")}
        </Link>
      </p>
    </main>
  );
}

"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useLanguage } from "@/context/language-context";

export default function MotDePasseOublie() {
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center bg-white px-6 py-24">
      <h1 className="text-3xl font-bold tracking-tight text-navy">{t("motDeOublie.title")}</h1>
      <p className="mt-4 text-slate-600">{t("motDeOublie.subtitle")}</p>
      <form onSubmit={handleSubmit} className="mt-8 space-y-4 rounded-2xl border border-slate-200 p-8">
        <div>
          <label htmlFor="email" className="text-sm font-medium text-navy">{t("connexion.email")}</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 h-11 w-full rounded-lg border border-slate-200 px-3 text-sm text-navy outline-none focus:border-primary"
          />
        </div>
        <button type="submit" className="h-12 w-full rounded-lg bg-primary text-sm font-semibold text-white transition-colors hover:bg-primary-dark">
          {t("motDeOublie.submit")}
        </button>
      </form>
      {sent ? <p className="mt-6 text-sm text-slate-600">{t("motDeOublie.sent")}</p> : null}
      <p className="mt-6 text-center text-sm text-slate-600">
        <Link href="/connexion" className="font-semibold text-primary hover:text-primary-dark">{t("connexion.title")}</Link>
      </p>
    </main>
  );
}

"use client";

import { useState, type FormEvent } from "react";
import { useLanguage } from "@/context/language-context";

const MODULES = [
  { code: "FI", title: "SAP FI – Comptabilité générale" },
  { code: "MM", title: "SAP MM – Achats et stocks" },
];

const METHODS = [
  { id: "carte", label: "Carte bancaire" },
  { id: "om", label: "Orange Money" },
  { id: "mtn", label: "MTN Mobile Money" },
];

export default function Paiement() {
  const { t } = useLanguage();
  const [method, setMethod] = useState("carte");
  const [cardNumber, setCardNumber] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    if (method === "carte" && cardNumber.replace(/\s/g, "").length < 12) {
      setError("Veuillez saisir un numéro de carte valide.");
      return;
    }
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto max-w-3xl px-6 py-24">
      <h1 className="text-4xl font-bold tracking-tight text-navy">{t("paiement.title")}</h1>
      <p className="mt-4 text-slate-600">
        L’accès à plus d’un module nécessite un paiement. Paiement par carte, Orange Money ou MTN Mobile Money.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 rounded-2xl border border-slate-200 p-8">
        <h2 className="text-lg font-semibold text-navy">Modules sélectionnés</h2>
        <ul className="mt-4 space-y-2">
          {MODULES.map((module) => (
            <li key={module.code} className="flex justify-between text-sm text-slate-700">
              <span>{module.title}</span>
              <span className="font-semibold text-navy">{module.code}</span>
            </li>
          ))}
        </ul>
        <div className="mt-6 flex items-center justify-between border-t border-slate-200 pt-4">
          <span className="text-sm font-medium text-slate-700">{t("paiement.total")}</span>
          <span className="text-2xl font-bold text-navy">480,00 €</span>
        </div>

        <div className="mt-8 space-y-3">
          <p className="text-sm font-medium text-navy">Moyen de paiement</p>
          {METHODS.map((m) => (
            <label key={m.id} className="flex items-center gap-3 rounded-xl border border-slate-200 p-4">
              <input
                type="radio"
                name="method"
                value={m.id}
                checked={method === m.id}
                onChange={() => setMethod(m.id)}
                className="h-4 w-4 accent-[#0879d9]"
              />
              <span className="text-sm font-medium text-navy">{m.id === "carte" ? t("paiement.card") : m.label}</span>
            </label>
          ))}
        </div>

        {method === "carte" ? (
          <div className="mt-4">
            <label htmlFor="cardNumber" className="text-sm font-medium text-navy">Numéro de carte</label>
            <input
              id="cardNumber"
              type="text"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              placeholder="1234 5678 9012 3456"
              className="mt-1 h-11 w-full rounded-lg border border-slate-200 px-3 text-sm text-navy outline-none focus:border-primary"
            />
          </div>
        ) : null}

        {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}

        <button
          type="submit"
          disabled={loading}
          className="mt-8 h-12 w-full rounded-lg bg-primary text-sm font-semibold text-white transition-colors hover:bg-primary-dark disabled:opacity-60"
        >
          {loading ? "Paiement en cours…" : `Payer 480,00 €`}
        </button>
      </form>
    </main>
  );
}

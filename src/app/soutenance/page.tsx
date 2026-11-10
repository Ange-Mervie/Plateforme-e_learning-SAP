"use client";
import { useState } from "react";
import Link from "next/link";

export default function DefensePage() {
  const [status, setStatus] = useState("");
  const schedule = async () => {
    setStatus("Soutenance demandée. Un formateur vous contactera pour fixer la date.");
  };
  return (
    <main className="mx-auto max-w-md px-6 py-24">
      <h1 className="text-3xl font-bold text-navy">Soutenance</h1>
      <p className="mt-4 text-slate-600">
        Après validation de votre projet final, vous pouvez planifier votre soutenance avec un formateur certifié SAP.
      </p>
      <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-navy mb-4">Votre projet</h3>
        <p className="text-sm text-slate-600 mb-4">SAP FI – Comptabilité générale — Projet final</p>
        <button
          onClick={schedule}
          className="w-full h-12 rounded-lg bg-primary text-white font-semibold hover:bg-primary-dark"
        >
          Demander une soutenance
        </button>
      </div>
      {status && <p className="mt-4 text-emerald-700">{status}</p>}
      <p className="mt-8 text-sm text-slate-500">
        <Link href="/apprenant" className="text-primary hover:text-primary-dark">← Retour à l'espace apprenant</Link>
      </p>
    </main>
  );
}

"use client";
import { useState } from "react";

export default function ProjetPage() {
  const [status, setStatus] = useState("");
  const submit = async () => {
    const res = await fetch("/api/projects", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ userId: 1, courseSlug: "fi-comptabilite-generale" }) });
    const data = await res.json();
    setStatus(data.ok ? "Projet soumis" : "Erreur");
  };
  return (
    <main className="mx-auto max-w-md px-6 py-24">
      <h1 className="text-3xl font-bold text-navy">Projet final</h1>
      <button onClick={submit} className="mt-4 h-12 w-full rounded-lg bg-primary text-white">Soumettre</button>
      {status && <p className="mt-4 text-navy">{status}</p>}
    </main>
  );
}

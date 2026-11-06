"use client";
import { useState } from "react";

export default function AttestationPage() {
  const [status, setStatus] = useState("");
  const issue = async () => {
    const res = await fetch("/api/certificates", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ userId: 1, courseSlug: "fi-comptabilite-generale" }) });
    const data = await res.json();
    setStatus(data.ok ? "Attestation délivrée" : "Erreur");
  };
  return (
    <main className="mx-auto max-w-md px-6 py-24">
      <h1 className="text-3xl font-bold text-navy">Attestation</h1>
      <button onClick={issue} className="mt-4 h-12 w-full rounded-lg bg-primary text-white">Délivrer</button>
      {status && <p className="mt-4 text-navy">{status}</p>}
    </main>
  );
}

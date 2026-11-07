"use client";
import { useState } from "react";

export default function AttestationPage() {
  const [status, setStatus] = useState("");
  const [assessmentPassed, setAssessmentPassed] = useState(false);

  const checkAssessment = async () => {
    const res = await fetch(`/api/assessments?userId=1&courseSlug=fi-comptabilite-generale`);
    const data = await res.json();
    const rows = Array.isArray(data.rows) ? data.rows : [];
    const latest = rows[rows.length - 1];
    setAssessmentPassed(!!(latest && latest.passed));
  };

  const issue = async () => {
    const res = await fetch("/api/certificates", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ userId: 1, courseSlug: "fi-comptabilite-generale" }) });
    const data = await res.json();
    setStatus(data.ok ? "Attestation délivrée" : "Erreur");
  };

  return (
    <main className="mx-auto max-w-md px-6 py-24">
      <h1 className="text-3xl font-bold text-navy">Attestation</h1>
      <p className="mt-4 text-sm text-slate-600">
        L’attestation est délivrée après la réussite de l’évaluation module.
      </p>
      <button
        onClick={async () => {
          await checkAssessment();
          if (assessmentPassed) {
            await issue();
          } else {
            setStatus("Évaluation non validée — l’attestation ne peut pas être délivrée.");
          }
        }}
        className="mt-4 h-12 w-full rounded-lg bg-primary text-white"
      >
        Délivrer
      </button>
      {status && <p className="mt-4 text-navy">{status}</p>}
    </main>
  );
}

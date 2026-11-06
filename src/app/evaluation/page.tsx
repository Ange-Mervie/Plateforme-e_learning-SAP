"use client";
import { useState } from "react";

export default function EvaluationPage() {
  const [score, setScore] = useState("");
  const [result, setResult] = useState("");
  const submit = async () => {
    const res = await fetch("/api/assessments", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ userId: 1, courseSlug: "fi-comptabilite-generale", score: Number(score) }) });
    const data = await res.json();
    setResult(data.passed ? "Réussi" : "Échoué");
  };
  return (
    <main className="mx-auto max-w-md px-6 py-24">
      <h1 className="text-3xl font-bold text-navy">Évaluation</h1>
      <input value={score} onChange={(e) => setScore(e.target.value)} placeholder="Score" className="mt-4 h-11 w-full rounded-lg border border-slate-200 px-3" />
      <button onClick={submit} className="mt-4 h-12 w-full rounded-lg bg-primary text-white">Soumettre</button>
      {result && <p className="mt-4 text-navy">{result}</p>}
    </main>
  );
}

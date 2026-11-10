"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

interface AssessmentRow {
  id: number;
  course_slug: string;
  score: number;
  passed: number;
  created_at: string;
}

export default function MyAssessments() {
  const [rows, setRows] = useState<AssessmentRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/assessments?userId=1", { credentials: "same-origin" })
      .then(async (r) => {
        if (!r.ok) throw new Error("Impossible de charger les évaluations");
        return r.json();
      })
      .then((data) => {
        setRows(data.rows ?? []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-sm text-slate-500">Chargement des évaluations…</div>;

  return (
    <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-navy">Mes évaluations</h2>
        <Link href="/evaluation" className="text-xs font-bold text-primary hover:text-primary-dark">
          Passer un examen →
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="pb-2 text-xs font-semibold text-slate-500 uppercase">Formation</th>
              <th className="pb-2 text-xs font-semibold text-slate-500 uppercase">Note</th>
              <th className="pb-2 text-xs font-semibold text-slate-500 uppercase">Résultat</th>
              <th className="pb-2 text-xs font-semibold text-slate-500 uppercase">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-4 text-center text-sm text-slate-500">
                  Aucune évaluation pour le moment.
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={row.id} className="hover:bg-surface transition-colors">
                  <td className="py-3 text-sm text-navy">{row.course_slug}</td>
                  <td className="py-3 text-sm font-semibold text-navy">{row.score} / 100</td>
                  <td className="py-3 text-sm">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${
                      row.passed ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
                    }`}>
                      {row.passed ? "Réussi" : "Échoué"}
                    </span>
                  </td>
                  <td className="py-3 text-sm text-slate-500">{new Date(row.created_at).toLocaleDateString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

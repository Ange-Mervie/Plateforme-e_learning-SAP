"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

interface ProjectRow {
  id: number;
  course_slug: string;
  status: string;
  grade: number | null;
  comments: string | null;
  created_at: string;
}

export default function MyProjects() {
  const [rows, setRows] = useState<ProjectRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/projects?userId=1", { credentials: "same-origin" })
      .then(async (r) => {
        if (!r.ok) throw new Error("Impossible de charger les projets");
        return r.json();
      })
      .then((data) => {
        setRows(data.rows ?? []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-sm text-slate-500">Chargement des projets…</div>;

  return (
    <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-navy">Mes projets finals</h2>
        <Link href="/projet" className="text-xs font-bold text-primary hover:text-primary-dark">
          Soumettre un projet →
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="pb-2 text-xs font-semibold text-slate-500 uppercase">Formation</th>
              <th className="pb-2 text-xs font-semibold text-slate-500 uppercase">Statut</th>
              <th className="pb-2 text-xs font-semibold text-slate-500 uppercase">Note</th>
              <th className="pb-2 text-xs font-semibold text-slate-500 uppercase">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-4 text-center text-sm text-slate-500">
                  Aucun projet soumis pour le moment.
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={row.id} className="hover:bg-surface transition-colors">
                  <td className="py-3 text-sm text-navy">{row.course_slug}</td>
                  <td className="py-3 text-sm">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${
                      row.status === "validated"
                        ? "bg-emerald-100 text-emerald-700"
                        : row.status === "submitted"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-slate-100 text-slate-700"
                    }`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="py-3 text-sm text-navy">{row.grade != null ? row.grade + " / 20" : "—"}</td>
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

"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

interface ProjectRow {
  id: number;
  user_id: number;
  user_name: string;
  user_email: string;
  course_slug: string;
  status: string;
  grade: number | null;
  comments: string | null;
  created_at: string;
}

export default function FormateurProjetsPage() {
  const [rows, setRows] = useState<ProjectRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [grade, setGrade] = useState("");
  const [comments, setComments] = useState("");
  const [status, setStatus] = useState("submitted");

  useEffect(() => {
    fetch("/api/formateur/projets", { credentials: "same-origin" })
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

  const evaluate = async (id: number) => {
    await fetch(`/api/formateur/projets/${id}/evaluation`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        grade: grade ? Number(grade) : undefined,
        comments: comments || undefined,
        status: status === "submitted" ? "evaluated" : status,
      }),
    });
    setEditingId(null);
    setGrade("");
    setComments("");
    setStatus("submitted");
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, status: "evaluated" } : r)));
  };

  if (loading) return <div className="text-sm text-slate-500">Chargement des projets…</div>;

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-navy">Projets à évaluer</h1>
        <Link href="/formateur" className="text-sm text-primary hover:text-primary-dark">← Retour</Link>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        {rows.length === 0 ? (
          <p className="text-sm text-slate-500">Aucun projet soumis pour le moment.</p>
        ) : (
          <div className="space-y-4">
            {rows.map((row) => (
              <div key={row.id} className="border-b border-slate-100 pb-4 last:border-0">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h3 className="text-lg font-bold text-navy">{row.course_slug}</h3>
                    <p className="text-sm text-slate-600">{row.user_name} ({row.user_email})</p>
                  </div>
                  <span className={`text-xs font-bold rounded-full px-2 py-0.5 ${
                    row.status === "validated" ? "bg-emerald-100 text-emerald-700" :
                    row.status === "evaluated" ? "bg-blue-100 text-blue-700" :
                    row.status === "submitted" ? "bg-amber-100 text-amber-700" :
                    "bg-slate-100 text-slate-700"
                  }`}>{row.status}</span>
                </div>
                {row.grade != null && <p className="text-sm text-navy mb-2">Note : {row.grade} / 20</p>}
                {row.comments && <p className="text-sm text-slate-600 mb-2">{row.comments}</p>}

                {editingId === row.id ? (
                  <div className="mt-4 space-y-3">
                    <div className="flex items-center gap-2">
                      <label className="text-xs font-medium text-slate-600">Note (/20)</label>
                      <input
                        type="number"
                        min={0}
                        max={20}
                        value={grade}
                        onChange={(e) => setGrade(e.target.value)}
                        className="w-20 rounded-lg border border-slate-200 px-2 py-1 text-sm"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="text-xs font-medium text-slate-600">Commentaires</label>
                      <textarea
                        value={comments}
                        onChange={(e) => setComments(e.target.value)}
                        rows={2}
                        className="w-full rounded-lg border border-slate-200 px-2 py-1 text-sm"
                        placeholder="Commentaires du formateur..."
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="text-xs font-medium text-slate-600">Statut</label>
                      <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="rounded-lg border border-slate-200 px-2 py-1 text-sm"
                      >
                        <option value="evaluated">Évalué</option>
                        <option value="validated">Validé</option>
                        <option value="rejected">Rejeté</option>
                      </select>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => evaluate(row.id)}
                        className="flex-1 h-10 rounded-lg bg-primary text-white text-xs font-semibold hover:bg-primary-dark"
                      >
                        Enregistrer
                      </button>
                      <button
                        onClick={() => { setEditingId(null); setGrade(""); setComments(""); setStatus("submitted"); }}
                        className="h-10 rounded-lg border border-slate-200 px-3 text-xs text-slate-600 hover:bg-slate-50"
                      >
                        Annuler
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setEditingId(row.id);
                      setGrade(String(row.grade ?? ""));
                      setComments(row.comments ?? "");
                      setStatus(row.status === "submitted" ? "submitted" : row.status);
                    }}
                    className="text-xs text-primary hover:text-primary-dark font-medium"
                  >
                    {row.status === "submitted" ? "Évaluer" : "Modifier l'évaluation"}
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

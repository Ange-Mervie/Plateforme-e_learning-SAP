"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

interface DefenseRow {
  id: number;
  project_id: number;
  user_id: number;
  user_name: string;
  user_email: string;
  course_slug: string;
  scheduled_at: string | null;
  decision: string;
  evaluator_comment: string | null;
  decided_by: number | null;
  decided_at: string | null;
  created_at: string;
  project_grade: number | null;
  project_comments: string | null;
}

export default function FormateurSoutenancesPage() {
  const [rows, setRows] = useState<DefenseRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [decidingId, setDecidingId] = useState<number | null>(null);
  const [decision, setDecision] = useState("admis");
  const [comment, setComment] = useState("");

  useEffect(() => {
    fetch("/api/formateur/soutenances", { credentials: "same-origin" })
      .then(async (r) => {
        if (!r.ok) throw new Error("Impossible de charger les soutenances");
        return r.json();
      })
      .then((data) => {
        setRows(data.rows ?? []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const decide = async (id: number) => {
    await fetch(`/api/formateur/soutenances/${id}/decision`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ decision, comment: comment || undefined }),
    });
    setDecidingId(null);
    setDecision("admis");
    setComment("");
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, decision } : r)));
  };

  if (loading) return <div className="text-sm text-slate-500">Chargement des soutenances…</div>;

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-navy">Soutenances</h1>
        <Link href="/formateur" className="text-sm text-primary hover:text-primary-dark">← Retour</Link>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        {rows.length === 0 ? (
          <p className="text-sm text-slate-500">Aucune soutenance pour le moment.</p>
        ) : (
          <div className="space-y-4">
            {rows.map((row) => (
              <div key={row.id} className="border-b border-slate-100 pb-4 last:border-0">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h3 className="text-lg font-bold text-navy">{row.course_slug}</h3>
                    <p className="text-sm text-slate-600">{row.user_name} ({row.user_email})</p>
                    <p className="text-xs text-slate-500 mt-1">
                      Projet : {row.project_grade != null ? row.project_grade + "/20" : "non noté"} ·
                      {row.scheduled_at ? new Date(row.scheduled_at).toLocaleDateString() : "Non planifié"}
                    </p>
                  </div>
                  <span className={`text-xs font-bold rounded-full px-2 py-0.5 ${
                    row.decision === "admis" ? "bg-emerald-100 text-emerald-700" :
                    row.decision === "ajourne" ? "bg-rose-100 text-rose-700" :
                    "bg-amber-100 text-amber-700"
                  }`}>{row.decision === "pending" ? "En attente" : row.decision}</span>
                </div>
                {row.project_comments && <p className="text-sm text-slate-600 mb-2">{row.project_comments}</p>}

                {row.decision === "pending" && (
                  <div className="mt-4 space-y-3">
                    <div className="flex items-center gap-2">
                      <label className="text-xs font-medium text-slate-600">Décision</label>
                      <select
                        value={decision}
                        onChange={(e) => setDecision(e.target.value)}
                        className="w-32 rounded-lg border border-slate-200 px-2 py-1 text-sm"
                      >
                        <option value="admis">Admis</option>
                        <option value="ajourne">Ajourne</option>
                      </select>
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="text-xs font-medium text-slate-600">Commentaire</label>
                      <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        rows={2}
                        className="w-full rounded-lg border border-slate-200 px-2 py-1 text-sm"
                        placeholder="Commentaire sur la soutenance..."
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => decide(row.id)}
                        className="flex-1 h-10 rounded-lg bg-primary text-white text-xs font-semibold hover:bg-primary-dark"
                      >
                        Valider la décision
                      </button>
                      <button
                        onClick={() => { setDecidingId(null); setDecision("admis"); setComment(""); }}
                        className="h-10 rounded-lg border border-slate-200 px-3 text-xs text-slate-600 hover:bg-slate-50"
                      >
                        Annuler
                      </button>
                    </div>
                  </div>
                )}
                {row.decision !== "pending" && row.evaluator_comment && (
                  <p className="text-sm text-slate-500 mt-2">Commentaire formateur : {row.evaluator_comment}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

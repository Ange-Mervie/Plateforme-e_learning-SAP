"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Mail, Phone, ChevronRight } from "lucide-react";

const STATUTS = [
  { value: "nouvelle", label: "Nouvelle demande" },
  { value: "en_attente", label: "En attente de traitement" },
  { value: "formateur_affecte", label: "Formateur affecté" },
  { value: "candidat_contacte", label: "Candidat contacté" },
  { value: "en_discussion", label: "En discussion" },
  { value: "inscription_confirmee", label: "Inscription confirmée" },
  { value: "cloturee", label: "Demande clôturée" },
];

export default function AdminDemandesPage() {
  const [requests, setRequests] = useState<any[]>([]);
  const [filterStatut, setFilterStatut] = useState<string>("all");
  const [filterSearch, setFilterSearch] = useState<string>("");
  const [loading, setLoading] = useState(true);

  async function loadRequests() {
    setLoading(true);
    try {
      const res = await fetch("/api/contact");
      const data = await res.json();
      setRequests(data.requests || []);
    } catch {
      setRequests([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadRequests();
  }, []);

  const filtered = requests.filter((r: any) => {
    if (filterStatut !== "all" && r.status !== filterStatut) return false;
    const q = filterSearch.toLowerCase();
    return (
      r.nom.toLowerCase().includes(q) ||
      r.email.toLowerCase().includes(q) ||
      r.telephone.includes(q) ||
      r.formation.toLowerCase().includes(q)
    );
  });

  async function updateStatus(id: string, status: string) {
    await fetch("/api/contact", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    setRequests((prev: any[]) => prev.map((r: any) => (r.id === id ? { ...r, status } : r)));
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-navy">
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-navy">Gestion des demandes de contact</h1>
              <p className="text-sm text-slate-600">Suivi des demandes de formation ELEVATE By IBN Group</p>
            </div>
            <Link
              href="/catalogue"
              className="inline-flex items-center gap-2 h-10 rounded-xl bg-primary px-4 text-xs font-bold text-white hover:bg-primary-dark transition-colors"
            >
              <ChevronRight className="h-3.5 w-3.5" />
              Retour au catalogue
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="grid gap-4 sm:grid-cols-4 mb-8">
          {[...STATUTS, { value: "all", label: "Total" }].map((s, i) => {
            const count = s.value === "all" ? requests.length : requests.filter((r: any) => r.status === s.value).length;
            return (
              <div key={i} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{s.label}</p>
                <p className="mt-1 text-2xl font-bold text-navy">{count}</p>
              </div>
            );
          })}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Rechercher par nom, email, téléphone ou formation..."
              value={filterSearch}
              onChange={(e) => setFilterSearch(e.target.value)}
              className="h-10 w-full rounded-lg border border-slate-300 pl-10 pr-4 text-sm text-navy outline-none focus:border-primary"
            />
          </div>
          <select
            value={filterStatut}
            onChange={(e) => setFilterStatut(e.target.value)}
            className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm text-navy outline-none focus:border-primary"
          >
            <option value="all">Tous les statuts</option>
            {STATUTS.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="bg-surface border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Demande</th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Candidat</th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Contact</th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Formation</th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Statut</th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Date</th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-slate-500">Chargement…</td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-slate-500">Aucune demande trouvée.</td>
                </tr>
              ) : (
                filtered.map((r: any) => (
                  <tr key={r.id} className="hover:bg-surface transition-colors">
                    <td className="px-4 py-3">
                      <span className="text-xs font-bold text-primary">{r.requestNumber}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                          {r.nom.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-navy">{r.nom}</p>
                          <p className="text-xs text-slate-500">{r.situation}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-1">
                        <p className="text-sm text-navy">{r.email}</p>
                        <p className="text-sm text-slate-600">{r.telephone}</p>
                        <p className="text-xs text-slate-500">{r.ville}, {r.pays}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-1">
                        <p className="text-sm font-semibold text-navy">{r.formation}</p>
                        <p className="text-xs text-slate-500">Module {r.module}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={r.status}
                        onChange={(e) => updateStatus(r.id, e.target.value)}
                        className="h-8 rounded-lg border border-slate-300 bg-white px-2 text-xs outline-none focus:border-primary"
                      >
                        {STATUTS.map((s) => (
                          <option key={s.value} value={s.value}>{s.label}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600">
                      {new Date(r.createdAt).toLocaleDateString("fr-FR")}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/admin/demandes/${r.id}`}
                        className="text-xs font-semibold text-primary hover:underline"
                      >
                        Voir détails <ChevronRight className="h-3 w-3 ml-0.5" />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

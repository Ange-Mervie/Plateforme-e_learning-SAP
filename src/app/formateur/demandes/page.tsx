"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useLanguage } from "@/context/language-context";
import { Mail, Phone, ChevronRight, Clock } from "lucide-react";

const STATUTS = [
  { value: "nouvelle", labelKey: "status.nouvelle" },
  { value: "a_affecter", labelKey: "status.a_affecter" },
  { value: "affectee", labelKey: "status.affectee" },
  { value: "contact_en_cours", labelKey: "status.contact_en_cours" },
  { value: "formation_planifiee", labelKey: "status.formation_planifiee" },
  { value: "en_formation", labelKey: "status.en_formation" },
  { value: "terminee", labelKey: "status.terminee" },
  { value: "annulee", labelKey: "status.annulee" },
];

export default function FormateurDemandesPage() {
  const { t, lang } = useLanguage();
  const isFr = lang === "fr";
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
      (r.nom || "").toLowerCase().includes(q) ||
      (r.email || "").toLowerCase().includes(q) ||
      (r.requestNumber || "").toLowerCase().includes(q) ||
      (r.formation || "").toLowerCase().includes(q)
    );
  });

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl py-20 text-center">
        <p className="text-slate-600">{t("requests.loading")}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-navy">
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-navy">{t("requests.myTitle")}</h1>
              <p className="text-sm text-slate-600">{t("requests.mySubtitle")}</p>
            </div>
            <Link href="/formateur" className="inline-flex items-center gap-2 h-10 rounded-xl bg-primary px-4 text-xs font-bold text-white hover:bg-primary-dark transition-colors">
              <ChevronRight className="h-3.5 w-3.5" />
              {t("requests.backToDashboard")}
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-8 grid gap-4 sm:grid-cols-4">
          {[
            { label: t("requests.total"), count: requests.length },
            { label: t("requests.new"), count: requests.filter((r: any) => r.status === "nouvelle").length },
            { label: t("requests.assigned"), count: requests.filter((r: any) => r.status === "affectee").length },
            { label: t("requests.inTraining"), count: requests.filter((r: any) => r.status === "en_formation").length },
          ].map((s, i) => (
            <div key={i} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{s.label}</p>
              <p className="mt-1 text-2xl font-bold text-navy">{s.count}</p>
            </div>
          ))}
        </div>

        <div className="mb-6 flex gap-4">
          <div className="relative flex-1">
            <Clock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <input type="text" placeholder={t("requests.search")} value={filterSearch} onChange={(e) => setFilterSearch(e.target.value)} className="h-10 w-full rounded-lg border border-slate-300 pl-10 pr-4 text-sm text-navy outline-none focus:border-primary" />
          </div>
          <select value={filterStatut} onChange={(e) => setFilterStatut(e.target.value)} className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm text-navy outline-none focus:border-primary">
            <option value="all">{t("requests.allStatuses")}</option>
            {STATUTS.map((s) => (
              <option key={s.value} value={s.value}>{t(s.labelKey)}</option>
            ))}
          </select>
        </div>

        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-surface">
              <tr>
                <th className="px-4 py-3 text-xs font-semibold uppercase text-slate-500">{t("requests.request")}</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase text-slate-500">{t("requests.candidate")}</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase text-slate-500">{t("requests.training")}</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase text-slate-500">{t("requests.module")}</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase text-slate-500">{t("requests.status")}</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase text-slate-500">{t("requests.date")}</th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase text-slate-500">{t("requests.action")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-slate-500">{t("requests.noneAssigned")}</td>
                </tr>
              ) : (
                filtered.map((r: any) => (
                  <tr key={r.id} className="transition-colors hover:bg-surface">
                    <td className="px-4 py-3 text-xs font-bold text-primary">{r.requestNumber}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                          {(r.nom || "U").split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-navy">{r.nom}</p>
                          <p className="text-xs text-slate-500">{r.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm font-semibold text-navy">{r.formation}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{r.module}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{t(STATUTS.find((s) => s.value === r.status)?.labelKey || "status.nouvelle")}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{r.createdAt ? new Date(r.createdAt).toLocaleDateString(isFr ? "fr-FR" : "en-US") : "-"}</td>
                    <td className="px-4 py-3 text-right">
                      <Link href={`/formateur/demandes/${r.id}`} className="text-xs font-semibold text-primary hover:underline">
                        {t("requests.viewDetails")} <ChevronRight className="ml-0.5 inline h-3 w-3" />
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

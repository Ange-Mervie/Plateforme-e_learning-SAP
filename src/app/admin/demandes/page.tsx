"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useLanguage } from "@/context/language-context";
import { ChevronRight, Search } from "lucide-react";
import { TRAINERS } from "@/data/trainers";

const STATUT_KEYS = [
  { value: "nouvelle", labelKey: "status.nouvelle" },
  { value: "a_affecter", labelKey: "status.a_affecter" },
  { value: "affectee", labelKey: "status.affectee" },
  { value: "contact_en_cours", labelKey: "status.contact_en_cours" },
  { value: "formation_planifiee", labelKey: "status.formation_planifiee" },
  { value: "en_formation", labelKey: "status.en_formation" },
  { value: "terminee", labelKey: "status.terminee" },
  { value: "annulee", labelKey: "status.annulee" },
];

export default function AdminDemandesPage() {
  const { t, lang } = useLanguage();
  const isFr = lang === "fr";
  const [requests, setRequests] = useState<any[]>([]);
  const [filterStatut, setFilterStatut] = useState("all");
  const [filterFormation, setFilterFormation] = useState("all");
  const [filterFormateur, setFilterFormateur] = useState("all");
  const [filterSearch, setFilterSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const pageSize = 10;

  async function loadRequests() {
    setLoading(true);
    try {
      const res = await fetch("/api/contact");
      const data = await res.json();
      setRequests(data.requests || []);
    } catch { setRequests([]); } finally { setLoading(false); }
  }

  useEffect(() => { loadRequests(); }, []);

  const formations = Array.from(new Set(requests.map((r: any) => r.formation).filter(Boolean))).sort() as string[];
  const filtered = requests.filter((r: any) => {
    if (filterStatut !== "all" && r.status !== filterStatut) return false;
    if (filterFormation !== "all" && r.formation !== filterFormation) return false;
    if (filterFormateur !== "all" && r.formateurAssigne !== filterFormateur) return false;
    const q = filterSearch.toLowerCase();
    return (r.nom||"").toLowerCase().includes(q)||(r.email||"").toLowerCase().includes(q)||(r.requestNumber||"").toLowerCase().includes(q)||(r.formation||"").toLowerCase().includes(q);
  });
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  async function updateStatus(id: string, status: string) {
    await fetch("/api/contact", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, status }) });
    await loadRequests();
  }

  if (loading) return <div className="mx-auto max-w-4xl py-20 text-center"><p className="text-slate-600">{t("requests.loading")}</p></div>;

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-navy">
      <div className="border-b border-slate-200 bg-white"><div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between"><div><h1 className="text-2xl font-bold text-navy">{t("requests.title")}</h1><p className="text-sm text-slate-600">{t("requests.subtitle")}</p></div><Link href="/catalogue" className="inline-flex items-center gap-2 h-10 rounded-xl bg-primary px-4 text-xs font-bold text-white hover:bg-primary-dark"><ChevronRight className="h-3.5 w-3.5" />{t("requests.backToCatalog")}</Link></div></div>
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-8 grid gap-4 sm:grid-cols-4">
          {[{l:t("requests.total"),c:requests.length},{l:t("requests.new"),c:requests.filter((r:any)=>r.status==="nouvelle").length},{l:t("requests.assigned"),c:requests.filter((r:any)=>r.status==="affectee").length},{l:t("requests.inTraining"),c:requests.filter((r:any)=>r.status==="en_formation").length}].map((s,i)=>(
            <div key={i} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"><p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{s.l}</p><p className="mt-1 text-2xl font-bold text-navy">{s.c}</p></div>
          ))}
        </div>
        <div className="mb-6 flex flex-col items-end gap-4 sm:flex-row">
          <div className="relative flex-1 w-full"><Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" /><input type="text" placeholder={t("requests.search")} value={filterSearch} onChange={(e)=>setFilterSearch(e.target.value)} className="h-10 w-full rounded-lg border border-slate-300 pl-10 pr-4 text-sm text-navy outline-none focus:border-primary" /></div>
          <div className="min-w-[150px]"><label className="mb-1 block text-xs font-semibold uppercase text-slate-500">{t("requests.status")}</label><select value={filterStatut} onChange={(e)=>{setFilterStatut(e.target.value);setPage(1);}} className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-navy outline-none focus:border-primary"><option value="all">{t("requests.allStatuses")}</option>{STATUT_KEYS.map(s=><option key={s.value} value={s.value}>{t(s.labelKey)}</option>)}</select></div>
          <div className="min-w-[150px]"><label className="mb-1 block text-xs font-semibold uppercase text-slate-500">{t("requests.training")}</label><select value={filterFormation} onChange={(e)=>{setFilterFormation(e.target.value);setPage(1);}} className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-navy outline-none focus:border-primary"><option value="all">{t("requests.allTrainings")}</option>{formations.map(f=><option key={f} value={f}>{f}</option>)}</select></div>
          <div className="min-w-[150px]"><label className="mb-1 block text-xs font-semibold uppercase text-slate-500">{t("requests.trainer")}</label><select value={filterFormateur} onChange={(e)=>{setFilterFormateur(e.target.value);setPage(1);}} className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-navy outline-none focus:border-primary"><option value="all">{t("requests.allTrainers")}</option>{TRAINERS.map(f=><option key={f.name} value={f.name}>{f.name}</option>)}</select></div>
        </div>
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-left text-sm"><thead className="border-b border-slate-200 bg-surface"><tr>{[t("requests.request"),t("requests.candidate"),t("requests.training"),t("requests.module"),t("requests.trainer"),t("requests.status"),t("requests.date"),t("requests.action")].map((h,i)=><th key={i} className={`px-4 py-3 text-xs font-semibold uppercase text-slate-500 ${i===7?"text-right":""}`}>{h}</th>)}</tr></thead>
          <tbody className="divide-y divide-slate-100">
            {paginated.length===0 ? <tr><td colSpan={8} className="px-4 py-8 text-center text-slate-500">{t("requests.none")}</td></tr> : paginated.map((r:any)=>(
              <tr key={r.id} className="transition-colors hover:bg-surface">
                <td className="px-4 py-3 text-xs font-bold text-primary">{r.requestNumber}</td>
                <td className="px-4 py-3"><p className="text-sm font-semibold text-navy">{r.nom}</p><p className="text-xs text-slate-500">{r.email}</p></td>
                <td className="px-4 py-3 text-sm font-semibold text-navy">{r.formation}</td>
                <td className="px-4 py-3 text-sm text-slate-600">{r.module}</td>
                <td className="px-4 py-3 text-sm text-slate-600">{r.formateurAssigne||t("requests.unassigned")}</td>
                <td className="px-4 py-3"><select value={r.status} onChange={(e)=>updateStatus(r.id,e.target.value)} className="h-9 rounded-lg border border-slate-300 bg-white px-2 text-sm outline-none focus:border-primary">{STATUT_KEYS.map(s=><option key={s.value} value={s.value}>{t(s.labelKey)}</option>)}</select></td>
                <td className="px-4 py-3 text-sm text-slate-600">{r.createdAt?new Date(r.createdAt).toLocaleDateString(isFr?"fr-FR":"en-US"):"-"}</td>
                <td className="px-4 py-3 text-right"><Link href={`/admin/demandes/${r.id}`} className="text-xs font-semibold text-primary hover:underline">{t("requests.viewDetails")}</Link></td>
              </tr>
            ))}
          </tbody></table>
          {totalPages>1 && <div className="flex items-center justify-between border-t border-slate-200 px-4 py-3 text-xs text-slate-600"><span>{page}/{totalPages}</span><div className="flex gap-2"><button disabled={page<=1} onClick={()=>setPage(p=>p-1)} className="rounded border px-2 py-1 disabled:opacity-40">Prev</button><button disabled={page>=totalPages} onClick={()=>setPage(p=>p+1)} className="rounded border px-2 py-1 disabled:opacity-40">Next</button></div></div>}
        </div>
      </div>
    </div>
  );
}

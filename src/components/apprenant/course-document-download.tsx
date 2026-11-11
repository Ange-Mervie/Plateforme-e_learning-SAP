"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Download, ShieldCheck, Lock, Clock } from "lucide-react";

interface DocumentInfo {
  id: number;
  title: string;
  filename: string;
  mimeType: string;
  size: number;
  downloadUrl: string;
}

interface Conditions {
  ok: boolean;
  missing: string[];
}

const MISSING_LABELS: Record<string, string> = {
  assessment_passed: "Évaluation finale non validée",
  project_validated: "Projet final non validé",
  defense_admitted: "Soutenance non validée",
  certificate_issued: "Attestation non délivrée",
};

export default function CourseDocumentDownload({ courseSlug }: { courseSlug: string }) {
  const [document, setDocument] = useState<DocumentInfo | null>(null);
  const [conditions, setConditions] = useState<Conditions | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    fetch(`/api/download/document?courseSlug=${encodeURIComponent(courseSlug)}`, { credentials: "same-origin" })
      .then(async (r) => {
        if (r.status === 403) {
          const err = await r.json();
          setConditions(err.missing ?? { ok: false, missing: [] });
          setLoading(false);
          return;
        }
        if (!r.ok) throw new Error("Impossible de charger le document");
        return r.json();
      })
      .then((data) => {
        if (!active) return;
        if (data.ok) {
          setDocument(data.document);
          setConditions({ ok: true, missing: [] });
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
    return () => { active = false; };
  }, [courseSlug]);

  if (loading) return <div className="text-sm text-slate-500">Vérification des conditions d&apos;accès…</div>;

  if (conditions && !conditions.ok) {
    return (
      <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <Lock className="h-5 w-5 text-amber-600" />
          <h2 className="text-lg font-bold text-navy">Support documentaire - ${courseSlug}</h2>
        </div>
        <p className="text-sm text-slate-600 mb-4">
          Le support de ce cours sera disponible après validation de :
        </p>
        <ul className="space-y-2 text-sm text-slate-600 mb-6">
          {conditions.missing.map((m) => (
            <li key={m} className="flex items-center gap-2">
              <Clock className="h-3.5 w-3.5 text-slate-400" />
              <span>{MISSING_LABELS[m] || m}</span>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-2 text-xs font-bold text-amber-700 bg-amber-50 rounded-lg p-3">
          <ShieldCheck className="h-4 w-4" />
          <span>Accès réservé aux parcours entièrement validés</span>
        </div>
      </section>
    );
  }

  if (!document) {
    return (
      <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <p className="text-sm text-slate-500">Aucun support disponible pour ce cours.</p>
      </section>
    );
  }

  return (
    <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-navy">Support documentaire</h2>
          <p className="text-sm text-slate-600">{document.title}</p>
        </div>
        <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-50 rounded-lg p-3">
          <ShieldCheck className="h-4 w-4" />
          <span>Téléchargement autorisé</span>
        </div>
      </div>

      <div className="flex items-center justify-between rounded-xl border border-slate-200 p-4">
        <div>
          <p className="text-sm font-medium text-navy">{document.filename}</p>
          <p className="text-xs text-slate-500">
            {document.mimeType} · {(document.size / 1024).toFixed(1)} Ko
          </p>
        </div>
        <a
          href={document.downloadUrl}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-bold text-white hover:bg-primary-dark transition-colors"
        >
          <Download className="h-4 w-4" />
          <span>Télécharger</span>
        </a>
      </div>
    </section>
  );
}

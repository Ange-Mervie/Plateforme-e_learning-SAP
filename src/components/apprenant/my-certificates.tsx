"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

interface CertificateRow {
  id: number;
  course_slug: string;
  issued_at: string;
}

export default function MyCertificates() {
  const [rows, setRows] = useState<CertificateRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/certificates?userId=1", { credentials: "same-origin" })
      .then(async (r) => {
        if (!r.ok) throw new Error("Impossible de charger les attestations");
        return r.json();
      })
      .then((data) => {
        setRows(data.rows ?? []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-sm text-slate-500">Chargement des attestations…</div>;

  return (
    <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-navy">Mes attestations</h2>
        <Link href="/attestation" className="text-xs font-bold text-primary hover:text-primary-dark">
          Délivrer une attestation →
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="pb-2 text-xs font-semibold text-slate-500 uppercase">Formation</th>
              <th className="pb-2 text-xs font-semibold text-slate-500 uppercase">Délivrée le</th>
              <th className="pb-2 text-xs font-semibold text-slate-500 uppercase">Télécharger</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.length === 0 ? (
              <tr>
                <td colSpan={3} className="p-4 text-center text-sm text-slate-500">
                  Aucune attestation délivrée pour le moment.
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={row.id} className="hover:bg-surface transition-colors">
                  <td className="py-3 text-sm text-navy">{row.course_slug}</td>
                  <td className="py-3 text-sm text-slate-500">{new Date(row.issued_at).toLocaleDateString()}</td>
                  <td className="py-3 text-sm">
                    <Link
                      href={`/api/download/certificate?courseSlug=${encodeURIComponent(row.course_slug)}`}
                      className="text-xs font-bold text-primary hover:text-primary-dark underline underline-offset-4"
                    >
                      Télécharger
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

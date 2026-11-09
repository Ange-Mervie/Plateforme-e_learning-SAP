"use client";

import Link from "next/link";
import { CERTIFICATIONS } from "@/data/certifications";
import { PARCOURS } from "@/data/parcours";
import { useLanguage } from "@/context/language-context";
import { Award, CheckCircle2, Clock, ArrowRight, ShieldCheck } from "lucide-react";

export default function Certifications() {
  const { t } = useLanguage();

  return (
    <main className="bg-white min-h-screen">
      <section className="relative overflow-hidden bg-navy">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-25"
          style={{ backgroundImage: "url(/courses/hero.svg)" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-navy/60 via-navy/85 to-navy" />
        <div className="relative mx-auto max-w-7xl px-6 py-16 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-200">{t("nav.certifications")}</p>
          <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-white sm:text-5xl">{t("certifications.title")}</h1>
          <p className="mt-4 max-w-2xl text-lg text-blue-100">{t("certifications.subtitle")}</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div className="grid gap-8 md:grid-cols-3">
          {CERTIFICATIONS.map((cert) => {
            const parcours = PARCOURS.find((item) => item.slug === cert.prepParcoursSlug);
            return (
              <article
                key={cert.slug}
                className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-surface px-3 py-1 text-xs font-bold uppercase tracking-wider text-navy">
                      {cert.family}
                    </span>
                    <span className="flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                      <Award className="h-3.5 w-3.5" />
                      {cert.mockExams ?? 1} examen blanc
                    </span>
                  </div>

                  <h2 className="mt-4 text-xl font-bold text-navy group-hover:text-primary transition-colors">
                    {cert.title}
                  </h2>
                  <p className="mt-2 text-xs font-medium text-slate-500 leading-relaxed">
                    Titre officiel : <span className="text-navy font-semibold">{cert.officialName}</span>
                  </p>

                  <div className="mt-6 border-t border-slate-100 pt-5 text-xs text-slate-600 space-y-2">
                    <p className="flex justify-between">
                      <span className="text-slate-500">Parcours préparatoire :</span>
                      <span className="font-semibold text-navy">{parcours ? parcours.title : cert.prepParcoursSlug}</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-slate-500">Volume horaire total :</span>
                      <span className="font-semibold text-navy">{parcours ? parcours.totalHours : 0} heures</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-slate-500">Accréditation :</span>
                      <span className="font-bold text-emerald-600 flex items-center gap-1">
                        <ShieldCheck className="h-3.5 w-3.5" /> Conforme SAP ERP
                      </span>
                    </p>
                  </div>
                </div>

                <div className="mt-8 pt-5 border-t border-slate-100 flex flex-col gap-2.5">
                  <Link
                    href="/evaluation"
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-xs font-bold text-white shadow-sm hover:bg-primary-dark transition-colors"
                  >
                    <span>Passer l&apos;examen blanc</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                  <Link
                    href="/parcours"
                    className="inline-flex h-10 items-center justify-center rounded-xl border border-slate-200 text-xs font-semibold text-navy hover:bg-surface transition-colors"
                  >
                    Voir le programme du parcours
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}

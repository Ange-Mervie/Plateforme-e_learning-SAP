"use client";

import Link from "next/link";
import { CERTIFICATIONS } from "@/data/certifications";
import { PARCOURS } from "@/data/parcours";
import { useLanguage } from "@/context/language-context";

export default function Certifications() {
  const { t } = useLanguage();

  return (
    <main className="bg-white">
      <section className="relative overflow-hidden bg-navy">
        <div className="absolute inset-0" style={{ backgroundImage: "url(/courses/hero.svg)" }}></div>
        <div className="absolute inset-0" style={{ backgroundImage: "linear-gradient(to bottom, rgba(16, 43, 78, 0) 0%, rgba(16, 43, 78, 0.45) 55%, rgba(16, 43, 78, 0.75) 100%)" }}></div>
        <div className="relative mx-auto max-w-7xl px-6 py-12 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-100">{t("nav.certifications")}</p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight text-white">{t("certifications.title")}</h1>
          <p className="mt-4 max-w-2xl text-blue-50">{t("certifications.subtitle")}</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div className="grid gap-6 md:grid-cols-3">
          {CERTIFICATIONS.map((cert) => {
            const parcours = PARCOURS.find((item) => item.slug === cert.prepParcoursSlug);
            return (
              <article key={cert.slug} className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6">
                <h2 className="text-xl font-semibold text-navy">{cert.title}</h2>
                <p className="mt-2 text-sm text-slate-600">{cert.officialName}</p>

                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="rounded-full bg-surface px-3 py-1 text-xs font-semibold text-navy">{cert.family}</span>
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">{cert.mockExams ?? 0} {t("certifications.exams")}</span>
                </div>

                <div className="mt-6 flex-1 border-t border-slate-200 pt-4 text-sm text-slate-600">
                  <p>
                    <span className="font-semibold text-navy">{t("parcours.title")} :</span> {parcours ? parcours.title : cert.prepParcoursSlug}
                  </p>
                  <p className="mt-1">
                    <span className="font-semibold text-navy">{t("parcours.totalHours")} :</span> {parcours ? parcours.totalHours : 0} h
                  </p>
                </div>

                <Link
                  href="/parcours"
                  className="mt-8 inline-flex h-11 items-center justify-center rounded-lg bg-primary px-5 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
                >
                  {t("hero.explore")}
                </Link>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}

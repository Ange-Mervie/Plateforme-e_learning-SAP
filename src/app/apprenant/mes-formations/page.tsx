"use client";

import Link from "next/link";
import { COURSES } from "@/data/courses";
import { useLanguage } from "@/context/language-context";

export default function MesFormations() {
  const { t } = useLanguage();

  return (
    <main className="bg-white">
      <section className="bg-navy">
        <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-100">{t("nav.mesFormations")}</p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight text-white">{t("nav.mesFormations")}</h1>
          <p className="mt-4 max-w-2xl text-blue-50">{t("mesFormations.subtitle")}</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div className="grid gap-6 md:grid-cols-3">
          {COURSES.map((course) => (
            <article key={course.slug} className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6">
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-surface px-3 py-1 text-xs font-semibold text-navy">{course.module}</span>
                <span className="text-xs text-slate-600">{course.level}</span>
              </div>
              <h2 className="mt-3 text-lg font-semibold text-navy">{course.title}</h2>
              <p className="mt-2 text-sm text-slate-600">{course.summary}</p>
              <p className="mt-4 text-xs text-slate-600">
                {course.durationHours} h · {course.languages.join("/")} · {course.labIncluded ? "Lab inclus" : "Sans lab"}
              </p>
              <div className="mt-6 flex items-center justify-between border-t border-slate-200 pt-4">
                <span className="text-sm font-bold text-navy">{course.price ? `${course.price} FCFA` : "Sur devis"}</span>
                <Link href={`/cours/${course.slug}`} className="text-sm font-semibold text-primary hover:text-primary-dark">
                  Continuer →
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

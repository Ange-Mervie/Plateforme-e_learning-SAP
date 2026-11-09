"use client";

import Link from "next/link";
import { PARCOURS } from "@/data/parcours";
import { getCourseBySlug } from "@/data/courses";
import { useLanguage } from "@/context/language-context";

const PARCOURS_IMAGE: Record<string, string> = {
  "sap-functional-consultant": "/parcours/functional-consultant.svg",
  "sap-logistique": "/courses/mm.svg",
  "sap-abap-fiori": "/parcours/abap-developer.svg",
};

export default function Parcours() {
  const { t } = useLanguage();

  return (
    <main className="bg-white">
      <section className="bg-navy">
        <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-100">{t("nav.parcours")}</p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight text-white">{t("parcours.title")}</h1>
          <p className="mt-4 max-w-2xl text-blue-50">{t("parcours.subtitle")}</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div className="grid gap-6 md:grid-cols-3">
          {PARCOURS.map((parcours) => {
            const image = PARCOURS_IMAGE[parcours.slug];
            return (
              <article key={parcours.slug} className="relative flex flex-col rounded-2xl border border-slate-200 bg-white p-6">
                <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${image})` }} />
                <h2 className="text-xl font-semibold text-navy">{parcours.title}</h2>
                <p className="mt-2 text-sm text-slate-600">{parcours.summary}</p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {parcours.audience.map((audience) => (
                    <span key={audience} className="rounded-full bg-surface px-3 py-1 text-xs font-semibold text-navy">
                      {audience}
                    </span>
                  ))}
                </div>

                <ol className="mt-6 flex-1 space-y-3">
                  {parcours.steps.map((step) => {
                    const stepCourse = getCourseBySlug(step.courseSlug);
                    return (
                      <li key={step.courseSlug} className="flex items-start gap-3 text-sm">
                        <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                          {step.order}
                        </span>
                        <div>
                          <p className="font-medium text-navy">{stepCourse ? stepCourse.title : step.courseSlug}</p>
                          {stepCourse ? <p className="text-xs text-slate-600">{stepCourse.durationHours} h</p> : null}
                        </div>
                      </li>
                    );
                  })}
                </ol>

                <div className="mt-6 border-t border-slate-200 pt-4 text-sm text-slate-600">
                  <p>
                    <span className="font-semibold text-navy">{t("parcours.totalHours")} :</span> {parcours.totalHours} h
                  </p>
                  <p className="mt-1">
                    <span className="font-semibold text-navy">{t("parcours.certificationTarget")} :</span> {parcours.certificationTarget}
                  </p>
                  <p className="mt-1">
                    <span className="font-semibold text-navy">{t("parcours.price")} :</span> {parcours.price ? `${parcours.price} FCFA` : "Sur devis"}
                  </p>
                </div>

                <Link href="/catalogue" className="mt-8 inline-flex h-11 items-center justify-center rounded-lg bg-primary px-5 text-sm font-semibold text-white transition-colors hover:bg-primary-dark">
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

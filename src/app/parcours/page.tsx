"use client";

import Link from "next/link";
import { PARCOURS } from "@/data/parcours";
import { getCourseBySlug } from "@/data/courses";
import { useLanguage } from "@/context/language-context";
import { CheckCircle2, Clock, Award, ArrowRight } from "lucide-react";

export default function Parcours() {
  const { t } = useLanguage();

  return (
    <main className="bg-white">
      <section className="relative overflow-hidden bg-navy">
        <div className="absolute inset-0" style={{ backgroundImage: "url(/courses/hero.svg)", backgroundSize: "cover", opacity: 0.25 }}></div>
        <div className="absolute inset-0 bg-gradient-to-b from-navy/60 via-navy/85 to-navy"></div>
        <div className="relative mx-auto max-w-7xl px-6 py-16 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-200">{t("nav.parcours")}</p>
          <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-white sm:text-5xl">{t("parcours.title")}</h1>
          <p className="mt-4 max-w-2xl text-lg text-blue-100">{t("parcours.subtitle")}</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div className="grid gap-8 md:grid-cols-3">
          {PARCOURS.map((parcours) => {
            const firstStep = parcours.steps[0];
            const targetUrl = firstStep ? `/formation/${firstStep.courseSlug}` : "/catalogue";

            return (
              <article
                key={parcours.slug}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                {/* Header gradient banner */}
                <div className="h-3 bg-gradient-to-r from-primary to-navy"></div>

                <div className="p-7 flex flex-col flex-1">
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold tracking-normal text-primary">
                      {parcours.family}
                    </span>
                    <span className="flex items-center gap-1 text-xs font-semibold text-slate-500">
                      <Clock className="h-3.5 w-3.5" />
                      {parcours.totalHours} h
                    </span>
                  </div>

                  <h2 className="mt-4 text-2xl font-bold text-navy group-hover:text-primary transition-colors">
                    {parcours.title}
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{parcours.summary}</p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {parcours.audience.map((audience) => (
                      <span
                        key={audience}
                        className="rounded-full bg-surface px-3 py-1 text-xs font-medium text-slate-700"
                      >
                        {audience}
                      </span>
                    ))}
                  </div>

                  <div className="mt-6 border-t border-slate-100 pt-5">
                    <p className="text-xs font-semibold tracking-normal text-slate-400">
                      Modules inclus dans ce parcours
                    </p>
                    <ol className="mt-3 flex-1 space-y-2.5">
                      {parcours.steps.map((step) => {
                        const stepCourse = getCourseBySlug(step.courseSlug);
                        return (
                          <li key={step.courseSlug} className="flex items-start gap-3 text-sm">
                            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-50 text-xs font-bold text-primary">
                              {step.order}
                            </span>
                            <div className="min-w-0 flex-1">
                              <p className="font-medium text-navy text-sm truncate">
                                {stepCourse ? stepCourse.title : step.courseSlug}
                              </p>
                              {stepCourse ? (
                                <p className="text-xs text-slate-500">{stepCourse.durationHours} h · {stepCourse.level}</p>
                              ) : null}
                            </div>
                          </li>
                        );
                      })}
                    </ol>
                  </div>

                  <div className="mt-6 border-t border-slate-100 pt-4 text-sm text-slate-600">
                    {parcours.certificationTarget && (
                      <p className="flex items-center gap-2 text-xs font-medium text-navy">
                        <Award className="h-4 w-4 text-amber-500 shrink-0" />
                        <span>Cible : <span className="font-semibold">{parcours.certificationTarget}</span></span>
                      </p>
                    )}
                    <div className="mt-3 flex items-baseline justify-between">
                      <span className="text-xs text-slate-500">Tarif parcours</span>
                      <span className="text-xl font-bold text-navy">
                        {parcours.price ? `${parcours.price.toLocaleString("fr-FR")} FCFA` : "Sur devis"}
                      </span>
                    </div>
                  </div>

                  <Link
                    href={targetUrl}
                    className="mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-primary-dark"
                  >
                    <span>Découvrir le parcours</span>
                    <ArrowRight className="h-4 w-4" />
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

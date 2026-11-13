"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { PARCOURS } from "@/data/parcours";
import { getCourseBySlug } from "@/data/courses";
import { useLanguage } from "@/context/language-context";
import { Clock, Award, ArrowRight } from "lucide-react";

export default function Parcours() {
  const { t, lang } = useLanguage();
  const searchParams = useSearchParams();
  const track = (searchParams.get("track") === "odoo" ? "odoo" : "sap") as "sap" | "odoo";
  const isFr = lang === "fr";
  const items = PARCOURS.filter((p) => p.track === track);

  return (
    <main className="bg-white">
      <section className="relative overflow-hidden bg-navy">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url(/images/hero-parcours.jpg)" }}></div>
        <div className="absolute inset-0 bg-gradient-to-b from-navy/70 via-navy/80 to-navy/90"></div>
        <div className="relative mx-auto max-w-7xl px-6 py-16 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-200">{track === "sap" ? "SAP Training" : "Odoo Training"}</p>
          <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-white sm:text-5xl">{t("parcours.title")}</h1>
          <p className="mt-4 max-w-2xl text-lg text-blue-100">{t("parcours.subtitle")}</p>
          <div className="mt-6 flex gap-3">
            <Link href="/parcours?track=sap" className={`rounded-lg px-4 py-2 text-sm font-bold ${track==="sap"?"bg-white text-navy":"border border-white/30 text-white hover:bg-white/10"}`}>SAP Training</Link>
            <Link href="/parcours?track=odoo" className={`rounded-lg px-4 py-2 text-sm font-bold ${track==="odoo"?"bg-white text-navy":"border border-white/30 text-white hover:bg-white/10"}`}>Odoo Training</Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div className="grid gap-8 md:grid-cols-3">
          {items.map((parcours) => {
            const firstStep = parcours.steps[0];
            const firstCourse = firstStep ? getCourseBySlug(firstStep.courseSlug) : undefined;
            const targetUrl = firstStep ? `/formation/${firstStep.courseSlug}` : (track === "odoo" ? "/catalogue?track=odoo" : "/catalogue?track=sap");
            const cover = parcours.track === "odoo" ? "/images/odoo-logo.svg" : (firstCourse?.image || "/courses/hero.svg");
            return (
              <article key={parcours.slug} className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                <div className="relative h-36 overflow-hidden bg-slate-100">
                  <img src={cover} alt={parcours.title} className={`${parcours.track === "odoo" ? "object-contain p-6" : "object-cover"} h-full w-full`} />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy/80 to-transparent p-3 flex items-center justify-between">
                    <img src={parcours.track === "odoo" ? "/images/odoo-logo.svg" : "/images/sap-logo.svg"} alt={parcours.track} className={`h-5 w-auto ${parcours.track === "odoo" ? "rounded bg-white/90 px-1" : ""}`} />
                    <span className="flex items-center gap-1 text-xs font-semibold text-white"><Clock className="h-3.5 w-3.5" />{parcours.totalHours} h</span>
                  </div>
                </div>
                <div className="flex flex-1 flex-col p-7">
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold tracking-normal text-primary">{parcours.family}</span>
                  </div>
                  <h2 className="mt-4 text-xl font-bold text-navy transition-colors group-hover:text-primary">{isFr ? parcours.title : parcours.titleEn}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{isFr ? parcours.summary : parcours.summaryEn}</p>
                  <div className="mt-4 flex flex-wrap gap-2">{parcours.audience.map((audience) => (<span key={audience} className="rounded-full bg-surface px-3 py-1 text-xs font-medium text-slate-700">{audience}</span>))}</div>
                  <div className="mt-6 border-t border-slate-100 pt-5">
                    <p className="text-xs font-semibold tracking-normal text-slate-400">{t("parcours.modulesIncluded")}</p>
                    <ol className="mt-3 flex-1 space-y-2.5">
                      {parcours.steps.map((step) => {
                        const stepCourse = getCourseBySlug(step.courseSlug);
                        return (
                          <li key={step.courseSlug} className="flex items-start gap-3 text-sm">
                            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-50 text-xs font-bold text-primary">{step.order}</span>
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-medium text-navy">{stepCourse ? (isFr ? stepCourse.title : stepCourse.titleEn) : step.courseSlug}</p>
                              {stepCourse ? <p className="text-xs text-slate-500">{stepCourse.durationHours} h · {stepCourse.level}</p> : null}
                            </div>
                          </li>
                        );
                      })}
                    </ol>
                  </div>
                  <div className="mt-6 border-t border-slate-100 pt-4 text-sm text-slate-600">
                    {parcours.certificationTarget && (<p className="flex items-center gap-2 text-xs font-medium text-navy"><Award className="h-4 w-4 shrink-0 text-amber-500" /><span>{t("parcours.target")} <span className="font-semibold">{parcours.certificationTarget}</span></span></p>)}
                  </div>
                  <Link href={targetUrl} className="mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-primary-dark"><span>{t("parcours.discover")}</span><ArrowRight className="h-4 w-4" /></Link>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}

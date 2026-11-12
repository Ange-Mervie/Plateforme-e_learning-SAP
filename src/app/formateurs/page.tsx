"use client";

import Link from "next/link";
import { TRAINERS } from "@/data/trainers";
import { useLanguage } from "@/context/language-context";
import { Award, BookOpen, MessageSquare, ArrowRight, Mail, Phone } from "lucide-react";

export default function Formateurs() {
  const { t } = useLanguage();

  return (
    <main className="bg-white min-h-screen">
      <section className="relative overflow-hidden bg-navy">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: `url("/images/WhatsApp Image 2026-11-11 at 15.56.36.jpeg")` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-navy/60 via-navy/85 to-navy" />
        <div className="relative mx-auto max-w-7xl px-6 py-16 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-200">{t("nav.formateurs")}</p>
          <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-white sm:text-5xl">{t("formateurs.title")}</h1>
          <p className="mt-4 max-w-2xl text-lg text-blue-100">{t("formateurs.subtitle")}</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div className="grid gap-8 md:grid-cols-3">
          {TRAINERS.map((trainer) => (
            <article
              key={trainer.slug}
              className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg hover:border-primary"
            >
              <div className="relative h-48 overflow-hidden rounded-t-2xl bg-navy">
                <span className="absolute top-3 left-3 rounded-full bg-emerald-500/90 px-2 py-1 text-[10px] font-bold text-white shadow-sm">
                  Expert certifié
                </span>
                <div className="flex h-full w-full items-center justify-center rounded-t-2xl bg-navy text-2xl font-extrabold text-white shadow-md">
                  {trainer.name
                    .split(" ")
                    .map((part) => part[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()}
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-surface text-xl font-bold text-navy">
                    {trainer.name
                      .split(" ")
                      .map((part) => part[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase()}
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-navy leading-tight">{trainer.name}</h2>
                    <p className="text-xs font-semibold text-primary">{trainer.title}</p>
                    <p className="mt-0.5 text-[11px] text-slate-500">Cabinet IBN Group</p>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-1.5">
                  {trainer.specialties.map((s) => (
                    <span
                      key={s}
                      className="rounded-full bg-surface px-2.5 py-0.5 text-[11px] font-semibold text-slate-700"
                    >
                      {s}
                    </span>
                  ))}
                </div>

                <dl className="mt-6 grid grid-cols-2 gap-4 rounded-xl bg-surface p-4 text-xs">
                  <div>
                    <dt className="text-slate-500">{t("formateurs.experience")}</dt>
                    <dd className="mt-0.5 font-bold text-navy">
                      {trainer.yearsExperience} {t("formateurs.years")}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-slate-500">{t("formateurs.coursesTaught")}</dt>
                    <dd className="mt-0.5 font-bold text-navy">
                      {trainer.courseSlugs.length} modules
                    </dd>
                  </div>
                </dl>

                <p className="mt-5 text-xs leading-relaxed text-slate-600">{trainer.bio}</p>

                <div className="mt-6 flex flex-wrap gap-2">
                  {trainer.certifications.map((cert, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-blue-50 px-2 py-1 text-[11px] font-semibold text-navy"
                    >
                      <Award className="h-3 w-3 text-amber-500" /> {cert}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-auto pt-5 border-t border-slate-100 flex flex-col gap-2 p-4">
                <Link
                  href="/contact"
                  className="inline-flex h-10 items-center justify-center gap-2 w-full rounded-xl bg-primary text-xs font-bold text-white shadow-sm hover:bg-primary-dark transition-colors text-center"
                >
                  <MessageSquare className="h-3.5 w-3.5" />
                  <span>Contacter le formateur</span>
                </Link>
                <Link
                  href="/catalogue"
                  className="inline-flex h-10 items-center justify-center gap-2 w-full rounded-xl border border-slate-200 text-xs font-semibold text-navy hover:bg-surface transition-colors text-center"
                >
                  Consulter ses cours
                </Link>
              </div>
            </article>
          ))}
        </div>

        {/* Banner: Rejoindre l'académie */}
        <div className="mt-16 rounded-3xl bg-navy p-10 text-center text-white shadow-xl">
          <h2 className="text-3xl font-extrabold tracking-tight">{t("formateurs.expertTitle")}</h2>
          <p className="mx-auto mt-4 max-w-2xl text-blue-100 leading-relaxed">
            {t("formateurs.expertText")}
          </p>
          <Link
            href="/contact"
            className="mt-8 inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-primary px-8 text-sm font-bold text-white shadow-md hover:bg-primary-dark transition-all"
          >
            <span>{t("formateurs.proposeCourse")}</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}

"use client";

import Link from "next/link";
import { useLanguage } from "@/context/language-context";

const DOMAINS = [
  {
    image: "/parcours/functional-consultant.svg",
    titleKey: "domains.cards.fonctionnelTitle",
    descriptionKey: "domains.cards.fonctionnelDesc",
    modules: ["FI", "CO", "MM", "SD", "PP", "QM", "PM", "HCM"],
    skills: ["Gestion financière", "Comptabilité", "Achats", "Ventes", "RH"],
  },
  {
    image: "/parcours/abap-developer.svg",
    titleKey: "domains.cards.techniqueTitle",
    descriptionKey: "domains.cards.techniqueDesc",
    modules: ["ABAP", "Fiori", "BTP", "Basis", "Security"],
    skills: ["ABAP", "Fiori", "BTP", "Basis", "Sécurité"],
  },
  {
    image: "/parcours/data-analyst.svg",
    titleKey: "domains.cards.dataTitle",
    descriptionKey: "domains.cards.dataDesc",
    modules: ["HANA", "BW", "SAC", "Datasphere", "AI"],
    skills: ["HANA", "BW", "SAC", "Datasphere", "Business AI"],
  },
  {
    image: "/courses/hero.svg",
    titleKey: "domains.cards.solutionsTitle",
    descriptionKey: "domains.cards.solutionsDesc",
    modules: ["SF", "Ariba", "Concur", "Fieldglass", "Signavio"],
    skills: ["SuccessFactors", "Ariba", "Concur", "Fieldglass", "Signavio"],
  },
];

export default function Domains() {
  const { t } = useLanguage();
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">{t("domains.title")}</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-navy">{t("domains.subtitle")}</h2>
          </div>
          <Link href="/catalogue" className="hidden text-sm font-semibold text-primary hover:text-primary-dark sm:block">
            {t("popular.catalogue")} →
          </Link>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {DOMAINS.map((domain) => (
            <div key={domain.titleKey} className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white transition-shadow hover:shadow-lg">
              <div className="h-40 bg-cover bg-center" style={{ backgroundImage: `url(${domain.image})` }} />
              <div className="absolute inset-0 bg-navy/60" />
              <div className="relative p-6">
                <h3 className="text-lg font-semibold text-navy">{t(domain.titleKey)}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{t(domain.descriptionKey)}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {domain.modules.map((module) => (
                    <span key={module} className="rounded-full bg-surface px-3 py-1 text-xs font-semibold text-navy">
                      {module}
                    </span>
                  ))}
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {domain.skills.map((skill) => (
                    <span key={skill} className="rounded-full bg-surface px-3 py-1 text-xs font-semibold text-slate-600">
                      {skill}
                    </span>
                  ))}
                </div>
                <Link href="/catalogue" className="mt-6 inline-flex h-11 items-center justify-center rounded-lg bg-primary px-4 text-sm font-semibold text-white transition-colors hover:bg-primary-dark">
                  {t("domains.discoverCourses")}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

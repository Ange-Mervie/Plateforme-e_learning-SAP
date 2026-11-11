"use client";

import Link from "next/link";
import { useLanguage } from "@/context/language-context";
import { ArrowRight } from "lucide-react";

const DOMAINS = [
  {
    image: "/parcours/functional-consultant.svg",
    titleKey: "domains.cards.fonctionnelTitle",
    descriptionKey: "domains.cards.fonctionnelDesc",
    modules: ["FI", "CO", "MM", "SD", "PP", "HCM"],
    skills: ["Finance", "Comptabilité", "Achats", "Ventes"],
  },
  {
    image: "/parcours/abap-developer.svg",
    titleKey: "domains.cards.techniqueTitle",
    descriptionKey: "domains.cards.techniqueDesc",
    modules: ["ABAP", "Fiori", "BTP", "Basis", "Sécurité"],
    skills: ["ABAP RAP", "Fiori", "BTP", "Basis"],
  },
  {
    image: "/parcours/data-analyst.svg",
    titleKey: "domains.cards.dataTitle",
    descriptionKey: "domains.cards.dataDesc",
    modules: ["HANA", "BW/4", "SAC", "Datasphere", "AI"],
    skills: ["HANA", "BW/4HANA", "Analytics Cloud"],
  },
  {
    image: "/courses/hero.svg",
    titleKey: "domains.cards.solutionsTitle",
    descriptionKey: "domains.cards.solutionsDesc",
    modules: ["Ariba", "SuccessFactors", "Concur", "Signavio"],
    skills: ["Ariba", "SuccessFactors", "Transformation"],
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
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-navy">{t("domains.subtitle")}</h2>
          </div>
          <Link href="/catalogue" className="hidden text-sm font-bold text-primary hover:text-primary-dark sm:block">
            {t("popular.catalogue")} →
          </Link>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {DOMAINS.map((domain) => (
            <div
              key={domain.titleKey}
              className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="relative h-40 overflow-hidden bg-navy">
                <div
                  className="h-full w-full bg-gradient-to-br from-primary/30 to-primary/60 transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/40 to-transparent" />
              </div>

              <div className="flex flex-1 flex-col justify-between p-6">
                <div>
                  <h3 className="text-lg font-bold text-navy group-hover:text-primary transition-colors">
                    {t(domain.titleKey)}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-slate-600">{t(domain.descriptionKey)}</p>

                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {domain.modules.map((module) => (
                      <span
                        key={module}
                        className="rounded-md bg-surface px-2 py-0.5 text-[11px] font-bold text-navy"
                      >
                        {module}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-6 border-t border-slate-100 pt-4">
                  <Link
                    href="/catalogue"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-white shadow-sm transition-colors hover:bg-primary-dark"
                  >
                    <span>{t("domains.discoverCourses")}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

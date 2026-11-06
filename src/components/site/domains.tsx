"use client";

import Link from "next/link";
import { useLanguage } from "@/context/language-context";
import { Landmark, Code2, Database, Layers } from "lucide-react";

const DOMAINS = [
  {
    icon: Landmark,
    titleKey: "domains.cards.fonctionnelTitle",
    descriptionKey: "domains.cards.fonctionnelDesc",
    modules: ["FI", "CO", "MM", "SD", "PP", "QM", "PM", "HCM"],
  },
  {
    icon: Code2,
    titleKey: "domains.cards.techniqueTitle",
    descriptionKey: "domains.cards.techniqueDesc",
    modules: ["ABAP", "Fiori", "BTP", "Basis", "Security"],
  },
  {
    icon: Database,
    titleKey: "domains.cards.dataTitle",
    descriptionKey: "domains.cards.dataDesc",
    modules: ["HANA", "BW", "SAC", "Datasphere", "AI"],
  },
  {
    icon: Layers,
    titleKey: "domains.cards.solutionsTitle",
    descriptionKey: "domains.cards.solutionsDesc",
    modules: ["SF", "Ariba", "Concur", "Fieldglass", "Signavio"],
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
            <div key={domain.titleKey} className="rounded-2xl border border-slate-200 bg-white p-6 transition-shadow hover:shadow-lg">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-surface text-primary">
                <domain.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-5 text-lg font-semibold text-navy">{t(domain.titleKey)}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{t(domain.descriptionKey)}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {domain.modules.map((module) => (
                  <span key={module} className="rounded-full bg-surface px-3 py-1 text-xs font-semibold text-navy">
                    {module}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

"use client";

import Link from "next/link";
import { useLanguage } from "@/context/language-context";
import { ArrowRight, CheckCircle2 } from "lucide-react";

const PATHS = [
  {
    title: "SAP ABAP Developer",
    image: "/parcours/abap-developer.svg",
    objective:
      "Former des développeurs capables de créer, maintenir et faire évoluer des applications dans l’environnement SAP S/4HANA.",
    finalProject: "Atelier pratique de développement RAP & Fiori",
  },
  {
    title: "SAP Basis Administrator",
    image: "/parcours/basis-administrator.svg",
    objective:
      "Participer à l’installation, l’administration, la surveillance et la maintenance des architectures techniques SAP.",
    finalProject: "Projet d'administration système & transports",
  },
  {
    title: "SAP Functional Consultant",
    image: "/parcours/functional-consultant.svg",
    objective:
      "Maîtriser les processus d’entreprise (FI, MM, SD) et les traduire en solutions paramétrées dans l'ERP SAP.",
    finalProject: "Étude de cas d'intégration inter-modules",
  },
  {
    title: "SAP Data Analyst",
    image: "/parcours/data-analyst.svg",
    objective:
      "Exploiter les données d'entreprise et produire des tableaux de bord analytiques décisionnels avec SAP Analytics Cloud.",
    finalProject: "Projet décisionnel & KPIs d'entreprise",
  },
];

export default function Paths() {
  const { t } = useLanguage();
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">{t("paths.eyebrow")}</p>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-navy">{t("paths.title")}</h2>
          </div>
          <Link href="/parcours" className="hidden text-sm font-bold text-primary hover:text-primary-dark sm:block">
            {t("paths.all")}
          </Link>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {PATHS.map((path) => (
            <div
              key={path.title}
              className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
            >
              {/* Header Image with constrained overlay */}
              <div className="relative h-44 overflow-hidden bg-navy">
                <div
                  className="h-full w-full bg-gradient-to-br from-primary/30 to-primary/60 transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/40 to-transparent" />
                <span className="absolute bottom-3 left-4 rounded-md bg-primary/90 px-2.5 py-1 text-xs font-bold text-white shadow-sm">
                  Cursus Certifiant
                </span>
              </div>

              {/* Card Body */}
              <div className="flex flex-1 flex-col justify-between p-6">
                <div>
                  <h3 className="text-lg font-bold text-navy group-hover:text-primary transition-colors">
                    {path.title}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-slate-600">{path.objective}</p>
                  <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
                    <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-600" />
                    <span>{path.finalProject}</span>
                  </div>
                </div>

                <div className="mt-6 border-t border-slate-100 pt-4">
                  <Link
                    href="/parcours"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-white shadow-sm transition-colors hover:bg-primary-dark"
                  >
                    <span>{t("paths.discover")}</span>
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

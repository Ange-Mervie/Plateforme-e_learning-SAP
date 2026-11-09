"use client";

import Link from "next/link";
import { useLanguage } from "@/context/language-context";

const PATHS = [
  {
    title: "SAP ABAP Developer",
    image: "/parcours/abap-developer.svg",
    objective:
      "Former des développeurs capables de créer, maintenir et faire évoluer des applications dans l’environnement SAP.",
    content: [
      "Introduction à SAP et à l’architecture.",
      "Fondamentaux du langage ABAP.",
      "Variables, types et structures de données.",
      "Conditions, boucles et traitements.",
      "Programmation orientée objet ABAP.",
      "ABAP Dictionary.",
      "Open SQL.",
      "Gestion des erreurs et débogage.",
      "Introduction aux CDS Views.",
      "Projet pratique de développement.",
    ],
    skills: [
      "Lire et comprendre un programme ABAP.",
      "Développer des programmes.",
      "Manipuler les données SAP.",
      "Déboguer et corriger des erreurs.",
      "Participer à l’évolution d’applications SAP.",
    ],
    finalProject: "Projet pratique de développement.",
  },
  {
    title: "SAP Basis Administrator",
    image: "/parcours/basis-administrator.svg",
    objective:
      "Former des professionnels capables de participer à l’installation, l’administration, la surveillance et la maintenance des environnements SAP.",
    content: [
      "Architecture des systèmes SAP.",
      "Introduction à SAP BASIS.",
      "SAP GUI et environnement système.",
      "Gestion des utilisateurs et autorisations.",
      "Gestion des transports.",
      "Surveillance et administration.",
      "Gestion des jobs et des performances.",
      "Sauvegarde et restauration.",
      "Maintenance et dépannage.",
      "Projet pratique d’administration.",
    ],
    skills: [
      "Comprendre l’architecture SAP.",
      "Administrer les environnements SAP.",
      "Surveiller les systèmes.",
      "Gérer les opérations techniques.",
      "Diagnostiquer des incidents.",
    ],
    finalProject: "Projet pratique d’administration.",
  },
  {
    title: "SAP Functional Consultant",
    image: "/parcours/functional-consultant.svg",
    objective:
      "Former des consultants capables de comprendre les processus d’une entreprise et de les traduire en solutions fonctionnelles SAP.",
    content: [
      "Introduction à l’ERP et SAP S/4HANA.",
      "Compréhension des processus d’entreprise.",
      "SAP FI.",
      "SAP MM.",
      "SAP SD.",
      "Notions de paramétrage.",
      "Intégration entre les modules.",
      "Analyse des besoins métier.",
      "Documentation fonctionnelle.",
      "Étude de cas pratique.",
    ],
    skills: [
      "Comprendre les processus métiers.",
      "Identifier les besoins d’une entreprise.",
      "Comprendre les interactions entre modules.",
      "Participer à la configuration fonctionnelle.",
      "Rédiger des spécifications fonctionnelles.",
    ],
    finalProject: "Étude de cas pratique.",
  },
  {
    title: "SAP Data Analyst",
    image: "/parcours/data-analyst.svg",
    objective:
      "Former des professionnels capables d’exploiter les données et de produire des analyses utiles à la prise de décision.",
    content: [
      "Introduction aux données SAP.",
      "Fondamentaux de la Business Intelligence.",
      "Extraction et préparation des données.",
      "Modélisation des données.",
      "Analyse et indicateurs de performance.",
      "SAP Analytics Cloud.",
      "Tableaux de bord.",
      "Reporting.",
      "Interprétation des résultats.",
      "Projet pratique d’analyse.",
    ],
    skills: [
      "Comprendre les données d’entreprise.",
      "Analyser les indicateurs.",
      "Construire des tableaux de bord.",
      "Produire des rapports.",
      "Présenter des résultats exploitables.",
    ],
    finalProject: "Projet pratique d’analyse.",
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
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-navy">{t("paths.title")}</h2>
          </div>
          <Link href="/parcours" className="hidden text-sm font-semibold text-primary hover:text-primary-dark sm:block">
            {t("paths.all")}
          </Link>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {PATHS.map((path) => (
            <div key={path.title} className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white transition-shadow hover:shadow-lg">
              <div className="h-40 bg-cover bg-center" style={{ backgroundImage: `url(${path.image})` }} />
              <div className="absolute inset-0 bg-navy/60" />
              <div className="relative p-6">
                <h3 className="text-lg font-semibold text-navy">{path.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">{path.objective}</p>
                <p className="mt-4 text-sm font-medium text-primary">{path.finalProject}</p>
                <Link href={`/parcours/${path.title}`} className="mt-6 inline-flex h-11 items-center justify-center rounded-lg bg-primary px-4 text-sm font-semibold text-white transition-colors hover:bg-primary-dark">
                  {t("paths.discover")}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

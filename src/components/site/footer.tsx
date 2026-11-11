"use client";

import Link from "next/link";
import { useLanguage } from "@/context/language-context";

const COLUMNS = [
  {
    key: "footer.platform",
    title: "Plateforme",
    links: [
      { label: "Catalogue des formations", href: "/catalogue" },
      { label: "Parcours certifiants", href: "/parcours" },
      { label: "Espace apprenant", href: "/apprenant" },
      { label: "Certifications officielles", href: "/certifications" },
    ],
  },
  {
    key: "footer.resources",
    title: "Ressources & Évaluations",
    links: [
      { label: "Évaluation & Quiz", href: "/evaluation" },
      { label: "Attestations de réussite", href: "/attestation" },
      { label: "Projet & Soutenance", href: "/projet" },
      { label: "Nos formateurs experts", href: "/formateurs" },
    ],
  },
  {
    key: "footer.enterprise",
    title: "Entreprise & Conseil",
    links: [
      { label: "À propos d'IBN Group", href: "/ibn-group" },
      { label: "Formations sur mesure", href: "/ibn-group#contact" },
      { label: "Accompagnement S/4HANA", href: "/ibn-group" },
      { label: "Paiement & Financement", href: "/paiement" },
    ],
  },
];

export default function Footer() {
  const { t } = useLanguage();
  return (
    <footer className="bg-navy text-blue-100 border-t border-slate-800">
      <div className="mx-auto max-w-7xl px-6 py-14 lg:px-8">
        <div className="grid gap-10 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-sm font-bold text-navy">
                SAP
              </span>
              <span className="text-lg font-bold tracking-tight text-white">
                ELEVATE <span className="text-xs font-normal text-blue-300">By IBN</span>
              </span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-6 text-blue-200">
              {t("footer.tagline")}
            </p>
            <p className="mt-3 text-xs text-blue-300">
              Cabinet international de conseil, intégration ERP et montée en compétences SAP.
            </p>
          </div>
          {COLUMNS.map((column) => (
            <div key={column.key}>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-white">
                {t(column.key)}
              </h3>
              <ul className="mt-4 space-y-3">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-blue-200 transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-sm text-blue-200 md:flex-row">
          <p>© 2026 ELEVATE By IBN — Propulsé par IBN Group. Tous droits réservés.</p>
          <div className="flex gap-6 text-xs text-blue-300">
            <Link href="/catalogue" className="hover:text-white">Catalogue</Link>
            <Link href="/certifications" className="hover:text-white">Certifications</Link>
            <Link href="/ibn-group" className="hover:text-white">IBN Group</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

"use client";

import Link from "next/link";
import { useLanguage } from "@/context/language-context";

const COLUMNS = [
  { key: "footer.platform", title: "Plateforme", links: [{ label: "Catalogue des formations", href: "/catalogue" }, { label: "Parcours de formation", href: "/parcours" }, { label: "Espace apprenant", href: "/apprenant" }, { label: "Espace formateur", href: "/formateur" }] },
  { key: "footer.resources", title: "Ressources", links: [{ label: "Documentation SAP", href: "/ressources" }, { label: "Blog", href: "/blog" }, { label: "FAQ", href: "/faq" }] },
  { key: "footer.enterprise", title: "Entreprise & Université", links: [{ label: "Offre universités", href: "/universites" }, { label: "Offre entreprises", href: "/entreprises" }, { label: "Pack sur mesure", href: "/sur-mesure" }] },
];

export default function Footer() {
  const { t } = useLanguage();
  return (
    <footer className="bg-navy text-blue-100">
      <div className="mx-auto max-w-7xl px-6 py-14 lg:px-8">
        <div className="grid gap-10 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-sm font-bold text-navy">SAP</span>
              <span className="text-lg font-semibold tracking-tight text-white">Academy</span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-6 text-blue-100">{t("footer.tagline")}</p>
          </div>
          {COLUMNS.map((column) => (
            <div key={column.key}>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-white">{t(column.key)}</h3>
              <ul className="mt-4 space-y-3">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-sm text-blue-100 transition-colors hover:text-white">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 border-t border-white/10 pt-8 text-sm text-blue-100">
          <p>© 2026 SAP Academy — [VotreMarque] Academy. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}

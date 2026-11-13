"use client";

import Link from "next/link";
import { useLanguage } from "@/context/language-context";

const IBN_LINKEDIN = "https://www.linkedin.com/in/ibn-group-755332227/";
const LinkedinIcon = ({ className = "h-5 w-5" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);


export default function Footer() {
  const { t } = useLanguage();

  const columns = [
    {
      title: t("footer.platform"),
      links: [
        { label: t("nav.catalogue"), href: "/catalogue?track=sap" },
        { label: t("nav.parcours"), href: "/parcours?track=sap" },
        { label: t("nav.mesFormations"), href: "/apprenant" },
        { label: t("nav.certifications"), href: "/certifications?track=sap" },
      ],
    },
    {
      title: t("footer.resources"),
      links: [
        { label: t("nav.formateurs"), href: "/formateurs?track=sap" },
        { label: t("nav.requests"), href: "/contact" },
        { label: t("nav.realisations"), href: "/ibn-group#realisations" },
        { label: t("nav.ibnGroup"), href: "/ibn-group" },
      ],
    },
    {
      title: t("footer.enterprise"),
      links: [
        { label: t("ibnGroup.decouvrirIbn"), href: "/ibn-group" },
        { label: t("ibnGroup.accompagnement"), href: "/ibn-group#accompagnement" },
        { label: t("ibnGroup.contact"), href: "/ibn-group#contact" },
      ],
    },
  ];

  return (
    <footer className="border-t border-slate-800 bg-navy text-blue-100">
      <div className="mx-auto max-w-7xl px-6 py-14 lg:px-8">
        <div className="grid gap-10 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-sm font-bold text-navy">SAP</span>
              <span className="text-lg font-bold tracking-tight text-white">
                ELEVATE <span className="text-xs font-normal text-blue-300">By IBN</span>
              </span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-6 text-blue-200">{t("footer.tagline")}</p>
            <p className="mt-3 text-xs text-blue-300">{t("footer.tagline2")}</p>
            <div className="mt-5 flex items-center gap-3">
              <a
                href={IBN_LINKEDIN}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${t("ibnGroup.followLinkedin")} (opens in a new tab)`}
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/20 text-white transition-colors hover:bg-white/10"
              >
                <LinkedinIcon className="h-5 w-5" />
              </a>
            </div>
          </div>
          {columns.map((column) => (
            <div key={column.title}>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-white">{column.title}</h3>
              <ul className="mt-4 space-y-3">
                {column.links.map((link) => (
                  <li key={link.href + link.label}>
                    <Link href={link.href} className="text-sm text-blue-200 transition-colors hover:text-white">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-sm text-blue-200 md:flex-row">
          <p>{t("footer.rights")}</p>
          <div className="flex gap-6 text-xs text-blue-300">
            <Link href="/catalogue?track=sap" className="hover:text-white">{t("nav.catalogue")}</Link>
            <Link href="/certifications?track=sap" className="hover:text-white">{t("nav.certifications")}</Link>
            <Link href="/ibn-group" className="hover:text-white">{t("nav.ibnGroup")}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

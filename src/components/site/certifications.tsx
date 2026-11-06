"use client";

import Link from "next/link";
import { useLanguage } from "@/context/language-context";

export default function Certifications() {
  const { t } = useLanguage();
  return (
    <section className="bg-surface">
      <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-8 rounded-3xl bg-navy p-10 lg:flex-row lg:items-center">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-100">{t("nav.certifications")}</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-white">{t("certifications.title")}</h2>
            <p className="mt-4 text-blue-50">{t("certifications.subtitle")}</p>
          </div>
          <Link href="/certifications" className="inline-flex h-12 shrink-0 items-center justify-center rounded-lg bg-primary px-6 text-sm font-semibold text-white transition-colors hover:bg-primary-dark">
            {t("certifications.cta")}
          </Link>
        </div>
      </div>
    </section>
  );
}

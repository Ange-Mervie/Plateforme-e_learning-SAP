"use client";

import Link from "next/link";
import { TRAINERS } from "@/data/trainers";
import { useLanguage } from "@/context/language-context";

export default function Formateurs() {
  const { t } = useLanguage();

  return (
    <main className="bg-white">
      <section className="bg-navy">
        <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-100">{t("nav.formateurs")}</p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight text-white">{t("formateurs.title")}</h1>
          <p className="mt-4 max-w-2xl text-blue-50">{t("formateurs.subtitle")}</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div className="grid gap-6 md:grid-cols-3">
          {TRAINERS.map((trainer) => (
            <article key={trainer.slug} className="rounded-2xl border border-slate-200 bg-white p-6">
              <div className="flex items-center gap-4">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-lg font-bold text-primary">
                  {trainer.name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase()}
                </span>
                <div>
                  <h2 className="text-lg font-semibold text-navy">{trainer.name}</h2>
                  <p className="mt-1 text-sm text-slate-600">{trainer.title}</p>
                </div>
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                {trainer.specialties.map((s) => (
                  <span key={s} className="rounded-full bg-surface px-3 py-1 text-xs font-semibold text-navy">
                    {s}
                  </span>
                ))}
              </div>
              <dl className="mt-6 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <dt className="text-xs text-slate-600">Expérience</dt>
                  <dd className="font-semibold text-navy">{trainer.yearsExperience} ans</dd>
                </div>
                <div>
                  <dt className="text-xs text-slate-600">Cours animés</dt>
                  <dd className="font-semibold text-navy">{trainer.courseSlugs.length}</dd>
                </div>
              </dl>
              <p className="mt-5 text-sm text-slate-600">{trainer.bio}</p>
            </article>
          ))}
        </div>

        <div className="mt-16 rounded-3xl bg-navy p-10 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white">Vous êtes expert SAP ?</h2>
          <p className="mx-auto mt-4 max-w-2xl text-blue-50">
            Rejoignez notre équipe de formateurs. Proposez un cours, partagez un cas réel et formez la prochaine génération.
          </p>
          <Link
            href="/inscription"
            className="mt-8 inline-flex h-12 items-center justify-center rounded-lg bg-primary px-6 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
          >
            Proposer un cours
          </Link>
        </div>
      </section>
    </main>
  );
}

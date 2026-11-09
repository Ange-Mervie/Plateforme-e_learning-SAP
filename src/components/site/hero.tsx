"use client";

import Link from "next/link";
import { useLanguage } from "@/context/language-context";

export default function Hero() {
  const { t } = useLanguage();

  return (
    <section className="relative overflow-hidden bg-navy">
      <div className="absolute inset-0 bg-[url('/courses/hero.svg')] bg-cover bg-center"></div>
      <div className="absolute inset-0" style={{ backgroundImage: "linear-gradient(to bottom, rgba(16, 43, 78, 0) 0%, rgba(16, 43, 78, 0.45) 55%, rgba(16, 43, 78, 0.75) 100%)" }}></div>
      <div className="relative mx-auto max-w-7xl px-6 py-20 lg:py-28">
        <div className="grid items-center gap-14 lg:grid-cols-2">
          <div>
            <h1 className="mt-6 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Bienvenue sur SAP Learning Academy
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-blue-50">
              {t("hero.subtitle")}
            </p>

            <form className="mt-8 flex max-w-xl items-center rounded-xl bg-white p-2 shadow-xl">
              <input
                type="text"
                placeholder={t("hero.searchPlaceholder")}
                className="h-12 w-full bg-transparent px-4 text-sm text-navy outline-none placeholder:text-slate-400"
              />
              <button
                type="submit"
                className="h-12 rounded-lg bg-primary px-6 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
              >
                {t("hero.searchButton")}
              </button>
            </form>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="/catalogue"
                className="inline-flex h-12 items-center justify-center rounded-lg bg-primary px-6 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
              >
                {t("hero.explore")}
              </Link>
              <Link
                href="/parcours"
                className="inline-flex h-12 items-center justify-center rounded-lg border border-white/40 bg-white/5 px-6 text-sm font-semibold text-white backdrop-blur transition-colors hover:bg-white/15"
              >
                {t("hero.discover")}
              </Link>
            </div>
          </div>

          <div className="relative hidden lg:block">
            <div className="rounded-2xl border border-white/15 bg-white/10 p-6 shadow-2xl backdrop-blur">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-blue-100">SAP Academy</p>
                  <p className="mt-1 text-xl font-semibold text-white">Learning dashboard</p>
                </div>
                <div className="h-10 w-10 rounded-lg bg-primary/30" />
              </div>
              <div className="mt-6 grid grid-cols-3 gap-4">
                {[
                  { label: "Courses followed", value: "3" },
                  { label: "Hours", value: "18h" },
                  { label: "Certificates", value: "1" },
                ].map((stat) => (
                  <div key={stat.label} className="rounded-xl bg-white/10 p-4">
                    <p className="text-2xl font-bold text-white">{stat.value}</p>
                    <p className="mt-1 text-xs text-blue-100">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

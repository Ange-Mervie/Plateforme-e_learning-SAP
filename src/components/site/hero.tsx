"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/language-context";
import { Search, Sparkles, BookOpen, Award, CheckCircle2, ArrowRight } from "lucide-react";

export default function Hero() {
  const { t } = useLanguage();
  const router = useRouter();
  const [query, setQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/catalogue?q=${encodeURIComponent(query.trim())}`);
    } else {
      router.push("/catalogue");
    }
  };

  return (
    <section className="relative overflow-hidden bg-navy text-white">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-25"
        style={{ backgroundImage: "url('/courses/hero.svg')" }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-navy/60 via-navy/90 to-navy" />

      <div className="relative mx-auto max-w-7xl px-6 py-20 lg:py-28">
        <div className="grid items-center gap-14 lg:grid-cols-2">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/20 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-blue-200 backdrop-blur">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              <span>Plateforme Officielle · IBN Group</span>
            </div>

            <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl leading-tight">
              Bienvenue sur <span className="text-blue-300">SAP Learning Academy</span>
            </h1>

            <p className="mt-6 max-w-xl text-base sm:text-lg leading-relaxed text-blue-100">
              {t("hero.subtitle")}
            </p>

            {/* Interactive Search Bar */}
            <form onSubmit={handleSearch} className="mt-8 flex max-w-xl items-center rounded-2xl bg-white p-2 shadow-2xl">
              <div className="relative flex flex-1 items-center">
                <Search className="absolute left-4 h-5 w-5 text-slate-400" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={t("hero.searchPlaceholder")}
                  className="h-12 w-full bg-transparent pl-12 pr-4 text-sm text-navy outline-none placeholder:text-slate-400"
                />
              </div>
              <button
                type="submit"
                className="h-12 rounded-xl bg-primary px-6 text-sm font-bold text-white shadow-md transition-colors hover:bg-primary-dark shrink-0"
              >
                {t("hero.searchButton")}
              </button>
            </form>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="/catalogue"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-primary px-7 text-sm font-bold text-white shadow-lg transition-all hover:bg-primary-dark"
              >
                <span>{t("hero.explore")}</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/parcours"
                className="inline-flex h-12 items-center justify-center rounded-xl border border-white/20 bg-white/10 px-7 text-sm font-semibold text-white backdrop-blur transition-all hover:bg-white/20"
              >
                {t("hero.discover")}
              </Link>
            </div>
          </div>

          {/* Interactive Feature Card / Visual Preview */}
          <div className="relative hidden lg:block">
            <div className="rounded-3xl border border-white/15 bg-white/10 p-8 shadow-2xl backdrop-blur-md space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-sm font-bold text-white">
                    SAP
                  </span>
                  <div>
                    <p className="text-xs font-semibold text-blue-200">Accréditation Officielle</p>
                    <p className="text-base font-bold text-white">Cursus Consultant S/4HANA</p>
                  </div>
                </div>
                <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-300">
                  En ligne 24/7
                </span>
              </div>

              <div className="space-y-3 text-xs text-blue-100">
                <div className="flex items-center gap-3 rounded-xl bg-white/5 p-3.5 border border-white/5">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
                  <span>Ateliers pratiques et Labs sur environnement SAP Fiori réel</span>
                </div>
                <div className="flex items-center gap-3 rounded-xl bg-white/5 p-3.5 border border-white/5">
                  <Award className="h-5 w-5 text-amber-400 shrink-0" />
                  <span>Préparation aux examens blancs de certification SAP</span>
                </div>
                <div className="flex items-center gap-3 rounded-xl bg-white/5 p-3.5 border border-white/5">
                  <BookOpen className="h-5 w-5 text-blue-300 shrink-0" />
                  <span>Attestation officielle de réussite signée par le cabinet IBN Group</span>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between text-xs text-blue-200 border-t border-white/10">
                <span>1 500+ apprenants certifiés</span>
                <span className="font-bold text-white">Taux de réussite : 96 %</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

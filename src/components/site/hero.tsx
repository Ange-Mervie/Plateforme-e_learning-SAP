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
        className="absolute inset-0 bg-cover bg-center opacity-30"
        style={{ backgroundImage: `url("/images/WhatsApp Image 2026-11-11 at 15.56.36.jpeg")`, backgroundPosition: "center 20%" }}
      />

      <div className="relative mx-auto max-w-7xl px-6 py-20 lg:py-28">
        <div className="grid items-center gap-14 lg:grid-cols-2">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/20 px-3.5 py-1.5 text-xs font-semibold tracking-normal text-blue-200 backdrop-blur">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              <span>{t("hero.badge")}</span>
            </div>

            <h1 className="mt-4 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              {t("hero.welcome")} <span className="text-blue-300">{t("hero.brand")}</span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-relaxed text-blue-100 sm:text-lg">
              {t("hero.subtitle")}
            </p>

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
              <button type="submit" className="h-12 shrink-0 rounded-xl bg-primary px-6 text-sm font-bold text-white shadow-md transition-colors hover:bg-primary-dark">
                {t("hero.searchButton")}
              </button>
            </form>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link href="/catalogue?track=sap" className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-primary px-7 text-sm font-bold text-white shadow-lg transition-all hover:bg-primary-dark">
                <span>{t("hero.explore")}</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/parcours?track=sap" className="inline-flex h-12 items-center justify-center rounded-xl border border-white/20 bg-white/10 px-7 text-sm font-semibold text-white backdrop-blur transition-all hover:bg-white/20">
                {t("hero.discover")}
              </Link>
            </div>
          </div>

          <div className="relative hidden lg:block">
            <div className="space-y-6 rounded-2xl border border-white/15 bg-white/10 p-8 shadow-2xl backdrop-blur-md">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-sm font-bold text-white">SAP</span>
                  <div>
                    <p className="text-xs font-semibold text-blue-200">{t("hero.accreditation")}</p>
                    <p className="text-base font-bold text-white">{t("hero.cursus")}</p>
                  </div>
                </div>
                <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-300">{t("hero.online")}</span>
              </div>

              <div className="space-y-3 text-xs text-blue-100">
                <div className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/5 p-3.5">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400" />
                  <span>{t("hero.feature1")}</span>
                </div>
                <div className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/5 p-3.5">
                  <Award className="h-5 w-5 shrink-0 text-amber-400" />
                  <span>{t("hero.feature2")}</span>
                </div>
                <div className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/5 p-3.5">
                  <BookOpen className="h-5 w-5 shrink-0 text-blue-300" />
                  <span>{t("hero.feature3")}</span>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-white/10 pt-2 text-xs text-blue-200">
                <span>{t("hero.learners")}</span>
                <span className="font-bold text-white">{t("hero.successRate")}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

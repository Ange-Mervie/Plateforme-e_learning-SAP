"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { COURSES } from "@/data/courses";
import { formatEur, formatXaf, eurToXaf } from "@/lib/currency";
import { useLanguage } from "@/context/language-context";
import { Search, SlidersHorizontal, BookOpen, Clock, ArrowRight } from "lucide-react";

const FAMILY_OPTIONS = [
  { id: "finance", label: "Finance (FI / CO)" },
  { id: "logistique", label: "Logistique & Supply (MM / SD)" },
  { id: "technique", label: "Technique & Dev (ABAP / Fiori)" },
  { id: "donnees", label: "Data & Analytics (BW / HANA)" },
  { id: "plateforme", label: "SAP BTP & Plateforme" },
  { id: "cloud", label: "Cloud ERP & S/4HANA" },
];

const LEVEL_OPTIONS = [
  { id: "decouverte", label: "Découverte & Initiation" },
  { id: "fondamentaux", label: "Fondamentaux métier" },
  { id: "consultant", label: "Consultant confirmé" },
  { id: "expert", label: "Expert & Architecture" },
];

const DURATION_BANDS = [
  { id: "short", label: "Moins de 6 heures", min: 0, max: 6 },
  { id: "medium", label: "6 à 8 heures", min: 6, max: 8 },
  { id: "long", label: "Plus de 8 heures", min: 8, max: 999 },
];

const SORT_OPTIONS = [
  { id: "relevance", label: "Par pertinence" },
  { id: "priceAsc", label: "Prix croissant" },
  { id: "priceDesc", label: "Prix décroissant" },
  { id: "durationDesc", label: "Durée décroissante" },
];

export default function Catalogue() {
  const { t } = useLanguage();
  const [query, setQuery] = useState("");
  const [families, setFamilies] = useState<string[]>([]);
  const [levels, setLevels] = useState<string[]>([]);
  const [duration, setDuration] = useState<string | null>(null);
  const [labIncluded, setLabIncluded] = useState(false);
  const [certificationPrep, setCertificationPrep] = useState(false);
  const [freeOnly, setFreeOnly] = useState(false);
  const [sort, setSort] = useState<string>("relevance");

  const filteredCourses = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = COURSES.filter((course) => {
      if (q && !`${course.title} ${course.summary} ${course.module}`.toLowerCase().includes(q)) return false;
      if (families.length > 0 && !families.includes(course.family)) return false;
      if (levels.length > 0 && !levels.includes(course.level)) return false;
      if (duration) {
        const band = DURATION_BANDS.find((b) => b.id === duration);
        if (band) {
          const hours = course.durationHours;
          if (hours < band.min || hours > band.max) return false;
        }
      }
      if (labIncluded && !course.labIncluded) return false;
      if (certificationPrep && !course.certificationPrep) return false;
      if (freeOnly && !course.free) return false;
      return true;
    });

    if (sort === "priceAsc") {
      list.sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (sort === "priceDesc") {
      list.sort((a, b) => (b.price || 0) - (a.price || 0));
    } else if (sort === "durationDesc") {
      list.sort((a, b) => b.durationHours - a.durationHours);
    }

    return list;
  }, [query, families, levels, duration, labIncluded, certificationPrep, freeOnly, sort]);

  const toggleInList = (list: string[], setList: (value: string[]) => void, value: string) => {
    setList(list.includes(value) ? list.filter((item) => item !== value) : [...list, value]);
  };

  const resetFilters = () => {
    setQuery("");
    setFamilies([]);
    setLevels([]);
    setDuration(null);
    setLabIncluded(false);
    setCertificationPrep(false);
    setFreeOnly(false);
    setSort("relevance");
  };

  const activeChips: { key: string; label: string; clear: () => void }[] = [];
  if (query) activeChips.push({ key: "q", label: `"${query}" ✕`, clear: () => setQuery("") });
  families.forEach((family) => {
    const opt = FAMILY_OPTIONS.find((o) => o.id === family);
    activeChips.push({ key: `f-${family}`, label: opt ? opt.label : family, clear: () => toggleInList(families, setFamilies, family) });
  });
  levels.forEach((level) => {
    const opt = LEVEL_OPTIONS.find((o) => o.id === level);
    activeChips.push({ key: `l-${level}`, label: opt ? opt.label : level, clear: () => toggleInList(levels, setLevels, level) });
  });
  if (duration) {
    const band = DURATION_BANDS.find((item) => item.id === duration);
    if (band) activeChips.push({ key: `d-${duration}`, label: band.label, clear: () => setDuration(null) });
  }
  if (labIncluded) activeChips.push({ key: "lab", label: "Lab inclus", clear: () => setLabIncluded(false) });
  if (certificationPrep) activeChips.push({ key: "cert", label: "Prépa certification", clear: () => setCertificationPrep(false) });

  return (
    <main className="bg-white min-h-screen">
      <section className="relative overflow-hidden bg-navy">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-25"
          style={{ backgroundImage: "url(/courses/hero.svg)" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-navy/60 via-navy/85 to-navy" />
        <div className="relative mx-auto max-w-7xl px-6 py-16 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-200">{t("nav.catalogue")}</p>
          <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-white sm:text-5xl">{t("catalogue.title")}</h1>
          <p className="mt-4 max-w-2xl text-lg text-blue-100">{t("catalogue.subtitle")}</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[280px_1fr]">
          {/* Filters Sidebar */}
          <aside className="h-fit rounded-2xl border border-slate-200 bg-surface/50 p-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <h2 className="text-base font-bold text-navy flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4 text-primary" />
                <span>{t("catalogue.filters")}</span>
              </h2>
              <button
                type="button"
                onClick={resetFilters}
                className="text-xs font-bold text-primary hover:text-primary-dark"
              >
                {t("catalogue.reset")}
              </button>
            </div>

            <div className="mt-6 space-y-6">
              {/* Domaines SAP */}
              <div>
                <p className="text-xs font-semibold tracking-normal text-navy">Domaines SAP</p>
                <div className="mt-3 space-y-2">
                  {FAMILY_OPTIONS.map((option) => (
                    <label key={option.id} className="flex items-center gap-2.5 text-xs font-medium text-slate-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={families.includes(option.id)}
                        onChange={() => toggleInList(families, setFamilies, option.id)}
                        className="h-4 w-4 rounded accent-primary"
                      />
                      <span>{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Niveaux */}
              <div className="border-t border-slate-200 pt-5">
                <p className="text-xs font-semibold tracking-normal text-navy">Niveau d&apos;expertise</p>
                <div className="mt-3 space-y-2">
                  {LEVEL_OPTIONS.map((option) => (
                    <label key={option.id} className="flex items-center gap-2.5 text-xs font-medium text-slate-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={levels.includes(option.id)}
                        onChange={() => toggleInList(levels, setLevels, option.id)}
                        className="h-4 w-4 rounded accent-primary"
                      />
                      <span>{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Durées */}
              <div className="border-t border-slate-200 pt-5">
                <p className="text-xs font-semibold tracking-normal text-navy">Volume horaire</p>
                <div className="mt-3 space-y-2">
                  {DURATION_BANDS.map((band) => (
                    <label key={band.id} className="flex items-center gap-2.5 text-xs font-medium text-slate-700 cursor-pointer">
                      <input
                        type="radio"
                        name="duration"
                        checked={duration === band.id}
                        onChange={() => setDuration(band.id)}
                        className="h-4 w-4 accent-primary"
                      />
                      <span>{band.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Options complémentaires */}
              <div className="border-t border-slate-200 pt-5 space-y-2.5">
                <label className="flex items-center gap-2.5 text-xs font-medium text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={labIncluded}
                    onChange={() => setLabIncluded(!labIncluded)}
                    className="h-4 w-4 rounded accent-primary"
                  />
                  <span>Environnement Lab inclus</span>
                </label>
                <label className="flex items-center gap-2.5 text-xs font-medium text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={certificationPrep}
                    onChange={() => setCertificationPrep(!certificationPrep)}
                    className="h-4 w-4 rounded accent-primary"
                  />
                  <span>Préparation certification officielle</span>
                </label>
              </div>
            </div>
          </aside>

          {/* Courses Grid Area */}
          <div>
            {/* Search Bar & Sort */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Rechercher par mot-clé (FI, MM, ABAP, S/4HANA)..."
                  className="h-11 w-full rounded-xl border border-slate-300 pl-10 pr-4 text-sm text-navy outline-none placeholder:text-slate-400 focus:border-primary focus:ring-1 focus:ring-primary shadow-sm"
                />
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs font-semibold text-slate-500">Trier par :</span>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="h-11 rounded-xl border border-slate-300 bg-white px-3 text-xs font-semibold text-navy outline-none focus:border-primary shadow-sm"
                >
                  {SORT_OPTIONS.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Active filter chips */}
            {activeChips.length > 0 && (
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <span className="text-xs text-slate-400">Filtres actifs :</span>
                {activeChips.map((chip) => (
                  <button
                    key={chip.key}
                    type="button"
                    onClick={chip.clear}
                    className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary hover:bg-primary/20 transition-colors"
                  >
                    {chip.label}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={resetFilters}
                  className="text-xs font-semibold text-slate-500 underline ml-2 hover:text-navy"
                >
                  Tout effacer
                </button>
              </div>
            )}

            {/* Courses List */}
            {filteredCourses.length === 0 ? (
              <div className="mt-12 rounded-3xl border border-dashed border-slate-300 p-12 text-center">
                <p className="text-lg font-bold text-navy">Aucune formation ne correspond à vos critères</p>
                <p className="mt-2 text-xs text-slate-500">
                  Essayez d&apos;élargir vos filtres ou de modifier votre mot-clé de recherche.
                </p>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="mt-6 rounded-xl bg-primary px-6 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-primary-dark transition-colors"
                >
                  Réinitialiser tous les filtres
                </button>
              </div>
            ) : (
              <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredCourses.map((course) => (
                  <article
                    key={course.slug}
                    className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                  >
                    {/* Header Banner */}
                    <div className="h-28 bg-gradient-to-br from-navy to-navy-light flex items-center justify-between px-6 text-white">
                      <div>
                        <span className="text-xs font-semibold tracking-normal text-blue-200">
                          Module SAP
                        </span>
                        <p className="text-3xl font-black">{course.module}</p>
                      </div>
                      <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white backdrop-blur">
                        {course.durationHours} h
                      </span>
                    </div>

                    <div className="flex flex-1 flex-col p-6">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-surface px-2.5 py-0.5 text-[11px] font-bold text-navy capitalize">
                          {course.family}
                        </span>
                        <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-bold text-primary capitalize">
                          {course.level}
                        </span>
                      </div>

                      <h3 className="mt-3 text-base font-bold text-navy group-hover:text-primary transition-colors">
                        {course.title}
                      </h3>
                      <p className="mt-2 line-clamp-2 text-xs text-slate-500 leading-relaxed">
                        {course.summary}
                      </p>

                      <div className="mt-6 border-t border-slate-100 pt-4 flex items-center justify-between">
                          <div>
                            <p className="text-[10px] text-slate-400">Tarif</p>
                            <div className="flex items-baseline gap-1">
                              {course.price ? (
                                <span className="text-base font-extrabold text-primary">
                                  {course.price} €
                                </span>
                              ) : (
                                <span className="text-base font-extrabold text-emerald-600">Gratuit</span>
                              )}
                            </div>
                          </div>
                        <Link
                          href={`/formation/${course.slug}`}
                          className="inline-flex h-9 w-full items-center justify-center gap-1.5 rounded-xl bg-primary px-3 text-xs font-bold text-white shadow-sm hover:bg-primary-dark transition-colors"
                        >
                          <span>Découvrir</span>
                          <ArrowRight className="h-3 w-3" />
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

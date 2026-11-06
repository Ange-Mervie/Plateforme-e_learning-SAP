"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { COURSES } from "@/data/courses";
import { useLanguage } from "@/context/language-context";

const FAMILY_LABELS: Record<string, string> = {
  finance: "Finance",
  logistique: "Logistique",
  production: "Production",
  rh: "Ressources Humaines",
  technique: "Technique",
  donnees: "Data",
  plateforme: "Plateforme",
  cloud: "Cloud",
};

const LEVEL_LABELS: Record<string, string> = {
  decouverte: "Découverte",
  fondamentaux: "Fondamentaux",
  consultant: "Consultant",
  expert: "Expert",
};

const DURATION_BANDS = [
  { id: "short", label: "Moins de 2 mois" },
  { id: "medium", label: "2 à 4 mois" },
  { id: "long", label: "Plus de 4 mois" },
];

const SORT_LABELS: Record<string, string> = {
  relevance: "Par pertinence",
  priceAsc: "Prix croissant",
  priceDesc: "Prix décroissant",
  durationDesc: "Durée décroissante",
};

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

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = COURSES.filter((course) => {
      if (q && !`${course.title} ${course.summary}`.toLowerCase().includes(q)) return false;
      if (families.length > 0 && !families.includes(course.family)) return false;
      if (levels.length > 0 && !levels.includes(course.level)) return false;
      if (duration) {
        const band = DURATION_BANDS.find((b) => b.id === duration);
        const hours = course.durationHours;
        const ok = band?.id === "short" ? hours < 60 : band?.id === "medium" ? hours >= 60 && hours < 120 : hours >= 120;
        if (!ok) return false;
      }
      if (labIncluded && !course.labIncluded) return false;
      if (certificationPrep && !course.certificationPrep) return false;
      if (freeOnly && !course.free) return false;
      return true;
    });
    return list;
  }, [query, families, levels, duration, labIncluded, certificationPrep, freeOnly]);

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
  if (query) activeChips.push({ key: "q", label: t("catalogue.searchPlaceholder") + " ✕", clear: () => setQuery("") });
  families.forEach((family) => activeChips.push({ key: `f-${family}`, label: FAMILY_LABELS[family] || family, clear: () => setFamilies([]) }));
  levels.forEach((level) => activeChips.push({ key: `l-${level}`, label: LEVEL_LABELS[level] || level, clear: () => setLevels([]) }));
  if (duration) {
    const band = DURATION_BANDS.find((item) => item.id === duration);
    if (band) activeChips.push({ key: `d-${duration}`, label: band.label, clear: () => setDuration(null) });
  }
  if (labIncluded) activeChips.push({ key: "lab", label: t("catalogue.labIncluded"), clear: () => setLabIncluded(false) });
  if (certificationPrep) activeChips.push({ key: "cert", label: t("catalogue.certificationPrep"), clear: () => setCertificationPrep(false) });
  if (freeOnly) activeChips.push({ key: "free", label: t("catalogue.free"), clear: () => setFreeOnly(false) });

  const filteredCourses = filtered;

  return (
    <main className="bg-white">
      <section className="bg-navy">
        <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-100">{t("nav.catalogue")}</p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight text-white">{t("catalogue.title")}</h1>
          <p className="mt-4 max-w-2xl text-blue-50">{t("catalogue.subtitle")}</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[280px_1fr]">
          <aside className="rounded-2xl border border-slate-200 p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-navy">{t("catalogue.filters")}</h2>
              <button type="button" onClick={resetFilters} className="text-sm font-semibold text-primary hover:text-primary-dark">
                {t("catalogue.reset")}
              </button>
            </div>

            <div className="mt-6 space-y-6">
              <div>
                <p className="text-sm font-semibold text-navy">{t("catalogue.family")}</p>
                <div className="mt-3 space-y-2">
                  {Object.entries(FAMILY_LABELS).map(([value, label]) => (
                    <label key={value} className="flex items-center gap-2 text-sm text-slate-700">
                      <input type="checkbox" checked={families.includes(value)} onChange={() => toggleInList(families, setFamilies, value)} className="h-4 w-4 accent-[#0879d9]" />
                      {label}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold text-navy">{t("catalogue.level")}</p>
                <div className="mt-3 space-y-2">
                  {Object.entries(LEVEL_LABELS).map(([value, label]) => (
                    <label key={value} className="flex items-center gap-2 text-sm text-slate-700">
                      <input type="checkbox" checked={levels.includes(value)} onChange={() => toggleInList(levels, setLevels, value)} className="h-4 w-4 accent-[#0879d9]" />
                      {label}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold text-navy">{t("catalogue.duration")}</p>
                <div className="mt-3 space-y-2">
                  {DURATION_BANDS.map((band) => (
                    <label key={band.id} className="flex items-center gap-2 text-sm text-slate-700">
                      <input type="radio" name="duration" checked={duration === band.id} onChange={() => setDuration(band.id)} className="h-4 w-4 accent-[#0879d9]" />
                      {band.label}
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm text-slate-700">
                  <input type="checkbox" checked={labIncluded} onChange={() => setLabIncluded(!labIncluded)} className="h-4 w-4 accent-[#0879d9]" />
                  {t("catalogue.labIncluded")}
                </label>
                <label className="flex items-center gap-2 text-sm text-slate-700">
                  <input type="checkbox" checked={certificationPrep} onChange={() => setCertificationPrep(!certificationPrep)} className="h-4 w-4 accent-[#0879d9]" />
                  {t("catalogue.certificationPrep")}
                </label>
                <label className="flex items-center gap-2 text-sm text-slate-700">
                  <input type="checkbox" checked={freeOnly} onChange={() => setFreeOnly(!freeOnly)} className="h-4 w-4 accent-[#0879d9]" />
                  {t("catalogue.free")}
                </label>
              </div>
            </div>
          </aside>

          <div>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <p className="text-sm text-slate-600">{filteredCourses.length} {t("catalogue.results")}</p>
              <label className="text-sm font-medium text-navy">
                {t("catalogue.sort")} :{" "}
                <select value={sort} onChange={(e) => setSort(e.target.value)} className="ml-2 rounded-lg border border-slate-200 px-3 py-2 text-sm">
                  {Object.entries(SORT_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="mt-6 flex items-center gap-3 rounded-xl border border-slate-200 bg-surface p-3">
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t("catalogue.searchPlaceholder")}
                className="h-11 w-full rounded-lg bg-white px-4 text-sm text-navy outline-none placeholder:text-slate-400"
              />
            </div>

            {filteredCourses.length === 0 ? (
              <div className="mt-16 rounded-2xl border border-dashed border-slate-300 p-12 text-center">
                <p className="text-lg font-semibold text-navy">{t("catalogue.emptyTitle")}</p>
                <p className="mt-2 text-sm text-slate-600">{t("catalogue.emptyText")}</p>
                <button type="button" onClick={resetFilters} className="mt-6 rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-white">
                  {t("catalogue.resetFilters")}
                </button>
              </div>
            ) : (
              <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredCourses.map((course) => (
                  <article key={course.slug} className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-lg">
                    <div className="flex h-36 items-center justify-center bg-navy">
                      <span className="text-4xl font-bold text-white">{course.module}</span>
                    </div>
                    <div className="flex flex-1 flex-col p-6">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-surface px-3 py-1 text-xs font-semibold text-navy">{FAMILY_LABELS[course.family] || course.family}</span>
                        {course.labIncluded ? <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">Lab inclus</span> : null}
                      </div>
                      <h2 className="mt-3 text-lg font-semibold text-navy">{course.title}</h2>
                      <p className="mt-2 line-clamp-2 text-sm text-slate-600">{course.summary}</p>
                      <p className="mt-4 text-xs text-slate-600">
                        {LEVEL_LABELS[course.level] || course.level} · {course.durationHours} h · {course.languages.join("/")}
                      </p>
                      <div className="mt-6 flex items-center justify-between border-t border-slate-200 pt-4">
                        <span className="text-sm font-bold text-navy">{course.price ? `${course.price} €` : "Sur devis"}</span>
                        <Link href={`/formation/${course.slug}`} className="text-sm font-semibold text-primary hover:text-primary-dark">
                          Voir la formation →
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}

            {activeChips.length > 0 ? (
              <div className="mt-8 flex flex-wrap gap-2">
                {activeChips.map((chip) => (
                  <button key={chip.key} type="button" onClick={chip.clear} className="rounded-full bg-surface px-3 py-1 text-xs font-semibold text-navy">
                    {chip.label} ✕
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </section>
    </main>
  );
}

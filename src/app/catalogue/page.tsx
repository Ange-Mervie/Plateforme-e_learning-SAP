"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { COURSES } from "@/data/courses";
import { useLanguage } from "@/context/language-context";
import { Search, SlidersHorizontal, ArrowRight } from "lucide-react";

const FAMILY_OPTIONS = [
  { id: "finance", labelFr: "Finance (FI / CO)", labelEn: "Finance (FI / CO)", track: "sap" },
  { id: "logistique", labelFr: "Logistique & Supply (MM / SD)", labelEn: "Logistics & Supply (MM / SD)", track: "sap" },
  { id: "technique", labelFr: "Technique & Dev (ABAP)", labelEn: "Technical & Dev (ABAP)", track: "sap" },
  { id: "odoo-fonctionnel", labelFr: "Odoo Fonctionnel", labelEn: "Odoo Functional", track: "odoo" },
  { id: "odoo-technique", labelFr: "Odoo Technique", labelEn: "Odoo Technical", track: "odoo" },
];

const LEVEL_OPTIONS = [
  { id: "decouverte", labelFr: "Découverte", labelEn: "Beginner" },
  { id: "fondamentaux", labelFr: "Fondamentaux", labelEn: "Fundamentals" },
  { id: "consultant", labelFr: "Consultant", labelEn: "Consultant" },
  { id: "expert", labelFr: "Expert", labelEn: "Expert" },
];

const DURATION_BANDS = [
  { id: "short", labelFr: "Moins de 6 heures", labelEn: "Under 6 hours", min: 0, max: 6 },
  { id: "medium", labelFr: "6 à 8 heures", labelEn: "6 to 8 hours", min: 6, max: 8 },
  { id: "long", labelFr: "Plus de 8 heures", labelEn: "Over 8 hours", min: 8, max: 999 },
];

export default function Catalogue() {
  const { t, lang } = useLanguage();
  const searchParams = useSearchParams();
  const track = (searchParams.get("track") === "odoo" ? "odoo" : "sap") as "sap" | "odoo";
  const isFr = lang === "fr";
  const [query, setQuery] = useState("");
  const [families, setFamilies] = useState<string[]>([]);
  const [levels, setLevels] = useState<string[]>([]);
  const [duration, setDuration] = useState<string | null>(null);
  const [labIncluded, setLabIncluded] = useState(false);
  const [sort, setSort] = useState<string>("relevance");

  const familyOptions = FAMILY_OPTIONS.filter((f) => f.track === track);

  const filteredCourses = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = COURSES.filter((course) => {
      if (course.track !== track) return false;
      if (q && !`${course.title} ${course.titleEn} ${course.summary} ${course.summaryEn} ${course.module}`.toLowerCase().includes(q)) return false;
      if (families.length > 0 && !families.includes(course.family)) return false;
      if (levels.length > 0 && !levels.includes(course.level)) return false;
      if (duration) {
        const band = DURATION_BANDS.find((b) => b.id === duration);
        if (band && (course.durationHours < band.min || course.durationHours > band.max)) return false;
      }
      if (labIncluded && !course.labIncluded) return false;
      return true;
    });
    if (sort === "durationDesc") list.sort((a, b) => b.durationHours - a.durationHours);
    return list;
  }, [query, families, levels, duration, labIncluded, sort, track]);

  const toggleInList = (list: string[], setList: (value: string[]) => void, value: string) => {
    setList(list.includes(value) ? list.filter((item) => item !== value) : [...list, value]);
  };
  const resetFilters = () => { setQuery(""); setFamilies([]); setLevels([]); setDuration(null); setLabIncluded(false); setSort("relevance"); };

  return (
    <main className="min-h-screen bg-white">
      <section className="relative overflow-hidden bg-navy">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url(/images/hero-catalogue.jpg)" }} />
        <div className="absolute inset-0 bg-gradient-to-b from-navy/70 via-navy/80 to-navy/90" />
        <div className="relative mx-auto max-w-7xl px-6 py-16 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-200">{track === "sap" ? "SAP Training" : "Odoo Training"}</p>
          <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-white sm:text-5xl">{t("catalogue.title")}</h1>
          <p className="mt-4 max-w-2xl text-lg text-blue-100">{t("catalogue.subtitle")}</p>
          <div className="mt-6 flex gap-3">
            <Link href="/catalogue?track=sap" className={`rounded-lg px-4 py-2 text-sm font-bold ${track==="sap"?"bg-white text-navy":"border border-white/30 text-white hover:bg-white/10"}`}>SAP Training</Link>
            <Link href="/catalogue?track=odoo" className={`rounded-lg px-4 py-2 text-sm font-bold ${track==="odoo"?"bg-white text-navy":"border border-white/30 text-white hover:bg-white/10"}`}>Odoo Training</Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[280px_1fr]">
          <aside className="h-fit rounded-2xl border border-slate-200 bg-surface/50 p-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <h2 className="flex items-center gap-2 text-base font-bold text-navy"><SlidersHorizontal className="h-4 w-4 text-primary" /><span>{t("catalogue.filters")}</span></h2>
              <button type="button" onClick={resetFilters} className="text-xs font-bold text-primary hover:text-primary-dark">{t("catalogue.reset")}</button>
            </div>
            <div className="mt-6 space-y-6">
              <div>
                <p className="text-xs font-semibold tracking-normal text-navy">{isFr ? "Domaines" : "Domains"}</p>
                <div className="mt-3 space-y-2">{familyOptions.map((option) => (<label key={option.id} className="flex cursor-pointer items-center gap-2.5 text-xs font-medium text-slate-700"><input type="checkbox" checked={families.includes(option.id)} onChange={() => toggleInList(families, setFamilies, option.id)} className="h-4 w-4 rounded accent-primary" /><span>{isFr ? option.labelFr : option.labelEn}</span></label>))}</div>
              </div>
              <div className="border-t border-slate-200 pt-5">
                <p className="text-xs font-semibold tracking-normal text-navy">{isFr ? "Niveau" : "Level"}</p>
                <div className="mt-3 space-y-2">{LEVEL_OPTIONS.map((option) => (<label key={option.id} className="flex cursor-pointer items-center gap-2.5 text-xs font-medium text-slate-700"><input type="checkbox" checked={levels.includes(option.id)} onChange={() => toggleInList(levels, setLevels, option.id)} className="h-4 w-4 rounded accent-primary" /><span>{isFr ? option.labelFr : option.labelEn}</span></label>))}</div>
              </div>
              <div className="border-t border-slate-200 pt-5">
                <p className="text-xs font-semibold tracking-normal text-navy">{isFr ? "Volume horaire" : "Duration"}</p>
                <div className="mt-3 space-y-2">{DURATION_BANDS.map((band) => (<label key={band.id} className="flex cursor-pointer items-center gap-2.5 text-xs font-medium text-slate-700"><input type="radio" name="duration" checked={duration === band.id} onChange={() => setDuration(band.id)} className="h-4 w-4 accent-primary" /><span>{isFr ? band.labelFr : band.labelEn}</span></label>))}</div>
              </div>
              <div className="space-y-2.5 border-t border-slate-200 pt-5">
                <label className="flex cursor-pointer items-center gap-2.5 text-xs font-medium text-slate-700"><input type="checkbox" checked={labIncluded} onChange={() => setLabIncluded(!labIncluded)} className="h-4 w-4 rounded accent-primary" /><span>{isFr ? "Environnement Lab inclus" : "Lab environment included"}</span></label>
              </div>
            </div>
          </aside>

          <div>
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div className="relative flex-1"><Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" /><input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder={isFr ? "Rechercher une formation..." : "Search a course..."} className="h-11 w-full rounded-xl border border-slate-300 pl-10 pr-4 text-sm text-navy shadow-sm outline-none placeholder:text-slate-400 focus:border-primary focus:ring-1 focus:ring-primary" /></div>
              <div className="flex shrink-0 items-center gap-2"><span className="text-xs font-semibold text-slate-500">{isFr ? "Trier :" : "Sort:"}</span><select value={sort} onChange={(e) => setSort(e.target.value)} className="h-11 rounded-xl border border-slate-300 bg-white px-3 text-xs font-semibold text-navy shadow-sm outline-none focus:border-primary"><option value="relevance">{isFr ? "Pertinence" : "Relevance"}</option><option value="durationDesc">{isFr ? "Durée décroissante" : "Duration desc."}</option></select></div>
            </div>

            {filteredCourses.length === 0 ? (
              <div className="mt-12 rounded-3xl border border-dashed border-slate-300 p-12 text-center"><p className="text-lg font-bold text-navy">{isFr ? "Aucune formation trouvée" : "No courses found"}</p><button type="button" onClick={resetFilters} className="mt-6 rounded-xl bg-primary px-6 py-2.5 text-xs font-bold text-white shadow-sm transition-colors hover:bg-primary-dark">{t("catalogue.reset")}</button></div>
            ) : (
              <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredCourses.map((course) => (
                  <article key={course.slug} className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                    <div className="relative h-36 overflow-hidden bg-slate-100">
                      <img src={course.image} alt={course.title} className={`${course.track === "odoo" ? "object-contain p-6" : "object-cover"} h-full w-full`} />
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy/80 to-transparent p-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <img src={course.track === "odoo" ? "/images/odoo-logo.svg" : "/images/sap-logo.svg"} alt={course.track === "odoo" ? "Odoo" : "SAP"} className={`h-5 w-auto ${course.track === "odoo" ? "rounded bg-white/90 px-1" : ""}`} />
                          <span className="text-sm font-bold text-white">{course.module}</span>
                        </div>
                        <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-medium text-white backdrop-blur">{course.durationHours} h</span>
                      </div>
                    </div>
                    <div className="flex flex-1 flex-col p-6">
                      <div className="flex flex-wrap items-center gap-2"><span className="rounded-full bg-surface px-2.5 py-0.5 text-[11px] font-bold capitalize text-navy">{course.family}</span><span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-bold capitalize text-primary">{course.level}</span></div>
                      <h3 className="mt-3 text-base font-bold text-navy transition-colors group-hover:text-primary">{isFr ? course.title : course.titleEn}</h3>
                      <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-slate-500">{isFr ? course.summary : course.summaryEn}</p>
                      <div className="mt-6 border-t border-slate-100 pt-4">
                        <Link href={`/formation/${course.slug}`} className="inline-flex h-9 w-full items-center justify-center gap-1.5 rounded-xl bg-primary px-3 text-xs font-bold text-white shadow-sm transition-colors hover:bg-primary-dark"><span>{t("catalogue.discover")}</span><ArrowRight className="h-3 w-3" /></Link>
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

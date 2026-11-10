"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { COURSES } from "@/data/courses";
import { useProgress } from "@/context/progress-context";

export default function MyCourses() {
  const { progress } = useProgress();

  const courses = progress
    .map((entry) => ({ entry, course: COURSES.find((c) => c.slug === entry.courseSlug) }))
    .flatMap((item) => (item.course ? [{ entry: item.entry, course: item.course }] : []))
    .sort((a, b) => b.entry.percent - a.entry.percent);

  return (
    <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-navy">Mes formations inscrites</h2>
          <p className="mt-1 text-xs text-slate-500">Formations actives dans votre cursus</p>
        </div>
        <Link
          href="/apprenant/mes-formations"
          className="text-xs font-bold text-primary hover:text-primary-dark"
        >
          Voir tout →
        </Link>
      </div>

      <div className="mt-6 space-y-3">
        {courses.length === 0 ? (
          <p className="text-sm text-slate-500">Vous ne suivez aucune formation pour le moment.</p>
        ) : (
          courses.map(({ entry, course }) => (
            <Link
              key={course.slug}
              href={`/cours/${course.slug}`}
              className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4 transition-all hover:border-primary hover:bg-surface md:flex-row md:items-center"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-navy text-xs font-bold text-white shadow-sm">
                {course.module}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="text-sm font-bold text-navy hover:text-primary transition-colors">
                    {course.title}
                  </h3>
                  <span className="rounded-full bg-surface px-2.5 py-0.5 text-[11px] font-semibold text-slate-700">
                    {entry.percent >= 100 ? "Terminée" : "En cours"}
                  </span>
                </div>
                <div className="mt-2.5 h-2 w-full overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${entry.percent}%` }} />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-extrabold text-navy">{entry.percent} %</span>
                <ChevronRight className="h-4 w-4 text-slate-400" />
              </div>
            </Link>
          ))
        )}
      </div>
    </section>
  );
}

"use client";

import Link from "next/link";
import { Play } from "lucide-react";
import { COURSES } from "@/data/courses";
import { useProgress } from "@/context/progress-context";

export default function ContinueLearning() {
  const { progress } = useProgress();

  const continueCourses = progress
    .map((entry) => ({ entry, course: COURSES.find((course) => course.slug === entry.courseSlug) }))
    .flatMap((item) => (item.course && item.entry.percent > 0 ? [{ entry: item.entry, course: item.course }] : []))
    .sort((a, b) => b.entry.percent - a.entry.percent)
    .slice(0, 2);

  return (
    <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-navy">Continuer mon apprentissage</h2>
          <p className="mt-1 text-xs text-slate-500">Reprenez là où vous vous êtes arrêté :</p>
        </div>
        <Link href="/catalogue" className="text-xs font-bold text-primary hover:text-primary-dark">
          Explorer le catalogue →
        </Link>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        {continueCourses.length === 0 ? (
          <p className="text-sm text-slate-500 md:col-span-2">
            Vous n&apos;avez pas encore de module en cours. Explorez le catalogue pour commencer une formation.
          </p>
        ) : (
          continueCourses.map(({ entry, course }) => (
            <Link
              key={course.slug}
              href={`/cours/${course.slug}`}
              className="group block rounded-xl border border-slate-200 bg-surface/50 p-5 transition-all hover:border-primary hover:bg-white hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-navy text-xs font-bold text-white">
                  {course.module}
                </span>
                <span className="text-xs font-bold text-primary">{entry.percent} %</span>
              </div>
              <h3 className="mt-3 text-base font-bold text-navy group-hover:text-primary transition-colors">
                {course.title}
              </h3>
              <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-slate-200">
                <div className="h-full rounded-full bg-primary transition-all duration-500" style={{ width: `${entry.percent}%` }} />
              </div>
              <div className="mt-4 flex items-center gap-1 text-xs font-bold text-primary">
                <Play className="h-3.5 w-3.5 fill-current" />
                <span>Reprendre la leçon</span>
              </div>
            </Link>
          ))
        )}
      </div>
    </section>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { COURSES } from "@/data/courses";
import { useLanguage } from "@/context/language-context";
import { useProgress } from "@/context/progress-context";
import ApprenantSidebar from "@/components/apprenant/sidebar";
import UserBadge from "@/components/apprenant/user-badge";
import { BookOpen, Clock, Play, Award, CheckCircle2, Search } from "lucide-react";

export default function MesFormations() {
  const { t } = useLanguage();
  const { getProgress } = useProgress();
  const [filter, setFilter] = useState<"all" | "in_progress" | "completed">("all");
  const [search, setSearch] = useState("");

  const filteredCourses = COURSES.filter((c) => {
    const matchesSearch = c.title.toLowerCase().includes(search.toLowerCase()) || c.module.toLowerCase().includes(search.toLowerCase());
    if (!matchesSearch) return false;
    const progress = getProgress(c.slug)?.percent || (c.module === "FI" ? 80 : c.module === "MM" ? 45 : 0);
    if (filter === "completed") return progress >= 100;
    if (filter === "in_progress") return progress > 0 && progress < 100;
    return true;
  });

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-navy">
      <ApprenantSidebar />

      <main className="min-h-screen flex-1 flex flex-col bg-slate-50">
        {/* Top Navbar */}
        <div className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-8">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            <h1 className="text-base font-bold text-navy">Mes Formations SAP</h1>
          </div>
          <UserBadge />
        </div>

        {/* Content Area */}
        <div className="mx-auto max-w-7xl px-8 py-8 w-full space-y-6">
          {/* Header & Filters */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-2xl font-extrabold text-navy">Vos parcours et modules actifs</h2>
              <p className="mt-1 text-xs text-slate-500">
                Suivez votre avancement pédagogique et accédez directement aux leçons interactives.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex rounded-xl bg-surface p-1 border border-slate-200 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setFilter("all")}
                  className={`rounded-lg px-3 py-1.5 transition-colors ${
                    filter === "all" ? "bg-white text-navy shadow-sm" : "text-slate-600 hover:text-navy"
                  }`}
                >
                  Toutes ({COURSES.length})
                </button>
                <button
                  type="button"
                  onClick={() => setFilter("in_progress")}
                  className={`rounded-lg px-3 py-1.5 transition-colors ${
                    filter === "in_progress" ? "bg-white text-navy shadow-sm" : "text-slate-600 hover:text-navy"
                  }`}
                >
                  En cours
                </button>
                <button
                  type="button"
                  onClick={() => setFilter("completed")}
                  className={`rounded-lg px-3 py-1.5 transition-colors ${
                    filter === "completed" ? "bg-white text-navy shadow-sm" : "text-slate-600 hover:text-navy"
                  }`}
                >
                  Terminées
                </button>
              </div>
            </div>
          </div>

          {/* Grid of Courses */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredCourses.map((course) => {
              const progObj = getProgress(course.slug);
              const percent = progObj?.percent ?? (course.module === "FI" ? 80 : course.module === "MM" ? 45 : 10);
              const totalLessons = course.sections.reduce((acc, s) => acc + s.lessons.length, 0);

              return (
                <article
                  key={course.slug}
                  className="flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="rounded-lg bg-navy px-3 py-1 text-xs font-bold text-white shadow-sm">
                        SAP {course.module}
                      </span>
                      <span className="text-xs font-semibold text-slate-500 capitalize">
                        {course.level}
                      </span>
                    </div>

                    <h3 className="mt-4 text-lg font-bold text-navy hover:text-primary transition-colors">
                      {course.title}
                    </h3>
                    <p className="mt-2 text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {course.summary}
                    </p>

                    <div className="mt-5 space-y-2">
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span className="text-slate-500">Progression</span>
                        <span className="text-primary">{percent} %</span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                        <div
                          className="h-full rounded-full bg-primary transition-all duration-500"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 border-t border-slate-100 pt-4 flex items-center justify-between">
                    <span className="flex items-center gap-1 text-xs text-slate-400">
                      <Clock className="h-3.5 w-3.5" />
                      {course.durationHours} h · {totalLessons} leçons
                    </span>

                    <Link
                      href={`/cours/${course.slug}`}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-primary-dark transition-colors"
                    >
                      <Play className="h-3.5 w-3.5 fill-current" />
                      <span>{percent > 0 ? "Continuer" : "Démarrer"}</span>
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}

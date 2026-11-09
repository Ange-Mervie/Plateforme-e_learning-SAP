import Link from "next/link";
import { ArrowRight, Play } from "lucide-react";

const COURSES = [
  {
    code: "FI",
    slug: "fi-comptabilite-generale",
    title: "SAP FI – Comptabilité générale",
    progress: 80,
    lesson: "Leçon 4/5 — Clôture mensuelle & bilan",
  },
  {
    code: "MM",
    slug: "mm-achats-stocks",
    title: "SAP MM – Achats et stocks",
    progress: 45,
    lesson: "Leçon 2/5 — Réception de marchandises (MIGO)",
  },
];

export default function ContinueLearning() {
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
        {COURSES.map((course) => (
          <Link
            key={course.code}
            href={`/cours/${course.slug}`}
            className="group block rounded-xl border border-slate-200 bg-surface/50 p-5 transition-all hover:border-primary hover:bg-white hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-navy text-xs font-bold text-white">
                {course.code}
              </span>
              <span className="text-xs font-bold text-primary">{course.progress} %</span>
            </div>
            <h3 className="mt-3 text-base font-bold text-navy group-hover:text-primary transition-colors">
              {course.title}
            </h3>
            <p className="mt-1 text-xs text-slate-500">{course.lesson}</p>

            <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-slate-200">
              <div
                className="h-full rounded-full bg-primary transition-all duration-500"
                style={{ width: `${course.progress}%` }}
              />
            </div>

            <div className="mt-4 flex items-center gap-1 text-xs font-bold text-primary">
              <Play className="h-3.5 w-3.5 fill-current" />
              <span>Reprendre la leçon</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

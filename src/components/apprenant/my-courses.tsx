import Link from "next/link";
import { ArrowRight, ChevronRight } from "lucide-react";

const COURSES = [
  {
    code: "FI",
    slug: "fi-comptabilite-generale",
    title: "SAP FI – Comptabilité générale",
    progress: 80,
    status: "En cours",
  },
  {
    code: "MM",
    slug: "mm-achats-stocks",
    title: "SAP MM – Achats et stocks",
    progress: 45,
    status: "En cours",
  },
  {
    code: "SD",
    slug: "sd-ventes-distribution",
    title: "SAP SD – Ventes et distribution",
    progress: 12,
    status: "Commencé",
  },
];

export default function MyCourses() {
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
        {COURSES.map((course) => (
          <Link
            key={course.code}
            href={`/cours/${course.slug}`}
            className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4 transition-all hover:border-primary hover:bg-surface md:flex-row md:items-center"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-navy text-xs font-bold text-white shadow-sm">
              {course.code}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-3">
                <h3 className="text-sm font-bold text-navy hover:text-primary transition-colors">
                  {course.title}
                </h3>
                <span className="rounded-full bg-surface px-2.5 py-0.5 text-[11px] font-semibold text-slate-700">
                  {course.status}
                </span>
              </div>
              <div className="mt-2.5 h-2 w-full overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{ width: `${course.progress}%` }}
                />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-extrabold text-navy">{course.progress} %</span>
              <ChevronRight className="h-4 w-4 text-slate-400" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

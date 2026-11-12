import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

const COURSES = [
  {
    code: "ABAP",
    slug: "abap-fondamentaux",
    title: "SAP ABAP : fondamentaux",
    level: "Débutant",
    duration: "8 h",
  },
];

export default function Recommended() {
  return (
    <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold tracking-tight text-navy flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          Recommandé pour vous
        </h2>
        <Link href="/catalogue" className="text-xs font-bold text-primary hover:text-primary-dark">
          Catalogue →
        </Link>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {COURSES.map((course) => (
          <div
            key={course.code}
            className="flex flex-col justify-between rounded-xl border border-slate-200 bg-surface/50 p-5 hover:border-primary transition-all"
          >
            <div>
              <span className="text-xs font-bold text-primary">SAP {course.code}</span>
              <h3 className="mt-1 text-sm font-bold text-navy">{course.title}</h3>
              <p className="mt-1 text-xs text-slate-500">
                {course.level} · {course.duration}
              </p>
            </div>
            <Link
              href={`/formation/${course.slug}`}
              className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-primary hover:text-primary-dark"
            >
              <span>Découvrir la formation</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}

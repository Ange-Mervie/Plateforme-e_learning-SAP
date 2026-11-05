import Link from "next/link";

const COURSES = [
  {
    code: "FI",
    title: "SAP FI – Comptabilité générale",
    progress: 80,
    lesson: "Leçon 12/15 — Clôture annuelle",
  },
  {
    code: "MM",
    title: "SAP MM – Achats et stocks",
    progress: 45,
    lesson: "Leçon 5/11 — Réception des marchandises",
  },
];

export default function ContinueLearning() {
  return (
    <section className="bg-white">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight text-navy">Continuer mon apprentissage</h2>
        <Link href="/catalogue" className="text-sm font-semibold text-primary hover:text-primary-dark">
          Explorer le catalogue →
        </Link>
      </div>
      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {COURSES.map((course) => (
          <div key={course.code} className="rounded-2xl border border-slate-200 bg-white p-6">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-primary">{course.code}</span>
              <span className="text-sm font-semibold text-navy">{course.progress} %</span>
            </div>
            <h3 className="mt-3 text-lg font-semibold text-navy">{course.title}</h3>
            <p className="mt-2 text-sm text-slate-600">{course.lesson}</p>
            <div className="mt-5 h-2 w-full overflow-hidden rounded-full bg-surface">
              <div className="h-full rounded-full bg-primary" style={{ width: `${course.progress}%` }} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

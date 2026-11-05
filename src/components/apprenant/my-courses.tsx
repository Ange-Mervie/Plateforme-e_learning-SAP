const COURSES = [
  { code: "FI", title: "SAP FI – Comptabilité générale", progress: 80, status: "En cours" },
  { code: "MM", title: "SAP MM – Achats et stocks", progress: 45, status: "En cours" },
  { code: "SD", title: "SAP SD – Ventes et distribution", progress: 12, status: "Commencé" },
];

export default function MyCourses() {
  return (
    <section className="bg-white">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight text-navy">Mes formations</h2>
        <a href="#" className="text-sm font-semibold text-primary hover:text-primary-dark">Voir tout →</a>
      </div>
      <div className="mt-8 space-y-4">
        {COURSES.map((course) => (
          <div key={course.code} className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 md:flex-row md:items-center">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-navy text-sm font-bold text-white">{course.code}</span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-3">
                <h3 className="text-base font-semibold text-navy">{course.title}</h3>
                <span className="rounded-full bg-surface px-3 py-1 text-xs font-semibold text-navy">{course.status}</span>
              </div>
              <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-surface">
                <div className="h-full rounded-full bg-primary" style={{ width: `${course.progress}%` }} />
              </div>
            </div>
            <span className="text-sm font-semibold text-navy">{course.progress} %</span>
          </div>
        ))}
      </div>
    </section>
  );
}

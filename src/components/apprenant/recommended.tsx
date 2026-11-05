const COURSES = [
  { code: "CO", title: "SAP CO – Contrôle de gestion", level: "Intermédiaire", duration: "5 h" },
  { code: "BTP", title: "SAP BTP : fondamentaux", level: "Débutant", duration: "6 h" },
];

export default function Recommended() {
  return (
    <section className="bg-white">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight text-navy">Formations recommandées</h2>
        <a href="#" className="text-sm font-semibold text-primary hover:text-primary-dark">Voir plus →</a>
      </div>
      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        {COURSES.map((course) => (
          <div key={course.code} className="rounded-2xl border border-slate-200 bg-white p-6">
            <span className="text-sm font-bold text-primary">{course.code}</span>
            <h3 className="mt-2 text-lg font-semibold text-navy">{course.title}</h3>
            <p className="mt-2 text-sm text-slate-600">{course.level} · {course.duration}</p>
            <a href="#" className="mt-4 inline-block text-sm font-semibold text-navy hover:text-primary">Commencer →</a>
          </div>
        ))}
      </div>
    </section>
  );
}

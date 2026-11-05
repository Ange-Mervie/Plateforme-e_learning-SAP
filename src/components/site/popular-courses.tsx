import Link from "next/link";

const COURSES = [
  {
    code: "FI",
    title: "SAP FI – Comptabilité générale",
    description:
      "Plan comptable, écritures, clôture mensuelle et annuelle, reporting légal.",
    level: "Intermédiaire",
    duration: "6 h",
    rating: "4.8",
    students: "2,4k",
  },
  {
    code: "MM",
    title: "SAP MM – Achats et stocks",
    description:
      "Demandes d'achat, commandes, réception, factures fournisseurs, gestion des stocks.",
    level: "Intermédiaire",
    duration: "5 h",
    rating: "4.7",
    students: "1,9k",
  },
  {
    code: "SD",
    title: "SAP SD – Ventes et distribution",
    description:
      "Commandes clients, livraison, facturation, tarification et partenaires.",
    level: "Intermédiaire",
    duration: "5 h",
    rating: "4.8",
    students: "2,1k",
  },
  {
    code: "ABAP",
    title: "SAP ABAP : fondamentaux",
    description:
      "Syntaxe, dictionnaire de données, programmes, rapports, exercices de programmation.",
    level: "Débutant",
    duration: "8 h",
    rating: "4.9",
    students: "1,2k",
  },
];

export default function PopularCourses() {
  return (
    <section className="bg-surface">
      <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">
              Catalogue
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-navy">
              Formations populaires
            </h2>
          </div>
          <Link
            href="/catalogue"
            className="hidden text-sm font-semibold text-primary hover:text-primary-dark sm:block"
          >
            Voir le catalogue complet →
          </Link>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {COURSES.map((course) => (
            <div
              key={course.code}
              className="flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm transition-shadow hover:shadow-lg"
            >
              <div className="flex h-40 items-center justify-center bg-navy">
                <span className="text-4xl font-bold text-white">{course.code}</span>
              </div>
              <div className="flex flex-1 flex-col p-6">
                <h3 className="text-lg font-semibold text-navy">{course.title}</h3>
                <p className="mt-2 line-clamp-2 text-sm text-slate-600">
                  {course.description}
                </p>
                <div className="mt-4 flex items-center gap-3 text-xs text-slate-500">
                  <span>{course.level}</span>
                  <span>·</span>
                  <span>{course.duration}</span>
                  <span>·</span>
                  <span>{course.students} apprenants</span>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-sm font-semibold text-navy">
                    ★ {course.rating}
                  </span>
                  <Link
                    href={`/cours/${course.code}`}
                    className="text-sm font-semibold text-primary hover:text-primary-dark"
                  >
                    Voir le cours →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

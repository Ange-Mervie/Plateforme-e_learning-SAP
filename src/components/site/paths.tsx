import Link from "next/link";

const PATHS = [
  {
    title: "Consultant SAP Finance",
    content: "FI → CO → S/4HANA Finance → certification",
    audience: "Comptables, contrôleurs de gestion, consultants",
  },
  {
    title: "Consultant SAP Logistique",
    content: "MM → SD → WM/EWM → MRP → certification",
    audience: "Acheteurs, logisticiens, consultants",
  },
  {
    title: "Développeur ABAP et Fiori",
    content: "ABAP → ABAP moderne → CDS → RAP → Fiori",
    audience: "Développeurs, étudiants en informatique",
  },
  {
    title: "Architecte BTP",
    content: "BTP → développement → Integration Suite",
    audience: "Développeurs, architectes",
  },
];

export default function Paths() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">
              Offre commerciale
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-navy">
              Parcours phares
            </h2>
          </div>
          <Link
            href="/parcours"
            className="hidden text-sm font-semibold text-primary hover:text-primary-dark sm:block"
          >
            Tous les parcours →
          </Link>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {PATHS.map((path) => (
            <div
              key={path.title}
              className="rounded-2xl border border-slate-200 bg-white p-6"
            >
              <h3 className="text-lg font-semibold text-navy">{path.title}</h3>
              <p className="mt-3 text-sm font-medium text-primary">
                {path.content}
              </p>
              <p className="mt-2 text-sm text-slate-600">{path.audience}</p>
              <Link
                href={`/parcours/${path.title}`}
                className="mt-6 inline-block text-sm font-semibold text-navy hover:text-primary"
              >
                Découvrir le parcours →
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

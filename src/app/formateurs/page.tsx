import Link from "next/link";

const TRAINERS = [
  {
    slug: "consultant-financier",
    name: "Dr. Claire Moreau",
    title: "Consultante SAP FI/CO",
    specialties: ["FI", "CO", "S/4HANA Finance"],
    yearsExperience: 12,
    certifications: ["SAP Certified Application Associate"],
    coursesCount: 6,
  },
  {
    slug: "logisticien",
    name: "Karim Benali",
    title: "Consultant SAP MM/SD",
    specialties: ["MM", "SD", "WM/EWM"],
    yearsExperience: 9,
    certifications: ["SAP Certified Specialist"],
    coursesCount: 5,
  },
  {
    slug: "architecte-btp",
    name: "Sophie Laurent",
    title: "Architecte SAP BTP",
    specialties: ["BTP", "RAP", "Fiori"],
    yearsExperience: 8,
    certifications: ["SAP Certified Development Associate"],
    coursesCount: 4,
  },
];

export default function Formateurs() {
  return (
    <main className="bg-white">
      <section className="bg-navy">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-100">Nos experts</p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight text-white">Des experts qui pratiquent SAP chaque jour.</h1>
          <p className="mt-4 max-w-2xl text-blue-50">
            Nos formateurs sont des consultants et des enseignants expérimentés. Ils transmettent des cas réels issus de projets.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div className="grid gap-6 md:grid-cols-3">
          {TRAINERS.map((trainer) => (
            <article key={trainer.slug} className="rounded-2xl border border-slate-200 bg-white p-6">
              <div className="flex items-center gap-4">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-lg font-bold text-primary">
                  {trainer.name
                    .split(" ")
                    .map((part) => part[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()}
                </span>
                <div>
                  <h2 className="text-lg font-semibold text-navy">{trainer.name}</h2>
                  <p className="mt-1 text-sm text-slate-600">{trainer.title}</p>
                </div>
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                {trainer.specialties.map((s) => (
                  <span key={s} className="rounded-full bg-surface px-3 py-1 text-xs font-semibold text-navy">
                    {s}
                  </span>
                ))}
              </div>
              <dl className="mt-6 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <dt className="text-xs text-slate-600">Expérience</dt>
                  <dd className="font-semibold text-navy">{trainer.yearsExperience} ans</dd>
                </div>
                <div>
                  <dt className="text-xs text-slate-600">Cours animés</dt>
                  <dd className="font-semibold text-navy">{trainer.coursesCount}</dd>
                </div>
              </dl>
            </article>
          ))}
        </div>

        <div className="mt-16 rounded-3xl bg-navy p-10 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white">Vous êtes expert SAP ?</h2>
          <p className="mx-auto mt-4 max-w-2xl text-blue-50">
            Rejoignez notre équipe de formateurs. Proposez un cours, partagez un cas réel et formez la prochaine génération.
          </p>
          <Link
            href="/inscription"
            className="mt-8 inline-flex h-12 items-center justify-center rounded-lg bg-primary px-6 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
          >
            Proposer un cours
          </Link>
        </div>
      </section>
    </main>
  );
}

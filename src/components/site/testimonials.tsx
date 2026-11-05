const TESTIMONIALS = [
  {
    quote:
      "Les cas métier nous font progresser le bon rythme. On passe de la théorie à la pratique dès le premier module.",
    name: "Sophie Martin",
    role: "Consultante SAP FI/CO, IBN Group",
  },
  {
    quote:
      "La plateforme est d'une fluidité exceptionnelle. Les exercices guidés sur notre système de training ont transformé notre façon d'enseigner.",
    name: "Karim Benali",
    role: "Formateur SAP MM/SD, IBN Group",
  },
  {
    quote:
      "Enfin une offre bilingue FR/EN avec des examens blancs originaux. La certification nous a permis de sécuriser nos offres clients.",
    name: "Claire Dubois",
    role: "Architecte SAP Fiori & BTP, IBN Group",
  },
];

export default function Testimonials() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">
            Témoignages
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-navy">
            Ils ont transformé leur carrière SAP
          </h2>
        </div>
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <figure
              key={t.name}
              className="rounded-2xl border border-slate-200 bg-white p-8"
            >
              <blockquote className="text-lg font-medium leading-8 text-navy">
                « {t.quote} »
              </blockquote>
              <figcaption className="mt-6">
                <p className="font-semibold text-navy">{t.name}</p>
                <p className="mt-1 text-sm text-slate-600">{t.role}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-navy">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(8,121,217,0.35),rgba(16,43,78,0.9))]"></div>
      <div className="relative mx-auto max-w-7xl px-6 py-20 lg:py-28">
        <div className="grid items-center gap-14 lg:grid-cols-2">
          <div>
            <span className="inline-flex items-center rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold text-blue-100 ring-1 ring-white/20">
              SAP S/4HANA · SAP Fiori · SAP BTP
            </span>
            <h1 className="mt-6 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Développez vos compétences SAP. Transformez votre avenir
              professionnel.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-blue-50">
              Cours pratiques, cas métier et exercices guidés pour maîtriser les
              modules SAP S/4HANA, Fiori et BTP — du fonctionnel au consultant
              expert.
            </p>

            <form className="mt-8 flex max-w-xl items-center rounded-xl bg-white p-2 shadow-xl">
              <input
                type="text"
                placeholder="Rechercher une formation : FI, MM, SD, ABAP, BTP…"
                className="h-12 w-full bg-transparent px-4 text-sm text-navy outline-none placeholder:text-slate-400"
              />
              <button
                type="submit"
                className="h-12 rounded-lg bg-primary px-6 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
              >
                Rechercher
              </button>
            </form>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="/catalogue"
                className="inline-flex h-12 items-center justify-center rounded-lg bg-primary px-6 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
              >
                Explorer les formations
              </Link>
              <Link
                href="/parcours"
                className="inline-flex h-12 items-center justify-center rounded-lg border border-white/40 bg-white/5 px-6 text-sm font-semibold text-white backdrop-blur transition-colors hover:bg-white/15"
              >
                Découvrir notre académie
              </Link>
            </div>
          </div>

          <div className="relative hidden lg:block">
            <div className="rounded-2xl border border-white/15 bg-white/10 p-6 shadow-2xl backdrop-blur">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-blue-100">SAP Academy</p>
                  <p className="mt-1 text-xl font-semibold text-white">
                    Tableau de bord d&apos;apprentissage
                  </p>
                </div>
                <div className="h-10 w-10 rounded-lg bg-primary/30" />
              </div>
              <div className="mt-6 grid grid-cols-3 gap-4">
                {[
                  { label: "Formations suivies", value: "3" },
                  { label: "Heures", value: "18h" },
                  { label: "Certificats", value: "1" },
                ].map((stat) => (
                  <div key={stat.label} className="rounded-xl bg-white/10 p-4">
                    <p className="text-2xl font-bold text-white">{stat.value}</p>
                    <p className="mt-1 text-xs text-blue-100">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

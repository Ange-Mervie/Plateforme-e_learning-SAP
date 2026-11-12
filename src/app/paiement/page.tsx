export default function Paiement() {
  return (
    <main className="bg-slate-50 min-h-screen py-20 px-6 lg:px-8">
      <div className="mx-auto max-w-2xl">
        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-100 mx-auto mb-6">
            <span className="text-2xl">⚠️</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-navy mb-4">Paiement en ligne indisponible</h1>
          <p className="text-lg text-slate-600 leading-relaxed mb-8">
            Le paiement en ligne n’est pas encore activé pour le lancement au Cameroun.
            Aucun paiement ni abonnement ne peut être effectué sur ce site pour le moment.
          </p>
          <p className="text-base text-slate-500 mb-10">
            Pour vous inscrire à une formation, remplissez le formulaire « Contacter un formateur » depuis la fiche de la formation de votre choix. Notre équipe vous communiquera les tarifs et les modalités de règlement.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/catalogue"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-6 text-sm font-bold text-white shadow-sm hover:bg-primary-dark transition-colors"
            >
              <span>Retour au catalogue</span>
            </a>
            <a
              href="/ibn-group"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 px-6 text-sm font-semibold text-navy hover:bg-surface transition-colors"
            >
              <span>Contacter IBN Group</span>
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}

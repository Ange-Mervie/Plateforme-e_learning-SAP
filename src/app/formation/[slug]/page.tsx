import { Suspense } from "react";

function FormationFallback({ slug }: { slug: string }) {
  return (
    <main className="mx-auto max-w-7xl px-6 py-20">
      <p className="text-sm font-bold uppercase tracking-wide text-primary">Module SAP</p>
      <h1 className="mt-2 text-4xl font-bold tracking-tight text-navy">Formation {slug}</h1>
    </main>
  );
}

async function FormationContent({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const title = slug
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

  return (
    <main className="mx-auto max-w-7xl px-6 py-20">
      <p className="text-sm font-bold uppercase tracking-wide text-primary">Module SAP</p>
      <h1 className="mt-2 text-4xl font-bold tracking-tight text-navy">{title}</h1>
      <p className="mt-4 max-w-2xl text-slate-600">
        Fiche détaillée de la formation : objectifs, programme, prérequis, ressources et évaluation.
      </p>

      <div className="mt-10 grid gap-6 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 p-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">Objectifs</p>
          <p className="mt-2 text-sm text-slate-700">Maîtriser les fondamentaux et processus clés.</p>
        </div>
        <div className="rounded-2xl border border-slate-200 p-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">Programme</p>
          <p className="mt-2 text-sm text-slate-700">Leçons, exercices et quiz.</p>
        </div>
        <div className="rounded-2xl border border-slate-200 p-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">Certification</p>
          <p className="mt-2 text-sm text-slate-700">Examen final et attestation.</p>
        </div>
      </div>

      <div className="mt-12">
        <a
          href="/inscription"
          className="inline-flex h-12 items-center justify-center rounded-lg bg-primary px-6 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
        >
          S&apos;inscrire à la formation
        </a>
      </div>
    </main>
  );
}

export default function Formation({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <Suspense fallback={<FormationFallback slug="…" />}>
      <FormationContent params={params} />
    </Suspense>
  );
}

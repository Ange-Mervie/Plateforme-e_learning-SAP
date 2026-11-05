import Link from "next/link";

export default function Certifications() {
  return (
    <section className="bg-surface">
      <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-8 rounded-3xl bg-navy p-10 lg:flex-row lg:items-center">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-100">
              Certifications
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-white">
              Validez vos compétences SAP
            </h2>
            <p className="mt-4 text-blue-50">
              Examens blancs originaux rédigés par nos experts, plans de révision
              par théème, quiz chronométrés et attestations de réussite.
            </p>
          </div>
          <Link
            href="/certifications"
            className="inline-flex h-12 shrink-0 items-center justify-center rounded-lg bg-primary px-6 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
          >
            Découvrir les certifications →
          </Link>
        </div>
      </div>
    </section>
  );
}

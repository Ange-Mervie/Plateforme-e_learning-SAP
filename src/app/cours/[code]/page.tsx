import { Suspense } from "react";

function CoursFallback({ code }: { code: string }) {
  return (
    <main className="mx-auto max-w-7xl px-6 py-20">
      <p className="text-sm font-bold uppercase tracking-wide text-primary">Module SAP</p>
      <h1 className="mt-2 text-4xl font-bold tracking-tight text-navy">Cours {code}</h1>
    </main>
  );
}

async function CoursContent({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  return (
    <main className="mx-auto max-w-7xl px-6 py-20">
      <p className="text-sm font-bold uppercase tracking-wide text-primary">Module SAP</p>
      <h1 className="mt-2 text-4xl font-bold tracking-tight text-navy">Cours {code}</h1>
      <p className="mt-4 max-w-2xl text-slate-600">Lecteur vidéo, exercices, quiz et ressources du cours.</p>
    </main>
  );
}

export default function Cours({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  return (
    <Suspense fallback={<CoursFallback code="…" />}>
      <CoursContent params={params} />
    </Suspense>
  );
}

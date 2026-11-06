import { Suspense } from "react";
import CoursPlayer from "@/components/cours/cours-player";

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
  const title = code
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

  return (
    <main className="mx-auto max-w-7xl px-6 py-10 lg:py-16">
      <p className="text-sm font-bold uppercase tracking-wide text-primary">Module SAP</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-navy">Cours {title}</h1>
      <div className="mt-8">
        <CoursPlayer code={code} />
      </div>
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

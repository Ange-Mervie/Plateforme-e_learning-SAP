import { Suspense } from "react";
import CoursPlayer from "@/components/cours/cours-player";
import { COURSES } from "@/data/courses";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface Props {
  params: Promise<{ code: string }>;
}

function CoursFallback() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-20 text-center text-slate-500">
      Chargement du cours SAP...
    </div>
  );
}

async function CoursContent({ params }: Props) {
  const { code } = await params;

  // Resolve course by slug or by module uppercase (e.g. "FI")
  const course =
    COURSES.find((c) => c.slug.toLowerCase() === code.toLowerCase()) ||
    COURSES.find((c) => c.module.toLowerCase() === code.toLowerCase()) ||
    COURSES[0];

  return (
    <main className="bg-slate-50 min-h-screen">
      {/* Top Banner Navigation */}
      <div className="bg-navy text-white border-b border-slate-800">
        <div className="mx-auto max-w-7xl px-6 py-5 lg:px-8">
          <nav className="flex items-center gap-2 text-xs font-medium text-blue-200">
            <Link href="/" className="hover:text-white">Accueil</Link>
            <ChevronRight className="h-3 w-3" />
            <Link href="/apprenant" className="hover:text-white">Espace apprenant</Link>
            <ChevronRight className="h-3 w-3" />
            <Link href="/catalogue" className="hover:text-white">Cours</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-white font-semibold">SAP {course.module}</span>
          </nav>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="rounded bg-primary/20 px-2 py-0.5 text-xs font-bold text-blue-300">
                MODULE SAP {course.module}
              </span>
              <h1 className="mt-1 text-2xl font-bold tracking-tight text-white sm:text-3xl">
                {course.title}
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href={`/formation/${course.slug}`}
                className="text-xs font-semibold text-blue-200 hover:text-white underline underline-offset-4"
              >
                Fiche détaillée du cours
              </Link>
              <Link
                href="/evaluation"
                className="rounded-lg bg-primary px-4 py-2 text-xs font-bold text-white hover:bg-primary-dark transition-colors"
              >
                Passer l&apos;examen
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
        <CoursPlayer course={course} />
      </div>
    </main>
  );
}

export default function CoursPage({ params }: Props) {
  return (
    <Suspense fallback={<CoursFallback />}>
      <CoursContent params={params} />
    </Suspense>
  );
}

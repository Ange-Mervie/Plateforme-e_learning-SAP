import { Suspense } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { COURSES, getCourseBySlug } from "@/data/courses";
import { TRAINERS } from "@/data/trainers";
import { formatEur, formatXaf, eurToXaf } from "@/lib/currency";
import {
  BookOpen,
  Clock,
  CheckCircle2,
  Award,
  Layers,
  Globe,
  Terminal,
  User,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
}

async function FormationContent({ params }: Props) {
  const { slug } = await params;
  const course = getCourseBySlug(slug);

  if (!course) {
    // If not found by exact slug, try matching by module code uppercase
    const byModule = COURSES.find((c) => c.module.toLowerCase() === slug.toLowerCase());
    if (!byModule) {
      notFound();
    }
  }

  const currentCourse = course || COURSES.find((c) => c.module.toLowerCase() === slug.toLowerCase())!;
  const trainer = TRAINERS.find((t) => t.slug === currentCourse.trainerSlug) || TRAINERS[0];
  const relatedCourses = COURSES.filter((c) => c.slug !== currentCourse.slug).slice(0, 3);
  const totalLessons = currentCourse.sections.reduce((acc, s) => acc + s.lessons.length, 0);

  return (
    <main className="bg-white min-h-screen">
      {/* Header / Hero */}
      <section className="relative overflow-hidden bg-navy text-white">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-15"
          style={{ backgroundImage: "url(/courses/hero.svg)" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-navy/60 via-navy/90 to-navy" />

        <div className="relative mx-auto max-w-7xl px-6 py-14 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs font-medium text-blue-200">
            <Link href="/" className="hover:text-white">Accueil</Link>
            <ChevronRight className="h-3 w-3" />
            <Link href="/catalogue" className="hover:text-white">Catalogue</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-white">{currentCourse.module}</span>
          </nav>

          <div className="mt-6 grid gap-10 lg:grid-cols-3 lg:items-start">
            <div className="lg:col-span-2">
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-lg bg-primary px-3 py-1 text-xs font-semibold tracking-normal text-white">
                  SAP {currentCourse.module}
                </span>
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-blue-100">
                  Niveau : {currentCourse.level}
                </span>
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-blue-100 flex items-center gap-1">
                  <Globe className="h-3 w-3" />
                  {currentCourse.languages.join(" / ").toUpperCase()}
                </span>
              </div>

              <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl text-white">
                {currentCourse.title}
              </h1>

              <p className="mt-4 text-lg text-blue-100 leading-relaxed">
                {currentCourse.summary}
              </p>

              <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4 border-t border-white/10 pt-6">
                <div>
                  <p className="text-xs text-blue-300">Durée estimée</p>
                  <p className="mt-1 flex items-center gap-1 text-base font-bold text-white">
                    <Clock className="h-4 w-4 text-primary" />
                    {currentCourse.durationHours} heures
                  </p>
                </div>
                <div>
                  <p className="text-xs text-blue-300">Contenu du cours</p>
                  <p className="mt-1 flex items-center gap-1 text-base font-bold text-white">
                    <Layers className="h-4 w-4 text-primary" />
                    {totalLessons} leçons
                  </p>
                </div>
                <div>
                  <p className="text-xs text-blue-300">Environnement Lab</p>
                  <p className="mt-1 flex items-center gap-1 text-base font-bold text-white">
                    <Terminal className="h-4 w-4 text-emerald-400" />
                    {currentCourse.labIncluded ? "Inclus (SAP GUI)" : "Démonstrations"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-blue-300">Certification</p>
                  <p className="mt-1 flex items-center gap-1 text-base font-bold text-white">
                    <Award className="h-4 w-4 text-amber-400" />
                    Attestation incluse
                  </p>
                </div>
              </div>
            </div>

            {/* Sticky Card Action CTA */}
            <div className="rounded-2xl border border-slate-700 bg-white p-7 text-navy shadow-xl lg:sticky lg:top-24">
              <div className="flex items-baseline justify-between">
                <span className="text-sm font-semibold text-slate-500">Accès formation</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold text-navy">
                    {currentCourse.price ? formatEur(currentCourse.price) : "Gratuit"}
                  </span>
                  {currentCourse.price ? (
                    <span className="text-sm text-slate-500">
                      ({formatXaf(eurToXaf(currentCourse.price))})
                    </span>
                  ) : null}
                </div>
              </div>
              <p className="mt-2 text-xs text-slate-500">
                Accès illimité aux vidéos, cas pratiques SAP, labs et quiz d&apos;évaluation.
              </p>

              <div className="mt-6 flex flex-col gap-3">
                <Link
                  href={`/cours/${currentCourse.slug}`}
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary text-sm font-bold text-white shadow-sm transition-all hover:bg-primary-dark"
                >
                  <BookOpen className="h-4 w-4" />
                  <span>Commencer la formation</span>
                </Link>
                <Link
                  href="/paiement"
                  className="flex h-11 w-full items-center justify-center rounded-xl border border-slate-200 text-sm font-semibold text-navy transition-colors hover:bg-surface"
                >
                  Souscrire un abonnement complet
                </Link>
              </div>

              <div className="mt-6 space-y-2.5 border-t border-slate-100 pt-5 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Accès instantané 24/7 sur ordinateur et mobile</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Examen de validation et attestation officielle IBN</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Support et mentorat par nos consultants SAP</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Layout */}
      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-12">
            {/* Objectives */}
            <div className="rounded-2xl border border-slate-200 bg-white p-8">
              <h2 className="text-xl font-bold text-navy flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-primary" />
                Objectifs pédagogiques
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                À l&apos;issue de ce module SAP, vous serez capable de :
              </p>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {currentCourse.objectives.map((obj, i) => (
                  <div key={i} className="flex items-start gap-2.5 rounded-xl bg-surface p-4">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
                    <span className="text-sm font-medium text-navy">{obj}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Curriculum breakdown */}
            <div>
              <h2 className="text-2xl font-bold text-navy">Programme complet de la formation</h2>
              <p className="mt-2 text-sm text-slate-600">
                {currentCourse.sections.length} sections · {totalLessons} leçons guidées avec cas d&apos;entreprise réels.
              </p>

              <div className="mt-6 space-y-4">
                {currentCourse.sections.map((section, idx) => (
                  <div
                    key={idx}
                    className="overflow-hidden rounded-xl border border-slate-200 bg-white"
                  >
                    <div className="bg-surface px-6 py-4 flex items-center justify-between border-b border-slate-200">
                      <div className="flex items-center gap-3">
                        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-navy text-xs font-bold text-white">
                          {idx + 1}
                        </span>
                        <h3 className="text-base font-bold text-navy">{section.title}</h3>
                      </div>
                      <span className="text-xs font-medium text-slate-500">
                        {section.lessons.length} {section.lessons.length > 1 ? "leçons" : "leçon"}
                      </span>
                    </div>
                    <ul className="divide-y divide-slate-100">
                      {section.lessons.map((lesson, lIdx) => (
                        <li key={lIdx} className="flex items-center justify-between px-6 py-3.5 hover:bg-slate-50 transition-colors">
                          <div className="flex items-center gap-3">
                            <BookOpen className="h-4 w-4 text-primary" />
                            <span className="text-sm font-medium text-slate-800">{lesson.title}</span>
                          </div>
                          <span className="flex items-center gap-1 text-xs text-slate-500">
                            <Clock className="h-3 w-3" />
                            {lesson.minutes} min
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Prerequisites */}
            <div className="rounded-2xl border border-slate-200 bg-white p-8">
              <h2 className="text-xl font-bold text-navy">Prérequis recommandés</h2>
              <div className="mt-4">
                {currentCourse.prerequisites && currentCourse.prerequisites.length > 0 ? (
                  <ul className="space-y-2">
                    {currentCourse.prerequisites.map((p, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-slate-700">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                        <span>Connaissance préalable : <span className="font-semibold text-navy">{p}</span></span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-slate-600">
                    Aucun prérequis technique avancé exigé. Avoir des notions générales de gestion d&apos;entreprise ou d&apos;informatique est un plus.
                  </p>
                )}
              </div>
            </div>

            {/* Trainer Profile Card */}
            <div className="rounded-2xl border border-slate-200 bg-surface p-8">
              <h2 className="text-xs font-semibold tracking-normal text-primary">Votre formateur référent</h2>
              <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center gap-5">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-navy text-xl font-bold text-white shadow-md">
                  {trainer.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-navy">{trainer.name}</h3>
                  <p className="text-sm text-slate-600">{trainer.title} · {trainer.yearsExperience} ans d&apos;expérience</p>
                  <p className="mt-2 text-sm text-slate-700 leading-relaxed">{trainer.bio}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar / Related courses */}
          <div className="space-y-8">
            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <h3 className="text-lg font-bold text-navy">Formations complémentaires</h3>
              <p className="mt-1 text-xs text-slate-500">Pour enrichir votre profil SAP :</p>
              <div className="mt-5 space-y-4">
                {relatedCourses.map((rel) => (
                  <Link
                    key={rel.slug}
                    href={`/formation/${rel.slug}`}
                    className="block group rounded-xl border border-slate-100 p-4 transition-all hover:border-primary hover:bg-surface"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-primary">SAP {rel.module}</span>
                      <span className="text-xs text-slate-400">{rel.durationHours} h</span>
                    </div>
                    <p className="mt-1.5 text-sm font-semibold text-navy group-hover:text-primary transition-colors">
                      {rel.title}
                    </p>
                  </Link>
                ))}
              </div>
            </div>

            <div className="rounded-2xl bg-gradient-to-br from-navy to-navy-light p-6 text-white text-center">
              <Award className="h-10 w-10 text-amber-400 mx-auto" />
              <h3 className="mt-3 text-lg font-bold">Passez l&apos;examen blanc</h3>
              <p className="mt-2 text-xs text-blue-100 leading-relaxed">
                Testez vos connaissances en conditions réelles avec notre moteur de certification.
              </p>
              <Link
                href="/evaluation"
                className="mt-4 inline-flex h-10 w-full items-center justify-center rounded-xl bg-white text-xs font-bold text-navy hover:bg-blue-50 transition-colors"
              >
                Accéder aux évaluations
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default function FormationPage({ params }: Props) {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-7xl px-6 py-20 text-center text-slate-500">
          Chargement de la formation SAP...
        </div>
      }
    >
      <FormationContent params={params} />
    </Suspense>
  );
}

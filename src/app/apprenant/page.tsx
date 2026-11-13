import { Suspense } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import ApprenantSidebar from "@/components/apprenant/sidebar";
import StatsCards from "@/components/apprenant/stats-cards";
import ContinueLearning from "@/components/apprenant/continue-learning";
import MyCourses from "@/components/apprenant/my-courses";
import ProgressChart from "@/components/apprenant/progress-chart";
import Recommended from "@/components/apprenant/recommended";
import UserBadge from "@/components/apprenant/user-badge";
import SubscriptionStatus from "@/components/apprenant/subscription-status";
import MyAssessments from "@/components/apprenant/my-assessments";
import MyProjects from "@/components/apprenant/my-projects";
import MyCertificates from "@/components/apprenant/my-certificates";
import CourseDocumentDownload from "@/components/apprenant/course-document-download";
import { Play, Search, Sparkles, BookOpen } from "lucide-react";
import { requireUser } from "@/lib/auth/authorization";
import { AuthenticationError } from "@/lib/auth/types";


export default function ApprenantPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-500">Chargement de votre espace…</div>}>
      <ApprenantDashboard />
    </Suspense>
  );
}

async function ApprenantDashboard() {
  let user;
  try {
    user = await requireUser();
  } catch (error) {
    if (error instanceof AuthenticationError && error.status === 401) {
      redirect("/connexion");
    }
    throw error;
  }
  const userName = user.name.split(" ")[0];

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-navy">
      <ApprenantSidebar />

      <main className="min-h-screen flex-1 flex flex-col bg-slate-50">
        {/* Top Header */}
        <div className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-8">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Rechercher une transaction ou module SAP (FI, MM, ABAP)..."
              className="h-10 w-full rounded-xl bg-surface pl-9 pr-4 text-xs text-navy outline-none placeholder:text-slate-400 focus:bg-white focus:ring-1 focus:ring-primary"
            />
          </div>
          <UserBadge />

          {/* Avis email non vérifié */}
          {!user.emailVerified && (
            <div className="ml-4 flex items-center gap-2 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-700 border border-amber-200">
              <span>Email non vérifié</span>
            </div>
          )}
        </div>

        {/* Dashboard Content */}
        <div className="mx-auto max-w-7xl px-8 py-8 w-full space-y-8">
          {/* Welcome Banner Card */}
          <div className="relative overflow-hidden rounded-3xl bg-navy p-8 sm:p-10 text-white shadow-md">
            <div
              className="absolute inset-0 bg-cover bg-center opacity-15"
              style={{ backgroundImage: "url(/courses/hero.svg)" }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/95 to-primary/30" />

            <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div className="max-w-2xl">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/20 px-3 py-1 text-xs font-semibold tracking-normal text-blue-200 backdrop-blur">
                  <Sparkles className="h-3.5 w-3.5 text-primary" />
                  Espace Personnel Apprenant
                </span>
                <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl text-white">
                  Bonjour, {userName} 👋
                </h1>
                <p className="mt-2 text-sm sm:text-base text-blue-100 leading-relaxed">
                  Continuez votre montée en compétences SAP  vous êtes à <strong>80 %</strong> sur le module « <strong>SAP FI ,comptabilité générale</strong> ».
                </p>
              </div>

              <Link
                href="/cours/fi-comptabilite-generale"
                className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-primary px-6 text-sm font-bold text-white shadow-lg transition-all hover:bg-primary-dark hover:scale-105"
              >
                <Play className="h-4 w-4 fill-current" />
                <span>Reprendre la leçon</span>
              </Link>
            </div>
          </div>

          {/* Stats Cards */}
          <div>
            <StatsCards />
          </div>

          {/* Subscription Status Bar */}
          <div>
            <SubscriptionStatus />
          </div>

          {/* Continue Learning Course Cards */}
          <div>
            <ContinueLearning />
          </div>

  {/* My Courses List */}
  <div>
    <MyCourses />
  </div>

  {/* My Evaluations */}
  <div>
    <MyAssessments />
  </div>

  {/* My Projects */}
  <div>
    <MyProjects />
  </div>

  {/* My Certificates */}
  <div>
    <MyCertificates />
  </div>

  {/* Course Document Download */}
  <div>
    <CourseDocumentDownload courseSlug="fi-comptabilite-generale" />
  </div>

  {/* Bottom Grid: Progress & Recommendations */}
  <div className="grid gap-8 lg:grid-cols-3">
    <div className="lg:col-span-1">
      <ProgressChart />
    </div>
    <div className="lg:col-span-2">
      <Recommended />
    </div>
  </div>
</div>
      </main>
    </div>
  );
}

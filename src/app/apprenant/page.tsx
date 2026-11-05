import Link from "next/link";
import ApprenantSidebar from "@/components/apprenant/sidebar";
import StatsCards from "@/components/apprenant/stats-cards";
import ContinueLearning from "@/components/apprenant/continue-learning";
import MyCourses from "@/components/apprenant/my-courses";
import ProgressChart from "@/components/apprenant/progress-chart";
import Recommended from "@/components/apprenant/recommended";
import UserBadge from "@/components/apprenant/user-badge";

export default function ApprenantDashboard() {
  return (
    <div className="flex min-h-screen bg-white font-sans text-navy">
      <ApprenantSidebar />
      <main className="min-h-screen flex-1 bg-surface">
        <div className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-8">
          <input
            type="text"
            placeholder="Rechercher une formation…"
            className="h-10 w-full max-w-md rounded-lg bg-surface px-4 text-sm text-navy outline-none placeholder:text-slate-400"
          />
          <UserBadge />
        </div>
        <div className="mx-auto max-w-7xl px-8 py-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-primary">Espace apprenant</p>
              <h1 className="mt-2 text-3xl font-bold tracking-tight text-navy">Bonjour, Jean</h1>
              <p className="mt-3 max-w-2xl text-slate-600">
                Continuez votre parcours SAP — vous êtes à 80 % sur « SAP FI – Comptabilité générale ».
              </p>
            </div>
            <Link
              href="/cours/FI"
              className="inline-flex h-12 items-center justify-center rounded-lg bg-primary px-6 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
            >
              Reprendre la leçon
            </Link>
          </div>

          <div className="mt-12">
            <StatsCards />
          </div>

          <div className="mt-12">
            <ContinueLearning />
          </div>

          <div className="mt-12">
            <MyCourses />
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            <ProgressChart />
            <Recommended />
          </div>
        </div>
      </main>
    </div>
  );
}

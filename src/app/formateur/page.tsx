import { Suspense } from "react";
import { redirect } from "next/navigation";
import { requireRole } from "@/lib/auth/authorization";
import { AuthenticationError } from "@/lib/auth/types";

export default function FormateurPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-500">Chargement de votre espace…</div>}>
      <FormateurDashboard />
    </Suspense>
  );
}

async function FormateurDashboard() {
  let user;
  try {
    user = await requireRole(["formateur", "admin", "consultant", "expert"]);
  } catch (error) {
    if (error instanceof AuthenticationError && error.status === 401) {
      redirect("/connexion");
    }
    if (error instanceof AuthenticationError && error.status === 403) {
      redirect("/apprenant");
    }
    throw error;
  }

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-navy">
      <aside className="hidden w-64 flex-shrink-0 border-r border-slate-200 bg-white md:block">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-xl font-bold text-navy">Espace Formateur</h2>
          <p className="text-sm text-slate-600">{user.role}</p>
        </div>
        <nav className="p-4 space-y-2">
          <a href="/formateur" className="block px-4 py-2 rounded-lg bg-primary text-white">Mes formations</a>
          <a href="/formateur/evaluations" className="block px-4 py-2 rounded-lg text-slate-700 hover:bg-slate-100">Évaluations</a>
          <a href="/formateur/projets" className="block px-4 py-2 rounded-lg text-slate-700 hover:bg-slate-100">Projets et soutenances</a>
          <a href="/formateur/apprenants" className="block px-4 py-2 rounded-lg text-slate-700 hover:bg-slate-100">Suivi des apprenants</a>
        </nav>
      </aside>

      <main className="flex-1 p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-navy">Bonjour, {user.name}</h1>
            <p className="text-slate-600">Gérez vos formations, évaluez vos apprenants et suivez leur progression.</p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-lg font-semibold text-navy mb-4">Mes formations</h3>
            <p className="text-sm text-slate-600 mb-4">Aucune formation assignée pour le moment.</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-lg font-semibold text-navy mb-4">Évaluations à corriger</h3>
            <p className="text-sm text-slate-600 mb-4">0 en attente</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-lg font-semibold text-navy mb-4">Projets à évaluer</h3>
            <p className="text-sm text-slate-600 mb-4">0 en attente</p>
          </div>
        </div>
      </main>
    </div>
  );
}

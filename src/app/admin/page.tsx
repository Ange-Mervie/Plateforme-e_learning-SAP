import { Suspense } from "react";
import { redirect } from "next/navigation";
import { requireRole } from "@/lib/auth/authorization";
import { AuthenticationError } from "@/lib/auth/types";

export default function AdminPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-500">Chargement de votre espace…</div>}>
      <AdminDashboard />
    </Suspense>
  );
}

async function AdminDashboard() {
  let user;
  try {
    user = await requireRole(["admin"]);
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
          <h2 className="text-xl font-bold text-navy">Administration</h2>
          <p className="text-sm text-slate-600">{user.role}</p>
        </div>
        <nav className="p-4 space-y-2">
          <a href="/admin" className="block px-4 py-2 rounded-lg bg-primary text-white">Tableau de bord</a>
          <a href="/admin/utilisateurs" className="block px-4 py-2 rounded-lg text-slate-700 hover:bg-slate-100">Utilisateurs</a>
          <a href="/admin/abonnements" className="block px-4 py-2 rounded-lg text-slate-700 hover:bg-slate-100">Abonnements</a>
          <a href="/admin/formations" className="block px-4 py-2 rounded-lg text-slate-700 hover:bg-slate-100">Formations</a>
          <a href="/admin/paiements" className="block px-4 py-2 rounded-lg text-slate-700 hover:bg-slate-100">Paiements</a>
        </nav>
      </aside>

      <main className="flex-1 p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-navy">Tableau de bord administrateur</h1>
            <p className="text-slate-600">Gérez les utilisateurs, les abonnements, les paiements et les contenus de la plateforme.</p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-4">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="text-sm text-slate-600">Utilisateurs</div>
            <div className="text-3xl font-bold text-navy">—</div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="text-sm text-slate-600">Abonnements actifs</div>
            <div className="text-3xl font-bold text-navy">—</div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="text-sm text-slate-600">Formations</div>
            <div className="text-3xl font-bold text-navy">—</div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="text-sm text-slate-600">Paiements en attente</div>
            <div className="text-3xl font-bold text-navy">—</div>
          </div>
        </div>
      </main>
    </div>
  );
}

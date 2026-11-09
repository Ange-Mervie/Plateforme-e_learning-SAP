"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/auth-context";
import Link from "next/link";
import { ShieldCheck, Sparkles, ArrowRight } from "lucide-react";

export default function SubscriptionStatus({ userId }: { userId?: number | string }) {
  const { user } = useAuth();
  const [dbStatus, setDbStatus] = useState<string>("active");

  useEffect(() => {
    if (!user?.subscription?.status) {
      const id = userId || user?.id || 1;
      fetch(`/api/subscriptions?userId=${id}`)
        .then((r) => r.json())
        .then((d) => setDbStatus(d.subscription?.status || "active"))
        .catch(() => setDbStatus("active"));
    }
  }, [userId, user]);

  const status = user?.subscription?.status || dbStatus;
  const isActive = status === "active";

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-4">
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-xl ${
            isActive ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
          }`}
        >
          <ShieldCheck className="h-6 w-6" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-navy">Statut de votre abonnement</h3>
            <span
              className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                isActive ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
              }`}
            >
              {isActive ? "Actif (Accès Complet)" : "Période d'évaluation"}
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            {isActive
              ? "Accès illimité aux modules SAP, environnements Labs et examens d'attestation."
              : "Souscrivez au pack complet pour débloquer l'ensemble des modules certifiants."}
          </p>
        </div>
      </div>

      <div>
        <Link
          href="/paiement"
          className="inline-flex items-center gap-1.5 rounded-xl bg-surface px-4 py-2.5 text-xs font-bold text-navy hover:bg-slate-200 transition-colors"
        >
          <Sparkles className="h-4 w-4 text-primary" />
          <span>{isActive ? "Gérer mon abonnement" : "Mettre à niveau"}</span>
          <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
        </Link>
      </div>
    </div>
  );
}

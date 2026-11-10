"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/auth-context";
import Link from "next/link";
import { ShieldCheck, Sparkles, ArrowRight } from "lucide-react";

export default function SubscriptionStatus() {
  const { user } = useAuth();
  const [dbStatus, setDbStatus] = useState<string>("free");
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    if (!user) return;
    let active = true;
    fetch("/api/subscriptions", { credentials: "same-origin" })
      .then(async (response) => {
        if (!response.ok) throw new Error("Unable to load subscription.");
        return response.json();
      })
      .then((data) => {
        if (active) {
          setDbStatus(data.subscription?.status === "active" ? "active" : "free");
          setLoadError(false);
        }
      })
      .catch(() => {
        if (active) setLoadError(true);
      });
    return () => {
      active = false;
    };
  }, [user]);

  const status = loadError ? "unknown" : dbStatus;
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
                isActive
                  ? "bg-emerald-100 text-emerald-800"
                  : loadError ? "bg-red-100 text-red-800" : "bg-amber-100 text-amber-800"
              }`}
            >
              {loadError ? "Vérification indisponible" : isActive ? "Actif" : "Aucun abonnement actif"}
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            {loadError
              ? "Impossible de vérifier votre abonnement pour le moment."
              : isActive
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

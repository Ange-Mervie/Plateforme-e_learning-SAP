"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useLanguage } from "@/context/language-context";
import {
  User,
  Clock,
  Award,
  ArrowRight,
  Users,
  LayoutGrid,
  Mail,
  Phone,
} from "lucide-react";

const STATUTS = [
  { value: "nouvelle", label: "Nouvelle demande" },
  { value: "en_attente", label: "En attente de traitement" },
  { value: "formateur_affecte", label: "Formateur affecté" },
  { value: "candidat_contacte", label: "Candidat contacté" },
  { value: "en_discussion", label: "En discussion" },
  { value: "inscription_confirmee", label: "Inscription confirmée" },
  { value: "cloturee", label: "Demande clôturée" },
];

interface DemandeDetail {
  id: string;
  requestNumber: string;
  createdAt: string;
  status: string;
  nom: string;
  email: string;
  telephone: string;
  ville: string;
  pays: string;
  situation: string;
  formation: string;
  module: string;
  formateur: string;
  niveau: string;
  objectif: string;
  mode: string;
  disponibilite: string;
  dateDebut: string;
  dejaUtiliseSAP: string;
  dejaFormationSAP: string;
  attentes: string;
  message: string;
  consentement: boolean;
  formateurAssigne: string | null;
  commentaireInterne: string | null;
  formationCommencee: boolean;
  progression: number;
  evaluationPassee: boolean;
  evaluationScore: number;
  attestationValidee: boolean;
  motifRefusAttestation: string | null;
  historique: Array<{ action: string; date: string; auteur: string; details: string | null }>;
}

export default function DemandeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { lang } = useLanguage();
  const isFr = lang === "fr";
  const [demande, setDemande] = useState<DemandeDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const { id } = await params;
      const res = await fetch(`/api/contact/${id}`);
      const data = await res.json();
      setDemande(data.request ?? null);
    } catch {
      setDemande(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function updateChamp(champ: string, valeur: any) {
    if (!demande) return;
    setSaving(true);
    try {
      const body: any = { id: demande.id, [champ]: valeur };
      if (champ === "attestationValidee" && valeur === false) {
        const motif = window.prompt(isFr ? "Motif du refus de l'attestation :" : "Refusal reason for certificate:");
        body.motifRefusAttestation = motif ?? null;
      }
      await fetch("/api/contact", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      await load();
    } finally {
      setSaving(false);
    }
  }

  const statutLabel = STATUTS.find((s) => s.value === demande?.status)?.label || demande?.status || "";

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl py-20 text-center">
        <p className="text-slate-600">{isFr ? "Chargement…" : "Loading…"}</p>
      </div>
    );
  }

  if (!demande) {
    return (
      <div className="mx-auto max-w-4xl py-20 text-center">
        <h2 className="text-2xl font-bold text-navy">{isFr ? "Demande introuvable" : "Request not found"}</h2>
        <Link href="/admin/demandes" className="mt-4 inline-flex items-center gap-2 rounded-xl bg-primary px-4 text-xs font-bold text-white hover:bg-primary-dark">
          <ArrowRight className="h-3.5 w-3.5" /> {isFr ? "Retour à la liste" : "Back to list"}
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-navy">
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-navy">{demande.requestNumber}</h1>
              <p className="text-sm text-slate-600">{demande.nom}</p>
            </div>
            <Link
              href="/admin/demandes"
              className="inline-flex items-center gap-2 h-10 rounded-xl bg-primary px-4 text-xs font-bold text-white hover:bg-primary-dark transition-colors"
            >
              <ArrowRight className="h-3.5 w-3.5" />
              {isFr ? "Retour à la liste" : "Back to list"}
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* Statut */}
        <div className="mb-8">
          <label className="text-xs font-semibold text-slate-500 uppercase">{isFr ? "Statut" : "Status"}</label>
          <select
            value={demande.status}
            onChange={(e) => updateChamp("status", e.target.value)}
            disabled={saving}
            className="mt-1 h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm text-navy outline-none focus:border-primary disabled:opacity-60"
          >
            {STATUTS.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Informations candidat */}
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-bold text-navy mb-4 flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                {isFr ? "Candidat" : "Candidate"}
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-semibold text-slate-500">{isFr ? "Nom" : "Name"}</p>
                  <p className="text-sm font-bold text-navy">{demande.nom}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500">{isFr ? "Email" : "Email"}</p>
                  <p className="text-sm font-bold text-navy">{demande.email}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500">{isFr ? "Téléphone" : "Phone"}</p>
                  <p className="text-sm font-bold text-navy">{demande.telephone}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500">{isFr ? "Ville, Pays" : "City, Country"}</p>
                  <p className="text-sm font-bold text-navy">{demande.ville}, {demande.pays}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500">{isFr ? "Situation" : "Situation"}</p>
                  <p className="text-sm font-bold text-navy">{demande.situation}</p>
                </div>
                <div className="sm:col-span-2">
                  <p className="text-xs font-semibold text-slate-500">{isFr ? "Message" : "Message"}</p>
                  <p className="text-sm text-slate-700 leading-relaxed">{demande.message}</p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-bold text-navy mb-4 flex items-center gap-2">
                <LayoutGrid className="h-5 w-5 text-primary" />
                {isFr ? "Formation demandée" : "Training requested"}
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-semibold text-slate-500">{isFr ? "Formation" : "Training"}</p>
                  <p className="text-sm font-bold text-navy">{demande.formation}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500">{isFr ? "Module SAP" : "SAP Module"}</p>
                  <p className="text-sm font-bold text-navy">{demande.module}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500">{isFr ? "Formateur associé" : "Associated trainer"}</p>
                  <p className="text-sm font-bold text-navy">{demande.formateur || (isFr ? "Non précisé" : "Not specified")}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500">{isFr ? "Niveau" : "Level"}</p>
                  <p className="text-sm font-bold text-navy">{demande.niveau}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500">{isFr ? "Modalité" : "Mode"}</p>
                  <p className="text-sm font-bold text-navy">{demande.mode}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500">{isFr ? "Disponibilité" : "Availability"}</p>
                  <p className="text-sm font-bold text-navy">{demande.disponibilite}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500">{isFr ? "Date de début" : "Start date"}</p>
                  <p className="text-sm font-bold text-navy">{demande.dateDebut}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Actions admin */}
          <div className="lg:col-span-1 space-y-6">
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-bold text-navy mb-4 flex items-center gap-2">
                <Award className="h-5 w-5 text-primary" />
                {isFr ? "Suivi pédagogique" : "Pedagogical tracking"}
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase block mb-2">
                    {isFr ? "Formation commencée" : "Training started"}
                  </label>
                  <button
                    onClick={() => updateChamp("formationCommencee", !demande.formationCommencee)}
                    disabled={saving}
                    className={`flex w-full items-center justify-between px-4 py-3 rounded-lg border text-sm font-semibold transition-colors ${
                      demande.formationCommencee
                        ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                        : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <span>{demande.formationCommencee ? (isFr ? "Oui" : "Yes") : (isFr ? "Non" : "No")}</span>
                    <span className="text-[10px]">{isFr ? "Modifier" : "Edit"}</span>
                  </button>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase block mb-2">
                    {isFr ? "Progression" : "Progression"}
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={demande.progression}
                    onChange={(e) => updateChamp("progression", parseInt(e.target.value) || 0)}
                    disabled={saving}
                    className="w-full h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm text-navy outline-none focus:border-primary disabled:opacity-60"
                  />
                  <p className="text-xs text-slate-500 mt-1">{demande.progression}%</p>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase block mb-2">
                    {isFr ? "Évaluation passée" : "Assessment taken"}
                  </label>
                  <button
                    onClick={() => updateChamp("evaluationPassee", !demande.evaluationPassee)}
                    disabled={saving}
                    className={`flex w-full items-center justify-between px-4 py-3 rounded-lg border text-sm font-semibold transition-colors ${
                      demande.evaluationPassee
                        ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                        : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <span>{demande.evaluationPassee ? (isFr ? "Oui" : "Yes") : (isFr ? "Non" : "No")}</span>
                    <span className="text-[10px]">{isFr ? "Modifier" : "Edit"}</span>
                  </button>
                  {demande.evaluationPassee && (
                    <p className="text-xs text-slate-500 mt-1">Score: {demande.evaluationScore}</p>
                  )}
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase block mb-2">
                    {isFr ? "Attestation" : "Certificate"}
                  </label>
                  <button
                    onClick={() => updateChamp("attestationValidee", !demande.attestationValidee)}
                    disabled={saving}
                    className={`flex w-full items-center justify-between px-4 py-3 rounded-lg border text-sm font-semibold transition-colors ${
                      demande.attestationValidee
                        ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                        : demande.attestationValidee === false && demande.motifRefusAttestation
                          ? "bg-amber-50 border-amber-200 text-amber-700"
                          : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <span>
                      {demande.attestationValidee
                        ? (isFr ? "Validée" : "Validated")
                        : demande.motifRefusAttestation
                          ? (isFr ? "Refusée" : "Refused")
                          : (isFr ? "Non" : "No")}
                    </span>
                    <span className="text-[10px]">{isFr ? "Modifier" : "Edit"}</span>
                  </button>
                  {demande.motifRefusAttestation && (
                    <p className="text-xs text-amber-700 mt-1">{demande.motifRefusAttestation}</p>
                  )}
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase block mb-2">
                    {isFr ? "Commentaire interne" : "Internal comment"}
                  </label>
                  <textarea
                    value={demande.commentaireInterne || ""}
                    onChange={(e) => updateChamp("commentaireInterne", e.target.value)}
                    rows={3}
                    disabled={saving}
                    className="w-full h-24 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-navy outline-none focus:border-primary disabled:opacity-60"
                  />
                </div>
              </div>
            </div>

            {/* Affectation formateur */}
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-bold text-navy mb-4 flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                {isFr ? "Affectation formateur" : "Trainer assignment"}
              </h3>
              <p className="text-xs font-semibold text-slate-500 uppercase mb-3">
                {isFr ? "Formateur affecté" : "Assigned trainer"}
              </p>
              <div className="space-y-2">
                <input
                  type="text"
                  value={demande.formateurAssigne || ""}
                  onChange={(e) => updateChamp("formateurAssigne", e.target.value || null)}
                  disabled={saving}
                  placeholder={isFr ? "Nom du formateur" : "Trainer name"}
                  className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-navy outline-none focus:border-primary disabled:opacity-60"
                />
                <p className="text-xs text-slate-500">
                  {demande.formateurAssigne
                    ? isFr ? "Affecté à : " + demande.formateurAssigne : "Assigned to: " + demande.formateurAssigne
                    : isFr ? "Aucun formateur affecté" : "No trainer assigned"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Historique */}
        <div className="mt-12 rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="border-b border-slate-200 bg-surface px-6 py-4">
            <h3 className="text-lg font-bold text-navy flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              {isFr ? "Historique des actions" : "Action history"}
            </h3>
          </div>
          <div className="divide-y divide-slate-100">
            {demande.historique.length === 0 ? (
              <div className="px-6 py-8 text-center text-slate-500">
                {isFr ? "Aucune action enregistrée." : "No actions recorded."}
              </div>
            ) : (
              demande.historique.map((h, i) => (
                <div key={i} className="px-6 py-4 flex items-start gap-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary shrink-0">
                    <Mail className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-navy">{h.action}</p>
                    {h.details && (
                      <p className="text-xs text-slate-600 mt-0.5">{h.details}</p>
                    )}
                    <p className="text-[10px] text-slate-400 mt-1">
                      {h.auteur} · {new Date(h.date).toLocaleString(isFr ? "fr-FR" : "en-US")}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

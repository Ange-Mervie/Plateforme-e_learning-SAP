"use client";

import { useState } from "react";
import { COURSES } from "@/data/courses";
import Link from "next/link";
import {
  FileCode,
  Upload,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  Award,
  ExternalLink,
  Layers,
  FileCheck,
} from "lucide-react";

export default function ProjetPage() {
  const [courseSlug, setCourseSlug] = useState("fi-comptabilite-generale");
  const [projectTitle, setProjectTitle] = useState("Core Model S/4HANA : Implémentation Comptable et Clôture Périodique");
  const [repositoryUrl, setRepositoryUrl] = useState("https://github.com/mon-projet-sap");
  const [comments, setComments] = useState("Mise en place des structures organisationnelles, paramétrage des groupes de statuts de zones et simulation d'une clôture mensuelle.");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const checkAssessment = async (): Promise<boolean> => {
    const response = await fetch("/api/assessments", { credentials: "same-origin" });
    const data: { rows?: unknown } = await response.json().catch(() => ({}));
    const rows = Array.isArray(data.rows) ? (data.rows as { course_slug?: string; passed?: number }[]) : [];
    const latest = rows.find((row) => row.course_slug === courseSlug) ?? rows[0];
    return !!latest && Number(latest.passed) === 1;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const passed = await checkAssessment();
      if (!passed) {
        setError("Évaluation non validée — le projet ne peut pas être soumis.");
        return;
      }
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseSlug }),
      });
      if (!response.ok) throw new Error("Impossible d’enregistrer le projet.");
      setSubmitted(true);
    } catch (error) {
      console.error("[Project] Unable to submit project:", error);
      setError("Impossible d’enregistrer votre projet. Vérifiez votre connexion et réessayez.");
    } finally {
      setLoading(false);
    }
  };

  const selectedCourse = COURSES.find((c) => c.slug === courseSlug) || COURSES[0];

  return (
    <main className="min-h-screen bg-slate-50 py-12 px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="border-b border-slate-200 pb-6">
          <div className="flex items-center gap-2 text-xs font-semibold tracking-normal text-primary">
            <span className="flex h-6 w-6 items-center justify-center rounded bg-primary text-white text-[10px]">
              SAP
            </span>
            <span>Atelier Capstone & Soutenance</span>
          </div>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-navy sm:text-4xl">
            Projet de Synthèse Pratique
          </h1>
          <p className="mt-2 text-base text-slate-600 max-w-3xl leading-relaxed">
            Mettez en pratique vos acquis sur un cas d&apos;entreprise concret. Votre livrable sera examiné par nos consultants seniors certifiés IBN Group.
          </p>
        </div>

        <div className="mt-8 grid gap-10 lg:grid-cols-3">
          {/* Main Submission / Project Form */}
          <div className="lg:col-span-2 space-y-8">
            {/* Briefing Card */}
            <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
              <h2 className="text-xl font-bold text-navy flex items-center gap-2">
                <FileCode className="h-5 w-5 text-primary" />
                Cahier des charges : Cas d&apos;entreprise
              </h2>
              <div className="mt-4 rounded-xl bg-surface p-4 text-sm text-slate-700 leading-relaxed border border-slate-100">
                <p className="font-semibold text-navy">
                  Contexte : &quot;Groupe Industrie Ouest-Africaine (GIOA)&quot;
                </p>
                <p className="mt-2">
                  L&apos;entreprise modernise son système d&apos;information et migre vers SAP S/4HANA. En tant que consultant junior/confirmé, vous devez configurer le périmètre du module <strong>{selectedCourse.module}</strong>, documenter la traçabilité des pièces et présenter un jeu d&apos;essais sans anomalies.
                </p>
              </div>

              <div className="mt-6 space-y-3">
                <h3 className="text-xs font-semibold tracking-normal text-slate-400">
                  Livrables exigés pour la soutenance
                </h3>
                <ul className="space-y-2 text-sm text-slate-700">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
                    <span><strong>Document de paramétrage :</strong> Détail des codes transactions SPRO appliqués.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
                    <span><strong>Scénarios de tests :</strong> Preuves de saisie et pièces comptables/logistiques validées.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
                    <span><strong>Synthèse exécutive :</strong> Recommandations pour la mise en production.</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Submission Form */}
            <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
              <h2 className="text-xl font-bold text-navy flex items-center gap-2">
                <Upload className="h-5 w-5 text-primary" />
                Dépôt du Livrable de Projet
              </h2>

              {submitted ? (
                <div className="mt-6 rounded-2xl bg-emerald-50 border border-emerald-200 p-8 text-center space-y-4">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-600 text-white">
                    <CheckCircle2 className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-bold text-emerald-950">
                    Projet soumis avec succès !
                  </h3>
                  <p className="text-sm text-emerald-800 max-w-md mx-auto">
                    Votre dossier a été transmis au jury d&apos;experts IBN Group. Vous recevrez la grille d&apos;évaluation et la notification de validation sous 48 à 72 heures.
                  </p>
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => setSubmitted(false)}
                      className="rounded-xl bg-white border border-emerald-300 px-4 py-2 text-xs font-bold text-emerald-900 hover:bg-emerald-100 transition-colors"
                    >
                      Mettre à jour ma soumission
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                  {error ? <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</p> : null}
                  <div>
                    <label htmlFor="course" className="block text-xs font-semibold text-navy">
                      Module SAP concerné
                    </label>
                    <select
                      id="course"
                      value={courseSlug}
                      onChange={(e) => setCourseSlug(e.target.value)}
                      className="mt-1 h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm text-navy outline-none focus:border-primary"
                    >
                      {COURSES.map((c) => (
                        <option key={c.slug} value={c.slug}>
                          {c.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="title" className="block text-xs font-semibold text-navy">
                      Titre du projet
                    </label>
                    <input
                      id="title"
                      type="text"
                      value={projectTitle}
                      onChange={(e) => setProjectTitle(e.target.value)}
                      required
                      className="mt-1 h-11 w-full rounded-xl border border-slate-300 px-3 text-sm text-navy outline-none focus:border-primary"
                    />
                  </div>

                  <div>
                    <label htmlFor="repo" className="block text-xs font-semibold text-navy">
                      Lien vers vos livrables (GitHub, Google Drive, OneDrive)
                    </label>
                    <input
                      id="repo"
                      type="url"
                      value={repositoryUrl}
                      onChange={(e) => setRepositoryUrl(e.target.value)}
                      required
                      className="mt-1 h-11 w-full rounded-xl border border-slate-300 px-3 text-sm text-navy outline-none focus:border-primary"
                    />
                  </div>

                  <div>
                    <label htmlFor="comments" className="block text-xs font-semibold text-navy">
                      Note de synthèse pour le correcteur
                    </label>
                    <textarea
                      id="comments"
                      rows={3}
                      value={comments}
                      onChange={(e) => setComments(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-slate-300 p-3 text-sm text-navy outline-none focus:border-primary"
                    />
                  </div>

                  <div className="rounded-xl border border-dashed border-slate-300 bg-surface p-6 text-center">
                    <FileCheck className="h-8 w-8 text-slate-400 mx-auto" />
                    <p className="mt-2 text-xs font-semibold text-navy">
                      Glissez vos captures d&apos;écran ou fiches Excel de paramétrage
                    </p>
                    <p className="mt-1 text-[11px] text-slate-500">Formats acceptés : PDF, ZIP, XLSX (max 50 Mo)</p>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary text-sm font-bold text-white shadow-md hover:bg-primary-dark transition-all disabled:opacity-50"
                  >
                    <span>{loading ? "Transmission en cours..." : "Soumettre mon projet pour évaluation"}</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Right Sidebar: Evaluation Rubric */}
          <div className="space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-base font-bold text-navy flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-emerald-600" />
                Grille d&apos;évaluation (100 pts)
              </h3>
              <p className="mt-1 text-xs text-slate-500">
                Critères de notation appliqués par le jury :
              </p>

              <div className="mt-5 space-y-4 text-xs">
                <div className="rounded-xl bg-surface p-3.5 border border-slate-100">
                  <div className="flex justify-between font-bold text-navy">
                    <span>1. Configuration SPRO</span>
                    <span className="text-primary">25 pts</span>
                  </div>
                  <p className="mt-1 text-slate-600">Exactitude des structures et variantes organisationnelles.</p>
                </div>

                <div className="rounded-xl bg-surface p-3.5 border border-slate-100">
                  <div className="flex justify-between font-bold text-navy">
                    <span>2. Intégrité des données</span>
                    <span className="text-primary">25 pts</span>
                  </div>
                  <p className="mt-1 text-slate-600">Fiabilité des comptes, articles et pièces sans rejets système.</p>
                </div>

                <div className="rounded-xl bg-surface p-3.5 border border-slate-100">
                  <div className="flex justify-between font-bold text-navy">
                    <span>3. Respect des standards SAP</span>
                    <span className="text-primary">25 pts</span>
                  </div>
                  <p className="mt-1 text-slate-600">Utilisation conforme des bonnes pratiques SAP Best Practices.</p>
                </div>

                <div className="rounded-xl bg-surface p-3.5 border border-slate-100">
                  <div className="flex justify-between font-bold text-navy">
                    <span>4. Clarté du livrable</span>
                    <span className="text-primary">25 pts</span>
                  </div>
                  <p className="mt-1 text-slate-600">Qualité de la rédaction, captures Fiori et formalisme professionnel.</p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-navy p-6 text-white text-center">
              <Award className="h-8 w-8 text-amber-400 mx-auto" />
              <h4 className="mt-2 text-sm font-bold">Besoin d&apos;aide sur votre projet ?</h4>
              <p className="mt-1 text-xs text-blue-200">
                Nos formateurs et mentors sont disponibles sur la messagerie pour vous orienter.
              </p>
              <Link
                href="/apprenant/messagerie"
                className="mt-4 inline-flex h-9 w-full items-center justify-center rounded-xl bg-primary text-xs font-bold text-white hover:bg-primary-dark transition-colors"
              >
                Contacter un formateur
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

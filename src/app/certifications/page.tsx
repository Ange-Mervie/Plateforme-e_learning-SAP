"use client";

import Link from "next/link";
import { useLanguage } from "@/context/language-context";
import { CheckCircle2, Award, Mail, Clock, ShieldAlert, Play, Users } from "lucide-react";

const EXAMENS_FR = [
  { module: "SAP FI", title: "Comptabilité Générale", questions: 20, temps: 30 },
  { module: "SAP CO", title: "Contrôle de Gestion", questions: 20, temps: 30 },
  { module: "SAP MM", title: "Achats & Stocks", questions: 20, temps: 30 },
  { module: "SAP SD", title: "Ventes & Distribution", questions: 20, temps: 30 },
  { module: "SAP ABAP", title: "Développement", questions: 25, temps: 45 },
];

const EXAMENS_EN = [
  { module: "SAP FI", title: "Financial Accounting", questions: 20, temps: 30 },
  { module: "SAP CO", title: "Management Accounting", questions: 20, temps: 30 },
  { module: "SAP MM", title: "Purchasing & Inventory", questions: 20, temps: 30 },
  { module: "SAP SD", title: "Sales & Distribution", questions: 20, temps: 30 },
  { module: "SAP ABAP", title: "Development", questions: 25, temps: 45 },
];

const ETAPES_ATTESTATION_FR = [
  "Contactez ELEVATE By IBN via le formulaire",
  "Échangez avec un formateur certifié",
  "Définissez votre parcours de formation",
  "Suivez la formation convenue",
  "Réalisez les exercices et travaux pratiques",
  "Passez l'évaluation finale",
  "Recevez votre attestation ELEVATE By IBN",
];

const ETAPES_ATTESTATION_EN = [
  "Contact ELEVATE By IBN via the form",
  "Exchange with a certified trainer",
  "Define your training path",
  "Follow the agreed training",
  "Complete exercises and practical work",
  "Take the final assessment",
  "Receive your ELEVATE By IBN certificate",
];

export default function CertificationsPage() {
  const { lang } = useLanguage();
  const isFr = lang === "fr";
  const examens = isFr ? EXAMENS_FR : EXAMENS_EN;
  const etapes = isFr ? ETAPES_ATTESTATION_FR : ETAPES_ATTESTATION_EN;

  return (
    <div className="min-h-screen bg-white font-sans text-navy">
      {/* Hero */}
      <section className="bg-surface border-b border-slate-200 py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-navy sm:text-4xl">
            {isFr ? "Certifications & Examens Blancs" : "Certifications & Mock Exams"}
          </h2>
          <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
            {isFr ? "Testez gratuitement vos connaissances SAP et préparez votre attestation ELEVATE By IBN." : "Test your SAP knowledge for free and prepare your ELEVATE By IBN certificate."}
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">

        {/* ESPACE A - Examens blancs */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-2xl font-bold text-navy">
                {isFr ? "Espace A — Examens blancs gratuits" : "Space A — Free Mock Exams"}
              </h3>
              <p className="mt-2 text-slate-600">
                {isFr ? "Évaluez votre niveau SAP sans connexion ni abonnement." : "Assess your SAP level without login or subscription."}
              </p>
            </div>
            <Link
              href="/evaluation"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white hover:bg-primary-dark transition-colors"
            >
              <Play className="h-3.5 w-3.5" />
              {isFr ? "Passer un examen" : "Take an exam"}
            </Link>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {examens.map((exam, i) => (
              <div key={i} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-all">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{exam.module}</span>
                </div>
                <h4 className="text-lg font-bold text-navy mb-2">{exam.title}</h4>
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="text-center p-2 rounded-lg border border-slate-100">
                    <span className="block text-xs font-bold text-primary">{exam.questions}</span>
                    <span className="block text-[10px] text-slate-500">{isFr ? "questions" : "questions"}</span>
                  </div>
                  <div className="text-center p-2 rounded-lg border border-slate-100">
                    <span className="block text-xs font-bold text-primary">{exam.temps} min</span>
                    <span className="block text-[10px] text-slate-500">{isFr ? "chrono" : "timer"}</span>
                  </div>
                  <div className="text-center p-2 rounded-lg border border-slate-100">
                    <span className="block text-xs font-bold text-emerald-600">Gratuit</span>
                    <span className="block text-[10px] text-slate-500">{isFr ? "gratuit" : "free"}</span>
                  </div>
                </div>
                <p className="text-xs text-slate-500 mb-4">
                  {isFr ? "Examen blanc d'entraînement. Résultat immédiat avec explications." : "Mock exam for practice. Instant result with explanations."}
                </p>
                <Link
                  href={`/evaluation?module=${encodeURIComponent(exam.module)}`}
                  className="flex items-center gap-1.5 text-xs font-bold text-primary hover:underline"
                >
                  {isFr ? "Commencer l'examen" : "Start exam"} <span>→</span>
                </Link>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-lg border border-amber-100 bg-amber-50 p-4">
            <div className="flex items-start gap-3">
              <ShieldAlert className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
              <p className="text-sm text-amber-800 leading-relaxed">
                {isFr ? "Ces examens blancs sont des outils d'entraînement. Ils ne constituent pas une certification officielle SAP et ne délivrent pas d'attestation automatiquement." : "These mock exams are practice tools. They are not an official SAP certification and do not automatically issue a certificate."}
              </p>
            </div>
          </div>
        </section>

        {/* ESPACE B - Attestations */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-2xl font-bold text-navy">
                {isFr ? "Espace B — Attestations ELEVATE By IBN" : "Space B — ELEVATE By IBN Certificates"}
              </h3>
              <p className="mt-2 text-slate-600">
                {isFr ? "Comment obtenir votre attestation après validation pédagogique." : "How to obtain your certificate after pedagogical validation."}
              </p>
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            {/* Étapes */}
            <div className="space-y-4">
              <h4 className="text-lg font-bold text-navy mb-2">
                {isFr ? "Conditions d'obtention" : "Requirements"}
              </h4>
              {etapes.map((etape, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 shrink-0">
                    <span className="text-xs font-bold">{i + 1}</span>
                  </div>
                  <p className="text-sm text-slate-700 leading-relaxed">{etape}</p>
                </div>
              ))}
            </div>

            {/* Carte info */}
            <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
              <h4 className="text-lg font-bold text-navy mb-4">
                {isFr ? "Points importants" : "Important notes"}
              </h4>
              <ul className="space-y-3">
                <li className="flex items-start gap-2 text-sm text-slate-700">
                  <span className="text-emerald-600">✓</span>
                  {isFr ? "Aucune connexion requise pour les examens blancs" : "No login required for mock exams"}
                </li>
                <li className="flex items-start gap-2 text-sm text-slate-700">
                  <span className="text-emerald-600">✓</span>
                  {isFr ? "L'attestation est délivrée uniquement après validation par un formateur" : "Certificate issued only after trainer validation"}
                </li>
                <li className="flex items-start gap-2 text-sm text-slate-700">
                  <span className="text-emerald-600">✓</span>
                  {isFr ? "L'attestation ELEVATE By IBN n'est pas une certification officielle SAP" : "The ELEVATE By IBN certificate is not an official SAP certification"}
                </li>
                <li className="flex items-start gap-2 text-sm text-slate-700">
                  <span className="text-emerald-600">✓</span>
                  {isFr ? "Contactez un formateur pour définir votre parcours" : "Contact a trainer to define your training path"}
                </li>
              </ul>
              <div className="mt-6 rounded-xl border border-slate-100 bg-slate-50 p-4">
                <h5 className="text-xs font-bold text-slate-500 uppercase mb-2">
                  {isFr ? "Contacter un formateur" : "Contact a trainer"}
                </h5>
                <p className="text-sm text-slate-600 mb-3">
                  {isFr ? "Pour démarrer votre parcours et obtenir une attestation, remplissez le formulaire de contact." : "To start your training path and obtain a certificate, fill out the contact form."}
                </p>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-white hover:bg-primary-dark transition-colors"
                >
                  <Mail className="h-3.5 w-3.5" />
                  {isFr ? "Contacter un formateur" : "Contact a trainer"}
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

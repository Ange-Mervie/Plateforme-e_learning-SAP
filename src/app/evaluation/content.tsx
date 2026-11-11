"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  CheckCircle2,
  XCircle,
  Clock,
  RotateCcw,
  BookOpen,
  Award,
} from "lucide-react";

interface Question {
  id: number;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

const EVALUATION_BANKS: Record<string, Question[]> = {
  "fi-comptabilite-generale": [
    {
      id: 1,
      question: "Quel code transaction SAP est utilisé pour la saisie générale de pièces comptables (G/L Account Document) ?",
      options: ["FB50", "FS00", "F-02", "F110"],
      correct: 0,
      explanation: "La transaction FB50 permet la saisie rapide en un seul écran des écritures au grand livre.",
    },
    {
      id: 2,
      question: "Quelle entité organisationnelle est requise pour publier des états financiers (Bilan & Compte de résultat) légaux ?",
      options: ["Le domaine de contrôle (Controlling Area)", "Le code société (Company Code)", "Le secteur d'activité", "Le périmètre de résultat"],
      correct: 1,
      explanation: "Le code société (Company Code) est l'entité juridique et légale autonome dans SAP FI.",
    },
    {
      id: 3,
      question: "Dans SAP FI, que détermine le statut de zone (Field Status Group) affecté à un compte général ?",
      options: [
        "Le mot de passe de l'utilisateur",
        "Si un champ est obligatoire, facultatif ou masqué lors de la saisie d'écriture",
        "La devise par défaut de la banque",
        "La date d'expiration de la licence",
      ],
      correct: 1,
      explanation: "Le groupe de statuts de zones contrôle l'affichage (masqué/facultatif/obligatoire) des champs lors de la saisie de pièces.",
    },
    {
      id: 4,
      question: "Quelle clé de comptabilisation (Posting Key) standard correspond au Débit pour un compte général ?",
      options: ["01", "40", "50", "31"],
      correct: 1,
      explanation: "La clé 40 est le débit compte général standard, et la clé 50 est le crédit compte général standard.",
    },
    {
      id: 5,
      question: "Quel rapport standard SAP permet d'éditer le bilan et le compte de résultat ?",
      options: ["RFBILA00", "RAGITT_ALV01", "S_ALR_87012284", "F.01"],
      correct: 0,
      explanation: "Le programme RFBILA00 (accessible aussi via F.01) génère le bilan et compte de résultat.",
    },
    {
      id: 6,
      question: "Comment SAP garantit-il l'intégrité de la comptabilité auxiliaire (Clients FI-AR et Fournisseurs FI-AP) ?",
      options: [
        "Par des écritures manuelles en fin de mois",
        "Grâce aux comptes de rapprochement (Reconciliation Accounts) mis à jour en temps réel",
        "En bloquant les accès réseau",
        "Par exportation Excel obligatoire",
      ],
      correct: 1,
      explanation: "Les comptes collectifs (reconciliation accounts) interdisent la saisie directe et se mettent à jour automatiquement.",
    },
    {
      id: 7,
      question: "Quelle transaction permet de créer ou modifier la fiche d'un compte du grand livre au niveau central ?",
      options: ["FS00", "F-28", "FB60", "F-44"],
      correct: 0,
      explanation: "FS00 gère les fiches de comptes généraux de façon centralisée (plan comptable + société).",
    },
    {
      id: 8,
      question: "Dans la clôture mensuelle SAP, quel programme est utilisé pour l'évaluation des devises étrangères ?",
      options: ["FAGL_FC_VALUATION", "F110", "F101", "F-04"],
      correct: 0,
      explanation: "FAGL_FC_VALUATION (Foreign Currency Valuation) évalue les postes ouverts et soldes en devises étrangères.",
    },
    {
      id: 9,
      question: "Quelle table universelle dans S/4HANA regroupe l'ensemble des données financières et de contrôle de gestion ?",
      options: ["BKPF", "BSEG", "ACDOCA", "COEP"],
      correct: 2,
      explanation: "ACDOCA (Universal Journal) est la table unique et centrale regroupant FI et CO dans S/4HANA.",
    },
    {
      id: 10,
      question: "Quel statut doit avoir une période comptable dans la transaction OB52 pour autoriser les écritures ?",
      options: ["Ouverte (Open)", "Clôturée", "Verrouillée", "Archivée"],
      correct: 0,
      explanation: "La gestion des périodes comptables OB52 permet d'ouvrir ou fermer les variantes de périodes pour chaque type de compte.",
    },
  ],
  "mm-achats-stocks": [
    {
      id: 1,
      question: "Quelle transaction permet de créer une commande d'achat (Purchase Order) dans SAP MM ?",
      options: ["ME21N", "ME51N", "MIGO", "MIRO"],
      correct: 0,
      explanation: "ME21N est la transaction standard de création d'une commande d'achat fournisseur.",
    },
    {
      id: 2,
      question: "Quel code mouvement (Movement Type) standard est utilisé pour une réception de marchandises contre commande ?",
      options: ["101", "201", "261", "501"],
      correct: 0,
      explanation: "Le code mouvement 101 correspond à l'entrée de marchandises pour une commande d'achat.",
    },
    {
      id: 3,
      question: "Quelle transaction est utilisée pour enregistrer la facture fournisseur (Logistics Invoice Verification) ?",
      options: ["MIRO", "MIGO", "FB60", "ME23N"],
      correct: 0,
      explanation: "MIRO assure le contrôle et la saisie de facture logistique avec rapprochement à 3 voies (Commande - Réception - Facture).",
    },
    {
      id: 4,
      question: "Quelle est l'entité organisationnelle responsable de la négociation des conditions d'achat avec les fournisseurs ?",
      options: ["L'organisation d'achats (Purchasing Organization)", "Le magasin", "Le groupe d'acheteurs", "La division"],
      correct: 0,
      explanation: "L'organisation d'achats négocie les prix, contrats et conditions générales avec les tiers fournisseurs.",
    },
    {
      id: 5,
      question: "Dans SAP S/4HANA, quel objet remplace les fiches fournisseurs (Vendor) et clients (Customer) classiques ?",
      options: ["Le Business Partner (Partenaire commercial - transaction BP)", "L'info-record", "La fiche article", "La nomenclature"],
      correct: 0,
      explanation: "Le concept Business Partner (BP) est désormais obligatoire dans S/4HANA pour centraliser clients et fournisseurs.",
    },
  ],
  "abap-fondamentaux": [
    {
      id: 1,
      question: "Quel est l'environnement de développement intégré standard pour éditer des programmes ABAP dans SAP GUI ?",
      options: ["SE38 (ABAP Editor)", "SE11", "SE80", "Toutes ces réponses"],
      correct: 3,
      explanation: "SE38, SE80 (Object Navigator) et SE11 sont tous les outils fondamentaux de l'ABAP Workbench.",
    },
    {
      id: 2,
      question: "Quelle transaction permet de gérer le dictionnaire de données ABAP (Tables, structures, éléments de données) ?",
      options: ["SE11", "SE16N", "SE24", "SM59"],
      correct: 0,
      explanation: "SE11 est le dictionnaire de données ABAP (ABAP Dictionary).",
    },
    {
      id: 3,
      question: "Comment se termine obligatoirement chaque instruction en langage ABAP ?",
      options: ["Par un point (.)", "Par un point-virgule (;)", "Par deux-points (:)", "Par une accolade (})"],
      correct: 0,
      explanation: "En ABAP, chaque instruction syntaxique se termine par un point final (.).",
    },
    {
      id: 4,
      question: "Quelle structure en mémoire permet de manipuler dynamiquement plusieurs lignes de données en ABAP ?",
      options: ["Une table interne (Internal Table)", "Un Work Area unique", "Un paramètre de sélection", "Un domaine"],
      correct: 0,
      explanation: "Les tables internes permettent de stocker et manipuler des ensembles de données en mémoire vive.",
    },
    {
      id: 5,
      question: "Quel modèle de programmation moderne est recommandé par SAP sur BTP et S/4HANA Cloud ?",
      options: ["ABAP RESTful Application Programming Model (RAP)", "Web Dynpro classique", "Dynpro SAPscripts", "BAPI obsolètes"],
      correct: 0,
      explanation: "RAP (ABAP RESTful Application Programming Model) est le standard stratégique moderne pour les apps Fiori et Cloud.",
    },
  ],
};

export default function EvaluationContent() {
  const searchParams = useSearchParams();
  const initialCourse = searchParams.get("course") || "fi-comptabilite-generale";

  const [selectedCourseSlug, setSelectedCourseSlug] = useState(initialCourse);
  const questions =
    EVALUATION_BANKS[selectedCourseSlug] || EVALUATION_BANKS["fi-comptabilite-generale"];

  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [currentIdx, setCurrentIdx] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [passed, setPassed] = useState(false);
  const [saveError, setSaveError] = useState("");

  const handleCourseChange = (slug: string) => {
    setSelectedCourseSlug(slug);
    setAnswers({});
    setCurrentIdx(0);
    setSubmitted(false);
    setScore(null);
    setSaveError("");
  };

  const handleSelectOption = (qId: number, optIdx: number) => {
    if (!submitted) {
      setAnswers((prev) => ({ ...prev, [qId]: optIdx }));
    }
  };

  const handleFinish = async () => {
    let correctCount = 0;
    questions.forEach((q) => {
      if (answers[q.id] === q.correct) {
        correctCount++;
      }
    });

    const calculatedScore = Math.round((correctCount / questions.length) * 100);
    const isPassed = calculatedScore >= 70;

    setScore(calculatedScore);
    setPassed(isPassed);
    setSubmitted(true);
    setSaveError("");

    try {
      const response = await fetch("/api/assessments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseSlug: selectedCourseSlug,
          score: calculatedScore,
        }),
      });
      if (!response.ok) throw new Error("Assessment save was rejected.");
    } catch (error) {
      console.error("[Assessment] Unable to save assessment:", error);
      setSaveError("Votre score est calculé dans cette session, mais n’a pas pu être enregistré sur le serveur.");
    }
  };

  const currentQ = questions[currentIdx];
  const currentAnswer = currentQ ? answers[currentQ.id] : undefined;
  const answeredCount = Object.keys(answers).length;

  return (
    <main className="min-h-screen bg-slate-50 py-12 px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-surface text-xs font-bold text-navy">
                SAP
              </span>
              <p className="text-xs font-semibold tracking-normal text-slate-700">
                Centre d&apos;Évaluation Officiel
              </p>
            </div>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-navy">
              Examen de Certification
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              Évaluation rigoureuse des compétences pratiques et conceptuelles SAP (Seuil d&apos;admission : 70%).
            </p>
          </div>

          {/* Module Selector */}
          <div>
            <label htmlFor="course-select" className="block text-xs font-semibold text-slate-500 mb-1">
              Module à évaluer
            </label>
            <select
              id="course-select"
              value={selectedCourseSlug}
              onChange={(e) => handleCourseChange(e.target.value)}
              disabled={submitted}
              className="h-10 rounded-xl border border-slate-300 bg-white px-3 text-sm font-semibold text-navy shadow-sm focus:border-primary outline-none"
            >
              <option value="fi-comptabilite-generale">SAP FI  Comptabilité générale</option>
              <option value="mm-achats-stocks">SAP MM  Achats et stocks</option>
              <option value="abap-fondamentaux">SAP ABAP  Fondamentaux développement</option>
            </select>
          </div>
        </div>

        {/* Exam Stepper / Result */}
        {!submitted ? (
          <div className="mt-8 space-y-6">
            {/* Progress Bar & Stepper */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
                <span>
                  Question {currentIdx + 1} sur {questions.length}
                </span>
                <span className="text-navy">
                  {answeredCount} / {questions.length} traitée(s)
                </span>
              </div>
              <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-emerald-600 transition-all duration-300"
                  style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
                />
              </div>

              {/* Question Navigation Bubbles */}
              <div className="mt-4 flex flex-wrap gap-2">
                {questions.map((q, idx) => {
                  const isAnswered = answers[q.id] !== undefined;
                  const isCurrent = idx === currentIdx;
                  return (
                    <button
                      key={q.id}
                      type="button"
                      onClick={() => setCurrentIdx(idx)}
                      className={`h-8 w-8 rounded-lg text-xs font-bold transition-all ${
                        isCurrent
                          ? "bg-navy text-white shadow-sm ring-2 ring-primary ring-offset-2"
                          : isAnswered
                          ? "bg-emerald-200 text-emerald-800"
                          : "bg-surface text-slate-500 hover:bg-slate-200"
                      }`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Current Question Card */}
            {currentQ && (
              <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
                <div className="flex items-center gap-2 text-xs font-semibold tracking-normal text-navy">
                  <span>Question n° {currentIdx + 1}</span>
                </div>
                <h2 className="mt-3 text-lg font-bold text-navy sm:text-xl">
                  {currentQ.question}
                </h2>

                <div className="mt-6 space-y-3">
                  {currentQ.options.map((opt, optIdx) => {
                    const isSelected = currentAnswer === optIdx;
                    return (
                      <label
                        key={optIdx}
                        onClick={() => handleSelectOption(currentQ.id, optIdx)}
                        className={`flex items-center gap-4 rounded-xl border p-4 text-sm font-medium cursor-pointer transition-all ${
                          isSelected
                            ? "border-emerald-600 bg-emerald-50 text-emerald-800 shadow-sm"
                            : "border-slate-200 hover:border-slate-300 hover:bg-surface text-slate-700"
                        }`}
                      >
                        <span
                          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs font-bold ${
                            isSelected
                              ? "border-emerald-600 bg-emerald-600 text-white"
                              : "border-slate-300 bg-white text-slate-500"
                          }`}
                        >
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        <span className="flex-1 leading-relaxed">{opt}</span>
                      </label>
                    );
                  })}
                </div>

                {/* Navigation Buttons */}
                <div className="mt-8 flex items-center justify-between border-t border-slate-100 pt-6">
                  <button
                    type="button"
                    onClick={() => setCurrentIdx(Math.max(0, currentIdx - 1))}
                    disabled={currentIdx === 0}
                    className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-navy hover:bg-surface disabled:opacity-40"
                  >
                    Précédent
                  </button>

                  {currentIdx < questions.length - 1 ? (
                    <button
                      type="button"
                      onClick={() => setCurrentIdx(currentIdx + 1)}
                      className="rounded-xl bg-surface px-6 py-2.5 text-sm font-semibold text-navy border border-slate-200 hover:bg-primary hover:text-white hover:border-primary transition-colors"
                    >
                      Suivant
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleFinish}
                      disabled={answeredCount < questions.length}
                      className="rounded-xl bg-emerald-600 px-7 py-2.5 text-sm font-bold text-white shadow-md hover:bg-emerald-700 transition-all disabled:opacity-50"
                    >
                      Finaliser et soumettre l&apos;examen
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Results Stage */
          <div className="mt-8 space-y-8">
            {saveError ? <p role="alert" className="rounded-lg bg-amber-50 p-3 text-sm font-semibold text-amber-800">{saveError}</p> : null}
            <div
              className={`rounded-3xl border p-8 text-center sm:p-10 shadow-lg ${
                passed
                  ? "border-emerald-200 bg-gradient-to-b from-emerald-50/60 to-white"
                  : "border-amber-200 bg-gradient-to-b from-amber-50/60 to-white"
              }`}
            >
              <div
                className={`mx-auto flex h-20 w-20 items-center justify-center rounded-full text-white shadow-md ${
                  passed ? "bg-emerald-600" : "bg-amber-500"
                }`}
              >
                {passed ? <Award className="h-10 w-10" /> : <Clock className="h-10 w-10" />}
              </div>

              <h2 className="mt-5 text-2xl font-extrabold text-navy sm:text-3xl">
                {passed ? "Félicitations ! Évaluation validée" : "Évaluation non validée"}
              </h2>

              <p className="mt-2 text-sm text-slate-600 max-w-lg mx-auto">
                {passed
                  ? "Vous avez atteint le seuil de cette évaluation. La délivrance d’attestations sera disponible après la mise en place d’une validation officielle."
                  : "Le seuil minimal requis est de 70%. Nous vous encourageons à reprendre les modules pratiques avant une nouvelle tentative."}
              </p>

              <div className="mt-6 inline-flex items-baseline gap-2 rounded-2xl bg-white px-6 py-3 border border-slate-200 shadow-sm">
                <span className="text-xs font-semibold tracking-normal text-slate-500">Votre score :</span>
                <span className={`text-4xl font-extrabold ${passed ? "text-emerald-600" : "text-amber-600"}`}>
                  {score} %
                </span>
              </div>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                {passed ? (
                  <p className="rounded-xl bg-slate-100 px-6 py-3 text-sm font-semibold text-slate-600">
                    Attestations non disponibles pour le moment
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setSubmitted(false);
                      setAnswers({});
                      setCurrentIdx(0);
                    }}
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-surface px-6 text-sm font-semibold text-navy border border-slate-200 hover:bg-slate-100 transition-colors"
                  >
                    <RotateCcw className="h-4 w-4" />
                    <span>Retenter l&apos;examen</span>
                  </button>
                )}

                <Link
                  href="/apprenant"
                  className="inline-flex h-12 items-center justify-center rounded-xl border border-slate-300 bg-white px-6 text-sm font-semibold text-navy hover:bg-surface transition-colors"
                >
                  Tableau de bord apprenant
                </Link>
              </div>
            </div>

            {/* Detailed Answers Review */}
            <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm space-y-6">
              <h3 className="text-xl font-bold text-navy flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-navy" />
                Correction détaillée des questions
              </h3>

              <div className="space-y-6 divide-y divide-slate-100">
                {questions.map((q, idx) => {
                  const userAns = answers[q.id];
                  const isCorrect = userAns === q.correct;

                  return (
                    <div key={q.id} className="pt-6 first:pt-0">
                      <div className="flex items-start gap-3">
                        <span className="mt-0.5">
                          {isCorrect ? (
                            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                          ) : (
                            <XCircle className="h-5 w-5 text-red-500" />
                          )}
                        </span>
                        <div className="flex-1">
                          <p className="text-sm font-bold text-navy">
                            {idx + 1}. {q.question}
                          </p>

                          <div className="mt-3 grid gap-2 sm:grid-cols-2 text-xs">
                            <div className={`p-2.5 rounded-lg border ${isCorrect ? "bg-emerald-50/60 border-emerald-200 text-emerald-900" : "bg-red-50/60 border-red-200 text-red-900"}`}>
                              <span className="font-bold">Votre réponse :</span> {userAns !== undefined ? q.options[userAns] : "Non répondu"}
                            </div>
                            {!isCorrect && (
                              <div className="p-2.5 rounded-lg border bg-emerald-50/60 border-emerald-200 text-emerald-900">
                                <span className="font-bold">Réponse exacte :</span> {q.options[q.correct]}
                              </div>
                            )}
                          </div>

                          <p className="mt-2 text-xs text-slate-600 bg-surface p-3 rounded-lg">
                            <span className="font-semibold text-navy">Explication SAP :</span> {q.explanation}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

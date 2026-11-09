"use client";

import { useState } from "react";
import { type Course, COURSES } from "@/data/courses";
import { useProgress } from "@/context/progress-context";
import { useAuth } from "@/context/auth-context";
import Link from "next/link";
import {
  Play,
  CheckCircle2,
  Circle,
  FileText,
  HelpCircle,
  Terminal,
  Download,
  Award,
  ChevronRight,
  ExternalLink,
  BookOpen,
  Sparkles,
} from "lucide-react";

interface Props {
  course?: Course;
  code?: string;
}

const TABS = [
  { id: "lecons", label: "Leçons du cours", icon: BookOpen },
  { id: "exercices", label: "Atelier Pratique (Lab)", icon: Terminal },
  { id: "quiz", label: "Quiz de validation", icon: HelpCircle },
  { id: "ressources", label: "Ressources & Guides", icon: FileText },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function CoursPlayer({ course: propCourse, code }: Props) {
  const course =
    propCourse ||
    (code ? COURSES.find((c) => c.slug === code || c.module === code) : null) ||
    COURSES[0];

  const { user } = useAuth();
  const { setLessonCompleted, getProgress } = useProgress();
  const courseProgress = getProgress(course.slug);
  const completedLessons = courseProgress?.completedLessons ?? [];

  // Flatten all lessons
  const allLessons = course.sections.flatMap((s, sIdx) =>
    s.lessons.map((l, lIdx) => ({
      id: `s${sIdx}-l${lIdx}`,
      sectionTitle: s.title,
      title: l.title,
      minutes: l.minutes,
    }))
  );

  const [activeLessonIndex, setActiveLessonIndex] = useState(0);
  const activeLesson = allLessons[activeLessonIndex] || allLessons[0];
  const [tab, setTab] = useState<TabId>("lecons");

  // Quiz state
  const QUIZ_QUESTIONS = [
    {
      question: `Dans le module SAP ${course.module}, quel est le rôle principal de ce processus ?`,
      options: [
        "Piloter l'infrastructure réseau du serveur",
        course.summary,
        "Remplacer les bases de données SQL",
        "Aucune des réponses ci-dessus",
      ],
      answer: 1,
      explanation: `Le module SAP ${course.module} est spécifiquement conçu pour ${course.summary.toLowerCase()}`,
    },
    {
      question: "Quelle transaction SAP standard est la plus couramment utilisée dans ce cadre ?",
      options: [
        course.module === "FI" ? "FB50 (Saisie de pièce au journal)" : course.module === "MM" ? "ME21N (Création commande achat)" : "SE38 (Éditeur ABAP)",
        "SM04 (Liste des sessions)",
        "AL08 (Utilisateurs connectés)",
        "SU01 (Gestion des autorisations)",
      ],
      answer: 0,
      explanation: "Cette transaction métier est au cœur des opérations quotidiennes des utilisateurs clés et consultants.",
    },
    {
      question: "Que représente le 'Code Société' (Company Code) dans l'architecture SAP ?",
      options: [
        "Un matricule d'employé",
        "La plus petite entité organisationnelle pour laquelle un bilan comptable complet peut être établi",
        "Le numéro de série de la licence logicielle SAP",
        "Un paramètre temporaire de session",
      ],
      answer: 1,
      explanation: "Dans SAP ERP / S/4HANA, le code société est l'entité comptable autonome légale.",
    },
    {
      question: "Quelle est la règle d'or pour valider une pièce ou opération avant comptabilisation ?",
      options: [
        "L'équilibre Débit = Crédit et la cohérence des périodes comptables",
        "Supprimer la base de données de test",
        "Redémarrer le serveur d'application",
        "Modifier directement la table système",
      ],
      answer: 0,
      explanation: "La comptabilisation SAP requiert un équilibre strict entre débits et crédits selon les principes IFRS / PCG.",
    },
  ];

  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState<number | null>(null);

  const isCurrentCompleted = completedLessons.includes(activeLesson.id);

  const toggleCurrentLesson = () => {
    setLessonCompleted(course.slug, activeLesson.id, !isCurrentCompleted, allLessons.length);
  };

  const handleNextLesson = () => {
    if (!isCurrentCompleted) {
      setLessonCompleted(course.slug, activeLesson.id, true, allLessons.length);
    }
    if (activeLessonIndex < allLessons.length - 1) {
      setActiveLessonIndex(activeLessonIndex + 1);
    }
  };

  const submitQuiz = async () => {
    let correct = 0;
    QUIZ_QUESTIONS.forEach((q, idx) => {
      if (quizAnswers[idx] === q.answer) correct++;
    });
    const score = Math.round((correct / QUIZ_QUESTIONS.length) * 100);
    setQuizScore(score);
    setQuizSubmitted(true);

    try {
      await fetch("/api/assessments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user?.id || 1,
          courseSlug: course.slug,
          score,
        }),
      });
    } catch {
      // offline support
    }
  };

  const percent = allLessons.length > 0 ? Math.round((completedLessons.length / allLessons.length) * 100) : 0;

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      {/* Video & Player Stage */}
      <div className="lg:col-span-2 space-y-6">
        {/* Video Simulation Canvas */}
        <div className="relative overflow-hidden rounded-2xl bg-slate-950 aspect-video shadow-lg border border-slate-800 flex flex-col justify-between p-6 text-white">
          <div className="flex items-center justify-between">
            <span className="rounded-md bg-primary/80 px-2.5 py-1 text-xs font-bold uppercase tracking-wider backdrop-blur-sm">
              SAP S/4HANA · Démo Interactive
            </span>
            <span className="text-xs text-slate-400">
              Leçon {activeLessonIndex + 1} / {allLessons.length}
            </span>
          </div>

          <div className="my-auto text-center px-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition-transform hover:scale-110 cursor-pointer">
              <Play className="h-7 w-7 text-primary ml-1" />
            </div>
            <h2 className="mt-4 text-xl font-bold tracking-tight text-white sm:text-2xl">
              {activeLesson.title}
            </h2>
            <p className="mt-1 text-sm text-slate-300">
              {activeLesson.sectionTitle} · Durée : {activeLesson.minutes} minutes
            </p>
          </div>

          {/* Player bottom controls simulation */}
          <div className="border-t border-white/10 pt-3 flex items-center justify-between text-xs text-slate-400">
            <span>Environnement : SAP Fiori Launchpad 2026</span>
            <div className="flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Système Connecté (SAP Cloud LAB)</span>
            </div>
          </div>
        </div>

        {/* Progress & Quick Actions */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-wrap items-center justify-between gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-navy">Progression du module</span>
              <span className="text-primary">{percent} % terminé</span>
            </div>
            <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-primary transition-all duration-500"
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={toggleCurrentLesson}
              className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${
                isCurrentCompleted
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  : "bg-surface text-navy hover:bg-slate-200"
              }`}
            >
              <CheckCircle2 className={`h-4 w-4 ${isCurrentCompleted ? "text-emerald-600" : "text-slate-400"}`} />
              <span>{isCurrentCompleted ? "Leçon terminée ✓" : "Valider la leçon"}</span>
            </button>

            {activeLessonIndex < allLessons.length - 1 && (
              <button
                type="button"
                onClick={handleNextLesson}
                className="flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-dark transition-colors"
              >
                <span>Leçon suivante</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* Tabs Content */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          {/* Tabs header */}
          <div className="flex gap-2 border-b border-slate-200 pb-4 overflow-x-auto">
            {TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold whitespace-nowrap transition-colors ${
                  tab === t.id
                    ? "bg-primary text-white shadow-sm"
                    : "text-slate-600 hover:bg-surface hover:text-navy"
                }`}
              >
                <t.icon className="h-4 w-4" />
                <span>{t.label}</span>
              </button>
            ))}
          </div>

          {/* Tab 1: Notes de leçon */}
          {tab === "lecons" && (
            <div className="mt-6 space-y-4">
              <h3 className="text-lg font-bold text-navy">Contenu & Guide Pratique : {activeLesson.title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Cette session se concentre sur les paramétrages essentiels et la cinématique des transactions dans l&apos;ERP SAP S/4HANA.
              </p>

              <div className="rounded-xl bg-surface p-5 border border-slate-200 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-primary">
                  Transactions & Écrans clés abordés
                </h4>
                <div className="grid gap-2 sm:grid-cols-2 text-sm">
                  <div className="rounded-lg bg-white p-3 border border-slate-100">
                    <span className="font-mono font-bold text-primary">/n{course.module === "FI" ? "FB50" : course.module === "MM" ? "ME21N" : "SE38"}</span>
                    <p className="mt-1 text-xs text-slate-600">Saisie et traitement opérationnel principal</p>
                  </div>
                  <div className="rounded-lg bg-white p-3 border border-slate-100">
                    <span className="font-mono font-bold text-primary">/nSPRO</span>
                    <p className="mt-1 text-xs text-slate-600">Guide d&apos;implémentation (IMG SAP Customizing)</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-sm text-slate-700">
                <p className="font-semibold text-navy">Points méthodologiques essentiels :</p>
                <ul className="list-disc pl-5 space-y-1 text-slate-600">
                  <li>Respect de la structure organisationnelle (Société, Division, Organisation d&apos;achats/ventes).</li>
                  <li>Contrôle de l&apos;intégrité référentielle et des statuts des groupes de comptes.</li>
                  <li>Simulation avant enregistrement définitif pour vérifier l&apos;absence de blocages de lettrage.</li>
                </ul>
              </div>
            </div>
          )}

          {/* Tab 2: Exercices Pratiques */}
          {tab === "exercices" && (
            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-navy">Atelier Pratique SAP Guidé</h3>
                <span className="rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1">
                  Lab Actif
                </span>
              </div>
              <p className="text-sm text-slate-600">
                Réalisez ce scénario d&apos;entreprise directement dans votre console d&apos;exercice SAP GUI / Fiori :
              </p>

              <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-5 space-y-3">
                <p className="text-xs font-bold uppercase text-primary">Scénario d&apos;application : Entreprise &quot;Global Logistics SA&quot;</p>
                <ol className="list-decimal pl-5 space-y-2 text-sm text-slate-700">
                  <li>Connectez-vous au client SAP avec vos identifiants d&apos;apprenant.</li>
                  <li>Exécutez la transaction <code className="font-mono bg-white px-1.5 py-0.5 rounded border border-blue-200 text-primary font-bold">SPRO</code> pour naviguer vers le customizing du module {course.module}.</li>
                  <li>Créez la fiche de paramétrage test associée au code société <code className="font-mono bg-white px-1.5 py-0.5 rounded border border-blue-200 font-bold">1000</code>.</li>
                  <li>Vérifiez l&apos;impact comptable ou logistique à l&apos;aide des états de synthèse standard.</li>
                </ol>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => alert("Environnement Lab SAP connecté ! Vous pouvez basculer vers votre session SAP GUI.")}
                  className="rounded-xl bg-navy text-white text-xs font-semibold px-4 py-2.5 hover:bg-slate-800 transition-colors"
                >
                  Ouvrir le terminal SAP WebGUI
                </button>
              </div>
            </div>
          )}

          {/* Tab 3: Quiz */}
          {tab === "quiz" && (
            <div className="mt-6 space-y-6">
              <div>
                <h3 className="text-lg font-bold text-navy">Quiz d&apos;auto-évaluation</h3>
                <p className="text-sm text-slate-600">
                  Répondez à ces questions pour consolider votre compréhension du module {course.module}.
                </p>
              </div>

              <div className="space-y-5">
                {QUIZ_QUESTIONS.map((q, idx) => {
                  const selected = quizAnswers[idx];
                  const isCorrect = selected === q.answer;

                  return (
                    <div key={idx} className="rounded-xl border border-slate-200 p-5">
                      <p className="text-sm font-semibold text-navy">
                        {idx + 1}. {q.question}
                      </p>
                      <div className="mt-3 space-y-2">
                        {q.options.map((opt, oIdx) => (
                          <label
                            key={oIdx}
                            className={`flex items-center gap-3 rounded-lg border p-3 text-sm cursor-pointer transition-colors ${
                              selected === oIdx
                                ? "border-primary bg-primary/5 text-primary font-medium"
                                : "border-slate-200 hover:bg-surface text-slate-700"
                            }`}
                          >
                            <input
                              type="radio"
                              name={`quiz-${idx}`}
                              checked={selected === oIdx}
                              onChange={() => {
                                if (!quizSubmitted) {
                                  setQuizAnswers({ ...quizAnswers, [idx]: oIdx });
                                }
                              }}
                              disabled={quizSubmitted}
                              className="h-4 w-4 accent-primary"
                            />
                            <span>{opt}</span>
                          </label>
                        ))}
                      </div>

                      {quizSubmitted && (
                        <div
                          className={`mt-3 rounded-lg p-3 text-xs leading-relaxed ${
                            isCorrect ? "bg-emerald-50 text-emerald-800" : "bg-red-50 text-red-800"
                          }`}
                        >
                          <span className="font-bold">{isCorrect ? "✓ Réponse exacte :" : "✗ Erreur :"}</span>{" "}
                          {q.explanation}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {!quizSubmitted ? (
                <button
                  type="button"
                  onClick={submitQuiz}
                  disabled={Object.keys(quizAnswers).length < QUIZ_QUESTIONS.length}
                  className="rounded-xl bg-primary px-6 py-3 text-sm font-bold text-white shadow-sm hover:bg-primary-dark transition-colors disabled:opacity-50"
                >
                  Valider mes réponses
                </button>
              ) : (
                <div className="rounded-xl bg-surface p-6 border border-slate-200 text-center">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Résultat du Quiz</p>
                  <p className="mt-2 text-3xl font-extrabold text-navy">{quizScore} %</p>
                  <p className="mt-1 text-sm text-slate-600">
                    {quizScore! >= 70
                      ? "Excellent travail ! Vous maîtrisez les concepts fondamentaux de ce module."
                      : "Nous vous conseillons de réviser les leçons avant de retenter le quiz."}
                  </p>
                  <div className="mt-4 flex justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setQuizSubmitted(false);
                        setQuizAnswers({});
                        setQuizScore(null);
                      }}
                      className="rounded-lg border border-slate-300 px-4 py-2 text-xs font-semibold text-navy hover:bg-white"
                    >
                      Recommencer
                    </button>
                    <Link
                      href="/evaluation"
                      className="rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-white hover:bg-primary-dark"
                    >
                      Accéder à l&apos;examen officiel
                    </Link>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tab 4: Ressources */}
          {tab === "ressources" && (
            <div className="mt-6 space-y-4">
              <h3 className="text-lg font-bold text-navy">Documents & Supports de Cours</h3>
              <p className="text-sm text-slate-600">
                Téléchargez les fiches mémos, aides-mémoires transactions et guides édités par l&apos;académie IBN Group.
              </p>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="flex items-center justify-between rounded-xl border border-slate-200 p-4 hover:border-primary transition-colors">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm font-semibold text-navy">Aide-mémoire T-Codes {course.module}</p>
                      <p className="text-xs text-slate-500">Format PDF · 4 pages</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => alert("Téléchargement du guide démarré.")}
                    className="p-2 text-slate-400 hover:text-primary transition-colors"
                  >
                    <Download className="h-4 w-4" />
                  </button>
                </div>

                <div className="flex items-center justify-between rounded-xl border border-slate-200 p-4 hover:border-primary transition-colors">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm font-semibold text-navy">Guide de paramétrage S/4HANA</p>
                      <p className="text-xs text-slate-500">Format PDF · Synthèse consultant</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => alert("Téléchargement du guide démarré.")}
                    className="p-2 text-slate-400 hover:text-primary transition-colors"
                  >
                    <Download className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Sidebar: Lessons Playlist */}
      <div className="space-y-6">
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="bg-navy p-5 text-white">
            <p className="text-xs font-bold uppercase tracking-wider text-blue-200">Sommaire interactif</p>
            <h3 className="mt-1 text-base font-bold text-white">Programme détaillé ({allLessons.length} leçons)</h3>
          </div>

          <div className="max-h-[600px] overflow-y-auto divide-y divide-slate-100">
            {allLessons.map((l, idx) => {
              const isActive = idx === activeLessonIndex;
              const isCompleted = completedLessons.includes(l.id);

              return (
                <button
                  key={l.id}
                  type="button"
                  onClick={() => setActiveLessonIndex(idx)}
                  className={`w-full flex items-start gap-3 p-4 text-left transition-all ${
                    isActive
                      ? "bg-blue-50/70 border-l-4 border-primary"
                      : "hover:bg-slate-50"
                  }`}
                >
                  <span className="mt-0.5 shrink-0">
                    {isCompleted ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    ) : (
                      <Circle className="h-4 w-4 text-slate-300" />
                    )}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className={`text-xs font-medium ${isActive ? "text-primary font-bold" : "text-navy"}`}>
                      Leçon {idx + 1}
                    </p>
                    <p className="mt-0.5 text-sm font-semibold text-slate-800 line-clamp-2">
                      {l.title}
                    </p>
                    <span className="mt-1 inline-block text-[11px] text-slate-400">
                      {l.minutes} min · {l.sectionTitle}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* CTA Certificat / Examen */}
        <div className="rounded-2xl border border-slate-200 bg-surface p-6 text-center space-y-3">
          <Award className="h-8 w-8 text-amber-500 mx-auto" />
          <h4 className="text-sm font-bold text-navy">Prêt pour l&apos;attestation officielle ?</h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            Dès que vous avez parcouru le cours, passez l&apos;évaluation officielle (seuil de réussite : 70%) pour débloquer votre attestation numérique signée.
          </p>
          <div className="pt-2 flex flex-col gap-2">
            <Link
              href={`/evaluation?course=${course.slug}`}
              className="inline-flex h-10 w-full items-center justify-center rounded-xl bg-primary text-xs font-bold text-white shadow-sm hover:bg-primary-dark transition-colors"
            >
              Passer l&apos;évaluation finale
            </Link>
            <Link
              href={`/attestation?course=${course.slug}`}
              className="inline-flex h-10 w-full items-center justify-center rounded-xl border border-slate-300 text-xs font-semibold text-navy hover:bg-white transition-colors"
            >
              Consulter mon attestation
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

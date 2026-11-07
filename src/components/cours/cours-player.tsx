"use client";

import { useState } from "react";
import { useProgress } from "@/context/progress-context";

const TABS = [
  { id: "lecons", label: "Leçons" },
  { id: "exercices", label: "Exercices" },
  { id: "quiz", label: "Quiz" },
  { id: "ressources", label: "Ressources" },
] as const;

type TabId = (typeof TABS)[number]["id"];

const LESSONS = [
  { id: "l1", title: "Introduction et contexte métier", duration: "12 min" },
  { id: "l2", title: "Pratique : cas d’entreprise", duration: "18 min" },
];

const QUIZ_QUESTIONS = [
  { question: "Quel module SAP traite de la comptabilité générale ?", options: ["FI", "MM", "SD", "ABAP"], answer: 0 },
  { question: "Quel module SAP gère les achats et les stocks ?", options: ["FI", "MM", "SD", "ABAP"], answer: 1 },
  { question: "Quel module SAP gère les ventes et la distribution ?", options: ["FI", "MM", "SD", "ABAP"], answer: 2 },
  { question: "Quel module SAP est orienté développement ?", options: ["FI", "MM", "SD", "ABAP"], answer: 3 },
];

const SAMPLE_VIDEO =
  "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4";

interface QuizResult {
  score: number;
  passed: boolean;
}

export default function CoursPlayer({ code }: { code: string }) {
  const [tab, setTab] = useState<TabId>("lecons");
  const { setLessonCompleted, getProgress } = useProgress();
  const courseProgress = getProgress(code);
  const completedLessons = courseProgress?.completedLessons ?? [];
  const percent = courseProgress?.percent ?? 0;

  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const toggleLesson = (id: string) => {
    setLessonCompleted(code, id, !completedLessons.includes(id), LESSONS.length);
  };

  const submitQuiz = async () => {
    const correct = QUIZ_QUESTIONS.filter((question, index) => quizAnswers[index] === question.answer).length;
    const score = Math.round((correct / QUIZ_QUESTIONS.length) * 100);
    setSubmitting(true);
    const res = await fetch("/api/assessments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: 1, courseSlug: code, score }),
    });
    const data = await res.json();
    setQuizResult({ score, passed: !!data.passed });
    setSubmitting(false);
  };

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      <section className="lg:col-span-2">
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-black aspect-video">
          <video
            controls
            playsInline
            preload="metadata"
            className="h-full w-full"
            src={SAMPLE_VIDEO}
          />
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-primary">Leçon guidée</p>
            <h2 className="mt-1 text-xl font-semibold text-navy">Module {code}</h2>
            <div className="mt-3 flex items-center gap-3">
              <div className="h-2 w-40 overflow-hidden rounded-full bg-surface">
                <div className="h-full rounded-full bg-primary" style={{ width: `${percent}%` }} />
              </div>
              <span className="text-sm font-semibold text-navy">{percent} %</span>
            </div>
          </div>
          <button
            type="button"
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-navy transition-colors hover:bg-surface"
          >
            {completedLessons.length ? "Leçon terminée ✓" : "Marquer la leçon comme terminée"}
          </button>
        </div>

        <div className="mt-8 border-b border-slate-200">
          <div className="flex gap-2 overflow-x-auto">
            {TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={`whitespace-nowrap border-b-2 px-4 py-2 text-sm font-semibold transition-colors ${
                  tab === t.id
                    ? "border-primary text-navy"
                    : "border-transparent text-slate-600 hover:text-navy"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6">
          {tab === "lecons" ? (
            <div className="space-y-3 rounded-2xl border border-slate-200 p-6">
              {LESSONS.map((lesson) => (
                <div
                  key={lesson.id}
                  className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 p-4"
                >
                  <div>
                    <p className="text-sm font-semibold text-navy">{lesson.title}</p>
                    <p className="mt-1 text-xs text-slate-600">{lesson.duration}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleLesson(lesson.id)}
                    className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-navy"
                  >
                    {completedLessons.includes(lesson.id) ? "Terminée" : "Terminer"}
                  </button>
                </div>
              ))}
            </div>
          ) : null}

          {tab === "exercices" ? (
            <div className="rounded-2xl border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-navy">Exercice guidé</h3>
              <p className="mt-2 text-sm text-slate-700">
                Exercice pratique sur le système SAP d’entraînement — à corriger en vidéo ou pas à pas.
              </p>
            </div>
          ) : null}

          {tab === "quiz" ? (
            <div className="rounded-2xl border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-navy">Quiz</h3>
              {quizResult ? (
                <p className="mt-3 text-sm font-semibold text-navy">
                  Score : {quizResult.score} % — {quizResult.passed ? "Réussi" : "Échoué"}
                </p>
              ) : null}
              <div className="mt-4 space-y-4">
                {QUIZ_QUESTIONS.map((question, index) => (
                  <div key={question.question}>
                    <p className="text-sm font-semibold text-navy">{index + 1}. {question.question}</p>
                    <div className="mt-2 space-y-2">
                      {question.options.map((option, optionIndex) => (
                        <label key={option} className="flex items-center gap-2 text-sm text-slate-700">
                          <input
                            type="radio"
                            name={`quiz-${index}`}
                            checked={quizAnswers[index] === optionIndex}
                            onChange={() => setQuizAnswers((prev) => ({ ...prev, [index]: optionIndex }))}
                            className="h-4 w-4 accent-[#0879d9]"
                          />
                          {option}
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <button type="button" onClick={submitQuiz} disabled={submitting} className="mt-6 h-12 w-full rounded-lg bg-primary text-sm font-semibold text-white transition-colors hover:bg-primary-dark disabled:opacity-60">
                {submitting ? "Soumission…" : "Soumettre le quiz"}
              </button>
            </div>
          ) : null}

          {tab === "ressources" ? (
            <div className="rounded-2xl border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-navy">Ressources</h3>
              <p className="mt-2 text-sm text-slate-700">
                Fiches de synthèse, glossaire, jeux de données fictifs, aide-mémoire.
              </p>
  
            </div>
          ) : null}
        </div>
      </section>

      <aside className="rounded-2xl border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-navy">Programme</h3>
        <ul className="mt-4 space-y-3">
          {["Découverte", "Pratique", "Évaluation", "Certification"].map((step, index) => (
            <li key={step} className="flex items-center gap-3 text-sm text-slate-700">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-surface text-xs font-bold text-primary">
                {index + 1}
              </span>
              {step}
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
}

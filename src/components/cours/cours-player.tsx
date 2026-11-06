"use client";

import { useState } from "react";

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

const SAMPLE_VIDEO =
  "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4";

export default function CoursPlayer({ code }: { code: string }) {
  const [tab, setTab] = useState<TabId>("lecons");
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);

  const toggleLesson = (id: string) => {
    setCompletedLessons((prev) =>
      prev.includes(id) ? prev.filter((l) => l !== id) : [...prev, id]
    );
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
              <p className="mt-2 text-sm text-slate-700">
                Quiz de section (5 à 10 questions) + examen final (30 à 50 questions).
              </p>
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

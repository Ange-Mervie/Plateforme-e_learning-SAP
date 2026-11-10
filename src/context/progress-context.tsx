"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { COURSES } from "@/data/courses";

export interface CourseProgress {
  courseSlug: string;
  completedLessons: string[];
  lastLessonId: string | null;
  percent: number;
}

interface ProgressContextValue {
  progress: CourseProgress[];
  error: string | null;
  getProgress: (courseSlug: string) => CourseProgress | null;
  completeLesson: (courseSlug: string, lessonId: string, totalLessons: number) => Promise<void>;
  setLessonCompleted: (courseSlug: string, lessonId: string, completed: boolean, totalLessons: number) => Promise<void>;
  resetProgress: (courseSlug: string) => Promise<void>;
}

interface ProgressRow {
  course_slug: string;
  lesson_title: string;
  completed: number;
  updated_at?: string;
}

interface CachedProgress {
  courseSlug: string;
  completedLessons: string[];
}

const ProgressContext = createContext<ProgressContextValue | null>(null);
const STORAGE_KEY = "sap_academy_progress";

function getTotalLessons(courseSlug: string): number {
  const course = COURSES.find((item) => item.slug === courseSlug);
  return course?.sections.reduce((count, section) => count + section.lessons.length, 0) ?? 0;
}

function mapProgress(rows: ProgressRow[]): CourseProgress[] {
  const grouped = new Map<string, ProgressRow[]>();
  for (const row of rows) {
    if (row.completed !== 1) continue;
    const list = grouped.get(row.course_slug) ?? [];
    list.push(row);
    grouped.set(row.course_slug, list);
  }
  return Array.from(grouped, ([courseSlug, courseRows]) => {
    const totalLessons = getTotalLessons(courseSlug);
    const completedLessons = courseRows.map((row) => row.lesson_title);
    const percent = totalLessons > 0
      ? Math.min(100, Math.round((completedLessons.length / totalLessons) * 100))
      : 0;
    return {
      courseSlug,
      completedLessons,
      lastLessonId: courseRows.at(-1)?.lesson_title ?? null,
      percent,
    };
  });
}

async function fetchRows(): Promise<ProgressRow[]> {
  const response = await fetch("/api/progress", { credentials: "same-origin" });
  if (!response.ok) throw new Error("Impossible de charger la progression.");
  const data: unknown = await response.json();
  if (!data || typeof data !== "object" || !("rows" in data) || !Array.isArray(data.rows)) {
    throw new Error("Réponse de progression invalide.");
  }
  return data.rows as ProgressRow[];
}

async function saveLesson(courseSlug: string, lessonId: string, completed: boolean): Promise<void> {
  const response = await fetch("/api/progress", {
    method: "POST",
    credentials: "same-origin",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ courseSlug, lessonTitle: lessonId, completed }),
  });
  if (!response.ok) throw new Error("Impossible d’enregistrer la progression.");
}

function readLegacyProgress(): CachedProgress[] | null {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  const parsed: unknown = JSON.parse(raw);
  if (!Array.isArray(parsed)) throw new Error("Ancienne progression locale invalide.");
  return parsed.map((entry: unknown) => {
    if (
      !entry ||
      typeof entry !== "object" ||
      !("courseSlug" in entry) ||
      typeof entry.courseSlug !== "string" ||
      !("completedLessons" in entry) ||
      !Array.isArray(entry.completedLessons) ||
      !entry.completedLessons.every((lesson) => typeof lesson === "string")
    ) {
      throw new Error("Ancienne progression locale invalide.");
    }
    return { courseSlug: entry.courseSlug, completedLessons: entry.completedLessons };
  });
}

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState<CourseProgress[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const initialize = async () => {
      try {
        let rows = await fetchRows();
        const legacyProgress = readLegacyProgress();
        if (legacyProgress) {
          for (const course of legacyProgress) {
            for (const lessonId of course.completedLessons) {
              await saveLesson(course.courseSlug, lessonId, true);
            }
          }
          localStorage.removeItem(STORAGE_KEY);
          rows = await fetchRows();
        }
        if (active) {
          setProgress(mapProgress(rows));
          setError(null);
        }
      } catch (error) {
        console.error("[Progress] Unable to load or migrate progress:", error);
        if (active) setError("Impossible de charger votre progression depuis le serveur.");
      }
    };
    void initialize();
    return () => {
      active = false;
    };
  }, []);

  const getProgress = useCallback(
    (courseSlug: string) => progress.find((item) => item.courseSlug === courseSlug) ?? null,
    [progress],
  );

  const setLessonCompleted = useCallback(async (
    courseSlug: string,
    lessonId: string,
    completed: boolean,
    totalLessons: number,
  ) => {
    await saveLesson(courseSlug, lessonId, completed);
    setProgress((current) => {
      const existing = current.find((item) => item.courseSlug === courseSlug);
      const previous = existing?.completedLessons ?? [];
      const completedLessons = completed
        ? (previous.includes(lessonId) ? previous : [...previous, lessonId])
        : previous.filter((id) => id !== lessonId);
      const nextEntry: CourseProgress = {
        courseSlug,
        completedLessons,
        lastLessonId: completed ? lessonId : (existing?.lastLessonId ?? null),
        percent: totalLessons > 0
          ? Math.min(100, Math.round((completedLessons.length / totalLessons) * 100))
          : (existing?.percent ?? 0),
      };
      return existing
        ? current.map((item) => item.courseSlug === courseSlug ? nextEntry : item)
        : completed ? [...current, nextEntry] : current;
    });
  }, []);

  const completeLesson = useCallback(async (
    courseSlug: string,
    lessonId: string,
    totalLessons: number,
  ) => setLessonCompleted(courseSlug, lessonId, true, totalLessons), [setLessonCompleted]);

  const resetProgress = useCallback(async (courseSlug: string) => {
    const response = await fetch("/api/progress", {
      method: "DELETE",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ courseSlug }),
    });
    if (!response.ok) throw new Error("Impossible de réinitialiser la progression.");
    setProgress((current) => current.filter((item) => item.courseSlug !== courseSlug));
  }, []);

  const value = useMemo(() => ({
    progress,
    error,
    getProgress,
    completeLesson,
    setLessonCompleted,
    resetProgress,
  }), [progress, error, getProgress, completeLesson, setLessonCompleted, resetProgress]);

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgress() {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error("useProgress must be used within a ProgressProvider");
  }
  return context;
}

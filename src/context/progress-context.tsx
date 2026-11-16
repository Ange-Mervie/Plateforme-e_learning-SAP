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

async function fetchRows(): Promise<ProgressRow[] | null> {
  const response = await fetch("/api/progress", { credentials: "same-origin" });
  if (response.status === 401 || response.status === 403) return null;
  if (!response.ok) throw new Error("Impossible de charger la progression.");
  const data: unknown = await response.json();
  if (!data || typeof data !== "object" || !("rows" in data) || !Array.isArray((data as { rows: unknown }).rows)) {
    throw new Error("Réponse de progression invalide.");
  }
  return (data as { rows: ProgressRow[] }).rows;
}

async function saveLesson(courseSlug: string, lessonId: string, completed: boolean): Promise<boolean> {
  const response = await fetch("/api/progress", {
    method: "POST",
    credentials: "same-origin",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ courseSlug, lessonTitle: lessonId, completed }),
  });
  if (response.status === 401 || response.status === 403) return false;
  if (!response.ok) throw new Error("Impossible d'enregistrer la progression.");
  return true;
}

function readLegacyProgress(): CachedProgress[] | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  const parsed: unknown = JSON.parse(raw);
  if (!Array.isArray(parsed)) throw new Error("Ancienne progression locale invalide.");
  return parsed.map((entry: unknown) => {
    if (
      !entry ||
      typeof entry !== "object" ||
      !("courseSlug" in entry) ||
      typeof (entry as { courseSlug: unknown }).courseSlug !== "string" ||
      !("completedLessons" in entry) ||
      !Array.isArray((entry as { completedLessons: unknown }).completedLessons) ||
      !(entry as { completedLessons: unknown[] }).completedLessons.every((lesson) => typeof lesson === "string")
    ) {
      throw new Error("Ancienne progression locale invalide.");
    }
    const e = entry as { courseSlug: string; completedLessons: string[] };
    return { courseSlug: e.courseSlug, completedLessons: e.completedLessons };
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
        if (rows === null) {
          if (active) {
            setProgress([]);
            setError(null);
          }
          return;
        }
        const legacyProgress = readLegacyProgress();
        if (legacyProgress && legacyProgress.length > 0) {
          let migrated = false;
          for (const course of legacyProgress) {
            for (const lessonId of course.completedLessons) {
              const ok = await saveLesson(course.courseSlug, lessonId, true);
              if (ok) migrated = true;
            }
          }
          if (migrated) {
            localStorage.removeItem(STORAGE_KEY);
            const refreshed = await fetchRows();
            if (refreshed !== null) rows = refreshed;
          }
        }
        if (active) {
          setProgress(mapProgress(rows));
          setError(null);
        }
      } catch (err) {
        console.error("[Progress] Unable to load or migrate progress:", err);
        if (active) setError(null);
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
    const saved = await saveLesson(courseSlug, lessonId, completed);
    if (!saved) return;
    setProgress((current) => {
      const existing = current.find((item) => item.courseSlug === courseSlug);
      const previous = existing?.completedLessons ?? [];
      const completedLessons = completed
        ? (previous.includes(lessonId) ? previous : [...previous, lessonId])
        : previous.filter((id) => id !== lessonId);
      const nextEntry: CourseProgress = {
        courseSlug,
        completedLessons,
        lastLessonId: completed ? lessonId : (existing?.lastLessonId ?? completedLessons.at(-1) ?? null),
        percent: totalLessons > 0
          ? Math.min(100, Math.round((completedLessons.length / totalLessons) * 100))
          : 0,
      };
      return existing
        ? current.map((item) => item.courseSlug === courseSlug ? nextEntry : item)
        : [...current, nextEntry];
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
    if (response.status === 401 || response.status === 403) return;
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

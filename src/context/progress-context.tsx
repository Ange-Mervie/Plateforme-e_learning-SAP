"use client";

import { createContext, useContext, useState, useSyncExternalStore, type ReactNode } from "react";

export interface CourseProgress {
  courseSlug: string;
  completedLessons: string[];
  lastLessonId: string | null;
  percent: number;
}

interface ProgressContextValue {
  progress: CourseProgress[];
  getProgress: (courseSlug: string) => CourseProgress | null;
  completeLesson: (courseSlug: string, lessonId: string, totalLessons: number) => void;
  setLessonCompleted: (courseSlug: string, lessonId: string, completed: boolean, totalLessons: number) => void;
  resetProgress: (courseSlug: string) => void;
}

const ProgressContext = createContext<ProgressContextValue | null>(null);
const STORAGE_KEY = "sap_academy_progress";

function readStored(): CourseProgress[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

let cachedProgress: CourseProgress[] | null = null;

function getProgressSnapshot(): CourseProgress[] {
  if (typeof window === "undefined") return [];
  if (cachedProgress) return cachedProgress;
  cachedProgress = readStored();
  return cachedProgress;
}

function getServerProgressSnapshot(): CourseProgress[] {
  return [];
}

function subscribeProgress() {
  return () => {};
}

export function ProgressProvider({ children }: { children: ReactNode }) {
  const progressList = useSyncExternalStore(subscribeProgress, getProgressSnapshot, getServerProgressSnapshot);
  const [progress, setProgress] = useState<CourseProgress[]>(progressList);

  const persist = (next: CourseProgress[]) => {
    cachedProgress = next;
    if (typeof window !== "undefined") localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const getProgress = (courseSlug: string) => progress.find((item) => item.courseSlug === courseSlug) ?? null;

  const completeLesson = (courseSlug: string, lessonId: string, totalLessons: number) => {
    setProgress((current) => {
      const existing = current.find((item) => item.courseSlug === courseSlug);
      const completedLessons = existing?.completedLessons.includes(lessonId) ? existing.completedLessons : [...(existing?.completedLessons ?? []), lessonId];
      const percent = totalLessons > 0 ? Math.min(100, Math.round((completedLessons.length / totalLessons) * 100)) : (existing?.percent ?? 0);
      const nextEntry: CourseProgress = { courseSlug, completedLessons, lastLessonId: lessonId, percent };
      const next = existing ? current.map((item) => (item.courseSlug === courseSlug ? nextEntry : item)) : [...current, nextEntry];
      persist(next);
      return next;
    });
  };

  const setLessonCompleted = (courseSlug: string, lessonId: string, completed: boolean, totalLessons: number) => {
    setProgress((current) => {
      const existing = current.find((item) => item.courseSlug === courseSlug);
      const base = existing?.completedLessons ?? [];
      const completedLessons = completed ? (base.includes(lessonId) ? base : [...base, lessonId]) : base.filter((id) => id !== lessonId);
      const percent = totalLessons > 0 ? Math.min(100, Math.round((completedLessons.length / totalLessons) * 100)) : (existing?.percent ?? 0);
      const nextEntry: CourseProgress = { courseSlug, completedLessons, lastLessonId: completed ? lessonId : (existing?.lastLessonId ?? null), percent };
      const next = existing ? current.map((item) => (item.courseSlug === courseSlug ? nextEntry : item)) : completed ? [...current, nextEntry] : current;
      persist(next);
      return next;
    });
  };

  const resetProgress = (courseSlug: string) => {
    setProgress((current) => {
      const next = current.filter((item) => item.courseSlug !== courseSlug);
      persist(next);
      return next;
    });
  };

  return (
    <ProgressContext.Provider value={{ progress, getProgress, completeLesson, setLessonCompleted, resetProgress }}>
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const ctx = useContext(ProgressContext);
  if (!ctx) {
    throw new Error("useProgress must be used within a ProgressProvider");
  }
  return ctx;
}

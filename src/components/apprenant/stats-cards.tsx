"use client";

import { BookOpen, CheckCircle2, Award } from "lucide-react";
import { useProgress } from "@/context/progress-context";

export default function StatsCards() {
  const { progress } = useProgress();

  const followed = progress.length;
  const completed = progress.filter((entry) => entry.percent >= 100).length;
  const inProgress = progress.filter((entry) => entry.percent > 0 && entry.percent < 100).length;

  const STATS = [
    { label: "Formations suivies", value: String(followed), icon: BookOpen, hint: `${inProgress} en cours` },
    { label: "Formations terminées", value: String(completed), icon: CheckCircle2, hint: "Modules validés" },
    { label: "Certificats obtenus", value: String(completed), icon: Award, hint: "Délivrés après validation" },
  ];

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {STATS.map((stat) => (
        <div key={stat.label} className="rounded-2xl border border-slate-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-600">{stat.label}</span>
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface text-primary">
              <stat.icon className="h-5 w-5" />
            </span>
          </div>
          <p className="mt-4 text-3xl font-bold tracking-tight text-navy">{stat.value}</p>
          <p className="mt-2 text-xs text-slate-600">{stat.hint}</p>
        </div>
      ))}
    </div>
  );
}

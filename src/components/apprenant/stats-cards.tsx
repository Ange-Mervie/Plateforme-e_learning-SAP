import { BookOpen, CheckCircle2, Clock3, Award } from "lucide-react";

const STATS = [
  { label: "Formations suivies", value: "3", icon: BookOpen, hint: "+1 cette semaine" },
  { label: "Formations terminées", value: "1", icon: CheckCircle2, hint: "FI – Comptabilité générale" },
  { label: "Heures d&apos;apprentissage", value: "18,5 h", icon: Clock3, hint: "Objectif : 24 h ce trimestre" },
  { label: "Certificats obtenus", value: "1", icon: Award, hint: "SAP FI – Gestion financière" },
];

export default function StatsCards() {
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

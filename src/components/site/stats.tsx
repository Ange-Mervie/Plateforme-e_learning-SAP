"use client";

import { useLanguage } from "@/context/language-context";

const STATS = [
  { value: "120+", labelKey: "stats.courses" },
  { value: "45", labelKey: "stats.trainers" },
  { value: "25 000+", labelKey: "stats.learners" },
  { value: "96 %", labelKey: "stats.satisfaction" },
];

export default function Stats() {
  const { t } = useLanguage();
  return (
    <section className="bg-navy">
      <div className="mx-auto max-w-7xl px-6 py-14 lg:px-8">
        <div className="grid grid-cols-2 gap-10 lg:grid-cols-4">
          {STATS.map((stat) => (
            <div key={stat.labelKey} className="text-center">
              <p className="text-4xl font-bold text-white">{stat.value}</p>
              <p className="mt-2 text-sm text-blue-100">{t(stat.labelKey)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

"use client";

const STATS = [
  { value: "120+", label: "Cours SAP disponibles" },
  { value: "45", label: "Formateurs experts" },
  { value: "25 000+", label: "Apprenants actifs" },
  { value: "96 %", label: "Taux de satisfaction" },
];

export default function Stats() {
  return (
    <section className="bg-navy">
      <div className="mx-auto max-w-7xl px-6 py-14 lg:px-8">
        <div className="grid grid-cols-2 gap-10 lg:grid-cols-4">
          {STATS.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-4xl font-bold text-white">{stat.value}</p>
              <p className="mt-2 text-sm text-blue-100">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

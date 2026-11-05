const BARS = [
  { label: "FI", progress: 80 },
  { label: "MM", progress: 45 },
  { label: "SD", progress: 30 },
  { label: "ABAP", progress: 15 },
];

export default function ProgressChart() {
  return (
    <section className="bg-white">
      <h2 className="text-2xl font-bold tracking-tight text-navy">Graphique de progression</h2>
      <div className="mt-8 space-y-5">
        {BARS.map((bar) => (
          <div key={bar.label}>
            <div className="flex items-center justify-between text-sm">
              <span className="font-semibold text-navy">{bar.label}</span>
              <span className="text-slate-600">{bar.progress} %</span>
            </div>
            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-surface">
              <div className="h-full rounded-full bg-primary" style={{ width: `${bar.progress}%` }} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

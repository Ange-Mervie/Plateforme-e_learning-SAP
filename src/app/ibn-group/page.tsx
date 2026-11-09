export default function IBNGroup() {
  return (
    <main className="bg-white">
      <section className="relative overflow-hidden bg-navy">
        <div className="absolute inset-0" style={{ backgroundImage: "url(/courses/hero.svg)" }}></div>
        <div className="absolute inset-0" style={{ backgroundImage: "linear-gradient(to bottom, rgba(16, 43, 78, 0) 0%, rgba(16, 43, 78, 0.45) 55%, rgba(16, 43, 78, 0.75) 100%)" }}></div>
        <div className="relative mx-auto max-w-7xl px-6 py-12 lg:px-8">
          <h1 className="text-4xl font-bold text-white">IBN Group</h1>
          <p className="mt-4 max-w-2xl text-blue-50">Accompagnement et services SAP.</p>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <h2 className="text-2xl font-bold text-navy">Services</h2>
        <p className="mt-4 text-slate-600">Conseil, intégration et formation SAP.</p>
      </section>
    </main>
  );
}
